const Result = require('../../models/Result');

exports.createResult = async (req, res) => {
    try {

        const { student, classId, subject, exam, score, maxScore, percentage, grade, finalGrade, overallPercentage, remarks } = req.body;

        if (!student || !classId || !subject || !exam || !score || !maxScore || !percentage || !grade || !finalGrade || !overallPercentage || !remarks) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        // const subjectResponse = await Subject.create({
        //     subjectName,
        //     classId,
        //     teacher,
        //     lessons
        // });

        // return res.status(200).json({
        //     success: true,
        //     data: subjectResponse,
        //     message: "Subject created successfully!"
        // })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            errorMessage: error.message,
            message: "Internal Server Error!"
        })
    }
}

exports.updateResult = async (req, res) => {
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

exports.deleteResult = async (req, res) => {
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

exports.getResult = async (req, res) => {
    try {

        const { resultId } = req.body;

        if (!resultId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const resultResponse = await Result.findById(resultId).populate('student').populate('classId').exec();

        return res.status(200).json({
            success: true,
            data: resultResponse,
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

exports.getAllResult = async (req, res) => {
    try {

        const resultResponse = await Result.find().populate('student').populate('classId').exec();

        return res.status(200).json({
            success: true,
            data: resultResponse,
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