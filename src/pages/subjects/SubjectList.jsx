import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import { RiDeleteBin6Line } from "react-icons/ri";
import TableSearch from "../../components/common/TableSearch";
import { BiSortDown } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import FormModal from "../../components/FormModal";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubjects } from "../../services/operations/subjectAPI";

const SubjectList = () => {

    const column = [
        {
            header: 'Subject Name',
            accessor: 'subjectName'
        },
        {
            header: 'Class',
            accessor: 'classId',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Teachers',
            accessor: 'teachers',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Actions',
            accessor: 'action',
        },
    ]

    const renderRow = (data) => {
        return (
            <tr key={data._id} className="border-b border-gray-200 dark:even:bg-gray-900 dark:hover:bg-slate-950 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex flex-col p-4 font-semibold dark:text-gray-200">{data?.subjectName}</td>
                <td className="hidden sm:table-cell p-4 dark:text-gray-200">{data?.classId.length > 0 ? 'ClassID' : '_'}</td>
                <td className="hidden sm:table-cell p-4 dark:text-gray-200">{data?.teachers.length > 0 ? data?.teachers.join(', ') : '_'}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        {role === 'Admin' && (
                            <>
                                <FormModal table='subject' type='update' Icon={FaRegEdit} data={data} />
                                <FormModal table='subject' type='delete' Icon={RiDeleteBin6Line} data={data} />
                            </>
                        )}
                    </div>
                </td>
            </tr>
        )
    }

    const [currentPage, setCurrentPage] = useState(1);
    const { role } = useSelector(state => state?.profile?.user?.userId);
    const { token } = useSelector(state => state?.auth);
    const dispatch = useDispatch();
    const { paginatedSubjects, totalPages } = useSelector(state => state?.subject);

    useEffect(() => {
        dispatch(getAllSubjects(token, currentPage, 10, false));
    }, [currentPage, token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Subjects</h1>
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
                            <FormModal table='subject' type='create' Icon={AiOutlinePlus} data={{ id: 1 }} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={paginatedSubjects} />
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

export default SubjectList;