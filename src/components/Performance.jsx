import { PieChart, Pie, ResponsiveContainer } from 'recharts';

const Performance = () => {

    const data = [
        { name: 'Group A', value: 92, fill: '#FF5B76' },
        { name: 'Group B', value: 8, fill: '#51DFC3' },
    ];

    return (
        <div className='bg-white p-4 rounded-[6px] h-80 relative'>
            <div className='flex items-center justify-between gap-4'>
                <h1 className='text-xl font-semibold'>Performance</h1>
                <img src="/moreDark.png" alt="" width={16} height={16} />
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={400}>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        fill="#8884d8"
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center'>
                <h1 className='text-3xl font-bold'>9.2</h1>
                <p className='text-xs text-gray-500'>of 10 max LTS</p>
            </div>
            <div></div>
        </div>
    );

}

export default Performance;