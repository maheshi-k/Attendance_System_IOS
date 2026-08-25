import { CheckCircle2, CircleAlert, CircleX, Percent } from "lucide-react";

type StatCardsProps = {
  presentCount: number;
  lateCount: number;
  absentCount: number;
  attendanceRate: number;
  loading: boolean;
};

function StatCards({
  presentCount,
  lateCount,
  absentCount,
  attendanceRate,
  loading,
}: StatCardsProps) {
  const value = (count: number) => (loading ? "-" : count);

  const cards = [
    {
      label: "Present Today",
      value: value(presentCount),
      note: "Updated just now",
      icon: CheckCircle2,
      iconClass: "bg-[#e4f0db] text-[#4d7b1b]",
    },
    {
      label: "Late Today",
      value: value(lateCount),
      note: "Needs attention",
      icon: CircleAlert,
      iconClass: "bg-[#ffe1df] text-[#ba1a1a]",
    },
    {
      label: "Absent",
      value: value(absentCount),
      note: "Including approved leave",
      icon: CircleX,
      iconClass: "bg-[#e8e9e9] text-[#625e58]",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map(({ label, value: cardValue, note, icon: Icon, iconClass }) => (
        <div
          key={label}
          className="flex min-h-[108px] items-start justify-between rounded-2xl border border-[var(--border-muted)] bg-white p-5"
        >
          <div>
            <p className="text-xs font-medium tracking-[0.3px] text-[var(--text-primary-light)]">
              {label}
            </p>
            <p className="mt-2 text-[28px] font-medium leading-8 text-[var(--text-primary-dark)]">
              {cardValue}
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[var(--secondary-muted)]">
              {note}
            </p>
          </div>
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}
          >
            <Icon size={19} strokeWidth={2} />
          </span>
        </div>
      ))}
      <div className="flex min-h-[108px] items-start justify-between rounded-2xl border border-[#b9cda7] bg-[#eff5ea] p-5">
        <div>
          <p className="text-xs font-medium tracking-[0.3px] text-[#315d08]">
            Attendance Rate
          </p>
          <p className="mt-2 text-[28px] font-medium leading-8 text-[#315d08]">
            {loading ? "-" : `${attendanceRate.toFixed(1)}%`}
          </p>
          <div className="mt-3 h-1.5 w-[106px] overflow-hidden rounded-full bg-[#d3dfca]">
            <div
              className="h-full rounded-full bg-[#416900] transition-all"
              style={{ width: `${Math.min(100, attendanceRate)}%` }}
            />
          </div>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#dcebd2] text-[#315d08]">
          <Percent size={19} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}

export default StatCards;
