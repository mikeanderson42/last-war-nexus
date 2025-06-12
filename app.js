<div style="max-height: 400px; overflow-y: auto; border: 1px solid #333; background: #1a1a1a; padding: 10px; font-family: monospace; font-size: 11px;">
class LastWarNexus {
    constructor() {
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 5;
        
        this.currentArmsPhase = "City Building";
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

    updateCurrentStatus() {
        try {
            const now = this.getServerTime();
            if (!now || isNaN(now.getTime())) {
                this.setFallbackDisplay("Time Error");
                return;
            }

            const utcDay = now.getUTCDay();
            const utcHour = now.getUTCHours();
            
            const currentVSDay = this.data.vsdays.find(day => day.day === utcDay);
            const currentArmsPhase = this.data.armsracephases.find(phase => phase.name === this.currentArmsPhase);
            
            if (!currentVSDay || !currentArmsPhase) {
                this.setFallbackDisplay("Data Loading");
                return;
            }
            
            console.log(`Current: ${currentVSDay.title} + ${currentArmsPhase.name}`);
            
            const alignment = this.data.highpriorityalignments.find(a => 
                a.vsday === utcDay && a.armsphase === currentArmsPhase.name
            );

            if (alignment) {
                this.displayActiveAlignment(alignment, currentArmsPhase, currentVSDay);
            } else {
                this.displayNextWindow(currentArmsPhase, currentVSDay);
            }

            this.updateBasicInfo(currentVSDay, currentArmsPhase);

        } catch (error) {
            console.error("Error in updateCurrentStatus:", error);
            this.setFallbackDisplay("System Error");
        }
    }

    displayActiveAlignment(alignment, armsPhase, vsDay) {
        try {
            this.updateElement('active-now', 'style', { display: 'flex' });
            this.updateElement('badge-label', 'textContent', 'PEAK EFFICIENCY ACTIVE');
            this.updateElement('next-priority-event', 'textContent', `${armsPhase.name} + ${vsDay.title}`);
            this.updateElement('efficiency-level', 'textContent', 'High');
            this.updateElement('current-action', 'textContent', `⚡ Use speedups now! ${alignment.reason}`);
            
            const timeRemaining = this.calculatePhaseTimeRemaining();
            this.updateElement('next-priority-time', 'textContent', timeRemaining);
            this.updateElement('countdown-label', 'textContent', 'PHASE ENDS IN');
            
            if (this.elements['active-action']) {
                this.elements['active-action'].textContent = `Use ${armsPhase.activities[0]} speedups now!`;
            }
        } catch (error) {
            console.error("Error displaying active alignment:", error);
        }
    }

    displayNextWindow(armsPhase, vsDay) {
        try {
            this.updateElement('active-now', 'style', { display: 'none' });
            
            const nextWindow = this.findNextPriorityWindow();
            
            if (nextWindow) {
                this.updateElement('badge-label', 'textContent', 'NEXT HIGH PRIORITY');
                this.updateElement('next-priority-event', 'textContent', `${nextWindow.armsPhase} + ${nextWindow.vsTitle}`);
                this.updateElement('efficiency-level', 'textContent', 'High');
                this.updateElement('current-action', 'textContent', `Save resources! ${nextWindow.reason}`);
                this.updateElement('next-priority-time', 'textContent', nextWindow.timeToWindow);
                this.updateElement('countdown-label', 'textContent', 'TIME REMAINING');
            } else {
                this.updateElement('badge-label', 'textContent', 'NORMAL PHASE');
                this.updateElement('next-priority-event', 'textContent', `${armsPhase.name} Phase`);
                this.updateElement('efficiency-level', 'textContent', 'Medium');
                this.updateElement('current-action', 'textContent', `Focus on ${armsPhase.activities[0]} - Save speedups for priority windows`);
                
                const timeRemaining = this.calculatePhaseTimeRemaining();
                this.updateElement('next-priority-time', 'textContent', timeRemaining);
                this.updateElement('countdown-label', 'textContent', 'PHASE CHANGES IN');
            }
        } catch (error) {
            console.error("Error displaying next window:", error);
        }
    }

    findNextPriorityWindow() {
        try {
            const now = this.getServerTime();
            if (!now) return null;
            
            const currentUTCDay = now.getUTCDay();
            let nearestWindow = null;
            let minTimeDiff = Infinity;
            
            const phaseSchedule = {
                "Mixed Phase": [0], "Drone Boost": [4], "City Building": [8],
                "Tech Research": [12], "Hero Advancement": [16], "Unit Progression": [20]
            };
            
            for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
                const checkDay = (currentUTCDay + dayOffset) % 7;
                const vsDayData = this.data.vsdays.find(d => d.day === checkDay);
                if (!vsDayData) continue;
                
                const dayAlignments = this.data.highpriorityalignments.filter(a => a.vsday === checkDay);
                
                for (const alignment of dayAlignments) {
                    const phaseHours = phaseSchedule[alignment.armsphase];
                    if (!phaseHours) continue;
                    
                    for (const hour of phaseHours) {
                        const windowTime = new Date(now);
                        windowTime.setUTCDate(now.getUTCDate() + dayOffset);
                        windowTime.setUTCHours(hour, 0, 0, 0);
                        
                        const timeDiff = windowTime.getTime() - now.getTime();
                        if (timeDiff > 0 && timeDiff < minTimeDiff) {
                            minTimeDiff = timeDiff;
                            nearestWindow = {
                                startTime: windowTime,
                                vsDay: checkDay,
                                vsTitle: vsDayData.title,
                                armsPhase: alignment.armsphase,
                                reason: alignment.reason,
                                timeToWindow: this.formatTime(timeDiff)
                            };
                        }
                    }
                }
            }
            
            return nearestWindow;
        } catch (error) {
            console.error("Error finding next priority window:", error);
            return null;
        }
    }

    calculatePhaseTimeRemaining() {
        try {
            const now = this.getServerTime();
            if (!now) return "0m";
            
            const currentHour = now.getUTCHours();
            const currentMinute = now.getUTCMinutes();
            
            const phaseStarts = [0, 4, 8, 12, 16, 20];
            let nextPhaseStart = 24;
            
            for (const start of phaseStarts) {
                if (currentHour < start) {
                    nextPhaseStart = start;
                    break;
                }
            }
            
            let hoursToNext = nextPhaseStart - currentHour;
            let minutesToNext = -currentMinute;
            
            if (minutesToNext < 0) {
                minutesToNext += 60;
                hoursToNext--;
            }
            
            if (hoursToNext < 0) {
                hoursToNext += 24;
            }
            
            if (hoursToNext > 0) {
                return `${hoursToNext}h ${minutesToNext}m`;
            } else {
                return `${Math.max(0, minutesToNext)}m`;
            }
        } catch (error) {
            return "0m";
        }
    }

    formatTime(timeDiffMs) {
        try {
            if (!timeDiffMs || timeDiffMs < 0) return "Starting Soon";
            
            const days = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            if (days > 0) return `${days}d ${hours}h`;
            if (hours > 0) return `${hours}h ${minutes}m`;
            return `${Math.max(1, minutes)}m`;
        } catch (error) {
            return "Time Error";
        }
    }

    updateElement(elementId, property, value) {
        try {
            let element = this.elements[elementId] || document.getElementById(elementId);
            if (!element) return;
            
            this.elements[elementId] = element;
            
            if (property === 'textContent') {
                element.textContent = String(value || 'N/A');
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
        this.updateElement('current-vs-day', 'textContent', vsDay.title);
        this.updateElement('arms-phase', 'textContent', armsPhase.name);
        
        const nextChangeTime = this.calculatePhaseTimeRemaining();
        this.updateElement('next-alignment-countdown', 'textContent', nextChangeTime);
    }

    setFallbackDisplay(message) {
        this.updateElement('next-priority-time', 'textContent', 'Loading');
        this.updateElement('countdown-label', 'textContent', 'CALCULATING');
        this.updateElement('next-priority-event', 'textContent', message);
        this.updateElement('current-action', 'textContent', 'System initializing...');
        this.updateElement('efficiency-level', 'textContent', 'Loading');
    }

    getServerTime() {
        try {
            const now = new Date();
            return new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
        } catch (error) {
            return new Date();
        }
    }

    loadServerSettings() {
        try {
            const saved = localStorage.getItem('lwn-server-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.currentArmsPhase = settings.currentArmsPhase || "City Building";
                this.timeOffset = settings.timeOffset || 0;
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
            if (this.elements['current-arms-phase']) {
                this.currentArmsPhase = this.elements['current-arms-phase'].value;
            }
            if (this.elements['time-offset']) {
                this.timeOffset = parseInt(this.elements['time-offset'].value, 10);
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
            this.elements['current-phase-display'].textContent = this.currentArmsPhase;
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
            const timeString = serverTime.toUTCString().slice(17, 25);
            this.updateElement('server-time', 'textContent', timeString);
        } catch (error) {
            console.error("Error updating server time:", error);
        }
    }

    updateCountdown() {
        try {
            const now = this.getServerTime();
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
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            const countdownText = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
            this.updateElement('countdown-timer', 'textContent', countdownText);
            
            const nextPhaseIndex = Math.floor(nextPhaseStart / 4) % this.data.armsracephases.length;
            const nextPhase = this.data.armsracephases[nextPhaseIndex];
            this.updateElement('event-name', 'textContent', `${nextPhase.name} Phase`);
            
            const timeString = nextPhaseStart === 24 ? "00:00" : String(nextPhaseStart).padStart(2, '0') + ":00";
            this.updateElement('event-time', 'textContent', `${timeString} Server Time`);
            
        } catch (error) {
            console.error("Error updating countdown:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LastWarNexus();
});
</div>
