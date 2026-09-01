import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Search,
  Trash2,
} from "lucide-react";

const summaryCards = [
  {
    label: "Total Leave Types",
    value: "12",
    note: "Configured",
    tone: "bg-[#f7f9f6]",
    icon: "✓",
    iconBg: "bg-[#edf4ea] text-[#6e9a56]",
  },
  {
    label: "Paid Leave Types",
    value: "08",
    note: "Full salary",
    tone: "bg-[#f7f9f6]",
    icon: "◌",
    iconBg: "bg-[#edf4ea] text-[#6e9a56]",
  },
  {
    label: "Unpaid Leave Types",
    value: "04",
    note: "No deduction policy",
    tone: "bg-[#f7f9f6]",
    icon: "◍",
    iconBg: "bg-[#f9f0f0] text-[#b65d5d]",
  },
  {
    label: "Active Leave Types",
    value: "10",
    note: "Currently available",
    tone: "bg-[#edf4ea]",
    icon: "✓",
    iconBg: "bg-[#dfeee0] text-[#3f7d3a]",
  },
];

const leaveTypes = [
  {
    name: "Annual Leave",
    code: "AL",
    maxDays: "14 Days",
    paid: "PAID",
    carryForward: "Yes (Max 5)",
    status: "ACTIVE",
    statusClass: "bg-[#dff1e3] text-[#357d46]",
    icon: "✓",
    iconClass: "bg-[#eef7ef] text-[#6f9b5d]",
  },
  {
    name: "Sick Leave",
    code: "SL",
    maxDays: "07 Days",
    paid: "PAID",
    carryForward: "No",
    status: "ACTIVE",
    statusClass: "bg-[#dff1e3] text-[#357d46]",
    icon: "+",
    iconClass: "bg-[#fff0eb] text-[#cc6d4d]",
  },
  {
    name: "Casual Leave",
    code: "CL",
    maxDays: "05 Days",
    paid: "PAID",
    carryForward: "No",
    status: "ACTIVE",
    statusClass: "bg-[#dff1e3] text-[#357d46]",
    icon: "◌",
    iconClass: "bg-[#edf3ff] text-[#4a7cc3]",
  },
  {
    name: "Unpaid Leave",
    code: "UL",
    maxDays: "No Limit",
    paid: "UNPAID",
    carryForward: "No",
    status: "ACTIVE",
    statusClass: "bg-[#dff1e3] text-[#357d46]",
    icon: "○",
    iconClass: "bg-[#f3f3f3] text-[#7d7d7d]",
  },
  {
    name: "Sabbatical Leave",
    code: "SBL",
    maxDays: "30 Days",
    paid: "PAID",
    carryForward: "No",
    status: "INACTIVE",
    statusClass: "bg-[#f3f3f3] text-[#666666]",
    icon: "✦",
    iconClass: "bg-[#f0f0f0] text-[#868686]",
  },
];

function LeaveTypes() {
  return (
    <section className="flex min-h-full flex-col gap-6 overflow-y-auto bg-[#f6f7f4] p-8">
      <div className="flex items-center justify-between gap-4 bg-[#f5f7f4] p-3">
        <div className="flex items-center gap-3">
          <h1 className="text-[20px] font-semibold tracking-[-0.04em] text-[#1f241f]">
            Leave Types
          </h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-[14px] border border-[#dfe7db] p-4 ${card.tone}`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5f6857]">
                {card.label}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${card.iconBg}`}
              >
                {card.icon}
              </span>
            </div>
            <div className="mt-5 text-[28px] font-semibold tracking-[-0.06em] text-[#1f241f]">
              {card.value}
            </div>
            <div className="mt-2 flex items-center gap-2 text-[12px] text-[#4d5f4b]">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#73b569]" />
              <span>{card.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[18px] border border-[#dfe7db] bg-[#f4f5f2] p-5 shadow-[0_0_0_1px_rgba(191,201,182,0.18)]">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-[420px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666d66]"
              size={16}
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Search by name or code..."
              className="h-11 w-full rounded-[12px] border border-[#dfe1dc] bg-[#f0f3ed] pl-10 pr-4 text-sm text-[#1f241f] outline-none placeholder:text-[#7a7f7a]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-[12px] border border-[#dfe1dc] bg-[#f3f4f1] px-3 py-2 text-sm text-[#3b433a]"
            >
              <span className="flex items-center gap-2">
                <Circle size={14} strokeWidth={2} /> Status
              </span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-[12px] border border-[#dfe1dc] bg-[#f3f4f1] px-3 py-2 text-sm text-[#3b433a]"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck2 size={14} strokeWidth={2} /> Payment Type
              </span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-[12px] bg-[var(--button-soft)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(96,150,70,0.24)] transition hover:bg-[#5f8e4d]"
            >
              <span className="text-lg leading-none">+</span>
              Add Leave Type
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#dfe7db] bg-[#f7f8f5]">
          <table className="min-w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="bg-[#edf3eb] text-[11px] font-bold uppercase tracking-[0.12em] text-[#5d6858]">
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Maximum Days</th>
                <th className="px-4 py-3">Paid / Unpaid</th>
                <th className="px-4 py-3">Carry Forward</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.map((leaveType) => (
                <tr
                  key={leaveType.code}
                  className="border-t border-[#e3e7e0] text-sm text-[#1d231d]"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${leaveType.iconClass}`}
                      >
                        {leaveType.icon}
                      </span>
                      <span className="font-semibold">{leaveType.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-[#4f5850]">
                    {leaveType.code}
                  </td>
                  <td className="px-4 py-4 font-medium text-[#4f5850]">
                    {leaveType.maxDays}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${leaveType.paid === "PAID" ? "bg-[#e7f3e4] text-[#3d7f4a]" : "bg-[#f9ebeb] text-[#b04f4f]"}`}
                    >
                      {leaveType.paid}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-[#4f5850]">
                    {leaveType.carryForward}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${leaveType.statusClass}`}
                    >
                      {leaveType.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-[#4f5850]">
                      <button
                        type="button"
                        className="rounded-full p-1.5 hover:bg-[#eef1ed]"
                        aria-label={`Edit ${leaveType.name}`}
                      >
                        <CalendarCheck2 size={14} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="rounded-full p-1.5 hover:bg-[#eef1ed]"
                        aria-label={`View ${leaveType.name}`}
                      >
                        <Search size={14} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="rounded-full p-1.5 hover:bg-[#eef1ed]"
                        aria-label={`Delete ${leaveType.name}`}
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#dfe7db] pt-4 text-sm text-[#586159] md:flex-row md:items-center md:justify-between">
          <span>Showing 1-10 of 12 types</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#dfe1dc] bg-white text-[#495a44]"
            >
              <ChevronLeft size={15} strokeWidth={2} />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${
                  page === 1
                    ? "bg-[#709c58] text-white"
                    : "border border-[#dfe1dc] bg-white text-[#495a44]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#dfe1dc] bg-white text-[#495a44]"
            >
              <ChevronRight size={15} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeaveTypes;
