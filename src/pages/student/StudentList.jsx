import { IoEyeOutline } from "react-icons/io5";
import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import TableSearch from "../../components/common/TableSearch";
import { role, studentsData } from "../../data/data";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { BiSortDown } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import FormModal from "../../components/FormModal";

const StudentList = () => {

    const column = [
        {
            header: 'Info',
            accessor: 'info',
            className: 'p-4'
        },
        {
            header: 'Student ID',
            accessor: 'studentId',
            className: 'hidden md:table-cell p-4'
        },
        {
            header: 'Grade',
            accessor: 'grade',
            className: 'hidden md:table-cell p-4'
        },
        {
            header: 'Class',
            accessor: 'class',
            className: 'hidden md:table-cell p-4'
        },
        {
            header: 'Phone',
            accessor: 'phone',
            className: 'hidden lg:table-cell p-4'
        },
        {
            header: 'Address',
            accessor: 'address',
            className: 'hidden lg:table-cell p-4'
        },
        {
            header: 'Actions',
            accessor: 'action',
            className: 'p-4'
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
                <td className="hidden md:table-cell p-4">{item.studentId}</td>
                <td className="hidden md:table-cell p-4">{item.grade}</td>
                <td className="hidden md:table-cell p-4">{item.class}</td>
                <td className="hidden lg:table-cell p-4">{item.phone}</td>
                <td className="hidden lg:table-cell p-4">{item.address}</td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                        <Link to={`/list/students/${item.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-100">
                                <IoEyeOutline fontSize={18} />
                            </button>
                        </Link>
                        {role === 'admin' &&
                            <FormModal table='student' type='delete' Icon={RiDeleteBin6Line} data={item} />
                        }
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <div className="bg-white p-4 rounded-[6px] flex-1 mx-4">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
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
                            <FormModal table='student' type='create' Icon={AiOutlinePlus} />
                        }
                    </div>
                </div>
            </div>
            {/* LIST */}
            <div>
                <Table column={column} renderRow={renderRow} data={studentsData} />
            </div>
            {/* PAGINATION */}
            <div>
                <Pagination />
            </div>
        </div>
    );
}

export default StudentList;