import { FaRegEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDate } from "../../services/formatDate";

const Profile = () => {

    const { user } = useSelector(state => state?.profile);
    const { role } = user?.userId;

    return (
        <div className="flex flex-col gap-2 mx-4 max-w-[1200px]">
            <p className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 text-2xl font-medium">Profile</p>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 flex flex-row flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4 items-center dark:text-gray-200">
                    <div className="max-[600px]:hidden">
                        <img src={user?.userId.photo} alt="" className="w-[66px] h-[66px] rounded-full" />
                    </div>
                    <div>
                        <p className="text-xl font-medium">{user?.userId.firstName} {user?.userId.lastName}</p>
                        <p className="text-base">{user?.userId.email}</p>
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
                    <div className="min-w-[150px] flex flex-col gap-2 flex-1 break-words">
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>First Name</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.firstName}</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Last Name</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.lastName}</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Email</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.email}</p>
                        </div>
                    </div>
                    <div className="min-w-[150px] flex flex-col gap-2 flex-1 break-words">
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Phone Number</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.phone}</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Gender</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.sex}</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Date Of Birth</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.dateOfBirth ? formatDate(user?.userId.dateOfBirth) : '---'}</p>
                        </div>
                    </div>
                    {
                        role === 'Student' &&
                        <div className="min-w-[150px] flex flex-col gap-2 flex-1 break-words">
                            <div>
                                <p className='text-base dark:text-gray-200 font-medium'>Roll Number</p>
                                <p className="text-base dark:text-gray-400">{user?.rollNumber}</p>
                            </div>
                            <div>
                                <p className='text-base dark:text-gray-200 font-medium'>Father Name</p>
                                <p className="text-base dark:text-gray-400">{user?.fatherName}</p>
                            </div>
                            <div>
                                <p className='text-base dark:text-gray-200 font-medium'>Mother Name</p>
                                <p className="text-base dark:text-gray-400">{user?.motherName}</p>
                            </div>
                        </div>
                    }
                    <div className="min-w-[150px] flex flex-col gap-2 flex-1 break-words">
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Blood Group</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.bloodType ? user?.userId.bloodType : '---'}</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Address</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.address}</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Role</p>
                            <p className="text-base dark:text-gray-400">{role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;