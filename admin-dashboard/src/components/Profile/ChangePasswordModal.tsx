import { X } from "lucide-react";
import { useEffect, type FormEvent } from "react";
import PasswordInput from "./PasswordInput";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordModalProps = {
  form: PasswordForm;
  setForm: React.Dispatch<React.SetStateAction<PasswordForm>>;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ChangePasswordModal({
  form,
  setForm,
  saving,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, saving]);

  const updateField = (field: keyof PasswordForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close change password"
        className="absolute inset-0 cursor-default"
        onClick={() => !saving && onClose()}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="relative w-full max-w-md rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--secondary-muted)]">
              Security
            </p>

            <h2
              id="change-password-title"
              className="mt-1 text-xl font-semibold text-[var(--text-primary-green)]"
            >
              Change password
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close change password"
            className="rounded-lg p-2 text-[var(--text-primary-light)] hover:bg-[var(--secondary-soft)] disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <PasswordInput
            label="Current password"
            value={form.currentPassword}
            onChange={(value) => updateField("currentPassword", value)}
            required
          />

          <PasswordInput
            label="New password"
            value={form.newPassword}
            onChange={(value) => updateField("newPassword", value)}
            required
          />

          <PasswordInput
            label="Confirm new password"
            value={form.confirmPassword}
            onChange={(value) => updateField("confirmPassword", value)}
            required
          />

          <p className="text-xs text-[var(--text-primary-light)]">
            Password must contain at least 6 characters.
          </p>

          <div className="flex items-center justify-end gap-4 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="text-sm font-semibold text-[var(--text-primary-light)] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--secondary-action)] px-5 py-2.5 text-sm font-bold text-[var(--text-primary-green)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Changing..." : "Change password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ChangePasswordModal;
