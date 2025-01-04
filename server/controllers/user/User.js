const User = require('../../models/User');
const cloudinary = require('cloudinary').v2;
const uploadToCloudinary = require('../../utils/uploadToCloudinary');

exports.updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.body;
        const photo = req.files.photo;

        if (!id || !photo) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found with the given ID!'
            })
        }

        // Check if the user already has a photo
        const currentPhoto = user.photo === `https://api.dicebear.com/8.x/initials/svg?seed=${user?.firstName} ${user?.lastName}` ? null : user.photo;

        if (currentPhoto) {
            // Extract the public_id from the Cloudinary URL if present
            const publicId = currentPhoto.split('/').pop().split('.')[0]; // Cloudinary URL pattern

            // Remove the old photo from Cloudinary if there is one
            await cloudinary.uploader.destroy(publicId);
        }

        // Upload the new photo to Cloudinary
        let imageDetails = await uploadToCloudinary(photo);

        // If the upload fails, use a default avatar
        const image = imageDetails
            ? imageDetails?.secure_url
            : `https://api.dicebear.com/8.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`;

        // Update the user's profile photo
        const updatedDetails = await User.findByIdAndUpdate(
            id,
            { photo: image },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: updatedDetails,
            message: 'Profile Picture Updated Successsfully!'
        });
    } catch (error) {
        console.log("Error: ", error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
};