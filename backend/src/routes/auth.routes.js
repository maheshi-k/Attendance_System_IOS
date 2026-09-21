import express from "express";
import { changePassword, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
// import { requirePermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.post("/login", login);
router.put("/password", authenticateToken, changePassword);
// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password using email token
router.post("/reset-password", resetPassword);

export default router;