import express from "express";
import { createQR } from "../controllers/qr.controller.js";

const router = express.Router();

router.post("/", createQR);

export default router;