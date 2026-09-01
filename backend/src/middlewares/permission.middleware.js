import sql from "mssql";

export const requirePermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const result = await sql.query`
        SELECT 1
        FROM ROLE_RolePermission rp
        INNER JOIN PER_Permission p
          ON rp.permission_id = p.permission_id
        WHERE rp.role_id = ${req.user.role_id}
          AND p.permission_code = ${permissionCode}
          AND p.is_active = 1
      `;

      if (result.recordset.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to verify permission",
      });
    }
  };
};