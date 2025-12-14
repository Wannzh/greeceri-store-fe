import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import ProductCard from "@/features/product/components/ProductCard";
import FullScreenLoader from "@/components/common/FullScreenLoader";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader />;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Daftar Produk</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
