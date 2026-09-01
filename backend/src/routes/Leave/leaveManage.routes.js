import express from "express";

import {
  getLeaveHistoryControllerByEmpId
} from "../../controllers/leaveManage.controller.js";

import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();
router.get("/leave-history",authenticateToken,requirePermission("LEAVE_HISTORY_VIEW"),getLeaveHistoryControllerByEmpId);

export default router;