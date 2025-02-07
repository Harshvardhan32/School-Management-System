import { Link } from "react-router-dom";
import ProfilePopup from "./ProfilePopup";
import { CiDark, CiLight } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../utils/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { getAllMessages } from "../../services/operations/messageAPI";
import { getAllAnnouncement } from "../../services/operations/announcementAPI";

const Navbar = () => {

    const dispatch = useDispatch();
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [openProfile, setOpenProfile] = useState(false);
    const { token } = useSelector((state) => state?.auth);
    const { user } = useSelector((state) => state?.profile);
    const { allAnnouncements } = useSelector(state => state?.announcement);
    const { allMessages } = useSelector(state => state?.message);

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        dispatch(getAllAnnouncement(token));
        dispatch(getAllMessages(token));
    }, [token]);

    const handlePopup = (item) => {
        setShowPopup(item);
    }

    const handleNew = (date, day) => {
        const givenDate = new Date(date);
        const todayDate = new Date();
        const differenceInMilliseconds = Math.abs(todayDate - givenDate);
        const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
        return Math.floor(differenceInDays) <= day;
    };

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
                <div
                    className="rounded-full text-gray-500 cursor-pointer w-7 h-7 flex items-center justify-center"
                    onClick={() => { showPopup === 'message' ? handlePopup(false) : handlePopup('message') }}
                >
                    <img src="/message.png" alt="" className="w-[20px] h-[20px]" />
                </div>

                {/* Messages Popup */}
                {
                    showPopup === 'message' &&
                    <div
                        className="absolute max-w-[200px] max-h-[300px] overflow-y-auto w-full top-14 right-14 text-xs text-gray-900 dark:text-gray-200 rounded-[6px] bg-white shadow-md dark:bg-slate-900 flex flex-col gap-1 z-30 border border-gray-400 dark:border-gray-200"
                    >
                        <div className="flex gap-2 items-center justify-between px-2 pt-2">
                            <p className="font-semibold">Messages</p>
                            <Link to='/list/messages' onClick={() => setShowPopup(false)}>View All</Link>
                        </div>
                        {
                            allMessages?.slice(0, 3)?.map((message, i) => (
                                <div
                                    className={`flex flex-col gap-1 p-2 ${i !== 2 && 'border-b border-gray-500'}`}
                                    key={message?._id}
                                >
                                    <div className="flex gap-2 items-center justify-between">
                                        <p className="font-medium">{message?.title}</p>
                                        {
                                            handleNew(message?.createdAt, 2) &&
                                            <p className="rounded-[3px] text-gray-600 bg-[#51DFC3] px-[4px]">New</p>
                                        }
                                    </div>
                                    <p className="text-justify">{message?.content.length > 80 ? `${message?.content.slice(0, 80)}...` : message?.content}</p>
                                </div>
                            ))
                        }
                    </div>
                }

                <div
                    className="relative rounded-full text-gray-400 cursor-pointer w-7 h-7 flex items-center justify-center"
                    onClick={() => { showPopup === 'announcement' ? handlePopup(false) : handlePopup('announcement') }}
                >
                    <img src="/announcement.png" alt="" className="w-[20px] h-[20px]" />
                    <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full text-xs flex justify-center items-center bg-[#51DFC3] text-gray-800">{allAnnouncements?.length}</span>
                </div>

                {/* Announcement Popup */}
                {
                    showPopup === 'announcement' &&
                    <div
                        className="absolute max-w-[200px] max-h-[300px] overflow-y-auto w-full top-14 right-10 text-xs text-gray-900 dark:text-gray-200 rounded-[6px] bg-white shadow-md dark:bg-slate-900 flex flex-col gap-1 z-30 border border-gray-400 dark:border-gray-200"
                    >
                        <div className="flex gap-2 items-center justify-between px-2 pt-2">
                            <p className="font-semibold">Announcements</p>
                            <Link to='/list/announcements' onClick={() => setShowPopup(false)}>View All</Link>
                        </div>
                        {
                            allAnnouncements?.slice(0, 3)?.map((announcement, i) => (
                                <div
                                    className={`flex flex-col gap-1 p-2 ${i !== 2 && 'border-b border-gray-500'}`}
                                    key={announcement?._id}
                                >
                                    <div className="flex gap-2 items-center justify-between">
                                        <p className="font-medium">{announcement?.title}</p>
                                        {
                                            handleNew(announcement?.date, 5) &&
                                            <p className="rounded-[3px] text-gray-600 bg-[#51DFC3] px-[4px]">New</p>
                                        }
                                    </div>
                                    <p className="text-justify">{announcement?.description.length > 80 ? `${announcement?.description.slice(0, 80)}...` : announcement?.description}</p>
                                </div>
                            ))
                        }
                    </div>
                }

                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium dark:text-gray-200">{user?.userId?.firstName} {user?.userId?.lastName}</span>
                    <span className="text-[10px] text-gray-500 text-right">{user?.userId?.role}</span>
                </div>
                <img
                    src={user?.userId?.photo}
                    alt=""
                    onClick={() => setOpenProfile((prev) => !prev)}
                    tabIndex="0"
                    className="w-[36px] h-[36px] rounded-full cursor-pointer focus:border-2 focus:border-gray-400 dark:focus:border-gray-700"
                />
                {openProfile && <ProfilePopup setOpenProfile={setOpenProfile} photo={user?.userId?.photo} role={user?.userId?.role} />}
            </div>
        </div>
    );
}

export default Navbar;