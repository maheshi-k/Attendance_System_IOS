import { UserPlus } from "lucide-react";
import type { ReactNode } from "react";

type EmployeeHeaderProps = {
  exportAction: ReactNode;
  onAddEmployee: () => void;
};

function EmployeeHeader({ exportAction, onAddEmployee }: EmployeeHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-6 pb-2 flex-col md:flex-row">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[var(--text-primary-dark)]">
          Employee Directory
        </h1>
        <p className="text-base leading-6 text-[var(--text-primary-light)]">
          Manage institutional records, access levels, and QR identities.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {exportAction}

        <button
          type="button"
          onClick={onAddEmployee}
          className="flex items-center gap-2 rounded-xl bg-[#7fb249] px-6 py-2.5 text-sm font-bold text-[#234100] shadow-[0_10px_15px_-3px_rgba(127,178,73,0.1)] transition hover:bg-[#72a13f]"
        >
          <UserPlus size={16} />
          Add Employee
        </button>
      </div>
    </div>
  );
}

export default EmployeeHeader;
