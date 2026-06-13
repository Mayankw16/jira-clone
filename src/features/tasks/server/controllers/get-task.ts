import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember, getMemberById } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/types";

import { PopulatedTask, Task } from "../../types";

const factory = createFactory();

export const getTask = factory.createHandlers(
  sessionMiddleware,
  zValidator(
    "param",
    z.object({
      taskId: z.string(),
    }),
  ),
  async (c) => {
    const { users } = await createAdminClient();
    const user = c.get("user");
    const databases = c.get("databases");

    const { taskId } = c.req.valid("param");

    const task = await databases.getRow<Task>({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      rowId: taskId,
    });

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    const project = await databases.getRow<Project>({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: task.projectId,
    });

    const assigneeMember = await getMemberById({
      databases,
      memberId: task.assigneeId,
    });

    const assigneeUser = await users.get({ userId: assigneeMember.userId });

    const assignee = {
      ...member,
      name: assigneeUser.name || assigneeUser.email,
      email: assigneeUser.email,
    };

    const populatedTask: PopulatedTask = { ...task, project, assignee };

    return c.json({ data: populatedTask });
  },
);
