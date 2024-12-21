import { GrAdd } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { LuListFilter } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deleteResult, getAllResults } from "../../services/operations/resultAPI";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

const ResultList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);
    const { user } = useSelector((state) => state?.profile);
    const { role } = user?.userId;
    const { allResults } = useSelector((state) => state?.result);
    const [rollNumber, setRollNumber] = useState({ start: '', end: '' });
    const [overallPercentage, setOverallPercentage] = useState({ start: '', end: '' });
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        dispatch(getAllResults(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const clearFilter = () => {
        setRollNumber({ start: '', end: '' });
        setOverallPercentage({ start: '', end: '' });
        setShowFilter(false);
    };

    const classId = role === 'Teacher'
        ? user?.classes.map((classItem) => classItem._id)
        : role === 'Parent' && user?.students.map((student) => student.classId._id);

    const roleBasedResult = role === 'Teacher'
        ? allResults?.filter((result) =>
            classId.some((userClass) => userClass === result.classId._id)
        )
        : role === 'Student'
            ? allResults?.filter((result) => result.classId._id === user?.classId._id)
            : role === 'Parent'
                ? allResults?.filter((result) =>
                    classId.some((userClass) => userClass === result.classId._id)
                )
                : allResults || [];

    console.log('roleBasedResult: ', roleBasedResult);

    // Filter logic
    const filteredResults = roleBasedResult?.filter((result) => {
        const rollStart = parseInt(rollNumber.start) || 0;
        const rollEnd = parseInt(rollNumber.end) || Number.MAX_VALUE;
        const percentStart = parseFloat(overallPercentage.start) || 0;
        const percentEnd = parseFloat(overallPercentage.end) || Number.MAX_VALUE;

        const roll = result.student.rollNumber;
        const percent = result.overallPercentage;

        const inputBasedFilter = roll >= rollStart && roll <= rollEnd && percent >= percentStart && percent <= percentEnd;

        const matchedStudentSearch = (result?.student?.userId.firstName + ' ' + result?.student?.userId.lastName).toLowerCase().includes(searchQuery.toLowerCase().trim());

        const matchedRollNumberSearch = (`${result?.student.rollNumber}`).includes(searchQuery.trim());

        const matchedClassSearch = result?.classId.className.toLowerCase().includes(searchQuery.toLowerCase().trim());

        const matchedPercentageSearch = result?.overallPercentage.includes(searchQuery.trim());

        return (inputBasedFilter && (matchedStudentSearch || matchedRollNumberSearch || matchedClassSearch || matchedPercentageSearch));
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredResults?.length / itemsPerPage);
    const paginatedResults = filteredResults?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: 'Students',
            accessor: (row) => `${row.student.userId.firstName} ${row.student.userId.lastName}`,
            isSortable: true,
        },
        {
            Header: 'Roll Number',
            accessor: 'student.rollNumber',
            className: 'hidden sm:table-cell',
            isSortable: true,
        },
        {
            Header: 'Class',
            accessor: 'classId.className',
            className: 'hidden sm:table-cell',
            isSortable: true,
        },
        {
            Header: 'Overall Percentage',
            accessor: (row) => `${row.overallPercentage} %`,
            className: 'hidden sm:table-cell',
            isSortable: true,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            className: `${!(role === 'Admin' || role === 'Teacher') && 'hidden'}`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link to={`/list/result/${data?._id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#51DFC3]">
                                <IoEyeOutline fontSize={18} className="text-gray-600" />
                            </button>
                        </Link>
                        <FormModal
                            table="result"
                            type="update"
                            title="Update Result"
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table="result"
                            type="delete"
                            title='Delete Result'
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteResult}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="min-h-[50vh]">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {/* TOP */}
                <div className="flex items-center justify-between gap-4">
                    <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Results</h1>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                        <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        <div className="relative flex items-center gap-4 self-end">
                            <button
                                title="Filter Results"
                                onClick={() => setShowFilter(!showFilter)}
                                className="w-8 h-8 flex items-center justify-center bg-[#51DFC3] rounded-full"
                            >
                                <LuListFilter fontSize={18} color="#4b5563" />
                            </button>
                            {showFilter && (
                                <div className="absolute max-w-[300px] top-10 -right-4 border-[1.5px] border-gray-300 shadow-lg bg-white dark:bg-slate-900 p-4 rounded-md z-20 flex flex-col gap-2">
                                    <div className="flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">Roll Number</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Start"
                                                value={rollNumber.start}
                                                className="max-w-[120px] p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none no-spin"
                                                onChange={(e) => setRollNumber({ ...rollNumber, start: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                placeholder="End"
                                                value={rollNumber.end}
                                                className="max-w-[120px] p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none no-spin"
                                                onChange={(e) => setRollNumber({ ...rollNumber, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">Overall Percentage</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Start"
                                                value={overallPercentage.start}
                                                className="max-w-[120px] p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none no-spin"
                                                onChange={(e) => setOverallPercentage({ ...overallPercentage, start: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                placeholder="End"
                                                value={overallPercentage.end}
                                                className="max-w-[120px] p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none no-spin"
                                                onChange={(e) => setOverallPercentage({ ...overallPercentage, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearFilter}
                                        className="mt-2 px-4 py-2 bg-[#51DFC3] text-gray-800 font-semibold rounded-[6px]"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                            {role === 'Admin' && <FormModal table="result" type="create" Icon={GrAdd} />}
                        </div>
                    </div>
                </div>
                {/* LIST */}
                <div>
                    <Table columns={columns} data={paginatedResults} />
                </div>
                {/* PAGINATION */}
                <div>
                    {
                        paginatedResults.length > 0 &&
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

export default ResultList;