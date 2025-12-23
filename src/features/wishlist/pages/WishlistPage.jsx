import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { wishlistService } from "@/services/wishlistService";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Heart, Trash2, ShoppingCart, ArrowLeft, Package, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function WishlistPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const [addingToCartId, setAddingToCartId] = useState(null);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            const data = await wishlistService.getAll();
            setItems(Array.isArray(data) ? data : data?.content || []);
        } catch (err) {
            console.error("Failed to load wishlist:", err);
            toast.error("Gagal memuat wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            setRemovingId(productId);
            await wishlistService.remove(productId);
            setItems(items.filter(item => item.productId !== productId));
            toast.success("Dihapus dari wishlist");
        } catch (err) {
            toast.error("Gagal menghapus dari wishlist");
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = async (item) => {
        try {
            setAddingToCartId(item.productId);
            const result = await addToCart(item.productId, 1);
            if (result.success) {
                toast.success(`${item.productName} ditambahkan ke keranjang`);
            } else {
                toast.error(result.message || "Gagal menambahkan ke keranjang");
            }
        } catch (err) {
            toast.error("Gagal menambahkan ke keranjang");
        } finally {
            setAddingToCartId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Heart className="h-6 w-6 text-red-500 fill-current" />
                            Wishlist Saya
                        </h1>
                    </div>
                    <p className="text-gray-500 ml-14">
                        {items.length} produk tersimpan
                    </p>
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 p-6 rounded-full mb-6">
                            <Heart className="h-16 w-16 text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Wishlist kosong</h2>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Simpan produk favorit Anda dengan menekan tombol hati di halaman produk.
                        </p>
                        <Link to="/products">
                            <Button size="lg" className="rounded-full px-8">
                                Mulai Belanja
                            </Button>
                        </Link>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                            >
                                {/* Image */}
                                <Link to={`/products/${item.productId}`}>
                                    <div className="relative aspect-square bg-gray-50 p-4">
                                        <img
                                            src={item.productImageUrl || "https://placehold.co/200"}
                                            alt={item.productName}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {item.stock <= 0 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                                                    Stok Habis
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="p-4">
                                    <Link to={`/products/${item.productId}`}>
                                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-primary transition-colors">
                                            {item.productName}
                                        </h3>
                                    </Link>
                                    <p className="text-lg font-bold text-primary mb-3">
                                        Rp {item.price?.toLocaleString("id-ID")}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 text-sm"
                                            onClick={() => handleAddToCart(item)}
                                            disabled={item.stock <= 0 || addingToCartId === item.productId}
                                        >
                                            {addingToCartId === item.productId ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                                    Keranjang
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-500 border-red-200 hover:bg-red-50"
                                            onClick={() => handleRemove(item.productId)}
                                            disabled={removingId === item.productId}
                                        >
                                            {removingId === item.productId ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
