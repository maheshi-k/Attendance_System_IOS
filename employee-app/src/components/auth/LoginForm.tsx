import { useState, type FormEvent } from "react";
import FormField from "./FormField";
import { useAuth } from "../../context/AuthContext";
import { Eye, LockKeyhole, Mail, LogIn } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password, rememberMe);
    } catch (submitError) {
      if (submitError instanceof Error) {
        if (
          submitError.message.includes("email_1") ||
          submitError.message.includes("password")
        ) {
          setError("Incorrect email or password.");
        } else {
          setError(submitError.message);
        }
      } else {
        setError("Unable to sign in.");
      }
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
        icon={Mail}
        onChange={setEmail}
      />

      <FormField
        id="employee-password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        placeholder="••••••••"
        icon={LockKeyhole}
        onChange={setPassword}
        trailing={
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((visible) => !visible)}
            className="flex h-7 w-7 shrink-0 items-center justify-center"
          >
            <Eye size={17} strokeWidth={1.8} className="h-[15px] w-[22px]" />
          </button>
        }
      />

      {/* <div className="flex items-center justify-between gap-4">
        <button type="button" className="text-sm font-medium text-[#3c6a00]">
          Forgot Password?
        </button>
      </div> */}

      <div className="flex items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-[#83bb49]"
          />
          Remember me
        </label>
      </div>

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
        <LogIn size={17} strokeWidth={1.8} className="h-[18px] w-[18px]" />
      </button>
    </form>
  );
}

export default LoginForm;
