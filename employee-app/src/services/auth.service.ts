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
        Authorization: `Bearer ${localStorage.getItem("attendance_token") ?? ""}`,
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
