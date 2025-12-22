import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { cartService } from "@/services/cartService";

const CartContext = createContext();

const emptyCart = {
  cartId: null,
  items: [],
  totalItems: 0,
  grandTotal: 0,
};

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(false);

  // Load cart saat user login (skip for admin)
  useEffect(() => {
    if (isAuthenticated && user?.role !== "ADMIN") {
      fetchCart();
    } else {
      setCart(emptyCart);
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart(); // Panggil Service
      if (data) setCart(data);
    } catch (err) {
      console.error("Gagal memuat keranjang:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const updatedCart = await cartService.addItem(productId, quantity);
      setCart(updatedCart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal update keranjang";
      return { success: false, message: msg };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const updatedCart = await cartService.updateItemQuantity(cartItemId, quantity);
      setCart(updatedCart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal update quantity";
      console.error("Gagal update quantity:", err);
      return { success: false, message: msg };
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const updatedCart = await cartService.removeItem(cartItemId);
      setCart(updatedCart);
    } catch (err) {
      console.error("Gagal menghapus item:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}