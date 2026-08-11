const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const uploadGoogleImage = require("../utils/uploadGoogleImage");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is missing");

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google token",
      });
    }

    const {
      email,
      name,
      picture: googlePicture,
      sub: googleId,
      email_verified,
    } = payload;

    if (!email || !email_verified || !googleId) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google account",
      });
    }

    let user = await User.findOne({
      where: {
        email,
      },
    });

    // New user
    if (!user) {
      let cloudinaryPicture = null;

      if (googlePicture) {
        cloudinaryPicture = await uploadGoogleImage(googlePicture, googleId);
      }

      user = await User.create({
        name: name || "Google User",
        email,
        picture: cloudinaryPicture,
        googleId,
        google: true,
      });
    } else {
      // Existing user
      const updates = {};

      if (!user.googleId) {
        updates.googleId = googleId;
      }

      if (googlePicture && !user.picture) {
        updates.picture = await uploadGoogleImage(googlePicture, googleId);
      }

      if (Object.keys(updates).length > 0) {
        await user.update(updates);
      }
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(401).json({
      success: false,
      message: "Google login failed",
    });
  }
};

module.exports = {
  googleLogin,
};
