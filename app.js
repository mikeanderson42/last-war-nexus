class LastWarNexus {
    constructor() {
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 3;
        
        // Server configuration
        this.currentArmsPhase = "Drone Boost";
        this.timeOffset = 0;
        
        // Data structure
        this.data = {
            armsracephases: [
                { id: 6, name: "Mixed Phase", icon: "🔄", activities: ["Check in-game calendar"], pointSources: ["Check calendar for current focus", "Mixed activities", "Various point sources", "Event-specific tasks", "General progression"] },
                { id: 4, name: "Drone Boost", icon: "🚁", activities: ["Stamina usage", "Drone activities"], pointSources: ["Use stamina for attacks", "Complete drone missions", "Gather drone data", "Battle elite enemies", "Use stamina items"] },
                { id: 1, name: "City Building", icon: "🏗️", activities: ["Building upgrades", "Construction speedups"], pointSources: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Upgrade headquarters", "Construct new buildings"] },
                { id: 3, name: "Tech Research", icon: "🔬", activities: ["Research completion", "Research speedups"], pointSources: ["Complete research", "Use research speedups", "Unlock new technologies", "Upgrade existing tech", "Finish research projects"] },
                { id: 5, name: "Hero Advancement", icon: "🦸", activities: ["Hero recruitment", "Hero EXP"], pointSources: ["Recruit new heroes", "Apply hero EXP", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"] },
                { id: 2, name: "Unit Progression", icon: "⚔️", activities: ["Troop training", "Training speedups"], pointSources: ["Train troops", "Use training speedups", "Complete troop upgrades", "Unlock new units", "Enhance unit capabilities"] }
            ],
            
            vsdays: [
                { day: 0, name: "Sunday", title: "Preparation Day", activities: ["Save radar missions", "Prepare building upgrades"], pointActivities: ["Save radar missions for Monday", "Prepare building gifts for Tuesday", "Stack speedups", "Plan resource allocation", "Coordinate with alliance"] },
                { day: 1, name: "Monday", title: "Radar Training", activities: ["Complete radar missions", "Use stamina for attacks"], pointActivities: ["Complete saved radar missions", "Use stamina for elite battles", "Attack bases for training points", "Use stamina items", "Focus on combat activities"] },
                { day: 2, name: "Tuesday", title: "Base Expansion", activities: ["Complete building upgrades", "Use construction speedups"], pointActivities: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Use building gifts", "Upgrade headquarters"] },
                { day: 3, name: "Wednesday", title: "Age of Science", activities: ["Complete research", "Use research speedups"], pointActivities: ["Complete research projects", "Use research speedups", "Unlock new technologies", "Use valor badges", "Focus on tech advancement"] },
                { day: 4, name: "Thursday", title: "Train Heroes", activities: ["Use recruitment tickets", "Apply hero EXP"], pointActivities: ["Use recruitment tickets", "Apply hero EXP items", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"] },
                { day: 5, name: "Friday", title: "Total Mobilization", activities: ["Use all speedup types", "Finish buildings/research"], pointActivities: ["Use all saved speedups", "Complete multiple building projects", "Finish research", "Train troops", "Maximum efficiency focus"] },
                { day: 6, name: "Saturday", title: "Enemy Buster", activities: ["Attack enemy bases", "Use healing speedups"], pointActivities: ["Attack enemy bases", "Use healing speedups", "Focus on combat", "Eliminate threats", "Use combat-related items"] }
            ],
            
            highpriorityalignments: [
                { vsday: 1, armsphase: "Drone Boost", reason: "Stamina/drone activities align perfectly.", points: 3500 },
                { vsday: 1, armsphase: "Hero Advancement", reason: "Hero EXP activities align.", points: 3200 },
                { vsday: 2, armsphase: "City Building", reason: "Building activities align perfectly.", points: 4000 },
                { vsday: 3, armsphase: "Tech Research", reason: "Research activities align perfectly.", points: 3800 },
                { vsday: 3, armsphase: "Drone Boost", reason: "Drone component activities align.", points: 3300 },
                { vsday: 4, armsphase: "Hero Advancement", reason: "Hero activities align perfectly.", points: 3600 },
                { vsday: 5, armsphase: "City Building", reason: "Building component of mobilization.", points: 4200 },
                { vsday: 5, armsphase: "Unit Progression", reason: "Training component of mobilization.", points: 3900 },
                { vsday: 5, armsphase: "Tech Research", reason: "Research component of mobilization.", points: 4100 },
                { vsday: 6, armsphase: "Unit Progression", reason: "Troop training for combat.", points: 3700 },
                { vsday: 6, armsphase: "City Building", reason: "Construction speedups for defenses.", points: 3400 }
            ],
            
            intelligence: {
                guides: [
                    { title: "Complete Squad Building Guide", content: "Master the art of squad composition with our comprehensive guide covering hero synergies, formation strategies, and power optimization. Learn how to build squads for different game modes including PvP, PvE, and special events.", link: "https://lastwartutorial.com/squad-building-guide" },
                    { title: "VS Points Maximization Strategy", content: "Learn the proven strategies to maximize VS points: Get VS tech to 100% first, save speedups for alignment windows, stack radar missions, and coordinate with Arms Race phases. Focus on unlocking 3 chests daily rather than winning every Arms Race.", link: "https://lastwartutorial.com/vs-optimization" },
                    { title: "Power Progression Optimization", content: "Maximize your base power efficiently with our detailed progression guide. Covers building priorities, research paths, hero development, and resource management strategies for rapid power growth.", link: "https://lastwartutorial.com/power-optimization" },
                    { title: "Season 4 Evernight Isle Complete Guide", content: "Navigate Season 4's new content including Evernight Isle exploration, Copper War mechanics, lighthouse systems, and faction-based gameplay. Includes exclusive rewards and optimization strategies.", link: "https://lastwartutorial.com/season-4-guide" }
                ],
                tips: [
                    { title: "VS Event Optimization Strategies", content: "Key strategies from top players: Save all speedups for VS days, get VS tech to 100% first, save radar missions for Days 1,3,5, save building gifts for Days 2,5, and coordinate with Arms Race phases for 2-4x efficiency. Don't use speedups outside VS periods.", link: "https://lastwartutorial.com/vs-optimization" },
                    { title: "Resource Saving & Timing Guide", content: "Master resource management: Save construction speedups for Day 2 (Base Expansion), research speedups for Day 3 (Age of Science), training speedups for Day 5 (Total Mobilization). Stack activities the day before and execute during high-priority windows.", link: "https://lastwartutorial.com/resource-timing" },
                    { title: "Arms Race Coordination Tips", content: "Synchronize with Arms Race phases: Use stamina during Drone Boost, apply hero EXP during Hero Advancement, complete buildings during City Building, finish research during Tech Research. This alignment can quadruple your point efficiency.", link: "https://lastwartutorial.com/arms-race-coordination" },
                    { title: "Advanced VS Techniques", content: "Pro tips: Use survivor dispatch trick for higher unit training caps, refresh secret missions for legendary tasks, coordinate alliance for secretary roles on key days, and use valor badges strategically during Age of Science phase.", link: "https://lastwartutorial.com/advanced-vs-techniques" }
                ],
                season4: [
                    { title: "Season 4 Copper War VS Integration", content: "How Season 4 changes VS strategy: New Copper War mechanics affect alliance coordination, Tesla Coil skills provide combat advantages during Enemy Buster day, and Evernight Isle resources can boost VS performance.", link: "https://lastwartutorial.com/season4-vs-integration" },
                    { title: "New Hero Weapon VS Optimization", content: "Optimize Season 4 heroes for VS: Sarah's Legendary upgrade path maximizes Hero Advancement points, Lucius' Exclusive Weapon enhances combat effectiveness for Day 6, and Butler's Tesla Coil skills provide strategic advantages.", link: "https://lastwartutorial.com/season-4-heroes-vs" },
                    { title: "Evernight Isle Resource Management", content: "Use Evernight Isle strategically: Lighthouse mechanics provide additional resources for VS preparation, fog navigation yields exclusive speedups, and coordinated exploration maximizes alliance benefits during VS periods.", link: "https://lastwartutorial.com/evernight-isle-vs" },
                    { title: "Legacy Season VS Strategies", content: "Don't miss proven strategies from Seasons 1-3: Foundation building techniques from Season 1, expansion optimization from Season 2, and advanced combat systems from Season 3 that remain effective for current VS gameplay.", link: "https://lastwartutorial.com/legacy-vs-strategies" }
                ]
            }
        };
        
        this.settings = {
            timeFormat: "utc",
            detailLevel: "essential",
            viewScope: "week"
        };
        
        this.activeTab = "priority";
        this.activeFilter = "all";
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
            document.addEventListener('DOMContentLoaded', () => this.init());
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
                    console.error("Failed to initialize after maximum attempts");
                    return;
                }
            }
            
            this.loadServerSettings();
            this.setupEventListeners();
            this.populateIntelligence();
            this.updateTabCounts();
            this.updateAllDisplays();
            this.startUpdateLoop();
            this.isInitialized = true;
            
            console.log("Last War Nexus initialized successfully");
        } catch (error) {
            console.error("Initialization error:", error);
            if (this.initializationAttempts < this.maxInitAttempts) {
                setTimeout(() => this.init(), 200);
            }
        }
    }
    
    cacheElements() {
        const elementIds = [
            'server-time', 'current-vs-day', 'arms-phase', 'alignment-indicator', 'alignment-status',
            'vs-day-details', 'arms-race-details', 'vs-day-content', 'arms-race-content',
            'current-vs-status', 'current-arms-status', 'countdown-timer', 'event-name', 'event-time',
            'progress-fill', 'progress-text', 'action-icon', 'action-text', 'strategy-rating',
            'optimization-focus', 'time-remaining', 'priority-level', 'settings-toggle', 'settings-dropdown',
            'priority-grid', 'schedule-grid', 'intelligence-content', 'priority-count', 'schedule-count',
            'intel-count', 'event-modal', 'modal-title', 'modal-body', 'modal-close', 'modal-share',
            'modal-remind', 'time-format-dropdown', 'detail-level-dropdown', 'view-scope-dropdown',
            'bottom-priority-cards', 'bottom-priority-grid', 'minimize-cards', 'bottom-cards-content',
            'server-toggle', 'server-dropdown', 'apply-server', 'current-server',
            'current-arms-phase', 'time-offset', 'current-phase-display', 'offset-display',
            'time-slots', 'today-date'
        ];
        
        let allElementsFound = true;
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.elements[id] = element;
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
            // Tab navigation
            this.addEventListener('.tab-btn', 'click', (e) => {
                e.preventDefault();
                const tabName = e.target.closest('.tab-btn')?.dataset?.tab;
                if (tabName) this.switchTab(tabName);
            });

            // Filter buttons
            this.addEventListener('.filter-btn', 'click', (e) => {
                e.preventDefault();
                const filter = e.target.dataset?.filter;
                if (filter) this.setFilter(filter);
            });

            // Settings dropdown
            if (this.elements['settings-toggle']) {
                this.addEventListenerSingle(this.elements['settings-toggle'], 'click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown('settings');
                });
            }

            // Server dropdown
            if (this.elements['server-toggle']) {
                this.addEventListenerSingle(this.elements['server-toggle'], 'click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown('server');
                });
            }

            // Apply server settings button
            if (this.elements['apply-server']) {
                this.addEventListenerSingle(this.elements['apply-server'], 'click', (e) => {
                    e.preventDefault();
                    this.applyServerSettings();
                });
            }

            // Current Arms Race Phase selector
            if (this.elements['current-arms-phase']) {
                this.addEventListenerSingle(this.elements['current-arms-phase'], 'change', (e) => {
                    this.currentArmsPhase = e.target.value;
                    this.updateServerDisplay();
                    this.saveServerSettings();
                    this.updateAllDisplays();
                    if (this.expandedDetails.armsRace) {
                        this.updateExpandedDetails();
                    }
                });
            }

            // Time offset selector
            if (this.elements['time-offset']) {
                this.addEventListenerSingle(this.elements['time-offset'], 'change', (e) => {
                    this.timeOffset = parseInt(e.target.value, 10);
                    this.updateServerDisplay();
                });
            }

            // Dropdown selects
            if (this.elements['time-format-dropdown']) {
                this.addEventListenerSingle(this.elements['time-format-dropdown'], 'change', (e) => {
                    this.settings.timeFormat = e.target.value;
                    this.updateAllDisplays();
                    this.updateBottomPriorityCards();
                });
            }

            if (this.elements['detail-level-dropdown']) {
                this.addEventListenerSingle(this.elements['detail-level-dropdown'], 'change', (e) => {
                    this.settings.detailLevel = e.target.value;
                    this.updateContent();
                    this.updateExpandedDetails();
                });
            }

            if (this.elements['view-scope-dropdown']) {
                this.addEventListenerSingle(this.elements['view-scope-dropdown'], 'change', (e) => {
                    this.settings.viewScope = e.target.value;
                    this.updateContent();
                });
            }

            // Status expansion
            if (this.elements['current-vs-status']) {
                this.addEventListenerSingle(this.elements['current-vs-status'], 'click', (e) => {
                    e.preventDefault();
                    this.toggleDetail('vsDay');
                });
            }

            if (this.elements['current-arms-status']) {
                this.addEventListenerSingle(this.elements['current-arms-status'], 'click', (e) => {
                    e.preventDefault();
                    this.toggleDetail('armsRace');
                });
            }

            // Bottom cards
            if (this.elements['minimize-cards']) {
                this.addEventListenerSingle(this.elements['minimize-cards'], 'click', (e) => {
                    e.preventDefault();
                    this.toggleBottomCards();
                });
            }

            // Close dropdowns on outside click
            this.addEventListenerSingle(document, 'click', (e) => {
                if (!e.target.closest('.settings-dropdown-container') && !e.target.closest('.server-dropdown-container')) {
                    this.closeDropdown();
                }
            });

            // Modal events
            if (this.elements['modal-close']) {
                this.addEventListenerSingle(this.elements['modal-close'], 'click', (e) => {
                    e.preventDefault();
                    this.closeModal();
                });
            }

            if (this.elements['event-modal']) {
                this.addEventListenerSingle(this.elements['event-modal'], 'click', (e) => {
                    if (e.target === this.elements['event-modal']) {
                        e.preventDefault();
                        this.closeModal();
                    }
                });
            }

            if (this.elements['modal-share']) {
                this.addEventListenerSingle(this.elements['modal-share'], 'click', (e) => {
                    e.preventDefault();
                    this.shareEvent();
                });
            }

            if (this.elements['modal-remind']) {
                this.addEventListenerSingle(this.elements['modal-remind'], 'click', (e) => {
                    e.preventDefault();
                    this.setReminder();
                });
            }

            // Keyboard shortcuts
            this.addEventListenerSingle(document, 'keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                    this.closeDropdown();
                }
                if (e.key === '1') this.switchTab('priority');
                if (e.key === '2') this.switchTab('schedule');
                if (e.key === '3') this.switchTab('intelligence');
            });

            console.log("Event listeners set up successfully");
        } catch (error) {
            console.error("Error setting up event listeners:", error);
        }
    }

    addEventListener(selector, event, handler) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            this.addEventListenerSingle(element, event, handler);
        });
    }

    addEventListenerSingle(element, event, handler) {
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

    // Server management methods
    loadServerSettings() {
        try {
            const saved = localStorage.getItem('lwn-server-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.currentArmsPhase = settings.currentArmsPhase || "Drone Boost";
                this.timeOffset = settings.timeOffset || 0;
                
                if (this.elements['current-arms-phase']) {
                    this.elements['current-arms-phase'].value = this.currentArmsPhase;
                }
                if (this.elements['time-offset']) {
                    this.elements['time-offset'].value = this.timeOffset.toString();
                }
                this.updateServerDisplay();
            }
        } catch (error) {
            console.error("Error loading server settings:", error);
        }
    }

    saveServerSettings() {
        try {
            const settings = {
                currentArmsPhase: this.currentArmsPhase,
                timeOffset: this.timeOffset
            };
            localStorage.setItem('lwn-server-settings', JSON.stringify(settings));
        } catch (error) {
            console.error("Error saving server settings:", error);
        }
    }

    applyServerSettings() {
        try {
            this.currentArmsPhase = this.elements['current-arms-phase']?.value || "Drone Boost";
            this.timeOffset = parseInt(this.elements['time-offset']?.value || '0', 10);
            this.updateServerDisplay();
            this.saveServerSettings();
            this.closeDropdown();
            this.updateAllDisplays();
            
            if (this.expandedDetails.armsRace) {
                this.updateExpandedDetails();
            }
            if (this.expandedDetails.vsDay) {
                this.updateExpandedDetails();
            }
            
            console.log(`Settings applied - Phase: ${this.currentArmsPhase}, Offset: ${this.timeOffset}h`);
        } catch (error) {
            console.error("Error applying server settings:", error);
        }
    }

    updateServerDisplay() {
        if (this.elements['current-server']) {
            this.elements['current-server'].textContent = "Settings";
        }
        if (this.elements['current-arms-phase']) {
            this.elements['current-arms-phase'].value = this.currentArmsPhase;
        }
        if (this.elements['time-offset']) {
            this.elements['time-offset'].value = this.timeOffset.toString();
        }
        if (this.elements['current-phase-display']) {
            this.elements['current-phase-display'].textContent = this.currentArmsPhase;
        }
        if (this.elements['offset-display']) {
            const offsetText = this.timeOffset >= 0 ? `UTC +${this.timeOffset}` : `UTC ${this.timeOffset}`;
            this.elements['offset-display'].textContent = offsetText;
        }
    }

    // Time methods
    getCurrentUTCInfo() {
        const now = new Date();
        const serverTime = new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
        return {
            utcDay: serverTime.getUTCDay(),
            utcHour: serverTime.getUTCHours(),
            utcMinute: serverTime.getUTCMinutes()
        };
    }

    getServerTime() {
        const now = new Date();
        return new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
    }

    getCurrentArmsPhaseData() {
        return this.data.armsracephases.find(phase => phase.name === this.currentArmsPhase) || this.data.armsracephases[1];
    }

    isCurrentManualPhase(schedulePhaseHour) {
        const schedulePhase = this.getArmsRacePhase(schedulePhaseHour);
        return schedulePhase.name === this.currentArmsPhase;
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
            const detailsElement = type === 'vsDay' ? this.elements['vs-day-details'] : this.elements['arms-race-details'];
            const statusElement = type === 'vsDay' ? this.elements['current-vs-status'] : this.elements['current-arms-status'];
            
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
            console.error("Error toggling detail:", error);
        }
    }

    updateExpandedDetails() {
        try {
            const { utcDay } = this.getCurrentUTCInfo();
            const vsDayData = this.getVSDayData(utcDay);
            const armsPhase = this.getCurrentArmsPhaseData();
            const alignment = this.getAlignment(utcDay, armsPhase.name);

            if (this.expandedDetails.vsDay && this.elements['vs-day-content']) {
                this.elements['vs-day-content'].innerHTML = '';
                const activities = this.settings.detailLevel === 'comprehensive' ? vsDayData.pointActivities : vsDayData.activities;
                activities.forEach(activity => {
                    const activityEl = document.createElement('div');
                    activityEl.className = 'detail-item';
                    activityEl.textContent = activity;
                    this.elements['vs-day-content'].appendChild(activityEl);
                });
            }

            if (this.expandedDetails.armsRace && this.elements['arms-race-content']) {
                this.elements['arms-race-content'].innerHTML = '';
                
                const descEl = document.createElement('div');
                descEl.className = 'detail-item high-value';
                descEl.style.marginBottom = '12px';
                descEl.style.fontWeight = '600';
                descEl.textContent = `Current Phase: ${armsPhase.name} - Focus on these activities for maximum points`;
                this.elements['arms-race-content'].appendChild(descEl);

                const sources = this.settings.detailLevel === 'comprehensive' ? armsPhase.pointSources : armsPhase.activities;
                sources.forEach((source, index) => {
                    const sourceEl = document.createElement('div');
                    sourceEl.className = 'detail-item';
                    if (alignment && index < 2) {
                        sourceEl.classList.add('high-value');
                    }
                    sourceEl.textContent = source;
                    this.elements['arms-race-content'].appendChild(sourceEl);
                });

                if (this.settings.detailLevel === 'comprehensive') {
                    const timingEl = document.createElement('div');
                    timingEl.className = 'detail-item';
                    timingEl.style.marginTop = '12px';
                    timingEl.style.fontStyle = 'italic';
                    timingEl.style.borderTop = '1px solid var(--border-primary)';
                    timingEl.style.paddingTop = '8px';
                    timingEl.textContent = `Manually set to ${armsPhase.name}. Change in Server Settings if needed.`;
                    this.elements['arms-race-content'].appendChild(timingEl);
                }
            }
        } catch (error) {
            console.error("Error updating expanded details:", error);
        }
    }

    toggleDropdown(type) {
        try {
            if (type === 'settings') {
                this.dropdownOpen = !this.dropdownOpen;
                if (this.elements['settings-dropdown'] && this.elements['settings-toggle']) {
                    this.elements['settings-dropdown'].classList.toggle('show', this.dropdownOpen);
                    this.elements['settings-toggle'].classList.toggle('active', this.dropdownOpen);
                }
            } else if (type === 'server') {
                const serverDropdownOpen = this.elements['server-dropdown']?.classList.contains('show');
                if (this.elements['server-dropdown'] && this.elements['server-toggle']) {
                    this.elements['server-dropdown'].classList.toggle('show', !serverDropdownOpen);
                    this.elements['server-toggle'].classList.toggle('active', !serverDropdownOpen);
                }
            }

            // Close the other dropdown
            if (type === 'settings' && this.elements['server-dropdown']) {
                this.elements['server-dropdown'].classList.remove('show');
                this.elements['server-toggle']?.classList.remove('active');
            } else if (type === 'server' && this.elements['settings-dropdown']) {
                this.elements['settings-dropdown'].classList.remove('show');
                this.elements['settings-toggle']?.classList.remove('active');
            }
        } catch (error) {
            console.error("Error toggling dropdown:", error);
        }
    }

    closeDropdown() {
        try {
            this.dropdownOpen = false;
            if (this.elements['settings-dropdown'] && this.elements['settings-toggle']) {
                this.elements['settings-dropdown'].classList.remove('show');
                this.elements['settings-toggle'].classList.remove('active');
            }
            if (this.elements['server-dropdown'] && this.elements['server-toggle']) {
                this.elements['server-dropdown'].classList.remove('show');
                this.elements['server-toggle'].classList.remove('active');
            }
        } catch (error) {
            console.error("Error closing dropdown:", error);
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
            console.error("Error setting filter:", error);
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
            console.error("Error switching tab:", error);
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
            console.error("Error starting update loop:", error);
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
            console.error("Error updating displays:", error);
        }
    }

    updateServerTime() {
        try {
            const serverTime = this.getServerTime();
            const timeString = this.settings.timeFormat === 'utc'
                ? serverTime.toUTCString().slice(17, 25)
                : serverTime.toLocaleTimeString();
            this.safeUpdateElement('server-time', 'textContent', timeString);
        } catch (error) {
            console.error("Error updating server time:", error);
        }
    }

    updateCurrentStatus() {
        try {
            const { utcDay, utcHour, utcMinute } = this.getCurrentUTCInfo();
            const vsDayData = this.getVSDayData(utcDay);
            const armsPhase = this.getCurrentArmsPhaseData();
            const alignment = this.getAlignment(utcDay, armsPhase.name);

            this.safeUpdateElement('current-vs-day', 'textContent', `${vsDayData.name} - ${vsDayData.title}`);
            this.safeUpdateElement('arms-phase', 'textContent', `${armsPhase.icon} ${armsPhase.name}`);

            if (this.elements['alignment-indicator'] && this.elements['alignment-status']) {
                if (alignment) {
                    this.safeUpdateElement('alignment-indicator', 'textContent', 'HIGH PRIORITY');
                    this.elements['alignment-indicator'].style.color = 'var(--accent-success)';
                    this.elements['alignment-status'].classList.add('priority-active');
                } else {
                    this.safeUpdateElement('alignment-indicator', 'textContent', 'Normal Phase');
                    this.elements['alignment-indicator'].style.color = 'var(--text-secondary)';
                    this.elements['alignment-status'].classList.remove('priority-active');
                }
            }

            this.updateExpandedDetails();
            this.updateActionDisplay(alignment, armsPhase, utcHour, utcMinute);
        } catch (error) {
            console.error("Error updating current status:", error);
        }
    }

    updateActionDisplay(alignment, armsPhase, utcHour, utcMinute) {
        try {
            // Check for server reset period (00:00-00:05 UTC)
            if (utcHour === 0 && utcMinute <= 5) {
                this.safeUpdateElement('action-icon', 'textContent', '🔄');
                this.safeUpdateElement('action-text', 'innerHTML', '<strong>Server Reset in Progress</strong><br>No points awarded during this period - save your activities!');
                this.safeUpdateElement('priority-level', 'textContent', 'System');
                this.safeUpdateElement('strategy-rating', 'textContent', 'N/A');
                this.safeUpdateElement('optimization-focus', 'textContent', 'Wait');
                this.safeUpdateElement('time-remaining', 'textContent', `${5 - utcMinute}m`);
            } else if (alignment) {
                this.safeUpdateElement('action-icon', 'textContent', '🎯');
                this.safeUpdateElement('action-text', 'innerHTML', `<strong>HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason} Use your saved speedups and resources now for maximum efficiency.`);
                this.safeUpdateElement('priority-level', 'textContent', 'Critical');
                this.safeUpdateElement('strategy-rating', 'textContent', 'A+');
                const focusText = this.getOptimizationFocus(armsPhase.name);
                this.safeUpdateElement('optimization-focus', 'textContent', focusText);
                const timeRemainingText = this.calculatePhaseTimeRemaining(utcHour, utcMinute);
                this.safeUpdateElement('time-remaining', 'textContent', timeRemainingText);
            } else {
                this.safeUpdateElement('action-icon', 'textContent', armsPhase.icon);
                this.safeUpdateElement('action-text', 'innerHTML', `<strong>Normal Phase</strong><br>Focus on ${armsPhase.activities[0]} but save major resources for high priority windows.`);
                this.safeUpdateElement('priority-level', 'textContent', 'Medium');
                this.safeUpdateElement('strategy-rating', 'textContent', 'B');
                const focusText = this.getOptimizationFocus(armsPhase.name);
                this.safeUpdateElement('optimization-focus', 'textContent', focusText);
                const timeRemainingText = this.calculatePhaseTimeRemaining(utcHour, utcMinute);
                this.safeUpdateElement('time-remaining', 'textContent', timeRemainingText);
            }
        } catch (error) {
            console.error("Error updating action display:", error);
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
            if (currentPhaseEnd >= 24) {
                phaseEndTime.setUTCDate(phaseEndTime.getUTCDate() + 1);
                phaseEndTime.setUTCHours(0, 0, 0, 0);
            }

            const timeRemaining = phaseEndTime.getTime() - now.getTime();
            if (timeRemaining <= 0) return "Phase ending";

            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m`;
            }
        } catch (error) {
            console.error("Error calculating phase time remaining:", error);
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
                this.safeUpdateElement('countdown-timer', 'textContent', 'No upcoming events');
                this.safeUpdateElement('event-name', 'textContent', '');
                this.safeUpdateElement('event-time', 'textContent', '');
                return;
            }

            const now = new Date();
            const timeDiff = nextWindow.startTime - now;

            if (timeDiff <= 0) {
                this.safeUpdateElement('countdown-timer', 'textContent', 'ACTIVE');
                this.safeUpdateElement('event-name', 'textContent', `${nextWindow.armsPhase.name} Priority Window`);
                this.safeUpdateElement('event-time', 'textContent', 'Currently running');
                return;
            }

            const hours = Math.floor(timeDiff / 3600000);
            const minutes = Math.floor((timeDiff % 3600000) / 60000);

            this.safeUpdateElement('countdown-timer', 'textContent', `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`);
            this.safeUpdateElement('event-name', 'textContent', `${nextWindow.armsPhase.name} Priority Window`);

            const localTime = nextWindow.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const utcTime = nextWindow.startTime.toUTCString().slice(17, 22);
            const timeText = this.settings.timeFormat === 'utc' ? `Starts at ${utcTime} UTC` : `Starts at ${localTime} Local`;
            this.safeUpdateElement('event-time', 'textContent', timeText);
        } catch (error) {
            console.error("Error updating countdown:", error);
        }
    }

    updateProgress() {
        try {
            const { utcHour } = this.getCurrentUTCInfo();
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

            const now = this.getServerTime();
            const phaseStart = new Date(now);
            phaseStart.setUTCHours(currentPhase.start, 0, 0, 0);
            const elapsedMs = now - phaseStart;
            const phaseLengthMs = 4 * 60 * 60 * 1000;
            const percent = Math.max(0, Math.min(100, (elapsedMs / phaseLengthMs) * 100));

            if (this.elements['progress-fill']) {
                this.elements['progress-fill'].style.width = `${percent}%`;
            }
            this.safeUpdateElement('progress-text', 'textContent', `${Math.round(percent)}% complete`);
        } catch (error) {
            console.error("Error updating progress:", error);
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
                    // Intelligence is static, already populated
                    break;
            }
        } catch (error) {
            console.error("Error updating content:", error);
        }
    }

    updateTabCounts() {
        try {
            this.safeUpdateElement('priority-count', 'textContent', `${this.getAllHighPriorityWindows().length} Active`);
            this.safeUpdateElement('schedule-count', 'textContent', '42 Events');
            this.safeUpdateElement('intel-count', 'textContent', `${Object.values(this.data.intelligence).flat().length} Guides`);
        } catch (error) {
            console.error("Error updating tab counts:", error);
        }
    }

    updatePriorityGrid() {
        try {
            if (!this.elements['priority-grid']) return;
            
            this.elements['priority-grid'].innerHTML = '';
            const { utcDay, utcHour } = this.getCurrentUTCInfo();
            let windows = this.getAllHighPriorityWindows();

            if (this.activeFilter === 'active') {
                windows = windows.filter(w => w.vsDay === utcDay && this.isCurrentManualPhase(w.hour));
            } else if (this.activeFilter === 'upcoming') {
                const now = new Date();
                windows = windows.filter(w => {
                    const eventTime = this.getPhaseStartTime(w.hour, w.vsDay);
                    return eventTime > now;
                });
            }

            windows.forEach(window => {
                const isActive = window.vsDay === utcDay && this.isCurrentManualPhase(window.hour);
                const eventCard = document.createElement('div');
                eventCard.className = `priority-event${isActive ? ' active' : ''}`;
                
                const vsDayData = this.getVSDayData(window.vsDay);
                const armsPhase = this.data.armsracephases.find(p => p.name === window.armsPhase);
                const alignment = this.data.highpriorityalignments.find(a => 
                    a.vsday === window.vsDay && a.armsphase === window.armsPhase
                );

                eventCard.innerHTML = `
                    <div class="priority-badge">HIGH</div>
                    <div class="event-header">
                        <div class="event-day">${vsDayData.name}</div>
                        <div class="event-time">${window.timeRange}</div>
                    </div>
                    <div class="event-details">
                        <div class="event-phase">${armsPhase.icon} ${armsPhase.name}</div>
                        <div class="event-vs">${vsDayData.title}</div>
                    </div>
                    <div class="event-strategy">${alignment ? alignment.reason : 'Strategic alignment window'}</div>
                    ${this.settings.detailLevel === 'comprehensive' ? `
                        <div class="event-detailed-info">
                            <div class="detail-section">
                                <strong>Primary Activities:</strong> ${armsPhase.pointSources.slice(0, 3).join(', ')}
                            </div>
                            <div class="detail-section">
                                <strong>Key Activities:</strong> ${vsDayData.pointActivities.slice(0, 3).join(', ')}
                            </div>
                            <div class="detail-section">
                                Focus on completing ${armsPhase.activities[0]} during this window for maximum VS points. Plan your resources and timing accordingly for optimal efficiency.
                            </div>
                        </div>
                    ` : ''}
                `;

                eventCard.addEventListener('click', () => {
                    this.showEventModal(window, vsDayData, armsPhase, alignment);
                });

                this.elements['priority-grid'].appendChild(eventCard);
            });
        } catch (error) {
            console.error("Error updating priority grid:", error);
        }
    }

    updateScheduleGrid() {
        try {
            if (!this.elements['schedule-grid']) return;
            
            this.elements['schedule-grid'].innerHTML = '';
            
            // Update today's schedule
            this.updateTodaySchedule();
            
            // Create header
            const header = document.createElement('div');
            header.className = 'schedule-header';
            header.textContent = 'Time / Day';
            this.elements['schedule-grid'].appendChild(header);

            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            days.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'schedule-day-header';
                dayHeader.textContent = day;
                this.elements['schedule-grid'].appendChild(dayHeader);
            });

            // Create time slots
            const timeSlots = [
                { start: 0, end: 4, phase: "Mixed Phase" },
                { start: 4, end: 8, phase: "Drone Boost" },
                { start: 8, end: 12, phase: "City Building" },
                { start: 12, end: 16, phase: "Tech Research" },
                { start: 16, end: 20, phase: "Hero Advancement" },
                { start: 20, end: 24, phase: "Unit Progression" }
            ];

            timeSlots.forEach(slot => {
                const timeHeader = document.createElement('div');
                timeHeader.className = 'schedule-header';
                timeHeader.textContent = `${String(slot.start).padStart(2, '0')}:00-${String(slot.end % 24).padStart(2, '0')}:00`;
                this.elements['schedule-grid'].appendChild(timeHeader);

                for (let day = 0; day < 7; day++) {
                    const cell = document.createElement('div');
                    cell.className = 'schedule-cell';
                    
                    const alignment = this.getAlignment(day, slot.phase);
                    const { utcDay, utcHour } = this.getCurrentUTCInfo();
                    const isCurrentSlot = day === utcDay && utcHour >= slot.start && utcHour < slot.end;
                    
                    if (alignment) {
                        cell.classList.add('priority');
                    }
                    if (isCurrentSlot) {
                        cell.classList.add('current');
                    }

                    const phaseData = this.data.armsracephases.find(p => p.name === slot.phase);
                    const vsDayData = this.data.vsdays.find(d => d.day === day);

                    cell.innerHTML = `
                        <div class="cell-phase">${phaseData.icon} ${slot.phase}</div>
                        <div class="cell-reason">${alignment ? alignment.reason : vsDayData.title}</div>
                    `;

                    cell.addEventListener('click', () => {
                        this.showScheduleModal(slot, day, vsDayData, phaseData, alignment);
                    });

                    this.elements['schedule-grid'].appendChild(cell);
                }
            });
        } catch (error) {
            console.error("Error updating schedule grid:", error);
        }
    }

    updateTodaySchedule() {
        try {
            if (!this.elements['time-slots'] || !this.elements['today-date']) return;
            
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            this.elements['today-date'].textContent = today.toLocaleDateString('en-US', options);
            
            this.elements['time-slots'].innerHTML = '';
            
            const timeSlots = [
                { start: 0, end: 4, phase: "Mixed Phase" },
                { start: 4, end: 8, phase: "Drone Boost" },
                { start: 8, end: 12, phase: "City Building" },
                { start: 12, end: 16, phase: "Tech Research" },
                { start: 16, end: 20, phase: "Hero Advancement" },
                { start: 20, end: 24, phase: "Unit Progression" }
            ];

            const { utcDay, utcHour } = this.getCurrentUTCInfo();
            
            timeSlots.forEach(slot => {
                const slotEl = document.createElement('div');
                slotEl.className = 'time-slot';
                
                const alignment = this.getAlignment(utcDay, slot.phase);
                const isCurrentSlot = utcHour >= slot.start && utcHour < slot.end;
                
                if (alignment) {
                    slotEl.classList.add('priority');
                }
                if (isCurrentSlot) {
                    slotEl.classList.add('current');
                }

                const phaseData = this.data.armsracephases.find(p => p.name === slot.phase);
                
                slotEl.innerHTML = `
                    <div class="slot-time">${String(slot.start).padStart(2, '0')}:00 - ${String(slot.end % 24).padStart(2, '0')}:00</div>
                    <div class="slot-phase">${phaseData.icon} ${slot.phase}</div>
                    <div class="slot-details">
                        <div class="slot-reason">${alignment ? alignment.reason : phaseData.activities[0]}</div>
                        ${alignment ? `<div class="slot-points">+${alignment.points} points potential</div>` : ''}
                    </div>
                `;

                this.elements['time-slots'].appendChild(slotEl);
            });
        } catch (error) {
            console.error("Error updating today schedule:", error);
        }
    }

    populateIntelligence() {
        try {
            if (!this.elements['intelligence-content']) return;
            
            this.elements['intelligence-content'].innerHTML = '';
            
            const sections = [
                { title: 'Essential Guides', items: this.data.intelligence.guides },
                { title: 'Pro Tips & Strategies', items: this.data.intelligence.tips },
                { title: 'Season 4 Content', items: this.data.intelligence.season4 }
            ];

            sections.forEach(section => {
                const sectionEl = document.createElement('div');
                sectionEl.className = 'intel-section';
                
                const headerEl = document.createElement('div');
                headerEl.className = 'intel-header';
                headerEl.textContent = section.title;
                
                const contentEl = document.createElement('div');
                contentEl.className = 'intel-content';
                
                const innerEl = document.createElement('div');
                innerEl.className = 'intel-inner';
                
                section.items.forEach(item => {
                    const itemEl = document.createElement('div');
                    itemEl.innerHTML = `
                        <h4>${item.title}</h4>
                        <p>${item.content}</p>
                        <a href="${item.link}" target="_blank">Read Full Guide →</a>
                    `;
                    innerEl.appendChild(itemEl);
                });
                
                contentEl.appendChild(innerEl);
                sectionEl.appendChild(headerEl);
                sectionEl.appendChild(contentEl);
                
                headerEl.addEventListener('click', () => {
                    sectionEl.classList.toggle('active');
                    if (sectionEl.classList.contains('active')) {
                        contentEl.style.maxHeight = contentEl.scrollHeight + 'px';
                    } else {
                        contentEl.style.maxHeight = '0';
                    }
                });
                
                this.elements['intelligence-content'].appendChild(sectionEl);
            });
        } catch (error) {
            console.error("Error populating intelligence:", error);
        }
    }

    updateBottomPriorityCards() {
        try {
            if (!this.elements['bottom-priority-grid']) return;
            
            this.elements['bottom-priority-grid'].innerHTML = '';
            const { utcDay, utcHour } = this.getCurrentUTCInfo();
            
            // Get next 3 priority windows
            const upcomingWindows = this.getAllHighPriorityWindows()
                .filter(w => {
                    const eventTime = this.getPhaseStartTime(w.hour, w.vsDay);
                    return eventTime > new Date() || (w.vsDay === utcDay && this.isCurrentManualPhase(w.hour));
                })
                .slice(0, 3);

            upcomingWindows.forEach(window => {
                const isActive = window.vsDay === utcDay && this.isCurrentManualPhase(window.hour);
                const cardEl = document.createElement('div');
                cardEl.className = `bottom-priority-card${isActive ? ' active' : ''}`;
                
                const vsDayData = this.getVSDayData(window.vsDay);
                const armsPhase = this.data.armsracephases.find(p => p.name === window.armsPhase);
                
                cardEl.innerHTML = `
                    <div class="bottom-card-header">
                        <div class="bottom-card-day">${vsDayData.name}</div>
                        <div class="bottom-card-time">${window.timeRange}</div>
                        <div class="bottom-card-badge">${isActive ? 'ACTIVE' : 'UPCOMING'}</div>
                    </div>
                    <div class="bottom-card-content">
                        <div class="bottom-card-phase">${armsPhase.icon} ${armsPhase.name}</div>
                    </div>
                `;

                this.elements['bottom-priority-grid'].appendChild(cardEl);
            });
        } catch (error) {
            console.error("Error updating bottom priority cards:", error);
        }
    }

    toggleBottomCards() {
        try {
            if (this.elements['bottom-priority-cards']) {
                this.elements['bottom-priority-cards'].classList.toggle('minimized');
                const isMinimized = this.elements['bottom-priority-cards'].classList.contains('minimized');
                if (this.elements['minimize-cards']) {
                    this.elements['minimize-cards'].textContent = isMinimized ? 'Expand' : 'Minimize';
                }
            }
        } catch (error) {
            console.error("Error toggling bottom cards:", error);
        }
    }

    // Helper methods
    getVSDayData(day) {
        return this.data.vsdays.find(d => d.day === day) || this.data.vsdays[0];
    }

    getArmsRacePhase(hour) {
        const phaseIndex = Math.floor(hour / 4);
        return this.data.armsracephases[phaseIndex] || this.data.armsracephases[0];
    }

    getAlignment(vsDay, armsPhase) {
        return this.data.highpriorityalignments.find(a => 
            a.vsday === vsDay && a.armsphase === armsPhase
        );
    }

    getAllHighPriorityWindows() {
        const windows = [];
        
        this.data.highpriorityalignments.forEach(alignment => {
            const timeSlots = [
                { start: 0, end: 4, phase: "Mixed Phase" },
                { start: 4, end: 8, phase: "Drone Boost" },
                { start: 8, end: 12, phase: "City Building" },
                { start: 12, end: 16, phase: "Tech Research" },
                { start: 16, end: 20, phase: "Hero Advancement" },
                { start: 20, end: 24, phase: "Unit Progression" }
            ];

            timeSlots.forEach(slot => {
                if (slot.phase === alignment.armsphase) {
                    windows.push({
                        vsDay: alignment.vsday,
                        armsPhase: alignment.armsphase,
                        hour: slot.start,
                        timeRange: `${String(slot.start).padStart(2, '0')}:00-${String(slot.end % 24).padStart(2, '0')}:00`,
                        points: alignment.points,
                        reason: alignment.reason
                    });
                }
            });
        });

        return windows.sort((a, b) => {
            const aTime = this.getPhaseStartTime(a.hour, a.vsDay);
            const bTime = this.getPhaseStartTime(b.hour, b.vsDay);
            return aTime - bTime;
        });
    }

    getNextHighPriorityWindow() {
        const now = new Date();
        const windows = this.getAllHighPriorityWindows();
        
        return windows.find(w => {
            const eventTime = this.getPhaseStartTime(w.hour, w.vsDay);
            return eventTime > now;
        });
    }

    getPhaseStartTime(hour, vsDay) {
        const now = new Date();
        const eventTime = new Date(now);
        
        // Calculate days until the target VS day
        const currentDay = now.getUTCDay();
        let daysUntil = vsDay - currentDay;
        if (daysUntil < 0) daysUntil += 7;
        if (daysUntil === 0 && hour <= now.getUTCHours()) daysUntil = 7;
        
        eventTime.setUTCDate(now.getUTCDate() + daysUntil);
        eventTime.setUTCHours(hour, 0, 0, 0);
        
        return eventTime;
    }

    // Modal methods
    showEventModal(window, vsDayData, armsPhase, alignment) {
        try {
            if (!this.elements['event-modal']) return;
            
            this.safeUpdateElement('modal-title', 'textContent', `${armsPhase.name} Priority Window`);
            
            if (this.elements['modal-body']) {
                this.elements['modal-body'].innerHTML = `
                    <div class="modal-section">
                        <h4>Event Details</h4>
                        <p><strong>VS Day:</strong> ${vsDayData.name} - ${vsDayData.title}</p>
                        <p><strong>Arms Race Phase:</strong> ${armsPhase.icon} ${armsPhase.name}</p>
                        <p><strong>Time Window:</strong> ${window.timeRange}</p>
                        <p><strong>Priority Level:</strong> High Priority Window</p>
                    </div>
                    <div class="modal-section">
                        <h4>Strategic Focus</h4>
                        <p>${alignment ? alignment.reason : 'Strategic alignment opportunity for maximum efficiency.'}</p>
                        <p><strong>Estimated Points:</strong> ${alignment ? alignment.points : 'High'}</p>
                    </div>
                    <div class="modal-section">
                        <h4>Recommended Activities</h4>
                        <p><strong>Arms Race Focus:</strong> ${armsPhase.pointSources.slice(0, 3).join(', ')}</p>
                        <p><strong>VS Activities:</strong> ${vsDayData.pointActivities.slice(0, 3).join(', ')}</p>
                    </div>
                    <div class="modal-section">
                        <h4>Strategy Tips</h4>
                        <p>Save your speedups and resources for this window. The alignment between VS activities and Arms Race phases provides 2-4x point efficiency. Plan your resource usage accordingly and coordinate with your alliance for maximum benefit.</p>
                    </div>
                `;
            }
            
            this.elements['event-modal'].style.display = 'flex';
        } catch (error) {
            console.error("Error showing event modal:", error);
        }
    }

    showScheduleModal(slot, day, vsDayData, phaseData, alignment) {
        try {
            if (!this.elements['event-modal']) return;
            
            this.safeUpdateElement('modal-title', 'textContent', `${phaseData.name} - ${vsDayData.name}`);
            
            if (this.elements['modal-body']) {
                this.elements['modal-body'].innerHTML = `
                    <div class="modal-section">
                        <h4>Schedule Details</h4>
                        <p><strong>Day:</strong> ${vsDayData.name} - ${vsDayData.title}</p>
                        <p><strong>Phase:</strong> ${phaseData.icon} ${phaseData.name}</p>
                        <p><strong>Time:</strong> ${String(slot.start).padStart(2, '0')}:00 - ${String(slot.end % 24).padStart(2, '0')}:00 UTC</p>
                        <p><strong>Priority:</strong> ${alignment ? 'High Priority' : 'Standard'}</p>
                    </div>
                    ${alignment ? `
                        <div class="modal-section">
                            <h4>Priority Alignment</h4>
                            <p>${alignment.reason}</p>
                            <p><strong>Expected Points:</strong> ${alignment.points}</p>
                        </div>
                    ` : ''}
                    <div class="modal-section">
                        <h4>Activities</h4>
                        <p><strong>Arms Race:</strong> ${phaseData.pointSources.join(', ')}</p>
                        <p><strong>VS Focus:</strong> ${vsDayData.pointActivities.join(', ')}</p>
                    </div>
                `;
            }
            
            this.elements['event-modal'].style.display = 'flex';
        } catch (error) {
            console.error("Error showing schedule modal:", error);
        }
    }

    closeModal() {
        try {
            if (this.elements['event-modal']) {
                this.elements['event-modal'].style.display = 'none';
            }
        } catch (error) {
            console.error("Error closing modal:", error);
        }
    }

    shareEvent() {
        try {
            if (navigator.share) {
                navigator.share({
                    title: 'Last War Nexus - Priority Window',
                    text: 'Check out this high priority window for maximum VS points!',
                    url: window.location.href
                });
            } else {
                // Fallback - copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (error) {
            console.error("Error sharing event:", error);
        }
    }

    setReminder() {
        try {
            // This would integrate with browser notifications or calendar APIs
            alert('Reminder feature coming soon! For now, bookmark this page and check back regularly.');
        } catch (error) {
            console.error("Error setting reminder:", error);
        }
    }
}

// Initialize the application
new LastWarNexus();
