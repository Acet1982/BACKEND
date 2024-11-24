import { Router } from "express";
import {
  register,
  findAll,
  findAllUserCoordinators,
  findAllUserEmployees,
  updateUsers,
  updateRoleAdministrator,
  updateRoleCoordinator,
  deleteUsers,
  login,
  profile,
  refreshToken,
  logout,
} from "../controllers/UserController.js";
import {
  verifyAdmin,
  verifyToken,
  verifyUserAuthorization,
} from "../middlewares/JwtAuthUser.js";
import { requireRefreshToken } from "../middlewares/JwtRefreshToken.js";
import {
  ValidatorLoginBody,
  validatorRegisterBody,
} from "../middlewares/ValidateBodyFields.js";

const router = Router();

// RUTAS PRINCIPALES, /API/V1/USERS
router.post("/login", ValidatorLoginBody, login);
router.get("/profile", verifyToken, profile);
router.get("/logout", logout);
router.get("/refresh", requireRefreshToken, refreshToken);

// RUTAS PRINCIPALES - ACCIONES A LOS USUARIOS
router.post(
  "/register",
  validatorRegisterBody,
  verifyToken,
  verifyUserAuthorization,
  register
);
//Verificar esta ruta si en realidad es necesaria o no...bv
router.get("/", verifyToken, verifyAdmin, findAll);
router.put(
  "/update-role-administrator/:uid",
  verifyToken,
  verifyAdmin,
  updateRoleAdministrator
);
router.put(
  "/update-role-coordinator/:uid",
  verifyToken,
  verifyAdmin,
  updateRoleCoordinator
);
router.delete(
  "/delete/:uid",
  verifyToken,
  verifyUserAuthorization,
  deleteUsers
);

router.put("/update/:uid", verifyToken, updateUsers);
// Verificar la ruta u opción de cambiar contraseña
// router.put("/update-password/:uid", changePasswords);

router.get("/protegida", verifyToken, profile);

export default router;
