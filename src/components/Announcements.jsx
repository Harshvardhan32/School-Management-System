import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllAnnouncement } from "../services/operations/announcementAPI";

const Announcements = () => {

    const [announcement, setAnnouncement] = useState([]);
    const { token } = useSelector((state) => state?.auth);

    const extractDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        const result = getAllAnnouncement(token, setAnnouncement);
    }, []);

    return (
        announcement?.length > 0 &&
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px]">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold dark:text-gray-200">Announcement</h1>
                <Link to='/list/announcements' className="text-xs text-gray-400">View All</Link>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {
                    announcement?.map((item) =>
                        <div
                            key={item._id}
                            className="odd:bg-emerald-200 odd:dark:bg-emerald-500 even:bg-pink-200 even:dark:bg-pink-500 rounded-[6px] p-4">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="font-medium">{item.title}</h2>
                                <span className="text-xs text-gray-400 dark:text-gray-100 bg-white dark:bg-slate-800 rounded-[6px] p-1">{extractDate(item.date)}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-100 mt-1">{item.content}</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Announcements;