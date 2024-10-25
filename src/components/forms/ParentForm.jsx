import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useState } from "react";
import * as z from 'zod';
import MultiSelectComponent from "../MultiSelectComponent";
import toast from "react-hot-toast";

const ParentForm = ({ type, data }) => {

    const schema = z.object({
        parentId: z.string()
            .min(3, { message: 'Parent ID must be at least 3 character long!' })
            .max(20, { message: "Parent ID must be at most 20 characters long!" }),
        email: z.string().email({ message: 'Invalid email address!' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long!' }),
        firstName: z.string().min(1, { message: 'First name is required!' }),
        lastName: z.string().optional(),
        phone: z.string().min(1, { message: 'Phone is required!' }),
        address: z.string().min(1, { message: 'Address is required!' }),
        sex: z.enum(['male', 'female', 'others'], { message: 'Sex is required!' }),
        students: z.array(
            z.object({ name: z.string(), })).min(1, { message: 'At least one student must be selected!' }),
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            students: [],
        },
    });

    const onSubmit = handleSubmit(data => {
        console.log(data);
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    });

    const [studentOptions] = useState([
        { name: 'Rahul Kumar' },
        { name: 'Rohit Singh' },
        { name: 'Aman Kumar' },
    ]);

    const selectedStudent = getValues("students");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a new' : 'Update'} Parent</h1>
            <span className="text-xs font-medium text-gray-700">Authentication Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Parent ID</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("parentId")}
                    />
                    {errors?.parentId && <p className="text-xs text-red-700 py-2">{errors?.parentId.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        type="email"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("email")}
                    />
                    {errors?.email && <p className="text-xs text-red-700 py-2">{errors?.email.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 pr-9 rounded-[2px] text-sm"
                            {...register("password")}
                        />
                        <span className="absolute text-2xl text-gray-400 top-[6px] right-2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
                    </div>
                    {errors?.password && <p className="text-xs text-red-700 py-2">{errors?.password.message}</p>}
                </div>
            </div>
            <span className="text-xs font-medium text-gray-700">Personal Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">First Name</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("firstName")}
                    />
                    {errors?.firstName && <p className="text-xs text-red-700 py-2">{errors?.firstName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Last Name</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("lastName")}
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                        type="tel"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("phone")}
                    />
                    {errors?.phone && <p className="text-xs text-red-700 py-2">{errors?.phone.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Address</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("address")}
                    />
                    {errors?.address && <p className="text-xs text-red-700 py-2">{errors?.address.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Sex</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none ring-[1.5px] ring-gray-300 p-2 rounded-[2px] text-sm"
                        {...register("sex")}
                    >
                        <option value="">Please Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>
                    {errors?.sex && <p className="text-xs text-red-700 py-2">{errors?.sex.message}</p>}
                </div>
            </div>
            <span className="text-xs font-medium text-gray-700">Student Information</span>
            <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Students</label>
                <MultiSelectComponent
                    options={studentOptions}
                    selectedValue={selectedStudent}
                    setSelectedValue={(value) => setValue("students", value)}
                />
                {errors?.students && <p className="text-xs text-red-700 py-2">{errors?.students.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default ParentForm;