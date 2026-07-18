/* ==========================================
   BENGİSİTE - INTERACTIVE JAVASCRIPT LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  initSurpriseButton();
  initGalleryModal();
  initConfettiEngine();
  initMusicButton();
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

/* --- 5. Interactive Ambient Melody Sound Effect --- */
function initMusicButton() {
  const btn = document.getElementById('musicToggleBtn');
  if (!btn) return;

  let isPlaying = false;
  let audioCtx = null;
  let intervalId = null;

  const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C D E F G A B C

  btn.addEventListener('click', () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
      btn.style.background = 'var(--accent-rose)';
      btn.style.color = '#FFF';
      btn.querySelector('.header__music-label').textContent = 'Çalıyor... 💕';
      startSoftMelody();
    } else {
      btn.style.background = 'var(--glass-bg)';
      btn.style.color = 'var(--text-main)';
      btn.querySelector('.header__music-label').textContent = 'Melodi';
      stopSoftMelody();
    }
  });

  function startSoftMelody() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    playTone();
    intervalId = setInterval(playTone, 1400);
  }

  function playTone() {
    if (!isPlaying || !audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const freq = notes[Math.floor(Math.random() * notes.length)];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.3);
  }

  function stopSoftMelody() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
}
