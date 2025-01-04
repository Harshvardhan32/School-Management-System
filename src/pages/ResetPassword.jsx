import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoArrowBack } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '../services/operations/authAPI';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ResetPassword = () => {

    const schema = z.object({
        password: z.string().min(8, { message: 'Password must be at least 8 characters long!' }),
        confirmPassword: z.string().min(8, { message: 'Confirm Password must be at least 8 characters long!' })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Both Password do not match!",
        path: ["confirmPassword"],
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(data, token));
        navigate('/');
    });

    return (
        <div className="w-screen h-screen bg-[#080710] flex justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[300px] h-[350px] sm:w-[430px] sm:h-[520px]">
                <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full bg-gradient-to-b from-[#1845ad] to-[#23a2f6] -left-[30px] sm:-left-[70px] -top-[100px] sm:-top-[100px]"></div>
                <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] -right-[30px] sm:-right-[70px] -bottom-[100px] sm:-bottom-[100px]"></div>
            </div>
            <div
                className="relative w-full max-w-[320px] sm:max-w-[450px] bg-white/10 rounded-lg backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] p-8 sm:py-[50px] sm:px-[35px] font-poppins text-white tracking-wide">
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[24px] sm:text-[32px] font-medium leading-[32px] sm:leading-[42px] text-center">
                            Choose new Password
                        </h3>
                        <p className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-center mt-4">
                            Almost done. Enter your new password and you're all set.
                        </p>
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block mt-6 sm:mt-8 text-sm sm:text-base font-medium">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="outline-none block h-[45px] sm:h-[50px] w-full bg-white/10 rounded-md px-[10px] mt-2 text-[14px] sm:text-[16px] font-light pr-9"
                            {...register("password")}
                        />
                        <span
                            className="absolute text-xl sm:text-2xl text-gray-400 top-[41px] sm:top-[45px] right-2 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                        </span>
                        {errors?.password && <p className="text-xs sm:text-sm text-red-600 py-2">{errors?.password.message}</p>}
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block mt-6 sm:mt-8 text-sm sm:text-base font-medium">Confirm New Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            className="outline-none block h-[45px] sm:h-[50px] w-full bg-white/10 rounded-md px-[10px] mt-2 text-[14px] sm:text-[16px] font-light pr-9"
                            {...register("confirmPassword")}
                        />
                        <span
                            className="absolute text-xl sm:text-2xl text-gray-400 top-[41px] sm:top-[45px] right-2 cursor-pointer"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                            {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                        </span>
                        {errors?.confirmPassword && <p className="text-xs sm:text-sm text-red-600 py-2">{errors?.confirmPassword.message}</p>}
                    </div>
                    <button className="mt-8 sm:mt-12 w-full bg-white text-[#080710] py-3 sm:py-4 text-[16px] sm:text-[18px] font-semibold rounded-[5px] cursor-pointer">
                        Reset Password
                    </button>
                </form>

                <Link to='/' className="w-fit flex flex-row gap-2 items-center text-sm sm:text-base text-white mt-4">
                    <IoArrowBack />
                    <p>Back to Login</p>
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;

{/* <form
    onSubmit={onSubmit}
    className="relative w-full max-w-[320px] sm:max-w-[400px] bg-white/10 rounded-lg backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] p-8 sm:py-[50px] sm:px-[35px] font-poppins text-white tracking-wide"
>
    <div>
        <h3 className="text-[24px] sm:text-[32px] font-medium leading-[32px] sm:leading-[42px] text-center">
            Choose new password
        </h3>
        <p className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-center mt-4">
            Almost done. Enter your new password and you're all set.
        </p>
    </div>

    <div>
        <label htmlFor="email" className="block mt-8 text-sm sm:text-base font-medium">Password</label>
        <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="outline-none block h-[45px] sm:h-[50px] w-full bg-white/10 rounded-md px-[10px] mt-2 text-[14px] sm:text-[16px] font-light"
            {...register('password')}
        />
        {errors?.password && <p className="text-xs sm:text-sm text-red-700 py-2">{errors?.password.message}</p>}
    </div>

    <div className="relative">
        <label htmlFor="password" className="block mt-6 sm:mt-8 text-sm sm:text-base font-medium">Password</label>
        <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="outline-none block h-[45px] sm:h-[50px] w-full bg-white/10 rounded-md px-[10px] mt-2 text-[14px] sm:text-[16px] font-light pr-9"
            {...register("password")}
        />
        <span
            className="absolute text-xl sm:text-2xl text-gray-400 top-[41px] sm:top-[45px] right-2 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
        >
            {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
        </span>
        {errors?.password && <p className="text-xs sm:text-sm text-red-700 py-2">{errors?.password.message}</p>}
    </div>

    <button
        className="mt-8 sm:mt-12 w-full bg-white text-[#080710] py-3 sm:py-4 text-[16px] sm:text-[18px] font-semibold rounded-md cursor-pointer"
    >
        Log In
    </button>
</form> */}

{/* <div className="bg-gray-100 w-screen h-screen flex items-center justify-center p-4">
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
</div> */}