const Grade = require('../../models/Grade');

exports.createGrade = async (req, res) => {
    try {

        const { student, subject, exam, score, grade, remarks } = req.body;

        if (!student || subject || exam || score || grade || remarks) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const gradeResponse = await Grade.create({
            student, subject, exam, score, grade, remarks
        });

        return res.status(200).json({
            success: true,
            data: gradeResponse,
            message: "Grade created successfully!"
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

exports.updateGrade = async (req, res) => {
    try {

        const { gradeId, student, subject, exam, score, grade, remarks } = req.body;

        if (!gradeId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const updatedResponse = await Grade.findByIdAndUpdate(gradeId, { student, subject, exam, score, grade, remarks  }, { new: true });

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: "Grade updated successfully!"
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

exports.deleteGrade = async (req, res) => {
    try {

        const { gradeId } = req.body;

        if (!gradeId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const deletedResponse = await Grade.findByIdAndDelete(gradeId);

        return res.status(200).json({
            success: true,
            data: deletedResponse,
            message: "Grade deleted successfully!"
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

exports.getAllGrade = async (req, res) => {
    try {

        const gradeResponse = await Grade.find();

        return res.status(200).json({
            success: true,
            data: gradeResponse,
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