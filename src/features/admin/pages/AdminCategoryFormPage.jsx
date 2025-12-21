import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryService } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Loader2, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCategoryFormPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(categoryId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isEdit) loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      const data = await categoryService.getCategoryById(categoryId);

      if (!data) {
        throw new Error("Category not found");
      }

      setForm({
        name: data.name || "",
        description: data.description || "",
      });
    } catch (err) {
      console.error("Error loading category:", err);
      toast.error("Kategori tidak ditemukan");
      navigate("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (isEdit) {
        await categoryService.updateCategory(categoryId, form);
        toast.success("Kategori berhasil diperbarui");
      } else {
        await categoryService.createCategory(form);
        toast.success("Kategori berhasil dibuat");
      }

      navigate("/admin/categories");
    } catch (err) {
      toast.error("Gagal menyimpan kategori");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {isEdit ? "Edit Kategori" : "Buat Kategori Baru"}
            </h1>
            <p className="text-sm text-muted-foreground">
                {isEdit ? "Perbarui informasi kategori produk" : "Tambahkan kategori baru ke katalog toko"}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
             <div className="p-6 md:p-8 space-y-6">
                 {/* Icon Decoration */}
                 <div className="flex items-center gap-3 mb-2">
                     <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <LayoutGrid size={20} />
                     </div>
                     <h3 className="font-semibold text-gray-900">Informasi Dasar</h3>
                 </div>

                <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground">Nama Kategori <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                            placeholder="Contoh: Sayuran Hijau"
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground">Deskripsi</Label>
                        <Textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Deskripsi singkat kategori ini..."
                            className="min-h-[120px] resize-y"
                        />
                        <p className="text-xs text-muted-foreground text-right">Maksimal 255 karakter</p>
                    </div>
                </form>
            </div>
            
            {/* Action Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate(-1)} disabled={saving}>
                    Batal
                </Button>
                <Button
                    type="submit"
                    form="category-form"
                    className="px-6 font-semibold"
                    disabled={saving}
                >
                    {saving ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                    </>
                    ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                    </>
                    )}
                </Button>
            </div>
        </div>
    </div>
  );
}