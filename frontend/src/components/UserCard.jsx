import { useState } from "react";
import { Link } from "react-router-dom";
import { formatNumber } from "../utils/formatNumber";

const UserCard = ({ type, number, href, date }) => {

    // State for managing dropdown visibility
    const [dropdown, setDropdown] = useState(false);

    return (
        <div className="rounded-[6px] odd:bg-[#51DFC3] even:bg-[#FF5B76] p-4 flex-1 min-w-[130px] shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="relative flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">{date}</span>

                {/* Button for showing dropdown */}
                <img src="/more.png" alt="" className="w-[20px] h-[20px] cursor-pointer" onClick={() => setDropdown((prev) => !prev)} />
                {dropdown && <Link to={href} className="absolute -right-4 top-6 bg-white dark:bg-slate-900 dark:text-gray-200 border border-gray-400 text-gray-800 text-sm rounded-[6px] p-1">View All</Link>}
            </div>

            <h1 className="text-2xl font-semibold my-4">{formatNumber(number)}</h1>
            <h2 className="text-sm font-medium text-gray-700">{type}</h2>
        </div>
    );
}

export default UserCard;