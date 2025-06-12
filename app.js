class LastWarNexus {
    constructor() {
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 5;
        
        this.currentArmsPhase = "auto";
        this.timeOffset = 0;
        
        this.data = {
            // CORRECTED: Removed "Mixed Phase" - Only 5 actual phases in 20-hour cycle
            armsracephases: [
                { id: 1, name: "City Building", icon: "🏗️", activities: ["Building upgrades", "Construction speedups"], pointSources: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Upgrade headquarters", "Construct new buildings"] },
                { id: 2, name: "Unit Progression", icon: "⚔️", activities: ["Troop training", "Training speedups"], pointSources: ["Train troops", "Use training speedups", "Complete troop upgrades", "Unlock new units", "Enhance unit capabilities"] },
                { id: 3, name: "Tech Research", icon: "🔬", activities: ["Research completion", "Research speedups"], pointSources: ["Complete research", "Use research speedups", "Unlock new technologies", "Upgrade existing tech", "Finish research projects"] },
                { id: 4, name: "Drone Boost", icon: "🚁", activities: ["Stamina usage", "Drone activities"], pointSources: ["Use stamina for attacks", "Complete drone missions", "Gather drone data", "Battle elite enemies", "Use stamina items"] },
                { id: 5, name: "Hero Advancement", icon: "🦸", activities: ["Hero recruitment", "Hero EXP"], pointSources: ["Recruit new heroes", "Apply hero EXP", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"] }
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
                { vsday: 4, armsphase: "City Building", reason: "Building activities during hero training day.", points: 3200 },
                { vsday: 5, armsphase: "City Building", reason: "Building component of mobilization.", points: 4200 },
                { vsday: 5, armsphase: "Unit Progression", reason: "Training component of mobilization.", points: 3900 },
                { vsday: 5, armsphase: "Tech Research", reason: "Research component of mobilization.", points: 4100 },
                { vsday: 6, armsphase: "Unit Progression", reason: "Troop training for combat.", points: 3700 },
                { vsday: 6, armsphase: "City Building", reason: "Construction speedups for defenses.", points: 3400 }
            ]
        };
        
        this.settings = { timeFormat: "utc", detailLevel: "essential", viewScope: "week" };
        this.activeTab = "priority";
        this.activeFilter = "all";
        this.updateInterval = null;
        this.dropdownOpen = false;
        this.elements = {};
        this.eventListeners = [];
        
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
                }
            }
            
            this.loadServerSettings();
            this.setupEventListeners();
            this.setupTabNavigation();
            this.populateAllSections();
            this.updateAllDisplays();
            this.startUpdateLoop();
            this.isInitialized = true;
            
            console.log("Last War Nexus initialized successfully");
        } catch (error) {
            console.error("Initialization error:", error);
        }
    }
    
    cacheElements() {
        const elementIds = [
            'server-time', 'current-vs-day', 'arms-phase', 'countdown-timer', 'event-name', 'event-time',
            'progress-fill', 'strategy-rating', 'optimization-focus', 'time-remaining', 'priority-level', 
            'settings-toggle', 'settings-dropdown', 'server-toggle', 'server-dropdown', 'apply-server',
            'current-arms-phase', 'time-offset', 'current-phase-display', 'offset-display',
            'badge-label', 'next-priority-event', 'efficiency-level', 'current-action', 
            'next-priority-time', 'countdown-label', 'next-alignment-countdown', 'active-now', 'active-action',
            'priority-grid', 'schedule-grid', 'intelligence-content', 'priority-count'
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
        return foundCount >= 10;
    }

    setupEventListeners() {
        try {
            if (this.elements['server-toggle']) {
                this.elements['server-toggle'].addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleDropdown('server');
                });
            }

            if (this.elements['settings-toggle']) {
                this.elements['settings-toggle'].addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleDropdown('settings');
                });
            }

            if (this.elements['apply-server']) {
                this.elements['apply-server'].addEventListener('click', (e) => {
                    e.preventDefault();
                    this.applyServerSettings();
                });
            }

            if (this.elements['current-arms-phase']) {
                this.elements['current-arms-phase'].addEventListener('change', (e) => {
                    this.currentArmsPhase = e.target.value;
                    this.updateServerDisplay();
                    this.saveServerSettings();
                    this.updateAllDisplays();
                });
            }

            if (this.elements['time-offset']) {
                this.elements['time-offset'].addEventListener('change', (e) => {
                    this.timeOffset = parseInt(e.target.value, 10);
                    this.updateServerDisplay();
                    this.saveServerSettings();
                    this.updateAllDisplays();
                });
            }

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.settings-dropdown-container') && !e.target.closest('.server-dropdown-container')) {
                    this.closeDropdown();
                }
            });

        } catch (error) {
            console.error("Error setting up event listeners:", error);
        }
    }

    setupTabNavigation() {
        try {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const filterButtons = document.querySelectorAll('.filter-btn');

            tabButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const targetTab = e.currentTarget.getAttribute('data-tab');
                    this.switchTab(targetTab);
                });
            });

            filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const filter = e.currentTarget.getAttribute('data-filter');
                    this.setFilter(filter);
                });
            });
        } catch (error) {
            console.error("Error setting up tab navigation:", error);
        }
    }

    switchTab(tabName) {
        try {
            this.activeTab = tabName;
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-tab') === tabName) {
                    btn.classList.add('active');
                }
            });
            
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            const targetPanel = document.getElementById(`${tabName}-tab`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        } catch (error) {
            console.error("Error switching tab:", error);
        }
    }

    setFilter(filter) {
        try {
            this.activeFilter = filter;
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === filter) {
                    btn.classList.add('active');
                }
            });
            
            this.populatePriorityGrid();
        } catch (error) {
            console.error("Error setting filter:", error);
        }
    }

    // CORRECTED: Fixed 5-phase Arms Race logic (no Mixed Phase)
    getServerTime() {
        try {
            const now = new Date();
            
            if (!now || isNaN(now.getTime())) {
                console.error("Invalid base date");
                return new Date();
            }
            
            const offset = Number(this.timeOffset) || 0;
            if (!isFinite(offset)) {
                console.error("Invalid time offset");
                return now;
            }
            
            const serverTime = new Date(now.getTime() + (offset * 60 * 60 * 1000));
            
            if (!serverTime || isNaN(serverTime.getTime())) {
                console.error("Invalid server time calculation");
                return now;
            }
            
            return serverTime;
        } catch (error) {
            console.error("Error getting server time:", error);
            return new Date();
        }
    }

    // CORRECTED: Fixed Arms Race phase detection - 5 phases, not 6
    getCurrentArmsPhaseInfo() {
        try {
            const now = this.getServerTime();
            
            if (!now || isNaN(now.getTime())) {
                return { name: "City Building", index: 0, startHour: 0, nextStartHour: 4 };
            }
            
            const hour = now.getUTCHours();
            
            // FIXED: 5-phase cycle (City Building, Unit Progression, Tech Research, Drone Boost, Hero Advancement)
            // Each phase is 4 hours, cycle repeats every 20 hours
            const phaseIndex = Math.floor(hour / 4) % 5;
            const phases = ["City Building", "Unit Progression", "Tech Research", "Drone Boost", "Hero Advancement"];
            
            // Manual override if not auto
            if (this.currentArmsPhase !== "auto") {
                const manualPhase = this.data.armsracephases.find(p => p.name === this.currentArmsPhase);
                if (manualPhase) {
                    return {
                        name: manualPhase.name,
                        index: phaseIndex,
                        startHour: phaseIndex * 4,
                        nextStartHour: ((phaseIndex + 1) % 5) * 4
                    };
                }
            }
            
            const currentPhase = phases[phaseIndex];
            const phaseStartHour = phaseIndex * 4;
            const nextPhaseStartHour = ((phaseIndex + 1) % 5) * 4;
            
            return {
                name: currentPhase,
                index: phaseIndex,
                startHour: phaseStartHour,
                nextStartHour: nextPhaseStartHour === 0 ? 20 : nextPhaseStartHour // 20-hour cycle
            };
        } catch (error) {
            console.error("Error getting current arms phase:", error);
            return { name: "City Building", index: 0, startHour: 0, nextStartHour: 4 };
        }
    }

    getCurrentVSDayInfo() {
        try {
            const now = this.getServerTime();
            
            if (!now || isNaN(now.getTime())) {
                return { day: 0, name: "Sunday", title: "Preparation Day" };
            }
            
            const dayOfWeek = now.getUTCDay();
            const vsDayData = this.data.vsdays.find(day => day.day === dayOfWeek);
            
            return vsDayData || { day: 0, name: "Sunday", title: "Preparation Day" };
        } catch (error) {
            console.error("Error getting VS day:", error);
            return { day: 0, name: "Sunday", title: "Preparation Day" };
        }
    }

    isCurrentlyHighPriority() {
        try {
            const vsDayInfo = this.getCurrentVSDayInfo();
            const armsPhaseInfo = this.getCurrentArmsPhaseInfo();
            
            if (!vsDayInfo || !armsPhaseInfo) {
                return null;
            }
            
            const alignment = this.data.highpriorityalignments.find(a => 
                a.vsday === vsDayInfo.day && 
                a.armsphase === armsPhaseInfo.name
            );
            
            return alignment || null;
        } catch (error) {
            console.error("Error checking priority status:", error);
            return null;
        }
    }

    findNextPriorityWindow() {
        try {
            const now = this.getServerTime();
            
            if (!now || isNaN(now.getTime())) {
                console.error("Invalid server time in findNextPriorityWindow");
                return null;
            }
            
            let nearestWindow = null;
            let minTimeDiff = Infinity;
            
            // CORRECTED: Updated phase schedule for 5 phases
            const phaseSchedule = {
                "City Building": [0, 20], // Starts at hour 0 and repeats at hour 20
                "Unit Progression": [4],
                "Tech Research": [8],
                "Drone Boost": [12],
                "Hero Advancement": [16]
            };
            
            for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
                try {
                    const checkDate = new Date(now);
                    checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                    checkDate.setUTCHours(0, 0, 0, 0);
                    
                    if (!checkDate || isNaN(checkDate.getTime())) {
                        continue;
                    }
                    
                    const checkDay = checkDate.getUTCDay();
                    const vsDayData = this.data.vsdays.find(day => day.day === checkDay);
                    
                    if (!vsDayData) continue;
                    
                    const dayAlignments = this.data.highpriorityalignments.filter(a => a.vsday === checkDay);
                    
                    for (const alignment of dayAlignments) {
                        const phaseHours = phaseSchedule[alignment.armsphase] || [];
                        
                        for (const hour of phaseHours) {
                            try {
                                const windowTime = new Date(checkDate);
                                windowTime.setUTCHours(hour, 0, 0, 0);
                                
                                if (!windowTime || isNaN(windowTime.getTime())) {
                                    continue;
                                }
                                
                                const timeDiff = windowTime.getTime() - now.getTime();
                                
                                if (timeDiff > 0 && isFinite(timeDiff) && timeDiff < minTimeDiff) {
                                    minTimeDiff = timeDiff;
                                    nearestWindow = {
                                        startTime: windowTime,
                                        vsDay: checkDay,
                                        vsTitle: vsDayData.title,
                                        armsPhase: alignment.armsphase,
                                        reason: alignment.reason,
                                        points: alignment.points,
                                        timeToWindow: this.safeFormatTimeDifference(timeDiff),
                                        timeDiffMs: timeDiff
                                    };
                                }
                            } catch (innerError) {
                                console.warn("Error processing window time:", innerError);
                                continue;
                            }
                        }
                    }
                } catch (dayError) {
                    console.warn(`Error processing day offset ${dayOffset}:`, dayError);
                    continue;
                }
            }
            
            return nearestWindow;
        } catch (error) {
            console.error("Error finding next priority window:", error);
            return null;
        }
    }

    safeFormatTimeDifference(timeDiffMs) {
        try {
            if (timeDiffMs === null || timeDiffMs === undefined) {
                return "Calculating...";
            }
            
            const numDiff = Number(timeDiffMs);
            if (!isFinite(numDiff)) {
                return "Time Error";
            }
            
            if (numDiff < 0) {
                return "Starting Soon";
            }
            
            if (numDiff === 0) {
                return "Now";
            }
            
            const totalSeconds = Math.floor(numDiff / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            const days = Math.floor(totalHours / 24);
            
            const hours = totalHours % 24;
            const minutes = totalMinutes % 60;
            
            if (!isFinite(days) || !isFinite(hours) || !isFinite(minutes)) {
                return "Time Error";
            }
            
            if (days > 0) return `${days}d ${hours}h`;
            if (hours > 0) return `${hours}h ${minutes}m`;
            return `${Math.max(1, minutes)}m`;
        } catch (error) {
            console.error("Error formatting time difference:", error);
            return "Format Error";
        }
    }

    // CORRECTED: Fixed phase time calculation for 5-phase cycle
    calculateTimeUntilPhaseEnd() {
        try {
            const now = this.getServerTime();
            
            if (!now || isNaN(now.getTime())) {
                return "Error";
            }
            
            const currentHour = now.getUTCHours();
            const currentMinute = now.getUTCMinutes();
            const currentSecond = now.getUTCSeconds();
            
            if (!isFinite(currentHour) || !isFinite(currentMinute) || !isFinite(currentSecond)) {
                return "Error";
            }
            
            // FIXED: 5-phase cycle - phases start at 0, 4, 8, 12, 16, then repeat at 20
            const phaseStarts = [0, 4, 8, 12, 16, 20];
            let nextPhaseHour = 24; // Default to tomorrow's first phase
            
            for (const startHour of phaseStarts) {
                if (currentHour < startHour) {
                    nextPhaseHour = startHour;
                    break;
                }
            }
            
            let hoursToNext = nextPhaseHour - currentHour;
            let minutesToNext = -currentMinute;
            let secondsToNext = -currentSecond;
            
            if (secondsToNext < 0) {
                secondsToNext += 60;
                minutesToNext--;
            }
            
            if (minutesToNext < 0) {
                minutesToNext += 60;
                hoursToNext--;
            }
            
            if (hoursToNext <= 0) {
                hoursToNext += 24;
            }
            
            if (!isFinite(hoursToNext) || !isFinite(minutesToNext)) {
                return "Error";
            }
            
            hoursToNext = Math.max(0, hoursToNext);
            minutesToNext = Math.max(0, minutesToNext);
            
            if (hoursToNext > 0) {
                return `${hoursToNext}h ${minutesToNext}m`;
            } else {
                return `${Math.max(0, minutesToNext)}m`;
            }
        } catch (error) {
            console.error("Error calculating phase time:", error);
            return "Error";
        }
    }

    populateAllSections() {
        try {
            this.populatePriorityGrid();
            this.populateScheduleGrid();
            this.populateIntelligenceHub();
        } catch (error) {
            console.error("Error populating sections:", error);
        }
    }

    populatePriorityGrid() {
        try {
            const grid = this.elements['priority-grid'];
            if (!grid) return;

            let priorityWindows = this.generatePriorityWindows();
            
            if (this.activeFilter === 'active') {
                priorityWindows = priorityWindows.filter(w => w.isActive);
            } else if (this.activeFilter === 'upcoming') {
                priorityWindows = priorityWindows.filter(w => !w.isActive && w.timeToStart > 0);
            }

            if (this.elements['priority-count']) {
                this.elements['priority-count'].textContent = `${priorityWindows.length} Windows`;
            }

            grid.innerHTML = priorityWindows.map(window => `
                <div class="priority-window-card ${window.isActive ? 'active' : ''} ${window.isPeak ? 'peak' : ''}">
                    <div class="window-header">
                        <div class="window-time">${window.timeDisplay}</div>
                        <div class="window-status ${window.statusClass}">${window.status}</div>
                    </div>
                    <div class="window-content">
                        <div class="window-title">
                            <span class="window-icon">${window.icon}</span>
                            <span class="window-name">${window.armsPhase} + ${window.vsTitle}</span>
                        </div>
                        <div class="window-details">
                            <div class="points-potential">+${window.points.toLocaleString()} VS Points</div>
                            <div class="window-reason">${window.reason}</div>
                        </div>
                        <div class="window-actions">
                            ${window.activities.map(activity => `<span class="activity-tag">${activity}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error("Error populating priority grid:", error);
            if (this.elements['priority-grid']) {
                this.elements['priority-grid'].innerHTML = '<div class="error-message">Error loading priority windows</div>';
            }
        }
    }

    populateScheduleGrid() {
        try {
            const grid = this.elements['schedule-grid'];
            if (!grid) return;

            const scheduleData = this.generateWeeklySchedule();
            
            grid.innerHTML = `
                <div class="schedule-week">
                    ${scheduleData.map(day => `
                        <div class="schedule-day ${day.isToday ? 'today' : ''}">
                            <div class="day-header">
                                <h3>${day.name}</h3>
                                <div class="day-subtitle">${day.vsTitle}</div>
                            </div>
                            <div class="day-phases">
                                ${day.phases.map(phase => `
                                    <div class="phase-block ${phase.isPriority ? 'priority' : ''} ${phase.isActive ? 'active' : ''}">
                                        <div class="phase-time">${phase.timeRange}</div>
                                        <div class="phase-name">${phase.name}</div>
                                        <div class="phase-icon">${phase.icon}</div>
                                        ${phase.isPriority ? `<div class="priority-badge">HIGH</div>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        } catch (error) {
            console.error("Error populating schedule grid:", error);
            if (this.elements['schedule-grid']) {
                this.elements['schedule-grid'].innerHTML = '<div class="error-message">Error loading schedule</div>';
            }
        }
    }

    populateIntelligenceHub() {
        try {
            const hub = this.elements['intelligence-content'];
            if (!hub) return;

            const guides = this.generateIntelligenceGuides();
            
            hub.innerHTML = `
                <div class="intelligence-grid">
                    ${guides.map(guide => `
                        <div class="guide-card ${guide.featured ? 'featured' : ''}">
                            <div class="guide-header">
                                <div class="guide-icon">${guide.icon}</div>
                                <div class="guide-meta">
                                    <h3 class="guide-title">${guide.title}</h3>
                                    <div class="guide-category">${guide.category}</div>
                                </div>
                                <div class="guide-rating">${guide.rating}</div>
                            </div>
                            <div class="guide-content">
                                <p class="guide-description">${guide.description}</p>
                                <div class="guide-stats">
                                    <span class="stat">⚡ ${guide.efficiency}x Efficiency</span>
                                    <span class="stat">🎯 ${guide.points}+ Points</span>
                                    <span class="stat">⏱️ ${guide.timeframe}</span>
                                </div>
                            </div>
                            <div class="guide-footer">
                                <div class="guide-tags">
                                    ${guide.tags.map(tag => `<span class="guide-tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

        } catch (error) {
            console.error("Error populating intelligence hub:", error);
            if (this.elements['intelligence-content']) {
                this.elements['intelligence-content'].innerHTML = '<div class="error-message">Error loading guides</div>';
            }
        }
    }

    generatePriorityWindows() {
        try {
            const now = this.getServerTime();
            const windows = [];
            
            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                const checkDate = new Date(now);
                checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                
                const dayOfWeek = checkDate.getUTCDay();
                const vsDay = this.data.vsdays.find(d => d.day === dayOfWeek);
                
                if (!vsDay) continue;
                
                const alignments = this.data.highpriorityalignments.filter(a => a.vsday === dayOfWeek);
                
                for (const alignment of alignments) {
                    const phase = this.data.armsracephases.find(p => p.name === alignment.armsphase);
                    const phaseHours = this.getPhaseHours(alignment.armsphase);
                    
                    for (const hour of phaseHours) {
                        const windowTime = new Date(checkDate);
                        windowTime.setUTCHours(hour, 0, 0, 0);
                        
                        const timeDiff = windowTime.getTime() - now.getTime();
                        const isActive = Math.abs(timeDiff) < (4 * 60 * 60 * 1000) && timeDiff > -(4 * 60 * 60 * 1000);
                        
                        windows.push({
                            time: windowTime,
                            timeToStart: timeDiff,
                            timeDisplay: this.formatTimeToWindow(timeDiff),
                            armsPhase: alignment.armsphase,
                            vsTitle: vsDay.title,
                            points: alignment.points,
                            reason: alignment.reason,
                            isActive: isActive,
                            isPeak: alignment.points >= 3800,
                            status: isActive ? 'ACTIVE NOW' : timeDiff > 0 ? 'UPCOMING' : 'COMPLETED',
                            statusClass: isActive ? 'active' : timeDiff > 0 ? 'upcoming' : 'completed',
                            icon: phase ? phase.icon : '⚡',
                            activities: phase ? phase.activities : []
                        });
                    }
                }
            }
            
            return windows.sort((a, b) => a.timeToStart - b.timeToStart);
        } catch (error) {
            console.error("Error generating priority windows:", error);
            return [];
        }
    }

    generateWeeklySchedule() {
        try {
            const schedule = [];
            const now = this.getServerTime();
            
            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                const checkDate = new Date(now);
                checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                
                const dayOfWeek = checkDate.getUTCDay();
                const vsDay = this.data.vsdays.find(d => d.day === dayOfWeek);
                const isToday = dayOffset === 0;
                
                const phases = [];
                // CORRECTED: 5-phase schedule
                const phaseHours = [0, 4, 8, 12, 16, 20];
                const phaseNames = ["City Building", "Unit Progression", "Tech Research", "Drone Boost", "Hero Advancement", "City Building"];
                
                for (let i = 0; i < phaseHours.length; i++) {
                    const hour = phaseHours[i];
                    const nextHour = phaseHours[i + 1] || 24;
                    const phaseName = phaseNames[i];
                    const phase = this.data.armsracephases.find(p => p.name === phaseName);
                    
                    const isPriority = this.data.highpriorityalignments.some(a => 
                        a.vsday === dayOfWeek && a.armsphase === phaseName
                    );
                    
                    const phaseTime = new Date(checkDate);
                    phaseTime.setUTCHours(hour, 0, 0, 0);
                    const isActive = isToday && now.getUTCHours() >= hour && now.getUTCHours() < nextHour;
                    
                    phases.push({
                        name: phaseName,
                        icon: phase ? phase.icon : '⚡',
                        timeRange: `${String(hour).padStart(2, '0')}:00-${String(nextHour).padStart(2, '0')}:00`,
                        isPriority: isPriority,
                        isActive: isActive
                    });
                }
                
                schedule.push({
                    name: vsDay ? vsDay.name : 'Unknown',
                    vsTitle: vsDay ? vsDay.title : 'Unknown Day',
                    isToday: isToday,
                    phases: phases
                });
            }
            
            return schedule;
        } catch (error) {
            console.error("Error generating weekly schedule:", error);
            return [];
        }
    }

    generateIntelligenceGuides() {
        return [
            {
                title: "Perfect Timing Strategy",
                category: "VS Points",
                icon: "🎯",
                rating: "S+",
                featured: true,
                description: "Master the art of dual-event alignment for maximum point generation during high-priority windows.",
                efficiency: "4",
                points: "4200",
                timeframe: "4 hours",
                tags: ["Essential", "High Priority", "Advanced"]
            },
            {
                title: "Resource Management",
                category: "Optimization",
                icon: "💎",
                rating: "S",
                featured: false,
                description: "Efficiently manage speedups, resources, and activities to maximize both events simultaneously.",
                efficiency: "3",
                points: "3500",
                timeframe: "Daily",
                tags: ["Resource", "Planning", "Efficiency"]
            },
            {
                title: "Alliance Coordination",
                category: "Teamwork",
                icon: "🤝",
                rating: "A+",
                featured: false,
                description: "Coordinate with alliance members to maximize collective VS points during peak efficiency windows.",
                efficiency: "2.5",
                points: "3000",
                timeframe: "Weekly",
                tags: ["Alliance", "Coordination", "Strategy"]
            },
            {
                title: "Phase Transition Timing",
                category: "Timing",
                icon: "⏰",
                rating: "A",
                featured: false,
                description: "Learn the optimal timing for activities around Arms Race phase transitions for maximum benefit.",
                efficiency: "2",
                points: "2500",
                timeframe: "4 hours",
                tags: ["Timing", "Transitions", "Planning"]
            }
        ];
    }

    // CORRECTED: Phase hours for 5-phase system
    getPhaseHours(phaseName) {
        const phaseMap = {
            "City Building": [0, 20], // Appears twice in 24h cycle
            "Unit Progression": [4],
            "Tech Research": [8],
            "Drone Boost": [12],
            "Hero Advancement": [16]
        };
        return phaseMap[phaseName] || [0];
    }

    formatTimeToWindow(timeDiff) {
        try {
            if (Math.abs(timeDiff) < 60000) return "Now";
            
            const absTimeDiff = Math.abs(timeDiff);
            const hours = Math.floor(absTimeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((absTimeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (timeDiff < 0) {
                return hours > 0 ? `${hours}h ${minutes}m ago` : `${minutes}m ago`;
            } else {
                return hours > 0 ? `in ${hours}h ${minutes}m` : `in ${minutes}m`;
            }
        } catch (error) {
            return "Unknown";
        }
    }

    updateCurrentStatus() {
        try {
            const now = this.getServerTime();
            
            if (!now || isNaN(now.getTime())) {
                this.setFallbackDisplay("Time Error");
                return;
            }

            const currentVSDay = this.getCurrentVSDayInfo();
            const currentArmsPhase = this.getCurrentArmsPhaseInfo();
            
            if (!currentVSDay || !currentArmsPhase) {
                this.setFallbackDisplay("Data Loading");
                return;
            }
            
            const activeAlignment = this.isCurrentlyHighPriority();
            
            if (activeAlignment) {
                this.displayActiveAlignment(activeAlignment, currentArmsPhase, currentVSDay);
            } else {
                this.displayNextWindow();
            }

            this.updateBasicInfo(currentVSDay, currentArmsPhase);

        } catch (error) {
            console.error("Error in updateCurrentStatus:", error);
            this.setFallbackDisplay("System Error");
        }
    }

    displayActiveAlignment(alignment, armsPhase, vsDay) {
        try {
            this.safeUpdateElement('active-now', 'style', { display: 'flex' });
            this.safeUpdateElement('badge-label', 'textContent', 'PEAK EFFICIENCY ACTIVE');
            this.safeUpdateElement('next-priority-event', 'textContent', `${armsPhase.name} + ${vsDay.title}`);
            this.safeUpdateElement('efficiency-level', 'textContent', 'High');
            this.safeUpdateElement('current-action', 'textContent', `⚡ Use speedups now! ${alignment.reason}`);
            
            const timeRemaining = this.calculateTimeUntilPhaseEnd();
            this.safeUpdateElement('next-priority-time', 'textContent', timeRemaining);
            this.safeUpdateElement('countdown-label', 'textContent', 'PHASE ENDS IN');
            
            if (this.elements['active-action']) {
                this.elements['active-action'].textContent = `Use speedups now! Peak efficiency active.`;
            }
        } catch (error) {
            console.error("Error displaying active alignment:", error);
            this.setFallbackDisplay("Display Error");
        }
    }

    displayNextWindow() {
        try {
            this.safeUpdateElement('active-now', 'style', { display: 'none' });
            
            const nextWindow = this.findNextPriorityWindow();
            
            if (nextWindow && nextWindow.timeToWindow && 
                nextWindow.timeToWindow !== "Error" && 
                nextWindow.timeToWindow !== "Calculating..." &&
                nextWindow.timeToWindow !== "Format Error" &&
                nextWindow.timeToWindow !== "Time Error") {
                
                this.safeUpdateElement('badge-label', 'textContent', 'NEXT HIGH PRIORITY');
                this.safeUpdateElement('next-priority-event', 'textContent', `${nextWindow.armsPhase} + ${nextWindow.vsTitle}`);
                this.safeUpdateElement('efficiency-level', 'textContent', 'High');
                this.safeUpdateElement('current-action', 'textContent', `Save resources! ${nextWindow.reason}`);
                this.safeUpdateElement('next-priority-time', 'textContent', nextWindow.timeToWindow);
                this.safeUpdateElement('countdown-label', 'textContent', 'TIME REMAINING');
            } else {
                const currentArmsPhase = this.getCurrentArmsPhaseInfo();
                this.safeUpdateElement('badge-label', 'textContent', 'NORMAL PHASE');
                this.safeUpdateElement('next-priority-event', 'textContent', `${currentArmsPhase.name} Phase`);
                this.safeUpdateElement('efficiency-level', 'textContent', 'Medium');
                this.safeUpdateElement('current-action', 'textContent', 'Focus on daily activities - Save speedups for priority windows');
                
                const timeToNextPhase = this.calculateTimeUntilPhaseEnd();
                this.safeUpdateElement('next-priority-time', 'textContent', timeToNextPhase);
                this.safeUpdateElement('countdown-label', 'textContent', 'PHASE CHANGES IN');
            }
        } catch (error) {
            console.error("Error displaying next window:", error);
            this.setFallbackDisplay("Display Error");
        }
    }

    safeUpdateElement(elementId, property, value) {
        try {
            let element = this.elements[elementId] || document.getElementById(elementId);
            if (!element) {
                console.warn(`Element not found: ${elementId}`);
                return;
            }
            
            this.elements[elementId] = element;
            
            if (property === 'textContent') {
                let textValue = value;
                if (textValue === null || textValue === undefined) {
                    textValue = 'Loading...';
                } else if (typeof textValue === 'number' && !isFinite(textValue)) {
                    textValue = 'Error';
                } else {
                    textValue = String(textValue);
                }
                
                if (textValue.includes('NaN')) {
                    textValue = 'Calculating...';
                }
                
                element.textContent = textValue;
            } else if (property === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element[property] = value;
            }
        } catch (error) {
            console.warn(`Error updating ${elementId}:`, error);
        }
    }

    updateBasicInfo(vsDay, armsPhase) {
        try {
            this.safeUpdateElement('current-vs-day', 'textContent', vsDay.title || 'Loading...');
            this.safeUpdateElement('arms-phase', 'textContent', armsPhase.name || 'Loading...');
            
            const nextChangeTime = this.calculateTimeUntilPhaseEnd();
            this.safeUpdateElement('next-alignment-countdown', 'textContent', nextChangeTime);
        } catch (error) {
            console.error("Error updating basic info:", error);
        }
    }

    setFallbackDisplay(message) {
        try {
            this.safeUpdateElement('next-priority-time', 'textContent', 'Loading...');
            this.safeUpdateElement('countdown-label', 'textContent', 'CALCULATING');
            this.safeUpdateElement('next-priority-event', 'textContent', message || 'System Loading');
            this.safeUpdateElement('current-action', 'textContent', 'System initializing...');
            this.safeUpdateElement('efficiency-level', 'textContent', 'Loading');
            this.safeUpdateElement('active-now', 'style', { display: 'none' });
        } catch (error) {
            console.error("Error setting fallback display:", error);
        }
    }

    loadServerSettings() {
        try {
            const saved = localStorage.getItem('lwn-server-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.currentArmsPhase = settings.currentArmsPhase || "auto";
                this.timeOffset = Number(settings.timeOffset) || 0;
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
                timeOffset: Number(this.timeOffset) || 0
            };
            localStorage.setItem('lwn-server-settings', JSON.stringify(settings));
        } catch (error) {
            console.error("Error saving server settings:", error);
        }
    }

    applyServerSettings() {
        try {
            if (this.elements['current-arms-phase']) {
                this.currentArmsPhase = this.elements['current-arms-phase'].value;
            }
            if (this.elements['time-offset']) {
                this.timeOffset = parseInt(this.elements['time-offset'].value, 10) || 0;
            }
            this.updateServerDisplay();
            this.saveServerSettings();
            this.closeDropdown();
            this.updateAllDisplays();
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
            const currentPhase = this.getCurrentArmsPhaseInfo();
            this.elements['current-phase-display'].textContent = currentPhase.name;
        }
        if (this.elements['offset-display']) {
            const offsetText = this.timeOffset >= 0 ? `UTC +${this.timeOffset}` : `UTC ${this.timeOffset}`;
            this.elements['offset-display'].textContent = offsetText;
        }
    }

    toggleDropdown(type) {
        try {
            if (type === 'server') {
                const dropdown = this.elements['server-dropdown'];
                const toggle = this.elements['server-toggle'];
                if (dropdown && toggle) {
                    const isOpen = dropdown.classList.contains('show');
                    dropdown.classList.toggle('show', !isOpen);
                    toggle.classList.toggle('active', !isOpen);
                }
            }
            if (type === 'settings') {
                const dropdown = this.elements['settings-dropdown'];
                const toggle = this.elements['settings-toggle'];
                if (dropdown && toggle) {
                    const isOpen = dropdown.classList.contains('show');
                    dropdown.classList.toggle('show', !isOpen);
                    toggle.classList.toggle('active', !isOpen);
                }
            }
        } catch (error) {
            console.error("Error toggling dropdown:", error);
        }
    }

    closeDropdown() {
        try {
            ['server-dropdown', 'settings-dropdown'].forEach(id => {
                if (this.elements[id]) {
                    this.elements[id].classList.remove('show');
                }
            });
            ['server-toggle', 'settings-toggle'].forEach(id => {
                if (this.elements[id]) {
                    this.elements[id].classList.remove('active');
                }
            });
        } catch (error) {
            console.error("Error closing dropdown:", error);
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
        } catch (error) {
            console.error("Error updating displays:", error);
        }
    }

    updateServerTime() {
        try {
            const serverTime = this.getServerTime();
            if (serverTime && !isNaN(serverTime.getTime())) {
                const timeString = serverTime.toUTCString().slice(17, 25);
                this.safeUpdateElement('server-time', 'textContent', timeString);
            }
        } catch (error) {
            console.error("Error updating server time:", error);
        }
    }




    // CORRECTED: Fixed countdown for 5-phase cycle
    updateCountdown() {
        try {
            const now = this.getServerTime();
            if (!now || isNaN(now.getTime())) return;
            
            const currentHour = now.getUTCHours();
            
            // FIXED: 5-phase schedule with 6 transitions per day
            const phaseStarts = [0, 4, 8, 12, 16, 20];
            let nextPhaseStart = 24;
            
            for (const start of phaseStarts) {
                if (currentHour < start) {
                    nextPhaseStart = start;
                    break;
                }
            }
            
            const nextPhaseTime = new Date(now);
            if (nextPhaseStart === 24) {
                nextPhaseTime.setUTCDate(now.getUTCDate() + 1);
                nextPhaseTime.setUTCHours(0, 0, 0, 0);
            } else {
                nextPhaseTime.setUTCHours(nextPhaseStart, 0, 0, 0);
            }
            
            const timeDiff = nextPhaseTime.getTime() - now.getTime();
            if (timeDiff > 0 && isFinite(timeDiff)) {
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                
                const countdownText = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
                this.safeUpdateElement('countdown-timer', 'textContent', countdownText);
                
                // CORRECTED: Map to correct next phase in 5-phase cycle
                const phaseNames = ["City Building", "Unit Progression", "Tech Research", "Drone Boost", "Hero Advancement", "City Building"];
                const nextPhaseIndex = phaseStarts.indexOf(nextPhaseStart);
                const nextPhase = this.data.armsracephases.find(p => p.name === phaseNames[nextPhaseIndex]) || this.data.armsracephases[0];
                
                this.safeUpdateElement('event-name', 'textContent', `${nextPhase.name} Phase`);
                
                const timeString = nextPhaseStart === 24 ? "00:00" : String(nextPhaseStart).padStart(2, '0') + ":00";
                this.safeUpdateElement('event-time', 'textContent', `${timeString} Server Time`);
            }
            
        } catch (error) {
            console.error("Error updating countdown:", error);
        }
    }
}

// ADD THESE METHODS TO YOUR LastWarNexus CLASS

setupBanner() {
    try {
        const bannerElement = document.getElementById('priority-banner');
        const closeButton = document.getElementById('banner-close');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideBanner();
                // Hide for 1 hour
                localStorage.setItem('banner-hidden-until', Date.now() + (60 * 60 * 1000));
            });
        }
        
        // Check if banner should be hidden
        const hiddenUntil = localStorage.getItem('banner-hidden-until');
        if (hiddenUntil && Date.now() < parseInt(hiddenUntil)) {
            this.hideBanner();
        }
        
    } catch (error) {
        console.error("Error setting up banner:", error);
    }
}

updateBanner() {
    try {
        const banner = document.getElementById('priority-banner');
        if (!banner) return;
        
        const activeAlignment = this.isCurrentlyHighPriority();
        const nextWindow = this.findNextPriorityWindow();
        
        // Check if banner is manually hidden
        const hiddenUntil = localStorage.getItem('banner-hidden-until');
        if (hiddenUntil && Date.now() < parseInt(hiddenUntil)) {
            this.hideBanner();
            return;
        }
        
        if (activeAlignment) {
            // Show active high priority banner
            const currentArmsPhase = this.getCurrentArmsPhaseInfo();
            const currentVSDay = this.getCurrentVSDayInfo();
            const timeRemaining = this.calculateTimeUntilPhaseEnd();
            
            this.safeUpdateElement('banner-title', 'textContent', 'Peak Efficiency Active!');
            this.safeUpdateElement('banner-subtitle', 'textContent', `${currentArmsPhase.name} + ${currentVSDay.title} - Use speedups now!`);
            this.safeUpdateElement('banner-time', 'textContent', timeRemaining);
            
            banner.className = 'priority-banner peak-priority show';
            
        } else if (nextWindow && nextWindow.timeDiffMs && nextWindow.timeDiffMs < (2 * 60 * 60 * 1000)) {
            // Show upcoming priority banner (within 2 hours)
            this.safeUpdateElement('banner-title', 'textContent', 'High Priority Soon');
            this.safeUpdateElement('banner-subtitle', 'textContent', `${nextWindow.armsPhase} + ${nextWindow.vsTitle} starting soon`);
            this.safeUpdateElement('banner-time', 'textContent', nextWindow.timeToWindow);
            
            banner.className = 'priority-banner high-priority show';
            
        } else {
            // Hide banner when no priority events
            this.hideBanner();
        }
        
    } catch (error) {
        console.error("Error updating banner:", error);
    }
}

showBanner() {
    try {
        const banner = document.getElementById('priority-banner');
        if (banner) {
            banner.classList.add('show');
            banner.classList.remove('hidden');
        }
    } catch (error) {
        console.error("Error showing banner:", error);
    }
}

hideBanner() {
    try {
        const banner = document.getElementById('priority-banner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hidden');
        }
    } catch (error) {
        console.error("Error hiding banner:", error);
    }
}

// UPDATE YOUR EXISTING init() METHOD TO INCLUDE:
init() {
    try {
        this.initializationAttempts++;
        console.log(`Initialization attempt ${this.initializationAttempts}`);
        
        if (!this.cacheElements()) {
            if (this.initializationAttempts < this.maxInitAttempts) {
                setTimeout(() => this.init(), 200);
                return;
            }
        }
        
        this.loadServerSettings();
        this.setupEventListeners();
        this.setupTabNavigation();
        this.setupBanner(); // ADD THIS LINE
        this.populateAllSections();
        this.updateAllDisplays();
        this.startUpdateLoop();
        this.isInitialized = true;
        
        console.log("Last War Nexus initialized successfully");
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

// UPDATE YOUR EXISTING updateAllDisplays() METHOD TO INCLUDE:
updateAllDisplays() {
    try {
        this.updateServerTime();
        this.updateCurrentStatus();
        this.updateCountdown();
        this.updateBanner(); // ADD THIS LINE
    } catch (error) {
        console.error("Error updating displays:", error);
    }
}

// ADD 'priority-banner' TO YOUR cacheElements() METHOD:
cacheElements() {
    const elementIds = [
        'server-time', 'current-vs-day', 'arms-phase', 'countdown-timer', 'event-name', 'event-time',
        'progress-fill', 'strategy-rating', 'optimization-focus', 'time-remaining', 'priority-level', 
        'settings-toggle', 'settings-dropdown', 'server-toggle', 'server-dropdown', 'apply-server',
        'current-arms-phase', 'time-offset', 'current-phase-display', 'offset-display',
        'badge-label', 'next-priority-event', 'efficiency-level', 'current-action', 
        'next-priority-time', 'countdown-label', 'next-alignment-countdown', 'active-now', 'active-action',
        'priority-grid', 'schedule-grid', 'intelligence-content', 'priority-count',
        'priority-banner', 'banner-title', 'banner-subtitle', 'banner-time', 'banner-close' // ADD THESE
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
    return foundCount >= 10;
}


document.addEventListener('DOMContentLoaded', () => {
    new LastWarNexus();
});
