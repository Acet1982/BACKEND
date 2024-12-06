import { db } from "../config/database.js";

export const createEmployee = async ({
  user_id,
  bank_id,
  account_number,
  monthly_salary,
}) => {
  const query = {
    text: `
      INSERT INTO EMPLOYEES (user_id, bank_id, account_number, monthly_salary)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, bank_id, account_number, monthly_salary, eid
      `,
    values: [user_id, bank_id, account_number, monthly_salary],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const findOneByUserId = async (user_id) => {
  const query = {
    text: `
    SELECT * FROM EMPLOYEES
    WHERE USER_ID = $1
    `,
    values: [user_id],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const findAllEmployees = async () => {
  const query = {
    text: `
    SELECT * FROM EMPLOYEES
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

export const findOneByEid = async (uid) => {
  const query = {
    text: `
    SELECT * FROM EMPLOYEES
    WHERE user_id = $1
    `,
    values: [uid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const updateEmployee = async ({
  eid,
  bank_id,
  account_number,
  site_id,
  monthly_salary,
}) => {
  let fields = [];
  let values = [];
  let index = 1;

  if (bank_id !== undefined) {
    fields.push(`bank_Id = $${index}`);
    values.push(bank_id);
    index++;
  }
  if (account_number !== undefined) {
    fields.push(`account_number = $${index}`);
    values.push(account_number);
    index++;
  }
  if (site_id !== undefined) {
    fields.push(`site_id = $${index}`);
    values.push(site_id);
    index++;
  }
  if (monthly_salary !== undefined) {
    fields.push(`monthly_salary = $${index}`);
    values.push(monthly_salary);
    index++;
  }
  values.push(eid);

  const query = {
    text: `
      UPDATE EMPLOYEES
      SET ${fields.join(", ")}
      WHERE eid = $${index}
      RETURNING user_id, bank_id, account_number, site_id, monthly_salary, eid
    `,
    values: values,
  };

  const { rows } = await db.query(query);
  return rows[0];
};

export const deleteEmployee = async (eid) => {
  const query = {
    text: `
      DELETE FROM EMPLOYEES
      WHERE eid = $1
      RETURNING eid, user_id, bank_id,account_number, site_id, monthly_salary
    `,
    values: [eid],
  };

  const { rows } = await db.query(query);
  return rows[0];
};
