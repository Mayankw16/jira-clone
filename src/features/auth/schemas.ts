import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required!"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required!"),
  email: z.email(),
  password: z.string().min(8, "Minimum 8 characters required!"),
});
