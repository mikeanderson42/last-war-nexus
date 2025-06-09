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
