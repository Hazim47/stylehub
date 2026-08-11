const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ======================================================
// ROUTES
// ======================================================

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const settingRoutes = require("./routes/settingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const couponRoutes = require("./routes/couponRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const homepageRoutes = require("./routes/homepageRoutes");

const errorHandler = require("./middleware/errorHandler");

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ======================================================
// STATIC FILES
// ======================================================

// Product images

app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "uploads/products")),
);

// Homepage images

app.use(
  "/uploads/homepage",
  express.static(path.join(__dirname, "../uploads/homepage")),
);

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/notifications", notificationRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/settings", settingRoutes);

app.use("/api/homepage", homepageRoutes);

// ======================================================
// ERROR HANDLER
// ======================================================

app.use(errorHandler);

// ======================================================
// TEST API
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StyleHub API Running 🚀",
  });
});

module.exports = app;
