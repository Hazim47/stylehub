const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createOrder,
  getOrders,
  getOrder,
  updateStatus,
} = require("../controllers/orderController");

// Public

router.post("/", createOrder);

// Admin

router.get("/", auth, getOrders);

router.get("/:id", auth, getOrder);

router.patch("/:id/status", auth, updateStatus);

module.exports = router;
