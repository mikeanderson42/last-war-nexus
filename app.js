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
    {day: 0, name: "Sunday", title: "Preparation Day"},
    {day: 1, name: "Monday", title: "Radar Training"},
    {day: 2, name: "Tuesday", title: "Base Expansion"},
    {day: 3, name: "Wednesday", title: "Age of Science"},
    {day: 4, name: "Thursday", title: "Train Heroes"},
    {day: 5, name: "Friday", title: "Total Mobilization"},
    {day: 6, name: "Saturday", title: "Enemy Buster"}
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

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("Last War Nexus initializing...");
  setupEventListeners();
  populateIntelligenceHub();
  updateAllDisplays();
  setInterval(updateAllDisplays, 1000);
});

function setupEventListeners() {
  document.getElementById('nav-pills')?.addEventListener('click', handleNavPillClick);
  document.getElementById('time-display')?.addEventListener('change', handleControlChange);
  document.getElementById('info-level')?.addEventListener('change', handleControlChange);
  document.getElementById('calendar-view')?.addEventListener('change', handleControlChange);
  document.getElementById('close-modal-button')?.addEventListener('click', closeDetailModal);
  document.getElementById('detail-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('detail-modal')) closeDetailModal();
  });
}

function handleNavPillClick(event) {
    if (event.target.classList.contains('nav-pill')) {
        document.querySelectorAll('.nav-pill').forEach(pill => pill.classList.remove('active'));
        event.target.classList.add('active');
        currentSettings.viewMode = event.target.dataset.view;
        updateDynamicContent();
    }
}

function handleControlChange(event) {
  const controlId = event.target.id.split('-')[0];
  currentSettings[controlId] = event.target.value;
  updateDynamicContent();
}

// --- Core Update Functions ---
function updateAllDisplays() {
  updateCurrentTime();
  updateCurrentStatus();
  updateCountdown();
}

function updateDynamicContent() {
  document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
  document.getElementById(`${currentSettings.viewMode}-section`).classList.remove('hidden');

  if (currentSettings.viewMode === 'priority') {
    updateHighPriorityDisplay();
  } else if (currentSettings.viewMode === 'schedule') {
    updateCompleteScheduleDisplay();
  }
}

function updateCurrentTime() {
  const now = new Date();
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    timeElement.textContent = currentSettings.timeDisplay === 'utc' ? now.toUTCString().slice(17, 25) : now.toLocaleTimeString();
  }
}

function updateCurrentStatus() {
  const { utcDay, utcHour, utcMinute } = getCurrentUTCInfo();
  const vsDayData = getVSDayData(utcDay);
  const armsPhase = getArmsRacePhase(utcHour);
  const alignment = getAlignment(utcDay, armsPhase.name);

  document.getElementById('current-vs-day').textContent = vsDayData.title;
  document.getElementById('current-arms-phase').textContent = `${armsPhase.icon} ${armsPhase.name}`;
  
  const actionIcon = document.getElementById('action-icon');
  const actionText = document.getElementById('action-text');
  const resetWarning = document.getElementById('reset-warning');

  if (utcHour === 0 && utcMinute < 5) {
    resetWarning.classList.remove('hidden');
    actionIcon.textContent = '⏳';
    actionText.innerHTML = '<strong>No Points Period:</strong> Wait for server reset to finish.';
  } else {
    resetWarning.classList.add('hidden');
    if (alignment) {
        actionIcon.textContent = '⚡';
        actionText.innerHTML = `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason}`;
    } else {
        actionIcon.textContent = armsPhase.icon;
        actionText.innerHTML = `<strong>Normal Phase:</strong> Focus on ${appData.arms_race_phases.find(p => p.name === armsPhase.name)?.activities[0] || 'general tasks'}.`;
    }
  }
}

function updateCountdown() {
  const countdownTimer = document.getElementById('countdown-timer');
  const nextEventInfo = document.getElementById('next-event-info');
  const nextEventTime = document.getElementById('next-event-time');
  const nextWindow = getNextHighPriorityWindow();

  if (!nextWindow) {
    countdownTimer.textContent = 'Done for now!';
    nextEventInfo.textContent = 'Check back tomorrow for more events.';
    nextEventTime.textContent = '';
    return;
  }

  const timeDiff = nextWindow.startTime - new Date();
  if (timeDiff <= 0) {
      countdownTimer.textContent = "ACTIVE NOW";
      nextEventInfo.textContent = `${nextWindow.armsPhase.name} + ${nextWindow.vsDayData.title}`;
      nextEventTime.textContent = '';
      return;
  }
  
  const hours = Math.floor(timeDiff / 3600000);
  const minutes = Math.floor((timeDiff % 3600000) / 60000);
  countdownTimer.textContent = `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
  
  nextEventInfo.textContent = `Next up: ${nextWindow.armsPhase.name} + ${nextWindow.vsDayData.title}`;
  
  const localTime = nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const utcTime = nextWindow.startTime.toUTCString().slice(17, 22);
  nextEventTime.textContent = currentSettings.timeDisplay === 'utc' ? `Starts at ${utcTime} UTC` : `Starts at ${localTime} (Your Time)`;
}

// --- Dynamic Content Generation ---
function updateHighPriorityDisplay() {
  const container = document.getElementById('high-priority-grid');
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
  const container = document.getElementById('complete-schedule-grid');
  container.innerHTML = ''; 

  const headers = ['Day/Time', '00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  headers.forEach(h => {
    const headerCell = document.createElement('div');
    headerCell.className = 'table-header';
    headerCell.textContent = h;
    container.appendChild(headerCell);
  });

  appData.vs_days.forEach(vsDayData => {
    if (currentSettings.calendarView === 'current' && vsDayData.day !== new Date().getUTCDay()) return;

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
    const container = document.getElementById('intelligence-section');
    container.innerHTML = `<div class="intelligence-hub" id="intelligence-hub-content"></div>`;
    const content = document.getElementById('intelligence-hub-content');

    const sections = {
        'guides': '📚 Guides',
        'tips': '💡 Pro Tips',
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

    // Add event listeners for the accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
            const content = header.nextElementSibling;
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
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');

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
  document.getElementById('detail-modal').style.display = 'none';
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
          windows.push({ startTime: null, vsDay: alignment.vs_day, vsDayData, armsPhase, alignment, hour: h });
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
    while (startTime <= now || startTime.getUTCDay() !== w.vsDay) {
        startTime.setUTCDate(startTime.getUTCDate() + 1);
    }
    w.startTime = startTime;
    return w;
  });
  allWindows.sort((a, b) => a.startTime - b.startTime);
  return allWindows.length > 0 ? allWindows[0] : null;
}
