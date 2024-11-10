import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';

const ResetPassword = () => {
    const schema = z.object({
        password: z.string().min(8, { message: 'Password must be at least 8 characters long!' }),
        confirmPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters long!' })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match!",
        path: ["confirmPassword"],
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        navigate('/')
    });

    return (
        <div className="bg-gray-100 w-screen h-screen flex items-center justify-center p-4">
            <div className="bg-white shadow-xl max-w-[450px] w-full flex flex-col gap-4 border-2 border-gray-200 p-6 rounded-[6px]">
                <div className="flex flex-col gap-4 text-gray-800">
                    <h2 className="text-3xl font-medium">Choose new password</h2>
                    <p className="text-base">Almost done. Enter your new password and you're all set.</p>
                </div>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={onSubmit}
                >
                    <div className="relative flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">New Password</label>
                        <div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                {...register("password")}
                            />
                            <span className="absolute text-2xl text-gray-400 top-[34px] right-2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
                        </div>
                        {errors?.password && <p className="text-xs text-red-700 py-2">{errors?.password.message}</p>}
                    </div>
                    <div className="relative flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Confirm New Password</label>
                        <div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                                {...register("confirmPassword")}
                            />
                            <span className="absolute text-2xl text-gray-400 top-[34px] right-2 cursor-pointer" onClick={() => setShowConfirmPassword((prev) => !prev)}>{showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
                        </div>
                        {errors?.confirmPassword && <p className="text-xs text-red-700 py-2">{errors?.confirmPassword.message}</p>}
                    </div>
                    <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">Reset Password</button>
                </form>
                <Link to='/' className="flex flex-row gap-2 items-center text-base">
                    <IoArrowBack />
                    <p>Back to Login</p>
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;