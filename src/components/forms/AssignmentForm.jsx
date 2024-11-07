import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";

const AssignmentForm = ({ type, data }) => {

    const schema = z.object({
        subject: z.string().min(1, { message: 'Subject name is required!' }),
        class: z.string().min(1, { message: 'Class is required!' }),
        teacher: z.string().min(1, { message: 'Teacher is required!' }),
        assignedDate: z.string()
            .min(1, { message: 'Assigned date is required!' })
            .refine((value) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            }, { message: 'Invalid date!' }),
        dueDate: z.string()
            .min(1, { message: 'Due date is required!' })
            .refine((value) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            }, { message: 'Invalid date!' }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit(data => {
        const start = new Date(data?.assignedDate);
        const end = new Date(data?.dueDate);
        if (end < start) {
            toast.error('Due date must be later than assigned date!');
            return;
        }
        console.log(data);
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update'} Assignment</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Subject</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("subject")}
                    >
                        <option value="">Please Select</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                    </select>
                    {errors?.subject && <p className="text-xs text-red-700 py-2">{errors?.subject.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Class</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("class")}
                    >
                        <option value="">Please Select</option>
                        <option value="1A">1A</option>
                        <option value="1B">1B</option>
                        <option value="1C">1C</option>
                        <option value="2A">2A</option>
                        <option value="2B">2B</option>
                        <option value="2C">2C</option>
                    </select>
                    {errors?.class && <p className="text-xs text-red-700 py-2">{errors?.class.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Teacher</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("teacher")}
                    >
                        <option value="">Please Select</option>
                        <option value="Rahul Kumar">Rahul Kumar</option>
                        <option value="Satish Singh">Satish Singh</option>
                        <option value="Rajnish">Rajnish</option>
                        <option value="Vivek">Vivek</option>
                        <option value="Sumit Singh">Sumit Singh</option>
                    </select>
                    {errors?.teacher && <p className="text-xs text-red-700 py-2">{errors?.teacher.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Assigned Date</label>
                    <input
                        type="date"
                        placeholder="Assigned Date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("assignedDate")}
                    />
                    {errors?.assignedDate && <p className="text-xs text-red-700 py-2">{errors?.assignedDate.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Due Date</label>
                    <input
                        type="date"
                        placeholder="Due Date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("dueDate")}
                    />
                    {errors?.dueDate && <p className="text-xs text-red-700 py-2">{errors?.dueDate.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form >
    );
}

export default AssignmentForm;