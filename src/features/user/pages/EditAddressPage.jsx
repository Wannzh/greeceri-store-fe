import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addressService } from "@/services/addressService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Loader2, CheckCircle, XCircle, MapPin, Navigation } from "lucide-react";

export default function EditAddressPage() {
  const { addressId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // State untuk Pop-up
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    label: "",
    receiverName: "",
    phoneNumber: "",
    fullAddress: "",
    city: "",
    postalCode: "",
    latitude: null,
    longitude: null,
    mainAddress: false,
  });

  // Load Data Saat Halaman Dibuka
  useEffect(() => {
    loadAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAddress = async () => {
    try {
      const data = await addressService.getAddressById(addressId);

      // Formatting Nomor Telepon untuk Tampilan (Hapus 0 atau 62 di depan)
      let displayPhone = data.phoneNumber || "";
      if (displayPhone.startsWith("62")) displayPhone = displayPhone.substring(2);
      if (displayPhone.startsWith("0")) displayPhone = displayPhone.substring(1);

      setForm({
        label: data.label || "",
        receiverName: data.receiverName || "",
        phoneNumber: displayPhone,
        fullAddress: data.fullAddress || "",
        city: data.city || "",
        postalCode: data.postalCode || "",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        mainAddress: data.mainAddress || false,
      });
    } catch (err) {
      console.error("Gagal load alamat", err);
      setErrorMessage("Alamat tidak ditemukan atau terjadi kesalahan koneksi.");
      setTimeout(() => navigate("/user/addresses"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errorMessage) setErrorMessage("");
  };

  // Validasi kota Bandung
  const validateCity = (city) => {
    const bandungAreas = ["bandung", "cimahi", "kab. bandung", "kabupaten bandung", "kota bandung", "bandung barat"];
    return bandungAreas.some(area => city.toLowerCase().includes(area));
  };

  // Validasi kode pos Bandung (40xxx)
  const validatePostalCode = (postalCode) => {
    return /^40\d{3}$/.test(postalCode);
  };

  // Get current location using Geolocation API
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let msg = "Gagal mendapatkan lokasi.";
        if (error.code === 1) msg = "Akses lokasi ditolak. Silakan izinkan di pengaturan browser.";
        else if (error.code === 2) msg = "Lokasi tidak tersedia.";
        else if (error.code === 3) msg = "Waktu permintaan lokasi habis.";
        setErrorMessage(msg);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // 1. Validasi
    if (!form.label || !form.receiverName || !form.fullAddress || !form.phoneNumber) {
      setErrorMessage("Mohon lengkapi semua kolom yang bertanda bintang (*).");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Validasi Kota Bandung
    if (!validateCity(form.city)) {
      setErrorMessage("Kota/Kabupaten tidak valid. Pengiriman hanya tersedia untuk area Bandung.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Validasi Kode Pos Bandung (40xxx)
    if (!validatePostalCode(form.postalCode)) {
      setErrorMessage("Kode pos tidak valid. Kode pos harus 5 digit dan dimulai dengan 40.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSaving(true);

      // 4. Format Ulang Telepon
      let formattedPhone = form.phoneNumber;
      if (formattedPhone.startsWith("8")) {
        formattedPhone = "0" + formattedPhone;
      }

      const payload = {
        ...form,
        phoneNumber: formattedPhone,
        latitude: form.latitude || null,
        longitude: form.longitude || null,
      };

      // 5. Update ke Backend
      await addressService.updateAddress(addressId, payload);

      // 6. Munculkan Pop-up Sukses
      setShowSuccessModal(true);

    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Gagal memperbarui alamat.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center flex-col gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-gray-500">Memuat data alamat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      <div className="container mx-auto max-w-xl px-4 space-y-6">

        {/* HEADER */}
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Alamat</h1>
            <p className="text-sm text-gray-500">Perbarui detail pengiriman Anda</p>
          </div>
        </div>

        {/* ERROR BANNER */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <XCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* FORM */}
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
                value={form.label}
                onChange={(e) => handleChange("label", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiver">Nama Penerima <span className="text-red-500">*</span></Label>
              <Input
                id="receiver"
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
                required
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap <span className="text-red-500">*</span></Label>
            <Textarea
              id="address"
              className="resize-none min-h-[100px]"
              value={form.fullAddress}
              onChange={(e) => handleChange("fullAddress", e.target.value)}
              required
            />
          </div>

          {/* Kota & Kode Pos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kota / Kabupaten <span className="text-red-500">*</span></Label>
              <Input
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Bandung"
                required
              />
              <p className="text-xs text-gray-500">Hanya area Bandung yang dapat dijangkau</p>
            </div>
            <div className="space-y-2">
              <Label>Kode Pos <span className="text-red-500">*</span></Label>
              <Input
                value={form.postalCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  handleChange("postalCode", val);
                }}
                placeholder="40xxx"
                maxLength={5}
                required
              />
              <p className="text-xs text-gray-500">Harus dimulai dengan 40</p>
            </div>
          </div>

          {/* Geolocation Section */}
          <div className="space-y-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Koordinat Lokasi</span>
                <span className="text-xs text-gray-500">(Opsional)</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="gap-2"
              >
                {gettingLocation ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4" />
                    Gunakan Lokasi Saya
                  </>
                )}
              </Button>
            </div>

            {form.latitude && form.longitude ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                <CheckCircle className="h-4 w-4" />
                <span>Lokasi terdeteksi: {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Koordinat membantu menghitung jarak pengiriman dengan akurat.
              </p>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Checkbox Utama */}
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
            <span className="text-sm font-medium text-gray-700 flex-1 cursor-pointer">
              Jadikan sebagai alamat utama
            </span>
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
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* MODAL POP-UP SUKSES */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4 scale-100 animate-in zoom-in-95 duration-300">

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Berhasil Diperbarui!</h2>
              <p className="text-gray-500">Perubahan alamat Anda telah berhasil disimpan.</p>
            </div>

            <div className="pt-4">
              <Button
                className="w-full h-11 text-lg"
                onClick={() => navigate("/user/addresses")}
              >
                OKE
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}