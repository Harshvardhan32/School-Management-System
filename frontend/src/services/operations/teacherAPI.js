import toast from "react-hot-toast";
import {
    setLoading,
    setTeachers,
    setTeacherDetails
} from "../../slices/teacherSlice";
import apiConnector from "../apiConnect";
import { teacherEndPoints } from "../apis";
import { setUser } from "../../slices/profileSlice";

const {
    CREATE_TEACHER_API,
    UPDATE_TEACHER_API,
    DELETE_TEACHER_API,
    ALL_TEACHERS_API,
    GET_TEACHER_DETAILS
} = teacherEndPoints;

export const createTeacher = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Teacher...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_TEACHER_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Teacher Created Successfully!');
            dispatch(getAllTeachers(token));
            setOpen(false);
        } catch (error) {
            toast.error('Teacher Creation Failed!');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    }
}

export const updateTeacher = (data, token, setOpen = true) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Teacher...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_TEACHER_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Teacher Updated Successfully!');
            dispatch(getAllTeachers(token));
            let user = JSON.parse(localStorage.getItem('auth')).user;
            if (user._id === data.id) {
                dispatch(setUser(response?.data?.data));
            }
            if (data.classes) {
                setOpen(false);
            }
        } catch (error) {
            toast.error('Teacher Updation Failed!');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    }
}

export const deleteTeacher = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Deleting Teacher...');

        try {
            const response = await apiConnector("DELETE", DELETE_TEACHER_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Teacher Deleted Successfully!');
            dispatch(getAllTeachers(token));
            setOpen(false);
        } catch (error) {
            toast.error('Teacher Deletion Failed!');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(true));
        }
    }
}

export const getAllTeachers = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_TEACHERS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch teachers.");
            }

            dispatch(setTeachers(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export const getTeacherDetails = (token, teacherId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            const url = `${GET_TEACHER_DETAILS}?teacherId=${teacherId}`;
            const response = await apiConnector("GET", url, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch teachers.");
            }

            dispatch(setTeacherDetails(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}