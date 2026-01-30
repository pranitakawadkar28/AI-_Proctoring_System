import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("invalid email address"),
    username: z.string().min(3, "username must be at least 3 characters"),
    password: z.string().min(5, "Password must be at least 5 characters")
})