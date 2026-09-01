import express from "express";
import { markAttendanceController, getAttendanceController, getAttendanceByEmpIDController, addManualAttendanceController, getAttendanceByIDController, updateManualAttendanceController} from "../controllers/attendance.controller.js";
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';

const router = express.Router();

router.post("/check",authenticateToken, requirePermission("ATTENDANCE_MANAGE"), markAttendanceController);
router.get("/view",authenticateToken, requirePermission("ATTENDANCE_VIEW"), getAttendanceController);
router.post("/manual", authenticateToken, requirePermission("ATTENDANCE_MANAGE"), addManualAttendanceController);
router.get("/record/:id", authenticateToken, requirePermission("ATTENDANCE_VIEW"), getAttendanceByIDController);
router.put("/:id", authenticateToken, requirePermission("ATTENDANCE_MANAGE"), updateManualAttendanceController);
router.get("/:id", authenticateToken, requirePermission("ATTENDANCE_VIEW"), getAttendanceByEmpIDController);

export default router;