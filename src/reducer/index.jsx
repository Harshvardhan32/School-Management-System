import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import teacherReducer from "../slices/teacherSlice";
import studentReducer from "../slices/studentSlice";
import parentReducer from "../slices/parentSlice";
import classReducer from "../slices/classSlice";
import subjectReducer from "../slices/subjectSlice";
import lessonReducer from "../slices/lessonSlice";
import examReducer from "../slices/examSlice";
import assignmentReducer from "../slices/assignmentSlice";
import resultReducer from "../slices/resultSlice";
import attendanceReducer from "../slices/attendanceSlice";
import eventReducer from "../slices/eventSlice";
import announcementReducer from "../slices/announcementSlice";

const rootStore = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        teacher: teacherReducer,
        student: studentReducer,
        parent: parentReducer,
        class: classReducer,
        subject: subjectReducer,
        lesson: lessonReducer,
        exam: examReducer,
        assignment: assignmentReducer,
        result: resultReducer,
        attendance: attendanceReducer,
        event: eventReducer,
        announcement: announcementReducer,
    }
});

export default rootStore;