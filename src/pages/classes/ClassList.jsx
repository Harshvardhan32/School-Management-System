import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit  } from "react-icons/fa";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import { classesData, role } from "../../data/data";
import FormModal from "../../components/FormModal";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSortDown } from "react-icons/bi";

const ClassList = () => {

    const column = [
        {
            header: 'Class Name',
            accessor: 'className'
        },
        {
            header: 'Capacity',
            accessor: 'capacity',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Grade',
            accessor: 'grade',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Supervisor',
            accessor: 'supervisor',
            className: 'hidden sm:table-cell'
        },
        {
            header: 'Actions',
            accessor: 'action',
        },
    ]

    const renderRow = (item) => {
        return (
            <tr key={item.id} className="border-b border-gray-200 dark:even:bg-gray-900 dark:hover:bg-slate-950 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex flex-col p-4 font-semibold dark:text-gray-200">{item.name}</td>
                <td className="hidden sm:table-cell p-4 dark:text-gray-200">{item.capacity}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{item.grade}</td>
                <td className="hidden sm:table-cell p-4 dark:text-gray-200">{item.supervisor}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        {role === 'admin' && (
                            <>
                                <FormModal table='class' type='update' Icon={FaRegEdit } data={item} />
                                <FormModal table='class' type='delete' Icon={RiDeleteBin6Line} data={item} />
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Classes</h1>
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
                            <FormModal table='class' type='create' Icon={AiOutlinePlus} data={{ id: 1 }} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={classesData} />
            </div>
            {/* PAGINATION */}
            <div>
                <Pagination />
            </div>
        </div>
    );
}

export default ClassList;