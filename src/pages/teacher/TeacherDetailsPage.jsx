import { useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import FormModal from "../../components/FormModal";
import { Link, useLocation } from "react-router-dom";
import { formatDate } from "../../services/formatDate";
import BigCalendar from "../../components/BigCalender";
import Performance from "../../components/Performance";
import { useDispatch, useSelector } from "react-redux";
import { getDateOfWeek } from "../../utils/getDateOfWeek";
import Announcements from "../../components/Announcements";
import { getAllCalendars } from "../../services/operations/calendarAPI";
import { getAllTeachers, getTeacherDetails } from "../../services/operations/teacherAPI";

const TeacherDetailsPage = () => {

    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const dispatch = useDispatch();
    const { teacherDetails } = useSelector(state => state?.teacher);
    const { allCalendars } = useSelector(state => state?.calendar);
    const location = useLocation();
    const teacherId = location?.pathname.split('/').at(-1);

    useEffect(() => {
        dispatch(getTeacherDetails(token, teacherId));
        dispatch(getAllTeachers(token));
        dispatch(getAllCalendars(token));
    }, [teacherId, token, dispatch]);

    const { allTeachers } = useSelector(state => state?.teacher);
    const teachersId = allTeachers?.map((teacher) => teacher?.teacherId) || [];

    // Filter the calendars to get the teacher's schedule based on class and teacher match
    const teacherCalendar = allCalendars?.filter((calendar) => {
        const isClassMatch = teacherDetails?.classes.some((classItem) => {
            return calendar.classId._id === classItem._id;
        });

        const isTeacherMatch = calendar.schedule.some((scheduleItem) => {
            return scheduleItem.teacher?._id === user._id;
        });

        return isClassMatch && isTeacherMatch;
    });

    // Map each teacher's calendar into events for the calendar component
    const events = teacherCalendar?.flatMap((calendar) => {

        const targetDate = getDateOfWeek(calendar.dayOfWeek);

        // Map each schedule item to an event object
        return calendar.schedule.map((item, index) => {
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
                title: item.type === 'class' ? `${item.subject?.subjectName}` : 'Break',
                start: startDate,
                end: endDate,
                allDay: false,
            };
        });
    });

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-[#51DFC3] py-6 px-4 rounded-[6px] flex-1 flex gap-4">
                        <div className="w-1/3">
                            <img src={teacherDetails?.userId.photo}
                                alt=""
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex gap-2 items-center justify-between">
                                <h1 className="text-xl font-semibold">{teacherDetails?.userId.firstName} {teacherDetails?.userId.lastName}</h1>
                                {
                                    (user?.userId.role === 'Admin' || user?._id === teacherDetails?._id) &&
                                    <FormModal table='teacher' type='update' Icon={FaRegEdit} data={teacherDetails} allData={teachersId} />
                                }
                            </div>
                            <p className="font-medium text-sm">{teacherDetails?.userId.remarks}</p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <img src="/blood.png" alt="" width={14} height={14} />
                                    <span>{teacherDetails?.userId.bloodType}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <img src="/date.png" alt="" width={14} height={14} />
                                    <span>{formatDate(teacherDetails?.userId.dateOfBirth)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <img src="/mail.png" alt="" width={14} height={14} />
                                    <span>{teacherDetails?.userId.email}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <img src="/phone.png" alt="" width={14} height={14} />
                                    <span>{teacherDetails?.userId.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SMALL CARDS */}
                    <div className="flex lg:flex-col flex-row gap-4 justify-between flex-wrap">
                        {/* CARD */}
                        <div className="bg-white dark:bg-slate-900 min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl dark:text-gray-200 font-semibold">{teacherDetails?.subjects.length}</h1>
                                <span className="text-sm text-gray-400">Subjects</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl dark:text-gray-200 font-semibold">{teacherDetails?.classes.length}</h1>
                                <span className="text-sm text-gray-400">Classes</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-[6px] p-4 pb-6 h-[800px] dark:bg-slate-900">
                    <h1 className="text-xl font-semibold dark:text-gray-200">Teacher's Schedule</h1>
                    <BigCalendar events={events} className='dark:bg-slate-900' />
                </div>
            </div >
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px]">
                    <h1 className="text-xl font-semibold dark:text-gray-200">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-700">
                        <Link className="p-3 rounded-[6px] bg-pink-200" to={'/list/classes'}>Teacher's Classes</Link>
                        <Link className="p-3 rounded-[6px] bg-emerald-200" to={'/list/students'}>Teacher's Students</Link>
                        <Link className="p-3 rounded-[6px] bg-sky-200" to={'/list/lessons'}>Teacher's Lessons</Link>
                        <Link className="p-3 rounded-[6px] bg-orange-200" to={'/list/exams'}>Teacher's Exams</Link>
                        <Link className="p-3 rounded-[6px] bg-purple-200" to={'/list/assignments'}>Teacher's Assignments</Link>
                    </div>
                </div>
                {/* <Performance /> */}
                <Announcements />
            </div>
        </div>
    );
}

export default TeacherDetailsPage;