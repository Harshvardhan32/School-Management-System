const BASE_URL = "http://localhost:5000";

// AUTH ENDPOINTS
export const authEndPoints = {
    LOGIN_API: BASE_URL + '/api/v1/auth/login',
    DELETE_API: BASE_URL + '/api/v1/auth/delete-account',
    RESET_PASSWORD_TOKEN_API: BASE_URL + '/api/v1/auth/reset-password-token',
    RESET_PASSWORD_API: BASE_URL + '/api/v1/auth/reset-password'
}

// USER ENDPOINTS
export const userEndPoints = {
    CREATE_USER_API: BASE_URL + '/api/v1/auth/signup'
}

// STUDENT ENDPOINTS
export const studentEndPoints = {
    ALL_STUDENTS_API: BASE_URL + '/api/v1/user/students',
    GET_STUDENT_DETAILS: BASE_URL + '/api/v1/user/student-details',
}

// TEACHER ENDPOINTS
export const teacherEndPoints = {
    // CREATE_TEACHER_API: BASE_URL + '/api/v1/auth/signup',
    // UPDATE_TEACHER_API: BASE_URL + '/api/v1/class/update',
    // DELETE_TEACHER_API: BASE_URL + '/api/v1/class/delete',
    ALL_TEACHERS_API: BASE_URL + '/api/v1/user/teachers',
    GET_TEACHER_DETAILS: BASE_URL + '/api/v1/user/teacher-details',
}

// PARENT ENDPOINTS
export const parentEndPoints = {
    ALL_PARENTS_API: BASE_URL + '/api/v1/user/parents',
    // GET_TEACHER_DETAILS: BASE_URL + '/api/v1/class/classes',
}

// SUBJECT ENDPOINTS
export const subjectEndPoints = {
    CREATE_SUBJECT_API: BASE_URL + '/api/v1/subject/create',
    UPDATE_SUBJECT_API: BASE_URL + '/api/v1/subject/update',
    ALL_SUBJECTS_API: BASE_URL + '/api/v1/subject/subjects',
}

// LESSON ENDPOINTS
export const lessonEndPoints = {
    CREATE_LESSON_API: BASE_URL + '/api/v1/lesson/create',
    UPDATE_LESSON_API: BASE_URL + '/api/v1/lesson/update',
    DELETE_LESSON_API: BASE_URL + '/api/v1/lesson/delete',
    ALL_LESSONS_API: BASE_URL + '/api/v1/lesson/lessons',
}

// CLASS ENDPOINTS
export const classEndPoints = {
    CREATE_CLASS_API: BASE_URL + '/api/v1/class/create',
    UPDATE_CLASS_API: BASE_URL + '/api/v1/class/update',
    DELETE_CLASS_API: BASE_URL + '/api/v1/class/delete',
    ALL_CLASSES_API: BASE_URL + '/api/v1/class/classes',
}

// ASSIGNMENT ENDPOINTS
export const assignmentEndPoints = {
    CREATE_ASSIGNMENT_API: BASE_URL + '/api/v1/assignment/create',
    UPDATE_ASSIGNMENT_API: BASE_URL + '/api/v1/assignment/update',
    DELETE_ASSIGNMENT_API: BASE_URL + '/api/v1/assignment/delete',
    ALL_ASSIGNMENTS_API: BASE_URL + '/api/v1/assignment/assignments',
}

// RESULT ENDPOINTS
export const resultEndPoints = {
    CREATE_RESULT_API: BASE_URL + '/api/v1/result/create',
    UPDATE_RESULT_API: BASE_URL + '/api/v1/result/update',
    DELETE_RESULT_API: BASE_URL + '/api/v1/result/delete',
    ALL_RESULTS_API: BASE_URL + '/api/v1/result/results',
}

// EXAM ENDPOINTS
export const examEndPoints = {
    CREATE_EXAM_API: BASE_URL + '/api/v1/exam/create',
    UPDATE_EXAM_API: BASE_URL + '/api/v1/exam/update',
    DELETE_EXAM_API: BASE_URL + '/api/v1/exam/delete',
    ALL_EXAMS_API: BASE_URL + '/api/v1/exam/exams',
}

// ATTENDANCE ENDPOINTS
export const attendanceEndPoints = {
    CREATE_ATTENDANCE_API: BASE_URL + '/api/v1/attendance/create',
    UPDATE_ATTENDANCE_API: BASE_URL + '/api/v1/attendance/update',
    DELETE_ATTENDANCE_API: BASE_URL + '/api/v1/attendance/delete',
    ALL_ATTENDANCES_API: BASE_URL + '/api/v1/attendance/attendances',
}

// ANNOUNCEMENT ENDPOINTS
export const announcementEndPoints = {
    CREATE_ANNOUNCEMENT_API: BASE_URL + '/api/v1/announcement/create',
    UPDATE_ANNOUNCEMENT_API: BASE_URL + '/api/v1/announcement/update',
    DELETE_ANNOUNCEMENT_API: BASE_URL + '/api/v1/announcement/delete',
    ALL_ANNOUNCEMENTS_API: BASE_URL + '/api/v1/announcement/announcements',
}

// ANNOUNCEMENT ENDPOINTS
export const eventEndPoints = {
    CREATE_EVENT_API: BASE_URL + '/api/v1/event/create',
    UPDATE_EVENT_API: BASE_URL + '/api/v1/event/update',
    DELETE_EVENT_API: BASE_URL + '/api/v1/event/delete',
    ALL_EVENTS_API: BASE_URL + '/api/v1/event/events',
}

// SETTINGS PAGE API
export const settingsEndPoints = {
    UPDATE_PROFILE_PICTURE_API: BASE_URL + '',
    UPDATE_PROFILE_API: BASE_URL + '',
    CHANGE_PASSWORD_API: BASE_URL + '/change-password'
}