const BASE_URL = "http://localhost:5000";

// AUTH ENDPOINTS
export const authEndPoints = {
    LOGIN_API: BASE_URL + '/api/v1/auth/login',
    DELETE_API: BASE_URL + '/api/v1/auth/delete-account',
    RESET_PASSWORD_TOKEN_API: BASE_URL + '/api/v1/auth/reset-password-token',
    RESET_PASSWORD_API: BASE_URL + '/api/v1/auth/reset-password'
}

// STUDENT ENDPOINTS
export const studentEndPoints = {

}

// TEACHER ENDPOINTS
export const teacherEndPoints = {

}

// SETTINGS PAGE API
export const settingsEndPoints = {
    UPDATE_PROFILE_PICTURE_API: BASE_URL + '',
    UPDATE_PROFILE_API: BASE_URL + '',
    CHANGE_PASSWORD_API: BASE_URL + '/change-password'
}