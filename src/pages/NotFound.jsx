import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function NotFound() {
    const { user } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-lg">
                {/* 404 Illustration */}
                <div className="relative">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <svg viewBox="0 0 200 200" className="w-80 h-80 text-primary">
                            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
                            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                    </div>

                    {/* Main 404 text */}
                    <div className="relative">
                        <h1 className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 leading-none tracking-tight">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                <Search className="h-10 w-10 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* ERROR label */}
                    <p className="text-2xl font-bold text-gray-400 tracking-[0.5em] uppercase -mt-4">
                        Error
                    </p>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                        Silakan periksa URL atau kembali ke halaman utama.
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to={isAdmin ? "/admin" : "/"}>
                        <Button size="lg" className="gap-2 min-w-[180px]">
                            <Home className="h-4 w-4" />
                            {isAdmin ? "Kembali ke Admin" : "Kembali ke Beranda"}
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 min-w-[180px]"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Halaman Sebelumnya
                    </Button>
                </div>

                {/* Footer hint */}
                <p className="text-xs text-gray-400">
                    Butuh bantuan? Hubungi <a href="mailto:support@greeceri.store" className="text-primary hover:underline">support@greeceri.store</a>
                </p>
            </div>
        </div>
    );
}