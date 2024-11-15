import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import * as z from 'zod';
import { resetPasswordToken } from "../services/operations/authAPI";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {

    const schema = z.object({
        email: z.string().email({ message: 'Invalid email address!' })
    });

    const {
        getValues,
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema)
    });

    const dispatch = useDispatch();
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = handleSubmit((data) => {
        dispatch(resetPasswordToken(data?.email, setEmailSent));
    });

    return (
        <div className="w-screen h-screen bg-[#080710] flex justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[300px] h-[350px] sm:w-[460px] sm:h-[520px]">
                <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full bg-gradient-to-b from-[#1845ad] to-[#23a2f6] -left-[30px] sm:-left-[30px] -top-[80px] sm:-top-[40px]"></div>
                <div className="absolute w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] -right-[30px] sm:-right-[30px] -bottom-[80px] sm:-bottom-[40px]"></div>
            </div>
            <div
                className="relative w-full max-w-[320px] sm:max-w-[430px] bg-white/10 rounded-lg backdrop-blur-lg border border-white/10 shadow-[0_0_40px_rgba(8,7,16,0.6)] p-8 sm:py-[50px] sm:px-[35px] font-poppins text-white tracking-wide">
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-[24px] sm:text-[32px] font-medium leading-[32px] sm:leading-[42px] text-center">
                            {emailSent ? 'Check Email' : 'Reset your password'}
                        </h3>
                        <p className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-center mt-4 break-words">
                            {emailSent
                                ? `We have sent the reset email to ${getValues('email')}`
                                : "We'll email you instructions to reset your password. If you don't have access to your email, we can try account recovery."
                            }
                        </p>
                    </div>

                    {!emailSent && (
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="block mt-6 sm:mt-8 text-[14px] sm:text-[16px] font-medium">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="outline-none block h-[45px] sm:h-[50px] w-full bg-white/10 rounded-[3px] px-[10px] mt-2 text-[14px] sm:text-[16px] font-light"
                                {...register("email")}
                            />
                            {errors?.email && <p className="text-xs sm:text-sm text-red-600 py-2">{errors.email.message}</p>}
                        </div>
                    )}
                    <button className="mt-8 sm:mt-12 w-full bg-white text-[#080710] py-3 sm:py-4 text-[16px] sm:text-[18px] font-semibold rounded-[5px] cursor-pointer">
                        {emailSent ? 'Resend Email' : 'Send Email'}
                    </button>
                </form>

                <Link to='/' className="w-fit flex flex-row gap-2 items-center text-sm sm:text-base text-white mt-4">
                    <IoArrowBack />
                    <p>Back to Login</p>
                </Link>
            </div>
        </div>
    );
}

export default ForgotPassword;