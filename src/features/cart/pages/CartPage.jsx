import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  // Menggunakan Context (yang sekarang memanggil Service)
  const { cart, updateQuantity, removeItem, loading } = useCart();

  // --- LOCAL UI STATE (Modal & Checkbox) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Reset selection jika cart berubah
  useEffect(() => {
    // Opsional: Validasi agar selectedItems tidak berisi ID yang sudah dihapus
    if (cart?.items) {
      const currentIds = new Set(cart.items.map(i => i.cartItemId));
      setSelectedItems(prev => {
        const next = new Set();
        prev.forEach(id => {
          if (currentIds.has(id)) next.add(id);
        });
        return next;
      });
    }
  }, [cart]);

  // --- LOGIKA HITUNG TOTAL (FRONTEND ONLY) ---
  const selectedTotal = cart?.items?.reduce((total, item) => {
    if (selectedItems.has(item.cartItemId)) {
      return total + (item.price * item.quantity);
    }
    return total;
  }, 0) || 0;

  // --- HANDLERS UI ---
  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(cart.items.map((item) => item.cartItemId));
      setSelectedItems(allIds);
    }
  };

  const openDeleteModal = (item) => {
    setItemToDelete(item);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
    setIsBulkDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (isBulkDelete) {
      // Delete all selected items
      for (const cartItemId of selectedItems) {
        await removeItem(cartItemId);
      }
      setSelectedItems(new Set());
    } else if (itemToDelete) {
      removeItem(itemToDelete.cartItemId);
    }
    closeDeleteModal();
  };

  const openBulkDeleteModal = () => {
    if (selectedItems.size === 0) return;
    setIsBulkDelete(true);
    setIsModalOpen(true);
  };

  const handleDecreaseQuantity = async (item) => {
    if (item.quantity > 1) {
      const result = await updateQuantity(item.cartItemId, item.quantity - 1);
      if (!result.success) {
        toast.error(result.message);
      }
    } else {
      openDeleteModal(item);
    }
  };

  const handleIncreaseQuantity = async (item) => {
    const result = await updateQuantity(item.cartItemId, item.quantity + 1);
    if (!result.success) {
      toast.error(result.message || "Stok tidak mencukupi");
    }
  };

  // --- RENDER LOADING ---
  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-500 font-medium">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  // --- RENDER EMPTY ---
  if ((!cart || !cart.items || cart.items.length === 0) && !loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-white text-center p-4">
        <div className="mb-6 rounded-full bg-gray-50 p-6">
          <ShoppingBag className="h-16 w-16 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Wah, keranjangmu kosong!</h2>
        <p className="mt-2 mb-8 max-w-md text-gray-500">
          Yuk, isi dengan barang-barang impianmu.
        </p>
        <Link to="/products">
          <Button size="lg" className="px-8 font-semibold rounded-full">Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  const isAllSelected = cart?.items?.length > 0 && selectedItems.size === cart.items.length;

  return (
    <div className="min-h-screen bg-white pb-32 pt-8">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">

        {/* Header Select All - Matching Image Style */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
          <div className="flex items-center gap-4">
            {/* Custom Checkbox */}
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-300 bg-white checked:border-primary checked:bg-primary transition-all cursor-pointer"
                checked={isAllSelected}
                onChange={handleSelectAll}
                id="select-all"
              />
              <div className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <label htmlFor="select-all" className="text-lg font-bold text-gray-800 cursor-pointer select-none">
              Semua Pesanan
            </label>
          </div>
          <button
            onClick={openBulkDeleteModal}
            disabled={selectedItems.size === 0}
            className={`text-base font-bold transition-colors ${selectedItems.size === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-600'}`}
          >
            Hapus ({selectedItems.size})
          </button>
        </div>

        {/* List Produk */}
        <div className="flex flex-col">
          {cart?.items?.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-start sm:items-center gap-4 sm:gap-6 py-8 border-b border-gray-100 last:border-0"
            >
              {/* Checkbox */}
              <div className="flex-shrink-0 pt-2 sm:pt-0">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-300 bg-white checked:border-primary checked:bg-primary transition-all cursor-pointer"
                    checked={selectedItems.has(item.cartItemId)}
                    onChange={() => handleSelectItem(item.cartItemId)}
                  />
                  <div className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Gambar */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden sm:h-24 sm:w-24">
                <img
                  src={item.productImageUrl || "https://placehold.co/100"}
                  alt={item.productName}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-center min-w-0 mr-auto">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {/* Mock variant info to match 'Normal Size (20ml) - New Pack' style */}
                  {item.unit ? item.unit : "Regular Pack"}
                </p>
              </div>

              {/* Controls Group: Quantity, Trash, Price - Right Aligned on Desktop */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-6 sm:gap-8 ml-4">

                {/* Quantity & Delete Wrapper */}
                <div className="flex items-center gap-6">
                  {/* Quantity Box - Matching Image: Gray background, spaced items */}
                  <div className="flex items-center rounded-md bg-gray-100 px-3 py-1.5 h-10 gap-3">
                    <button
                      className="flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
                      onClick={() => handleDecreaseQuantity(item)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-6 text-center text-base font-medium text-gray-900">
                      {item.quantity}
                    </div>
                    <button
                      className="flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Trash Icon - Outside, styled simply */}
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Price Group */}
                <div className="text-right min-w-[100px]">
                  <p className="text-base sm:text-lg font-bold text-primary">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rp {item.price.toLocaleString("id-ID")} / {item.unit || "pcs"}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-100 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto flex max-w-6xl items-center justify-between sm:justify-end gap-8">

          <div className="hidden sm:block text-right">
            <p className="text-sm text-gray-500">Total Pembayaran</p>
            <p className="text-2xl font-bold text-primary">
              Rp {selectedTotal.toLocaleString("id-ID")}
            </p>
          </div>

          <Link
            to="/checkout"
            state={{ selectedItems: Array.from(selectedItems) }}
            className={`w-full sm:w-auto ${selectedItems.size === 0 ? "pointer-events-none opacity-50" : ""}`}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto px-10 h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20"
              disabled={selectedItems.size === 0}
            >
              Checkout ({selectedItems.size})
            </Button>
          </Link>
        </div>
      </div>

      {/* Modal Hapus */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {isBulkDelete ? "Hapus Produk Terpilih?" : "Hapus Produk?"}
              </h3>
              <p className="text-sm text-gray-500">
                {isBulkDelete ? (
                  <>Apakah Anda yakin ingin menghapus <span className="font-semibold text-gray-800">{selectedItems.size} produk</span> dari keranjang?</>
                ) : (
                  <>Apakah Anda yakin ingin menghapus <br /><span className="font-semibold text-gray-800">"{itemToDelete?.productName}"</span>?</>
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-100 p-px">
              <button onClick={closeDeleteModal} className="bg-white py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Batal
              </button>
              <button onClick={handleConfirmDelete} className="bg-white py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}