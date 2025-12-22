import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Eye, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, 1);
    if (result.success) {
      toast.success(`${product.name} ditambahkan ke keranjang`);
    } else {
      toast.error(result.message || "Gagal menambahkan ke keranjang");
    }
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-slate-100 hover:bg-slate-100/40 transition-colors duration-500 p-4 relative">
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative mb-4">
          <img
            src={product.imageUrl || "/placeholder-product.png"}
            alt={product.name}
            className="h-32 sm:h-40 w-full object-contain mx-auto mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
          />

          {/* Stock Badge - Circular Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="rounded-full bg-black/70 text-white w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <span>Sold</span>
                <span>Out</span>
              </div>
            </div>
          )}

          {/* Category - Minimalist floating text */}
          {product.categoryName && (
            <span className="absolute top-0 left-0 text-[10px] tracking-widest uppercase text-gray-500 font-medium">
              {product.categoryName}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2 text-center pb-6">
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 text-xs sm:text-sm leading-relaxed tracking-wide line-clamp-2 hover:text-black transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex flex-col items-center justify-center gap-0.5">
            <p className="text-sm sm:text-base font-medium text-gray-900 tracking-wide">
              Rp {product.price?.toLocaleString("id-ID")}
              {product.unit && <span className="text-xs font-normal text-gray-500 ml-1">/{product.unit}</span>}
            </p>

            {/* Stock Display - Restored */}
            {!isOutOfStock && (
              <p className="text-[10px] text-gray-400 tracking-wide flex items-center gap-1">
                <Package className="h-3 w-3" />
                {product.stock} tersedia
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Actions - Cart Icon at Bottom Right */}
      <div className="absolute bottom-3 right-3">
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevent Link navigation
            handleAddToCart();
          }}
          disabled={isOutOfStock}
          className={`text-gray-400 hover:text-primary transition-all duration-300 p-2 rounded-full hover:bg-white active:scale-95 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Add to cart"
          title="Add to cart"
        >
          <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
