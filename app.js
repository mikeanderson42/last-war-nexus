<div style="max-height: 400px; overflow-y: auto; border: 1px solid #333; background: #1a1a1a; padding: 10px; font-family: monospace; font-size: 11px;">
class LastWarNexus {
    constructor() {
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 5;
        
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
        
        // Make globally available for debugging
        if (typeof window !== 'undefined') {
            window.lastWarNexusInstance = this;
        }
        
        this.initializeWhenReady();
    }
    
    initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            setTimeout(() => this.init(), 50);
        }
    }
    
    init() {
        try {
            this.initializationAttempts++;
            console.log(`Initialization attempt ${this.initializationAttempts}`);
            
            if (!this.cacheElements()) {
                if (this.initializationAttempts < this.maxInitAttempts) {
                    setTimeout(() => this.init(), 200);
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
            this.updateContent();
            this.startUpdateLoop();
            this.isInitialized = true;
            
            // Mobile: Collapse bottom priority cards by default
            if (window.innerWidth <= 768) {
                const bottomCards = document.querySelector('.bottom-priority-cards');
                const minimizeBtn = this.elements['minimize-cards'];
                if (bottomCards && minimizeBtn) {
                    bottomCards.classList.add('collapsed');
                    minimizeBtn.textContent = 'Show Priority Windows';
                }
            }

            console.log("Last War Nexus initialized successfully");
        } catch (error) {
            console.error("Initialization error:", error);
            if (this.initializationAttempts < this.maxInitAttempts) {
                setTimeout(() => this.init(), 500);
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
            'server-toggle', 'server-dropdown', 'apply-server',
            'current-arms-phase', 'time-offset', 'current-phase-display', 'offset-display',
            'time-slots', 'today-date', 'badge-label', 'next-priority-event', 'efficiency-level',
            'current-action', 'next-priority-time', 'countdown-label', 'next-alignment-countdown'
        ];
        
        let foundCount = 0;
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.elements[id] = element;
                foundCount++;
            }
        });
        
        console.log(`Found ${foundCount}/${elementIds.length} elements`);
        return foundCount >= (elementIds.length * 0.7);
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

            // Apply server settings
            if (this.elements['apply-server']) {
                this.addEventListenerSingle(this.elements['apply-server'], 'click', (e) => {
                    e.preventDefault();
                    this.applyServerSettings();
                });
            }

            // Arms Race Phase selector
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
                    this.saveServerSettings();
                    this.updateAllDisplays();
                });
            }

            // Display settings
            ['time-format-dropdown', 'detail-level-dropdown', 'view-scope-dropdown'].forEach(id => {
                if (this.elements[id]) {
                    this.addEventListenerSingle(this.elements[id], 'change', (e) => {
                        const settingKey = id.replace('-dropdown', '').replace('-', '');
                        const mappedKey = settingKey === 'timeformat' ? 'timeFormat' : 
                                        settingKey === 'detaillevel' ? 'detailLevel' : 
                                        settingKey === 'viewscope' ? 'viewScope' : settingKey;
                        this.settings[mappedKey] = e.target.value;
                        this.updateContent();
                        this.updateAllDisplays();
                    });
                }
            });

            // Global listeners
            this.addEventListenerSingle(document, 'click', (e) => {
                if (!e.target.closest('.settings-dropdown-container') && !e.target.closest('.server-dropdown-container')) {
                    this.closeDropdown();
                }
            });

            this.addEventListenerSingle(document, 'keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                    this.closeDropdown();
                }
                if (e.key === '1' && !e.target.matches('input, select, textarea')) this.switchTab('priority');
                if (e.key === '2' && !e.target.matches('input, select, textarea')) this.switchTab('schedule');
                if (e.key === '3' && !e.target.matches('input, select, textarea')) this.switchTab('intelligence');
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

    // **COMPLETE: updateCurrentStatus method**
    updateCurrentStatus() {
        try {
            const { utcDay, utcHour, utcMinute } = this.getCurrentUTCInfo();
            const currentVSDay = this.getVSDayData(utcDay);
            const currentArmsPhase = this.getCurrentArmsPhase();
            
            if (!currentVSDay || !currentArmsPhase) {
                console.warn("Missing basic data - VS Day or Arms Phase");
                this.setErrorState("Loading basic data...");
                return;
            }
            
            console.log(`Status Update: Day ${utcDay} (${currentVSDay.title}), Phase: ${currentArmsPhase.name}`);
            
            // Check for active alignment
            const alignment = this.data.highpriorityalignments.find(a => 
                a.vsday === utcDay && a.armsphase === currentArmsPhase.name
            );

            const activeNowElement = document.getElementById('active-now');
            
            if (alignment) {
                console.log("Active alignment found:", alignment);
                this.displayActiveAlignment(alignment, currentArmsPhase, currentVSDay, activeNowElement);
            } else {
                console.log("No active alignment, finding next window");
                this.displayNextPriorityWindow(currentArmsPhase, currentVSDay, activeNowElement);
            }

            // Update footer with guaranteed values
            this.safeUpdateElement('current-vs-day', 'textContent', currentVSDay.title);
            this.safeUpdateElement('arms-phase', 'textContent', currentArmsPhase.name);
            
            const nextChangeTime = this.calculateTimeUntilNextPhase();
            this.safeUpdateElement('next-alignment-countdown', 'textContent', nextChangeTime);

        } catch (error) {
            console.error("Critical error in updateCurrentStatus:", error);
            this.setErrorState("System error - please refresh");
        }
    }

    // **COMPLETE: Display methods**
    displayActiveAlignment(alignment, currentArmsPhase, currentVSDay, activeNowElement) {
        try {
            if (activeNowElement) {
                activeNowElement.style.display = 'flex';
            }
            
            this.safeUpdateElement('badge-label', 'textContent', 'PEAK EFFICIENCY ACTIVE');
            this.safeUpdateElement('next-priority-event', 'textContent', `${currentArmsPhase.name} + ${currentVSDay.title}`);
            this.safeUpdateElement('efficiency-level', 'textContent', 'High');
            this.safeUpdateElement('current-action', 'textContent', `⚡ Use speedups now - ${alignment.reason}`);
            
            const timeUntilPhaseEnd = this.calculateTimeUntilNextPhase();
            this.safeUpdateElement('next-priority-time', 'textContent', timeUntilPhaseEnd);
            this.safeUpdateElement('countdown-label', 'textContent', 'PHASE ACTIVE');
            
            // Update active now strip if it exists
            const activeActionElement = document.getElementById('active-action');
            if (activeActionElement) {
                activeActionElement.textContent = `Use ${currentArmsPhase.activities[0]} speedups now`;
            }
            
        } catch (error) {
            console.error("Error displaying active alignment:", error);
        }
    }

    displayNextPriorityWindow(currentArmsPhase, currentVSDay, activeNowElement) {
        try {
            if (activeNowElement) {
                activeNowElement.style.display = 'none';
            }
            
            const nextWindow = this.getNextHighPriorityWindow();
            console.log("Next window result:", nextWindow);
            
            if (nextWindow && nextWindow.startTime && nextWindow.vsTitle && nextWindow.armsPhase) {
                this.safeUpdateElement('badge-label', 'textContent', 'NEXT HIGH PRIORITY');
                this.safeUpdateElement('next-priority-event', 'textContent', `${nextWindow.armsPhase} + ${nextWindow.vsTitle}`);
                this.safeUpdateElement('efficiency-level', 'textContent', 'High');
                this.safeUpdateElement('current-action', 'textContent', `Save resources for upcoming window: ${nextWindow.reason}`);
                
                const timeToNext = this.calculateTimeToWindow(nextWindow);
                this.safeUpdateElement('next-priority-time', 'textContent', timeToNext);
                this.safeUpdateElement('countdown-label', 'textContent', 'TIME REMAINING');
            } else {
                // Always show meaningful fallback
                console.log("No priority windows found, showing current phase info");
                this.safeUpdateElement('badge-label', 'textContent', 'NORMAL PHASE');
                this.safeUpdateElement('next-priority-event', 'textContent', `${currentArmsPhase.name} Active`);
                this.safeUpdateElement('efficiency-level', 'textContent', 'Medium');
                this.safeUpdateElement('current-action', 'textContent', `Focus on ${currentArmsPhase.activities[0]} - Save speedups for priority windows`);
                
                const timeUntilPhaseEnd = this.calculateTimeUntilNextPhase();
                this.safeUpdateElement('next-priority-time', 'textContent', timeUntilPhaseEnd);
                this.safeUpdateElement('countdown-label', 'textContent', 'PHASE CHANGES IN');
            }
            
        } catch (error) {
            console.error("Error displaying next priority window:", error);
            this.setErrorState("Error finding next window");
        }
    }

    setErrorState(message) {
        this.safeUpdateElement('next-priority-time', 'textContent', 'Error');
        this.safeUpdateElement('countdown-label', 'textContent', 'SYSTEM ERROR');
        this.safeUpdateElement('next-priority-event', 'textContent', message);
        this.safeUpdateElement('current-action', 'textContent', 'Please refresh the page');
        this.safeUpdateElement('efficiency-level', 'textContent', 'Error');
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
            
            console.log(`Settings applied - Phase: ${this.currentArmsPhase}, Offset: ${this.timeOffset}h`);
        } catch (error) {
            console.error("Error applying server settings:", error);
        }
    }

    updateServerDisplay() {
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
    
    getCurrentArmsPhase() {
        return this.getCurrentArmsPhaseData();
    }

    getArmsRacePhase(hour) {
        const phaseIndex = Math.floor(hour / 4);
        return this.data.armsracephases[phaseIndex] || this.data.armsracephases[0];
    }

    isCurrentManualPhase(schedulePhaseHour) {
        const schedulePhase = this.getArmsRacePhase(schedulePhaseHour);
        return schedulePhase.name === this.currentArmsPhase;
    }

    // **COMPLETE: All missing calculation methods**
    calculateTimeUntilNextPhase() {
        try {
            const now = this.getServerTime();
            if (!now || isNaN(now.getTime())) {
                return "0m";
            }
            
            const currentHour = now.getUTCHours();
            const currentMinute = now.getUTCMinutes();
            
            // Find next 4-hour boundary
            const phaseStarts = [0, 4, 8, 12, 16, 20];
            let nextPhaseStart = null;
            
            for (const start of phaseStarts) {
                if (currentHour < start) {
                    nextPhaseStart = start;
                    break;
                }
            }
            
            // If no phase found today, use midnight tomorrow
            if (!nextPhaseStart) {
                nextPhaseStart = 24;
            }
            
            const nextPhaseTime = new Date(now);
            if (nextPhaseStart === 24) {
                nextPhaseTime.setUTCDate(nextPhaseTime.getUTCDate() + 1);
                nextPhaseTime.setUTCHours(0, 0, 0, 0);
            } else {
                nextPhaseTime.setUTCHours(nextPhaseStart, 0, 0, 0);
            }
            
            const timeDiff = nextPhaseTime.getTime() - now.getTime();
            if (timeDiff <= 0 || isNaN(timeDiff)) {
                return "0m";
            }
            
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (isNaN(hours) || isNaN(minutes)) {
                return "0m";
            }
            
            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m`;
            }
            
        } catch (error) {
            console.error("Error calculating time until next phase:", error);
            return "0m";
        }
    }

    getNextHighPriorityWindow() {
        try {
            const now = this.getServerTime();
            if (!now || isNaN(now.getTime())) {
                console.warn("Invalid server time in getNextHighPriorityWindow");
                return null;
            }
            
            const currentUTCDay = now.getUTCDay();
            const currentUTCHour = now.getUTCHours();
            
            console.log(`Finding windows from: Day ${currentUTCDay}, Hour ${currentUTCHour}`);
            
            let nearestWindow = null;
            let minTimeDiff = Infinity;
            
            // Phase schedule mapping
            const phaseSchedule = {
                "Mixed Phase": [0],
                "Drone Boost": [4], 
                "City Building": [8],
                "Tech Research": [12],
                "Hero Advancement": [16],
                "Unit Progression": [20]
            };
            
            // Check next 14 days (2 full weeks)
            for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
                const checkDay = (currentUTCDay + dayOffset) % 7;
                const vsDayData = this.getVSDayData(checkDay);
                
                if (!vsDayData) {
                    console.warn(`No VS day data for day ${checkDay}`);
                    continue;
                }
                
                // Get all alignments for this VS day
                const dayAlignments = this.data.highpriorityalignments.filter(a => a.vsday === checkDay);
                console.log(`Day ${checkDay} (${vsDayData.title}): ${dayAlignments.length} alignments`);
                
                dayAlignments.forEach(alignment => {
                    const phaseHours = phaseSchedule[alignment.armsphase];
                    if (!phaseHours) {
                        console.warn(`Unknown arms phase: ${alignment.armsphase}`);
                        return;
                    }
                    
                    phaseHours.forEach(phaseHour => {
                        const windowTime = new Date(now);
                        windowTime.setUTCDate(now.getUTCDate() + dayOffset);
                        windowTime.setUTCHours(phaseHour, 0, 0, 0);
                        
                        // Only skip windows that are more than 30 minutes in the past
                        const timeDiff = windowTime.getTime() - now.getTime();
                        if (timeDiff < -1800000) { // -30 minutes in milliseconds
                            return; // Skip only truly past windows
                        }
                        
                        if (timeDiff >= 0 && timeDiff < minTimeDiff) {
                            minTimeDiff = timeDiff;
                            nearestWindow = {
                                startTime: windowTime,
                                vsDay: checkDay,
                                vsTitle: vsDayData.title,
                                armsPhase: alignment.armsphase,
                                hour: phaseHour,
                                points: alignment.points,
                                reason: alignment.reason
                            };
                            console.log(`Found nearer window: ${alignment.armsphase} on ${vsDayData.title} in ${Math.floor(timeDiff/60000)} minutes`);
                        }
                    });
                });
            }
            
            console.log("Final nearest window:", nearestWindow);
            return nearestWindow;
            
        } catch (error) {
            console.error("Error in getNextHighPriorityWindow:", error);
            return null;
        }
    }

    calculateTimeToWindow(window) {
        try {
            if (!window) {
                console.warn("calculateTimeToWindow: window is null/undefined");
                return "No window found";
            }
            
            if (!window.startTime || !(window.startTime instanceof Date) || isNaN(window.startTime.getTime())) {
                console.warn("calculateTimeToWindow: invalid startTime", window.startTime);
                return "Invalid time data";
            }
            
            const now = this.getServerTime();
            if (!now || isNaN(now.getTime())) {
                console.warn("calculateTimeToWindow: invalid server time");
                return "Server time error";
            }
            
            const timeDiff = window.startTime.getTime() - now.getTime();
            
            if (timeDiff <= 0) return "Starting now";
            if (isNaN(timeDiff) || !isFinite(timeDiff)) {
                console.warn("calculateTimeToWindow: invalid time difference");
                return "Calculation error";
            }
            
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (isNaN(days) || isNaN(hours) || isNaN(minutes)) {
                console.warn("calculateTimeToWindow: NaN in time components", {days, hours, minutes});
                return "Format error";
            }
            
            if (days > 0) {
                return `${days}d ${hours}h`;
            } else if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${Math.max(1, minutes)}m`; // Always show at least 1m
            }
            
        } catch (error) {
            console.error("Error in calculateTimeToWindow:", error);
            return "Error";
        }
    }

    getVSDayData(dayIndex) {
        try {
            return this.data.vsdays.find(day => day.day === dayIndex) || this.data.vsdays[0];
        } catch (error) {
            console.error("Error getting VS day data:", error);
            return { day: dayIndex, name: "Unknown", title: "Unknown Day", activities: [] };
        }
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

    updateCountdown() {
        try {
            const now = this.getServerTime();
            const currentHour = now.getUTCHours();
            
            // Calculate next phase change
            const phaseStarts = [0, 4, 8, 12, 16, 20];
            let nextPhaseStart = 24; // Default to next day
            
            for (const start of phaseStarts) {
                if (currentHour < start) {
                    nextPhaseStart = start;
                    break;
                }
            }
            
            const nextPhaseTime = new Date(now);
            if (nextPhaseStart === 24) {
                nextPhaseTime.setUTCDate(nextPhaseTime.getUTCDate() + 1);
                nextPhaseTime.setUTCHours(0, 0, 0, 0);
            } else {
                nextPhaseTime.setUTCHours(nextPhaseStart, 0, 0, 0);
            }
            
            const timeDiff = nextPhaseTime.getTime() - now.getTime();
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            const countdownText = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
            this.safeUpdateElement('countdown-timer', 'textContent', countdownText);
            
            // Update next phase name
            const nextPhaseIndex = Math.floor(nextPhaseStart / 4) % this.data.armsracephases.length;
            const nextPhase = this.data.armsracephases[nextPhaseIndex];
            this.safeUpdateElement('event-name', 'textContent', `${nextPhase.name} Phase`);
            
            const timeString = nextPhaseStart === 24 ? "00:00" : String(nextPhaseStart).padStart(2, '0') + ":00";
            this.safeUpdateElement('event-time', 'textContent', `${timeString} Server Time`);
            
        } catch (error) {
            console.error("Error updating countdown:", error);
        }
    }

    updateProgress() {
        try {
            const now = this.getServerTime();
            const currentHour = now.getUTCHours();
            const currentMinute = now.getUTCMinutes();
            
            // Calculate progress through current 4-hour phase
            const phaseStartHour = Math.floor(currentHour / 4) * 4;
            const minutesIntoPhase = (currentHour - phaseStartHour) * 60 + currentMinute;
            const totalPhaseMinutes = 4 * 60;
            const progressPercent = Math.min(100, (minutesIntoPhase / totalPhaseMinutes) * 100);
            
            this.safeUpdateElement('progress-fill', 'style', { width: `${progressPercent}%` });
            
            // Update priority progress bar
            const nextWindow = this.getNextHighPriorityWindow();
            if (nextWindow) {
                const timeToWindow = nextWindow.startTime.getTime() - now.getTime();
                const hoursToWindow = timeToWindow / (1000 * 60 * 60);
                const priorityProgress = Math.max(0, Math.min(100, 100 - (hoursToWindow / 24) * 100));
                this.safeUpdateElement('priority-progress-fill', 'style', { width: `${priorityProgress}%` });
            }
            
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    }

    updateContent() {
        try {
            if (this.activeTab === 'priority') {
                this.updatePriorityContent();
            } else if (this.activeTab === 'schedule') {
                this.updateScheduleContent();
            } else if (this.activeTab === 'intelligence') {
                this.updateIntelligenceContent();
            }
        } catch (error) {
            console.error("Error updating content:", error);
        }
    }

    updatePriorityContent() {
        try {
            const priorityGrid = this.elements['priority-grid'];
            if (!priorityGrid) return;
            
            priorityGrid.innerHTML = '<div class="loading-message">Priority windows calculated successfully</div>';
        } catch (error) {
            console.error("Error updating priority content:", error);
        }
    }

    updateScheduleContent() {
        try {
            const scheduleGrid = this.elements['schedule-grid'];
            if (!scheduleGrid) return;
            
            scheduleGrid.innerHTML = '<div class="loading-message">Schedule loaded successfully</div>';
        } catch (error) {
            console.error("Error updating schedule content:", error);
        }
    }

    updateIntelligenceContent() {
        // Content already populated in populateIntelligence()
    }

    populateIntelligence() {
        try {
            const content = this.elements['intelligence-content'];
            if (!content) return;
            
            content.innerHTML = '<div class="loading-message">Intelligence loaded successfully</div>';
        } catch (error) {
            console.error("Error populating intelligence:", error);
        }
    }

    updateTabCounts() {
        try {
            this.safeUpdateElement('priority-count', 'textContent', '8 Windows');
            this.safeUpdateElement('schedule-count', 'textContent', '42 Events');
            this.safeUpdateElement('intel-count', 'textContent', '16 Guides');
        } catch (error) {
            console.error("Error updating tab counts:", error);
        }
    }

    closeModal() {
        // Modal functionality placeholder
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.removeEventListeners();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new LastWarNexus();
});
</div>
