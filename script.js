/* ==========================================
   BENGİSİTE - INTERACTIVE JAVASCRIPT LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  initSurpriseButton();
  initGalleryModal();
  initConfettiEngine();
  initMusicButton();
  initDateProposal();
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

/* --- 5. Interactive Ambient Melody Playlist Player --- */
function initMusicButton() {
  const toggleBtn = document.getElementById('musicToggleBtn');
  const nextBtn = document.getElementById('musicNextBtn');
  const trackInfo = document.getElementById('musicTrackInfo');
  const playerContainer = document.querySelector('.header__music-player');

  if (!toggleBtn || !playerContainer) return;

  const playlist = [
    {
      title: "Kisses 💋",
      url: "https://assets.codepen.io/4358584/Anitek_-_01_-_Kisses.mp3"
    },
    {
      title: "Sparkle ✨",
      url: "https://assets.codepen.io/4358584/Anitek_-_02_-_Sparkle.mp3"
    },
    {
      title: "Dawn 🌅",
      url: "https://assets.codepen.io/4358584/Anitek_-_03_-_Dawn.mp3"
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let audio = new Audio();
  audio.volume = 0.4; // Set a soft volume by default

  function loadTrack(index) {
    audio.src = playlist[index].url;
    audio.load();
    if (trackInfo) {
      trackInfo.textContent = playlist[index].title;
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
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
      playMusic();
    }
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
      e.stopPropagation(); // Prevent main button click triggering if nested
      nextTrack();
    });
  }

  // Handle song ending - auto play next
  audio.addEventListener('ended', () => {
    nextTrack();
    playMusic();
  });

  // Handle loading errors gracefully
  audio.addEventListener('error', () => {
    console.error("Müzik yükleme hatası. Sonraki şarkıya geçiliyor...");
    nextTrack();
  });
}

/* --- 6. Date Proposal & Selection System --- */
function initDateProposal() {
  const form = document.getElementById('dateProposalForm');
  if (!form) return;

  // Lütfen buraya kendi telefon numaranızı yazın (örn: '905321234567')
  // Boş bırakılırsa WhatsApp, kullanıcının mesajı kime göndereceğini seçmesine izin verir.
  const MY_PHONE_NUMBER = ''; 

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const dateVal = document.getElementById('proposalDate').value;
    const timeVal = document.getElementById('proposalTime').value;
    const activityVal = document.getElementById('proposalActivity').value;
    const noteVal = document.getElementById('proposalNote').value;

    // Format date to local standard DD.MM.YYYY
    let formattedDate = dateVal;
    if (dateVal) {
      const parts = dateVal.split('-');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    }

    const message = `Aşkım, seninle harika bir plan yapalım mı? Buluşma Teklifim:
📅 Tarih: ${formattedDate}
⏰ Saat: ${timeVal}
🎈 Aktivite: ${activityVal}
💬 Not: ${noteVal || 'Yok (Sadece sen ol yeter 💕)'}

Ne dersin? 🥰`;

    const encodedMessage = encodeURIComponent(message);
    let whatsappUrl = '';
    
    if (MY_PHONE_NUMBER) {
      whatsappUrl = `https://api.whatsapp.com/send?phone=${MY_PHONE_NUMBER}&text=${encodedMessage}`;
    } else {
      whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    }

    // Launch confetti and open WhatsApp
    triggerConfettiExplosion();
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 800);
  });
}

/* --- 7. Complaint Box System --- */
function initComplaintBox() {
  const form = document.getElementById('complaintForm');
  const complaintsList = document.getElementById('complaintsList');

  if (!form || !complaintsList) return;

  // Load from local storage
  let complaints = JSON.parse(localStorage.getItem('complaints')) || [];

  function saveComplaints() {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }

  function renderComplaints() {
    complaintsList.innerHTML = '';

    if (complaints.length === 0) {
      complaintsList.innerHTML = `<p class="complaints-list__empty">Henüz hiç şikayet yok, ne güzel! 🥰</p>`;
      return;
    }

    // Sort by date (newest first)
    const sortedComplaints = [...complaints].reverse();

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

    // Bind event listeners to resolve buttons
    const actionBtns = complaintsList.querySelectorAll('.complaint-item__action-btn');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        resolveComplaint(id);
      });
    });
  }

  function resolveComplaint(id) {
    complaints = complaints.map(c => {
      if (c.id === id) {
        return { ...c, status: 'resolved' };
      }
      return c;
    });
    saveComplaints();
    renderComplaints();
    
    // Celebratory confetti explosion for forgiveness!
    triggerConfettiExplosion();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const typeVal = document.getElementById('complaintType').value;
    const detailVal = document.getElementById('complaintDetail').value;

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComplaint = {
      id: Date.now().toString(),
      type: typeVal,
      detail: detailVal,
      date: formattedDate,
      status: 'pending'
    };

    complaints.push(newComplaint);
    saveComplaints();
    renderComplaints();

    // Reset form
    form.reset();

    // Trigger sweet feedback confetti
    triggerConfettiExplosion();
  });

  // Initial render
  renderComplaints();
}
