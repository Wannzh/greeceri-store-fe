import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminOrderService } from "@/services/adminOrderService";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { STATUS_FLOW, STATUS_LABEL } from "../constants";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import OrderStatusTimeline from "../components/OrderStatusTimeline";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";
import { Printer, ArrowLeft } from "lucide-react";

export default function AdminOrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const invoiceRef = useRef(null);

    const [order, setOrder] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        try {
            setError("");
            setLoading(true);
            const data = await adminOrderService.getOrderById(orderId);

            if (!data) {
                throw new Error("Order tidak ditemukan");
            }

            setOrder(data);
            setStatus(data.status || "");
        } catch (err) {
            setError(err.message || "Order tidak ditemukan");
            setTimeout(() => navigate("/admin/orders"), 1300);
        } finally {
            setLoading(false);
        }
    };

    const allowedStatuses = STATUS_FLOW[order?.status] || [];

    const handleUpdateStatus = async () => {
        try {
            setSaving(true);
            await adminOrderService.updateStatus(orderId, status);
            toast.success("Status berhasil diperbarui");
            await loadOrder();
        } catch (err) {
            toast.error(err.message || "Transisi status tidak valid");
        } finally {
            setSaving(false);
        }
    };

    const handlePrintInvoice = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            toast.error("Popup diblokir. Izinkan popup untuk print invoice.");
            return;
        }

        const invoiceHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice - ${order?.id}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                    .header h1 { font-size: 24px; margin-bottom: 5px; }
                    .header p { color: #666; }
                    .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
                    .info-box { width: 48%; }
                    .info-box h3 { font-size: 14px; color: #666; margin-bottom: 8px; text-transform: uppercase; }
                    .info-box p { margin-bottom: 4px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .total-row { font-weight: bold; font-size: 16px; background-color: #f9f9f9; }
                    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
                    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                    .status-PENDING { background: #fef3c7; color: #92400e; }
                    .status-PAID { background: #dbeafe; color: #1e40af; }
                    .status-SHIPPED { background: #e0e7ff; color: #3730a3; }
                    .status-DELIVERED { background: #d1fae5; color: #065f46; }
                    .status-CANCELLED { background: #fee2e2; color: #991b1b; }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>INVOICE</h1>
                    <p>Greeceri Store</p>
                </div>

                <div class="info-section">
                    <div class="info-box">
                        <h3>Detail Order</h3>
                        <p><strong>Order ID:</strong> ${order?.id}</p>
                        <p><strong>Tanggal:</strong> ${order?.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${order?.status}">${STATUS_LABEL[order?.status] || order?.status}</span></p>
                    </div>
                    <div class="info-box">
                        <h3>Alamat Pengiriman</h3>
                        <p><strong>${order?.shippingAddress?.receiverName || "-"}</strong></p>
                        <p>${order?.shippingAddress?.phoneNumber || "-"}</p>
                        <p>${order?.shippingAddress?.fullAddress || "-"}</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th class="text-center">Qty</th>
                            <th class="text-right">Harga</th>
                            <th class="text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(order?.items || []).map(item => `
                            <tr>
                                <td>${item.productName}</td>
                                <td class="text-center">${item.quantity}</td>
                                <td class="text-right">Rp ${(item.price || 0).toLocaleString("id-ID")}</td>
                                <td class="text-right">Rp ${(item.subtotal || 0).toLocaleString("id-ID")}</td>
                            </tr>
                        `).join("")}
                        <tr>
                            <td colspan="3" class="text-right">Biaya Layanan</td>
                            <td class="text-right">Rp 1.000</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="3" class="text-right">Total</td>
                            <td class="text-right">Rp ${(order?.totalPrice || 0).toLocaleString("id-ID")}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <p>Terima kasih telah berbelanja di Greeceri Store</p>
                    <p style="margin-top: 8px; font-size: 12px;">Invoice ini dicetak pada ${new Date().toLocaleString("id-ID")}</p>
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const isFinal = order?.status === "DELIVERED" || order?.status === "CANCELLED";

    return (
        <div className="space-y-6 max-w-3xl">

            {/* Header with Back & Print */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/orders")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Detail Order</h1>
                </div>
                <Button variant="outline" onClick={handlePrintInvoice}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Invoice
                </Button>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm space-y-3">
                <p>
                    <b>Order ID:</b> {order?.id}
                </p>
                <p>
                    <b>User:</b> {order?.user?.name} ({order?.user?.email})
                </p>

                <div>
                    <p className="font-semibold">Alamat Pengiriman</p>
                    <p className="text-sm text-gray-700">
                        {order?.shippingAddress?.receiverName || "-"} • {order?.shippingAddress?.phoneNumber || "-"}
                    </p>
                    <p className="text-sm text-gray-600">{order?.shippingAddress?.fullAddress || "-"}</p>
                </div>

                <p>
                    <b>Total:</b>{" "}
                    <span className="font-semibold">
                        Rp {(order?.totalPrice ?? 0).toLocaleString("id-ID")}
                    </span>
                </p>

                <p>
                    <b>Status Saat Ini:</b>{" "}
                    <span className="font-semibold">{STATUS_LABEL[order?.status] || order?.status}</span>
                </p>
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm">
                <p className="font-semibold mb-3">Status Timeline</p>
                <OrderStatusTimeline currentStatus={order?.status} />
            </div>

            <div className="bg-white rounded-xl p-6 border shadow-sm space-y-4">
                <p className="font-semibold">Update Status Order</p>

                {error ? (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : isFinal ? (
                    <div>
                        <OrderStatusBadge status={order?.status} className="mb-2" />
                        <p className="text-sm text-gray-500">This order status is final and cannot be changed</p>
                    </div>
                ) : (
                    <>
                        <Select
                            value={status}
                            onValueChange={setStatus}
                            disabled={allowedStatuses.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>

                            <SelectContent>
                                {allowedStatuses.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {STATUS_LABEL[s] || s.replaceAll("_", " ")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>


                        <ConfirmDialog
                            trigger={
                                <Button
                                    variant="default"
                                    disabled={
                                        saving ||
                                        status === order?.status ||
                                        !allowedStatuses.includes(status)
                                    }
                                >
                                    {saving ? "Menyimpan..." : "Update Status"}
                                </Button>
                            }
                            title="Konfirmasi Ubah Status"
                            description={`Are you sure you want to change order status to ${STATUS_LABEL[status] || status}?`}
                            confirmText="Ubah"
                            loading={saving}
                            onConfirm={handleUpdateStatus}
                        />

                    </>
                )}
            </div>

            {order.items && (
                <div className="bg-white rounded-xl p-6 border shadow-sm space-y-3">
                    <p className="font-semibold">Item Pesanan</p>

                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Produk</th>
                                <th className="p-2 text-center">Qty</th>
                                <th className="p-2 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-2">{item.productName}</td>
                                    <td className="p-2 text-center">{item.quantity}</td>
                                    <td className="p-2 text-right">
                                        Rp {Number(item.subtotal || 0).toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}
