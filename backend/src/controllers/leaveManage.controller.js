import {
  getLeaveHistoryByEmpID
} from "../services/leaveManage.service.js";

export const getLeaveHistoryControllerByEmpId = async (req, res) => {
  try {
    const leaveRequests = await getLeaveHistoryByEmpID(req.user);

    res.status(200).json({
      success: true,
      data: leaveRequests,
    });
  } catch (error) {
    console.error("Get my leave history error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get leave history",
    });
  }
};