class LastWarNexus {
    constructor() {
        this.timeOffset = 0;
        this.elements = {};
        this.activeFilter = 'all';
        this.expandedDetails = { vsDay: false, armsRace: false };
        this.settings = { detailLevel: 'standard', notifications: true };
        this.data = {
            vsdays: [
                { day: 0, name: "Sunday", title: "Personal Development", pointActivities: ["Hero Upgrade", "Tech Research", "Base Building"] },
                { day: 1, name: "Monday", title: "Resource Gathering", pointActivities: ["Mining", "Farming", "Trading"] },
                { day: 2, name: "Tuesday", title: "Combat Training", pointActivities: ["Troop Training", "Battle Participation", "Equipment Upgrade"] },
                { day: 3, name: "Wednesday", title: "Alliance Coordination", pointActivities: ["Alliance Missions", "Donations", "Territory Wars"] },
                { day: 4, name: "Thursday", title: "Strategic Planning", pointActivities: ["Research", "City Planning", "Resource Management"] },
                { day: 5, name: "Friday", title: "Economic Focus", pointActivities: ["Trade Routes", "Market Activities", "Economic Buildings"] },
                { day: 6, name: "Saturday", title: "Military Operations", pointActivities: ["Battles", "Raids", "Defense Setup"] }
            ],
            armsracephases: [
                { name: "Mixed Phase", icon: "🔄", hours: [0,1,2,3], activities: ["All Activities"], pointSources: ["Mixed objectives", "General gameplay"] },
                { name: "Drone Boost", icon: "🚁", hours: [4,5,6,7], activities: ["Drone Operations"], pointSources: ["Drone missions", "Drone upgrades", "Drone combat"] },
                { name: "City Building", icon: "🏗️", hours: [8,9,10,11], activities: ["Construction"], pointSources: ["Building upgrades", "Construction speed", "City development"] },
                { name: "Tech Research", icon: "🔬", hours: [12,13,14,15], activities: ["Research"], pointSources: ["Technology research", "Research speed", "Lab activities"] },
                { name: "Hero Advancement", icon: "⚔️", hours: [16,17,18,19], activities: ["Hero Development"], pointSources: ["Hero upgrades", "Hero equipment", "Hero skills"] },
                { name: "Unit Progression", icon: "🛡️", hours: [20,21,22,23], activities: ["Troop Training"], pointSources: ["Unit training", "Unit upgrades", "Army development"] }
            ],
            highpriorityalignments: [
                { vsday: 0, armsphase: "Hero Advancement", reason: "Hero Development + Personal Development alignment", points: 2500 },
                { vsday: 0, armsphase: "Tech Research", reason: "Research + Personal Development synergy", points: 2200 },
                { vsday: 1, armsphase: "City Building", reason: "Resource infrastructure building", points: 2300 },
                { vsday: 2, armsphase: "Unit Progression", reason: "Combat Training + Troop Training alignment", points: 2800 },
                { vsday: 3, armsphase: "Mixed Phase", reason: "Alliance activities benefit all phases", points: 2000 },
                { vsday: 4, armsphase: "Tech Research", reason: "Strategic Planning + Research alignment", points: 2600 },
                { vsday: 4, armsphase: "City Building", reason: "City Planning + Building alignment", points: 2400 },
                { vsday: 5, armsphase: "City Building", reason: "Economic buildings + Infrastructure", points: 2700 },
                { vsday: 6, armsphase: "Unit Progression", reason: "Military Operations + Army Development", points: 3000 },
                { vsday: 6, armsphase: "Drone Boost", reason: "Military drones for combat operations", points: 2500 }
            ]
        };
        this.initializeApp();
    }

    initializeApp() {
        this.cacheElements();
        this.setupEventListeners();
        this.loadSettings();
        this.startUpdateLoop();
        this.updateDisplay();
    }

    cacheElements() {
        const elementIds = [
            'progress-fill', 'progress-text', 'countdown-timer', 'event-name', 'event-time',
            'current-vs-day', 'arms-phase', 'alignment-indicator', 'alignment-status',
            'action-icon', 'action-text', 'priority-level', 'strategy-rating',
            'optimization-focus', 'time-remaining', 'priority-grid', 'offset-display',
            'filter-all', 'filter-active', 'filter-upcoming', 'detail-toggle',
            'notification-toggle', 'vs-day-details', 'arms-race-details'
        ];
        
        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }

    setupEventListeners() {
        // Offset adjustment
        const offsetSlider = document.getElementById('offset-slider');
        if (offsetSlider) {
            offsetSlider.addEventListener('input', (e) => {
                this.timeOffset = parseInt(e.target.value);
                this.updateDisplay();
            });
        }

        // Filter buttons
        ['all', 'active', 'upcoming'].forEach(filter => {
            const btn = this.elements[`filter-${filter}`];
            if (btn) {
                btn.addEventListener('click', () => this.setFilter(filter));
            }
        });

        // Toggle buttons
        if (this.elements['detail-toggle']) {
            this.elements['detail-toggle'].addEventListener('click', () => this.toggleDetailLevel());
        }
        if (this.elements['notification-toggle']) {
            this.elements['notification-toggle'].addEventListener('click', () => this.toggleNotifications());
        }

        // Expandable sections
        if (this.elements['vs-day-details']) {
            this.elements['vs-day-details'].addEventListener('click', () => this.toggleExpanded('vsDay'));
        }
        if (this.elements['arms-race-details']) {
            this.elements['arms-race-details'].addEventListener('click', () => this.toggleExpanded('armsRace'));
        }
    }

    // FIXED: Unified time system
    getServerTime() {
        const now = new Date();
        return new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
    }

    getCurrentServerInfo() {
        const serverTime = this.getServerTime();
        return {
            serverTime: serverTime,
            utcDay: serverTime.getUTCDay(),
            utcHour: serverTime.getUTCHours(),
            utcMinute: serverTime.getUTCMinutes(),
            utcSecond: serverTime.getUTCSeconds()
        };
    }

    // FIXED: Arms Race phase detection
    getCurrentArmsPhase() {
        const { utcHour } = this.getCurrentServerInfo();
        const phaseSchedule = [
            { hours: [0,1,2,3], index: 0 },
            { hours: [4,5,6,7], index: 1 },
            { hours: [8,9,10,11], index: 2 },
            { hours: [12,13,14,15], index: 3 },
            { hours: [16,17,18,19], index: 4 },
            { hours: [20,21,22,23], index: 5 }
        ];

        for (const phase of phaseSchedule) {
            if (phase.hours.includes(utcHour)) {
                return this.data.armsracephases[phase.index];
            }
        }
        return this.data.armsracephases[0];
    }

    getArmsRacePhase(hour) {
        const phaseIndex = Math.floor(hour / 4);
        return this.data.armsracephases[Math.min(phaseIndex, 5)];
    }

    // FIXED: Progress calculation
    updateProgress() {
        try {
            const { utcHour, utcMinute, utcSecond } = this.getCurrentServerInfo();
            const phaseStartHour = Math.floor(utcHour / 4) * 4;
            const minutesIntoPhase = ((utcHour - phaseStartHour) * 60) + utcMinute + (utcSecond / 60);
            const totalPhaseMinutes = 4 * 60;
            const percent = Math.max(0, Math.min(100, (minutesIntoPhase / totalPhaseMinutes) * 100));

            if (this.elements['progress-fill']) {
                this.elements['progress-fill'].style.width = `${percent}%`;
            }
            this.safeUpdateElement('progress-text', 'textContent', `${Math.round(percent)}% complete`);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    // FIXED: Countdown system
    updateCountdown() {
        try {
            const nextWindow = this.getNextHighPriorityWindow();
            if (!nextWindow) {
                this.safeUpdateElement('countdown-timer', 'textContent', 'No upcoming events');
                this.safeUpdateElement('event-name', 'textContent', '');
                this.safeUpdateElement('event-time', 'textContent', '');
                return;
            }

            const serverTime = this.getServerTime();
            const timeDiff = nextWindow.startTime - serverTime;

            if (timeDiff <= 0) {
                this.safeUpdateElement('countdown-timer', 'textContent', 'ACTIVE NOW');
                this.safeUpdateElement('event-name', 'textContent', `${nextWindow.armsPhase.name} Priority Window`);
                this.safeUpdateElement('event-time', 'textContent', 'Currently running - Use your resources!');
                return;
            }

            const hours = Math.floor(timeDiff / 3600000);
            const minutes = Math.floor((timeDiff % 3600000) / 60000);
            
            this.safeUpdateElement('countdown-timer', 'textContent', 
                `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`);
            this.safeUpdateElement('event-name', 'textContent', 
                `${nextWindow.armsPhase.name} Priority Window`);

            const serverTimeStr = nextWindow.startTime.toUTCString().slice(17, 22) + ' UTC';
            const localTimeStr = nextWindow.startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
            
            this.safeUpdateElement('event-time', 'textContent', 
                `Starts: ${serverTimeStr} (${localTimeStr} local)`);
                
        } catch (error) {
            console.error('Error updating countdown:', error);
        }
    }

    getNextHighPriorityWindow() {
        try {
            const serverTime = this.getServerTime();
            const potentialWindows = [];
            const phaseHours = [0, 4, 8, 12, 16, 20];

            for (let dayOffset = 0; dayOffset < 8; dayOffset++) {
                const targetDate = new Date(serverTime);
                targetDate.setUTCDate(targetDate.getUTCDate() + dayOffset);
                const targetDay = targetDate.getUTCDay();

                this.data.highpriorityalignments.forEach(alignment => {
                    if (alignment.vsday !== targetDay) return;

                    const armsPhase = this.data.armsracephases.find(p => p.name === alignment.armsphase);
                    if (!armsPhase) return;

                    phaseHours.forEach(hour => {
                        const phaseAtHour = this.getArmsRacePhase(hour);
                        if (phaseAtHour.name === alignment.armsphase) {
                            const eventTime = new Date(Date.UTC(
                                targetDate.getUTCFullYear(),
                                targetDate.getUTCMonth(), 
                                targetDate.getUTCDate(),
                                hour, 0, 0
                            ));

                            if (eventTime > serverTime) {
                                potentialWindows.push({
                                    startTime: eventTime,
                                    vsDay: alignment.vsday,
                                    vsDayData: this.getVSDayData(alignment.vsday),
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

    // Enhanced current status
    updateCurrentStatus() {
        try {
            const { utcDay, utcHour, utcMinute } = this.getCurrentServerInfo();
            const vsDayData = this.getVSDayData(utcDay);
            const armsPhase = this.getCurrentArmsPhase();
            const alignment = this.getAlignment(utcDay, armsPhase.name);

            this.safeUpdateElement('current-vs-day', 'textContent', `${vsDayData.name} - ${vsDayData.title}`);
            this.safeUpdateElement('arms-phase', 'textContent', `${armsPhase.icon} ${armsPhase.name}`);

            if (this.elements['alignment-indicator'] && this.elements['alignment-status']) {
                if (alignment) {
                    this.safeUpdateElement('alignment-indicator', 'textContent', '🔥 HIGH PRIORITY ACTIVE');
                    this.elements['alignment-indicator'].style.color = 'var(--accent-success)';
                    this.elements['alignment-status'].classList.add('priority-active');
                    this.elements['alignment-status'].style.animation = 'pulse 2s infinite';
                } else {
                    this.safeUpdateElement('alignment-indicator', 'textContent', '⏳ Standard Phase');
                    this.elements['alignment-indicator'].style.color = 'var(--text-secondary)';
                    this.elements['alignment-status'].classList.remove('priority-active');
                    this.elements['alignment-status'].style.animation = 'none';
                }
            }

            this.updateActionDisplay(alignment, armsPhase, utcHour, utcMinute);
            
            if (this.expandedDetails.vsDay || this.expandedDetails.armsRace) {
                this.updateExpandedDetails();
            }
        } catch (error) {
            console.error('Error updating current status:', error);
        }
    }

    updateActionDisplay(alignment, armsPhase, utcHour, utcMinute) {
        try {
            if (utcHour === 0 && utcMinute <= 5) {
                this.safeUpdateElement('action-icon', 'textContent', '🔄');
                this.safeUpdateElement('action-text', 'innerHTML', 
                    '<strong>Server Reset in Progress</strong><br>No points awarded during this period - save your activities!');
                this.safeUpdateElement('priority-level', 'textContent', 'System');
                this.safeUpdateElement('strategy-rating', 'textContent', 'N/A');
                this.safeUpdateElement('optimization-focus', 'textContent', 'Wait');
                this.safeUpdateElement('time-remaining', 'textContent', `${5 - utcMinute}m`);
                return;
            }

            if (alignment) {
                this.safeUpdateElement('action-icon', 'textContent', '🔥');
                this.safeUpdateElement('action-text', 'innerHTML', 
                    `<strong>🎯 HIGH PRIORITY ACTIVE!</strong><br>${alignment.reason}<br><br>` +
                    `<strong>Action:</strong> Use your saved ${this.getOptimizationFocus(armsPhase.name)} NOW for maximum efficiency!`);
                this.safeUpdateElement('priority-level', 'textContent', 'Critical');
                this.safeUpdateElement('strategy-rating', 'textContent', 'A+');
                
                const focusText = this.getOptimizationFocus(armsPhase.name);
                this.safeUpdateElement('optimization-focus', 'textContent', focusText);
                
                const timeRemainingText = this.calculatePhaseTimeRemaining(utcHour, utcMinute);
                this.safeUpdateElement('time-remaining', 'textContent', timeRemainingText);
            } else {
                this.safeUpdateElement('action-icon', 'textContent', armsPhase.icon);
                this.safeUpdateElement('action-text', 'innerHTML', 
                    `<strong>📋 Standard Phase</strong><br>Focus on: ${armsPhase.activities[0]}<br><br>` +
                    `<strong>Strategy:</strong> Save major resources for high priority windows. Do basic activities only.`);
                this.safeUpdateElement('priority-level', 'textContent', 'Standard');
                this.safeUpdateElement('strategy-rating', 'textContent', 'B');
                
                const focusText = this.getOptimizationFocus(armsPhase.name);
                this.safeUpdateElement('optimization-focus', 'textContent', focusText);
                
                const timeRemainingText = this.calculatePhaseTimeRemaining(utcHour, utcMinute);
                this.safeUpdateElement('time-remaining', 'textContent', timeRemainingText);
            }
        } catch (error) {
            console.error('Error updating action display:', error);
        }
    }

    // Enhanced priority grid
    updatePriorityGrid() {
        try {
            if (!this.elements['priority-grid']) return;

            this.elements['priority-grid'].innerHTML = '';
            const { utcDay, utcHour } = this.getCurrentServerInfo();
            let windows = this.getAllHighPriorityWindows();

            if (this.activeFilter === 'active') {
                windows = windows.filter(w => {
                    const isActiveDay = w.vsDay === utcDay;
                    const currentPhase = this.getCurrentArmsPhase();
                    const isActivePhase = currentPhase.name === w.armsPhase.name;
                    return isActiveDay && isActivePhase;
                });
            } else if (this.activeFilter === 'upcoming') {
                const serverTime = this.getServerTime();
                windows = windows.filter(w => {
                    const eventTime = this.getPhaseStartTime(w.hour, w.vsDay);
                    const timeDiff = eventTime - serverTime;
                    return timeDiff > 0 && timeDiff <= (24 * 60 * 60 * 1000);
                });
            }

            windows.sort((a, b) => {
                const aTime = this.getPhaseStartTime(a.hour, a.vsDay);
                const bTime = this.getPhaseStartTime(b.hour, b.vsDay);
                return aTime - bTime;
            });

            windows.forEach(window => {
                const isActiveNow = window.vsDay === utcDay && 
                                   this.getCurrentArmsPhase().name === window.armsPhase.name;
                const eventTime = this.getPhaseStartTime(window.hour, window.vsDay);
                const serverTime = this.getServerTime();
                const isUpcoming = eventTime > serverTime && eventTime <= new Date(serverTime.getTime() + 6*60*60*1000);

                const eventCard = document.createElement('div');
                eventCard.className = `priority-event ${isActiveNow ? 'active' : ''} ${isUpcoming ? 'upcoming' : ''}`;

                let statusBadge = '';
                if (isActiveNow) {
                    statusBadge = '<div class="priority-badge active">🔥 ACTIVE NOW</div>';
                } else if (isUpcoming) {
                    statusBadge = '<div class="priority-badge upcoming">⏰ UPCOMING</div>';
                } else {
                    statusBadge = '<div class="priority-badge">🎯 HIGH VALUE</div>';
                }

                const timeRemaining = isActiveNow ? 'Active Now!' : this.getTimeUntilEvent(eventTime);

                let cardContent = `
                    ${statusBadge}
                    <div class="event-header">
                        <div class="event-day">${window.vsDayData.name}</div>
                        <div class="event-time">${this.getPhaseTimeDisplay(window.hour)} (${timeRemaining})</div>
                    </div>
                    <div class="event-details">
                        <div class="event-phase">${window.armsPhase.icon} ${window.armsPhase.name}</div>
                        <div class="event-vs">VS Event: ${window.vsDayData.title}</div>
                    </div>
                    <div class="event-strategy">
                        <strong>🎯 Strategy:</strong> ${window.alignment.reason}
                        <br><strong>💰 Potential:</strong> ${window.alignment.points.toLocaleString()} points
                    </div>
                `;

                if (this.settings.detailLevel === 'comprehensive') {
                    cardContent += `
                        <div class="event-detailed-info">
                            <div class="detail-section">
                                <strong>🎯 Key Activities:</strong><br>
                                • ${window.vsDayData.pointActivities.slice(0, 3).join('<br>• ')}
                            </div>
                            <div class="detail-section">
                                <strong>⚔️ Arms Race Focus:</strong><br>
                                • ${window.armsPhase.pointSources.slice(0, 3).join('<br>• ')}
                            </div>
                        </div>
                    `;
                }

                eventCard.innerHTML = cardContent;
                eventCard.addEventListener('click', () => 
                    this.showModal(window.alignment, window.vsDayData, window.armsPhase));
                
                this.elements['priority-grid'].appendChild(eventCard);
            });

            if (windows.length === 0) {
                const noEventsMsg = document.createElement('div');
                noEventsMsg.className = 'no-events-message';
                noEventsMsg.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">📅</div>
                        <div>No ${this.activeFilter} priority events found</div>
                        <div style="font-size: 0.8rem; margin-top: 0.5rem;">
                            Try changing the filter or check back later
                        </div>
                    </div>
                `;
                this.elements['priority-grid'].appendChild(noEventsMsg);
            }
        } catch (error) {
            console.error('Error updating priority grid:', error);
        }
    }

    // Helper methods
    getTimeUntilEvent(eventTime) {
        const serverTime = this.getServerTime();
        const timeDiff = eventTime - serverTime;
        
        if (timeDiff <= 0) return 'Active Now';
        
        const hours = Math.floor(timeDiff / (60 * 60 * 1000));
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}d ${hours % 24}h`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            const minutes = Math.floor(timeDiff / (60 * 1000));
            return `${minutes}m`;
        }
    }

    getPhaseStartTime(hour, vsDay) {
        const serverTime = this.getServerTime();
        const targetDate = new Date(serverTime);
        
        // Calculate days until target day
        let daysUntil = (vsDay - targetDate.getUTCDay() + 7) % 7;
        if (daysUntil === 0 && targetDate.getUTCHours() >= hour) {
            daysUntil = 7; // Next week if hour has passed
        }
        
        targetDate.setUTCDate(targetDate.getUTCDate() + daysUntil);
        return new Date(Date.UTC(
            targetDate.getUTCFullYear(),
            targetDate.getUTCMonth(),
            targetDate.getUTCDate(),
            hour, 0, 0
        ));
    }

    getPhaseTimeDisplay(hour) {
        const startTime = String(hour).padStart(2, '0') + ':00';
        const endTime = String((hour + 4) % 24).padStart(2, '0') + ':00';
        return `${startTime}-${endTime} UTC`;
    }

    getAllHighPriorityWindows() {
        const windows = [];
        const phaseHours = [0, 4, 8, 12, 16, 20];
        
        this.data.highpriorityalignments.forEach(alignment => {
            const vsDayData = this.getVSDayData(alignment.vsday);
            const armsPhase = this.data.armsracephases.find(p => p.name === alignment.armsphase);
            
            if (vsDayData && armsPhase) {
                phaseHours.forEach(hour => {
                    const phaseAtHour = this.getArmsRacePhase(hour);
                    if (phaseAtHour.name === alignment.armsphase) {
                        windows.push({
                            vsDay: alignment.vsday,
                            vsDayData: vsDayData,
                            armsPhase: armsPhase,
                            alignment: alignment,
                            hour: hour
                        });
                    }
                });
            }
        });
        
        return windows;
    }

    getVSDayData(day) {
        return this.data.vsdays.find(d => d.day === day);
    }

    getAlignment(vsDay, armsPhase) {
        return this.data.highpriorityalignments.find(a => 
            a.vsday === vsDay && a.armsphase === armsPhase
        );
    }

    getOptimizationFocus(phaseName) {
        const focusMap = {
            "Mixed Phase": "All resources",
            "Drone Boost": "Drone materials & energy",
            "City Building": "Building materials & speed-ups",
            "Tech Research": "Research materials & lab speed-ups",
            "Hero Advancement": "Hero XP & equipment materials",
            "Unit Progression": "Training materials & unit speed-ups"
        };
        return focusMap[phaseName] || "Resources";
    }

    calculatePhaseTimeRemaining(utcHour, utcMinute) {
        const phaseStartHour = Math.floor(utcHour / 4) * 4;
        const phaseEndHour = phaseStartHour + 4;
        const remainingMinutes = ((phaseEndHour - utcHour) * 60) - utcMinute;
        const hours = Math.floor(remainingMinutes / 60);
        const minutes = remainingMinutes % 60;
        return `${hours}h ${minutes}m`;
    }

    safeUpdateElement(elementId, property, value) {
        try {
            const element = this.elements[elementId];
            if (element && element[property] !== undefined) {
                element[property] = value;
            }
        } catch (error) {
            console.error(`Error updating element ${elementId}:`, error);
        }
    }

    setFilter(filter) {
        this.activeFilter = filter;
        ['all', 'active', 'upcoming'].forEach(f => {
            const btn = this.elements[`filter-${f}`];
            if (btn) {
                btn.classList.toggle('active', f === filter);
            }
        });
        this.updatePriorityGrid();
    }

    toggleDetailLevel() {
        this.settings.detailLevel = this.settings.detailLevel === 'standard' ? 'comprehensive' : 'standard';
        this.updatePriorityGrid();
        this.saveSettings();
    }

    toggleNotifications() {
        this.settings.notifications = !this.settings.notifications;
        this.saveSettings();
    }

    toggleExpanded(section) {
        this.expandedDetails[section] = !this.expandedDetails[section];
        this.updateExpandedDetails();
    }

    updateExpandedDetails() {
        // Implementation for expanded details display
    }

    showModal(alignment, vsDayData, armsPhase) {
        // Implementation for modal display
    }

// ADD these missing methods to the app.js class:

updateExpandedDetails() {
    const { utcDay } = this.getCurrentServerInfo();
    const vsDayData = this.getVSDayData(utcDay);
    const armsPhase = this.getCurrentArmsPhase();

    // VS Day expanded details
    if (this.expandedDetails.vsDay && this.elements['vs-day-details']) {
        const detailsContainer = this.elements['vs-day-details'].parentElement;
        let expandedContent = detailsContainer.querySelector('.expanded-content');
        
        if (!expandedContent) {
            expandedContent = document.createElement('div');
            expandedContent.className = 'expanded-content';
            detailsContainer.appendChild(expandedContent);
        }

        expandedContent.innerHTML = `
            <div class="expanded-details">
                <h4>📋 ${vsDayData.name} Activities</h4>
                <ul class="activity-list">
                    ${vsDayData.pointActivities.map(activity => 
                        `<li>• ${activity}</li>`
                    ).join('')}
                </ul>
                <div class="vs-day-strategy">
                    <strong>💡 Strategy:</strong> Focus on these activities to maximize VS Day points. 
                    Save major resources for when they align with Arms Race phases.
                </div>
            </div>
        `;
        
        this.elements['vs-day-details'].textContent = 'Hide Details';
    } else if (this.elements['vs-day-details']) {
        const detailsContainer = this.elements['vs-day-details'].parentElement;
        const expandedContent = detailsContainer.querySelector('.expanded-content');
        if (expandedContent) {
            expandedContent.remove();
        }
        this.elements['vs-day-details'].textContent = 'View Details';
    }

    // Arms Race expanded details  
    if (this.expandedDetails.armsRace && this.elements['arms-race-details']) {
        const detailsContainer = this.elements['arms-race-details'].parentElement;
        let expandedContent = detailsContainer.querySelector('.expanded-content');
        
        if (!expandedContent) {
            expandedContent = document.createElement('div');
            expandedContent.className = 'expanded-content';
            detailsContainer.appendChild(expandedContent);
        }

        const { utcHour } = this.getCurrentServerInfo();
        const timeRemaining = this.calculatePhaseTimeRemaining(utcHour, this.getCurrentServerInfo().utcMinute);

        expandedContent.innerHTML = `
            <div class="expanded-details">
                <h4>⚔️ ${armsPhase.name} Focus</h4>
                <ul class="activity-list">
                    ${armsPhase.pointSources.map(source => 
                        `<li>• ${source}</li>`
                    ).join('')}
                </ul>
                <div class="phase-timing">
                    <strong>⏰ Phase Schedule:</strong> 
                    ${this.getPhaseTimeDisplay(Math.floor(utcHour / 4) * 4)}
                    <br><strong>Time Remaining:</strong> ${timeRemaining}
                </div>
                <div class="arms-strategy">
                    <strong>💡 Strategy:</strong> This phase awards bonus points for ${armsPhase.activities[0].toLowerCase()}. 
                    Time your major activities during high-priority alignments.
                </div>
            </div>
        `;
        
        this.elements['arms-race-details'].textContent = 'Hide Details';
    } else if (this.elements['arms-race-details']) {
        const detailsContainer = this.elements['arms-race-details'].parentElement;
        const expandedContent = detailsContainer.querySelector('.expanded-content');
        if (expandedContent) {
            expandedContent.remove();
        }
        this.elements['arms-race-details'].textContent = 'View Details';
    }
}

showModal(alignment, vsDayData, armsPhase) {
    // Remove existing modal
    const existingModal = document.querySelector('.priority-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'priority-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>🎯 High Priority Window Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h4>📅 VS Day Event: ${vsDayData.name}</h4>
                    <p><strong>Focus:</strong> ${vsDayData.title}</p>
                    <div class="activity-grid">
                        <h5>🎯 Key Activities:</h5>
                        <ul>
                            ${vsDayData.pointActivities.map(activity => 
                                `<li>• ${activity}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h4>⚔️ Arms Race Phase: ${armsPhase.icon} ${armsPhase.name}</h4>
                    <div class="activity-grid">
                        <h5>🏆 Bonus Point Sources:</h5>
                        <ul>
                            ${armsPhase.pointSources.map(source => 
                                `<li>• ${source}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="modal-section alignment-details">
                    <h4>🔥 Why This Is High Priority</h4>
                    <p class="alignment-reason">${alignment.reason}</p>
                    <div class="points-potential">
                        <strong>💰 Point Potential:</strong> 
                        <span class="points-value">${alignment.points.toLocaleString()}</span> points
                    </div>
                </div>
                
                <div class="modal-section strategy-section">
                    <h4>💡 Optimization Strategy</h4>
                    <div class="strategy-tips">
                        <div class="tip">
                            <strong>🎯 Focus Activities:</strong> Prioritize ${vsDayData.pointActivities[0]} and ${armsPhase.pointSources[0]}
                        </div>
                        <div class="tip">
                            <strong>⏰ Timing:</strong> Use saved resources during this 4-hour window for maximum efficiency
                        </div>
                        <div class="tip">
                            <strong>📈 Expected Outcome:</strong> Up to ${Math.round(alignment.points * 1.2).toLocaleString()} points with optimal resource usage
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn secondary">Set Reminder</button>
                <button class="modal-btn primary">Got It!</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeModal = () => modal.remove();
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    modal.querySelectorAll('.modal-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Escape key to close
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    // Focus management
    modal.querySelector('.modal-close').focus();
}

// ADD: Enhanced error handling wrapper
safeExecute(func, context = 'Unknown') {
    try {
        return func();
    } catch (error) {
        console.error(`Error in ${context}:`, error);
        return null;
    }
}

// ADD: Notification system (if notifications enabled)
showNotification(title, message, type = 'info') {
    if (!this.settings.notifications) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}



    updateDisplay() {
        this.updateProgress();
        this.updateCountdown();
        this.updateCurrentStatus();
        this.updatePriorityGrid();
        this.updateOffsetDisplay();
    }

    updateOffsetDisplay() {
        if (this.elements['offset-display']) {
            this.elements['offset-display'].textContent = `${this.timeOffset >= 0 ? '+' : ''}${this.timeOffset}h`;
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('lastWarNexusSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('lastWarNexusSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    startUpdateLoop() {
        setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.nexusApp = new LastWarNexus();
});
