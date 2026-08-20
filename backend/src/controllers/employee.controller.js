import { getAllEmployees, createEmployee, getEmployeeByID, UpdateEmployeeByID ,updateEmployeeStatus, getEmployeeByStatus } from "../services/employee.service.js";

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
    const employee = await createEmployee(req.body);

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

    const {
      first_name,
      last_name,
      email,
      password,
      role_id,
      profile_photo,
      employment_status,
      mobile_no,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !role_id
    ) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email and role are required",
      });
    }

    const employee = await UpdateEmployeeByID(id, {
      first_name,
      last_name,
      email,
      password,
      role_id,
      profile_photo,
      employment_status,
      mobile_no,
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


