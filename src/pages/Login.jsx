import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import * as z from 'zod';

const Login = () => {

    const schema = z.object({
        email: z.string().email({ message: 'Invalid email address!' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long!' })
    })

    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = handleSubmit((data) => {
        console.log(data);
    })

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full h-screen bg-[#080710] flex justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[300px] h-[350px] sm:w-[430px] sm:h-[520px]">
                <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full bg-gradient-to-b from-[#1845ad] to-[#23a2f6] -left-[30px] sm:-left-[50px] -top-[50px] sm:-top-[60px]"></div>
                <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] -right-[30px] sm:-right-[50px] -bottom-[50px] sm:-bottom-[60px]"></div>
            </div>
            <form
                onSubmit={onSubmit}
                className="relative w-full max-w-[320px] sm:max-w-[400px] bg-white/10 rounded-lg backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] p-8 sm:py-[50px] sm:px-[35px] font-poppins text-white tracking-wide"
            >
                <h3 className="text-2xl sm:text-3xl font-medium leading-tight sm:leading-[42px] text-center">Login Here</h3>

                <div>
                    <label htmlFor="email" className="block mt-8 text-sm sm:text-base font-medium">Email</label>
                    <input
                        type="text"
                        placeholder="Email"
                        id="email"
                        className="outline-none block h-[45px] sm:h-[50px] w-full bg-white/10 rounded-md px-[10px] mt-2 text-[14px] sm:text-[16px] font-light"
                        {...register('email')}
                    />
                    {errors?.email && <p className="text-xs sm:text-sm text-red-600 py-2">{errors?.email.message}</p>}
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
                    <Link to='/forgot-password' className="w-fit float-end text-xs sm:text-sm pt-2 mt-2">Forgot Password?</Link>
                </div>
                {errors?.password && <p className="text-xs sm:text-sm text-red-600 py-2">{errors?.password.message}</p>}

                <button
                    className="mt-8 sm:mt-12 w-full bg-white text-[#080710] py-3 sm:py-4 text-[16px] sm:text-[18px] font-semibold rounded-md cursor-pointer"
                >
                    Log In
                </button>
            </form>
        </div>
    );
}

export default Login;