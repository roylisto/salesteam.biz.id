# Salesteam landing page

Landing page Bahasa Indonesia untuk distribution management system Salesteam. HTML, CSS, JavaScript murni; tanpa framework atau proses build. Three.js v0.170.0 disimpan lokal di `assets/vendor/` beserta lisensi MIT.

Buka index.html di browser atau jalankan `python -m http.server 8080` dari direktori ini. Hosting statis dapat menggunakan direktori root secara langsung.

Fitur: layout responsif, diagram alur animasi, ilustrasi rute SVG, tab sales yang mendukung keyboard, menu mobile, dukungan prefers-reduced-motion, dan kontak email.

Tampilan serta rute adalah ilustrasi arah pengembangan, bukan data operasional atau janji fitur yang telah dirilis.

Visual rute 3D menggunakan Three.js dengan fallback SVG ketika WebGL tidak tersedia. Animasi berhenti saat bagian tidak terlihat atau tab tidak aktif, dan mengikuti prefers-reduced-motion. Jalankan melalui HTTP agar modul JavaScript dapat dimuat.

Hero menambahkan orbit jaringan, partikel, dan penanda bergerak menggunakan `hero.js` (Three.js yang sama). Efek kursor hanya aktif untuk mouse; mobile memakai partikel lebih sedikit dan batas render 30 fps. Scene berhenti ketika hero di luar layar, tab tersembunyi, atau reduced motion aktif. Ilustrasi tetap tampil bila WebGL gagal.

Peta wilayah menggunakan diorama jalan 3D: gudang, empat toko, rumah, gedung, pohon, dan truk logistik. Truk mengikuti jalan, berhenti untuk menurunkan paket, menandai toko selesai, lalu kembali ke gudang. Tombol replay mengulang pengiriman. Tiga ikon manfaat memakai SVG agar ukurannya konsisten.

Identitas brand menggabungkan ikon rute berbentuk S dan dua titik tim dengan wordmark “salesteam”. Ikon transparan hasil generasi disimpan di `assets/salesteam-icon.png` dan digunakan juga sebagai favicon serta apple-touch-icon. Wordmark dirender sebagai teks agar tetap tajam.
