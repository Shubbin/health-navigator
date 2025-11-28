import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    createChat,
    getUserChats,
    getChatById,
    updateChat,
    deleteChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createChat);
router.get("/", getUserChats);
router.get("/:id", getChatById);
router.put("/:id", updateChat);
router.delete("/:id", deleteChat);

export default router;
