import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Save, ArrowLeft } from "lucide-react";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setForm({
        name: data.name || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth || "",
      });
    } catch (err) {
      console.error("Gagal load profile", err);
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

      await userService.updateProfile({
        name: form.name,
        phoneNumber: form.phoneNumber,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
      });

      toast.success("Profil berhasil diperbarui");
      navigate("/user/profile");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal memperbarui profil");
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
          <h1 className="text-2xl font-bold">Edit Profil</h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border shadow-sm p-6 space-y-5"
        >
          {/* Nama */}
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Email (READ ONLY) */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={form.email} disabled />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>No. Telepon</Label>
            <Input
              value={form.phoneNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (val.length <= 13) {
                  handleChange("phoneNumber", val);
                }
              }}
              placeholder="08xxxxxxxxxx"
              maxLength={13}
              pattern="^08[0-9]{8,11}$"
              title="Format: 08xxxxxxxxxx (10-13 digit)"
            />
            <p className="text-xs text-gray-500">Format: 08xxxxxxxxxx (10-13 digit)</p>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Jenis Kelamin</Label>
            <Select
              value={form.gender}
              onValueChange={(value) => handleChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Laki-laki</SelectItem>
                <SelectItem value="FEMALE">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DOB */}
          <div className="space-y-2">
            <Label>Tanggal Lahir</Label>
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            />
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full h-11 font-semibold"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
