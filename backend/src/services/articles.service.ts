import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authenticatedToken";
import prisma from "../prisma/client";
import { success } from "../utils/responseHelper";
import slugify from "slugify";

const ArticleServices = {
  getAllArticles: async () => {
    const articles = await prisma.article.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      include: {
       author: {
          select: { id: true, name: true, email: true, password:false, phone: true, role: true , createdAt: true, updatedAt: true, avatarUrl: true},
        },
        tags: true,
      },
    });
    return articles;
  },
  getArticleById: async (id: string) => {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    return article;
  },
  createArticle: async (data: any) => {
    const slug = data.slug || slugify(data.title, { lower: true });

    const newArticle = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        type: data.type,
        excerpt: data.excerpt,
        body: data.body,
        heroImage: data.heroImage,
        status: data.status ?? "draft",
        publishedAt: data.status === "published" ? new Date() : null,
        authorId: data.authorId,
        tags: data.tags
          ? {
              connectOrCreate: data.tags.map((tag: string) => ({
                where: { slug: slugify(tag, { lower: true }) },
                create: { name: tag, slug: slugify(tag, { lower: true }) },
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, password:false, phone: true, role: true , createdAt: true, updatedAt: true, avatarUrl: true},
        },
        tags: true,
      },
    });
    return newArticle;
  },
  updateArticle: async (id: string, data: any) => {
    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) throw new Error("Article not found");

    const slug = data.title
      ? slugify(data.title, { lower: true })
      : existing.slug;

    return prisma.article.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        slug,
        excerpt: data.excerpt ?? existing.excerpt,
        body: data.body ?? existing.body,
        heroImage: data.heroImage ?? existing.heroImage,
        status: data.status ?? existing.status,
        publishedAt:
          data.status === "published"
            ? new Date()
            : existing.publishedAt ?? null,
        tags: data.tags
          ? {
              set: [], // hapus relasi lama
              connectOrCreate: data.tags.map((tag: string) => ({
                where: { slug: slugify(tag, { lower: true }) },
                create: { name: tag, slug: slugify(tag, { lower: true }) },
              })),
            }
          : undefined,
      },
      include: { author: true, tags: true },
    });
  },
  deleteArticle: async (id: string) => {
    /* ... */
    const deleted = await prisma.article.delete({
      where: { id },
    });
    return deleted;
  },
};
export default ArticleServices;
