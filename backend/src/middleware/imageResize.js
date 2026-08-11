const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

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

      await sharp(inputPath)
        .resize(600, 800, {
          fit: "cover",
          position: "center",
        })
        .webp({
          quality: 90,
        })
        .toFile(outputPath);

      await new Promise((resolve) => {
        setTimeout(() => {
          fs.unlink(inputPath, (err) => {
            if (err) {
              console.log("Original image delete skipped:", err.message);
            }
            resolve();
          });
        }, 500);
      });

      newFiles.push({
        ...file,
        filename: newFilename,
      });
    }

    req.files = newFiles;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = resizeProductImages;
