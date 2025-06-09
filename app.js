class LastWarNexus {
  constructor() {
    this.data = {
      arms_race_phases: [
        {
          id: 1, 
          name: "City Building", 
          icon: "🏗️", 
          activities: ["Building upgrades", "Construction speedups"],
          pointSources: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Upgrade headquarters", "Construct new buildings"]
        },
        {
          id: 2, 
          name: "Unit Progression", 
          icon: "⚔️", 
          activities: ["Troop training", "Training speedups"],
          pointSources: ["Train troops", "Use training speedups", "Complete troop upgrades", "Unlock new units", "Enhance unit capabilities"]
        },
        {
          id: 3, 
          name: "Tech Research", 
          icon: "🔬", 
          activities: ["Research completion", "Research speedups"],
          pointSources: ["Complete research", "Use research speedups", "Unlock new technologies", "Upgrade existing tech", "Finish research projects"]
        },
        {
          id: 4, 
          name: "Drone Boost", 
          icon: "🚁", 
          activities: ["Stamina usage", "Drone activities"],
          pointSources: ["Use stamina for attacks", "Complete drone missions", "Gather drone data", "Battle elite enemies", "Use stamina items"]
        },
        {
          id: 5, 
          name: "Hero Advancement", 
          icon: "⭐", 
          activities: ["Hero recruitment", "Hero EXP"],
          pointSources: ["Recruit new heroes", "Apply hero EXP", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"]
        },
        {
          id: 6, 
          name: "Mixed Phase", 
          icon: "🔄", 
          activities: ["Check in-game calendar"],
          pointSources: ["Check calendar for current focus", "Mixed activities", "Various point sources", "Event-specific tasks", "General progression"]
        }
      ],
      vs_days: [
        {
          day: 0, 
          name: "Sunday", 
          title: "Preparation Day", 
          activities: ["Save radar missions", "Prepare building upgrades"],
          pointActivities: ["Save radar missions for Monday", "Prepare building gifts for Tuesday", "Stack speedups", "Plan resource allocation", "Coordinate with alliance"]
        },
        {
          day: 1, 
          name: "Monday", 
          title: "Radar Training", 
          activities: ["Complete radar missions", "Use stamina for attacks"],
          pointActivities: ["Complete saved radar missions", "Use stamina for elite battles", "Attack bases for training points", "Use stamina items", "Focus on combat activities"]
        },
        {
          day: 2, 
          name: "Tuesday", 
          title: "Base Expansion", 
          activities: ["Complete building upgrades", "Use construction speedups"],
          pointActivities: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Use building gifts", "Upgrade headquarters"]
        },
        {
          day: 3, 
          name: "Wednesday", 
          title: "Age of Science", 
          activities: ["Complete research", "Use research speedups"],
          pointActivities: ["Complete research projects", "Use research speedups", "Unlock new technologies", "Use valor badges", "Focus on tech advancement"]
        },
        {
          day: 4, 
          name: "Thursday", 
          title: "Train Heroes", 
          activities: ["Use recruitment tickets", "Apply hero EXP"],
          pointActivities: ["Use recruitment tickets", "Apply hero EXP items", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"]
        },
        {
          day: 5, 
          name: "Friday", 
          title: "Total Mobilization", 
          activities: ["Use all speedup types", "Finish buildings/research"],
          pointActivities: ["Use all saved speedups", "Complete multiple building projects", "Finish research", "Train troops", "Maximum efficiency focus"]
        },
        {
          day: 6, 
          name: "Saturday", 
          title: "Enemy Buster", 
          activities: ["Attack enemy bases", "Use healing speedups"],
          pointActivities: ["Attack enemy bases", "Use healing speedups", "Focus on combat", "Eliminate threats", "Use combat-related items"]
        }
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
    this.dropdownOpen = false;
    this.expandedDetails = {
      vsDay: false,
      armsRace: false
    };
    
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
      'server-time', 'current-vs-day', 'arms-phase', 'alignment-indicator', 'alignment-status',
      'vs-day-details', 'arms-race-details', 'vs-day-content', 'arms-race-content',
      'current-vs-status', 'current-arms-status',
      'countdown-timer', 'event-name', 'event-time',
      'progress-fill', 'progress-text', 'action-icon', 'action-text', 'strategy-rating',
      'optimization-focus', 'time-remaining', 'priority-level', 'settings-toggle', 'settings-dropdown',
      'priority-grid', 'schedule-grid', 'intelligence-content',
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
      settingsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    const timeFormatDropdown = document.getElementById('time-format-dropdown');
    if (timeFormatDropdown) {
      timeFormatDropdown.addEventListener('change', (e) => {
        this.settings.timeFormat = e.target.value;
        this.updateAllDisplays();
      });
    }

    const detailLevelDropdown = document.getElementById('detail-level-dropdown');
    if (detailLevelDropdown) {
      detailLevelDropdown.addEventListener('change', (e) => {
        this.settings.detailLevel = e.target.value;
        this.updateContent();
        this.updateExpandedDetails();
      });
    }

    const viewScopeDropdown = document.getElementById('view-scope-dropdown');
    if (viewScopeDropdown) {
      viewScopeDropdown.addEventListener('change', (e) => {
        this.settings.viewScope = e.target.value;
        this.updateContent();
      });
    }

    const currentVsStatus = document.getElementById('current-vs-status');
    if (currentVsStatus) {
      currentVsStatus.addEventListener('click', () => {
        this.toggleDetail('vsDay');
      });
    }

    const currentArmsStatus = document.getElementById('current-arms-status');
    if (currentArmsStatus) {
      currentArmsStatus.addEventListener('click', () => {
        this.toggleDetail('armsRace');
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.settings-dropdown-container')) {
        this.closeDropdown();
      }
    });

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
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeDropdown();
      }
      if (e.key === '1') this.switchTab('priority');
      if (e.key === '2') this.switchTab('schedule');
      if (e.key === '3') this.switchTab('intelligence');
    });
  }

  toggleDetail(type) {
    this.expandedDetails[type] = !this.expandedDetails[type];
    
    const detailsElement = document.getElementById(type === 'vsDay' ? 'vs-day-details' : 'arms-race-details');
    const statusElement = document.getElementById(type === 'vsDay' ? 'current-vs-status' : 'current-arms-status');
    
    if (detailsElement && statusElement) {
      if (this.expandedDetails[type]) {
        detailsElement.classList.add('expanded');
        statusElement.classList.add('expanded');
      } else {
        detailsElement.classList.remove('expanded');
        statusElement.classList.remove('expanded');
      }
    }
    
    this.updateExpandedDetails();
  }

  updateExpandedDetails() {
    const { utcDay, utcHour } = this.getCurrentUTCInfo();
    const vsDayData = this.getVSDayData(utcDay);
    const armsPhase = this.getArmsRacePhase(utcHour);
    const alignment = this.getAlignment(utcDay, armsPhase.name);

    if (this.expandedDetails.vsDay) {
      const vsDayContent = document.getElementById('vs-day-content');
      if (vsDayContent) {
        vsDayContent.innerHTML = '';
        const activities = this.settings.detailLevel === 'comprehensive' 
          ? vsDayData.pointActivities 
          : vsDayData.activities;
        
        activities.forEach(activity => {
          const activityEl = document.createElement('div');
          activityEl.className = 'detail-item';
          activityEl.textContent = activity;
          vsDayContent.appendChild(activityEl);
        });
      }
    }

    if (this.expandedDetails.armsRace) {
      const armsRaceContent = document.getElementById('arms-race-content');
      if (armsRaceContent) {
        armsRaceContent.innerHTML = '';
        const sources = this.settings.detailLevel === 'comprehensive' 
          ? armsPhase.pointSources 
          : armsPhase.activities;
        
        sources.forEach((source, index) => {
          const sourceEl = document.createElement('div');
          sourceEl.className = 'detail-item';
          if (alignment && index < 2) {
            sourceEl.classList.add('high-value');
          }
          sourceEl.textContent = source;
          armsRaceContent.appendChild(sourceEl);
        });
      }
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    const dropdown = document.getElementById('settings-dropdown');
    const toggle = document.getElementById('settings-toggle');
    
    if (dropdown && toggle) {
      dropdown.classList.toggle('show', this.dropdownOpen);
      toggle.classList.toggle('active', this.dropdownOpen);
    }
  }

  closeDropdown() {
    this.dropdownOpen = false;
    const dropdown = document.getElementById('settings-dropdown');
    const toggle = document.getElementById('settings-toggle');
    
    if (dropdown && toggle) {
      dropdown.classList.remove('show');
      toggle.classList.remove('active');
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

    const currentVsDay = document.getElementById('current-vs-day');
    const armsPhaseEl = document.getElementById('arms-phase');
    const alignmentIndicator = document.getElementById('alignment-indicator');
    const alignmentStatus = document.getElementById('alignment-status');
    
    if (currentVsDay) currentVsDay.textContent = `${vsDayData.name} - ${vsDayData.title}`;
    if (armsPhaseEl) armsPhaseEl.textContent = `${armsPhase.icon} ${armsPhase.name}`;

    if (alignmentIndicator && alignmentStatus) {
      if (alignment) {
        alignmentIndicator.textContent = '⚡ HIGH PRIORITY';
        alignmentIndicator.style.color = 'var(--accent-success)';
        alignmentStatus.classList.add('priority-active');
      } else {
        alignmentIndicator.textContent = '⏳ Normal Phase';
        alignmentIndicator.style.color = 'var(--text-secondary)';
        alignmentStatus.classList.remove('priority-active');
      }
    }

    this.updateExpandedDetails();
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
      
      const timeRemainingText = this.calculatePhaseTimeRemaining(utcHour, utcMinute);
      if (timeRemaining) timeRemaining.textContent = timeRemainingText;
    } else {
      if (actionIcon) actionIcon.textContent = armsPhase.icon;
      if (actionText) actionText.innerHTML = `<strong>Normal Phase:</strong><br>Focus on ${armsPhase.activities[0]} but save major resources for high priority windows.`;
      if (priorityLevel) priorityLevel.textContent = 'Medium';
      if (strategyRating) strategyRating.textContent = 'B';
      
      let focusText = this.getOptimizationFocus(armsPhase.name);
      if (optimizationFocus) optimizationFocus.textContent = focusText;
      
      const timeRemainingText = this.calculatePhaseTimeRemaining(utcHour, utcMinute);
      if (timeRemaining) timeRemaining.textContent = timeRemainingText;
    }
  }

  calculatePhaseTimeRemaining(utcHour, utcMinute) {
    const currentPhaseStart = Math.floor(utcHour / 4) * 4;
    const currentPhaseEnd = currentPhaseStart + 4;
    
    const now = new Date();
    const phaseEndTime = new Date();
    phaseEndTime.setUTCHours(currentPhaseEnd % 24, 0, 0, 0);
    
    if (currentPhaseEnd >= 24) {
      phaseEndTime.setUTCDate(phaseEndTime.getUTCDate() + 1);
    }
    
    const timeRemaining = phaseEndTime.getTime() - now.getTime();
    
    if (timeRemaining <= 0) {
      return "Phase ending";
    }
    
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
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
      
      let cardContent = `
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
      
      if (this.settings.detailLevel === 'comprehensive') {
        cardContent += `
          <div class="event-detailed-info">
            <div class="detail-section">
              <strong>Key Activities:</strong> ${window.vsDayData.pointActivities.slice(0, 3).join(', ')}
            </div>
            <div class="detail-section">
              <strong>Arms Race Focus:</strong> ${window.armsPhase.pointSources.slice(0, 3).join(', ')}
            </div>
            <div class="detail-section">
              <strong>VS Points Potential:</strong> +${window.alignment.points.toLocaleString()}
            </div>
          </div>
        `;
      }
      
      eventCard.innerHTML = cardContent;
      
      eventCard.addEventListener('click', () => {
        this.showModal(window.alignment, window.vsDayData, window.armsPhase);
      });
      
      container.appendChild(eventCard);
    });
  }

  updateScheduleGrid() {
    const container = document.getElementById('schedule-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    const { utcDay } = this.getCurrentUTCInfo();
    let daysToShow;
    
    if (this.settings.viewScope === 'today') {
      daysToShow = [this.getVSDayData(utcDay)];
      
      const todayContainer = document.createElement('div');
      todayContainer.className = 'today-schedule';
      
      todayContainer.innerHTML = `
        <div class="today-header">
          <h3>${daysToShow[0].name} - ${daysToShow[0].title}</h3>
          <p>Today's Schedule</p>
        </div>
      `;
      
      const timeSlots = document.createElement('div');
      timeSlots.className = 'time-slots';
      
      for (let h = 0; h < 24; h += 4) {
        const armsPhase = this.getArmsRacePhase(h);
        const alignment = this.getAlignment(daysToShow[0].day, armsPhase.name);
        
        const { utcHour } = this.getCurrentUTCInfo();
        const isCurrentSlot = h <= utcHour && utcHour < h + 4;
        
        const slot = document.createElement('div');
        slot.className = `time-slot ${alignment ? 'priority' : ''} ${isCurrentSlot ? 'current' : ''}`;
        
        let slotContent = `
          <div class="slot-time">${String(h).padStart(2, '0')}:00 - ${String((h + 4) % 24).padStart(2, '0')}:00</div>
          <div class="slot-phase">${armsPhase.icon} ${armsPhase.name}</div>
        `;
        
        if (this.settings.detailLevel === 'comprehensive' && alignment) {
          slotContent += `
            <div class="slot-details">
              <div class="slot-reason">${alignment.reason}</div>
              <div class="slot-points">+${alignment.points.toLocaleString()} points</div>
            </div>
          `;
        }
        
        slot.innerHTML = slotContent;
        
        if (alignment) {
          slot.addEventListener('click', () => {
            this.showModal(alignment, daysToShow[0], armsPhase);
          });
        }
        
        timeSlots.appendChild(slot);
      }
      
      todayContainer.appendChild(timeSlots);
      container.appendChild(todayContainer);
      
    } else {
      daysToShow = this.data.vs_days;
      
      const weekGrid = document.createElement('div');
      weekGrid.className = 'schedule-grid';
      
      const headers =
