const Subject = require('../../models/Subject');

exports.createSubject = async (req, res) => {
    try {

        const { subjectName, classes, teachers, lessons } = req.body;

        if (!subjectName || !classes) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const subjectResponse = await Subject.create({
            subjectName,
            classes,
            teachers,
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

        const {
            subjectId,
            subjectName,
            classes,
            teachers,
            lessons } = req.body;

        if (!subjectId || !subjectName || !classes) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        const subjectData = await Subject.findById(subjectId);

        if (!subjectData) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found with the given ID!'
            })
        }

        const updatedResponse = await Subject.findByIdAndUpdate(subjectId,
            {
                subjectName,
                classes,
                teachers,
                lessons
            },
            { new: true })
            .populate('classes')
            .populate('teachers')
            .populate('lessons');

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

exports.getAllSubject = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Subject.find()
            .populate('classes')
            .populate('teachers')
            .populate('lessons');

        if (!allData) {
            query = query.skip(skip).limit(limit); // Apply pagination if allData is false
        }

        const data = await query;
        const total = allData ? data.length : await Subject.countDocuments();

        return res.status(200).json({
            success: true,
            data,
            total,
            totalPages: allData ? 1 : Math.ceil(total / limit), // Only 1 page for allData
            currentPage: allData ? 1 : page,
            message: "Subjects fetched successfully!",
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

// exports.getSubject = async (req, res) => {
//     try {

//         const { subjectId } = req.body;

//         if (!subjectId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please fill all required details!"
//             })
//         }

//         const subjectResponse = await Subject.findById(subjectId);

//         return res.status(200).json({
//             success: true,
//             data: subjectResponse,
//             message: "Subject fetched successfully!"
//         })

//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({
//             success: false,
//             errorMessage: error.message,
//             message: "Internal Server Error!"
//         })
//     }
// }