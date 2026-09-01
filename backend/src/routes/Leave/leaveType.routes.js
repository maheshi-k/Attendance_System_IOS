import express from "express";

import {
  getLeaveTypes,
  getLeaveTypeById,
  addLeaveType,
  updateLeaveTypeById,
  deleteLeaveTypeById,
} from "../../controllers/leaveType.controller.js";

import {
  createLeaveTypeSchema,
  updateLeaveTypeSchema,
} from "../../validators/leaveType.validator.js";

import { validate } from "../../middlewares/error.middleware.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, requirePermission("LEAVE_TYPE_VIEW"), getLeaveTypes);
router.get( "/:id", authenticateToken, requirePermission("LEAVE_TYPE_VIEW"), getLeaveTypeById);
router.post("/",authenticateToken,requirePermission("LEAVE_TYPE_MANAGE"),validate(createLeaveTypeSchema),addLeaveType);
router.put("/:id",authenticateToken,requirePermission("LEAVE_TYPE_MANAGE"),validate(updateLeaveTypeSchema),updateLeaveTypeById);
router.delete("/:id",authenticateToken,requirePermission("LEAVE_TYPE_MANAGE"),deleteLeaveTypeById);

export default router;