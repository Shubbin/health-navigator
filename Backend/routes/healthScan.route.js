import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    createScan,
    getUserScans,
    getScanById,
    deleteScan,
} from "../controllers/healthScan.controller.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.post("/", createScan);
router.get("/", getUserScans);
router.get("/:id", getScanById);
router.delete("/:id", deleteScan);

export default router;
