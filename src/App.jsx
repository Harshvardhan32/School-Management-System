import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import TeacherList from "./pages/teacher/TeacherList";
import StudentList from "./pages/student/StudentList";
import ParentList from "./pages/parent/ParentList";
import SubjectList from "./pages/subjects/SubjectList";
import ClassList from "./pages/classes/ClassList";
import LessonList from "./pages/lessons/LessonList";
import ExamList from "./pages/exams/ExamList";
import AssignmentList from "./pages/assignments/AssignmentsList";
import ResultList from "./pages/results/ResultList";
import EventList from "./pages/events/EventList";
import AnnouncementList from "./pages/announcements/AnnouncementList";
import TeacherDetailsPage from "./pages/teacher/TeacherDetailsPage";
import StudentDetailsPage from "./pages/student/StudentDetailsPage";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/Settings";
import MessageList from "./pages/messages/MessageList";
import AttendanceList from "./pages/attendance/AttendanceList";
import { useContext } from "react";
import { ThemeContext } from "./utils/ThemeContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useSelector } from "react-redux";
import HomeRoute from "./components/core/Auth/HomeRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import OpenRoute from "./components/core/Auth/OpenRoute";

function App() {

    const { darkMode } = useContext(ThemeContext);
    const { token } = useSelector((state) => state?.auth);

    return (
        <div className={`${darkMode && 'dark'}`}>
            <Routes>
                {token === null && <Route path='/' element={<Login />} />}
                <Route
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                >
                    <Route path='/' element={<HomeRoute />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/list/teachers' element={<TeacherList />} />
                    <Route path='/list/teachers/:id' element={<TeacherDetailsPage />} />
                    <Route path='/list/students' element={<StudentList />} />
                    <Route path='/list/students/:id' element={<StudentDetailsPage />} />
                    <Route path='/list/parents' element={<ParentList />} />
                    <Route path='/list/subjects' element={<SubjectList />} />
                    <Route path='/list/classes' element={<ClassList />} />
                    <Route path='/list/lessons' element={<LessonList />} />
                    <Route path='/list/exams' element={<ExamList />} />
                    <Route path='/list/assignments' element={<AssignmentList />} />
                    <Route path='/list/results' element={<ResultList />} />
                    <Route path='/list/attendance' element={<AttendanceList />} />
                    <Route path='/list/events' element={<EventList />} />
                    <Route path='/list/messages' element={<MessageList />} />
                    <Route path='/list/announcements' element={<AnnouncementList />} />
                </Route>
                <Route path="/forgot-password"
                    element={
                        <OpenRoute>
                            <ForgotPassword />
                        </OpenRoute>
                    }
                />
                <Route path="/update-password/:token"
                    element={
                        <OpenRoute>
                            <ResetPassword />
                        </OpenRoute>
                    }
                />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    )
}

export default App;