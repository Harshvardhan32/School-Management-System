import { GrAdd } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";
import { deleteSubject, getAllSubjects } from "../../services/operations/subjectAPI";

const SubjectList = () => {

    const { role } = useSelector(state => state?.profile?.user?.userId);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { allSubjects } = useSelector(state => state?.subject);

    useEffect(() => {
        dispatch(getAllSubjects(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Filter logic based on search query
    const filteredSubjects = allSubjects?.filter((data) => {
        const matchesSubjectSearch = data?.subjectName.toString().toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesClassSearch = data?.classes?.some((classItem) =>
            classItem.className.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
        const matchesTeacherSearch = data?.teachers?.some((teacher) =>
            (teacher.userId.firstName + ' ' + teacher.userId.lastName).toLowerCase().includes(searchQuery.toLowerCase().trim())
        );

        return (matchesSubjectSearch || matchesClassSearch || matchesTeacherSearch);
    });

    // Pagination logic based on filtered subjects
    const totalPages = Math.ceil(filteredSubjects?.length / itemsPerPage);
    const paginatedSubjects = filteredSubjects?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: 'Subject Name',
            accessor: 'subjectName',
            className: 'font-medium p-4 capitalize',
            isSortable: true,
        },
        {
            Header: 'Class',
            accessor: (row) => {
                if (row?.classes?.length > 0) {
                    return row.classes
                        .map((item) => item.className)
                        .sort((a, b) => a.localeCompare(b))
                        .join(', ');
                }
                return '_';
            },
            className: 'hidden sm:table-cell p-4',
            isSortable: true,
        },
        {
            Header: 'Teachers',
            accessor: (row) => row?.teachers.length > 0 ? row?.teachers.map((teacher) => teacher?.userId?.firstName + " " + teacher?.userId?.lastName).join(', ') : '_',
            className: 'hidden sm:table-cell p-4 capitalize',
            isSortable: true,
        },
        {
            Header: 'Actions',
            accessor: 'action',
            className: `${role !== 'Admin' && 'hidden'} table-cell p-4`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row?.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table='subject'
                            type='update'
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table='subject'
                            type='delete'
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteSubject}
                        />
                    </div>
                );
            },
        },
    ]

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Subjects</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <div className="flex items-center gap-4 self-end">
                        {role === 'Admin' &&
                            <FormModal table='subject' type='create' Icon={GrAdd} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table columns={columns} data={paginatedSubjects} />
            </div>
            {/* PAGINATION */}
            <div>
                {
                    paginatedSubjects?.length > 0 &&
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

export default SubjectList;