import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { categoryService } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
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
      setForm({
        name: data.name,
        description: data.description || "",
      });
    } catch (err) {
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
      } else {
        await categoryService.createCategory(form);
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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-xl px-4 space-y-6">

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Kategori" : "Tambah Kategori"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border shadow-sm p-6 space-y-5"
        >
          <div className="space-y-2">
            <Label>Nama Kategori</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 font-semibold"
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
                Simpan Kategori
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
