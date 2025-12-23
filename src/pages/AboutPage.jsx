import { Leaf, Truck, ShieldCheck, Users, Heart, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-600 to-green-700 text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-green-900/20 rounded-full blur-3xl"></div>

                <div className="container relative mx-auto px-4 md:px-6 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                        Tentang Greeceri
                    </h1>
                    <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed">
                        Menyediakan bahan makanan segar berkualitas untuk keluarga Indonesia,
                        langsung dari petani lokal ke meja makan Anda.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Cerita Kami
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Greeceri didirikan dengan visi sederhana: memudahkan keluarga Indonesia
                                mendapatkan sayuran dan bahan makanan segar tanpa harus repot ke pasar.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Kami bermitra langsung dengan petani lokal di sekitar Bandung untuk
                                memastikan setiap produk yang sampai ke tangan Anda adalah yang terbaik
                                dan paling segar. Dari kebun ke dapur Anda dalam hitungan jam.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Dengan layanan pengiriman cepat, kami berkomitmen mengantarkan
                                pesanan Anda di hari yang sama untuk area Dakota dan sekitarnya
                                dalam radius 5 km.
                            </p>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1000&auto=format&fit=crop"
                                alt="Petani lokal"
                                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                                <p className="text-3xl font-bold text-primary">100%</p>
                                <p className="text-sm text-gray-600 font-medium">Produk Lokal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Nilai-Nilai Kami
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Prinsip yang kami pegang dalam melayani pelanggan
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
                            <div className="h-14 w-14 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                                <Leaf className="h-7 w-7 text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Kesegaran</h3>
                            <p className="text-sm text-gray-600">
                                Produk dipetik dan dikirim di hari yang sama untuk kesegaran maksimal
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
                            <div className="h-14 w-14 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Kualitas</h3>
                            <p className="text-sm text-gray-600">
                                Setiap produk melewati seleksi ketat untuk memastikan kualitas terbaik
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
                            <div className="h-14 w-14 mx-auto mb-4 bg-orange-100 rounded-2xl flex items-center justify-center">
                                <Truck className="h-7 w-7 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Kecepatan</h3>
                            <p className="text-sm text-gray-600">
                                Pengiriman cepat di hari yang sama untuk pesanan sebelum jam 2 siang
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors">
                            <div className="h-14 w-14 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                                <Heart className="h-7 w-7 text-red-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Kepedulian</h3>
                            <p className="text-sm text-gray-600">
                                Mendukung petani lokal dan praktik pertanian berkelanjutan
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Didukung oleh Tim Hebat
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Tim kecil dengan dedikasi besar untuk melayani Anda
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="h-32 w-32 mx-auto mb-4 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                <Users className="h-12 w-12" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Tim Operasional</h3>
                            <p className="text-sm text-gray-600">
                                Memastikan setiap pesanan dikemas dengan sempurna
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="h-32 w-32 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                <Truck className="h-12 w-12" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Tim Pengiriman</h3>
                            <p className="text-sm text-gray-600">
                                Mengantarkan pesanan tepat waktu ke rumah Anda
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="h-32 w-32 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                <Phone className="h-12 w-12" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Tim Customer Service</h3>
                            <p className="text-sm text-gray-600">
                                Siap membantu Anda setiap saat
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Lokasi Kami
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Alamat</h4>
                                        <p className="text-gray-600">
                                            Jl. Dakota No. 8A<br />
                                            Bandung, Indonesia 40175
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Telepon</h4>
                                        <p className="text-gray-600">+62 812-3456-7890</p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-6 text-gray-600">
                                <strong>Area Pengiriman:</strong> Dakota dan sekitarnya dalam radius 5 km
                            </p>
                        </div>
                        <div className="rounded-3xl overflow-hidden shadow-xl h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.9663735696063!2d107.56889177630907!3d-6.894625667472398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e5ebd97d2b3f%3A0x897b4aaa652028b6!2sUniversitas%20Nasional%20PASIM%20Bandung!5e0!3m2!1sid!2sid!4v1766486632981!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Greeceri"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-green-600 text-white">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Mulai Belanja Sekarang
                    </h2>
                    <p className="text-lg text-green-50 max-w-2xl mx-auto mb-8">
                        Nikmati kemudahan berbelanja sayuran segar dari rumah.
                        Pesan sekarang dan rasakan perbedaannya!
                    </p>
                    <Link to="/products">
                        <Button size="lg" variant="secondary" className="rounded-full px-10 h-14 text-lg font-bold text-primary hover:bg-white">
                            Lihat Produk
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
