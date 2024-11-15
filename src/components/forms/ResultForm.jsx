import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";
import SelectOption from "../common/SelectOption";

const ResultForm = ({ type, data }) => {

    const schema = z.object({
        student: z.string().min(1, { message: 'Student is required!' }),
        classId: z.string().min(1, { message: 'Class is required!' }),
        subject: z.string().min(1, { message: 'Subject is required!' }),
        exam: z.string().min(1, { message: 'Exam is required!' }),
        score: z.string().min(1, { message: 'Score is required!' }).transform((val) => parseFloat(val)),
        maxScore: z.string().min(1, { message: 'Max Score is required!' }).transform((val) => parseFloat(val)),
        percentage: z.string().min(1, { message: 'Percentage is required!' }).transform((val) => parseFloat(val)),
        grade: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], { message: 'Grade is required!' }),
        finalGrade: z.string().min(1, { message: 'Final Grade is required!' }),
        overallPercentage: z.string().min(1, { message: 'Overall Percentage is required!' }).transform((val) => parseFloat(val)),
        remarks: z.string().optional().default('')
    });

    const {
        register,
        control,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
    });

    const students = [
        { value: '603d2149e5f4d32f948c4567', label: 'John Doe' },
        { value: '603d2149e5f4d32f948c4568', label: 'Jane Smith' },
        { value: '603d2149e5f4d32f948c4569', label: 'Michael Johnson' },
        { value: '603d2149e5f4d32f948c4570', label: 'Emily Davis' },
        { value: '603d2149e5f4d32f948c4571', label: 'Christopher Brown' },
        { value: '603d2149e5f4d32f948c4572', label: 'Jessica Wilson' },
        { value: '603d2149e5f4d32f948c4573', label: 'David Martinez' },
        { value: '603d2149e5f4d32f948c4574', label: 'Sarah Anderson' },
        { value: '603d2149e5f4d32f948c4575', label: 'James Taylor' },
        { value: '603d2149e5f4d32f948c4576', label: 'Patricia Thomas' },
        { value: '603d2149e5f4d32f948c4577', label: 'Robert Jackson' },
        { value: '603d2149e5f4d32f948c4578', label: 'Linda White' },
        { value: '603d2149e5f4d32f948c4579', label: 'Daniel Harris' },
        { value: '603d2149e5f4d32f948c4580', label: 'Barbara Lewis' },
        { value: '603d2149e5f4d32f948c4581', label: 'Matthew Clark' },
    ];

    const classes = [
        { value: 'class-1', label: 'Class 1' },
        { value: 'class-2', label: 'Class 2' },
        { value: 'class-3', label: 'Class 3' },
        { value: 'class-4', label: 'Class 4' },
        { value: 'class-5', label: 'Class 5' },
        { value: 'class-6', label: 'Class 6' },
        { value: 'class-7', label: 'Class 7' },
        { value: 'class-8', label: 'Class 8' },
        { value: 'class-9', label: 'Class 9' },
        { value: 'class-10', label: 'Class 10' },
        { value: 'class-11', label: 'Class 11' }
    ];

    const subjects = [
        { value: 'math', label: 'Mathematics' },
        { value: 'science', label: 'Science' },
        { value: 'history', label: 'History' },
        { value: 'english', label: 'English Language Arts' },
        { value: 'geography', label: 'Geography' },
        { value: 'physics', label: 'Physics' },
        { value: 'chemistry', label: 'Chemistry' },
        { value: 'biology', label: 'Biology' },
        { value: 'art', label: 'Art' },
        { value: 'music', label: 'Music' },
        { value: 'pe', label: 'Physical Education' },
        { value: 'computer-science', label: 'Computer Science' },
    ];

    const exams = [
        { value: 'mid-term', label: 'Mid Term' },
        { value: 'final', label: 'Final' },
        { value: 'quiz-1', label: 'Quiz 1' },
        { value: 'quiz-2', label: 'Quiz 2' },
        { value: 'unit-test', label: 'Unit Test' },
        { value: 'pop-quiz', label: 'Pop Quiz' },
        { value: 'oral-exam', label: 'Oral Exam' },
        { value: 'practical', label: 'Practical Exam' },
        { value: 'project', label: 'Project Assessment' },
        { value: 'monthly-test', label: 'Monthly Test' },
        { value: 'semester-1', label: 'Semester 1' },
        { value: 'semester-2', label: 'Semester 2' },
    ];

    // const percentageHandler = () => {
    //     const score = getValues('score');
    //     const maxScore = getValues('maxScore');
    //     if (score && maxScore) {
    //         const percentage = (score * 100) / maxScore;
    //         setValue('percentage', percentage);
    //     }
    // }

    const onSubmit = (data) => {
        if (data?.score > data?.maxScore) {
            toast.error('Score must be smaller than max score.')
            return;
        }

        const percentage = ((data?.score * 100) / data?.maxScore).toFixed(2);
        if (percentage != data?.percentage.toFixed(2)) {
            toast.error(`Percentage should be ${percentage}`);
            return;
        }

        const result = {
            student: data?.student,
            classId: data?.classId,
            subjectResults: [
                {
                    subject: data?.subject,
                    examResults: [
                        {
                            exam: data?.exam,
                            score: data?.score,
                            maxScore: data?.maxScore,
                            percentage: data?.percentage,
                            grade: data?.grade
                        }
                    ],
                    finalGrade: data?.finalGrade
                }
            ],
            overallPercentage: data?.overallPercentage,
            remarks: data?.remarks,
        }
        console.log('Result Data:', result);
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
                        name='classId'
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
                        type="number"
                        placeholder="Score"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        {...register("score")}
                    />
                    {errors?.score && <p className="text-xs text-red-700 py-2">{errors?.score.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Max Score</label>
                    <input
                        type="number"
                        placeholder="Max Score"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        {...register("maxScore")}
                    />
                    {errors?.maxScore && <p className="text-xs text-red-700 py-2">{errors?.maxScore.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Percentage</label>
                    <input
                        type="number"
                        step="any"  // This allows any decimal value
                        placeholder="Percentage"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        {...register("percentage")}
                    />
                    {errors?.percentage && <p className="text-xs text-red-700 py-2">{errors?.percentage.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Grade</label>
                    <select
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("grade")}
                    >
                        <option value="" >Please Select</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                    </select>
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
                    <label className="text-sm text-gray-500">Overall Percentage</label>
                    <input
                        type="number"
                        step="any"  // This allows any decimal value
                        placeholder="Overall Percentage"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        {...register("overallPercentage")}
                    />
                    {errors?.overallPercentage && <p className="text-xs text-red-700 py-2">{errors?.overallPercentage.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Remark</label>
                    <textarea
                        rows={2}
                        placeholder="Remark"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("remarks")}
                    />
                    {errors?.remarks && <p className="text-xs text-red-700 py-2">{errors?.remarks.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
};

export default ResultForm;