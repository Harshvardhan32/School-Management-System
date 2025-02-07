import Menu from "./Menu";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Sidebar = () => {

    return (
        <div className="min-w-[60px] w-[16%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white dark:bg-slate-900 p-4 shadow-md">
            <Link to='/' className="flex items-center justify-evenly gap-2">
                <img src={Logo} alt="Logo" className="w-[32px] h-[32px]" />
                <span className="hidden lg:block font-bold dark:text-gray-200">School ABCD</span>
            </Link>
            <Menu />
        </div>
    );
}

export default Sidebar;