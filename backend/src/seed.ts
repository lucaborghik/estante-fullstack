import { auth } from "./auth.js";
import { database, mongoClient } from "./db.js";
import { env } from "./env.js";

async function seedAccount(email: string | undefined, password: string | undefined, role: "user" | "admin") {
  if (!email || !password) {
    throw new Error(`Faltan las variables de entorno para crear el usuario ${role}`);
  }

  const existing = await database.collection("user").findOne({ email });
  if (!existing) {
    const result = await auth.api.signUpEmail({
      body: { email, password, name: role === "admin" ? "Administrador" : "Usuario de prueba" }
    });
    if (!result.user) {
      throw new Error(`Better Auth no pudo crear la cuenta ${email}`);
    }
  }

  await database.collection("user").updateOne({ email }, { $set: { role } });
  console.log(`Cuenta ${role} lista: ${email}`);
}

try {
  await mongoClient.connect();
  await seedAccount(env.SEED_ADMIN_EMAIL, env.SEED_ADMIN_PASSWORD, "admin");
  await seedAccount(env.SEED_USER_EMAIL, env.SEED_USER_PASSWORD, "user");
} finally {
  await mongoClient.close();
}
