import { getAllEmployees, createEmployee, getEmployeeByID, UpdateEmployeeByID ,updateEmployeeStatus, getEmployeeByStatus, deleteEmployee, getActiveEmployeeCount , getMyProfile, updateMyProfile } from "../services/employee.service.js";

export const getEmployee = async (req, res) => {
    try{
        const employees = await getAllEmployees();

        res.status(200).json({
            success: true,
            data: employees,
        })
    }catch(error) {
        console.error("Error fetching employees", error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch employees",
        })
    }
}

export const addEmployee = async (req, res) => {
  try {
    const designationHistory = req.body.designation_history
      ? JSON.parse(req.body.designation_history)
      : undefined;
    const employeeData = {
      ...req.body,
      profile_photo: req.file?.buffer || null,
      designation_history: designationHistory,
    };

    const employee = await createEmployee(employeeData);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};

export const getEmployeeById = async (req, res) => {
    try{
      const { id } = req.params;

      const employee = await getEmployeeByID(id);

      if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

        res.status(200).json({
            success: true,
            data: employee,
        })
    }catch(error) {
        console.error("Error fetching employee Details", error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch employee",
        })
    }
}

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const designationHistory = req.body.designation_history
      ? JSON.parse(req.body.designation_history)
      : undefined;

    const {
      first_name,
      last_name,
      email_1,
      email_2,
      password,
      nic,
      gender,
      address,
      role_id,
      employment_status,
      mobile_no_1,
      mobile_no_2,
      joining_date,
      designation,
      is_present,
      effective_to,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email_1 ||
      !role_id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, last name, email and role are required",
      });
    }

    const employee = await UpdateEmployeeByID(id, {
      first_name,
      last_name,
      email_1,
      email_2,
      password,
      nic,
      gender,
      address,
      role_id,
      profile_photo: req.file?.buffer,
      employment_status,
      mobile_no_1,
      mobile_no_2,
      joining_date,
      designation,
      is_present,
      effective_to,
      designation_history: designationHistory,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

export const updateMyProfileController = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email_2,
      mobile_no_1,
      mobile_no_2,
      address,
      gender,
      nic,
    } = req.body;

    if (!first_name || !last_name || !mobile_no_1 || !gender || !nic) {
      return res.status(400).json({
        success: false,
        message: "Name, primary phone, gender and NIC are required",
      });
    }

    const employee = await updateMyProfile(req.user.emp_id, {
      first_name,
      last_name,
      email_2,
      mobile_no_1,
      mobile_no_2,
      address,
      gender,
      nic,
      profile_photo: req.file?.buffer,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: employee,
    });
  } catch (error) {
    console.error("Error updating own profile:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const updateEmployeeStatusByID = async (req,res) => {
  try{
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active must be true or false",
      });
    }

    const employee = await updateEmployeeStatus(id, is_active);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: is_active
        ? "Employee activated successfully"
        : "Employee deactivated successfully",
      data: employee,
    });
  }catch (error) {
    console.error("Error updating employee status:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update employee status",
    });
  }
}

export const deleteEmployeeByID = async (req, res) => {
  try {
    const deleted = await deleteEmployee(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deactivated successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};

export const getEmployeeByStatusController = async (req, res) => {
    try{
      const { status } = req.params;

      const employees = await getEmployeeByStatus(status);

      if (!employees || employees.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No employees found with the specified status",
        });
      }

        res.status(200).json({
            success: true,
            data: employees,
        })
    }catch(error) {
        console.error("Error fetching employee Details", error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch employee",
        })
    }
}

export const getActiveEmployeeCountController = async (req, res) => {
  try {
    const count = await getActiveEmployeeCount();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Failed to get active employee count:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get active employee count",
    });
  }
};

export const getMyProfileController = async (req, res) => {
  try {
    const emp_id = req.user.emp_id;

    const employee = await getMyProfile(emp_id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get my profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load profile",
    });
  }
};

