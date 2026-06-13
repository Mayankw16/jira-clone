import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember, getMemberById } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { createTaskSchema } from "../../schemas";

const factory = createFactory();

export const createTask = factory.createHandlers(
  sessionMiddleware,
  zValidator("json", createTaskSchema),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { name, status, workspaceId, projectId, dueDate, assigneeId } =
      c.req.valid("json");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    const project = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: projectId,
    });

    if (project.workspaceId !== workspaceId) {
      return c.json({ error: "Invalid project!" }, 400);
    }

    const assignee = await getMemberById({
      databases,
      memberId: assigneeId,
    });

    if (assignee.workspaceId !== workspaceId) {
      return c.json({ error: "Invalid assignee!" }, 400);
    }

    const lowestPositionTask = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("status", status),
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("position"),
        Query.limit(1),
      ],
    });

    const newPosition =
      lowestPositionTask.rows.length > 0
        ? lowestPositionTask.rows[0].position + 1000
        : 1000;

    const task = await databases.createRow({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: ID.unique(),
      data: {
        name,
        status,
        workspaceId,
        projectId,
        dueDate,
        assigneeId,
        position: newPosition,
      },
    });

    return c.json({ data: task });
  },
);
