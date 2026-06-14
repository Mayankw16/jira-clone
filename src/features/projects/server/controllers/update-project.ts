import { z } from "zod";
import { createFactory } from "hono/factory";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { BUCKET_ID, DATABASE_ID, PROJECTS_ID } from "@/config";

import { updateProjectSchema } from "../../schemas";
import { getMember } from "@/features/members/utils";

const factory = createFactory();

export const updateProject = factory.createHandlers(
  zValidator("form", updateProjectSchema),
  sessionMiddleware,
  zValidator(
    "param",
    z.object({
      projectId: z.string(),
    }),
  ),
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { projectId } = c.req.valid("param");
    const { name, image } = c.req.valid("form");

    const projectToUpdate = await databases.getRow({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: projectId,
    });

    const member = await getMember({
      databases,
      workspaceId: projectToUpdate.workspaceId,
      userId: user.$id,
    });

    if (!member) return c.json({ error: "Unathorized" }, 401);

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

    const project = await databases.updateRow({
      databaseId: DATABASE_ID,
      tableId: PROJECTS_ID,
      rowId: projectId,
      data: {
        name,
        imageURL: uploadedImageURL,
      },
    });

    return c.json({ data: project });
  },
);
