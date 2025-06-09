class LastWarNexus {
  constructor() {
    this.isInitialized = false;
    this.initializationAttempts = 0;
    this.maxInitAttempts = 3;
    this.currentServer = 555; // Default server for Arms Race calculation
    
    // Arms Race server calculation constants
    this.SERVER_LAUNCH_BASE = {
      server: 93,
      date: new Date("2024-01-20T08:00:00Z"),
      serversPerDay: 3.2
    };
    
    this.data = {
      arms_race_phases: [
        {
          id: 6, 
          name: "Mixed Phase", 
          icon: "🔄", 
          activities: ["Check in-game calendar"],
          pointSources: ["Check calendar for current focus", "Mixed activities", "Various point sources", "Event-specific tasks", "General progression"]
        },
        {
          id: 4, 
          name: "Drone Boost", 
          icon: "🚁", 
          activities: ["Stamina usage", "Drone activities"],
          pointSources: ["Use stamina for attacks", "Complete drone missions", "Gather drone data", "Battle elite enemies", "Use stamina items"]
        },
        {
          id: 1, 
          name: "City Building", 
          icon: "🏗️", 
          activities: ["Building upgrades", "Construction speedups"],
          pointSources: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Upgrade headquarters", "Construct new buildings"]
        },
        {
          id: 3, 
          name: "Tech Research", 
          icon: "🔬", 
          activities: ["Research completion", "Research speedups"],
          pointSources: ["Complete research", "Use research speedups", "Unlock new technologies", "Upgrade existing tech", "Finish research projects"]
        },
        {
          id: 5, 
          name: "Hero Advancement", 
          icon: "⭐", 
          activities: ["Hero recruitment", "Hero EXP"],
          pointSources: ["Recruit new heroes", "Apply hero EXP", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"]
        },
        {
          id: 2, 
          name: "Unit Progression", 
          icon: "⚔️", 
          activities: ["Troop training", "Training speedups"],
          pointSources: ["Train troops", "Use training speedups", "Complete troop upgrades", "Unlock new units", "Enhance unit capabilities"]
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
    
    this.elements = {};
    this.eventListeners = [];
    
    this.initializeWhenReady();
  }

  initializeWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.init();
      });
    } else {
      this.init();
    }
  }

  init() {
    try {
      this.initializationAttempts++;
      console.log(`Initialization attempt ${this.initializationAttempts}`);
      
      if (!this.cacheElements()) {
        if (this.initializationAttempts < this.maxInitAttempts) {
          setTimeout(() => this.init(), 100);
          return;
        } else {
          console.error('Failed to initialize after maximum attempts');
          return;
        }
      }

      this.setupEventListeners();
      this.populateIntelligence();
      this.updateTabCounts();
      this.loadSavedServer(); // Load saved server before updating displays
      this.updateAllDisplays();
      this.startUpdateLoop();
      
      this.isInitialized = true;
      console.log('Last War Nexus initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
      if (this.initializationAttempts < this.maxInitAttempts) {
        setTimeout(() => this.init(), 200);
      }
    }
  }

  cacheElements() {
    const elementIds = [
      'server-time', 'current-vs-day', 'arms-phase', 'alignment-indicator', 'alignment-status',
      'vs-day-details', 'arms-race-details', 'vs-day-content', 'arms-race-content',
      'current-vs-status', 'current-arms-status', 'display-server',
      'countdown-timer', 'event-name', 'event-time',
      'progress-fill', 'progress-text', 'action-icon', 'action-text', 'strategy-rating',
      'optimization-focus', 'time-remaining', 'priority-level', 'settings-toggle', 'settings-dropdown',
      'priority-grid', 'schedule-grid', 'intelligence-content',
      'priority-count', 'schedule-count', 'intel-count', 'event-modal', 'modal-title',
      'modal-body', 'modal-close', 'modal-share', 'modal-remind',
      'time-format-dropdown', 'detail-level-dropdown', 'view-scope-dropdown',
      'bottom-priority-cards', 'bottom-priority-grid', 'minimize-cards', 'bottom-cards-content',
      'server-toggle', 'server-dropdown', 'server-input', 'apply-server', 'current-server',
      'server-launch', 'phase-offset', 'current-phase-info'
    ];
    
    let allElementsFound = true;
    
    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        this.elements[id.replace(/-/g, '')] = element;
      } else {
        console.warn(`Element not found: ${id}`);
        allElementsFound = false;
      }
    });
    
    return allElementsFound;
  }

  setupEventListeners() {
    this.removeEventListeners();
    
    try {
      // Arms Race server functionality
      if (this.elements.serverinput) {
        this.addEventListener(this.elements.serverinput, 'input', (e) => {
          this.updateServerInfo(e.target.value);
        });
      }

      if (this.elements.applyserver) {
        this.addEventListener(this.elements.applyserver, 'click', (e) => {
          e.preventDefault();
          this.applyServerSettings();
        });
      }

      if (this.elements.servertoggle) {
        this.addEventListener(this.elements.servertoggle, 'click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleServerDropdown();
        });
      }

      // Existing event listeners (preserved exactly)
      this.addEventListeners('.tab-btn', 'click', (e) => {
        e.preventDefault();
        const tabName = e.target.closest('.tab-btn')?.dataset?.tab;
        if (tabName) {
          this.switchTab(tabName);
        }
      });

      this.addEventListeners('.filter-btn', 'click', (e) => {
        e.preventDefault();
        const filter = e.target.dataset?.filter;
        if (filter) {
          this.setFilter(filter);
        }
      });

      if (this.elements.settingstoggle) {
        this.addEventListener(this.elements.settingstoggle, 'click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleDropdown();
        });
      }

      if (this.elements.timeformatdropdown) {
        this.addEventListener(this.elements.timeformatdropdown, 'change', (e) => {
          this.settings.timeFormat = e.target.value;
          this.updateAllDisplays();
          this.updateBottomPriorityCards();
        });
      }

      if (this.elements.detailleveldropdown) {
        this.addEventListener(this.elements.detailleveldropdown, 'change', (e) => {
          this.settings.detailLevel = e.target.value;
          this.updateContent();
          this.updateExpandedDetails();
        });
      }

      if (this.elements.viewscopedropdown) {
        this.addEventListener(this.elements.viewscopedropdown, 'change', (e) => {
          this.settings.viewScope = e.target.value;
          this.updateContent();
        });
      }

      if (this.elements.currentvsstatus) {
        this.addEventListener(this.elements.currentvsstatus, 'click', (e) => {
          e.preventDefault();
          this.toggleDetail('vsDay');
        });
      }

      if (this.elements.currentarmsstatus) {
        this.addEventListener(this.elements.currentarmsstatus, 'click', (e) => {
          e.preventDefault();
          this.toggleDetail('armsRace');
        });
      }

      if (this.elements.minimizecards) {
        this.addEventListener(this.elements.minimizecards, 'click', (e) => {
          e.preventDefault();
          this.toggleBottomCards();
        });
      }

      this.addEventListener(document, 'click', (e) => {
        if (!e.target.closest('.settings-dropdown-container') && !e.target.closest('.server-dropdown-container')) {
          this.closeDropdown();
          this.closeServerDropdown();
        }
      });

      if (this.elements.modalclose) {
        this.addEventListener(this.elements.modalclose, 'click', (e) => {
          e.preventDefault();
          this.closeModal();
        });
      }

      if (this.elements.eventmodal) {
        this.addEventListener(this.elements.eventmodal, 'click', (e) => {
          if (e.target === this.elements.eventmodal) {
            e.preventDefault();
            this.closeModal();
          }
        });
      }

      if (this.elements.modalshare) {
        this.addEventListener(this.elements.modalshare, 'click', (e) => {
          e.preventDefault();
          this.shareEvent();
        });
      }

      if (this.elements.modalremind) {
        this.addEventListener(this.elements.modalremind, 'click', (e) => {
          e.preventDefault();
          this.setReminder();
        });
      }

      this.addEventListener(document, 'keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeModal();
          this.closeDropdown();
          this.closeServerDropdown();
        }
        if (e.key === '1') this.switchTab('priority');
        if (e.key === '2') this.switchTab('schedule');
        if (e.key === '3') this.switchTab('intelligence');
      });

      console.log('Event listeners set up successfully');
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  // Arms Race server calculation methods
  calculateServerLaunchDate(serverNumber) {
    try {
      const serverDiff = serverNumber - this.SERVER_LAUNCH_BASE.server;
      const daysFromBase = Math.floor(serverDiff / this.SERVER_LAUNCH_BASE.serversPerDay);
      
      const launchDate = new Date(this.SERVER_LAUNCH_BASE.date);
      launchDate.setDate(launchDate.getDate() + daysFromBase);
      
      const hourOffset = (serverNumber % 3) - 1;
      launchDate.setHours(launchDate.getHours() + hourOffset);
      
      return launchDate;
    } catch (error) {
      console.error('Error calculating server launch date:', error);
      return new Date();
    }
  }

  getArmsRacePhaseForServer(serverNumber, currentTime = new Date()) {
    try {
      const serverLaunch = this.calculateServerLaunchDate(serverNumber);
      const daysSinceLaunch = Math.floor((currentTime - serverLaunch) / (1000 * 60 * 60 * 24));
      
      const utcHour = currentTime.getUTCHours();
      const serverOffset = (serverNumber % 6);
      const adjustedHour = (utcHour + serverOffset) % 24;
      
      const phaseIndex = Math.floor(adjustedHour / 4);
      const weeklyOffset = (daysSinceLaunch % 7);
      const finalPhaseIndex = (phaseIndex + weeklyOffset) % 6;
      
      return this.data.arms_race_phases[finalPhaseIndex];
    } catch (error) {
      console.error('Error calculating Arms Race phase:', error);
      return this.data.arms_race_phases[0];
    }
  }

  updateServerInfo(serverNumber) {
    try {
      if (!serverNumber || serverNumber < 0 || serverNumber > 9999) {
        if (this.elements.serverlaunch) this.elements.serverlaunch.textContent = 'Invalid server';
        if (this.elements.phaseoffset) this.elements.phaseoffset.textContent = '--';
        if (this.elements.currentphaseinfo) this.elements.currentphaseinfo.textContent = '--';
        return;
      }

      const launchDate = this.calculateServerLaunchDate(parseInt(serverNumber));
      const currentPhase = this.getArmsRacePhaseForServer(parseInt(serverNumber));
      const serverOffset = (parseInt(serverNumber) % 6);
      
      if (this.elements.serverlaunch) {
        this.elements.serverlaunch.textContent = launchDate.toLocaleDateString();
      }
      
      if (this.elements.phaseoffset) {
        this.elements.phaseoffset.textContent = `+${serverOffset}h`;
      }
      
      if (this.elements.currentphaseinfo) {
        this.elements.currentphaseinfo.textContent = `${currentPhase.icon} ${currentPhase.name}`;
      }
    } catch (error) {
      console.error('Error updating server info:', error);
    }
  }

  applyServerSettings() {
    try {
      const serverNumber = parseInt(this.elements.serverinput?.value);
      
      if (!serverNumber || serverNumber < 0 || serverNumber > 9999) {
        alert('Please enter a valid server number (0-9999)');
        return;
      }

      this.currentServer = serverNumber;
      
      if (this.elements.currentserver) this.elements.currentserver.textContent = serverNumber;
      if (this.elements.displayserver) this.elements.displayserver.textContent = serverNumber;
      
      localStorage.setItem('lastWarNexusServer', serverNumber.toString());
      
      this.closeServerDropdown();
      this.updateAllDisplays();
      
      console.log(`Arms Race server updated to: ${serverNumber}`);
    } catch (error) {
      console.error('Error applying server settings:', error);
    }
  }

  loadSavedServer() {
    try {
      const savedServer = localStorage.getItem('lastWarNexusServer');
      if (savedServer) {
        const serverNumber = parseInt(savedServer);
        this.currentServer = serverNumber;
        
        if (this.elements.serverinput) this.elements.serverinput.value = serverNumber;
        if (this.elements.currentserver) this.elements.currentserver.textContent = serverNumber;
        if (this.elements.displayserver) this.elements.displayserver.textContent = serverNumber;
        
        this.updateServerInfo(serverNumber);
      }
    } catch (error) {
      console.error('Error loading saved server:', error);
    }
  }

  toggleServerDropdown() {
    try {
      if (this.elements.serverdropdown) {
        const isOpen = this.elements.serverdropdown.classList.contains('show');
        
        this.closeDropdown();
        
        if (isOpen) {
          this.closeServerDropdown();
        } else {
          this.elements.serverdropdown.classList.add('show');
          this.elements.servertoggle?.classList.add('active');
          
          if (this.elements.serverinput?.value) {
            this.updateServerInfo(this.elements.serverinput.value);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling server dropdown:', error);
    }
  }

  closeServerDropdown() {
    try {
      if (this.elements.serverdropdown) {
        this.elements.serverdropdown.classList.remove('show');
        this.elements.servertoggle?.classList.remove('active');
      }
    } catch (error) {
      console.error('Error closing server dropdown:', error);
    }
  }

  // Enhanced getArmsRacePhase to use server-specific calculation
  getArmsRacePhase(utcHour) {
    try {
      if (this.currentServer) {
        return this.getArmsRacePhaseForServer(this.currentServer);
      }
      
      // Fallback to original logic
      const phaseSchedule = [
        { hours: [0, 1, 2, 3], index: 0 },
        { hours: [4, 5, 6, 7], index: 1 },
        { hours: [8, 9, 10, 11], index: 2 },
        { hours: [12, 13, 14, 15], index: 3 },
        { hours: [16, 17, 18, 19], index: 4 },
        { hours: [20, 21, 22, 23], index: 5 }
      ];
      
      for (const phase of phaseSchedule) {
        if (phase.hours.includes(utcHour)) {
          return this.data.arms_race_phases[phase.index];
        }
      }
      
      return this.data.arms_race_phases[0];
    } catch (error) {
      console.error('Error getting Arms Race phase:', error);
      return this.data.arms_race_phases[0];
    }
  }

  // All remaining methods stay exactly the same as your working file
  addEventListeners(selector, event, handler) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      this.addEventListener(element, event, handler);
    });
  }

  addEventListener(element, event, handler) {
    if (element && typeof handler === 'function') {
      element.addEventListener(event, handler);
      this.eventListeners.push({ element, event, handler });
    }
  }

  removeEventListeners() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler);
      }
    });
    this.eventListeners = [];
  }

  safeUpdateElement(elementKey, property, value) {
    try {
      const element = this.elements[elementKey];
      if (element) {
        if (property === 'textContent') {
          element.textContent = value;
        } else if (property === 'innerHTML') {
          element.innerHTML = value;
        } else if (property === 'style') {
          Object.assign(element.style, value);
        } else {
          element[property] = value;
        }
      }
    } catch (error) {
      console.warn(`Error updating element ${elementKey}:`, error);
    }
  }

  toggleDetail(type) {
    try {
      this.expandedDetails[type] = !this.expandedDetails[type];
      
      const detailsElement = type === 'vsDay' ? this.elements.vsdaydetails : this.elements.armsracedetails;
      const statusElement = type === 'vsDay' ? this.elements.currentvsstatus : this.elements.currentarmsstatus;
      
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
    } catch (error) {
      console.error('Error toggling detail:', error);
    }
  }

  updateExpandedDetails() {
    try {
      const { utcDay, utcHour } = this.getCurrentUTCInfo();
      const vsDayData = this.getVSDayData(utcDay);
      const armsPhase = this.getArmsRacePhase(utcHour);
      const alignment = this.getAlignment(utcDay, armsPhase.name);

      if (this.expandedDetails.vsDay && this.elements.vsdaycontent) {
        this.elements.vsdaycontent.innerHTML = '';
        const activities = this.settings.detailLevel === 'comprehensive' 
          ? vsDayData.pointActivities 
          : vsDayData.activities;
        
        activities.forEach(activity => {
          const activityEl = document.createElement('div');
          activityEl.className = 'detail-item';
          activityEl.textContent = activity;
          this.elements.vsdaycontent.appendChild(activityEl);
        });
      }

      if (this.expandedDetails.armsRace && this.elements.armsracecontent) {
        this.elements.armsracecontent.innerHTML = '';
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
          this.elements.armsracecontent.appendChild(sourceEl);
        });
      }
    } catch (error) {
      console.error('Error updating expanded details:', error);
    }
  }

  toggleDropdown() {
    try {
      this.dropdownOpen = !this.dropdownOpen;
      
      if (this.elements.settingsdropdown && this.elements.settingstoggle) {
        this.elements.settingsdropdown.classList.toggle('show', this.dropdownOpen);
        this.elements.settingstoggle.classList.toggle('active', this.dropdownOpen);
      }
    } catch (error) {
      console.error('Error toggling dropdown:', error);
    }
  }

  closeDropdown() {
    try {
      this.dropdownOpen = false;
      if (this.elements.settingsdropdown && this.elements.settingstoggle) {
        this.elements.settingsdropdown.classList.remove('show');
        this.elements.settingstoggle.classList.remove('active');
      }
    } catch (error) {
      console.error('Error closing dropdown:', error);
    }
  }

  setFilter(filter) {
    try {
      this.activeFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
      });
      this.updateContent();
    } catch (error) {
      console.error('Error setting filter:', error);
    }
  }

  switchTab(tabName) {
    try {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
      const activePanel = document.getElementById(`${tabName}-tab`);
      if (activePanel) activePanel.classList.add('active');

      this.activeTab = tabName;
      this.updateContent();
    } catch (error) {
      console.error('Error switching tab:', error);
    }
  }

  startUpdateLoop() {
    try {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      
      this.updateInterval = setInterval(() => {
        if (this.isInitialized) {
          this.updateAllDisplays();
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting update loop:', error);
    }
  }

  updateAllDisplays() {
    try {
      this.updateServerTime();
      this.updateCurrentStatus();
      this.updateCountdown();
      this.updateProgress();
      this.updateBottomPriorityCards();
    } catch (error) {
      console.error('Error updating displays:', error);
    }
  }

  updateServerTime() {
    try {
      const now = new Date();
      const timeString = this.settings.timeFormat === 'utc'
        ? now.toUTCString().slice(17, 25)
        : now.toLocaleTimeString();
      
      this.safeUpdateElement('servertime', 'textContent', timeString);
    } catch (error) {
      console.error('Error updating server time:', error);
    }
  }

  updateCurrentStatus() {
    try {
      const { utcDay, utcHour, utcMinute } = this.getCurrentUTCInfo();
      const vsDayData = this.getVSDayData(utcDay);
      const armsPhase = this.getArmsRacePhase(utcHour);
      const alignment = this.getAlignment(utcDay, armsPhase.name);

      this.safeUpdateElement('currentvsday', 'textContent', `${vsDayData.name} - ${vsDayData.title}`);
      this.safeUpdateElement('armsphase', 'textContent', `${armsPhase.icon} ${armsPhase.name}`);

      if (this.elements.alignmentindicator && this.elements.alignmentstatus) {
        if (alignment) {
          this.safeUpdateElement('alignmentindicator', 'textContent', '⚡ HIGH PRIORITY');
          this.elements.alignmentindicator.style.color = 'var(--accent-success)';
          this.elements.alignmentstatus.classList.add('priority-active');
        } else {
          this.safeUpdateElement('alignmentindicator', 'textContent', '⏳ Normal Phase');
          this.elements.alignmentindicator.style.color = 'var(--text-secondary)';
          this.elements.alignmentstatus.classList.remove('priority-active');
        }
      }

      this.updateExpandedDetails();
      this.updateActionDisplay(alignment, armsPhase, utcHour, utcMinute);
    } catch (error) {
      console.error('Error updating current status:', error);
    }
  }

  updateActionDisplay(alignment, armsPhase, utcHour, utcMinute) {
    try {
      if (utcHour === 0 && utcMinute < 5) {
        this.safeUpdateElement('actionicon', 'textContent', '⏳');
        this.safeUpdateElement('actiontext', 'innerHTML', '<strong>Server Reset in Progress</strong><br>No points awarded during this period - save your activities!');
        this.safeUpdateElement('prioritylevel', 'textContent', 'System');
        this.safeUpdateElement('strategyrating', 'textContent', 'N/A');
        this.safeUpdateElement('optimizationfocus', 'textContent', 'Wait');
        this.safeUpdateElement('timeremaining', 'textContent', `${5 - utcMinute}m`);
      } else if (alignment) {
        this.safeUpdateElement('actionicon', 'textContent', '⚡');
        this.safeUpdateElement('actiontext', 'innerHTML', `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason} Use your saved speedups and resources now for maximum efficiency.`);
        this.safeUpdateElement('prioritylevel', 'textContent', 'Critical');
        this.safeUpdateElement('strategyrating', 'textContent', 'A+');
        
        const focusText = this.getOptimizationFocus(armsPhase.name);
        this.safeUpdateElement('optimizationfocus', 'textContent', focusText);
        
        const timeRemainingText = this.calculatePhaseTimeRemaining(utcHour, utcMinute);
        this.safeUpdateElement('timeremaining', 'textContent', timeRemainingText);
      } else {
        this.safeUpdateElement('actionicon', 'textContent', armsPhase.icon);
        this.safeUpdateElement('actiontext', 'innerHTML', `<strong>Normal Phase:</strong><br>Focus on ${armsPhase.activities[0]} but save major resources for high priority windows.`);
        this.safeUpdateElement('prioritylevel', 'textContent', 'Medium');
        this.safeUpdateElement('strategyrating', 'textContent', 'B');
        
        const focusText = this.getOptimizationFocus(armsPhase.name);
        this.safeUpdateElement('optimizationfocus', 'textContent', focusText);
        
        const timeRemainingText = this.calculatePhaseTimeRemaining(utcHour, utcMinute);
        this.safeUpdateElement('timeremaining', 'textContent', timeRemainingText);
      }
    } catch (error) {
      console.error('Error updating action display:', error);
    }
  }

  calculatePhaseTimeRemaining(utcHour, utcMinute) {
    try {
      const phaseSchedule = [
        { start: 0, end: 4 },
        { start: 4, end: 8 },
        { start: 8, end: 12 },
        { start: 12, end: 16 },
        { start: 16, end: 20 },
        { start: 20, end: 24 }
      ];
      
      let currentPhaseEnd = null;
      
      for (const phase of phaseSchedule) {
        if (utcHour >= phase.start && utcHour < phase.end) {
          currentPhaseEnd = phase.end;
          break;
        }
      }
      
      if (!currentPhaseEnd) return "Unknown";
      
      const now = new Date();
      const phaseEndTime = new Date();
      phaseEndTime.setUTCHours(currentPhaseEnd % 24, 0, 0, 0);
      
      if (currentPhaseEnd === 24) {
        phaseEndTime.setUTCDate(phaseEndTime.getUTCDate() + 1);
        phaseEndTime.setUTCHours(0, 0, 0, 0);
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
    } catch (error) {
      console.error('Error calculating phase time remaining:', error);
      return "Unknown";
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
    try {
      const nextWindow = this.getNextHighPriorityWindow();
      
      if (!nextWindow) {
        this.safeUpdateElement('countdowntimer', 'textContent', 'No upcoming events');
        this.safeUpdateElement('eventname', 'textContent', '');
        this.safeUpdateElement('eventtime', 'textContent', '');
        return;
      }

      const timeDiff = nextWindow.startTime - new Date();
      
      if (timeDiff <= 0) {
        this.safeUpdateElement('countdowntimer', 'textContent', "ACTIVE");
        this.safeUpdateElement('eventname', 'textContent', `${nextWindow.armsPhase.name} Priority Window`);
        this.safeUpdateElement('eventtime', 'textContent', 'Currently running');
        return;
      }
      
      const hours = Math.floor(timeDiff / 3600000);
      const minutes = Math.floor((timeDiff % 3600000) / 60000);
      
      this.safeUpdateElement('countdowntimer', 'textContent', `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`);
      this.safeUpdateElement('eventname', 'textContent', `${nextWindow.armsPhase.name} Priority Window`);
      
      const localTime = nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const utcTime = nextWindow.startTime.toUTCString().slice(17, 22);
      const timeText = this.settings.timeFormat === 'utc' 
        ? `Starts at ${utcTime} UTC` 
        : `Starts at ${localTime} Local`;
      
      this.safeUpdateElement('eventtime', 'textContent', timeText);
    } catch (error) {
      console.error('Error updating countdown:', error);
    }
  }

  updateProgress() {
    try {
      const now = new Date();
      const utcHour = now.getUTCHours();
      
      const phaseSchedule = [
        { start: 0, end: 4 },
        { start: 4, end: 8 },
        { start: 8, end: 12 },
        { start: 12, end: 16 },
        { start: 16, end: 20 },
        { start: 20, end: 24 }
      ];
      
      let currentPhase = null;
      
      for (const phase of phaseSchedule) {
        if (utcHour >= phase.start && utcHour < phase.end) {
          currentPhase = phase;
          break;
        }
      }
      
      if (!currentPhase) return;
      
      const phaseStart = new Date(now);
      phaseStart.setUTCHours(currentPhase.start, 0, 0, 0);
      
      const elapsedMs = now - phaseStart;
      const phaseLengthMs = 4 * 60 * 60 * 1000;
      const percent = Math.max(0, Math.min(100, (elapsedMs / phaseLengthMs) * 100));
      
      if (this.elements.progressfill) {
        this.elements.progressfill.style.width = `${percent}%`;
      }
      
      this.safeUpdateElement('progresstext', 'textContent', `${Math.round(percent)}% complete`);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  updateContent() {
    try {
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
    } catch (error) {
      console.error('Error updating content:', error);
    }
  }

  updateTabCounts() {
    try {
      this.safeUpdateElement('prioritycount', 'textContent', this.getAllHighPriorityWindows().length);
      this.safeUpdateElement('schedulecount', 'textContent', '42');
      this.safeUpdateElement('intelcount', 'textContent', Object.values(this.data.intelligence).flat().length);
    } catch (error) {
      console.error('Error updating tab counts:', error);
    }
  }

  updatePriorityGrid() {
    try {
      if (!this.elements.prioritygrid) return;
      
      this.elements.prioritygrid.innerHTML = '';
      const { utcDay, utcHour } = this.getCurrentUTCInfo();
      let windows = this.getAllHighPriorityWindows();
      
      if (this.activeFilter === 'active') {
        windows = windows.filter(w => this.isPhaseActive(w.hour, utcDay, utcHour, w.vsDay));
      } else if (this.activeFilter === 'upcoming') {
        const now = new Date();
        windows = windows.filter(w => {
          const eventTime = this.getPhaseStartTime(w.hour, w.vsDay);
          return eventTime > now;
        });
      }
      
      windows.forEach(window => {
        const isActive = this.isPhaseActive(window.hour, utcDay, utcHour, window.vsDay);
        
        const eventCard = document.createElement('div');
        eventCard.className = `priority-event ${isActive ? 'active' : ''}`;
        
        let cardContent = `
          <div class="priority-badge">MAX VALUE</div>
          <div class="event-header">
            <div class="event-day">${window.vsDayData.name}</div>
            <div class="event-time">${this.getPhaseTimeDisplay(window.hour)}</div>
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
        
        this.elements.prioritygrid.appendChild(eventCard);
      });
    } catch (error) {
      console.error('Error updating priority grid:', error);
    }
  }

  updateScheduleGrid() {
    try {
      if (!this.elements.schedulegrid) return;
      
      this.elements.schedulegrid.innerHTML = '';
      const { utcDay } = this.getCurrentUTCInfo();
      
      if (this.settings.viewScope === 'today') {
        const todayData = this.getVSDayData(utcDay);
        this.createTodaySchedule(todayData);
      } else {
        this.createWeekSchedule();
      }
    } catch (error) {
      console.error('Error updating schedule grid:', error);
    }
  }

  createTodaySchedule(todayData) {
    try {
      const todayContainer = document.createElement('div');
      todayContainer.className = 'today-schedule';
      
      todayContainer.innerHTML = `
        <div class="today-header">
          <h3>${todayData.name} - ${todayData.title}</h3>
          <p>Today's Schedule</p>
        </div>
      `;
      
      const timeSlots = document.createElement('div');
      timeSlots.className = 'time-slots';
      
      const phaseHours = [0, 4, 8, 12, 16, 20];
      
      phaseHours.forEach(h => {
        const armsPhase = this.getArmsRacePhase(h);
        const alignment = this.getAlignment(todayData.day, armsPhase.name);
        
        const { utcHour } = this.getCurrentUTCInfo();
        const isCurrentSlot = this.isPhaseActive(h, todayData.day, utcHour, todayData.day);
        
        const slot = document.createElement('div');
        slot.className = `time-slot ${alignment ? 'priority' : ''} ${isCurrentSlot ? 'current' : ''}`;
        
        let slotContent = `
          <div class="slot-time">${this.getPhaseTimeDisplay(h)}</div>
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
            this.showModal(alignment, todayData, armsPhase);
          });
        }
        
        timeSlots.appendChild(slot);
      });
      
      todayContainer.appendChild(timeSlots);
      this.elements.schedulegrid.appendChild(todayContainer);
    } catch (error) {
      console.error('Error creating today schedule:', error);
    }
  }

  createWeekSchedule() {
    try {
      const weekGrid = document.createElement('div');
      weekGrid.className = 'schedule-grid';
      
      const headers = ['Day/Time', '00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
      headers.forEach(h => {
        const headerCell = document.createElement('div');
        headerCell.className = 'schedule-header';
        headerCell.textContent = h;
        weekGrid.appendChild(headerCell);
      });

      this.data.vs_days.forEach(vsDayData => {
        const dayCell = document.createElement('div');
        dayCell.className = 'schedule-day-header';
        dayCell.textContent = vsDayData.name;
        weekGrid.appendChild(dayCell);

        const phaseHours = [0, 4, 8, 12, 16, 20];
        phaseHours.forEach(h => {
          const armsPhase = this.getArmsRacePhase(h);
          const cell = document.createElement('div');
          cell.className = 'schedule-cell';
          
          const alignment = this.getAlignment(vsDayData.day, armsPhase.name);
          if (alignment) cell.classList.add('priority');

          const { utcDay, utcHour } = this.getCurrentUTCInfo();
          if (this.isPhaseActive(h, utcDay, utcHour, vsDayData.day)) {
            cell.classList.add('current');
          }

          let cellContent = `<div class="cell-phase">${armsPhase.icon} ${armsPhase.name}</div>`;
          
          if (this.settings.detailLevel === 'comprehensive' && alignment) {
            cellContent += `<div class="cell-reason">${alignment.reason}</div>`;
          }
          
          cell.innerHTML = cellContent;
          
          if (alignment) {
            cell.addEventListener('click', () => {
              this.showModal(alignment, vsDayData, armsPhase);
            });
          }
          
          weekGrid.appendChild(cell);
        });
      });
      
      this.elements.schedulegrid.appendChild(weekGrid);
    } catch (error) {
      console.error('Error creating week schedule:', error);
    }
  }

  toggleBottomCards() {
    try {
      if (this.elements.bottomprioritycards) {
        this.elements.bottomprioritycards.classList.toggle('minimized');
        const btn = this.elements.minimizecards;
        if (btn) {
          btn.textContent = this.elements.bottomprioritycards.classList.contains('minimized') ? '+' : '−';
        }
      }
    } catch (error) {
      console.error('Error toggling bottom cards:', error);
    }
  }

  updateBottomPriorityCards() {
    try {
      if (!this.elements.bottomprioritygrid) return;
      
      this.elements.bottomprioritygrid.innerHTML = '';
      const { utcDay, utcHour } = this.getCurrentUTCInfo();
      
      let windows = this.getAllHighPriorityWindows().filter(w => {
        const isActive = this.isPhaseActive(w.hour, utcDay, utcHour, w.vsDay);
        const isUpcoming = this.isUpcomingWindow(w, utcDay, utcHour);
        return isActive || isUpcoming;
      }).slice(0, 6);
      
      windows.forEach(window => {
        const isActive = this.isPhaseActive(window.hour, utcDay, utcHour, window.vsDay);
        
        const card = document.createElement('div');
        card.className = `bottom-priority-card ${isActive ? 'active' : ''}`;
        
        const timeText = this.formatTimeForDisplay(window.hour);
        
        card.innerHTML = `
          <div class="bottom-card-header">
            <div>
              <div class="bottom-card-day">${window.vsDayData.name}</div>
              <div class="bottom-card-time">${timeText}</div>
            </div>
            <div class="bottom-card-badge">${isActive ? 'ACTIVE' : 'UPCOMING'}</div>
          </div>
          <div class="bottom-card-content">
            <div class="bottom-card-phase">${window.armsPhase.icon} ${window.armsPhase.name}</div>
            ${window.alignment.reason}
          </div>
        `;
        
        card.addEventListener('click', () => {
          this.showModal(window.alignment, window.vsDayData, window.armsPhase);
        });
        
        this.elements.bottomprioritygrid.appendChild(card);
      });
    } catch (error) {
      console.error('Error updating bottom priority cards:', error);
    }
  }

  formatTimeForDisplay(hour) {
    const phaseEnd = this.getPhaseEndHour(hour);
    
    if (this.settings.timeFormat === 'utc') {
      return `${String(hour).padStart(2, '0')}:00 - ${String(phaseEnd).padStart(2, '0')}:00 UTC`;
    } else {
      const startLocal = new Date();
      startLocal.setUTCHours(hour, 0, 0, 0);
      const endLocal = new Date();
      endLocal.setUTCHours(phaseEnd, 0, 0, 0);
      
      const startTime = startLocal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = endLocal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return `${startTime} - ${endTime} Local`;
    }
  }

  getPhaseTimeDisplay(hour) {
    const phaseEnd = this.getPhaseEndHour(hour);
    return `${String(hour).padStart(2, '0')}:00 - ${String(phaseEnd).padStart(2, '0')}:00 UTC`;
  }

  getPhaseEndHour(startHour) {
    return (startHour + 4) % 24;
  }

  isPhaseActive(phaseHour, currentDay, currentHour, phaseDay) {
    if (currentDay !== phaseDay) return false;
    
    const phaseEnd = this.getPhaseEndHour(phaseHour);
    return currentHour >= phaseHour && currentHour < phaseEnd;
  }

  getPhaseStartTime(hour, vsDay) {
    const now = new Date();
    const eventTime = new Date();
    eventTime.setUTCDate(eventTime.getUTCDate() + (vsDay - now.getUTCDay() + 7) % 7);
    eventTime.setUTCHours(hour, 0, 0, 0);
    return eventTime;
  }

  isUpcomingWindow(window, currentDay, currentHour) {
    if (window.vsDay === currentDay) {
      return window.hour > currentHour;
    }
    
    const daysUntil = (window.vsDay - currentDay + 7) % 7;
    return daysUntil <= 2;
  }

  populateIntelligence() {
    try {
      if (!this.elements.intelligencecontent) return;

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
        
        this.elements.intelligencecontent.appendChild(section);
      }
    } catch (error) {
      console.error('Error populating intelligence:', error);
    }
  }

  showModal(alignment, vsDayData, armsPhase) {
    try {
      if (!alignment || !this.elements.eventmodal) return;
      
      this.safeUpdateElement('modaltitle', 'textContent', `${armsPhase.icon} ${armsPhase.name} + ${vsDayData.title}`);

      const modalContent = `
        <div class="modal-section">
          <h4>⭐ High Priority Alignment</h4>
          <p>${alignment.reason}</p>
        </div>
        <div class="modal-section">
          <h4>🎯 Arms Race Focus</h4>
          <p><strong>Primary Activities:</strong> ${armsPhase.pointSources.slice(0, 3).join(', ')}</p>
        </div>
        <div class="modal-section">
          <h4>🏆 VS Event Objectives</h4>
          <p><strong>Key Activities:</strong> ${vsDayData.pointActivities.slice(0, 3).join(', ')}</p>
        </div>
        <div class="modal-section">
          <h4>💡 Strategy Recommendations</h4>
          <p>Focus on completing ${armsPhase.activities[0]} during this window for maximum VS points. Plan your resources and timing accordingly for optimal efficiency.</p>
        </div>
      `;
      
      this.safeUpdateElement('modalbody', 'innerHTML', modalContent);
      this.elements.eventmodal.style.display = 'flex';
    } catch (error) {
      console.error('Error showing modal:', error);
    }
  }

  closeModal() {
    try {
      if (this.elements.eventmodal) {
        this.elements.eventmodal.style.display = 'none';
      }
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  }

  shareEvent() {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Last War Nexus Event',
          text: 'Check out this high priority event!',
          url: window.location.href
        }).catch(error => console.log('Error sharing:', error));
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Event link copied to clipboard!');
        }).catch(error => {
          console.log('Error copying to clipboard:', error);
          alert('Unable to copy link');
        });
      }
    } catch (error) {
      console.error('Error sharing event:', error);
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

  getAlignment(utcDay, armsPhaseName) {
    return this.data.high_priority_alignments.find(
      a => a.vs_day === utcDay && a.arms_phase === armsPhaseName
    );
  }

  getAllHighPriorityWindows() {
    const windows = [];
    const phaseHours = [0, 4, 8, 12, 16, 20];
    
    this.data.high_priority_alignments.forEach(alignment => {
      const vsDayData = this.getVSDayData(alignment.vs_day);
      const armsPhase = this.data.arms_race_phases.find(p => p.name === alignment.arms_phase);
      if (vsDayData && armsPhase) {
        phaseHours.forEach(hour => {
          if (this.getArmsRacePhase(hour).name === alignment.arms_phase) {
            windows.push({ 
              vsDay: alignment.vs_day, 
              vsDayData, 
              armsPhase, 
              alignment, 
              hour: hour 
            });
          }
        });
      }
    });
    return windows;
  }

  getNextHighPriorityWindow() {
    try {
      const now = new Date();
      const potentialWindows = [];
      const phaseHours = [0, 4, 8, 12, 16, 20];

      for (let dayOffset = 0; dayOffset < 8; dayOffset++) {
        const targetDate = new Date();
        targetDate.setUTCDate(targetDate.getUTCDate() + dayOffset);
        const targetDay = targetDate.getUTCDay();

        this.data.high_priority_alignments.forEach(alignment => {
          if (alignment.vs_day !== targetDay) return;
          const armsPhase = this.data.arms_race_phases.find(p => p.name === alignment.arms_phase);
          if (!armsPhase) return;

          phaseHours.forEach(hour => {
            if (this.getArmsRacePhase(hour).name === alignment.arms_phase) {
              const eventTime = new Date(Date.UTC(
                targetDate.getUTCFullYear(), 
                targetDate.getUTCMonth(), 
                targetDate.getUTCDate(), 
                hour, 0, 0
              ));
              if (eventTime > now) {
                potentialWindows.push({
                  startTime: eventTime,
                  vsDay: alignment.vs_day,
                  vsDayData: this.getVSDayData(alignment.vs_day),
                  armsPhase: armsPhase,
                  alignment: alignment,
                  hour: hour
                });
              }
            }
          });
        });
      }

      if (potentialWindows.length === 0) return null;
      potentialWindows.sort((a, b) => a.startTime - b.startTime);
      return potentialWindows[0];
    } catch (error) {
      console.error('Error getting next priority window:', error);
      return null;
    }
  }

  destroy() {
    try {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
      this.removeEventListeners();
      this.isInitialized = false;
    } catch (error) {
      console.error('Error destroying LastWarNexus:', error);
    }
  }
}

window.addEventListener('load', () => {
  try {
    window.lastWarNexus = new LastWarNexus();
  } catch (error) {
    console.error('Failed to initialize Last War Nexus:', error);
  }
});

window.addEventListener('beforeunload', () => {
  if (window.lastWarNexus) {
    window.lastWarNexus.destroy();
  }
});
