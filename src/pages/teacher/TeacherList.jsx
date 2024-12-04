import { Link } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import TableSearch from "../../components/common/TableSearch";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrAdd } from "react-icons/gr";
import { BiSortDown } from "react-icons/bi";
import FormModal from "../../components/FormModal";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTeachers } from "../../services/operations/teacherAPI";

const TeacherList = () => {

    const column = [
        {
            header: 'Info',
            accessor: 'info'
        },
        {
            header: 'Teacher ID',
            accessor: 'teacherId',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Subjects',
            accessor: 'subjects',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Classes',
            accessor: 'classes',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Phone',
            accessor: 'phone',
            className: 'hidden lg:table-cell'
        },
        {
            header: 'Address',
            accessor: 'address',
            className: 'hidden lg:table-cell'
        },
        {
            header: 'Actions',
            accessor: 'action',
        },
    ]

    const renderRow = (data) => {
        return (
            <tr key={data?._id} className="border-b border-gray-200 dark:even:bg-gray-900 dark:hover:bg-slate-950 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex items-center gap-4 p-4">
                    <div>
                        <img src={data?.userId.photo || '/noAvatar.png'} alt="" className="w-10 h-10 md:hidden xl:block rounded-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-semibold dark:text-gray-200">{data?.userId.firstName} {data?.userId.lastName}</h3>
                        <p className="text-xs text-gray-500">{data?.userId.email}</p>
                    </div>
                </td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data?.teacherId}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data?.subjects.length > 0 ? data?.subjects.map(subject => subject.subjectName).join(', ') : '_'}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{data?.classes.length > 0 ? data?.classes.map(item => item?.className).join(', ') : '_'}</td>
                <td className="hidden lg:table-cell p-4 dark:text-gray-200">{data?.userId.phone}</td>
                <td className="hidden lg:table-cell p-4 dark:text-gray-200">{data?.userId.address}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <Link to={`/list/teachers/${data?._id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-100">
                                <IoEyeOutline fontSize={18} />
                            </button>
                        </Link>
                        {role === 'Admin' &&
                            <>
                                <FormModal table='teacher' type='delete' Icon={RiDeleteBin6Line} data={data} />
                            </>
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
    const { paginatedTeachers, totalPages } = useSelector(state => state?.teacher);

    useEffect(() => {
        dispatch(getAllTeachers(token, currentPage, 10, false));
        dispatch(getAllTeachers(token, undefined, undefined, true));
    }, [currentPage, token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const { allTeachers } = useSelector(state => state?.teacher);
    const { loading } = useSelector(state => state?.teacher);
    const teachersId = allTeachers?.map((teacher) => teacher?.teacherId) || [];

    return (
        <>
            {
                loading ?
                    <>
                        <p>Loading...</p>
                    </>
                    : <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
                        {/* TOP */}
                        <div className="flex items-center justify-between gap-4">
                            <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Teachers</h1>
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
                                        <FormModal table='teacher' type={'create'} Icon={GrAdd} allData={teachersId} />
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            (!loading && paginatedTeachers.length > 0)
                                ? <>
                                    {/* LIST */}
                                    <div>
                                        <Table column={column} renderRow={renderRow} data={paginatedTeachers} />
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
                                : <p className="text-center dark:text-gray-200 text-2xl font-medium py-5">Teachers not found!</p>
                        }
                    </div>
            }
        </>
    );

}

export default TeacherList;