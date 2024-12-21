import toast from "react-hot-toast";
import { messageEndPoints } from "../apis";
import { setLoading, setAllMessages } from "../../slices/messageSlice";
import apiConnector from "../apiConnect";

const {
    CREATE_MESSAGE_API,
    UPDATE_MESSAGE_API,
    DELETE_MESSAGE_API,
    ALL_MESSAGES_API,
} = messageEndPoints;

export const createMessage = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", CREATE_MESSAGE_API,
                data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            // console.log("CREATE MESSAGE API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Message Created Successfully!');
            dispatch(getAllMessages(token));
            setOpen(false);
        } catch (error) {
            // console.log("CREATE MESSAGE API ERROR............", error.message);
            toast.error("Message Creation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const updateMessage = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", UPDATE_MESSAGE_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("UPDATE MESSAGE API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Message Updated Successfully!');
            dispatch(getAllMessages(token));
            setOpen(false);
        } catch (error) {
            console.log("UPDATE MESSAGE API ERROR............", error.message);
            toast.error("Message Updation Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const deleteMessage = (data, token, setOpen) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("DELETE", DELETE_MESSAGE_API, data,
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            );

            console.log("DELETE MESSAGE API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success('Message Deleted Successfully!');
            dispatch(getAllMessages(token));
            setOpen(false);
        } catch (error) {
            console.log("DELETE MESSAGE API ERROR............", error.message);
            toast.error("Message Deletion Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const getAllMessages = (token) => {
    return async (dispatch) => {
        const toastId = toast.loading('Loading...');
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

            toast.success('Messages loaded successfully!');
        } catch (error) {
            console.log("ALL MESSAGES API ERROR............", error.message);
            toast.error('Failed to load messages.');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}