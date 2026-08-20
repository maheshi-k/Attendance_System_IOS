import express from "express";
import { markAttendanceController, getAttendanceController, getAttendanceByEmpIDController} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/check", markAttendanceController);
router.get("/view", getAttendanceController);
router.get("/:id", getAttendanceByEmpIDController);

export default router;