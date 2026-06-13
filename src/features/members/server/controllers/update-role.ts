import { createFactory } from "hono/factory";
import { Query } from "node-appwrite";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, MEMBERS_ID } from "@/config";

import { getMember } from "../../utils";
import { MemberRole } from "../../types";
import { zValidator } from "@hono/zod-validator";

const factory = createFactory();

export const updateRole = factory.createHandlers(
  sessionMiddleware,
  zValidator(
    "json",
    z.object({
      memberId: z.string(),
      workspaceId: z.string(),
      role: z.enum(MemberRole),
    }),
  ),
  async (c) => {
    const { memberId, workspaceId, role } = c.req.valid("json");

    const user = c.get("user");
    const databases = c.get("databases");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized!" }, 401);

    const memberToUpdate = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: memberId,
    });

    if (!memberToUpdate || memberToUpdate.workspaceId !== workspaceId)
      return c.json({ error: "Invalid workspace or member identifier!" }, 400);

    if (memberToUpdate.role === role)
      return c.json({ error: "The member already has this role!" }, 400);

    const allMembersInWorkspace = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      queries: [Query.equal("workspaceId", workspaceId)],
    });

    const adminCount = allMembersInWorkspace.rows.filter(
      (member) => member.role === MemberRole.ADMIN,
    ).length;

    if (
      adminCount === 1 &&
      memberToUpdate.$id === member.$id &&
      role !== MemberRole.ADMIN
    )
      return c.json(
        { error: "The only admin's role cannot be downgraded!" },
        400,
      );

    await databases.updateRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: memberId,
      data: { role },
    });

    return c.json({ data: { $id: memberToUpdate.$id } });
  },
);
