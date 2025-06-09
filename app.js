// --- Application Data ---
// This central object holds all game data, making it easy to update.
const appData = {
  arms_race_phases: [
    {id: 1, name: "City Building", activities: ["Building upgrades", "Construction speedups", "Power increases"], icon: "🏗️", color: "#4CAF50"},
    {id: 2, name: "Unit Progression", activities: ["Troop training", "Troop upgrades", "Training speedups"], icon: "⚔️", color: "#FF9800"},
    {id: 3, name: "Tech Research", activities: ["Research completion", "Research speedups", "Tech power increases"], icon: "🔬", color: "#2196F3"},
    {id: 4, name: "Drone Boost", activities: ["Stamina usage", "Drone data training", "Drone parts"], icon: "🚁", color: "#9C27B0"},
    {id: 5, name: "Hero Advancement", activities: ["Hero recruitment", "Hero EXP", "Hero shards"], icon: "⭐", color: "#FF5722"},
    {id: 6, name: "Mixed Phase", activities: ["Check in-game calendar", "Various activities"], icon: "🔄", color: "#607D8B"}
  ],
  vs_days: [
    {day: 0, name: "Sunday", title: "Preparation Day", objective: "No VS events - prepare for Monday", activities: ["Save radar missions", "Prepare building upgrades", "Stock resources"]},
    {day: 1, name: "Monday", title: "Radar Training", objective: "Stamina, radar missions, hero EXP, drone data/parts", activities: ["Complete radar missions", "Use stamina for attacks/rallies", "Train drones with combat data", "Use hero EXP (2000+ at once)", "Apply drone parts"]},
    {day: 2, name: "Tuesday", title: "Base Expansion", objective: "Building upgrades, construction speedups, recruit survivors", activities: ["Complete building upgrades", "Use construction speedups", "Dispatch legendary truck", "Recruit survivors", "Launch secret tasks"]},
    {day: 3, name: "Wednesday", title: "Age of Science", objective: "Research completion, research speedups, valor badges, drone components", activities: ["Complete research", "Use research speedups", "Use valor badges for research", "Open drone component chests", "Complete radar missions"]},
    {day: 4, name: "Thursday", title: "Train Heroes", objective: "Hero recruitment, hero EXP, hero shards, skill medals", activities: ["Use recruitment tickets", "Apply hero EXP", "Use hero shards", "Apply skill medals", "Use weapon shards"]},
    {day: 5, name: "Friday", title: "Total Mobilization", objective: "All activities (building, research, training)", activities: ["Complete radar missions", "Use all speedup types", "Finish buildings/research", "Train troops", "Use overlord items"]},
    {day: 6, name: "Saturday", title: "Enemy Buster", objective: "Combat, speedups, troop training/healing", activities: ["Attack enemy bases", "Use healing speedups", "Train troops", "Use all speedup types", "Dispatch trucks"]}
  ],
  high_priority_alignments: [
    {"vs_day": 1, "arms_phase": "Drone Boost", "reason": "Stamina and drone activities align perfectly."},
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
  ]
};

// --- Application State ---
// Stores the user's current settings from the controls.
let currentSettings = {
  viewMode: 'high-priority',
  timeDisplay: 'utc',
  infoLevel: 'simple',
  calendarView: 'full-week'
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("Last War Nexus initializing...");
  setupEventListeners();
  updateAllDisplays(); // Initial render
  setInterval(updateAllDisplays, 1000); // Update every second
});

function setupEventListeners() {
  document.getElementById('view-mode')?.addEventListener('change', handleControlChange);
  document.getElementById('time-display')?.addEventListener('change', handleControlChange);
  document.getElementById('info-level')?.addEventListener('change', handleControlChange);
  document.getElementById('calendar-view')?.addEventListener('change', handleControlChange);
  document.querySelector('.close-button')?.addEventListener('click', closeDetailModal);
  document.getElementById('detail-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('detail-modal')) {
      closeDetailModal();
    }
  });
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
  updateDynamicContent(); // Re-render content if needed
}

function updateDynamicContent() {
  const highPrioritySection = document.getElementById('high-priority-section');
  const completeScheduleSection = document.getElementById('complete-schedule-section');

  if (currentSettings.viewMode === 'high-priority') {
    highPrioritySection.classList.remove('hidden');
    completeScheduleSection.classList.add('hidden');
    updateHighPriorityDisplay();
  } else {
    highPrioritySection.classList.add('hidden');
    completeScheduleSection.classList.remove('hidden');
    updateCompleteScheduleDisplay();
  }
}

function updateCurrentTime() {
  const now = new Date();
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    timeElement.textContent = currentSettings.timeDisplay === 'utc'
      ? now.toUTCString().split(' ')[4]
      : now.toLocaleTimeString();
  }
}

function updateCurrentStatus() {
  const { utcDay, utcHour, utcMinute } = getCurrentUTCInfo();
  const vsDayData = getVSDayData(utcDay);
  const armsPhase = getArmsRacePhase(utcHour);
  const alignment = getAlignment(utcDay, armsPhase.name);

  // Update displays
  document.getElementById('current-vs-day').textContent = `${vsDayData.name}: ${vsDayData.title}`;
  document.getElementById('current-arms-phase').textContent = `${armsPhase.icon} ${armsPhase.name}`;
  document.getElementById('current-arms-phase').style.color = armsPhase.color;
  
  // Update action card
  const actionIcon = document.getElementById('action-icon');
  const actionText = document.getElementById('action-text');
  const resetWarning = document.getElementById('reset-warning');

  if (utcHour === 0 && utcMinute < 5) {
    resetWarning.classList.remove('hidden');
    actionIcon.textContent = '⏳';
    actionText.innerHTML = '<strong>No Points Period:</strong> Wait for reset to finish.';
  } else {
    resetWarning.classList.add('hidden');
    if (alignment) {
        actionIcon.textContent = '⚡';
        actionText.innerHTML = `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason}`;
    } else {
        actionIcon.textContent = armsPhase.icon;
        actionText.innerHTML = `<strong>Normal Phase:</strong><br>Focus on ${armsPhase.activities[0]}.`;
    }
  }
}

function updateCountdown() {
  const countdownTimer = document.getElementById('countdown-timer');
  const nextEventInfo = document.getElementById('next-event-info');
  const nextWindow = getNextHighPriorityWindow();

  if (!nextWindow) {
    countdownTimer.textContent = 'Done for now!';
    nextEventInfo.textContent = 'Check back tomorrow for more high priority events.';
    return;
  }

  const timeDiff = nextWindow.startTime - new Date();
  if (timeDiff <= 0) {
      countdownTimer.textContent = "ACTIVE NOW";
      return;
  }
  
  const hours = Math.floor(timeDiff / 3600000);
  const minutes = Math.floor((timeDiff % 3600000) / 60000);
  countdownTimer.textContent = `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
  
  nextEventInfo.textContent = `Next up: ${nextWindow.armsPhase.name} + ${nextWindow.vsDayData.title}`;
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
        <div class="phase-icon">${window.armsPhase.icon}</div>
        <div class="phase-details">
          <div class="phase-name">${window.armsPhase.name}</div>
          <div class="phase-alignment">${window.vsDayData.title}</div>
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
      if (vsDayData.day === utcDay && h <= utcHour && utcHour < h + 4) {
        cell.classList.add('current');
      }

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

// --- Modal Logic ---
function showDetailModal(alignment, vsDayData, armsPhase) {
    if (!alignment) return;
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2>${armsPhase.icon} ${armsPhase.name} + ${vsDayData.title}</h2>
        <div class="modal-section">
            <h4>⭐ HIGH PRIORITY ALIGNMENT</h4>
            <p>${alignment.reason}</p>
        </div>
        <div class="modal-section">
            <h4>🎯 Arms Race Focus</h4>
            <p><strong>${armsPhase.name}:</strong> ${armsPhase.activities.join(', ')}</p>
        </div>
        <div class="modal-section">
            <h4>🏆 VS Event Goal</h4>
            <p><strong>${vsDayData.title}:</strong> ${vsDayData.objective}</p>
        </div>
        <div class="modal-section">
            <h4>💡 Strategic Tips</h4>
            <ul class="modal-tips">
                <li>Focus maximum effort and resources during this window.</li>
                <li>Prepare required items (speedups, stamina) before the phase starts.</li>
                <li>Coordinate with your alliance for maximum benefit during combat phases.</li>
                ${getSpecificTips(armsPhase.name).map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeDetailModal() {
  document.getElementById('detail-modal').style.display = 'none';
}

// --- Helper Functions ---
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
  return allWindows[0];
}
function getSpecificTips(phaseName) {
    const tips = {
        'City Building': ['Start long upgrades ~30 mins before the phase begins.'],
        'Unit Progression': ['Use troop laddering (T7→T8→T9) for max points.'],
        'Tech Research': ['Complete multiple small researches for more point badges.'],
        'Drone Boost': ['Use Monica + Violet heroes for a 39% resource bonus from stamina use.'],
        'Hero Advancement': ['Use EXP items in large batches (2000+) for efficiency.'],
    };
    return tips[phaseName] || [];
}
