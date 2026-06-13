import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required!"),
  image: z
    .union([
      z.instanceof(File),
      z
        .string()
        .transform((value) =>
          value === "" || value === "undefined" ? undefined : value,
        ),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const createProjectFormSchema = createProjectSchema.omit({
  workspaceId: true,
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Please enter a valid name!").optional(),
  image: z
    .union([
      z.instanceof(File),
      z
        .string()
        .transform((value) =>
          value === "" || value === "undefined" ? undefined : value,
        ),
    ])
    .optional(),
});
