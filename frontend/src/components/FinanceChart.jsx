import { useContext } from 'react';
import { ThemeContext } from '../utils/ThemeContext';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const FinanceChart = () => {

    const data = [
        {
            name: 'Jan',
            income: 4000,
            expense: 2400,
        },
        {
            name: 'Feb',
            income: 3000,
            expense: 1398,
        },
        {
            name: 'Mar',
            income: 2000,
            expense: 9800,
        },
        {
            name: 'Apr',
            income: 2780,
            expense: 3908,
        },
        {
            name: 'May',
            income: 1890,
            expense: 4800,
        },
        {
            name: 'Jun',
            income: 2390,
            expense: 3800,
        },
        {
            name: 'Jul',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Aug',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Sep',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Oct',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Nov',
            income: 3490,
            expense: 4300,
        },
        {
            name: 'Dec',
            income: 3490,
            expense: 4300,
        },
    ];

    const { darkMode } = useContext(ThemeContext);

    const styles = {
        backgroundColor: `${darkMode ? '#0F172A' : '#fff'}`,
        color: `${darkMode ? '#fff' : '#000'}`,
        padding: '10px',
        borderRadius: '5px',
        borderColor: 'lightgray'
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[6px] w-full h-full p-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold dark:text-gray-200">Finance</h1>
                <img src="/moreDark.png" alt="" className="w-[20px] h-[20px]" />
            </div>

            <div className="w-full h-full py-5">
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke='#ddd' />
                        <XAxis dataKey="name" axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false}
                            tickMargin={10} />
                        <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} tickMargin={20} />
                        <Tooltip
                            contentStyle={styles}
                        />
                        <Legend
                            align="center"
                            verticalAlign="top"
                            wrapperStyle={{ paddingTop: '10px', paddingBottom: '30px' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#FF5B76"
                            strokeWidth={4}
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#51DFC3"
                            strokeWidth={4}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default FinanceChart;