import express from "express";

import {
  getLeaveRequests,
  getLeaveRequestById,
  addLeaveRequest,
  approveLeave,
  rejectLeave,
  getSupervisedEmployeesController
} from "../../controllers/leaveRequest.controller.js";

import { createLeaveRequestSchema } from "../../validators/leaveRequest.validator.js";

import { validate } from "../../middlewares/error.middleware.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/supervised-employees", authenticateToken, requirePermission("LEAVE_VIEW"), getSupervisedEmployeesController);
router.get("/",authenticateToken,requirePermission("LEAVE_VIEW"),getLeaveRequests);
router.get("/:id",authenticateToken,requirePermission("LEAVE_VIEW"),getLeaveRequestById);
router.post("/",authenticateToken,requirePermission("LEAVE_APPLY"),validate(createLeaveRequestSchema),addLeaveRequest);
router.patch("/:id/approve",authenticateToken,requirePermission("LEAVE_APPROVE"),approveLeave);
router.patch("/:id/reject",authenticateToken,requirePermission("LEAVE_REJECT"),rejectLeave);

export default router;