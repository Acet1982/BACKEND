import { Router } from "express";
import {
  createEmployees,
  updateEmployees,
  deleteEmployees,
} from "../controllers/EmployeeController.js";
import {
  verifyAdmin,
  verifyToken,
  verifyUserAuthorization,
} from "../middlewares/JwtAuthUser.js";

import { validatorRegisterEmployee } from "../middlewares/ValidateBodyFields.js";

const router = Router();

router.post(
  "/create/:uid",
  validatorRegisterEmployee,
  verifyToken,
  verifyAdmin,
  createEmployees
);
router.put("/update/:eid", verifyToken, verifyAdmin, updateEmployees);
router.delete("/delete/:eid", verifyToken, verifyAdmin, deleteEmployees);

export default router;
