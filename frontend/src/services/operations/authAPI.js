import toast from "react-hot-toast";
import apiConnector from "../apiConnect";
import { setUser } from "../../slices/profileSlice";
import { authEndPoints, settingsEndPoints } from '../apis';
import { setLoading, setToken } from "../../slices/authSlice";

const {
    LOGIN_API,
    RESET_PASSWORD_TOKEN_API,
    RESET_PASSWORD_API
} = authEndPoints;

const { CHANGE_PASSWORD_API } = settingsEndPoints;

export const login = (data) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", LOGIN_API, {
                userId: data?.userId,
                password: data?.password
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success("Login Successfully!");

            // Dispatch Redux actions to store token and user
            dispatch(setToken(response?.data?.token));
            dispatch(setUser({ ...response?.data?.data }));

            // Calculate expiration timestamp (24 hours)
            const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            // Store token, user data, and expiration timestamp in localStorage
            localStorage.setItem(
                "auth",
                JSON.stringify({
                    token: response?.data?.token,
                    user: response?.data?.data,
                    expiresAt,
                })
            );
        } catch (error) {
            toast.error("Invalid Credentials!");
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    };
}

export const checkAuthExpiration = () => {
    return (dispatch) => {
        const authData = JSON.parse(localStorage.getItem("auth"));

        if (authData) {
            const currentTime = new Date().getTime();

            // Check if token has expired
            if (currentTime >= authData.expiresAt) {
                // Clear localStorage and Redux state
                localStorage.removeItem("auth");
                dispatch(setToken(null));
                dispatch(setUser(null));
            }
        }
    };
}

export const logout = (navigate) => {
    return (dispatch) => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.removeItem('auth');
        toast.success("Logout Successfully!");
        navigate('/');
    }
}

export const resetPasswordToken = (email, setEmailSent) => {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try {
            const response = await apiConnector("POST", RESET_PASSWORD_TOKEN_API, { email });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            setEmailSent(true);
            toast.dismiss(toastId);
            toast.success("Reset Email Sent Successfully!");
        } catch (error) {
            toast.error('Failed to send email to reset password.');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const resetPassword = (data, token) => {
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

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success("Password Reset Successfully!");
        } catch (error) {
            toast.error('Failed to reset password.');
        } finally {
            dispatch(setLoading(false));
            toast.dismiss(toastId);
        }
    }
}

export const changePassword = (data, token) => {
    return async () => {
        const toastId = toast.loading("Loading...");

        try {
            const response = await apiConnector("PUT", CHANGE_PASSWORD_API, data, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            });

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            toast.dismiss(toastId);
            toast.success("Password Updated Successfully!");
        } catch (error) {
            toast.error('Failed to update password.');
        } finally {
            toast.dismiss(toastId);
        }
    }
}