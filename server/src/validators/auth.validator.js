import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  username: z.string().trim().min(3).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().trim().min(8, "Password must be at least 8 characters")
});


export const loginSchema = z.object({
    email: z.string().email("invalid email address"),
    password: z.string().min(1, "Password required")
})