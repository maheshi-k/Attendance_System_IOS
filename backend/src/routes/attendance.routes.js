import express from "express";
import { markAttendanceController, getAttendanceController, getAttendanceByEmpIDController, addManualAttendanceController, getAttendanceByIDController, updateManualAttendanceController} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/check", markAttendanceController);
router.get("/view", getAttendanceController);
router.post("/manual", addManualAttendanceController);
router.get("/record/:id", getAttendanceByIDController);
router.put("/:id", updateManualAttendanceController);
router.get("/:id", getAttendanceByEmpIDController);

export default router;