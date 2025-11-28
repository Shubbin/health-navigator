import express from "express";
import {
    getArticles,
    getArticleBySlug,
    getFeaturedArticles,
    getArticlesByCategory,
    incrementViews,
    likeArticle,
    getCategories,
} from "../controllers/article.controller.js";

const router = express.Router();

// Public routes
router.get("/", getArticles);
router.get("/featured", getFeaturedArticles);
router.get("/categories", getCategories);
router.get("/category/:category", getArticlesByCategory);
router.get("/:slug", getArticleBySlug);
router.post("/:id/view", incrementViews);
router.post("/:id/like", likeArticle);

export default router;
