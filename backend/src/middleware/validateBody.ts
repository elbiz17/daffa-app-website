import fs from "fs";
import path from "path";
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { error } from "../utils/responseHelper";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // 🧹 Jika ada file yang sudah diupload tapi validasi gagal → hapus
      if (req.file) {
        const filePath = path.join(process.cwd(), "uploads", "images", req.file.filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error("❌ Gagal hapus file:", err);
        });
      }

      return res.status(400).json(error(result.error.flatten().fieldErrors));
    }

    req.body = result.data;
    next();
  };
};
