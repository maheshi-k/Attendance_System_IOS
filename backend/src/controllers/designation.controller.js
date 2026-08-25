import {
  getDesignationHistory,
  changeDesignation,
} from "../services/designation.service.js";

export const getEmployeeDesignationHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await getDesignationHistory(id);

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error(
      "Error fetching designation history:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch designation history",
    });
  }
};

export const updateEmployeeDesignation = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      designation,
      effective_from,
    } = req.body;

    if (!designation || !effective_from) {
      return res.status(400).json({
        success: false,
        message:
          "Designation and effective date are required",
      });
    }

    const employee = await changeDesignation(
      id,
      designation,
      effective_from
    );

    res.status(200).json({
      success: true,
      message: "Designation updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error(
      "Error updating designation:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update designation",
    });
  }
};