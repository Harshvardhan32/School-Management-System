import * as z from 'zod';
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from "react-redux";
import MultiSelectComponent from "../MultiSelectComponent";
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllSubjects } from "../../services/operations/subjectAPI";
import { createExam, updateExam } from "../../services/operations/examAPI";

const ExamForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        examName: z.string().min(1, { message: 'Exam title is required!' }),
        description: z.string().min(10, { message: 'Exam description must be atleast 10 character!' }),
        startDate: z.string().min(1, { message: 'Start date is required!' }),
        endDate: z.string().min(1, { message: 'End date is required!' }),
        subjects: z.array(z.string()).min(1, { message: 'At least one subject must be selected!' }),
        classes: z.array(z.string()).min(1, { message: 'At least one class must be selected!' }),
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            subjects: type === 'update'
                ? data?.subjects?.map((subject) => subject?._id) : [],
            classes: type === 'update'
                ? data?.classes?.map((item) => item?._id) : [],
        }
    });

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);

    useEffect(() => {
        dispatch(getAllSubjects(token));
        dispatch(getAllClasses(token));
    }, [token]);

    const { allSubjects } = useSelector(state => state?.subject);
    const { allClasses } = useSelector(state => state?.class);

    const subjectOptions = useMemo(() => {
        return (allSubjects?.map((item) => ({
            id: item?._id,
            name: item?.subjectName + ' ' +
                item?.classes?.map((classItem) => classItem?.className).join(', '),
        })) || []);
    }, [allSubjects]);

    const classOptions = useMemo(() => {
        return (allClasses?.map((item) => ({
            id: item?._id,
            name: item?.className,
        })) || []);
    }, [allClasses]);

    const selectedSubjects = type === 'update' && data?.subjects.length > 0
        ? data?.subjects?.map((subject) => {
            return {
                id: subject?._id,
                name: subject?.subjectName + ' ' +
                    subject?.classes?.map((classItem) => classItem?.className).join(', '),
            }
        })
        : getValues("subjects")?.map((id) =>
            subjectOptions?.find((option) => option.id === id)
        );

    const selectedClasses = type === 'update' && data?.classes.length > 0
        ? data?.classes?.map((item) => {
            return {
                id: item?._id,
                name: item?.className,
            }
        })
        : getValues("classes")?.map((id) =>
            classOptions?.find((option) => option.id === id)
        );

    const onSubmit = handleSubmit(formData => {
        const start = new Date(formData?.startDate);
        const end = new Date(formData?.endDate);

        if (end <= start) {
            toast.error('End date must be later than start date!');
            return;
        }

        if (type === 'create') {
            dispatch(createExam(formData, token, setOpen));
        } else {
            formData.id = data._id;
            dispatch(updateExam(formData, token, setOpen));
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update'} Exam</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Exam Name</label>
                    <input
                        type="text"
                        placeholder="Exam Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("examName")}
                        defaultValue={type === 'update' ? data?.examName : ''}
                    />
                    {errors?.examName && <p className="text-xs text-red-700 py-2">{errors?.examName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Start Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("startDate")}
                        defaultValue={type === 'update' ? new Date(data?.startDate).toISOString().slice(0, 16) : ''}
                    />
                    {errors?.startDate && <p className="text-xs text-red-700 py-2">{errors?.startDate.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">End Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("endDate")}
                        defaultValue={type === 'update' ? new Date(data?.endDate).toISOString().slice(0, 16) : ''}
                    />
                    {errors?.endDate && <p className="text-xs text-red-700 py-2">{errors?.endDate.message}</p>}
                </div>
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
                {errors?.subjects && <p className="text-xs text-red-700 py-2">{errors?.subjects.message}</p>}
            </div>
            <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Classes</label>
                <MultiSelectComponent
                    options={classOptions}
                    selectedValue={selectedClasses}
                    setSelectedValue={(value) =>
                        setValue(
                            "classes",
                            value.map((item) => item.id)
                        )
                    }
                />
                {errors?.classes && <p className="text-xs text-red-700 py-2">{errors?.classes.message}</p>}
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Description</label>
                <textarea
                    name=""
                    placeholder="Description..."
                    rows={3}
                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    {...register("description")}
                    defaultValue={type === 'update' ? data?.description : ''}
                ></textarea>
                {errors?.description && <p className="text-xs text-red-700 py-2">{errors?.description.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default ExamForm;