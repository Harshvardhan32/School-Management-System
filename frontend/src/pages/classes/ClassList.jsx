import { GrAdd } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import { LuListFilter } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";
import { deleteClass, getAllClasses } from "../../services/operations/classAPI";

const ClassList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [capacity, setCapacity] = useState({ start: '', end: '' });
    const [showFilter, setShowFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { allClasses } = useSelector(state => state?.class);
    const classNames = allClasses?.map((item) => item?.className) || [];
    const { role } = user?.userId;

    // Fetch all classes
    useEffect(() => {
        dispatch(getAllClasses(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Filter classes based on user role (Teacher or other roles)
    const roleBasedClasses = role === 'Teacher'
        ? allClasses?.filter((classItem) =>
            user?.classes.some((userClasses) => userClasses.className === classItem.className))
        : allClasses;

    // Filter classes based on search query and capacity range
    const filteredClasses = roleBasedClasses?.filter((data) => {
        const isAfterCapacity = !capacity.start || data.capacity >= capacity.start;
        const isBeforeCapacity = !capacity.end || data.capacity <= capacity.end;
        const matchesClassSearch = data.className.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesCapacitySearch = data?.capacity.toString().includes(searchQuery.trim());
        const matchesSupervisorSearch = data?.supervisor && (data?.supervisor.userId.firstName + ' ' + data?.supervisor.userId.lastName).toLowerCase().includes(searchQuery.toLowerCase().trim());

        return (isAfterCapacity && isBeforeCapacity && (matchesClassSearch || matchesCapacitySearch || matchesSupervisorSearch));
    });

    // Calculate total pages based on filtered classes
    const totalPages = Math.ceil(filteredClasses?.length / itemsPerPage);
    const paginatedClasses = filteredClasses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Define table columns and their behavior
    const columns = [
        {
            Header: 'Class Name',
            accessor: 'className',
            className: 'font-medium p-4',
            isSortable: true,
        },
        {
            Header: 'Capacity',
            accessor: 'capacity',
            className: 'hidden min-[440px]:table-cell p-4',
            isSortable: true,
        },
        {
            Header: 'Supervisor',
            accessor: (row) =>
                row.supervisor
                    ? `${row.supervisor.userId.firstName} ${row.supervisor.userId.lastName}`
                    : '_',
            className: 'hidden sm:table-cell p-4 capitalize',
            isSortable: true,
        },
        {
            Header: "Actions",
            accessor: "actions",
            className: `${role !== 'Admin' && 'hidden'} table-cell p-4`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table='class'
                            type='update'
                            Icon={FaRegEdit}
                            data={data}
                            allData={classNames}
                        />
                        <FormModal
                            table='class'
                            type='delete'
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteClass}
                        />
                    </div>
                );
            },
        },
    ]

    return (
        <div className="min-h-[50vh]">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                {/* TOP */}
                <div className="flex items-center justify-between gap-4">
                    <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Classes</h1>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                        <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                        <div className="relative flex items-center gap-4 self-end">
                            {/* Filter button */}
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="w-8 h-8 flex items-center justify-center bg-[#51DFC3] rounded-full"
                            >
                                <LuListFilter fontSize={18} color='#4b5563' />
                            </button>

                            {/* Filter options */}
                            {showFilter && (
                                <div className="absolute top-10 right-0 border-[1.5px] border-gray-300 shadow-lg bg-white dark:bg-slate-900 p-4 rounded-md z-20 flex flex-col gap-2">
                                    <div className="min-w-[150px] flex flex-col gap-2 text-xs dark:text-gray-200">
                                        <label className="font-medium">Capacity</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={capacity.start}
                                                placeholder="Start"
                                                className="w-full p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none no-spin"
                                                onChange={(e) => setCapacity({ ...capacity, start: e.target.value })}
                                            />
                                            <input
                                                type="number"
                                                value={capacity.end}
                                                placeholder="End"
                                                className="w-full p-2 dark:text-gray-200 dark:bg-slate-800 border-[1.5px] border-gray-300 rounded-[6px] focus:outline-none no-spin"
                                                onChange={(e) => setCapacity({ ...capacity, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {/* Clear filter button */}
                                    <button
                                        onClick={() => { setCapacity({ start: '', end: '' }); setShowFilter(false) }}
                                        className="mt-2 px-4 py-2 bg-[#51DFC3] rounded-md"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                            {/* Create class button (Admin only) */}
                            {role === 'Admin' &&
                                <FormModal table='class' type='create' Icon={GrAdd} allData={classNames} />
                            }
                        </div>
                    </div>
                </div>
                {/* LIST */}
                <div>
                    <Table columns={columns} data={paginatedClasses || []} />
                </div>
                {/* PAGINATION */}
                <div>
                    {paginatedClasses?.length > 0 &&
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
}

export default ClassList;