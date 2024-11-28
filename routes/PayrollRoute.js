import { Router } from "express";
import {
  createPayrolls,
  deletePayrolls,
  findAllPayroll,
  findAllPayrollsCoordinators,
  updatePayrolls,
} from "../controllers/PayrollController.js";
import {
  verifyAdmin,
  verifyCoordinator,
  verifyUserAuthorization,
  verifyToken,
} from "../middlewares/JwtAuthUser.js";

const router = Router();

router.post("/create", verifyToken, verifyCoordinator, createPayrolls);
router.get("/", verifyToken, verifyAdmin, findAllPayroll);
router.get(
  "/coordinator",
  verifyToken,
  verifyCoordinator,
  findAllPayrollsCoordinators
);
router.put("/update/:pid", verifyToken, verifyCoordinator, updatePayrolls);
router.delete("/delete/:pid", verifyToken, verifyCoordinator, deletePayrolls);

export default router;
