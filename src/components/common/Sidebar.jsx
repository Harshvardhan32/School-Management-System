import { Link } from "react-router-dom";
import Logo from '../../assets/logo.png'
import Menu from "./Menu";
const Sidebar = () => {

    return (
        <div className="w-[16%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-white p-4">
            <Link to='/' className="flex items-center justify-evenly gap-2">
                <img src={Logo} alt="Logo" className="w-[32px] h-[32px]" />
                <span className="hidden lg:block font-bold">School ABCD</span>
            </Link>
            <Menu />
        </div>
    );
}

export default Sidebar;