import { useDispatch, useSelector } from "react-redux";
import Announcements from "../../components/Announcements";
import AttendanceChart from "../../components/AttendanceChart";
import CountChart from "../../components/CountChart";
import EventCalendar from "../../components/EventCalender";
import FinanceChart from "../../components/FinanceChart";
import UserCard from "../../components/UserCard";
import { useEffect } from "react";
import { getAllStudents } from "../../services/operations/studentAPI";
import { getAllTeachers } from "../../services/operations/teacherAPI";
import { getAllParents } from "../../services/operations/parentAPI";

const Admin = () => {

    const dispatch = useDispatch();
    const { token } = useSelector(state => state?.auth);

    useEffect(() => {
        dispatch(getAllStudents(token, undefined, undefined, true));
        dispatch(getAllTeachers(token, undefined, undefined, true));
        dispatch(getAllParents(token, undefined, undefined, true));
    }, [token]);

    const { allStudents } = useSelector(state => state?.student);
    const { allTeachers } = useSelector(state => state?.teacher);
    const { allParents } = useSelector(state => state?.parent);

    let noOfBoys = 0;
    let noOfGirls = 0;
    let others = 0;

    allStudents?.map((student) => {
        const sex = student?.userId?.sex;
        sex === 'male' ? noOfBoys += 1 : sex === 'female' ? noOfGirls += 1 : others += 1;
    });

    return (
        <div className="p-4 flex flex-col gap-4 md:flex-row mx-4">
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                {/* USER CARD */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type={'Student'} number={allStudents?.length || 0} />
                    <UserCard type={'Teacher'} number={allTeachers?.length || 0} />
                    <UserCard type={'Parent'} number={allParents?.length || 0} />
                    <UserCard type={'Staff'} number={1200} />
                </div>

                {/* MIDDLE CHART */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNT CHART */}
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <CountChart total={allStudents?.length || 0} boys={noOfBoys} girls={noOfBoys} others={others} />
                    </div>
                    {/* ATTENDANCE CHART */}
                    <div className="w-full lg:w-2/3 h-[450px]">
                        <AttendanceChart />
                    </div>
                </div>

                {/* BOTTOM CHART */}
                <div className="w-full h-[550px]">
                    <FinanceChart />
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <EventCalendar />
                <Announcements />
            </div>
        </div>
    );
}

export default Admin;