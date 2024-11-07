const Exam = require('../../models/Exam');

exports.createExam = async (req, res) => {
    try {

        const { examName, description, startDate, endDate, subjects } = req.body;

        if (!examName || !description || !startDate || !endDate || !subjects) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const examResponse = await Exam.create({ examName, description, startDate, endDate, subjects });

        return res.status(200).json({
            success: true,
            data: examResponse,
            message: 'Exam created successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: true,
            message: 'Internal Server Error!'
        })
    }
}

exports.updateExam = async (req, res) => {
    try {

        const { examId, examName, description, startDate, endDate, subjects } = req.body;

        if (!examId || !examName || !description || !startDate || !endDate || !subjects) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const updatedResponse = await Exam.findByIdAndUpdate(examId, { examName, description, startDate, endDate, subjects }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Exam updated successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: true,
            message: 'Internal Server Error!'
        })
    }
}

exports.deleteExam = async (req, res) => {
    try {

        const { examId } = req.body;

        if (!examId) {
            return res.status(400).json({
                success: false,
                message: 'Exam deleted successfully!'
            })
        }

        const deletedResponse = await Exam.findByIdAndDelete(examId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: 'Exam deleted successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: true,
            message: 'Internal Server Error!'
        })
    }
}

exports.getAllExam = async (req, res) => {
    try {

        const allExams = await Exam.find();

        return res.status(200).json({
            success: true,
            data: allExams,
            message: 'All exam fetched successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: true,
            message: 'Internal Server Error!'
        })
    }
}