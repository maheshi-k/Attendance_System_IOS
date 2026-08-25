import { CalendarDays, Clock3, Save, UserRound, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { getAllEmployees } from "../../services/employee.service";
import {
  addManualAttendance,
  updateManualAttendance,
} from "../../services/attendance.service";
import type {
  AttendanceRecord,
  CreateAttendanceRequest,
} from "../../types/attendance";
import type { EmployeeRecord } from "../../types/employee";

type AttendanceFormProps = {
  attendance: AttendanceRecord | null;
  onClose: () => void;
  onSaved: () => void;
};

function AttendanceForm({ attendance, onClose, onSaved }: AttendanceFormProps) {
  const id = attendance?.att_id;
  const isEditing = Boolean(attendance);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllEmployees()
      .then((response) => setEmployees(response.data))
      .catch((error) => {
        console.error("Failed to load employees:", error);
        toast.error("Failed to load employees");
      })
      .finally(() => setLoadingEmployees(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: CreateAttendanceRequest = {
      emp_id: Number(form.get("employee")),
      att_date: String(form.get("date")),
      check_in: String(form.get("checkIn")),
      check_out: String(form.get("checkOut") || ""),
      status: form.get("status") as CreateAttendanceRequest["status"],
    };

    try {
      setSaving(true);
      if (isEditing) {
        await updateManualAttendance(Number(id), payload);
      } else {
        await addManualAttendance(payload);
      }
      toast.success(
        `Attendance ${isEditing ? "updated" : "added"} successfully`,
      );
      onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to add attendance:", error);
      toast.error("Failed to add attendance. Check for a duplicate date.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close attendance form"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendance-form-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-6 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--secondary-muted)]">
              Attendance Records
            </p>
            <h1
              id="attendance-form-title"
              className="text-xl font-semibold text-[var(--text-primary-green)]"
            >
              {isEditing ? "Edit Attendance" : "Add Attendance"}
            </h1>
          </div>
          <button
            type="button"
            aria-label="Close attendance form"
            title="Close"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-primary-light)] transition hover:bg-[var(--secondary-soft)]"
          >
            <X size={18} />
          </button>
        </div>

        <form
          key={attendance?.att_id ?? "new"}
          onSubmit={handleSubmit}
          className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2"
        >
          <fieldset className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-5 md:col-span-2">
            <legend className="sr-only">Attendance Information</legend>
            <div className="mb-5 flex items-center gap-2 text-lg font-semibold text-[var(--text-primary-dark)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--secondary-soft)] text-[var(--secondary-muted)]">
                <UserRound size={15} />
              </span>
              Attendance Information
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Employee
                <select
                  required
                  name="employee"
                  disabled={loadingEmployees}
                  defaultValue={attendance?.emp_id ?? ""}
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                >
                  <option value="">
                    {loadingEmployees
                      ? "Loading employees..."
                      : "Select employee"}
                  </option>
                  {employees.map((employee) => (
                    <option key={employee.emp_id} value={employee.emp_id}>
                      {employee.first_name} {employee.last_name} (
                      {employee.emp_code})
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Date
                <div className="relative mt-1.5">
                  <CalendarDays
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
                  />
                  <input
                    required
                    type="date"
                    name="date"
                    defaultValue={
                      attendance?.att_date.slice(0, 10) ??
                      new Date().toISOString().slice(0, 10)
                    }
                    className="h-10 w-full rounded-lg bg-[var(--surface-input)] pl-9 pr-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                  />
                </div>
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Check In
                <div className="relative mt-1.5">
                  <Clock3
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
                  />
                  <input
                    required
                    type="time"
                    name="checkIn"
                    defaultValue={attendance?.check_in?.slice(0, 5) ?? ""}
                    className="h-10 w-full rounded-lg bg-[var(--surface-input)] pl-9 pr-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                  />
                </div>
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Check Out
                <div className="relative mt-1.5">
                  <Clock3
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
                  />
                  <input
                    type="time"
                    name="checkOut"
                    defaultValue={attendance?.check_out?.slice(0, 5) ?? ""}
                    className="h-10 w-full rounded-lg bg-[var(--surface-input)] pl-9 pr-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                  />
                </div>
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Status
                <select
                  required
                  name="status"
                  defaultValue={attendance?.status ?? "Present"}
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                >
                  <option>Present</option>
                  <option>Late</option>
                  <option>Absent</option>
                  <option>On Leave</option>
                </select>
              </label>
            </div>
          </fieldset>

          <div className="flex items-center gap-6 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-[var(--text-primary-light)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || loadingEmployees}
              className="flex items-center gap-2 rounded-lg bg-[var(--secondary-action)] px-6 py-2.5 text-sm font-bold text-[var(--text-primary-green)] shadow-[0_10px_15px_-3px_var(--secondary-soft)] transition hover:bg-[var(--secondary-action-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AttendanceForm;
