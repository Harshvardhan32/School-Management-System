import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TbUpload } from "react-icons/tb";

const UploadProfilePicture = () => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

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

    const onSubmit = handleSubmit((data) => {
        if (data?.photo.length === 0) {
            toast.error('Profile Photo is required!');
            return;
        }
        console.log(data);
    });

    const [imagePreview, setImagePreview] = useState(null);

    return (
        <form onSubmit={onSubmit} className="flex flex-wrap gap-4 items-center">
            <div>
                {
                    imagePreview ?
                        <img src={imagePreview} alt="Preview" className="w-[66px] h-[66px] rounded-full object-cover" />
                        : <img src="/avatar.png" alt="" className="w-[66px] h-[66px] rounded-full object-cover" />
                }
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-base dark:text-gray-200">Change Profile Picture</p>
                <div className="flex flex-row gap-4">
                    <label htmlFor="photo" className="cursor-pointer bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded-[6px]">
                        Select
                        <input
                            id="photo"
                            type="file"
                            className="hidden"
                            {...register("photo", {
                                onChange: handleImageChange
                            })}
                        />
                    </label>
                    <button
                        className="flex gap-2 items-center bg-[#51DFC3] text-gray-800 font-semibold px-4 py-2 rounded-[6px]">
                        <span>Upload</span>
                        <TbUpload fontSize={20} />
                    </button>
                </div>
            </div>
        </form>
    );
}

export default UploadProfilePicture;