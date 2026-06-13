import { createFactory } from "hono/factory";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";

const factory = createFactory();

export const deleteProject = factory.createHandlers(
  sessionMiddleware,
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const projectId = c.req.param("projectId")!;

    const projectToDelete = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: projectId,
    });

    const member = await getMember({
      databases,
      workspaceId: projectToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    //TODO: Delete tasks

    await databases.deleteRow({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: projectId,
    });

    return c.json({ data: { $id: projectToDelete.$id } });
  },
);
