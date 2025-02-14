import { GrAdd } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";
import { deleteCalendar, getAllCalendars } from "../../services/operations/calendarAPI";

const CalendarList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { allCalendars } = useSelector(state => state?.calendar);
    const { loading } = useSelector(state => state?.calendar);
    const { role } = user?.userId;

    useEffect(() => {
        dispatch(getAllCalendars(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // filter data based on search query
    const searchedData = allCalendars?.filter((calendar) => {
        const normalizeQuery = searchQuery.toLowerCase().trim();

        const matchedClassSearch = calendar?.classId.className.toLowerCase().includes(normalizeQuery);
        const matchedDaySearch = calendar?.dayOfWeek.toLowerCase().includes(normalizeQuery)
        return allCalendars && (matchedClassSearch || matchedDaySearch);
    })

    // Pagination logic based on search data
    const totalPages = Math.ceil(searchedData?.length / itemsPerPage);
    const paginatedCalendars = searchedData?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // create column for the calendar
    const columns = [
        {
            Header: 'Day',
            accessor: 'dayOfWeek',
            className: 'font-medium p-4 capitalize',
            isSortable: true,
        },
        {
            Header: 'Class',
            accessor: 'classId.className',
            className: 'hidden min-[440px]:table-cell p-4',
            isSortable: true,
        },
        {
            Header: 'Actions',
            accessor: "actions",
            className: `${role !== 'Admin' && 'hidden'} table-cell p-4`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table='calendar'
                            type='update'
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table='calendar'
                            type='delete'
                            deleteFunction={deleteCalendar}
                            Icon={RiDeleteBin6Line}
                            data={data}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Calendars</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <div className="relative flex items-center gap-4 self-end">
                        {role === 'Admin' &&
                            <FormModal table='calendar' type='create' Icon={GrAdd} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table columns={columns} data={paginatedCalendars} loading={loading} />
            </div>
            {/* PAGINATION */}
            {
                !loading &&
                <div>
                    {paginatedCalendars?.length > 0 &&
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    }
                </div>
            }
        </div>
    );
}

export default CalendarList;