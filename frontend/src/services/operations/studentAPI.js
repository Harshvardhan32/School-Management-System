import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { studentEndPoints } from "../apis";
import { setUser } from "../../slices/profileSlice";
import { setLoading, setStudentDetails, setStudents } from "../../slices/studentSlice";

const {
    CREATE_STUDENT_API,
    UPDATE_STUDENT_API,
    DELETE_STUDENT_API,
    ALL_STUDENTS_API,
    GET_STUDENT_DETAILS,
} = studentEndPoints;

export const createStudent = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Student...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_STUDENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Student Created Successfully!');
            dispatch(getAllStudents(token));
            setOpen(false);
        } catch (error) {
            toast.error('Student Creation Failed!');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateStudent = (data, token, setOpen = true) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Student...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_STUDENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            dispatch(getAllStudents(token));
            let user = JSON.parse(localStorage.getItem('auth')).user;
            if (user._id === data.id) {
                dispatch(setUser(response?.data?.data));
                console.log(response?.data?.data);
                console.log(user._id);
            }

            toast.success('Student Updated Successfully!');
            if (data.userId !== undefined) {
                setOpen(false);
            }
        } catch (error) {
            toast.error('Student Updation Failed!');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteStudent = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Deleting Student...');

        try {
            const response = await apiConnector("DELETE", DELETE_STUDENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Student Deleted Successfully!');
            dispatch(getAllStudents(token));
            setOpen(false);
        } catch (error) {
            toast.error(error?.message || 'Student Deletion Failed!');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    }
}

export const getAllStudents = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_STUDENTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch students.");
            }

            dispatch(setStudents(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}

export const getStudentDetails = (token, studentId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            const url = `${GET_STUDENT_DETAILS}?studentId=${studentId}`;
            const response = await apiConnector("GET", url, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch teachers.");
            }

            dispatch(setStudentDetails(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}