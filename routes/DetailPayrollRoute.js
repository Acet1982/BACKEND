import { Router } from "express";
import {
  findAllDetailsPayrolls,
  createPayrollDetails,
  deleteDetailPayrolls,
  updateDetailPayrolls,
} from "../controllers/DetailPayrollController.js";

const router = Router();

router.get("/", findAllDetailsPayrolls);
router.post("/:pid/employee/:eid", createPayrollDetails);
router.put("/update/:pdid", updateDetailPayrolls);
router.delete("/delete/:pdid", deleteDetailPayrolls);

export default router;
