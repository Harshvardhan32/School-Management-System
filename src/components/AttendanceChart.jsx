import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const AttendanceChart = () => {

    const data = [
        {
            name: 'Mon',
            present: 40,
            absent: 24,
        },
        {
            name: 'Tue',
            present: 30,
            absent: 13,
        },
        {
            name: 'Wed',
            present: 20,
            absent: 98,
        },
        {
            name: 'Thu',
            present: 27,
            absent: 39,

        },
        {
            name: 'Fri',
            present: 18,
            absent: 48,
        },
        {
            name: 'Sat',
            present: 18,
            absent: 40,
        },
    ];

    return (
        <div className="bg-white rounded-[6px] w-full h-full p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Attendance</h1>
                <img src="/moreDark.png" alt="" className="w-[20px] h-[20px]" />
            </div>
            <div className="w-full h-full py-5">
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                        width={500}
                        // height={300}
                        data={data}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                        <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                        <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '5px', borderColor: 'lightgray' }} />
                        <Legend
                            align="left"
                            verticalAlign="top"
                            wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
                        />
                        <Bar
                            dataKey="present"
                            fill="#51DFC3"
                            legendType="circle"
                            radius={[10, 10, 0, 0]}
                        />
                        <Bar
                            dataKey="absent"
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