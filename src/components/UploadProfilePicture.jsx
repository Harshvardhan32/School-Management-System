import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { TbUpload } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfilePicture } from "../services/operations/userAPI";

const UploadProfilePicture = ({ data }) => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);
    const { user } = useSelector(state => state?.profile);

    const {
        register,
        handleSubmit
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
        if (!data?.photo?.length) {
            toast.error('Profile Photo is required!');
            return;
        }

        let formData = new FormData();
        formData.append('id', user?.userId._id);
        formData.append('photo', data.photo[0]);
        dispatch(uploadProfilePicture(formData, token));
    });

    const [imagePreview, setImagePreview] = useState(null);

    return (
        <form onSubmit={onSubmit} className="flex flex-wrap gap-4 items-center">
            <div>
                {
                    imagePreview ?
                        <img src={imagePreview} alt="Preview" className="w-[66px] h-[66px] rounded-full object-cover" />
                        : <img src={data?.userId.photo} alt="" className="w-[66px] h-[66px] rounded-full object-cover" />
                }
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-base font-medium dark:text-gray-200">Change Profile Picture</p>
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