const express = require('express');
const dbConnect = require('./config/database');
const cloudinaryConnect = require('./config/cloudinary');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import All routers
const AnnouncementRoutes = require('./router/AnnouncementRoutes');
const AssignmentRoutes = require('./router/AssignmentRoutes');
const AttendanceRoutes = require('./router/AttendanceRoutes');
const AuthRoutes = require('./router/AuthRoutes');
const ClassRoutes = require('./router/ClassRoutes');
const EventRoutes = require('./router/EventRoutes');
const ExamRoutes = require('./router/ExamRoutes');
const LessonRoutes = require('./router/LessonRoutes');
const ResultRoutes = require('./router/LessonRoutes');
const SubjectRoutes = require('./router/SubjectRoutes');
const UserRoutes = require('./router/UserRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Mount all router with the API
app.use('/api/v1', AnnouncementRoutes);
app.use('/api/v1', AssignmentRoutes);
app.use('/api/v1', AttendanceRoutes);
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1', ClassRoutes);
app.use('/api/v1', EventRoutes);
app.use('/api/v1', ExamRoutes);
app.use('/api/v1', LessonRoutes);
app.use('/api/v1', ResultRoutes);
app.use('/api/v1', SubjectRoutes);
app.use('/api/v1', UserRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started successfully at port ${PORT}`);
});

// Homepage Route
app.get('/', (req, res) => {
    res.send('<h1>This is homepage.</h1>')
});

cloudinaryConnect();
dbConnect();