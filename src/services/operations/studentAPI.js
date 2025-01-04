import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { studentEndPoints } from "../apis";
import { setLoading, setStudentDetails, setStudents } from "../../slices/studentSlice";

const {
    CREATE_STUDENT_API,
    UPDATE_STUDENT_API,
    DELETE_STUDENT_API,
    ALL_STUDENTS_API,
    GET_STUDENT_DETAILS,
} = studentEndPoints;

export const createStudent = (data, token, setOpen) => {
    return async () => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_STUDENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // console.log("CREATE STUDENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Student Created Successfully!');
            dispatch(getAllStudents(token));
            setOpen(false);
        } catch (error) {
            // console.log("CREATE STUDENT API ERROR............", error.message);
            toast.error('Student Creation Failed!');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateStudent = (data, token, setOpen = true) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_STUDENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // console.log("UPDATE STUDENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Student Updated Successfully!');
            dispatch(getAllStudents(token));
            if (data.userId !== undefined) {
                setOpen(false);
            }
        } catch (error) {
            // console.log("UPDATE STUDENT API ERROR............", error.message);
            toast.error('Student Updation Failed!');
            // toast.dismiss(toastId);
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteStudent = (data, token, setOpen) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("DELETE", DELETE_STUDENT_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // console.log("DELETE STUDENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Student Deleted Successfully!');
            dispatch(getAllStudents(token));
            setOpen(false);
        } catch (error) {
            // console.log("DELETE STUDENT API ERROR............", error.message);
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
        const toastId = toast.loading('Loading...');

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_STUDENTS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // console.log("ALL STUDENTS API RESPONSE............", response);

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch students.");
            }

            dispatch(setStudents(response?.data?.data));
            // toast.success('Students loaded successfully!');
        } catch (error) {
            // console.log("ALL STUDENTS API ERROR............", error.message);
            toast.error('Failed to load students.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
}

export const getStudentDetails = (token, studentId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

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
            // toast.success('Student details fetched successfully!');
        } catch (error) {
            // console.log("STUDENT DETAILS API ERROR............", error?.message);
            toast.error('Failed to load teacher details.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false));
        }
    };
}