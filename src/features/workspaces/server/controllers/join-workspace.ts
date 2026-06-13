import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

const factory = createFactory();

export const joinWorkspace = factory.createHandlers(
  zValidator("json", z.object({ inviteCode: z.string() })),
  sessionMiddleware,
  async (c) => {
    const workspaceId = c.req.param("workspaceId")!;
    const { inviteCode } = c.req.valid("json");

    const databases = c.get("databases");
    const user = c.get("user");

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (member)
      return c.json(
        { error: "You are already a member of this workspace." },
        400,
      );

    const workspace = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    if (workspace.inviteCode !== inviteCode)
      return c.json({ error: "Invalid invite code!" }, 400);

    await databases.createRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: ID.unique(),
      data: {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      },
    });

    return c.json({ data: workspace });
  },
);
