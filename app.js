// Enhanced Last War Nexus - Complete Working Implementation
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
            title: "Season 4: Evernight Isle & Copper War",
            content: "Season 4 introduces the Evernight Isle with new Copper War mechanics featuring phased alliance matchups and faction-based attack/defense roles. Master the new lighthouse mechanics for maximum rewards."
          },
          {
            title: "Drone Data & Battle Optimization",
            content: "Maximize Battle Data collection through Doom Elites and radar tasks. Save resources for Drone Boost phases and VS Duel events for optimal rewards. Focus on upgrading both Battle Data and Drone Parts for balanced progression."
          }
        ],
        tips: [
          {
            title: "Resource & Base Optimization",
            content: "Prioritize Headquarters upgrades, utilize Alliance Help for troop healing, and participate in Bullseye Loot events for maximum resource gains. Use Monica for increased resource collection rates."
          },
          {
            title: "Combat & Event Strategy",
            content: "Focus on alliance coordination during Copper War events. Always verify screen strength before attacking to minimize soldier losses. Plan your attacks during optimal Arms Race phases for maximum efficiency."
          }
        ],
        season4: [
          {
            title: "Season 4: Key Changes",
            content: "Copper War now features 8 rounds with faction role switching and increased building defense caps. Tesla Coil skills provide 21x21 range coverage for strategic advantages."
          },
          {
            title: "Hero & Weapon Updates",
            content: "Sarah can now be upgraded to Legendary status. New exclusive weapons for Lucius and Tesla Coil skills for Butler enhance Season 4 gameplay significantly."
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
    this.elements = {
      serverTime: document.getElementById('server-time'),
      vsEvent: document.getElementById('vs-event'),
      armsPhase: document.getElementById('arms-phase'),
      countdownTimer: document.getElementById('countdown-timer'),
      eventName: document.getElementById('event-name'),
      eventTime: document.getElementById('event-time'),
      progressFill: document.getElementById('progress-fill'),
      progressText: document.getElementById('progress-text'),
      actionIcon: document.getElementById('action-icon'),
      actionText: document.getElementById('action-text'),
      strategyRating: document.getElementById('strategy-rating'),
      pointsPotential: document.getElementById('points-potential'),
      timeRemaining: document.getElementById('time-remaining'),
      priorityLevel: document.getElementById('priority-level'),
      settingsToggle: document.getElementById('settings-toggle'),
      settingsPanel: document.getElementById('settings-panel'),
      settingsCollapse: document.getElementById('settings-collapse'),
      priorityGrid: document.getElementById('priority-grid'),
      scheduleGrid: document.getElementById('schedule-grid'),
      intelligenceContent: document.getElementById('intelligence-content'),
      priorityCount: document.getElementById('priority-count'),
      scheduleCount: document.getElementById('schedule-count'),
      intelCount: document.getElementById('intel-count'),
      modal: document.getElementById('event-modal'),
      modalTitle: document.getElementById('modal-title'),
      modalBody: document.getElementById('modal-body'),
      modalClose: document.getElementById('modal-close'),
      modalShare: document.getElementById('modal-share'),
      modalRemind: document.getElementById('modal-remind')
    };
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.closest('.tab-btn').dataset.tab);
      });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // Settings controls
    if (this.elements.settingsToggle) {
      this.elements.settingsToggle.addEventListener('click', () => {
        this.toggleSettings();
      });
    }

    if (this.elements.settingsCollapse) {
      this.elements.settingsCollapse.addEventListener('click', () => {
        this.toggleSettings();
      });
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

    // Modal controls
    if (this.elements.modalClose) {
      this.elements.modalClose.addEventListener('click', () => this.closeModal());
    }
    
    if (this.elements.modal) {
      this.elements.modal.addEventListener('click', (e) => {
        if (e.target === this.elements.modal) this.closeModal();
      });
    }

    // Modal action buttons
    if (this.elements.modalShare) {
      this.elements.modalShare.addEventListener('click', () => {
        this.shareEvent();
      });
    }

    if (this.elements.modalRemind) {
      this.elements.modalRemind.addEventListener('click', () => {
        this.setReminder();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
      if (e.key === '1') this.switchTab('priority');
      if (e.key === '2') this.switchTab('schedule');
      if (e.key === '3') this.switchTab('intelligence');
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        this.toggleSettings();
      }
    });
  }

  toggleSettings() {
    this.settingsCollapsed = !this.settingsCollapsed;
    if (this.elements.settingsPanel) {
      this.elements.settingsPanel.classList.toggle('collapsed', this.settingsCollapsed);
    }
    if (this.elements.settingsCollapse) {
      this.elements.settingsCollapse.textContent = this.settingsCollapsed ? '+' : '−';
    }
  }

  setFilter(filter) {
    this.activeFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
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
      if (this.elements.actionIcon) this.elements.actionIcon.textContent = '⏳';
      if (this.elements.actionText) this.elements.actionText.innerHTML = '<strong>Server Reset in Progress</strong><br>No points awarded during this period';
      if (this.elements.priorityLevel) this.elements.priorityLevel.textContent = 'System';
      if (this.elements.strategyRating) this.elements.strategyRating.textContent = 'N/A';
      if (this.elements.pointsPotential) this.elements.pointsPotential.textContent = '0';
      if (this.elements.timeRemaining) this.elements.timeRemaining.textContent = `${5 - utcMinute}m`;
    } else if (alignment) {
      if (this.elements.actionIcon) this.elements.actionIcon.textContent = '⚡';
      if (this.elements.actionText) this.elements.actionText.innerHTML = `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason}`;
      if (this.elements.priorityLevel) this.elements.priorityLevel.textContent = 'Critical';
      if (this
