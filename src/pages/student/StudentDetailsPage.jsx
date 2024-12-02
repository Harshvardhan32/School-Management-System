import { Link, useLocation } from "react-router-dom";
import Announcements from "../../components/Announcements";
import BigCalendar from "../../components/BigCalender";
import Performance from "../../components/Performance";
import FormModal from "../../components/FormModal";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllStudents, getStudentDetails } from "../../services/operations/studentAPI";
import { formatDate } from "../../services/formatDate";

const StudentDetailsPage = () => {

    const { token } = useSelector(state => state?.auth);
    const dispatch = useDispatch();
    const { studentDetails } = useSelector(state => state?.student);
    const location = useLocation();
    const studentId = location?.pathname.split('/').at(-1);

    useEffect(() => {
        dispatch(getStudentDetails(token, studentId));
        dispatch(getAllStudents(token, undefined, undefined, true));
    }, [studentId, token, dispatch]);

    const { allStudents } = useSelector(state => state?.student);
    const studentsId = allStudents?.map((student) => student?.studentId) || [];

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-lamaGreen py-6 px-4 rounded-[6px] flex-1 flex gap-4">
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
                                <FormModal table='student' type='update' Icon={FaRegEdit} data={studentDetails} allData={studentsId} />
                            </div>
                            {/* <p className="text-sm text-gray-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, illum.</p> */}
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
                        <div className="bg-white min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl font-semibold">90%</h1>
                                <span className="text-sm text-gray-400">Attendance</span>
                            </div>
                        </div>
                        <div className="bg-white min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl font-semibold">2</h1>
                                <span className="text-sm text-gray-400">Branches</span>
                            </div>
                        </div>
                        <div className="bg-white min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl font-semibold">6</h1>
                                <span className="text-sm text-gray-400">Lessons</span>
                            </div>
                        </div>
                        <div className="bg-white min-w-[160px] p-4 rounded-[6px] flex flex-1 gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <img src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
                            <div>
                                <h1 className="text-xl font-semibold">6</h1>
                                <span className="text-sm text-gray-400">Classes</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-[6px] p-4 h-[800px]">
                    <h1>Student&apos;s Schedule</h1>
                    <BigCalendar />
                </div>
            </div >
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-[6px]">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-700">
                        <Link className="p-3 rounded-[6px] bg-sky-200" to={'/'}>Student&apos;s Lessons</Link>
                        <Link className="p-3 rounded-[6px] bg-emerald-200" to={'/'}>Student&apos;s Teachers</Link>
                        <Link className="p-3 rounded-[6px] bg-orange-200" to={'/'}>Student&apos;s Exams</Link>
                        <Link className="p-3 rounded-[6px] bg-purple-200" to={'/'}>Student&apos;s Assignments</Link>
                        <Link className="p-3 rounded-[6px] bg-purple-200" to={'/'}>Student&apos;s Results</Link>
                    </div>
                </div>
                <Performance />
                <Announcements />
            </div>
        </div>
    );
}

export default StudentDetailsPage;