import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { authEndPoints } from '../apis';
import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";

const {
    LOGIN_API,
    RESET_PASSWORD_TOKEN_API,
    RESET_PASSWORD_API
} = authEndPoints;

export function login(data) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", LOGIN_API, {
                userId: data?.userId,
                password: data?.password
            });

            console.log("LOGIN API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success("Login Successfull!");

            // Dispatch Redux actions to store token and user
            dispatch(setToken(response?.data?.token));
            dispatch(setUser({ ...response?.data?.data }));

            // Store token and user data locally
            localStorage.setItem("token", JSON.stringify(response?.data?.token));
            localStorage.setItem("user", JSON.stringify(response?.data?.data));
        } catch (error) {
            console.log("LOGIN API ERROR............", error.message);
            toast.error(error?.message || "Login Failed!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

export function resetPasswordToken(email, setEmailSent) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", RESET_PASSWORD_TOKEN_API, { email });

            console.log("RESET PASSWORD TOKEN API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            setEmailSent(true);
            toast.dismiss(toastId);
            toast.success("Reset Email Sent Successfully!");
        } catch (error) {
            console.log("LOGIN API ERROR............", error.message);
            toast.error('Failed to send email for resetting password.');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export function resetPassword(data, token) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("PUT", RESET_PASSWORD_API,
                {
                    password: data?.password,
                    confirmPassword: data?.confirmPassword,
                    token
                });

            console.log("RESET PASSWORD API RESPONSE............", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success("Password Reset Successfully!");
        } catch (error) {
            console.log("LOGIN API ERROR............", error.message);
            toast.error('Failed to reset password.');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}