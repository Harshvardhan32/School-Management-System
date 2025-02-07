import { useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import FormModal from "../../components/FormModal";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../services/formatDate";
import BigCalendar from "../../components/BigCalender";
import { getDateOfWeek } from "../../utils/getDateOfWeek";
import EventCalendar from "../../components/EventCalender";
import Announcements from "../../components/Announcements";
import { getAllCalendars } from "../../services/operations/calendarAPI";
import { getAllAttendance } from "../../services/operations/attendanceAPI";
import { getAllStudents, getStudentDetails } from "../../services/operations/studentAPI";

const StudentDetailsPage = () => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { studentDetails } = useSelector(state => state?.student);
    const { allCalendars } = useSelector(state => state?.calendar);
    const location = useLocation();
    const studentId = location?.pathname.split('/').at(-1);

    useEffect(() => {
        dispatch(getStudentDetails(token, studentId));
        dispatch(getAllStudents(token));
        dispatch(getAllAttendance(token));
        dispatch(getAllCalendars(token));
    }, [studentId, token, dispatch]);

    const { allStudents } = useSelector(state => state?.student);
    const { allAttendance } = useSelector((state) => state?.attendance);
    const studentsId = allStudents?.map((student) => student?.studentId);
    const rollNumber = allStudents?.map((student) => student?.rollNumber.toString());

    // Filter calendars for the student's class based on user classId
    const studentCalendar = allCalendars?.filter((calendar) => {
        return calendar.classId._id === studentDetails?.classId._id;
    });

    // Map calendar data to events
    const events = studentCalendar?.flatMap((calendar) => {
        const targetDate = getDateOfWeek(calendar.dayOfWeek);

        // Map each schedule item to an event
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
                title: item.type === 'class' ? `${item.subject?.subjectName} (${item.teacher ? (item.teacher?.userId.firstName + ' ' + item.teacher?.userId.lastName) : ''})` : 'Break',
                start: startDate,
                end: endDate,
                allDay: false,
            };
        });
    });

    function getAttendanceData(studentData, allAttendance) {
        const attendanceData = {
            totalClass: 0,
            present: 0,
            absent: 0,
        };

        // Loop through attendance records and calculate presence and absence
        allAttendance?.forEach((attendance) => {
            if (attendance?.classId === studentData?.classId?._id) {
                attendanceData.totalClass++;

                const studentAttendance = attendance?.studentAttendance.find(
                    (entry) => entry.student?._id === studentData?._id
                );

                if (studentAttendance) {
                    if (studentAttendance.status === "Present") {
                        attendanceData.present++;
                    } else if (studentAttendance.status === "Absent") {
                        attendanceData.absent++;
                    }
                }
            }
        });

        return attendanceData;
    }

    // Calculate attendance data based on filtered students and attendance records
    const attendanceData = getAttendanceData(studentDetails, allAttendance);

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-[#51DFC3] py-6 px-4 rounded-[6px] flex-1 flex gap-4">
                        <div className="w-1/3">
                            <img src={studentDetails?.userId.photo}
                                alt=""
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover" />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex gap-2 items-center justify-between">
                                <h1 className="text-xl font-semibold">{studentDetails?.userId.firstName} {studentDetails?.userId.lastName}</h1>
                                {
                                    (user?.userId.role === 'Admin' || user?.userId.role === 'Teacher' || user?._id === studentDetails?._id) &&
                                    <FormModal
                                        table='student'
                                        type='update'
                                        Icon={FaRegEdit}
                                        data={studentDetails}
                                        allData={{ studentsId, rollNumber }}
                                    />
                                }
                            </div>
                            <p className="font-medium text-sm">{studentDetails?.userId.remarks}</p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <img src="/blood.png" alt="" width={14} height={14} />
                                    <span>{studentDetails?.userId.bloodType}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <img src="/date.png" alt="" width={14} height={14} />
                                    <span>{formatDate(studentDetails?.userId.dateOfBirth)}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <img src="/mail.png" alt="" width={14} height={14} />
                                    <span>{studentDetails?.userId.email}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <img src="/phone.png" alt="" width={14} height={14} />
                                    <span>{studentDetails?.userId.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SMALL CARDS */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/* CARD */}
                        <div className="bg-white dark:bg-slate-900 min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl dark:text-gray-200 font-semibold">{((attendanceData.present * 100) / attendanceData.totalClass).toFixed(2)}%</h1>
                                <span className="text-sm text-gray-400">Attendance</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl dark:text-gray-200 font-semibold">{studentDetails?.rollNumber}</h1>
                                <span className="text-sm text-gray-400">Roll Number</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl dark:text-gray-200 font-semibold">{studentDetails?.subjects.length}</h1>
                                <span className="text-sm text-gray-400">Subjects</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl dark:text-gray-200 font-semibold">{studentDetails?.classId.className}</h1>
                                <span className="text-sm text-gray-400">Class</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 h-[1000px] bg-white rounded-[6px] p-4 pb-6 dark:bg-slate-900">
                    <h1 className="text-xl dark:text-gray-200 font-semibold">Student&apos;s Schedule</h1>
                    <BigCalendar events={events} className='dark:bg-slate-900' />
                </div>
            </div >
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-[6px] dark:bg-slate-900">
                    <h1 className="text-xl font-semibold dark:text-gray-200">Shortcuts</h1>
                    <div className="mt-4 text-center flex gap-4 flex-wrap text-xs text-gray-700">
                        <Link className="flex-1 min-w-fit p-3 rounded-[6px] bg-sky-200" to={(user?.userId.role === 'Admin' || user?.userId.role === 'Teacher') ? '/list/attendance' : '/attendance/data'}>Student&apos;s Attendance</Link>
                        <Link className="flex-1 min-w-fit p-3 rounded-[6px] bg-orange-200" to={'/list/exams'}>Student&apos;s Exams</Link>
                        <Link className="flex-1 min-w-fit p-3 rounded-[6px] bg-purple-200" to={'/list/assignments'}>Student&apos;s Assignments</Link>
                        <Link className="flex-1 min-w-fit p-3 rounded-[6px] bg-purple-200" to={'/list/results'}>Student&apos;s Results</Link>
                    </div>
                </div>
                {/* <Performance /> */}
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
}

export default StudentDetailsPage;