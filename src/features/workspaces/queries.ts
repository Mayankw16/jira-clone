import { Query } from "node-appwrite";

import { createSessionClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

export const getWorkspaces = async () => {
  const { databases, account } = await createSessionClient();

  const user = await account.get();

  const members = await databases.listRows({
    databaseId: DATABASE_ID,
    tableId: MEMBERS_ID,
    queries: [Query.equal("userId", user.$id)],
  });

  if (members.total === 0) return { rows: [], total: 0 };

  const workspaceIds = members.rows.map((member) => member.workspaceId);

  const workspaces = await databases.listRows({
    databaseId: DATABASE_ID,
    tableId: WORKSPACES_ID,
    queries: [
      Query.orderDesc("$createdAt"),
      Query.contains("$id", workspaceIds),
    ],
  });

  return workspaces;
};
