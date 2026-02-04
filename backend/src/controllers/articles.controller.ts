import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authenticatedToken";
import ArticleServices from "../services/articles.service";
import { error, success } from "../utils/responseHelper";
import {
  createArticleSchema,
  updateArticleSchema,
} from "../lib/validation-schema";
import prisma from "../prisma/client";
import slugify from "slugify";

const ArticleController = {
  getAllArticles: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const article = await ArticleServices.getAllArticles();
      return res
        .status(200)
        .json(success("Articles retrieved successfully", article));
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error.";
      return res.status(statusCode).json(error(message));
    }
  },
  getArticleById: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const existing = await prisma.article.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json(error("Article not found"));
      }
      const article = await ArticleServices.getArticleById(id);
      return res
        .status(200)
        .json(success("Article retrieved successfully", article));
    } catch (err: any) {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error.";
      return res.status(statusCode).json(error(message));
    }
  },
  createArticle: async (req: AuthenticatedRequest, res: Response) => {
    try {

      const existing = await prisma.article.findUnique(
        { where: 
          { 
            slug: req.body.slug || slugify(req.body.title, { lower: true })
          } 
      });
      if (existing) {
        return res.status(400).json(error("Article with this title already exists"));
      }

      const bodyData = {
        ...req.body,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        excerpt: req.body.excerpt ? req.body.excerpt.toString().replaceAll(/"/g, "").trim() : undefined,
        type: req.body.type ? req.body.type.toLowerCase().replaceAll(/"/g, "").trim() : undefined,
        status: req.body.status ? req.body.status.toLowerCase().replaceAll(/"/g, "").trim() : undefined,
      }

      console.log("bodyData:", bodyData);
      
      const parsed = createArticleSchema.parse(bodyData);

      const fileUrl = req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : parsed.heroImage || null;

      const newArticle = await ArticleServices.createArticle({
        ...parsed,
        heroImage:fileUrl,
        authorId: req.user?.id,
      });
      return res
        .status(200)
        .json(success("Article created successfully", newArticle));
    } catch (err: any) {
      console.error(err);
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error.";
      return res.status(statusCode).json(error(message));
    }
  },
  updateArticle: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const parsed = updateArticleSchema.parse(req.body);
      const updatedArticle = await ArticleServices.updateArticle(id, parsed);
      return res
        .status(200)
        .json(success("Article updated successfully", updatedArticle));
    } catch (err: any) {
      console.error(err);
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error.";
      return res.status(statusCode).json(error(message));
    }
  },
  deleteArticle: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const existing = await prisma.article.findUnique({ where: { id } });
      if (!existing) {
        return res.status(404).json(error("Article not found"));
      }
      const deleted = ArticleServices.deleteArticle(id);
      return res
        .status(200)
        .json(success("Article deleted successfully", deleted));
    } catch (err: any) {
      console.error(err);
      const statusCode = err.statusCode || 500;
      const message = err.message || "Internal Server Error.";
      return res.status(statusCode).json(error(message));
    }
  },
};
export default ArticleController;
