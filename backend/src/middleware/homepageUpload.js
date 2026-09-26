const multer = require("multer");

// ======================================================
// STORAGE
// ======================================================

// نخزن الملف مؤقتاً في الذاكرة
// ثم نرفعه مباشرة إلى Cloudinary
const storage = multer.memoryStorage();

// ======================================================
// IMAGE FILTER
// ======================================================

const imageFileFilter = (req, file, cb) => {
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
// VIDEO FILTER
// ======================================================

const videoFileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only MP4, WEBM and MOV videos are allowed"), false);
  }
};

// ======================================================
// IMAGE UPLOAD
// ======================================================

const uploadHomepage = multer({
  storage,
  fileFilter: imageFileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// ======================================================
// VIDEO UPLOAD
// ======================================================

const uploadHomepageVideo = multer({
  storage,
  fileFilter: videoFileFilter,

  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB
  },
});

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  uploadHomepage,
  uploadHomepageVideo,
};
