import { createFactory } from "hono/factory";
import { Query } from "node-appwrite";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { zValidator } from "@hono/zod-validator";
import { createAdminClient } from "@/lib/appwrite";

import { getMember } from "../../utils";
import { Member } from "../../types";

const factory = createFactory();

export const getMembers = factory.createHandlers(
  sessionMiddleware,
  zValidator("query", z.object({ workspaceId: z.string() })),
  async (c) => {
    const { users } = await createAdminClient();

    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.valid("query");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    await new Promise((res) => setTimeout(() => res("success"), 3000));

    const members = await databases.listRows<Member>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      queries: [Query.equal("workspaceId", workspaceId)],
    });

    const populatedMembers = await Promise.all(
      members.rows.map(async (member) => {
        const user = await users.get(member.userId);

        return {
          ...member,
          name: user.name,
          email: user.email,
          role: member.role,
        };
      }),
    );

    return c.json({
      data: { rows: populatedMembers, total: populatedMembers.length },
    });
  },
);
