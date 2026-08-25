import { AlarmClock, UsersRound, Watch } from "lucide-react";

type AttendanceSummaryProps = {
  presentRate: number;
  averageTardiness: string;
  overtime: string;
};

function AttendanceSummary({
  presentRate,
  averageTardiness,
  overtime,
}: AttendanceSummaryProps) {
  const cards = [
    {
      label: "Average Present",
      value: `${presentRate.toFixed(1)}%`,
      note: "Current selection",
      icon: UsersRound,
      color: "bg-[#e4f0db] text-[#416900]",
    },
    {
      label: "Average Tardiness",
      value: averageTardiness,
      note: "Across late arrivals",
      icon: AlarmClock,
      color: "bg-[#fff0d1] text-[#a15c00]",
    },
    {
      label: "Total Overtime",
      value: overtime,
      note: "This billing cycle",
      icon: Watch,
      color: "bg-[#dce9ff] text-[#24527a]",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ label, value, note, icon: Icon, color }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-[var(--border-muted)] bg-white p-4"
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${color}`}
          >
            <Icon size={17} />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#817c78]">
              {label}
            </p>
            <p className="text-xl font-bold leading-6 text-[#1c1b1b]">
              {value}
            </p>
            <p className="text-[10px] text-[#625e58]">{note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AttendanceSummary;
