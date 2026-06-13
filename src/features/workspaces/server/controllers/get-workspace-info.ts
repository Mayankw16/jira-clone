import { createFactory } from "hono/factory";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";

const factory = createFactory();

export const getWorkspaceInfo = factory.createHandlers(
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");

    const workspaceId = c.req.param("workspaceId")!;

    const workspace = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
    });

    return c.json({ data: { $id: workspace.$id, name: workspace.name } });
  },
);
