import toast from "react-hot-toast";
import {
    setLoading,
    setTeachers,
    setPaginatedTeachers,
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

export const updateTeacher = (data, token, setOpen) => {
    return async () => {
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("POST", UPDATE_TEACHER_API, data, {
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

export const deleteTeacher = (data, token, setOpen) => {
    return async () => {
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("POST", DELETE_TEACHER_API, data);

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

export const getAllTeachers = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            // Construct the query parameters for either all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_TEACHERS_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch teachers.");
            }

            if (allData) {
                // Dispatch non-paginated data to the store
                dispatch(setTeachers(response?.data?.data));
            } else {
                // Dispatch paginated data to the store
                dispatch(setPaginatedTeachers({
                    data: response?.data?.data,
                    totalPages: response?.data?.totalPages,
                    currentPage: response?.data?.currentPage,
                }));
            }

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
        dispatch(setLoading(true)); // Start loading
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