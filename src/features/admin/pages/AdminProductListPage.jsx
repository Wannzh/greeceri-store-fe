import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Pencil,
  Trash2,
  Package
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function AdminProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data || []);
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

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package /> Manajemen Produk
          </h1>

          <Link to="/admin/products/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Produk
            </Button>
          </Link>
        </div>

        {/* TABLE */}
        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500">
            Belum ada produk
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      {p.name}
                    </td>

                    <td className="px-4 py-3 text-center">
                      Rp {p.price.toLocaleString("id-ID")}
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
          </div>
        )}
      </div>
    </div>
  );
}
