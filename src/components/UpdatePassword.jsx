import * as z from 'zod';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { changePassword } from '../services/operations/authAPI';
import { useDispatch, useSelector } from 'react-redux';

const UpdatePassword = ({ userId }) => {

    const schema = z.object({
        password: z.string().min(8, { message: 'Password must be at least 8 characters long!' }),
        oldPassword: z.string().min(8, { message: 'Old Password must be at least 8 characters long!' }),
        confirmPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters long!' }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords must be same!',
        path: ['confirmPassword'],
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ resolver: zodResolver(schema) });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('oldPassword', data.oldPassword);
        formData.append('newPassword', data.confirmPassword);
        dispatch(changePassword(formData, token));
    });

    return (
        <form onSubmit={onSubmit}
            className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 flex flex-col gap-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
        >
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
                <div onClick={() => navigate(-1)} className="bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-[6px] cursor-pointer">Cancel</div>
                <button type="submit" className="bg-[#51DFC3] text-gray-800 font-semibold px-4 py-2 rounded-[6px]">Update</button>
            </div>
        </form>
    );
}

export default UpdatePassword;