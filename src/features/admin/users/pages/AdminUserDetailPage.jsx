import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminUserService } from "@/services/adminUserService";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Mail, Phone, User, Calendar, ShoppingBag, DollarSign } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";

export default function AdminUserDetailPage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUser();
    }, [userId]);

    const loadUser = async () => {
        try {
            setError("");
            setLoading(true);
            const data = await adminUserService.getUserById(userId);

            if (!data) {
                throw new Error("User tidak ditemukan");
            }

            setUser(data);
        } catch (err) {
            setError(err.message || "User tidak ditemukan");
            setTimeout(() => navigate("/admin/users"), 1500);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        try {
            setSaving(true);
            await adminUserService.updateUserStatus(userId, !user.enabled);
            toast.success(`User berhasil ${user.enabled ? "dinonaktifkan" : "diaktifkan"}`);
            await loadUser();
        } catch (err) {
            toast.error(err.message || "Gagal mengubah status user");
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/users")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">Detail User</h1>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user?.name}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"}>
                            {user?.role}
                        </Badge>
                        <Badge variant={user?.enabled ? "success" : "destructive"}>
                            {user?.enabled ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>

                <hr />

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user?.email || "-"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{user?.phoneNumber || "-"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Gender</p>
                            <p className="font-medium">{user?.gender || "-"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="font-medium">{formatDate(user?.dateOfBirth)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold">{user?.totalOrders ?? 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 border shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Spent</p>
                        <p className="text-2xl font-bold">
                            Rp {(user?.totalSpent ?? 0).toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Status Card */}
            {user?.role !== "ADMIN" && (
                <div className="bg-white rounded-xl p-6 border shadow-sm">
                    <h3 className="font-semibold mb-4">Account Status</h3>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">
                                {user?.enabled ? "User Aktif" : "User Nonaktif"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {user?.enabled
                                    ? "User dapat login dan melakukan transaksi"
                                    : "User tidak dapat login ke sistem"}
                            </p>
                        </div>

                        <ConfirmDialog
                            trigger={
                                <div className="flex items-center gap-3">
                                    <Switch
                                        checked={user?.enabled}
                                        disabled={saving}
                                    />
                                </div>
                            }
                            title={user?.enabled ? "Nonaktifkan User?" : "Aktifkan User?"}
                            description={
                                user?.enabled
                                    ? "User tidak akan bisa login dan melakukan transaksi."
                                    : "User akan dapat login dan melakukan transaksi kembali."
                            }
                            confirmText={user?.enabled ? "Nonaktifkan" : "Aktifkan"}
                            loading={saving}
                            onConfirm={handleToggleStatus}
                        />
                    </div>
                </div>
            )}

            {user?.role === "ADMIN" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-800">
                        ⚠️ Status akun Admin tidak dapat diubah dari halaman ini.
                    </p>
                </div>
            )}
        </div>
    );
}
