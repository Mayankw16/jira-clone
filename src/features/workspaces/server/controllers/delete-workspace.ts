import { z } from "zod";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { MemberRole } from "@/features/members/types";

const factory = createFactory();

export const deleteWorkspace = factory.createHandlers(
  sessionMiddleware,
  zValidator(
    "param",
    z.object({
      workspaceId: z.string(),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.valid("param");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized!" }, 401);

    await databases.deleteRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    return c.json({ data: { $id: workspaceId } });
  },
);
