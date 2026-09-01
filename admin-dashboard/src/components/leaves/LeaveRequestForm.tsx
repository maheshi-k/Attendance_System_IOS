import { CalendarDays } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import CommonForm, { type CommonFormField } from "../common/CommonForm";
import { addLeaveRequest, getLeaveTypes } from "../../services/leave.service";
import type { LeaveType } from "../../types/leaves";

type LeaveRequestFormProps = {
  onClose: () => void;
  onSaved: () => void;
};

function LeaveRequestForm({ onClose, onSaved }: LeaveRequestFormProps) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLeaveTypes()
      .then(setLeaveTypes)
      .catch(() => toast.error("Failed to load leave types"))
      .finally(() => setLoading(false));
  }, []);

  const fields: CommonFormField[] = [
    {
      name: "leave_type_id",
      label: "Leave Type",
      type: "select",
      required: true,
      disabled: loading,
      placeholder: loading ? "Loading leave types..." : "Select leave type",
      options: leaveTypes.map((leaveType) => ({
        label: leaveType.leave_type_name,
        value: leaveType.leave_type_id,
      })),
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      required: true,
      icon: <CalendarDays size={15} />,
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date",
      required: true,
      icon: <CalendarDays size={15} />,
    },
    {
      name: "reason",
      label: "Reason",
      type: "textarea",
      placeholder: "Add a reason for your leave request",
    },
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      setSaving(true);
      await addLeaveRequest({
        leave_type_id: Number(form.get("leave_type_id")),
        start_date: String(form.get("start_date")),
        end_date: String(form.get("end_date")),
        reason: String(form.get("reason") || ""),
      });
      toast.success("Leave request submitted successfully");
      onSaved();
      onClose();
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      toast.error("Failed to submit leave request");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CommonForm
      eyebrow="Leave Management"
      title="Request Leave"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      submitLabel="Submit Request"
      saving={saving}
      submitDisabled={loading}
    />
  );
}

export default LeaveRequestForm;
