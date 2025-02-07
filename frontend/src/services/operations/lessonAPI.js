import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { lessonEndPoints } from "../apis";
import { setLoading, setAllLessons } from "../../slices/lessonSlice";

const {
    CREATE_LESSON_API,
    UPDATE_LESSON_API,
    DELETE_LESSON_API,
    ALL_LESSONS_API,
} = lessonEndPoints;

export const createLesson = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Lesson...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_LESSON_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Lesson Created Successfully!');
            dispatch(getAllLessons(token));
            setOpen(false);
        } catch (error) {
            toast.error("Lesson Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateLesson = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Lesson...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_LESSON_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Lesson Updated Successfully!');
            dispatch(getAllLessons(token));
            setOpen(false);
        } catch (error) {
            toast.error("Lesson Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteLesson = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deletion Lesson...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_LESSON_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Lesson Deleted Successfully!');
            dispatch(getAllLessons(token));
            setOpen(false);
        } catch (error) {
            toast.error("Lesson Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllLessons = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_LESSONS_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setAllLessons(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
}