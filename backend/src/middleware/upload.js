const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/products");
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
