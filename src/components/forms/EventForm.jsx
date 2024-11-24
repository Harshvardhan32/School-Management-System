import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import MultiSelectComponent from "../MultiSelectComponent";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClasses } from "../../services/operations/classAPI";
import { createEvent, updateEvent } from "../../services/operations/eventAPI";
import * as z from 'zod';

const EventForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        title: z.string()
            .min(3, { message: 'Title must be at least 3 character long!' })
            .max(70, { message: "Title must be at most 70 characters long!" }),
        content: z.string().min(20, { message: 'Content must be at least 20 characters long!' }),
        startDate: z.string().min(1, { message: 'Start date is required!' }),
        endDate: z.string().min(1, { message: 'End date is required!' }),
        classes: z.array(z.string()).optional(),
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

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    useEffect(() => {
        dispatch(getAllClasses(token, undefined, undefined, true));
        console.log("DAAAAA: ", data);
    }, []);

    const { allClasses } = useSelector(state => state?.class);

    // Options for teachers, students, and subjects
    const classOptions = useMemo(() => {
        return (allClasses?.map((item) => ({
            id: item?._id,
            name: item?.className,
        })) || []);
    }, [allClasses]);

    // Retrieve selected values from the form state
    const selectedClasses = type === 'update' && data?.classes.length > 0
        ? data?.classes.map((id) =>
            classOptions.find((option) => option.id === id)
        )
        : getValues("classes")?.map((id) =>
            classOptions.find((option) => option.id === id)
        );

    const onSubmit = handleSubmit(formData => {
        const start = new Date(formData?.startDate);
        const end = new Date(formData?.endDate);
        if (end <= start) {
            toast.error('End date must be later than start date!');
            return;
        }

        console.log(formData);
        if (type === 'create') {
            // dispatch(createEvent(formData, token, setOpen));
        } else {
            // dispatch(updateEvent(formData, token, setOpen));
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Event</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Event Title</label>
                    <input
                        type="text"
                        placeholder="Event Title"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("title")}
                        defaultValue={type === 'update' ? data?.title : ''}
                    />
                    {errors?.title && <p className="text-xs text-red-700 py-2">{errors?.title.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Start Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("startDate")}
                        defaultValue={type === 'update' ? new Date(data?.startDate).toISOString().slice(0, 16) : ''}
                    />
                    {errors?.startDate && <p className="text-xs text-red-700 py-2">{errors?.startDate.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">End Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("endDate")}
                        defaultValue={type === 'update' ? new Date(data?.endDate).toISOString().slice(0, 16) : ''}
                    />
                    {errors?.endDate && <p className="text-xs text-red-700 py-2">{errors?.endDate.message}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Classes</label>
                <MultiSelectComponent
                    options={classOptions}
                    selectedValue={selectedClasses}
                    setSelectedValue={(value) =>
                        setValue(
                            "classes",
                            value.map((item) => item.id)
                        )}
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Content</label>
                <textarea
                    type="text"
                    rows={5}
                    placeholder="Content..."
                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    {...register("content")}
                    defaultValue={type === 'update' ? data?.content : ''}
                />
                {errors?.content && <p className="text-xs text-red-700 py-2">{errors?.content.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default EventForm;