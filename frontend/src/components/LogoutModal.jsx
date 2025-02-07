import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../services/operations/authAPI";

const LogoutModal = ({ setLogoutModal }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(logout(navigate));
        setLogoutModal(false);
    }

    return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto backdrop-blur-sm w-screen min-h-screen py-10 top-0 left-0 bg-black bg-opacity-60">
            <div className="bg-white border-[1px] border-gray-300 dark:bg-slate-900 p-4 rounded-[6px] relative max-w-[350px] w-full">
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col gap-4 dark:text-gray-200">
                        <p className="text-3xl font-semibold">Are you sure?</p>
                        <p className="text-base">You will be logged out of your account.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="bg-[#51DFC3] text-gray-800 font-semibold px-4 py-2 rounded-[6px]"
                            onClick={logoutHandler}
                        >Logout</button>
                        <button className="bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-[6px]" onClick={() => setLogoutModal(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LogoutModal;