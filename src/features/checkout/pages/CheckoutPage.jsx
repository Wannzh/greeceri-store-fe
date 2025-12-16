import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart(); 
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil ID item yang dipilih dari state navigasi sebelumnya
  const selectedItemsIds = location.state?.selectedItems || [];
  
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Filter item cart berdasarkan ID yang dipilih
  const itemsToCheckout = cart.items.filter(item =>
    selectedItemsIds.includes(item.cartItemId)
  );

  // Hitung Total
  const totalAmount = itemsToCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const SERVICE_FEE = 1000;

  const grandTotal = totalAmount + SERVICE_FEE;
  // Load Alamat saat halaman dibuka
  useEffect(() => {
    if (selectedItemsIds.length === 0) {
      navigate("/cart");
      return;
    }

    const loadAddresses = async () => {
      try {
        const data = await addressService.getMyAddresses();
        setAddresses(data);
        
        // Otomatis pilih alamat utama (mainAddress)
        const main = data.find(addr => addr.mainAddress) || data[0];
        if (main) {
          setSelectedAddressId(main.id);
        }
      } catch (err) {
        console.error("Gagal load alamat", err);
      }
    };

    loadAddresses();
  }, [navigate, selectedItemsIds]);

  // Handle Checkout
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Mohon pilih alamat pengiriman terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);

      // PAYLOAD YANG BENAR SESUAI BACKEND
      const payload = {
        addressId: selectedAddressId,      
        selectedCartItemIds: selectedItemsIds
      };

      const orderResponse = await orderService.createOrder(payload);

      if (orderResponse.paymentUrl) {
        // Redirect user ke Xendit
        window.location.href = orderResponse.paymentUrl;
        
        fetchCart(); 
      } else {
        toast.error("Gagal mendapatkan link pembayaran.");
      }

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Checkout gagal";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const activeAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="container mx-auto max-w-8xl p-6 space-y-8 pb-24">
      <h1 className="text-2xl font-bold">Pengiriman & Pembayaran</h1>

      <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
        {/* KOLOM KIRI: ALAMAT & ITEM */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Section Alamat */}
          <div className="bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <MapPin className="text-primary" size={20} /> Alamat Pengiriman
            </h2>
            
            {activeAddress ? (
              <div className="text-sm space-y-1">
                <p className="font-bold">{activeAddress.label} • {activeAddress.receiverName}</p>
                <p>{activeAddress.phoneNumber}</p>
                <p className="text-gray-600">{activeAddress.fullAddress}</p>
                <p>{activeAddress.city}, {activeAddress.postalCode}</p>
              </div>
            ) : (
              <p className="text-red-500 text-sm">Belum ada alamat. Silakan tambah di profil.</p>
            )}
            {/* Nanti Anda bisa tambah tombol "Ganti Alamat" disini */}
          </div>

          {/* Section Item */}
          <div className="bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg mb-4">Rincian Barang</h2>
            {itemsToCheckout.map(item => (
              <div key={item.cartItemId} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                <img 
                   src={item.productImageUrl || "https://placehold.co/80"} 
                   alt={item.productName}
                   className="w-16 h-16 rounded-md object-cover border"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-sm text-gray-500">{item.quantity} x Rp {item.price.toLocaleString("id-ID")}</p>
                </div>
                <div className="font-semibold">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KOLOM KANAN: RINGKASAN */}
        <div className="md:col-span-4">
          <div className="bg-white p-6 shadow-sm sticky top-24 space-y-4">
            <h2 className="font-semibold text-lg">Ringkasan Belanja</h2>
            
            <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Harga ({itemsToCheckout.length} barang)</span>
                  <span>Rp {totalAmount.toLocaleString("id-ID")}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Ongkos Kirim</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>

                {/* Menampilkan Biaya Layanan agar sesuai dengan Backend */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Biaya Layanan</span>
                  <span>Rp {SERVICE_FEE.toLocaleString("id-ID")}</span>
                </div>
              </div>

            <hr />

            <div className="flex justify-between font-bold text-lg text-primary">
              <span>Total Tagihan</span>
              <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>

            <Button
              size="lg"
              className="w-full font-bold text-lg h-12"
              disabled={loading || !selectedAddressId}
              onClick={handleCheckout}
            >
              {loading ? "Memproses..." : "Bayar Sekarang"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}