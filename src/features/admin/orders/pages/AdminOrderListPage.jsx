import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminOrderService } from "@/services/adminOrderService";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { exportObjectsToCsv } from "@/lib/csv";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { STATUS_OPTIONS, STATUS_LABEL } from "../constants";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";



export default function AdminOrderListPage() {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("ALL");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
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

        load();
    }, [status]);

    // quick debounce for search input (300ms)
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
        return () => clearTimeout(t);
    }, [search]);

    const filteredOrders = useMemo(() => {
        const q = (debouncedSearch || "").toLowerCase();
        if (!q) return orders;
        return orders.filter((o) => {
            const id = (o.id || "").toLowerCase();
            const user = (o.userName || "").toLowerCase();
            return id.includes(q) || user.includes(q);
        });
    }, [orders, debouncedSearch]);

    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        // reset to first page when filters change
        setPage(1);
    }, [filteredOrders, pageSize]);

    const totalPages = Math.max(1, Math.ceil((filteredOrders?.length || 0) / pageSize));

    useEffect(() => {
        // clamp page within range
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const paginatedOrders = useMemo(() => {
        const start = (page - 1) * pageSize;
        return (filteredOrders || []).slice(start, start + pageSize);
    }, [filteredOrders, page, pageSize]);

    const exportOrdersToCSV = (rows) => {
        if (!rows || rows.length === 0) return;
        // Prepare rows with columns expected by CSV util
        const prepared = rows.map((r) => ({
            "Order ID": r.id,
            User: r.userName,
            Total: Number(r.totalPrice || 0),
            Status: r.status,
            Date: r.createdAt ? new Date(r.createdAt).toLocaleString("id-ID") : "",
        }));
        // columns must match header order
        const columns = ["Order ID", "User", "Total", "Status", "Date"];
        exportObjectsToCsv(prepared, columns, `orders-${new Date().toISOString()}.csv`);
    };

    function escapeRegex(str = "") {
        return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    }

    function highlightText(text = "", query = "") {
        try {
            if (!query) return text;
            const re = new RegExp(`(${escapeRegex(query)})`, "ig");
            const parts = String(text).split(re);
            return parts.map((p, i) =>
                re.test(p) ? (
                    <mark key={i} className="bg-yellow-100 text-yellow-800 px-0.5 rounded">{p}</mark>
                ) : (
                    <span key={i}>{p}</span>
                )
            );
        } catch {
            return text;
        }
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Manajemen Order</h1>

                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search by ID or user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />

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

                    <Button
                        onClick={() => exportOrdersToCSV(filteredOrders)}
                        disabled={!filteredOrders || filteredOrders.length === 0}
                        title={filteredOrders.length === 0 ? "No data to export" : "Export CSV of filtered orders"}
                    >
                        Export CSV
                    </Button>
                </div>
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
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 8 4-16 3 8h4" />
                            </svg>
                        </div>
                        <div className="text-lg font-medium">No orders match your search / filter</div>
                        <div className="text-sm text-gray-500">Try a different search term or status.</div>
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
                            {paginatedOrders.map((order) => (
                                <tr key={order.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => window.location.assign(`/admin/orders/${order.id}`)}>
                                    <td className="p-4 font-medium">
                                        {highlightText((order.id || "").slice(0, 8) + "...", debouncedSearch)}
                                    </td>

                                    <td className="p-4 text-center">
                                        {highlightText(order.userName, debouncedSearch)}
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

                    {/* Pagination controls */}
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="text-sm text-gray-600">
                            Menampilkan <span className="font-medium">{(filteredOrders.length ? (page - 1) * pageSize + 1 : 0)}</span> - <span className="font-medium">{Math.min(page * pageSize, filteredOrders.length)}</span> dari <span className="font-medium">{filteredOrders.length}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                                <SelectTrigger className="w-28">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 25, 50].map((s) => (
                                        <SelectItem key={s} value={String(s)}>{s} / page</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <span className="text-sm px-2">Page <span className="font-medium">{page}</span> / {totalPages}</span>

                                <Button size="icon" variant="ghost" aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
