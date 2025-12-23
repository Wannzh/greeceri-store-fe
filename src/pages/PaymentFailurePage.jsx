/**
 * Payment Failure Page
 * =====================
 * Halaman yang ditampilkan ketika pembayaran gagal atau dibatalkan.
 * User akan di-redirect ke halaman ini dari Xendit/backend.
 */
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw, ShoppingCart } from "lucide-react";

export default function PaymentFailurePage() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id") || searchParams.get("orderId");
    const errorMessage = searchParams.get("message") || "Pembayaran tidak dapat diproses atau telah dibatalkan.";

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-14 h-14 text-red-600" />
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Pembayaran Gagal
                </h1>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-500">ID Pesanan</p>
                        <p className="text-lg font-bold text-gray-900">#{orderId}</p>
                    </div>
                )}

                {/* Description */}
                <p className="text-gray-600 mb-8">
                    {errorMessage}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {orderId && (
                        <Link to={`/orders/my/${orderId}`}>
                            <Button size="lg" className="w-full h-12 text-lg font-semibold rounded-xl">
                                <RefreshCcw className="w-5 h-5 mr-2" />
                                Coba Bayar Lagi
                            </Button>
                        </Link>
                    )}

                    <Link to="/orders/my">
                        <Button variant="outline" size="lg" className="w-full h-12 text-lg font-semibold rounded-xl">
                            Lihat Pesanan Saya
                        </Button>
                    </Link>

                    <Link to="/cart">
                        <Button variant="ghost" size="lg" className="w-full h-12 text-lg font-semibold rounded-xl">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Kembali ke Keranjang
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <p className="mt-6 text-sm text-gray-500">
                    Mengalami kendala?{" "}
                    <a href="mailto:support@greeceri.store" className="text-primary font-medium hover:underline">
                        Hubungi kami
                    </a>
                </p>
            </div>
        </div>
    );
}
