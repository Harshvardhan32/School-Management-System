import { useSelector } from "react-redux";
import Admin from "../../../pages/admin/Admin";
import Parent from "../../../pages/parent/Parent";
import Teacher from "../../../pages/teacher/Teacher";
import Student from "../../../pages/student/Student";

const HomeRoute = () => {

    const { user } = useSelector((state) => state?.profile);

    const role = user?.userId?.role;

    if (role === 'Admin') {
        return <Admin />;
    } else if (role === 'Teacher') {
        return <Teacher />;
    } else if (role === 'Student') {
        return <Student />;
    } else if (role === 'Parent') {
        return <Parent />;
    }
}

export default HomeRoute;