import { getAuthToken } from "../utils/authStorage";

export type LoginCredentials = {
  email_1: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  employee: Record<string, unknown>;
  permissions?: unknown[];
};

export const loginEmployee = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    },
  );

  const result = (await response.json()) as {
    data?: LoginResponse;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Invalid email or password");
  }

  return result.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/auth/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken() ?? ""}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    },
  );
  const result = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(result.message ?? "Unable to update password");
  }
};

export const requestPasswordReset = async (email: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );
  const result = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(result.message ?? "Unable to request password reset");
  }
};

export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    },
  );
  const result = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(result.message ?? "Unable to reset password");
  }
};
