import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Route guard that blocks ADMIN users from accessing user/public pages
 * Admins will be redirected to /admin
 */
export default function UserOnlyRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // If user is admin, show access denied
    if (user && user.role === "ADMIN") {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
}
