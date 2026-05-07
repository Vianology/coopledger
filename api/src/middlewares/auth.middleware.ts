import { fromNodeHeaders } from "better-auth/node";
import { UserRole } from "db/enums";
import type { NextFunction, Request, Response } from "express";
import { auth } from "utils/auth";
import { prisma } from "utils/prisma";

declare global {
  namespace Express {
    interface Request {
      session: typeof auth.$Infer.Session;
    }
  }
}

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    req.session = session;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function isPlatformAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { user } = req.session;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = await prisma.users.findUnique({
    where: {
      id: user.id,
      role: UserRole.ADMIN,
    },
  });

  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}
