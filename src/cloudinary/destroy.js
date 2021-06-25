const cloudinary = require("cloudinary");

const destroy = (file) => {
  cloudinary.v2.uploader.destroy(file, (error, result) => {
    console.log(result, error);
  });
};

module.exports = destroy;
  