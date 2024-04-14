const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinaryConfig");

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");

const uploadToCloudinary = (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const options = { folder: folderName };
    let stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = {
  multerUploads,
  uploadToCloudinary,
};
