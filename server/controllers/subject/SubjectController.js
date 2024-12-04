const Class = require('../../models/Class');
const Subject = require('../../models/Subject');
const Teacher = require('../../models/Teacher');

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

        // Update subjects in Class Schema
        if (classes?.length > 0) {
            await Promise.all(
                classes.map((classId) =>
                    Class.findByIdAndUpdate(
                        classId,
                        { $push: { subjects: subjectResponse?._id } }
                    )
                )
            );
        }

        // Update subjects in Teacher Schema
        if (teachers?.length > 0) {
            await Promise.all(
                teachers.map((teacherId) =>
                    Teacher.findByIdAndUpdate(
                        teacherId,
                        { $push: { subjects: subjectResponse?._id } }
                    )
                )
            );
        }

        return res.status(200).json({
            success: true,
            data: subjectResponse,
            message: "Subject Created Successfully!"
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

exports.updateSubject = async (req, res) => {
    try {

        const {
            id,
            subjectName,
            classes,
            teachers,
            lessons
        } = req.body;

        if (!id || !subjectName || !classes) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required details!"
            })
        }

        // Check for existing Subject by id
        const existingSubject = await Subject.findById(id);

        if (!existingSubject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found with the given ID!'
            })
        }

        const updatedResponse = await Subject.findByIdAndUpdate(id,
            {
                subjectName,
                classes,
                teachers,
                lessons
            }, { new: true });

        // Handle added and removed classes
        const addedClasses = classes.filter(classId => !existingSubject.classes.includes(classId));

        const removedClasses = existingSubject.classes.filter(classId => !classes.includes(classId));

        // Update class relationships
        if (addedClasses?.length > 0) {
            await Class.updateMany(
                { _id: { $in: addedClasses } }, // Match all classes in the addedClasses array
                { $push: { subjects: id } } // Push the subject ID to the subjects array
            );
        }

        if (removedClasses?.length > 0) {
            await Class.updateMany(
                { _id: { $in: removedClasses } }, // Match all classes in the removedClasses array
                { $pull: { subjects: id } } // Remove the subject ID from the subjects array
            );
        }

        // Handle added and removed classes
        const addedTeachers = teachers.filter(teacherId => !existingSubject.teachers.includes(teacherId));

        const removedTeachers = existingSubject.teachers.filter(teacherId => !teachers.includes(teacherId));

        // Update teacher relationships
        if (addedTeachers?.length > 0) {
            await Teacher.updateMany(
                { _id: { $in: addedTeachers } }, // Match all teachers in the addedTeachers array
                { $push: { subjects: id } } // Push the subject ID to the subjects array
            );
        }

        if (removedTeachers?.length > 0) {
            await Teacher.updateMany(
                { _id: { $in: removedTeachers } }, // Match all teachers in the removedTeachers array
                { $pull: { subjects: id } } // Remove the subject ID from the subjects array
            );
        }

        return res.status(200).json({
            success: true,
            data: updatedResponse,
            message: "Subject Updated Successfully!"
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

exports.getAllSubjects = async (req, res) => {
    try {
        const allData = req.query.allData === 'true'; // Check if allData is requested
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        let query = Subject.find()
            .populate('classes')
            .populate({
                path: 'teachers',
                populate: {
                    path: 'userId'
                }
            })
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