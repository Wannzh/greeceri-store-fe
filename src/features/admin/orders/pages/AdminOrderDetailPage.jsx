import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminOrderService } from "@/services/adminOrderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { STATUS_FLOW, STATUS_LABEL } from "../constants";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";
import { Printer, ArrowLeft, Package, User, CreditCard, Truck, MapPin, Check, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Status Timeline Steps
const TIMELINE_STEPS = [
    { status: "PENDING_PAYMENT", label: "Menunggu Pembayaran" },
    { status: "PAID", label: "Dibayar" },
    { status: "PROCESSING", label: "Diproses" },
    { status: "SHIPPED", label: "Dikirim" },
    { status: "DELIVERED", label: "Selesai" },
];

const STATUS_ORDER = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

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
                            <td colspan="3" class="text-right">Ongkos Kirim</td>
                            <td class="text-right">Rp ${(order?.shippingCost || 0).toLocaleString("id-ID")}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-right">Biaya Layanan</td>
                            <td class="text-right">Rp ${(order?.serviceFee || 1000).toLocaleString("id-ID")}</td>
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

    // Get current status index for timeline
    const getCurrentStatusIndex = (currentStatus) => {
        if (currentStatus === "CANCELLED") return -1;
        return STATUS_ORDER.indexOf(currentStatus);
    };

    const formatCurrency = (value) => `Rp ${(value || 0).toLocaleString("id-ID")}`;

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    const isFinal = order?.status === "DELIVERED" || order?.status === "CANCELLED";
    const currentStatusIndex = getCurrentStatusIndex(order?.status);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin/orders")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Detail Pesanan</h1>
                        <p className="text-muted-foreground">Order #{order?.id?.substring(0, 8)}...</p>
                    </div>
                </div>
                <Button variant="outline" onClick={handlePrintInvoice}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Invoice
                </Button>
            </div>

            {/* Order Info Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="flex items-start gap-3 p-4">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Order ID</p>
                            <p className="font-semibold text-sm">{order?.id?.substring(0, 8)}...</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-start gap-3 p-4">
                        <div className="rounded-lg bg-blue-500/10 p-2">
                            <User className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">Customer</p>
                            <p className="font-semibold truncate">{order?.user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{order?.user?.email}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-start gap-3 p-4">
                        <div className="rounded-lg bg-green-500/10 p-2">
                            <CreditCard className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-semibold">{formatCurrency(order?.totalPrice)}</p>
                            <OrderStatusBadge status={order?.status} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-start gap-3 p-4">
                        <div className="rounded-lg bg-orange-500/10 p-2">
                            <Calendar className="h-4 w-4 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tanggal Order</p>
                            <p className="font-semibold text-sm">
                                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Shipping Address */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                        <MapPin className="h-4 w-4" />
                        Alamat Pengiriman
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        <p className="font-medium text-foreground">{order?.shippingAddress?.receiverName || "-"}</p>
                        <p className="text-sm text-muted-foreground">{order?.shippingAddress?.phoneNumber || "-"}</p>
                        <p className="text-sm text-foreground">{order?.shippingAddress?.fullAddress || "-"}</p>
                        {order?.deliveryDate && (
                            <p className="text-sm text-primary font-medium mt-2">
                                <Truck className="h-3.5 w-3.5 inline-block mr-1" />
                                Pengiriman: {new Date(order.deliveryDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Order Status Timeline */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Status Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    {order?.status === "CANCELLED" ? (
                        <div className="flex items-center justify-center py-4">
                            <OrderStatusBadge status="CANCELLED" />
                            <span className="ml-2 text-sm text-muted-foreground">Pesanan ini telah dibatalkan</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            {TIMELINE_STEPS.map((step, index) => {
                                const isCompleted = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;
                                return (
                                    <div key={step.status} className="flex flex-1 flex-col items-center">
                                        <div className="flex w-full items-center">
                                            {index > 0 && (
                                                <div className={cn("h-0.5 flex-1", index <= currentStatusIndex ? "bg-primary" : "bg-border")} />
                                            )}
                                            <div className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                                                isCompleted ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
                                            )}>
                                                {isCompleted ? (
                                                    <Check className="h-5 w-5" />
                                                ) : (
                                                    <span className="text-sm font-medium">{index + 1}</span>
                                                )}
                                            </div>
                                            {index < TIMELINE_STEPS.length - 1 && (
                                                <div className={cn("h-0.5 flex-1", isCompleted && index < currentStatusIndex ? "bg-primary" : "bg-border")} />
                                            )}
                                        </div>
                                        <div className="mt-2 text-center">
                                            <p className={cn("text-xs font-medium", isCompleted ? "text-primary" : "text-muted-foreground")}>
                                                {step.label}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Update Status */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Update Status Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                    {isFinal ? (
                        <div className="flex items-center gap-3">
                            <OrderStatusBadge status={order?.status} />
                            <p className="text-sm text-muted-foreground">Status pesanan ini sudah final dan tidak bisa diubah</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            <Select value={status} onValueChange={setStatus} disabled={allowedStatuses.length === 0}>
                                <SelectTrigger className="w-56">
                                    <SelectValue>
                                        {STATUS_LABEL[status] || status?.replaceAll("_", " ") || "Pilih status"}
                                    </SelectValue>
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
                                    <Button variant="default" disabled={saving || status === order?.status || !allowedStatuses.includes(status)}>
                                        {saving ? "Menyimpan..." : "Update Status"}
                                    </Button>
                                }
                                title="Konfirmasi Ubah Status"
                                description={`Apakah Anda yakin ingin mengubah status pesanan ke ${STATUS_LABEL[status] || status}?`}
                                confirmText="Ubah"
                                loading={saving}
                                onConfirm={handleUpdateStatus}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Items */}
            {order?.items && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Item Pesanan</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produk</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Harga</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{item.productName}</TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-muted/30">
                                    <TableCell colSpan={3} className="text-right text-muted-foreground">Subtotal</TableCell>
                                    <TableCell className="text-right">{formatCurrency(order?.subtotal || order?.totalPrice - (order?.shippingCost || 0) - (order?.serviceFee || 0))}</TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/30">
                                    <TableCell colSpan={3} className="text-right text-muted-foreground">Ongkos Kirim</TableCell>
                                    <TableCell className="text-right">{formatCurrency(order?.shippingCost)}</TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/30">
                                    <TableCell colSpan={3} className="text-right text-muted-foreground">Biaya Layanan</TableCell>
                                    <TableCell className="text-right">{formatCurrency(order?.serviceFee || 1000)}</TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/50">
                                    <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                                    <TableCell className="text-right font-bold text-primary">{formatCurrency(order?.totalPrice)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
