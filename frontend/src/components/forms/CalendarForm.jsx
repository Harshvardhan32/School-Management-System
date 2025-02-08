import * as z from 'zod';
import { useEffect } from "react";
import SelectOption from "../common/SelectOption";
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllSubjects } from "../../services/operations/subjectAPI";
import { getAllTeachers } from '../../services/operations/teacherAPI';
import { createCalendar, updateCalendar } from "../../services/operations/calendarAPI";

// Zod schema for calendar form validation
const calendarSchema = z.object({
    classId: z.string().min(1, { message: 'Class is required!' }),
    dayOfWeek: z.string().min(1, { message: 'Week day is required!' }),
    schedule: z.array(
        z.object({
            type: z.enum(['class', 'break']),
            subject: z.string().optional().default(''),
            teacher: z.string().optional().default(''),
            startTime: z.string().min(1, { message: 'Start time is required!' }),
            endTime: z.string().min(1, { message: 'End time is required!' })
        }).refine(data => {
            const [startHour, startMinute] = data.startTime.split(':').map(Number);
            const [endHour, endMinute] = data.endTime.split(':').map(Number);

            const start = new Date(0, 0, 0, startHour, startMinute);
            const end = new Date(0, 0, 0, endHour, endMinute);
            return end > start;
        }, {
            message: 'End time must be after start time!',
            path: ['endTime'],
        })
    ).refine(data => data.length > 0, { message: 'At least one schedule must be added!' }),
});

const CalendarForm = ({ type, data, setOpen }) => {

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);

    // Fetch data for classes and subjects
    useEffect(() => {
        dispatch(getAllClasses(token));
        dispatch(getAllSubjects(token));
        dispatch(getAllTeachers(token));
    }, [dispatch, token]);

    const { allClasses } = useSelector((state) => state?.class);
    const { allSubjects } = useSelector((state) => state?.subject);
    const { allTeachers } = useSelector((state) => state?.teacher);

    // Zod form setup
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch, // Use watch to observe changes in schedule type
    } = useForm({
        resolver: zodResolver(calendarSchema),
        defaultValues: {
            classId: '',
            dayOfWeek: '',
            schedule: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedule",
    });

    useEffect(() => {
        if (type === 'update' && data) {
            // Reset form values for update mode
            reset({
                classId: data?.classId?._id,
                dayOfWeek: data?.dayOfWeek,
            });

            // Append schedule dynamically
            if (data.schedule && data.schedule.length > 0) {
                data.schedule.forEach((item) => {
                    append({
                        type: item.type || '',
                        subject: item.subject._id || '',
                        teacher: item.teacher._id || '',
                        startTime: item.startTime,
                        endTime: item.endTime,
                    });
                });
            }
        }
    }, [type, data, reset, append]);

    // Form submission handling
    const onSubmit = handleSubmit((formData) => {
        // Check each schedule and set subject to null if it's an empty string
        const updatedFormData = {
            ...formData,
            schedule: formData.schedule.map((item) => ({
                ...item,
                subject: item.subject === '' ? null : item.subject,
                teacher: item.teacher === '' ? null : item.teacher,
            })),
        };

        if (type === 'create') {
            dispatch(createCalendar(updatedFormData, token, setOpen));
        } else {
            updatedFormData.id = data._id;
            dispatch(updateCalendar(updatedFormData, token, setOpen));
        }
    });

    return (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">
                {type === 'create' ? 'Create a new' : 'Update the'} Calendar
            </h1>

            {/* Class and Day of the Week */}
            <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='classId'
                        control={control}
                        options={allClasses?.map((item) => ({
                            id: item?._id,
                            name: item?.className,
                        }))}
                        isDisabled={type === 'update'}
                        defaultValue={data?.classId}
                        placeholder='Select Class'
                        label='Class'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Day</label>
                    <select
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register('dayOfWeek')}
                        disabled={type === 'update'}
                        defaultValue={data?.dayOfWeek || ''}
                    >
                        <option value="">Please Select</option>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    {errors?.dayOfWeek && <p className="text-xs text-red-700 py-2">{errors?.dayOfWeek.message}</p>}
                </div>
            </div>

            {/* Schedule Inputs */}
            {fields?.length > 0 && fields?.map((schedule, index) => {
                return (
                    <div key={schedule.id} className='flex flex-col gap-4'>
                        <div className="flex justify-between items-center text-sm">
                            <h2 className="font-medium text-xl text-gray-950 dark:text-gray-200">Schedule {index + 1}</h2>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 text-sm"
                            >
                                Remove Schedule
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Schedule Type</label>
                                <select
                                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                    {...register(`schedule.${index}.type`)}
                                    defaultValue={schedule.type}
                                >
                                    <option value="class">Class</option>
                                    <option value="break">Break</option>
                                </select>
                            </div>

                            {/* Subject */}
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Subject</label>
                                <SelectOption
                                    name={`schedule.${index}.subject`}
                                    control={control}
                                    options={allSubjects?.map((subject) => ({
                                        id: subject?._id,
                                        name: subject?.subjectName + ' ' +
                                            subject?.classes?.map((classItem) => classItem?.className).join(', '),
                                    }))}
                                    isDisabled={watch('schedule')?.[index]?.type === 'break'}
                                    defaultValue={schedule.subject}
                                    placeholder='Select Subject'
                                />
                            </div>

                            {/* Teacher */}
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Teacher</label>
                                <SelectOption
                                    name={`schedule.${index}.teacher`}
                                    control={control}
                                    options={allTeachers?.map((teacher) => ({
                                        id: teacher?._id,
                                        name: teacher?.userId.firstName + ' ' + teacher?.userId.lastName + ' ' + teacher?.classes?.map((classItem) => classItem?.className).join(', '),
                                    }))}
                                    isDisabled={watch('schedule')?.[index]?.type === 'break'}
                                    defaultValue={schedule?.teacher}
                                    placeholder='Select Teacher'
                                />
                            </div>
                        </div>

                        <div className='flex flex-wrap gap-4'>
                            {/* Time */}
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Start Time</label>
                                <input
                                    type="time"
                                    {...register(`schedule.${index}.startTime`)}
                                    defaultValue={schedule?.startTime}
                                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                />
                                {errors?.schedule?.[index]?.startTime && <p className="text-xs text-red-700 py-2">{errors?.schedule?.[index]?.startTime.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">End Time</label>
                                <input
                                    type="time"
                                    {...register(`schedule.${index}.endTime`)}
                                    defaultValue={schedule?.endTime}
                                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                />
                                {errors?.schedule?.[index]?.endTime && <p className="text-xs text-red-700 py-2">{errors?.schedule?.[index]?.endTime.message}</p>}
                            </div>
                        </div>
                    </div>
                );
            })}

            {errors?.schedule && <p className="text-xs text-red-700">{errors?.schedule.message}</p>}

            {/* Button to Add Schedule */}
            <button
                type="button"
                onClick={() => append({ type: 'class', subject: '', startTime: '', endTime: '' })}
                className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px] mt-4"
            >
                Add Schedule
            </button>

            {/* Submit Button */}
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px] mt-4">
                {type === 'create' ? 'Create' : 'Update'} Calendar
            </button>
        </form>
    );
};

export default CalendarForm;