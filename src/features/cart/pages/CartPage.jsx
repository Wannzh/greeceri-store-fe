import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  // Menggunakan Context (yang sekarang memanggil Service)
  const { cart, updateQuantity, removeItem, loading } = useCart();

  // --- LOCAL UI STATE (Modal & Checkbox) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set()); 

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
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete.cartItemId); // Panggil Context -> Service
    }
    closeDeleteModal();
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    } else {
      openDeleteModal(item);
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
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center bg-gray-50 text-center p-4">
        <div className="mb-6 rounded-full bg-white p-6 shadow-sm">
          <ShoppingBag className="h-16 w-16 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Wah, keranjangmu kosong!</h2>
        <p className="mt-2 mb-8 max-w-md text-gray-500">
          Yuk, isi dengan barang-barang impianmu.
        </p>
        <Link to="/">
          <Button size="lg" className="px-8 font-semibold">Mulai Belanja</Button>
        </Link>
      </div>
    );
  }

  const isAllSelected = cart.items.length > 0 && selectedItems.size === cart.items.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 pt-6">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        
        {/* Header Select All */}
        <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
              checked={isAllSelected}
              onChange={handleSelectAll}
            />
            <span className="font-medium text-gray-700">Pilih Semua ({cart.items.length})</span>
          </div>
        </div>

        {/* List Produk */}
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.cartItemId}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md sm:flex-row sm:items-center sm:gap-6"
            >
              {/* Checkbox */}
              <div className="absolute left-4 top-4 sm:static sm:flex sm:items-center">
                 <input 
                   type="checkbox" 
                   className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                   checked={selectedItems.has(item.cartItemId)}
                   onChange={() => handleSelectItem(item.cartItemId)}
                 />
              </div>

              {/* Gambar */}
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 sm:h-28 sm:w-28 sm:ml-2">
                <img
                  src={item.productImageUrl || "https://placehold.co/100"}
                  alt={item.productName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Info & Kontrol */}
              <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                <div className="space-y-1 sm:pr-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {item.productName}
                  </h3>
                  <p className="text-sm font-medium text-gray-500">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end sm:gap-3">
                  <p className="text-base font-bold text-primary sm:order-2">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>

                  <div className="flex items-center rounded-lg border border-gray-200 bg-white sm:order-1">
                    <button
                      className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
                      onClick={() => handleDecreaseQuantity(item)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="flex h-8 w-10 items-center justify-center border-x border-gray-100 text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </div>
                    <button
                      className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hapus Button */}
              <button
                onClick={() => openDeleteModal(item)}
                className="absolute right-4 top-4 p-2 text-gray-400 transition-colors hover:text-red-500 sm:static sm:p-0"
                title="Hapus Barang"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-200 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center justify-between sm:justify-end sm:gap-6 w-full sm:w-auto">
            
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Total ({selectedItems.size} Barang)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                Rp {selectedTotal.toLocaleString("id-ID")}
              </p>
            </div>
            
            {/* Disini logic Navigasi ke Checkout perlu mengirim state selectedItems.
                Tapi karena kita belum setup state management global untuk selectedItems checkout,
                kita simpan di localStorage sementara atau kirim via state Link.
            */}
            <Link 
              to="/checkout" 
              state={{ selectedItems: Array.from(selectedItems) }} // Kirim data via Router State
              className={selectedItems.size === 0 ? "pointer-events-none" : ""}
            >
              <Button 
                size="lg" 
                className="h-12 px-8 text-lg font-bold shadow-lg transition-transform active:scale-95"
                disabled={selectedItems.size === 0}
              >
                Checkout ({selectedItems.size})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Hapus */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px] animate-in fade-in">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Hapus Produk?</h3>
              <p className="text-sm text-gray-500">
                Apakah Anda yakin ingin menghapus <br />
                <span className="font-semibold text-gray-800">"{itemToDelete?.productName}"</span>?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-100 p-px">
              <button onClick={closeDeleteModal} className="bg-white py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleConfirmDelete} className="bg-white py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}