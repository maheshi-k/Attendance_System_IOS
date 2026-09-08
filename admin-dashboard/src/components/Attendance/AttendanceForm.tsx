import { CalendarDays, Clock3 } from "lucide-react";
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
import CommonForm, { type CommonFormField } from "../common/CommonForm";

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

  const fields: CommonFormField[] = [
    {
      name: "employee",
      label: "Employee",
      type: "select",
      required: true,
      disabled: loadingEmployees,
      defaultValue: attendance ? String(attendance.emp_id) : "",
      placeholder: loadingEmployees
        ? "Loading employees..."
        : "Select employee",
      options: employees.map((employee) => ({
        label: `${employee.first_name} ${employee.last_name} (${employee.emp_code})`,
        value: employee.emp_id.toString(),
      })),
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
      defaultValue:
        attendance?.att_date.slice(0, 10) ??
        new Date().toISOString().slice(0, 10),
      icon: <CalendarDays size={15} />,
    },
    {
      name: "checkIn",
      label: "Check In",
      type: "time",
      required: true,
      defaultValue: attendance?.check_in?.slice(0, 5) ?? "",
      icon: <Clock3 size={15} />,
    },
    {
      name: "checkOut",
      label: "Check Out",
      type: "time",
      defaultValue: attendance?.check_out?.slice(0, 5) ?? "",
      icon: <Clock3 size={15} />,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      defaultValue: attendance?.status ?? "Present",
      options: ["Present", "Late", "Absent", "On Leave"].map((value) => ({
        label: value,
        value,
      })),
    },
  ];

  return (
    <CommonForm
      key={`${id ?? "new"}-${loadingEmployees ? "loading" : "ready"}`}
      eyebrow="Attendance Records"
      title={isEditing ? "Edit Attendance" : "Add Attendance"}
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      submitLabel="Save Attendance"
      saving={saving}
      submitDisabled={loadingEmployees}
    />
  );
}

export default AttendanceForm;
