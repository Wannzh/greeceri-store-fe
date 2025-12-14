import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await orderService.getMyOrders();
            setOrders(data || []);
        } catch (err) {
            console.error("Gagal memuat order:", err);
        } finally {
            setLoading(false);
        }
    };

    const statusLabel = {
        PAID: "Dibayar",
        PENDING_PAYMENT: "Menunggu Pembayaran",
        CANCELLED: "Dibatalkan",
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <p className="text-gray-500">Memuat pesanan...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center text-center">
                <PackageSearch className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold">Belum ada pesanan</h2>
                <p className="text-gray-500 mt-2">
                    Yuk, mulai belanja sekarang 🚀
                </p>
                <Link
                    to="/products"
                    className="mt-4 text-primary font-semibold hover:underline"
                >
                    Lihat Produk
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl p-6 space-y-6">
            <h1 className="text-2xl font-bold">Pesanan Saya</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Link
                        key={order.orderId}
                        to={`/orders/${order.orderId}`}
                        className="block rounded-xl border bg-white p-4 hover:shadow-md transition"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Order #{order.orderId}</p>
                                <p className="text-sm text-gray-500">
                                    {order.orderDate
                                        ? new Date(order.orderDate).toLocaleString("id-ID")
                                        : "-"}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-primary">
                                    Rp {(order.totalPrice ?? 0).toLocaleString("id-ID")}
                                </p>
                                <span
                                    className={`text-xs font-semibold px-2 py-1 rounded-full
                    {statusLabel[order.status] || order.status}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
