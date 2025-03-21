import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutModal from "../LogoutModal";
import { MdSettings, MdOutlineLogout } from "react-icons/md";

const ProfilePopup = ({ setOpenProfile, photo, role }) => {

    const [logoutModal, setLogoutModal] = useState(false);

    return (
        <>
            <div className="absolute top-[69px] right-7 max-w-[280px] w-11/12 flex flex-col rounded-[6px] border-[1.5px] border-gray-300 shadow-lg bg-white dark:bg-slate-900 z-50">
                <Link to='/profile' onClick={() => setOpenProfile(false)} className="flex flex-row gap-4 items-center dark:text-gray-200 text-sm border-b-[1px] border-gray-300 h-[60px] p-4">
                    <div>
                        <img
                            src={photo}
                            alt=""
                            tabIndex={0}
                            className="w-[36px] h-[36px] rounded-full focus:border-2 focus:border-gray-400 dark:focus:border-gray-700"
                        />
                    </div>
                    <span>{role}</span>
                </Link>
                <Link to='/settings' onClick={() => setOpenProfile(false)} className="flex flex-row gap-4 items-center dark:text-gray-200 text-sm border-b-[1px] border-gray-300 h-[60px] p-4">
                    <MdSettings fontSize={18} />
                    <span>Manage account</span>
                </Link>
                <div className="flex flex-row gap-4 items-center dark:text-gray-200 text-sm h-[60px] p-4 cursor-pointer"
                    onClick={() => setLogoutModal(true)}
                >
                    <MdOutlineLogout fontSize={18} />
                    <span>Logout</span>
                </div>
            </div>
            {logoutModal && <LogoutModal setLogoutModal={setLogoutModal} />}
        </>
    )
}

export default ProfilePopup;