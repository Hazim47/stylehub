const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads", "products");

// إنشاء المجلد تلقائيًا إذا لم يكن موجودًا
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const name =
      Date.now() +
      "-" +
      Math.round(Math.random() * 999999) +
      path.extname(file.originalname);

    cb(null, name);
  },
});

module.exports = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
