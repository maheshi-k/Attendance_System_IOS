import { useEffect, useMemo, useState } from "react";

import { getSelfAttendance } from "../services/attendance.service";
import type { EmployeeAttendanceRecord } from "../types/attendance.types";

import AttendanceHistoryFilter, {
  type AttendanceHistoryFilter as HistoryFilterType,
} from "../components/attendance/AttendanceHistoryFilter";

import {
  calculateTotalHours,
  formatDateKey,
  getCheckInTimeColor,
  getCurrentMonth,
  getDateKey,
  getMonthRange,
  getStatusBadgeColor,
  getStatusTextColor,
  getWeekRange,
} from "../utils/attendance.utils";
import imgClock from "../assets/imgClock.svg";

function AttendanceHistory() {
  const [records, setRecords] = useState<EmployeeAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState<HistoryFilterType>("today");

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        const data = await getSelfAttendance();

        setRecords(data.records ?? []);
      } catch (error) {
        console.error("Failed to load attendance records:", error);

        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  const filteredRecords = useMemo(() => {
    if (!records.length) {
      return [];
    }

    const now = new Date();

    let startKey: string;
    let endKey: string;

    if (filter === "today") {
      const today = formatDateKey(now);

      startKey = today;
      endKey = today;
    } else if (filter === "weekly") {
      const weekRange = getWeekRange(now);

      startKey = weekRange.startKey;
      endKey = weekRange.endKey;
    } else {
      const monthRange = getMonthRange(selectedMonth);

      startKey = monthRange.startKey;
      endKey = monthRange.endKey;
    }

    return records
      .filter((record) => {
        const recordKey = getDateKey(record.att_date);

        return recordKey >= startKey && recordKey <= endKey;
      })
      .sort((a, b) => {
        return getDateKey(b.att_date).localeCompare(getDateKey(a.att_date));
      });
  }, [records, filter, selectedMonth]);

  return (
    <div className="relative m-2 min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <div className="pb-32 pt-6">
        <main className="mx-auto flex w-full max-w-[672px] flex-col gap-4 px-4">
          <h1 className="text-[25px] font-semibold leading-[34px]">
            Attendance History
          </h1>

          <AttendanceHistoryFilter
            value={filter}
            selectedMonth={selectedMonth}
            onChange={setFilter}
            onMonthChange={setSelectedMonth}
          />

          {loading ? (
            <LoadingState />
          ) : filteredRecords.length === 0 ? (
            <EmptyState />
          ) : (
            <AttendanceRecordList records={filteredRecords} />
          )}
        </main>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex h-40 items-center justify-center">
      <p className="text-sm text-[#625e58]">Loading attendance records...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[12px] border border-[#e4e7df] bg-white p-8 text-center">
      <p className="text-sm text-[#625e58]">
        No attendance records found for this period.
      </p>
    </div>
  );
}

function AttendanceRecordList({
  records,
}: {
  records: EmployeeAttendanceRecord[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {records.map((record) => (
        <AttendanceRecordCard key={record.att_id} record={record} />
      ))}
    </div>
  );
}

function AttendanceRecordCard({
  record,
}: {
  record: EmployeeAttendanceRecord;
}) {
  const attendanceDate = new Date(`${getDateKey(record.att_date)}T00:00:00`);

  const day = attendanceDate.toLocaleDateString("en-US", {
    day: "2-digit",
  });

  const month = attendanceDate.toLocaleDateString("en-US", {
    month: "short",
  });

  const weekday = attendanceDate.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const totalHours = calculateTotalHours(record.check_in, record.check_out);

  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-[#e4e7df] bg-white px-3 py-3 transition-all hover:border-[#c2c9b5] hover:shadow-sm sm:gap-4 sm:px-4">
      <div className="flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-[10px] bg-[#f1f4eb]">
        <p className="text-[17px] font-semibold leading-[19px]">{day}</p>

        <p className="text-[9px] font-semibold uppercase tracking-[0.5px] text-[#625e58]">
          {month}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold">{weekday}</p>

          <span className="h-1 w-1 rounded-full bg-[#c2c9b5]" />

          <p className="truncate text-[11px] text-[#7a766f]">Attendance</p>
        </div>

        <div className="mt-1 flex flex-col gap-0.5 text-[11px] sm:flex-row sm:items-center sm:gap-3">
          <span className="text-[#625e58]">
            <span className="font-medium">In</span>{" "}
            <span className={getCheckInTimeColor(record.status)}>
              {record.check_in || "--:--"}
            </span>
          </span>

          <span className="hidden text-[#c2c9b5] sm:inline">|</span>

          <span className="text-[#625e58]">
            <span className="font-medium">Out</span>{" "}
            <span className="text-[#191c1d]">
              {record.check_out || "--:--"}
            </span>
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <div className="flex items-center gap-1.5">
          <img src={imgClock} alt="" className="h-[14px] w-[14px]" />

          <span className="text-[12px] font-semibold">{totalHours}</span>
        </div>

        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusBadgeColor(
            record.status,
          )} ${getStatusTextColor(record.status)}`}
        >
          {record.status}
        </span>
      </div>
    </div>
  );
}

export default AttendanceHistory;
