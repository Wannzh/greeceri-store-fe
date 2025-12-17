import { useEffect, useState, useMemo } from "react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import ProductCard from "@/features/product/components/ProductCard";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, Package } from "lucide-react";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [gridCols, setGridCols] = useState(4);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAllCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(p => p.categoryId === parseInt(selectedCategory) || p.category?.id === parseInt(selectedCategory));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

  if (loading) return <FullScreenLoader />;

  if (error)
    return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Produk Segar
          </h1>
          <p className="text-white/80 text-lg">
            Temukan berbagai produk segar berkualitas untuk kebutuhan Anda
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-gray-400 hidden md:block" />
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap px-4 py-2"
                onClick={() => setSelectedCategory("all")}
              >
                Semua
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === String(cat.id) ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap px-4 py-2"
                  onClick={() => setSelectedCategory(String(cat.id))}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>

            {/* Grid Toggle */}
            <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={gridCols === 3 ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridCols(3)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridCols === 4 ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridCols(4)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Menampilkan <span className="font-semibold">{filteredProducts.length}</span> produk
            {selectedCategory !== "all" && (
              <span> dalam kategori <span className="font-semibold">{categories.find(c => String(c.id) === selectedCategory)?.name}</span></span>
            )}
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-gray-500 mb-4">
              Tidak ada produk yang cocok dengan pencarian Anda
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}>
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className={`grid grid-cols-2 md:grid-cols-${gridCols} gap-6`}>
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
