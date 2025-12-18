import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { Button } from "@/components/ui/button";
import {
    User,
    Mail,
    Phone,
    Calendar,
    UserCircle,
    MapPin,
    Edit,
    ShoppingBag,
    Wallet,
    Lock,
} from "lucide-react";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        savedAddresses: 0,
    });

    useEffect(() => {
        loadProfile();
        loadStats();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error("Gagal memuat profil:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const [orders, addresses] = await Promise.all([
                orderService.getMyOrders(),
                addressService.getMyAddresses(),
            ]);

            const totalSpent = orders
                .filter(o => o.status === "DELIVERED")
                .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

            setStats({
                totalOrders: orders.length,
                totalSpent,
                savedAddresses: addresses.length,
            });
        } catch (err) {
            console.error("Gagal memuat statistik:", err);
        }
    };

    const formatMemberSince = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-gray-500">Memuat profil...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto p-6 text-center">
                <p className="text-gray-500">Data profil tidak tersedia</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-4xl px-4 space-y-6">

                {/* PAGE HEADER */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                    <p className="text-gray-500">Kelola informasi akun Anda</p>
                </div>

                {/* PROFILE HEADER CARD */}
                <div className="bg-green-50 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                                {profile.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                                <p className="text-gray-600">{profile.email}</p>
                                {profile.createdAt && (
                                    <span className="inline-block mt-1 px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                                        Member sejak {formatMemberSince(profile.createdAt)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Link to="/user/profile/edit">
                            <Button variant="outline" className="gap-2 bg-white">
                                <Edit className="h-4 w-4" />
                                Edit Profil
                            </Button>
                        </Link>
                    </div>

                    {/* STATS ROW */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-primary/20">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
                            <p className="text-sm text-gray-600">Total Pesanan</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">
                                Rp {stats.totalSpent.toLocaleString("id-ID")}
                            </p>
                            <p className="text-sm text-gray-600">Total Belanja</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{stats.savedAddresses}</p>
                            <p className="text-sm text-gray-600">Alamat Tersimpan</p>
                        </div>
                    </div>
                </div>

                {/* PROFILE INFO CARD */}
                <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
                    {/* INFO GRID */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <InfoItem
                            icon={<User className="h-5 w-5" />}
                            label="Nama Lengkap"
                            value={profile.name}
                        />
                        <InfoItem
                            icon={<Mail className="h-5 w-5" />}
                            label="Alamat Email"
                            value={profile.email}
                        />
                        <InfoItem
                            icon={<Phone className="h-5 w-5" />}
                            label="Nomor Telepon"
                            value={profile.phoneNumber || "-"}
                        />
                        <InfoItem
                            icon={<UserCircle className="h-5 w-5" />}
                            label="Jenis Kelamin"
                            value={
                                profile.gender === "MALE"
                                    ? "Laki-laki"
                                    : profile.gender === "FEMALE"
                                        ? "Perempuan"
                                        : "-"
                            }
                        />
                        <InfoItem
                            icon={<Calendar className="h-5 w-5" />}
                            label="Tanggal Lahir"
                            value={
                                profile.dateOfBirth
                                    ? new Date(profile.dateOfBirth).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })
                                    : "-"
                            }
                        />
                    </div>
                </div>

                {/* ACTION CARDS */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Account Security */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Lock className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Keamanan Akun</h3>
                                <p className="text-sm text-gray-500">Kelola password dan keamanan akun</p>
                            </div>
                        </div>
                        <Link to="/user/change-password">
                            <Button variant="outline" className="w-full">
                                Ubah Password
                            </Button>
                        </Link>
                    </div>

                    {/* Addresses */}
                    <div className="bg-white rounded-xl border shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <MapPin className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Alamat</h3>
                                <p className="text-sm text-gray-500">Kelola alamat pengiriman Anda</p>
                            </div>
                        </div>
                        <Link to="/user/addresses">
                            <Button variant="outline" className="w-full">
                                Kelola Alamat
                            </Button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

/* INFO ITEM COMPONENT */
function InfoItem({ icon, label, value }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500">
                {icon}
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-gray-900">{value}</p>
            </div>
        </div>
    );
}
