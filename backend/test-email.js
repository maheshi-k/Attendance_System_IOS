import { sendEmail } from "./src/services/email.service.js";

const testEmail = async () => {
  try {
    const result = await sendEmail({
      to: "kthilini1999@gmail.com",
      subject: "Attendance System - Test Email",
      html: `
        <h2>Email Test Successful</h2>
        <p>This is a test email from the Attendance System.</p>
        <p>If you received this email, your email service is working correctly.</p>
      `,
    });

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

testEmail();