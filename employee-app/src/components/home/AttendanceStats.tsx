const stats = [
  { key: "present_days", label: "On Time Days", active: true },
  { key: "late_days", label: "Late Days", active: false },
  { key: "absent_days", label: "Absent Days", active: false },
] as const;

type AttendanceStatsProps = {
  stats: Record<(typeof stats)[number]["key"], number>;
};

function AttendanceStats({ stats: counts }: AttendanceStatsProps) {
  return (
    <section className="grid grid-cols-3 gap-3 text-center">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-lg border p-4 ${
            stat.active
              ? "border-[rgba(124,179,66,0.2)] bg-[rgba(124,179,66,0.1)]"
              : "border-[rgba(194,201,181,0.3)] bg-[#edeeef]"
          }`}
        >
          <p
            className={`text-2xl font-semibold leading-8 ${stat.active ? "text-[var(--text-secondary-dark)]" : "text-[var(--text-primary)]"}`}
          >
            {String(counts[stat.key]).padStart(2, "0")}
          </p>
          <p
            className={`text-xs leading-[18px] ${stat.active ? "text-[var(--text-secondary-dark)]" : "text-[#67625c]"}`}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </section>
  );
}

export default AttendanceStats;
