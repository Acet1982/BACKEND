import { Router } from "express";
import {
  createEmployees,
  updateEmployees,
  deleteEmployees,
  getEmployees,
} from "../controllers/EmployeeController.js";
import {
  verifyCoordinator,
  verifyToken,
  verifyUserAuthorization,
} from "../middlewares/JwtAuthUser.js";

import { validatorRegisterEmployee } from "../middlewares/ValidateBodyFields.js";

const router = Router();

router.get("/:uid", verifyToken, verifyUserAuthorization, getEmployees);
router.post("/create/:uid", validatorRegisterEmployee, createEmployees);
router.put("/update/:eid", verifyToken, verifyCoordinator, updateEmployees);
router.delete(
  "/delete/:eid",
  verifyToken,
  verifyUserAuthorization,
  deleteEmployees
);

export default router;
