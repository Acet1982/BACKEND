import { Router } from "express";
import {
  AllPayrollInternalControl,
  correctedPayrolls,
  correctPayrolls,
  createPayrolls,
  deletePayrolls,
  findAllPayroll,
  findAllPayrollsCoordinators,
  updatePayrolls,
  validatedPayrolls,
} from "../controllers/PayrollController.js";
import {
  verifyAdmin,
  verifyCoordinator,
  verifyInternalControl,
  verifyToken,
  verifyUserAdminAndInternalControl,
  verifyUserAuthorization,
} from "../middlewares/JwtAuthUser.js";

const router = Router();

router.post("/create", verifyToken, verifyCoordinator, createPayrolls);
router.get(
  "/internal-control",
  verifyToken,
  verifyInternalControl,
  AllPayrollInternalControl
);
router.get("/", verifyToken, verifyUserAuthorization, findAllPayroll);
router.get(
  "/coordinator",
  verifyToken,
  verifyCoordinator,
  findAllPayrollsCoordinators
);
router.put(
  "/validated/:pid",
  verifyToken,
  verifyInternalControl,
  validatedPayrolls
);
router.put(
  "/correctpayroll/:pid",
  verifyToken,
  verifyUserAdminAndInternalControl,
  correctPayrolls
);
router.put(
  "/corrected/:pid",
  verifyToken,
  verifyCoordinator,
  correctedPayrolls
);
router.put("/update/:pid", verifyToken, verifyCoordinator, updatePayrolls);
router.delete("/delete/:pid", verifyToken, verifyCoordinator, deletePayrolls);

export default router;
