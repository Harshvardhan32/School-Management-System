import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const ForgotPassword = () => {

    const schema = z.object({
        email: z.string().email({ message: 'Invalid email address!' })
    })

    const { getValues, register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        setEmailSent(true);
        // navigate('/update-password/rtg4u54hjkcjutbygkf');
    })

    return (
        <div className="bg-gray-100 w-screen h-screen flex items-center justify-center p-4">
            <div className="bg-white shadow-xl max-w-[450px] w-full flex flex-col gap-4 border-2 border-gray-200 p-6 rounded-[6px]">
                <div className="flex flex-col gap-4 text-gray-800">
                    <h2 className="text-3xl font-medium">{emailSent ? 'Check Email' : 'Reset your password'}</h2>
                    <p className="text-base">
                        {emailSent ? `We have sent the reset email to ${getValues('email')}` :
                            "We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery."}
                    </p>
                </div>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={onSubmit}
                >
                    {
                        !emailSent &&
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
                    }
                    <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{emailSent ? 'Resend Email' : 'Submit'}</button>
                </form>
                <Link to='/' className="flex flex-row gap-2 items-center text-base">
                    <IoArrowBack />
                    <p>Back to Login</p>
                </Link>
            </div>
        </div>
    )
}

export default ForgotPassword;