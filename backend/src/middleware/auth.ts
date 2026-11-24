import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth.js";

export type AppRole = "user" | "admin";

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        email: string;
        name: string;
        role: AppRole;
      };
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) {
      res.status(401).json({ error: "Se requiere iniciar sesión" });
      return;
    }

    req.currentUser = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role === "admin" ? "admin" : "user"
    };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(role: AppRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.currentUser?.role !== role) {
      res.status(403).json({ error: "No tenés permisos para realizar esta acción" });
      return;
    }
    next();
  };
}
