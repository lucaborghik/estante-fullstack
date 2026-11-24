import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import { connectDatabase } from "./db.js";
import { env } from "./env.js";
import { authMiddleware } from "./middleware/auth.js";
import { booksRouter } from "./routes/books.js";

const app = express();

app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true
  })
);
app.all("/api/auth/*", toNodeHandler(auth));
app.use(express.json());
app.use("/api/books", booksRouter);
app.get("/api/me", authMiddleware, (req, res) => res.json(req.currentUser));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Error interno del servidor" });
});

await connectDatabase();
app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`API lista en el puerto ${env.PORT}`);
});
