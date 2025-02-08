import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import Table from "../../components/common/Table";
import { RiDeleteBin6Line } from "react-icons/ri";
import FormModal from "../../components/FormModal";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";
import { deleteTeacher, getAllTeachers } from "../../services/operations/teacherAPI";

const TeacherList = () => {

    const { role } = useSelector(state => state?.profile?.user?.userId);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { allTeachers } = useSelector(state => state?.teacher);
    const { loading } = useSelector(state => state?.teacher);
    const teachersId = allTeachers?.map((teacher) => teacher?.teacherId) || [];

    // Fetching all teachers
    useEffect(() => {
        dispatch(getAllTeachers(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Filtering teachers based on the search query
    const filteredTeachers = allTeachers?.filter((teacher) => {
        const matchesTeacherSearch = (teacher?.userId.firstName + ' ' + teacher?.userId.lastName).toLowerCase().includes(searchQuery.toLowerCase().trim());

        const matchesEmailSearch = teacher?.userId.email?.toLowerCase().includes(searchQuery.toLowerCase().trim());

        const matchesTeacherIdSearch = teacher?.teacherId?.toLowerCase().includes(searchQuery.toLowerCase().trim());

        const matchesSubjectSearch = teacher?.subjects?.some((subject) =>
            subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase().trim()));

        const matchesClassSearch = teacher?.classes?.some((classId) =>
            classId.className.toLowerCase().includes(searchQuery.toLowerCase().trim()));

        const matchesPhoneSearch = teacher?.userId.phone.toString().includes(searchQuery.trim());

        const matchesAddressSearch = teacher?.userId.address.toLowerCase().includes(searchQuery.toLowerCase().trim());

        return (matchesTeacherSearch || matchesEmailSearch || matchesTeacherIdSearch || matchesSubjectSearch || matchesClassSearch || matchesPhoneSearch || matchesAddressSearch);
    });

    // Paginating the filtered teachers
    const totalPages = Math.ceil(filteredTeachers?.length / itemsPerPage);
    const paginatedTeachers = filteredTeachers?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Defining table columns with headers and accessor functions
    const columns = [
        {
            Header: 'Info',
            accessor: (row) => <div className="flex items-center gap-4">
                <div>
                    <img src={row?.userId.photo || '/noAvatar.png'} alt="" tabIndex={0} className="w-10 h-10 md:hidden xl:block rounded-full object-cover focus:border-2 focus:border-gray-400 dark:focus:border-gray-700" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-semibold dark:text-gray-200 capitalize">{row?.userId.firstName} {row?.userId.lastName}</h3>
                    <p className="text-xs text-gray-500">{row?.userId.email}</p>
                </div>
            </div>,
            className: 'p-4',
            isSortable: false,
        },
        {
            Header: 'Teacher ID',
            accessor: 'teacherId',
            className: 'hidden md:table-cell p-4',
            isSortable: true,
        },
        {
            Header: 'Subjects',
            accessor: (row) => row?.subjects.length > 0 ? row?.subjects.map(subject => subject.subjectName).join(', ') : '_',
            className: 'hidden md:table-cell p-4 capitalize',
            isSortable: true,
        },
        {
            Header: 'Classes',
            accessor: (row) => row?.classes.length > 0 ? row?.classes.map(item => item?.className).join(', ') : '_',
            className: 'hidden md:table-cell p-4',
            isSortable: true,
        },
        {
            Header: 'Phone',
            accessor: 'userId.phone',
            className: 'hidden lg:table-cell p-4',
            isSortable: true,
        },
        {
            Header: 'Address',
            accessor: 'userId.address',
            className: 'hidden lg:table-cell p-4 capitalize',
            isSortable: false,
        },
        {
            Header: 'Actions',
            accessor: 'action',
            className: 'table-cell p-4',
            isSortable: false,
            Cell: ({ row }) => {
                const data = row?.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link to={`/list/teacher/${data?._id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#51DFC3]">
                                <IoEyeOutline fontSize={18} className="text-gray-600" />
                            </button>
                        </Link>
                        {role === 'Admin' &&
                            <>
                                <FormModal
                                    table='teacher'
                                    type='delete'
                                    Icon={RiDeleteBin6Line}
                                    data={data}
                                    deleteFunction={deleteTeacher}
                                />
                            </>
                        }
                    </div>
                );
            },
        },
    ]

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* Header Section with Search and Create */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Teachers</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <div className="flex items-center gap-4 self-end">
                        {role === 'Admin' &&
                            <FormModal table='teacher' type={'create'} Icon={GrAdd} allData={teachersId} />
                        }
                    </div>
                </div>
            </div>
            {/* Teachers List Table */}
            <div>
                <Table columns={columns} data={paginatedTeachers} loading={loading} />
            </div>
            {/* Pagination */}
            {
                !loading &&
                <div>
                    {
                        paginatedTeachers?.length > 0 &&
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    }
                </div>
            }
        </div >
    )
}

export default TeacherList;