// --- Application Data ---
const appData = {
  arms_race_phases: [
    {id: 1, name: "City Building", icon: "🏗️", color: "#4CAF50"},
    {id: 2, name: "Unit Progression", icon: "⚔️", color: "#FF9800"},
    {id: 3, name: "Tech Research", icon: "🔬", color: "#2196F3"},
    {id: 4, name: "Drone Boost", icon: "🚁", color: "#9C27B0"},
    {id: 5, name: "Hero Advancement", icon: "⭐", color: "#FF5722"},
    {id: 6, name: "Mixed Phase", icon: "🔄", color: "#607D8B"}
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
    {"vs_day": 1, "arms_phase": "Drone Boost", "reason": "Stamina/drone activities align perfectly."},
    {"vs_day": 1, "arms_phase": "Hero Advancement", "reason": "Hero EXP activities align."},
    {"vs_day": 2, "arms_phase": "City Building", "reason": "Building activities align perfectly."},
    {"vs_day": 3, "arms_phase": "Tech Research", "reason": "Research activities align perfectly."},
    {"vs_day": 3, "arms_phase": "Drone Boost", "reason": "Drone component activities align."},
    {"vs_day": 4, "arms_phase": "Hero Advancement", "reason": "Hero activities align perfectly."},
    {"vs_day": 5, "arms_phase": "City Building", "reason": "Building component of mobilization."},
    {"vs_day": 5, "arms_phase": "Unit Progression", "reason": "Training component of mobilization."},
    {"vs_day": 5, "arms_phase": "Tech Research", "reason": "Research component of mobilization."},
    {"vs_day": 6, "arms_phase": "Unit Progression", "reason": "Troop training for combat."},
    {"vs_day": 6, "arms_phase": "City Building", "reason": "Construction speedups for defenses."}
  ],
  intelligence: {
    guides: [
      {
        title: "Understanding the Event Hub",
        content: "The Event Hub, unlocked at HQ Level 10, is your central access point for all current and upcoming events. Use the calendar to plan ahead and never miss a limited-time challenge to maximize your rewards."
      },
      {
        title: "Event Types Explained",
        content: "Events are grouped into categories: <strong>Timed Events</strong> (daily/weekly), <strong>Survival Challenges</strong> (resource scarcity), <strong>Co-op Missions</strong> (team survival), and <strong>Competitive Events</strong> (PvP and leaderboards)."
      }
    ],
    tips: [
      {
        title: "Maximize Your Rewards",
        content: "Always check the <strong>Featured Events</strong> for the best rewards. Track your progress in the Progress Tracker to unlock milestones. Spend event-specific currency in the Rewards Shop before the event ends."
      },
      {
        title: "Core Optimization Strategies",
        content: "Combine the <strong>Monica + Violet</strong> hero pair for a 39% resource bonus during Drone Boost phases. Bank at least 85% of your speedups for <strong>Total Mobilization Friday</strong> for a 300% efficiency gain. Always avoid activities between 00:00 and 00:05 UTC as no points are awarded."
      }
    ],
    season2: [
      {
        title: "Season 2: Rare Soil War Schedule Change",
        content: "The preparation stage for Rare Soil War has been reduced from 1 hour to <strong>30 minutes</strong>. The new prep time is 14:00 - 14:30 UTC, with the war starting immediately after. This is 30 minutes earlier than before."
      },
      {
        title: "Season 2 Celebration Event Timeline (5 Weeks)",
        content: "This event starts after Season 2 concludes. <strong>Week 1:</strong> Unlock 'The Age of Oil' tech and participate in server transfers. <strong>Week 2:</strong> 'Dripper' radar tasks, Full Mobilization, and Black Market events. <strong>Week 3:</strong> Zombie Kill, Healing, and Construction ranking events begin."
      }
    ]
  }
};

// --- Application State ---
let currentSettings = {
  viewMode: 'priority',
  timeDisplay: 'utc',
  infoLevel: 'simple',
  calendarView: 'full-week'
};
let appInterval;

// --- DOM Element Cache ---
const DOMElements = {};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("Last War Nexus initializing...");
  cacheDOMElements();
  setupEventListeners();
  populateIntelligenceHub();
  updateAllDisplays(); // Initial render for immediate feedback
  if (appInterval) clearInterval(appInterval);
  appInterval = setInterval(updateAllDisplays, 1000);
});

function cacheDOMElements() {
    const ids = [
        'nav-pills', 'time-display', 'info-level', 'calendar-view', 'close-modal-button',
        'detail-modal', 'priority-section', 'schedule-section', 'intelligence-section',
        'current-time', 'current-vs-day', 'current-arms-phase', 'action-icon', 'action-text',
        'reset-warning', 'countdown-timer', 'next-event-info', 'next-event-time',
        'high-priority-grid', 'complete-schedule-grid', 'modal-body', 'intelligence-hub-content'
    ];
    ids.forEach(id => {
        DOMElements[id] = document.getElementById(id);
    });
}

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

// --- Event Handlers ---
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
  updateCountdown(); // Update countdown display immediately on time format change
}

// --- Core Update Functions ---
function updateAllDisplays() {
  updateCurrentTime();
  updateCurrentStatus();
  updateCountdown();
}

function updateDynamicContent() {
    Object.values(DOMElements).forEach(el => {
        if (el && el.classList.contains('content-section')) {
            el.classList.add('hidden');
        }
    });

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
        DOMElements['action-icon']?.textContent = armsPhase.icon;
        const activities = appData.arms_race_phases.find(p => p.name === armsPhase.name)?.activities;
        DOMElements['action-text']?.innerHTML = `<strong>Normal Phase:</strong> Focus on ${activities ? activities[0] : 'general tasks'}.`;
    }
  }
}

function updateCountdown() {
  const nextWindow = getNextHighPriorityWindow();

  if (!nextWindow) {
    DOMElements['countdown-timer']?.textContent = 'Done';
    DOMElements['next-event-info']?.textContent = 'Check back tomorrow.';
    DOMElements['next-event-time']?.textContent = '';
    return;
  }

  const timeDiff = nextWindow.startTime - new Date();
  if (timeDiff <= 0) {
      DOMElements['countdown-timer']?.textContent = "ACTIVE";
      DOMElements['next-event-info']?.textContent = `${nextWindow.armsPhase.name} + ${nextWindow.vsDayData.title}`;
      DOMElements['next-event-time']?.textContent = '';
      return;
  }
  
  const hours = Math.floor(timeDiff / 3600000);
  const minutes = Math.floor((timeDiff % 3600000) / 60000);
  DOMElements['countdown-timer']?.textContent = `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
  DOMElements['next-event-info']?.textContent = `Next up: ${nextWindow.armsPhase.name}`;
  
  const localTime = nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const utcTime = nextWindow.startTime.toUTCString().slice(17, 22);
  DOMElements['next-event-time']?.textContent = currentSettings.timeDisplay === 'utc' ? `at ${utcTime} UTC` : `at ${localTime} Local`;
}

// --- Dynamic Content Generation ---
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
        'season2': '🚀 Season 2 Updates'
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
            <p>${appData.arms_race_phases.find(p => p.name === armsPhase.name)?.activities.join(', ')}</p>
        </div>
        <div class="modal-section">
            <h4>🏆 VS Event Goal</h4>
            <p>${appData.vs_days.find(d => d.day === vsDayData.day)?.activities.join(', ')}</p>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeDetailModal() {
  DOMElements['detail-modal']?.style.display = 'none';
}

// --- Helper Functions ---
function getCurrentUTCInfo() { return { utcDay: new Date().getUTCDay(), utcHour: new Date().getUTCHours(), utcMinute: new Date().getUTCMinutes() }; }
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
  const allWindows = getAllHighPriorityWindows().map(w => {
    let startTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), w.hour, 0, 0));
    while (startTime.getTime() <= now.getTime() || startTime.getUTCDay() !== w.vsDay) {
        startTime.setUTCDate(startTime.getUTCDate() + 1);
        if (startTime.getUTCDay() !== w.vsDay) {
           startTime.setUTCDate(startTime.getUTCDate() + (w.vsDay - startTime.getUTCDay() + 7) % 7);
        }
    }
    w.startTime = startTime;
    return w;
  });
  allWindows.sort((a, b) => a.startTime - b.startTime);
  return allWindows.length > 0 ? allWindows[0] : null;
}
