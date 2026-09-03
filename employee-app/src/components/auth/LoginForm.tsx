import { useState, type FormEvent } from "react";
import FormField from "./FormField";
import { loginEmployee } from "../../services/auth.service";

const emailIcon =
  "https://www.figma.com/api/mcp/asset/87a0513f-4a76-46fc-a400-80a8b6ca9569.svg";
const passwordIcon =
  "https://www.figma.com/api/mcp/asset/8ecf2f79-0d06-426b-8e31-a5e6e187e8f3.svg";
const eyeIcon =
  "https://www.figma.com/api/mcp/asset/4c3c566a-e8bb-4384-9f94-22f030778224.svg";
const signInIcon =
  "https://www.figma.com/api/mcp/asset/4558eaf7-c25f-41a9-b9dd-b9ff969a7b03.svg";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const authData = await loginEmployee({
        email_1: email.trim(),
        password,
      });

      localStorage.setItem("attendance_token", authData.token);
      localStorage.setItem(
        "attendance_employee",
        JSON.stringify(authData.employee),
      );
      localStorage.setItem(
        "attendance_permissions",
        JSON.stringify(authData.permissions ?? []),
      );
      window.dispatchEvent(new Event("auth:change"));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign in",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormField
        id="employee-email"
        label="Employee Email"
        type="email"
        value={email}
        placeholder="Enter your Email"
        icon={emailIcon}
        onChange={setEmail}
      />

      <FormField
        id="employee-password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        placeholder="••••••••"
        icon={passwordIcon}
        onChange={setPassword}
        trailing={
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((visible) => !visible)}
            className="flex h-7 w-7 shrink-0 items-center justify-center"
          >
            <img
              src={eyeIcon}
              alt=""
              className="h-[15px] w-[22px] object-contain"
            />
          </button>
        }
      />

      {/* <div className="flex items-center justify-between gap-4">
        <button type="button" className="text-sm font-medium text-[#3c6a00]">
          Forgot Password?
        </button>
      </div> */}

      {error && (
        <p className="text-sm text-[#b43f3f]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#83bb49] py-4 text-base font-semibold text-white shadow-[0_10px_15px_-3px_rgba(60,106,0,0.2),0_4px_6px_-4px_rgba(60,106,0,0.2)] transition hover:bg-[#75ad3d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
        <img
          src={signInIcon}
          alt=""
          className="h-[18px] w-[18px] object-contain"
        />
      </button>
    </form>
  );
}

export default LoginForm;
