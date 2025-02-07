import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeContext } from "./utils/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthExpiration } from "./services/operations/authAPI";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Profile from "./pages/profile/Profile";
import ExamList from "./pages/exams/ExamList";
import EventList from "./pages/events/EventList";
import ClassList from "./pages/classes/ClassList";
import ResetPassword from "./pages/ResetPassword";
import ParentList from "./pages/parent/ParentList";
import LessonList from "./pages/lessons/LessonList";
import ResultList from "./pages/results/ResultList";
import ForgotPassword from "./pages/ForgotPassword";
import TeacherList from "./pages/teacher/TeacherList";
import StudentList from "./pages/student/StudentList";
import SubjectList from "./pages/subjects/SubjectList";
import MessageList from "./pages/messages/MessageList";
import OpenRoute from "./components/core/Auth/OpenRoute";
import HomeRoute from "./components/core/Auth/HomeRoute";
import CalendarList from "./pages/calendar/CalendarList";
import ResultDetails from "./pages/results/ResultDetails";
import AttendanceList from "./pages/attendance/AttendanceList";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import AttendanceData from "./pages/attendance/AttendanceData";
import AssignmentList from "./pages/assignments/AssignmentsList";
import ProtectedRoute from "./components/core/Auth/ProtectedRoute";
import TeacherDetailsPage from "./pages/teacher/TeacherDetailsPage";
import StudentDetailsPage from "./pages/student/StudentDetailsPage";
import AnnouncementList from "./pages/announcements/AnnouncementList";

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuthExpiration());
    }, []);

    const { darkMode } = useContext(ThemeContext);
    const { token } = useSelector((state) => state?.auth);

    return (
        <div className={`${darkMode && 'dark'}`}>
            <Routes>
                {token === null ? <Route path='/' element={<Login />} />
                    :
                    <>
                        <Route
                            element={<PrivateRoute><Dashboard /></PrivateRoute>}
                        >
                            <Route path='/' element={<HomeRoute />} />
                            <Route path='/profile' element={<Profile />} />
                            <Route path='/settings' element={<Settings />} />
                            <Route path='/list/teachers'
                                element={<ProtectedRoute userType={['Admin', 'Teacher']}><TeacherList /></ProtectedRoute>}
                            />
                            <Route path='/list/teacher/:id'
                                element={<ProtectedRoute userType={['Admin', 'Teacher']}><TeacherDetailsPage /></ProtectedRoute>}
                            />
                            <Route path='/list/students'
                                element={<ProtectedRoute userType={['Admin', 'Teacher', 'Parent']}><StudentList /></ProtectedRoute>}
                            />
                            <Route path='/list/student/:id'
                                element={<ProtectedRoute userType={['Admin', 'Teacher', 'Parent']}><StudentDetailsPage /></ProtectedRoute>}
                            />
                            <Route path='/list/parents'
                                element={<ProtectedRoute userType={['Admin', 'Teacher']}><ParentList /></ProtectedRoute>}
                            />
                            <Route path='/list/subjects'
                                element={<ProtectedRoute userType={['Admin', 'Teacher']}><SubjectList /></ProtectedRoute>}
                            />
                            <Route path='/list/classes'
                                element={<ProtectedRoute userType={['Admin', 'Teacher']}><ClassList /></ProtectedRoute>}
                            />
                            <Route path='/list/calendar'
                                element={<ProtectedRoute userType={['Admin']}><CalendarList /></ProtectedRoute>}
                            />
                            <Route path='/list/lessons'
                                element={<ProtectedRoute userType={['Admin', 'Teacher']}><LessonList /></ProtectedRoute>}
                            />
                            <Route path='/list/exams' element={<ExamList />} />
                            <Route path='/list/assignments' element={<AssignmentList />} />
                            <Route path='/list/results' element={<ResultList />} />
                            <Route path='/list/result/:id' element={<ResultDetails />} />
                            <Route path='/list/attendance'
                                element={<ProtectedRoute userType={['Admin', 'Teacher']}><AttendanceList /></ProtectedRoute>}
                            />
                            < Route path='/attendance/data'
                                element={<ProtectedRoute userType={['Parent', 'Student']}><AttendanceData /></ProtectedRoute>}
                            />
                            <Route path='/list/events' element={<EventList />} />
                            <Route path='/list/messages' element={<MessageList />} />
                            <Route path='/list/announcements' element={<AnnouncementList />} />
                        </Route>
                    </>
                }
                <Route path="/forgot-password"
                    element={<OpenRoute><ForgotPassword /></OpenRoute>}
                />
                <Route path="/update-password/:token"
                    element={<OpenRoute><ResetPassword /></OpenRoute>}
                />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    )
}

export default App;