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

const FormModal = ({ table, type, Icon, allData, data, deleteFunction }) => {

    const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7';
    const [open, setOpen] = useState(false);

    const { token } = useSelector(state => state?.auth);
    const dispatch = useDispatch();

    const { handleSubmit } = useForm();

    const onSubmit = handleSubmit(() => {
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
                className={`${size} flex items-center justify-center rounded-full ${type === 'delete' ? 'bg-pink-200' : 'bg-emerald-100'}`}
                onClick={() => setOpen(true)}
            >
                {Icon && <Icon fontSize={18} className='text-gray-500' />}
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