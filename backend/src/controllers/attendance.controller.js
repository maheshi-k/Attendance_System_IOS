import { markAttendance, getAllAttendance , getAttendanceByEmpID } from "../services/attendance.service.js";

export const markAttendanceController = async (req, res) => {
  try {
    const { emp_id, qr_token } = req.body;

    if (!emp_id || !qr_token) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and QR token are required",
      });
    }

    const result = await markAttendance(emp_id, qr_token);

    const message =
      result.action === "CHECK_IN"
        ? "Attendance check-in successful"
        : "Attendance check-out successful";

    res.status(200).json({
      success: true,
      message,
      data: result.attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);

    switch (error.message) {
      case "EMPLOYEE_NOT_FOUND":
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });

      case "EMPLOYEE_INACTIVE":
        return res.status(403).json({
          success: false,
          message: "Employee is inactive",
        });

      case "INVALID_QR":
        return res.status(400).json({
          success: false,
          message: "Invalid QR token",
        });

      case "QR_INACTIVE":
        return res.status(400).json({
          success: false,
          message: "QR token is inactive",
        });

      case "ATTENDANCE_COMPLETED":
        return res.status(400).json({
          success: false,
          message: "Attendance already completed for today",
        });

      case "MIN_CHECKOUT_TIME":
        return res.status(400).json({
          success: false,
          message: "Minimum 4 hours are required before checkout",
        });

      default:
        return res.status(500).json({
          success: false,
          message: "Failed to mark attendance",
        });
    }
  }
};

export const getAttendanceController = async (req,res) => {
  try{
    const { date } = req.query;

    const attendance = await getAllAttendance(date);

    res.status(200).json({
      success:true,
      message: "Attendance records retrieved successfully",
      data: attendance,
    })
  }catch(error){
    console.error("Error retrieving attendance:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve attendance records",
    });
  }
}

export const getAttendanceByEmpIDController = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const attendance = await getAttendanceByEmpID(id, date);

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for this employee",
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Get employee attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get employee attendance",
    });
  }
};