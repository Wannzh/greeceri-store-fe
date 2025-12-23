# Greeceri Store - Complete Application Flowchart

Flowchart lengkap aplikasi Greeceri Store yang bisa langsung di-copy ke Mermaid.

---

## 🔄 Main Application Flow

```mermaid
flowchart TD
    START([START]) --> OPEN[User Membuka Aplikasi]
    OPEN --> AUTH_CHECK{Sudah Login?}

    AUTH_CHECK -->|Ya| ROLE_CHECK{Role User?}
    AUTH_CHECK -->|Tidak| GUEST[Guest Mode]

    ROLE_CHECK -->|USER| USER_HOME[User Home Page]
    ROLE_CHECK -->|ADMIN| ADMIN_DASH[Admin Dashboard]

    GUEST --> PUBLIC[Akses Halaman Publik]
    PUBLIC --> BROWSE[Browse Produk]
    PUBLIC --> ABOUT[Halaman About]

    BROWSE --> NEED_LOGIN{Perlu Login?}
    NEED_LOGIN -->|Ya| AUTH_A((A))
    NEED_LOGIN -->|Tidak| BROWSE

    USER_HOME --> USER_A((A))
    ADMIN_DASH --> ADMIN_B((B))

    AUTH_A --> END_MAIN([END - Lanjut ke Auth Flow])
    USER_A --> END_USER([END - Lanjut ke User Flow])
    ADMIN_B --> END_ADMIN([END - Lanjut ke Admin Flow])
```

---

## 🔐 A - Authentication Flow

```mermaid
flowchart TD
    AUTH_START((A)) --> AUTH_PAGE{Pilih Opsi}

    AUTH_PAGE -->|Login| LOGIN[Halaman Login]
    AUTH_PAGE -->|Register| REGISTER[Halaman Register]
    AUTH_PAGE -->|Lupa Password| FORGOT[Halaman Lupa Password]

    %% Login Flow
    LOGIN --> LOGIN_METHOD{Metode Login}
    LOGIN_METHOD -->|Email dan Password| LOGIN_FORM[Isi Form Login]
    LOGIN_METHOD -->|Google OAuth| GOOGLE[Login dengan Google]

    LOGIN_FORM --> LOGIN_SUBMIT[Submit]
    LOGIN_SUBMIT --> LOGIN_API["API: POST /auth/login"]
    LOGIN_API --> LOGIN_CHECK{Berhasil?}

    LOGIN_CHECK -->|Ya| SAVE_TOKEN[Simpan Token]
    LOGIN_CHECK -->|Tidak| LOGIN_ERROR[Tampilkan Error]
    LOGIN_ERROR --> LOGIN

    GOOGLE --> GOOGLE_API["API: POST /auth/google"]
    GOOGLE_API --> LOGIN_CHECK

    SAVE_TOKEN --> REDIRECT_ROLE{Role?}
    REDIRECT_ROLE -->|USER| TO_USER((A2))
    REDIRECT_ROLE -->|ADMIN| TO_ADMIN((B))

    %% Register Flow
    REGISTER --> REG_FORM[Isi Form Registrasi]
    REG_FORM --> REG_VALIDATE{Validasi Form}
    REG_VALIDATE -->|Valid| REG_SUBMIT[Submit]
    REG_VALIDATE -->|Invalid| REG_FORM

    REG_SUBMIT --> REG_API["API: POST /auth/register"]
    REG_API --> REG_CHECK{Berhasil?}
    REG_CHECK -->|Ya| EMAIL_SENT[Email Verifikasi Dikirim]
    REG_CHECK -->|Tidak| REG_ERROR[Tampilkan Error]
    REG_ERROR --> REGISTER

    EMAIL_SENT --> WAIT_VERIFY[User Cek Email]
    WAIT_VERIFY --> CLICK_LINK[Klik Link Verifikasi]
    CLICK_LINK --> VERIFY_CHECK{Verifikasi Berhasil?}
    VERIFY_CHECK -->|Ya| VERIFY_SUCCESS[Halaman Sukses]
    VERIFY_CHECK -->|Tidak| VERIFY_FAIL[Halaman Gagal]
    VERIFY_SUCCESS --> LOGIN
    VERIFY_FAIL --> REGISTER

    %% Forgot Password Flow
    FORGOT --> FORGOT_FORM[Masukkan Email]
    FORGOT_FORM --> FORGOT_API["API: POST /auth/forgot-password"]
    FORGOT_API --> RESET_EMAIL[Email Reset Dikirim]
    RESET_EMAIL --> CLICK_RESET[Klik Link Reset]
    CLICK_RESET --> RESET_PAGE[Halaman Reset Password]
    RESET_PAGE --> NEW_PASS[Masukkan Password Baru]
    NEW_PASS --> RESET_API["API: POST /auth/reset-password"]
    RESET_API --> LOGIN

    TO_USER --> END_AUTH([END - Lanjut ke User Flow])
    TO_ADMIN --> END_AUTH_ADMIN([END - Lanjut ke Admin Flow])
```

---

## 👤 A2 - User Shopping Flow

```mermaid
flowchart TD
    USER_START((A2)) --> USER_HOME[User Home Page]

    USER_HOME --> USER_ACTION{Pilih Aksi}

    USER_ACTION -->|Browse Produk| PRODUCTS[Halaman Produk]
    USER_ACTION -->|Lihat Keranjang| CART[Halaman Keranjang]
    USER_ACTION -->|Lihat Pesanan| ORDERS[Halaman Pesanan]
    USER_ACTION -->|Lihat Wishlist| WISHLIST[Halaman Wishlist]
    USER_ACTION -->|Edit Profil| PROFILE[Halaman Profil]

    %% Product Browsing
    PRODUCTS --> FILTER{Filter atau Search}
    FILTER --> PRODUCT_LIST[Daftar Produk]
    PRODUCT_LIST --> SELECT_PRODUCT[Pilih Produk]
    SELECT_PRODUCT --> PRODUCT_DETAIL[Detail Produk]

    PRODUCT_DETAIL --> PROD_ACTION{Aksi?}
    PROD_ACTION -->|Tambah ke Keranjang| ADD_CART["API: POST /cart/item"]
    PROD_ACTION -->|Tambah ke Wishlist| ADD_WISH["API: POST /wishlist"]
    PROD_ACTION -->|Kembali| PRODUCTS

    ADD_CART --> CART_UPDATED[Keranjang Terupdate]
    ADD_WISH --> WISH_UPDATED[Wishlist Terupdate]
    CART_UPDATED --> CONTINUE{Lanjut?}
    WISH_UPDATED --> CONTINUE

    CONTINUE -->|Lanjut Belanja| PRODUCTS
    CONTINUE -->|Checkout| CART

    %% Cart Flow
    CART --> CART_C((C))

    %% Orders Flow
    ORDERS --> ORDERS_D((D))

    %% Profile Flow
    PROFILE --> PROFILE_E((E))

    CART_C --> END_CART([END - Lanjut ke Cart Flow])
    ORDERS_D --> END_ORDERS([END - Lanjut ke Order Flow])
    PROFILE_E --> END_PROFILE([END - Lanjut ke Profile Flow])
```

---

## 🛒 C - Cart dan Checkout Flow

```mermaid
flowchart TD
    CART_START((C)) --> CART_PAGE[Halaman Keranjang]

    CART_PAGE --> CART_CHECK{Keranjang Kosong?}
    CART_CHECK -->|Ya| EMPTY[Tampilkan Kosong]
    CART_CHECK -->|Tidak| CART_LIST[Daftar Item]

    EMPTY --> BACK_SHOP[Kembali Belanja]
    BACK_SHOP --> END_EMPTY([END])

    CART_LIST --> SELECT_ITEMS[Pilih Item untuk Checkout]
    SELECT_ITEMS --> CART_ACTION{Aksi?}

    CART_ACTION -->|Update Qty| UPDATE_QTY["API: PUT /cart/item"]
    CART_ACTION -->|Hapus Item| DELETE_ITEM["API: DELETE /cart/item"]
    CART_ACTION -->|Checkout| CHECKOUT[Halaman Checkout]

    UPDATE_QTY --> CART_LIST
    DELETE_ITEM --> CART_LIST

    %% Checkout Flow
    CHECKOUT --> SELECT_ADDR{Pilih Alamat}
    SELECT_ADDR -->|Ada Alamat| CHOOSE_ADDR[Pilih Alamat]
    SELECT_ADDR -->|Tidak Ada| ADD_ADDR[Tambah Alamat Baru]
    ADD_ADDR --> CHOOSE_ADDR

    CHOOSE_ADDR --> REVIEW[Review Pesanan]
    REVIEW --> CONFIRM[Konfirmasi Checkout]
    CONFIRM --> ORDER_API["API: POST /orders/checkout"]

    ORDER_API --> ORDER_RESULT{Berhasil?}
    ORDER_RESULT -->|Ya| PAYMENT[Redirect ke Xendit]
    ORDER_RESULT -->|Tidak| CHECKOUT_ERR[Tampilkan Error]
    CHECKOUT_ERR --> CHECKOUT

    %% Payment Flow
    PAYMENT --> PAY_ACTION[User Melakukan Pembayaran]
    PAY_ACTION --> PAY_RESULT{Hasil Pembayaran}

    PAY_RESULT -->|Sukses| PAY_SUCCESS[Halaman Payment Success]
    PAY_RESULT -->|Gagal| PAY_FAIL[Halaman Payment Failed]

    PAY_SUCCESS --> ORDER_DETAIL[Lihat Detail Pesanan]
    PAY_FAIL --> PAY_OPTION{Opsi?}
    PAY_OPTION -->|Bayar Ulang| PAYMENT
    PAY_OPTION -->|Kembali| CART_PAGE

    ORDER_DETAIL --> END_CHECKOUT([END])
```

---

## 📦 D - Order Management Flow

```mermaid
flowchart TD
    ORDER_START((D)) --> ORDER_LIST[Halaman Riwayat Pesanan]

    ORDER_LIST --> ORDER_FILTER{Filter Status}
    ORDER_FILTER --> FILTERED_LIST[Daftar Pesanan]

    FILTERED_LIST --> SELECT_ORDER[Pilih Pesanan]
    SELECT_ORDER --> ORDER_DETAIL[Detail Pesanan]

    ORDER_DETAIL --> ORDER_STATUS{Status Pesanan?}

    ORDER_STATUS -->|PENDING PAYMENT| PENDING_ACT{Aksi?}
    PENDING_ACT -->|Bayar| PAY_NOW[Redirect ke Payment]
    PENDING_ACT -->|Batalkan| CANCEL_ORDER["API: PUT /orders/cancel"]

    ORDER_STATUS -->|PROCESSING| WAIT_SHIP[Menunggu Pengiriman]
    ORDER_STATUS -->|SHIPPED| SHIPPED_ACT{Aksi?}
    SHIPPED_ACT -->|Konfirmasi Terima| CONFIRM_RECV["API: PUT /orders/confirm-delivery"]

    ORDER_STATUS -->|DELIVERED| COMPLETED[Pesanan Selesai]
    ORDER_STATUS -->|CANCELLED| CANCELLED[Pesanan Dibatalkan]

    PAY_NOW --> PAYMENT_C((C))
    CANCEL_ORDER --> ORDER_LIST
    CONFIRM_RECV --> COMPLETED

    COMPLETED --> END_ORDER([END])
    CANCELLED --> END_ORDER
    PAYMENT_C --> END_PAY([END - Ke Payment Flow])
```

---

## 👤 E - Profile Management Flow

```mermaid
flowchart TD
    PROFILE_START((E)) --> PROFILE_PAGE[Halaman Profil]

    PROFILE_PAGE --> PROFILE_ACTION{Pilih Aksi}

    PROFILE_ACTION -->|Edit Profil| EDIT_PROFILE[Form Edit Profil]
    PROFILE_ACTION -->|Ubah Password| CHANGE_PASS[Form Ubah Password]
    PROFILE_ACTION -->|Kelola Alamat| ADDRESS_LIST[Daftar Alamat]
    PROFILE_ACTION -->|Logout| LOGOUT[Logout]

    %% Edit Profile
    EDIT_PROFILE --> EDIT_FORM[Isi Form]
    EDIT_FORM --> SAVE_PROFILE["API: PUT /user/profile"]
    SAVE_PROFILE --> PROFILE_PAGE

    %% Change Password
    CHANGE_PASS --> PASS_FORM[Isi Password Lama dan Baru]
    PASS_FORM --> SAVE_PASS["API: PUT /user/password"]
    SAVE_PASS --> PROFILE_PAGE

    %% Address Management
    ADDRESS_LIST --> ADDR_ACTION{Aksi?}
    ADDR_ACTION -->|Tambah| ADD_ADDRESS[Form Alamat Baru]
    ADDR_ACTION -->|Edit| EDIT_ADDRESS[Form Edit Alamat]
    ADDR_ACTION -->|Hapus| DELETE_ADDRESS["API: DELETE /addresses"]
    ADDR_ACTION -->|Set Utama| SET_DEFAULT["API: PUT /addresses/default"]

    ADD_ADDRESS --> SAVE_ADDR["API: POST /addresses"]
    EDIT_ADDRESS --> UPDATE_ADDR["API: PUT /addresses"]

    SAVE_ADDR --> ADDRESS_LIST
    UPDATE_ADDR --> ADDRESS_LIST
    DELETE_ADDRESS --> ADDRESS_LIST
    SET_DEFAULT --> ADDRESS_LIST

    %% Logout
    LOGOUT --> CLEAR_TOKEN[Hapus Token]
    CLEAR_TOKEN --> REDIRECT_LOGIN[Redirect ke Login]

    REDIRECT_LOGIN --> END_PROFILE([END])
```

---

## 👨‍💼 B - Admin Flow

```mermaid
flowchart TD
    ADMIN_START((B)) --> ADMIN_DASH[Admin Dashboard]

    ADMIN_DASH --> ADMIN_ACTION{Pilih Menu}

    ADMIN_ACTION -->|Dashboard| STATS[Lihat Statistik]
    ADMIN_ACTION -->|Produk| ADMIN_PROD[Kelola Produk]
    ADMIN_ACTION -->|Kategori| ADMIN_CAT[Kelola Kategori]
    ADMIN_ACTION -->|Pesanan| ADMIN_ORDER[Kelola Pesanan]
    ADMIN_ACTION -->|Users| ADMIN_USER[Kelola Users]

    %% Product Management
    ADMIN_PROD --> PROD_LIST[Daftar Produk]
    PROD_LIST --> PROD_ACT{Aksi?}
    PROD_ACT -->|Tambah| ADD_PROD[Form Produk Baru]
    PROD_ACT -->|Edit| EDIT_PROD[Form Edit Produk]
    PROD_ACT -->|Hapus| DEL_PROD["API: DELETE /admin/products"]

    ADD_PROD --> UPLOAD_IMG[Upload Gambar]
    UPLOAD_IMG --> SAVE_PROD["API: POST /admin/products"]
    EDIT_PROD --> UPDATE_PROD["API: PUT /admin/products"]

    SAVE_PROD --> PROD_LIST
    UPDATE_PROD --> PROD_LIST
    DEL_PROD --> PROD_LIST

    %% Category Management
    ADMIN_CAT --> CAT_LIST[Daftar Kategori]
    CAT_LIST --> CAT_ACT{Aksi?}
    CAT_ACT -->|Tambah| ADD_CAT["API: POST /admin/categories"]
    CAT_ACT -->|Edit| EDIT_CAT["API: PUT /admin/categories"]
    CAT_ACT -->|Hapus| DEL_CAT["API: DELETE /admin/categories"]

    ADD_CAT --> CAT_LIST
    EDIT_CAT --> CAT_LIST
    DEL_CAT --> CAT_LIST

    %% Order Management
    ADMIN_ORDER --> ORDER_LIST[Daftar Pesanan]
    ORDER_LIST --> ORDER_FILTER{Filter}
    ORDER_FILTER --> VIEW_ORDER[Lihat Detail]
    VIEW_ORDER --> UPDATE_STATUS{Update Status}
    UPDATE_STATUS --> STATUS_API["API: PUT /admin/orders/status"]
    STATUS_API --> ORDER_LIST

    %% User Management
    ADMIN_USER --> USER_LIST[Daftar Users]
    USER_LIST --> VIEW_USER[Lihat Detail User]

    STATS --> END_ADMIN([END])
```

---

## 📋 Legend

| Symbol         | Keterangan        |
| -------------- | ----------------- |
| `([START])`    | Titik awal        |
| `([END])`      | Titik akhir       |
| `((A))`        | On-page connector |
| `{Decision}`   | Decision/kondisi  |
| `[Process]`    | Proses/aksi       |
| `["API: ..."]` | API Call          |
