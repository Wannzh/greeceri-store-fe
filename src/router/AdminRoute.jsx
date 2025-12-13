import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p>Checking authentication...</p>
            </div>
        )
    }

    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/" replace />
    }

    return children;
}
