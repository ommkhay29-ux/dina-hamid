# Undangan Pernikahan — Dina & Hamid

Website undangan pernikahan digital, satu halaman (single-page), dibuat dengan
HTML/CSS/JS murni — tidak perlu build tool, tinggal buka di browser atau
jalankan lewat Live Server di VS Code.

## Struktur folder

```
undangan-dina-hamid/
├── index.html                 ← semua konten & urutan section
├── assets/
│   ├── css/style.css          ← semua styling & warna
│   ├── js/script.js           ← logika (countdown, RSVP, galeri, dst) + CONFIG
│   ├── img/                   ← foto (placeholder sudah disediakan)
│   │   ├── bg-alley.jpg       ← foto latar (dipakai berulang di banyak section)
│   │   ├── bride.jpg          ← foto mempelai wanita
│   │   ├── groom.jpg          ← foto mempelai pria
│   │   ├── couple-1.jpg       ← foto di section Wedding Gift
│   │   ├── couple-2.jpg       ← foto di section penutup
│   │   └── gallery/           ← taruh foto galeri "Our Moment" di sini
│   └── audio/
│       └── music.mp3          ← musik latar (opsional, belum disertakan)
└── README.md
```

## Cara menjalankan

1. Buka folder ini di VS Code.
2. Install extension **Live Server** (atau ekstensi sejenis), lalu klik
   "Go Live" pada `index.html`. Bisa juga dibuka langsung dengan
   klik-dua-kali `index.html` di file explorer.

## Yang perlu diganti (paling penting)

1. **Foto** — ganti semua file placeholder di `assets/img/` dengan foto asli
   (nama file & ukuran boleh sama, format jpg/png/webp semua didukung).
   Untuk galeri "Our Moment", masukkan foto ke `assets/img/gallery/` lalu
   daftarkan path-nya di `CONFIG.gallery` pada `assets/js/script.js`.
2. **Musik latar** — taruh file mp3 di `assets/audio/music.mp3`. Kalau file
   tidak ada, tombol musik otomatis nonaktif tanpa error.
3. **Video prewedding** — isi `CONFIG.youtubeId` di `assets/js/script.js`
   dengan ID video YouTube (bagian setelah `v=` di URL). Kosongkan untuk
   menampilkan placeholder saja.
4. **Nomor rekening** — edit langsung di `index.html`, bagian
   `<!-- ===== 7. Wedding Gift ... -->` (elemen `.gift-account`).
5. **Tanggal & lokasi acara** — edit `CONFIG.eventDate` dan `CONFIG.event`
   di `assets/js/script.js` (dipakai untuk hitung mundur & file .ics
   "Simpan Tanggal"), serta teks di section "Save The Date" pada
   `index.html`.
6. **Link Google Maps** — ganti URL pada tombol "Google Maps" di
   `index.html` dengan link lokasi yang sebenarnya (klik "Bagikan" di
   Google Maps untuk mendapatkan link).

## Nama tamu personal (opsional)

Bagikan link dengan parameter `?to=`, contoh:

```
https://domainkamu.com/index.html?to=Bapak+Budi
```

Nama tamu akan otomatis muncul di halaman sampul.

## Fitur yang sudah jadi

- Halaman sampul dengan tombol "Buka Undangan" (gate) + nama tamu personal
- Ayat Al-Quran, profil mempelai, cerita perjalanan cinta (4 babak)
- Hitung mundur (countdown) otomatis ke tanggal akad
- Tombol "Simpan Tanggal" → unduh file `.ics` untuk kalender
- Detail Akad & Resepsi + tombol Google Maps
- Galeri foto + slot video (klik untuk memutar video YouTube)
- Form RSVP & Ucapan — tersimpan di `localStorage` browser tamu, dengan
  daftar ucapan berhalaman (pagination) seperti pada rancangan
- Wedding Gift / E-Amplop dengan tombol salin nomor rekening
- Musik latar opsional dengan tombol on/off mengambang
- Animasi *reveal-on-scroll* halus, garis progres baca di bagian atas
- Sudah rapi untuk mobile (didesain mobile-first, mengikuti rancangan asli)

## Catatan

RSVP & ucapan disimpan di `localStorage`, artinya **hanya tersimpan di
browser tamu masing-masing** — bukan dikirim ke server / kamu. Kalau ingin
ucapan tamu benar-benar terkumpul di satu tempat (misalnya untuk dilihat
semua orang), form perlu dihubungkan ke backend/API atau layanan pihak
ketiga (Google Sheets via Apps Script, Firebase, dsb). Beri tahu saya kalau
mau dibantu menyambungkannya.
