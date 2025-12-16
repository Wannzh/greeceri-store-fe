import { useEffect, useState } from "react";
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

export default function AdminOrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();

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
            // navigate back after short delay so user can read the error
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

            <h1 className="text-2xl font-bold">Detail Order</h1>

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
