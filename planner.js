/* ==========================================
   BENGİSİTE - INTERACTIVE DATE PLANNER SYSTEM
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDatePlanner();
});

function initDatePlanner() {
  const form = document.getElementById('dateProposalForm');
  const saveOnlyBtn = document.getElementById('saveDateBtn');
  const savedDatesList = document.getElementById('savedDatesList');
  const upcomingPanel = document.getElementById('upcomingDatePanel');
  const upcomingTitle = document.getElementById('upcomingDateTitle');
  const upcomingCountdown = document.getElementById('upcomingDateCountdown');
  const upcomingDetail = document.getElementById('upcomingDateDetail');

  if (!form || !saveOnlyBtn || !savedDatesList) return;

  const MY_PHONE_NUMBER = ''; // Boş bırakılırsa WhatsApp, kullanıcının alıcıyı seçmesini sağlar.
  let currentPlans = [];

  // LocalStorage Fallback Reader
  function getLocalPlans() {
    try {
      return JSON.parse(localStorage.getItem('datePlans')) || [];
    } catch (e) {
      return [];
    }
  }

  // Helper: Format YYYY-MM-DD to DD.MM.YYYY
  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  }

  // Tarih karşılaştırma: Plan tarihinin geçip geçmediğini kontrol eder
  function isPlanActive(dateStr) {
    if (!dateStr) return false;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return true;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const planDate = new Date(parts[0], parts[1] - 1, parts[2]);
    planDate.setHours(0, 0, 0, 0);

    // Gün cinsinden fark (planDate - today)
    const diffTime = planDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Tarihi geçmediyse (bugün veya gelecekteyse) aktiftir
    return diffDays >= 0;
  }

  // 1. Render Saved Plans
  function renderPlans(plans) {
    currentPlans = plans || [];

    // Kullanıcının kuralı: Date tarihinden sonra otomatik kaybolsun, tarihi geçene kadar kalsın.
    const activePlans = currentPlans.filter(p => isPlanActive(p.date));

    savedDatesList.innerHTML = '';

    if (activePlans.length === 0) {
      savedDatesList.innerHTML = '<p class="planner-list__empty">Henüz kaydedilmiş aktif plan yok! 🥰</p>';
      updateCountdown([]);
      return;
    }

    // Sort plans by date (newest created first)
    const sortedPlans = [...activePlans].sort((a, b) => {
      return (b.id || '') > (a.id || '') ? 1 : -1;
    });

    sortedPlans.forEach((plan) => {
      const item = document.createElement('div');
      item.className = 'planner-item';

      const formattedDate = formatDisplayDate(plan.date);
      const noteText = plan.note ? plan.note : 'Yok (Sadece sen ol yeter 💕)';

      item.innerHTML = `
        <div class="planner-item__header">
          <span class="planner-item__title">${plan.activity}</span>
          <span class="planner-item__date">${formattedDate} - ${plan.time}</span>
        </div>
        <p class="planner-item__note">💬 <strong>Not:</strong> ${noteText}</p>
        <div class="planner-item__footer">
          <button class="planner-item__delete-btn" data-id="${plan.id}" title="Planı Sil">Sil 🗑️</button>
        </div>
      `;

      savedDatesList.appendChild(item);
    });

    // Bind delete event listeners
    const deleteBtns = savedDatesList.querySelectorAll('.planner-item__delete-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        deletePlan(id);
      });
    });

    updateCountdown(activePlans);
  }

  // 2. Delete Plan
  function deletePlan(id) {
    if (typeof dbDeletePlan === 'function') {
      dbDeletePlan(id);
    }
    // LocalStorage yedeklemesinden de sil
    let local = getLocalPlans().filter(p => p.id !== id);
    localStorage.setItem('datePlans', JSON.stringify(local));
  }

  // 3. Calculate and Update Upcoming Countdown Alert (Tarihi gerçekleşene kadar durur)
  function updateCountdown(plans) {
    if (!upcomingPanel || !upcomingTitle || !upcomingCountdown || !upcomingDetail) return;

    if (!plans || plans.length === 0) {
      upcomingPanel.style.display = 'none';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let closest = null;

    plans.forEach(plan => {
      if (!plan.date) return;
      const parts = plan.date.split('-');
      if (parts.length !== 3) return;

      const planDate = new Date(parts[0], parts[1] - 1, parts[2]);
      planDate.setHours(0, 0, 0, 0);

      const diffTime = planDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Sadece gelecekteki veya bugünkü planlar (7 gün kısıtlaması kaldırıldı, tarihi geçene kadar görünür)
      if (diffDays >= 0) {
        if (!closest || diffDays < closest.daysLeft) {
          closest = { plan, daysLeft: diffDays };
        }
      }
    });

    if (!closest) {
      upcomingPanel.style.display = 'none';
      return;
    }

    // Render Countdown UI
    const formattedDate = formatDisplayDate(closest.plan.date);

    if (closest.daysLeft === 0) {
      upcomingTitle.textContent = 'Bugün Buluşma Günümüz! 🥰';
      upcomingCountdown.textContent = 'Date günümüz geldi çattı! Bugün harika vakit geçireceğiz. 💕';
    } else if (closest.daysLeft === 1) {
      upcomingTitle.textContent = 'Yarın Buluşuyoruz! 🌸';
      upcomingCountdown.textContent = 'Date günümüze son 1 gün kaldı! Hazır mısın? 💕';
    } else {
      upcomingTitle.textContent = 'Yaklaşan Date Planımız! 💖';
      upcomingCountdown.textContent = `Date günümüze son ${closest.daysLeft} gün kaldı! 💕`;
    }

    upcomingDetail.textContent = `${closest.plan.activity} - ${formattedDate} (${closest.plan.time})`;
    upcomingPanel.style.display = 'flex';
  }

  // 4. Form Data Collection Helper
  function getFormData() {
    const date = document.getElementById('proposalDate').value;
    const time = document.getElementById('proposalTime').value;
    const activity = document.getElementById('proposalActivity').value;
    const note = document.getElementById('proposalNote').value.trim();

    if (!date || !time || !activity) return null;

    return {
      date,
      time,
      activity,
      note
    };
  }

  // 5. Button 1: Save Only
  saveOnlyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const newPlan = getFormData();

    if (!newPlan) {
      form.reportValidity();
      return;
    }

    if (typeof dbAddPlan === 'function') {
      dbAddPlan(newPlan);
    }
    
    // LocalStorage yedeklemesine de ekle
    let local = getLocalPlans();
    local.push({ ...newPlan, id: Date.now().toString() });
    localStorage.setItem('datePlans', JSON.stringify(local));

    form.reset();

    if (typeof triggerConfettiExplosion === 'function') {
      triggerConfettiExplosion();
    }
  });

  // 6. Button 2: Save & Send via WhatsApp
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPlan = getFormData();

    if (!newPlan) return;

    if (typeof dbAddPlan === 'function') {
      dbAddPlan(newPlan);
    }

    // LocalStorage yedeklemesine de ekle
    let local = getLocalPlans();
    local.push({ ...newPlan, id: Date.now().toString() });
    localStorage.setItem('datePlans', JSON.stringify(local));

    form.reset();

    const formattedDate = formatDisplayDate(newPlan.date);
    const noteLine = newPlan.note ? `\n💬 *Not:* ${newPlan.note}` : '';

    const message = `Bengi'm ile Harika Bir Date Planı! 💕\n\n` +
                    `📅 *Tarih:* ${formattedDate}\n` +
                    `⏰ *Saat:* ${newPlan.time}\n` +
                    `✨ *Aktivite:* ${newPlan.activity}${noteLine}\n\n` +
                    `Seninle buluşmak için sabırsızlanıyorum! 🥰`;

    const encodedMessage = encodeURIComponent(message);
    let whatsappUrl = '';

    if (MY_PHONE_NUMBER) {
      whatsappUrl = `https://api.whatsapp.com/send?phone=${MY_PHONE_NUMBER}&text=${encodedMessage}`;
    } else {
      whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    }

    if (typeof triggerConfettiExplosion === 'function') {
      triggerConfettiExplosion();
    }

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 800);
  });

  // 7. Realtime Firebase Listener & Auto Migration from LocalStorage
  if (typeof dbListenPlans === 'function') {
    dbListenPlans((firebasePlans) => {
      const localPlans = getLocalPlans();

      // Firebase henüz boş ama yerel depolamada eski kayıtlı plan varsa otomatik Firebase'e taşı
      if ((!firebasePlans || firebasePlans.length === 0) && localPlans.length > 0) {
        localPlans.forEach(p => {
          if (typeof dbAddPlan === 'function') {
            dbAddPlan(p);
          }
        });
        renderPlans(localPlans);
      } else {
        renderPlans(firebasePlans);
      }
    });
  } else {
    // Fallback if Firebase not loaded
    renderPlans(getLocalPlans());
  }
}
