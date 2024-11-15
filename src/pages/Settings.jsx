import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import UploadProfilePicture from "../components/UploadProfilePicture";
import UpdatePassword from "../components/UpdatePassword";
import * as z from 'zod';

const Settings = () => {

    const schema = z.object({
        userId: z.string()
            .min(3, { message: 'Student Id must be at least 3 characters long!' })
            .max(20, { message: "Student Id must be at most 20 characters long!" }),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        sex: z.string().optional(),
        dateOfBirth: z.string().optional(),
        bloodType: z.string().optional(),
        address: z.string().optional(),
        rollNumber: z.string().optional(),
        fatherName: z.string().optional(),
        motherName: z.string().optional(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit((data) => {
        if (data?.phone !== '' && (data?.phone).length !== 10) {
            toast.error('Phone number must be exactly 10 characters!');
            return;
        }
        console.log(data);
    });

    return (
        <div className="flex flex-col gap-2 mx-4 max-w-[1200px]">
            <p className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 text-2xl font-medium">Edit Profile</p>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 flex flex-row gap-4 items-center justify-between">
                <UploadProfilePicture />
            </div>

            <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 flex flex-col gap-4">
                <p className="text-xl font-medium">Profile Information</p>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Admin ID</label>
                        <input
                            type="text"
                            id="userId"
                            value={'2022B0124156'}
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 bg-gray-200 dark:bg-slate-900 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("userId")}
                            readOnly
                        />
                        {errors?.userId && <p className="text-xs text-red-700 py-2">{errors?.userId.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="First Name"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("firstName")}
                        />
                        {errors?.firstName && <p className="text-xs text-red-700 py-2">{errors?.firstName.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Last Name"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("lastName")}
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
                        />
                        {errors?.phone && <p className="text-xs text-red-700 py-2">{errors?.phone.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Sex</label>
                        <select
                            id="sex"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
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
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Date Of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            placeholder="Date Of Birth"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("dateOfBirth")}
                        />
                        {errors?.dateOfBirth && <p className="text-xs text-red-700 py-2">{errors?.dateOfBirth.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Blood Type</label>
                        <select
                            id="bloodType"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("bloodType")}
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
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Address</label>
                        <input
                            id="address"
                            type="text"
                            placeholder="Address"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("address")}
                        />
                        {errors?.address && <p className="text-xs text-red-700 py-2">{errors?.address.message}</p>}
                    </div>
                </div>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Roll Number</label>
                        <input
                            type="text"
                            id="rollNumber"
                            value={'2200320126598'}
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 bg-gray-200 dark:bg-slate-900 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("rollNumber")}
                            readOnly
                        />
                        {errors?.rollNumber && <p className="text-xs text-red-700 py-2">{errors?.rollNumber.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Father Name</label>
                        <input
                            type="text"
                            id="fatherName"
                            placeholder="Father Name"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("fatherName")}
                        />
                        {errors?.fatherName && <p className="text-xs text-red-700 py-2">{errors?.fatherName.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Mother Name</label>
                        <input
                            type="text"
                            id="motherName"
                            placeholder="Mother Name"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("motherName")}
                        />
                        {errors?.motherName && <p className="text-xs text-red-700 py-2">{errors?.motherName.message}</p>}
                    </div>
                </div>
                <div className="flex gap-4 items-center justify-end">
                    <Link to='/profile' className="bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-[6px]">Cancel</Link>
                    <button className="bg-[#51DFC3] text-gray-800 font-semibold px-4 py-2 rounded-[6px]">Update</button>
                </div>
            </form>

            <UpdatePassword />
        </div>
    );
}

export default Settings;