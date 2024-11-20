import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import userReducer from "../slices/userSlice";
import classReducer from "../slices/classSlice";
import subjectReducer from "../slices/subjectSlice";
import lessonReducer from "../slices/lessonSlice";
import examReducer from "../slices/examSlice";
import resultReducer from "../slices/resultSlice";
import eventReducer from "../slices/eventSlice";
import announcementReducer from "../slices/announcementSlice";

const rootStore = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        user: userReducer,
        class: classReducer,
        subject: subjectReducer,
        lesson: lessonReducer,
        exam: examReducer,
        result: resultReducer,
        event: eventReducer,
        announcement: announcementReducer,
    }
});

export default rootStore;