import toast from "react-hot-toast";
import { setLoading, setStudents } from "../../slices/studentSlice";
import { studentEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    ALL_STUDENTS_API
} = studentEndPoints;

export const getAllStudents = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("GET", ALL_STUDENTS_API, null,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("ALL STUDENTS API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setStudents(response?.data?.data));
        } catch (error) {
            console.log("ALL STUDENTS API ERROR............", error.message);
            toast.error(error?.message);
        } finally {
            dispatch(setLoading(true));
        }
    }
}