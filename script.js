/* ==========================================
   BENGİSİTE - INTERACTIVE JAVASCRIPT LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();
  initSurpriseButton();
  initInlineLoveNoteForm();
  initGalleryModal();
  initConfettiEngine();
  // initDateProposal is handled in planner.js
  initComplaintBox();
  initBirthdayCountdown();
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

/* --- 2. Dynamic Love Notes & Surprise Quotes System (Firebase Powered) --- */

// Fallback love notes (Firebase'de henüz veri yoksa kullanılan yedek liste)
const defaultSweetQuotes = [
  { text: "Seninle geçen her saniye, hayatımın en değerli hediyesi... 💕", author: 'Yiğit' },
  { text: "Gözlerinin içindeki o sıcak ışık, benim en güvenli ve huzurlu limanım. ✨", author: 'Yiğit' },
  { text: "İyi ki varsın, iyi ki hayatımdasın. Seni her gün daha çok seviyorum! 🌸", author: 'Yiğit' },
  { text: "Saatlerce oturup seninle kahve içmeyi ve sohbet etmeyi dünyadaki her şeye tercih ederim. ☕💖", author: 'Yiğit' },
  { text: "Birlikte attığımız her kahkaha, hafızamın en tatlı köşesinde saklı... 🥰", author: 'Yiğit' },
  { text: "Dünyadaki en güzel ve en özel manzara, senin gülümsediğin andır. ✨", author: 'Yiğit' },
  { text: "Seninle kurduğumuz tüm hayaller bir gün tek tek gerçek olacak. 🌟", author: 'Yiğit' },
  { text: "Elini tuttuğum ilk andan beri kalbimin tek sahibi sensin. 💕", author: 'Yiğit' },
  { text: "Sen benim bu dünyadaki en güzel sürprizimsin! ✨", author: 'Yiğit' }
];

let activeLoveNotes = [...defaultSweetQuotes];
let lastNoteIndex = -1;

function getRandomLoveNote() {
  const currentList = activeLoveNotes.length > 0 ? activeLoveNotes : defaultSweetQuotes;
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * currentList.length);
  } while (randomIndex === lastNoteIndex && currentList.length > 1);

  lastNoteIndex = randomIndex;
  return currentList[randomIndex];
}

function renderNoteDisplay(noteObj, textEl, authorEl) {
  if (!noteObj) return;
  if (textEl) {
    textEl.textContent = `"${noteObj.text}"`;
  }
  if (authorEl) {
    const isBengi = noteObj.author === 'Bengi';
    authorEl.textContent = isBengi ? '— Bengi 🌸' : '— Yiğit 💙';
    authorEl.className = `love-note-author-badge ${isBengi ? 'love-note-author-badge--bengi' : 'love-note-author-badge--yigit'}`;
  }
}

function initSurpriseButton() {
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseModal = document.getElementById('surpriseModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const surpriseQuoteText = document.getElementById('surpriseQuoteText');
  const surpriseQuoteSub = document.getElementById('surpriseQuoteSub');
  const anotherQuoteBtn = document.getElementById('anotherQuoteBtn');
  const backdrop = surpriseModal ? surpriseModal.querySelector('.modal__backdrop') : null;

  if (!surpriseBtn || !surpriseModal) return;

  // Firebase Realtime DB dinleyicisi: lovenotes düğümü değişince otomatik listeyi günceller
  if (typeof dbListenLoveNotes === 'function') {
    dbListenLoveNotes((firebaseNotes) => {
      if (firebaseNotes && firebaseNotes.length > 0) {
        activeLoveNotes = firebaseNotes;
      } else {
        activeLoveNotes = [...defaultSweetQuotes];
      }

      // Site her açıldığında veya yenilendiğinde bu koleksiyondan rastgele bir not çekip ekrana bassın
      if (!window.hasLoadedInitialLoveNote) {
        window.hasLoadedInitialLoveNote = true;
        displayRandomLoveNoteOnLoad();
      }
    });
  }

  function displayRandomLoveNoteOnLoad() {
    const loveNoteEl = document.getElementById('surpriseLoveNote');
    const loveNoteAuthorEl = document.getElementById('surpriseLoveNoteAuthor');
    const note = getRandomLoveNote();
    renderNoteDisplay(note, loveNoteEl, loveNoteAuthorEl);
  }

  function showSurprise() {
    const note = getRandomLoveNote();
    renderNoteDisplay(note, surpriseQuoteText, surpriseQuoteSub);

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
      const note = getRandomLoveNote();
      renderNoteDisplay(note, surpriseQuoteText, surpriseQuoteSub);
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

/* --- 2.5 Inline Love Note Submitting System --- */
function initInlineLoveNoteForm() {
  const form = document.getElementById('inlineAddNoteForm');
  const toastMsg = document.getElementById('inlineAddNoteSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const noteTextEl = document.getElementById('inlineNoteText');
    const selectedAuthorEl = form.querySelector('input[name="inlineNoteAuthor"]:checked');

    const text = noteTextEl ? noteTextEl.value.trim() : '';
    const author = selectedAuthorEl ? selectedAuthorEl.value : 'Bengi';

    if (!text) return;

    const noteData = {
      text: text,
      author: author,
      timestamp: Date.now()
    };

    if (typeof dbAddLoveNote === 'function') {
      dbAddLoveNote(noteData);
    }

    form.reset();

    // Reset sonrası varsayılan Bengi seçimini koru
    const bengiRadio = form.querySelector('input[name="inlineNoteAuthor"][value="Bengi"]');
    if (bengiRadio) bengiRadio.checked = true;

    // Konfeti patlat
    if (typeof triggerConfettiExplosion === 'function') {
      triggerConfettiExplosion();
    }

    // Onay rozeti göster
    if (toastMsg) {
      toastMsg.style.display = 'inline-flex';
      setTimeout(() => {
        toastMsg.style.display = 'none';
      }, 4000);
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

/* --- 5. Complaint Box System (Firebase Realtime DB) --- */
const COMPLAINT_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  RESOLVED: 'resolved'
};

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

    // Sort by date (newest first — push key based)
    const sortedComplaints = [...complaints].sort((a, b) => {
      return (b.id || '') > (a.id || '') ? 1 : -1;
    });

    sortedComplaints.forEach((c) => {
      const item = document.createElement('div');
      item.className = 'complaint-item';

      let statusClass = 'complaint-item__status--pending';
      let statusText = 'Savunma Bekliyor ⏳';
      if (c.status === COMPLAINT_STATUS.UNDER_REVIEW) {
        statusClass = 'complaint-item__status--under-review';
        statusText = 'İncelemede 🔍';
      } else if (c.status === COMPLAINT_STATUS.RESOLVED) {
        statusClass = 'complaint-item__status--resolved';
        statusText = 'Affedildi 💕';
      }

      let actionBtnHtml = '';
      if (c.status !== COMPLAINT_STATUS.RESOLVED) {
        actionBtnHtml = `<button class="complaint-item__action-btn" data-id="${c.id}">Affet 💕</button>`;
      }

      let rightSideHtml = '';
      if (c.status === COMPLAINT_STATUS.PENDING) {
        rightSideHtml = `
          <div class="complaint-item__defense-form">
            <textarea class="complaint-item__defense-input" placeholder="Tatlı bir savunma yaz..." data-id="${c.id}"></textarea>
            <button class="complaint-item__defense-submit-btn" data-id="${c.id}">Savun 🚀</button>
          </div>
        `;
      } else if (c.status === COMPLAINT_STATUS.UNDER_REVIEW) {
        rightSideHtml = `
          <div class="complaint-item__defense-container">
            <span class="complaint-item__defense-text"><strong>Savunma:</strong> ${c.defense || ''}</span>
            <span class="complaint-item__status-badge complaint-item__status-badge--under-review">İncelemede 🔍</span>
          </div>
        `;
      } else if (c.status === COMPLAINT_STATUS.RESOLVED) {
        rightSideHtml = `
          <div class="complaint-item__defense-container">
            <span class="complaint-item__defense-text"><strong>Savunma:</strong> ${c.defense || 'Savunma yapılmadan affedildi 🌸'}</span>
          </div>
        `;
      }

      item.innerHTML = `
        <div class="complaint-item__header">
          <span class="complaint-item__title">${c.type}</span>
          <span class="complaint-item__date">${c.date}</span>
        </div>
        <div class="complaint-item__body">
          <div class="complaint-item__left">
            <p class="complaint-item__text">${c.detail}</p>
          </div>
          <div class="complaint-item__right">
            ${rightSideHtml}
          </div>
        </div>
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
        if (typeof dbUpdateComplaint === 'function') {
          dbUpdateComplaint(id, { status: COMPLAINT_STATUS.RESOLVED });
        }
        triggerConfettiExplosion();
      });
    });

    // Bind defense submit buttons
    const defenseSubmitBtns = complaintsList.querySelectorAll('.complaint-item__defense-submit-btn');
    defenseSubmitBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const textarea = complaintsList.querySelector(`textarea[data-id="${id}"]`);
        const defenseText = textarea ? textarea.value.trim() : '';
        if (!defenseText) return;

        if (typeof dbUpdateComplaint === 'function') {
          dbUpdateComplaint(id, {
            defense: defenseText,
            status: COMPLAINT_STATUS.UNDER_REVIEW
          });
        }
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
      status: COMPLAINT_STATUS.PENDING
    };

    if (typeof dbAddComplaint === 'function') {
      dbAddComplaint(newComplaint);
    }
    form.reset();
    triggerConfettiExplosion();
  });

  // Real-time listener
  if (typeof dbListenComplaints === 'function') {
    dbListenComplaints((complaints) => {
      renderComplaints(complaints);
    });
  }
}

/* --- 6. Birthday Countdown & Celebration System --- */
// Orijinal Doğum Günü Zaman Ayarları (21 Temmuz 00:00)
const TARGET_BIRTHDAY_TIME = new Date('2026-07-21T00:00:00+03:00').getTime();
const END_BIRTHDAY_TIME = TARGET_BIRTHDAY_TIME + (24 * 60 * 60 * 1000);

function initBirthdayCountdown() {
  const countdownDays = document.getElementById('countdownDays');
  const countdownHours = document.getElementById('countdownHours');
  const countdownMinutes = document.getElementById('countdownMinutes');
  const countdownSeconds = document.getElementById('countdownSeconds');
  const countdownCard = document.getElementById('birthdayCountdownCard');

  if (!countdownCard) return;

  let countdownInterval = null;

  function checkTimeAndTrigger() {
    const now = Date.now();

    // 21 Temmuz günü boyunca (hedef zamandan sonraki 24 saat boyunca)
    if (now >= TARGET_BIRTHDAY_TIME && now <= END_BIRTHDAY_TIME) {
      if (countdownInterval) clearInterval(countdownInterval);

      // Geri sayım alanını tebrik mesajına dönüştür
      countdownCard.innerHTML = `
        <div class="birthday-celebration-text">
          İyi ki doğdun Aşkımm, nice beraber musmutlu yıllaraa! ❤️🎂🎉❤️
        </div>
      `;

      // Balonları uçur ve modalı aç
      if (!window.isBirthdayCelebrated) {
        window.isBirthdayCelebrated = true;
        triggerBirthdayCelebration();
      }
      return true;
    } else if (now > END_BIRTHDAY_TIME) {
      // Doğum günü üzerinden 24 saat geçmişse sayacı kapat
      if (countdownInterval) clearInterval(countdownInterval);
      countdownCard.innerHTML = `
        <div class="birthday-celebration-text" style="color: var(--text-muted); font-size: 0.9rem;">
          Birlikte nice güzel yaşlara sevgilim... 💕
        </div>
      `;
      return true;
    }
    return false;
  }

  // İlk kontrol
  const isTriggered = checkTimeAndTrigger();
  if (isTriggered) return;

  // Saniye saniye güncelleme
  countdownInterval = setInterval(() => {
    const now = Date.now();
    const difference = TARGET_BIRTHDAY_TIME - now;

    if (difference <= 0) {
      clearInterval(countdownInterval);
      checkTimeAndTrigger();
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (countdownDays) countdownDays.textContent = String(days).padStart(2, '0');
    if (countdownHours) countdownHours.textContent = String(hours).padStart(2, '0');
    if (countdownMinutes) countdownMinutes.textContent = String(minutes).padStart(2, '0');
    if (countdownSeconds) countdownSeconds.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

function triggerBirthdayCelebration() {
  const birthdayModal = document.getElementById('birthdayModal');
  if (!birthdayModal) return;

  // Modalı göster
  birthdayModal.classList.add('active');
  birthdayModal.setAttribute('aria-hidden', 'false');

  // Balonları uçurmaya başla
  startBirthdayBalloons();

  // Konfeti patlaması
  triggerConfettiExplosion();
  setTimeout(triggerConfettiExplosion, 500);
  setTimeout(triggerConfettiExplosion, 1200);

  // Kapatma eventlerini bağla
  const closeBtn = document.getElementById('birthdayModalCloseBtn');
  const celebrateBtn = document.getElementById('birthdayCelebrateBtn');
  const backdrop = birthdayModal.querySelector('.modal__backdrop');

  function closeBirthdayModal() {
    birthdayModal.classList.remove('active');
    birthdayModal.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeBirthdayModal);
  if (celebrateBtn) celebrateBtn.addEventListener('click', () => {
    closeBirthdayModal();
    triggerConfettiExplosion();
    setTimeout(triggerConfettiExplosion, 400);
  });
  if (backdrop) backdrop.addEventListener('click', closeBirthdayModal);
}

function startBirthdayBalloons() {
  let container = document.getElementById('birthdayBalloonContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'birthdayBalloonContainer';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9998';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);
  }

  const pastelColors = [
    '#FFB7B2', // Pink
    '#FFDAC1', // Peach
    '#E2F0CB', // Yellow
    '#B5C99A', // Sage
    '#BFFCC6', // Mint
    '#C7CEEA', // Blue
    '#E8DFF5', // Lavender
    '#FFD1DC'  // Rose
  ];

  function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'birthday-balloon';

    const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    balloon.style.backgroundColor = randomColor;

    const randomLeft = Math.random() * 90 + 5; // 5vw - 95vw
    balloon.style.left = `${randomLeft}vw`;

    const randomScale = Math.random() * 0.4 + 0.8; // 0.8 - 1.2
    balloon.style.transform = `scale(${randomScale})`;

    const randomDuration = Math.random() * 3 + 5; // 5s - 8s
    balloon.style.animationDuration = `${randomDuration}s`;

    const stringEl = document.createElement('div');
    stringEl.className = 'birthday-balloon__string';
    balloon.appendChild(stringEl);

    container.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, randomDuration * 1000);
  }

  // Başlangıçta toplu balon uçur
  for (let i = 0; i < 20; i++) {
    setTimeout(createBalloon, Math.random() * 2500);
  }

  // 30 saniye boyunca her 400ms'de bir yeni balon uçur
  const balloonInterval = setInterval(() => {
    if (container.children.length < 35) {
      createBalloon();
    }
  }, 400);

  setTimeout(() => {
    clearInterval(balloonInterval);
  }, 30000);
}
