import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import TableSearch from "../../components/common/TableSearch";
import Table from "../../components/common/Table";
import Pagination from "../../components/common/Pagination";
import { eventsData, role } from "../../data/data";
import FormModal from "../../components/FormModal";
import { BiSortDown } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";

const EventList = () => {

    const column = [
        {
            header: 'Title',
            accessor: 'title'
        },
        {
            header: 'Date',
            accessor: 'date',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Start Time',
            accessor: 'startTime',
            className: 'hidden md:table-cell'
        },
        {
            header: 'End Time',
            accessor: 'endTime',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Actions',
            accessor: 'action',
        },
    ]

    const renderRow = (item) => {
        return (
            <tr key={item.id} className="border-b border-gray-200 dark:even:bg-gray-900 dark:hover:bg-slate-950 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex flex-col p-4 font-semibold dark:text-gray-200">{item.title}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{item.date}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{item.startTime}</td>
                <td className="hidden md:table-cell p-4 dark:text-gray-200">{item.endTime}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        {/* <Link to={`/list/teachers/${item.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-200">
                                <FaRegEdit  fontSize={18} />
                            </button>
                        </Link> */}
                        {role === 'admin' && (
                            <>
                                <FormModal table='event' type='update' Icon={FaRegEdit} data={item} />
                                <FormModal table='event' type='delete' Icon={RiDeleteBin6Line} data={item} />
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
                <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">All Events</h1>
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
                            <FormModal table='event' type='create' Icon={AiOutlinePlus} data={{ id: 1 }} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={eventsData} />
            </div>
            {/* PAGINATION */}
            <div>
                <Pagination />
            </div>
        </div>
    );
}

export default EventList;