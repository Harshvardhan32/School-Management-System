import { GrAdd } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";
import { deleteMessage, getAllMessages } from "../../services/operations/messageAPI";

const MessageList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const { user } = useSelector(state => state?.profile);
    const { role } = user?.userId;
    const { allMessages } = useSelector(state => state?.message);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    // Filter messages based on title or content matching the search query
    const searchedData = allMessages?.filter((data) => {
        const matchedTitleSearch = data?.title?.toLowerCase().includes(searchQuery.trim().toLowerCase());
        const matchedContentSearch = data?.content.toLowerCase().includes(searchQuery.trim().toLowerCase());
        return allMessages && (matchedTitleSearch || matchedContentSearch);
    });

    // Pagination logic based on searched data
    const totalPages = Math.ceil(searchedData?.length / itemsPerPage);
    const paginatedMessage = searchedData.slice(
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
            Header: 'Content',
            accessor: 'content',
            className: 'hidden min-[440px]:table-cell p-4 capitalize',
            isSortable: false,
        },
        {
            Header: "Actions",
            accessor: "actions",
            className: `${!(role === 'Admin' || role === 'Teacher') && 'hidden'} table-cell p-4`,
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
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> {/* Search input */}
                    <div className="relative flex items-center gap-4 self-end">
                        {/* Show create modal for Admin or Teacher */}
                        {(role === 'Admin' || role === 'Teacher') &&
                            <FormModal table='message' type='create' Icon={GrAdd} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                {/* Table displaying messages */}
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