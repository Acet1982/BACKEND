import { Router } from "express";
import {
  createEmployees,
  updateEmployees,
  deleteEmployees,
} from "../controllers/EmployeeController.js";
import {
  verifyCoordinator,
  verifyToken,
  verifyUserAuthorization,
} from "../middlewares/JwtAuthUser.js";

import { validatorRegisterEmployee } from "../middlewares/ValidateBodyFields.js";

const router = Router();

router.post(
  "/create/:uid",
  validatorRegisterEmployee,
  verifyToken,
  verifyCoordinator,
  createEmployees
);
router.put("/update/:eid", verifyToken, verifyCoordinator, updateEmployees);
router.delete(
  "/delete/:eid",
  verifyToken,
  verifyUserAuthorization,
  deleteEmployees
);

export default router;
