const Announcement = require('../../models/Announcement');

exports.createAnnouncement = async (req, res) => {
    try {

        const {
            title,
            description,
            date
        } = req.body;

        if (!title || !description) {
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

exports.updateAnnouncement = async (req, res) => {
    try {

        const {
            announcementId,
            title,
            description,
            date
        } = req.body;

        if (!announcementId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const announcementData = await Announcement.findById(announcementId);

        if (!announcementData) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not exist with the given ID!'
            })
        }

        const updatedResponse = await Announcement.findByIdAndUpdate(announcementId, { title, description, date }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: "Announcement  Created Successfully!"
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

exports.deleteAnnouncement = async (req, res) => {
    try {

        const { announcementId } = req.body;

        if (!announcementId) {
            return res.status(400).json({
                success: false,
                message: 'Announcement ID is required!'
            })
        }

        const deletedResponse = await Announcement.findByIdAndDelete(announcementId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: 'Announcement deleted successfully!'
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

        const allAnnouncement = await Announcement.find();

        return res.status(200).json({
            success: true,
            data: allAnnouncement,
            message: 'All announcement fetched successfully!'
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