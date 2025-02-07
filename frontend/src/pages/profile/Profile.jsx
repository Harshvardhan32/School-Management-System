import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { formatDate } from "../../services/formatDate";

const Profile = () => {

    const { user } = useSelector(state => state?.profile);
    const { role } = user?.userId;

    // Determine the userId based on the role (Admin, Teacher, Student, Parent)
    const userId = role === 'Admin' ? user?.adminId
        : role === 'Teacher' ? user?.teacherId
            : role === 'Student' ? user?.studentId : user?.parentId;

    return (
        <div className="flex flex-col gap-2 mx-4">
            {/* Profile title section */}
            <p className="bg-white dark:bg-slate-900 p-4 rounded-[6px] dark:text-gray-200 text-2xl font-medium shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">Profile</p>

            {/* Profile summary section */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex-1 flex flex-row flex-wrap gap-4 items-center justify-between shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <div className="flex gap-4 items-center dark:text-gray-200">
                    <div>
                        <img
                            src={user?.userId.photo}
                            alt=""
                            tabIndex='0'
                            className="w-[66px] h-[66px] rounded-full object-cover focus:border-2 focus:border-gray-400 dark:focus:border-gray-700"
                        />
                    </div>
                    <div className="max-[400px]:hidden">
                        {/* Display user's name and email */}
                        <p className="text-xl font-medium text-wrap">{user?.userId.firstName} {user?.userId.lastName}</p>
                        <p className="text-base text-wrap">{user?.userId.email}</p>
                    </div>
                </div>
                {/* Edit button leading to settings */}
                <Link to='/settings' className="flex gap-4 items-center bg-[#51DFC3] py-2 px-4 rounded-[6px]">
                    <span className="text-base font-medium">Edit</span>
                    <FaRegEdit fontSize={20} />
                </Link>
            </div>

            {/* Personal details section */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[6px] flex flex-col gap-4 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <p className="text-xl font-medium dark:text-gray-200">Personal Details</p>
                    {/* Edit button leading to settings */}
                    <Link to='/settings' className="flex gap-4 items-center bg-[#51DFC3] py-2 px-4 rounded-[6px]">
                        <span className="text-base font-medium">Edit</span>
                        <FaRegEdit fontSize={20} />
                    </Link>
                </div>

                {/* Display personal details dynamically based on user role */}
                <div className="flex flex-wrap flex-1 justify-between gap-4">
                    {/* Display user information like ID, Name, Email, etc. */}
                    <div className="min-w-[150px] flex flex-col gap-2 flex-1 break-words">
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>User ID</p>
                            <p className="text-base dark:text-gray-400">{userId}</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Name</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.firstName} {user?.userId.lastName}</p>
                        </div>
                        <div>
                            <p className='text-base dark:text-gray-200 font-medium'>Email</p>
                            <p className="text-base dark:text-gray-400">{user?.userId.email}</p>
                        </div>
                    </div>

                    {/* Display phone number, gender, and date of birth */}
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

                    {/* Display student-specific details like roll number, parents' names */}
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

                    {/* Display blood group, address, and role */}
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

                {/* Teacher-specific details */}
                {
                    role === 'Teacher' &&
                    <div className="flex flex-col justify-between gap-4">
                        <div className="min-w-[150px] flex gap-2 flex-1 break-words">
                            <p className='text-base dark:text-gray-200 font-medium'>Classes: </p>
                            <p className="text-base dark:text-gray-400">{user?.classes?.map((item) => item.className).join(', ')}</p>
                        </div>
                        <div className="min-w-[150px] flex gap-2 flex-1 break-words">
                            <p className='text-base dark:text-gray-200 font-medium'>Subjects: </p>
                            <p className="text-base dark:text-gray-400">{user?.subjects?.map((item) => item.subjectName).join(', ')}</p>
                        </div>
                    </div>
                }

                {/* Student-specific class and subjects */}
                {
                    role === 'Student' &&
                    <div className="flex flex-col justify-between gap-4">
                        <div className="min-w-[150px] flex gap-2 flex-1 break-words">
                            <p className='text-base dark:text-gray-200 font-medium'>Class: </p>
                            <p className="text-base dark:text-gray-400">{user?.classId?.className}</p>
                        </div>
                        <div className="min-w-[150px] flex gap-2 flex-1 break-words">
                            <p className='text-base dark:text-gray-200 font-medium'>Subjects: </p>
                            <p className="text-base dark:text-gray-400">{user?.subjects?.map((item) => item.subjectName).join(', ')}</p>
                        </div>
                    </div>
                }

                {/* Parent-specific students */}
                {
                    role === 'Parent' &&
                    <div className="min-w-[150px] flex gap-2 flex-1 break-words">
                        <p className='text-base dark:text-gray-200 font-medium'>Students: </p>
                        <p className="text-base dark:text-gray-400">{user?.students.map((student) => student.userId.firstName + ' ' + student.userId.lastName + ' ' + student.classId.className).join(', ')}</p>
                    </div>
                }
            </div>
        </div>
    );
}

export default Profile;