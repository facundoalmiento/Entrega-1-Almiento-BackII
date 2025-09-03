import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roles.js";
import * as cartService from "../services/cart.service.js";

const router = Router();


router.get("/:cid", requireAuth, authorizeRoles("user"), async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", requireAuth, authorizeRoles("user"), async (_req, res) => {
  try {
    const cart = await cartService.createCart();
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:cid/product/:pid", requireAuth, authorizeRoles("user"), async (req, res) => {
  try {
    const result = await cartService.addProductByID(req.params.cid, req.params.pid);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:cid/product/:pid", requireAuth, authorizeRoles("user"), async (req, res) => {
  try {
    const result = await cartService.deleteProductByID(req.params.cid, req.params.pid);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:cid", requireAuth, authorizeRoles("user"), async (req, res) => {
  try {
    const result = await cartService.updateAllProducts(req.params.cid, req.body.products);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:cid/product/:pid", requireAuth, authorizeRoles("user"), async (req, res) => {
  try {
    const result = await cartService.updateProductByID(req.params.cid, req.params.pid, req.body.quantity);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:cid", requireAuth, authorizeRoles("user"), async (req, res) => {
  try {
    const result = await cartService.deleteAllProducts(req.params.cid);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
