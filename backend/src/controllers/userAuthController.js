const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleUserLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,

      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      user = await User.create({
        name: payload.name,

        email: payload.email,

        picture: payload.picture,

        google: true,
      });
    }

    const jwtToken = jwt.sign(
      {
        id: user.id,

        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    res.json({
      success: true,

      token: jwtToken,

      user,
    });
  } catch (error) {
    res.status(401).json({
      message: "Google login failed",
    });
  }
};

module.exports = {
  googleUserLogin,
};
