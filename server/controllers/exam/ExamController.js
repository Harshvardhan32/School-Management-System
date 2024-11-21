const Exam = require('../../models/Exam');

exports.createExam = async (req, res) => {
    try {

        const {
            examName,
            description,
            startDate,
            endDate,
            subjects
        } = req.body;

        if (!examName || !description || !startDate || !endDate || !subjects) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required details!'
            })
        }

        const examRecord = await Exam.create({
            examName,
            description,
            startDate,
            endDate,
            subjects
        });

        const examResponse = await Exam.findById(examRecord?._id)
        // .populate('subjects');

        return res.status(200).json({
            success: true,
            data: examResponse,
            message: 'Exam created successfully!'
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: true,
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.updateExam = async (req, res) => {
    try {

        const { examId, examName, description, startDate, endDate, subjects } = req.body;

        if (!examId) {
            return res.status(400).json({
                success: false,
                message: 'Exam ID is required!'
            })
        }

        const examData = await Exam.findById(examId);

        if (!examData) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found with the given ID!'
            })
        }

        const updatedResponse = await Exam.findByIdAndUpdate(examId,
            {
                examName,
                description,
                startDate,
                endDate,
                subjects
            },
            { new: true })
        // .populate('subjects');

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: 'Exam updated successfully!'
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: true,
            errorMessage: error.message,
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
            errorMessage: error.message,
            message: 'Internal Server Error!'
        })
    }
}

exports.getAllExam = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Exam.find().populate('subjects');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Exam.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: 'Exams fetched successfully!',
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: 'Internal Server Error!',
        });
    }
};