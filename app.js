// Professional Last War Nexus - Gaming Tracker Implementation
class LastWarNexus {
  constructor() {
    this.data = {
      arms_race_phases: [
        {id: 1, name: "City Building", icon: "🏗️", activities: ["Building upgrades", "Construction speedups"]},
        {id: 2, name: "Unit Progression", icon: "⚔️", activities: ["Troop training", "Training speedups"]},
        {id: 3, name: "Tech Research", icon: "🔬", activities: ["Research completion", "Research speedups"]},
        {id: 4, name: "Drone Boost", icon: "🚁", activities: ["Stamina usage", "Drone activities"]},
        {id: 5, name: "Hero Advancement", icon: "⭐", activities: ["Hero recruitment", "Hero EXP"]},
        {id: 6, name: "Mixed Phase", icon: "🔄", activities: ["Check in-game calendar"]}
      ],
      vs_days: [
        {day: 0, name: "Sunday", title: "Preparation Day", activities: ["Save radar missions", "Prepare building upgrades"]},
        {day: 1, name: "Monday", title: "Radar Training", activities: ["Complete radar missions", "Use stamina for attacks"]},
        {day: 2, name: "Tuesday", title: "Base Expansion", activities: ["Complete building upgrades", "Use construction speedups"]},
        {day: 3, name: "Wednesday", title: "Age of Science", activities: ["Complete research", "Use research speedups"]},
        {day: 4, name: "Thursday", title: "Train Heroes", activities: ["Use recruitment tickets", "Apply hero EXP"]},
        {day: 5, name: "Friday", title: "Total Mobilization", activities: ["Use all speedup types", "Finish buildings/research"]},
        {day: 6, name: "Saturday", title: "Enemy Buster", activities: ["Attack enemy bases", "Use healing speedups"]}
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
            content: "Season 4 introduces the Evernight Isle with new Copper War mechanics featuring phased alliance matchups and faction-based attack/defense roles."
          },
          {
            title: "Drone Data & Battle Optimization",
            content: "Maximize Battle Data collection through Doom Elites and radar tasks. Save resources for Drone Boost phases and VS Duel events for optimal rewards."
          }
        ],
        tips: [
          {
            title: "Resource & Base Optimization",
            content: "Prioritize Headquarters upgrades, utilize Alliance Help for troop healing, and participate in Bullseye Loot events for maximum resource gains."
          },
          {
            title: "Combat & Event Strategy",
            content: "Focus on alliance coordination during Copper War events. Always verify screen strength before attacking to minimize soldier losses."
          }
        ],
        season4: [
          {
            title: "Season 4: Key Changes",
            content: "Copper War now features 8 rounds with faction role switching and increased building defense caps. Tesla Coil skills provide 21x21 range coverage."
          },
          {
            title: "Hero & Weapon Updates",
            content: "Sarah can now be upgraded to Legendary status. New exclusive weapons for Lucius and Tesla Coil skills for Butler enhance Season 4 gameplay."
          }
        ]
      }
    };
    
    this.settings = {
      timeFormat: 'utc',
      detailLevel: 'essential',
      viewScope: 'week'
    };
    
    this.activeTab = 'priority';
    this.updateInterval = null;
    
    this.init();
  }

  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.populateIntelligence();
    this.startUpdateLoop();
    this.updateAllDisplays();
  }

  cacheElements() {
    this.elements = {
      serverTime: document.getElementById('server-time'),
      vsEvent: document.getElementById('vs-event'),
      armsPhase: document.getElementById('arms-phase'),
      countdownTimer: document.getElementById('countdown-timer'),
      eventName: document.getElementById('event-name'),
      eventTime: document.getElementById('event-time'),
      actionIcon: document.getElementById('action-icon'),
      actionText: document.getElementById('action-text'),
      priorityLevel: document.getElementById('priority-level'),
      efficiency: document.getElementById('efficiency'),
      activeUsers: document.getElementById('active-users'),
      priorityGrid: document.getElementById('priority-grid'),
      scheduleGrid: document.getElementById('schedule-grid'),
      intelligenceContent: document.getElementById('intelligence-content'),
      modal: document.getElementById('event-modal'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body'),
      modalClose: document.getElementById('modal-close')
    };
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.closest('.tab-btn').dataset.tab);
      });
    });

    // Settings controls
    document.getElementById('time-format').addEventListener('change', (e) => {
      this.settings.timeFormat = e.target.value;
      this.updateAllDisplays();
    });

    document.getElementById('detail-level').addEventListener('change', (e) => {
      this.settings.detailLevel = e.target.value;
      this.updateContent();
    });

    document.getElementById('view-scope').addEventListener('change', (e) => {
      this.settings.viewScope = e.target.value;
      this.updateContent();
    });

    // Modal controls
    this.elements.modalClose.addEventListener('click', () => this.closeModal());
    this.elements.modal.addEventListener('click', (e) => {
      if (e.target === this.elements.modal) this.closeModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
      if (e.key === '1') this.switchTab('priority');
      if (e.key === '2') this.switchTab('schedule');
      if (e.key === '3') this.switchTab('intelligence');
    });
  }

  startUpdateLoop() {
    if (this.updateInterval) clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => {
      this.updateAllDisplays();
      this.updateActiveUsers();
    }, 1000);
  }

  updateAllDisplays() {
    this.updateServerTime();
    this.updateCurrentStatus();
    this.updateCountdown();
    this.updateContent();
  }

  updateServerTime() {
    const now = new Date();
    if (this.elements.serverTime) {
      this.elements.serverTime.textContent = this.settings.timeFormat === 'utc'
        ? now.toUTCString().slice(17, 25)
        : now.toLocaleTimeString();
    }
  }

  updateCurrentStatus() {
    const { utcDay, utcHour, utcMinute } = this.getCurrentUTCInfo();
    const vsDayData = this.getVSDayData(utcDay);
    const armsPhase = this.getArmsRacePhase(utcHour);
    const alignment = this.getAlignment(utcDay, armsPhase.name);

    if (this.elements.vsEvent) {
      this.elements.vsEvent.textContent = vsDayData.title;
    }
    if (this.elements.armsPhase) {
      this.elements.armsPhase.textContent = `${armsPhase.icon} ${armsPhase.name}`;
    }

    this.updateActionDisplay(alignment, armsPhase, utcHour, utcMinute);
  }

  updateActionDisplay(alignment, armsPhase, utcHour, utcMinute) {
    if (utcHour === 0 && utcMinute < 5) {
      this.elements.actionIcon.textContent = '⏳';
      this.elements.actionText.innerHTML = '<strong>Server Reset in Progress</strong><br>No points awarded during this period';
      this.elements.priorityLevel.textContent = 'System';
      this.elements.efficiency.textContent = '0%';
    } else if (alignment) {
      this.elements.actionIcon.textContent = '⚡';
      this.elements.actionText.innerHTML = `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason}`;
      this.elements.priorityLevel.textContent = 'Critical';
      this.elements.efficiency.textContent = '95%';
    } else {
      this.elements.actionIcon.textContent = armsPhase.icon;
      this.elements.actionText.innerHTML = `<strong>Normal Phase:</strong><br>Focus on ${armsPhase.activities[0]}`;
      this.elements.priorityLevel.textContent = 'Medium';
      this.elements.efficiency.textContent = '75%';
    }
  }

  updateCountdown() {
    const nextWindow = this.getNextHighPriorityWindow();

    if (!nextWindow) {
      this.elements.countdownTimer.textContent = '00h 00m';
      this.elements.eventName.textContent = 'No upcoming priority events';
      this.elements.eventTime.textContent = 'Check back tomorrow';
      return;
    }

    const timeDiff = nextWindow.startTime - new Date();
    
    if (timeDiff <= 0) {
      this.elements.countdownTimer.textContent = 'ACTIVE';
      this.elements.eventName.textContent = `${nextWindow.armsPhase.name} Priority Window`;
      this.elements.eventTime.textContent = 'Currently running';
      return;
    }
    
    const hours = Math.floor(timeDiff / 3600000);
    const minutes = Math.floor((timeDiff % 3600000) / 60000);
    
    this.elements.countdownTimer.textContent = `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
    this.elements.eventName.textContent = `${nextWindow.armsPhase.name} Priority Window`;
    
    const localTime = nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const utcTime = nextWindow.startTime.toUTCString().slice(17, 22);
    this.elements.eventTime.textContent = this.settings.timeFormat === 'utc' 
      ? `Starts at ${utcTime} UTC` 
      : `Starts at ${localTime} Local`;
  }

  updateActiveUsers() {
    // Simulate dynamic user count
    const baseUsers = 2400;
    const variance = Math.floor(Math.random() * 200) - 100;
    const users = baseUsers + variance;
    this.elements.activeUsers.textContent = `${(users / 1000).toFixed(1)}K`;
  }

  switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab panel
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');

    this.activeTab = tabName;
    this.updateContent();
  }

  updateContent() {
    switch (this.activeTab) {
      case 'priority':
        this.updatePriorityGrid();
        break;
      case 'schedule':
        this.updateScheduleGrid();
        break;
      case 'intelligence':
        // Intelligence content is static
        break;
    }
  }

  updatePriorityGrid() {
    const container = this.elements.priorityGrid;
    if (!container) return;
    
    container.innerHTML = '';
    const { utcDay, utcHour } = this.getCurrentUTCInfo();
    
    this.getAllHighPriorityWindows().forEach(window => {
      const isActive = (window.vsDay === utcDay) && (window.hour <= utcHour && utcHour < (window.hour + 4));
      
      const eventCard = document.createElement('div');
      eventCard.className = `priority-event ${isActive ? 'active' : ''}`;
      eventCard.innerHTML = `
        <div class="priority-badge">MAX VALUE</div>
        <div class="event-header">
          <div class="event-day">${window.vsDayData.name}</div>
          <div class="event-time">${String(window.hour).padStart(2, '0')}:00 - ${String((window.hour + 4) % 24).padStart(2, '0')}:00 UTC</div>
        </div>
        <div class="event-details">
          <div class="event-phase">${window.armsPhase.icon} ${window.armsPhase.name}</div>
          <div class="event-vs">VS Event: ${window.vsDayData.title}</div>
        </div>
        <div class="event-strategy">
          <strong>Strategy:</strong> ${window.alignment.reason}
        </div>
      `;
      
      eventCard.addEventListener('click', () => {
        this.showModal(window.alignment, window.vsDayData, window.armsPhase);
      });
      
      container.appendChild(eventCard);
    });
  }

  updateScheduleGrid() {
    const container = this.elements.scheduleGrid;
    if (!container) return;
    
    container.innerHTML = '<div class="schedule-grid"></div>';
    const grid = container.querySelector('.schedule-grid');

    // Add headers
    const headers = ['Day/Time', '00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    headers.forEach(h => {
      const headerCell = document.createElement('div');
      headerCell.className = 'schedule-header';
      headerCell.textContent = h;
      grid.appendChild(headerCell);
    });

    // Determine which days to show
    const daysToShow = this.settings.viewScope === 'today'
      ? [this.getVSDayData(new Date().getUTCDay())]
      : this.data.vs_days;
    
    daysToShow.forEach(vsDayData => {
      if (!vsDayData) return;

      // Add time slots for each day
      for (let h = 0; h < 24; h += 4) {
        const armsPhase = this.getArmsRacePhase(h);
        const cell = document.createElement('div');
        cell.className = 'schedule-cell';
        
        const alignment = this.getAlignment(vsDayData.day, armsPhase.name);
        if (alignment) cell.classList.add('priority');

        const { utcDay, utcHour } = this.getCurrentUTCInfo();
        if (vsDayData.day === utcDay && h <= utcHour && utcHour < h + 4) {
          cell.classList.add('current');
        }

        cell.innerHTML = `
          <div class="cell-phase">${armsPhase.icon} ${armsPhase.name}</div>
          ${alignment && this.settings.detailLevel === 'comprehensive' ? 
            `<div class="cell-reason">${alignment.reason}</div>` : ''}
        `;
        
        cell.addEventListener('click', () => {
          if (alignment) {
            this.showModal(alignment, vsDayData, armsPhase);
          }
        });
        
        grid.appendChild(cell);
      }
    });
  }

  populateIntelligence() {
    const container = this.elements.intelligenceContent;
    if (!container) return;

    const sections = {
      'guides': '📚 Game Guides',
      'tips': '💡 Pro Tips & Strategies',
      'season4': '🚀 Season 4 Updates'
    };

    for (const [key, title] of Object.entries(sections)) {
      const section = document.createElement('div');
      section.className = 'intel-section';
      section.innerHTML = `
        <div class="intel-header">${title}</div>
        <div class="intel-content">
          <div class="intel-inner">
            ${this.data.intelligence[key].map(item => `
              <h4>${item.title}</h4>
              <p>${item.content}</p>
            `).join('')}
          </div>
        </div>
      `;
      
      const header = section.querySelector('.intel-header');
      header.addEventListener('click', () => {
        section.classList.toggle('active');
        const content = section.querySelector('.intel-content');
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
      
      container.appendChild(section);
    }
  }

  showModal(alignment, vsDayData, armsPhase) {
    if (!alignment) return;
    
    this.elements.modalTitle.textContent = `${armsPhase.icon} ${armsPhase.name} + ${vsDayData.title}`;
    this.elements.modalBody.innerHTML = `
      <div class="modal-section">
        <h4>⭐ High Priority Alignment</h4>
        <p>${alignment.reason}</p>
      </div>
      <div class="modal-section">
        <h4>🎯 Arms Race Focus</h4>
        <p><strong>Primary Activities:</strong> ${armsPhase.activities.join(', ')}</p>
      </div>
      <div class="modal-section">
        <h4>🏆 VS Event Objectives</h4>
        <p><strong>Key Activities:</strong> ${vsDayData.activities.join(', ')}</p>
      </div>
      <div class="modal-section">
        <h4>💡 Strategy Recommendations</h4>
        <p>Focus on completing ${armsPhase.activities[0]} during this window for maximum VS points. Plan your resources and timing accordingly for optimal efficiency.</p>
      </div>
    `;
    
    this.elements.modal.style.display = 'flex';
  }

  closeModal() {
    this.elements.modal.style.display = 'none';
  }

  // Helper methods
  getCurrentUTCInfo() {
    const now = new Date();
    return { 
      utcDay: now.getUTCDay(), 
      utcHour: now.getUTCHours(), 
      utcMinute: now.getUTCMinutes() 
    };
  }

  getVSDayData(utcDay) {
    return this.data.vs_days.find(d => d.day === utcDay);
  }

  getArmsRacePhase(utcHour) {
    return this.data.arms_race_phases[Math.floor(utcHour / 4) % 6];
  }

  getAlignment(utcDay, armsPhaseName) {
    return this.data.high_priority_alignments.find(
      a => a.vs_day === utcDay && a.arms_phase === armsPhaseName
    );
  }

  getAllHighPriorityWindows() {
    const windows = [];
    this.data.high_priority_alignments.forEach(alignment => {
      const vsDayData = this.getVSDayData(alignment.vs_day);
      const armsPhase = this.data.arms_race_phases.find(p => p.name === alignment.arms_phase);
      if (vsDayData && armsPhase) {
        for (let h = 0; h < 24; h += 4) {
          if (this.getArmsRacePhase(h).name === alignment.arms_phase) {
            windows.push({ 
              vsDay: alignment.vs_day, 
              vsDayData, 
              armsPhase, 
              alignment, 
              hour: h 
            });
          }
        }
      }
    });
    return windows;
  }

  getNextHighPriorityWindow() {
    const now = new Date();
    const potentialWindows = [];

    for (let dayOffset = 0; dayOffset < 8; dayOffset++) {
      const targetDate = new Date();
      targetDate.setUTCDate(targetDate.getUTCDate() + dayOffset);
      const targetDay = targetDate.getUTCDay();

      this.data.high_priority_alignments.forEach(alignment => {
        if (alignment.vs_day !== targetDay) return;
        const armsPhase = this.data.arms_race_phases.find(p => p.name === alignment.arms_phase);
        if (!armsPhase) return;

        for (let h = 0; h < 24; h += 4) {
          if (this.getArmsRacePhase(h).name === alignment.arms_phase) {
            const eventTime = new Date(Date.UTC(
              targetDate.getUTCFullYear(), 
              targetDate.getUTCMonth(), 
              targetDate.getUTCDate(), 
              h, 0, 0
            ));
            if (eventTime > now) {
              potentialWindows.push({
                startTime: eventTime,
                vsDay: alignment.vs_day,
                vsDayData: this.getVSDayData(alignment.vs_day),
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
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new LastWarNexus();
});
