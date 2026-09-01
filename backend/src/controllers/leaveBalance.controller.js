import { getEmployeeLeaveBalances } from "../services/leaveBalance.service.js";

export const getEmployeeBalances = async (req, res) => {
  try {
    const { emp_id } = req.params;

    const leave_year = req.query.year
      ? Number(req.query.year)
      : new Date().getFullYear();

    if (!Number.isInteger(leave_year) || leave_year < 2000) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave year",
      });
    }

    const balances = await getEmployeeLeaveBalances(
      emp_id,
      leave_year
    );

    res.status(200).json({
      success: true,
      data: balances,
    });
  } catch (error) {
    console.error("Get leave balances error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get employee leave balances",
    });
  }
};