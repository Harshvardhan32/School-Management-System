import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import SelectOption from "../common/SelectOption";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubjects } from "../../services/operations/subjectAPI";
import * as z from 'zod';
import { createLesson } from "../../services/operations/lessonAPI";

const LessonForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        title: z.string().min(1, { message: 'Lesson title is required!' }),
        description: z.string().min(5, { message: 'Description must be at least 5 character long!' }),
        subject: z.string().min(1, { message: 'Subject is required!' })
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema), });

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    useEffect(() => {
        dispatch(getAllSubjects(token, undefined, undefined, true));
    }, []);

    const onSubmit = handleSubmit(formData => {
        console.log(formData);
        if (type === 'create') {
            // dispatch(createLesson(formData, token, setOpen));
        } else {
            // console.log("Form Data: ", formData);
        }
        console.log(formData);
    })

    const { allSubjects } = useSelector(state => state?.subject);

    const subjectOptions = useMemo(() => {
        return allSubjects?.map((item) => ({
            id: item?._id,
            name: item?.subjectName,
        })) || [];
    }, [allSubjects]);

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
                        options={subjectOptions}
                        placeholder='Please Select'
                        label='Subject'
                    />
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