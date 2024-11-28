import { db } from "../config/database.js";

// Función encargada de crear una nómina
export const createPayroll = async ({
  coordinator_id,
  site_id,
  period_id,
  comments,
}) => {
  const query = {
    text: `
      INSERT INTO PAYROLLS (coordinator_id, site_id, period_id, comments)
      VALUES ($1, $2, $3, $4)
      RETURNING coordinator_id, site_id, period_id, comments, pid
      `,
    values: [coordinator_id, site_id, period_id, comments],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//Función encargada de buscar una nómina por periodo y coordinador para evitar duplicados durante un periodo
export const findOnePayrollByPeriodCoordinator = async (
  coordinator_id,
  period_id
) => {
  const query = {
    text: `
    SELECT * FROM PAYROLLS
    WHERE COORDINATOR_ID = $1 AND PERIOD_ID = $2 AND EXTRACT(MONTH FROM PAYROLL_DATE) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM PAYROLL_DATE) = EXTRACT(YEAR FROM CURRENT_DATE)`,
    values: [coordinator_id, period_id],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de retornar todas las nóminas en estado valida al administrador
export const findAllPayrolls = async () => {
  const query = {
    text: `
    SELECT * FROM PAYROLLS
    WHERE STATE_ID = 3
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

// Función encargada de retornar todas las nóminas por coordinador
export const findAllPayrollsCoordinator = async (coordinator_id) => {
  const query = {
    text: `
    SELECT * FROM PAYROLLS 
    WHERE COORDINATOR_ID = $1
    `,
    values: [coordinator_id],
  };
  const { rows } = await db.query(query);
  return rows;
};

// Función encargada de retornar una nómina que exactamente le pertenezca a un coordinador
export const findOnePayrollCoordinator = async (pid, coordinator_id) => {
  const query = {
    text: `
    SELECT * FROM PAYROLLS 
    WHERE PID = $1 AND COORDINATOR_ID = $2 AND STATE_ID = 1 OR STATE_ID =2
    `,
    values: [pid, coordinator_id],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

/* Función encargada de buscar una nómina por sede, periodo y mes
(La fecha va formateada para que coincida con el formato guardado en la base de datos)*/
export const findOnePayrollDate = async (site_id, period_id, dateNowFormat) => {
  const query = {
    text: `
    SELECT * FROM PAYROLLS
    WHERE SITE_ID = $1 AND PERIOD_ID = $2 AND PAYROLL_DATE = $3
    `,
    values: [site_id, period_id, dateNowFormat],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//Función encargada de retornar una nómina por Id
export const findOnePayrollByPid = async (pid) => {
  const query = {
    text: `
    SELECT * FROM PAYROLLS
    WHERE PID = $1`,
    values: [pid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de actualizar una nómina
export const updatePayroll = async ({ pid, site_id, period_id, comments }) => {
  let fields = [];
  let values = [];
  let index = 1;

  if (site_id !== undefined) {
    fields.push(`site_id = $${index}`);
    values.push(site_id);
    index++;
  }
  if (period_id !== undefined) {
    fields.push(`period_id = $${index}`);
    values.push(period_id);
    index++;
  }
  if (comments !== undefined) {
    fields.push(`comments = $${index}`);
    values.push(comments);
    index++;
  }

  // Verificar si hay campos para actualizar
  if (fields.length === 0) {
    throw new Error("No se proporcionaron campos para actualizar");
  }

  values.push(pid);

  const query = {
    text: `
      UPDATE PAYROLLS
      SET ${fields.join(", ")}
      WHERE PID = $${index}
      RETURNING site_id, period_id, comments, pid
    `,
    values: values,
  };

  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de eliminar una nómina
export const deletePayroll = async (pid) => {
  const query = {
    text: `
      DELETE FROM PAYROLLS
      WHERE pid = $1
      RETURNING pid, coordinator_id, site_id, period_id, comments, payroll_date
    `,
    values: [pid],
  };

  const { rows } = await db.query(query);
  return rows[0];
};
