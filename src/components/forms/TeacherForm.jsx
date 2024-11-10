import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SlCloudUpload } from "react-icons/sl";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import MultiSelectComponent from "../MultiSelectComponent";
import { useState } from "react";
import * as z from 'zod';
import toast from "react-hot-toast";

const TeacherForm = ({ type, data }) => {

    const passwordSchema = (type) =>
        type === 'create'
            ? z.string().min(8, { message: 'Password must be at least 8 characters long!' })
            : z.string().optional();

    const schema = z.object({
        teacherId: z.string()
            .min(3, { message: 'Teacher ID must be at least 3 character long!' })
            .max(20, { message: "Teacher ID must be at most 20 characters long!" }),
        email: z.string().email({ message: 'Invalid email address!' }),
        password: passwordSchema(type),
        firstName: z.string().min(1, { message: 'First name is required!' }),
        lastName: z.string().optional(),
        phone: z.string().min(10, { message: 'Phone number must be 10 characher!' }).max(10, { message: 'Phone number must be 10 characher!' }),
        address: z.string().min(1, { message: 'Address is required!' }),
        bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
        dateOfBirth: z.string().min(1, { message: 'Date of Birth is required!' }),
        sex: z.enum(['male', 'female', 'others'], { message: 'Sex is required!' }),
        subjects: z.array(
            z.object({ name: z.string(), })).min(1, { message: 'At least one subject must be selected!' }),
        classes: z.array(
            z.object({ name: z.string(), })).min(0, { message: 'At least one class must be selected!' }),
        img: z.any().refine((files) => files?.length > 0, {
            message: 'Image is required!',
        }),
    });

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema), defaultValues: {
            subjects: [],
            classes: []
        },
    });

    const classes = [
        { value: 'class-1', label: 'Class 1' },
        { value: 'class-2', label: 'Class 2' },
        // Add more classes as needed
    ];

    const onSubmit = handleSubmit(data => {
        console.log(data);
        toast.success(`Class ${type === 'create' ? 'Created' : 'Updated'} Successfully!`);
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the uploaded file
        if (file) {
            const reader = new FileReader(); // Create a new FileReader instance
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the preview image
            };
            reader.readAsDataURL(file); // Convert the image to a data URL
        }
    };

    const [classOptions] = useState([
        { name: '1A' },
        { name: '1B' },
        { name: '1C' },
        { name: '2A' },
        { name: '2B' },
    ]);

    const [subjectOptions] = useState([
        { name: 'English' },
        { name: 'Mathematics' },
        { name: 'Physics' },
        { name: 'Chemistry' },
        { name: 'History' },
    ]);

    const selectedSubject = getValues("subjects");
    const selectedClass = getValues("classes");
    const [showPassword, setShowPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold dark:text-gray-200">{type === 'create' ? 'Create a new' : 'Update the'} Teacher</h1>
            <span className="text-xs font-medium text-gray-700">Authentication Information</span>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Teacher ID</label>
                    <input
                        type="text"
                        placeholder="Teacher ID"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("teacherId")}
                    />
                    {errors?.teacherId && <p className="text-xs text-red-700 py-2">{errors?.teacherId.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("email")}
                    />
                    {errors.email && <p className="text-xs text-red-700 py-2">{errors.email.message}</p>}
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
                        defaultValue={data?.name.split(' ')[0]}
                    />
                    {errors.firstName && <p className="text-xs text-red-700 py-2">{errors.firstName.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Last Name</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("lastName")}
                        defaultValue={data?.name.split(' ')[1]}
                    />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Phone</label>
                    <input
                        type="tel"
                        placeholder="Phone"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
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
                        placeholder="Address"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("address")}
                        defaultValue={data?.address}
                    />
                    {errors.address && <p className="text-xs text-red-700 py-2">{errors.address.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Blood Type</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("bloodType")}
                        defaultValue={data?.name.split(' ')[0]}
                    >
                        <option value="">Please Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                    </select>
                    {errors.bloodType && <p className="text-xs text-red-700 py-2">{errors.bloodType.message}</p>}
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Date of Birth</label>
                    <input
                        type="date"
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("dateOfBirth")}
                    />
                    {errors?.dateOfBirth && <p className="text-xs text-red-700 py-2">{errors?.dateOfBirth.message}</p>}
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Sex</label>
                    <select
                        name=""
                        className="min-w-[150px] w-full outline-none dark:text-gray-200 dark:bg-slate-800 ring-[1.5px] ring-gray-300 dark:ring-gray-500 p-2 rounded-[2px] text-sm"
                        {...register("sex")}
                    >
                        <option value="">Please Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                    </select>
                    {errors?.sex && <p className="text-xs text-red-700 py-2">{errors?.sex.message}</p>}
                </div>
                <div className="flex gap-2 items-center flex-1 mt-7">
                    {/* Image preview */}
                    {
                        imagePreview &&
                        <div className="w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-50 flex object-cover">
                            <img src={imagePreview} alt="Preview" className="rounded-full w-full h-full object-cover" />
                        </div>
                    }
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2 justify-center items-center">
                            <label htmlFor="img" className="min-w-[150px] w-full text-sm text-gray-500 flex items-center gap-2 cursor-pointer">
                                <SlCloudUpload fontSize={25} />
                                <span>Upload a photo</span>
                            </label>
                            <input
                                type="file"
                                className="hidden"
                                id="img"
                                {...register("img", {
                                    onChange: handleImageChange
                                })}
                            />
                        </div>
                        {errors.img && <p className="text-xs text-red-700 py-2">{errors.img.message}</p>}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap flex-1 justify-between gap-4">
                <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Classes</label>
                    <MultiSelectComponent
                        options={classOptions}
                        selectedValue={selectedClass}
                        setSelectedValue={(value) => setValue("classes", value)}
                    />
                </div>
                <div className="min-w-[150px] w-full flex flex-col gap-2 flex-1">
                    <label className="text-sm text-gray-500">Subjects</label>
                    <MultiSelectComponent
                        options={subjectOptions}
                        selectedValue={selectedSubject}
                        setSelectedValue={(value) => setValue("subjects", value)}
                    />
                    {errors?.subjects && <p className="text-xs text-red-700 py-2">{errors?.subjects.message}</p>}
                </div>
            </div>
            <button className="bg-[#51DFC3] text-gray-800 font-semibold p-2 rounded-[2px]">{type === 'create' ? 'Create' : 'Update'}</button>
        </form>
    );
}

export default TeacherForm;