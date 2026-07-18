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

  // 1. LocalStorage Operations
  function getPlans() {
    return JSON.parse(localStorage.getItem('datePlans')) || [];
  }

  function savePlans(plans) {
    localStorage.setItem('datePlans', JSON.stringify(plans));
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

  // 2. Render Saved Plans
  function renderPlans() {
    const plans = getPlans();
    savedDatesList.innerHTML = '';

    if (plans.length === 0) {
      savedDatesList.innerHTML = '<p class="planner-list__empty">Henüz kaydedilmiş plan yok! 🥰</p>';
      return;
    }

    // Sort plans by date (newest first)
    const sortedPlans = [...plans].reverse();

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
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        deletePlan(id);
      });
    });
  }

  // 3. Delete Plan
  function deletePlan(id) {
    let plans = getPlans();
    plans = plans.filter(p => p.id !== id);
    savePlans(plans);
    renderPlans();
    updateCountdown();
  }

  // 4. Calculate and Update Upcoming Countdown Alert
  function updateCountdown() {
    if (!upcomingPanel || !upcomingTitle || !upcomingCountdown || !upcomingDetail) return;

    const plans = getPlans();
    if (plans.length === 0) {
      upcomingPanel.style.display = 'none';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activePlans = [];

    plans.forEach(plan => {
      const parts = plan.date.split('-');
      if (parts.length !== 3) return;

      // Create local date object avoiding UTC shift issues
      const planDateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      planDateObj.setHours(0, 0, 0, 0);

      const diffTime = planDateObj.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Consider plan active if it is today or in the future
      if (diffDays >= 0 && diffDays <= 7) {
        activePlans.push({
          plan: plan,
          daysLeft: diffDays
        });
      }
    });

    if (activePlans.length === 0) {
      upcomingPanel.style.display = 'none';
      return;
    }

    // Sort by closest date
    activePlans.sort((a, b) => a.daysLeft - b.daysLeft);
    const closest = activePlans[0];

    // Render Countdown UI
    const formattedDate = formatDisplayDate(closest.plan.date);

    if (closest.daysLeft === 0) {
      upcomingTitle.textContent = 'Bugün Buluşma Günümüz! 🥰';
      upcomingCountdown.textContent = 'Date günümüz geldi çattı! Bugün harika vakit geçireceğiz. 💕';
    } else {
      upcomingTitle.textContent = 'Yaklaşan Date Planımız! 📅';
      upcomingCountdown.innerHTML = `Buluşmamıza son <strong>${closest.daysLeft} gün</strong> kaldı! 💕`;
    }

    upcomingDetail.textContent = `${closest.plan.activity} - 📅 ${formattedDate} - ⏰ ${closest.plan.time}`;
    upcomingPanel.style.display = 'block';
  }

  // Helper: Gather plan data from form inputs
  function getFormData() {
    const dateVal = document.getElementById('proposalDate').value;
    const timeVal = document.getElementById('proposalTime').value;
    const activityVal = document.getElementById('proposalActivity').value;
    const noteVal = document.getElementById('proposalNote').value;

    if (!dateVal || !timeVal || !activityVal) {
      return null;
    }

    const formattedCreatedAt = new Date().toLocaleString('tr-TR');

    return {
      id: Date.now().toString(),
      date: dateVal,
      time: timeVal,
      activity: activityVal,
      note: noteVal,
      createdAt: formattedCreatedAt
    };
  }

  // 5. Save Only Handler
  saveOnlyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const newPlan = getFormData();

    if (!newPlan) {
      // Trigger HTML5 built-in validation by triggering form submit temporarily
      form.reportValidity();
      return;
    }

    const plans = getPlans();
    plans.push(newPlan);
    savePlans(plans);

    // Refresh UI
    renderPlans();
    updateCountdown();
    form.reset();

    // Trigger sweet feedback confetti (from script.js global scope)
    if (typeof triggerConfettiExplosion === 'function') {
      triggerConfettiExplosion();
    }
  });

  // 6. WhatsApp Submit Handler (Save & Send)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPlan = getFormData();
    if (!newPlan) return;

    // Save to localStorage
    const plans = getPlans();
    plans.push(newPlan);
    savePlans(plans);

    // Build WhatsApp message
    const formattedDate = formatDisplayDate(newPlan.date);
    const noteText = newPlan.note ? newPlan.note : 'Yok (Sadece sen ol yeter 💕)';

    const message = `Aşkım, seninle harika bir plan yapalım mı? Buluşma Teklifim:
📅 Tarih: ${formattedDate}
⏰ Saat: ${newPlan.time}
🎈 Aktivite: ${newPlan.activity}
💬 Not: ${noteText}

Ne dersin? 🥰`;

    const encodedMessage = encodeURIComponent(message);
    let whatsappUrl = '';

    if (MY_PHONE_NUMBER) {
      whatsappUrl = `https://api.whatsapp.com/send?phone=${MY_PHONE_NUMBER}&text=${encodedMessage}`;
    } else {
      whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    }

    // Refresh UI
    renderPlans();
    updateCountdown();
    form.reset();

    // Launch confetti and open WhatsApp after delay
    if (typeof triggerConfettiExplosion === 'function') {
      triggerConfettiExplosion();
    }

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 800);
  });

  // Initial Load and Render
  renderPlans();
  updateCountdown();
}
