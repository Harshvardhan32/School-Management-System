import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ userType, children }) => {

    const { user } = useSelector((state) => state?.profile);

    if (userType.includes(user?.userId?.role)) {
        return children;
    } else {
        return <Navigate to="/" />
    }

}

export default ProtectedRoute;