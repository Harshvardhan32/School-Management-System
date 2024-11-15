import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";
import SelectOption from "../common/SelectOption";

const LessonForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        title: z.string().min(1, { message: 'Lesson title is required!' }),
        description: z.string().optional().default(''),
        subject: z.string().min(1, { message: 'Subject is required!' })
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema), });

    const classes = [
        { value: 'hf67e6rcg7cgfr7gc7hfhg', label: 'Physics' },
        { value: 'hf67e6rcg6h36tdgc7hfhg', label: 'Chemistry' },
    ];

    const onSubmit = handleSubmit(data => {
        console.log(data);
        toast.success(`Lesson ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
        // setOpen(false);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update'} Lesson</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Lesson Title</label>
                    <input
                        type="text"
                        placeholder="Lesson Title"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("title")}
                    />
                    {errors?.title && <p className="text-xs text-red-700 py-2">{errors?.title.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='subject'
                        control={control}
                        options={classes}
                        placeholder='Please Select'
                        label='Subject'
                    />
                    {/* {errors?.subject && <p className="text-xs text-red-700 py-2">{errors?.subject.message}</p>} */}
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Description</label>
                <textarea
                    name=""
                    placeholder="Description..."
                    rows={4}
                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    {...register("description")}
                ></textarea>
                {errors?.description && <p className="text-xs text-red-700 py-2">{errors?.description.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default LessonForm;