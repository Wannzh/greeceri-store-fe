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
    <div className="group bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.imageUrl || "/placeholder-product.png"}
            alt={product.name}
            className="h-32 sm:h-40 md:h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs sm:text-sm">
              Stok Habis
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        {product.categoryName && (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/90 text-gray-700 text-[10px] sm:text-xs"
          >
            {product.categoryName}
          </Badge>
        )}

        {/* Quick View Button - hide on mobile */}
        <Link
          to={`/products/${product.id}`}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-white"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3">
        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors min-h-[36px] sm:min-h-[48px]">
            {product.name}
          </h3>
        </Link>

        {/* Price & Stock */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <p className="text-sm sm:text-lg font-bold text-primary">
            Rp {product.price?.toLocaleString("id-ID")}
            {product.unit && <span className="text-xs sm:text-sm font-normal text-gray-500">/{product.unit}</span>}
          </p>
          {!isOutOfStock && (
            <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
              <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {product.stock} tersedia
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full gap-1 sm:gap-2 h-8 sm:h-10 text-xs sm:text-sm"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          variant={isOutOfStock ? "outline" : "default"}
        >
          <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">{isOutOfStock ? "Stok Habis" : "+ Keranjang"}</span>
          <span className="sm:hidden">{isOutOfStock ? "Habis" : "Tambah"}</span>
        </Button>
      </div>
    </div>
  );
}
