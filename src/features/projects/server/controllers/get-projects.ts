import { createFactory } from "hono/factory";
import { Query } from "node-appwrite";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { zValidator } from "@hono/zod-validator";
import { getMember } from "@/features/members/utils";
import { Project } from "../../types";

const factory = createFactory();

export const getProjects = factory.createHandlers(
  sessionMiddleware,
  zValidator("query", z.object({ workspaceId: z.string() })),
  async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.valid("query");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unauthorized!" }, 401);

    const projects = await databases.listRows<Project>({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      queries: [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ],
    });

    return c.json({ data: projects });
  },
);
