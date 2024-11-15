import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";
import SelectOption from "../common/SelectOption";
import * as z from 'zod';

const AssignmentForm = ({ type, data }) => {

    const schema = z.object({
        subject: z.string().min(1, { message: 'Subject is required!' }),
        classId: z.string().min(1, { message: 'Class is required!' }),
        teacher: z.string().min(1, { message: 'Teacher is required!' }),
        assignedDate: z.string()
            .min(1, { message: 'Assigned date is required!' }),
        dueDate: z.string()
            .min(1, { message: 'Due date is required!' }),
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    });

    const subjects = [
        { value: 'Physics', label: 'Physics' },
        { value: 'Chemistry', label: 'Chemistry' },
        { value: 'Mathmetics', label: 'Mathematics' },
        { value: 'Biology', label: 'Biology' },
        { value: 'History', label: 'History' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'English', label: 'English' }
    ];

    const classes = [
        { value: 'class-1', label: 'Class 1' },
        { value: 'class-2', label: 'Class 2' },
        { value: 'class-3', label: 'Class 3' },
        { value: 'class-4', label: 'Class 4' },
        { value: 'class-5', label: 'Class 5' },
        { value: 'class-6', label: 'Class 6' },
        { value: 'class-7', label: 'Class 7' },
    ];

    const teachers = [
        { value: 'teacher-1', label: 'Mr. Smith' },
        { value: 'teacher-2', label: 'Ms. Johnson' },
        { value: 'teacher-3', label: 'Mrs. Williams' },
        { value: 'teacher-4', label: 'Mr. Brown' },
        { value: 'teacher-5', label: 'Ms. Jones' },
        { value: 'teacher-6', label: 'Mr. Garcia' },
        { value: 'teacher-7', label: 'Mrs. Miller' },
    ];

    const onSubmit = handleSubmit(data => {
        const start = new Date(data?.assignedDate);
        const end = new Date(data?.dueDate);
        if (end < start) {
            toast.error('Due date must be later than assigned date!');
            return;
        }
        console.log(data);
        toast.success(`Assignment ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Assignment</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    {/* <SelectOption
                        name='subject'
                        control={control}
                        options={subjects}
                        placeholder='Please Select'
                        label='Subject'
                    /> */}
                    <SelectOption
                        name='subject'
                        control={control}
                        options={subjects}
                        placeholder='Please Select'
                        label='Subject'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='classId'
                        control={control}
                        options={classes}
                        placeholder='Please Select'
                        label='Class'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='teacher'
                        control={control}
                        options={teachers}
                        placeholder='Please Select'
                        label='Teacher'
                    />
                    {/* {errors?.class && <p className="text-xs text-red-700 py-2">{errors?.class.message}</p>} */}
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