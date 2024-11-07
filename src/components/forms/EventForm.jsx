import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";
import * as z from 'zod';
import { useState } from "react";
import MultiSelectComponent from "../MultiSelectComponent";

const EventForm = ({ type, data }) => {

    const schema = z.object({
        title: z.string()
            .min(3, { message: 'Title must be at least 3 character long!' })
            .max(70, { message: "Title must be at most 70 characters long!" }),
        classes: z.array(
            z.object({ name: z.string(), })).min(1, { message: 'At least one class must be selected!' }),
        startDate: z.string().min(1, { message: 'Start date is required!' })
            .refine((value) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            }, { message: 'Invalid date!' }),
        endDate: z.string().min(1, { message: 'End date is required!' })
            .refine((value) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            }, { message: 'Invalid date!' }),
        content: z.string().min(10, { message: 'Content must be at most 70 characters long!' }),
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            classes: []
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
        toast.success(`Event ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    });

    const [classOptions] = useState([
        { name: '1A' },
        { name: '1B' },
        { name: '1C' },
        { name: '2A' },
        { name: '2B' },
    ]);
    const selectedClass = getValues("classes");

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update'} Event</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Title</label>
                    <input
                        type="text"
                        placeholder="Event Title"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("title")}
                    />
                    {errors?.title && <p className="text-xs text-red-700 py-2">{errors?.title.message}</p>}
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
            <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Classes</label>
                <MultiSelectComponent
                    options={classOptions}
                    selectedValue={selectedClass}
                    setSelectedValue={(value) => setValue("classes", value)}
                />
                {errors?.classes && <p className="text-xs text-red-700 py-2">{errors?.classes.message}</p>}
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Content</label>
                <textarea
                    type="text"
                    rows={5}
                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    {...register("content")}
                    defaultValue={data?.content}
                />
                {errors?.content && <p className="text-xs text-red-700 py-2">{errors?.content.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default EventForm;