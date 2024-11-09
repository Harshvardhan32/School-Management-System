import { FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const Profile = () => {

    return (
        <div className="flex flex-col gap-2 mx-4 max-w-[1200px]">
            <p className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 text-2xl font-medium">Profile</p>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 flex flex-row flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center dark:text-gray-200">
                    <div className="max-[600px]:hidden">
                        <img src="/avatar.png" alt="" className="w-[66px] h-[66px] rounded-full" />
                    </div>
                    <div>
                        <p className="text-xl font-medium">Alok Kumar</p>
                        <p className="text-base">alok2003@gmail.com</p>
                    </div>
                </div>
                <Link to='/settings' className="flex gap-4 items-center bg-[#51DFC3] py-2 px-4 rounded-[6px]">
                    <span className="text-base font-medium">Edit</span>
                    <FaRegEdit fontSize={20} />
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex flex-col gap-4">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <p className="text-xl font-medium dark:text-gray-200">Personal Details</p>
                    <Link to='/settings' className="flex gap-4 items-center bg-[#51DFC3] py-2 px-4 rounded-[6px]">
                        <span className="text-base font-medium">Edit</span>
                        <FaRegEdit fontSize={20} />
                    </Link>
                </div>
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>First Name</p>
                            <p className="text-base dark:text-gray-400">Alok</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Last Name</p>
                            <p className="text-base dark:text-gray-400">Kumar</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Email</p>
                            <p className="text-base dark:text-gray-400">alok2003@gmail.com</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Phone Number</p>
                            <p className="text-base dark:text-gray-400">9856785654</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Gender</p>
                            <p className="text-base dark:text-gray-400">Male</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Date Of Birth</p>
                            <p className="text-base dark:text-gray-400">October 1, 2002</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Blood Group</p>
                            <p className="text-base dark:text-gray-400">B+</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Address</p>
                            <p className="text-base dark:text-gray-400">Crossing Republik, Ghaziabad 201009</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Role</p>
                            <p className="text-base dark:text-gray-400">Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;