import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { inputClass } from "./profile.style.ts";

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function PasswordInput({
  label,
  value,
  onChange,
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="text-sm font-medium text-[var(--text-primary-light)]">
      {label}

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className={`${inputClass} pr-10`}
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-primary-light)]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  );
}

export default PasswordInput;
