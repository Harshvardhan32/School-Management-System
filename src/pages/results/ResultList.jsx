import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import FormModal from "../../components/FormModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteResult, getAllResults } from "../../services/operations/resultAPI";
import { GrAdd } from "react-icons/gr";
import { LuListFilter } from "react-icons/lu";

const ResultList = () => {
    const { token } = useSelector((state) => state?.auth);
    const { role } = useSelector((state) => state?.profile?.user?.userId);
    const [currentPage, setCurrentPage] = useState(1);
    const [rollNumber, setRollNumber] = useState({ start: '', end: '' });
    const [overallPercentage, setOverallPercentage] = useState({ start: '', end: '' });
    const [showFilter, setShowFilter] = useState(false);
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { allResults } = useSelector((state) => state?.result);

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

    // Filter logic
    const filteredResults = allResults?.filter((result) => {
        const rollStart = parseInt(rollNumber.start) || 0;
        const rollEnd = parseInt(rollNumber.end) || Number.MAX_VALUE;
        const percentStart = parseFloat(overallPercentage.start) || 0;
        const percentEnd = parseFloat(overallPercentage.end) || Number.MAX_VALUE;

        const roll = result.student.rollNumber;
        const percent = result.overallPercentage;

        return roll >= rollStart && roll <= rollEnd && percent >= percentStart && percent <= percentEnd;
    });

    const totalPages = Math.ceil(filteredResults?.length / itemsPerPage);

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
            className: 'hidden md:table-cell',
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
                        <FormModal
                            table="result"
                            type="update"
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table="result"
                            type="delete"
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
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Results</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch />
                    <div className="relative flex items-center gap-4 self-end">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full"
                        >
                            <LuListFilter fontSize={18} color="#4b5563" />
                        </button>
                        {showFilter && (
                            <div className="absolute max-w-[300px] top-10 right-0 border-[1.5px] border-gray-300 shadow-lg bg-white dark:bg-slate-900 p-4 rounded-md z-20 flex flex-col gap-2">
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
                                    className="mt-2 px-4 py-2 bg-[#51DFC3] rounded-md"
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
                <Table columns={columns} data={filteredResults} />
            </div>
            {/* PAGINATION */}
            <div>
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default ResultList;