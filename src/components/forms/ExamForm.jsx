import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const ExamForm = ({ type, data }) => {

    const schema = z.object({
        userName: z.string()
            .min(3, { message: 'Username must be at least 3 character long!' })
            .max(20, { message: "Username must be at most 20 characters long!" }),
        email: z.string().email({ message: 'Invalid email address!' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long!' }),
        firstName: z.string().min(1, { message: 'First name is required!' }),
        lastName: z.string().optional(),
        phone: z.string().min(1, { message: 'Phone is required!' }),
        address: z.string().min(1, { message: 'Address is required!' }),
        bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
        birthday: z.string().refine((value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
        }, { message: 'Invalid date!' }),
        sex: z.enum(['male', 'female', 'others'], { message: 'Sex is required!' }),
        img: z.any().refine((files) => files?.length > 0, {
            message: 'Image is required!',
        }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema), });

    const onSubmit = handleSubmit(data => {
        console.log(data);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a new' : 'Update'} Exam</h1>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Exam Title</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("userName")}
                    />
                    {errors.userName && <p className="text-xs text-red-700 py-2">{errors.userName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Start Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("email")}
                        defaultValue={data?.email}
                    />
                    {errors.email && <p className="text-xs text-red-700 py-2">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">End Date</label>
                    <input
                        type="datetime-local"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("password")}
                    />
                    {errors.password && <p className="text-xs text-red-700 py-2">{errors.password.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Subject</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("sex")}
                    >
                        <option value="male">Physics</option>
                        <option value="female">Chemistry</option>
                        <option value="others">Mathematics</option>
                        <option value="others">Biology</option>
                        <option value="others">History</option>
                        <option value="others">Hindi</option>
                        <option value="others">English</option>
                    </select>
                    {errors.sex && <p className="text-xs text-red-700 py-2">{errors.sex.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default ExamForm;