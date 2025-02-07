const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
// const rateLimit = require('express-rate-limit');
const dbConnect = require('./config/database');
const cloudinaryConnect = require('./config/cloudinary');
require('dotenv').config();

// Import All routers
const AdminRoutes = require('./router/AdminRoutes');
const TeacherRoutes = require('./router/TeacherRoutes');
const StudentRoutes = require('./router/StudentRoutes');
const ParentRoutes = require('./router/ParentRoutes');
const AnnouncementRoutes = require('./router/AnnouncementRoutes');
const AssignmentRoutes = require('./router/AssignmentRoutes');
const AttendanceRoutes = require('./router/AttendanceRoutes');
const AuthRoutes = require('./router/AuthRoutes');
const ClassRoutes = require('./router/ClassRoutes');
const EventRoutes = require('./router/EventRoutes');
const MessageRoutes = require('./router/MessageRoutes');
const ExamRoutes = require('./router/ExamRoutes');
const LessonRoutes = require('./router/LessonRoutes');
const ResultRoutes = require('./router/ResultRoutes');
const SubjectRoutes = require('./router/SubjectRoutes');
const UserRoutes = require('./router/UserRoutes');
const CalendarRoutes = require('./router/CalendarRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

app.use(morgan('dev'));
app.use(helmet());
app.use(
    cors({
        origin: [
            'https://school-management-client-system.vercel.app',
            'http://localhost:5173'
        ],
        credentials: true,
    })
);

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per window
// });
// app.use(limiter);

cloudinaryConnect();
dbConnect();

// Mount all router with the API
app.use('/api/v1/user/admin', AdminRoutes);
app.use('/api/v1/user/teacher', TeacherRoutes);
app.use('/api/v1/user/student', StudentRoutes);
app.use('/api/v1/user/parent', ParentRoutes);
app.use('/api/v1/announcement', AnnouncementRoutes);
app.use('/api/v1/assignment', AssignmentRoutes);
app.use('/api/v1/attendance', AttendanceRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/class', ClassRoutes);
app.use('/api/v1/event', EventRoutes);
app.use('/api/v1/message', MessageRoutes);
app.use('/api/v1/exam', ExamRoutes);
app.use('/api/v1/lesson', LessonRoutes);
app.use('/api/v1/result', ResultRoutes);
app.use('/api/v1/subject', SubjectRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/calendar', CalendarRoutes);

// Homepage Route
app.get('/', (req, res) => {
    res.send('<h1>This is Homepage.</h1>');
});

// Global error handler 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message,
        message: 'Internal Server Error'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started successfully at port ${PORT}`);
});