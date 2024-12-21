import { CiDark, CiLight } from "react-icons/ci";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../utils/ThemeContext";
import ProfilePopup from "./ProfilePopup";
import { useDispatch, useSelector } from "react-redux";
import { getAllAnnouncement } from "../../services/operations/announcementAPI";

const Navbar = () => {

    const dispatch = useDispatch();
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [openProfile, setOpenProfile] = useState(false);
    const { token } = useSelector((state) => state?.auth);
    const { user } = useSelector((state) => state?.profile);
    const { allAnnouncements } = useSelector(state => state?.announcement);

    useEffect(() => {
        dispatch(getAllAnnouncement(token));
    }, [])

    return (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 shadow-md">
            {/* Search Bar */}
            {/* <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <img src="/search.png" alt="" className="w-[14px] h-[14px]" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="outline-none w-[200px] bg-transparent py-2 dark:text-gray-200"
                />
            </div> */}
            {/* Icons And User */}
            <div className="realtive w-full flex items-center justify-end gap-4 pr-4">
                {
                    darkMode ?
                        <CiLight
                            fontSize={25}
                            fontWeight={700}
                            onClick={toggleDarkMode}
                            className="text-gray-500 cursor-pointer"
                        />
                        : <CiDark
                            fontSize={25}
                            fontWeight={700}
                            onClick={toggleDarkMode}
                            className="text-gray-500 cursor-pointer"
                        />
                }
                <div className="rounded-full text-gray-500 cursor-pointer w-7 h-7 flex items-center justify-center">
                    <img src="/message.png" alt="" className="w-[20px] h-[20px]" />
                </div>
                <div className="relative rounded-full text-gray-400 cursor-pointer w-7 h-7 flex items-center justify-center">
                    <img src="/announcement.png" alt="" className="w-[20px] h-[20px]" />
                    <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full text-xs flex justify-center items-center bg-[#51DFC3] text-gray-800">{allAnnouncements?.length}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium dark:text-gray-200">{user?.userId.firstName} {user?.userId.lastName}</span>
                    <span className="text-[10px] text-gray-500 text-right">{user?.userId.role}</span>
                </div>
                <img
                    src={user?.userId.photo}
                    alt=""
                    onClick={() => setOpenProfile((prev) => !prev)}
                    className="w-[36px] h-[36px] rounded-full cursor-pointer"
                />
                {openProfile && <ProfilePopup setOpenProfile={setOpenProfile} photo={user?.userId.photo} role={user?.userId.role} />}
            </div>
        </div>
    );

}

export default Navbar;