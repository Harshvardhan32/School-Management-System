import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GrAdd } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { deleteParent, getAllParents } from "../../services/operations/parentAPI";
import Table from "../../components/common/Table";
import FormModal from "../../components/FormModal";
import Pagination from "../../components/common/Pagination";
import TableSearch from "../../components/common/TableSearch";

const ParentList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { allParents } = useSelector(state => state?.parent);
    const parentsId = allParents?.map((parent) => parent?.parentId) || [];
    const { role } = user?.userId;

    useEffect(() => {
        dispatch(getAllParents(token));
    }, [token, dispatch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const roleBasedParent =
        role === 'Teacher'
            ? allParents.filter((parent) =>
                parent.students.some((student) =>
                    user?.classes.some((userClass) =>
                        userClass.className === student.classId.className
                    )
                )
            )
            : allParents;

    // Filter logic
    const filteredParent = roleBasedParent?.filter((parent) => {
        const matchesParentQuery = (parent.userId.firstName + ' ' + parent.userId.lastName).toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesParentIdQuery = parent.parentId.toLowerCase().includes(searchQuery.toLowerCase().trim());
        const matchesStudentSearch = parent?.students?.some((student) =>
            (student.userId.firstName + ' ' + student.userId.lastName).toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
        const matchesPhoneQuery = parent.userId.phone.toString().includes(searchQuery.trim());
        const matchesAddressQuery = parent.userId.address.toLowerCase().includes(searchQuery.toLowerCase().trim());
        return (matchesParentQuery || matchesParentIdQuery || matchesStudentSearch || matchesPhoneQuery || matchesAddressQuery);
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredParent?.length / itemsPerPage);
    const paginatedParents = filteredParent?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const columns = [
        {
            Header: 'Info',
            accessor: (row) => <div className="flex items-center gap-4">
                <div>
                    <img src={row?.userId.photo} alt="" className="w-10 h-10 md:hidden xl:block rounded-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-semibold dark:text-gray-200">{row?.userId.firstName} {row?.userId.lastName}</h3>
                    <p className="text-xs text-gray-500">{row?.parentId}</p>
                </div>
            </div>,
            isSortable: false,
        },
        {
            Header: 'Students',
            accessor: (row) => row?.students.length > 0 ? row?.students.map(student => { return student.userId.firstName + " " + student.userId.lastName }).join(', ') : '_',
            className: 'hidden sm:table-cell',
            isSortable: true,
        },
        {
            Header: 'Phone',
            accessor: (row) => row?.userId?.phone,
            className: 'hidden md:table-cell',
            isSortable: true,
        },
        {
            Header: 'Address',
            accessor: (row) => row?.userId?.address,
            className: 'hidden md:table-cell',
            isSortable: false,
        },
        {
            Header: 'Actions',
            accessor: 'action',
            className: `${!(role === 'Admin' || role === 'Parent') && 'hidden'}`,
            isSortable: false,
            Cell: ({ row }) => {
                const data = row?.original;
                return (
                    <div className="flex items-center gap-2">
                        <FormModal
                            table='parent'
                            type='update'
                            Icon={FaRegEdit}
                            data={data}
                            allData={parentsId}
                        />
                        {
                            role === 'Admin' &&
                            <FormModal
                                table='parent'
                                type='delete'
                                Icon={RiDeleteBin6Line}
                                data={data}
                                deleteFunction={deleteParent}
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
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Parents</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <div className="flex items-center gap-4 self-end">
                        {role === 'Admin' &&
                            <FormModal table='parent' type='create' Icon={GrAdd} allData={parentsId} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table columns={columns} data={paginatedParents} />
            </div>
            {/* PAGINATION */}
            <div>
                {
                    paginatedParents.length > 0 &&
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

export default ParentList;