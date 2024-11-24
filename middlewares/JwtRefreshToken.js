import { tokenVerificationErrors } from "../utils/TokenManager.js";
import jwt from "jsonwebtoken";
export const requireRefreshToken = (req, res, next) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie)
      return res.status(401).json({
        error: "Token no existe o no proporcionado",
      });

    const { uid, username, lastname, role_id } = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH_TOKEN
    );

    req.uid = uid;
    req.username = username;
    req.lastname = lastname;
    req.role_id = role_id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: tokenVerificationErrors[error.message] });
  }
};
