import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  type: "email" | "password" | "text";
  value: string;
  placeholder: string;
  icon: string;
  onChange: (value: string) => void;
  trailing?: ReactNode;
};

function FormField({
  id,
  label,
  type,
  value,
  placeholder,
  icon,
  onChange,
  trailing,
}: FormFieldProps) {
  return (
    <label htmlFor={id} className="block text-sm font-semibold text-[#424939]">
      {label}
      <span className="relative mt-2 flex h-12 items-center rounded-xl border border-[#c2c9b5] bg-white px-3 focus-within:ring-2 focus-within:ring-[#83bb49]/30">
        <img
          src={icon}
          alt=""
          className="mr-3 h-4 w-4 shrink-0 object-contain"
        />
        <input
          id={id}
          type={type}
          value={value}
          required
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-base font-normal text-[#191c1d] outline-none placeholder:text-[#6b7280]"
        />
        {trailing}
      </span>
    </label>
  );
}

export default FormField;
