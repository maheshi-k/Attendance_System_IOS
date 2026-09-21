import { ArrowLeft, KeyRound, LockKeyhole } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { resetPassword } from "../../services/auth.service";
import BrandHeader from "./BrandHeader";
import FormField from "./FormField";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This password reset link is invalid or incomplete.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(token, password);
      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to reset password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(#b3dd87,transparent)] text-[#191c1d]">
      <BrandHeader />
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-8 py-16 sm:px-6 sm:py-24">
        <div className="w-full max-w-[448px]">
          <div className="mb-10">
            <h1 className="font-[Manrope,Inter,sans-serif] text-[28px] font-semibold leading-[34px]">
              Create a new password
            </h1>
            <p className="mt-2 text-base leading-6 text-[#625e58]">
              Choose a new password for your Attendance System account.
            </p>
          </div>

          {submitted ? (
            <div
              className="rounded-xl border border-[#b3dd87] bg-white/70 p-5 text-sm leading-6 text-[#425a2d]"
              role="status"
            >
              Your password has been reset successfully. You can now sign in.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FormField
                id="reset-password"
                label="New password"
                type="password"
                value={password}
                placeholder="At least 6 characters"
                icon={LockKeyhole}
                onChange={setPassword}
              />
              <FormField
                id="reset-password-confirmation"
                label="Confirm password"
                type="password"
                value={confirmation}
                placeholder="Repeat your new password"
                icon={KeyRound}
                onChange={setConfirmation}
              />

              {error && (
                <p className="text-sm text-[#b43f3f]" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#83bb49] py-4 text-base font-semibold text-white shadow-[0_10px_15px_-3px_rgba(60,106,0,0.2),0_4px_6px_-4px_rgba(60,106,0,0.2)] transition hover:bg-[#75ad3d]"
              >
                {isSubmitting ? "Saving..." : "Reset Password"}
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-[#3c6a00] hover:underline"
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ResetPasswordPage;
