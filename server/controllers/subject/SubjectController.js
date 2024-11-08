const Subject = require('../../models/Subject');

exports.createSubject = async (req, res) => {
    try {

        const { subjectName, classId, teacher, lessons } = req.body;

        if (!subjectName || !classId || !teacher || !lessons) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const subjectResponse = await Subject.create({
            subjectName,
            classId,
            teacher,
            lessons
        });

        return res.status(200).json({
            success: true,
            data: subjectResponse,
            message: "Subject created successfully!"
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

exports.updateSubject = async (req, res) => {
    try {

        const { subjectId, subjectName, classId, teacher, lessons } = req.body;

        if (!subjectId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const updatedResponse = await Subject.findByIdAndUpdate(subjectId, { subjectName, classId, teacher, lessons }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: "Subject updated successfully!"
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

exports.deleteSubject = async (req, res) => {
    try {

        const { subjectId } = req.body;

        if (!subjectId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const deletedResponse = await Subject.findByIdAndDelete(subjectId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: "Subject deleted successfully!"
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

exports.getSubject = async (req, res) => {
    try {

        const { subjectId } = req.body;

        if (!subjectId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const subjectResponse = await Subject.findById(subjectId);

        return res.status(200).json({
            success: true,
            data: subjectResponse,
            message: "Subject fetched successfully!"
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

exports.getAllSubject = async (req, res) => {
    try {

        const subjectResponse = await Subject.find();

        return res.status(200).json({
            success: true,
            data: subjectResponse,
            message: "All subjects fetched successfully!"
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