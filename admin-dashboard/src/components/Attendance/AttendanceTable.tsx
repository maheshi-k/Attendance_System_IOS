import { MapPin, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import type { AttendanceRecord } from "../../types/attendance";

type AttendanceTableProps = {
  records: AttendanceRecord[];
  loading: boolean;
  error: string;
  canEdit: boolean;
  onEdit: (record: AttendanceRecord) => void;
};

const initials = (record: AttendanceRecord) =>
  `${record.first_name?.charAt(0) ?? ""}${record.last_name?.charAt(0) ?? ""}`;

function AttendanceTable({
  records,
  loading,
  error,
  canEdit,
  onEdit,
}: AttendanceTableProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[var(--border-muted)] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full table-fixed border-collapse">
          <thead className="bg-[#f1f7ea] text-left text-[10px] font-bold uppercase tracking-[0.7px] text-[#416900]">
            <tr>
              <th className="w-[18%] px-4 py-4">Employee</th>
              <th className="w-[10%] px-4 py-4">Emp ID</th>
              <th className="w-[10%] px-4 py-4">Check In</th>
              <th className="w-[10%] px-4 py-4">Check Out</th>
              <th className="w-[10%] px-4 py-4">Hours</th>
              <th className="w-[9%] px-4 py-4">Status</th>
              <th className="w-[15%] px-4 py-4">Location</th>
              <th className="w-[5%] px-4 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm text-[#625e58]"
                >
                  Loading attendance...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm text-red-600"
                >
                  {error}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm text-[#625e58]"
                >
                  No attendance records found
                </td>
              </tr>
            ) : (
              groupAttendanceByDate(records).map(([date, dateRecords]) => (
                <AttendanceDateGroup
                  key={date}
                  date={date}
                  recordCount={dateRecords.length}
                >
                  {dateRecords.map((record) => (
                    <tr
                      key={record.att_id}
                      className="border-t border-[#eeeae9] text-sm text-[#1c1b1b]"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {record.profile_photo ? (
                            <img
                              src={record.profile_photo}
                              alt=""
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e5e2e1] text-xs font-bold text-[#43493a]">
                              {initials(record)}
                            </span>
                          )}
                          <div>
                            <p className="font-bold">
                              {record.first_name} {record.last_name}
                            </p>
                            <p className="text-xs text-[#817c78]">
                              {record.designation || "Employee"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-[#625e58]">
                        #{record.emp_code}
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {record.check_in ? (
                          <>
                            <span>{record.check_in.slice(0, 5)}</span>
                            {/* <span className="block text-[10px] uppercase text-[#625e58]">
                              On time
                            </span> */}
                          </>
                        ) : (
                          <span className="text-xs uppercase text-[#aaa5a1]">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        {record.check_out ? (
                          record.check_out.slice(0, 5)
                        ) : (
                          <span className="text-xs font-bold uppercase text-[#a15c00]">
                            Open
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs">
                        {record.check_in && record.check_out
                          ? calculateHours(record.check_in, record.check_out)
                          : record.check_in && isToday(record.att_date)
                            ? `${formatOpenHours(record.check_in, currentTime)} active`
                            : "Open session"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${statusClass(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-[#625e58]">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} />
                          {record.location || "Main Office"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-[#625e58]">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            disabled={!canEdit}
                            // aria-label={`Edit ${employee.first_name}`}
                            title="Edit"
                            onClick={() => onEdit(record)}
                            className={`rounded-lg p-2 text-[#625e58] transition hover:bg-[#f3f4f5]${
                              !canEdit ? " cursor-not-allowed opacity-50" : ""
                            }`}
                          >
                            <Pencil size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </AttendanceDateGroup>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type AttendanceDateGroupProps = {
  date: string;
  recordCount: number;
  children: React.ReactNode;
};

function AttendanceDateGroup({
  date,
  recordCount,
  children,
}: AttendanceDateGroupProps) {
  return (
    <>
      <tr className="border-t-2 border-[#dcd9d9] bg-[#faf8f7]">
        <td colSpan={8} className="px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.8px] text-[#416900]">
              {formatAttendanceDate(date)}
            </h3>
            <span className="text-xs font-medium text-[#625e58]">
              {recordCount} {recordCount === 1 ? "record" : "records"}
            </span>
          </div>
        </td>
      </tr>
      {children}
    </>
  );
}

function groupAttendanceByDate(records: AttendanceRecord[]) {
  const groups = new Map<string, AttendanceRecord[]>();

  records.forEach((record) => {
    const date = record.att_date.slice(0, 10);
    const group = groups.get(date) ?? [];
    group.push(record);
    groups.set(date, group);
  });

  return Array.from(groups.entries());
}

function formatAttendanceDate(date: string) {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

function calculateHours(checkIn: string, checkOut: string) {
  const [inHours, inMinutes] = checkIn.split(":").map(Number);
  const [outHours, outMinutes] = checkOut.split(":").map(Number);
  const minutes = Math.max(
    0,
    outHours * 60 + outMinutes - inHours * 60 - inMinutes,
  );
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}h ${String(minutes % 60).padStart(2, "0")}m`;
}

function isToday(dateValue: string) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return dateValue.slice(0, 10) === todayKey;
}

function formatOpenHours(checkIn: string, now: Date) {
  const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
  const checkInTotal = checkInHours * 60 + checkInMinutes;
  const workingStart = 9 * 60;
  const workingEnd = 18 * 60;
  const currentTotal = now.getHours() * 60 + now.getMinutes();
  const elapsed = Math.max(
    0,
    Math.min(currentTotal, workingEnd) - Math.max(checkInTotal, workingStart),
  );

  return `${String(Math.floor(elapsed / 60)).padStart(2, "0")}h ${String(elapsed % 60).padStart(2, "0")}m`;
}

function statusClass(status: string) {
  if (status === "Late") return "bg-[#fff0d1] text-[#a15c00]";
  if (status === "Absent") return "bg-[#ffdad6] text-[#93000a]";
  if (status === "On Leave") return "bg-[#e1e9f3] text-[#24527a]";
  return "bg-[#e4f0db] text-[#416900]";
}

export default AttendanceTable;
