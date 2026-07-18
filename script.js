/* ==========================================
   BENGİSİTE - INTERACTIVE JAVASCRIPT LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  initSurpriseButton();
  initGalleryModal();
  initConfettiEngine();
  initMusicButton();
  // initDateProposal is handled in planner.js
  initComplaintBox();
});

/* --- 1. Floating Background Hearts Generator --- */
function initFloatingHearts() {
  const container = document.getElementById('bgHeartsContainer');
  if (!container) return;

  const heartSymbols = ['💖', '💕', '🌸', '✨', '💗', '🤍'];

  function createHeart() {
    const heart = document.createElement('span');
    heart.classList.add('floating-heart');
    
    // Pick random symbol
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    
    // Random position and size
    const randomLeft = Math.random() * 100;
    const randomSize = Math.random() * 0.8 + 0.8; // 0.8rem - 1.6rem
    const randomDuration = Math.random() * 4 + 6; // 6s - 10s
    
    heart.style.left = `${randomLeft}vw`;
    heart.style.fontSize = `${randomSize}rem`;
    heart.style.animationDuration = `${randomDuration}s`;
    
    container.appendChild(heart);

    // Remove element after animation finishes
    setTimeout(() => {
      heart.remove();
    }, randomDuration * 1000);
  }

  // Create initial set of hearts
  for (let i = 0; i < 12; i++) {
    setTimeout(createHeart, Math.random() * 3000);
  }

  // Continuously spawn hearts
  setInterval(createHeart, 1200);
}

/* --- 2. Surprise Button & Quotes System --- */
const sweetQuotes = [
  "Seninle geçen her saniye, hayatımın en değerli hediyesi... 💕",
  "Gözlerinin içindeki o sıcak ışık, benim en güvenli ve huzurlu limanım. ✨",
  "İyi ki varsın, iyi ki hayatımdasın. Seni her gün daha çok seviyorum! 🌸",
  "Saatlerce oturup seninle kahve içmeyi ve sohbet etmeyi dünyadaki her şeye tercih ederim. ☕💖",
  "Birlikte attığımız her kahkaha, hafızamın en tatlı köşesinde saklı... 🥰",
  "Dünyadaki en güzel ve en özel manzara, senin gülümsediğin andır. ✨",
  "Seninle kurduğumuz tüm hayaller bir gün tek tek gerçek olacak. 🌟",
  "Elini tuttuğum ilk andan beri kalbimin tek sahibi sensin. 💕",
  "Sen benim bu dünyadaki en güzel sürprizimsin! ✨"
];

let lastQuoteIndex = -1;

function getRandomQuote() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * sweetQuotes.length);
  } while (randomIndex === lastQuoteIndex && sweetQuotes.length > 1);
  
  lastQuoteIndex = randomIndex;
  return sweetQuotes[randomIndex];
}

function initSurpriseButton() {
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseModal = document.getElementById('surpriseModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const surpriseQuoteText = document.getElementById('surpriseQuoteText');
  const anotherQuoteBtn = document.getElementById('anotherQuoteBtn');
  const backdrop = surpriseModal ? surpriseModal.querySelector('.modal__backdrop') : null;

  if (!surpriseBtn || !surpriseModal) return;

  function showSurprise() {
    // Set text
    if (surpriseQuoteText) {
      surpriseQuoteText.textContent = `"${getRandomQuote()}"`;
    }
    
    // Show modal
    surpriseModal.classList.add('active');
    surpriseModal.setAttribute('aria-hidden', 'false');

    // Trigger confetti
    triggerConfettiExplosion();
  }

  function hideSurprise() {
    surpriseModal.classList.remove('active');
    surpriseModal.setAttribute('aria-hidden', 'true');
  }

  surpriseBtn.addEventListener('click', showSurprise);
  
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', hideSurprise);
  if (backdrop) backdrop.addEventListener('click', hideSurprise);

  if (anotherQuoteBtn) {
    anotherQuoteBtn.addEventListener('click', () => {
      surpriseQuoteText.textContent = `"${getRandomQuote()}"`;
      triggerConfettiExplosion();
    });
  }

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && surpriseModal.classList.contains('active')) {
      hideSurprise();
    }
  });
}

/* --- 3. Interactive Gallery Lightbox Modal --- */
function initGalleryModal() {
  const cards = document.querySelectorAll('.gallery-card');
  const galleryModal = document.getElementById('galleryModal');
  const galleryModalCloseBtn = document.getElementById('galleryModalCloseBtn');
  const galleryModalImg = document.getElementById('galleryModalImg');
  const galleryModalTitle = document.getElementById('galleryModalTitle');
  const galleryModalDesc = document.getElementById('galleryModalDesc');
  const backdrop = galleryModal ? galleryModal.querySelector('.modal__backdrop') : null;

  if (!galleryModal) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-card__image');
      const title = card.querySelector('.gallery-card__title');
      const desc = card.querySelector('.gallery-card__desc');

      if (galleryModalImg && img) galleryModalImg.src = img.src;
      if (galleryModalTitle && title) galleryModalTitle.textContent = title.textContent;
      if (galleryModalDesc && desc) galleryModalDesc.textContent = desc.textContent;

      galleryModal.classList.add('active');
      galleryModal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeGalleryModal() {
    galleryModal.classList.remove('active');
    galleryModal.setAttribute('aria-hidden', 'true');
  }

  if (galleryModalCloseBtn) galleryModalCloseBtn.addEventListener('click', closeGalleryModal);
  if (backdrop) backdrop.addEventListener('click', closeGalleryModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
      closeGalleryModal();
    }
  });
}

/* --- 4. Custom Pastel & Heart Confetti Engine --- */
let confettiParticles = [];
let confettiAnimationFrame = null;

function initConfettiEngine() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

function triggerConfettiExplosion() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const colors = ['#FFB7B2', '#E8A598', '#D8B4E2', '#B5C99A', '#FFFDF9', '#FFD1DC'];
  const shapes = ['circle', 'heart', 'ribbon'];

  // Generate 70 particles
  for (let i = 0; i < 70; i++) {
    confettiParticles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 50,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      vRotation: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      gravity: 0.35,
      drag: 0.96
    });
  }

  if (!confettiAnimationFrame) {
    animateConfetti(canvas, ctx);
  }
}

function animateConfetti(canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles.forEach((p, index) => {
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.vy += p.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.vRotation;
    p.opacity -= 0.008;

    ctx.save();
    ctx.globalAlpha = Math.max(p.opacity, 0);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'heart') {
      ctx.font = `${p.size * 1.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💖', 0, 0);
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }

    ctx.restore();

    if (p.opacity <= 0 || p.y > canvas.height) {
      confettiParticles.splice(index, 1);
    }
  });

  if (confettiParticles.length > 0) {
    confettiAnimationFrame = requestAnimationFrame(() => animateConfetti(canvas, ctx));
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiAnimationFrame = null;
  }
}

/* ==========================================
   ŞARKI LİSTESİ - Buraya kendi şarkılarını ekle!
   1. MP3 dosyasını assets/music/ klasörüne kopyala
   2. Aşağıya { title: "Şarkı Adı 🎵", url: "assets/music/dosyaadi.mp3" } ekle
   ========================================== */
const PLAYLIST = [
  { title: "Şarkı 1 💕", url: "assets/music/sarki1.mp3" },
  { title: "Şarkı 2 🌸", url: "assets/music/sarki2.mp3" },
  { title: "Şarkı 3 ✨", url: "assets/music/sarki3.mp3" },
];

/* --- 5. Interactive Ambient Melody Playlist Player --- */
function initMusicButton() {
  const toggleBtn = document.getElementById('musicToggleBtn');
  const nextBtn = document.getElementById('musicNextBtn');
  const trackInfo = document.getElementById('musicTrackInfo');
  const playerContainer = document.querySelector('.header__music-player');
  const playlistBtn = document.getElementById('musicPlaylistBtn');
  const playlistPanel = document.getElementById('musicPlaylistPanel');
  const playlistItems = document.getElementById('musicPlaylistItems');

  if (!toggleBtn || !playerContainer) return;

  let currentTrackIndex = 0;
  let isPlaying = false;
  let audio = new Audio();
  audio.volume = 0.4;

  // Playlist panel: render items
  function renderPlaylist() {
    if (!playlistItems) return;
    playlistItems.innerHTML = '';
    PLAYLIST.forEach((track, index) => {
      const li = document.createElement('li');
      li.className = 'music-playlist-panel__item' + (index === currentTrackIndex ? ' active' : '');
      li.dataset.index = index;
      li.innerHTML = `
        <span class="music-playlist-panel__item-icon">${index === currentTrackIndex && isPlaying ? '▶️' : '🎵'}</span>
        <span class="music-playlist-panel__item-title">${track.title}</span>
      `;
      li.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playMusic();
        renderPlaylist();
        closePlaylistPanel();
      });
      playlistItems.appendChild(li);
    });
  }

  function openPlaylistPanel() {
    if (!playlistPanel) return;
    renderPlaylist();
    playlistPanel.removeAttribute('hidden');
  }

  function closePlaylistPanel() {
    if (playlistPanel) playlistPanel.setAttribute('hidden', '');
  }

  function togglePlaylistPanel() {
    if (!playlistPanel) return;
    if (playlistPanel.hasAttribute('hidden')) {
      openPlaylistPanel();
    } else {
      closePlaylistPanel();
    }
  }

  function loadTrack(index) {
    audio.src = PLAYLIST[index].url;
    audio.load();
    if (trackInfo) {
      trackInfo.textContent = PLAYLIST[index].title;
    }
  }

  // Load the first track initially
  loadTrack(currentTrackIndex);

  function playMusic() {
    audio.play().then(() => {
      isPlaying = true;
      playerContainer.classList.add('playing');
      toggleBtn.querySelector('.header__music-label').textContent = 'Duraklat';
      toggleBtn.querySelector('.header__music-icon').textContent = '⏸️';
      if (nextBtn) nextBtn.style.display = 'inline-flex';
    }).catch(err => {
      console.warn("Müzik çalınamadı (etkileşim bekleniyor):", err);
    });
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playerContainer.classList.remove('playing');
    toggleBtn.querySelector('.header__music-label').textContent = 'Melodi';
    toggleBtn.querySelector('.header__music-icon').textContent = '🎵';
  }

  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) playMusic();
    renderPlaylist();
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextTrack();
    });
  }

  // Playlist button: open/close panel
  if (playlistBtn) {
    playlistBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlaylistPanel();
    });
  }

  // Track info: open panel on click
  if (trackInfo) {
    trackInfo.addEventListener('click', () => togglePlaylistPanel());
    trackInfo.style.cursor = 'pointer';
  }

  // Close panel on click outside
  document.addEventListener('click', (e) => {
    if (playlistPanel && !playlistPanel.hasAttribute('hidden')) {
      if (!playerContainer.contains(e.target)) {
        closePlaylistPanel();
      }
    }
  });

  audio.addEventListener('ended', () => {
    nextTrack();
    playMusic();
  });

  audio.addEventListener('error', () => {
    console.warn("Şarkı yükleme hatası. Sonraki şarkıya geçiliyor...");
    nextTrack();
  });

  // Load initial track
  loadTrack(currentTrackIndex);
}

/* --- 7. Complaint Box System (Firebase Realtime DB) --- */
function initComplaintBox() {
  const form = document.getElementById('complaintForm');
  const complaintsList = document.getElementById('complaintsList');

  if (!form || !complaintsList) return;

  function renderComplaints(complaints) {
    complaintsList.innerHTML = '';

    if (!complaints || complaints.length === 0) {
      complaintsList.innerHTML = `<p class="complaints-list__empty">Henüz hiç şikayet yok, ne güzel! 🥰</p>`;
      return;
    }

    // Sort by date (newest first — use id which is firebase timestamp)
    const sortedComplaints = [...complaints].sort((a, b) => {
      // Firebase push keys are lexicographically ordered by time
      return b.id > a.id ? 1 : -1;
    });

    sortedComplaints.forEach((c) => {
      const item = document.createElement('div');
      item.className = 'complaint-item';

      const isPending = c.status === 'pending';
      const statusClass = isPending ? 'complaint-item__status--pending' : 'complaint-item__status--resolved';
      const statusText = isPending ? 'İncelemede 🔍' : 'Affedildi 💕';

      let actionBtnHtml = '';
      if (isPending) {
        actionBtnHtml = `<button class="complaint-item__action-btn" data-id="${c.id}">Affet 💕</button>`;
      }

      item.innerHTML = `
        <div class="complaint-item__header">
          <span class="complaint-item__title">${c.type}</span>
          <span class="complaint-item__date">${c.date}</span>
        </div>
        <p class="complaint-item__text">${c.detail}</p>
        <div class="complaint-item__footer">
          <span class="complaint-item__status ${statusClass}">${statusText}</span>
          ${actionBtnHtml}
        </div>
      `;

      complaintsList.appendChild(item);
    });

    // Bind resolve buttons
    const actionBtns = complaintsList.querySelectorAll('.complaint-item__action-btn');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        dbUpdateComplaint(id, { status: 'resolved' });
        // Firebase listener will auto-refresh the list
        triggerConfettiExplosion();
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const typeVal = document.getElementById('complaintType').value;
    const detailVal = document.getElementById('complaintDetail').value;

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComplaint = {
      type: typeVal,
      detail: detailVal,
      date: formattedDate,
      status: 'pending'
    };

    // Save to Firebase; listener auto-refreshes the list
    dbAddComplaint(newComplaint);
    form.reset();
    triggerConfettiExplosion();
  });

  // Real-time listener: renders whenever Firebase data changes
  dbListenComplaints((complaints) => {
    renderComplaints(complaints);
  });
}
