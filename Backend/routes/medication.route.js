import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    createMedication,
    getUserMedications,
    updateMedication,
    deleteMedication,
} from "../controllers/medication.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createMedication);
router.get("/", getUserMedications);
router.put("/:id", updateMedication);
router.delete("/:id", deleteMedication);

export default router;
