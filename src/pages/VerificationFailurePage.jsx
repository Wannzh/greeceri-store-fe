/**
 * Verification Failure Page
 * ==========================
 * Halaman yang ditampilkan ketika verifikasi email gagal.
 * User akan di-redirect ke halaman ini dari backend.
 */
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw } from "lucide-react";

export default function VerificationFailurePage() {
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get("message") || "Token verifikasi tidak valid atau sudah kadaluarsa.";

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-12 h-12 text-red-600" />
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Verifikasi Gagal
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    {errorMessage}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link to="/register">
                        <Button size="lg" className="w-full h-12 text-lg font-semibold rounded-xl">
                            <RefreshCcw className="w-5 h-5 mr-2" />
                            Daftar Ulang
                        </Button>
                    </Link>

                    <Link to="/">
                        <Button variant="outline" size="lg" className="w-full h-12 text-lg font-semibold rounded-xl">
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <p className="mt-6 text-sm text-gray-500">
                    Butuh bantuan?{" "}
                    <a href="mailto:support@greeceri.store" className="text-primary font-medium hover:underline">
                        Hubungi kami
                    </a>
                </p>
            </div>
        </div>
    );
}
