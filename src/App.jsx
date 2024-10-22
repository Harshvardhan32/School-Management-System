import Admin from "./pages/admin/Admin";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/login";
import { Routes, Route } from "react-router-dom";
import Student from "./pages/student/Student";
import Teacher from "./pages/teacher/Teacher";
import Parent from "./pages/parent/Parent";
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

function App() {

    return (
        <div>
            <Routes>
                {/* <Route path='/' element={<Login />} /> */}
                <Route path="/" element={<Dashboard />} >
                    <Route path='/' element={<Admin />} />
                    <Route path='/student' element={<Student />} />
                    <Route path='/teacher' element={<Teacher />} />
                    <Route path='/parent' element={<Parent />} />
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
                    <Route path='/list/events' element={<EventList />} />
                    <Route path='/list/announcements' element={<AnnouncementList />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    )
}

export default App;