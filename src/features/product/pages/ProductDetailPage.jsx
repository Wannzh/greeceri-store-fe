import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useCart } from "@/context/CartContext";

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
  if (error) return <p className="p-6 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="rounded-lg object-cover w-full h-80"
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground">{product.description}</p>

        <p className="text-xl font-semibold text-primary">
          Rp {product.price.toLocaleString()}
        </p>

        <p className="text-sm">
          Stok:{" "}
          <span className={product.stock > 0 ? "text-green-600" : "text-red-500"}>
            {product.stock > 0 ? product.stock : "Habis"}
          </span>
        </p>

        <Button
          disabled={product.stock <= 0}
          onClick={() => addToCart(product.id, 1)}
        >
          Tambah ke Keranjang
        </Button>
      </div>
    </div>
  );
}
