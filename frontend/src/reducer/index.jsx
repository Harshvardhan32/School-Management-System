import authReducer from "../slices/authSlice";
import examReducer from "../slices/examSlice";
import eventReducer from "../slices/eventSlice";
import classReducer from "../slices/classSlice";
import { configureStore } from '@reduxjs/toolkit';
import parentReducer from "../slices/parentSlice";
import lessonReducer from "../slices/lessonSlice";
import resultReducer from "../slices/resultSlice";
import profileReducer from "../slices/profileSlice";
import studentReducer from "../slices/studentSlice";
import teacherReducer from "../slices/teacherSlice";
import subjectReducer from "../slices/subjectSlice";
import messageReducer from "../slices/messageSlice";
import calendarReducer from "../slices/calendarSlice";
import assignmentReducer from "../slices/assignmentSlice";
import attendanceReducer from "../slices/attendanceSlice";
import announcementReducer from "../slices/announcementSlice";

const rootStore = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        teacher: teacherReducer,
        student: studentReducer,
        parent: parentReducer,
        class: classReducer,
        calendar: calendarReducer,
        subject: subjectReducer,
        lesson: lessonReducer,
        exam: examReducer,
        assignment: assignmentReducer,
        result: resultReducer,
        attendance: attendanceReducer,
        event: eventReducer,
        message: messageReducer,
        announcement: announcementReducer,
    }
});

export default rootStore;