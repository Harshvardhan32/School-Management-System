import { Link } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import TableSearch from "../../components/common/TableSearch";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import FormModal from "../../components/FormModal";
import { BiSortDown } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllParents } from "../../services/operations/parentAPI";

const ParentList = () => {

    const { role } = useSelector(state => state?.profile?.user?.userId);

    const column = [
        {
            header: 'Info',
            accessor: 'info'
        },
        {
            header: 'Students',
            accessor: 'students',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Phone',
            accessor: 'phone',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Address',
            accessor: 'address',
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
            <tr key={data._id} className="border-b border-gray-200 dark:even:bg-gray-900 dark:hover:bg-slate-950 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex items-center gap-4 p-4">
                    <div>
                        <img src={data?.userId.photo} alt="" className="w-10 h-10 md:hidden xl:block rounded-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-semibold dark:text-gray-200">{data?.userId.firstName} {data?.userId.lastName}</h3>
                        <p className="text-xs text-gray-500">{data?.parentId}</p>
                    </div>
                </td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data?.students.length > 0 ? data?.students.join(', ') : '_'}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data?.userId?.phone}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data?.userId?.address}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        {role === 'Admin' && (
                            <>
                                <FormModal table='parent' type='update' Icon={FaRegEdit} data={data} />
                                <FormModal table='parent' type='delete' Icon={RiDeleteBin6Line} data={data} />
                            </>
                        )}
                    </div>
                </td>
            </tr>
        )
    }

    const [currentPage, setCurrentPage] = useState(1);
    const { token } = useSelector(state => state?.auth);
    const dispatch = useDispatch();
    const { paginatedParents, totalPages } = useSelector(state => state?.parent);

    useEffect(() => {
        dispatch(getAllParents(token, currentPage, 10, false));
    }, [currentPage, token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Parents</h1>
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
                            <FormModal table='parent' type='create' Icon={AiOutlinePlus} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={paginatedParents} />
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

export default ParentList;