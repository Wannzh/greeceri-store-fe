# Greeceri Store - Frontend

<div align="center">
  <img src="https://res.cloudinary.com/dimtuwrap/image/upload/v1762286348/Greeceri_Logo_oroccn.jpg" alt="Greeceri Logo" width="120" />
  <h3>🥬 Toko Sayuran Segar Online</h3>
  <p>Platform e-commerce untuk pembelian sayuran dan bahan makanan segar di area Bandung</p>
</div>

---

## 📖 Deskripsi

**Greeceri Store** adalah aplikasi web e-commerce yang menyediakan layanan pembelian sayuran dan bahan makanan segar secara online. Aplikasi ini dibangun menggunakan React + Vite dengan integrasi pembayaran Xendit untuk memudahkan transaksi.

Aplikasi ini terdiri dari:
- **User Panel**: Untuk pelanggan berbelanja, mengelola keranjang, checkout, dan melihat riwayat pesanan
- **Admin Panel**: Untuk admin mengelola produk, kategori, pesanan, dan pengguna

---

## ✨ Fitur-Fitur

### 🛒 Fitur User
| Fitur | Deskripsi |
|-------|-----------|
| **Autentikasi** | Login, Register, Google OAuth, Forgot Password |
| **Produk** | Lihat katalog, search, filter by kategori, pagination |
| **Keranjang** | Tambah, update quantity, hapus item |
| **Wishlist** | Simpan produk favorit |
| **Checkout** | Pilih alamat, integrasi pembayaran Xendit |
| **Pesanan** | Riwayat pesanan, detail, konfirmasi penerimaan, batalkan pesanan |
| **Profil** | Edit profil, ubah password, kelola alamat |
| **Tentang Kami** | Halaman informasi toko dengan peta lokasi |

### 👨‍💼 Fitur Admin
| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard** | Statistik pesanan, pendapatan, chart, produk terlaris |
| **Manajemen Produk** | CRUD produk dengan upload gambar ke Cloudinary |
| **Manajemen Kategori** | CRUD kategori produk |
| **Manajemen Pesanan** | Update status, export CSV/Excel |
| **Manajemen User** | Lihat daftar pengguna, detail user |

---

## 🛠️ Tech Stack

| Teknologi | Versi |
|-----------|-------|
| React | 19.x |
| Vite | 7.x |
| React Router DOM | 7.x |
| Axios | 1.x |
| TailwindCSS | 4.x |
| Radix UI | Latest |
| Lucide React | Icons |
| Recharts | Charts |
| React Hot Toast | Notifications |

---

## 🚀 Instalasi & Menjalankan

### Prasyarat
- Node.js v18+ 
- PNPM (Package Manager)
- Backend API sudah berjalan

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/Wannzh/greeceri-store-fe.git
   cd greeceri-store-fe
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Buat file `.env`**
   ```bash
   cp .env.example .env
   ```

4. **Konfigurasi environment variables** (lihat bagian Environment Variables di bawah)

5. **Jalankan development server**
   ```bash
   pnpm dev
   ```

6. **Build untuk production**
   ```bash
   pnpm build
   ```

---

## 🔐 Environment Variables

Buat file `.env` di root project dengan variabel berikut:

```env
# Backend API URL
VITE_API_URL=http://localhost:8080/api

# Google OAuth Client ID (untuk login dengan Google)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Penjelasan Variables

| Variable | Wajib | Deskripsi |
|----------|-------|-----------|
| `VITE_API_URL` | ✅ | URL backend API. Contoh: `http://localhost:8080/api` |
| `VITE_GOOGLE_CLIENT_ID` | ❌ | Client ID dari Google Cloud Console untuk fitur Google Login. Jika tidak diisi, tombol Google Login tidak akan muncul. |

### Cara Mendapatkan Google Client ID
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Pergi ke **APIs & Services** > **Credentials**
4. Klik **Create Credentials** > **OAuth 2.0 Client IDs**
5. Pilih **Web application**
6. Tambahkan `http://localhost:5173` ke **Authorized JavaScript origins**
7. Copy **Client ID** yang dihasilkan

---

## 📁 Struktur Folder

```
src/
├── assets/          # Asset statis (gambar, dll)
├── components/      # Komponen reusable
│   ├── common/      # Komponen umum (Loader, dll)
│   ├── layout/      # Layout components (Navbar, Footer, Sidebar)
│   └── ui/          # UI primitives (Button, Input, dll)
├── context/         # React Context (Auth, Cart)
├── features/        # Feature-based modules
│   ├── admin/       # Admin panel pages
│   ├── auth/        # Login, Register
│   ├── cart/        # Keranjang belanja
│   ├── checkout/    # Checkout & Payment
│   ├── orders/      # Riwayat pesanan
│   ├── product/     # Produk listing & detail
│   ├── user/        # Profil & Alamat
│   └── wishlist/    # Wishlist
├── lib/             # Utilities (axios, helpers)
├── pages/           # Public pages (Home, About, NotFound)
├── router/          # Route definitions
├── services/        # API services
├── App.jsx          # Main App component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

---

## 📝 Scripts

| Command | Deskripsi |
|---------|-----------|
| `pnpm dev` | Jalankan development server |
| `pnpm build` | Build untuk production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Jalankan ESLint |

---

## 📄 License

© 2024 Greeceri Store. All rights reserved.
