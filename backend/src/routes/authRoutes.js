const express = require("express");

const router = express.Router();

const { login } = require("../controllers/authController");
const { googleLogin } = require("../controllers/googleAuthController");

router.post("/google", googleLogin);
router.post("/login", login);

module.exports = router;
