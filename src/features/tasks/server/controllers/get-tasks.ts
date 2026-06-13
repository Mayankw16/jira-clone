import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { Query } from "node-appwrite";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { Project } from "@/features/projects/types";
import { Member } from "@/features/members/types";

import { PopulatedTask, Task, TaskStatus } from "../../types";

const factory = createFactory();

export const getTasks = factory.createHandlers(
  sessionMiddleware,
  zValidator(
    "query",
    z.object({
      workspaceId: z.string(),
      projectId: z.string().nullish(),
      assigneeId: z.string().nullish(),
      status: z.enum(TaskStatus).nullish(),
      search: z.string().nullish(),
      dueDate: z.string().nullish(),
    }),
  ),
  async (c) => {
    const { users } = await createAdminClient();

    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId, projectId, status, search, assigneeId, dueDate } =
      c.req.valid("query");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    const queries = [
      Query.equal("workspaceId", workspaceId),
      Query.orderDesc("$createdAt"),
    ];

    if (projectId) queries.push(Query.equal("projectId", projectId));
    if (status) queries.push(Query.equal("status", status));
    if (assigneeId) queries.push(Query.equal("assigneeId", assigneeId));
    if (dueDate) queries.push(Query.equal("dueDate", dueDate));
    if (search) queries.push(Query.search("name", search));

    const tasks = await databases.listRows<Task>({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries,
    });

    const projectIds = [...new Set(tasks.rows.map((task) => task.projectId))];
    const assigneeIds = [...new Set(tasks.rows.map((task) => task.assigneeId))];

    const projects = projectIds.length
      ? await databases.listRows<Project>({
          databaseId: DATABASE_ID,
          tableId: PROJECTS_ID,
          queries:
            projectIds.length > 0 ? [Query.equal("$id", projectIds)] : [],
        })
      : { rows: [], total: 0 };

    const members = assigneeIds.length
      ? await databases.listRows<Member>({
          databaseId: DATABASE_ID,
          tableId: MEMBERS_ID,
          queries:
            assigneeIds.length > 0 ? [Query.equal("$id", assigneeIds)] : [],
        })
      : { rows: [], total: 0 };

    const assignees = await Promise.all(
      members.rows.map(async (member) => {
        const user = await users.get({ userId: member.userId });

        return {
          ...member,
          name: user.name || user.email,
          email: user.email,
        };
      }),
    );

    const projectMap = new Map(
      projects.rows.map((project) => [project.$id, project]),
    );

    const assigneeMap = new Map(
      assignees.map((assignee) => [assignee.$id, assignee]),
    );

    const populatedTasks: PopulatedTask[] = tasks.rows.map((task) => ({
      ...task,
      project: projectMap.get(task.projectId)!,
      assignee: assigneeMap.get(task.assigneeId)!,
    }));

    return c.json({
      data: { rows: populatedTasks, total: populatedTasks.length },
    });
  },
);
