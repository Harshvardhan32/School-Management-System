import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import { FaRegEdit } from "react-icons/fa";
import FormModal from "../../components/FormModal";
import { BiSortDown } from "react-icons/bi";
import { GrAdd } from "react-icons/gr";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExam, getAllExams } from "../../services/operations/examAPI";
import extractDateTime from "../../utils/extractDateTime";

const ExamList = () => {

    const { role } = useSelector(state => state?.profile?.user?.userId);

    const column = [
        {
            header: 'Exam Name',
            accessor: 'examName'
        },
        {
            header: 'Class',
            accessor: 'class',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Start Date',
            accessor: 'startDate',
            className: 'hidden md:table-cell'
        },
        {
            header: 'End Date',
            accessor: 'endDate',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Actions',
            accessor: 'action',
            className: `${role !== 'Admin' && 'hidden'}`
        },
    ]

    const renderRow = (data) => {
        return (
            <tr key={data?._id} className="border-b border-gray-200 dark:even:bg-gray-900 dark:hover:bg-slate-950 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex flex-col p-4 font-semibold dark:text-gray-200">{data?.examName}</td>
                <td className="hidden sm:table-cell p-4 dark:text-gray-200">{data.classes.map((item) => item.className).join(', ')}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{extractDateTime(data?.startDate)}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{extractDateTime(data?.endDate)}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        {role === 'Admin' && (
                            <>
                                <FormModal table='exam' type='update' Icon={FaRegEdit} data={data} />
                                <FormModal table='exam' type='delete' Icon={RiDeleteBin6Line} data={data} deleteFunction={deleteExam} />
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    }

    const [currentPage, setCurrentPage] = useState(1);
    const { token } = useSelector(state => state?.auth);
    const dispatch = useDispatch();
    const { paginatedExams, totalPages } = useSelector(state => state?.exam);

    useEffect(() => {
        dispatch(getAllExams(token, currentPage, 10, false));
    }, [currentPage, token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Exams</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full">
                            <img src="/filter.png" alt=""
                                className="w-[14px] h-[14px]"
                            />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full">
                            <BiSortDown fontSize={18} />
                        </button>
                        {role === 'Admin' &&
                            <FormModal table='exam' type='create' Icon={GrAdd} />
                        }
                    </div>
                </div>
            </div>
            {
                paginatedExams?.length > 0
                    ? <>
                        {/* LIST */}
                        <div>
                            <Table column={column} role={role} renderRow={renderRow} data={paginatedExams} />
                        </div>
                        {/* PAGINATION */}
                        <div>
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                    : <p className="text-center dark:text-gray-200 text-2xl font-medium py-5">Exams not found!</p>
            }
        </div >
    );
}

export default ExamList;