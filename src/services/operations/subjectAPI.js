import toast from "react-hot-toast";
import { setAllSubjects, setLoading, setPaginatedSubjects } from "../../slices/subjectSlice";
import { subjectEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    CREATE_SUBJECT_API,
    UPDATE_SUBJECT_API,
    ALL_SUBJECTS_API
} = subjectEndPoints;

export const createSubject = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_SUBJECT_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE SUBJECT API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.success('Subject Created Successfully!');
            setOpen(false);
        } catch (error) {
            // console.log("CREATE SUBJECT API ERROR............", error.message);
            toast.error(error?.message || "Class Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

// export const updateSubject = (data, token) => {
//     return async (dispatch) => {
//         const toastId = toast.loading('Loading...');
//         dispatch(setLoading(true));

//         try {
//             const response = await apiConnector("POST", CREATE_ANNOUNCEMENT_API,
//                 data,
//                 {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 }
//             );

//             // console.log("CREATE ANNOUNCEMENT API RESPONSE............", response);

//             if (!response?.data?.success) {
//                 throw new Error(response?.data?.message || "Something went wrong!");
//             }

//             toast.success('Announcement Created Successfully!');
//         } catch (error) {
//             // console.log("CREATE ANNOUNCEMENT API ERROR............", error.message);
//             toast.error(error?.message || "Announcement Creation Failed!");
//         } finally {
//             dispatch(setLoading(false));
//             toast.dismiss(toastId);
//         }
//     }
// }

// export const getAllSubjects = (token) => {
//     return async (dispatch) => {
//         dispatch(setLoading(true));
//         try {
//             const response = await apiConnector("GET", ALL_SUBJECTS_API, null,
//                 {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 }
//             );

//             // console.log("ALL SUBJECTS API RESPONSE............", response);

//             if (!response?.data?.success) {
//                 throw new Error(response?.data?.message || "Something went wrong!");
//             }

//             dispatch(setSubjects(response?.data?.data));
//         } catch (error) {
//             // console.log("ALL SUBJECTS API ERROR............", error.message);
//             toast.error(error?.message);
//         } finally {
//             dispatch(setLoading(true));
//         }
//     }
// }

export const getAllSubjects = (token, page = 1, limit = 10, allData = false) => {
    return async (dispatch) => {
        dispatch(setLoading(true)); // Set loading to true
        const toastId = toast.loading('Loading subjects...');
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