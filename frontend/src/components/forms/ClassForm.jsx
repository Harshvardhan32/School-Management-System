import * as z from 'zod';
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import SelectOption from "../common/SelectOption";
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from "react-redux";
import MultiSelectComponent from "../MultiSelectComponent";
import { getAllTeachers } from "../../services/operations/teacherAPI";
import { getAllSubjects } from "../../services/operations/subjectAPI";
import { createClass, updateClass } from "../../services/operations/classAPI";

const ClassForm = ({ type, data, allData, setOpen }) => {

    // Memoized computation of allData based on the type
    allData = useMemo(() => {
        return type === 'update'
            ? allData.filter((item) => item !== data?.className) // Exclude current className if updating
            : allData;
    }, [type]);

    // Zod schema for form validation
    const schema = z.object({
        className: z.string()
            .min(1, { message: 'Class is required!' })
            .regex(/^\S+$/, { message: "Class must not contain spaces!" })
            .refine(
                (id) => !allData.map(element => element.toLowerCase()).includes(id.toLowerCase()),
                { message: "Class already exists!" }
            ),
        capacity: z.string().min(1, { message: 'Class capacity is required!' })
            .transform((val) => parseInt(val)),
        supervisor: z.string().optional(),
        teachers: z.array(z.string()).optional(),
        subjects: z.array(z.string()).optional(),
    });

    const {
        register,
        control,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            teachers: type === 'update'
                ? data?.teachers?.map((teacher) => teacher?._id) : [],
            subjects: type === 'update'
                ? data?.subjects?.map((subject) => subject?._id) : [],
        },
    });

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);

    useEffect(() => {
        dispatch(getAllTeachers(token));
        dispatch(getAllSubjects(token));
    }, [token]);

    const { allTeachers } = useSelector(state => state?.teacher);
    const { allSubjects } = useSelector(state => state?.subject);

    // Options for teachers, students, and subjects
    const teacherOptions = useMemo(() => {
        return allTeachers?.map((item) => ({
            id: item?._id,
            name: item?.userId.firstName + " " + item?.userId.lastName,
        })) || [];
    }, [allTeachers]);

    const subjectOptions = useMemo(() => {
        return allSubjects?.map((item) => ({
            id: item?._id,
            name: item?.subjectName,
        })) || [];
    }, [allSubjects]);

    // Retrieve selected values from the form state
    const selectedTeachers = type === 'update' && data?.teachers.length > 0
        ? data?.teachers.map((teacher) => {
            return {
                id: teacher._id,
                name: teacher.userId.firstName + " " + teacher.userId.lastName,
            }
        })
        : getValues("teachers")?.map((id) =>
            teacherOptions.find((option) => option.id === id)
        );

    const selectedSubjects = type === 'update' && data?.subjects.length > 0
        ? data?.subjects?.map((subject) => {
            return {
                id: subject?._id,
                name: subject?.subjectName,
            }
        })
        : getValues("subjects")?.map((id) =>
            subjectOptions.find((option) => option.id === id)
        );

    // Handle form submission
    const onSubmit = handleSubmit((formData) => {
        if (type === 'create') {
            dispatch(createClass(formData, token, setOpen));
        } else {
            formData.id = data._id;
            dispatch(updateClass(formData, token, setOpen));
        }
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">
                {type === 'create' ? 'Create a new' : 'Update the'} Class
            </h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Class Name</label>
                    <input
                        type="text"
                        placeholder="Class Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("className")}
                        defaultValue={type === 'update' ? data?.className : ''}
                    />
                    {errors?.className && <p className="text-xs text-red-700 py-2">{errors?.className.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Capacity</label>
                    <input
                        type="number"
                        placeholder="Capacity"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        {...register("capacity")}
                        defaultValue={type === 'update' ? data?.capacity : ''}
                    />
                    {errors?.capacity && <p className="text-xs text-red-700 py-2">{errors?.capacity.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='supervisor'
                        control={control}
                        options={teacherOptions}
                        defaultValue={type === 'update' && data?.supervisor ? data.supervisor._id : ''}
                        placeholder='Please Select'
                        label='Supervisor'
                    />
                </div>
            </div>
            <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Teachers</label>
                <MultiSelectComponent
                    options={teacherOptions}
                    selectedValue={selectedTeachers}
                    setSelectedValue={(value) =>
                        setValue(
                            "teachers",
                            value.map((item) => item.id)
                        )
                    }
                />
            </div>
            <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Subjects</label>
                <MultiSelectComponent
                    options={subjectOptions}
                    selectedValue={selectedSubjects}
                    setSelectedValue={(value) =>
                        setValue(
                            "subjects",
                            value.map((item) => item.id)
                        )
                    }
                />
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form >
    );
};

export default ClassForm;