import {
  ArrowRight,
  CalendarCheck2,
  CircleCheckBig,
  CircleX,
  Clock3,
  Download,
  FileText,
  Plus,
  TextSearch,
} from "lucide-react";

const summaryCards = [
  {
    label: "Total Leave Requests",
    value: "124",
    note: "8% this month",
    accent: "text-[#495c3b]",
    badge: "bg-[#f1f6eb]",
    icon: TextSearch,
    iconClass: "text-[#3d5b2b]",
  },
  {
    label: "Pending Approval",
    value: "18",
    note: "Requires action",
    accent: "text-[#495c3b]",
    badge: "bg-[#f4f4f4]",
    icon: Clock3,
    iconClass: "text-[#d08c2e]",
  },
  {
    label: "Approved Leaves",
    value: "92",
    note: "Processed",
    accent: "text-[#2b5d2d]",
    badge: "bg-[#edf7ee]",
    icon: CircleCheckBig,
    iconClass: "text-[#2b8b50]",
  },
  {
    label: "Rejected Leaves",
    value: "14",
    note: "Needs review",
    accent: "text-[#8f4d4d]",
    badge: "bg-[#f5ebee]",
    icon: CircleX,
    iconClass: "text-[#ba4d4d]",
  },
];

const leaveRows = [
  {
    employee: "John Doe",
    employeeId: "EMP-2024-081",
    type: "Sick Leave",
    start: "Oct 14, 2023",
    end: "Oct 16, 2023",
    total: "03",
    status: "Pending",
    color: "bg-[#f4d9c7] text-[#b45b1a]",
  },
  {
    employee: "Alice Smith",
    employeeId: "EMP-2024-085",
    type: "Annual Leave",
    start: "Oct 12, 2023",
    end: "Oct 20, 2023",
    total: "09",
    status: "Approved",
    color: "bg-[#dff4df] text-[#1e8d57]",
  },
  {
    employee: "Robert Johnson",
    employeeId: "EMP-2024-812",
    type: "Casual Leave",
    start: "Oct 10, 2023",
    end: "Oct 11, 2023",
    total: "01",
    status: "Rejected",
    color: "bg-[#f7ded7] text-[#b03a2f]",
  },
];

const actionButtons = [
  {
    label: "Approve Requests",
    icon: CalendarCheck2,
    tone: "bg-[#f4f2f0] text-[#1f2d1a]",
  },
  {
    label: "Leave Calendar",
    icon: FileText,
    tone: "bg-[#f4f2f0] text-[#1f2d1a]",
  },
  {
    label: "Export Report",
    icon: Download,
    tone: "bg-[#f4f2f0] text-[#1f2d1a]",
  },
];

function LeaveRequests() {
  return (
    <section className="flex min-h-full flex-col gap-6 overflow-y-auto bg-[#f8f9f7] p-8">
      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:col-span-1">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="flex min-h-[128px] flex-col justify-between rounded-[14px] border border-[#dfe7db] bg-[#f5f6f1] p-4 shadow-[0_0_0_1px_rgba(191,201,182,0.18)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5d6858]">
                    {card.label}
                  </p>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${card.badge}`}
                  >
                    <Icon
                      className={`h-4 w-4 ${card.iconClass}`}
                      strokeWidth={2.2}
                    />
                  </span>
                </div>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-[26px] font-semibold leading-none text-[#1b1d1c]">
                    {card.value}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[12px] text-[#5a6756]">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#75b55f]" />
                  <span>{card.note}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-[14px] border border-[#dfe7db] bg-[#f4f6f2] p-4 shadow-[0_0_0_1px_rgba(191,201,182,0.18)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5d6858]">
                Employees on
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5d6858]">
                Leave Today
              </p>
            </div>
            <span className="text-[20px] font-semibold text-[#d05f5f]">05</span>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-[10px] bg-[#f0f2ee] px-3 py-2 text-[12px] font-medium text-[#2a3129]">
            <span>View List</span>
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
        <div className="rounded-[18px] border border-[#dfe7db] bg-[#f4f5f2] p-5 shadow-[0_0_0_1px_rgba(191,201,182,0.18)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-[#1a1d1a]">
              Monthly Leave Requests
            </h2>
            <div className="flex items-center gap-2 rounded-full border border-[#d7ddd3] bg-[#f1f4f0] p-1">
              {[
                { label: "1Y", active: false },
                { label: "6M", active: true },
                { label: "Current", active: false },
              ].map((toggle) => (
                <button
                  key={toggle.label}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                    toggle.active
                      ? "bg-[#70a65e] text-white shadow-sm"
                      : "text-[#495a44]"
                  }`}
                >
                  {toggle.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[12px] border border-[#e1e6de] bg-[#f3f4f1] p-2">
            <svg
              viewBox="0 0 760 260"
              className="h-[260px] w-full"
              role="img"
              aria-label="Monthly leave requests chart"
            >
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a8c79c" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#a8c79c" stopOpacity="0.06" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3].map((line) => (
                <line
                  key={line}
                  x1="0"
                  x2="760"
                  y1={40 + line * 55}
                  y2={40 + line * 55}
                  stroke="#dfe6da"
                  strokeDasharray="4 5"
                />
              ))}

              <path
                d="M0 160 C95 120, 130 80, 180 110 S300 190, 365 140 S475 70, 520 115 S630 160, 760 90 L760 260 L0 260 Z"
                fill="url(#chartFill)"
              />

              <path
                d="M0 160 C95 120, 130 80, 180 110 S300 190, 365 140 S475 70, 520 115 S630 160, 760 90"
                fill="none"
                stroke="#6fa85f"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {[
                "OCT",
                "NOV",
                "DEC",
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
              ].map((month, index) => {
                const x = 56 + index * 58;
                return (
                  <g key={month} transform={`translate(${x}, 220)`}>
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#696f68"
                    >
                      {month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {actionButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.label}
                type="button"
                className={`flex min-h-[90px] flex-col items-center justify-center gap-3 rounded-[14px] border border-[#dfe7db] ${button.tone} shadow-[0_0_0_1px_rgba(191,201,182,0.18)] transition hover:bg-[#eef3eb]`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f3ee]">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span className="text-sm font-semibold text-[#1d2a1c]">
                  {button.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[18px] border border-[#dfe7db] bg-[#f4f5f2] p-5 shadow-[0_0_0_1px_rgba(191,201,182,0.18)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-[22px] font-semibold tracking-[-0.04em] text-[#1a1d1a]">
            Recent Leave Requests
          </h3>
          <button
            type="button"
            className="text-[15px] font-semibold text-[#4d7a39]"
          >
            View All →
          </button>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#dfe7db]">
          <table className="min-w-full border-collapse bg-[#f9faf7] text-left text-[12px]">
            <thead>
              <tr className="bg-[#eef4ea] text-[11px] font-bold uppercase tracking-[0.12em] text-[#5d6858]">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Total Days</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRows.map((row, index) => (
                <tr
                  key={`${row.employeeId}-${index}`}
                  className="border-t border-[#e4e7e1] text-sm text-[#1b1d1c]"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7eae3] text-xs font-bold text-[#485850]">
                        {row.employee
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <span className="font-medium">{row.employee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#4d5852]">{row.employeeId}</td>
                  <td className="px-4 py-4 text-[#4d5852]">{row.type}</td>
                  <td className="px-4 py-4 text-[#4d5852]">{row.start}</td>
                  <td className="px-4 py-4 text-[#4d5852]">{row.end}</td>
                  <td className="px-4 py-4 text-[#4d5852]">{row.total}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${row.color}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      aria-label={`View ${row.employee}`}
                      className="text-base text-[#5a6756]"
                    >
                      •
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default LeaveRequests;
