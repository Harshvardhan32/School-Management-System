import Announcements from "../../components/Announcements";
import AttendanceChart from "../../components/AttendanceChart";
import CountChart from "../../components/CountChart";
import EventCalendar from "../../components/EventCalender";
import FinanceChart from "../../components/FinanceChart";
import UserCard from "../../components/UserCard";

const Admin = () => {

    return (
        <div className="p-4 flex flex-col gap-4 md:flex-row mx-4">
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                {/* USER CARD */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type={'Student'} />
                    <UserCard type={'Teacher'} />
                    <UserCard type={'Parent'} />
                    <UserCard type={'Staff'} />
                </div>

                {/* MIDDLE CHART */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNT CHART */}
                    <div className="w-full lg:w-1/3 h-[450px]">
                        <CountChart />
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