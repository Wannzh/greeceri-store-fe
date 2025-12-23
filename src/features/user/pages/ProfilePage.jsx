import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "@/services/userService";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { Button } from "@/components/ui/button";
import {
    User, Mail, Phone, Calendar, UserCircle, MapPin, Edit,
    ShoppingBag, Wallet, Lock, ChevronRight, LogOut
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
                .filter(o => o.status === "DELIVERED" || o.status === "PAID")
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
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container mx-auto p-6 text-center text-gray-500">
                Data profil tidak tersedia
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto max-w-5xl px-4 space-y-8">
                
                {/* HEADLINE */}
                <div className="flex items-center justify-between">
                     <h1 className="text-3xl font-bold text-gray-900">Akun Saya</h1>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* LEFT COL: CARD */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary to-green-600"></div>
                            
                            <div className="relative mt-8 mb-4">
                                <div className="h-24 w-24 mx-auto rounded-full bg-white p-1 shadow-lg">
                                    <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-600">
                                         {profile.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            
                            <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                            <p className="text-sm text-gray-500 mb-6">{profile.email}</p>

                            <Link to="/user/profile/edit">
                                <Button variant="outline" className="w-full rounded-full border-gray-300">
                                    Edit Profil
                                </Button>
                            </Link>
                        </div>
                        
                        {/* Quick Stats Grid Mobile/Desktop */}
                         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Aktivitas</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShoppingBag size={18} /></div>
                                        <span className="font-medium text-gray-700">Total Pesanan</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{stats.totalOrders}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Wallet size={18} /></div>
                                        <span className="font-medium text-gray-700">Total Belanja</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-sm">Rp {stats.totalSpent.toLocaleString("id-ID", { notation: "compact" })}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><MapPin size={18} /></div>
                                        <span className="font-medium text-gray-700">Alamat</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{stats.savedAddresses}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: DETAILS & ACTIONS */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Detail Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                             <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <UserCircle className="text-primary h-5 w-5" /> Informasi Pribadi
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
                                <InfoItem label="Nama Lengkap" value={profile.name} icon={<User size={16} />} />
                                <InfoItem label="Email" value={profile.email} icon={<Mail size={16} />} />
                                <InfoItem label="Nomor Telepon" value={profile.phoneNumber || "-"} icon={<Phone size={16} />} />
                                <InfoItem 
                                    label="Tanggal Lahir" 
                                    value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"} 
                                    icon={<Calendar size={16} />} 
                                />
                                <InfoItem 
                                    label="Member Sejak" 
                                    value={formatMemberSince(profile.joinedAt)} 
                                    icon={<Calendar size={16} />} 
                                />
                            </div>
                        </div>

                         {/* Quick Actions */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link to="/user/addresses" className="group p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">Alamat Saya</p>
                                        <p className="text-xs text-gray-500">Kelola alamat pengiriman</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-primary" />
                            </Link>

                             <Link to="/user/change-password" class="group p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-primary/50 hover:shadow-md transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">Keamanan</p>
                                        <p className="text-xs text-gray-500">Ubah password & akun</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-primary" />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, icon }) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                {icon} {label}
            </p>
            <p className="text-gray-900 font-medium text-base border-b border-gray-100 pb-2">{value}</p>
        </div>
    );
}