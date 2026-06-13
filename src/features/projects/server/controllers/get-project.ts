import { createFactory } from "hono/factory";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";

import { Project } from "../../types";

const factory = createFactory();

export const getProject = factory.createHandlers(
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

    return c.json({ data: project });
  },
);
