import express from "express";

import leaveTypeRoutes from "./Leave/leaveType.routes.js";
import leaveRequestRoutes from "./Leave/leaveRequest.routes.js";
import leaveBalanceRoutes from "./Leave/leaveBalance.routes.js";
import leaveManageRoutes from "./Leave/leaveManage.routes.js";

const router = express.Router();

router.use("/leave-types", leaveTypeRoutes);
router.use("/leave-requests", leaveRequestRoutes);
router.use("/own-leave-manages", leaveManageRoutes);
router.use("/leave-balances", leaveBalanceRoutes);

export default router;