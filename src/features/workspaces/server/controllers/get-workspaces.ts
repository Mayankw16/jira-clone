import { createFactory } from "hono/factory";
import { Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

const factory = createFactory();

export const getWorkspaces = factory.createHandlers(
  sessionMiddleware,
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      queries: [Query.equal("userId", user.$id)],
    });

    if (members.total === 0) return c.json({ data: { rows: [], total: 0 } });

    const workspaceIds = members.rows.map((member) => member.workspaceId);

    const workspaces = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      queries: [Query.contains("$id", workspaceIds)],
    });

    return c.json({ data: workspaces });
  },
);
