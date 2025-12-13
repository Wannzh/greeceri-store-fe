import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FullScreenLoader from "@/components/common/FullScreenLoader";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <FullScreenLoader />
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }


    return children;
}