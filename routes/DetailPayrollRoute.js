import { Router } from "express";
import {
  findAllDetailsPayrolls,
  createPayrollDetails,
  deleteDetailPayrolls,
  updateDetailPayrolls,
  findPayrollDetailPeriods,
  findOneDetails,
} from "../controllers/DetailPayrollController.js";
import {
  verifyAdmin,
  verifyCoordinator,
  verifyToken,
  verifyUserAuthorization,
  verifyUserAuthorizationAllUsers,
} from "../middlewares/JwtAuthUser.js";

const router = Router();
router.get("/", verifyToken, verifyUserAuthorization, findPayrollDetailPeriods);
router.get(
  "/employee/:pdid",
  findOneDetails
);
router.get(
  "/:pid",
  verifyToken,
  verifyUserAuthorizationAllUsers,
  findAllDetailsPayrolls
);
router.post(
  "/:pid/employee/:eid",
  verifyToken,
  verifyCoordinator,
  createPayrollDetails
);
router.put(
  "/update/:pdid",
  verifyToken,
  verifyCoordinator,
  updateDetailPayrolls
);
router.delete(
  "/delete/:pdid",
  verifyToken,
  verifyCoordinator,
  deleteDetailPayrolls
);

export default router;
