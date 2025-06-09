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
        {vs_day: 1, arms_phase: "Drone Boost", reason: "Stamina/drone activities align perfectly.", points: 3500},
        {vs_day: 1, arms_phase: "Hero Advancement", reason: "Hero EXP activities align.", points: 3200},
        {vs_day: 2, arms_phase: "City Building", reason: "Building activities align perfectly.", points: 4000},
        {vs_day: 3, arms_phase: "Tech Research", reason: "Research activities align perfectly.", points: 3800},
        {vs_day: 3, arms_phase: "Drone Boost", reason: "Drone component activities align.", points: 3300},
        {vs_day: 4, arms_phase: "Hero Advancement", reason: "Hero activities align perfectly.", points: 3600},
        {vs_day: 5, arms_phase: "City Building", reason: "Building component of mobilization.", points: 4200},
        {vs_day: 5, arms_phase: "Unit Progression", reason: "Training component of mobilization.", points: 3900},
        {vs_day: 5, arms_phase: "Tech Research", reason: "Research component of mobilization.", points: 4100},
        {vs_day: 6, arms_phase: "Unit Progression", reason: "Troop training for combat.", points: 3700},
        {vs_day: 6, arms_phase: "City Building", reason: "Construction speedups for defenses.", points: 3400}
      ],
      intelligence: {
        guides: [
          {
            title: "Complete Squad Building Guide",
            content: "Master the art of squad composition with our comprehensive guide covering hero synergies, formation strategies, and power optimization. Learn how to build squads for different game modes including PvP, PvE, and special events.",
            link: "https://lastwartutorial.com/squad-building-guide"
          },
          {
            title: "VS Points Maximization Strategy",
            content: "Learn the proven strategies to maximize VS points: Get VS tech to 100% first, save speedups for alignment windows, stack radar missions, and coordinate with Arms Race phases. Focus on unlocking 3 chests daily rather than winning every Arms Race.",
            link: "https://lastwartutorial.com/vs-optimization"
          },
          {
            title: "Power Progression & Optimization", 
            content: "Maximize your base power efficiently with our detailed progression guide. Covers building priorities, research paths, hero development, and resource management strategies for rapid power growth.",
            link: "https://lastwartutorial.com/power-optimization"
          },
          {
            title: "Season 4: Evernight Isle Complete Guide",
            content: "Navigate Season 4's new content including Evernight Isle exploration, Copper War mechanics, lighthouse systems, and faction-based gameplay. Includes exclusive rewards and optimization strategies.",
            link: "https://lastwartutorial.com/season-4-guide"
          }
        ],
        tips: [
          {
            title: "VS Event Optimization Strategies",
            content: "Key strategies from top players: Save all speedups for VS days, get VS tech to 100% first, save radar missions for Days 1/3/5, save building gifts for Days 2/5, and coordinate with Arms Race phases for 2-4x efficiency. Don't use speedups outside VS periods.",
            link: "https://lastwartutorial.com/vs-optimization"
          },
          {
            title: "Resource Saving & Timing Guide",
            content: "Master resource management: Save construction speedups for Day 2 (Base Expansion), research speedups for Day 3 (Age of Science), training speedups for Day 5 (Total Mobilization). Stack activities the day before and execute during high-priority windows.",
            link: "https://lastwartutorial.com/resource-timing"
          },
          {
            title: "Arms Race Coordination Tips",
            content: "Synchronize with Arms Race phases: Use stamina during Drone Boost, apply hero EXP during Hero Advancement, complete buildings during City Building, finish research during Tech Research. This alignment can quadruple your point efficiency.",
            link: "https://lastwartutorial.com/arms-race-coordination"
          },
          {
            title: "Advanced VS Techniques",
            content: "Pro tips: Use survivor dispatch trick for higher unit training caps, refresh secret missions for legendary tasks, coordinate alliance for secretary roles on key days, and use valor badges strategically during Age of Science phase.",
            link: "https://lastwartutorial.com/advanced-vs-techniques"
          }
        ],
        season4: [
          {
            title: "Season 4: Copper War VS Integration",
            content: "How Season 4 changes VS strategy: New Copper War mechanics affect alliance coordination, Tesla Coil skills provide combat advantages during Enemy Buster day, and Evernight Isle resources can boost VS performance.",
            link: "https://lastwartutorial.com/season4-vs-integration"
          },
          {
            title: "New Hero & Weapon VS Optimization",
            content: "Optimize Season 4 heroes for VS: Sarah's Legendary upgrade path maximizes Hero Advancement points, Lucius' Exclusive Weapon enhances combat effectiveness for Day 6, and Butler's Tesla Coil skills provide strategic advantages.",
            link: "https://lastwartutorial.com/season-4-heroes-vs"
          },
          {
            title: "Evernight Isle Resource Management",
            content: "Use Evernight Isle strategically: Lighthouse mechanics provide additional resources for VS preparation, fog navigation yields exclusive speedups, and coordinated exploration maximizes alliance benefits during VS periods.",
            link: "https://lastwartutorial.com/evernight-isle-vs"
          },
          {
            title: "Legacy Season VS Strategies",
            content: "Don't miss proven strategies from Seasons 1-3: Foundation building techniques from Season 1, expansion optimization from Season 2, and advanced combat systems from Season 3 that remain effective for current VS gameplay.",
            link: "https://lastwartutorial.com/legacy-vs-strategies"
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
    this.activeFilter = 'all';
    this.updateInterval = null;
    this.settingsCollapsed = true;
    
    this.init();
  }

  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.populateIntelligence();
    this.updateTabCounts();
    this.startUpdateLoop();
    this.updateAllDisplays();
  }

  cacheElements() {
    this.elements = {};
    const elementIds = [
      'server-time', 'vs-event', 'arms-phase', 'countdown-timer', 'event-name', 'event-time',
      'progress-fill', 'progress-text', 'action-icon', 'action-text', 'strategy-rating',
      'optimization-focus', 'time-remaining', 'priority-level', 'settings-toggle', 'settings-panel',
      'settings-collapse', 'priority-grid', 'schedule-grid', 'intelligence-content',
      'priority-count', 'schedule-count', 'intel-count', 'event-modal', 'modal-title',
      'modal-body', 'modal-close', 'modal-share', 'modal-remind'
    ];
    
    elementIds.forEach(id => {
      this.elements[id.replace('-', '')] = document.getElementById(id);
    });
  }

  setupEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.closest('.tab-btn').dataset.tab);
      });
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    const settingsToggle = document.getElementById('settings-toggle');
    if (settingsToggle) {
      settingsToggle.addEventListener('click', () => this.toggleSettings());
    }

    const settingsCollapse = document.getElementById('settings-collapse');
    if (settingsCollapse) {
      settingsCollapse.addEventListener('click', () => this.toggleSettings());
    }

    const timeFormat = document.getElementById('time-format');
    if (timeFormat) {
      timeFormat.addEventListener('change', (e) => {
        this.settings.timeFormat = e.target.value;
        this.updateAllDisplays();
      });
    }

    const detailLevel = document.getElementById('detail-level');
    if (detailLevel) {
      detailLevel.addEventListener('change', (e) => {
        this.settings.detailLevel = e.target.value;
        this.updateContent();
      });
    }

    const viewScope = document.getElementById('view-scope');
    if (viewScope) {
      viewScope.addEventListener('change', (e) => {
        this.settings.viewScope = e.target.value;
        this.updateContent();
      });
    }

    const modalClose = document.getElementById('modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeModal());
    }

    const modal = document.getElementById('event-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }

    const modalShare = document.getElementById('modal-share');
    if (modalShare) {
      modalShare.addEventListener('click', () => this.shareEvent());
    }

    const modalRemind = document.getElementById('modal-remind');
    if (modalRemind) {
      modalRemind.addEventListener('click', () => this.setReminder());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
      if (e.key === '1') this.switchTab('priority');
      if (e.key === '2') this.switchTab('schedule');
      if (e.key === '3') this.switchTab('intelligence');
    });
  }

  toggleSettings() {
    this.settingsCollapsed = !this.settingsCollapsed;
    const panel = document.getElementById('settings-panel');
    const collapse = document.getElementById('settings-collapse');
    
    if (panel) {
      panel.classList.toggle('collapsed', this.settingsCollapsed);
    }
    if (collapse) {
      collapse.textContent = this.settingsCollapsed ? '+' : '−';
    }
  }

  setFilter(filter) {
    this.activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.updateContent();
  }

  switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    const activePanel = document.getElementById(`${tabName}-tab`);
    if (activePanel) activePanel.classList.add('active');

    this.activeTab = tabName;
    this.updateContent();
  }

  startUpdateLoop() {
    if (this.updateInterval) clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => {
      this.updateAllDisplays();
    }, 1000);
  }

  updateAllDisplays() {
    this.updateServerTime();
    this.updateCurrentStatus();
    this.updateCountdown();
    this.updateProgress();
    this.updateContent();
  }

  updateServerTime() {
    const now = new Date();
    const serverTime = document.getElementById('server-time');
    if (serverTime) {
      serverTime.textContent = this.settings.timeFormat === 'utc'
        ? now.toUTCString().slice(17, 25)
        : now.toLocaleTimeString();
    }
  }

  updateCurrentStatus() {
    const { utcDay, utcHour, utcMinute } = this.getCurrentUTCInfo();
    const vsDayData = this.getVSDayData(utcDay);
    const armsPhase = this.getArmsRacePhase(utcHour);
    const alignment = this.getAlignment(utcDay, armsPhase.name);

    const vsEvent = document.getElementById('vs-event');
    const armsPhaseEl = document.getElementById('arms-phase');
    
    if (vsEvent) vsEvent.textContent = vsDayData.title;
    if (armsPhaseEl) armsPhaseEl.textContent = `${armsPhase.icon} ${armsPhase.name}`;

    this.updateActionDisplay(alignment, armsPhase, utcHour, utcMinute);
  }

  updateActionDisplay(alignment, armsPhase, utcHour, utcMinute) {
    const actionIcon = document.getElementById('action-icon');
    const actionText = document.getElementById('action-text');
    const priorityLevel = document.getElementById('priority-level');
    const strategyRating = document.getElementById('strategy-rating');
    const optimizationFocus = document.getElementById('optimization-focus');
    const timeRemaining = document.getElementById('time-remaining');

    if (utcHour === 0 && utcMinute < 5) {
      if (actionIcon) actionIcon.textContent = '⏳';
      if (actionText) actionText.innerHTML = '<strong>Server Reset in Progress</strong><br>No points awarded during this period - save your activities!';
      if (priorityLevel) priorityLevel.textContent = 'System';
      if (strategyRating) strategyRating.textContent = 'N/A';
      if (optimizationFocus) optimizationFocus.textContent = 'Wait';
      if (timeRemaining) timeRemaining.textContent = `${5 - utcMinute}m`;
    } else if (alignment) {
      if (actionIcon) actionIcon.textContent = '⚡';
      if (actionText) actionText.innerHTML = `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason} Use your saved speedups and resources now for maximum efficiency.`;
      if (priorityLevel) priorityLevel.textContent = 'Critical';
      if (strategyRating) strategyRating.textContent = 'A+';
      
      let focusText = this.getOptimizationFocus(armsPhase.name);
      if (optimizationFocus) optimizationFocus.textContent = focusText;
      
      const nextHour = ((Math.floor(utcHour / 4) + 1) * 4) % 24;
      const timeToNext = nextHour === 0 ? 24 - utcHour : nextHour - utcHour;
      if (timeRemaining) timeRemaining.textContent = `${timeToNext}h ${60 - utcMinute}m`;
    } else {
      if (actionIcon) actionIcon.textContent = armsPhase.icon;
      if (actionText) actionText.innerHTML = `<strong>Normal Phase:</strong><br>Focus on ${armsPhase.activities[0]} but save major resources for high priority windows.`;
      if (priorityLevel) priorityLevel.textContent = 'Medium';
      if (strategyRating) strategyRating.textContent = 'B';
      
      let focusText = this.getOptimizationFocus(armsPhase.name);
      if (optimizationFocus) optimizationFocus.textContent = focusText;
      
      const nextHour = ((Math.floor(utcHour / 4) + 1) * 4) % 24;
      const timeToNext = nextHour === 0 ? 24 - utcHour : nextHour - utcHour;
      if (timeRemaining) timeRemaining.textContent = `${timeToNext}h ${60 - utcMinute}m`;
    }
  }

  getOptimizationFocus(phaseName) {
    const focusMap = {
      "City Building": "Construction Speedups",
      "Unit Progression": "Training Speedups", 
      "Tech Research": "Research Speedups",
      "Drone Boost": "Stamina & Drone Data",
      "Hero Advancement": "Hero EXP & Recruitment",
      "Mixed Phase": "Check Calendar"
    };
    return focusMap[phaseName] || "General Activities";
  }

  updateCountdown() {
    const nextWindow = this.getNextHighPriorityWindow();
    const countdownTimer = document.getElementById('countdown-timer');
    const eventName = document.getElementById('event-name');
    const eventTime = document.getElementById('event-time');

    if (!nextWindow) {
      if (countdownTimer) countdownTimer.textContent = 'No upcoming events';
      if (eventName) eventName.textContent = '';
      if (eventTime) eventTime.textContent = '';
      return;
    }

    const timeDiff = nextWindow.startTime - new Date();
    
    if (timeDiff <= 0) {
      if (countdownTimer) countdownTimer.textContent = "ACTIVE";
      if (eventName) eventName.textContent = `${nextWindow.armsPhase.name} Priority Window`;
      if (eventTime) eventTime.textContent = 'Currently running';
      return;
    }
    
    const hours = Math.floor(timeDiff / 3600000);
    const minutes = Math.floor((timeDiff % 3600000) / 60000);
    
    if (countdownTimer) countdownTimer.textContent = `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
    if (eventName) eventName.textContent = `${nextWindow.armsPhase.name} Priority Window`;
    
    const localTime = nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const utcTime = nextWindow.startTime.toUTCString().slice(17, 22);
    if (eventTime) eventTime.textContent = this.settings.timeFormat === 'utc' 
      ? `Starts at ${utcTime} UTC` 
      : `Starts at ${localTime} Local`;
  }

  updateProgress() {
    const now = new Date();
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (!progressFill || !progressText) return;
    
    const phaseStartHour = Math.floor(now.getUTCHours() / 4) * 4;
    const phaseStart = new Date(now);
    phaseStart.setUTCHours(phaseStartHour, 0, 0, 0);
    
    const elapsedMs = now - phaseStart;
    const phaseLengthMs = 4 * 60 * 60 * 1000;
    const percent = Math.max(0, Math.min(100, (elapsedMs / phaseLengthMs) * 100));
    
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${Math.round(percent)}% complete`;
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
        break;
    }
  }

  updateTabCounts() {
    const priorityCount = document.getElementById('priority-count');
    const scheduleCount = document.getElementById('schedule-count');
    const intelCount = document.getElementById('intel-count');
    
    if (priorityCount) priorityCount.textContent = this.getAllHighPriorityWindows().length;
    if (scheduleCount) scheduleCount.textContent = '42';
    if (intelCount) intelCount.textContent = Object.values(this.data.intelligence).flat().length;
  }

  updatePriorityGrid() {
    const container = document.getElementById('priority-grid');
    if (!container) return;
    
    container.innerHTML = '';
    const { utcDay, utcHour } = this.getCurrentUTCInfo();
    let windows = this.getAllHighPriorityWindows();
    
    if (this.activeFilter === 'active') {
      windows = windows.filter(w => w.vsDay === utcDay && w.hour <= utcHour && utcHour < (w.hour + 4));
    } else if (this.activeFilter === 'upcoming') {
      const now = new Date();
      windows = windows.filter(w => {
        const eventTime = new Date();
        eventTime.setUTCDate(eventTime.getUTCDate() + (w.vsDay - utcDay + 7) % 7);
        eventTime.setUTCHours(w.hour, 0, 0, 0);
        return eventTime > now;
      });
    }
    
    windows.forEach(window => {
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
    const container = document.getElementById('schedule-grid');
    if (!container) return;
    
    container.innerHTML = '<div class="schedule-grid"></div>';
    const grid = container.querySelector('.schedule-grid');

    const headers = ['Day/Time', '00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    headers.forEach(h => {
      const headerCell = document.createElement('div');
      headerCell.className = 'schedule-header';
      headerCell.textContent = h;
      grid.appendChild(headerCell);
    });

    const daysToShow = this.settings.viewScope === 'today'
      ? [this.getVSDayData(new Date().getUTCDay())]
      : this.data.vs_days;
    
    daysToShow.forEach(vsDayData => {
      if (!vsDayData) return;

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
    const container = document.getElementById('intelligence-content');
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
              <p><a href="${item.link}" target="_blank" rel="noopener">View Complete Guide →</a></p>
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
    
    const modal = document.getElementById('event-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;

    if (modalTitle) {
      modalTitle.textContent = `${armsPhase.icon} ${armsPhase.name} + ${vsDayData.title}`;
    }

    modalBody.innerHTML = `
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
    
    modal.style.display = 'flex';
  }

  closeModal() {
    const modal = document.getElementById('event-modal');
    if (modal) modal.style.display = 'none';
  }

  shareEvent() {
    if (navigator.share) {
      navigator.share({
        title: 'Last War Nexus Event',
        text: 'Check out this high priority event!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  }

  setReminder() {
    alert('Reminder feature coming soon!');
  }

  getCurrentUTCInfo() {
    const now = new Date();
    return { 
      utcDay: now.getUTCDay(), 
      utcHour: now.getUTCHours(), 
      utcMinute: now.getUTCMinutes() 
    };
  }

  getVSDayData(utcDay) {
    return this.data.vs_days.find(d => d.day === utcDay) || this.data.vs_days[0];
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

document.addEventListener('DOMContentLoaded', () => {
  new LastWarNexus();
});
