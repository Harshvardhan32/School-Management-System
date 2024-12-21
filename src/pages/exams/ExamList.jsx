import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import FormModal from "../../components/FormModal";
import { GrAdd } from "react-icons/gr";
import { LuListFilter } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExam, getAllExams } from "../../services/operations/examAPI";
import extractDateTime from "../../utils/extractDateTime";

const ExamList = () => {

    const { user } = useSelector((state) => state?.profile);
    const { role } = user?.userId;
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState({ start: '', end: '' });
    const [endDate, setEndDate] = useState({ start: '', end: '' });
    const [showFilter, setShowFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);
    const { allExams } = useSelector((state) => state?.exam);

    useEffect(() => {
        dispatch(getAllExams(token));
    }, [dispatch, token]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const classId = role === 'Parent' && user?.students.map((student) => {
        return student.classId._id;
    });

    const roleBasedExam = role === 'Student'
        ? allExams?.filter((exam) =>
            exam.classes.some((classItem) => user.classId?._id === classItem._id)
        )
        : role === 'Parent'
            ? allExams?.filter((exam) =>
                exam.classes.some((examClass) =>
                    classId.some((userClass) => examClass._id === userClass)
                )
            )
            : allExams || [];

    // Filter logic based on the selected date range, search query, and classes
    const filteredExams = roleBasedExam?.filter((exam) => {
        const examStartDate = new Date(exam.startDate).toISOString().split("T")[0];
        const examEndDate = new Date(exam.endDate).toISOString().split("T")[0];

        const isAfterStartDate = !startDate.start || new Date(examStartDate) >= new Date(startDate.start);
        const isBeforeStartDate = !startDate.end || new Date(examStartDate) <= new Date(startDate.end);

        const isAfterEndDate = !endDate.start || new Date(examEndDate) >= new Date(endDate.start);
        const isBeforeEndDate = !endDate.end || new Date(examEndDate) <= new Date(endDate.end);

        const matchesSearchQuery = exam.examName.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesClassSearch = exam?.classes?.some((classItem) =>
            classItem.className.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );

        return (isAfterStartDate && isBeforeStartDate && isAfterEndDate && isBeforeEndDate && (matchesSearchQuery || matchesClassSearch));
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredExams?.length / itemsPerPage);
    const paginatedExams = filteredExams?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: "Exam Name",
            accessor: "examName",
            className: 'font-medium',
            isSortable: true,
        },
        {
            Header: "Class",
            accessor: (row) => row?.classes?.map((item) => item.className).join(", "),
            className: "hidden sm:table-cell",
            isSortable: true,
        },
        {
            Header: "Start Date",
            accessor: "startDate",
            className: "hidden md:table-cell",
            isSortable: true,
            Cell: ({ value }) => extractDateTime(value)
        },
        {
            Header: "End Date",
            accessor: "endDate",
            className: "hidden md:table-cell",
            isSortable: true,
            Cell: ({ value }) => extractDateTime(value)
        },
        {
            Header: "Actions",
            accessor: "action",
            className: `${role !== "Admin" && "hidden"}`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table="exam"
                            type="update"
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table="exam"
                            type="delete"
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteExam}
                        />
                    </div >
                );
            },
        },
    ];

    return (
        <div className="min-h-[50vh]">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">
                        All Exams
                    </h1>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                        <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        <div className="relative flex items-center gap-4 self-end">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="w-8 h-8 flex items-center justify-center bg-[#51DFC3] rounded-full"
                            >
                                <LuListFilter fontSize={18} color='#4b5563' />
                            </button>
                            {showFilter && (
                                <div className="absolute top-10 -right-4 border-[1.5px] border-gray-300 shadow-lg bg-white dark:bg-slate-900 p-4 rounded-md z-20 flex flex-col gap-2">
                                    <div className="flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">Start Date</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                value={startDate.start}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setStartDate({ ...startDate, start: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                value={startDate.end}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setStartDate({ ...startDate, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">End Date</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                value={endDate.start}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setEndDate({ ...endDate, start: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                value={endDate.end}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setEndDate({ ...endDate, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setStartDate({ start: '', end: '' }); setEndDate({ start: '', end: '' }); setShowFilter(false) }}
                                        className="mt-2 px-4 py-2 bg-[#51DFC3] rounded-md"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                            {role === "Admin" && (
                                <FormModal table="exam" type="create" Icon={GrAdd} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div>
                    <Table columns={columns} data={paginatedExams} />
                </div>

                {/* Pagination */}
                <div>
                    {
                        paginatedExams?.length > 0 &&
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

export default ExamList;