import { tokenVerificationErrors } from "../utils/TokenManager.js";
import jwt from "jsonwebtoken";
export const requireRefreshToken = (req, res, next) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) {
      return res.status(401).json({
        error: "Token no proporcionado. Por favor, inicia sesión nuevamente.",
      });
    }

    const payload = jwt.verify(
      refreshTokenCookie,
      process.env.JWT_REFRESH_TOKEN
    );

    req.uid = payload.uid;
    req.username = payload.username;
    req.lastname = payload.lastname;
    req.role_id = payload.role_id;
    req.site_id = payload.site_id;

    next();
  } catch (error) {
    console.error("Error en requireRefreshToken:", error.message);
    return res.status(401).json({
      error: tokenVerificationErrors[error.message] || "Token inválido.",
    });
  }
};
;
