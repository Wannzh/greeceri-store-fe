/**
 * Payment Success Page
 * =====================
 * Halaman yang ditampilkan setelah pembayaran berhasil.
 * User akan di-redirect ke halaman ini dari Xendit/backend.
 */
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id") || searchParams.get("orderId");
    const [countdown, setCountdown] = useState(10);

    // Auto redirect countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
                {/* Success Animation */}
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="w-14 h-14 text-green-600" />
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Pembayaran Berhasil!
                </h1>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-500">ID Pesanan</p>
                        <p className="text-lg font-bold text-gray-900">#{orderId}</p>
                    </div>
                )}

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    Terima kasih! Pembayaran Anda telah kami terima.
                    Pesanan Anda sedang diproses dan akan segera dikirim.
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link to={orderId ? `/orders/my/${orderId}` : "/orders/my"}>
                        <Button size="lg" className="w-full h-12 text-lg font-semibold rounded-xl">
                            <Package className="w-5 h-5 mr-2" />
                            Lihat Detail Pesanan
                        </Button>
                    </Link>

                    <Link to="/products">
                        <Button variant="outline" size="lg" className="w-full h-12 text-lg font-semibold rounded-xl">
                            Lanjut Belanja
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>

                {/* Auto Redirect Notice */}
                <p className="mt-6 text-sm text-gray-400">
                    Dialihkan ke halaman pesanan dalam {countdown} detik...
                </p>
            </div>
        </div>
    );
}
