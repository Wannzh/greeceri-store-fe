import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import {
    Mail,
    Lock,
    User,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle,
    CheckCircle2,
    XCircle,
    ShoppingBag,
    ArrowRight,
    Home
} from "lucide-react";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { googleLogin } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    // UX States
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [successModal, setSuccessModal] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);
        setError("");

        const res = await googleLogin(credentialResponse.credential);

        if (!res.success) {
            setError(res.message);
            toast.error(res.message);
        }

        setGoogleLoading(false);
    };

    const handleGoogleError = () => {
        toast.error("Google signup failed");
    };

    // Hitung kekuatan password sederhana
    useEffect(() => {
        let score = 0;
        if (password.length > 5) score += 30;
        if (password.length > 8) score += 30;
        if (/[A-Z]/.test(password)) score += 20; // Huruf besar
        if (/[0-9]/.test(password)) score += 20; // Angka
        setPasswordStrength(score);
    }, [password]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Password dan konfirmasi password tidak cocok.");
            return;
        }

        if (password.length < 6) {
            setError("Password harus memiliki minimal 6 karakter.");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/register", {
                name,
                email,
                password,
            });

            if (res.data.success) {
                setSuccessModal(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registrasi gagal, silakan coba lagi.");
        }

        setLoading(false);
    };

    // Helper untuk warna progress bar password
    const getPasswordStrengthColor = () => {
        if (passwordStrength < 40) return "bg-red-500";
        if (passwordStrength < 80) return "bg-yellow-500";
        return "bg-green-500";
    };

    const handleCloseSuccess = () => {
        setSuccessModal(false);
        navigate("/login");
    }

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2">
            {/* Pop Up Notifikasi Success */}
            <Dialog open={successModal} onOpenChange={setSuccessModal}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            Registrasi Berhasil
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Akun berhasil dibuat. Silakan cek email Anda untuk verifikasi akun sebelum login.
                    </p>

                    <DialogFooter>
                        <Button onClick={handleCloseSuccess} className="w-full">
                            Oke, Saya Mengerti
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Sisi Kiri: Form Register */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="mx-auto w-full max-w-[450px] space-y-6">

                    {/* Header */}
                    <div className="space-y-2 text-center">
                        <div className="flex justify-center mb-2">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <ShoppingBag size={24} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Buat Akun Baru</h1>
                        <p className="text-muted-foreground text-sm">
                            Daftar sekarang untuk menikmati pengalaman belanja sayur segar termudah.
                        </p>
                    </div>

                    {/* Back to Homepage */}
                    <Link to="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Home size={16} />
                        Kembali ke Beranda
                    </Link>

                    {error && (
                        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form className="space-y-4" onSubmit={handleRegister}>
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="name"
                                    className="pl-10"
                                    placeholder="Contoh: Budi Santoso"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    className="pl-10"
                                    placeholder="nama@google.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Password */}
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-8"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2 col-span-2 sm:col-span-1">
                                <Label htmlFor="confirm">Konfirmasi</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="confirm"
                                        type={showPassword ? "text" : "password"}
                                        className="pl-10 pr-8"
                                        placeholder="••••••••"
                                        required
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />
                                    {/* Indikator Match Realtime */}
                                    {confirm && (
                                        <div className="absolute right-2 top-2.5">
                                            {password === confirm ? (
                                                <CheckCircle2 size={16} className="text-green-500 animate-in zoom-in" />
                                            ) : (
                                                <XCircle size={16} className="text-red-500 animate-in zoom-in" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Password Strength Meter (Hanya muncul jika user mulai mengetik password) */}
                        {password && (
                            <div className="space-y-1">
                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ease-out ${getPasswordStrengthColor()}`}
                                        style={{ width: `${passwordStrength}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground text-right">
                                    Kekuatan Password: {passwordStrength < 40 ? "Lemah" : passwordStrength < 80 ? "Sedang" : "Kuat"}
                                </p>
                            </div>
                        )}

                        {/* Button */}
                        <Button disabled={loading} type="submit" className="w-full h-11 font-medium group">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Mendaftarkan Akun...
                                </>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Atau daftar dengan
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            {googleLoading ? (
                                <Button variant="outline" disabled className="w-full h-11">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memproses...
                                </Button>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    useOneTap
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    text="signup_with"
                                />
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground">
                        Sudah punya akun?{" "}
                        <a href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
                            Masuk disini
                        </a>
                    </div>
                </div>
            </div>

            {/* Sisi Kanan: Gambar Branding */}
            <div className="hidden lg:block relative bg-muted">
                <div className="absolute inset-0">
                    {/* Gambar: Orang bahagia menerima paket belanjaan */}
                    <img
                        src="https://images.unsplash.com/photo-1758274251567-ef9935ad5559?q=80&w=3431&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Happy Shopper"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-orange-500/20 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/80 via-black/40 to-transparent" />
                </div>

                <div className="relative z-20 flex h-full flex-col justify-end p-10 text-white">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-3">Gabung Member Greeceri</h2>
                        <ul className="space-y-3 text-lg text-orange-50">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 size={20} className="text-green-400" /> Voucher Diskon 50% Pertama
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 size={20} className="text-green-400" /> Gratis Ongkir Tanpa Syarat
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 size={20} className="text-green-400" /> Kumpulkan Poin Belanja
                            </li>
                        </ul>
                    </div>

                    {/* Social Proof sederhana */}
                    <div className="pt-6 border-t border-white/20">
                        <p className="text-sm font-medium">Dipercaya oleh 10.000+ Ibu Rumah Tangga</p>
                    </div>
                </div>
            </div>

        </div>
    );
}