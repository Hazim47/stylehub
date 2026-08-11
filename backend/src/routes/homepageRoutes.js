const express = require("express");

const router = express.Router();

const {
  getHomepage,
  uploadHomepageImage,
  deleteHomepageImage,
} = require("../controllers/homepageController");

const uploadHomepage = require("../middleware/homepageUpload");

// ======================================================
// GET HOMEPAGE
// ======================================================

// GET /api/homepage

router.get("/", getHomepage);

// ======================================================
// UPLOAD HOMEPAGE IMAGE
// ======================================================

// POST /api/homepage/images/heroImage1
// POST /api/homepage/images/heroImage2
// POST /api/homepage/images/summerImage
// POST /api/homepage/images/springImage
// POST /api/homepage/images/autumnImage
// POST /api/homepage/images/winterImage

router.post(
  "/images/:field",
  uploadHomepage.single("image"),
  uploadHomepageImage,
);

// ======================================================
// DELETE HOMEPAGE IMAGE
// ======================================================

// DELETE /api/homepage/images/heroImage1

router.delete("/images/:field", deleteHomepageImage);

module.exports = router;
