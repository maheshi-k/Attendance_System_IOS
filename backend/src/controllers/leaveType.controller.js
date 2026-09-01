import {
  getAllLeaveTypes,
  getLeaveTypeByID,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../services/leaveType.service.js";

export const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await getAllLeaveTypes();

    res.status(200).json({
      success: true,
      data: leaveTypes,
    });
  } catch (error) {
    console.error("Get leave types error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get leave types",
    });
  }
};

export const getLeaveTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveType = await getLeaveTypeByID(id);

    if (!leaveType) {
      return res.status(404).json({
        success: false,
        message: "Leave type not found",
      });
    }

    res.status(200).json({
      success: true,
      data: leaveType,
    });
  } catch (error) {
    console.error("Get leave type error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get leave type",
    });
  }
};

export const addLeaveType = async (req, res) => {
  try {
    const leaveType = await createLeaveType(req.body);

    res.status(201).json({
      success: true,
      message: "Leave type created successfully",
      data: leaveType,
    });
  } catch (error) {
    console.error("Create leave type error:", error);

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        success: false,
        message: "Leave type name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create leave type",
    });
  }
};

export const updateLeaveTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const leaveType = await updateLeaveType(id, req.body);

    if (!leaveType) {
      return res.status(404).json({
        success: false,
        message: "Leave type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave type updated successfully",
      data: leaveType,
    });
  } catch (error) {
    console.error("Update leave type error:", error);

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        success: false,
        message: "Leave type name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update leave type",
    });
  }
};

export const deleteLeaveTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteLeaveType(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Leave type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave type deleted successfully",
    });
  } catch (error) {
    console.error("Delete leave type error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete leave type",
    });
  }
};