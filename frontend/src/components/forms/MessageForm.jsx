import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from "react-redux";
import { createMessage, updateMessage } from '../../services/operations/messageAPI';

const MessageForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        title: z.string()
            .min(3, { message: 'Title must be at least 3 character long!' })
            .max(70, { message: "Title must be at most 70 characters long!" }),
        content: z.string().min(10, { message: 'Content must be at least 10 characters long!' })
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    const onSubmit = handleSubmit(formData => {
        if (type === 'create') {
            dispatch(createMessage(formData, token, setOpen));
        } else {
            formData.id = data._id;
            dispatch(updateMessage(formData, token, setOpen));
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Message</h1>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Title</label>
                <input
                    type="text"
                    placeholder="Title"
                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    {...register("title")}
                    defaultValue={type === 'update' ? data?.title : ''}
                />
                {errors?.title && <p className="text-xs text-red-700 py-2">{errors?.title.message}</p>}
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

export default MessageForm;