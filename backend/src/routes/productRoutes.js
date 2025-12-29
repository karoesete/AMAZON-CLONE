import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// POST /api/products (admin)
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
