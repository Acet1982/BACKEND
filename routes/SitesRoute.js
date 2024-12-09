import { Router } from "express";
import {
  getSites,
  createSites,
  deleteSites,
} from "../controllers/SiteController.js";
import {
  verifyAdmin,
  verifyToken,
  verifyUserAuthorizationAllUsers,
} from "../middlewares/JwtAuthUser.js";

const router = Router();

router.get("/", verifyToken, verifyUserAuthorizationAllUsers, getSites);
router.post("/create", verifyToken, verifyAdmin, createSites);
router.delete("/delete/:sid", verifyToken, verifyAdmin, deleteSites);

export default router;
