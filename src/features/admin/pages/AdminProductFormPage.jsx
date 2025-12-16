import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(productId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    loadCategories();
    if (isEdit) loadProduct();
  }, [productId]);

  const loadCategories = async () => {
    const data = await categoryService.getAllCategories();
    setCategories(data || []);
  };

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(productId);
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
        categoryId: String(data.category?.id),
      });
    } catch (err) {
      toast.error("Produk tidak ditemukan");
      navigate("/admin/products");
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

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
      };

      if (isEdit) {
        await productService.updateProduct(productId, payload);
      } else {
        await productService.createProduct(payload);
      }

      navigate("/admin/products");
    } catch (err) {
      toast.error("Gagal menyimpan produk");
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

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Produk" : "Tambah Produk"}
          </h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border shadow-sm p-6 space-y-5"
        >
          <div className="space-y-2">
            <Label>Nama Produk</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Harga</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Stok</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select
              value={form.categoryId}
              onValueChange={(val) => handleChange("categoryId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
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
                Simpan Produk
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
