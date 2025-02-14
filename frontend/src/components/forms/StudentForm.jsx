import * as z from 'zod';
import { useForm } from "react-hook-form";
import SelectOption from "../common/SelectOption";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from '@hookform/resolvers/zod';
import MultiSelectComponent from "../MultiSelectComponent";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllParents } from '../../services/operations/parentAPI';
import { getAllSubjects } from "../../services/operations/subjectAPI";
import { createStudent, updateStudent } from '../../services/operations/studentAPI';

const StudentForm = ({ type, data, allData, setOpen }) => {

    let uniqueId = type === 'update'
        ? allData.studentsId.filter((item) => item !== data.studentId)
        : allData.studentsId;

    let uniqueRollNumber = type === 'update'
        ? allData.rollNumber.filter((item) => item !== data.rollNumber.toString())
        : allData.rollNumber;

    // Password zod schema for create and update 
    const passwordSchema = (type) =>
        type === 'create'
            ? z.string().min(8, { message: 'Password must be at least 8 characters long!' })
            : z.string().optional();

    const schema = z.object({
        studentId: z.string()
            .min(3, { message: 'Student ID must be at least 3 character long!' })
            .max(20, { message: "Student ID must be at most 20 characters long!" })
            .regex(/^\S+$/, { message: "Student ID must not contain spaces!" })
            .refine(
                (id) => !uniqueId.includes(id),
                { message: "Student ID already exists!" }
            ),
        email: z.string().toLowerCase().email({ message: 'Invalid email address!' }),
        password: passwordSchema(type),
        firstName: z.string().min(1, { message: 'First name is required!' }),
        lastName: z.string().optional(),
        phone: z.string()
            .min(10, { message: 'Phone number must be 10 characters!' })
            .max(10, { message: 'Phone number must be 10 characters!' })
            .regex(/^\d+$/, { message: 'Phone number must contain only digits!' })
            .transform((val) => parseInt(val) || 0),
        fatherName: z.string().min(1, { message: "Father's name is required!" }),
        motherName: z.string().min(1, { message: "Mother's name is required!" }),
        address: z.string().min(1, { message: 'Address is required!' }),
        bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
        classId: z.string().min(1, { message: 'Class is required!' }),
        rollNumber: z.string()
            .min(1, { message: 'Roll number is required!' })
            .regex(/^\S+$/, { message: "Roll number must not contain spaces!" })
            .refine(
                (number) => !uniqueRollNumber.includes(number),
                { message: "Roll number already exists!" }
            ),
        dateOfBirth: z.string().min(1, { message: 'Date of Birth is required!' }),
        sex: z.enum(['male', 'female', 'others'], { message: 'Sex is required!' }),
        role: z.string().default('Student'),
        parent: z.string().optional().default(''),
        subjects: z.array(z.string()).optional(),
        remarks: z.string().optional()
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            subjects: type === 'update'
                ? data?.subjects?.map((subject) => subject?._id) : [],
        },
    });

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { role } = useSelector((state) => state?.profile?.user?.userId);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        dispatch(getAllClasses(token));
        dispatch(getAllSubjects(token));
        dispatch(getAllParents(token));
    }, [token]);

    const { allClasses } = useSelector(state => state?.class);
    const { allSubjects } = useSelector(state => state?.subject);
    const { allParents } = useSelector(state => state?.parent);

    const classOptions = useMemo(() => {
        return (allClasses?.map((item) => ({
            id: item?._id,
            name: item?.className,
        })) || []);
    }, [allClasses]);

    const parentOptions = useMemo(() => {
        return (allParents?.map((item) => ({
            id: item?._id,
            name: item?.userId.firstName + " " + item?.userId.lastName,
        })) || []);
    }, [allParents]);

    const subjectOptions = useMemo(() => {
        return allSubjects?.map((item) => ({
            id: item?._id,
            name: item?.subjectName + ' ' + item?.classes?.map((classItem) => classItem?.className).join(', '),
        })) || [];
    }, [allSubjects]);

    const selectedSubjects = type === 'update' && data?.subjects.length > 0
        ? data?.subjects?.map((subject) => {
            return {
                id: subject?._id,
                name: subject?.subjectName + ' ' + subject?.classes?.map((classItem) => classItem?.className).join(', '),
            }
        })
        : getValues("subjects")?.map((id) =>
            subjectOptions?.find((option) => option.id === id)
        );

    const onSubmit = handleSubmit(formData => {
        if (type === 'create') {
            dispatch(createStudent(formData, token, setOpen));
        } else {
            formData.id = data._id;
            formData.userId = data.userId;
            dispatch(updateStudent(formData, token, setOpen));
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Student</h1>

            {/* Authentication Information */}
            <span className="text-xs font-medium text-gray-700">Authentication Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Student Id</label>
                    <input
                        type="text"
                        disabled={role !== 'Admin'}
                        placeholder="Student ID"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("studentId")}
                        defaultValue={type === 'update' ? data?.studentId : ''}
                    />
                    {errors?.studentId && <p className="text-xs text-red-700 py-2">{errors?.studentId.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        type="email"
                        disabled={role !== 'Admin'}
                        placeholder="Email"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("email")}
                        defaultValue={type === 'update' ? data?.userId.email : ''}
                    />
                    {errors?.email && <p className="text-xs text-red-700 py-2">{errors?.email.message}</p>}
                </div>
                {
                    type === 'create' &&
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm pr-9"
                                {...register("password")}
                            />
                            <span className="absolute text-2xl text-gray-400 top-[6px] right-2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
                        </div>
                        {errors?.password && <p className="text-xs text-red-700 py-2">{errors?.password.message}</p>}
                    </div>
                }
            </div>

            {/* Personal Information */}
            <span className="text-xs font-medium text-gray-700">Personal Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">First Name</label>
                    <input
                        type="text"
                        disabled={role !== 'Admin'}
                        placeholder="First Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("firstName")}
                        defaultValue={type === 'update' ? data?.userId.firstName : ''}
                    />
                    {errors?.firstName && <p className="text-xs text-red-700 py-2">{errors?.firstName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Last Name</label>
                    <input
                        type="text"
                        disabled={role !== 'Admin'}
                        placeholder="Last Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("lastName")}
                        defaultValue={type === 'update' ? data?.userId.lastName : ''}
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                        type="number"
                        disabled={role !== 'Admin'}
                        placeholder="Phone"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        {...register("phone")}
                        defaultValue={type === 'update' ? data?.userId.phone : ''}
                    />
                    {errors?.phone && <p className="text-xs text-red-700 py-2">{errors?.phone.message}</p>}
                </div>
            </div>

            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Father's Name</label>
                    <input
                        type="text"
                        disabled={role !== 'Admin'}
                        placeholder="Father's Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("fatherName")}
                        defaultValue={type === 'update' ? data?.fatherName : ''}
                    />
                    {errors?.fatherName && <p className="text-xs text-red-700 py-2">{errors?.fatherName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Mother's Name</label>
                    <input
                        type="text"
                        disabled={role !== 'Admin'}
                        placeholder="Mother's Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("motherName")}
                        defaultValue={type === 'update' ? data?.motherName : ''}
                    />
                    {errors?.motherName && <p className="text-xs text-red-700 py-2">{errors?.motherName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Address</label>
                    <input
                        type="text"
                        disabled={role !== 'Admin'}
                        placeholder="Address"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("address")}
                        defaultValue={type === 'update' ? data?.userId.address : ''}
                    />
                    {errors?.address && <p className="text-xs text-red-700 py-2">{errors?.address.message}</p>}
                </div>
            </div>

            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Sex</label>
                    <select
                        disabled={role !== 'Admin'}
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("sex")}
                        defaultValue={type === 'update' && data?.userId?.sex?.toLowerCase()}
                    >
                        <option value="">Please Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>
                    {errors?.sex && <p className="text-xs text-red-700 py-2">{errors?.sex.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Blood Type</label>
                    <select
                        disabled={role !== 'Admin'}
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("bloodType")}
                        defaultValue={type === 'update' ? data?.userId.bloodType : ''}
                    >
                        <option value="">Please Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                    {errors.bloodType && <p className="text-xs text-red-700 py-2">{errors.bloodType.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Date of Birth</label>
                    <input
                        type="date"
                        disabled={role !== 'Admin'}
                        placeholder="Date of Birth"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("dateOfBirth")}
                        defaultValue={type === 'update' && data?.userId.dateOfBirth ? new Date(data?.userId.dateOfBirth).toISOString().slice(0, 10) : ''}
                    />
                    {errors?.dateOfBirth && <p className="text-xs text-red-700 py-2">{errors?.dateOfBirth.message}</p>}
                </div>
            </div>

            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="min-w-[150px] flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='classId'
                        control={control}
                        options={classOptions}
                        isDisabled={role !== 'Admin'}
                        defaultValue={type === 'update' && data?.classId ? data.classId._id : ''}
                        placeholder='Please Select'
                        label='Class'
                    />
                </div>
                <div className="min-w-[150px] flex flex-col gap-2 flex-1">
                    <SelectOption
                        name='parent'
                        control={control}
                        options={parentOptions}
                        isDisabled={role !== 'Admin'}
                        defaultValue={type === 'update' && data?.parent ? data.parent._id : ''}
                        placeholder='Please Select'
                        label='Parent'
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Roll Number</label>
                    <input
                        type="text"
                        placeholder="Roll Number"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("rollNumber")}
                        defaultValue={type === 'update' ? data?.rollNumber : ''}
                    />
                    {errors?.rollNumber && <p className="text-xs text-red-700 py-2">{errors?.rollNumber.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="min-w-[150px] w-full outline-none flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Subjects</label>
                    <MultiSelectComponent
                        options={subjectOptions}
                        isDisabled={role !== 'Admin'}
                        selectedValue={selectedSubjects}
                        setSelectedValue={(value) =>
                            setValue(
                                "subjects",
                                value.map((item) => item.id)
                            )}
                    />
                    {errors?.subjects && <p className="text-xs text-red-700 py-2">{errors?.subjects.message}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Remark</label>
                <textarea
                    rows={3}
                    disabled={role !== 'Admin'}
                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                    {...register("remarks")}
                    defaultValue={type === 'update' ? data?.userId?.remarks : ''}
                />
                {errors?.remarks && <p className="text-xs text-red-700 py-2">{errors?.remarks?.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[2px]">
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    );
}

export default StudentForm;