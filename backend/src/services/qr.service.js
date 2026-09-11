import sql from "mssql";
import crypto from "crypto";

export const createQrToken = async () => {
  // Generate a secure random token
  const qrToken = crypto.randomBytes(32).toString("hex");

  const result = await sql.query`
    INSERT INTO ATT_QR (
      qr_token
    )
    OUTPUT
      INSERTED.qr_id,
      INSERTED.qr_token,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    VALUES (
      ${qrToken}
    )
  `;

  const qr = result.recordset[0];

  const qrUrl =
    `https://attendance.justbooksalon.com/attendance/scan?token=${qr.qr_token}`;
  //  const qrUrl =
  //   `http://192.168.1.3:5174/attendance/scan?token=${qr.qr_token}`;

  return {
    ...qr,
    qr_url: qrUrl,
  };
};