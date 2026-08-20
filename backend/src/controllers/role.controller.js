import { getAllRoles, createRole , getRoleByID , updateRoleByID , updateRoleStatus} from "../services/role.service.js";

export const getRoles = async (req, res) => {
    try{
        const roles = await getAllRoles();

        res.status(200).json({
            success: true,
            data: roles,
        })
    }catch(error) {
        console.error("Error fetching roles", error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch roles",
        })
    }
}

export const addRole = async (req, res) => {
  try {
    const role = await createRole(req.body);

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    console.error("Error creating role:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create role",
    });
  }
};

export const getRoleById = async (req, res) => {
    try{
      const { id } = req.params;

      const role = await getRoleByID(id);

      if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

        res.status(200).json({
            success: true,
            data: role,
        })
    }catch(error) {
        console.error("Error fetching role Details", error);

        res.status(500).json({
            success:false,
            message:"Failed to fetch role",
        })
    }
}
export const updateRole = async (req,res) => {
    try{
    const { id } = req.params;
    const { role_name, description } = req.body;

    if (!role_name) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const role = await updateRoleByID(id, { role_name, description});

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
}catch(error) {
    console.error("Error updating role:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update role",
    });
}
}

export const updateRoleStatusByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "is_active must be true or false",
      });
    }

    const role = await updateRoleStatus(id, is_active);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: is_active
        ? "Role activated successfully"
        : "Role deactivated successfully",
      data: role,
    });
  } catch (error) {
    console.error("Error updating role status:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update role status",
    });
  }
};
