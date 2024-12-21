import * as z from 'zod';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import UpdatePassword from "../components/UpdatePassword";
import UploadProfilePicture from "../components/UploadProfilePicture";
import { getAllParents, updateParent } from '../services/operations/parentAPI';
import { getAllTeachers, updateTeacher } from '../services/operations/teacherAPI';
import { getAllStudents, updateStudent } from '../services/operations/studentAPI';

const Settings = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);
    const { role } = user?.userId;

    useEffect(() => {
        if (role === 'Admin') {

        } else if (role === 'Teacher') {
            dispatch(getAllTeachers(token));
        } else if (role === 'Student') {
            dispatch(getAllStudents(token));
        } else {
            dispatch(getAllParents(token));
        }
    }, [token, dispatch]);

    let userId = [];
    if (role === 'Admin') {

    } else if (role === 'Teacher') {
        const { allTeachers } = useSelector(state => state?.teacher);

        userId = allTeachers?.map((teacher) => teacher?.teacherId);
        userId = userId.filter((item) => item !== user?.teacherId);
    } else if (role === 'Student') {
        const { allStudents } = useSelector(state => state?.student);

        userId = allStudents?.map((student) => student?.studentId);
        userId = userId.filter((item) => item !== user?.studentId);
    } else {
        const { allParents } = useSelector(state => state?.parent);

        userId = allParents?.map((parent) => parent?.parentId);
        userId = userId.filter((item) => item !== user?.parentId);
    }

    const schema = z.object({
        userId: z.string()
            .min(3, { message: 'User ID must be at least 3 characters long!' })
            .max(20, { message: "User ID must be at most 20 characters long!" })
            .regex(/^\S+$/, { message: "User ID must not contain spaces!" })
            .refine(
                (id) => !userId.includes(id),
                { message: "User ID already exists!" }
            ),
        firstName: z.string().min(1, { message: 'First name is required!' }).default(user?.userId?.firstName),
        lastName: z.string().optional().default(user?.userId?.lastName),
        email: z.string().toLowerCase().email({ message: 'Invalid email address!' }),
        phone: z.string()
            .min(10, { message: 'Phone number must be 10 characters!' })
            .max(10, { message: 'Phone number must be 10 characters!' })
            .regex(/^\d+$/, { message: 'Phone number must contain only digits!' }),
        dateOfBirth: role === 'Parent'
            ? z.string().optional()
            : z.string().min(1, { message: 'Date of Birth is required!' }).default(user?.userId?.dateOfBirth),
        sex: z.enum(['male', 'female', 'others'], { message: 'Sex is required!' }).default(user?.userId?.sex),
        address: z.string().min(1, { message: 'Address is required!' }).default(user?.userId.address),
        bloodType: role === 'Parent'
            ? z.string().optional()
            : z.string().min(1, { message: 'Blood Type is required!' }).default(user?.userId.bloodType),
        fatherName: role === 'Student'
            ? z.string().min(1, { message: "Father's name is required!" }).default(user?.fatherName)
            : z.string().optional(),
        motherName: role === 'Student'
            ? z.string().min(1, { message: "Mother's name is required!" }).default(user?.motherName)
            : z.string().optional(),
        rollNumber: role === 'Student'
            ? z.number().min(1, { message: 'Roll number is required!' }).default(user?.rollNumber)
            : z.number().optional(),
        remarks: z.string().optional(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit((formData) => {
        console.log("formData: ", formData);

        formData.id = user?._id;
        if (role === 'Admin') {

        } else if (role === 'Teacher') {
            formData.teacherId = formData.userId;
            formData.userId = undefined;
            // dispatch(updateTeacher(token, formData));
        } else if (role === 'Student') {
            formData.studentId = formData.userId;
            formData.userId = undefined;
            formData.classId = user?.classId;
            // dispatch(updateStudent(token, formData));
        } else {
            formData.parentId = formData.userId;
            formData.userId = undefined;
            // dispatch(updateParent(token, formData));
        }
        console.log("formData: ", formData);
    });

    return (
        <div className="flex flex-col gap-2 mx-4">
            <p className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 text-2xl font-medium shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">Edit Profile</p>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 flex flex-row gap-4 items-center justify-between shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <UploadProfilePicture data={user} />
            </div>

            <form
                onSubmit={onSubmit}
                className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 flex flex-col gap-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
                <p className="text-xl font-medium">Profile Information</p>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">User ID</label>
                        <input
                            type="text"
                            id="userId"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("userId")}
                            defaultValue={role === 'Admin' ? user?.adminId : role === 'Teacher' ? user?.teacherId : role === 'Student' ? user?.studentId : user?.parentId}
                        />
                        {errors?.userId && <p className="text-xs text-red-700 py-2">{errors?.userId.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            disabled={role === 'Student'}
                            placeholder="First Name"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("firstName")}
                            defaultValue={user?.userId.firstName}
                        />
                        {errors?.firstName && <p className="text-xs text-red-700 py-2">{errors?.firstName.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            disabled={role === 'Student'}
                            placeholder="Last Name"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("lastName")}
                            defaultValue={user?.userId.lastName}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("email")}
                            defaultValue={user?.userId.email}
                        />
                        {errors?.email && <p className="text-xs text-red-700 py-2">{errors?.email.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Phone Number</label>
                        <input
                            type="number"
                            id="phone"
                            placeholder="Phone Number"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                            {...register("phone")}
                            defaultValue={user?.userId.phone}
                        />
                        {errors?.phone && <p className="text-xs text-red-700 py-2">{errors?.phone.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Sex</label>
                        <select
                            id="sex"
                            disabled={role === 'Student'}
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("sex")}
                            value={user?.userId?.sex?.toLowerCase()}
                        >
                            <option value="">Please Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                        </select>
                        {errors?.sex && <p className="text-xs text-red-700 py-2">{errors?.sex.message}</p>}
                    </div>
                </div>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    {
                        role !== 'Parent' &&
                        <>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Date Of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    disabled={role === 'Student'}
                                    placeholder="Date Of Birth"
                                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                    {...register("dateOfBirth")}
                                    defaultValue={user?.userId.dateOfBirth && new Date(user?.userId.dateOfBirth).toISOString().slice(0, 10)}
                                />
                                {errors?.dateOfBirth && <p className="text-xs text-red-700 py-2">{errors?.dateOfBirth.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Blood Type</label>
                                <select
                                    id="bloodType"
                                    disabled={role === 'Student'}
                                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                    {...register("bloodType")}
                                    defaultValue={user?.userId.bloodType}
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
                                {errors?.bloodType && <p className="text-xs text-red-700 py-2">{errors?.bloodType.message}</p>}
                            </div>
                        </>
                    }
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Address</label>
                        <input
                            id="address"
                            type="text"
                            disabled={role === 'Student'}
                            placeholder="Address"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("address")}
                            defaultValue={user?.userId.address}
                        />
                        {errors?.address && <p className="text-xs text-red-700 py-2">{errors?.address.message}</p>}
                    </div>
                </div>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    {
                        role === 'Student' &&
                        <>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Roll Number</label>
                                <input
                                    type="text"
                                    id="rollNumber"
                                    disabled={role === 'Student'}
                                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                    {...register("rollNumber")}
                                    defaultValue={user?.rollNumber}
                                />
                                {errors?.rollNumber && <p className="text-xs text-red-700 py-2">{errors?.rollNumber.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Father Name</label>
                                <input
                                    type="text"
                                    id="fatherName"
                                    disabled={role === 'Student'}
                                    placeholder="Father Name"
                                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                    {...register("fatherName")}
                                    defaultValue={user?.fatherName}
                                />
                                {errors?.fatherName && <p className="text-xs text-red-700 py-2">{errors?.fatherName.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-sm text-gray-500">Mother Name</label>
                                <input
                                    type="text"
                                    id="motherName"
                                    disabled={role === 'Student'}
                                    placeholder="Mother Name"
                                    className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                    {...register("motherName")}
                                    defaultValue={user?.motherName}
                                />
                                {errors?.motherName && <p className="text-xs text-red-700 py-2">{errors?.motherName.message}</p>}
                            </div>
                        </>
                    }
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">About</label>
                    <textarea
                        rows={3}
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("remarks")}
                        defaultValue={user?.userId.remarks}
                    />
                    {errors?.remarks && <p className="text-xs text-red-700 py-2">{errors?.remarks?.message}</p>}
                </div>
                <div className="flex gap-4 items-center justify-end">
                    <div onClick={() => navigate(-1)} className="bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-[6px] cursor-pointer">Cancel</div>
                    <button type="submit" className="bg-[#51DFC3] text-gray-800 font-semibold px-4 py-2 rounded-[6px]">Update</button>
                </div>
            </form >

            <UpdatePassword />
        </div >
    );
}

export default Settings;