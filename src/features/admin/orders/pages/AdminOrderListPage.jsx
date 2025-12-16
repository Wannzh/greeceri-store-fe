import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { STATUS_OPTIONS, STATUS_LABEL, STATUS_COLOR } from "../constants";
import { Eye } from "lucide-react";



export default function AdminOrderListPage() {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrders();
    }, [status]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                status === "ALL"
                    ? await adminOrderService.getAllOrders()
                    : await adminOrderService.getOrdersByStatus(status);

            setOrders(data || []);
        } catch (err) {
            console.error("Gagal load orders", err);
            setError(err.message || "Gagal memuat daftar order");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Manajemen Order</h1>

                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s === "ALL" ? "Semua Status" : STATUS_LABEL[s]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* TABLE */}
            {loading ? (
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : error ? (
                <div className="bg-white rounded-xl p-6">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-500">
                    Tidak ada order
                </div>
            ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left">Order ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="p-4 font-medium">
                                        {(order.id || "").slice(0, 8)}...
                                    </td>

                                    <td className="p-4 text-center">
                                        {order.userName}
                                    </td>

                                    <td className="p-4 text-center">
                                        Rp {Number(order.totalPrice || 0).toLocaleString("id-ID")}
                                    </td>

                                    <td className="p-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[order?.status] || ''}`}
                                        >
                                            {STATUS_LABEL[order?.status] || order?.status}
                                        </span>
                                    </td>

                                    <td className="p-4 text-center">
                                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID") : "-"}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-end">
                                            <Link to={`/admin/orders/${order.id}`}>
                                                <Button size="icon" variant="outline">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
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
