const Announcement = require('../../models/Announcement');

exports.createAnnouncement = async (req, res) => {
    try {

        const {
            title,
            description,
            date
        } = req.body;

        if (!title || !description || !date) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const announcementResponse = await Announcement.create({
            title, description, date
        });

        return res.status(200).json({
            success: true,
            data: announcementResponse,
            message: "Announcement  Created Successfully!"
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.updateAnnouncement = async (req, res) => {
    try {

        const {
            id,
            title,
            description,
            date
        } = req.body;

        if (!id || !title || !description || !date) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const existingAnnouncement = await Announcement.findById(id);

        if (!existingAnnouncement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found with the given ID!'
            })
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(id,
            {
                title,
                description,
                date
            }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedAnnouncement,
            message: "Announcement  Updated Successfully!"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.deleteAnnouncement = async (req, res) => {
    try {

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Announcement ID is required!'
            })
        }

        const existingAnnouncement = await Announcement.findById(_id);

        if (!existingAnnouncement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found with the given ID!'
            })
        }

        const deletedAnnouncement = await Announcement.findByIdAndDelete(_id);

        return res.status(200).json({
            success: true,
            data: deletedAnnouncement,
            message: 'Announcement Deleted Successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.getAllAnnouncement = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Announcement.find();

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Announcement.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Announcements fetched successfully!',
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
};