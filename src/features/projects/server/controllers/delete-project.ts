import { z } from "zod";
import { createFactory } from "hono/factory";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";

const factory = createFactory();

export const deleteProject = factory.createHandlers(
  sessionMiddleware,
  zValidator(
    "param",
    z.object({
      projectId: z.string(),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.valid("param");

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

    const tasksToDelete = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [Query.equal("projectId", projectId)],
    });

    if (tasksToDelete.rows.length)
      await Promise.all(
        tasksToDelete.rows.map((task) =>
          databases.deleteRow({
            databaseId: DATABASE_ID,
            tableId: TASKS_ID,
            rowId: task.$id,
          }),
        ),
      );

    await databases.deleteRow({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: projectId,
    });

    return c.json({ data: { $id: projectToDelete.$id } });
  },
);
