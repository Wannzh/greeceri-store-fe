import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem("access_token");
        const savedUser = localStorage.getItem("user");

        if (savedToken) {
            setToken(savedToken);
        }

        if (savedUser && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parsing user:", e);
            }
        }

        setLoading(false);
    }, []);

    // LOGIN
    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });

            const data = res.data.data;

            const accessToken = data.accessToken;
            const refreshToken = data.refreshToken;

            const userData = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
            };

            setUser(userData);
            setToken(accessToken);

            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            localStorage.setItem("user", JSON.stringify(userData))

            // Redirect by role
            if (userData.role === "ADMIN") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    };

    // LOGOUT
    const logout = () => {
        setUser(null);
        setToken(null);
        
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
