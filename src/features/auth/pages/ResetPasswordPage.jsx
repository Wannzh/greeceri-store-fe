import { useState } from "react";
import api from "@/lib/axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent 
} from "@/components/ui/card";
import { 
    Lock, 
    Loader2, 
    Eye, 
    EyeOff, 
    CheckCircle2, 
    XCircle,
    ShieldCheck
} from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Ambil token dari URL

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }

    if (password.length < 6) {
        setError("Password minimal 6 karakter.");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      if (res.data.success) {
        setSuccess(true);
        // Redirect otomatis setelah 2 detik
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Reset password gagal. Link mungkin sudah kadaluarsa.");
    }

    setLoading(false);
  };

  // Jika tidak ada token, tampilkan error (Security Check)
  if (!token) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md text-center p-6">
                <div className="flex justify-center mb-4 text-red-500">
                    <XCircle size={48} />
                </div>
                <h2 className="text-xl font-bold mb-2">Link Tidak Valid</h2>
                <p className="text-muted-foreground mb-6">Link reset password tidak ditemukan atau rusak.</p>
                <Link to="/forgot-password">
                    <Button variant="outline">Kirim Ulang Link</Button>
                </Link>
            </Card>
        </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-[400px] shadow-lg border-border/60">
        
        <CardHeader className="text-center space-y-1">
            <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <ShieldCheck size={24} />
                </div>
            </div>
            <CardTitle className="text-2xl font-bold">Buat Password Baru</CardTitle>
            <CardDescription>
                Password baru Anda harus berbeda dari password yang digunakan sebelumnya.
            </CardDescription>
        </CardHeader>

        <CardContent>
            {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            )}

            {success ? (
                <div className="text-center py-8 space-y-4 animate-in zoom-in duration-300">
                    <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Berhasil Diubah!</h3>
                        <p className="text-sm text-muted-foreground">Mengalihkan Anda ke halaman login...</p>
                    </div>
                    <Loader2 className="mx-auto animate-spin text-muted-foreground" />
                </div>
            ) : (
                <form onSubmit={handleReset} className="space-y-4">
                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password Baru</Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm */}
                    <div className="space-y-2">
                        <Label htmlFor="confirm">Konfirmasi Password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                id="confirm"
                                type={showPassword ? "text" : "password"}
                                className="pl-10 pr-10"
                                placeholder="••••••••"
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                            
                            {/* Indikator Match */}
                            {confirm && (
                                <div className="absolute right-3 top-2.5">
                                    {password === confirm ? (
                                        <CheckCircle2 size={16} className="text-green-500 animate-in zoom-in" />
                                    ) : (
                                        <XCircle size={16} className="text-red-500 animate-in zoom-in" />
                                    )}
                                </div>
                            )}
                        </div>
                         {/* Pesan error kecil jika tidak cocok */}
                         {confirm && password !== confirm && (
                            <p className="text-[10px] text-red-500 text-right font-medium">Password tidak cocok</p>
                        )}
                    </div>

                    <Button disabled={loading} className="w-full h-11 font-medium mt-2">
                        {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                        ) : (
                        "Reset Password"
                        )}
                    </Button>
                </form>
            )}
        </CardContent>
      </Card>
    </div>
  );
}