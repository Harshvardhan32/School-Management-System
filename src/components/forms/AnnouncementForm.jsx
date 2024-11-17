import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { createAnnouncement, updateAnnouncement } from "../../services/operations/announcementAPI";
import { useDispatch, useSelector } from "react-redux";
import * as z from 'zod';

const AnnouncementForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        title: z.string()
            .min(1, { message: 'Title is required!' }),
        description: z.string().min(10, { message: 'Description must be at least 10 character long!' }),
        date: z.string().min(1, { message: 'Date is required!' }),
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema)
    });

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);

    const onSubmit = handleSubmit(data => {
        console.log(data);
        if (type === 'create') {
            dispatch(createAnnouncement(data, token));
        } else {
            dispatch(updateAnnouncement());
        }
        setOpen(false);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Announcement</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="title" className="text-sm text-gray-500">Title</label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Title"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("title")}
                    />
                    {errors?.title && <p className="text-xs text-red-700 py-2">{errors?.title.message}</p>}
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="date" className="text-sm text-gray-500">Date</label>
                    <input
                        type="datetime-local"
                        id="date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("date")}
                    />
                    {errors?.date && <p className="text-xs text-red-700 py-2">{errors?.date.message}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="description" className="text-sm text-gray-500">Description</label>
                <textarea
                    rows={3}
                    id="description"
                    className="mmin-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    {...register("description")}
                > </textarea>
                {errors?.description && <p className="text-xs text-red-700 py-2">{errors?.description.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form >
    );
}

export default AnnouncementForm;