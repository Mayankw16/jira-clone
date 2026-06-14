import { z } from "zod";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { generateInviteCode } from "@/lib/utils";

const factory = createFactory();

export const resetInviteCode = factory.createHandlers(
  sessionMiddleware,
  zValidator(
    "param",
    z.object({
      workspaceId: z.string(),
    }),
  ),
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.valid("param");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized!" }, 401);

    const workspace = await databases.updateRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
      data: {
        inviteCode: generateInviteCode(10),
      },
    });

    return c.json({ data: workspace });
  },
);
