import { db } from "../config/database.js";

export const createSite = async ({ sitename }) => {
  const query = {
    text: `
      INSERT INTO SITES (sitename)
      VALUES ($1, $2)
      RETURNING sitename,sid
      `,
    values: [sitename],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const findOneBySiteName = async (sitename) => {
  const query = {
    text: `
    SELECT * FROM SITES
    WHERE SITEMANE = $1
    `,
    values: [sitename],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const findAllSites = async () => {
  const query = {
    text: `
    SELECT * FROM SITES
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

export const findOneBySid = async (sid) => {
  const query = {
    text: `
    SELECT * FROM SITES
    WHERE sid = $1
    `,
    values: [sid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const updateSite = async ({ sid, sitename }) => {
  let fields = [];
  let values = [];
  let index = 1;

  if (sitename !== undefined) {
    fields.push(`sitename = $${index}`);
    values.push(sitename);
    index++;
  }

  values.push(sid);

  const query = {
    text: `
      UPDATE SITES
      SET ${fields.join(", ")}
      WHERE sid = $${index}
      RETURNING sitename, sid
    `,
    values: values,
  };

  const { rows } = await db.query(query);
  return rows[0];
};

export const deleteSite = async (sid) => {
  const query = {
    text: `
      DELETE FROM SITES
      WHERE bid = $1
      RETURNING sid, sitename
    `,
    values: [sid],
  };

  const { rows } = await db.query(query);
  return rows[0];
};
