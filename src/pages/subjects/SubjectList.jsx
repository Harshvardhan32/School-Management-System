import { IoEyeOutline } from "react-icons/io5";
import Pagination from "../../components/common/Pagination";
import Table from "../../components/common/Table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import TableSearch from "../../components/common/TableSearch";
import { role, subjectsData } from "../../data/data";

const SubjectList = () => {

    const column = [
        {
            header: 'Subject Name',
            accessor: 'subjectName'
        },
        {
            header: 'Teachers',
            accessor: 'teachers',
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
                <td className="flex flex-col p-4 font-semibold">{item.name}</td>
                <td className="hidden sm:table-cell p-4">{item.teachers.join(', ')}</td>
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
                <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
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
                <Table column={column} renderRow={renderRow} data={subjectsData} />
            </div>
            {/* PAGINATION */}
            <div>
                <Pagination />
            </div>
        </div>
    );
}

export default SubjectList;