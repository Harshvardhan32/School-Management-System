import toast from "react-hot-toast";
import { profileEndPoints, adminEndPoints } from "../apis";
import { setUser } from "../../slices/profileSlice";
import apiConnector from "../apiConnect";

const { UPDATE_ADMIN_API } = adminEndPoints;
const { UPDATE_PROFILE_PICTURE_API } = profileEndPoints;

export const updateAdmin = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("PUT", UPDATE_ADMIN_API, data, {
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success("Admin Updated Successfully!");
            console.log("Data: ", response.data.data);
            dispatch(setUser(response?.data?.data));
        } catch (error) {
            console.error("Error details: ", error.message);
            toast.error('Admin Updation Failed!');
        } finally {
            toast.dismiss(toastId);
        }
    }
}

export const uploadProfilePicture = (data, token) => {
    return async () => {
        const toastId = toast.loading('Loading...');

        try {
            const response = await apiConnector("PUT", UPDATE_PROFILE_PICTURE_API, data, {
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Profile Picture Updated Successfully!');
        } catch (error) {
            console.error("Error details:", error.message);
            toast.error('Profile Picture Updation Failed!');
        } finally {
            toast.dismiss(toastId);
        }
    };
};