import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useEffect, useMemo, useState } from "react";
import MultiSelectComponent from "../MultiSelectComponent";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents } from "../../services/operations/studentAPI";
import { createParent, updateParent } from '../../services/operations/parentAPI';

const ParentForm = ({ type, data, allData, setOpen }) => {

    allData = useMemo(() => {
        return type === 'update'
            ? allData.filter((item) => item !== data?.parentId)
            : allData;
    }, [type]);

    const passwordSchema = (type) =>
        type === 'create'
            ? z.string().min(8, { message: 'Password must be at least 8 characters long!' })
            : z.string().optional();

    const schema = z.object({
        parentId: z.string()
            .min(3, { message: 'Parent ID must be at least 3 character long!' })
            .max(20, { message: "Parent ID must be at most 20 characters long!" })
            .regex(/^\S+$/, { message: "Parent ID must not contain spaces!" })
            .refine(
                (id) => !allData.includes(id),
                { message: "Parent ID already exists!" }
            ),
        email: z.string().email({ message: 'Invalid email address!' }),
        password: passwordSchema(type),
        firstName: z.string().min(1, { message: 'First name is required!' }),
        lastName: z.string().optional(),
        phone: z.string().min(10, { message: 'Phone number must be 10 characher!' }).max(10, { message: 'Phone number must be 10 characher!' }).transform((val) => parseInt(val)),
        address: z.string().min(1, { message: 'Address is required!' }),
        sex: z.enum(['male', 'female', 'others'], { message: 'Sex is required!' }),
        role: z.string().default('Parent'),
        students: z.array(z.string()).optional(),
    });

    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            students: type === 'update'
                ? data?.students?.map((student) => student?._id) : [],
        },
    });

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    useEffect(() => {
        dispatch(getAllStudents(token, undefined, undefined, true));
    }, []);

    const { allStudents } = useSelector(state => state?.student);
    const [showPassword, setShowPassword] = useState(false);

    const studentOptions = useMemo(() => {
        return allStudents?.map((item) => ({
            id: item?._id,
            name: item?.userId.firstName + " " + item?.userId.lastName,
        })) || [];
    }, [allStudents]);

    let selectedStudents = (type === 'update' && data?.students?.length > 0)
        ? data?.students?.map((student) => {
            return {
                id: student?._id,
                name: student?.userId?.firstName + " " + student?.userId?.lastName
            }
        })
        : getValues("students")?.map((id) => studentOptions.find((option) => option.id === id));

    const onSubmit = handleSubmit(formData => {
        console.log(formData);
        if (type === 'create') {
            // dispatch(createParent(formData, token, setOpen));
        } else {
            formData.id = data._id;
            dispatch(updateParent(formData, token, setOpen));
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update'} Parent</h1>
            <span className="text-xs font-medium text-gray-700">Authentication Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Parent ID</label>
                    <input
                        type="text"
                        placeholder="Parent ID"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("parentId")}
                        defaultValue={type === 'update' ? data?.parentId : ''}
                    />
                    {errors?.parentId && <p className="text-xs text-red-700 py-2">{errors?.parentId.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("email")}
                        defaultValue={type === 'update' ? data?.userId.email : ''}
                    />
                    {errors?.email && <p className="text-xs text-red-700 py-2">{errors?.email.message}</p>}
                </div>
                {
                    type === 'create' &&
                    <div className="flex flex-col gap-2 flex-1">
                        <label className="text-sm text-gray-500">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm pr-9"
                                {...register("password")}
                            />
                            <span className="absolute text-2xl text-gray-400 top-[6px] right-2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</span>
                        </div>
                        {errors?.password && <p className="text-xs text-red-700 py-2">{errors?.password.message}</p>}
                    </div>
                }
            </div>
            <span className="text-xs font-medium text-gray-700">Personal Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">First Name</label>
                    <input
                        type="text"
                        placeholder="First Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("firstName")}
                        defaultValue={type === 'update' ? data?.userId.firstName : ''}
                    />
                    {errors?.firstName && <p className="text-xs text-red-700 py-2">{errors?.firstName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Last Name</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("lastName")}
                        defaultValue={type === 'update' ? data?.userId.lastName : ''}
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                        type="number"
                        placeholder="Phone"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm no-spin"
                        {...register("phone")}
                        defaultValue={type === 'update' ? data?.userId.phone : ''}
                    />
                    {errors?.phone && <p className="text-xs text-red-700 py-2">{errors?.phone.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Address</label>
                    <input
                        type="text"
                        placeholder="Address"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("address")}
                        defaultValue={type === 'update' ? data?.userId.address : ''}
                    />
                    {errors?.address && <p className="text-xs text-red-700 py-2">{errors?.address.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Sex</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("sex")}
                        defaultValue={type === 'update' && data?.userId?.sex?.toLowerCase()}
                    >
                        <option value="">Please Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>
                    {errors?.sex && <p className="text-xs text-red-700 py-2">{errors?.sex.message}</p>}
                </div>
            </div>
            <span className="text-xs font-medium text-gray-700">Student Information</span>
            <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                <label className="text-sm text-gray-500">Students</label>
                <MultiSelectComponent
                    options={studentOptions}
                    selectedValue={selectedStudents}
                    setSelectedValue={(value) =>
                        setValue(
                            "students",
                            value.map((item) => item.id)
                        )}
                />
                {errors?.students && <p className="text-xs text-red-700 py-2">{errors?.students.message}</p>}
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[6px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default ParentForm;