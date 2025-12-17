import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminUserService } from "@/services/adminUserService";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SkeletonText } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function AdminUserListPage() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

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
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    /* =========================
       Fetch Users
    ========================= */
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            setError("");

            try {
                const res = await adminUserService.getUsers({
                    page,
                    size,
                    keyword: debouncedSearch || undefined,
                });

                setUsers(res.content || []);
                setTotalPages(res.totalPages || 1);
            } catch (e) {
                console.error("Failed to load users", e);
                setError("Gagal memuat daftar user");
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [page, size, debouncedSearch]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Manajemen User</h1>

                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Cari nama atau email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64"
                    />
                </div>
            </div>

            {/* ================= TABLE ================= */}
            {loading ? (
                <div className="bg-white rounded-xl border shadow-sm">
                    <table className="w-full text-sm">
                        <tbody>
                            {[...Array(6)].map((_, i) => (
                                <tr key={i} className="border-t">
                                    <td className="p-4"><SkeletonText className="h-4 w-32" /></td>
                                    <td className="p-4"><SkeletonText className="h-4 w-40" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-16 mx-auto" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-16 mx-auto" /></td>
                                    <td className="p-4 text-center"><SkeletonText className="h-4 w-24 mx-auto" /></td>
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
            ) : users.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-500">
                    Tidak ada user ditemukan
                </div>
            ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left">Nama</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Join Date</th>
                                <th className="p-4">Total Orders</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-4 font-medium">{u.name}</td>
                                    <td className="p-4 text-gray-600">{u.email}</td>
                                    <td className="p-4 text-center">
                                        <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Badge variant={u.enabled ? "success" : "destructive"}>
                                            {u.enabled ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-center">
                                        {formatDate(u.createdAt || u.joinDate)}
                                    </td>
                                    <td className="p-4 text-center">
                                        {u.totalOrders ?? 0}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end">
                                            <Link to={`/admin/users/${u.id}`}>
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
                        <div className="text-sm text-gray-600">
                            Page <b>{page}</b> / {totalPages}
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={String(size)} onValueChange={(v) => { setSize(Number(v)); setPage(1); }}>
                                <SelectTrigger className="w-28">
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
