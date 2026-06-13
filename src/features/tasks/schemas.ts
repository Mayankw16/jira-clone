import { z } from "zod";

import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  status: z.enum(TaskStatus, { error: "Status is required!" }),
  workspaceId: z.string().trim().min(1, "Workpsace Id is required!"),
  projectId: z
    .string({ error: "Project is required!" })
    .trim()
    .min(1, "Project Id is required!"),
  dueDate: z.coerce.date({ error: "Due date is required!" }),
  assigneeId: z
    .string({ error: "Assignee is required!" })
    .trim()
    .min(1, "Assignee Id is required!"),
  description: z.string().optional(),
});

export const upsertTaskFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  status: z.enum(TaskStatus, { error: "Status is required!" }),
  projectId: z
    .string({ error: "Project is required!" })
    .trim()
    .min(1, "Project Id is required!"),
  dueDate: z.date({ error: "Due date is required!" }),
  assigneeId: z
    .string({ error: "Assignee is required!" })
    .trim()
    .min(1, "Assignee Id is required!"),
});

export const updateTaskSchema = z
  .object({
    name: z.string().min(1).optional(),
    status: z.enum(TaskStatus).optional(),
    projectId: z.string().trim().min(1).optional(),
    dueDate: z.coerce.date().optional(),
    assigneeId: z.string().trim().min(1).optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  );

export const bulkUpdateSchema = z.object({
  tasks: z
    .array(
      z.object({
        $id: z.string(),
        status: z.enum(TaskStatus),
        position: z.number().int().positive().min(1000).max(1000000),
      }),
    )
    .min(1),
});
