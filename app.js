class LastWarNexus {
    constructor() {
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 5;
        
        // FIXED: Default to "auto" instead of hardcoded phase
        this.currentArmsPhase = "auto";
        this.timeOffset = 0;
        
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
            'next-priority-time', 'countdown-label', 'next-alignment-countdown', 'active-now', 'active-action'
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

    // COMPLETELY FIXED SERVER TIME METHOD
    getServerTime() {
        try {
            const now = new Date();
            
            // Validate base date
            if (!now || isNaN(now.getTime())) {
                console.error("Invalid base date");
                return new Date();
            }
            
            // Validate time offset
            const offset = Number(this.timeOffset) || 0;
            if (!isFinite(offset)) {
                console.error("Invalid time offset");
                return now;
            }
            
            const serverTime = new Date(now.getTime() + (offset * 60 * 60 * 1000));
            
            // Validate result
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

    // COMPLETELY REWRITTEN ARMS PHASE DETECTION
    getCurrentArmsPhaseInfo() {
        try {
            const now = this.getServerTime();
            
            // Validate time
            if (!now || isNaN(now.getTime())) {
                return { name: "Mixed Phase", index: 0, startHour: 0, nextStartHour: 4 };
            }
            
            const hour = now.getUTCHours();
            
            // Fixed phase schedule - every 4 hours starting at 0
            const phaseIndex = Math.floor(hour / 4);
            const phases = ["Mixed Phase", "Drone Boost", "City Building", "Tech Research", "Hero Advancement", "Unit Progression"];
            
            // Manual override if not auto
            if (this.currentArmsPhase !== "auto") {
                const manualPhase = this.data.armsracephases.find(p => p.name === this.currentArmsPhase);
                if (manualPhase) {
                    return {
                        name: manualPhase.name,
                        index: phaseIndex,
                        startHour: phaseIndex * 4,
                        nextStartHour: ((phaseIndex + 1) % 6) * 4 || 24
                    };
                }
            }
            
            const currentPhase = phases[phaseIndex % phases.length] || "Mixed Phase";
            const phaseStartHour = phaseIndex * 4;
            const nextPhaseStartHour = ((phaseIndex + 1) % 6) * 4;
            
            return {
                name: currentPhase,
                index: phaseIndex,
                startHour: phaseStartHour,
                nextStartHour: nextPhaseStartHour === 0 ? 24 : nextPhaseStartHour
            };
        } catch (error) {
            console.error("Error getting current arms phase:", error);
            return { name: "Mixed Phase", index: 0, startHour: 0, nextStartHour: 4 };
        }
    }

    // FIXED VS DAY DETECTION
    getCurrentVSDayInfo() {
        try {
            const now = this.getServerTime();
            
            if (!now || isNaN(now.getTime())) {
                return { day: 0, name: "Sunday", title: "Preparation Day" };
            }
            
            const dayOfWeek = now.getUTCDay(); // Sunday=0, Monday=1, etc.
            const vsDayData = this.data.vsdays.find(day => day.day === dayOfWeek);
            
            return vsDayData || { day: 0, name: "Sunday", title: "Preparation Day" };
        } catch (error) {
            console.error("Error getting VS day:", error);
            return { day: 0, name: "Sunday", title: "Preparation Day" };
        }
    }

    // FIXED PRIORITY DETECTION  
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

    // COMPLETELY REWRITTEN NEXT PRIORITY WINDOW FINDER
    findNextPriorityWindow() {
        try {
            const now = this.getServerTime();
            
            if (!now || isNaN(now.getTime())) {
                console.error("Invalid server time in findNextPriorityWindow");
                return null;
            }
            
            let nearestWindow = null;
            let minTimeDiff = Infinity;
            
            // Fixed phase schedule mapping
            const phaseSchedule = {
                "Mixed Phase": [0],
                "Drone Boost": [4], 
                "City Building": [8],
                "Tech Research": [12],
                "Hero Advancement": [16],
                "Unit Progression": [20]
            };
            
            // Check next 14 days
            for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
                try {
                    const checkDate = new Date(now);
                    checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                    checkDate.setUTCHours(0, 0, 0, 0);
                    
                    // Validate check date
                    if (!checkDate || isNaN(checkDate.getTime())) {
                        continue;
                    }
                    
                    const checkDay = checkDate.getUTCDay();
                    const vsDayData = this.data.vsdays.find(day => day.day === checkDay);
                    
                    if (!vsDayData) continue;
                    
                    // Find all high priority alignments for this VS day
                    const dayAlignments = this.data.highpriorityalignments.filter(a => a.vsday === checkDay);
                    
                    for (const alignment of dayAlignments) {
                        const phaseHours = phaseSchedule[alignment.armsphase] || [];
                        
                        for (const hour of phaseHours) {
                            try {
                                const windowTime = new Date(checkDate);
                                windowTime.setUTCHours(hour, 0, 0, 0);
                                
                                // Validate window time
                                if (!windowTime || isNaN(windowTime.getTime())) {
                                    continue;
                                }
                                
                                const timeDiff = windowTime.getTime() - now.getTime();
                                
                                // Only consider future windows and validate timeDiff
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

    // BULLETPROOF TIME FORMATTING
    safeFormatTimeDifference(timeDiffMs) {
        try {
            // Validate input
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
            
            // Validate calculated values
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

    // FIXED PHASE TIME CALCULATION
    calculateTimeUntilPhaseEnd() {
        try {
            const now = this.getServerTime();
            
            if (!now || isNaN(now.getTime())) {
                return "Error";
            }
            
            const currentHour = now.getUTCHours();
            const currentMinute = now.getUTCMinutes();
            const currentSecond = now.getUTCSeconds();
            
            // Validate time components
            if (!isFinite(currentHour) || !isFinite(currentMinute) || !isFinite(currentSecond)) {
                return "Error";
            }
            
            // Find next phase start time (phases start at 0, 4, 8, 12, 16, 20)
            const phaseStarts = [0, 4, 8, 12, 16, 20];
            let nextPhaseHour = 24; // Default to tomorrow's first phase
            
            for (const startHour of phaseStarts) {
                if (currentHour < startHour) {
                    nextPhaseHour = startHour;
                    break;
                }
            }
            
            // Calculate time difference
            let hoursToNext = nextPhaseHour - currentHour;
            let minutesToNext = -currentMinute;
            let secondsToNext = -currentSecond;
            
            // Adjust for negative seconds
            if (secondsToNext < 0) {
                secondsToNext += 60;
                minutesToNext--;
            }
            
            // Adjust for negative minutes
            if (minutesToNext < 0) {
                minutesToNext += 60;
                hoursToNext--;
            }
            
            // Adjust for negative hours (next day)
            if (hoursToNext <= 0) {
                hoursToNext += 24;
            }
            
            // Validate final values
            if (!isFinite(hoursToNext) || !isFinite(minutesToNext)) {
                return "Error";
            }
            
            // Ensure positive values
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

    // MAIN UPDATE METHOD WITH BETTER ERROR HANDLING
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
            
            // Check if we're currently in a high priority window
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

    // IMPROVED ACTIVE ALIGNMENT DISPLAY
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

    // IMPROVED NEXT WINDOW DISPLAY
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
                // Fallback to showing next phase change
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

    // SAFE UPDATE ELEMENT METHOD
    safeUpdateElement(elementId, property, value) {
        try {
            let element = this.elements[elementId] || document.getElementById(elementId);
            if (!element) {
                console.warn(`Element not found: ${elementId}`);
                return;
            }
            
            this.elements[elementId] = element;
            
            if (property === 'textContent') {
                // Ensure we never set NaN or undefined text
                let textValue = value;
                if (textValue === null || textValue === undefined) {
                    textValue = 'Loading...';
                } else if (typeof textValue === 'number' && !isFinite(textValue)) {
                    textValue = 'Error';
                } else {
                    textValue = String(textValue);
                }
                
                // Check for NaN in the string
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

    // IMPROVED BASIC INFO UPDATE
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

    // IMPROVED FALLBACK DISPLAY
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

    // Existing methods remain the same but with improved error handling...
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

    updateCountdown() {
        try {
            const now = this.getServerTime();
            if (!now || isNaN(now.getTime())) return;
            
            const currentHour = now.getUTCHours();
            
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
                
                const nextPhaseIndex = Math.floor(nextPhaseStart / 4) % this.data.armsracephases.length;
                const nextPhase = this.data.armsracephases[nextPhaseIndex];
                this.safeUpdateElement('event-name', 'textContent', `${nextPhase.name} Phase`);
                
                const timeString = nextPhaseStart === 24 ? "00:00" : String(nextPhaseStart).padStart(2, '0') + ":00";
                this.safeUpdateElement('event-time', 'textContent', `${timeString} Server Time`);
            }
            
        } catch (error) {
            console.error("Error updating countdown:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LastWarNexus();
});
