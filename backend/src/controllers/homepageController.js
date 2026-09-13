const { HomepageSettings } = require("../models");
const cloudinary = require("../config/cloudinary");

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
// CLOUDINARY FOLDER
// ======================================================

const CLOUDINARY_FOLDER = "stylehub/homepage";

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
// UPLOAD BUFFER TO CLOUDINARY
// ======================================================

const uploadToCloudinary = (buffer, field) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,

        // اسم ثابت لكل صورة Homepage
        // بحيث نستبدل الصورة القديمة بدل إنشاء نسخ كثيرة
        public_id: field,

        resource_type: "image",

        // يستبدل الصورة القديمة بنفس public_id
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
};

// ======================================================
// DELETE CLOUDINARY IMAGE
// ======================================================

const deleteFromCloudinary = async (field) => {
  try {
    const publicId = `${CLOUDINARY_FOLDER}/${field}`;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    console.log(`Cloudinary delete result for ${field}:`, result.result);

    return result;
  } catch (error) {
    console.error(`CLOUDINARY DELETE ERROR (${field}):`, error);

    return null;
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
    // Upload to Cloudinary
    // --------------------------------------------------

    const result = await uploadToCloudinary(req.file.buffer, field);

    console.log(`Homepage image uploaded to Cloudinary: ${field}`);

    console.log("Cloudinary URL:", result.secure_url);

    // --------------------------------------------------
    // Save Cloudinary URL
    // --------------------------------------------------

    await homepage.update({
      [field]: result.secure_url,
    });

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      message: "Homepage image uploaded successfully",

      field,

      image: result.secure_url,

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
    // Delete from Cloudinary
    // --------------------------------------------------

    await deleteFromCloudinary(field);

    // --------------------------------------------------
    // Remove URL from database
    // --------------------------------------------------

    await homepage.update({
      [field]: null,
    });

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

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

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getHomepage,
  uploadHomepageImage,
  deleteHomepageImage,
};
