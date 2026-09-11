// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { checkAttendance, getSelfAttendance } from "./attendance.service";
import { changePassword, loginEmployee } from "./auth.service";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { EmployeeProvider, useEmployee } from "../context/EmployeeContext";
import { useInactivityLogout } from "../hooks/useInactivityLogout";
import { clearAuthSession, saveAuthSession } from "../utils/authStorage";
import {
  getMyProfile,
  updateMyProfile,
  type UpdateMyProfileData,
} from "./employee.service";

const employee = {
  emp_id: 7,
  emp_code: "EMP007",
  first_name: "Ada",
  last_name: "Lovelace",
  email_1: "ada@ionesoft.com",
  email_2: "ada@example.com",
  mobile_no_1: "0712345678",
  mobile_no_2: null,
  address: "Colombo",
  gender: "Female",
  nic: "901234567V",
  profile_photo: "data:image/png;base64,photo",
  joining_date: "2024-01-01",
  employment_status: "Active",
  designation: "Engineer",
  role_id: 2,
  role_name: "Employee",
};

const attendanceRecord = {
  att_id: 10,
  emp_id: 7,
  att_date: "2026-09-03",
  check_in: "08:45:00",
  check_out: null,
  status: "Present",
  created_at: "2026-09-03T08:45:00.000Z",
  updated_at: "2026-09-03T08:45:00.000Z",
};

const response = (data: unknown, ok = true, message?: string) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve({ data, message }),
  } as Response);

const apiBaseUrl = import.meta.env.VITE_BASE_URL ?? "/api";

const createStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
  };
};

describe("employee attendance flows", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
    localStorage.setItem("attendance_token", "test-token");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("marks attendance with the scanned QR token", async () => {
    vi.mocked(fetch).mockReturnValueOnce(response(attendanceRecord));

    const result = await checkAttendance("office-qr-token");

    expect(result.data).toEqual(attendanceRecord);
    expect(result.client_time).toMatch(/^\d{2}:\d{2}:\d{2}$/);

    const [, request] = vi.mocked(fetch).mock.calls[0];

    expect(request).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        }),
      }),
    );

    expect(JSON.parse(String(request?.body))).toMatchObject({
      qr_token: "office-qr-token",
      client_date: expect.stringMatching(/\d{4}-\d{2}-\d{2}/),
      client_time: expect.stringMatching(/\d{2}:\d{2}:\d{2}/),
      client_datetime: expect.stringMatching(
        /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
      ),
    });
  });

  it("logs in an employee and returns the authenticated session", async () => {
    const loginData = { token: "new-token", employee, permissions: [] };
    vi.mocked(fetch).mockReturnValueOnce(response(loginData));

    await expect(
      loginEmployee({ email_1: employee.email_1, password: "secret123" }),
    ).resolves.toEqual(loginData);

    expect(fetch).toHaveBeenCalledWith(
      `${apiBaseUrl}/auth/login`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email_1: employee.email_1,
          password: "secret123",
        }),
      }),
    );
  });

  it("loads attendance records for the attendance view", async () => {
    const attendance = {
      today: attendanceRecord,
      records: [attendanceRecord],
      stats: { present_days: 1, late_days: 0, absent_days: 0 },
    };
    vi.mocked(fetch).mockReturnValueOnce(response(attendance));

    await expect(getSelfAttendance()).resolves.toEqual(attendance);
    expect(fetch).toHaveBeenCalledWith(
      `${apiBaseUrl}/attendance/self`,
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      }),
    );
  });

  it("loads the employee profile", async () => {
    vi.mocked(fetch).mockReturnValueOnce(response(employee));

    await expect(getMyProfile()).resolves.toEqual(employee);
    expect(fetch).toHaveBeenCalledWith(
      `${apiBaseUrl}/employees/myprofile`,
      expect.objectContaining({
        method: "GET",
        headers: { Authorization: "Bearer test-token" },
      }),
    );
  });

  it("edits only the permitted profile fields", async () => {
    const profile: UpdateMyProfileData = {
      first_name: "Ada",
      last_name: "Byron",
      email_2: "ada.byron@example.com",
      mobile_no_1: "0798765432",
      mobile_no_2: "0711111111",
      address: "Kandy",
      gender: "Female",
      nic: "901234567V",
      profile_photo: employee.profile_photo,
    };
    vi.mocked(fetch).mockReturnValueOnce(response({ ...employee, ...profile }));

    await expect(updateMyProfile(profile)).resolves.toMatchObject({
      last_name: "Byron",
      address: "Kandy",
    });

    const [, request] = vi.mocked(fetch).mock.calls[0];
    expect(request?.method).toBe("PUT");
    expect(request?.headers).toEqual({ Authorization: "Bearer test-token" });
    expect(request?.body).toBeInstanceOf(FormData);
    const submitted = request?.body as FormData;
    expect(submitted.get("first_name")).toBe("Ada");
    expect(submitted.get("last_name")).toBe("Byron");
    expect(submitted.get("email_2")).toBe("ada.byron@example.com");
    expect(submitted.get("profile_photo")).toBeNull();
    expect([...submitted.keys()]).toEqual([
      "first_name",
      "last_name",
      "email_2",
      "mobile_no_1",
      "mobile_no_2",
      "address",
      "gender",
      "nic",
    ]);
  });

  it("resets the password using the authenticated employee session", async () => {
    vi.mocked(fetch).mockReturnValueOnce(response(undefined));

    await expect(
      changePassword("old-pass", "new-pass"),
    ).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(
      `${apiBaseUrl}/auth/password`,
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          current_password: "old-pass",
          new_password: "new-pass",
        }),
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("propagates an API error when attendance marking fails", async () => {
    vi.mocked(fetch).mockReturnValueOnce(
      response(undefined, false, "Invalid QR token"),
    );

    await expect(checkAttendance("bad-token")).rejects.toThrow(
      "Invalid QR token",
    );
  });

  it("shows the logged-in employee immediately before the profile fetch resolves", async () => {
    const loginPayload = {
      token: "session-token",
      employee,
      permissions: [],
    };

    vi.spyOn(await import("./auth.service"), "loginEmployee").mockResolvedValue(
      loginPayload,
    );

    let resolveProfile: (value: typeof employee) => void;
    const profileRequest = new Promise<typeof employee>((resolve) => {
      resolveProfile = resolve;
    });

    vi.spyOn(
      await import("./employee.service"),
      "getMyProfile",
    ).mockReturnValue(profileRequest);

    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const LoginStarter = () => {
      const { login } = useAuth();

      return createElement(
        "button",
        {
          type: "button",
          onClick: () => void login("ada@ionesoft.com", "secret123", false),
        },
        "login",
      );
    };

    const EmployeeViewer = () => {
      const { employee: currentEmployee, loading } = useEmployee();
      return createElement(
        "div",
        null,
        loading ? "loading" : (currentEmployee?.first_name ?? "missing"),
      );
    };

    await act(async () => {
      root.render(
        createElement(
          AuthProvider,
          null,
          createElement(
            EmployeeProvider,
            null,
            createElement(LoginStarter),
            createElement(EmployeeViewer),
          ),
        ),
      );
    });

    await act(async () => {
      const button = container.querySelector("button");
      button?.click();
      await Promise.resolve();
    });

    expect(container.textContent).toContain("Ada");
    expect(container.textContent).not.toContain("loading");

    resolveProfile!(employee);
    await act(async () => {
      await Promise.resolve();
    });

    root.unmount();
    container.remove();
  });

  it("stores auth session in localStorage when Remember Me is enabled", () => {
    saveAuthSession(
      "token-remembered",
      employee,
      [{ permission_code: "VIEW" }],
      true,
    );

    expect(localStorage.getItem("attendance_token")).toBe("token-remembered");
    expect(localStorage.getItem("attendance_employee")).toBe(
      JSON.stringify(employee),
    );
    expect(localStorage.getItem("attendance_permissions")).toBe(
      JSON.stringify([{ permission_code: "VIEW" }]),
    );
    expect(sessionStorage.getItem("attendance_token")).toBeNull();
  });

  it("stores auth session in sessionStorage when Remember Me is disabled", () => {
    saveAuthSession(
      "token-session",
      employee,
      [{ permission_code: "VIEW" }],
      false,
    );

    expect(sessionStorage.getItem("attendance_token")).toBe("token-session");
    expect(sessionStorage.getItem("attendance_employee")).toBe(
      JSON.stringify(employee),
    );
    expect(sessionStorage.getItem("attendance_permissions")).toBe(
      JSON.stringify([{ permission_code: "VIEW" }]),
    );
    expect(localStorage.getItem("attendance_token")).toBeNull();
  });

  it("logs out and clears both storage locations when the inactivity timer expires", () => {
    vi.useFakeTimers();
    const onLogout = vi.fn();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const InactivityProbe = () => {
      useInactivityLogout(true, onLogout);
      return null;
    };

    act(() => {
      root.render(createElement(InactivityProbe));
    });

    act(() => {
      vi.advanceTimersByTime(60 * 1000);
    });

    expect(onLogout).toHaveBeenCalledTimes(1);

    root.unmount();
    container.remove();
    vi.useRealTimers();
  });

  it("resets the inactivity timer when the user is active", () => {
    vi.useFakeTimers();
    const onLogout = vi.fn();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    const InactivityProbe = () => {
      useInactivityLogout(true, onLogout);
      return null;
    };

    act(() => {
      root.render(createElement(InactivityProbe));
    });

    act(() => {
      vi.advanceTimersByTime(30 * 1000);
      window.dispatchEvent(new MouseEvent("mousemove"));
      vi.advanceTimersByTime(30 * 1000);
    });

    expect(onLogout).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(31 * 1000);
    });

    expect(onLogout).toHaveBeenCalledTimes(1);

    root.unmount();
    container.remove();
    vi.useRealTimers();
  });

  it("logout clears all auth keys from both localStorage and sessionStorage", () => {
    saveAuthSession(
      "token-remembered",
      employee,
      [{ permission_code: "VIEW" }],
      true,
    );
    localStorage.setItem("attendance_token", "stale-local");
    sessionStorage.setItem("attendance_token", "stale-session");

    clearAuthSession();

    expect(localStorage.getItem("attendance_token")).toBeNull();
    expect(localStorage.getItem("attendance_employee")).toBeNull();
    expect(localStorage.getItem("attendance_permissions")).toBeNull();
    expect(sessionStorage.getItem("attendance_token")).toBeNull();
    expect(sessionStorage.getItem("attendance_employee")).toBeNull();
    expect(sessionStorage.getItem("attendance_permissions")).toBeNull();
  });
});
