import { X } from "lucide-react";
import { useEffect, type FormEvent } from "react";
import type { EmployeeRecord } from "../../types/employee";
import { inputClass } from "./profile.style.ts";

type ProfileModalProps = {
  employee: EmployeeRecord;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ProfileModal({
  employee,
  saving,
  onClose,
  onSubmit,
}: ProfileModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close edit profile"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--secondary-muted)]">
              Account
            </p>

            <h2
              id="edit-profile-title"
              className="text-xl font-semibold text-[var(--text-primary-green)]"
            >
              Edit profile
            </h2>
          </div>

          <button
            type="button"
            aria-label="Close edit profile"
            title="Close"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-primary-light)] hover:bg-[var(--secondary-soft)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <label className="text-sm font-medium text-[var(--text-primary-light)]">
            First name
            <input
              name="first_name"
              required
              defaultValue={employee.first_name}
              className={inputClass}
            />
          </label>

          <label className="text-sm font-medium text-[var(--text-primary-light)]">
            Last name
            <input
              name="last_name"
              required
              defaultValue={employee.last_name}
              className={inputClass}
            />
          </label>

          <label className="text-sm font-medium text-[var(--text-primary-light)]">
            Primary email
            <input
              disabled
              value={employee.email_1}
              className={`${inputClass} cursor-not-allowed opacity-60`}
            />
          </label>

          <label className="text-sm font-medium text-[var(--text-primary-light)]">
            Secondary email
            <input
              type="email"
              name="email_2"
              defaultValue={employee.email_2 ?? ""}
              className={inputClass}
            />
          </label>

          <label className="text-sm font-medium text-[var(--text-primary-light)]">
            Primary phone
            <input
              name="mobile_no_1"
              required
              defaultValue={employee.mobile_no_1}
              className={inputClass}
            />
          </label>

          <label className="text-sm font-medium text-[var(--text-primary-light)]">
            Secondary phone
            <input
              name="mobile_no_2"
              defaultValue={employee.mobile_no_2 ?? ""}
              className={inputClass}
            />
          </label>

          <label className="text-sm font-medium text-[var(--text-primary-light)]">
            Gender
            <select
              name="gender"
              required
              defaultValue={employee.gender}
              className={inputClass}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="text-sm font-medium text-[var(--text-primary-light)]">
            NIC
            <input
              name="nic"
              required
              defaultValue={employee.nic}
              className={inputClass}
            />
          </label>

          <label className="text-sm font-medium text-[var(--text-primary-light)] md:col-span-2">
            Address
            <textarea
              name="address"
              defaultValue={employee.address ?? ""}
              className={`${inputClass} h-24 py-2`}
            />
          </label>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4 md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-[var(--text-primary-light)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--secondary-action)] px-5 py-2.5 text-sm font-bold text-[var(--text-primary-green)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProfileModal;
