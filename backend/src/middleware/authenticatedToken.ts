import type { NextFunction, Request, Response } from "express";
import { error } from "../utils/responseHelper";
import { verifyToken } from "../utils/jwt";
import prisma from "../prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "ADMIN" | "USER";
  };
}

export const authenticatedToken = (roles: ("ADMIN" | "USER")[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json(error("Unauthorized. No token provided"));
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        res
          .status(401)
          .json(error("Unauthorized: No token found after Bearer"));
        return;
      }

      // 1️⃣ Cek session valid
      const session = await prisma.session.findUnique({ where: { token } });
      if (!session) return res.status(401).json({ message: "Invalid session. Please sign in." });

      // 2️⃣ Cek expired
      if (new Date() > session.expiresAt) {
        await prisma.session.delete({ where: { token } });
        return res.status(401).json({ message: "Token expired" });
      }
      const decoded = verifyToken(token);
      req.user = decoded.user as any;
      if (!req.user?.role || !roles.includes(req?.user?.role as any)) {
        return res.status(403).json(error(`Forbidden. This route is for roles: ${roles.join(", ")}, but you are ${req.user?.role}`));
      }
      next();
    } catch (error) {
      res.status(403).json({ message: "Forbidden: invalid token" });
    }
  };
};
