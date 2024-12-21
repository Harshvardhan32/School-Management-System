import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import FormModal from "../../components/FormModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAssignment, getAllAssignments } from "../../services/operations/assignmentAPI";
import { extractDate } from '../../utils/extractDate';
import { GrAdd } from "react-icons/gr";
import { LuListFilter } from "react-icons/lu";

const AssignmentList = () => {

    const { user } = useSelector((state) => state?.profile);
    const [currentPage, setCurrentPage] = useState(1);
    const [assignedDate, setAssignedDate] = useState({ start: '', end: '' });
    const [dueDate, setDueDate] = useState({ start: '', end: '' });
    const [showFilter, setShowFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);
    const { allAssignments } = useSelector((state) => state?.assignment);
    const { role } = user.userId;

    // Fetch assignments when state or page changes
    useEffect(() => {
        dispatch(getAllAssignments(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const roleBasedAssignment = role === 'Teacher'
        ? allAssignments.filter((assignment) =>
            user?.classes?.some((userClass) =>
                userClass.className === assignment.classId.className
            )
        )
        : role === 'Student'
            ? allAssignments.filter((assignment) =>
                user?.classId.className === assignment.classId.className
            )
            : role === 'Parent'
                ? allAssignments.filter((assignment) =>
                    user?.students.some((student) =>
                        student.classId.className === assignment.classId.className
                    )
                )
                : allAssignments;

    // Filter logic
    const filteredAssignments = roleBasedAssignment?.filter((assignment) => {
        const assignmentAssignedDate = new Date(assignment.assignedDate).toISOString().split("T")[0];
        const assignmentDueDate = new Date(assignment.dueDate).toISOString().split("T")[0];

        const isAfterAssignedDate = !assignedDate.start || new Date(assignmentAssignedDate) >= new Date(assignedDate.start);
        const isBeforeAssignedDate = !assignedDate.end || new Date(assignmentAssignedDate) <= new Date(assignedDate.end);

        const isAfterDueDate = !dueDate.start || new Date(assignmentDueDate) >= new Date(dueDate.start);
        const isBeforeDueDate = !dueDate.end || new Date(assignmentDueDate) <= new Date(dueDate.end);

        const matchesSearchQuery = assignment.subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesClassSearch = assignment.classId.className.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesTeacherSearch = (assignment.teacher.userId.firstName + " " + assignment.teacher.userId.lastName).toLowerCase().includes(searchQuery.toLowerCase().trim());

        return (isAfterAssignedDate && isBeforeAssignedDate && isAfterDueDate && isBeforeDueDate && (matchesSearchQuery || matchesClassSearch || matchesTeacherSearch));
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredAssignments?.length / itemsPerPage);
    const paginatedAssignments = filteredAssignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const columns = [
        {
            Header: "Subject",
            accessor: "subject.subjectName",
            className: 'font-medium',
            isSortable: true,
        },
        {
            Header: "Class",
            accessor: "classId.className",
            className: 'hidden min-[400px]:table-cell',
            isSortable: true,
        },
        {
            Header: "Teacher",
            accessor: (row) => `${row.teacher.userId.firstName} ${row.teacher.userId.lastName}`,
            className: 'hidden md:table-cell',
            isSortable: true,
        },
        {
            Header: "Assigned Date",
            accessor: "assignedDate",
            className: 'hidden sm:table-cell',
            isSortable: true,
            Cell: ({ value }) => extractDate(value)
        },
        {
            Header: "Due Date",
            accessor: "dueDate",
            className: 'hidden sm:table-cell',
            isSortable: true,
            Cell: ({ value }) => extractDate(value),
        },
        {
            Header: "Actions",
            accessor: "actions",
            className: `${!(role === 'Admin' || role === 'Teacher') && "hidden"}`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table="assignment"
                            type="update"
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table="assignment"
                            type="delete"
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteAssignment}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="min-h-[50vh]">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Assignments</h1>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                        <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        <div className="relative flex items-center gap-4 self-end">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="w-8 h-8 flex items-center justify-center bg-[#51DFC3] rounded-full"
                            >
                                <LuListFilter fontSize={18} color="#4b5563" />
                            </button>
                            {showFilter && (
                                <div className="absolute top-10 -right-4 border-[1.5px] border-gray-300 shadow-lg bg-white dark:bg-slate-900 p-4 rounded-md z-20 flex flex-col gap-2">
                                    <div className="flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">Assigned Date</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                value={assignedDate.start}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setAssignedDate({ ...assignedDate, start: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                value={assignedDate.end}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setAssignedDate({ ...assignedDate, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">Due Date</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                value={dueDate.start}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setDueDate({ ...dueDate, start: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                value={dueDate.end}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setDueDate({ ...dueDate, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setAssignedDate({ start: '', end: '' }); setDueDate({ start: '', end: '' }); setShowFilter(false); }}
                                        className="mt-2 px-4 py-2 bg-[#51DFC3] rounded-md"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                            {(role === 'Admin' || role === 'Teacher') && <FormModal table='assignment' type='create' Icon={GrAdd} />}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div>
                    <Table columns={columns} data={paginatedAssignments || []} />
                </div>
                <div>
                    {
                        paginatedAssignments.length > 0 &&
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default AssignmentList;