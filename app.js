// Last War Nexus - Complete Working Version
const appData = {
  arms_race_phases: [
    {id: 1, name: "City Building", icon: "🏗️", color: "#4CAF50", activities: ["Building upgrades", "Construction speedups"]},
    {id: 2, name: "Unit Progression", icon: "⚔️", color: "#FF9800", activities: ["Troop training", "Training speedups"]},
    {id: 3, name: "Tech Research", icon: "🔬", color: "#2196F3", activities: ["Research completion", "Research speedups"]},
    {id: 4, name: "Drone Boost", icon: "🚁", color: "#9C27B0", activities: ["Stamina usage", "Drone activities"]},
    {id: 5, name: "Hero Advancement", icon: "⭐", color: "#FF5722", activities: ["Hero recruitment", "Hero EXP"]},
    {id: 6, name: "Mixed Phase", icon: "🔄", color: "#607D8B", activities: ["Check in-game calendar"]}
  ],
  vs_days: [
    {day: 0, name: "Sunday", title: "Preparation Day", objective: "No VS events - prepare for Monday", activities: ["Save radar missions", "Prepare building upgrades", "Stock resources"]},
    {day: 1, name: "Monday", title: "Radar Training", objective: "Stamina, radar missions, hero EXP, drone data/parts", activities: ["Complete radar missions", "Use stamina for attacks/rallies", "Train drones with combat data", "Use hero EXP (2000+ at once)", "Apply drone parts"]},
    {day: 2, name: "Tuesday", title: "Base Expansion", objective: "Building upgrades, construction speedups, recruit survivors", activities: ["Complete building upgrades", "Use construction speedups", "Dispatch legendary truck", "Recruit survivors", "Launch secret tasks"]},
    {day: 3, name: "Wednesday", title: "Age of Science", objective: "Research completion, research speedups, valor badges, drone components", activities: ["Complete research", "Use research speedups", "Use valor badges for research", "Open drone component chests", "Complete radar missions"]},
    {day: 4, name: "Thursday", title: "Train Heroes", objective: "Hero recruitment, hero EXP, hero shards, skill medals", activities: ["Use recruitment tickets", "Apply hero EXP", "Use hero shards", "Apply skill medals", "Use weapon shards"]},
    {day: 5, name: "Friday", title: "Total Mobilization", objective: "All activities (building, research, training)", activities: ["Use all speedup types", "Finish buildings/research", "Train troops", "Use overlord items"]},
    {day: 6, name: "Saturday", title: "Enemy Buster", objective: "Combat, speedups, troop training/healing", activities: ["Attack enemy bases", "Use healing speedups", "Train troops", "Use all speedup types", "Dispatch trucks"]}
  ],
  high_priority_alignments: [
    {vs_day: 1, arms_phase: "Drone Boost", reason: "Stamina/drone activities align perfectly."},
    {vs_day: 1, arms_phase: "Hero Advancement", reason: "Hero EXP activities align."},
    {vs_day: 2, arms_phase: "City Building", reason: "Building activities align perfectly."},
    {vs_day: 3, arms_phase: "Tech Research", reason: "Research activities align perfectly."},
    {vs_day: 3, arms_phase: "Drone Boost", reason: "Drone component activities align."},
    {vs_day: 4, arms_phase: "Hero Advancement", reason: "Hero activities align perfectly."},
    {vs_day: 5, arms_phase: "City Building", reason: "Building component of mobilization."},
    {vs_day: 5, arms_phase: "Unit Progression", reason: "Training component of mobilization."},
    {vs_day: 5, arms_phase: "Tech Research", reason: "Research component of mobilization."},
    {vs_day: 6, arms_phase: "Unit Progression", reason: "Troop training for combat."},
    {vs_day: 6, arms_phase: "City Building", reason: "Construction speedups for defenses."}
  ],
  intelligence: {
    guides: [
      {
        title: "Season 4: Evernight Isle & Copper War",
        content: "Season 4 introduces the Evernight Isle, a mysterious island shrouded in darkness and fog. The new Copper War event features phased narrowing for alliance matchups and new attack/defense roles for Kage no Sato and Koubutai factions."
      },
      {
        title: "Drone Data & Battle Data Tips",
        content: "Battle Data is essential for drone upgrades. Farm Doom Elites, complete radar tasks, and use the Campaign Store for efficient Battle Data collection. Save Battle Data for the Drone Boost phase and VS Duel events for maximum rewards."
      }
    ],
    tips: [
      {
        title: "Resource & Base Optimization",
        content: "Upgrade your Headquarters frequently, use Alliance Help to speed up troop healing, and participate in Bullseye Loot and Zombie Invasion for rewards. Use Monica for increased resource gains and replay lower Honorable Campaign levels for steady farming."
      },
      {
        title: "Combat & Event Strategy",
        content: "Don't attack screens unless you're sure you can flip them; failed attempts can cost you many soldiers. Always check the radar for new survivors, and recruit them to boost your base. For Copper War, focus on alliance coordination and participate in all war declaration stages for best rewards."
      }
    ],
    season4: [
      {
        title: "Season 4: Key Changes",
        content: "Copper War now features 8 rounds, 2 per week, with no cross-warzone city or dig site captures. Faction attack/defense roles switch, and the cap for building defense is increased to 100. The Tesla Coil skill can be used on alliance centers or bases, providing a 21x21 range for 5 minutes."
      },
      {
        title: "Upcoming Hero & Weapon Updates",
        content: "Sarah can now be upgraded to Legendary. Lucius' Exclusive Weapon and Butler's Tesla Coil skill are new for Season 4. Upgrade Violet to UR for powerful bonuses. Check the in-game calendar for event-specific hero and weapon availability."
      }
    ]
  }
};

let currentSettings = {
  viewMode: 'priority',
  timeDisplay: 'utc',
  infoLevel: 'simple',
  calendarView: 'full-week'
};
let appInterval;
const DOMElements = {};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  console.log("Last War Nexus initializing...");
  cacheDOMElements();
  setupEventListeners();
  populateIntelligenceHub();
  updateDynamicContent();
  updateAllDisplays();
  if (appInterval) clearInterval(appInterval);
  appInterval = setInterval(updateAllDisplays, 1000);
});

function cacheDOMElements() {
  const ids = [
    'nav-pills', 'time-display', 'info-level', 'calendar-view', 'close-modal-button',
    'detail-modal', 'priority-section', 'schedule-section', 'intelligence-section',
    'current-time', 'current-vs-day', 'current-arms-phase', 'action-icon', 'action-text',
    'reset-warning', 'countdown-timer', 'next-event-info', 'next-event-time',
    'high-priority-grid', 'complete-schedule-grid', 'modal-body'
  ];
  ids.forEach(id => {
    DOMElements[id] = document.getElementById(id);
  });
}

function setupEventListeners() {
  if (DOMElements['nav-pills']) {
    DOMElements['nav-pills'].addEventListener('click', handleNavPillClick);
  }
  if (DOMElements['time-display']) {
    DOMElements['time-display'].addEventListener('change', handleControlChange);
  }
  if (DOMElements['info-level']) {
    DOMElements['info-level'].addEventListener('change', handleControlChange);
  }
  if (DOMElements['calendar-view']) {
    DOMElements['calendar-view'].addEventListener('change', handleControlChange);
  }
  if (DOMElements['close-modal-button']) {
    DOMElements['close-modal-button'].addEventListener('click', closeDetailModal);
  }
  if (DOMElements['detail-modal']) {
    DOMElements['detail-modal'].addEventListener('click', (event) => {
      if (event.target === DOMElements['detail-modal']) closeDetailModal();
    });
  }
}

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
  const controlId = event.target.id.replace('-', '');
  if (controlId === 'timedisplay') currentSettings.timeDisplay = event.target.value;
  if (controlId === 'infolevel') currentSettings.infoLevel = event.target.value;
  if (controlId === 'calendarview') currentSettings.calendarView = event.target.value;
  updateDynamicContent();
  updateCountdown();
}

function updateAllDisplays() {
  updateCurrentTime();
  updateCurrentStatus();
  updateCountdown();
}

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
    if (DOMElements['reset-warning']) DOMElements['reset-warning'].classList.remove('hidden');
    if (DOMElements['action-icon']) DOMElements['action-icon'].textContent = '⏳';
    if (DOMElements['action-text']) DOMElements['action-text'].innerHTML = '<strong>No Points Period:</strong> Wait for server reset to finish.';
  } else {
    if (DOMElements['reset-warning']) DOMElements['reset-warning'].classList.add('hidden');
    if (alignment) {
      if (DOMElements['action-icon']) DOMElements['action-icon'].textContent = '⚡';
      if (DOMElements['action-text']) DOMElements['action-text'].innerHTML = `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason}`;
    } else {
      if (DOMElements['action-icon']) DOMElements['action-icon'].textContent = armsPhase.icon;
      if (DOMElements['action-text']) DOMElements['action-text'].innerHTML = `<strong>Normal Phase:</strong> Focus on ${armsPhase.activities ? armsPhase.activities[0] : 'general tasks'}.`;
    }
  }
}

function updateCountdown() {
  const nextWindow = getNextHighPriorityWindow();

  if (!nextWindow) {
    if (DOMElements['countdown-timer']) DOMElements['countdown-timer'].textContent = 'No upcoming events';
    if (DOMElements['next-event-info']) DOMElements['next-event-info'].textContent = '';
    if (DOMElements['next-event-time']) DOMElements['next-event-time'].textContent = '';
    return;
  }

  const timeDiff = nextWindow.startTime - new Date();
  if (timeDiff <= 0) {
    if (DOMElements['countdown-timer']) DOMElements['countdown-timer'].textContent = "ACTIVE";
    if (DOMElements['next-event-info']) DOMElements['next-event-info'].textContent = `${nextWindow.armsPhase.name} + ${nextWindow.vsDayData.title}`;
    if (DOMElements['next-event-time']) DOMElements['next-event-time'].textContent = '';
    return;
  }
  
  const hours = Math.floor(timeDiff / 3600000);
  const minutes = Math.floor((timeDiff % 3600000) / 60000);
  if (DOMElements['countdown-timer']) DOMElements['countdown-timer'].textContent = `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
  if (DOMElements['next-event-info']) DOMElements['next-event-info'].textContent = `Next up: ${nextWindow.armsPhase.name}`;
  
  const localTime = nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const utcTime = nextWindow.startTime.toUTCString().slice(17, 22);
  if (DOMElements['next-event-time']) DOMElements['next-event-time'].textContent = currentSettings.timeDisplay === 'utc' ? `at ${utcTime} UTC` : `at ${localTime} Local`;
}

function updateDynamicContent() {
  document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
  const activeSection = DOMElements[`${currentSettings.viewMode}-section`];
  if (activeSection) {
    activeSection.classList.remove('hidden');
  }

  if (currentSettings.viewMode === 'priority') {
    updateHighPriorityDisplay();
  } else if (currentSettings.viewMode === 'schedule') {
    updateCompleteScheduleDisplay();
  }
}

function updateHighPriorityDisplay() {
  const container = DOMElements['high-priority-grid'];
  if (!container) return;
  container.innerHTML = '';

  const { utcDay, utcHour } = getCurrentUTCInfo();
  
  getAllHighPriorityWindows().forEach(window => {
    const isActive = (window.vsDay === utcDay) && (window.hour <= utcHour && utcHour < (window.hour + 4));
    
    const card = document.createElement('div');
    card.className = `priority-card ${isActive ? 'active' : ''}`;
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

function updateCompleteScheduleDisplay() {
  const container = DOMElements['complete-schedule-grid'];
  if (!container) return;
  container.innerHTML = '';

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

function populateIntelligenceHub() {
  const container = DOMElements['intelligence-section'];
  if (!container) return;
  container.innerHTML = `<div class="intelligence-hub" id="intelligence-hub-content"></div>`;
  const content = document.getElementById('intelligence-hub-content');

  const sections = {
    'guides': '📚 Game Guides',
    'tips': '💡 Pro Tips & Tricks',
    'season4': '🚀 Season 4 Updates'
  };

  for (const [key, title] of Object.entries(sections)) {
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
      <p>${armsPhase.activities ? armsPhase.activities.join(', ') : 'General activities'}</p>
    </div>
    <div class="modal-section">
      <h4>🏆 VS Event Goal</h4>
      <p>${vsDayData.activities ? vsDayData.activities.join(', ') : 'General objectives'}</p>
    </div>
  `;
  modal.style.display = 'flex';
}

function closeDetailModal() {
  if (DOMElements['detail-modal']) DOMElements['detail-modal'].style.display = 'none';
}

// Helper functions
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
