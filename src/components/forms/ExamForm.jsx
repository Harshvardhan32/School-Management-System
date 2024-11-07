import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";
import { useState } from "react";
import MultiSelectComponent from "../MultiSelectComponent";

const ExamForm = ({ type, data }) => {

    const schema = z.object({
        examTitle: z.string().min(1, { message: 'Exam title is required!' }),
        startDate: z.string()
            .min(1, { message: 'Start date is required!' })
            .refine((value) => {
                const date = new Date(value);
                return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
            }, { message: 'Invalid date format or date!' }),
        endDate: z.string()
            .min(1, { message: 'End date is required!' })
            .refine((value) => {
                const date = new Date(value);
                return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
            }, { message: 'Invalid date format or date!' }),
        subjects: z.array(
            z.object({ name: z.string(), })).min(1, { message: 'At least one subject must be selected!' }),
    });
    
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            subjects: [],
        }
    });

    const onSubmit = handleSubmit(data => {
        const start = new Date(data?.startDate);
        const end = new Date(data?.endDate);
        if (end <= start) {
            toast.error('End date must be later than start date!');
            return;
        }
        console.log(data);
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    });

    const [subjectOptions] = useState([
        { name: 'Physics' },
        { name: 'Chemistry' },
        { name: 'Mathematics' },
        { name: 'Biology' },
        { name: 'History' },
        { name: 'Hindi' },
        { name: 'English' },
    ]);

    const selectedSubject = getValues("subjects");

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update'} Exam</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Exam Title</label>
                    <input
                        type="text"
                        placeholder="Exam Title"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("examTitle")}
                    />
                    {errors?.examTitle && <p className="text-xs text-red-700 py-2">{errors?.examTitle.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Start Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("startDate")}
                    />
                    {errors?.startDate && <p className="text-xs text-red-700 py-2">{errors?.startDate.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">End Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("endDate")}
                    />
                    {errors?.endDate && <p className="text-xs text-red-700 py-2">{errors?.endDate.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap justify-between gap-4">
                <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Subjects</label>
                    <MultiSelectComponent
                        options={subjectOptions}
                        selectedValue={selectedSubject}
                        setSelectedValue={(value) => setValue("subjects", value)}
                    />
                    {errors?.subjects && <p className="text-xs text-red-700 py-2">{errors?.subjects.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default ExamForm;