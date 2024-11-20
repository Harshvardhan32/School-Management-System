import toast from "react-hot-toast";
import { setLoading, setStudents } from "../../slices/userSlice";
import { parentEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    ALL_PARENTS_API
} = parentEndPoints;

export const getAllParents = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", ALL_PARENTS_API, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("ALL PARENTS API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setStudents(response?.data?.data));
        } catch (error) {
            console.log("ALL PARENTS API ERROR............", error.message);
            toast.error(error?.message);
        } finally {
            dispatch(setLoading(true));
        }
    }
}