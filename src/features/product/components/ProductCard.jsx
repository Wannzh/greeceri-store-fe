import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-40 w-full object-cover rounded"
        />
      </Link>

      <h3 className="font-semibold line-clamp-1">
        {product.name}
      </h3>

      <p className="text-sm text-muted-foreground">
        Rp {product.price.toLocaleString()}
      </p>

      <Button
        className="w-full"
        disabled={product.stock === 0}
        onClick={() => addToCart(product.id, 1)}
      >
        {product.stock === 0 ? "Habis" : "Tambah ke Cart"}
      </Button>
    </div>
  );
}
