import { useState } from "react";
import api from "@/lib/axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link dari sini

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent, 
    CardFooter 
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { Mail, Loader2, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulasi delay sedikit agar transisi halus
    // await new Promise(r => setTimeout(r, 1000));

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim email. Pastikan email terdaftar.");
    }

    setLoading(false);
  };

  const closeModal = () => {
    setSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-muted/30">
      
      {/* Modal Success */}
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                <CheckCircle2 size={24} />
            </div>
            <DialogTitle className="text-xl">Cek Email Anda</DialogTitle>
            <DialogDescription className="text-center">
              Kami telah mengirimkan tautan untuk mengatur ulang kata sandi ke <strong>{email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={closeModal} className="w-full sm:w-auto min-w-[120px]">
              Oke, Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card Utama */}
      <Card className="w-full max-w-[400px] shadow-lg border-border/60">
        <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <KeyRound size={24} />
                </div>
            </div>
            <CardTitle className="text-2xl font-bold">Lupa Password?</CardTitle>
            <CardDescription>
                Jangan khawatir. Masukkan email Anda dan kami akan membantu Anda meresetnya.
            </CardDescription>
        </CardHeader>

        <CardContent>
            {error && (
            <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-top-1">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Terdaftar</Label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="email"
                            className="pl-10"
                            type="email"
                            placeholder="nama@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <Button disabled={loading} type="submit" className="w-full h-11 font-medium">
                    {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim Link...
                    </>
                    ) : (
                    "Kirim Link Reset Password"
                    )}
                </Button>
            </form>
        </CardContent>

        <CardFooter className="justify-center border-t p-4 bg-muted/20 rounded-b-xl mt-2">
            <Link 
                to="/login" 
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Kembali ke halaman Login
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}