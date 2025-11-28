import { Article } from "../models/article.model.js";

// Get all articles with filtering, search, and pagination
export const getArticles = async (req, res) => {
    try {
        const {
            search,
            category,
            sort = "newest",
            date,
            page = 1,
            limit = 12,
        } = req.query;

        let query = { published: true };

        // Search filter
        if (search) {
            query.$text = { $search: search };
        }

        // Category filter
        if (category && category !== "All") {
            query.category = category;
        }

        // Date filter
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.publishedAt = { $gte: startOfDay, $lte: endOfDay };
        }

        // Sorting
        let sortOption = {};
        switch (sort) {
            case "newest":
                sortOption = { publishedAt: -1 };
                break;
            case "oldest":
                sortOption = { publishedAt: 1 };
                break;
            case "popular":
                sortOption = { views: -1 };
                break;
            case "liked":
                sortOption = { likes: -1 };
                break;
            default:
                sortOption = { publishedAt: -1 };
        }

        const skip = (page - 1) * limit;

        const articles = await Article.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .select("-content"); // Exclude full content for list view

        const total = await Article.countDocuments(query);

        res.status(200).json({
            success: true,
            articles,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error in getArticles:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get single article by slug
export const getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const article = await Article.findOne({ slug, published: true });

        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        res.status(200).json({
            success: true,
            article,
        });
    } catch (error) {
        console.error("Error in getArticleBySlug:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get featured articles
export const getFeaturedArticles = async (req, res) => {
    try {
        const articles = await Article.find({ featured: true, published: true })
            .sort({ publishedAt: -1 })
            .limit(3)
            .select("-content");

        res.status(200).json({
            success: true,
            articles,
        });
    } catch (error) {
        console.error("Error in getFeaturedArticles:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get articles by category
export const getArticlesByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const articles = await Article.find({ category, published: true })
            .sort({ publishedAt: -1 })
            .select("-content");

        res.status(200).json({
            success: true,
            articles,
        });
    } catch (error) {
        console.error("Error in getArticlesByCategory:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Increment article views
export const incrementViews = async (req, res) => {
    try {
        const { id } = req.params;

        const article = await Article.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        res.status(200).json({
            success: true,
            views: article.views,
        });
    } catch (error) {
        console.error("Error in incrementViews:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Like/unlike article
export const likeArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // "like" or "unlike"

        const update = action === "like" ? { $inc: { likes: 1 } } : { $inc: { likes: -1 } };

        const article = await Article.findByIdAndUpdate(id, update, { new: true });

        if (!article) {
            return res.status(404).json({ success: false, message: "Article not found" });
        }

        res.status(200).json({
            success: true,
            likes: article.likes,
        });
    } catch (error) {
        console.error("Error in likeArticle:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Article.distinct("category");

        res.status(200).json({
            success: true,
            categories: ["All", ...categories],
        });
    } catch (error) {
        console.error("Error in getCategories:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
