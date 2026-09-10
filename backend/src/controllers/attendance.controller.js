import { markAttendance, getAllAttendance, getSelfAttendance, getAttendanceByEmpID, addManualAttendance, getAttendanceByID, updateManualAttendance, getSelfAttendanceView , addManualAttendanceByEmp } from "../services/attendance.service.js";

export const markAttendanceController = async (req, res) => {
  try {
    const { qr_token, client_date, client_time } = req.body;
    const emp_id = req.user.emp_id;

    if (!qr_token) {
      return res.status(400).json({
        success: false,
        message: "QR token is required",
      });
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(client_date ?? "") ||
      !/^\d{2}:\d{2}:\d{2}$/.test(client_time ?? "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Client date must be YYYY-MM-DD and client time must be HH:mm:ss",
      });
    }

    const result = await markAttendance(emp_id, qr_token,client_date, client_time);

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

export const getSelfAttendanceController = async (req, res) => {
  try {
    const attendance = await getSelfAttendance(req.user.emp_id);

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Error retrieving attendance:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your attendance",
    });
  }
};

export const getSelfAttendanceViewController = async (req, res) => {
  try {
    const attendance = await getSelfAttendanceView(req.user.emp_id);

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Error retrieving attendance:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve your attendance",
    });
  }
};

export const addManualAttendanceController = async (req, res) => {
  try {
    const { emp_id, att_date, check_in, check_out } = req.body;

    if (!emp_id || !att_date || !check_in ) {
      return res.status(400).json({
        success: false,
        message: "Employee, date, check-in time are required",
      });
    }

    const attendance = await addManualAttendance({
      emp_id,
      att_date,
      check_in,
      check_out,
      // status,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance added successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error adding attendance:", error);
    if (error.code === "ATTENDANCE_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Attendance already exists for this date.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add attendance.",
    });
  }
};

export const addAttendanceByEmpController = async (req, res) => {
  try {
    const { att_date, attendance_time } = req.body;

    const emp_id = req.user.emp_id;

    if (!emp_id || !att_date || !attendance_time ) {
      return res.status(400).json({
        success: false,
        message: "Attendance date and time are require",
      });
    }

    const attendance = await addManualAttendanceByEmp({
      emp_id,
      att_date,
      attendance_time,
    });

    return res.status(201).json({
      success: true,
      message: attendance.action === "check_in"
        ? "Check-in attendance added successfully"
        : "Check-out attendance added successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error adding attendance:", error);

    if (error.message === "EMPLOYEE_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (error.message === "EMPLOYEE_INACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Employee account is inactive.",
      });
    }

    if (error.message === "ATTENDANCE_COMPLETED") {
      return res.status(409).json({
        success: false,
        message: "Today's attendance is already completed.",
      });
    }

    if (error.message === "MIN_CHECKOUT_TIME") {
      return res.status(400).json({
        success: false,
        message: "Minimum working hours have not been completed.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add attendance.",
    });
  }
};

export const getAttendanceByEmpIDController = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Employee ID must be numeric",
      });
    }

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

export const getAttendanceByIDController = async (req, res) => {
  try {
    const attendance = await getAttendanceByID(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    return res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error("Error retrieving attendance record:", error);
    return res.status(500).json({ success: false, message: "Failed to retrieve attendance record" });
  }
};

export const updateManualAttendanceController = async (req, res) => {
  try {
    const { emp_id, att_date, check_in, check_out } = req.body;

    if (!emp_id || !att_date || !check_in ) {
      return res.status(400).json({
        success: false,
        message: "Employee, date, check-in time are required",
      });
    }

    const attendance = await updateManualAttendance({
      att_id: req.params.id,
      emp_id,
      att_date,
      check_in,
      check_out,
    });

    if (!attendance) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({ success: false, message: "Failed to update attendance record" });
  }
};