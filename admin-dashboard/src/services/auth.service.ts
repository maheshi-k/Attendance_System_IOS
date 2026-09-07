import api from "../api/axios";

export type LoginCredentials = {
  email_1: string;
  password: string;
};

export const loginEmployee = async (credentials: LoginCredentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put("/auth/password", {
    current_password: data.currentPassword,
    new_password: data.newPassword,
  });
  return response.data;
};
