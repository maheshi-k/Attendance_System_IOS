import {
  getAllLeaveRequests,
  getLeaveRequestByID,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getSupervisedEmployees,
} from "../services/leaveRequest.service.js";

export const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await getAllLeaveRequests(req.user);

    res.status(200).json({
      success: true,
      data: leaveRequests,
    });
  } catch (error) {
    console.error("Get leave requests error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get leave requests",
    });
  }
};

export const getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await getLeaveRequestByID(id, req.user);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: leaveRequest,
    });
  } catch (error) {
    console.error("Get leave request error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get leave request",
    });
  }
};

export const addLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await createLeaveRequest(
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: "Leave request submitted successfully",
      data: leaveRequest,
    });
  } catch (error) {
    console.error("Create leave request error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create leave request",
    });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveRequest = await approveLeaveRequest(
      id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Leave request approved successfully",
      data: leaveRequest,
    });
  } catch (error) {
    console.error("Approve leave error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to approve leave request",
    });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const leaveRequest = await rejectLeaveRequest(
      id,
      comment,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Leave request rejected successfully",
      data: leaveRequest,
    });
  } catch (error) {
    console.error("Reject leave error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to reject leave request",
    });
  }
};

export const getSupervisedEmployeesController = async (req, res) => {
  try{
    const employees = await getSupervisedEmployees(req.user);
    res.status(200).json({
      success: true,
      data: employees,
    });
  }catch(error){
    console.error("Error fetching supervised employees:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get supervised employees",
    });
  }
}

