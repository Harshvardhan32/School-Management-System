import { Link } from "react-router-dom";
import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import TableSearch from "../../components/common/TableSearch";
import { role, teachersData } from "../../data/data";
import { IoEyeOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

const TeacherList = () => {

    const column = [
        {
            header: 'Info',
            accessor: 'info'
        },
        {
            header: 'Teacher ID',
            accessor: 'teacherId',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Subjects',
            accessor: 'subjects',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Classes',
            accessor: 'classes',
            className: 'hidden md:table-cell'
        },
        {
            header: 'Phone',
            accessor: 'phone',
            className: 'hidden lg:table-cell'
        },
        {
            header: 'Address',
            accessor: 'address',
            className: 'hidden lg:table-cell'
        },
        {
            header: 'Actions',
            accessor: 'action',
        },
    ]

    const renderRow = (item) => {
        return (
            <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-purple-50">
                <td className="flex items-center gap-4 p-4">
                    <div>
                        <img src={item.photo} alt="" className="w-10 h-10 md:hidden xl:block rounded-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.email}</p>
                    </div>
                </td>
                <td className="hidden md:table-cell p-4">{item.teacherId}</td>
                <td className="hidden md:table-cell p-4">{item.subjects.join(', ')}</td>
                <td className="hidden md:table-cell p-4">{item.classes.join(', ')}</td>
                <td className="hidden lg:table-cell p-4">{item.phone}</td>
                <td className="hidden lg:table-cell p-4">{item.address}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <Link to={`/list/teachers/${item.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-200">
                                <IoEyeOutline fontSize={18} />
                            </button>
                        </Link>
                        {role === 'admin' && (
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-pink-200">
                                <RiDeleteBin6Line fontSize={18} />
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <div className="bg-white p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full">
                            <img src="/filter.png" alt=""
                                className="w-[14px] h-[14px]"
                            />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full">
                            <img src="/sort.png" alt=""
                                className="w-[14px] h-[14px]"
                            />
                        </button>
                        {role === 'admin' && <button className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full">
                            <img src="/plus.png" alt=""
                                className="w-[14px] h-[14px]"
                            />
                        </button>}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={teachersData} />
            </div>
            {/* PAGINATION */}
            <div>
                <Pagination />
            </div>
        </div>
    );

}

export default TeacherList;