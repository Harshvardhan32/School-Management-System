import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import MultiSelectComponent from "../MultiSelectComponent";
import { createUser } from "../../services/operations/userAPI";
import { useDispatch, useSelector } from "react-redux";
import * as z from 'zod';
import { getAllClasses } from "../../services/operations/classAPI";
import { getAllSubjects } from "../../services/operations/subjectAPI";
import { getAllTeachers } from "../../services/operations/teacherAPI";

const TeacherForm = ({ type, data, setOpen }) => {

    // Password zod schema for create and update 
    const passwordSchema = (type) =>
        type === 'create'
            ? z.string().min(8, { message: 'Password must be at least 8 characters long!' })
            : z.string().optional();

    const schema = z.object({
        teacherId: z.string()
            .min(3, { message: "Teacher ID must be at least 3 characters long!" })
            .max(20, { message: "Teacher ID must be at most 20 characters long!" })
            .regex(/^\S+$/, { message: "Teacher ID must not contain spaces!" }),
        email: z.string().email({ message: 'Invalid email address!' }),
        password: passwordSchema(type),
        firstName: z.string().min(1, { message: 'First name is required!' }),
        lastName: z.string().optional(),
        phone: z.string().min(10, { message: 'Phone number must be 10 characher!' }).max(10, { message: 'Phone number must be 10 characher!' }).transform((val) => parseInt(val)),
        address: z.string().min(1, { message: 'Address is required!' }),
        bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
        dateOfBirth: z.string().min(1, { message: 'Date of Birth is required!' }),
        sex: z.enum(['male', 'female', 'others'], { message: 'Sex is required!' }),
        role: z.string().default('Teacher'),
        subjects: z.array(z.string()).optional(),
        classes: z.array(z.string()).optional(),
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            subjects: [],
            classes: []
        },
    });

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state?.auth);

    useEffect(() => {
        dispatch(getAllClasses(token, undefined, undefined, true));
        dispatch(getAllSubjects(token, undefined, undefined, true));
        // dispatch(getAllTeachers(token, undefined, undefined, true));
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const { allClasses } = useSelector(state => state?.class);
    const { allSubjects } = useSelector(state => state?.subject);
    // const { allTeachers } = useSelector(state => state?.teacher);

    // Options for teachers, students, and subjects
    const classOptions = useMemo(() => {
        return (allClasses?.map((item) => ({
            id: item?._id,
            name: item?.className,
        })) || []);
    }, [allClasses]);

    const subjectOptions = useMemo(() => {
        return allSubjects?.map((item) => ({
            id: item?._id,
            name: item?.subjectName,
        })) || [];
    }, [allSubjects]);

    const selectedClasses = type === 'update' && data?.classes.length > 0
        ? data?.classes?.map((id) => {
            classOptions.find((option) => option.id === id);
        })
        : getValues("classes")?.map((id) =>
            classOptions.find((option) => option.id === id)
        );

    const selectedSubjects = type === 'update' && data?.subjects.length > 0
        ? data?.subjects?.map((id) => {
            subjectOptions.find((option) => option.id === id);
        })
        : getValues("subjects")?.map((id) =>
            subjectOptions.find((option) => option.id === id)
        );

    const onSubmit = handleSubmit(formData => {
        console.log(formData);
        if (type === 'create') {
            // dispatch(createUser(formData, setOpen));
        } else {
            // dispatch(updateAnnouncement(formData, setOpen));
        }
        // setOpen(false);
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Teacher</h1>

            {/* Authentication Information */}
            <span className="text-xs font-medium text-gray-700">Authentication Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Teacher ID</label>
                    <input
                        type="text"
                        placeholder="Teacher ID"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("teacherId")}
                        defaultValue={type === 'update' ? data?.teacherId : ''}
                    />
                    {errors?.teacherId && <p className="text-xs text-red-700 py-2">{errors?.teacherId?.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("email")}
                        defaultValue={type === 'update' ? data?.userId.email : ''}
                    />
                    {errors?.email && <p className="text-xs text-red-700 py-2">{errors?.email?.message}</p>}
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
                        {errors?.password && <p className="text-xs text-red-700 py-2">{errors?.password?.message}</p>}
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
                        placeholder="First Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("firstName")}
                        defaultValue={type === 'update' ? data?.userId.firstName : ''}
                    />
                    {errors?.firstName && <p className="text-xs text-red-700 py-2">{errors?.firstName?.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Last Name</label>
                    <input
                        type="text"
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
                        placeholder="Phone"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        {...register("phone")}
                        defaultValue={type === 'update' ? data?.userId.phone : ''}
                    />
                    {errors?.phone && <p className="text-xs text-red-700 py-2">{errors?.phone?.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Address</label>
                    <input
                        type="text"
                        placeholder="Address"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("address")}
                        defaultValue={type === 'update' ? data?.userId.address : ''}
                    />
                    {errors?.address && <p className="text-xs text-red-700 py-2">{errors?.address?.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Blood Type</label>
                    <select
                        name=""
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
                    {errors?.bloodType && <p className="text-xs text-red-700 py-2">{errors?.bloodType?.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Date of Birth</label>
                    <input
                        type="date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("dateOfBirth")}
                        defaultValue={type === 'update' ? new Date(data?.userId.dateOfBirth).toISOString().slice(0, 10) : ''}
                    />
                    {errors?.dateOfBirth && <p className="text-xs text-red-700 py-2">{errors?.dateOfBirth?.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Sex</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("sex")}
                        defaultValue={type === 'update' && data?.userId?.sex?.toLowerCase()}
                    >
                        <option value="">Please Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>
                    {errors?.sex && <p className="text-xs text-red-700 py-2">{errors?.sex?.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Classes</label>
                    <MultiSelectComponent
                        options={classOptions}
                        selectedValue={selectedClasses}
                        setSelectedValue={(value) =>
                            setValue(
                                "classes",
                                value.map((item) => item.id)
                            )}
                    />
                    {errors?.classes && <p className="text-xs text-red-700 py-2">{errors?.classes?.message}</p>}
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
                            )}
                    />
                    {errors?.subjects && <p className="text-xs text-red-700 py-2">{errors?.subjects?.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[2px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default TeacherForm;