import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../assets/Logo.png";

import { loginEmployee } from "../services/auth.service";

type LoginProps = {
  onLoginSuccess: () => void;
};

const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const authData = await loginEmployee({
        email_1: email.trim(),
        password,
      });

      const { token, employee } = authData;

      if (!token || !employee) {
        throw new Error("Login response was invalid");
      }

      localStorage.setItem("attendance_token", token);
      localStorage.setItem("attendance_employee", JSON.stringify(employee));
      localStorage.setItem(
        "attendance_permissions",
        JSON.stringify(authData.permissions ?? []),
      );
      const sessionExpiry = Date.now() + INACTIVITY_TIMEOUT_MS;
      localStorage.setItem("attendance_session_expiry", String(sessionExpiry));
      window.dispatchEvent(new Event("auth:change"));

      onLoginSuccess();
      navigate("/dashboard", { replace: true });
      toast.success("Login successful");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(#b3dd87,transparent)] px-4 py-10">
      <div className="w-full max-w-[430px]">
        <div className="h-[124px] items-center gap-4 px-[30px] cursor-pointer">
          <div className="flex flex-col items-center">
            <img
              src={Logo}
              onClick={() => navigate("/login")}
              alt="Logo"
              className="h-[70px] w-[70px] rounded-md object-contain"
            />

            <div className="text-center">
              <h1 className="text-lg font-bold leading-5 text-[var(--text-primary)]">
                IONESOFT
              </h1>

              <p className="mt-1 text-2xs tracking-[1px] text-gray-500">
                YOUR SOLUTION
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] bg-[#f8f8f8]/90 p-7 shadow-[0_20px_40px_rgba(85,105,72,0.12)] backdrop-blur-sm sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-[-0.05em] text-[#1a1b1a]">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#5d6258]">
              Enter your credentials to access the admin portal
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-base font-medium text-[#2f2f2f]"
              >
                Email Address
              </label>
              <div className="flex items-center gap-3 rounded-[12px] border border-[#d8d8d8] bg-[#f3f4f2] px-3 py-3 shadow-inner">
                <Mail className="h-5 w-5 text-[#5b6659]" strokeWidth={2} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full border-none bg-transparent text-base text-[#1f2320] outline-none placeholder:text-[#6a706a]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-base font-medium text-[#2f2f2f]"
              >
                Password
              </label>
              <div className="flex items-center gap-3 rounded-[12px] border border-[#d8d8d8] bg-[#f3f4f2] px-3 py-3 shadow-inner">
                <Lock className="h-5 w-5 text-[#5b6659]" strokeWidth={2} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="******"
                  className="w-full border-none bg-transparent text-base text-[#1f2320] outline-none placeholder:text-[#6a706a]"
                />
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[#5b6659] transition hover:bg-black/5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* <div className="pt-1 text-left">
              <button
                type="button"
                className="text-base font-medium text-[var(--text-secondary)] underline-offset-2 transition hover:text-[#5ea94a] hover:underline"
              >
                Forgot Password?
              </button>
            </div> */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--button-muted)] px-4 py-4 text-xl font-semibold text-white shadow-[0_10px_18px_rgba(99,180,74,0.35)] transition hover:bg-[#69bd4e] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{isSubmitting ? "Logging in..." : "Log In"}</span>
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-[11px] font-medium tracking-[0.08em] text-[#4d5847] uppercase">
          © 2026 iONESOFT SOLUTIONS • ENTERPRISE ADMIN V1
        </div>
      </div>
    </main>
  );
}

export default Login;
