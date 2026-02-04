import express, { Router } from 'express';
import { authenticatedToken } from '../middleware/authenticatedToken';
import ArticleController from '../controllers/articles.controller';
import upload from '../middleware/upload';

const router = Router()

router.get('/', ArticleController.getAllArticles);
router.get('/:id', ArticleController.getArticleById);
router.post('/', authenticatedToken(['ADMIN']), upload.single('heroImage'),  ArticleController.createArticle);
router.put('/:id', authenticatedToken(['ADMIN']), ArticleController.updateArticle);
router.delete('/:id', authenticatedToken(['ADMIN']), ArticleController.deleteArticle);

export default router;