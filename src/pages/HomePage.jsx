import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, Leaf, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios"; // Gunakan axios instance kita
import ProductCard from "@/features/product/components/ProductCard";

// --- HERO SECTION ---
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-green-50 pt-16 pb-20 lg:pt-32 lg:pb-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2"></span>
              Segar Langsung dari Petani
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Belanja Sayur Segar <br /> 
              <span className="text-primary">Lebih Cepat & Hemat</span>
            </h1>
            
            <p className="mx-auto lg:mx-0 max-w-lg text-lg text-gray-600">
              Greeceri Store menghubungkan Anda langsung dengan hasil panen terbaik. 
              Kualitas terjamin, harga bersahabat, diantar sampai depan rumah.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-lg shadow-lg shadow-green-200">
                <Link to="/products">
                  Mulai Belanja <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg">
                <Link to="/about">Tentang Kami</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div className="relative rounded-2xl bg-gradient-to-tr from-green-200 to-emerald-100 p-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop" 
                 alt="Sayuran Segar" 
                 className="rounded-xl object-cover w-full h-[300px] md:h-[400px] shadow-sm"
               />
            </div>
            {/* Dekorasi floating */}
            <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-2 rounded-lg bg-white p-4 shadow-lg animate-bounce">
                <Star className="text-yellow-400 fill-yellow-400 h-6 w-6" />
                <div>
                    <p className="text-sm font-bold">4.9/5 Rating</p>
                    <p className="text-xs text-gray-500">Dari 10k+ Pelanggan</p>
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
      icon: <Leaf className="h-10 w-10 text-primary" />,
      title: "100% Organik & Segar",
      desc: "Dipetik pagi hari, dikirim hari yang sama untuk menjaga nutrisi.",
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Pengiriman Kilat",
      desc: "Layanan antar cepat ke seluruh area kota dengan armada pendingin.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: "Garansi Kualitas",
      desc: "Tidak puas dengan produk? Kami ganti baru atau uang kembali.",
    },
  ];

  return (
    <section className="container mx-auto px-4 md:px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">Kenapa Memilih Greeceri?</h2>
        <p className="mt-4 text-lg text-gray-500">Kami berkomitmen memberikan yang terbaik untuk dapur Anda.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 group-hover:bg-primary/10 transition-colors">
              {f.icon}
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">{f.title}</h3>
            <p className="text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
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
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-4 md:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Produk Terlaris</h2>
            <p className="mt-2 text-gray-500">Pilihan favorit pelanggan minggu ini.</p>
          </div>
          <Link to="/products" className="text-primary font-semibold hover:underline inline-flex items-center">
            Lihat Semua Produk <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading
            ? // Skeleton Loading
              [...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
                  <div className="h-40 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                </div>
              ))
            :
              products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        
        {!loading && products.length === 0 && (
            <p className="text-center text-gray-500 py-10">Belum ada produk unggulan.</p>
        )}
      </div>
    </section>
  );
}

// --- CTA (CALL TO ACTION) ---
function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-primary/90">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      </div>

      <div className="container relative mx-auto px-4 md:px-6 text-center text-white space-y-6">
        <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            {isAuthenticated ? "Stok Dapur Mulai Menipis?" : "Siap Hidup Lebih Sehat?"}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-green-50 opacity-90">
            {isAuthenticated 
                ? "Jangan tunggu sampai habis. Pesan sekarang, kami antar besok pagi!"
                : "Bergabunglah dengan ribuan pelanggan yang telah beralih ke gaya hidup sehat bersama Greeceri."
            }
        </p>

        <div className="pt-4">
            {isAuthenticated ? (
                 <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold text-primary">
                    <Link to="/products">Belanja Sekarang</Link>
                 </Button>
            ) : (
                <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold text-primary">
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
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <FeatureSection />
      <FeaturedProducts />
      <CTASection />
    </div>
  );
}