const { HomepageSettings } = require("../models");
const fs = require("fs/promises");
const path = require("path");

// ======================================================
// ALLOWED IMAGE FIELDS
// ======================================================

const ALLOWED_FIELDS = [
  "heroImage1",
  "heroImage2",
  "summerImage",
  "springImage",
  "autumnImage",
  "winterImage",
];

// ======================================================
// GET /api/homepage
// ======================================================

const getHomepage = async (req, res) => {
  try {
    let homepage = await HomepageSettings.findOne();

    // إذا ما في سجل، أنشئ واحد
    if (!homepage) {
      homepage = await HomepageSettings.create({});
    }

    res.status(200).json(homepage);
  } catch (error) {
    console.error("GET HOMEPAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to get homepage settings",
      error: error.message,
    });
  }
};

// ======================================================
// POST /api/homepage/images/:field
// ======================================================

const uploadHomepageImage = async (req, res) => {
  try {
    const { field } = req.params;

    // --------------------------------------------------
    // Check field
    // --------------------------------------------------

    if (!ALLOWED_FIELDS.includes(field)) {
      return res.status(400).json({
        message: "Invalid homepage image field",
        allowedFields: ALLOWED_FIELDS,
      });
    }

    // --------------------------------------------------
    // Check image
    // --------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    // --------------------------------------------------
    // Get homepage settings
    // --------------------------------------------------

    let homepage = await HomepageSettings.findOne();

    if (!homepage) {
      homepage = await HomepageSettings.create({});
    }

    // --------------------------------------------------
    // Delete old image
    // --------------------------------------------------

    const oldImage = homepage[field];

    if (oldImage) {
      try {
        const oldFileName = path.basename(oldImage);

        const oldFilePath = path.join(
          __dirname,
          "..",
          "uploads",
          "homepage",
          oldFileName,
        );

        await fs.unlink(oldFilePath);

        console.log("Old homepage image deleted:", oldFileName);
      } catch (error) {
        console.log("Old homepage image not found:", error.message);
      }
    }

    // --------------------------------------------------
    // Build image URL
    // --------------------------------------------------

    const imageUrl = `${req.protocol}://${req.get(
      "host",
    )}/uploads/homepage/${req.file.filename}`;

    // --------------------------------------------------
    // Save image URL
    // --------------------------------------------------

    await homepage.update({
      [field]: imageUrl,
    });

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      message: "Homepage image uploaded successfully",

      field,

      image: imageUrl,

      homepage,
    });
  } catch (error) {
    console.error("UPLOAD HOMEPAGE IMAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to upload homepage image",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE /api/homepage/images/:field
// ======================================================

const deleteHomepageImage = async (req, res) => {
  try {
    const { field } = req.params;

    // --------------------------------------------------
    // Check field
    // --------------------------------------------------

    if (!ALLOWED_FIELDS.includes(field)) {
      return res.status(400).json({
        message: "Invalid homepage image field",
      });
    }

    // --------------------------------------------------
    // Get homepage
    // --------------------------------------------------

    const homepage = await HomepageSettings.findOne();

    if (!homepage) {
      return res.status(404).json({
        message: "Homepage settings not found",
      });
    }

    // --------------------------------------------------
    // Check image
    // --------------------------------------------------

    const image = homepage[field];

    if (!image) {
      return res.status(404).json({
        message: "No image exists for this field",
      });
    }

    // --------------------------------------------------
    // Delete physical file
    // --------------------------------------------------

    try {
      const fileName = path.basename(image);

      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "homepage",
        fileName,
      );

      await fs.unlink(filePath);

      console.log("Homepage image deleted:", fileName);
    } catch (error) {
      console.log("Could not delete physical image:", error.message);
    }

    // --------------------------------------------------
    // Remove from database
    // --------------------------------------------------

    await homepage.update({
      [field]: null,
    });

    res.status(200).json({
      message: "Homepage image deleted successfully",
      field,
      homepage,
    });
  } catch (error) {
    console.error("DELETE HOMEPAGE IMAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to delete homepage image",
      error: error.message,
    });
  }
};

module.exports = {
  getHomepage,
  uploadHomepageImage,
  deleteHomepageImage,
};
