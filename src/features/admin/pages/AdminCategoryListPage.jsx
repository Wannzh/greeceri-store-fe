import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";

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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoadingId(id);
      await categoryService.deleteCategory(id);
      await loadCategories();
    } catch (err) {
      toast.error("Gagal menghapus kategori");
    } finally {
      setLoadingId(null);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kategori Produk</h1>
          <Link to="/admin/categories/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Tambah Kategori
            </Button>
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500">
            Belum ada kategori
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Nama</th>
                  <th className="p-4">Deskripsi</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t">
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4 text-gray-600">
                      {cat.description || "-"}
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
                          description="Kategori ini akan dihapus secara permanen."
                          confirmText="Ya, Hapus"
                          loading={loadingId === cat.id}
                          onConfirm={() => handleDelete(cat.id)}
                          trigger={
                            <Button size="icon" variant="destructive">
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
