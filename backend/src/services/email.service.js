import "dotenv/config";
import { Resend } from "resend";

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return new Resend(process.env.RESEND_API_KEY);
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

/**

 * @param {Object} options
 * @param {string|string[]} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    if (!html) {
      throw new Error("Email HTML content is required");
    }

    const emailData = {
      from: process.env.EMAIL_FROM || "Attendance System <onboarding@resend.dev>",
      to,
      subject,
      html,
    };

    if (text) {
      emailData.text = text;
    }

    const { data, error } = await getResendClient().emails.send(emailData);

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(error.message || "Failed to send email");
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error("Email service error:", error);

    throw error;
  }
};

export const sendPasswordResetEmail = async ({ to, firstName, resetUrl }) => {
  const safeFirstName = escapeHtml(firstName || "there");
  const safeResetUrl = escapeHtml(resetUrl);

  return sendEmail({
    to,
    subject: "Reset your Attendance System password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 560px;">
        <h2>Password reset requested</h2>
        <p>Hi ${safeFirstName},</p>
        <p>Use the button below to choose a new password for your Attendance System account.</p>
        <p>
          <a href="${safeResetUrl}" style="display: inline-block; padding: 12px 20px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;">
            Reset password
          </a>
        </p>
        <p>This link expires in 30 minutes and can be used only once.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
    text: `Hi ${firstName || "there"},\n\nReset your Attendance System password here: ${resetUrl}\n\nThis link expires in 30 minutes and can be used only once. If you did not request this, you can safely ignore this email.`,
  });
};