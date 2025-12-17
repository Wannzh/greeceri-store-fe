import { Routes, Route } from "react-router-dom";

/* Layout */
import AppLayout from "@/components/layout/AppLayout";
import AdminLayout from "@/components/layout/AdminLayout";

/* Guards */
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

/* Public Pages */
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";

/* Auth */
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

/* Product */
import ProductListPage from "@/features/product/pages/ProductListPage";
import ProductDetailPage from "@/features/product/pages/ProductDetailPage";

/* Cart & Checkout */
import CartPage from "@/features/cart/pages/CartPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import PaymentResultPage from "@/features/checkout/pages/PaymentResultPage";

/* Orders */
import OrderHistoryPage from "@/features/orders/pages/OrderHistoryPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";

/* User */
import ProfilePage from "@/features/user/pages/ProfilePage";
import EditProfilePage from "@/features/user/pages/EditPage";
import AddressListPage from "@/features/user/pages/AddressListPage";
import AddAddressPage from "@/features/user/pages/AddAddressPage";
import EditAddressPage from "@/features/user/pages/EditAddressPage";

/* Admin */
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import AdminProductListPage from "@/features/admin/pages/AdminProductListPage";
import AdminProductFormPage from "@/features/admin/pages/AdminProductFormPage";
import AdminCategoryListPage from "@/features/admin/pages/AdminCategoryListPage";
import AdminCategoryFormPage from "@/features/admin/pages/AdminCategoryFormPage";
import AdminOrderListPage from "@/features/admin/orders/pages/AdminOrderListPage";
import AdminOrderDetailPage from "@/features/admin/orders/pages/AdminOrderDetailPage";
import AdminUserListPage from "@/features/admin/users/pages/AdminUserListPage";
import AdminUserDetailPage from "@/features/admin/users/pages/AdminUserDetailPage";

export default function AppRouter() {
    return (
        <Routes>

            {/* USER / PUBLIC */}
            <Route element={<AppLayout />}>

                <Route path="/" element={<HomePage />} />

                {/* Product */}
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Cart & Checkout */}
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

                {/* Orders */}
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

                {/* User Profile */}
                <Route
                    path="/user/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/profile/edit"
                    element={
                        <ProtectedRoute>
                            <EditProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/addresses"
                    element={
                        <ProtectedRoute>
                            <AddressListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/addresses/new"
                    element={
                        <ProtectedRoute>
                            <AddAddressPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/addresses/:addressId/edit"
                    element={
                        <ProtectedRoute>
                            <EditAddressPage />
                        </ProtectedRoute>
                    }
                />

            </Route>

            {/* ADMIN */}
            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route index element={<AdminDashboard />} />

                {/* Products */}
                <Route path="products" element={<AdminProductListPage />} />
                <Route path="products/new" element={<AdminProductFormPage />} />
                <Route path="products/:productId/edit" element={<AdminProductFormPage />} />

                {/* Categories */}
                <Route path="categories" element={<AdminCategoryListPage />} />
                <Route path="categories/new" element={<AdminCategoryFormPage />} />
                <Route path="categories/:categoryId/edit" element={<AdminCategoryFormPage />} />

                {/* Orders */}
                <Route
                    path="/admin/orders"
                    element={
                        <AdminRoute>
                            <AdminOrderListPage />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/orders/:orderId"
                    element={
                        <AdminRoute>
                            <AdminOrderDetailPage />
                        </AdminRoute>
                    }
                />

                {/* Users */}
                <Route path="users" element={<AdminUserListPage />} />
                <Route path="users/:userId" element={<AdminUserDetailPage />} />

            </Route>

            {/* AUTH */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* NOT FOUND */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
