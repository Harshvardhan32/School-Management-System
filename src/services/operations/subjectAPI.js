import toast from "react-hot-toast";
import { setAllSubjects, setLoading, setPaginatedSubjects } from "../../slices/subjectSlice";
import { subjectEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    CREATE_SUBJECT_API,
    UPDATE_SUBJECT_API,
    DELETE_SUBJECT_API,
    ALL_SUBJECTS_API
} = subjectEndPoints;

export const createSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("CREATE SUBJECT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Created Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("CREATE SUBJECT API ERROR............", error.message);
            toast.error(error?.message || "Subject Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE SUBJECT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Updated Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("UPDATE SUBJECT API ERROR............", error.message);
            toast.error(error?.message || "Subject Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", DELETE_SUBJECT_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE SUBJECT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Subject Updated Successfully!');
            setOpen(false);
        } catch (error) {
            console.log("UPDATE SUBJECT API ERROR............", error.message);
            toast.error(error?.message || "Subject Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllSubjects = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading...');

        try {
            // Construct query parameters based on whether we need all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_SUBJECTS_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch subjects.");
            }

            if (allData) {
                // Dispatch all subjects to the store
                dispatch(setAllSubjects(response.data.data));
            } else {
                // Dispatch paginated subjects to the store
                dispatch(setPaginatedSubjects({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                }));
            }

            toast.success('Subjects loaded successfully!');
        } catch (error) {
            console.error("Error fetching subjects:", error.message);
            toast.error(error.message || 'Failed to load subjects.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // Set loading to false
        }
    };
};