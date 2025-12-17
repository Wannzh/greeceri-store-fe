import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Tags, Package } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";
import { SkeletonText } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function AdminCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await categoryService.deleteCategory(id);
      toast.success("Kategori berhasil dihapus");
      await loadCategories();
    } catch (err) {
      // Handle error message from backend
      const message = err.response?.data?.message || err.message || "Gagal menghapus kategori";
      if (message.includes("still has products")) {
        toast.error("Tidak bisa hapus kategori yang masih memiliki produk");
      } else {
        toast.error(message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Tags className="h-6 w-6" /> Manajemen Kategori
        </h1>
        <Link to="/admin/categories/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Tambah Kategori
          </Button>
        </Link>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="bg-white rounded-xl border shadow-sm">
          <table className="w-full text-sm">
            <tbody>
              {[...Array(4)].map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="p-4"><SkeletonText className="h-4 w-32" /></td>
                  <td className="p-4"><SkeletonText className="h-4 w-48" /></td>
                  <td className="p-4 text-center"><SkeletonText className="h-4 w-12 mx-auto" /></td>
                  <td className="p-4" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center text-gray-500">
          Belum ada kategori
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">Deskripsi</th>
                <th className="p-4">Jumlah Produk</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const productCount = cat.products?.length || 0;

                return (
                  <tr key={cat.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-gray-600">
                      {cat.description || "-"}
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={productCount > 0 ? "secondary" : "outline"}>
                        <Package className="h-3 w-3 mr-1" />
                        {productCount} produk
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/categories/${cat.id}/edit`}>
                          <Button size="icon" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <ConfirmDialog
                          title="Hapus Kategori?"
                          description={
                            productCount > 0
                              ? `Kategori ini memiliki ${productCount} produk. Anda harus memindahkan atau menghapus produk terlebih dahulu.`
                              : "Kategori ini akan dihapus secara permanen."
                          }
                          confirmText="Ya, Hapus"
                          loading={loadingId === cat.id}
                          onConfirm={() => handleDelete(cat.id)}
                          trigger={
                            <Button
                              size="icon"
                              variant="destructive"
                              disabled={loadingId === cat.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
