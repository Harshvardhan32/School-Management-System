import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";
import * as z from 'zod';
import MultiSelectComponent from "../MultiSelectComponent";
import { useState } from "react";

const AnnouncementForm = ({ type, data }) => {

    const schema = z.object({
        title: z.string()
            .min(1, { message: 'Title is required!' }),
        description: z.string().min(10, { message: 'Description must be at least 10 character long!' }),
        date: z.string().min(1, { message: 'Date is required!' })
            .refine((value) => {
                const date = new Date(value);
                return !isNaN(date.getTime());
            }, { message: 'Invalid date!' }),
        classes: z.array(
            z.object({ name: z.string(), })).min(1, { message: 'At least one class must be selected!' }),
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            classes: [],
        }
    });

    const [classOptions] = useState([
        { name: '1A' },
        { name: '2A' },
        { name: '3A' },
        { name: '1B' },
        { name: '2B' },
        { name: '3B' },
    ]);
    const selectedClasses = getValues("classes");

    const onSubmit = handleSubmit(data => {
        console.log(data);
        toast.success(`Announcement ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update'} Announcement</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Title</label>
                    <input
                        type="text"
                        placeholder="Title"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("title")}
                    />
                    {errors?.title && <p className="text-xs text-red-700 py-2">{errors?.title.message}</p>}
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Date</label>
                    <input
                        type="date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("date")}
                    />
                    {errors?.date && <p className="text-xs text-red-700 py-2">{errors?.date.message}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Classes</label>
                <MultiSelectComponent
                    options={classOptions}
                    selectedValue={selectedClasses}
                    setSelectedValue={(value) => setValue("classes", value)}
                />
                {errors?.classes && <p className="text-xs text-red-700 py-2">{errors?.classes.message}</p>}
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Description</label>
                <textarea
                    rows={3}
                    className="mmin-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    {...register("description")}
                    defaultValue={data?.email}
                > </textarea>
                {errors?.description && <p className="text-xs text-red-700 py-2">{errors?.description.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form >
    );
}

export default AnnouncementForm;