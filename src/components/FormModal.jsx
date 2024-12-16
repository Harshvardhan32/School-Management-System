import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import TeacherForm from "./forms/TeacherForm";
import StudentForm from "./forms/StudentForm";
import ParentForm from "./forms/ParentForm";
import SubjectForm from "./forms/SubjectForm";
import ClassForm from "./forms/ClassForm";
import LessonForm from "./forms/LessonForm";
import ExamForm from "./forms/ExamForm";
import AssignmentForm from "./forms/AssignmentForm";
import ResultForm from "./forms/ResultForm";
import AttendanceForm from "./forms/AttendanceForm";
import EventForm from "./forms/EventForm";
import AnnouncementForm from "./forms/AnnouncementForm";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const FormModal = ({ table, type, title, Icon, allData, data, deleteFunction }) => {

    const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    const { handleSubmit } = useForm();

    const onSubmit = handleSubmit(() => {
        console.log("Data: ", data);
        dispatch(deleteFunction(data, token, setOpen));
    });

    const Form = () => {
        return type === 'delete' ? (
            <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium dark:text-gray-200">All data will be lost. Are you sure you want to delete this {table}?</span>
                <button type='submit' className="bg-red-700 text-white py-2 px-4 rounded-[6px] border-none w-max self-center">Delete</button>
            </form>
        ) : (type === 'create' || type === 'update') && (
            table === 'student' ? <StudentForm type={type} data={data} allData={allData} setOpen={setOpen} /> :
                table === 'teacher' ? <TeacherForm type={type} data={data} allData={allData} setOpen={setOpen} /> :
                    table === 'parent' ? <ParentForm type={type} data={data} allData={allData} setOpen={setOpen} /> :
                        table === 'subject' ? <SubjectForm type={type} data={data} setOpen={setOpen} /> :
                            table === 'class' ? <ClassForm type={type} data={data} allData={allData} setOpen={setOpen} /> :
                                table === 'lesson' ? <LessonForm type={type} data={data} setOpen={setOpen} /> :
                                    table === 'exam' ? <ExamForm type={type} data={data} setOpen={setOpen} /> :
                                        table === 'assignment' ? <AssignmentForm type={type} data={data} setOpen={setOpen} /> :
                                            table === 'result' ? <ResultForm type={type} data={data} setOpen={setOpen} /> :
                                                table === 'attendance' ? <AttendanceForm type={type} data={data} setOpen={setOpen} /> :
                                                    table === 'event' ? <EventForm type={type} data={data} setOpen={setOpen} /> :
                                                        table === 'announcement' && <AnnouncementForm type={type} data={data} setOpen={setOpen} />
        );
    }

    return (
        <div>
            <button
                title={title}
                className={`${size} flex items-center justify-center rounded-full ${type === 'delete' ? 'bg-[#FF4B96]' : 'bg-[#51DFC3]'}`}
                onClick={() => setOpen(true)}
            >
                {Icon && <Icon fontSize={18} className='text-gray-600' />}
            </button>
            {open && (
                <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto backdrop-blur-sm w-screen min-h-screen py-10 top-0 left-0 bg-black bg-opacity-60">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form />
                        <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}>
                            <RxCross2 fontSize={22} className="text-gray-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormModal;
//     const { role } = useSelector((state) => state?.profile?.user?.userId);
//     const [sortConfig, setSortConfig] = useState({ field: "className", order: "asc" });
//     const [sortMenuOpen, setSortMenuOpen] = useState(false);

//     const column = [
//         { header: "Class Name", accessor: "className" },
//         { header: "Capacity", accessor: "capacity", className: "hidden sm:table-cell" },
//         { header: "Supervisor", accessor: "supervisor", className: "hidden sm:table-cell" },
//         { header: "Actions", accessor: "action", className: `${role !== "Admin" && "hidden"}` },
//     ];

//     const dispatch = useDispatch();
//     const [currentPage, setCurrentPage] = useState(1);
//     const { token } = useSelector((state) => state?.auth);
//     const { paginatedClasses, totalPages } = useSelector((state) => state?.class);

//     useEffect(() => {
//         dispatch(getAllClasses(token, currentPage, 10, false));
//         dispatch(getAllClasses(token, undefined, undefined, true));
//     }, [currentPage, token, dispatch]);

//     const handlePageChange = (page) => setCurrentPage(page);

//     const handleSort = (field, order) => {
//         setSortConfig({ field, order });
//         setSortMenuOpen(false);
//     };

//     const sortedClasses = [...paginatedClasses]?.sort((a, b) => {
//         const aValue = a[sortConfig.field];
//         const bValue = b[sortConfig.field];
//         if (sortConfig.order === "asc") return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
//         return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
//     });

//     const renderRow = (data) => (
//         <tr
//             key={data?._id}
//             className="border-b border-gray-200 dark:even:bg-gray-900 dark:hover:bg-slate-950 even:bg-slate-50 text-sm hover:bg-purple-50"
//         >
//             <td className="flex flex-col p-4 font-semibold dark:text-gray-200">{data.className}</td>
//             <td className="hidden sm:table-cell p-4 dark:text-gray-200">{data.capacity}</td>
//             <td className="hidden sm:table-cell p-4 dark:text-gray-200">
//                 {data?.supervisor
//                     ? `${data.supervisor.userId.firstName} ${data.supervisor.userId.lastName}`
//                     : "_"}
//             </td>
//             <td className="p-4">
//                 <div className="flex items-center gap-2">
//                     {role === "Admin" && (
//                         <>
//                             <FormModal
//                                 table="class"
//                                 type="update"
//                                 Icon={FaRegEdit}
//                                 data={data}
//                             />
//                             <FormModal
//                                 table="class"
//                                 type="delete"
//                                 Icon={RiDeleteBin6Line}
//                                 data={data}
//                                 deleteFunction={deleteClass}
//                             />
//                         </>
//                     )}
//                 </div>
//             </td>
//         </tr>
//     );

//     return (
//         <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 mx-4">
//             {/* TOP */}
//             <div className="flex items-center justify-between gap-4">
//                 <h1 className="hidden md:block text-lg font-semibold dark:text-gray-200">
//                     All Classes
//                 </h1>
//                 <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full md:w-auto">
//                     <TableSearch />
//                     <div className="relative">
//                         <button
//                             className="w-8 h-8 flex items-center justify-center bg-emerald-100 rounded-full"
//                             onClick={() => setSortMenuOpen((prev) => !prev)}
//                         >
//                             Sort
//                         </button>
//                         {sortMenuOpen && (
//                             <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 shadow-md rounded p-2">
//                                 <button
//                                     className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
//                                     onClick={() => handleSort("className", "asc")}
//                                 >
//                                     Sort by Class Name (Asc)
//                                 </button>
//                                 <button
//                                     className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
//                                     onClick={() => handleSort("className", "desc")}
//                                 >
//                                     Sort by Class Name (Desc)
//                                 </button>
//                                 <button
//                                     className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
//                                     onClick={() => handleSort("capacity", "asc")}
//                                 >
//                                     Sort by Capacity (Asc)
//                                 </button>
//                                 <button
//                                     className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
//                                     onClick={() => handleSort("capacity", "desc")}
//                                 >
//                                     Sort by Capacity (Desc)
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                     {role === "Admin" && <FormModal table="class" type="create" Icon={GrAdd} />}
//                 </div>
//             </div>
//             {/* LIST */}
//             <div>
//                 <Table column={column} renderRow={renderRow} data={sortedClasses} />
//             </div>
//             {/* PAGINATION */}
//             <div>
//                 <Pagination
//                     totalPages={totalPages}
//                     currentPage={currentPage}
//                     onPageChange={handlePageChange}
//                 />
//             </div>
//         </div>
//     );
// };