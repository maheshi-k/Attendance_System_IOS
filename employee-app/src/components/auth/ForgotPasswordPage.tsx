import { ArrowLeft, Mail, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import BrandHeader from "./BrandHeader";
import FormField from "./FormField";
import { requestPasswordReset } from "../../services/auth.service";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      await requestPasswordReset(email.trim());
      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to request password reset.",
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
              Forgot your password?
            </h1>
            <p className="mt-2 text-base leading-6 text-[#625e58]">
              Enter your email and we&apos;ll send you a password reset link.
            </p>
          </div>

          {submitted ? (
            <div
              className="rounded-xl border border-[#b3dd87] bg-white/70 p-5 text-sm leading-6 text-[#425a2d]"
              role="status"
            >
              If an account exists for {email}, you&apos;ll receive password
              reset instructions shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <FormField
                id="reset-email"
                label="Email"
                type="email"
                value={email}
                placeholder="employee@company.com"
                icon={Mail}
                onChange={setEmail}
              />

              {error && (
                <p className="text-sm text-[#b43f3f]" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#83bb49] py-4 text-base font-semibold text-white shadow-[0_10px_15px_-3px_rgba(60,106,0,0.2),0_4px_6px_-4px_rgba(60,106,0,0.2)] transition hover:bg-[#75ad3d]"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
                <Send size={17} strokeWidth={1.8} />
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

          <footer className="mt-10 border-t border-[rgba(194,201,181,0.3)] pt-10 text-center text-sm text-[#625e58]">
            © 2026 iOneSoft Solutions
          </footer>
        </div>
      </main>
    </div>
  );
}

export default ForgotPasswordPage;
