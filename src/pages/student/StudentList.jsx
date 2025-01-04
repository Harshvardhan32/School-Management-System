import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { deleteStudent, getAllStudents } from "../../services/operations/studentAPI";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";

const StudentList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { allStudents } = useSelector(state => state?.student);
    const { role } = user?.userId;
    const studentsId = allStudents?.map((student) => student?.studentId);
    const rollNumber = allStudents?.map((student) => student?.rollNumber.toString());

    useEffect(() => {
        dispatch(getAllStudents(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Role-based filtering of students
    const roleBasedStudent = role === 'Parent'
        ? allStudents.filter((student) =>
            user?.students?.some((userStudent) =>
                userStudent.studentId === student.studentId
            )
        )
        : role === 'Teacher'
            ? allStudents.filter((student) =>
                user?.classes.some((userClasses) =>
                    userClasses.className === student.classId.className
                )
            )
            : allStudents;

    // Filter logic based on search query
    const filteredStudents = roleBasedStudent?.filter((student) => {
        const matchesStudentSearch = (student?.userId.firstName + ' ' + student?.userId.lastName).toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesEmailSearch = student?.userId.email?.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesStudentIdSearch = student?.studentId?.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesClassSearch = student?.classId.className.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesPhoneSearch = student?.userId.phone.toString().includes(searchQuery.trim());
        const matchesAddressSearch = student?.userId.address.toLowerCase().includes(searchQuery.toLowerCase().trim());

        return (matchesStudentSearch || matchesEmailSearch || matchesStudentIdSearch || matchesClassSearch || matchesPhoneSearch || matchesAddressSearch);
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredStudents?.length / itemsPerPage);
    const paginatedStudents = filteredStudents?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: 'Info',
            accessor: (row) => <div className="flex items-center gap-4">
                <div>
                    <img src={row?.userId.photo || '/noAvatar.png'} alt="" className="w-10 h-10 md:hidden xl:block rounded-full object-cover" />
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
            Header: 'Student ID',
            accessor: 'studentId',
            className: 'hidden md:table-cell p-4',
            isSortable: true,
        },
        {
            Header: 'Class',
            accessor: 'classId.className',
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
            className: 'p-4 table-cell',
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Link to={`/list/student/${data._id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#51DFC3]">
                                <IoEyeOutline fontSize={18} className="text-gray-600" />
                            </button>
                        </Link>
                        {role === 'Admin' &&
                            <FormModal
                                table='student'
                                type='delete'
                                Icon={RiDeleteBin6Line}
                                data={data}
                                deleteFunction={deleteStudent}
                            />
                        }
                    </div>
                );
            },
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Students</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <div className="flex items-center gap-4 self-end">
                        {role === 'Admin' &&
                            <FormModal
                                table='student'
                                type='create'
                                Icon={GrAdd}
                                allData={{ studentsId, rollNumber }}
                            />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table columns={columns} data={paginatedStudents} />
            </div>
            {/* PAGINATION */}
            <div>
                {
                    paginatedStudents.length > 0 &&
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                }
            </div>
        </div>
    );
}

export default StudentList;