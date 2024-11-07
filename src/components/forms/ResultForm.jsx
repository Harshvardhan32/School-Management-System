import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";
import SelectOption from "../common/SelectOption"; // Adjust the path as necessary
import { ThemeContext } from '../../utils/ThemeContext';

const ResultForm = ({ data, type }) => {

    const schema = z.object({
        student: z.string().min(1, { message: 'Student is required!' }),
        class: z.string().min(1, { message: 'Class is required!' }),
        subject: z.string().min(1, { message: 'Subject is required!' }),
        exam: z.string().min(1, { message: 'Exam is required!' }),
        score: z.string().min(1, { message: 'Score is required!' }),
        maxScore: z.string().min(1, { message: 'Max Score is required!' }),
        percentage: z.string().min(1, { message: 'Percentage is required!' }),
        grade: z.string().min(1, { message: 'Grade is required!' }),
        finalGrade: z.string().min(1, { message: 'Final Grade is required!' }),
        totalPercentage: z.string().min(1, { message: 'Total Percentage is required!' }),
        remark: z.string()
    });

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const students = [
        { value: '603d2149e5f4d32f948c4567', label: 'John Doe' },
        { value: '603d2149e5f4d32f948c4568', label: 'Jane Smith' },
        // Add more students as needed
    ];

    const classes = [
        { value: 'class-1', label: 'Class 1' },
        { value: 'class-2', label: 'Class 2' },
        // Add more classes as needed
    ];

    const subjects = [
        { value: 'math', label: 'Mathematics' },
        { value: 'science', label: 'Science' },
        // Add more subjects as needed
    ];

    const exams = [
        { value: 'Mid Term', label: 'Mid Term' },
        { value: 'Final', label: 'Final' },
    ];

    const onSubmit = (data) => {
        console.log('Submitted Data:', data);
        toast.success(`Result ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    };

    return (
        <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update'} Result</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='student'
                        control={control}
                        options={students}
                        placeholder='Please Select'
                        label='Student'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='class'
                        control={control}
                        options={classes}
                        placeholder='Please Select'
                        label='Class'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='subject'
                        control={control}
                        options={subjects}
                        placeholder='Please Select'
                        label='Subject'
                    />
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='exam'
                        control={control}
                        options={exams}
                        placeholder='Please Select'
                        label='Exam'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Score</label>
                    <input
                        type="text"
                        placeholder="Score"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("score")}
                    />
                    {errors?.score && <p className="text-xs text-red-700 py-2">{errors?.score.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Max Score</label>
                    <input
                        type="text"
                        placeholder="Max Score"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("maxScore")}
                    />
                    {errors?.maxScore && <p className="text-xs text-red-700 py-2">{errors?.maxScore.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Percentage</label>
                    <input
                        type="text"
                        placeholder="Percentage"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("percentage")}
                    />
                    {errors?.percentage && <p className="text-xs text-red-700 py-2">{errors?.percentage.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Grade</label>
                    <input
                        type="text"
                        placeholder="Grade"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("grade")}
                    />
                    {errors?.grade && <p className="text-xs text-red-700 py-2">{errors?.grade.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Final Grade</label>
                    <input
                        type="text"
                        placeholder="Final Grade"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("finalGrade")}
                    />
                    {errors?.finalGrade && <p className="text-xs text-red-700 py-2">{errors?.finalGrade.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Total Percentage</label>
                    <input
                        type="text"
                        placeholder="Total Percentage"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("totalPercentage")}
                    />
                    {errors?.totalPercentage && <p className="text-xs text-red-700 py-2">{errors?.totalPercentage.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Remark</label>
                    <textarea
                        rows={2}
                        placeholder="Remark"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("remark")}
                    />
                    {errors?.remark && <p className="text-xs text-red-700 py-2">{errors?.remark.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
};

export default ResultForm;