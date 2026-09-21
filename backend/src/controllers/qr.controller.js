import { createQrToken } from "../services/qr.service.js";

export const createQR = async (req, res) => {
  try {
    const qr = await createQrToken();

    res.status(201).json({
      success: true,
      message: "QR code created successfully",
      data: qr,
    });
  } catch (error) {
    console.error("Error creating QR token:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create QR code",
    });
  }
};