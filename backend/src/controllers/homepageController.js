const { HomepageSettings } = require("../models");
const cloudinary = require("../config/cloudinary");

// ======================================================
// ALLOWED IMAGE FIELDS
// ======================================================

const ALLOWED_IMAGE_FIELDS = [
  "heroImage1",
  "heroImage2",
  "summerImage",
  "springImage",
  "autumnImage",
  "winterImage",
];

// ======================================================
// ALLOWED VIDEO FIELDS
// ======================================================

const ALLOWED_VIDEO_FIELDS = ["heroVideo", "fashionVideo"];

// ======================================================
// CLOUDINARY FOLDER
// ======================================================

const CLOUDINARY_FOLDER = "stylehub/homepage";

// ======================================================
// GET HOMEPAGE
// ======================================================

const getHomepage = async (req, res) => {
  try {
    let homepage = await HomepageSettings.findOne();

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
// UPLOAD IMAGE TO CLOUDINARY
// ======================================================

const uploadImageToCloudinary = (buffer, field) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,

        public_id: field,

        resource_type: "image",

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
// UPLOAD VIDEO TO CLOUDINARY
// ======================================================

const uploadVideoToCloudinary = (buffer, field) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,

        public_id: field,

        resource_type: "video",

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
// DELETE IMAGE FROM CLOUDINARY
// ======================================================

const deleteImageFromCloudinary = async (field) => {
  try {
    const publicId = `${CLOUDINARY_FOLDER}/${field}`;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    console.log(`Cloudinary image delete result for ${field}:`, result.result);

    return result;
  } catch (error) {
    console.error(`CLOUDINARY IMAGE DELETE ERROR (${field}):`, error);

    return null;
  }
};

// ======================================================
// DELETE VIDEO FROM CLOUDINARY
// ======================================================

const deleteVideoFromCloudinary = async (field) => {
  try {
    const publicId = `${CLOUDINARY_FOLDER}/${field}`;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    console.log(`Cloudinary video delete result for ${field}:`, result.result);

    return result;
  } catch (error) {
    console.error(`CLOUDINARY VIDEO DELETE ERROR (${field}):`, error);

    return null;
  }
};

// ======================================================
// UPLOAD HOMEPAGE IMAGE
// ======================================================

const uploadHomepageImage = async (req, res) => {
  try {
    const { field } = req.params;

    // --------------------------------------------------
    // Check field
    // --------------------------------------------------

    if (!ALLOWED_IMAGE_FIELDS.includes(field)) {
      return res.status(400).json({
        message: "Invalid homepage image field",

        allowedFields: ALLOWED_IMAGE_FIELDS,
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
    // Get homepage
    // --------------------------------------------------

    let homepage = await HomepageSettings.findOne();

    if (!homepage) {
      homepage = await HomepageSettings.create({});
    }

    // --------------------------------------------------
    // Upload image
    // --------------------------------------------------

    const result = await uploadImageToCloudinary(req.file.buffer, field);

    console.log(`Homepage image uploaded: ${field}`);

    console.log("Cloudinary URL:", result.secure_url);

    // --------------------------------------------------
    // Save URL
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
// DELETE HOMEPAGE IMAGE
// ======================================================

const deleteHomepageImage = async (req, res) => {
  try {
    const { field } = req.params;

    // --------------------------------------------------
    // Check field
    // --------------------------------------------------

    if (!ALLOWED_IMAGE_FIELDS.includes(field)) {
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

    await deleteImageFromCloudinary(field);

    // --------------------------------------------------
    // Remove URL
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
// UPLOAD HOMEPAGE VIDEO
// ======================================================

const uploadHomepageVideo = async (req, res) => {
  try {
    const { field } = req.params;

    // --------------------------------------------------
    // Check field
    // --------------------------------------------------

    if (!ALLOWED_VIDEO_FIELDS.includes(field)) {
      return res.status(400).json({
        message: "Invalid homepage video field",

        allowedFields: ALLOWED_VIDEO_FIELDS,
      });
    }

    // --------------------------------------------------
    // Check video
    // --------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        message: "No video uploaded",
      });
    }

    // --------------------------------------------------
    // Get homepage
    // --------------------------------------------------

    let homepage = await HomepageSettings.findOne();

    if (!homepage) {
      homepage = await HomepageSettings.create({});
    }

    // --------------------------------------------------
    // Upload original video to Cloudinary
    // --------------------------------------------------

    const result = await uploadVideoToCloudinary(req.file.buffer, field);

    console.log(`Homepage video uploaded: ${field}`);

    console.log("Cloudinary URL:", result.secure_url);

    // --------------------------------------------------
    // Save URL
    // --------------------------------------------------

    await homepage.update({
      [field]: result.secure_url,
    });

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(200).json({
      message: "Homepage video uploaded successfully",

      field,

      video: result.secure_url,

      homepage,
    });
  } catch (error) {
    console.error("UPLOAD HOMEPAGE VIDEO ERROR:", error);

    res.status(500).json({
      message: "Failed to upload homepage video",

      error: error.message,
    });
  }
};

// ======================================================
// DELETE HOMEPAGE VIDEO
// ======================================================

const deleteHomepageVideo = async (req, res) => {
  try {
    const { field } = req.params;

    // --------------------------------------------------
    // Check field
    // --------------------------------------------------

    if (!ALLOWED_VIDEO_FIELDS.includes(field)) {
      return res.status(400).json({
        message: "Invalid homepage video field",
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
    // Check video
    // --------------------------------------------------

    const video = homepage[field];

    if (!video) {
      return res.status(404).json({
        message: "No video exists for this field",
      });
    }

    // --------------------------------------------------
    // Delete from Cloudinary
    // --------------------------------------------------

    await deleteVideoFromCloudinary(field);

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
      message: "Homepage video deleted successfully",

      field,

      homepage,
    });
  } catch (error) {
    console.error("DELETE HOMEPAGE VIDEO ERROR:", error);

    res.status(500).json({
      message: "Failed to delete homepage video",

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

  uploadHomepageVideo,
  deleteHomepageVideo,
};
