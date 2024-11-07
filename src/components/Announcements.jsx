const Announcements = () => {

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px]">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold dark:text-gray-200">Announcement</h1>
                <span className="text-xs text-gray-400 cursor-pointer">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-emerald-200 dark:bg-emerald-500 rounded-[6px] p-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="font-medium">Lorem ipsum dolor</h2>
                        <span className="text-xs text-gray-400 dark:text-gray-100 bg-white dark:bg-slate-800 rounded-[6px] p-1">2025-01-01</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-100 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat delectus sit odit cumque odio rerum consectetur deserunt culpa.</p>
                </div>
                <div className="bg-pink-200 dark:bg-pink-500 rounded-[6px] p-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="font-medium">Lorem ipsum dolor</h2>
                        <span className="text-xs text-gray-400 dark:text-gray-100 bg-white dark:bg-slate-800 rounded-[6px] p-1">2025-01-01</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-100 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat delectus sit odit cumque odio rerum consectetur deserunt culpa.</p>
                </div>
                <div className="bg-emerald-200 dark:bg-emerald-500 rounded-[6px] p-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="font-medium">Lorem ipsum dolor</h2>
                        <span className="text-xs text-gray-400 dark:text-gray-100 bg-white dark:bg-slate-800 rounded-[6px] p-1">2025-01-01</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-100 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat delectus sit odit cumque odio rerum consectetur deserunt culpa.</p>
                </div>
                <div className="bg-pink-200 dark:bg-pink-500 rounded-[6px] p-4">
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="font-medium">Lorem ipsum dolor</h2>
                        <span className="text-xs text-gray-400 dark:text-gray-100 bg-white dark:bg-slate-800 rounded-[6px] p-1">2025-01-01</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-100 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat delectus sit odit cumque odio rerum consectetur deserunt culpa.</p>
                </div>
            </div>
        </div>
    );
}

export default Announcements;