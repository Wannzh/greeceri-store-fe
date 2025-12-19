import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { SkeletonText } from "@/components/ui/skeleton";

export default function AdminProductListPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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
     Fetch Products
  ========================= */
  useEffect(() => {
    loadProducts();
  }, [page, size, debouncedSearch]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAdminProducts({
        page,
        size,
        keyword: debouncedSearch || undefined,
      });

      setProducts(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Gagal load produk", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await productService.deleteProduct(id);
      await loadProducts();
      toast.success("Produk berhasil dihapus");
    } catch (err) {
      console.error("Gagal hapus produk", err);
      toast.error("Gagal menghapus produk");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" /> Manajemen Produk
        </h1>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />

          <Link to="/admin/products/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Produk
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <div className="bg-white rounded-xl border shadow-sm">
          <table className="w-full text-sm">
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="p-4 w-16"><SkeletonText className="h-12 w-12" /></td>
                  <td className="p-4"><SkeletonText className="h-4 w-32" /></td>
                  <td className="p-4 text-center"><SkeletonText className="h-4 w-20 mx-auto" /></td>
                  <td className="p-4 text-center"><SkeletonText className="h-4 w-12 mx-auto" /></td>
                  <td className="p-4" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-500">
          {debouncedSearch ? "Tidak ada produk ditemukan" : "Belum ada produk"}
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left w-16">Gambar</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Satuan</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {p.name}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-600">
                    {p.categoryName || "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    Rp {(p.price || 0).toLocaleString("id-ID")}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-600">
                    {p.unit || "-"}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {p.stock}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/products/${p.id}/edit`}>
                        <Button size="icon" variant="outline">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>

                      <ConfirmDialog
                        title="Hapus Produk?"
                        description="Produk ini akan dihapus secara permanen. Lanjutkan?"
                        confirmText="Ya, Hapus"
                        loading={deletingId === p.id}
                        onConfirm={() => handleDelete(p.id)}
                        trigger={
                          <Button size="icon" variant="destructive" disabled={deletingId === p.id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
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
