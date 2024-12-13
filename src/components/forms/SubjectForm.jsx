import * as z from 'zod';
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from "react-redux";
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllTeachers } from "../../services/operations/teacherAPI";
import { createSubject, updateSubject } from "../../services/operations/subjectAPI";
import { getAllLessons } from "../../services/operations/lessonAPI";
import MultiSelectComponent from "../MultiSelectComponent";

const SubjectForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        subjectName: z.string().min(1, { message: 'Subject name is required!' }),
        classes: z.array(z.string()).min(1, { message: 'Class is required!' }),
        teachers: z.array(z.string()).optional(),
        lessons: z.array(z.string()).optional(),
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            classes: type === 'update'
                ? data?.classes?.map((item) => item?._id) : [],
            teachers: type === 'update'
                ? data?.teachers?.map((teacher) => teacher?._id) : [],
            lessons: type === 'update'
                ? data?.lessons?.map((lesson) => lesson?._id) : [],
        },
    });

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    useEffect(() => {
        dispatch(getAllClasses(token, undefined, undefined, true));
        dispatch(getAllTeachers(token, undefined, undefined, true));
        dispatch(getAllLessons(token, undefined, undefined, true));
    }, []);

    const { allLessons } = useSelector(state => state?.lesson);
    const { allClasses } = useSelector(state => state?.class);
    const { allTeachers } = useSelector(state => state?.teacher);

    // Options for classes, teachers, and lessons
    const classOptions = useMemo(() => {
        return (allClasses?.map((item) => ({
            id: item?._id,
            name: item?.className,
        })) || []);
    }, [allClasses]);

    const teacherOptions = useMemo(() => {
        return (allTeachers?.map((item) => ({
            id: item?._id,
            name: item?.userId?.firstName + " " + item?.userId?.lastName,
        })) || []);
    }, [allTeachers]);

    const lessonOptions = useMemo(() => {
        return (allLessons?.map((item) => ({
            id: item?._id,
            name: item?.title,
        })) || []);
    }, [allLessons]);

    // Retrieve selected values from the form state
    const selectedClasses = type === 'update' && data?.classes.length > 0
        ? data.classes.map((item) => {
            return {
                id: item._id,
                name: item.className,
            }
        })
        : getValues("classes")?.map((id) =>
            classOptions.find((option) => option.id === id)
        );

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

    const selectedLessons = type === 'update' && data?.lessons.length > 0
        ? data?.lessons.map((lesson) => {
            return {
                id: lesson._id,
                name: lesson.title,
            }
        })
        : getValues("lessons")?.map((id) =>
            lessonOptions.find((option) => option.id === id)
        );

    const onSubmit = handleSubmit(formData => {
        console.log(formData);
        if (type === 'create') {
            dispatch(createSubject(formData, token, setOpen));
        } else {
            formData.id = data._id;
            dispatch(updateSubject(formData, token, setOpen));
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Subject</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Subject Name</label>
                    <input
                        type="text"
                        placeholder="Subject Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("subjectName")}
                        defaultValue={type === 'update' ? data?.subjectName : ''}
                    />
                    {errors?.subjectName && <p className="text-xs text-red-700 py-2">{errors?.subjectName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Class</label>
                    <MultiSelectComponent
                        options={classOptions}
                        selectedValue={selectedClasses}
                        setSelectedValue={(value) =>
                            setValue(
                                "classes",
                                value.map((item) => item.id)
                            )}
                    />
                    {errors?.classes && <p className="text-xs text-red-700 py-2">{errors?.classes.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Teacher</label>
                    <MultiSelectComponent
                        options={teacherOptions}
                        selectedValue={selectedTeachers}
                        setSelectedValue={(value) =>
                            setValue(
                                "teachers",
                                value.map((item) => item.id)
                            )}
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Lessons</label>
                    <MultiSelectComponent
                        options={lessonOptions}
                        selectedValue={selectedLessons}
                        setSelectedValue={(value) =>
                            setValue(
                                "lessons",
                                value.map((item) => item.id)
                            )}
                    />
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default SubjectForm;