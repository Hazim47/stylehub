const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const cloudinary = require("../config/cloudinary");

const resizeProductImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const newFiles = [];

    for (const file of req.files) {
      const inputPath = file.path;

      const newFilename =
        Date.now() + "-" + Math.round(Math.random() * 999999) + ".webp";

      const outputPath = path.join(
        __dirname,
        "../uploads/products",
        newFilename,
      );

      // --------------------------------------------------
      // RESIZE + CONVERT TO WEBP
      // --------------------------------------------------

      await sharp(inputPath)
        .resize(600, 800, {
          fit: "cover",
          position: "center",
        })
        .webp({
          quality: 90,
        })
        .toFile(outputPath);

      // --------------------------------------------------
      // UPLOAD TO CLOUDINARY
      // --------------------------------------------------

      const result = await cloudinary.uploader.upload(outputPath, {
        folder: "stylehub/products",
        resource_type: "image",
        format: "webp",
      });

      // --------------------------------------------------
      // DELETE LOCAL FILES
      // --------------------------------------------------

      try {
        await fsPromises.unlink(inputPath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.log("Original image delete skipped:", error.message);
        }
      }

      try {
        await fsPromises.unlink(outputPath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.log("Processed image delete skipped:", error.message);
        }
      }

      // --------------------------------------------------
      // SAVE CLOUDINARY DATA
      // --------------------------------------------------

      newFiles.push({
        ...file,
        filename: result.secure_url,
        cloudinaryUrl: result.secure_url,
        cloudinaryPublicId: result.public_id,
      });
    }

    req.files = newFiles;

    next();
  } catch (error) {
    console.error("PRODUCT IMAGE UPLOAD ERROR:", error);

    next(error);
  }
};

module.exports = resizeProductImages;
