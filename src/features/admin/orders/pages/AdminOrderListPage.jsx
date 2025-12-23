import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminOrderService } from "@/services/adminOrderService";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Eye, Download, FileSpreadsheet, FileText, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { exportObjectsToCsv } from "@/lib/csv";
import { exportObjectsToExcel } from "@/lib/excel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { STATUS_OPTIONS, STATUS_LABEL } from "../constants";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { SkeletonText } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function AdminOrderListPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [status, setStatus] = useState("ALL");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* =========================
       Debounce Search (300ms)
    ========================= */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1); // reset page on new search
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    /* =========================
       Fetch Orders (BE-driven)
    ========================= */
    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await adminOrderService.getOrders({
                    page,
                    size,
                    status: status === "ALL" ? undefined : status,
                    keyword: debouncedSearch || undefined,
                });


                setOrders(res.content || []);
                setTotalPages(res.totalPages || 1);
            } catch (e) {
                setError("Gagal memuat daftar order");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [page, size, status, debouncedSearch]);

    /* =========================
       Export Functions
    ========================= */
    const getExportData = async () => {
        try {
            const res = await adminOrderService.getOrders({
                page: 1,
                size: 5000,
                status: status === "ALL" ? undefined : status,
                keyword: debouncedSearch || undefined,
            });

            if (!res.content || res.content.length === 0) {
                toast.error("Tidak ada data untuk di-export");
                return null;
            }

            return res.content.map((r) => ({
                "Order ID": r.id,
                User: r.userName,
                Total: Number(r.totalPrice || 0),
                Status: r.status,
                Date: r.createdAt
                    ? new Date(r.createdAt).toLocaleString("id-ID")
                    : "",
            }));
        } catch {
            toast.error("Gagal mengambil data");
            return null;
        }
    };

    const handleExportCSV = async () => {
        const data = await getExportData();
        if (data) {
            exportObjectsToCsv(
                data,
                ["Order ID", "User", "Total", "Status", "Date"],
                `orders-${new Date().toISOString()}.csv`
            );
            toast.success("Export CSV berhasil");
        }
    };

    const handleExportExcel = async () => {
        const data = await getExportData();
        if (data) {
            exportObjectsToExcel(
                data,
                ["Order ID", "User", "Total", "Status", "Date"],
                `orders-${new Date().toISOString()}.xls`
            );
            toast.success("Export Excel berhasil");
        }
    };

    return (
        <div className="space-y-6">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6" /> Manajemen Order
                </h1>

                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Cari nama user..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />

                    <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
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

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={orders.length === 0}>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExportCSV}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportExcel}>
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                Export Excel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            {loading ? (
                <div className="bg-card rounded-xl border shadow-sm">
                    <table className="w-full text-sm">
                        <tbody>
                            {[...Array(6)].map((_, i) => (
                                <tr key={i} className="border-t">
                                    <td className="p-4"><SkeletonText className="h-4 w-32" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-24 mx-auto" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-20 mx-auto" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-24 mx-auto" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-20 mx-auto" /></td>
                                    <td className="p-4" />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : error ? (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : orders.length === 0 ? (
                <div className="bg-card rounded-xl p-10 text-center text-muted-foreground">
                    Tidak ada order ditemukan
                </div>
            ) : (
                <div className="bg-card rounded-xl border shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted">
                            <tr>
                                <th className="p-4 text-left">Order ID</th>
                                <th className="p-4">User</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Tanggal Order</th>
                                <th className="p-4">Pengiriman</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((o) => (
                                <tr
                                    key={o.id}
                                    className="border-t hover:bg-muted cursor-pointer"
                                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                                >
                                    <td className="p-4 font-medium">{o.id.slice(0, 8)}...</td>
                                    <td className="p-4 text-center">{o.userName}</td>
                                    <td className="p-4 text-center">
                                        Rp {Number(o.totalPrice || 0).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-4 text-center">
                                        <OrderStatusBadge status={o.status} />
                                    </td>
                                    <td className="p-4 text-center">
                                        {new Date(o.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="p-4 text-center text-xs">
                                        {o.deliveryDate ? (
                                            <div>
                                                <div>{new Date(o.deliveryDate).toLocaleDateString("id-ID")}</div>
                                                {o.deliverySlot && (
                                                    <div className="text-muted-foreground">
                                                        {o.deliverySlot === "MORNING" ? "Pagi" : "Siang"}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end">
                                            <Link to={`/admin/orders/${o.id}`} onClick={(e) => e.stopPropagation()}>
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

                    {/* ================= PAGINATION ================= */}
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="text-sm text-muted-foreground">
                            Page <b>{page}</b> / {totalPages}
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={String(size)} onValueChange={(v) => { setSize(Number(v)); setPage(1); }}>
                                <SelectTrigger className="w-30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[10, 25, 50].map((s) => (
                                        <SelectItem key={s} value={String(s)}>
                                            {s} / page
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                size="icon"
                                variant="ghost"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
