# Bengisite - Kodlama ve Stil Rehberi 🌸

Bu doküman, sürpriz anı websitesinin geliştirilmesi sırasında uyulması gereken temel prensipleri ve standartları tanımlar.

---

## 1. Mimari & Dosya Düzeni

- **Modülerlik:** HTML, CSS ve JavaScript kodları kesinlikle birbirinden ayrılmalı, satır içi (inline) stiller ve scriptler kullanılmamalıdır.
- **Dizin Yapısı:**
  - `index.html` -> Ana sayfa yapısı
  - `style.css` -> Tüm tasarım sistemleri, CSS değişkenleri ve modüler bileşen stilleri
  - `script.js` -> Tüm etkileşimler, konfeti ve modal mantıkları
  - `assets/images/` -> Anı fotoğrafları ve yer tutucular
  - `rules/code_style.md` -> Proje rehberi

---

## 2. HTML Standartları

- HTML5 semantic etiketler (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`) kullanılmalıdır.
- Tüm etkileşimli öğelerde (butonlar, modallar, resimler) erişilebilirlik ve test kolaylığı için anlaşılır `id` ve `alt` nitelikleri bulunmalıdır.
- Görsel yolları esnek (relative path) olmalı, `assets/images/` klasörüne referans vermelidir.

---

## 3. CSS & Tasarım Sistemi

- **Tasarım Değişkenleri (CSS Variables):** Tüm renkler, fontlar, yarıçaplar (border-radius) ve gölgeler `:root` altında tanımlanmalıdır.
- **Pastel Renk Paleti:**
  - Arka Plan: Soft Krem (`#FAF6F0`) ve Pudra Pembesi (`#FFF0F3`)
  - Vurgular: Gül Kurusu (`#E8A598`), Soft Lavanta (`#E8DFF5`), Soft Yeşil (`#B5C99A`)
  - Metinler: Sıcak Kömür (`#3D3434`)
- **Responsive Tasarım:** Mobil öncelikli (mobile-friendly) yaklaşım benimsenmeli, CSS Grid ve Flexbox kullanılmalıdır.
- **Glassmorphism & Animasyonlar:** Yarı saydam kartlar (`backdrop-filter`), yumuşak geçişler (`transition: all 0.3s ease`) ve hover efektleri ile estetik canlı tutulmalıdır.

---

## 4. JavaScript Standartları

- Vanilla JS (ES6+) standartları takip edilmelidir.
- Olay dinleyicileri (event listeners) temiz fonksiyonlar olarak tanımlanmalıdır.
- Konfeti ve modal etkileşimleri performansı olumsuz etkilemeyecek şekilde optimize edilmelidir.
- Kodlar açıklayıcı Türkçe/İngilizce yorum satırları ile desteklenmelidir.

---

## 5. Görsel Yönetim Stratejisi

- `hero.jpg`: Ana karşılama görseli.
- `memory1.jpg` - `memory6.jpg`: İnteraktif galeri görselleri.
- Fotoğraflar `assets/images/` klasörüne aynı isimlerle yüklendiğinde site otomatik olarak güncellenecektir.
