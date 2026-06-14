import { z } from "zod";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";

import { Project } from "../../types";

const factory = createFactory();

export const getProject = factory.createHandlers(
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
