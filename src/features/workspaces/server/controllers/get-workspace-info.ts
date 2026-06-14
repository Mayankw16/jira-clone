import { z } from "zod";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";

const factory = createFactory();

export const getWorkspaceInfo = factory.createHandlers(
  sessionMiddleware,
  zValidator(
    "param",
    z.object({
      workspaceId: z.string(),
    }),
  ),
  async (c) => {
    const databases = c.get("databases");

    const { workspaceId } = c.req.valid("param");

    const workspace = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    return c.json({ data: { $id: workspace.$id, name: workspace.name } });
  },
);
