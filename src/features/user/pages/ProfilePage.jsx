import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import {
    User,
    Mail,
    Phone,
    Calendar,
    UserCircle,
    MapPin,
    Edit
} from "lucide-react";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
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
            <div className="container mx-auto max-w-3xl px-4 space-y-6">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Profil Saya</h1>

                    <Link to="/user/profile/edit">
                        <Button size="sm" className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Profil
                        </Button>
                    </Link>
                </div>

                {/* PROFILE CARD */}
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                            {profile.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xl font-bold">{profile.name}</p>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                        </div>
                    </div>

                    {/* INFO GRID */}
                    <div className="grid sm:grid-cols-2 gap-4">

                        <InfoItem icon={<User />} label="Nama" value={profile.name} />
                        <InfoItem icon={<Mail />} label="Email" value={profile.email} />
                        <InfoItem
                            icon={<Phone />}
                            label="No. Telepon"
                            value={profile.phoneNumber || "-"}
                        />
                        <InfoItem
                            icon={<UserCircle />}
                            label="Jenis Kelamin"
                            value={profile.gender === "MALE" ? "Laki-laki" : profile.gender === "FEMALE"
                                ? "Perempuan"
                                : "-"}
            />
                        <InfoItem
                            icon={<Calendar />}
                            label="Tanggal Lahir"
                            value={
                                profile.dateOfBirth
                                    ? new Date(profile.dateOfBirth).toLocaleDateString("id-ID")
                                    : "-"
                            }
                        />

                    </div>
                </div>

                {/* ACTION */}
                <div className="bg-white rounded-xl border shadow-sm p-6">
                    <Link to="/user/addresses">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <MapPin className="h-4 w-4" />
                            Kelola Alamat
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}

/* COMPONENT KECIL */
function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="text-gray-400">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
}
