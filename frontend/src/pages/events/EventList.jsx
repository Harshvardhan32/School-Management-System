import { GrAdd } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { LuListFilter } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import { useDispatch, useSelector } from "react-redux";
import extractDateTime from '../../utils/extractDateTime';
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";
import { deleteEvent, getAllEvents } from "../../services/operations/eventAPI";

const EventList = () => {

    const { role } = useSelector(state => state?.profile?.user?.userId);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState({ start: '', end: '' });
    const [endDate, setEndDate] = useState({ start: '', end: '' });
    const [showFilter, setShowFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { allEvents } = useSelector(state => state?.event);
    const { loading } = useSelector(state => state?.event);

    // Fetch all events on component mount or token change
    useEffect(() => {
        dispatch(getAllEvents(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Filter events based on date range, search query, and class names
    const filteredEvents = allEvents?.filter((event) => {
        const eventStartDate = new Date(event.startDate).toISOString().split("T")[0];
        const eventEndDate = new Date(event.endDate).toISOString().split("T")[0];

        const isAfterStartDate = !startDate.start || new Date(eventStartDate) >= new Date(startDate.start);
        const isBeforeStartDate = !startDate.end || new Date(eventStartDate) <= new Date(startDate.end);

        const isAfterEndDate = !endDate.start || new Date(eventEndDate) >= new Date(endDate.start);
        const isBeforeEndDate = !endDate.end || new Date(eventEndDate) <= new Date(endDate.end);

        // Check if the event title matches the search query
        const matchesSearchQuery = event.title.toLowerCase().includes(searchQuery.toLowerCase().trim());

        // Check if any class name in the event matches the search query
        const matchesClassSearch = event?.classes?.some((classItem) =>
            classItem.className.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );

        return (isAfterStartDate && isBeforeStartDate && isAfterEndDate && isBeforeEndDate && (matchesSearchQuery || matchesClassSearch));
    });

    // Pagination logic based on filtered events
    const totalPages = Math.ceil(filteredEvents?.length / itemsPerPage);
    const paginatedData = filteredEvents?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: 'Title',
            accessor: 'title',
            className: 'font-medium p-4 capitalize',
            isSortable: true,
        },
        {
            Header: 'Classes',
            accessor: (row) => row?.classes.length > 0 ? row?.classes.map((item) => item.className).join(', ') : '_',
            className: 'hidden md:table-cell p-4',
            isSortable: true,
        },
        {
            Header: 'Start Date',
            accessor: 'startDate',
            className: 'hidden md:table-cell p-4',
            isSortable: true,
            Cell: ({ value }) => extractDateTime(value)
        },
        {
            Header: 'End Date',
            accessor: 'endDate',
            className: 'hidden md:table-cell p-4',
            isSortable: true,
            Cell: ({ value }) => extractDateTime(value)
        },
        {
            Header: 'Actions',
            accessor: 'action',
            className: `${!(role === 'Admin' || role === 'Teacher') && "hidden"} table-cell p-4`, // Show actions only for Admin/Teacher
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table='event'
                            type='update'
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table='event'
                            type='delete'
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteEvent}
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
                    <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Events</h1>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                        <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        <div className="relative flex items-center gap-4 self-end">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="w-8 h-8 flex items-center justify-center bg-[#51DFC3] rounded-full"
                            >
                                <LuListFilter fontSize={18} color='#4b5563' />
                            </button>
                            {showFilter && (
                                <div className="absolute top-10 right-0 border-[1.5px] border-gray-300 shadow-lg bg-white dark:bg-slate-900 p-4 rounded-md z-20 flex flex-col gap-2">
                                    {/* Filter by Start Date */}
                                    <div className="flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">Start Date</label>
                                        <div className="flex gap-2">
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
                                    </div>
                                    {/* Filter by End Date */}
                                    <div className="flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">End Date</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                value={endDate.start}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setEndDate({ ...endDate, start: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                value={endDate.end}
                                                className="p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none"
                                                onChange={(e) => setEndDate({ ...endDate, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {/* Clear filter button */}
                                    <button
                                        onClick={() => {
                                            setStartDate({ start: '', end: '' });
                                            setEndDate({ start: '', end: '' });
                                            setShowFilter(false)
                                        }}
                                        className="mt-2 px-4 py-2 bg-[#51DFC3] rounded-md"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                            {/* Show create button only for Admin/Teacher */}
                            {(role === 'Admin' || role === 'Teacher') && (
                                <FormModal table='event' type='create' Icon={GrAdd} />
                            )}
                        </div>
                    </div>
                </div>
                {/* LIST */}
                <div>
                    <Table columns={columns} data={paginatedData} loading={loading} />
                </div>
                {/* PAGINATION */}
                {
                    !loading &&
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
                }
            </div>
        </div>
    );
};

export default EventList;