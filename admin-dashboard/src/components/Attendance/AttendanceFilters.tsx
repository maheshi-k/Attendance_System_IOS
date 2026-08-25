import { CalendarDays, Filter, Search } from "lucide-react";
import type {
  AttendanceDateRange,
  AttendanceStatus,
} from "../../types/attendance";

type AttendanceFiltersProps = {
  search: string;
  dateRange: AttendanceDateRange;
  fromDate: string;
  toDate: string;
  status: "All Status" | AttendanceStatus;
  onSearchChange: (value: string) => void;
  onDateRangeChange: (value: AttendanceDateRange) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onStatusChange: (value: "All Status" | AttendanceStatus) => void;
  onReset: () => void;
};

function AttendanceFilters({
  search,
  dateRange,
  fromDate,
  toDate,
  status,
  onSearchChange,
  onDateRangeChange,
  onFromDateChange,
  onToDateChange,
  onStatusChange,
  onReset,
}: AttendanceFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--border-muted)] bg-white p-4">
      <label className="min-w-[220px] flex-1 text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-primary-light)]">
        Employee Search
        <div className="relative mt-1.5">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
          />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Name or Badge ID"
            className="h-10 w-full rounded-lg bg-[var(--surface-input)] pl-9 pr-3 text-sm font-normal normal-case tracking-normal text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
          />
        </div>
      </label>
      <label className="text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-primary-light)] flex flex-col">
        Date Range
        <select
          value={dateRange}
          onChange={(event) =>
            onDateRangeChange(event.target.value as AttendanceDateRange)
          }
          className="mt-1.5 h-10 rounded-lg bg-[var(--surface-input)] px-3 text-sm font-normal normal-case tracking-normal text-[var(--text-primary-dark)] outline-none"
        >
          <option>Today</option>
          <option>Yesterday</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>Custom</option>
        </select>
      </label>
      {dateRange === "Custom" && (
        <>
          <label className="text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-primary-light)]">
            From
            <div className="relative mt-1.5">
              <CalendarDays
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
              />
              <input
                type="date"
                value={fromDate}
                onChange={(event) => onFromDateChange(event.target.value)}
                className="h-10 rounded-lg bg-[var(--surface-input)] pl-9 pr-3 text-sm font-normal normal-case tracking-normal text-[var(--text-primary-dark)] outline-none"
              />
            </div>
          </label>
          <label className="text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-primary-light)]">
            To
            <div className="relative mt-1.5">
              <CalendarDays
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
              />
              <input
                type="date"
                value={toDate}
                onChange={(event) => onToDateChange(event.target.value)}
                className="h-10 rounded-lg bg-[var(--surface-input)] pl-9 pr-3 text-sm font-normal normal-case tracking-normal text-[var(--text-primary-dark)] outline-none"
              />
            </div>
          </label>
        </>
      )}
      <label className="text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-primary-light)]">
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as "All Status" | AttendanceStatus,
            )
          }
          className="mt-1.5 h-10 rounded-lg bg-[var(--surface-input)] px-3 text-sm font-normal normal-case tracking-normal text-[var(--text-primary-dark)] outline-none"
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
        aria-label="Reset attendance filters"
        title="Reset filters"
        onClick={onReset}
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--secondary-action)] text-[var(--text-primary-green)] transition hover:bg-[var(--secondary-action-hover)]"
      >
        <Filter size={17} />
      </button>
    </div>
  );
}

export default AttendanceFilters;
