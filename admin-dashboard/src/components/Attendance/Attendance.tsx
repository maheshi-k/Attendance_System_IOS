import { FileText, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ExportData, { type ExportColumn } from "../common/ExportData";
import EmployeePagination from "../Employee/EmployeePagination";
import { getAttendance } from "../../services/attendance.service";
import { getAllEmployees } from "../../services/employee.service";
import type {
  AttendanceExportRow,
  AttendanceDateRange,
  AttendanceRecord,
  AttendanceStatus,
} from "../../types/attendance";
import type { EmployeeRecord } from "../../types/employee";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceForm from "./AttendanceForm";
import AttendanceSummary from "./AttendanceSummary";
import AttendanceTable from "./AttendanceTable";

const attendanceExportColumns: ExportColumn<AttendanceExportRow>[] = [
  { header: "Employee", value: "employee" },
  { header: "Employee ID", value: "employeeId" },
  { header: "Date", value: "date" },
  { header: "Check In", value: "checkIn" },
  { header: "Check Out", value: "checkOut" },
  { header: "Hours", value: "hours" },
  { header: "Status", value: "status" },
  { header: "Location", value: "location" },
];

const formatHours = (record: AttendanceRecord) => {
  if (!record.check_in || !record.check_out) return "00h 00m";
  const start = record.check_in.split(":").map(Number);
  const end = record.check_out.split(":").map(Number);
  const minutes = Math.max(0, end[0] * 60 + end[1] - start[0] * 60 - start[1]);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}h ${String(minutes % 60).padStart(2, "0")}m`;
};

const getWorkedMinutes = (record: AttendanceRecord): number => {
  if (!record.check_in || !record.check_out) return 0;

  const startParts = record.check_in.split(":").map(Number);
  const endParts = record.check_out.split(":").map(Number);

  const startHour = startParts[0] ?? 0;
  const startMinute = startParts[1] ?? 0;

  const endHour = endParts[0] ?? 0;
  const endMinute = endParts[1] ?? 0;

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return Math.max(0, endMinutes - startMinutes);
};

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getToday = () => toDateString(new Date());

const getAttendanceDateKey = (value: string) => {
  const trimmedValue = value.trim();
  const isoDateKey = trimmedValue.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

  if (isoDateKey) {
    return isoDateKey;
  }

  const slashDateMatch = trimmedValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);

  if (slashDateMatch) {
    const [, firstPart, secondPart, year] = slashDateMatch;
    const month = Number(firstPart);
    const day = Number(secondPart);

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return trimmedValue;
};

const isDateInRange = (date: string, from: string, to: string) => {
  const dateKey = getAttendanceDateKey(date);

  return (
    (!from || dateKey >= from) &&
    (!to || dateKey <= to) &&
    (!from || !to || from <= to)
  );
};

const getExpectedEmployeeDays = (
  employees: EmployeeRecord[],
  from: string,
  to: string,
) => {
  const end = new Date(`${to}T00:00:00`);

  return employees.reduce((expectedDays, employee) => {
    const joiningDate = employee.joining_date.slice(0, 10);
    const employeeStart = new Date(
      `${joiningDate > from ? joiningDate : from}T00:00:00`,
    );
    let employeeWorkingDays = 0;
    const current = new Date(employeeStart);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        employeeWorkingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return expectedDays + employeeWorkingDays;
  }, 0);
};

function Attendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<AttendanceDateRange>("Today");
  const [fromDate, setFromDate] = useState(() => getToday());
  const [toDate, setToDate] = useState(() => getToday());
  const [status, setStatus] = useState<"All Status" | AttendanceStatus>(
    "All Status",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [attendanceFormRecord, setAttendanceFormRecord] =
    useState<AttendanceRecord | null>(null);
  const [isAttendanceFormOpen, setIsAttendanceFormOpen] = useState(false);
  const [activeEmployees, setActiveEmployees] = useState<EmployeeRecord[]>([]);

  const OFFICE_START_HOUR = 8;
  const OFFICE_START_MINUTE = 30;

  const getTardinessMinutes = (checkIn: string | null | undefined): number => {
    if (!checkIn) return 0;

    const [hours, minutes] = checkIn.split(":").map(Number);

    const checkInMinutes = hours * 60 + minutes;
    const officeStartMinutes = OFFICE_START_HOUR * 60 + OFFICE_START_MINUTE;

    return Math.max(0, checkInMinutes - officeStartMinutes);
  };

  const loadAttendance = () => {
    setLoading(true);
    getAttendance()
      .then((response) => setRecords(response.data))
      .catch((loadError) => {
        console.error("Failed to load attendance:", loadError);
        setError("Failed to load attendance records");
        toast.error("Failed to load attendance records");
      })
      .finally(() => setLoading(false));
  };

  const handleDateRangeChange = (range: AttendanceDateRange) => {
    const today = new Date();
    const end = toDateString(today);
    let start = end;

    setToDate(end);

    if (range === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      start = toDateString(yesterday);
      setToDate(start);
    } else if (range === "This Week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      start = toDateString(weekStart);
    } else if (range === "This Month") {
      start = toDateString(new Date(today.getFullYear(), today.getMonth(), 1));
    } else if (range === "Custom") {
      setDateRange(range);
      setCurrentPage(1);
      return;
    }

    setFromDate(start);
    setDateRange(range);
    setCurrentPage(1);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [attendanceResponse, employeeResponse] = await Promise.all([
          getAttendance(),
          getAllEmployees(),
        ]);

        setRecords(attendanceResponse.data);
        setActiveEmployees(employeeResponse.data);
      } catch (loadError) {
        console.error("Failed to load attendance data:", loadError);
        setError("Failed to load attendance records");
        toast.error("Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const text =
          `${record.first_name} ${record.last_name} ${record.emp_code}`.toLowerCase();
        const date = getAttendanceDateKey(record.att_date);
        return (
          text.includes(search.toLowerCase()) &&
          isDateInRange(date, fromDate, toDate) &&
          (status === "All Status" || record.status === status)
        );
      }),
    [records, search, fromDate, toDate, status],
  );

  const summaryRecords = useMemo(
    () =>
      records.filter((record) => {
        const date = getAttendanceDateKey(record.att_date);

        return isDateInRange(date, fromDate, toDate);
      }),
    [records, fromDate, toDate],
  );

  const expectedEmployeeDays = useMemo(
    () => getExpectedEmployeeDays(activeEmployees, fromDate, toDate),
    [activeEmployees, fromDate, toDate],
  );

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const safeCurrentPage = totalPages ? Math.min(currentPage, totalPages) : 1;
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredRecords.length);
  const currentRecords = filteredRecords.slice(startIndex, endIndex);
  const exportData = filteredRecords.map((record) => ({
    employee: `${record.first_name} ${record.last_name}`,
    employeeId: record.emp_code,
    date: record.att_date.slice(0, 10),
    checkIn: record.check_in || "Pending",
    checkOut: record.check_out || "Pending",
    hours: formatHours(record),
    status: record.status,
    location: record.location || "Main Office",
  }));
  const attendedCount = summaryRecords.filter(
    (record) => record.status === "Present" || record.status === "Late",
  ).length;

  const presentRate = expectedEmployeeDays
    ? Math.round((attendedCount / expectedEmployeeDays) * 100)
    : 0;

  const lateRecords = summaryRecords.filter(
    (record) => record.check_in && getTardinessMinutes(record.check_in) > 0,
  );

  const totalTardinessMinutes = lateRecords.reduce(
    (total, record) => total + getTardinessMinutes(record.check_in),
    0,
  );

  const averageTardiness = lateRecords.length
    ? Math.round(totalTardinessMinutes / lateRecords.length)
    : 0;

  const overtimeMinutes = summaryRecords.reduce((total, record) => {
    const workedMinutes = getWorkedMinutes(record);

    const overtime = Math.max(0, workedMinutes - 8 * 60);

    return total + overtime;
  }, 0);
  const overtime = `${Math.floor(overtimeMinutes / 60)}h ${String(
    overtimeMinutes % 60,
  ).padStart(2, "0")}m`;

  const resetFilters = () => {
    setSearch("");
    handleDateRangeChange("Today");
    setStatus("All Status");
    setCurrentPage(1);
  };

  return (
    <section className="flex min-h-full flex-col gap-6 overflow-y-auto p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[1.2px] text-[var(--secondary-muted)]">
            Main System &gt; Attendance Records
          </p>
          <h1 className="text-[32px] font-semibold leading-10 text-[var(--text-primary-dark)]">
            Daily Attendance Log
          </h1>
        </div>
        <div className="flex gap-3">
          <ExportData
            data={exportData}
            columns={attendanceExportColumns}
            fileName="attendance"
            sheetName="Attendance"
            label="Export Excel"
          />
          <button
            type="button"
            onClick={() => toast.info("PDF export is not available yet")}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--text-primary-dark)]"
          >
            <FileText size={15} />
            Export PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setAttendanceFormRecord(null);
              setIsAttendanceFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-[#7fb249] px-5 py-2.5 text-sm font-bold text-[#234100] transition hover:bg-[#72a13f]"
          >
            <UserPlus size={15} />
            Add Attendance
          </button>
        </div>
      </div>
      <AttendanceFilters
        search={search}
        dateRange={dateRange}
        fromDate={fromDate}
        toDate={toDate}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        onDateRangeChange={handleDateRangeChange}
        onFromDateChange={(value) => {
          setFromDate(value);
          setCurrentPage(1);
        }}
        onToDateChange={(value) => {
          setToDate(value);
          setCurrentPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setCurrentPage(1);
        }}
        onReset={resetFilters}
      />
      <AttendanceTable
        records={currentRecords}
        loading={loading}
        error={error}
        onEdit={(record) => {
          setAttendanceFormRecord(record);
          setIsAttendanceFormOpen(true);
        }}
      />
      <EmployeePagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalEmployees={filteredRecords.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
      />
      <AttendanceSummary
        presentRate={presentRate}
        averageTardiness={`${averageTardiness}m`}
        overtime={overtime}
      />
      {isAttendanceFormOpen && (
        <AttendanceForm
          attendance={attendanceFormRecord}
          onClose={() => setIsAttendanceFormOpen(false)}
          onSaved={loadAttendance}
        />
      )}
    </section>
  );
}

export default Attendance;
