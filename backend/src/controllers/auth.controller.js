import {
  changeEmployeePassword,
  forgotEmployeePassword,
  loginEmployee,
  resetEmployeePassword,
} from "../services/auth.service.js";

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

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    await forgotEmployeePassword(email.trim());

    return res.status(200).json({
      success: true,
      message:
        "If an account exists for this email, you will receive password reset instructions shortly.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password reset request",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    await resetEmployeePassword(token, password);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error.message === "INVALID_RESET_TOKEN") {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired.",
      });
    }

    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};