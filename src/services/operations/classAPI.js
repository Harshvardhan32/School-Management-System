import toast from "react-hot-toast";
import { classEndPoints } from "../apis";
import { setLoading, setPaginatedClasses, setAllClasses } from "../../slices/classSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_CLASS_API,
    UPDATE_CLASS_API,
    DELETE_CLASS_API,
    ALL_CLASSES_API
} = classEndPoints;

export const createClass = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_CLASS_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE CLASS API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Class Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE CLASS API ERROR............", error.message);
            toast.error(error?.message || "Class Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateClass = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", UPDATE_CLASS_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE ANNOUNCEMENT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Announcement Created Successfully!');
        } catch (error) {
            // console.log("CREATE ANNOUNCEMENT API ERROR............", error.message);
            toast.error(error?.message || "Announcement Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

// export const getAllClasses = (token) => {
//     return async (dispatch) => {
//         const toastId = toast.loading('Loading...');
//         try {
//             const response = await apiConnector("GET", ALL_CLASSES_API, null,
//                 {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 }
//             );

//             // console.log("ALL CLASSES API RESPONSE............", response);

//             if (!response?.data?.success) {
//                 throw new Error(response?.data?.message || "Something went wrong!");
//             }

//             dispatch(setClasses(response?.data?.data));
//         } catch (error) {
//             console.log("ALL CLASSES API ERROR............", error.message);
//         } finally {
//             toast.dismiss(toastId);
//         }
//     }
// }

// export const getAllClasses = (token, page = 1, limit = 10) => {
//     return async (dispatch) => {
//         const toastId = toast.loading('Loading...');
//         try {
//             // Construct query parameters for pagination
//             const queryParams = `?page=${page}&limit=${limit}`;
//             const url = `${ALL_CLASSES_API}${queryParams}`;

//             // Make the API request
//             const response = await apiConnector("GET", url, null, {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`,
//             });

//             // Check for success in the response
//             if (!response?.data?.success) {
//                 throw new Error(response?.data?.message || "Failed to fetch classes.");
//             }

//             // Dispatch the data to the Redux store
//             dispatch(setClasses({
//                 data: response.data.data,
//                 totalPages: response.data.totalPages,
//                 currentPage: response.data.currentPage
//             }));
//             toast.success('Classes loaded successfully!');
//         } catch (error) {
//             console.error("Error fetching classes:", error.message);
//             toast.error(error.message || 'Failed to load classes.');
//         } finally {
//             toast.dismiss(toastId);
//         }
//     };
// };

export const getAllClasses = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading('Loading classes...');
        try {
            // Construct query parameters based on whether we need all data or paginated data
            const queryParams = allData ? `?allData=true` : `?page=${page}&limit=${limit}`;
            const url = `${ALL_CLASSES_API}${queryParams}`;

            // Make the API request
            const response = await apiConnector("GET", url, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Failed to fetch classes.");
            }

            if (allData) {
                // Dispatch all classes to the store
                dispatch(setAllClasses(response.data.data));
            } else {
                // Dispatch paginated classes to the store
                dispatch(setPaginatedClasses({
                    data: response.data.data,
                    totalPages: response.data.totalPages,
                    currentPage: response.data.currentPage,
                }));
            }

            toast.success('Classes loaded successfully!');
        } catch (error) {
            console.error("Error fetching classes:", error.message);
            toast.error(error.message || 'Failed to load classes.');
        } finally {
            toast.dismiss(toastId);
            dispatch(setLoading(false)); // Set loading to false
        }
    };
};