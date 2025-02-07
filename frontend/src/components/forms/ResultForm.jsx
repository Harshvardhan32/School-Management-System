import * as z from 'zod';
import toast from 'react-hot-toast';
import Select from 'react-select';
import customStyles from '../../utils/CustomStyles';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../utils/ThemeContext';
import { useForm, useFieldArray } from 'react-hook-form';
import { getAllExams } from '../../services/operations/examAPI';
import { getAllSubjects } from '../../services/operations/subjectAPI';
import { getAllStudents } from '../../services/operations/studentAPI';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createResult, updateResult } from '../../services/operations/resultAPI';

const ResultForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        student: z.string().min(1, { message: 'Student is required!' }),
        subjectResults: z.array(
            z.object({
                subject: z.string().min(1, { message: 'Subject is required!' }),
                examResults: z
                    .array(z.object({
                        exam: z.string().min(1, { message: 'Exam is required!' }),
                        score: z.string().min(1, { message: 'Score is required!' })
                            .refine((val) => parseFloat(val) >= 0, { message: 'Score must be non-negative!' }),
                        maxScore: z.string().min(1, { message: 'Max score is required!' })
                            .refine((val) => parseFloat(val) > 0, { message: 'Max Score must be greater than zero!' }),
                        percentage: z.string().refine(
                            (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
                            { message: 'Percentage must be between 0 and 100!' }),
                        grade: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], { message: 'Grade is required!' }),
                    }).refine(
                        (data) => parseFloat(data.score) <= parseFloat(data.maxScore),
                        {
                            message: 'Max score must be greater than or equal to score!',
                            path: ['maxScore'],
                        }
                    )).min(1, { message: 'At least one exam result is required!' }),
                subjectGrade: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], { message: 'Subject grade is required!' }),
            })
        ).min(1, { message: 'At least one subject result is required!' }),
        overallPercentage: z.string().min(1, { message: 'Overall percentage is required!' })
            .refine((val) => parseFloat(val) >= 0 && parseFloat(val) <= 100, {
                message: 'Overall percentage must be between 0 and 100!',
            }),
        remarks: z.string().optional().default(''),
    });

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        getValues,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            student: '',
            classId: '',
            subjectResults: [],
            overallPercentage: '',
        },
    });

    const {
        fields: subjectFields,
        append: appendSubject,
        remove: removeSubject,
    } = useFieldArray({
        control,
        name: 'subjectResults',
    })

    useEffect(() => {
        if (type === 'update' && data) {
            // Reset other fields
            reset({
                student: data?.student?._id || '',
                classId: data?.classId?._id || '',
                overallPercentage: data?.overallPercentage || '',
                remarks: data?.remarks || '',
            });

            // Append subject results dynamically
            if (data?.subjectResults && data?.subjectResults.length > 0) {
                data?.subjectResults.forEach((subjectResult) => {
                    appendSubject({
                        subject: subjectResult?.subject?._id || '',
                        examResults: subjectResult?.examResults?.map((exam) => ({
                            exam: exam?.exam?._id || '',
                            score: exam?.score || '',
                            maxScore: exam?.maxScore || '',
                            percentage: exam?.percentage || '',
                            grade: exam?.grade || '',
                        })) || [],
                        subjectGrade: subjectResult?.subjectGrade || '',
                    });
                });
            }
        }
    }, [type, data, reset, appendSubject]);

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);
    const { darkMode } = useContext(ThemeContext);

    useEffect(() => {
        dispatch(getAllStudents(token));
        dispatch(getAllSubjects(token));
        dispatch(getAllExams(token));
    }, [dispatch, token]);

    const { allStudents } = useSelector((state) => state?.student);
    const { allSubjects } = useSelector((state) => state?.subject);
    const { allExams } = useSelector((state) => state?.exam);

    const removeExam = (subjectIndex, examIndex) => {
        const examResults = getValues(`subjectResults[${subjectIndex}].examResults`);
        examResults.splice(examIndex, 1);
        setValue(`subjectResults[${subjectIndex}].examResults`, [...examResults]);
    }

    const handleAddExam = (subjectIndex) => {
        const examArray = getValues(`subjectResults[${subjectIndex}].examResults`);
        if (examArray?.length >= 3) {
            toast.error('Maximum 3 exams per subject allowed!');
            return;
        }
        setValue(`subjectResults[${subjectIndex}].examResults`, [
            ...examArray,
            { exam: '', score: '', maxScore: '', percentage: '', grade: '' },
        ]);
    }

    const studentOptions = useMemo(() =>
        allStudents?.map((item) => ({
            value: item?._id,
            label: `${item?.userId?.firstName || ''} ${item?.userId?.lastName || ''} ${item.classId.className}`,
        })), [allStudents]);

    const subjectOptions = useMemo(() =>
        allSubjects?.map((item) => ({
            value: item?._id,
            label: item?.subjectName,
        })), [allSubjects]);

    const examOptions = useMemo(() =>
        allExams?.map((item) => ({
            value: item?._id,
            label: item?.examName,
        })), [allExams]);

    const onSubmit = (formData) => {
        let valid = true;

        // Check for duplicate subjects
        const subjectIds = formData.subjectResults.map((item) => item.subject);
        const uniqueSubjectIds = new Set(subjectIds);

        if (uniqueSubjectIds.size !== subjectIds.length) {
            toast.error('Duplicate subjects are not allowed!');
            valid = false;
        }

        // Check for duplicate exams within each subject
        formData.subjectResults.forEach((subjectResult, subjectIndex) => {
            const examIds = subjectResult.examResults.map((examResult) => examResult.exam);
            const uniqueExamIds = new Set(examIds);
            if (uniqueExamIds.size !== examIds.length) {
                toast.error(`Subject ${subjectIndex + 1}: Duplicate exams are not allowed!`);
                valid = false;
            }
        });

        // Validate individual exam percentages and overall percentage
        const subjectResults = getValues('subjectResults');
        let totalScore = 0;
        let totalMaxScore = 0;

        subjectResults.forEach((subject, subjectIndex) => {
            subject.examResults.forEach((exam, examIndex) => {
                const score = parseFloat(exam.score || 0);
                const maxScore = parseFloat(exam.maxScore || 0);

                // Calculate total scores for overall percentage
                totalScore += score;
                totalMaxScore += maxScore;

                // Validate individual exam percentage
                if (maxScore > 0) {
                    const calculatedExamPercentage = ((score / maxScore) * 100).toFixed(2);
                    if (calculatedExamPercentage !== parseFloat(exam.percentage).toFixed(2)) {
                        toast.error(
                            `Subject ${subjectIndex + 1}, Exam ${examIndex + 1}: Percentage must be ${calculatedExamPercentage}`
                        );
                        valid = false;
                    }
                }
            });
        });

        // Validate overall percentage
        const calculatedOverallPercentage = ((totalScore / totalMaxScore) * 100).toFixed(2);
        if (calculatedOverallPercentage !== parseFloat(getValues('overallPercentage')).toFixed(2)) {
            toast.error(`Overall Percentage must be ${calculatedOverallPercentage}`);
            valid = false;
        }

        // Prevent submission if any validation failed
        if (!valid) return;

        // Map the student data to retrieve classId
        const selectedData = allStudents.filter((student) => student?._id === formData.student);
        formData.classId = selectedData[0]?.classId._id;

        // Display success message and dispatch create/update action
        if (type === 'create') {
            dispatch(createResult(formData, token, setOpen));
        } else {
            formData.id = data._id;
            dispatch(updateResult(formData, token, setOpen));
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <h1 className="text-xl font-semibold text-black dark:text-gray-200">
                {type === 'create' ? 'Create a new' : 'Update the'} Result
            </h1>

            {/* Student Selection */}
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="min-w-[150px] flex flex-col gap-2 flex-1">
                    <label className='text-sm text-gray-500'>Student</label>
                    <Select
                        options={studentOptions}
                        value={studentOptions?.find((option) => option.value === watch('student')) || null}
                        onChange={(selected) => setValue('student', selected?.value)}
                        placeholder="Select Student"
                        isDisabled={type === 'update'}
                        styles={customStyles(darkMode)}
                    />
                    {errors?.student && <span className="text-xs text-red-700 py-2">{errors.student?.message}</span>}
                </div>

                {/* Overall Percentage */}
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Overall Percentage</label>
                    <input
                        type="number"
                        placeholder="Overall Percentage"
                        {...register('overallPercentage')}
                        step={0.01}
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                    />
                    {errors?.overallPercentage && <span className="text-xs text-red-700 py-2">{errors.overallPercentage?.message}</span>}
                </div>

                {/* Remarks */}
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Remarks</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        placeholder="Remarks"
                        {...register('remarks')}
                    />
                </div>
            </div>

            {/* Add Subject Button */}
            <button
                type="button"
                onClick={() => appendSubject({ subject: '', examResults: [], subjectGrade: '' })}
                className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]"
            >
                Add Subject
            </button>

            {/* Subject error message */}
            {errors?.subjectResults && <span className="text-xs text-red-700">{errors?.subjectResults.message}</span>}

            {/* Subject Results */}
            {subjectFields?.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-sm">
                        <h2 className="font-medium text-xl text-gray-950 dark:text-gray-200">Subject {index + 1}</h2>
                        <button type="button" onClick={() => removeSubject(index)} className="text-base text-red-600">Remove Subject</button>
                    </div>

                    <div className="flex flex-wrap flex-1 justify-between gap-4">
                        <div className="min-w-[150px] flex flex-col gap-2 flex-1">
                            <label className="text-sm text-gray-500">Subject</label>
                            <Select
                                options={subjectOptions}
                                value={subjectOptions?.find((option) => option.value === watch(`subjectResults[${index}].subject`))}
                                onChange={(selected) => setValue(`subjectResults[${index}].subject`, selected?.value)}
                                placeholder="Select Subject"
                                styles={customStyles(darkMode)}
                            />
                            {errors?.subjectResults?.[index]?.subject && <span className="text-xs text-red-700 py-2">{errors?.subjectResults[index]?.subject?.message}</span>}
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-sm text-gray-500">Subject Grade</label>
                            <select
                                {...register(`subjectResults[${index}].subjectGrade`)}
                                className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            >
                                <option value="">Select Grade</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                                <option value="F">F</option>
                            </select>
                            {errors?.subjectResults?.[index] && <span className="text-xs text-red-700 py-2">{errors?.subjectResults[index]?.subjectGrade?.message}</span>}
                        </div>
                    </div>

                    {/* Add Exam Button */}
                    <button type="button" onClick={() => handleAddExam(index)} className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]"
                    >
                        Add Exam
                    </button>

                    {/* Exam result error message */}
                    {errors?.subjectResults?.[index]?.examResults && <span className="text-xs text-red-700">{errors?.subjectResults[index]?.examResults?.message}</span>}

                    {/* Exam Results */}
                    {watch(`subjectResults[${index}].examResults`)?.map((exam, examIndex) => (
                        <div key={examIndex} className="flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <h2 className="font-medium text-xl text-gray-950 dark:text-gray-200">Exam {examIndex + 1}</h2>
                                <button
                                    type="button"
                                    onClick={() => removeExam(index, examIndex)}
                                    className="text-base text-red-600"
                                >
                                    Remove Exam
                                </button>
                            </div>

                            <div className='flex flex-wrap flex-1 justify-between gap-4'>
                                <div className="min-w-[150px] flex flex-col flex-1 gap-2">
                                    <label className="text-sm text-gray-500">Exam</label>
                                    <Select
                                        options={examOptions}
                                        value={examOptions?.find((option) => option.value === exam.exam)}
                                        onChange={(selected) =>
                                            setValue(`subjectResults[${index}].examResults[${examIndex}].exam`, selected?.value)
                                        }
                                        placeholder="Select Exam"
                                        styles={customStyles(darkMode)}
                                    />
                                    {errors?.subjectResults?.[index]?.examResults?.[examIndex]?.exam && (
                                        <span className="text-xs text-red-700 py-2">{errors?.subjectResults?.[index]?.examResults?.[examIndex]?.exam?.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 gap-2">
                                    <label className="text-sm text-gray-500">Score</label>
                                    <input
                                        type="text"
                                        placeholder="Score"
                                        {...register(`subjectResults[${index}].examResults[${examIndex}].score`)}
                                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                                    />
                                    {errors?.subjectResults?.[index]?.examResults?.[examIndex]?.score && (
                                        <span className="text-xs text-red-700 py-2">{errors?.subjectResults?.[index]?.examResults?.[examIndex]?.score?.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 gap-2">
                                    <label className="text-sm text-gray-500">Max Score</label>
                                    <input
                                        type="text"
                                        placeholder="Max Score"
                                        {...register(`subjectResults[${index}].examResults[${examIndex}].maxScore`)}
                                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                                    />
                                    {errors?.subjectResults?.[index]?.examResults?.[examIndex]?.maxScore && (
                                        <span className="text-xs text-red-700 py-2">{errors?.subjectResults?.[index]?.examResults?.[examIndex]?.maxScore?.message}</span>
                                    )}
                                </div>
                            </div>

                            <div className='flex flex-wrap flex-1 justify-between gap-4'>
                                <div className="flex flex-col flex-1 gap-2">
                                    <label className="text-sm text-gray-500">Percentage</label>
                                    <input
                                        type="text"
                                        placeholder="Percentage"
                                        {...register(`subjectResults[${index}].examResults[${examIndex}].percentage`)}
                                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                                    />
                                    {errors?.subjectResults?.[index]?.examResults?.[examIndex]?.percentage && (
                                        <span className="text-xs text-red-700 py-2">
                                            {errors?.subjectResults?.[index]?.examResults?.[examIndex]?.percentage?.message}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-[150px] flex flex-col flex-1 gap-2">
                                    <label className="text-sm text-gray-500">Grade</label>
                                    <select
                                        {...register(`subjectResults[${index}].examResults[${examIndex}].grade`)}
                                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                    >
                                        <option value="">Select Grade</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                        <option value="F">F</option>
                                    </select>
                                    {errors?.subjectResults?.[index]?.examResults?.[examIndex]?.grade && (
                                        <span className="text-xs text-red-700 py-2">{errors?.subjectResults?.[index]?.examResults?.[examIndex]?.grade?.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]"
            >
                {type === 'create' ? 'Create Result' : 'Update Result'}
            </button>
        </form>
    );
}

export default ResultForm;