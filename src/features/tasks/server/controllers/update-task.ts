import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember, getMemberById } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { updateTaskSchema } from "../../schemas";

const factory = createFactory();

export const updateTask = factory.createHandlers(
  sessionMiddleware,
  zValidator("json", updateTaskSchema),
  zValidator(
    "param",
    z.object({
      taskId: z.string(),
    }),
  ),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { taskId } = c.req.valid("param");

    const dataToUpdate = c.req.valid("json");

    const taskToUpdate = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: taskId,
    });

    const member = await getMember({
      databases,
      workspaceId: taskToUpdate.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    if (dataToUpdate.projectId) {
      const project = await databases.getRow({
        databaseId: DATABASE_ID,
        tableId: PROJECTS_ID,
        rowId: dataToUpdate.projectId,
      });

      if (project.workspaceId !== taskToUpdate.workspaceId) {
        return c.json({ error: "Invalid project!" }, 400);
      }
    }

    if (dataToUpdate.assigneeId) {
      const assignee = await getMemberById({
        databases,
        memberId: dataToUpdate.assigneeId,
      });

      if (assignee.workspaceId !== taskToUpdate.workspaceId) {
        return c.json({ error: "Invalid assignee!" }, 400);
      }
    }

    const task = await databases.updateRow({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: taskId,
      data: dataToUpdate,
    });

    return c.json({ data: task });
  },
);
