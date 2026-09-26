const express = require("express");

const router = express.Router();

const {
  getHomepage,
  uploadHomepageImage,
  deleteHomepageImage,
  uploadHomepageVideo,
  deleteHomepageVideo,
} = require("../controllers/homepageController");

const {
  uploadHomepage,
  uploadHomepageVideo: uploadHomepageVideoMiddleware,
} = require("../middleware/homepageUpload");

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

// DELETE /api/homepage/images/:field

router.delete("/images/:field", deleteHomepageImage);

// ======================================================
// UPLOAD HOMEPAGE VIDEO
// ======================================================

// POST /api/homepage/videos/heroVideo
// POST /api/homepage/videos/fashionVideo

router.post(
  "/videos/:field",
  uploadHomepageVideoMiddleware.single("video"),
  uploadHomepageVideo,
);

// ======================================================
// DELETE HOMEPAGE VIDEO
// ======================================================

// DELETE /api/homepage/videos/heroVideo
// DELETE /api/homepage/videos/fashionVideo

router.delete("/videos/:field", deleteHomepageVideo);

module.exports = router;
