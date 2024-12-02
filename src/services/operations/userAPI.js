import toast from "react-hot-toast";
import { userEndPoints } from "../apis";
import apiConnector from "../apiConnect";

const {
    CREATE_USER_API,
} = userEndPoints;

export const createUser = (data, setOpen) => {
    return async () => {
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("POST", CREATE_USER_API, data);

            console.log("CREATE USER API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success(`${data?.role} Created Successfully!`);
            setOpen(false);
        } catch (error) {
            console.log("CREATE USER API ERROR............", error.message);
            toast.error(error?.message || `${data?.role} Creation Failed!`);
        } finally {
            toast.dismiss(toastId);
        }
    }
}