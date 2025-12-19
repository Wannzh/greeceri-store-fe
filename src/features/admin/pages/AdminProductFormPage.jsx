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
import { Save, ArrowLeft, Loader2, Upload, X, ImageIcon, PackagePlus } from "lucide-react";

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
      // Use admin endpoint to get product with categoryId
      const data = await productService.getAdminProductById(productId);
      setForm({
        name: data.name || "",
        description: data.description || "",
        price: data.price || "",
        stock: data.stock || "",
        imageUrl: data.imageUrl || "",
        categoryId: String(data.categoryId || ""),
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
        toast.success("Produk berhasil diperbarui");
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
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-gray-500 text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
          </h1>
          <p className="text-sm text-gray-500">
            {isEdit ? "Perbarui detail dan stok produk" : "Tambahkan item baru ke inventaris toko"}
          </p>
        </div>
      </div>

      {/* FORM WRAPPER */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN: Image & Meta */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" /> Media Produk
            </h3>

            <div className="space-y-4">
              {form.imageUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" /> Hapus
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all group"
                >
                  {uploading ? (
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  ) : (
                    <>
                      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                        <Upload className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Upload Gambar</span>
                      <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (Max 5MB)</span>
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
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Ganti Gambar"}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Status & Kategori</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kategori <span className="text-red-500">*</span></Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(val) => handleChange("categoryId", val)}
                >
                  <SelectTrigger className="h-11">
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
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                  <PackagePlus size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">Detail Informasi</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  placeholder="Contoh: Apel Fuji Premium"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Jelaskan detail produk..."
                  className="min-h-[140px] resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      required
                      className="pl-9 h-11"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stok Awal <span className="text-red-500">*</span></Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    required
                    className="h-11"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => navigate(-1)} disabled={saving}>
                Batal
              </Button>
              <Button
                type="submit"
                className="px-8 font-semibold"
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
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}