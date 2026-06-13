import { Query } from "node-appwrite";
import { createFactory } from "hono/factory";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { sessionMiddleware } from "@/lib/session-middleware";
import { TaskStatus } from "@/features/tasks/types";
import { getMember } from "@/features/members/utils";
import { DATABASE_ID, PROJECTS_ID, TASKS_ID } from "@/config";

import { Project } from "../../types";

const factory = createFactory();

export const getAnalytics = factory.createHandlers(
  sessionMiddleware,
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const projectId = c.req.param("projectId")!;

    const project = await databases.getRow<Project>({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: projectId,
    });

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    });

    const lastMonthTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    });

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    });

    const lastMonthAssignedTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    });

    const assignedTaskCount = thisMonthAssignedTasks.total;
    const assignedTaskDifference =
      assignedTaskCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    });

    const lastMonthIncompleteTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    });

    const incompleteTaskCount = thisMonthIncompleteTasks.total;
    const incompleteTaskDifference =
      incompleteTaskCount - lastMonthIncompleteTasks.total;

    const thisMonthCompletedTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    });

    const lastMonthCompletedTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    });

    const completedTaskCount = thisMonthCompletedTasks.total;
    const completedTaskDifference =
      completedTaskCount - lastMonthCompletedTasks.total;

    const thisMonthOverdueTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ],
    });

    const lastMonthOverdueTasks = await databases.listRows({
      databaseId: DATABASE_ID,
      tableId: TASKS_ID,
      queries: [
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ],
    });

    const overdueTaskCount = thisMonthOverdueTasks.total;
    const overdueTaskDifference =
      overdueTaskCount - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        taskCount,
        taskDifference,
        assignedTaskCount,
        assignedTaskDifference,
        incompleteTaskCount,
        incompleteTaskDifference,
        completedTaskCount,
        completedTaskDifference,
        overdueTaskCount,
        overdueTaskDifference,
      },
    });
  },
);
