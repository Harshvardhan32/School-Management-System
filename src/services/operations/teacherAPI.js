import toast from "react-hot-toast";
import { setLoading, setTeachers } from "../../slices/userSlice";
import { teacherEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    ALL_TEACHERS_API
} = teacherEndPoints;

export const getAllTeachers = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", ALL_TEACHERS_API, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("ALL TEACHERS API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setTeachers(response?.data?.data));
        } catch (error) {
            console.log("ALL TEACHERS API ERROR............", error.message);
            toast.error(error?.message);
        } finally {
            dispatch(setLoading(true));
        }
    }
}