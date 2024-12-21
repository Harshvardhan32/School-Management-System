import EventCalendar from "../../components/EventCalender";
import Announcements from "../../components/Announcements";
import BigCalender from "../../components/BigCalender";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useMemo, useState } from "react";
import { getAllCalendars } from "../../services/operations/calendarAPI";
import Select from 'react-select';
import { getDateOfWeek } from "../../utils/getDateOfWeek";
import customStyles from "../../utils/CustomStyles";
import { ThemeContext } from "../../utils/ThemeContext";

const Parent = () => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { allCalendars } = useSelector(state => state?.calendar);
    const [studentId, setStudentId] = useState(null);

    const { darkMode } = useContext(ThemeContext);
    const styles = customStyles(darkMode);

    useEffect(() => {
        dispatch(getAllCalendars(token));
    }, [token]);

    const studentOptions = user?.students.map((student) => {
        return {
            label: `${student.userId.firstName} ${student.userId.lastName}`,
            value: student.classId._id,
        }
    }) || [];

    const studentCalendar = studentId && allCalendars?.filter((calendar) => calendar.classId._id.toString() === studentId);

    const events = useMemo(() => {
        if (!studentId || !allCalendars) return [];

        const studentCalendar = allCalendars.filter((calendar) =>
            calendar.classId?._id?.toString() === studentId
        );

        return studentCalendar.flatMap((calendar) => {
            const targetDate = getDateOfWeek(calendar.dayOfWeek);

            return calendar.schedule.flatMap((item, index) => {
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
                    title: item.type === 'class'
                        ? `${item.subject?.subjectName} (${item.teacher ? (item.teacher?.userId.firstName + ' ' + item.teacher?.userId.lastName) : ''})`
                        : 'Break',
                    start: startDate,
                    end: endDate,
                    allDay: false,
                };
            });
        });
    }, [studentCalendar]);

    return (
        <div className="w-[98.5%] p-4 flex gap-4 flex-col 2xl:flex-row">
            {/* LEFT */}
            <div className="w-full 2xl:w-2/3 flex flex-col gap-8">
                <div className="h-[1300px] flex flex-col gap-4 bg-white dark:bg-slate-900 rounded-[6px] p-4">
                    <h1 className="text-xl dark:text-gray-200 font-semibold">Schedule</h1>
                    <Select
                        name='supervisor'
                        options={studentOptions}
                        placeholder='Select Student'
                        onChange={(student) => setStudentId(student.value)}
                        label='Supervisor'
                        styles={styles}
                        className="max-w-[300px] w-full"
                    />
                    <BigCalender events={events} />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full 2xl:w-1/3 flex flex-col gap-8">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
}

export default Parent;