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
import { STATUS_OPTIONS, STATUS_LABEL } from "../constants";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
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
                            {[...Array(6)].map((_, i) => (
                                <tr key={i} className="border-t">
                                    <td className="p-4 font-medium"><SkeletonText className="h-4 w-28 rounded bg-gray-200" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-24 mx-auto" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-20 mx-auto" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-24 mx-auto" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-20 mx-auto" /></td>
                                    <td className="p-4"><div className="flex justify-end"><SkeletonText className="h-6 w-10 rounded" /></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : error ? (
                <div className="bg-white rounded-xl p-6">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 8 4-16 3 8h4" />
                            </svg>
                        </div>
                        <div className="text-lg font-medium">No orders found for this status</div>
                        <div className="text-sm text-gray-500">Try selecting a different status or check back later.</div>
                    </div>
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
                                <tr key={order.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => window.location.assign(`/admin/orders/${order.id}`)}>
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
                                        <OrderStatusBadge status={order?.status} />
                                    </td>

                                    <td className="p-4 text-center">
                                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("id-ID") : "-"}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-end">
                                            <Link to={`/admin/orders/${order.id}`} onClick={(e) => e.stopPropagation()}>
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
