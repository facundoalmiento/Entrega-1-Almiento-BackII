import { Router } from "express";
import { getAllProducts } from "../services/product.service.js";
import { getProductsFromCartByID } from "../services/cart.service.js";

const router = Router();

router.get("/products", async (req, res) => {
  const products = await getAllProducts(req.query, req.baseUrl + req.path);

  res.render("index", {
    title: "Productos",
    style: "index.css",
    products: products.docs, // ya vienen lean
    prevLink: {
      exist: !!products.prevLink,
      link: products.prevLink
    },
    nextLink: {
      exist: !!products.nextLink,
      link: products.nextLink
    }
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await getAllProducts(req.query, req.baseUrl + req.path);

  res.render("realTimeProducts", {
    title: "Productos",
    style: "index.css",
    products: products.docs
  });
});

router.get("/cart/:cid", async (req, res) => {
  const response = await getProductsFromCartByID(req.params.cid);

  if (response.status === "error") {
    return res.render("notFound", {
      title: "Not Found",
      style: "index.css"
    });
  }

  res.render("cart", {
    title: "Carrito",
    style: "index.css",
    products: response.products
  });
});

export default router;
