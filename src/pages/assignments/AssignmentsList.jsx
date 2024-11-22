import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import FormModal from "../../components/FormModal";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSortDown } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAssignments } from "../../services/operations/assignmentAPI";
import extractDate from '../../utils/extractDate';

const AssignmentList = () => {

    const { role } = useSelector(state => state?.profile?.user?.userId);

    const column = [
        {
            header: 'Subject',
            accessor: 'subjectName'
        },
        {
            header: 'Class',
            accessor: 'class',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Teacher',
            accessor: 'teacher',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Assigned Date',
            accessor: 'assignDate',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Due Date',
            accessor: 'dueDate',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Actions',
            accessor: 'action',
            className: `${role !== 'Admin' && role !== 'Teacher' && 'hidden'}`
        },
    ]

    const renderRow = (data) => {
        // console.log("DATTT: ", data);
        return (
            <tr key={data?._id} className="border-b border-gray-200 dark:even:bg-gray-900 dark:hover:bg-slate-950 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex flex-col p-4 font-semibold dark:text-gray-200">{data?.subject?.subjectName}</td>
                <td className="hidden sm:table-cell p-4 dark:text-gray-200">{data?.classId?.className}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data?.teacher?.teacherId}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{extractDate(data?.assignedDate)}</td>
                <td className="hidden sm:table-cell p-4 dark:text-gray-200">{extractDate(data?.dueDate)}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        {role === 'Admin' || role === 'Teacher' && (
                            <>
                                <FormModal table='assignment' type='update' Icon={FaRegEdit} data={data} />
                                <FormModal table='assignment' type='delete' Icon={RiDeleteBin6Line} data={data} />
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
    const { paginatedAssignments, totalPages } = useSelector(state => state?.assignment);

    useEffect(() => {
        dispatch(getAllAssignments(token, currentPage, 10, false));
    }, [currentPage, token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Assignments</h1>
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
                            <FormModal table='assignment' type='create' Icon={AiOutlinePlus} data={{ id: 1 }} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={paginatedAssignments} />
            </div>
            {/* PAGINATION */}
            <div>
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default AssignmentList;