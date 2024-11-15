import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import * as z from 'zod';

const UpdatePassword = () => {

    const schema = z.object({
        password: z.string().min(8, { message: 'Password must be at least 8 character long!' }),
        oldPassword: z.string().min(8, { message: 'Old Password must be at least 8 character long!' }),
        confirmPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 character long!' }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    })

    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <form onSubmit={onSubmit}
            className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 flex flex-col gap-4">
            <p className="text-xl font-medium">Password</p>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Old Password</label>
                    <div className="relative">
                        <input
                            id="oldPassword"
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
                            id="password"
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
                            id="confirmPassword"
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
        </form>
    );
}

export default UpdatePassword;