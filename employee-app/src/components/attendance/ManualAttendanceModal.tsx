import { X } from "lucide-react";
import { useState } from "react";
import { addManualAttendance } from "../../services/attendance.service";
import { toast } from "react-toastify";

type ManualAttendanceModalProps = {
  attendanceTime: {
    client_date: string;
    client_time: string;
    client_datetime: string;
  };
  attendanceType: "check-in" | "check-out";
  onClose: () => void;
  onSuccess: () => void;
};

function ManualAttendanceModal({
  attendanceTime,
  attendanceType,
  onClose,
  onSuccess,
}: ManualAttendanceModalProps) {
  const { client_date, client_time, client_datetime } = attendanceTime;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!client_date || !client_time) {
      setError("Attendance date and check-in time are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      await addManualAttendance({
        client_date,
        client_time,
      });

      onSuccess();
      toast.success("Attendance Marked Successfully!");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit attendance.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#eaecf0] px-6 py-5">
          <div className="text-left">
            <h2 className="text-lg font-semibold text-[#191c1d]">
              Fill Attendance
            </h2>

            <p className="mt-1 text-sm text-[#667085]">
              {attendanceType === "check-in"
                ? "Confirm your check-in attendance."
                : "Confirm your check-out attendance."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#667085] transition-colors hover:bg-[#f2f4f0] hover:text-[#344054]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {/* Attendance Date */}
            <div>
              <label
                htmlFor="attendance-date"
                className="mb-2 block text-left text-sm font-medium text-[#344054]"
              >
                Attendance Date
              </label>

              <input
                id="attendance-date"
                type="date"
                value={client_date}
                disabled
                className="h-11 w-full rounded-lg border border-[#d0d5dd] bg-[#f2f4f7] px-3 text-sm text-[#344054] outline-none disabled:cursor-not-allowed disabled:opacity-100"
              />
            </div>

            <div>
              <label
                htmlFor="check-in"
                className="mb-2 block text-left text-sm font-medium text-[#344054]"
              >
                {attendanceType === "check-in"
                  ? "Check-in Time"
                  : "Check-out Time"}
              </label>

              <input
                id="check-in"
                type="time"
                value={client_time.slice(0, 5)}
                disabled
                className="h-11 w-full rounded-lg border border-[#d0d5dd] bg-[#f2f4f7] px-3 text-sm text-[#344054] outline-none disabled:cursor-not-allowed disabled:opacity-100"
              />

              <p className="mt-1.5 text-xs text-[#98a2b3]">
                {attendanceType === "check-in"
                  ? "Your check-in time will be captured from your device."
                  : "Your check-out time will be captured from your device."}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-[#eaecf0] bg-[#fafafa] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-lg border border-[#d0d5dd] bg-white px-4 text-sm font-semibold text-[#344054] transition-colors hover:bg-[#f8f9fa] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 flex-1 rounded-lg bg-[#5f950d] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4d7d08] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Submitting..."
                : attendanceType === "check-in"
                  ? "Submit Check-in"
                  : "Submit Check-out"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManualAttendanceModal;
