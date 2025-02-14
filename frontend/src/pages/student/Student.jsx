import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BigCalender from "../../components/BigCalender";
import { getDateOfWeek } from "../../utils/getDateOfWeek";
import Announcements from "../../components/Announcements";
import EventCalendar from "../../components/EventCalender";
import { getAllCalendars } from "../../services/operations/calendarAPI";

const Student = () => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { allCalendars } = useSelector(state => state?.calendar);

    useEffect(() => {
        dispatch(getAllCalendars(token));
    }, [token]);

    // Filter calendars for the student's class based on user classId
    const studentCalendar = allCalendars?.filter((calendar) => {
        return calendar.classId._id === user.classId._id;
    });

    // Map calendar data to events
    const events = studentCalendar?.flatMap((calendar) => {
        const targetDate = getDateOfWeek(calendar.dayOfWeek);

        // Map each schedule item to an event
        return calendar?.schedule?.map((item, index) => {
            const startTime = item.startTime.split(':');
            const endTime = item.endTime.split(':');

            const startDate = new Date(
                targetDate.getFullYear(),
                targetDate.getMonth(),
                targetDate.getDate(),
                parseInt(startTime[0], 10),
                parseInt(startTime[1], 10)
            );

            const endDate = new Date(
                targetDate.getFullYear(),
                targetDate.getMonth(),
                targetDate.getDate(),
                parseInt(endTime[0], 10),
                parseInt(endTime[1], 10)
            );

            return {
                id: `${calendar.classId._id}-${index + 1}`,
                title: item.type === 'class' ? `${item.subject?.subjectName} (${item.teacher ? (item.teacher?.userId.firstName + ' ' + item.teacher?.userId.lastName) : ''})` : 'Break',
                start: startDate,
                end: endDate,
                allDay: false,
            };
        });
    });

    return (
        <div className="w-[98.5%] xl:min-h-[1200px] p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3 flex flex-col gap-8">
                <div className="h-[1300px] bg-white dark:bg-slate-900 rounded-[6px] p-4">
                    <h1 className="text-xl dark:text-gray-200 font-semibold">Schedule ({user?.classId.className})</h1>
                    <BigCalender events={events} className='dark:bg-slate-900' />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
}

export default Student;