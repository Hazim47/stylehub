const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const resizeProductImage = require("../middleware/imageResize");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");

const productValidator = require("../validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// =====================
// Public
// =====================

router.get("/", getProducts);

router.get("/:id", getProduct);

// =====================
// Admin
// =====================

// Create Product
router.post(
  "/",
  auth,
  upload.array("images", 10),
  resizeProductImage,
  productValidator,
  validate,
  createProduct,
);

// Update Product

router.put(
  "/:id",
  auth,
  upload.array("images", 10),
  resizeProductImage,
  updateProduct,
);

// Delete Product

router.delete("/:id", auth, deleteProduct);

module.exports = router;
