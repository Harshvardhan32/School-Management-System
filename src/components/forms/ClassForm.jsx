import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";

const ClassForm = ({ type, data }) => {

    const schema = z.object({
        className: z.string().min(1, { message: 'Class name is required!' }),
        capacity: z.string().min(1, { message: 'Student capacity is required!' }),
        classId: z.string().min(1, { message: 'Class ID is required!' }),
        grade: z.string().min(1, { message: 'Grade is required!' }),
        supervisor: z.string().min(1, { message: 'Supervisor is required!' }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema), });

    const onSubmit = handleSubmit(data => {
        console.log(data);
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a new' : 'Update the'} Class</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Class Name</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("className")}
                    />
                    {errors?.className && <p className="text-xs text-red-700 py-2">{errors?.className.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Capacity</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("capacity")}
                    />
                    {errors?.capacity && <p className="text-xs text-red-700 py-2">{errors?.capacity.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Grade</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("grade")}
                    >
                        <option value="">Please Select</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    {errors?.grade && <p className="text-xs text-red-700 py-2">{errors?.grade.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Supervisor</label>
                    <select
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("supervisor")}
                    >
                        <option value="">Please Select</option>
                        <option value="Rahul">Rahul</option>
                        <option value="John">John</option>
                        <option value="Akash">Akash</option>
                    </select>
                    {errors?.supervisor && <p className="text-xs text-red-700 py-2">{errors?.supervisor.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Class Id</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("classId")}
                    />
                    {errors?.classId && <p className="text-xs text-red-700 py-2">{errors?.classId.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default ClassForm;