import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";
import SelectOption from "../common/SelectOption";
import MultiSelectComponent from "../MultiSelectComponent";
import { useState } from "react";

const ClassForm = ({ type, data }) => {

    const schema = z.object({
        className: z.string().min(1, { message: 'Class name is required!' }),
        capacity: z.string().min(1, { message: 'Class capacity is required!' }),
        supervisor: z.string().optional(),
        teachers: z.array(z.object({ name: z.string(), })).optional(),
        students: z.array(z.object({ name: z.string(), })).optional(),
        subjects: z.array(z.object({ name: z.string(), })).optional(),
    });

    const {
        register,
        control,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            teachers: [],
            students: [],
            subjects: [],
        },
    });

    const onSubmit = handleSubmit(data => {
        console.log(data);
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    });

    const supervisors = [
        { value: '603d2149e5f4d32f948c4567', label: 'John Doe' },
        { value: '603d2149e5f4d32f948c4568', label: 'Jane Smith' }
    ]

    const [teacherOptions] = useState([
        { name: 'Rahul Kumar' },
        { name: 'Rohit Singh' },
        { name: 'Aman Kumar' },
    ]);

    const [subjectOptions] = useState([
        { name: 'Rahul Kumar' },
        { name: 'Rohit Singh' },
        { name: 'Aman Kumar' },
    ]);

    const [studentOptions] = useState([
        { name: 'Rahul Kumar' },
        { name: 'Rohit Singh' },
        { name: 'Aman Kumar' },
    ]);

    const selectedTeachers = getValues("teachers");
    const selectedStudents = getValues("students");
    const selectedSubjects = getValues("subjects");

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Class</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Class Name</label>
                    <input
                        type="text"
                        placeholder="Class Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("className")}
                    />
                    {errors?.className && <p className="text-xs text-red-700 py-2">{errors?.className.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Capacity</label>
                    <input
                        type="text"
                        placeholder="Capacity"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("capacity")}
                    />
                    {errors?.capacity && <p className="text-xs text-red-700 py-2">{errors?.capacity.message}</p>}
                </div>
                {
                    type === 'update' &&
                    <div className="flex flex-col gap-2 flex-1">
                        <SelectOption
                            name='supervisor'
                            control={control}
                            options={supervisors}
                            placeholder='Please Select'
                            label='Supervisor'
                        />
                        {errors?.supervisor && <p className="text-xs text-red-700 py-2">{errors?.supervisor.message}</p>}
                    </div>
                }
            </div>
            {
                type === 'update' &&
                <>
                    <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Teachers</label>
                        <MultiSelectComponent
                            options={teacherOptions}
                            selectedValue={selectedTeachers}
                            setSelectedValue={(value) => setValue("teachers", value)}
                        />
                    </div>
                    <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Students</label>
                        <MultiSelectComponent
                            options={studentOptions}
                            selectedValue={selectedStudents}
                            setSelectedValue={(value) => setValue("students", value)}
                        />
                    </div>
                    <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Subjects</label>
                        <MultiSelectComponent
                            options={subjectOptions}
                            selectedValue={selectedSubjects}
                            setSelectedValue={(value) => setValue("subjects", value)}
                        />
                    </div>
                </>
            }
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default ClassForm;