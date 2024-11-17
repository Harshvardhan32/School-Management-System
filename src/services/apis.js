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
}

// TEACHER ENDPOINTS
export const teacherEndPoints = {
    // CREATE_TEACHER_API: BASE_URL + '/api/v1/auth/signup',
    // UPDATE_TEACHER_API: BASE_URL + '/api/v1/class/update',
    // DELETE_TEACHER_API: BASE_URL + '/api/v1/class/delete',
    ALL_TEACHERS_API: BASE_URL + '/api/v1/user/teachers',
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

// ANNOUNCEMENT ENDPOINTS
export const announcementEndPoints = {
    CREATE_ANNOUNCEMENT_API: BASE_URL + '/api/v1/announcement/create',
    UPDATE_ANNOUNCEMENT_API: BASE_URL + '/api/v1/announcement/update',
    DELETE_ANNOUNCEMENT_API: BASE_URL + '/api/v1/announcement/delete',
    ALL_ANNOUNCEMENTS_API: BASE_URL + '/api/v1/announcement/announcements',
}

// SETTINGS PAGE API
export const settingsEndPoints = {
    UPDATE_PROFILE_PICTURE_API: BASE_URL + '',
    UPDATE_PROFILE_API: BASE_URL + '',
    CHANGE_PASSWORD_API: BASE_URL + '/change-password'
}