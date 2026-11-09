# Salesteam landing page

Landing page Bahasa Indonesia untuk distribution management system Salesteam. HTML, CSS, JavaScript murni; tanpa framework atau proses build. Three.js v0.170.0 disimpan lokal di `assets/vendor/` beserta lisensi MIT.

Buka index.html di browser atau jalankan `python -m http.server 8080` dari direktori ini. Hosting statis dapat menggunakan direktori root secara langsung.

Fitur: layout responsif, diagram alur animasi, ilustrasi rute SVG, tab sales yang mendukung keyboard, menu mobile, dukungan prefers-reduced-motion, dan kontak email.

Tampilan serta rute adalah ilustrasi arah pengembangan, bukan data operasional atau janji fitur yang telah dirilis.

Visual rute 3D menggunakan Three.js dengan fallback SVG ketika WebGL tidak tersedia. Animasi berhenti saat bagian tidak terlihat atau tab tidak aktif, dan mengikuti prefers-reduced-motion. Jalankan melalui HTTP agar modul JavaScript dapat dimuat.
