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

import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import PaymentResultPage from "@/features/checkout/pages/PaymentResultPage";

import OrderHistoryPage from "@/features/orders/pages/OrderHistoryPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";

export default function AppRouter() {
    return (
        <Routes>
            {/* Layout global */}
            <Route element={<AppLayout />}>
                {/* Homepage */}
                <Route
                    path="/"
                    element={
                        <HomePage />
                    }
                />

                {/* Product */}
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Cart */}
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <CartPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <CheckoutPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/payment-success" element={<PaymentResultPage status="success" />} />
                <Route path="/payment-failure" element={<PaymentResultPage status="failure" />} />

                <Route
                    path="/orders/my"
                    element={
                        <ProtectedRoute>
                            <OrderHistoryPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders/:orderId"
                    element={
                        <ProtectedRoute>
                            <OrderDetailPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />
            </Route>


            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
