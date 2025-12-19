import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Package, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

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

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                    
                    {/* Left: Image */}
                    <div className="p-6 lg:p-10 bg-gray-50 flex items-center justify-center">
                        <div className="relative w-full aspect-square max-w-[500px] bg-white rounded-2xl shadow-sm p-4">
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
                            <Button
                                size="lg"
                                className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                                disabled={isOutOfStock}
                                onClick={() => addToCart(product.id, 1)}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
                            </Button>
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