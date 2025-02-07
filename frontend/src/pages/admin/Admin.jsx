import { useEffect } from "react";
import UserCard from "../../components/UserCard";
import CountChart from "../../components/CountChart";
import { useDispatch, useSelector } from "react-redux";
import EventCalendar from "../../components/EventCalender";
import Announcements from "../../components/Announcements";
import AttendanceChart from "../../components/AttendanceChart";
import { getAllParents } from "../../services/operations/parentAPI";
import { getAllStudents } from "../../services/operations/studentAPI";
import { getAllTeachers } from "../../services/operations/teacherAPI";
import { getAllAttendance } from "../../services/operations/attendanceAPI";

const Admin = () => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    // Fetching students, teachers, parents, and attendance data
    useEffect(() => {
        dispatch(getAllStudents(token));
        dispatch(getAllTeachers(token));
        dispatch(getAllParents(token));
        dispatch(getAllAttendance(token));
    }, [token]);

    const { allStudents } = useSelector(state => state?.student);
    const { allTeachers } = useSelector(state => state?.teacher);
    const { allParents } = useSelector(state => state?.parent);
    const { allAttendance } = useSelector(state => state?.attendance);

    let noOfBoys = 0;
    let noOfGirls = 0;
    let others = 0;

    // Calculate number of boys, girls, and others based on student gender
    allStudents?.map((student) => {
        const sex = student?.userId?.sex;
        sex === 'male' ? noOfBoys += 1 : sex === 'female' ? noOfGirls += 1 : others += 1;
    });

    // Calculate the school year
    const year = allStudents[0]?.updatedAt.split('-')[0];
    const lastTwoDigits = parseInt(year?.slice(-2));
    const modifiedLastTwo = lastTwoDigits + 1;
    const date = year ? year + '/' + modifiedLastTwo : '';

    // Function to transform attendance data into a format suitable for the chart
    const transformAttendanceData = () => {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const attendanceByDay = days.map(day => ({
            name: day,
            Present: 0,
            Absent: 0
        }));

        allAttendance?.forEach(attendance => {
            const dayIndex = new Date(attendance.date).getDay();
            const dayName = days[dayIndex];

            const dayData = attendanceByDay.find(day => day.name === dayName);

            if (dayData) {
                attendance.studentAttendance.forEach(student => {
                    if (student.status === "Present") {
                        dayData.Present += 1;
                    } else if (student.status === "Absent") {
                        dayData.Absent += 1;
                    }
                });
            }
        });

        return attendanceByDay;
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row mx-4">
            {/* LEFT SECTION */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                {/* USER CARDS */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type={'Students'} number={allStudents?.length || 0} href={'/list/students'} date={date} />
                    <UserCard type={'Teachers'} number={allTeachers?.length || 0} href={'/list/teachers'} date={date} />
                    <UserCard type={'Parents'} number={allParents?.length || 0} href={'/list/parents'} date={date} />
                </div>

                {/* MIDDLE CHARTS */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNT CHART */}
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <CountChart total={allStudents?.length || 0} boys={noOfBoys} girls={noOfGirls} others={others} />
                    </div>
                    {/* ATTENDANCE CHART */}
                    <div className="w-full lg:w-2/3 h-[450px]">
                        <AttendanceChart data={transformAttendanceData() || []} />
                    </div>
                </div>

                {/* BOTTOM CHART */}
                {/* <div className="w-full h-[550px]">
                    <FinanceChart />
                </div> */}
            </div>
            
            {/* RIGHT SECTION */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
}

export default Admin;