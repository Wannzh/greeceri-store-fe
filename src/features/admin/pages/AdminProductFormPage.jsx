import { useEffect, useState, useRef } from "react";
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
import { Save, ArrowLeft, Loader2, Upload, X, ImageIcon } from "lucide-react";

export default function AdminProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(productId);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      const data = await productService.getById(productId);
      setForm({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl || "",
        categoryId: String(data.category?.id || data.categoryId || ""),
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Hanya file JPG, PNG, atau WebP yang diperbolehkan");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    try {
      setUploading(true);
      const result = await productService.uploadImage(file);
      handleChange("imageUrl", result.url);
      toast.success("Gambar berhasil diupload");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Gagal mengupload gambar");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    handleChange("imageUrl", "");
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
        toast.success("Produk berhasil diupdate");
      } else {
        await productService.createProduct(payload);
        toast.success("Produk berhasil ditambahkan");
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
    <div className="space-y-6 max-w-xl">

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
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Gambar Produk</Label>

          {form.imageUrl ? (
            <div className="relative inline-block">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="h-40 w-40 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition"
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Klik untuk upload</span>
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />

          {form.imageUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Ganti Gambar
                </>
              )}
            </Button>
          )}
        </div>

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

        <Button
          type="submit"
          className="w-full h-11 font-semibold"
          disabled={saving || uploading}
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
  );
}
