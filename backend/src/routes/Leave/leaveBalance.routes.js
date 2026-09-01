import express from "express";

import {
  getEmployeeBalances,
} from "../../controllers/leaveBalance.controller.js";

import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/:emp_id",authenticateToken,requirePermission("LEAVE_VIEW"),getEmployeeBalances);

export default router;