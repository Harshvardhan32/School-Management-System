import { useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const Navbar = () => {

    const [darkMode, setDarkMode] = useState(false);

    const handleDarkMode = () => {
        setDarkMode((prev) => !prev);
    }

    return (
        <div className="flex items-center justify-between bg-white p-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                <img src="/search.png" alt="" className="w-[14px] h-[14px]" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="outline-none w-[200px] bg-transparent py-2"
                />
            </div>
            {/* Icons And User */}
            <div className="w-full flex items-center justify-end gap-6 px-6">
                {
                    darkMode ?
                        <MdOutlineLightMode
                            fontSize={25}
                            onClick={handleDarkMode}
                            className="text-gray-400 cursor-pointer"
                        />
                        : <MdOutlineDarkMode
                            fontSize={25}
                            onClick={handleDarkMode}
                            className="text-gray-400 cursor-pointer"
                        />
                }
                <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <img src="/message.png" alt="" className="w-[20px] h-[20px]" />
                </div>
                <div className="bg-white relative rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                    <img src="/announcement.png" alt="" className="w-[20px] h-[20px]" />
                    <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full text-xs flex justify-center items-center bg-lamaGreen text-gray-800">0</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">Rahul Singh</span>
                    <span className="text-[10px] text-gray-500 text-right">Admin</span>
                </div>
                <img src="/avatar.png" alt="" className="w-[36px] h-[36px] rounded-full" />

            </div>
        </div>
    );

}

export default Navbar;