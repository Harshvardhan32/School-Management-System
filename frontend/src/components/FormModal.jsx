import { useState } from "react";
import * as Forms from './forms';
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

const FormModal = ({ table, type, title, Icon, allData, data, deleteFunction }) => {

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const { token } = useSelector((state) => state?.auth);
    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";

    const { handleSubmit } = useForm();

    // Handle form submission for delete operation
    const onSubmit = handleSubmit(() => {
        dispatch(deleteFunction(data, token, setOpen));
    });

    // Centralized form renderer using dynamic imports
    const FormRenderer = () => {
        if (type === "delete") {
            return (
                <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
                    <span className="text-center font-medium dark:text-gray-200">
                        All data will be lost. Are you sure you want to delete this {table}?
                    </span>
                    <button
                        type="submit"
                        className="bg-red-700 text-white py-2 px-4 rounded-[6px] border-none w-max self-center"
                    >Delete</button>
                </form>
            );
        }

        const FormComponent = Forms[`${table.charAt(0).toUpperCase() + table.slice(1)}Form`];

        if (FormComponent) {
            return (
                <FormComponent
                    type={type}
                    data={data}
                    allData={allData}
                    setOpen={setOpen}
                />
            );
        }

        return null;
    };

    return (
        <div>
            {/* Button to open the modal */}
            <button
                title={title}
                className={`${size} flex items-center justify-center rounded-full ${type === "delete" ? "bg-[#FF4B96]" : "bg-[#51DFC3]"
                    }`}
                onClick={() => setOpen(true)}
            >
                {Icon && <Icon fontSize={18} className="text-gray-600" />}
            </button>

            {/* Modal structure */}
            {open && (
                <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto w-screen min-h-screen py-10 top-0 left-0 bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <FormRenderer />
                        {/* Close button */}
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <RxCross2 fontSize={22} className="text-gray-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormModal;