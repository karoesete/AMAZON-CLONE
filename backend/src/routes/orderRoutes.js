import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my
router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.json(orders);
});

export default router;
