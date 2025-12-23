import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { shippingService, DELIVERY_SLOT_LABELS, SERVICE_FEE, MIN_ORDER_AMOUNT } from "@/services/shippingService";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Truck, AlertCircle, Loader2, ChevronDown, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil ID item yang dipilih dari state navigasi sebelumnya
  const selectedItemsIds = location.state?.selectedItems || [];

  const [loading, setLoading] = useState(false);
  const [validatingAddress, setValidatingAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Shipping state
  const [shippingInfo, setShippingInfo] = useState(null);
  const [shippingError, setShippingError] = useState("");

  // Delivery scheduling
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Filter item cart berdasarkan ID yang dipilih
  const itemsToCheckout = cart.items.filter(item =>
    selectedItemsIds.includes(item.cartItemId)
  );

  // Hitung Subtotal
  const subtotal = itemsToCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Get shipping cost from API or 0
  const shippingCost = shippingInfo?.shippingCost || 0;

  // Calculate grand total
  const grandTotal = subtotal + shippingCost + SERVICE_FEE;

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0];

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

  // Validate address when selected
  useEffect(() => {
    if (selectedAddressId) {
      validateSelectedAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId]);

  // Load available slots when date changes
  useEffect(() => {
    if (deliveryDate) {
      loadDeliverySlots(deliveryDate);
    } else {
      setAvailableSlots([]);
      setDeliverySlot("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryDate]);

  const validateSelectedAddress = async () => {
    try {
      setValidatingAddress(true);
      setShippingError("");
      setShippingInfo(null);

      const result = await shippingService.validateAddress(selectedAddressId);

      if (result.isDeliverable || result.shippingCost !== undefined) {
        // If we got shipping cost, address is deliverable
        setShippingInfo({ ...result, isDeliverable: true });
      } else {
        setShippingError(result.message || "Alamat tidak dapat dijangkau.");
      }
    } catch (err) {
      console.error("Gagal validasi alamat:", err);
      const msg = err.response?.data?.message || "Gagal memvalidasi alamat.";
      setShippingError(msg);
    } finally {
      setValidatingAddress(false);
    }
  };

  const loadDeliverySlots = async (date) => {
    try {
      setLoadingSlots(true);
      const slots = await shippingService.getDeliverySlots(date);
      setAvailableSlots(slots || []);
      setDeliverySlot(""); // Reset slot selection
    } catch (err) {
      console.error("Gagal load slots:", err);
      setAvailableSlots(["MORNING", "AFTERNOON"]); // Fallback
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle Checkout
  const handleCheckout = async () => {
    // Validations
    if (!selectedAddressId) {
      toast.error("Mohon pilih alamat pengiriman terlebih dahulu.");
      return;
    }

    if (!shippingInfo?.isDeliverable) {
      toast.error("Alamat tidak dapat dijangkau untuk pengiriman.");
      return;
    }

    if (!deliveryDate) {
      toast.error("Mohon pilih tanggal pengiriman.");
      return;
    }

    if (!deliverySlot) {
      toast.error("Mohon pilih waktu pengiriman.");
      return;
    }

    if (subtotal < MIN_ORDER_AMOUNT) {
      toast.error(`Minimum pembelian adalah Rp ${MIN_ORDER_AMOUNT.toLocaleString("id-ID")}`);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        addressId: selectedAddressId,
        selectedCartItemIds: selectedItemsIds,
        deliveryDate: deliveryDate,
        deliverySlot: deliverySlot,
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

  // Check if checkout is disabled - shippingInfo existing means address is valid
  const isAddressValid = shippingInfo && (shippingInfo.isDeliverable || shippingInfo.shippingCost !== undefined);
  const checkoutDisabled = loading || !selectedAddressId || !isAddressValid || !deliveryDate || !deliverySlot || subtotal < MIN_ORDER_AMOUNT;

  return (
    <div className="container mx-auto max-w-8xl p-6 space-y-8 pb-24">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/cart')}
          className="hover:bg-gray-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Pengiriman & Pembayaran</h1>
      </div>

      <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
        {/* KOLOM KIRI: ALAMAT, JADWAL & ITEM */}
        <div className="md:col-span-8 space-y-6">

          {/* Section Alamat */}
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <MapPin className="text-primary" size={20} /> Alamat Pengiriman
            </h2>

            {addresses.length > 1 && (
              <div className="mb-4">
                <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih alamat" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id}>
                        {addr.label} - {addr.receiverName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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

            {/* Shipping validation status */}
            {validatingAddress && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Memvalidasi alamat...
              </div>
            )}

            {shippingInfo && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <Truck className="h-4 w-4" />
                  <span>{shippingInfo.message}</span>
                </div>
              </div>
            )}

            {shippingError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{shippingError}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section Jadwal Pengiriman */}
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Calendar className="text-primary" size={20} /> Jadwal Pengiriman
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label>Tanggal Pengiriman <span className="text-red-500">*</span></Label>
                <input
                  type="date"
                  min={today}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              {/* Slot Picker */}
              <div className="space-y-2">
                <Label>Waktu Pengiriman <span className="text-red-500">*</span></Label>
                <Select
                  value={deliverySlot}
                  onValueChange={setDeliverySlot}
                  disabled={!deliveryDate || loadingSlots}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingSlots ? "Memuat..." : "Pilih waktu"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(availableSlots.length > 0 ? availableSlots : ["MORNING", "AFTERNOON"]).map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {DELIVERY_SLOT_LABELS[slot] || slot}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section Item */}
          <div className="bg-white p-6 shadow-sm rounded-lg space-y-4">
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
          <div className="bg-white p-6 shadow-sm rounded-lg sticky top-24 space-y-4">
            <h2 className="font-semibold text-lg">Ringkasan Belanja</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({itemsToCheckout.length} barang)</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Ongkos Kirim</span>
                {validatingAddress ? (
                  <span className="text-gray-400">Menghitung...</span>
                ) : shippingInfo ? (
                  <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>

              {shippingInfo?.distanceKm && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Jarak pengiriman</span>
                  <span>{shippingInfo.distanceKm.toFixed(2)} km</span>
                </div>
              )}

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

            {/* Minimum order warning */}
            {subtotal < MIN_ORDER_AMOUNT && (
              <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Minimum pembelian Rp {MIN_ORDER_AMOUNT.toLocaleString("id-ID")}
              </div>
            )}

            <Button
              size="lg"
              className="w-full font-bold text-lg h-12"
              disabled={checkoutDisabled}
              onClick={handleCheckout}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Bayar Sekarang"
              )}
            </Button>

            {/* Checkout requirements */}
            {!shippingInfo?.isDeliverable && selectedAddressId && !validatingAddress && (
              <p className="text-xs text-red-500 text-center">Alamat harus dapat dijangkau</p>
            )}
            {!deliveryDate && (
              <p className="text-xs text-gray-500 text-center">Pilih tanggal pengiriman</p>
            )}
            {deliveryDate && !deliverySlot && (
              <p className="text-xs text-gray-500 text-center">Pilih waktu pengiriman</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}