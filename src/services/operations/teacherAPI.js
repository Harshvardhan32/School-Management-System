import toast from "react-hot-toast";
import {
    setLoading,
    setTeachers,
    setTeacherDetails
} from "../../slices/teacherSlice";
import { teacherEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    CREATE_TEACHER_API,
    UPDATE_TEACHER_API,
    DELETE_TEACHER_API,
    ALL_TEACHERS_API,
    GET_TEACHER_DETAILS
} = teacherEndPoints;

export const createTeacher = (data, token, setOpen) => {
    return async () => {
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("POST", CREATE_TEACHER_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            console.log("CREATE TEACHER API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Teacher Created Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("CREATE TEACHER API ERROR............", error.message);
            toast.error(error?.message || `${data?.role} Creation Failed!`);
        } finally {
            toast.dismiss(toastId);
        }
    }
}

export const updateTeacher = (data, token, setOpen = true) => {
    return async () => {
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("PUT", UPDATE_TEACHER_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            console.log("UPDATE TEACHER API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Teacher Updated Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("UPDATE TEACHER API ERROR............", error.message);
            toast.error(error?.message || `${data?.role} Updation Failed!`);
        } finally {
            toast.dismiss(toastId);
        }
    }
}

export const deleteTeacher = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("DELETE", DELETE_TEACHER_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            console.log("DELETE TEACHER API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Teacher Deleted Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("DELETE TEACHER API ERROR............", error.message);
            toast.error(error?.message || 'Teacher Deletion Failed!');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(true));
        }
    }
}

export const getAllTeachers = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

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
            toast.dismiss(toastId);
            toast.success('Teachers loaded successfully!');
        } catch (error) {
            console.log("ALL TEACHERS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load teachers.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
};

export const getTeacherDetails = (token, teacherId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

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
            toast.success('Teachers details fetched successfully!');
        } catch (error) {
            console.log("TEACHER DETAILS API ERROR............", error.message);
            toast.error(error.message || 'Failed to load teacher details.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // End loading
        }
    };
};