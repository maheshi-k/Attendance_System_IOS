import { Save, X } from "lucide-react";
import type { FormEvent, ReactNode } from "react";

export type CommonFormField = {
  name: string;
  label: string;
  type?: "date" | "time" | "text" | "select" | "textarea";
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string | number;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  icon?: ReactNode;
};

type CommonFormProps = {
  eyebrow: string;
  title: string;
  fields: CommonFormField[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onClose: () => void;
  submitLabel: string;
  saving?: boolean;
  submitDisabled?: boolean;
};

function CommonForm({
  eyebrow,
  title,
  fields,
  onSubmit,
  onClose,
  submitLabel,
  saving = false,
  submitDisabled = false,
}: CommonFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label={`Close ${title}`}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="common-form-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--secondary-muted)]">
              {eyebrow}
            </p>
            <h1
              id="common-form-title"
              className="text-xl font-semibold text-[var(--text-primary-green)]"
            >
              {title}
            </h1>
          </div>
          <button
            type="button"
            aria-label={`Close ${title}`}
            title="Close"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--text-primary-light)] transition hover:bg-[var(--secondary-soft)]"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <fieldset className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-5 md:col-span-2">
            <legend className="sr-only">{title} information</legend>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map((field) => {
                const controlClass =
                  "mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]";
                const wrapperClass =
                  field.type === "textarea" ? "md:col-span-2" : "";

                return (
                  <label
                    key={field.name}
                    className={`text-sm font-medium text-[var(--text-primary-light)] ${wrapperClass}`}
                  >
                    {field.label}
                    {field.type === "textarea" ? (
                      <textarea
                        required={field.required}
                        name={field.name}
                        defaultValue={field.defaultValue}
                        placeholder={field.placeholder}
                        className={`${controlClass} h-24 py-2`}
                      />
                    ) : field.type === "select" ? (
                      <select
                        required={field.required}
                        name={field.name}
                        disabled={field.disabled}
                        defaultValue={field.defaultValue ?? ""}
                        className={controlClass}
                      >
                        <option value="">
                          {field.placeholder ??
                            `Select ${field.label.toLowerCase()}`}
                        </option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative mt-1.5">
                        {field.icon && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]">
                            {field.icon}
                          </span>
                        )}
                        <input
                          required={field.required}
                          type={field.type ?? "text"}
                          name={field.name}
                          disabled={field.disabled}
                          defaultValue={field.defaultValue}
                          placeholder={field.placeholder}
                          className={
                            field.icon ? `${controlClass} pl-9` : controlClass
                          }
                        />
                      </div>
                    )}
                  </label>
                );
              })}
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
              disabled={saving || submitDisabled}
              className="flex items-center gap-2 rounded-lg bg-[var(--secondary-action)] px-6 py-2.5 text-sm font-bold text-[var(--text-primary-green)] shadow-[0_10px_15px_-3px_var(--secondary-soft)] transition hover:bg-[var(--secondary-action-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CommonForm;
