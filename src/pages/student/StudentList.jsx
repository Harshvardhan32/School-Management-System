import { IoEyeOutline } from "react-icons/io5";
import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import TableSearch from "../../components/common/TableSearch";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { BiSortDown } from "react-icons/bi";
import FormModal from "../../components/FormModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllStudents } from "../../services/operations/studentAPI";
import { GrAdd } from "react-icons/gr";

const StudentList = () => {

    const column = [
        {
            header: 'Info',
            accessor: 'info',
            className: 'p-4'
        },
        {
            header: 'Student ID',
            accessor: 'studentId',
            className: 'hidden md:table-cell p-4'
        },
        {
            header: 'Class',
            accessor: 'class',
            className: 'hidden md:table-cell p-4'
        },
        {
            header: 'Phone',
            accessor: 'phone',
            className: 'hidden lg:table-cell p-4'
        },
        {
            header: 'Address',
            accessor: 'address',
            className: 'hidden lg:table-cell p-4'
        },
        {
            header: 'Actions',
            accessor: 'action',
            className: 'p-4'
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
                        <p className="text-xs text-gray-500">{data?.userId.email}</p>
                    </div>
                </td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data.studentId}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data?.classId.className}</td>
                <td className="hidden lg:table-cell p-4 dark:text-gray-200">{data?.userId.phone}</td>
                <td className="hidden lg:table-cell p-4 dark:text-gray-200">{data?.userId.address}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <Link to={`/list/students/${data._id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-100">
                                <IoEyeOutline fontSize={18} />
                            </button>
                        </Link>
                        {role === 'Admin' &&
                            <FormModal table='student' type='delete' Icon={RiDeleteBin6Line} data={data} />
                        }
                    </div>
                </td>
            </tr>
        )
    }

    const [currentPage, setCurrentPage] = useState(1);
    const { role } = useSelector(state => state?.profile?.user?.userId);
    const { token } = useSelector(state => state?.auth);
    const dispatch = useDispatch();
    const { paginatedStudents, totalPages } = useSelector(state => state?.student);

    useEffect(() => {
        dispatch(getAllStudents(token, currentPage, 10, false));
        dispatch(getAllStudents(token, undefined, undefined, true));
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const { allStudents } = useSelector(state => state?.student);
    const studentsId = allStudents?.map((student) => student?.studentId) || [];

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Students</h1>
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
                            <FormModal table='student' type='create' Icon={GrAdd} allData={studentsId} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={paginatedStudents} />
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

export default StudentList;