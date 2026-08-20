import sql from "mssql";
import crypto from "crypto";

export const createQrToken = async () => {
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

  return result.recordset[0];
};