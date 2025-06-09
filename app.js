// app.js - Last War Nexus (master version, June 2025)
// Loads all event/game data from data.json for easy updates and scalability

let appData = null;
let currentSettings = {
  viewMode: 'priority',
  timeDisplay: 'utc',
  infoLevel: 'simple',
  calendarView: 'full-week'
};
let appInterval = null;
const DOMElements = {};

// --- Utility: DOM Cache ---
function cacheDOMElements() {
  [
    'nav-pills', 'time-display', 'info-level', 'calendar-view', 'close-modal-button',
    'detail-modal', 'priority-section', 'schedule-section', 'intelligence-section',
    'current-time', 'current-vs-day', 'current-arms-phase', 'action-icon', 'action-text',
    'reset-warning', 'countdown-timer', 'next-event-info', 'next-event-time',
    'high-priority-grid', 'complete-schedule-grid', 'modal-body'
  ].forEach(id => { DOMElements[id] = document.getElementById(id); });
}

// --- Utility: Initialization ---
function setupEventListeners() {
  DOMElements['nav-pills']?.addEventListener('click', handleNavPillClick);
  DOMElements['time-display']?.addEventListener('change', handleControlChange);
  DOMElements['info-level']?.addEventListener('change', handleControlChange);
  DOMElements['calendar-view']?.addEventListener('change', handleControlChange);
  DOMElements['close-modal-button']?.addEventListener('click', closeDetailModal);
  DOMElements['detail-modal']?.addEventListener('click', (event) => {
    if (event.target === DOMElements['detail-modal']) closeDetailModal();
  });
}

// --- Utility: Data Loading ---
async function loadAppData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('Failed to fetch data.json');
    appData = await res.json();
    initializeApp();
  } catch (err) {
    console.error('Error loading data.json:', err);
    showCriticalError('Failed to load game data. Please refresh or contact support.');
  }
}

function showCriticalError(msg) {
  document.body.innerHTML = `<div style="color:#fff;background:#1E1E1E;padding:2em;text-align:center;">
    <h2>Site Error</h2><p>${msg}</p></div>`;
}

// --- Initialization: Main Entry ---
function initializeApp() {
  cacheDOMElements();
  setupEventListeners();
  populateIntelligenceHub();
  updateDynamicContent();
  updateAllDisplays();
  if (appInterval) clearInterval(appInterval);
  appInterval = setInterval(updateAllDisplays, 1000);
}

// --- Navigation & Controls ---
function handleNavPillClick(event) {
  const target = event.target.closest('.nav-pill');
  if (target) {
    document.querySelectorAll('.nav-pill').forEach(pill => pill.classList.remove('active'));
    target.classList.add('active');
    currentSettings.viewMode = target.dataset.view;
    updateDynamicContent();
  }
}

function handleControlChange(event) {
  const controlId = event.target.id.split('-')[0];
  currentSettings[controlId] = event.target.value;
  updateDynamicContent();
  updateCountdown();
}

// --- Main Update Loop ---
function updateAllDisplays() {
  updateCurrentTime();
  updateCurrentStatus();
  updateCountdown();
}

// --- Live Time/Status ---
function updateCurrentTime() {
  const now = new Date();
  if (DOMElements['current-time']) {
    DOMElements['current-time'].textContent = currentSettings.timeDisplay === 'utc'
      ? now.toUTCString().slice(17, 25)
      : now.toLocaleTimeString();
  }
}

function updateCurrentStatus() {
  const { utcDay, utcHour, utcMinute } = getCurrentUTCInfo();
  const vsDayData = getVSDayData(utcDay);
  const armsPhase = getArmsRacePhase(utcHour);
  const alignment = getAlignment(utcDay, armsPhase.name);

  if (DOMElements['current-vs-day']) DOMElements['current-vs-day'].textContent = vsDayData.title;
  if (DOMElements['current-arms-phase']) DOMElements['current-arms-phase'].textContent = `${armsPhase.icon} ${armsPhase.name}`;

  if (utcHour === 0 && utcMinute < 5) {
    DOMElements['reset-warning']?.classList.remove('hidden');
    DOMElements['action-icon']?.textContent = '⏳';
    DOMElements['action-text']?.innerHTML = '<strong>No Points Period:</strong> Wait for server reset to finish.';
  } else {
    DOMElements['reset-warning']?.classList.add('hidden');
    if (alignment) {
      DOMElements['action-icon']?.textContent = '⚡';
      DOMElements['action-text']?.innerHTML = `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason}`;
    } else {
      const activities = appData.arms_race_phases.find(p => p.name === armsPhase.name)?.activities;
      DOMElements['action-icon']?.textContent = armsPhase.icon;
      DOMElements['action-text']?.innerHTML = `<strong>Normal Phase:</strong> Focus on ${activities ? activities[0] : 'general tasks'}.`;
    }
  }
}

// --- Countdown Logic ---
function updateCountdown() {
  const nextWindow = getNextHighPriorityWindow();
  if (!DOMElements['countdown-timer']) return;

  if (!nextWindow) {
    DOMElements['countdown-timer'].textContent = 'No upcoming events';
    DOMElements['next-event-info'].textContent = '';
    DOMElements['next-event-time'].textContent = '';
    return;
  }

  const now = new Date();
  const timeDiff = nextWindow.startTime - now;
  if (timeDiff <= 0) {
    DOMElements['countdown-timer'].textContent = "ACTIVE";
    DOMElements['next-event-info'].textContent = `${nextWindow.armsPhase.name} + ${nextWindow.vsDayData.title}`;
    DOMElements['next-event-time'].textContent = '';
    return;
  }

  const hours = Math.floor(timeDiff / 3600000);
  const minutes = Math.floor((timeDiff % 3600000) / 60000);
  DOMElements['countdown-timer'].textContent = `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
  DOMElements['next-event-info'].textContent = `Next up: ${nextWindow.armsPhase.name}`;
  const localTime = nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const utcTime = nextWindow.startTime.toUTCString().slice(17, 22);
  DOMElements['next-event-time'].textContent = currentSettings.timeDisplay === 'utc'
    ? `at ${utcTime} UTC` : `at ${localTime} Local`;
}

// --- Dynamic Content Generation ---
function updateDynamicContent() {
  document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
  const activeSection = DOMElements[`${currentSettings.viewMode}-section`];
  if (activeSection) activeSection.classList.remove('hidden');

  if (currentSettings.viewMode === 'priority') {
    updateHighPriorityDisplay();
  } else if (currentSettings.viewMode === 'schedule') {
    updateCompleteScheduleDisplay();
  }
}

// --- High Priority Grid ---
function updateHighPriorityDisplay() {
  const container = DOMElements['high-priority-grid'];
  if (!container) return;
  container.innerHTML = '';
  container.classList.remove('loading');

  const { utcDay, utcHour } = getCurrentUTCInfo();
  getAllHighPriorityWindows().forEach(window => {
    const isActive = (window.vsDay === utcDay) && (window.hour <= utcHour && utcHour < (window.hour + 4));
    const card = document.createElement('div');
    card.className = `priority-card${isActive ? ' active' : ''}`;
    card.innerHTML = `
      <div class="priority-badge">MAX VALUE</div>
      <div class="priority-header">
        <div class="priority-day">${window.vsDayData.name}</div>
        <div class="priority-time">${String(window.hour).padStart(2, '0')}:00 - ${String((window.hour + 4) % 24).padStart(2, '0')}:00 UTC</div>
      </div>
      <div class="priority-phases">
        <div class="phase-details">
          <div class="phase-name">${window.armsPhase.icon} ${window.armsPhase.name}</div>
          <div class="phase-alignment">VS: ${window.vsDayData.title}</div>
        </div>
      </div>
      <div class="priority-action">
        <strong>Focus:</strong> ${window.alignment.reason}
      </div>
    `;
    card.addEventListener('click', () => showDetailModal(window.alignment, window.vsDayData, window.armsPhase));
    container.appendChild(card);
  });
}

// --- Schedule Table ---
function updateCompleteScheduleDisplay() {
  const container = DOMElements['complete-schedule-grid'];
  if (!container) return;
  container.innerHTML = '';
  container.classList.remove('loading');

  const headers = ['Day/Time', '00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  headers.forEach(h => {
    const headerCell = document.createElement('div');
    headerCell.className = 'table-header';
    headerCell.textContent = h;
    container.appendChild(headerCell);
  });

  const daysToShow = currentSettings.calendarView === 'current'
    ? [getVSDayData(new Date().getUTCDay())]
    : appData.vs_days;

  daysToShow.forEach(vsDayData => {
    if (!vsDayData) return;
    const row = document.createElement('div');
    row.className = 'table-row';

    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header-cell';
    dayHeader.textContent = vsDayData.name;
    row.appendChild(dayHeader);

    for (let h = 0; h < 24; h += 4) {
      const armsPhase = getArmsRacePhase(h);
      const cell = document.createElement('div');
      cell.className = 'table-cell';
      cell.setAttribute('data-time', `${String(h).padStart(2, '0')}:00`);

      const alignment = getAlignment(vsDayData.day, armsPhase.name);
      if (alignment) cell.classList.add('high-priority');

      const { utcDay, utcHour } = getCurrentUTCInfo();
      if (vsDayData.day === utcDay && h <= utcHour && utcHour < h + 4) cell.classList.add('current');

      cell.innerHTML = `<div class="slot-phase">${armsPhase.icon} ${armsPhase.name}</div>`;
      if (alignment && currentSettings.infoLevel === 'detailed') {
        cell.innerHTML += `<div class="slot-reason">${alignment.reason}</div>`;
      }
      cell.addEventListener('click', () => showDetailModal(alignment, vsDayData, armsPhase));
      row.appendChild(cell);
    }
    container.appendChild(row);
  });
}

// --- Intelligence Hub (Accordion) ---
function populateIntelligenceHub() {
  const container = DOMElements['intelligence-section'];
  if (!container) return;
  container.innerHTML = `<div class="intelligence-hub" id="intelligence-hub-content"></div>`;
  const content = document.getElementById('intelligence-hub-content');
  if (!content) return;

  const sections = {
    'guides': '📚 Game Guides',
    'tips': '💡 Pro Tips & Tricks',
    'season4': '🚀 Season 4 Updates'
  };

  for (const [key, title] of Object.entries(sections)) {
    if (!appData.intelligence[key]) continue;
    const sectionHTML = `
      <div class="accordion-item">
        <div class="accordion-header">${title}</div>
        <div class="accordion-content">
          <div class="content-inner">
            ${appData.intelligence[key].map(item => `
              <h4>${item.title}</h4>
              <p>${item.content}</p>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    content.innerHTML += sectionHTML;
  }

  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', (event) => {
      const item = event.currentTarget.parentElement;
      item.classList.toggle('active');
      const content = event.currentTarget.nextElementSibling;
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// --- Modal Logic ---
function showDetailModal(alignment, vsDayData, armsPhase) {
  if (!alignment) return;
  const modal = DOMElements['detail-modal'];
  const modalBody = DOMElements['modal-body'];
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <h2>${armsPhase.icon} ${armsPhase.name} + ${vsDayData.title}</h2>
    <div class="modal-section">
      <h4>⭐ High Priority Alignment</h4>
      <p>${alignment.reason}</p>
    </div>
    <div class="modal-section">
      <h4>🎯 Arms Race Focus</h4>
      <p>${armsPhase.activities ? armsPhase.activities.join(', ') : ''}</p>
    </div>
    <div class="modal-section">
      <h4>🏆 VS Event Goal</h4>
      <p>${vsDayData.activities ? vsDayData.activities.join(', ') : ''}</p>
    </div>
  `;
  modal.style.display = 'flex';
}

function closeDetailModal() {
  DOMElements['detail-modal']?.style.display = 'none';
}

// --- Data Access Helpers ---
function getCurrentUTCInfo() {
  const now = new Date();
  return { utcDay: now.getUTCDay(), utcHour: now.getUTCHours(), utcMinute: now.getUTCMinutes() };
}
function getVSDayData(utcDay) { return appData.vs_days.find(d => d.day === utcDay); }
function getArmsRacePhase(utcHour) { return appData.arms_race_phases[Math.floor(utcHour / 4) % 6]; }
function getAlignment(utcDay, armsPhaseName) { return appData.high_priority_alignments.find(a => a.vs_day === utcDay && a.arms_phase === armsPhaseName); }
function getAllHighPriorityWindows() {
  const windows = [];
  appData.high_priority_alignments.forEach(alignment => {
    const vsDayData = getVSDayData(alignment.vs_day);
    const armsPhase = appData.arms_race_phases.find(p => p.name === alignment.arms_phase);
    if (vsDayData && armsPhase) {
      for (let h = 0; h < 24; h += 4) {
        if (getArmsRacePhase(h).name === alignment.arms_phase) {
          windows.push({ vsDay: alignment.vs_day, vsDayData, armsPhase, alignment, hour: h });
        }
      }
    }
  });
  return windows;
}
function getNextHighPriorityWindow() {
  const now = new Date();
  const potentialWindows = [];
  for (let dayOffset = 0; dayOffset < 8; dayOffset++) {
    const targetDate = new Date();
    targetDate.setUTCDate(targetDate.getUTCDate() + dayOffset);
    const targetDay = targetDate.getUTCDay();

    appData.high_priority_alignments.forEach(alignment => {
      if (alignment.vs_day !== targetDay) return;
      const armsPhase = appData.arms_race_phases.find(p => p.name === alignment.arms_phase);
      if (!armsPhase) return;
      for (let h = 0; h < 24; h += 4) {
        if (getArmsRacePhase(h).name === alignment.arms_phase) {
          const eventTime = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate(), h, 0, 0));
          if (eventTime > now) {
            potentialWindows.push({
              startTime: eventTime,
              vsDay: alignment.vs_day,
              vsDayData: getVSDayData(alignment.vs_day),
              armsPhase: armsPhase,
              alignment: alignment,
              hour: h
            });
          }
        }
      }
    });
  }
  if (potentialWindows.length === 0) return null;
  potentialWindows.sort((a, b) => a.startTime - b.startTime);
  return potentialWindows[0];
}

// --- Start the App ---
document.addEventListener('DOMContentLoaded', loadAppData);
