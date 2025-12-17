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
import { Settings, User, Lock, Save, Loader2, Eye, EyeOff } from "lucide-react";
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
            await userService.updateProfile({
                name: profile.name,
                phoneNumber: profile.phoneNumber,
                gender: profile.gender,
                dateOfBirth: profile.dateOfBirth,
            });
            toast.success("Profile berhasil diupdate");
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Gagal mengupdate profile");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("Password baru tidak cocok");
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
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="h-6 w-6" /> Settings
            </h1>

            {/* PROFILE SECTION */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" /> Profile Information
                </h2>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nama</Label>
                            <Input
                                value={profile.name}
                                onChange={(e) => handleProfileChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={profile.email}
                                disabled
                                className="bg-gray-100"
                            />
                            <p className="text-xs text-gray-500">Email tidak dapat diubah</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nomor Telepon</Label>
                            <Input
                                value={profile.phoneNumber}
                                onChange={(e) => handleProfileChange("phoneNumber", e.target.value)}
                                placeholder="+62..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select
                                value={profile.gender}
                                onValueChange={(val) => handleProfileChange("gender", val)}
                            >
                                <SelectTrigger>
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
                        />
                    </div>

                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Simpan Profile
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* CHANGE PASSWORD SECTION */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5" /> Ubah Password
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Password Saat Ini</Label>
                        <div className="relative">
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Password Baru</Label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Konfirmasi Password Baru</Label>
                            <Input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <Button type="submit" variant="outline" disabled={changingPassword}>
                        {changingPassword ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Mengubah...
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-4 w-4" />
                                Ubah Password
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
