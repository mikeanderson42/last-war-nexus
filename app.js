class LastWarNexus {
    constructor() {
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 3;
        
        // Server configuration
        this.serverNumber = 555;
        this.serverLaunchDate = null;
        this.phaseOffset = 0; // hours offset from UTC
        
        // Data structure
        this.data = {
            armsracephases: [
                { id: 6, name: "Mixed Phase", icon: "🔄", activities: ["Check in-game calendar"], pointSources: ["Check calendar for current focus", "Mixed activities", "Various point sources", "Event-specific tasks", "General progression"] },
                { id: 4, name: "Drone Boost", icon: "🚁", activities: ["Stamina usage", "Drone activities"], pointSources: ["Use stamina for attacks", "Complete drone missions", "Gather drone data", "Battle elite enemies", "Use stamina items"] },
                { id: 1, name: "City Building", icon: "🏗️", activities: ["Building upgrades", "Construction speedups"], pointSources: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Upgrade headquarters", "Construct new buildings"] },
                { id: 3, name: "Tech Research", icon: "🔬", activities: ["Research completion", "Research speedups"], pointSources: ["Complete research", "Use research speedups", "Unlock new technologies", "Upgrade existing tech", "Finish research projects"] },
                { id: 5, name: "Hero Advancement", icon: "⚔️", activities: ["Hero recruitment", "Hero EXP"], pointSources: ["Recruit new heroes", "Apply hero EXP", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"] },
                { id: 2, name: "Unit Progression", icon: "🏟️", activities: ["Troop training", "Training speedups"], pointSources: ["Train troops", "Use training speedups", "Complete troop upgrades", "Unlock new units", "Enhance unit capabilities"] }
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
                    { title: "New Hero & Weapon VS Optimization", content: "Optimize Season 4 heroes for VS: Sarah's Legendary upgrade path maximizes Hero Advancement points, Lucius Exclusive Weapon enhances combat effectiveness for Day 6, and Butler's Tesla Coil skills provide strategic advantages.", link: "https://lastwartutorial.com/season-4-heroes-vs" },
                    { title: "Evernight Isle Resource Management", content: "Use Evernight Isle strategically: Lighthouse mechanics provide additional resources for VS preparation, fog navigation yields exclusive speedups, and coordinated exploration maximizes alliance benefits during VS periods.", link: "https://lastwartutorial.com/evernight-isle-vs" },
                    { title: "Legacy Season VS Strategies", content: "Don't miss proven strategies from Seasons 1-3: Foundation building techniques from Season 1, expansion optimization from Season 2, and advanced combat systems from Season 3 that remain effective for current VS gameplay.", link: "https://lastwartutorial.com/legacy-vs-strategies" }
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
                    console.error('Failed to initialize after maximum attempts');
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
            'current-vs-status', 'current-arms-status', 'countdown-timer', 'event-name', 'event-time',
            'progress-fill', 'progress-text', 'action-icon', 'action-text', 'strategy-rating',
            'optimization-focus', 'time-remaining', 'priority-level', 'settings-toggle', 'settings-dropdown',
            'priority-grid', 'schedule-grid', 'intelligence-content', 'priority-count', 'schedule-count',
            'intel-count', 'event-modal', 'modal-title', 'modal-body', 'modal-close', 'modal-share',
            'modal-remind', 'time-format-dropdown', 'detail-level-dropdown', 'view-scope-dropdown',
            'bottom-priority-cards', 'bottom-priority-grid', 'minimize-cards', 'bottom-cards-content',
            'server-toggle', 'server-dropdown', 'server-input', 'apply-server', 'current-server',
            'server-launch', 'phase-offset'
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
            // Tab navigation
            this.addEventListener('.tab-btn', 'click', (e) => {
                e.preventDefault();
                const tabName = e.target.closest('.tab-btn')?.dataset?.tab;
                if (tabName) {
                    this.switchTab(tabName);
                }
            });

            // Filter buttons
            this.addEventListener('.filter-btn', 'click', (e) => {
                e.preventDefault();
                const filter = e.target.dataset?.filter;
                if (filter) {
                    this.setFilter(filter);
                }
            });

            // Settings dropdown
            if (this.elements.settingstoggle) {
                this.addEventListenerSingle(this.elements.settingstoggle, 'click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown('settings');
                });
            }

            // Server dropdown
            if (this.elements.servertoggle) {
                this.addEventListenerSingle(this.elements.servertoggle, 'click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown('server');
                });
            }

            // Server input and apply button
            if (this.elements.serverinput) {
                this.addEventListenerSingle(this.elements.serverinput, 'input', (e) => {
                    this.validateServerInput(e.target.value);
                });
            }

            if (this.elements.applyserver) {
                this.addEventListenerSingle(this.elements.applyserver, 'click', (e) => {
                    e.preventDefault();
                    this.applyServerSettings();
                });
            }

            // Dropdown selects
            if (this.elements.timeformatdropdown) {
                this.addEventListenerSingle(this.elements.timeformatdropdown, 'change', (e) => {
                    this.settings.timeFormat = e.target.value;
                    this.updateAllDisplays();
                    this.updateBottomPriorityCards();
                });
            }

            if (this.elements.detailleveldropdown) {
                this.addEventListenerSingle(this.elements.detailleveldropdown, 'change', (e) => {
                    this.settings.detailLevel = e.target.value;
                    this.updateContent();
                    this.updateExpandedDetails();
                });
            }

            if (this.elements.viewscopedropdown) {
                this.addEventListenerSingle(this.elements.viewscopedropdown, 'change', (e) => {
                    this.settings.viewScope = e.target.value;
                    this.updateContent();
                });
            }

            // Status expansion
            if (this.elements.currentvsstatus) {
                this.addEventListenerSingle(this.elements.currentvsstatus, 'click', (e) => {
                    e.preventDefault();
                    this.toggleDetail('vsDay');
                });
            }

            if (this.elements.currentarmsstatus) {
                this.addEventListenerSingle(this.elements.currentarmsstatus, 'click', (e) => {
                    e.preventDefault();
                    this.toggleDetail('armsRace');
                });
            }

            // Bottom cards
            if (this.elements.minimizecards) {
                this.addEventListenerSingle(this.elements.minimizecards, 'click', (e) => {
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
            if (this.elements.modalclose) {
                this.addEventListenerSingle(this.elements.modalclose, 'click', (e) => {
                    e.preventDefault();
                    this.closeModal();
                });
            }

            if (this.elements.eventmodal) {
                this.addEventListenerSingle(this.elements.eventmodal, 'click', (e) => {
                    if (e.target === this.elements.eventmodal) {
                        e.preventDefault();
                        this.closeModal();
                    }
                });
            }

            if (this.elements.modalshare) {
                this.addEventListenerSingle(this.elements.modalshare, 'click', (e) => {
                    e.preventDefault();
                    this.shareEvent();
                });
            }

            if (this.elements.modalremind) {
                this.addEventListenerSingle(this.elements.modalremind, 'click', (e) => {
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

            console.log('Event listeners set up successfully');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
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
                this.serverNumber = settings.serverNumber || 555;
                this.phaseOffset = settings.phaseOffset || 0;
                this.serverLaunchDate = settings.serverLaunchDate ? new Date(settings.serverLaunchDate) : null;
            }
            this.updateServerDisplay();
            this.calculateServerInfo();
        } catch (error) {
            console.error('Error loading server settings:', error);
        }
    }

    saveServerSettings() {
        try {
            const settings = {
                serverNumber: this.serverNumber,
                phaseOffset: this.phaseOffset,
                serverLaunchDate: this.serverLaunchDate?.toISOString()
            };
            localStorage.setItem('lwn-server-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving server settings:', error);
        }
    }

    validateServerInput(value) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 1 || num > 9999) {
            this.elements.applyserver?.classList.add('disabled');
            return false;
        }
        this.elements.applyserver?.classList.remove('disabled');
        return true;
    }

    applyServerSettings() {
        try {
            const serverInput = this.elements.serverinput?.value;
            if (!this.validateServerInput(serverInput)) {
                alert('Please enter a valid server number (1-9999)');
                return;
            }

            this.serverNumber = parseInt(serverInput, 10);
            this.calculateServerInfo();
            this.updateServerDisplay();
            this.saveServerSettings();
            this.closeDropdown();
            this.updateAllDisplays();
            
            console.log(`Server updated to: ${this.serverNumber}`);
        } catch (error) {
            console.error('Error applying server settings:', error);
        }
    }

    calculateServerInfo() {
        try {
            // Calculate server launch date based on server number
            const baseDate = new Date('2023-01-01T00:00:00Z'); // Base reference date
            const daysOffset = Math.floor((this.serverNumber - 1) / 10) * 7; // New servers every week
            
            this.serverLaunchDate = new Date(baseDate);
            this.serverLaunchDate.setUTCDate(baseDate.getUTCDate() + daysOffset);
            
            // Calculate phase offset (servers might have different phase timings)
            this.phaseOffset = (this.serverNumber % 4) * 2; // 0, 2, 4, 6 hour offsets
            
            this.updateServerInfoDisplay();
        } catch (error) {
            console.error('Error calculating server info:', error);
        }
    }

    updateServerDisplay() {
        if (this.elements.currentserver) {
            this.elements.currentserver.textContent = this.serverNumber;
        }
        if (this.elements.serverinput) {
            this.elements.serverinput.value = this.serverNumber;
        }
    }

    updateServerInfoDisplay() {
        try {
            if (this.elements.serverlaunch && this.serverLaunchDate) {
                const launchString = this.serverLaunchDate.toLocaleDateString();
                this.elements.serverlaunch.textContent = launchString;
            }
            
            if (this.elements.phaseoffset) {
                this.elements.phaseoffset.textContent = `${this.phaseOffset}h`;
            }
        } catch (error) {
            console.error('Error updating server info display:', error);
        }
    }

    // Time methods with server offset
    getCurrentUTCInfo() {
        const now = new Date();
        const serverTime = new Date(now.getTime() + (this.phaseOffset * 60 * 60 * 1000));
        return {
            utcDay: serverTime.getUTCDay(),
            utcHour: serverTime.getUTCHours(),
            utcMinute: serverTime.getUTCMinutes()
        };
    }

    getServerTime() {
        const now = new Date();
        return new Date(now.getTime() + (this.phaseOffset * 60 * 60 * 1000));
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
                this.updateExpandedDetails();
            }
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
                const activities = this.settings.detailLevel === 'comprehensive' ? vsDayData.pointActivities : vsDayData.activities;
                activities.forEach(activity => {
                    const activityEl = document.createElement('div');
                    activityEl.className = 'detail-item';
                    activityEl.textContent = activity;
                    this.elements.vsdaycontent.appendChild(activityEl);
                });
            }

            if (this.expandedDetails.armsRace && this.elements.armsracecontent) {
                this.elements.armsracecontent.innerHTML = '';
                const sources = this.settings.detailLevel === 'comprehensive' ? armsPhase.pointSources : armsPhase.activities;
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

    toggleDropdown(type) {
        try {
            if (type === 'settings') {
                this.dropdownOpen = !this.dropdownOpen;
                if (this.elements.settingsdropdown && this.elements.settingstoggle) {
                    this.elements.settingsdropdown.classList.toggle('show', this.dropdownOpen);
                    this.elements.settingstoggle.classList.toggle('active', this.dropdownOpen);
                }
            } else if (type === 'server') {
                const serverDropdownOpen = this.elements.serverdropdown?.classList.contains('show');
                if (this.elements.serverdropdown && this.elements.servertoggle) {
                    this.elements.serverdropdown.classList.toggle('show', !serverDropdownOpen);
                    this.elements.servertoggle.classList.toggle('active', !serverDropdownOpen);
                }
            }
            
            // Close the other dropdown
            if (type === 'settings' && this.elements.serverdropdown) {
                this.elements.serverdropdown.classList.remove('show');
                this.elements.servertoggle?.classList.remove('active');
            } else if (type === 'server' && this.elements.settingsdropdown) {
                this.elements.settingsdropdown.classList.remove('show');
                this.elements.settingstoggle?.classList.remove('active');
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
            if (this.elements.serverdropdown && this.elements.servertoggle) {
                this.elements.serverdropdown.classList.remove('show');
                this.elements.servertoggle.classList.remove('active');
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
            const serverTime = this.getServerTime();
            const timeString = this.settings.timeFormat === 'utc' ? 
                serverTime.toUTCString().slice(17, 25) : 
                serverTime.toLocaleTimeString();
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
                    this.safeUpdateElement('alignmentindicator', 'textContent', 'HIGH PRIORITY');
                    this.elements.alignmentindicator.style.color = 'var(--accent-success)';
                    this.elements.alignmentstatus.classList.add('priority-active');
                } else {
                    this.safeUpdateElement('alignmentindicator', 'textContent', 'Normal Phase');
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
            // Check for server reset period (00:00-00:05 UTC)
            if (utcHour === 0 && utcMinute < 5) {
                this.safeUpdateElement('actionicon', 'textContent', '🔄');
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
                this.safeUpdateElement('actiontext', 'innerHTML', `<strong>Normal Phase</strong><br>Focus on ${armsPhase.activities[0]} but save major resources for high priority windows.`);
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
                { start: 0, end: 4 }, // Mixed Phase
                { start: 4, end: 8 }, // Drone Boost
                { start: 8, end: 12 }, // City Building
                { start: 12, end: 16 }, // Tech Research
                { start: 16, end: 20 }, // Hero Advancement
                { start: 20, end: 24 } // Unit Progression
            ];

            let currentPhaseEnd = null;
            for (const phase of phaseSchedule) {
                if (utcHour >= phase.start && utcHour < phase.end) {
                    currentPhaseEnd = phase.end;
                    break;
                }
            }

            if (!currentPhaseEnd) return 'Unknown';

            const now = new Date();
            const phaseEndTime = new Date();
            phaseEndTime.setUTCHours(currentPhaseEnd % 24, 0, 0, 0);
            
            if (currentPhaseEnd >= 24) {
                phaseEndTime.setUTCDate(phaseEndTime.getUTCDate() + 1);
                phaseEndTime.setUTCHours(0, 0, 0, 0);
            }

            const timeRemaining = phaseEndTime.getTime() - now.getTime();
            if (timeRemaining <= 0) return 'Phase ending';

            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m`;
            }
        } catch (error) {
            console.error('Error calculating phase time remaining:', error);
            return 'Unknown';
        }
    }

    getOptimizationFocus(phaseName) {
        const focusMap = {
            'City Building': 'Construction Speedups',
            'Unit Progression': 'Training Speedups',
            'Tech Research': 'Research Speedups',
            'Drone Boost': 'Stamina & Drone Data',
            'Hero Advancement': 'Hero EXP & Recruitment',
            'Mixed Phase': 'Check Calendar'
        };
        return focusMap[phaseName] || 'General Activities';
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
            if (timeDiff <=
