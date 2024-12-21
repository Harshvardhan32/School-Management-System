import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteLesson, getAllLessons } from "../../services/operations/lessonAPI";
import { GrAdd } from "react-icons/gr";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";

const LessonList = () => {

    const { role } = useSelector((state) => state?.profile?.user?.userId);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);
    const { allLessons } = useSelector((state) => state?.lesson);

    // Fetch lessons
    useEffect(() => {
        dispatch(getAllLessons(token));
    }, [token, dispatch]);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Filter logic
    const filteredLessons = allLessons?.filter((lesson) => {
        const matchesTitleSearch = lesson?.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesDescriptionSearch = lesson?.description.toLowerCase().includes(searchQuery.toLowerCase().trim());

        return (matchesTitleSearch || matchesDescriptionSearch);
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredLessons?.length / itemsPerPage);
    const paginatedLessons = filteredLessons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: "Lesson Name",
            accessor: "title",
            className: 'font-medium',
            isSortable: true,
        },
        {
            Header: "Description",
            accessor: (row) =>
                row?.description.length > 20
                    ? `${row?.description.slice(0, 50)}...`
                    : row?.description,
            className: "hidden sm:table-cell",
            isSortable: false,
        },
        {
            Header: "Actions",
            accessor: "action",
            className: `${!(role === 'Admin' || role === 'Teacher') && "hidden"}`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table="lesson"
                            type="update"
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table="lesson"
                            type="delete"
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteLesson}
                        />
                    </div >
                );
            },
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">
                    All Lessons
                </h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <div className="flex items-center gap-4 self-end relative">
                        {(role === "Admin" || role === "Teacher") && (
                            <FormModal table="lesson" type="create" Icon={GrAdd} />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table columns={columns} data={paginatedLessons || []} />
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
};

export default LessonList;