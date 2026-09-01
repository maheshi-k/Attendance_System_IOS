import {
  CalendarCheck2,
  ClipboardList,
  Clock3,
  FilePlus2,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getMyLeaveHistory } from "../../services/leave.service";
import type { LeaveRequest } from "../../types/leaves";
import LeaveRequestForm from "./LeaveRequestForm";

const summaryCards = [
  {
    label: "Total Annual Leave",
    value: "24",
    unit: "Days",
    icon: CalendarCheck2,
    iconClass: "bg-[#e8f7e8] text-[#4a9654]",
  },
  {
    label: "Remaining Balance",
    value: "12",
    unit: "Days",
    icon: WalletCards,
    iconClass: "bg-[#e8f7e8] text-[#4a9654]",
    valueClass: "text-[#29682e]",
  },
  {
    label: "Approved Requests",
    value: "8",
    unit: "Requests",
    icon: ClipboardList,
    iconClass: "bg-[#e8f7e8] text-[#4a9654]",
  },
  {
    label: "Pending Requests",
    value: "2",
    unit: "Awaiting",
    icon: Clock3,
    iconClass: "bg-[#e8efea] text-[#718078]",
  },
];

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-[#d8f4d8] text-[#398243]";
    case "rejected":
      return "bg-[#dfe5f5] text-[#56698f]";
    default:
      return "bg-[#ffd9d6] text-[#b84d49]";
  }
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));

function MyLeaveRequests() {
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getMyLeaveHistory().then((requests) => {
      if (isMounted) setLeaveHistory(requests);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="flex min-h-full flex-col gap-8 overflow-y-auto bg-[#f8f9f7] px-6 pb-12 pt-10 md:px-8">
      {/* <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-base font-bold text-[#3c6a00]">
          My Leave Requests
        </h1>
        <button
          type="button"
          onClick={() => setIsLeaveFormOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--button-soft)] px-6 py-3 text-sm font-bold text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#315800]"
        >
          <FilePlus2 size={16} strokeWidth={2.2} />
          Request Leave
        </button>
      </div> */}
      <div className="flex flex-col items-start bg-[#f5f7f4] justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-[20px] font-semibold tracking-[-0.04em] text-[#1f241f]">
          Leave Management
        </h1>
        <button
          type="button"
          onClick={() => setIsLeaveFormOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--button-soft)] px-6 py-3 text-sm font-bold text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition hover:bg-[#315800]"
        >
          <FilePlus2 size={16} strokeWidth={2.2} />
          Request Leave
        </button>
      </div>
      {isLeaveFormOpen && (
        <LeaveRequestForm
          onClose={() => setIsLeaveFormOpen(false)}
          onSaved={() => {
            getMyLeaveHistory().then(setLeaveHistory);
          }}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="flex min-h-[112px] flex-col justify-between rounded-[14px] border border-[#dfe7db] bg-[#f5f6f1] p-4 shadow-[0_0_0_1px_rgba(191,201,182,0.18)]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#41493e]">
                  {card.label}
                </p>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
                >
                  <Icon size={18} strokeWidth={2} />
                </span>
              </div>
              <div className="flex items-end gap-3">
                <span
                  className={`text-4xl font-bold leading-none text-[#151c27] ${card.valueClass ?? ""}`}
                >
                  {card.value}
                </span>
                <span className="pb-1 text-sm text-[#41493e]">{card.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[18px] border border-[#dfe7db] bg-[#f4f5f2] p-5 shadow-[0_0_0_1px_rgba(191,201,182,0.18)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-[22px] font-semibold tracking-[-0.04em] text-[#1a1d1a]">
            Recent Leave History
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
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Total Days</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((row) => (
                <tr
                  key={row.leave_request_id}
                  className="border-t border-[#e4e7e1] text-sm text-[#1b1d1c]"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7eae3] text-xs font-bold text-[#485850]">
                        {row.leave_type_name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                      <span className="font-medium">{row.leave_type_name}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-[#4d5852]">
                    {formatDate(row.start_date)}
                  </td>
                  <td className="px-4 py-4 text-[#4d5852]">
                    {formatDate(row.end_date)}
                  </td>
                  <td className="px-4 py-4 text-[#4d5852]">{row.total_days}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      aria-label={`View ${row.leave_type_name} leave request details`}
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

export default MyLeaveRequests;
