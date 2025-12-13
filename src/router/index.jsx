import { Routes, Route } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";

import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ProductListPage from "@/features/product/pages/ProductListPage";
import ProductDetailPage from "@/features/product/pages/ProductDetailPage";
import CartPage from "@/features/cart/pages/CartPage";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

export default function AppRouter() {
    return (
        <Routes>
            {/* Layout global */}
            <Route element={<AppLayout />}>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Admin */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
