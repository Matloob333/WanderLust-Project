const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Only configure cloudinary if environment variables are available
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configured successfully');
} else {
  console.warn('Cloudinary credentials not found. Image upload functionality will be disabled.');
}

// Create storage with fallback for when cloudinary is not configured
let storage;
if (process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_DEV',
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });
} else {
  // Fallback to memory storage when cloudinary is not configured
  const multer = require('multer');
  storage = multer.memoryStorage();
}

module.exports = {
  cloudinary,
  storage,
};