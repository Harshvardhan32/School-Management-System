import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { formatNumber } from "../utils/formatNumber";
import { Link } from "react-router-dom";

const CountChart = ({ total, boys, girls, others }) => {

    // Data for the radial bar chart
    const data = [
        {
            name: 'Girls',
            count: girls,
            fill: '#FF5B76',
        },
        {
            name: 'Boys',
            count: boys,
            fill: '#51DFC3',
        },
        {
            name: 'Others',
            count: others,
            fill: '#a7f3d0',
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[6px] w-full h-full p-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* TITLE */}
            <div className='flex items-center justify-between'>
                <h1 className="text-lg font-semibold dark:text-gray-200">Students</h1>
                <Link to='/list/attendance' className="text-sm text-gray-400">View All</Link>
            </div>
            {/* CHART */}
            <div className="relative w-full h-[75%]">
                <ResponsiveContainer>
                    {/* Radial bar chart displaying the data */}
                    <RadialBarChart cx="50%" cy="50%" innerRadius="63%" outerRadius="100%" barSize={35} data={data}>
                        <RadialBar
                            background
                            dataKey="count"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                {/* Centered image over the chart */}
                <img src="/maleFemale1.png" alt="" className="absolute max-w-24 max-h-24 lg:max-w-20 lg:max-h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            {/* BOTTOM */}
            <div className="w-full flex justify-between gap-4">
                {/* Display for Boys */}
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-[#51DFC3] rounded-full"></div>
                    <h1 className="font-bold dark:text-gray-200">{formatNumber(boys)}</h1>
                    <h2 className="text-xs text-gray-300">Boys ({Math.round(boys * 100 / total)}%)</h2>
                </div>
                {/* Display for Girls */}
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-[#FF5B76] rounded-full"></div>
                    <h1 className="font-bold dark:text-gray-200">{formatNumber(girls)}</h1>
                    <h2 className="text-xs text-gray-300">Girls ({Math.round(girls * 100 / total)}%)</h2>
                </div>
                {/* Display for Others */}
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-emerald-400 rounded-full"></div>
                    <h1 className="font-bold dark:text-gray-200">{formatNumber(others)}</h1>
                    <h2 className="text-xs text-gray-300">Others ({Math.round(others * 100 / total)}%)</h2>
                </div>
            </div>
        </div>
    );
}

export default CountChart;