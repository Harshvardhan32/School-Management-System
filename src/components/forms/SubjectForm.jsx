import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import MultiSelectComponent from "../MultiSelectComponent";
import * as z from 'zod';
import toast from "react-hot-toast";

const SubjectForm = ({ type, data }) => {

    const schema = z.object({
        subject: z.string().min(1, { message: 'Subject name is required!' }),
        teacher: z.string().min(1, { message: 'Teacher name is required!' }),
        lessons: z.array(
            z.object({ name: z.string(), })).min(1, { message: 'At least one lesson must be selected!' }),
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
            lessons: [],
            classes: []
        },
    });

    const onSubmit = handleSubmit(data => {
        console.log(data);
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    });

    const [classOptions] = useState([
        { name: '1A' },
        { name: '1B' },
        { name: '1C' },
        { name: '2A' },
        { name: '2B' },
    ]);

    const [lessonOptions] = useState([
        { name: 'Newton laws of motion' },
        { name: 'Electrostatic' },
        { name: 'Input Output Devices' },
    ]);

    const selectedClass = getValues("classes");
    const selectedLesson = getValues("lessons");

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a new' : 'Update'} Subject</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Subject Name</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("subject")}
                    />
                    {errors?.subject && <p className="text-xs text-red-700 py-2">{errors?.subject.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Teacher</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("teacher")}
                    >
                        <option value="">Please Select</option>
                        <option value="Abhishek Kumar">Abhishek Kumar</option>
                        <option value="Rahul Kumar">Rahul Kumar</option>
                        <option value="Shivam Singh">Shivam Singh</option>
                        <option value="Pradeep Pandey">Pradeep Pandey</option>
                    </select>
                    {errors?.teacher && <p className="text-xs text-red-700 py-2">{errors?.teacher.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Classes</label>
                    <MultiSelectComponent
                        options={classOptions}
                        selectedValue={selectedClass}
                        setSelectedValue={(value) => setValue("classes", value)}
                    />
                    {errors?.classes && <p className="text-xs text-red-700 py-2">{errors?.classes.message}</p>}
                </div>
                <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Lessons</label>
                    <MultiSelectComponent
                        options={lessonOptions}
                        selectedValue={selectedLesson}
                        setSelectedValue={(value) => setValue("lessons", value)}
                    />
                    {errors?.lessons && <p className="text-xs text-red-700 py-2">{errors?.lessons.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default SubjectForm;