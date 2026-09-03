export type AttendanceHistoryFilter = "today" | "weekly" | "monthly";

type AttendanceHistoryFilterProps = {
  value: AttendanceHistoryFilter;
  selectedMonth: string;
  onChange: (value: AttendanceHistoryFilter) => void;
  onMonthChange: (value: string) => void;
};

export default function AttendanceHistoryFilter({
  value,
  selectedMonth,
  onChange,
  onMonthChange,
}: AttendanceHistoryFilterProps) {
  const options: AttendanceHistoryFilter[] = ["today", "weekly", "monthly"];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex flex-1 gap-1 rounded-[8px] bg-[#f3f4f5] p-1">
        {options.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`flex-1 rounded-[6px] px-3 py-2 text-center text-[13px] font-medium tracking-[0.65px] uppercase transition-all ${
              value === tab
                ? "bg-[#3c6a00] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                : "text-[#625e58]"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {value === "monthly" && (
        <label className="flex items-center gap-2 rounded-[8px] border border-[#dfe3dc] bg-white px-3 py-2 text-[12px] text-[#625e58] shadow-sm">
          <span className="font-medium uppercase tracking-[0.5px]">Month</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => onMonthChange(event.target.value)}
            className="rounded-[6px] border border-[#dfe3dc] bg-[#f8f9fa] px-2 py-1 text-[12px] text-[#191c1d] outline-none focus:border-[#3c6a00]"
          />
        </label>
      )}
    </div>
  );
}
