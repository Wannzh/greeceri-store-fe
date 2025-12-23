/**
 * Verification Success Page
 * ==========================
 * Halaman yang ditampilkan setelah user berhasil memverifikasi email.
 * User akan di-redirect ke halaman ini dari backend.
 */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function VerificationSuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Email Terverifikasi!
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    Selamat! Akun Anda telah berhasil diverifikasi.
                    Anda sekarang dapat masuk dan mulai berbelanja.
                </p>

                {/* Action Button */}
                <Link to="/login">
                    <Button size="lg" className="w-full h-12 text-lg font-semibold rounded-xl">
                        Masuk ke Akun
                    </Button>
                </Link>

                {/* Secondary Link */}
                <p className="mt-6 text-sm text-gray-500">
                    Atau{" "}
                    <Link to="/" className="text-primary font-medium hover:underline">
                        kembali ke beranda
                    </Link>
                </p>
            </div>
        </div>
    );
}
