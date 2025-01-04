const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = async (file) => {
    const options = {
        folder: 'School Management System',
        quality: 70,
        resource_type: 'auto'
    };

    const imageDetails = await cloudinary.uploader.upload(file.tempFilePath, options);

    return imageDetails;
}

module.exports = uploadToCloudinary;