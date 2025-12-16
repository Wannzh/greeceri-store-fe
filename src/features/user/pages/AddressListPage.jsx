import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addressService } from "@/services/addressService";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import toast from "react-hot-toast";


export default function AddressListPage() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const data = await addressService.getMyAddresses();
            setAddresses(data || []);
        } catch (err) {
            console.error("Gagal load alamat:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoadingId(id);
            await addressService.deleteAddress(id);
            await loadAddresses(); // refresh list
        } catch (err) {
            console.error("Gagal hapus alamat", err);
            toast.error("Gagal menghapus alamat");
        } finally {
            setLoadingId(null);
        }
    };


    const handleSetMain = async (id) => {
        await addressService.setMainAddress(id);
        loadAddresses();
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
            <div className="container mx-auto max-w-4xl px-4 space-y-6">

                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Alamat Saya</h1>
                    <Link to="/user/addresses/new">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" /> Tambah Alamat
                        </Button>
                    </Link>
                </div>

                {/* LIST */}
                {addresses.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                        Belum ada alamat tersimpan
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`bg-white rounded-xl p-5 space-y-3 ${address.mainAddress ? "border-primary" : ""
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="text-primary h-4 w-4" />
                                            <p className="font-semibold">{address.label}</p>

                                            {address.mainAddress && (
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                    Alamat Utama
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm font-medium mt-1">
                                            {address.receiverName} • {address.phoneNumber}
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            {address.fullAddress}, {address.city}, {address.postalCode}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        {!address.mainAddress && (
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleSetMain(address.id)}
                                                title="Jadikan alamat utama"
                                            >
                                                <Star className="h-4 w-4" />
                                            </Button>
                                        )}

                                        <ConfirmDialog
                                            title="Hapus Alamat?"
                                            description="Alamat ini akan dihapus secara permanen dan tidak bisa dikembalikan."
                                            confirmText="Ya, Hapus"
                                            loading={loadingId === address.id}
                                            onConfirm={() => handleDelete(address.id)}
                                            trigger={
                                                <Button size="icon" variant="destructive" disabled={address.mainAddress}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            }
                                        />

                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link to={`/user/addresses/${address.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
