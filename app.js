// --- Application Data ---
// This central object holds all game data, making it easy to update.
const appData = {
  arms_race_phases: [
    {id: 1, name: "City Building", activities: ["Building upgrades", "Construction speedups"], icon: "🏗️", color: "#4CAF50"},
    {id: 2, name: "Unit Progression", activities: ["Troop training", "Training speedups"], icon: "⚔️", color: "#FF9800"},
    {id: 3, name: "Tech Research", activities: ["Research completion", "Research speedups"], icon: "🔬", color: "#2196F3"},
    {id: 4, name: "Drone Boost", activities: ["Stamina usage", "Drone activities"], icon: "🚁", color: "#9C27B0"},
    {id: 5, name: "Hero Advancement", activities: ["Hero recruitment", "Hero EXP"], icon: "⭐", color: "#FF5722"},
    {id: 6, name: "Mixed Phase", activities: ["Check in-game calendar"], icon: "🔄", color: "#607D8B"}
  ],
  vs_days: [
    {day: 0, name: "Sunday", title: "Preparation Day", objective: "No VS events - prepare for Monday"},
    {day: 1, name: "Monday", title: "Radar Training", objective: "Stamina, radar missions, hero EXP"},
    {day: 2, name: "Tuesday", title: "Base Expansion", objective: "Building upgrades, construction speedups"},
    {day: 3, name: "Wednesday", title: "Age of Science", objective: "Research completion, research speedups"},
    {day: 4, name: "Thursday", title: "Train Heroes", objective: "Hero recruitment, hero EXP, shards"},
    {day: 5, name: "Friday", title: "Total Mobilization", objective: "All activities - building, research, training"},
    {day: 6, name: "Saturday", title: "Enemy Buster", objective: "Combat, speedups, troop training/healing"}
  ],
  high_priority_alignments: [
    {"vs_day": 1, "arms_phase": "Drone Boost", "reason": "Stamina and drone activities align perfectly."},
    {"vs_day": 2, "arms_phase": "City Building", "reason": "Building activities align perfectly."},
    {"vs_day": 3, "arms_phase": "Tech Research", "reason": "Research activities align perfectly."},
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
  updateAllDisplays();
  setInterval(updateAllDisplays, 1000); // Update every second for live clock
});

function setupEventListeners() {
  // View controls
  document.getElementById('view-mode')?.addEventListener('change', handleControlChange);
  document.getElementById('time-display')?.addEventListener('change', handleControlChange);
  document.getElementById('info-level')?.addEventListener('change', handleControlChange);
  document.getElementById('calendar-view')?.addEventListener('change', handleControlChange);

  // Modal close buttons
  document.querySelector('.close-button')?.addEventListener('click', closeDetailModal);
  document.getElementById('detail-modal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('detail-modal')) {
      closeDetailModal();
    }
  });
}

function handleControlChange(event) {
  const controlId = event.target.id;
  const value = event.target.value;

  switch(controlId) {
    case 'view-mode':
      currentSettings.viewMode = value;
      break;
    case 'time-display':
      currentSettings.timeDisplay = value;
      break;
    case 'info-level':
    case 'calendar-view':
      currentSettings[controlId.split('-')[0]] = value;
      break;
  }
  updateDynamicContent(); // Re-render content based on new settings
}

// --- Core Update Functions ---
function updateAllDisplays() {
  updateCurrentTime();
  updateCurrentStatus();
  updateCountdown();
}

function updateDynamicContent() {
    if (currentSettings.viewMode === 'high-priority') {
        document.getElementById('high-priority-section').classList.remove('hidden');
        document.getElementById('complete-schedule-section').classList.add('hidden');
        updateHighPriorityDisplay();
    } else {
        document.getElementById('high-priority-section').classList.add('hidden');
        document.getElementById('complete-schedule-section').classList.remove('hidden');
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
  const alignment = getCurrentHighPriorityAlignment(utcDay, armsPhase);

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
  countdownTimer.textContent = `${hours}h ${minutes}m`;
  
  nextEventInfo.textContent = `Next up: ${nextWindow.armsPhase.name} + ${nextWindow.vsDayData.title}`;
}

// --- Dynamic Content Generation ---
function updateHighPriorityDisplay() {
  const container = document.getElementById('high-priority-grid');
  container.innerHTML = ''; // Clear previous content

  const now = new Date();
  const currentDay = now.getUTCDay();
  const currentHour = now.getUTCHours();
  
  getAllHighPriorityWindows().forEach(window => {
    const isActive = (window.vsDay === currentDay) && (window.hour <= currentHour && currentHour < (window.hour + 4));
    
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
  updateDynamicContent();
}
updateHighPriorityDisplay();

function updateCompleteScheduleDisplay() {
  const container = document.getElementById('complete-schedule-grid');
  container.innerHTML = ''; // Clear previous content
  
  // Create headers
  const cornerCell = document.createElement('div');
  cornerCell.className = 'schedule-header';
  container.appendChild(cornerCell);
  for (let h = 0; h < 24; h += 4) {
    const headerCell = document.createElement('div');
    headerCell.className = 'schedule-header';
    headerCell.textContent = `${String(h).padStart(2, '0')}:00`;
    container.appendChild(headerCell);
  }

  // Create rows
  appData.vs_days.forEach(vsDayData => {
    if (currentSettings.calendarView === 'current' && vsDayData.day !== new Date().getUTCDay()) return;

    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header-cell';
    dayHeader.textContent = vsDayData.name;
    container.appendChild(dayHeader);

    for (let h = 0; h < 24; h += 4) {
      const armsPhase = getArmsRacePhase(h);
      const slot = document.createElement('div');
      slot.className = 'schedule-slot';
      
      const alignment = getCurrentHighPriorityAlignment(vsDayData.day, armsPhase);
      if (alignment) slot.classList.add('high-priority');

      const isCurrent = (vsDayData.day === new Date().getUTCDay()) && (h <= new Date().getUTCHours() && new Date().getUTCHours() < (h + 4));
      if (isCurrent) slot.classList.add('current');

      slot.innerHTML = `
        <div class="slot-phase">${armsPhase.icon} ${armsPhase.name}</div>
        ${(alignment && currentSettings.infoLevel === 'detailed') ? `<div class="slot-reason">${alignment.reason}</div>` : ''}
      `;
      slot.addEventListener('click', () => showDetailModal(alignment, vsDayData, armsPhase));
      container.appendChild(slot);
    }
  });
}

// --- Modal Logic ---
function showDetailModal(alignment, vsDayData, armsPhase) {
    if (!alignment) return; // Don't show modal for non-priority slots
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
  return {
    utcDay: now.getUTCDay(),
    utcHour: now.getUTCHours(),
    utcMinute: now.getUTCMinutes()
  };
}

function getVSDayData(utcDay) {
  return appData.vs_days.find(d => d.day === utcDay);
}

function getArmsRacePhase(utcHour) {
  const phaseIndex = Math.floor(utcHour / 4) % 6;
  return appData.arms_race_phases[phaseIndex];
}

function getCurrentHighPriorityAlignment(utcDay, armsPhase) {
  return appData.high_priority_alignments.find(a => 
    a.vs_day === utcDay && a.arms_phase === armsPhase.name
  );
}

function getAllHighPriorityWindows() {
  const windows = [];
  appData.high_priority_alignments.forEach(alignment => {
    const vsDayData = getVSDayData(alignment.vs_day);
    const armsPhase = appData.arms_race_phases.find(p => p.name === alignment.arms_phase);
    
    if (vsDayData && armsPhase) {
      for (let h = 0; h < 24; h += 4) {
        if (getArmsRacePhase(h).name === alignment.arms_phase) {
          windows.push({
            startTime: null, // Placeholder, calculated when needed
            vsDay: alignment.vs_day,
            vsDayData: vsDayData,
            armsPhase: armsPhase,
            alignment: alignment,
            hour: h
          });
        }
      }
    }
  });
  return windows;
}

function getNextHighPriorityWindow() {
  const now = new Date();
  const allWindows = getAllHighPriorityWindows().map(w => {
      const startTime = new Date();
      startTime.setUTCHours(w.hour, 0, 0, 0);
      
      // Find the next occurrence of this day and time
      while (startTime <= now || startTime.getUTCDay() !== w.vsDay) {
          startTime.setDate(startTime.getDate() + 1);
      }
      w.startTime = startTime;
      return w;
  });

  allWindows.sort((a, b) => a.startTime - b.startTime);
  return allWindows[0];
}
