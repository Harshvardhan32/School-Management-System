import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { messageEndPoints } from "../apis";
import { setLoading, setAllMessages } from "../../slices/messageSlice";

const {
    CREATE_MESSAGE_API,
    UPDATE_MESSAGE_API,
    DELETE_MESSAGE_API,
    ALL_MESSAGES_API,
} = messageEndPoints;

export const createMessage = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Creating Message...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_MESSAGE_API,
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
            toast.success('Message Created Successfully!');
            dispatch(getAllMessages(token));
            setOpen(false);
        } catch (error) {
            toast.error("Message Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateMessage = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Updating Message...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_MESSAGE_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Message Updated Successfully!');
            dispatch(getAllMessages(token));
            setOpen(false);
        } catch (error) {
            toast.error("Message Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteMessage = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Deleting Message...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_MESSAGE_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Message Deleted Successfully!');
            dispatch(getAllMessages(token));
            setOpen(false);
        } catch (error) {
            toast.error("Message Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllMessages = (token) => {
    return async (dispatch) => {
        dispatch(setLoading(true));

        try {
            // Make the API request
            const response = await apiConnector("GET", ALL_MESSAGES_API, null, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            // Check for success in the response
            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            dispatch(setAllMessages(response?.data?.data));
        } catch (error) {
            console.log(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
}