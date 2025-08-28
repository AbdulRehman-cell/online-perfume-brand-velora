// upload.js
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: { // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg", "webp"]
  }
});

// Multer upload
const upload = multer({ storage });

module.exports = upload;
