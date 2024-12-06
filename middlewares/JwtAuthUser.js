import jwt from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/TokenManager.js";

// Función encargada de verify si el token es válido
export const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token no proporcionado o formato inválido",
      });
    }

    token = token.split(" ")[1];
    const { uid, role_id } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    req.role_id = role_id;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      error: tokenVerificationErrors[error.message] || "Token inválido",
    });
  }
};

// Función encargada de verificar si el usuario es administrador
export const verifyAdmin = (req, res, next) => {
  if (req.role_id === 1) {
    return next();
  } else {
    return res
      .status(403)
      .json({ error: "Usuario no autorizado, solo administrador." });
  }
};

// Función encargada de verificar si el usuario es coordinador
export const verifyCoordinator = (req, res, next) => {
  if (req.role_id === 2) {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Usuario no autorizado, solo coordinador." });
};

// Función encargada de verificar si el usuario es control interno
export const verifyInternalControl = (req, res, next) => {
  if (req.role_id === 5) {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Usuario no autorizado, solo control interno." });
};

// Función encargada de verificar si el usuario es administrador o coordinador
export const verifyUserAuthorization = (req, res, next) => {
  if (req.role_id === 1 || req.role_id === 2) {
    return next();
  }
  return res.status(403).json({
    error: "Usuario no autorizado, solo administrador o coordinador.",
  });
};

export const verifyUserAuthorizationAllUsers = (req, res, next) => {
  if (req.role_id === 1 || req.role_id === 2 || req.role_id === 5) {
    return next();
  }
  return res.status(403).json({
    error:
      "Usuario no autorizado, solo administrador, coordinador o control interno.",
  });
};

export const verifyUserAdminAndInternalControl = (req, res, next) => {
  if (req.role_id === 1 || req.role_id === 5) {
    return next();
  }
  return res.status(403).json({
    error:
      "Usuario no autorizado, solo administrador, coordinador o control interno.",
  });
};
