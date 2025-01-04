import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../services/operations/eventAPI';

const EventCalendar = () => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    // Fetching all events on component mount
    useEffect(() => {
        dispatch(getAllEvents(token));
    }, []);

    const [value, setValue] = useState(new Date());
    const { allEvents } = useSelector(state => state?.event);

    // Filtering events based on selected date
    const eventData = useMemo(() => (
        allEvents?.filter((event) => (value === event?.startDate.split('T')[0]))
    ), [value]);

    return (
        allEvents.length > 0 &&
        <div className='bg-white dark:bg-slate-900 rounded-[6px] w-full p-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out'>
            {/* Calendar component to select a date */}
            <Calendar
                onChange={(value) => {
                    // Adjusting the date to ISO format
                    const adjustedDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
                    const isoDate = adjustedDate.toISOString().split('T')[0];
                    setValue(isoDate);
                }}
                value={value ? new Date(value) : null}
                className='dark:bg-slate-900 dark:text-gray-400'
            />

            {/* Events section */}
            <div className='relative flex items-center justify-between'>
                <h1 className='text-xl font-semibold my-4 dark:text-gray-200'>Events</h1>
                <Link to='/list/events' className="text-sm text-gray-400">View All</Link>
            </div>

            {/* Displaying events for the selected date */}
            <div className='flex flex-col gap-4'>
                {
                    eventData?.length > 0 ?
                        eventData?.slice(0, 3).map((event) => (
                            <div className='p-5 rounded-[6px] border-2 border-gray-100 border-t-4 odd:border-t-[#51DFC3] even:border-t-[#FF5B76]' key={event._id}>
                                {/* Event title and time */}
                                <div className='flex items-center justify-between'>
                                    <h1 className='font-semibold text-gray-700 dark:text-gray-100'>{event.title}</h1>
                                    <span className='text-gray-600 dark:text-gray-200 text-xs'>{new Date(event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} {new Date(event.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                                {/* Event content */}
                                <p className='mt-2 text-gray-600 dark:text-gray-200 text-sm'>{event.content}</p>
                            </div>
                        ))
                        : <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No event for selected date.
                        </p>
                }
            </div>
        </div>
    );
}

export default EventCalendar;