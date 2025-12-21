import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Settings, User, Lock, Save, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile({
                name: data.name || "",
                email: data.email || "",
                phoneNumber: data.phoneNumber || "",
                gender: data.gender || "",
                dateOfBirth: data.dateOfBirth || "",
            });
        } catch (err) {
            console.error("Error loading profile:", err);
            toast.error("Gagal memuat profile");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (key, value) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
    };

    const handlePasswordChange = (key, value) => {
        setPasswordForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);

            // Format phone number with +62 prefix
            let formattedPhone = profile.phoneNumber;
            if (formattedPhone && !formattedPhone.startsWith("+62")) {
                formattedPhone = "+62" + formattedPhone.replace(/^0/, "");
            }

            await userService.updateProfile({
                name: profile.name,
                phoneNumber: formattedPhone,
                gender: profile.gender,
                dateOfBirth: profile.dateOfBirth,
            });
            toast.success("Profile berhasil diperbarui");
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Gagal memperbarui profile");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Konfirmasi password tidak cocok");
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error("Password minimal 6 karakter");
            return;
        }

        try {
            setChangingPassword(true);
            await userService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success("Password berhasil diubah");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error("Error changing password:", err);
            const message = err.response?.data?.message || "Gagal mengubah password";
            toast.error(message);
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground text-sm">Memuat pengaturan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Settings className="h-7 w-7 text-foreground" /> Pengaturan Akun
                </h1>
                <p className="text-muted-foreground mt-1 ml-10">Kelola informasi profil dan keamanan akun admin Anda.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* LEFT: PROFILE FORM */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-xl border-border shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50/50 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" /> Informasi Profil
                            </h2>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>Nama Lengkap</Label>
                                        <Input
                                            value={profile.name}
                                            onChange={(e) => handleProfileChange("name", e.target.value)}
                                            required
                                            className="h-10"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="bg-muted text-muted-foreground h-10 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <Label>Nomor Telepon</Label>
                                        <div className="relative flex">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm font-medium">
                                                +62
                                            </span>
                                            <Input
                                                value={profile.phoneNumber.replace(/^(\+62|62|0)/, "")}
                                                onChange={(e) => {
                                                    // Only allow numbers
                                                    const value = e.target.value.replace(/\D/g, "");
                                                    handleProfileChange("phoneNumber", value);
                                                }}
                                                placeholder="8123456789"
                                                className="h-10 rounded-l-none"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Masukkan nomor tanpa 0 di depan</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Jenis Kelamin</Label>
                                        <Select
                                            value={profile.gender}
                                            onValueChange={(val) => handleProfileChange("gender", val)}
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Pilih gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MALE">Laki-laki</SelectItem>
                                                <SelectItem value="FEMALE">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tanggal Lahir</Label>
                                    <Input
                                        type="date"
                                        value={profile.dateOfBirth}
                                        onChange={(e) => handleProfileChange("dateOfBirth", e.target.value)}
                                        className="h-10 md:w-1/2"
                                    />
                                </div>

                                <div className="pt-4 border-t mt-6 flex justify-end">
                                    <Button type="submit" disabled={saving} className="px-6">
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Simpan Perubahan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SECURITY FORM */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-xl border-border shadow-sm overflow-hidden sticky top-6">
                        <div className="px-6 py-4 border-b bg-gray-50/50">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-600" /> Keamanan
                            </h2>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Password Saat Ini</Label>
                                    <div className="relative">
                                        <Input
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                            required
                                            className="pr-10 h-10"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-muted-foreground"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-dashed" />

                                <div className="space-y-2">
                                    <Label>Password Baru</Label>
                                    <div className="relative">
                                        <Input
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                            required
                                            minLength={6}
                                            className="pr-10 h-10"
                                            placeholder="Min. 6 karakter"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-muted-foreground"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Ulangi Password Baru</Label>
                                    <Input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                        required
                                        minLength={6}
                                        className="h-10"
                                    />
                                </div>

                                <Button type="submit" variant="default" className="w-full mt-2" disabled={changingPassword}>
                                    {changingPassword ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            Update Password
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}