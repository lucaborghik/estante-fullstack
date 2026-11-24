import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI es obligatorio"),
  MONGODB_DATABASE: z.string().min(1).default("libros_app"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET debe tener al menos 32 caracteres"),
  BETTER_AUTH_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().optional().default(""),
  GITHUB_CLIENT_SECRET: z.string().optional().default(""),
  SEED_ADMIN_EMAIL: z.preprocess((value) => value === "" ? undefined : value, z.string().email().optional()),
  SEED_ADMIN_PASSWORD: z.preprocess((value) => value === "" ? undefined : value, z.string().min(8).optional()),
  SEED_USER_EMAIL: z.preprocess((value) => value === "" ? undefined : value, z.string().email().optional()),
  SEED_USER_PASSWORD: z.preprocess((value) => value === "" ? undefined : value, z.string().min(8).optional())
});

export const env = schema.parse(process.env);
