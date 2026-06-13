import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { BUCKET_ID, DATABASE_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { updateWorkspaceSchema } from "../../schemas";
import { getMember } from "@/features/members/utils";

const factory = createFactory();

export const updateWorkspace = factory.createHandlers(
  zValidator("form", updateWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const workspaceId = c.req.param("workspaceId")!;
    const { name, image } = c.req.valid("form");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN)
      return c.json({ error: "Unauthorized!" }, 401);

    let uploadedImageURL: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile({
        bucketId: BUCKET_ID,
        fileId: ID.unique(),
        file: image,
      });

      const arrayBuffer = await storage.getFileView({
        bucketId: BUCKET_ID,
        fileId: file.$id,
      });

      uploadedImageURL = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    } else uploadedImageURL = image;

    const workspace = await databases.updateRow({
      databaseId: DATABASE_ID,
      tableId: WORKSPACES_ID,
      rowId: workspaceId,
      data: {
        name,
        userId: user.$id,
        imageURL: uploadedImageURL,
        inviteCode: generateInviteCode(10),
      },
    });

    return c.json({ data: workspace });
  },
);
