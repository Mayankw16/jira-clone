import { z } from "zod";

export const createWorkspaceSchema = z.object({
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
});

export const updateWorkspaceSchema = z.object({
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
