import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, TASKS_ID } from "@/config";

import { bulkUpdateSchema } from "../../schemas";
import { Query } from "node-appwrite";

const factory = createFactory();

export const bulkUpdateTask = factory.createHandlers(
  sessionMiddleware,
  zValidator("json", bulkUpdateSchema),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { tasks } = c.req.valid("json");

    const taskIds = tasks.map((task) => task.$id);

    if (new Set(taskIds).size !== taskIds.length) {
      return c.json({ error: "Duplicate task IDs provided!" }, 400);
    }

    const tasksToUpdate = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [Query.equal("$id", taskIds)],
    });

    if (tasksToUpdate.rows.length !== tasks.length) {
      return c.json({ error: "One or more tasks were not found!" }, 404);
    }

    const workspaceIds = new Set(
      tasksToUpdate.rows.map((task) => task.workspaceId),
    );

    if (workspaceIds.size !== 1)
      return c.json(
        { error: "All tasks must belong to the same workspace!" },
        400,
      );

    // const workspaceId = workspaceIds.values().next().value;
    const workspaceId = tasksToUpdate.rows[0].workspaceId;

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        const { $id, status, position } = task;
        return databases.updateRow({
          databaseId: DATABASE_ID,
          tableId: TASKS_ID,
          rowId: $id,
          data: {
            status,
            position,
          },
        });
      }),
    );

    return c.json({ data: updatedTasks });
  },
);
