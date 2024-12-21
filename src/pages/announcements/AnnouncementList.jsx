import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import FormModal from "../../components/FormModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAnnouncement, getAllAnnouncement } from "../../services/operations/announcementAPI";
import extractDateTime from "../../utils/extractDateTime";
import { GrAdd } from "react-icons/gr";
import { LuListFilter } from "react-icons/lu";

const AnnouncementList = () => {
    const { role } = useSelector((state) => state?.profile?.user?.userId);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState({ start: '', end: '' });
    const [showFilter, setShowFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);
    const { allAnnouncements } = useSelector((state) => state?.announcement);

    useEffect(() => {
        dispatch(getAllAnnouncement(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Filter logic based on the selected date range and search quer
    const filteredAnnouncements = allAnnouncements?.filter((announcement) => {
        const announcementDate = new Date(announcement.date).toISOString().split("T")[0];

        const isAfterDate = !startDate.start || new Date(announcementDate) >= new Date(startDate.start);
        const isBeforeDate = !startDate.end || new Date(announcementDate) <= new Date(startDate.end);

        const matchesSearchQuery = announcement.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

        return isAfterDate && isBeforeDate && matchesSearchQuery;
    })

    const totalPages = Math.ceil(filteredAnnouncements?.length / itemsPerPage);
    const paginatedData = filteredAnnouncements?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: "Title",
            accessor: "title",
            className: 'font-medium',
            isSortable: true,
        },
        {
            Header: "Date",
            accessor: "date",
            className: "hidden md:table-cell",
            isSortable: true,
            Cell: ({ value }) => extractDateTime(value),
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
                            table="announcement"
                            type="update"
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table="announcement"
                            type="delete"
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteAnnouncement}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="min-h-[50vh]">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {/* TOP */}
                <div className="flex items-center justify-between gap-4">
                    <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Announcements</h1>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                        <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* Pass the search props */}
                        <div className="flex items-center gap-4 self-end relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="w-8 h-8 flex items-center justify-center bg-[#51DFC3] rounded-full"
                            >
                                <LuListFilter fontSize={18} color="#4b5563" />
                            </button>
                            {showFilter && (
                                <div className="absolute top-10 right-0 border-[1.5px] border-gray-300 shadow-lg bg-white dark:bg-slate-900 p-4 rounded-md z-20 flex flex-col gap-2">
                                    <label className="font-medium text-xs dark:text-gray-200">Date</label>
                                    <div className="flex gap-2 text-xs">
                                        <input
                                            type="date"
                                            value={startDate.start}
                                            className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                            onChange={(e) => setStartDate({ ...startDate, start: e.target.value })}
                                        />
                                        <input
                                            type="date"
                                            value={startDate.end}
                                            className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                            onChange={(e) => setStartDate({ ...startDate, end: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setStartDate({ start: '', end: '' });
                                            setShowFilter(false)
                                        }}
                                        className="mt-2 px-4 py-2 bg-[#51DFC3] rounded-md"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                            {(role === 'Admin' || role === 'Teacher') && (
                                <FormModal table="announcement" type="create" Icon={GrAdd} />
                            )}
                        </div>
                    </div>
                </div>
                {/* LIST */}
                <div>
                    <Table columns={columns} data={paginatedData} />
                </div>
                {/* PAGINATION */}
                <div>
                    {
                        paginatedData?.length > 0 &&
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default AnnouncementList;