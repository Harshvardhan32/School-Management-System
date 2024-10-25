import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";

const AssignmentForm = ({ type, data }) => {

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
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a new' : 'Update'} Assignment</h1>
            <span className="text-xs font-medium text-gray-700">Authentication Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Username</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("userName")}
                    />
                    {errors.userName && <p className="text-xs text-red-700 py-2">{errors.userName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        type="email"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("email")}
                        defaultValue={data?.email}
                    />
                    {errors.email && <p className="text-xs text-red-700 py-2">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Password</label>
                    <input
                        type="password"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("password")}
                    />
                    {errors.password && <p className="text-xs text-red-700 py-2">{errors.password.message}</p>}
                </div>
            </div>
            <span className="text-xs font-medium text-gray-700">Personal Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">First Name</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("firstName")}
                    />
                    {errors.firstName && <p className="text-xs text-red-700 py-2">{errors.firstName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Last Name</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("lastName")}
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                        type="tel"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("phone")}
                        defaultValue={data?.phone}
                    />
                    {errors.phone && <p className="text-xs text-red-700 py-2">{errors.phone.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Address</label>
                    <input
                        type="text"
                        className="min-w-[150px] w-full ring-[1.5px] ring-gray-300 p-2 rounded-[6px] text-sm"
                        {...register("address")}
                        defaultValue={data?.address}
                    />
                    {errors.address && <p className="text-xs text-red-700 py-2">{errors.address.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default AssignmentForm;