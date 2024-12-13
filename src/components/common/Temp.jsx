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

const AnnouncementList = () => {
    const { role } = useSelector((state) => state?.profile?.user?.userId);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterDate, setFilterDate] = useState(""); // State to store the filter date
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);
    const { announcements } = useSelector((state) => state?.announcement);

    useEffect(() => {
        dispatch(getAllAnnouncement(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Filter logic based on the selected date
    const filteredAnnouncements = announcements?.filter((announcement) => {
        if (!filterDate) return true;
        const announcementDate = new Date(announcement.date).toISOString().split("T")[0];
        return announcementDate === filterDate;
    });

    const totalPages = Math.ceil(filteredAnnouncements?.length / itemsPerPage);
    const paginatedData = filteredAnnouncements?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: "Title",
            accessor: "title",
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
            className: `${role !== "Admin" && role !== "Teacher" && "hidden"}`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal table="announcement" type="update" Icon={FaRegEdit} data={data} />
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
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-lg font-semibold dark:text-gray-200">All Announcements</h1>
                <div className="flex items-center gap-4">
                    <TableSearch />
                    <div className="flex items-center gap-4">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="Filter by date"
                        />
                        {role === "Admin" && (
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
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default AnnouncementList;