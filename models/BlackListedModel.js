import { db } from "../config/database.js";

export const blacklistToken = async (token) => {
  const query = {
    text: `
      INSERT INTO blacklisted_tokens (token)
      VALUES ($1)
      RETURNING token
      `,
    values: [token],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const isTokenBlacklisted = async (token) => {
  const query = {
    text: `
      SELECT token FROM blacklisted_tokens
      WHERE token = $1
      `,
    values: [token],
  };
  const { rows } = await db.query(query);
  return rows.length > 0;
};
