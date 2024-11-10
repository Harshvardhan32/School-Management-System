import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
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
        <div className="w-screen h-screen bg-[#080710] flex justify-center items-center">
            <div className="w-[430px] h-[520px] absolute -translate-x-1/2 -translate-y-1/2 left-[50%] top-[50%]">
                <div className="h-[200px] w-[200px] absolute rounded-full bg-gradient-to-b from-[#1845ad] to-[#23a2f6] -left-[80px] -top-[80px]">
                </div>
                <div className="h-[200px] w-[200px] absolute rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] -right-[30px] -bottom-[80px]">
                </div>
            </div>
            <form
                onSubmit={onSubmit}
                className="h-[520px] w-[400px] bg-white/10 absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-lg backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] py-[50px] px-[35px] font-poppins text-white tracking-wide outline-none border-none"
            >
                <h3 className="text-[32px] font-medium leading-[42px] text-center">Login Here</h3>

                <div>
                    <label htmlFor="email" className="block mt-8 text-[16px] font-medium">Email</label>
                    <input
                        type="text"
                        placeholder="Email"
                        id="email"
                        className="outline-none block h-[50px] w-full bg-white/10 rounded-[3px] px-[10px] mt-2 text-[14px] font-light"
                        {...register('email')}
                    />
                    {errors?.email && <p className="text-xs text-red-700 py-2">{errors?.email.message}</p>}
                </div>
                <div className="relative">
                    <label htmlFor="password" className="block mt-8 text-[16px] font-medium">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="outline-none block h-[50px] w-full bg-white/10 rounded-[3px] px-[10px] mt-2 text-[14px] font-light"
                        {...register("password")}
                    />
                    <span className="absolute text-2xl text-gray-400 top-[45px] right-2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
                </div>
                {errors?.password && <p className="text-xs text-red-700 py-2">{errors?.password.message}</p>}
                <button className="mt-12 w-full bg-white text-[#080710] py-4 text-[18px] font-semibold rounded-[5px] cursor-pointer">Log In</button>
            </form>
        </div>
    );
}

export default Login;