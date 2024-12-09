import { db } from "../config/database.js";

// Función encargada de registrar un usuario
export const create = async ({
  username,
  lastname,
  cc,
  site_id,
  email,
  password,
}) => {
  const query = {
    text: `
      INSERT INTO USERS (username, lastname, cc, site_id,email, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING username, lastname, cc, site_id,email,role_id, uid
      `,
    values: [username, lastname, cc, site_id, email, password],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de retornar un usuario buscado por email
export const findOneByEmail = async (email) => {
  const query = {
    text: `
    SELECT * 
    FROM users
    WHERE email = $1;

    `,
    values: [email],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de retornar un usuario buscado por número de identificación
export const findOneByCc = async (cc) => {
  const query = {
    text: `
    SELECT * FROM users
    WHERE CC = $1
    `,
    values: [cc],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de retornar todos los usuarios
export const findAll = async () => {
  const query = {
    text: `
    SELECT * FROM USERS WHERE ROLE_ID = 1
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

// Función encargada de retornar todos los empleados de un cooridnador
export const findAllEmployeesByCoordinator = async (site_id) => {
  const query = {
    text: `
    SELECT * FROM USERS WHERE ROLE_ID = 3 OR ROLE_ID = 2 AND SITE_ID = $1
    `,
    values: [site_id],
  };
  const { rows } = await db.query(query);
  return rows;
};

// Función encargada de retornar todos los coordinadores
export const findAllCoordinators = async () => {
  const query = {
    text: `
    SELECT * FROM users WHERE ROLE_iD = 2
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

// Función encargada de retornar todos los empleados al Administrador
export const findAllEmployees = async () => {
  const query = {
    text: `
    SELECT * FROM users WHERE ROLE_iD = 3
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

// Función encargada de retornar un usuario por id
export const findOneByUid = async (uid) => {
  const query = {
    text: `
    SELECT * FROM users
    WHERE uid = $1
    `,
    values: [uid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de actualizar el rol de un empleado a coordinador
export const updateRoleAdministrator = async (uid) => {
  const query = {
    text: `
    UPDATE users
    SET role_id = 1
    WHERE uid = $1
    RETURNING role_id
    `,
    values: [uid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de actualizar el rol de un empleado a coordinador
export const updateRoleCoordinator = async (uid) => {
  const query = {
    text: `
    UPDATE users
    SET role_id = 2
    WHERE uid = $1
    RETURNING role_id
    `,
    values: [uid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};


// Función encargada de actualizar el rol de un empleado a control interno
export const updateRoleInternalControl = async (uid) => {
  const query = {
    text: `
    UPDATE users
    SET role_id = 5
    WHERE uid = $1
    RETURNING role_id
    `,
    values: [uid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};


// Función encargada de actualizar un usuario
export const updateUser = async ({
  uid,
  username,
  lastname,
  cc,
  email,
  password,
}) => {
  let fields = [];
  let values = [];
  let index = 1;

  if (username !== undefined) {
    fields.push(`username = $${index}`);
    values.push(username);
    index++;
  }
  if (lastname !== undefined) {
    fields.push(`lastname = $${index}`);
    values.push(lastname);
    index++;
  }
  if (cc !== undefined) {
    fields.push(`cc = $${index}`);
    values.push(cc);
    index++;
  }
  if (email !== undefined) {
    fields.push(`email = $${index}`);
    values.push(email);
    index++;
  }
  if (password !== undefined) {
    fields.push(`password = $${index}`);
    values.push(password);
    index++;
  }

  // Verificar si hay campos para actualizar
  if (fields.length === 0) {
    throw new Error("No se proporcionaron campos para actualizar");
  }

  values.push(uid);

  const query = {
    text: `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE uid = $${index}
      RETURNING username, lastname, cc, email, role_id, uid
    `,
    values: values,
  };

  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de cambiar la contraseña de un usuario
// export const changePassword = async (uid, newPassword) => {
//   const hashedPassword = await bcryptjs.hash(newPassword, 10);

//   const query = {
//     text: `
//       UPDATE users
//       SET password = $2
//       WHERE uid = $1
//       RETURNING uid, username, lastname, email
//     `,
//     values: [hashedPassword, uid],
//   };

//   const { rows } = await db.query(query);
//   return rows[0];
// };

// Función encargada de eliminar un usuario
export const deleteUser = async (uid) => {
  const query = {
    text: `
      DELETE FROM users
      WHERE uid = $1
      RETURNING uid, username, lastname, email
    `,
    values: [uid],
  };

  const { rows } = await db.query(query);
  return rows[0];
};
