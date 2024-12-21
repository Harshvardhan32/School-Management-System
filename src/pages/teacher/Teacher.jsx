import BigCalender from "../../components/BigCalender";
import Announcements from "../../components/Announcements";
import { useDispatch, useSelector } from "react-redux";
import { getAllCalendars } from "../../services/operations/calendarAPI";
import { useEffect } from "react";
import { getDateOfWeek } from "../../utils/getDateOfWeek";

const Teacher = () => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { allCalendars } = useSelector(state => state?.calendar);

    useEffect(() => {
        dispatch(getAllCalendars(token));
    }, [token]);

    const teacherCalendar = allCalendars?.filter((calendar) => {
        const isClassMatch = user?.classes.some((classItem) => {
            return calendar.classId._id === classItem._id;
        });

        const isTeacherMatch = calendar.schedule.some((scheduleItem) => {
            return scheduleItem.teacher?._id === user._id;
        });

        return isClassMatch && isTeacherMatch;
    });

    console.log("TeacherCalendar: ", teacherCalendar);

    const events = teacherCalendar?.flatMap((calendar) => {

        // Get the date of the dayOfWeek for the current week
        const targetDate = getDateOfWeek(calendar.dayOfWeek);

        // Map each schedule item to an event
        return calendar.schedule.map((item, index) => {
            const startTime = item.startTime.split(':');
            const endTime = item.endTime.split(':');

            // Create start and end Date objects based on the targetDate
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
                title: item.type === 'class' ? `${item.subject?.subjectName}` : 'Break',
                start: startDate,
                end: endDate,
                allDay: false,
            };
        });
    });

    return (
        <div className="w-[98.5%] p-4 flex gap-4 flex-col 2xl:flex-row">
            {/* LEFT */}
            <div className="w-full 2xl:w-2/3 flex flex-col gap-8">
                <div className="h-[1300px] bg-white dark:bg-slate-900 rounded-[6px] p-4">
                    <h1 className="text-xl dark:text-gray-200 font-semibold">Schedule</h1>
                    <BigCalender events={events} />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full 2xl:w-1/3 flex flex-col gap-8">
                <Announcements />
            </div>
        </div>
    );
}

export default Teacher;