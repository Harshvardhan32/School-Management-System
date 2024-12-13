import Select from 'react-select';
import Table from "../../components/common/Table";
import customStyles from '../../utils/CustomStyles';
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../utils/ThemeContext";
import TableSearch from "../../components/common/TableSearch";
import { useContext, useEffect, useMemo, useState } from "react";
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllStudents } from "../../services/operations/studentAPI";
import { getAllAttendance } from "../../services/operations/attendanceAPI";

const AttendanceList = () => {

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state?.profile);
    const { role } = user?.userId;
    const { darkMode } = useContext(ThemeContext);
    const { token } = useSelector((state) => state?.auth);

    useEffect(() => {
        dispatch(getAllStudents(token));
        dispatch(getAllAttendance(token));
        dispatch(getAllClasses(token));
    }, [token, dispatch]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [studentsData, setStudentsData] = useState([]);
    const { allStudents } = useSelector((state) => state?.student);
    const { allAttendance } = useSelector((state) => state?.attendance);
    const { allClasses } = useSelector((state) => state?.class);

    let attendanceData = allAttendance.length > 0
        ? allAttendance.map((attendance) => ({
            student: attendance?.studentAttendance?.student,
            studentName: `${attendance.studentAttendance.student.firstName} ${attendance.studentAttendance.student.lastName}`,
            rollNumber: attendance?.studentAttendance?.rollNumber,
            classId: attendance?.studentAttendance?.classId,
            className: attendance?.studentAttendance?.classId.className,
            status: attendance?.studentAttendance?.status,
            date: attendance?.date,
        }))
        : allStudents?.map((student) => ({
            studentId: student?._id,
            studentName: `${student?.userId.firstName} ${student?.userId.lastName}`,
            rollNumber: student?.rollNumber,
            classId: student?.classId._id,
            className: student?.classId.className,
            status: '',
            date: new Date().toISOString().split('T')[0],
        }));

    useEffect(() => {
        let filteredData = [];

        if (selectedClass && !selectedDate) {
            filteredData = attendanceData.filter((student) => student.classId === selectedClass.value);
        } else if (selectedClass && selectedDate) {
            filteredData = attendanceData.filter((student) => {
                const attendanceDate = new Date(student.date).toISOString().split('T')[0];
                return student.classId === selectedClass.value && attendanceDate === selectedDate;
            });
        }

        setStudentsData(filteredData.sort((a, b) => a.rollNumber - b.rollNumber));
    }, [selectedClass, selectedDate]);

    const sortedClasses = useMemo(() => {
        let allClass = [...allClasses];
        if (role !== 'Admin') {
            allClass = user?.classes;
        }

        return allClass.sort((a, b) => {
            if (a.className < b.className) {
                return -1;
            }
            if (a.className > b.className) {
                return 1;
            }
            return 0;
        });
    }, [allClasses, user?.classes]);

    const classOptions = sortedClasses?.map((classItem) => ({
        label: classItem?.className,
        value: classItem?._id
    }));

    const handleStatusChange = (studentId, newStatus) => {
        setStudentsData((prevData) =>
            prevData.map((student) =>
                student.studentId === studentId
                    ? { ...student, status: newStatus }
                    : student
            )
        );
    };

    const columns = [
        {
            Header: "Roll No.",
            accessor: "rollNumber",
            className: "font-medium",
            isSortable: true,
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            className: "hidden sm:table-cell",
            isSortable: true,
        },
        {
            Header: "Class",
            accessor: "className",
            className: "hidden md:table-cell",
            isSortable: true,
        },
        {
            Header: "Present",
            className: "hidden sm:table-cell",
            isSortable: false,
            Cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.original.status === 'Present'}
                    onChange={() => handleStatusChange(row.original.studentId, 'Present')}
                    className="present"
                />
            ),
        },
        {
            Header: "Absent",
            className: "hidden sm:table-cell",
            isSortable: false,
            Cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.original.status === 'Absent'}
                    onChange={() => handleStatusChange(row.original.studentId, 'Absent')}
                    className="absent"
                />
            ),
        }
    ];

    const submitHandler = () => {
        const data = {
            date: selectedDate ? selectedDate : new Date().toISOString().split('T')[0],
            studentAttendance: studentsData?.map((studentData) => {
                return {
                    student: studentData.studentId,
                    status: studentData.status
                }
            })
        };

        console.log("Submitting Attendance Data: ", data);
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Attendance</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </div>
            </div>

            <div className="max-w-[500px] flex flex-wrap items-center justify-between gap-4 py-2">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-semibold dark:text-gray-200">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        placeholder="Date of Birth"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    />
                </div>
                <div className="min-w-[150px] flex flex-col gap-2 flex-1">
                    <label className="text-sm font-semibold dark:text-gray-200">Class</label>
                    <Select
                        options={classOptions}
                        placeholder="Select Class"
                        value={selectedClass}
                        onChange={setSelectedClass}
                        getOptionLabel={(e) => e.label}
                        getOptionValue={(e) => e.value}
                        styles={customStyles(darkMode)}
                        isSearchable
                    />
                </div>
            </div>

            {/* Table */}
            <div>
                <Table columns={columns} data={studentsData} />
            </div>

            <div className="flex justify-end pt-5">
                {
                    studentsData.length > 0 && <button
                        onClick={submitHandler}
                        className="bg-[#51DFC3] text-gray-800 font-semibold py-2 px-4 rounded-[6px]"
                    >
                        Submit
                    </button>
                }
            </div>
        </div>
    );
}

export default AttendanceList;