import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { Link } from "react-router-dom";
import { PackageSearch, ChevronRight, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

    const statusConfig = {
        PAID: { label: "Dibayar", className: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" },
        PENDING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200" },
        PROCESSING: { label: "Diproses", className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200" },
        CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200" },
        SHIPPED: { label: "Dikirim", className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200" },
        DELIVERED: { label: "Selesai", className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200" }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                    <PackageSearch className="h-12 w-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Belum ada pesanan</h2>
                <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                    Anda belum pernah melakukan pemesanan. Yuk mulai belanja kebutuhan harian Anda!
                </p>
                <Link
                    to="/products"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105"
                >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Mulai Belanja
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-4xl px-4 space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>

                <div className="space-y-4">
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || { label: order.status, className: "bg-gray-100 text-gray-700" };

                        return (
                            <Link
                                key={order.orderId}
                                to={`/orders/${order.orderId}`}
                                className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-gray-900 text-lg">Order #{order.orderId?.substring(0, 8)}</p>
                                            <Badge variant="outline" className={`font-semibold border ${status.className}`}>
                                                {status.label}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            {order.orderDate ? new Date(order.orderDate).toLocaleString("id-ID", {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            }) : "-"}
                                        </p>
                                        {order.deliveryDate && (
                                            <p className="text-xs text-blue-600 mt-1">
                                                Pengiriman: {new Date(order.deliveryDate).toLocaleDateString("id-ID", { dateStyle: 'long' })}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-0 border-dashed border-gray-100">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Belanja</p>
                                            <p className="font-bold text-primary text-lg">
                                                Rp {(order.totalPrice ?? 0).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}