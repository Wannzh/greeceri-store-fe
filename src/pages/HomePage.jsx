import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Leaf, ShieldCheck, ArrowRight, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import ProductCard from "@/features/product/components/ProductCard";
import { categoryService } from "@/services/categoryService";

// --- HERO SECTION ---
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-green-50/80 to-white pt-20 pb-24 lg:pt-32 lg:pb-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center rounded-full bg-green-100/80 px-4 py-1.5 text-sm font-semibold text-green-800 ring-1 ring-green-600/20">
              <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
              Segar Langsung dari Petani
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl leading-[1.1]">
              Sayur Segar, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
                Hidup Lebih Sehat
              </span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-lg text-lg text-gray-600 leading-relaxed">
              Nikmati kualitas hasil panen terbaik yang diantar langsung ke depan pintu rumah Anda. Hemat waktu, hemat biaya, dan pastinya lebih segar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-green-900/20 transition-transform hover:scale-105">
                <Link to="/products">
                  Mulai Belanja <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200">
                <Link to="/about">Tentang Kami</Link>
              </Button>
            </div>
            
            <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-green-100 text-green-700"><Leaf size={14} /></div> 100% Organik
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-green-100 text-green-700"><Truck size={14} /></div> Kirim Hari Ini
                </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none lg:ml-auto perspective-1000">
            <div className="relative rounded-[2.5rem] bg-gradient-to-tr from-green-100 to-emerald-50 p-3 shadow-2xl ring-1 ring-black/5 rotate-2 hover:rotate-0 transition-all duration-700 ease-out">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                alt="Sayuran Segar"
                className="rounded-[2rem] object-cover w-full h-[400px] md:h-[500px] shadow-inner"
              />
            </div>
            
            {/* Dekorasi Floating Card */}
            <div className="absolute -bottom-8 -left-8 md:bottom-12 md:-left-12 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                    <Star className="fill-yellow-500 text-yellow-500 h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">4.9/5</p>
                  <p className="text-sm text-gray-500 font-medium">Kepuasan Pelanggan</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// --- FEATURE SECTION ---
function FeatureSection() {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-white" />,
      title: "100% Organik",
      desc: "Tanpa pestisida berbahaya, dipetik langsung dari kebun mitra terpercaya.",
      color: "bg-emerald-500",
    },
    {
      icon: <Truck className="h-8 w-8 text-white" />,
      title: "Pengiriman Cepat",
      desc: "Pesan sebelum jam 12 siang, kami antar di hari yang sama dengan armada pendingin.",
      color: "bg-blue-500",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-white" />,
      title: "Jaminan Mutu",
      desc: "Garansi uang kembali jika produk yang Anda terima tidak segar atau rusak.",
      color: "bg-orange-500",
    },
  ];

  return (
    <section className="container mx-auto px-4 md:px-6 py-24">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
          Kenapa Harus Greeceri?
        </h2>
        <p className="text-lg text-gray-500">
          Komitmen kami untuk kesehatan keluarga Anda dimulai dari pemilihan produk terbaik.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-200/50"
          >
            <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${f.color} shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
              {f.icon}
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">{f.title}</h3>
            <p className="text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- SHOP BY CATEGORY SECTION ---
function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default category images
  const categoryImages = {
    "Sayuran": "https://plus.unsplash.com/premium_photo-1675798983878-604c09f6d154?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Buah-buahan": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=400&auto=format&fit=crop",
    "Daging & Protein": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop",
    "Ikan & Seafood": "https://images.unsplash.com/photo-1670014543655-8fcaea9105ac?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Bumbu Dapur": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop",
    "Paket Masak": "https://images.unsplash.com/photo-1634114042751-527be6421f41?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "default": "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Gagal memuat kategori", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryImage = (name) => {
    return categoryImages[name] || categoryImages["default"];
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 md:px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex items-end justify-between mb-10">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Kategori Pilihan</h2>
            <p className="mt-2 text-gray-500">Temukan apa yang dapur Anda butuhkan hari ini</p>
        </div>
        <Link to="/products" className="hidden md:flex items-center text-primary font-semibold hover:underline">
            Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={getCategoryImage(cat.name)}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <h3 className="font-bold text-lg leading-tight mb-1">{cat.name}</h3>
              <p className="text-xs text-white/80 font-medium bg-white/20 inline-block px-2 py-1 rounded-full backdrop-blur-sm">
                {cat.productCount || 0} Produk
              </p>
            </div>
          </Link>
        ))}
      </div>
       <div className="mt-6 text-center md:hidden">
         <Link to="/products" className="inline-flex items-center text-primary font-semibold">
            Lihat Semua Kategori <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
       </div>
    </section>
  );
}

// --- FEATURED PRODUCTS ---
function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/products");
        if (res.data.success) {
          setProducts(res.data.data.slice(0, 4));
        }
      } catch (err) {
        console.error("Gagal memuat produk unggulan", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="bg-gray-50/50 py-24 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Produk Terlaris Minggu Ini</h2>
            <p className="mt-2 text-gray-500 max-w-xl">
                Jangan sampai kehabisan stok favorit pelanggan kami. Kualitas terbaik dengan harga spesial.
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="rounded-full border-gray-300 hover:border-primary hover:text-primary">
                Lihat Katalog Lengkap
            </Button>
          </Link>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {loading
            ? [...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4 rounded-3xl bg-white p-4 shadow-sm">
                <div className="aspect-square w-full animate-pulse rounded-2xl bg-gray-100" />
                <div className="space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Belum ada produk unggulan saat ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// --- CTA (CALL TO ACTION) ---
function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-primary">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-green-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 md:px-6 text-center text-white space-y-8 max-w-4xl">
        <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight leading-tight">
          {isAuthenticated ? "Jangan Biarkan Kulkas Kosong!" : "Mulai Gaya Hidup Sehat Hari Ini"}
        </h2>
        <p className="mx-auto max-w-2xl text-xl text-green-50 opacity-90 leading-relaxed font-light">
          {isAuthenticated
            ? "Pesan sekarang sebelum jam 14.00 untuk pengiriman hari yang sama. Gratis ongkir untuk pesanan di atas Rp 100rb."
            : "Bergabung dengan ribuan keluarga cerdas yang memilih bahan makanan segar berkualitas tanpa repot keluar rumah."
          }
        </p>

        <div className="pt-6">
          {isAuthenticated ? (
            <Button asChild size="lg" variant="secondary" className="h-16 px-10 text-lg font-bold text-primary rounded-full shadow-2xl shadow-green-900/50 hover:bg-white hover:scale-105 transition-all">
              <Link to="/products">Belanja Sekarang</Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="secondary" className="h-16 px-10 text-lg font-bold text-primary rounded-full shadow-2xl shadow-green-900/50 hover:bg-white hover:scale-105 transition-all">
              <Link to="/register">Daftar Akun Gratis</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <HeroSection />
      <FeatureSection />
      <CategorySection />
      <FeaturedProducts />
      <CTASection />
    </div>
  );
}