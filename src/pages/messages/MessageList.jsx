import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrAdd } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";
import { deleteMessage, getAllMessages } from "../../services/operations/messageAPI";

const MessageList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { role } = user?.userId;
    const { allMessages } = useSelector(state => state?.message);

    useEffect(() => {
        dispatch(getAllMessages(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const searchedData = allMessages?.filter((data) => {
        const matchedTitleSearch = data?.title?.toLowerCase().includes(searchQuery.trim().toLowerCase());
        const matchedContentSearch = data?.content.toLowerCase().includes(searchQuery.trim().toLowerCase());
        return allMessages && (matchedTitleSearch || matchedContentSearch);
    });

    // Pagination logic
    const totalPages = Math.ceil(searchedData?.length / itemsPerPage);
    const paginatedMessage = searchedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: 'Title',
            accessor: 'title',
            className: 'font-medium',
            isSortable: true,
        },
        {
            Header: 'Content',
            accessor: 'content',
            className: 'hidden min-[440px]:table-cell',
            isSortable: false,
        },
        {
            Header: "Actions",
            accessor: "actions",
            className: `${!(role === 'Admin' || role === 'Teacher') && 'hidden'}`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table='message'
                            type='update'
                            Icon={FaRegEdit}
                            data={data}
                        />
                        <FormModal
                            table='message'
                            type='delete'
                            Icon={RiDeleteBin6Line}
                            data={data}
                            deleteFunction={deleteMessage}
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
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Messages</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <div className="relative flex items-center gap-4 self-end">
                        {(role === 'Admin' || role === 'Teacher') &&
                            <FormModal table='message' type='create' Icon={GrAdd} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table columns={columns} data={paginatedMessage} />
            </div>
            {/* PAGINATION */}
            <div>
                {paginatedMessage.length > 0 &&
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

export default MessageList;