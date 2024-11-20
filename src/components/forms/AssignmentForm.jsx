import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";
import SelectOption from "../common/SelectOption";
import { useDispatch, useSelector } from "react-redux";
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllSubjects } from "../../services/operations/subjectAPI";
import { getAllTeachers } from "../../services/operations/teacherAPI";
import { useEffect, useMemo } from "react";
import { createAssignment } from "../../services/operations/assignmentAPI";
import * as z from 'zod';

const AssignmentForm = ({ type, data, setOpen }) => {

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
        resolver: zodResolver(schema)
    });

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);

    useEffect(() => {
        dispatch(getAllSubjects(token));
        dispatch(getAllClasses(token));
        dispatch(getAllTeachers(token));
    }, []);

    const { teachers } = useSelector(state => state?.user);
    const { classes } = useSelector(state => state?.class);
    const { subjects } = useSelector(state => state?.subject);

    // Options for Subjects, Classs, and Teachers
    const subjectOptions = useMemo(() => {
        return subjects?.map((item) => ({
            id: item?._id,
            name: item?.subjectName,
        })) || [];
    }, [subjects]);

    const classOptions = useMemo(() => {
        return classes?.map((item) => ({
            id: item?._id,
            name: item?.className,
        })) || [];
    }, [classes]);

    const teacherOptions = useMemo(() => {
        return teachers?.map((item) => ({
            id: item?._id,
            name: item?.userId.firstName + " " + item?.userId.lastName,
        })) || [];
    }, [teachers]);

    const onSubmit = handleSubmit(formData => {
        const start = new Date(formData?.assignedDate);
        const end = new Date(formData?.dueDate);
        if (end < start) {
            toast.error('Due date must be later than assigned date!');
            return;
        }

        if (type === 'create') {
            dispatch(createAssignment(formData, token, setOpen));
        } else {
            // console.log("Form Data: ", formData);
        }
        console.log(formData);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Assignment</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='subject'
                        control={control}
                        options={subjectOptions}
                        placeholder='Please Select'
                        label='Subject'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='classId'
                        control={control}
                        options={classOptions}
                        placeholder='Please Select'
                        label='Class'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='teacher'
                        control={control}
                        options={teacherOptions}
                        placeholder='Please Select'
                        label='Teacher'
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
                    />
                    {errors?.assignedDate && <p className="text-xs text-red-700 py-2">{errors?.assignedDate.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Due Date</label>
                    <input
                        type="date"
                        placeholder="Due Date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("dueDate")}
                    />
                    {errors?.dueDate && <p className="text-xs text-red-700 py-2">{errors?.dueDate.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form >
    );
}

export default AssignmentForm;