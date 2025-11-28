import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRouters from "./routes/auth.route.js";
import healthScanRouters from "./routes/healthScan.route.js";
import medicationRouters from "./routes/medication.route.js";
import chatRouters from "./routes/chat.route.js";

// DB Connection
import { connectDB } from "./db/connectDb.js";

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRouters);
app.use("/api/health-scans", healthScanRouters);
app.use("/api/medications", medicationRouters);
app.use("/api/chats", chatRouters);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  connectDB();
  console.log(`🚀 Server is running on port: ${port}`);
});
