import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { error, unauthorized } from "./responseHelper";

// Middleware error handler
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERROR]", err);

  if (err instanceof ZodError) {
    return res.status(400).json(error(err.flatten().fieldErrors));
  }

  if (err instanceof Error && err.message.includes("token")) {
    return res.status(401).json(unauthorized(err.message));
  }

  if (err instanceof Error && err.message.includes("credentials")) {
    return res.status(401).json(unauthorized(err.message));
  }

  if (err instanceof Error) {
    return res.status(500).json(error(err.message));
  }

  return res.status(500).json(error("Unexpected error occurred"));
}

