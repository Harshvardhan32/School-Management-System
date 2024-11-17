import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import announcementReducer from "../slices/announcementSlice";
import classReducer from "../slices/classSlice";
import teacherReducer from "../slices/teacherSlice";
import studentReducer from "../slices/studentSlice";
import subjectReducer from "../slices/subjectSlice";
import lessonReducer from "../slices/lessonSlice";

const rootStore = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        announcement: announcementReducer,
        class: classReducer,
        teacher: teacherReducer,
        student: studentReducer,
        subject: subjectReducer,
        lesson: lessonReducer,
    }
});

export default rootStore;