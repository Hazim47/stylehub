const axios = require("axios");
const cloudinary = require("../config/cloudinary");

const uploadGoogleImage = async (imageUrl, googleId) => {
  const response = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });

  const base64 =
    "data:image/jpeg;base64," + Buffer.from(response.data).toString("base64");

  const result = await cloudinary.uploader.upload(base64, {
    folder: "stylehub/users",
    public_id: googleId,
    overwrite: false,
  });

  return result.secure_url;
};

module.exports = uploadGoogleImage;
