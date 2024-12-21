import { useDispatch, useSelector } from "react-redux";
import TableSearch from "../../components/common/TableSearch";
import { getAllStudents } from "../../services/operations/studentAPI";
import { getAllAttendance } from "../../services/operations/attendanceAPI";
import { useEffect } from "react";

const AttendanceData = () => {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state?.profile);
    const { role } = user?.userId;
    const { token } = useSelector((state) => state?.auth);

    useEffect(() => {
        dispatch(getAllStudents(token));
        dispatch(getAllAttendance(token));
    }, [token, dispatch]);

    const { allStudents } = useSelector((state) => state?.student);
    const { allAttendance } = useSelector((state) => state?.attendance);

    const studentsData = role === 'Parent'
        ? allStudents?.filter((student) => user?.students.some((userStudent) => userStudent._id === student._id)
        )
        : role === 'Student' && allStudents?.filter((student) => student._id === user._id);

    function getAttendanceData(allStudents, allAttendance) {
        const attendanceData = [];

        allStudents?.forEach((student) => {
            const studentName = `${student.userId.firstName} ${student.userId.lastName}`;
            const classId = student.classId._id;
            let totalClass = 0;
            let present = 0;
            let absent = 0;

            allAttendance?.forEach((attendance) => {
                if (attendance.classId === classId) {
                    totalClass++;
                    const studentAttendance = attendance.studentAttendance.find(
                        (entry) => entry.student?._id == student?._id
                    );
                    if (studentAttendance) {
                        if (studentAttendance.status === 'Present') {
                            present++;
                        } else if (studentAttendance.status === 'Absent') {
                            absent++;
                        }
                    }
                }
            });

            attendanceData.push({
                studentName,
                rollNumber: student.rollNumber,
                class: student.classId.className,
                totalClass,
                present,
                absent,
            });
        });

        return attendanceData;
    }

    // Example usage:
    const attendanceData = getAttendanceData(studentsData, allAttendance);

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h1 className="text-lg font-semibold dark:text-gray-200">Attendance Data</h1>

            <table className="mt-8 w-full border-collapse border border-gray-300">
                <thead className="dark:text-gray-200">
                    <tr className="text-center">
                        <th className="p-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Student Name</th>
                        <th className="p-3 border-2 border-gray-300 hidden md:table-cell bg-gray-200 dark:bg-gray-700">Roll Number</th>
                        <th className="p-3 border-2 border-gray-300 hidden md:table-cell bg-gray-200 dark:bg-gray-700">Class</th>
                        <th className="p-3 border-2 border-gray-300 hidden sm:table-cell bg-gray-200 dark:bg-gray-700">Total Class</th>
                        <th className="p-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Present</th>
                        <th className="p-3 border-2 border-gray-300 bg-gray-200 dark:bg-gray-700">Absent</th>
                    </tr>
                </thead>
                <tbody className="dark:text-gray-200">
                    {
                        attendanceData?.map((attendance, i) => (
                            <tr className="text-center" key={i}>
                                <td className="p-3 border-2 border-gray-300">{attendance.studentName}</td>
                                <td className="p-3 hidden md:table-cell border-2 border-gray-300">{attendance.rollNumber}</td>
                                <td className="p-3 hidden md:table-cell border-2 border-gray-300">{attendance.class}</td>
                                <td className="p-3 hidden sm:table-cell border-2 border-gray-300">{attendance.totalClass}</td>
                                <td className="p-3 border-2 border-gray-300">{attendance.present} - {(attendance.present * 100) / attendance.totalClass}%</td>
                                <td className="p-3 border-2 border-gray-300">{attendance.absent} - {(attendance.absent * 100) / attendance.totalClass}%</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default AttendanceData;