import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../utils/ThemeContext";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const AttendanceChart = ({ data }) => {

    // Accessing darkMode value from the ThemeContext
    const { darkMode } = useContext(ThemeContext);

    // Styling object based on dark mode
    const styles = {
        backgroundColor: `${darkMode ? '#0F172A' : '#fff'}`,
        color: `${darkMode ? '#fff' : '#000'}`,
        padding: '10px',
        borderRadius: '5px',
        borderColor: 'lightgray'
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[6px] w-full h-full p-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* TITLE SECTION */}
            <div className='relative flex items-center justify-between'>
                <h1 className='text-xl font-semibold dark:text-gray-200'>Attendance</h1>
                <Link to='/list/attendance' className="text-sm text-gray-400">View All</Link>
            </div>

            {/* CHART SECTION */}
            <div className="w-full h-full py-3">
                <ResponsiveContainer width="100%" height="90%">
                    {/* Bar chart to display attendance data */}
                    <BarChart
                        width={500}
                        data={data}
                        barSize={20}
                    >
                        {/* Grid lines for the chart */}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                        {/* X-axis for the chart with custom styling */}
                        <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                        {/* Y-axis for the chart with custom styling */}
                        <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                        {/* Tooltip customization */}
                        <Tooltip contentStyle={styles} />
                        {/* Legend to display information about the bars */}
                        <Legend
                            align="left"
                            verticalAlign="top"
                            wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
                        />
                        {/* Bar for Present data */}
                        <Bar
                            dataKey="Present"
                            fill="#51DFC3"
                            legendType="circle"
                            radius={[10, 10, 0, 0]}
                        />
                        {/* Bar for Absent data */}
                        <Bar
                            dataKey="Absent"
                            fill="#FF5B76"
                            legendType="circle"
                            radius={[10, 10, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default AttendanceChart;