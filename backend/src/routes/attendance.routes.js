import express from "express";
import { markAttendanceController, getAttendanceController, getSelfAttendanceController, getAttendanceByEmpIDController, addManualAttendanceController, getAttendanceByIDController, updateManualAttendanceController, getSelfAttendanceViewController} from "../controllers/attendance.controller.js";
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';

const router = express.Router();

router.post("/check",authenticateToken, requirePermission("ATTENDANCE_MARK"), markAttendanceController);
router.get("/view",authenticateToken, requirePermission("ATTENDANCE_VIEW"), getAttendanceController);
router.get("/self", authenticateToken, requirePermission("ATTENDANCE_SELF"), getSelfAttendanceController);
router.get("/self/view", authenticateToken, requirePermission("ATTENDANCE_SELF"), getSelfAttendanceViewController);
router.post("/manual", authenticateToken, requirePermission("ATTENDANCE_MANAGE"), addManualAttendanceController);
router.get("/record/:id", authenticateToken, requirePermission("ATTENDANCE_VIEW"), getAttendanceByIDController);
router.put("/:id", authenticateToken, requirePermission("ATTENDANCE_MANAGE"), updateManualAttendanceController);
router.get("/:id", authenticateToken, requirePermission("ATTENDANCE_MANAGE"), getAttendanceByEmpIDController);

export default router;