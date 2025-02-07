import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { profileEndPoints, adminEndPoints } from "../apis";
import { setUser, setProfilePicture } from "../../slices/profileSlice";

const { UPDATE_ADMIN_API } = adminEndPoints;
const { UPDATE_PROFILE_PICTURE_API } = profileEndPoints;

export const updateAdmin = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Admin...');

        try {
            const response = await apiConnector("PUT", UPDATE_ADMIN_API, data, {
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success("Admin Updated Successfully!");
            dispatch(setUser(response?.data?.data));
        } catch (error) {
            // toast.error('Admin Updation Failed!');
        } finally {
            toast.dismiss(toastId);
        }
    }
}

export const uploadProfilePicture = (data, token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Profile Picture...');

        try {
            const response = await apiConnector("PUT", UPDATE_PROFILE_PICTURE_API, data, {
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                toast.error(response?.data?.message);
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            dispatch(setProfilePicture(response?.data?.data?.photo));
            toast.success('Profile Picture Updated Successfully!');
        } catch (error) {
            toast.error('Profile Picture Updation Failed!');
        } finally {
            toast.dismiss(toastId);
        }
    };
};