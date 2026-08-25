import { ChevronDown } from "lucide-react";
import type { EmployeeStatus } from "../../types/employee";

type EmployeeFiltersProps = {
  selectedStatus: "All Status" | EmployeeStatus;
  selectedDesignation: string;
  designationOptions: string[];
  totalEmployees: number;
  startIndex: number;
  endIndex: number;
  onStatusChange: (status: "All Status" | EmployeeStatus) => void;
  onDesignationChange: (designation: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
  width,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-9 ${width} appearance-none rounded-lg bg-[#f3f4f5] px-4 pr-9 text-sm font-medium text-[#191c1d] outline-none`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#625e58]"
      />
    </div>
  );
}

function EmployeeFilters({
  selectedStatus,
  selectedDesignation,
  designationOptions,
  totalEmployees,
  startIndex,
  endIndex,
  onStatusChange,
  onDesignationChange,
}: EmployeeFiltersProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[rgba(194,201,181,0.3)] bg-white p-[17px]">
      <div className="flex items-center gap-3">
        <FilterSelect
          label="Filter employees by status"
          value={selectedStatus}
          options={["All Status", "Active", "On Leave", "Probation"]}
          onChange={(value) =>
            onStatusChange(value as "All Status" | EmployeeStatus)
          }
          width="w-[136px]"
        />
        <FilterSelect
          label="Filter employees by designation"
          value={selectedDesignation}
          options={["All Designations", ...designationOptions]}
          onChange={onDesignationChange}
          width="w-[190px]"
        />
      </div>

      <p className="text-[13px] font-medium tracking-[0.65px] text-[#625e58]">
        {totalEmployees === 0
          ? "Showing 0 employees"
          : `Showing ${startIndex + 1}-${endIndex} of ${totalEmployees} employees`}
      </p>
    </div>
  );
}

export default EmployeeFilters;
