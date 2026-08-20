import sql from "mssql";

export const getAllRoles = async () => {
    const result = await sql.query ('SELECT * FROM ROLE_Role ORDER by role_id DESC');

    return result.recordset;
};

export const createRole = async (roleData) => {
  const {
    role_name,
    description,
  } = roleData;

  const result = await sql.query`
    INSERT INTO ROLE_Role (
      role_name,
      description
    )
    OUTPUT
      INSERTED.role_id,
      INSERTED.role_name,
      INSERTED.description,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    VALUES (
      ${role_name},
      ${description || null}
    );
  `;


  return result.recordset[0];
};

export const getRoleByID = async(role_id) => {
  const result = await sql.query(`SELECT * FROM ROLE_Role WHERE role_id = ${role_id} `);

  return result.recordset[0];
}

export const updateRoleByID = async(role_id, role_data) => {

const { role_name, description,} = role_data;

const result = await sql.query`
    UPDATE ROLE_Role
    SET
      role_name = ${role_name},
      description = ${description},
      updated_at = GETDATE()
    OUTPUT
      INSERTED.role_id,
      INSERTED.role_name,
      INSERTED.description,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    WHERE role_id = ${role_id}
  `;

  return result.recordset[0];
}

export const updateRoleStatus = async (role_id, is_active) => {
  const result = await sql.query`
    UPDATE ROLE_Role
    SET
      is_active = ${is_active},
      updated_at = GETDATE()
    OUTPUT
      INSERTED.role_id,
      INSERTED.role_name,
      INSERTED.description,
      INSERTED.is_active,
      INSERTED.created_at,
      INSERTED.updated_at
    WHERE role_id = ${role_id}
  `;

  return result.recordset[0];
};

