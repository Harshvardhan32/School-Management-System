const cloudinary = require('cloudinary').v2;
const User = require('../../models/User');

exports.updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.body;
        const photo = req.file;

        if (!id) {
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

        const options = {
            resource_type: 'auto'
        }

        let imageDetails;
        try {
            imageDetails = await cloudinary.uploader.upload(photo, options);
        } catch (error) {
            throw new Error(error.message);
        }

        const image = imageDetails ? imageDetails?.secure_url : `https://api.dicebear.com/8.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`;

        const updatedDetails = await User.findByIdAndUpdate(
            id,
            {
                photo: image
            }
        );

        return res.status(200).json({
            success: true,
            data: updatedDetails,
            message: 'Profile picture updated successsfully!'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}