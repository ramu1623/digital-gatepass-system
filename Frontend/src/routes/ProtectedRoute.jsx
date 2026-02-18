import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
    const { user, token } = useContext(AuthContext);

    // not logged in
    if (!token || !user) {
        return <Navigate to="/" replace />; // we can also use useNavigate but no problem
    }

    // role mismatch
    if (role && user.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
