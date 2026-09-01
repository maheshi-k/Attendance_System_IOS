import api from "../api/axios";

export type LoginCredentials = {
  email_1: string;
  password: string;
};

export const loginEmployee = async (credentials: LoginCredentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};
