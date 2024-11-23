import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";
import SelectOption from "../common/SelectOption";
import { useDispatch, useSelector } from "react-redux";
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllSubjects } from "../../services/operations/subjectAPI";
import { getAllTeachers } from "../../services/operations/teacherAPI";
import { useEffect, useMemo } from "react";
import * as z from 'zod';

const AssignmentForm = ({ type, data, setOpen }) => {
    // Define schema with Zod
    const schema = z.object({
        subject: z.string().min(1, { message: 'Subject is required!' }),
        classId: z.string().min(1, { message: 'Class is required!' }),
        teacher: z.string().min(1, { message: 'Teacher is required!' }),
        assignedDate: z.string().min(1, { message: 'Assigned date is required!' }),
        dueDate: z.string().min(1, { message: 'Due date is required!' }),
    });

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);

    // Fetch data only once
    useEffect(() => {
        dispatch(getAllSubjects(token, undefined, undefined, true));
        dispatch(getAllClasses(token, undefined, undefined, true)); // Fetch all classes
        dispatch(getAllTeachers(token, undefined, undefined, true));
        console.log("DDDDDDDDd: ", data);
    }, [dispatch, token]);

    // Access Redux states
    const { allTeachers } = useSelector((state) => state?.teacher);
    const { allClasses } = useSelector((state) => state?.class); // Fetch all classes for forms
    const { allSubjects } = useSelector((state) => state?.subject);

    // Options for dropdowns
    const subjectOptions = useMemo(() => {
        return allSubjects?.map((item) => ({
            id: item?._id,
            name: item?.subjectName,
        })) || [];
    }, [allSubjects]);

    const classOptions = useMemo(() => {
        return allClasses?.map((item) => ({
            id: item?._id,
            name: item?.className,
        })) || [];
    }, [allClasses]);

    const teacherOptions = useMemo(() => {
        return allTeachers?.map((item) => ({
            id: item?._id,
            name: `${item?.userId?.firstName} ${item?.userId?.lastName}`,
        })) || [];
    }, [allTeachers]);

    // Form submission handler
    const onSubmit = handleSubmit((formData) => {
        const start = new Date(formData?.assignedDate);
        const end = new Date(formData?.dueDate);
        if (end < start) {
            toast.error('Due date must be later than assigned date!');
            return;
        }

        // Log or dispatch data based on the form type
        if (type === 'create') {
            console.log("Creating assignment:", formData);
            // dispatch(createAssignment(formData, token, setOpen));
        } else {
            console.log("Updating assignment:", formData);
            // Update logic here
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">
                {type === 'create' ? 'Create a new' : 'Update the'} Assignment
            </h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name="subject"
                        control={control}
                        options={subjectOptions}
                        defaultValue={type === 'update' && data?.subject?._id}
                        placeholder="Please Select"
                        label="Subject"
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name="classId"
                        control={control}
                        options={classOptions}
                        defaultValue={type === 'update' && data?.classId?._id}
                        placeholder="Please Select"
                        label="Class"
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name="teacher"
                        control={control}
                        options={teacherOptions}
                        defaultValue={type === 'update' && data?.teacher?._id}
                        placeholder="Please Select"
                        label="Teacher"
                    />
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Assigned Date</label>
                    <input
                        type="date"
                        placeholder="Assigned Date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("assignedDate")}
                        defaultValue={type === 'update' ? new Date(data?.assignedDate).toISOString().slice(0, 10) : ''}
                    />
                    {errors?.assignedDate && (
                        <p className="text-xs text-red-700 py-2">{errors?.assignedDate.message}</p>
                    )}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Due Date</label>
                    <input
                        type="date"
                        placeholder="Due Date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("dueDate")}
                        defaultValue={type === 'update' ? new Date(data?.dueDate).toISOString().slice(0, 10) : ''}
                    />
                    {errors?.dueDate && (
                        <p className="text-xs text-red-700 py-2">{errors?.dueDate.message}</p>
                    )}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    );
};

export default AssignmentForm;