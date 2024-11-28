import { db } from "../config/database.js";

// Función encargada de crear los detalles de una nómina
export const createPayrollDetail = async ({
  payroll_id,
  employee_id,
  days_worked,
  sunday_classes,
  value_sunday_classes,
  days_sunday,
  value_days_sunday,
  instructor_hours,
  value_instructor_hours,
  registrations,
  value_registrations,
  additional_payments,
  deductions,
  observations,
}) => {
  const query = {
    text: `
    INSERT INTO PAYROLL_DETAIL (payroll_id, employee_id, days_worked,
      sunday_classes,
      value_sunday_classes,
      days_sunday,
      value_days_sunday,
      instructor_hours,
      value_instructor_hours,
      registrations,
      value_registrations,
      additional_payments,
      deductions,
      observations)

    VALUES ($1, $2, $3, $4, $5, $6 , $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING payroll_id,
    employee_id,
    days_worked,
      sunday_classes,
      value_sunday_classes,
      days_sunday,
      value_days_sunday,
      instructor_hours,
      value_instructor_hours,
      registrations,
      value_registrations,
      additional_payments,
      deductions,
      observations, pdid
      `,
    values: [
      payroll_id,
      employee_id,
      days_worked,
      sunday_classes,
      value_sunday_classes,
      days_sunday,
      value_days_sunday,
      instructor_hours,
      value_instructor_hours,
      registrations,
      value_registrations,
      additional_payments,
      deductions,
      observations,
    ],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de retornar todos los detalles de nóminas de empleado
export const findAllDetailsPayroll = async () => {
  const query = {
    text: `
    SELECT * FROM PAYROLL_DETAIL
    `,
  };
  const { rows } = await db.query(query);
  return rows;
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

// Función encargada de mostrar la nómina de un empleado por id
export const findOneDetailsByPdid = async (pdid) => {
  const query = {
    text: `SELECT * FROM PAYROLL_DETAIL
    WHERE PDID = $1`,
    values: [pdid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de actualizar los detalles de nómina de un empleado
export const updateDetailPayroll = async ({
  pdid,
  days_worked,
  sunday_classes,
  value_sunday_classes,
  days_sunday,
  value_days_sunday,
  instructor_hours,
  value_instructor_hours,
  registrations,
  value_registrations,
  additional_payments,
  deductions,
  observations,
}) => {
  let fields = [];
  let values = [];
  let index = 1;

  if (days_worked !== undefined) {
    fields.push(`days_worked = $${index}`);
    values.push(days_worked);
    index++;
  }
  if (sunday_classes !== undefined) {
    fields.push(`sunday_classes = $${index}`);
    values.push(sunday_classes);
    index++;
  }
  if (value_sunday_classes !== undefined) {
    fields.push(`value_sunday_classes = $${index}`);
    values.push(value_sunday_classes);
    index++;
  }
  if (days_sunday !== undefined) {
    fields.push(`days_sunday = $${index}`);
    values.push(days_sunday);
    index++;
  }
  if (value_days_sunday !== undefined) {
    fields.push(`value_days_sunday = $${index}`);
    values.push(value_days_sunday);
    index++;
  }
  if (instructor_hours !== undefined) {
    fields.push(`instructor_hours = $${index}`);
    values.push(instructor_hours);
    index++;
  }
  if (value_instructor_hours !== undefined) {
    fields.push(`value_instructor_hours = $${index}`);
    values.push(value_instructor_hours);
    index++;
  }
  if (registrations !== undefined) {
    fields.push(`registrations = $${index}`);
    values.push(registrations);
    index++;
  }
  if (value_registrations !== undefined) {
    fields.push(`value_registrations = $${index}`);
    values.push(value_registrations);
    index++;
  }
  if (additional_payments !== undefined) {
    fields.push(`additional_payments = $${index}`);
    values.push(additional_payments);
    index++;
  }
  if (deductions !== undefined) {
    fields.push(`deductions = $${index}`);
    values.push(deductions);
    index++;
  }
  if (observations !== undefined) {
    fields.push(`observations = $${index}`);
    values.push(observations);
    index++;
  }

  // Verificar si hay campos para actualizar
  if (fields.length === 0) {
    throw new Error("No se proporcionaron campos para actualizar");
  }

  values.push(pdid);

  const query = {
    text: `
      UPDATE PAYROLL_DETAIL
      SET ${fields.join(", ")}
      WHERE PDID = $${index}
      RETURNING days_worked,
      sunday_classes,
      value_sunday_classes,
      days_sunday,
      value_days_sunday,
      instructor_hours,
      value_instructor_hours,
      registrations,
      value_registrations,
      additional_payments,
      deductions,
      observations, pdid
    `,
    values: values,
  };

  const { rows } = await db.query(query);
  return rows[0];
};

// Función encargada de eliminar una nómina de empleado
export const deleteDetailPayroll = async (pdid) => {
  const query = {
    text: `
      DELETE FROM PAYROLL_DETAIL
      WHERE pdid = $1
    `,
    values: [pdid],
  };

  const { rows } = await db.query(query);
  return rows[0];
};
