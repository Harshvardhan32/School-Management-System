import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";

const EventForm = ({ type, data }) => {

    const schema = z.object({
        title: z.string()
            .min(3, { message: 'Title must be at least 3 character long!' })
            .max(70, { message: "Title must be at most 70 characters long!" }),
        content: z.string().min(10, { message: 'Content must be at most 70 characters long!' }),
        class: z.string().min(1, { message: 'Class is required!' }),
        date: z.string().refine((value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
        }, { message: 'Invalid date!' }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema), });

    const onSubmit = handleSubmit(data => {
        console.log(data);
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a new' : 'Update'} Event</h1>
            <span className="text-xs font-medium text-gray-700">Authentication Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Title</label>
                    <input
                        type="text"
                        placeholder="Enter Event Title"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("title")}
                    />
                    {errors?.title && <p className="text-xs text-red-700 py-2">{errors?.title.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Class</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("class")}
                    >
                        <option value="">Please Select</option>
                        <option value="1A">1A</option>
                        <option value="1B">1B</option>
                        <option value="2A">2A</option>
                        <option value="2B">2B</option>
                        <option value="3A">3A</option>
                        <option value="3B">3B</option>
                        <option value="3C">3C</option>
                    </select>
                    {errors?.class && <p className="text-xs text-red-700 py-2">{errors?.class.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("date")}
                    />
                    {errors?.date && <p className="text-xs text-red-700 py-2">{errors?.date.message}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Content</label>
                <textarea
                    type="text"
                    rows={5}
                    className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
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