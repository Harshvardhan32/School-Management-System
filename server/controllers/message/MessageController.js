const Message = require("../../models/Message");

exports.createMessage = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        const messageResponse = await Message.create({ title, content });

        return res.status(200).json({
            success: true,
            data: messageResponse,
            message: 'Message Created Successfully!'
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

exports.updateMessage = async (req, res) => {
    try {
        const { id, title, content } = req.body;

        if (!id || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            });
        }

        const existingMessage = await Message.findById(id);

        if (!existingMessage) {
            return res.status(404).json({
                success: false,
                message: 'Message not found with the given ID!'
            })
        }

        const updatedMessage = await Message.findByIdAndUpdate(id, { title, content });

        return res.status(200).json({
            success: true,
            data: updatedMessage,
            message: 'Message Updated Successfully!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

exports.deleteMessage = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: 'Message ID is required!'
            })
        }

        // Check if the message exists
        const existingMessage = await Message.findById(_id);

        if (!existingMessage) {
            return res.status(404).json({
                success: false,
                message: 'Message not found with the given ID!',
            });
        }

        // Delete the message
        const deletedMessage = await Message.findByIdAndDelete(_id);

        return res.status(200).json({
            success: true,
            data: deletedMessage,
            message: 'Message Deleted Successfully!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        });
    }
}

exports.getAllMessages = async (req, res) => {
    try {
        const messageData = await Message.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: messageData,
            message: 'Messages fetched successfully!',
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!",
        });
    }
}