import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addressService } from "@/services/addressService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AddAddressPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  // State untuk mengontrol Pop-up
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    label: "",
    receiverName: "",
    phoneNumber: "",
    fullAddress: "",
    city: "",
    postalCode: "",
    mainAddress: false,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errorMessage) setErrorMessage(""); // Hapus error saat user mengetik ulang
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. Validasi Manual
    if (!form.label || !form.receiverName || !form.fullAddress || !form.phoneNumber) {
      setErrorMessage("Mohon lengkapi semua kolom yang bertanda bintang (*).");
      // Scroll ke atas agar user lihat error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSaving(true);

      // 2. Format Nomor HP (tambah 0 jika user ketik 8...)
      let formattedPhone = form.phoneNumber;
      if (formattedPhone.startsWith("8")) {
        formattedPhone = "0" + formattedPhone;
      }

      const payload = { ...form, phoneNumber: formattedPhone };

      // 3. Kirim ke Backend
      await addressService.addAddress(payload);

      // 4. MUNCULKAN POP-UP SUKSES
      setShowSuccessModal(true);

    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Gagal menyimpan alamat. Silakan coba lagi.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      <div className="container mx-auto max-w-xl px-4 space-y-6">

        {/* --- HEADER --- */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="hover:bg-gray-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Alamat</h1>
            <p className="text-sm text-gray-500">Pastikan detail alamat sudah benar</p>
          </div>
        </div>

        {/* --- ERROR MESSAGE BOX --- */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <XCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* --- FORM --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5"
        >
          {/* Label & Nama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="label">Label Alamat <span className="text-red-500">*</span></Label>
                <Input
                id="label"
                placeholder="Cth: Rumah, Kantor"
                value={form.label}
                onChange={(e) => handleChange("label", e.target.value)}
                required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="receiver">Nama Penerima <span className="text-red-500">*</span></Label>
                <Input
                id="receiver"
                placeholder="Nama lengkap"
                value={form.receiverName}
                onChange={(e) => handleChange("receiverName", e.target.value)}
                required
                />
            </div>
          </div>

          {/* Telepon */}
          <div className="space-y-2">
            <Label htmlFor="phone">No. Telepon <span className="text-red-500">*</span></Label>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 text-sm font-medium bg-white px-1 pointer-events-none">
                  +62
                </span>
                <Input
                  id="phone"
                  className="pl-12"
                  value={form.phoneNumber}
                  onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.startsWith("0")) {
                          handleChange("phoneNumber", val.substring(1));
                      } else {
                          handleChange("phoneNumber", val);
                      }
                  }}
                  placeholder="8xxxxxxxxx"
                  required
                />
            </div>
          </div>

          {/* Alamat */}
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap <span className="text-red-500">*</span></Label>
            <Textarea
              id="address"
              className="resize-none min-h-[100px]"
              value={form.fullAddress}
              onChange={(e) => handleChange("fullAddress", e.target.value)}
              placeholder="Jalan, No. Rumah, RT/RW, Kecamatan..."
              required
            />
          </div>

          {/* Kota & Kode Pos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kota / Kabupaten</Label>
              <Input
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Kode Pos</Label>
              <Input
                value={form.postalCode}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    handleChange("postalCode", val);
                }}
                maxLength={5}
                required
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Checkbox */}
          <div 
            className="flex items-center space-x-2 border p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer" 
            onClick={() => handleChange("mainAddress", !form.mainAddress)}
          >
            <input
              type="checkbox"
              id="mainAddress"
              checked={form.mainAddress}
              onChange={(e) => handleChange("mainAddress", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
              onClick={(e) => e.stopPropagation()}
            />
            <Label htmlFor="mainAddress" className="cursor-pointer text-sm font-medium text-gray-700 flex-1">
              Jadikan sebagai alamat utama
            </Label>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2">
            <Button
                type="submit"
                className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
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
                    Simpan Alamat
                </>
                )}
            </Button>
          </div>
        </form>
      </div>

      {/* MODAL POP-UP */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4 scale-100 animate-in zoom-in-95 duration-300">
            
            {/* Icon Sukses Besar */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Berhasil!</h2>
              <p className="text-gray-500">Alamat pengiriman baru Anda telah berhasil disimpan.</p>
            </div>

            <div className="pt-4">
              <Button 
                className="w-full h-11 text-lg"
                onClick={() => navigate("/user/addresses")}
              >
                OKE, Lihat Alamat
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}