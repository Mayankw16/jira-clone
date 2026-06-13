import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { BUCKET_ID, DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";

import { createWorkspaceSchema } from "../../schemas";

const factory = createFactory();

export const createWorkspace = factory.createHandlers(
  zValidator("form", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, image } = c.req.valid("form");

    let uploadedImageURL: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile({
        bucketId: BUCKET_ID,
        fileId: ID.unique(),
        file: image,
      });

      // const arrayBuffer = await storage.getFilePreview({
      //   bucketId: BUCKET_ID,
      //   fileId: file.$id,
      // });

      const arrayBuffer = await storage.getFileView({
        bucketId: BUCKET_ID,
        fileId: file.$id,
      });

      uploadedImageURL = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }

    const workspace = await databases.createRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: ID.unique(),
      data: {
        name,
        userId: user.$id,
        imageURL: uploadedImageURL,
        inviteCode: generateInviteCode(10),
      },
    });

    await databases.createRow({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_ID,
      rowId: ID.unique(),
      data: {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      },
    });

    return c.json({ data: workspace });
  },
);
