/**
 * Auth Context
 * =============
 * Menyediakan manajemen state autentikasi global untuk aplikasi.
 * 
 * State:
 * - user: Data user yang login (id, name, email, role, profileImageUrl)
 * - token: JWT access token untuk autentikasi API
 * - loading: Status loading saat pengecekan autentikasi awal
 * - isAuthenticated: Boolean yang menunjukkan apakah user sudah login
 * 
 * Method:
 * - login: Autentikasi user dengan email/password
 * - googleLogin: Autentikasi user dengan Google OAuth
 * - logout: Hapus state autentikasi dan redirect ke login
 * 
 * Penggunaan: Bungkus app dengan AuthProvider, gunakan hook useAuth() untuk akses state/method
 */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";

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

    // Menyimpan data autentikasi ke state dan localStorage
    const saveAuthData = (data) => {
        const userData = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            profileImageUrl: data.profileImageUrl || null,
        };

        setUser(userData);
        setToken(data.accessToken);

        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
    };

    // LOGIN
    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            const userData = saveAuthData(data);

            // Redirect berdasarkan role
            if (userData.role === "ADMIN") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login gagal",
            };
        }
    };

    // GOOGLE LOGIN
    const googleLogin = async (idToken) => {
        try {
            const data = await authService.googleLogin(idToken);
            const userData = saveAuthData(data);

            // Redirect berdasarkan role
            if (userData.role === "ADMIN") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Google login gagal",
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
                googleLogin,
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
