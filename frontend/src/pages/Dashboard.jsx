import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";

const Dashboard = () => {

    return (
        <div className="relative flex min-h-screen w-screen bg-[#E6EBEE] dark:bg-slate-800">
            <Sidebar />
            <div className="h-full flex-1 overflow-auto">
                <Navbar />
                <div className="max-w-[99%] min-w-[300px] w-full py-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;