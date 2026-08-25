import { loginEmployee } from "../services/auth.service.js";

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