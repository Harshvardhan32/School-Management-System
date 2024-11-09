import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { TbUpload } from "react-icons/tb";
import { Link } from "react-router-dom";
import * as z from 'zod';

const Settings = () => {

    const schema = z.object({
        userId: z.string()
            .min(3, { message: 'Student Id must be at least 3 character long!' })
            .max(20, { message: "Student Id must be at most 20 characters long!" }),
        email: z.string().email({ message: 'Invalid email address!' }),
        firstName: z.string().min(1, { message: 'First name is required!' }),
        lastName: z.string().optional(),
        phone: z.string().min(1, { message: 'Phone is required!' }),
        fatherName: z.string().min(1, { message: "Father's name is required!" }),
        motherName: z.string().min(1, { message: "Mother's name is required!" }),
        address: z.string().min(1, { message: 'Address is required!' }),
        bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
        class: z.string().min(1, { message: 'Class is required!' }),
        rollNumber: z.string().min(1, { message: 'Roll number is required!' }),
        dateOfBirth: z.string().refine((value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
        }, { message: 'Invalid date!' }),
        sex: z.enum(['male', 'female', 'others'], { message: 'Sex is required!' }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(schema) });

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the uploaded file
        if (file) {
            const reader = new FileReader(); // Create a new FileReader instance
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the preview image
            };
            reader.readAsDataURL(file); // Convert the image to a data URL
        }
    };

    const onSubmit = (data) => {
        console.log(data);
    }

    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="flex flex-col gap-2 mx-4 max-w-[1200px]">
            <p className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 text-2xl font-medium">Edit Profile</p>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 flex flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                    <div>
                        {
                            imagePreview ?
                                <img src={imagePreview} alt="Preview" className="w-[66px] h-[66px] rounded-full object-cover" />
                                : <img src="/avatar.png" alt="" className="w-[66px] h-[66px] rounded-full object-cover" />
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-base dark:text-gray-200">Change Profile Picture</p>
                        <div className="flex flex-row gap-4">
                            <label className="bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-[6px]">
                                Select
                                <input
                                    type="file"
                                    className="hidden"
                                    id="img"
                                    {...register("img", {
                                        onChange: handleImageChange
                                    })}
                                />
                            </label>
                            <button className="flex gap-2 items-center bg-[#51DFC3] text-gray-800 font-semibold px-4 py-2 rounded-[6px]">
                                <span>Upload</span>
                                <TbUpload fontSize={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 flex flex-col gap-4">
                <p className="text-xl font-medium">Profile Information</p>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Admin ID</label>
                        <input
                            type="text"
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
                            placeholder="Email"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("email")}
                        />
                        {errors?.email && <p className="text-xs text-red-700 py-2">{errors?.email.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Phone Number</label>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("phone")}
                        />
                        {errors?.phone && <p className="text-xs text-red-700 py-2">{errors?.phone.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Sex</label>
                        <select
                            name=""
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
                            placeholder="Date Of Birth"
                            className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                            {...register("dateOfBirth")}
                        />
                        {errors?.dateOfBirth && <p className="text-xs text-red-700 py-2">{errors?.dateOfBirth.message}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Blood Type</label>
                        <select
                            name=""
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
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 flex flex-col gap-4">
                <p className="text-xl font-medium">Password</p>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Old Password</label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                placeholder="Old Password"
                                className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm pr-9"
                                {...register("oldPassword")}
                            />
                            <span className="absolute text-2xl text-gray-400 top-[6px] right-2 cursor-pointer" onClick={() => setShowOldPassword((prev) => !prev)}>{showOldPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
                        </div>
                        {errors?.oldPassword && <p className="text-xs text-red-700 py-2">{errors?.oldPassword.message}</p>}
                    </div>
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
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm pr-9"
                                {...register("confirmPassword")}
                            />
                            <span className="absolute text-2xl text-gray-400 top-[6px] right-2 cursor-pointer" onClick={() => setShowConfirmPassword((prev) => !prev)}>{showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
                        </div>
                        {errors?.confirmPassword && <p className="text-xs text-red-700 py-2">{errors?.confirmPassword.message}</p>}
                    </div>
                </div>
                <div className="flex gap-4 items-center justify-end">
                    <Link to='/profile' className="bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-[6px]">Cancel</Link>
                    <button className="bg-[#51DFC3] text-gray-800 font-semibold px-4 py-2 rounded-[6px]">Update</button>
                </div>
            </div>
        </div>
    );
}

export default Settings;