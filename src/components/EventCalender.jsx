import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link } from 'react-router-dom';

const EventCalendar = () => {

    const events = [
        {
            id: 1,
            title: "Lorem ipsum dolor",
            time: '12:00 PM - 2:00 PM',
            description: 'Lorem ipsum dolor sit amet, consector adipising elit.'
        },
        {
            id: 2,
            title: "Lorem ipsum dolor",
            time: '12:00 PM - 2:00 PM',
            description: 'Lorem ipsum dolor sit amet, consector adipising elit.'
        },
        {
            id: 3,
            title: "Lorem ipsum dolor",
            time: '12:00 PM - 2:00 PM',
            description: 'Lorem ipsum dolor sit amet, consector adipising elit.'
        },
    ]

    const [value, setValue] = useState(new Date());
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className='bg-white dark:bg-slate-900 rounded-[6px] w-full p-4'>
            <Calendar
                onChange={setValue}
                value={value}
                className={'dark:bg-slate-900 dark:text-gray-200'}
            />
            <div className='relative flex items-center justify-between'>
                <h1 className='text-xl font-semibold my-4 dark:text-gray-200'>Events</h1>
                <img src="/moreDark.png"
                    alt=""
                    className='w-[20px] h-[20px] cursor-pointer'
                    onClick={() => setShowDropdown((prev) => !prev)}
                />
                {
                    showDropdown &&
                    <Link to={'/list/events'} className='absolute top-12 right-0 shadow-2xl dark:bg-slate-900 text-gray-500 text-sm bg-white rounded-[6px] border-[1px] border-gray-200 px-4 py-2'>
                        View All
                    </Link>
                }
            </div>
            <div className='flex flex-col gap-4'>
                {events?.map((event) => (
                    <div className='p-5 rounded-[6px] border-2 border-gray-100 border-t-4 odd:border-t-emerald-400  even:border-t-pink-400' key={event.id}>
                        <div className='flex items-center justify-between'>
                            <h1 className='font-semibold text-gray-700 dark:text-gray-100'>{event.title}</h1>
                            <span className='text-gray-600 dark:text-gray-200 text-xs'>{event.time}</span>
                        </div>
                        <p className='mt-2 text-gray-600 dark:text-gray-200 text-sm'>{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventCalendar;