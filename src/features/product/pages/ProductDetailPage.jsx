import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { wishlistService } from "@/services/wishlistService";
import { Button } from "@/components/ui/button";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Package, ShoppingCart, Minus, Plus, Heart, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    loadProduct();
    if (isAuthenticated) {
      checkWishlist();
    }
  }, [id, isAuthenticated]);

  const loadProduct = async () => {
    try {
      const data = await productService.getById(id);
      setProduct(data);
    } catch (err) {
      setError("Produk tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const result = await wishlistService.check(id);
      // Handle both boolean and object response
      setIsWishlisted(typeof result === 'boolean' ? result : result?.inWishlist || false);
    } catch (err) {
      console.error("Failed to check wishlist:", err);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Silakan login untuk menambahkan ke wishlist");
      return;
    }

    try {
      setWishlistLoading(true);
      if (isWishlisted) {
        await wishlistService.remove(id);
        setIsWishlisted(false);
        toast.success("Dihapus dari wishlist");
      } else {
        await wishlistService.add(id);
        setIsWishlisted(true);
        toast.success("Ditambahkan ke wishlist");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      toast.success(`${product.name} ditambahkan ke keranjang!`);
      setQuantity(1); // Reset quantity after adding
    } else {
      toast.error(result.message || "Gagal menambahkan ke keranjang");
    }
  };

  if (loading) return <FullScreenLoader />;

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <p className="text-lg text-gray-500 font-medium">{error}</p>
      <Button asChild variant="outline"><Link to="/products">Kembali ke Katalog</Link></Button>
    </div>
  );

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 lg:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {/* Breadcrumb / Back */}
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Produk
          </Link>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">

            {/* Left: Image */}
            <div className="p-2 lg:p-6 bg-gray-50 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[500px] bg-white shadow-sm p-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-xl hover:scale-105 transition-transform duration-500"
                />
                {product.categoryName && (
                  <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900 shadow-sm hover:bg-white text-sm py-1 px-3">
                    {product.categoryName}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="p-6 lg:p-10 flex flex-col h-full">
              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
                  <div className="mt-4 flex items-center gap-4">
                    <h2 className="text-3xl font-extrabold text-primary">
                      Rp {product.price.toLocaleString("id-ID")}
                      {product.unit && <span className="text-lg font-normal text-gray-500">/{product.unit}</span>}
                    </h2>
                    {isOutOfStock ? (
                      <Badge variant="destructive" className="px-3 py-1 text-sm">Stok Habis</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1 text-sm gap-1">
                        <CheckCircle2 size={14} /> Tersedia {product.stock}
                      </Badge>
                    )}
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="prose prose-sm text-gray-600 leading-relaxed">
                  <h3 className="text-gray-900 font-semibold mb-2 text-sm uppercase tracking-wider">Deskripsi</h3>
                  <p>{product.description || "Deskripsi produk belum tersedia. Namun kami menjamin kesegaran produk ini."}</p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheck className="text-green-500 h-5 w-5" />
                    <span>Jaminan Segar 1x24 Jam</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="text-blue-500 h-5 w-5" />
                    <span>Pengiriman Cepat</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-8 mt-auto">
                {/* Quantity & Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors text-gray-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isOutOfStock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/20"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className={`rounded-xl border-gray-200 transition-colors cursor-pointer ${isWishlisted
                        ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                        : "hover:bg-gray-50 hover:text-red-500"
                      }`}
                    onClick={handleToggleWishlist}
                    disabled={wishlistLoading}
                  >
                    {wishlistLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                    )}
                  </Button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Harga sudah termasuk pajak. Ongkos kirim dihitung saat checkout.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}