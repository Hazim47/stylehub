const multer = require("multer");

// ======================================================
// STORAGE
// ======================================================

// نخزن الصورة مؤقتًا في الذاكرة
// حتى نرفعها مباشرة إلى Cloudinary
const storage = multer.memoryStorage();

// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG, WEBP and AVIF images are allowed"),
      false,
    );
  }
};

// ======================================================
// MULTER
// ======================================================

const uploadHomepage = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = uploadHomepage;
