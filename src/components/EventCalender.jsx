import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../services/operations/eventAPI';

const EventCalendar = () => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    useEffect(() => {
        dispatch(getAllEvents(token));
    }, []);

    const [value, setValue] = useState(new Date());
    const { allEvents } = useSelector(state => state?.event);

    return (
        allEvents.length > 0 &&
        <div className='bg-white dark:bg-slate-900 rounded-[6px] w-full p-4'>
            <Calendar
                onChange={setValue}
                value={value}
                className={'dark:bg-slate-900 dark:text-gray-200'}
            />
            <div className='relative flex items-center justify-between'>
                <h1 className='text-xl font-semibold my-4 dark:text-gray-200'>Events</h1>
                <Link to='/list/events' className="text-xs text-gray-400">View All</Link>
            </div>
            <div className='flex flex-col gap-4'>
                {allEvents?.slice(0, 3).map((event) => (
                    <div className='p-5 rounded-[6px] border-2 border-gray-100 border-t-4 odd:border-t-[#51DFC3] even:border-t-[#FF5B76]' key={event._id}>
                        <div className='flex items-center justify-between'>
                            <h1 className='font-semibold text-gray-700 dark:text-gray-100'>{event.title}</h1>
                            <span className='text-gray-600 dark:text-gray-200 text-xs'>{new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} {new Date(event.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </div>
                        <p className='mt-2 text-gray-600 dark:text-gray-200 text-sm'>{event.content.length > 100 ? event.content.slice(0, 100) + '...' : event.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventCalendar;