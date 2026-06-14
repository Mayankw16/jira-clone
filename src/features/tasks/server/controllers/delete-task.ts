import { z } from "zod";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";

const factory = createFactory();

export const deleteTask = factory.createHandlers(
  sessionMiddleware,
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

    const taskToDelete = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: taskId,
    });

    const member = await getMember({
      databases,
      workspaceId: taskToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    await databases.deleteRow({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: taskId,
    });

    return c.json({ data: { $id: taskId } });
  },
);
