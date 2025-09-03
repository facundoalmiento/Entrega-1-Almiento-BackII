import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roles.js";
import * as productService from "../services/product.service.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await productService.getAllProducts(req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const prod = await productService.getProductById(req.params.pid);
    if (!prod) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(prod);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const created = await productService.createProduct(req.body);
      res.status(201).json(created);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.put(
  "/:pid",
  requireAuth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const updated = await productService.updateProduct(req.params.pid, req.body);
      if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
      res.json(updated);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

router.delete(
  "/:pid",
  requireAuth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deleted = await productService.deleteProduct(req.params.pid);
      if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ message: "Producto eliminado" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
);

export default router;
