import type { EmployeeStatus } from "../../types/employee";

const statusStyles: Record<EmployeeStatus, string> = {
  Active:
    "border-[rgba(124,179,66,0.2)] bg-[rgba(124,179,66,0.1)] text-[#7cb342]",

  "On Leave":
    "border-[rgba(98,94,88,0.2)] bg-[rgba(229,223,215,0.5)] text-[#625e58]",

  Probation:
    "border-[rgba(186,26,26,0.2)] bg-[rgba(255,218,214,0.5)] text-[#ba1a1a]",
};

type EmployeeStatusBadgeProps = {
  status: EmployeeStatus;
};

function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-[0.6px] ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default EmployeeStatusBadge;
