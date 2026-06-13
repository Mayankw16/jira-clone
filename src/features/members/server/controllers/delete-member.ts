import { createFactory } from "hono/factory";
import { Query } from "node-appwrite";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, MEMBERS_ID } from "@/config";

import { getMember } from "../../utils";
import { MemberRole } from "../../types";
import { zValidator } from "@hono/zod-validator";

const factory = createFactory();

export const deleteMember = factory.createHandlers(
  sessionMiddleware,
  zValidator(
    "json",
    z.object({ memberId: z.string(), workspaceId: z.string() }),
  ),
  async (c) => {
    const { memberId, workspaceId } = c.req.valid("json");

    const user = c.get("user");
    const databases = c.get("databases");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    const memberToDelete = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: memberId,
    });

    if (!memberToDelete) return c.json({ error: "Member doesn't exist!" }, 404);

    if (memberToDelete.workspaceId !== workspaceId) {
      return c.json({ error: "Invalid workspaceId!" }, 400);
    }

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized!" }, 401);

    const allMembersInWorkspace = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      queries: [Query.equal("workspaceId", memberToDelete.workspaceId)],
    });

    const adminCount = allMembersInWorkspace.rows.filter(
      (member) => member.role === MemberRole.ADMIN,
    ).length;

    if (memberToDelete.role === MemberRole.ADMIN && adminCount === 1) {
      return c.json({ error: "The last admin cannot be removed." }, 400);
    }

    await databases.deleteRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: memberId,
    });

    return c.json({ data: { $id: memberToDelete.$id } });
  },
);
