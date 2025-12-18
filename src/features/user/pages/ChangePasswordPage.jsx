import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Password saat ini wajib diisi";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "Password baru wajib diisi";
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = "Password minimal 6 karakter";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi password wajib diisi";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Password tidak cocok";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await userService.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            toast.success("Password berhasil diubah!");
            navigate("/user/profile");
        } catch (err) {
            const message = err.response?.data?.message || "Gagal mengubah password";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-lg px-4">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Ubah Password</h1>
                    <p className="text-gray-500">Masukkan password lama dan password baru Anda</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Lock className="h-4 w-4" />
                                Password Saat Ini
                            </label>
                            <div className="relative">
                                <Input
                                    type={showCurrentPassword ? "text" : "password"}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Masukkan password saat ini"
                                    className={errors.currentPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="text-sm text-red-500">{errors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Lock className="h-4 w-4" />
                                Password Baru
                            </label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Masukkan password baru"
                                    className={errors.newPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">{errors.newPassword}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <CheckCircle className="h-4 w-4" />
                                Konfirmasi Password Baru
                            </label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Ulangi password baru"
                                    className={errors.confirmPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Password"}
                        </Button>
                    </form>
                </div>

                {/* Info */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Pastikan password baru minimal 6 karakter
                </p>
            </div>
        </div>
    );
}
