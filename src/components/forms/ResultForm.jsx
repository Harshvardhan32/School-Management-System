import * as z from 'zod';
import React, { useContext, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStudents } from '../../services/operations/studentAPI';
import { getAllClasses } from '../../services/operations/classAPI';
import { getAllSubjects } from '../../services/operations/subjectAPI';
import { getAllExams } from '../../services/operations/examAPI';
import { ThemeContext } from '../../utils/ThemeContext';
import customStyles from '../../utils/CustomStyles';
import { createResult, updateResult } from '../../services/operations/resultAPI';

const ResultForm = ({ type, data, setOpen }) => {

    const schema = z.object({
        student: z.string().min(1, { message: 'Student is required!' }),
        subjectResults: z.array(
            z.object({
                subject: z.string().min(1, { message: 'Subject is required!' }),
                examResults: z
                    .array(
                        z.object({
                            exam: z.string().min(1, { message: 'Exam is required!' }),
                            score: z
                                .string()
                                .refine((val) => parseFloat(val) >= 0, { message: 'Score must be non-negative!' }),
                            maxScore: z
                                .string()
                                .refine((val) => parseFloat(val) > 0, { message: 'Max Score must be greater than zero!' })
                                .refine(
                                    (val, ctx) => parseFloat(val) > parseFloat(ctx?.parent?.score || 0),
                                    { message: 'Max Score must be greater than Score!' }
                                ),
                            percentage: z
                                .string()
                                .refine(
                                    (val) => parseFloat(val) >= 0 && parseFloat(val) <= 100,
                                    { message: 'Percentage must be between 0 and 100!' }
                                ),
                            grade: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], { message: 'Invalid grade!' }),
                        })
                    )
                    .min(1, { message: 'At least one exam result is required!' }),
                subjectGrade: z.enum(['A', 'B', 'C', 'D', 'E', 'F'], { message: 'Subject grade is required!' }),
            })
        ).min(1, { message: 'At least one subject result is required!' }),
        overallPercentage: z
            .string().min(1, { message: 'Overall percentage is required!' })
            .refine((val) => parseFloat(val) >= 0 && parseFloat(val) <= 100, {
                message: 'Overall percentage must be between 0 and 100!',
            }),
        remarks: z.string().optional().default(''),
    });

    const { register, control, handleSubmit, setValue, reset, watch, getValues, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            student: '',
            classId: '',
            subjectResults: [],
            overallPercentage: '',
        },
    });

    useEffect(() => {
        if (type === 'update' && data) {
            reset({
                student: data.student?._id || '',
                classId: data.classId?._id || '',
                subjectResults: data.subjectResults?.map((result) => ({
                    subject: result.subject?._id || '',
                    examResults: result.examResults?.map((item) => ({
                        exam: item.exam?._id || '',
                        score: item.score || '',
                        maxScore: item.maxScore || '',
                        percentage: item.percentage || '',
                        grade: item.grade || '',
                    })) || [],
                    subjectGrade: result.subjectGrade || '',
                })) || [],
                overallPercentage: data.overallPercentage || '',
                remarks: data.remarks || '',
            });
        }
    }, [type, data, reset]);

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

    const {
        fields: subjectFields,
        append: appendSubject,
        remove: removeSubject,
    } = useFieldArray({
        control,
        name: 'subjectResults',
    });

    const removeExam = (subjectIndex, examIndex) => {
        const examResults = getValues(`subjectResults[${subjectIndex}].examResults`);
        examResults.splice(examIndex, 1);
        setValue(`subjectResults[${subjectIndex}].examResults`, [...examResults]);
    };

    const handleAddExam = (subjectIndex) => {
        const examArray = getValues(`subjectResults[${subjectIndex}].examResults`);
        if (examArray?.length >= 5) {
            toast.error('Maximum 5 exams per subject allowed!');
            return;
        }
        setValue(`subjectResults[${subjectIndex}].examResults`, [
            ...examArray,
            { exam: '', score: '', maxScore: '', percentage: '', grade: '' },
        ]);
    };

    const onSubmit = (formData) => {
        let valid = true;

        formData.subjectResults.forEach((subjectResult, subjectIndex) => {
            if (subjectResult.examResults.length === 0) {
                toast.error(`Subject ${subjectIndex + 1} must have at least one exam!`);
                valid = false;
            }
        });

        if (!valid) return;

        const selectedData = allStudents.filter((student) => student?._id === formData.student);

        formData.classId = selectedData[0]?.classId._id;
        toast.success(`Result ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);

        if (type === 'create') {
            dispatch(createResult(formData, token, setOpen));
        } else {
            dispatch(updateResult(formData, token, setOpen));
        }
    };

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <h1 className="text-xl font-semibold dark:text-gray-200">
                {type === 'create' ? 'Create a new' : 'Update the'} Result
            </h1>

            {/* Student and Class Selection */}
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="min-w-[150px] flex flex-col gap-2 flex-1">
                    <label className='text-sm text-gray-500'>Student</label>
                    <Select
                        options={studentOptions}
                        value={studentOptions?.find((option) => option.value === watch('student')) || null}
                        onChange={(selected) => setValue('student', selected?.value)}
                        placeholder="Select Student"
                        styles={customStyles(darkMode)}
                    />
                    {errors?.student && <span className="text-xs text-red-700 py-2">{errors.student?.message}</span>}
                </div>

                {/* Overall Percentage */}
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Overall Percentage</label>
                    <input
                        type="number"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        placeholder="Overall Percentage"
                        {...register('overallPercentage')}
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

            {/* Subject Results */}
            {subjectFields?.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-sm">
                        <h2 className="font-medium text-lg text-gray-950">Subject {index + 1}</h2>
                        <button type="button" onClick={() => removeSubject(index)} className="text-xs text-red-600">Remove Subject</button>
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
                            {errors?.subjectResults && <span className="text-xs text-red-700 py-2">{errors?.subjectResults?.message}</span>}
                        </div>

                        <div className="min-w-[150px] flex flex-col gap-2 flex-1">
                            <label className="text-sm text-gray-500">Subject Grade</label>
                            {/* <Select
                                options={['A', 'B', 'C', 'D', 'E', 'F'].map((grade) => ({
                                    value: grade,
                                    label: grade,
                                }))}
                                value={watch(`subjectResults[${index}].subjectGrade`)}
                                onChange={(selected) => setValue(`subjectResults[${index}].subjectGrade`, selected?.value)}
                                placeholder="Select Grade"
                                styles={customStyles(darkMode)}
                            /> */}
                            <select
                                value={watch(`subjectResults[${index}].subjectGrade`)}
                                onChange={(selected) => setValue(`subjectResults[${index}].subjectGrade`, selected?.value)}
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
                        </div>
                    </div>

                    {/* Add Exam Button */}
                    <button type="button" onClick={() => handleAddExam(index)} className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]"
                    >
                        Add Exam
                    </button>

                    {/* Exam Results */}
                    {watch(`subjectResults[${index}].examResults`)?.map((exam, examIndex) => (
                        <div key={examIndex} className="flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <h2 className="font-medium text-lg text-gray-950">Exam {examIndex + 1}</h2>
                                <button
                                    type="button"
                                    onClick={() => removeExam(index, examIndex)}
                                    className="text-xs text-red-600"
                                >
                                    Remove Exam
                                </button>
                            </div>

                            <div className='flex flex-wrap flex-1 justify-between gap-4'>
                                <div className="flex flex-col flex-1 gap-2">
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
                                        <span className="text-xs text-red-700 py-2">{errors?.subjectResults?.[index]?.examResults?.[examIndex]?.percentage?.message}</span>
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 gap-2">
                                    <label className="text-sm text-gray-500">Grade</label>
                                    <Select
                                        options={['A', 'B', 'C', 'D', 'E', 'F'].map((grade) => ({
                                            value: grade,
                                            label: grade,
                                        }))}
                                        value={exam?.grade}
                                        onChange={(selected) =>
                                            setValue(`subjectResults[${index}].examResults[${examIndex}].grade`, selected?.value)
                                        }
                                        placeholder="Select Grade"
                                        styles={customStyles(darkMode)}
                                    />
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
};

export default ResultForm;