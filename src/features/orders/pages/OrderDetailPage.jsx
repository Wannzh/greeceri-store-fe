import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { DELIVERY_SLOT_LABELS } from "@/services/shippingService";
import { ArrowLeft, MapPin, Package, CreditCard, Clock, ImageOff, Truck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetail = async () => {
            try {
                setLoading(true);
                const orderDetail = await orderService.getOrderDetail(orderId);
                if (orderDetail) {
                    setOrder(orderDetail);
                } else {
                    console.error("Order tidak ditemukan");
                }
            } catch (err) {
                console.error("Gagal load detail:", err);
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [orderId]);


    if (loading) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-gray-500">Memuat detail pesanan...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto p-10 text-center flex flex-col items-center justify-center h-[60vh]">
                <Package className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold">Pesanan tidak ditemukan</h2>
                <p className="text-gray-500">ID: {orderId}</p>
                <Link to="/orders/my">
                    <Button variant="link" className="mt-4">Kembali ke Daftar Pesanan</Button>
                </Link>
            </div>
        );
    }

    // Helper status warna
    const getStatusColor = (status) => {
        switch (status) {
            case "PAID": return "bg-green-100 text-green-700 border-green-200";
            case "PENDING_PAYMENT": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "PROCESSING": return "bg-orange-100 text-orange-700 border-orange-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            case "SHIPPED": return "bg-blue-100 text-blue-700 border-blue-200";
            case "DELIVERED": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // Format delivery date
    const formatDeliveryDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-4xl px-4">

                {/* Header Navigasi */}
                <div className="mb-6">
                    <Link to="/orders/my" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Pesanan Saya
                    </Link>
                </div>

                {/* Header Order */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                Order #{order.orderId?.substring(0, 8)}...
                                <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status?.replace("_", " ")}
                                </span>
                            </h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {order.orderDate
                                        ? new Date(order.orderDate).toLocaleString("id-ID")
                                        : "-"}
                                </span>
                            </div>
                        </div>

                        {/* Tombol Bayar jika status PENDING */}
                        {order.status === "PENDING_PAYMENT" && order.paymentUrl && (
                            <Button
                                className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                                onClick={() => window.location.href = order.paymentUrl}
                            >
                                <CreditCard className="mr-2 h-4 w-4" /> Bayar Sekarang
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">

                    {/* KOLOM KIRI: Daftar Barang */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Package className="text-gray-400" /> Rincian Produk
                            </h2>
                            <div className="divide-y divide-gray-100">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                                        <div className="h-20 w-20 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden">
                                            {item.productImageUrl ? (
                                                <img
                                                    src={item.productImageUrl}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ImageOff className="text-gray-300 h-8 w-8" />
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center">
                                            <p className="font-bold text-gray-900 line-clamp-2">{item.productName}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.quantity} barang x Rp {item.priceAtPurchase?.toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <div className="font-bold text-gray-900 flex items-center">
                                            Rp {((item.priceAtPurchase || 0) * (item.quantity || 0)).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Info Pengiriman & Pembayaran */}
                    <div className="md:col-span-1 space-y-6">

                        {/* Jadwal Pengiriman */}
                        {(order.deliveryDate || order.deliverySlot) && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Calendar className="text-gray-400" /> Jadwal Pengiriman
                                </h2>
                                <div className="space-y-2 text-sm">
                                    {order.deliveryDate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tanggal</span>
                                            <span className="font-medium">{formatDeliveryDate(order.deliveryDate)}</span>
                                        </div>
                                    )}
                                    {order.deliverySlot && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Waktu</span>
                                            <span className="font-medium">{DELIVERY_SLOT_LABELS[order.deliverySlot] || order.deliverySlot}</span>
                                        </div>
                                    )}
                                    {order.distanceKm && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Jarak</span>
                                            <span className="font-medium">{order.distanceKm.toFixed(2)} km</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Alamat */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <MapPin className="text-gray-400" /> Alamat Pengiriman
                            </h2>
                            {order.shippingAddress ? (
                                <div className="text-sm space-y-2 text-gray-600">
                                    <div className="font-bold text-gray-900">
                                        {order.shippingAddress.receiverName}
                                    </div>
                                    <div className="text-xs font-medium bg-gray-100 inline-block px-2 py-1 rounded">
                                        {order.shippingAddress.label}
                                    </div>
                                    <p>{order.shippingAddress.phoneNumber}</p>
                                    <p className="leading-relaxed">{order.shippingAddress.fullAddress}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Data alamat tidak tersedia.</p>
                            )}
                        </div>

                        {/* Total Pembayaran */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-semibold text-lg mb-4">Ringkasan Pembayaran</h2>
                            <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Rp {(order.subtotal || order.totalPrice)?.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Ongkos Kirim</span>
                                    {order.shippingCost !== undefined && order.shippingCost !== null ? (
                                        <span>Rp {order.shippingCost.toLocaleString("id-ID")}</span>
                                    ) : (
                                        <span className="text-green-600 font-medium">Gratis</span>
                                    )}
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Biaya Layanan</span>
                                    <span>Rp {(order.serviceFee || 1000).toLocaleString("id-ID")}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">Total Bayar</span>
                                <span className="font-bold text-xl text-primary">
                                    Rp {(order.totalPrice || 0).toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}