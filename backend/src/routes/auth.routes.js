import express from "express";
import { changePassword, login } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { requirePermission } from "../middlewares/permission.middleware.js";

const router = express.Router();

router.post("/login", login);
router.put("/password", authenticateToken, changePassword);
router.get("/login-auth", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Authentication successful",
    user: req.user,
  });
});

export default router;