import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roles.js";
import * as purchaseController from "../controllers/purchase.controller.js";

const router = Router();

router.post("/:cid", requireAuth, authorizeRoles("user"), purchaseController.purchaseCart);

export default router;
