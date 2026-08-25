import type { Id } from "react-toastify";
import { toast } from "react-toastify";

interface ConfirmToastProps {
  employeeName: string;
  onConfirm: () => void;
  closeToast?: () => void;
}

export default function ConfirmToast({
  employeeName,
  onConfirm,
  closeToast,
}: ConfirmToastProps) {
  const handleConfirm = () => {
    closeToast?.();
    onConfirm();
  };

  const handleCancel = () => {
    closeToast?.();
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-semibold text-gray-900">Deactivate Employee?</p>

        <p className="mt-1 text-sm text-gray-600">
          Are you sure you want to deactivate {employeeName}?
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Deactivate
        </button>
      </div>
    </div>
  );
}
