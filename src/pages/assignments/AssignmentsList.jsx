import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit  } from "react-icons/fa";
import { Link } from "react-router-dom";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import { assignmentsData, role } from "../../data/data";
import FormModal from "../../components/FormModal";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSortDown } from "react-icons/bi";

const AssignmentList = () => {

    const column = [
        {
            header: 'Subject',
            accessor: 'subject'
        },
        {
            header: 'Class',
            accessor: 'class',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Teacher',
            accessor: 'teacher',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Due Date',
            accessor: 'dueDate',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Actions',
            accessor: 'action',
        },
    ]

    const renderRow = (item) => {
        return (
            <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex flex-col p-4 font-semibold">{item.subject}</td>
                <td className="hidden sm:table-cell p-4">{item.class}</td>
                <td className="hidden md:table-cell p-4">{item.teacher}</td>
                <td className="hidden sm:table-cell p-4">{item.dueDate}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        {/* <Link to={`/list/teachers/${item.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-200">
                                <FaRegEdit  fontSize={18} />
                            </button>
                        </Link> */}
                        {role === 'admin' && (
                            <>
                                <FormModal table='assignment' type='update' Icon={FaRegEdit } data={item} />
                                <FormModal table='assignment' type='delete' Icon={RiDeleteBin6Line} data={item} />
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <div className="bg-white p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full">
                            <img src="/filter.png" alt=""
                                className="w-[14px] h-[14px]"
                            />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full">
                            <BiSortDown fontSize={18} />
                        </button>
                        {role === 'admin' &&
                            <FormModal table='assignment' type='create' Icon={AiOutlinePlus} data={{ id: 1 }} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={assignmentsData} />
            </div>
            {/* PAGINATION */}
            <div>
                <Pagination />
            </div>
        </div>
    );
}

export default AssignmentList;