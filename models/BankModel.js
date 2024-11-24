import { db } from "../config/database.js";

export const createBank = async ({ bankname }) => {
  const query = {
    text: `
      INSERT INTO BANKS (bankname)
      VALUES ($1, $2)
      RETURNING bankname,bid
      `,
    values: [bankname],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const findOneByBankName = async (bankname) => {
  const query = {
    text: `
    SELECT * FROM BANKS
    WHERE BANKNAME = $1
    `,
    values: [bankname],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const findAllBanks = async () => {
  const query = {
    text: `
    SELECT * FROM BANKS
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

export const findOneByBid = async (bid) => {
  const query = {
    text: `
    SELECT * FROM BANKS
    WHERE bid = $1
    `,
    values: [bid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const updateBank = async ({ bid, bankname }) => {
  let fields = [];
  let values = [];
  let index = 1;

  if (bankname !== undefined) {
    fields.push(`bankname = $${index}`);
    values.push(bankname);
    index++;
  }

  values.push(bid);

  const query = {
    text: `
      UPDATE BANKS
      SET ${fields.join(", ")}
      WHERE bid = $${index}
      RETURNING bankname, bid
    `,
    values: values,
  };

  const { rows } = await db.query(query);
  return rows[0];
};

export const deleteBank = async (uid) => {
  const query = {
    text: `
      DELETE FROM BANKS
      WHERE bid = $1
      RETURNING bid, bankname
    `,
    values: [bid],
  };

  const { rows } = await db.query(query);
  return rows[0];
};
