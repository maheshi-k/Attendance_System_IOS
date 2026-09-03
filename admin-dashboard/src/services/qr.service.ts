import axiosInstance from "../api/axios";

export const generateQRCode = async () => {
  try {
    const response = await axiosInstance.post("/qr");
    return response.data;
  } catch (error) {
    throw error;
  }
};
