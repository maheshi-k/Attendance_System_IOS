import { changeEmployeePassword, loginEmployee } from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { email_1, password } = req.body;

    if (!email_1 || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginEmployee(email_1, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: "Current and new passwords are required",
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    await changeEmployeePassword(
      req.user.emp_id,
      current_password,
      new_password,
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    if (error.message === "CURRENT_PASSWORD_INVALID") {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    console.error("Password change error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};