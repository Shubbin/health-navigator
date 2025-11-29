import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Routes
import authRoutes from "./routes/auth.route.js";
import healthScanRoutes from "./routes/healthScan.route.js";
import medicationRoutes from "./routes/medication.route.js";
import chatRoutes from "./routes/chat.route.js";
import userRoutes from "./routes/users.route.js";
import readingLogRoutes from "./routes/readingLog.route.js";
import settingsRoutes from "./routes/settings.route.js";
import articleRoutes from "./routes/article.route.js";
import mlRoutes from "./routes/ml.route.js";

// DB Connection
import { connectDB } from "./db/connectDb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// CORS Configuration
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:8080"],
        credentials: true,
    })
);

// Middleware
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/health-scans", healthScanRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reading-history", readingLogRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/ml", mlRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Server is running" });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server is running on port: ${PORT}`);
});
