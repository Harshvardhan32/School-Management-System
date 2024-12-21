import Select from 'react-select';
import toast from 'react-hot-toast';
import Table from "../../components/common/Table";
import customStyles from '../../utils/CustomStyles';
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../utils/ThemeContext";
import { extractDateReverse } from '../../utils/extractDate';
import TableSearch from "../../components/common/TableSearch";
import { useContext, useEffect, useMemo, useState } from "react";
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllStudents } from "../../services/operations/studentAPI";
import { createAttendance, getAllAttendance, updateAttendance } from "../../services/operations/attendanceAPI";

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

    // Filter attendance based on selected date and class
    const dateBasedAttendance = useMemo(() => {
        if (selectedDate && selectedClass) {
            return allAttendance?.filter(
                (attendance) =>
                    extractDateReverse(attendance.date) === selectedDate &&
                    String(attendance.classId) === String(selectedClass.value)
            ) || [];
        }
        return [];
    }, [allAttendance, selectedDate, selectedClass]);

    // Prepare attendance data
    const attendanceData = useMemo(() => {
        if (!selectedClass) return [];
        let allData = [];

        if (selectedDate) {
            if (dateBasedAttendance.length > 0) {
                allData = dateBasedAttendance[0]?.studentAttendance.map((attendance) => ({
                    type: 'update',
                    id: dateBasedAttendance[0]._id,
                    studentId: attendance.student._id,
                    studentName: `${attendance.student.userId.firstName} ${attendance.student.userId.lastName}`,
                    rollNumber: attendance.student.rollNumber,
                    classId: dateBasedAttendance[0].classId,
                    className: dateBasedAttendance[0].classId.className,
                    status: attendance.status,
                    date: dateBasedAttendance[0].date,
                }));
            }
        } else {
            allData = allStudents
                ?.filter((student) => student.classId._id === selectedClass.value)
                .map((student) => ({
                    type: 'create',
                    studentId: student?._id,
                    studentName: `${student?.userId.firstName} ${student?.userId.lastName}`,
                    rollNumber: student?.rollNumber,
                    classId: student?.classId._id,
                    className: student?.classId.className,
                    status: '',
                    date: new Date().toLocaleDateString('en-CA'),
                }));
        }

        return allData?.sort((a, b) => a.rollNumber - b.rollNumber);
    }, [selectedClass, selectedDate, dateBasedAttendance, allStudents]);

    // Filtered data based on search query
    const searchedData = useMemo(() => {
        const normalizedSearchQuery = searchQuery.trim().toLowerCase();
        return attendanceData?.filter((data) => {
            const matchedStudentSearch = data?.studentName?.toLowerCase().includes(normalizedSearchQuery);
            const matchedRollNumberSearch = String(data?.rollNumber).includes(searchQuery.trim());
            const matchedClassSearch = data?.className?.toLowerCase().includes(normalizedSearchQuery);
            return matchedStudentSearch || matchedRollNumberSearch || matchedClassSearch;
        });
    }, [searchQuery, attendanceData]);

    // Update studentsData only if it changes
    useEffect(() => {
        if (JSON.stringify(studentsData) !== JSON.stringify(searchedData)) {
            setStudentsData(searchedData);
        }
    }, [searchedData]);

    // Class dropdown options
    const classOptions = useMemo(() => {
        let allClass = [...allClasses];
        if (role !== 'Admin') {
            allClass = user?.classes;
        }
        return allClass?.sort((a, b) => (a.className < b.className ? -1 : 1))
            .map((classItem) => ({
                label: classItem?.className,
                value: classItem?._id,
            }));
    }, [allClasses, user?.classes]);

    // Memoized status change handler
    const handleStatusChange = (studentId, newStatus) => {
        setStudentsData((prevData) =>
            prevData.map((student) =>
                student.studentId === studentId
                    ? { ...student, status: newStatus }
                    : student
            )
        );
    }

    const submitHandler = () => {
        const unmarkedStudents = studentsData.filter((student) => student.status === '');
        if (unmarkedStudents.length > 0) {
            toast.error('Please mark all students Present or Absent!');
            return;
        }

        const data = {
            date: selectedDate || new Date().toLocaleDateString('en-CA'),
            classId: selectedClass.value,
            studentAttendance: studentsData.map((studentData) => ({
                student: studentData.studentId,
                status: studentData.status,
            }))
        };

        if (studentsData[0]?.type === 'create') {
            dispatch(createAttendance(data, token));
        } else {
            data.id = studentsData[0].id;
            dispatch(updateAttendance(data, token));
        }
        console.log("Data: ", data);
        console.log("studentsData: ", studentsData);
    }

    // Columns configuration
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
    ]

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
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

            <div>
                <Table columns={columns} data={studentsData} />
            </div>

            <div className="flex justify-end pt-5">
                {studentsData?.length > 0 && (
                    <button
                        onClick={submitHandler}
                        className="bg-[#51DFC3] text-gray-800 font-semibold py-2 px-4 rounded-[6px]"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
}

export default AttendanceList;