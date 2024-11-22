import { useContext } from "react";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { ThemeContext } from "../utils/ThemeContext";

const CountChart = () => {

    const { darkMode } = useContext(ThemeContext);

    const data = [
        {
            name: 'Girls',
            count: 50,
            fill: '#FF5B76',
        },
        {
            name: 'Boys',
            count: 50,
            fill: '#51DFC3',
        },
    ];

    const style = {
        top: '50%',
        right: 0,
        transform: 'translate(0, -50%)',
        lineHeight: '24px',
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[6px] w-full h-full p-4">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold dark:text-gray-200">Students</h1>
                <img src="/moreDark.png" alt="" className="w-[20px] h-[20px]" />
            </div>
            {/* CHART */}
            <div className="relative w-full h-[75%]">
                <ResponsiveContainer>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="63%" outerRadius="100%" barSize={35} data={data}>
                        <RadialBar
                            background
                            dataKey="count"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <img src="/maleFemale1.png" alt="" className="absolute max-w-24 max-h-24 lg:max-w-20 lg:max-h-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            {/* BOTTOM */}
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-lamaGreen rounded-full"></div>
                    <h1 className="font-bold dark:text-gray-200">1,234</h1>
                    <h2 className="text-xs text-gray-300">Boys (55%)</h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-lamaPink rounded-full"></div>
                    <h1 className="font-bold dark:text-gray-200">1,234</h1>
                    <h2 className="text-xs text-gray-300">Girls (55%)</h2>
                </div>
            </div>
        </div>
    );
}

export default CountChart;