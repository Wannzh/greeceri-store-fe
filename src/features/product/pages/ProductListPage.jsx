import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import ProductCard from "@/features/product/components/ProductCard";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, LayoutGrid, Package, X } from "lucide-react";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters - initialize from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [gridCols, setGridCols] = useState(4);

  // Sync URL params when searchQuery changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, setSearchParams]);

  // Load categories once
  useEffect(() => {
    loadCategories();
  }, []);

  // Load products when category changes
  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Gagal memuat kategori", err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const categoryId = selectedCategory === "all" ? null : selectedCategory;
      const productsData = await productService.getAll(categoryId);
      setProducts(productsData);
    } catch (err) {
      setError("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  // Filter only by search (category is handled by API)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, searchQuery]);

  if (loading && products.length === 0) return <FullScreenLoader />;

  if (error)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">{error}</p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <div className="bg-white border-b sticky top-16 md:top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search Bar */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Cari sayuran, buah, atau bumbu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* View Toggles & Stats */}
            <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
              <p className="text-xs sm:text-sm text-gray-500">
                <span className="font-bold text-gray-900">{filteredProducts.length}</span> produk
              </p>

              {/* Grid toggle - hide on very small screens */}
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={gridCols === 3 ? "white" : "ghost"}
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-md ${gridCols === 3 ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
                  onClick={() => setGridCols(3)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridCols === 4 ? "white" : "ghost"}
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-md ${gridCols === 4 ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
                  onClick={() => setGridCols(4)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Filter Scroll */}
          <div className="mt-3 md:mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className={`rounded-full h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm font-medium transition-all flex-shrink-0 ${selectedCategory === "all" ? "shadow-md" : "border-gray-200 text-gray-600 hover:text-primary hover:border-primary/30"}`}
              onClick={() => setSelectedCategory("all")}
            >
              Semua
            </Button>
            <div className="h-5 w-px bg-gray-200 mx-1 flex-shrink-0"></div>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === String(cat.id) ? "default" : "outline"}
                size="sm"
                className={`rounded-full h-8 md:h-9 px-3 md:px-4 text-xs md:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === String(cat.id) ? "shadow-md" : "border-gray-200 text-gray-600 hover:text-primary hover:border-primary/30"}`}
                onClick={() => setSelectedCategory(String(cat.id))}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Loading indicator when switching categories */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {/* Product Grid */}
        {!loading && filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {searchQuery
                ? `Maaf, kami tidak dapat menemukan produk yang sesuai dengan pencarian "${searchQuery}"`
                : "Belum ada produk dalam kategori ini"
              }
            </p>
            <Button
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="rounded-full px-8"
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-3 sm:gap-4 md:gap-6 pb-24`}>
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}