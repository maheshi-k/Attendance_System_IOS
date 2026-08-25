import { Download, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { AttendanceRecord } from "../types/attendance";

type RecentAttendanceProps = {
  records: AttendanceRecord[];
  loading: boolean;
};

function RecentAttendance({ records, loading }: RecentAttendanceProps) {
  const [status, setStatus] = useState("All Status");
  const recentRecords = useMemo(
    () =>
      records
        .filter((record) => status === "All Status" || record.status === status)
        .sort((first, second) => second.att_date.localeCompare(first.att_date))
        .slice(0, 4),
    [records, status],
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary-dark)]">
            Recent Attendance
          </h2>
          <p className="mt-1 text-xs text-[var(--text-primary-light)]">
            Live monitoring of employee check-ins/outs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative">
            <SlidersHorizontal
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
            />
            <select
              aria-label="Filter recent attendance by status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-[205px] appearance-none rounded-lg border border-[var(--border-dashed)] bg-[#f8f9fa] pl-9 pr-8 text-xs font-semibold text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
            >
              <option>All Status</option>
              <option>Present</option>
              <option>Late</option>
              <option>Absent</option>
              <option>On Leave</option>
            </select>
          </label>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border-dashed)] px-3 text-xs font-semibold text-[var(--text-primary-dark)] transition hover:bg-[#f5f7f4]"
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full table-fixed border-collapse">
          <thead className="bg-[#f3f4f4] text-left text-[10px] font-bold uppercase tracking-[0.7px] text-[var(--text-primary-light)]">
            <tr>
              <th className="w-[23%] px-5 py-3">Employee</th>
              <th className="w-[15%] px-4 py-3">Employee ID</th>
              <th className="w-[13%] px-4 py-3">Check In</th>
              <th className="w-[13%] px-4 py-3">Check Out</th>
              <th className="w-[14%] px-4 py-3">Working Hours</th>
              <th className="w-[12%] px-4 py-3">Status</th>
              <th className="w-[10%] px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-[var(--text-primary-light)]"
                >
                  Loading attendance...
                </td>
              </tr>
            ) : recentRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-[var(--text-primary-light)]"
                >
                  No attendance records found
                </td>
              </tr>
            ) : (
              recentRecords.map((record) => (
                <tr
                  key={record.att_id}
                  className="border-t border-[#eeeae9] text-sm text-[var(--text-primary-dark)]"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {record.profile_photo ? (
                        <img
                          src={record.profile_photo}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e4f0db] text-[10px] font-bold text-[#416900]">
                          {record.first_name[0]}
                          {record.last_name[0]}
                        </span>
                      )}
                      <div>
                        <p className="font-bold">
                          {record.first_name} {record.last_name}
                        </p>
                        <p className="text-[11px] text-[var(--text-primary-light)]">
                          {record.designation || "Employee"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-[var(--text-primary-light)]">
                    #{record.emp_code}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${record.status === "Late" ? "text-[#ba1a1a]" : ""}`}
                  >
                    {record.check_in ? record.check_in.slice(0, 5) : "--:--"}
                  </td>
                  <td className="px-4 py-3">
                    {record.check_out ? record.check_out.slice(0, 5) : "--:--"}
                  </td>
                  <td className="px-4 py-3">{workingHours(record)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ${statusClass(record.status)}`}
                    >
                      {record.status === "On Leave"
                        ? "ON LEAVE"
                        : record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-primary-light)]">
                    {formatDate(record.att_date)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-4 text-[10px] text-[var(--text-primary-light)]">
        Showing {recentRecords.length} of {records.length} employees
      </div>
    </section>
  );
}

function statusClass(status: string) {
  if (status === "Present") return "bg-[#e4f0db] text-[#416900]";
  if (status === "Late") return "bg-[#ffe1df] text-[#ba1a1a]";
  if (status === "Absent") return "bg-[#e8e9e9] text-[#625e58]";
  return "bg-[#fff0d1] text-[#a15c00]";
}

function workingHours(record: AttendanceRecord) {
  if (!record.check_in || !record.check_out) return "--";
  const [inHours, inMinutes] = record.check_in.split(":").map(Number);
  const [outHours, outMinutes] = record.check_out.split(":").map(Number);
  const minutes = Math.max(
    0,
    outHours * 60 + outMinutes - inHours * 60 - inMinutes,
  );
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default RecentAttendance;
