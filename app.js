// Application data
const gameData = {
  armsRacePhases: [
    {name: "City Building", icon: "🏗️", focus: "Upgrade buildings, use construction speedups"},
    {name: "Unit Progression", icon: "⚔️", focus: "Train/upgrade troops, use training speedups"},
    {name: "Tech Research", icon: "🔬", focus: "Complete research, use research speedups"},
    {name: "Drone Boost", icon: "🚁", focus: "Use stamina, drone combat, radar missions"},
    {name: "Hero Advancement", icon: "⭐", focus: "Recruit heroes, gain hero EXP, use shards"},
    {name: "Mixed Phase", icon: "🔄", focus: "Check in-game calendar for specific focus"}
  ],
  
  vsEvents: [
    {day: 1, name: "Radar Training", focus: "Use stamina on missions, drone activities"},
    {day: 2, name: "Base Expansion", focus: "Upgrade buildings, use speedups, train troops"},
    {day: 3, name: "Age of Science", focus: "Complete research, use research speedups"},
    {day: 4, name: "Train Heroes", focus: "Recruit heroes, use hero EXP and shards"},
    {day: 5, name: "Total Mobilization", focus: "All activities - buildings, troops, research"},
    {day: 6, name: "Enemy Buster", focus: "Combat activities, attack enemies, heal troops"}
  ],
  
  highPriorityWindows: [
    {day: "Monday", time: "00:00-04:00", armsRace: "Drone Boost", vsGoal: "Radar Training", priority: "high"},
    {day: "Monday", time: "20:00-00:00", armsRace: "Drone Boost", vsGoal: "Radar Training", priority: "high"},
    {day: "Tuesday", time: "00:00-04:00", armsRace: "City Building", vsGoal: "Base Expansion", priority: "high"},
    {day: "Tuesday", time: "20:00-00:00", armsRace: "City Building", vsGoal: "Base Expansion", priority: "high"},
    {day: "Wednesday", time: "00:00-04:00", armsRace: "Tech Research", vsGoal: "Age of Science", priority: "high"},
    {day: "Wednesday", time: "20:00-00:00", armsRace: "Tech Research", vsGoal: "Age of Science", priority: "high"},
    {day: "Thursday", time: "00:00-04:00", armsRace: "Hero Advancement", vsGoal: "Train Heroes", priority: "high"},
    {day: "Thursday", time: "20:00-00:00", armsRace: "Hero Advancement", vsGoal: "Train Heroes", priority: "high"},
    {day: "Friday", time: "00:00-04:00", armsRace: "City Building", vsGoal: "Total Mobilization", priority: "high"},
    {day: "Friday", time: "04:00-08:00", armsRace: "Unit Progression", vsGoal: "Total Mobilization", priority: "high"},
    {day: "Friday", time: "08:00-12:00", armsRace: "Tech Research", vsGoal: "Total Mobilization", priority: "high"},
    {day: "Friday", time: "20:00-00:00", armsRace: "City Building", vsGoal: "Total Mobilization", priority: "high"},
    {day: "Saturday", time: "00:00-04:00", armsRace: "Unit Progression", vsGoal: "Enemy Buster", priority: "high"},
    {day: "Saturday", time: "04:00-08:00", armsRace: "Drone Boost", vsGoal: "Enemy Buster", priority: "high"},
    {day: "Saturday", time: "08:00-12:00", armsRace: "City Building", vsGoal: "Enemy Buster", priority: "high"},
    {day: "Saturday", time: "12:00-16:00", armsRace: "Tech Research", vsGoal: "Enemy Buster", priority: "high"},
    {day: "Saturday", time: "20:00-00:00", armsRace: "Unit Progression", vsGoal: "Enemy Buster", priority: "high"}
  ]
};

// Global variables
let updateInterval;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupTabNavigation();
  setupStrategyToggles();
  startClockUpdates();
  generateWeeklySchedule();
  generateQuickReference();
  updateCurrentStatus();
}

// Tab Navigation
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      button.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
}

// Strategy section toggles
function setupStrategyToggles() {
  const strategyHeaders = document.querySelectorAll('.strategy-header');
  
  strategyHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-toggle');
      const content = document.getElementById(targetId);
      const icon = header.querySelector('.toggle-icon');
      
      header.classList.toggle('active');
      content.classList.toggle('active');
      
      if (content.classList.contains('active')) {
        icon.textContent = '−';
      } else {
        icon.textContent = '+';
      }
    });
  });
}

// Clock and countdown functionality
function startClockUpdates() {
  updateClock();
  updateInterval = setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const utcTime = now.toUTCString().split(' ')[4];
  document.getElementById('utc-clock').textContent = utcTime;
  
  updateCountdown(now);
  updateCurrentStatus();
}

function updateCountdown(currentTime) {
  const nextHighPriority = getNextHighPriorityWindow(currentTime);
  const countdown = document.getElementById('countdown');
  
  if (nextHighPriority) {
    const timeUntil = nextHighPriority.startTime - currentTime;
    
    if (timeUntil > 0) {
      const hours = Math.floor(timeUntil / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeUntil % (1000 * 60)) / 1000);
      
      countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Add urgent class if less than 1 hour
      if (timeUntil < 3600000) {
        countdown.classList.add('urgent');
      } else {
        countdown.classList.remove('urgent');
      }
    } else {
      countdown.textContent = "NOW ACTIVE";
      countdown.classList.add('urgent');
    }
  } else {
    countdown.textContent = "--:--:--";
    countdown.classList.remove('urgent');
  }
}

function getNextHighPriorityWindow(currentTime) {
  const currentDay = currentTime.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentHour = currentTime.getUTCHours();
  const currentMinute = currentTime.getUTCMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Look for next high priority window in the current week
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const checkDay = (currentDay + dayOffset) % 7;
    const checkDayName = dayNames[checkDay];
    
    const dayWindows = gameData.highPriorityWindows.filter(window => window.day === checkDayName);
    
    for (const window of dayWindows) {
      const [startTime, endTime] = window.time.split('-');
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;
      
      let targetDate = new Date(currentTime);
      targetDate.setUTCDate(targetDate.getUTCDate() + dayOffset);
      targetDate.setUTCHours(startHour, startMinute, 0, 0);
      
      // Handle midnight crossover for times like "20:00-00:00"
      if (endTime === "00:00" && dayOffset === 0 && currentTimeInMinutes >= startTimeInMinutes) {
        continue; // This window is active now or has passed today
      }
      
      if (dayOffset === 0 && startTimeInMinutes <= currentTimeInMinutes) {
        continue; // This window has already started or passed today
      }
      
      return {
        startTime: targetDate,
        window: window
      };
    }
  }
  
  return null;
}

// Current status updates
function updateCurrentStatus() {
  const now = new Date();
  const currentPhase = getCurrentArmsRacePhase(now);
  const currentVS = getCurrentVSEvent(now);
  const isHighPriority = isCurrentlyHighPriority(now);
  
  // Update phase display
  const phaseElement = document.getElementById('current-phase');
  if (phaseElement) {
    phaseElement.textContent = `${currentPhase.name} ${currentPhase.icon}`;
  }
  
  // Update VS event display
  const vsElement = document.getElementById('current-vs');
  if (vsElement) {
    vsElement.textContent = currentVS ? currentVS.name : "Preparation Day";
  }
  
  // Update priority level
  const priorityElement = document.getElementById('priority-level');
  if (priorityElement) {
    if (isHighPriority) {
      priorityElement.textContent = "HIGH PRIORITY";
      priorityElement.className = "status-value priority-high";
    } else {
      priorityElement.textContent = "Normal";
      priorityElement.className = "status-value priority-normal";
    }
  }
  
  // Update action recommendations
  updateActionRecommendations(currentPhase, currentVS, isHighPriority);
}

function getCurrentArmsRacePhase(currentTime) {
  const hoursSinceReset = currentTime.getUTCHours();
  const phaseIndex = Math.floor(hoursSinceReset / 4);
  return gameData.armsRacePhases[phaseIndex] || gameData.armsRacePhases[5]; // Default to Mixed Phase
}

function getCurrentVSEvent(currentTime) {
  const dayOfWeek = currentTime.getUTCDay(); // 0 = Sunday, 1 = Monday
  
  if (dayOfWeek === 0) {
    return null; // Sunday is preparation day
  }
  
  return gameData.vsEvents.find(event => event.day === dayOfWeek);
}

function isCurrentlyHighPriority(currentTime) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDay = dayNames[currentTime.getUTCDay()];
  const currentHour = currentTime.getUTCHours();
  const currentMinute = currentTime.getUTCMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const todayWindows = gameData.highPriorityWindows.filter(window => window.day === currentDay);
  
  for (const window of todayWindows) {
    const [startTime, endTime] = window.time.split('-');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    let [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Handle midnight crossover
    if (endHour === 0 && endMinute === 0) {
      endHour = 24;
    }
    
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
      return true;
    }
  }
  
  return false;
}

function updateActionRecommendations(currentPhase, currentVS, isHighPriority) {
  const actionsContainer = document.getElementById('current-actions');
  if (!actionsContainer) return;
  
  let actions = [];
  
  // Add phase-specific actions
  actions.push({
    icon: currentPhase.icon,
    text: currentPhase.focus
  });
  
  // Add VS event actions if applicable
  if (currentVS) {
    actions.push({
      icon: "🎯",
      text: currentVS.focus
    });
  }
  
  // Add priority-specific recommendations
  if (isHighPriority) {
    actions.push({
      icon: "⚡",
      text: "OPTIMAL TIME: Maximum points for all activities!"
    });
  } else {
    actions.push({
      icon: "⏰",
      text: "Prepare resources for next high-priority window"
    });
  }
  
  // Generate HTML
  actionsContainer.innerHTML = actions.map(action => `
    <div class="action-item">
      <span class="action-icon">${action.icon}</span>
      <span class="action-text">${action.text}</span>
    </div>
  `).join('');
}

// Weekly schedule generation
function generateWeeklySchedule() {
  const scheduleGrid = document.getElementById('weekly-schedule-grid');
  if (!scheduleGrid) return;
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  scheduleGrid.innerHTML = days.map(day => {
    const vsEvent = gameData.vsEvents.find(event => event.day === days.indexOf(day) + 1);
    const dayWindows = gameData.highPriorityWindows.filter(window => window.day === day);
    
    // Generate all time slots for the day
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour += 4) {
      const timeRange = `${hour.toString().padStart(2, '0')}:00-${((hour + 4) % 24).toString().padStart(2, '0')}:00`;
      const phaseIndex = hour / 4;
      const phase = gameData.armsRacePhases[phaseIndex] || gameData.armsRacePhases[5];
      
      const isHighPriority = dayWindows.some(window => window.time === timeRange);
      
      timeSlots.push({
        time: timeRange,
        phase: phase,
        priority: isHighPriority ? 'high' : 'normal'
      });
    }
    
    return `
      <div class="day-card">
        <div class="day-header">
          <div class="day-name">${day}</div>
          <div class="vs-event">${vsEvent ? vsEvent.name : 'Preparation Day'}</div>
        </div>
        <div class="time-slots">
          ${timeSlots.map(slot => `
            <div class="time-slot ${slot.priority}-priority">
              <span class="time-range">${slot.time}</span>
              <span class="phase-name">${slot.phase.name} ${slot.phase.icon}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// Quick reference generation
function generateQuickReference() {
  const quickRefGrid = document.getElementById('quick-reference-grid');
  if (!quickRefGrid) return;
  
  // Group high priority windows by day
  const windowsByDay = {};
  gameData.highPriorityWindows.forEach(window => {
    if (!windowsByDay[window.day]) {
      windowsByDay[window.day] = [];
    }
    windowsByDay[window.day].push(window);
  });
  
  quickRefGrid.innerHTML = Object.entries(windowsByDay).map(([day, windows]) => `
    <div class="day-card">
      <div class="day-header">
        <div class="day-name">${day}</div>
        <div class="vs-event">${windows.length} High Priority Windows</div>
      </div>
      <div class="time-slots">
        ${windows.map(window => `
          <div class="quick-ref-item">
            <div class="quick-ref-time">${window.time}</div>
            <div class="quick-ref-events">${window.armsRace} + ${window.vsGoal}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});