/* =========================================================
   Undangan Dina & Hamid — script.js
   Edit CONFIG below to customise content without touching
   the rest of the logic.
   ========================================================= */

   /* ---------------------------------------------------------
   Firebase setup
--------------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyBZNbkKR4n1pThJZ8pApTdnym3VFr5xjhQ",
  authDomain: "wedding-dina-hamid.firebaseapp.com",
  projectId: "wedding-dina-hamid",
  storageBucket: "wedding-dina-hamid.firebasestorage.app",
  messagingSenderId: "289649222891",
  appId: "1:289649222891:web:098baf12cdf792d8c74aae",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const wishesCollection = db.collection("wishes");
const CONFIG = {
  // Countdown target — Akad, 29 Agustus 2026, 09:00 WIT (UTC+9)
  eventDate: "2026-08-29T09:00:00+09:00",

  // .ics "Simpan Tanggal" details
  event: {
    title: "Pernikahan Dina & Hamid",
    location: "Gedung Azhari Al-Fatah, Kel. Honipopu, Sirimau, Kota Ambon",
    start: "20260829T000000Z", // Akad 09:00 WIT = 00:00 UTC
    end:   "20260829T050000Z", // Resepsi ends 14:00 WIT = 05:00 UTC
  },

  // "Our Moment" video — three ways to show it, in priority order
  // (whichever is filled in first, top to bottom, is used):
  //
  // 1) SELF-HOSTED — an .mp4 file in assets/video/. Leave empty ("") to skip.
  videoFile: "",

  // 2) GOOGLE DRIVE (recommended for your case) — paste the share link
  //    from Drive here (Share → "Anyone with the link" → Copy link).
  //    Any Drive share-link format works, the file ID is pulled out
  //    automatically. No YouTube Content-ID issue since it never touches
  //    YouTube.
  driveUrl: "https://drive.google.com/file/d/1Sz-6f31cdpIsbkOQnlGFrSDT2IrvS0Pi/view?usp=drive_link",

  // 3) YOUTUBE (fallback) — only used if both above are empty.
  //    Note: a "Block" copyright policy on the song will stop this from
  //    playing in an embed no matter what — that's on YouTube's side.
  youtubeUrl: "",

  // Gallery photos — drop 21 files in assets/img/gallery/ and list them here.
  // Portrait and landscape photos can be mixed freely; the layout (see
  // style.css .gallery masonry columns) sizes each photo by its own
  // natural aspect ratio, nothing gets cropped. Falls back to labelled
  // placeholders when the array is empty.
  gallery: [
    "assets/img/gallery/01.jpg",
    "assets/img/gallery/02.jpg",
    "assets/img/gallery/03.jpg",
    "assets/img/gallery/04.jpg",
    "assets/img/gallery/05.jpg",
    "assets/img/gallery/06.jpg",
    "assets/img/gallery/07.jpg",
    "assets/img/gallery/08.jpg",
    "assets/img/gallery/09.jpg",
    "assets/img/gallery/10.jpg",
    "assets/img/gallery/11.jpg",
    "assets/img/gallery/12.jpg",
    "assets/img/gallery/13.jpg",
    "assets/img/gallery/14.jpg",
    "assets/img/gallery/15.jpg",
    "assets/img/gallery/16.jpg",
    "assets/img/gallery/17.jpg",
    "assets/img/gallery/18.jpg",
    "assets/img/gallery/19.jpg",
    "assets/img/gallery/20.jpg",
    "assets/img/gallery/21.jpg",
  ],

  guestParam: "to", // ?to=Nama+Tamu in the URL personalises the cover
};

/* ---------------------------------------------------------
   Guest name from URL (?to=...)
   Include the honorific in the value itself, e.g. ?to=Ibu+Sari so the
   cover reads "Kepada Yth. / Ibu Sari". If the param is missing, the
   HTML's default text ("Bapak/Ibu/Saudara/i") stays as-is.
--------------------------------------------------------- */
(function personaliseGuest(){
  const params = new URLSearchParams(window.location.search);
  const name = params.get(CONFIG.guestParam);
  if (name) {
    document.getElementById("guestName").textContent = decodeURIComponent(name).replace(/\+/g, " ");
  }
})();

/* ---------------------------------------------------------
   Cover gate — "Buka Undangan"
--------------------------------------------------------- */
const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openBtn = document.getElementById("openInvitation");
const bgAudio = document.getElementById("bgAudio");
const musicToggle = document.getElementById("musicToggle");

openBtn.addEventListener("click", () => {
  cover.classList.add("is-closing");
  invitation.hidden = false;
  document.body.style.overflow = "";
  window.scrollTo(0, 0);

  // Try to start background music (best-effort; ignored if no file present)
  bgAudio.play().then(() => {
    musicToggle.setAttribute("aria-pressed", "true");
  }).catch(() => { /* autoplay blocked or no audio file — that's fine */ });

  setTimeout(() => { cover.remove(); }, 950);
  initReveal();
});

document.body.style.overflow = "hidden"; // lock scroll behind the cover

musicToggle.addEventListener("click", () => {
  if (bgAudio.paused) {
    bgAudio.play().then(() => musicToggle.setAttribute("aria-pressed", "true")).catch(() => {});
  } else {
    bgAudio.pause();
    musicToggle.setAttribute("aria-pressed", "false");
  }
});

/* ---------------------------------------------------------
   Scroll progress rail
--------------------------------------------------------- */
const progressFill = document.getElementById("progressFill");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
  progressFill.style.width = `${Math.min(scrolled * 100, 100)}%`;
}, { passive: true });

/* ---------------------------------------------------------
   Reveal-on-scroll
--------------------------------------------------------- */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

/* ---------------------------------------------------------
   Countdown
--------------------------------------------------------- */
function updateCountdown(){
  const target = new Date(CONFIG.eventDate).getTime();
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const pad = n => String(n).padStart(2, "0");
  document.getElementById("cdDays").textContent = pad(days);
  document.getElementById("cdHours").textContent = pad(hours);
  document.getElementById("cdMinutes").textContent = pad(minutes);
  document.getElementById("cdSeconds").textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------------------------------------------------------
   "Simpan Tanggal" — downloads a .ics calendar file
--------------------------------------------------------- */
document.getElementById("saveDateBtn").addEventListener("click", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${CONFIG.event.title}`,
    `LOCATION:${CONFIG.event.location}`,
    `DTSTART:${CONFIG.event.start}`,
    `DTEND:${CONFIG.event.end}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Pernikahan-Dina-Hamid.ics";
  a.click();
  URL.revokeObjectURL(url);
});

/* ---------------------------------------------------------
   "Our Moment" video — swaps the placeholder for a YouTube
   embed when CONFIG.youtubeUrl is filled in. Click-to-load
   (rather than embedding on page load) keeps the page light
   and avoids autoplaying video the guest didn't ask for.
--------------------------------------------------------- */
function extractYoutubeId(url){
  if (!url) return null;
  // Handles: watch?v=ID, youtu.be/ID, shorts/ID, embed/ID (with or without extra params)
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function extractDriveFileId(url){
  if (!url) return null;
  // Handles: /file/d/ID/view..., open?id=ID, uc?id=ID
  const match = url.match(/(?:\/d\/|[?&]id=)([a-zA-Z0-9_-]{10,})/);
  return match ? match[1] : null;
}

// Pause the background music so it doesn't play under the video. Also
// flips the floating music toggle so its state stays accurate.
function pauseBgMusicForVideo(){
  if (!bgAudio.paused) {
    bgAudio.pause();
    musicToggle.setAttribute("aria-pressed", "false");
  }
}

(function initVideo(){
  const frame = document.getElementById("videoFrame");
  const placeholder = document.getElementById("videoPlaceholder");

  // Priority 1: self-hosted video file — plays inline immediately on
  // click, no third-party platform involved, so no copyright-claim
  // playback block regardless of the song used.
  if (CONFIG.videoFile) {
    frame.addEventListener("click", () => {
      pauseBgMusicForVideo();
      const video = document.createElement("video");
      video.src = CONFIG.videoFile;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      // Extra safety net: if the guest hits play again after pausing
      // (or a browser fires play slightly after autoplay), mute the
      // background music too.
      video.addEventListener("play", pauseBgMusicForVideo);
      placeholder.remove();
      frame.appendChild(video);
    }, { once: true });
    return;
  }

  // Priority 2: Google Drive — embeds via Drive's own preview player.
  // Requires the file's sharing setting to be "Anyone with the link".
  const driveId = extractDriveFileId(CONFIG.driveUrl);
  if (driveId) {
    // Drive exposes a public thumbnail for shared files — show it behind
    // the play icon instead of a plain placeholder.
    placeholder.style.backgroundImage =
      `linear-gradient(rgba(20,21,15,.35), rgba(20,21,15,.55)), url('https://drive.google.com/thumbnail?id=${driveId}&sz=w1000')`;
    placeholder.style.backgroundSize = "cover";
    placeholder.style.backgroundPosition = "center";

    frame.addEventListener("click", () => {
      // Drive's player is inside a cross-origin iframe, so we can't detect
      // its actual play/pause moments — muting right when the guest opens
      // it is the best we can do, which covers the normal case fine.
      pauseBgMusicForVideo();
      const iframe = document.createElement("iframe");
      iframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
      iframe.title = "Video Prewedding";
      iframe.allow = "autoplay; encrypted-media; fullscreen";
      iframe.allowFullscreen = true;
      placeholder.remove();
      frame.appendChild(iframe);
    }, { once: true });
    return;
  }

  // Priority 3: YouTube fallback (only reached if the two above are empty)
  const videoId = extractYoutubeId(CONFIG.youtubeUrl);
  if (!videoId) return; // nothing configured — leave the placeholder as-is

  // Show the real YouTube thumbnail behind the play icon instead of a
  // plain placeholder. maxresdefault isn't generated for every video, so
  // fall back to hqdefault (which always exists) if it fails to load.
  const thumb = new Image();
  thumb.onload = () => {
    // maxresdefault returns a 120x90 grey placeholder image when missing —
    // real maxres thumbnails are always wider than that.
    const src = thumb.naturalWidth > 120
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    placeholder.style.backgroundImage =
      `linear-gradient(rgba(20,21,15,.35), rgba(20,21,15,.55)), url('${src}')`;
    placeholder.style.backgroundSize = "cover";
    placeholder.style.backgroundPosition = "center";
  };
  thumb.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  frame.addEventListener("click", () => {
    pauseBgMusicForVideo();
    const iframe = document.createElement("iframe");
    // youtube-nocookie.com (privacy-enhanced mode) avoids the "Watch on
    // YouTube" fallback some browsers trigger when they block third-party
    // cookies on the regular youtube.com embed domain.
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = "Video Prewedding";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    placeholder.remove();
    frame.appendChild(iframe);
  }, { once: true });
})();

/* ---------------------------------------------------------
   Gallery render — 21 photos, mixed portrait/landscape.
   Uses real <img> tags (not background-image) so each photo's
   natural aspect ratio drives its height inside the CSS masonry
   columns defined in style.css (.gallery / .gallery__item).
   Tapping a photo opens it in a simple lightbox with prev/next.
--------------------------------------------------------- */
const TOTAL_GALLERY_SLOTS = 21; // used only for the placeholder fallback
let galleryItems = [];

function renderGallery(){
  const gallery = document.getElementById("gallery");
  const hasPhotos = CONFIG.gallery.length > 0;
  galleryItems = hasPhotos ? CONFIG.gallery : new Array(TOTAL_GALLERY_SLOTS).fill(null);

  gallery.innerHTML = "";

  galleryItems.forEach((src, i) => {
    const fig = document.createElement("figure");
    fig.className = "gallery__item";

    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Foto ${i + 1}`;
      img.loading = "lazy";
      fig.appendChild(img);
      fig.addEventListener("click", () => openLightbox(i));
    } else {
      fig.innerHTML = `<span>photo ${i + 1}</span>`;
    }

    gallery.appendChild(fig);
  });
}
renderGallery();

/* ---- Lightbox ---- */
let lightboxIndex = 0;
let lightboxEl = null;

function buildLightbox(){
  const box = document.createElement("div");
  box.className = "lightbox";
  box.id = "lightbox";
  box.innerHTML = `
    <button class="lightbox__close" aria-label="Tutup">&times;</button>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Sebelumnya">&lsaquo;</button>
    <img alt="">
    <button class="lightbox__nav lightbox__nav--next" aria-label="Berikutnya">&rsaquo;</button>
  `;
  document.body.appendChild(box);

  box.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
  box.querySelector(".lightbox__nav--prev").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(-1); });
  box.querySelector(".lightbox__nav--next").addEventListener("click", (e) => { e.stopPropagation(); stepLightbox(1); });
  box.addEventListener("click", (e) => { if (e.target === box) closeLightbox(); });

  return box;
}

function openLightbox(index){
  if (!galleryItems[index]) return; // no photo in this slot (placeholder)
  lightboxIndex = index;
  if (!lightboxEl) lightboxEl = buildLightbox();
  updateLightboxImage();
  lightboxEl.classList.add("is-open");
  document.addEventListener("keydown", onLightboxKeydown);
}

function stepLightbox(dir){
  const len = galleryItems.length;
  let next = lightboxIndex;
  for (let i = 0; i < len; i++) {
    next = (next + dir + len) % len;
    if (galleryItems[next]) { lightboxIndex = next; break; }
  }
  updateLightboxImage();
}

function updateLightboxImage(){
  const img = lightboxEl.querySelector("img");
  img.src = galleryItems[lightboxIndex];
  img.alt = `Foto ${lightboxIndex + 1}`;
}

function closeLightbox(){
  if (!lightboxEl) return;
  lightboxEl.classList.remove("is-open");
  document.removeEventListener("keydown", onLightboxKeydown);
}

function onLightboxKeydown(e){
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
}

/* ---------------------------------------------------------
   RSVP & Wishes (stored in Firestore — realtime, shared to all guests)
--------------------------------------------------------- */
const WISHES_PER_PAGE = 3;
let wishPage = 1;
let wishesCache = [];

function renderWishes(){
  const list = wishesCache; // already newest-first from Firestore query
  const container = document.getElementById("wishesList");
  const pager = document.getElementById("wishesPager");
  container.innerHTML = "";
  pager.innerHTML = "";

  if (!list.length) {
    container.innerHTML = `<p class="wishes-empty">Jadilah yang pertama mengirimkan doa &amp; ucapan.</p>`;
    return;
  }

  const totalPages = Math.max(1, Math.ceil(list.length / WISHES_PER_PAGE));
  wishPage = Math.min(wishPage, totalPages);
  const start = (wishPage - 1) * WISHES_PER_PAGE;
  const pageItems = list.slice(start, start + WISHES_PER_PAGE);

  pageItems.forEach(w => {
    const el = document.createElement("div");
    el.className = "wish";
    el.innerHTML = `
      <div class="wish__head">
        <span class="wish__name">${escapeHtml(w.name)}</span>
        <span class="wish__status">${escapeHtml(w.attend)}</span>
      </div>
      <p class="wish__text">${escapeHtml(w.message)}</p>`;
    container.appendChild(el);
  });

  const prev = document.createElement("button");
  prev.textContent = "← Previous";
  prev.disabled = wishPage === 1;
  prev.addEventListener("click", () => { wishPage--; renderWishes(); });
  pager.appendChild(prev);

  for (let p = 1; p <= totalPages; p++) {
    const b = document.createElement("button");
    b.textContent = p;
    b.setAttribute("aria-current", String(p === wishPage));
    b.addEventListener("click", () => { wishPage = p; renderWishes(); });
    pager.appendChild(b);
  }

  const next = document.createElement("button");
  next.textContent = "Next →";
  next.disabled = wishPage === totalPages;
  next.addEventListener("click", () => { wishPage++; renderWishes(); });
  pager.appendChild(next);
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Realtime listener — otomatis update tampilan kalau ada ucapan baru dari tamu lain
wishesCollection.orderBy("ts", "desc").onSnapshot((snapshot) => {
  wishesCache = snapshot.docs.map(doc => doc.data());
  renderWishes();
}, (err) => {
  console.error("Gagal memuat wishes:", err);
  document.getElementById("wishesList").innerHTML =
    `<p class="wishes-empty">Tidak dapat memuat ucapan saat ini.</p>`;
});

document.getElementById("rsvpForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("rsvpName").value.trim();
  const message = document.getElementById("rsvpMessage").value.trim();
  const attend = document.querySelector('input[name="attend"]:checked').value;
  if (!name || !message) return;

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim...";

  try {
    await wishesCollection.add({ name, attend, message, ts: Date.now() });
    e.target.reset();
    wishPage = 1;
  } catch (err) {
    console.error(err);
    alert("Gagal mengirim ucapan. Coba lagi ya.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim";
  }
});

/* ---------------------------------------------------------
   Wedding Gift — reveal account details + copy to clipboard
--------------------------------------------------------- */
const giftToggle = document.getElementById("giftToggle");
const giftPanel = document.getElementById("giftPanel");

giftToggle.addEventListener("click", () => {
  const expanded = giftToggle.getAttribute("aria-expanded") === "true";
  giftToggle.setAttribute("aria-expanded", String(!expanded));
  giftPanel.hidden = expanded;
  giftToggle.textContent = expanded ? "E-Amplop" : "Tutup";
});

document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard API unavailable — fall back silently
    }
    const original = btn.textContent;
    btn.textContent = "Tersalin";
    btn.classList.add("is-copied");
    setTimeout(() => { btn.textContent = original; btn.classList.remove("is-copied"); }, 1500);
  });
});