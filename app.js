// VS Points Optimizer - Last War Nexus
// Production-ready JavaScript with 2-phase Arms Race selection and notifications

class VSPointsOptimizer {
    constructor() {
        this.currentData = {
            serverTime: new Date(),
            timeOffset: 0,
            currentArmsPhase: 'Tech Research',
            nextArmsPhase: 'Drone Boost',
            phaseTransitionTime: null,
            vsDay: 'Wednesday',
            timeFormat: 'utc'
        };

        this.armsRacePhases = [
            'Tech Research',
            'Drone Boost', 
            'Hero Advancement',
            'City Building',
            'Unit Progression'
        ];

        this.vsDays = [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
            'Friday', 'Saturday', 'Sunday'
        ];

        this.priorityWindows = [];
        this.scheduleData = [];
        this.intelligenceData = [];
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.calculatePhaseTransition();
        this.generatePriorityWindows();
        this.generateScheduleData();
        this.generateIntelligenceData();
        this.updateDisplay();
        this.startUpdateLoop();
        this.checkInitialSetup();
    }

    loadSettings() {
        const saved = localStorage.getItem('vsPointsSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.currentData = { ...this.currentData, ...settings };
        }
    }

    saveSettings() {
        localStorage.setItem('vsPointsSettings', JSON.stringify(this.currentData));
    }

    checkInitialSetup() {
        const hasSettings = localStorage.getItem('vsPointsSettings');
        if (!hasSettings) {
            this.showInitialSetupModal();
        }
    }

    showInitialSetupModal() {
        // Initial setup modal logic can be added here
        console.log('Initial setup required');
    }

    setupEventListeners() {
        // Server settings dropdown
        const serverToggle = document.getElementById('server-toggle');
        const serverDropdown = document.getElementById('server-dropdown');
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsDropdown = document.getElementById('settings-dropdown');

        if (serverToggle) {
            serverToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                serverDropdown.classList.toggle('show');
                settingsDropdown.classList.remove('show');
            });
        }

        if (settingsToggle) {
            settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                settingsDropdown.classList.toggle('show');
                serverDropdown.classList.remove('show');
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            serverDropdown?.classList.remove('show');
            settingsDropdown?.classList.remove('show');
        });

        // Apply server settings
        const applyBtn = document.getElementById('apply-server');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyServerSettings();
            });
        }

        // Arms Race phase selectors
        const currentPhaseSelect = document.getElementById('current-arms-phase');
        const nextPhaseSelect = document.getElementById('next-arms-phase');
        const timeOffsetSelect = document.getElementById('time-offset');

        if (currentPhaseSelect) {
            currentPhaseSelect.value = this.currentData.currentArmsPhase;
            currentPhaseSelect.addEventListener('change', (e) => {
                this.currentData.currentArmsPhase = e.target.value;
                this.updatePhaseDisplays();
            });
        }

        if (nextPhaseSelect) {
            nextPhaseSelect.value = this.currentData.nextArmsPhase;
            nextPhaseSelect.addEventListener('change', (e) => {
                this.currentData.nextArmsPhase = e.target.value;
                this.updatePhaseDisplays();
            });
        }

        if (timeOffsetSelect) {
            timeOffsetSelect.value = this.currentData.timeOffset.toString();
            timeOffsetSelect.addEventListener('change', (e) => {
                this.currentData.timeOffset = parseInt(e.target.value);
                this.updateOffsetDisplay();
            });
        }

        // Time format selector
        const timeFormatSelect = document.getElementById('time-format-dropdown');
        if (timeFormatSelect) {
            timeFormatSelect.value = this.currentData.timeFormat;
            timeFormatSelect.addEventListener('change', (e) => {
                this.currentData.timeFormat = e.target.value;
                this.updateDisplay();
            });
        }

        // Tab navigation
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.applyFilter(filter);
            });
        });
    }

    applyServerSettings() {
        this.calculatePhaseTransition();
        this.generatePriorityWindows();
        this.generateScheduleData();
        this.updateDisplay();
        this.saveSettings();
        
        // Close dropdown
        document.getElementById('server-dropdown')?.classList.remove('show');
        
        // Show confirmation
        this.showNotification('Server settings applied successfully', 'success');
    }

    updatePhaseDisplays() {
        const currentDisplay = document.getElementById('current-phase-display');
        const nextDisplay = document.getElementById('next-phase-display');
        
        if (currentDisplay) currentDisplay.textContent = this.currentData.currentArmsPhase;
        if (nextDisplay) nextDisplay.textContent = this.currentData.nextArmsPhase;
    }

    updateOffsetDisplay() {
        const offsetDisplay = document.getElementById('offset-display');
        if (offsetDisplay) {
            const sign = this.currentData.timeOffset >= 0 ? '+' : '';
            offsetDisplay.textContent = `UTC ${sign}${this.currentData.timeOffset}`;
        }
    }

    calculatePhaseTransition() {
        // Calculate next phase transition based on current time and 4-hour blocks
        const now = new Date();
        const serverTime = new Date(now.getTime() + (this.currentData.timeOffset * 60 * 60 * 1000));
        
        // Find next 4-hour boundary (00:00, 04:00, 08:00, 12:00, 16:00, 20:00)
        const hours = serverTime.getHours();
        const nextTransitionHour = Math.ceil(hours / 4) * 4;
        
        const transitionTime = new Date(serverTime);
        transitionTime.setHours(nextTransitionHour, 0, 0, 0);
        
        // If we've passed today's last transition, move to tomorrow
        if (nextTransitionHour >= 24) {
            transitionTime.setDate(transitionTime.getDate() + 1);
            transitionTime.setHours(0, 0, 0, 0);
        }
        
        this.currentData.phaseTransitionTime = transitionTime;
        this.currentData.serverTime = serverTime;
    }

    generatePriorityWindows() {
        this.priorityWindows = [];
        const startDate = new Date();
        
        // Generate 7 days of priority windows
        for (let day = 0; day < 7; day++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + day);
            
            const dayName = this.vsDays[date.getDay()];
            const armsPhase = this.getArmsPhaseForTime(date);
            
            // Check for high-priority alignments
            const isHighPriority = this.isHighPriorityAlignment(dayName, armsPhase);
            
            if (isHighPriority) {
                this.priorityWindows.push({
                    id: `priority-${day}`,
                    date: new Date(date),
                    dayName: dayName,
                    armsPhase: armsPhase,
                    priority: 'high',
                    efficiency: this.calculateEfficiency(dayName, armsPhase),
                    activities: this.getOptimalActivities(dayName, armsPhase),
                    startTime: new Date(date.setHours(0, 0, 0, 0)),
                    endTime: new Date(date.setHours(23, 59, 59, 999))
                });
            }
        }
    }

    getArmsPhaseForTime(date) {
        // Calculate which arms race phase is active at given time
        const hours = date.getHours();
        const phaseIndex = Math.floor(hours / 4) % this.armsRacePhases.length;
        
        // Use current/next phase logic based on user selection
        if (date.toDateString() === new Date().toDateString()) {
            const currentHour = new Date().getHours();
            const currentPhaseIndex = Math.floor(currentHour / 4) % this.armsRacePhases.length;
            
            if (phaseIndex === currentPhaseIndex) {
                return this.currentData.currentArmsPhase;
            } else if (phaseIndex === (currentPhaseIndex + 1) % this.armsRacePhases.length) {
                return this.currentData.nextArmsPhase;
            }
        }
        
        return this.armsRacePhases[phaseIndex];
    }

    isHighPriorityAlignment(vsDay, armsPhase) {
        const alignments = {
            'Monday': ['Tech Research', 'Unit Progression'],
            'Tuesday': ['Drone Boost', 'City Building'],
            'Wednesday': ['Tech Research', 'Hero Advancement'],
            'Thursday': ['City Building', 'Drone Boost'],
            'Friday': ['Hero Advancement', 'Unit Progression'],
            'Saturday': ['Unit Progression', 'Tech Research'],
            'Sunday': ['City Building', 'Drone Boost']
        };
        
        return alignments[vsDay]?.includes(armsPhase) || false;
    }

    calculateEfficiency(vsDay, armsPhase) {
        if (this.isHighPriorityAlignment(vsDay, armsPhase)) {
            return 'High';
        }
        
        // Medium priority for partial alignments
        const mediumAlignments = {
            'Monday': ['Drone Boost', 'Hero Advancement'],
            'Tuesday': ['Tech Research', 'Unit Progression'],
            'Wednesday': ['City Building', 'Unit Progression'],
            'Thursday': ['Tech Research', 'Hero Advancement'],
            'Friday': ['Drone Boost', 'City Building'],
            'Saturday': ['Hero Advancement', 'Drone Boost'],
            'Sunday': ['Tech Research', 'Unit Progression']
        };
        
        if (mediumAlignments[vsDay]?.includes(armsPhase)) {
            return 'Medium';
        }
        
        return 'Standard';
    }

    getOptimalActivities(vsDay, armsPhase) {
        const activities = {
            'Tech Research': ['Complete research projects', 'Use research speedups', 'Upgrade tech'],
            'Drone Boost': ['Train drones', 'Upgrade drone facilities', 'Use drone parts'],
            'Hero Advancement': ['Level up heroes', 'Upgrade hero skills', 'Use hero XP items'],
            'City Building': ['Upgrade buildings', 'Use construction speedups', 'Complete city tasks'],
            'Unit Progression': ['Train troops', 'Upgrade units', 'Use training speedups']
        };
        
        return activities[armsPhase] || ['Focus on general activities'];
    }

    generateScheduleData() {
        this.scheduleData = [];
        const startDate = new Date();
        
        // Generate 7 days of complete schedule
        for (let day = 0; day < 7; day++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + day);
            
            const dayName = this.vsDays[date.getDay()];
            
            // Generate 6 time slots per day (4-hour blocks)
            for (let slot = 0; slot < 6; slot++) {
                const startHour = slot * 4;
                const startTime = new Date(date);
                startTime.setHours(startHour, 0, 0, 0);
                
                const endTime = new Date(startTime);
                endTime.setHours(startHour + 4, 0, 0, 0);
                
                const armsPhase = this.getArmsPhaseForTime(startTime);
                const isHighPriority = this.isHighPriorityAlignment(dayName, armsPhase);
                const efficiency = this.calculateEfficiency(dayName, armsPhase);
                
                this.scheduleData.push({
                    id: `schedule-${day}-${slot}`,
                    date: new Date(date),
                    dayName: dayName,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    armsPhase: armsPhase,
                    vsDay: dayName,
                    priority: isHighPriority ? 'high' : 'normal',
                    efficiency: efficiency,
                    activities: this.getOptimalActivities(dayName, armsPhase)
                });
            }
        }
    }

    generateIntelligenceData() {
        this.intelligenceData = [
            {
                id: 'guide-1',
                title: 'VS Points Maximization Strategy',
                category: 'Optimization',
                content: 'Focus on dual-event windows for maximum efficiency...',
                priority: 'high'
            },
            {
                id: 'guide-2', 
                title: 'Arms Race Phase Planning',
                category: 'Strategy',
                content: 'Plan your weekly activities around phase rotations...',
                priority: 'medium'
            }
            // Add more intelligence content as needed
        ];
    }

    updateDisplay() {
        this.updateServerTime();
        this.updatePhaseCountdown();
        this.updatePriorityDisplay();
        this.updateCurrentStrategy();
        this.renderPriorityGrid();
        this.renderScheduleGrid();
        this.renderIntelligenceContent();
    }

    updateServerTime() {
        const now = new Date();
        const serverTime = new Date(now.getTime() + (this.currentData.timeOffset * 60 * 60 * 1000));
        
        const timeString = this.currentData.timeFormat === 'local' 
            ? now.toLocaleTimeString('en-US', { hour12: false })
            : serverTime.toLocaleTimeString('en-US', { hour12: false });
            
        const serverTimeElement = document.getElementById('server-time');
        if (serverTimeElement) {
            serverTimeElement.textContent = timeString;
        }
        
        this.currentData.serverTime = serverTime;
        this.currentData.vsDay = this.vsDays[serverTime.getDay()];
    }

    updatePhaseCountdown() {
        if (!this.currentData.phaseTransitionTime) return;
        
        const now = new Date();
        const timeToTransition = this.currentData.phaseTransitionTime.getTime() - now.getTime();
        
        if (timeToTransition <= 0) {
            // Phase has changed, rotate to next phase
            this.rotatePhases();
            this.calculatePhaseTransition();
            return;
        }
        
        const hours = Math.floor(timeToTransition / (1000 * 60 * 60));
        const minutes = Math.floor((timeToTransition % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeToTransition % (1000 * 60)) / 1000);
        
        const countdownText = hours > 0 
            ? `${hours}h ${minutes}m ${seconds}s`
            : `${minutes}m ${seconds}s`;
            
        const countdownElement = document.getElementById('countdown-timer');
        if (countdownElement) {
            countdownElement.textContent = countdownText;
        }
        
        // Update progress bar
        const totalPhaseTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
        const elapsed = totalPhaseTime - timeToTransition;
        const progress = Math.max(0, Math.min(100, (elapsed / totalPhaseTime) * 100));
        
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Update event name and time
        const eventName = document.getElementById('event-name');
        const eventTime = document.getElementById('event-time');
        
        if (eventName) {
            eventName.textContent = `${this.currentData.nextArmsPhase} Phase`;
        }
        
        if (eventTime) {
            const transitionTime = this.currentData.phaseTransitionTime;
            const timeStr = transitionTime.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            eventTime.textContent = `${timeStr} Server Time`;
        }
    }

    rotatePhases() {
        // Move to next phase
        this.currentData.currentArmsPhase = this.currentData.nextArmsPhase;
        
        // Calculate next phase after current next phase
        const currentIndex = this.armsRacePhases.indexOf(this.currentData.nextArmsPhase);
        const nextIndex = (currentIndex + 1) % this.armsRacePhases.length;
        this.currentData.nextArmsPhase = this.armsRacePhases[nextIndex];
        
        // Update displays
        this.updatePhaseDisplays();
        
        // Regenerate data
        this.generatePriorityWindows();
        this.generateScheduleData();
        
        // Save settings
        this.saveSettings();
        
        // Show notification
        this.showNotification(`Arms Race phase changed to ${this.currentData.currentArmsPhase}`, 'info');
    }

    updatePriorityDisplay() {
        const nextPriorityWindow = this.getNextPriorityWindow();
        
        if (nextPriorityWindow) {
            const timeToWindow = nextPriorityWindow.startTime.getTime() - Date.now();
            const hours = Math.floor(timeToWindow / (1000 * 60 * 60));
            const minutes = Math.floor((timeToWindow % (1000 * 60 * 60)) / (1000 * 60));
            
            const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            
            // Update priority display elements
            const nextPriorityTime = document.getElementById('next-priority-time');
            const nextPriorityEvent = document.getElementById('next-priority-event');
            const eventDayGaming = document.getElementById('event-day-gaming');
            const currentAction = document.getElementById('current-action');
            const efficiencyLevel = document.getElementById('efficiency-level');
            
            if (nextPriorityTime) nextPriorityTime.textContent = timeString;
            if (nextPriorityEvent) nextPriorityEvent.textContent = `${nextPriorityWindow.armsPhase} + ${nextPriorityWindow.dayName}`;
            if (eventDayGaming) eventDayGaming.textContent = `${nextPriorityWindow.dayName} ${nextPriorityWindow.startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} UTC`;
            if (currentAction) currentAction.textContent = nextPriorityWindow.activities[0] || 'Optimize your activities';
            if (efficiencyLevel) efficiencyLevel.textContent = nextPriorityWindow.efficiency;
        }
        
        // Update current VS day and arms phase
        const currentVsDay = document.getElementById('current-vs-day');
        const armsPhase = document.getElementById('arms-phase');
        
        if (currentVsDay) currentVsDay.textContent = this.currentData.vsDay;
        if (armsPhase) armsPhase.textContent = this.currentData.currentArmsPhase;
    }

    getNextPriorityWindow() {
        const now = Date.now();
        return this.priorityWindows.find(window => window.startTime.getTime() > now) || null;
    }

    updateCurrentStrategy() {
        const currentVsDay = this.currentData.vsDay;
        const currentArmsPhase = this.currentData.currentArmsPhase;
        const efficiency = this.calculateEfficiency(currentVsDay, currentArmsPhase);
        const isHighPriority = this.isHighPriorityAlignment(currentVsDay, currentArmsPhase);
        
        const actionText = document.getElementById('action-text');
        const strategyRating = document.getElementById('strategy-rating');
        const optimizationFocus = document.getElementById('optimization-focus');
        const priorityLevel = document.getElementById('priority-level');
        
        if (isHighPriority) {
            if (actionText) actionText.textContent = 'HIGH PRIORITY WINDOW ACTIVE! Focus on activities that earn points for both VS and Arms Race.';
            if (strategyRating) strategyRating.textContent = 'S';
            if (priorityLevel) priorityLevel.textContent = 'High';
        } else {
            if (actionText) actionText.textContent = 'Activities earn standard points. Save speedups for high priority windows.';
            if (strategyRating) strategyRating.textContent = efficiency === 'Medium' ? 'B' : 'A';
            if (priorityLevel) priorityLevel.textContent = efficiency;
        }
        
        if (optimizationFocus) optimizationFocus.textContent = 'Dual Event Alignment';
    }

    renderPriorityGrid() {
        const grid = document.getElementById('priority-grid');
        if (!grid) return;
        
        if (this.priorityWindows.length === 0) {
            grid.innerHTML = '<div class="no-priority-message">No high-priority windows in the next 7 days. Check back later!</div>';
            return;
        }
        
        const html = this.priorityWindows.map(window => {
            const isActive = this.isWindowActive(window);
            const timeUntil = this.getTimeUntilWindow(window);
            
            return `
                <div class="priority-card ${isActive ? 'active' : ''}" data-id="${window.id}">
                    <div class="priority-header">
                        <div class="priority-badge ${window.efficiency.toLowerCase()}">${window.efficiency}</div>
                        <div class="priority-time">${timeUntil}</div>
                    </div>
                    <div class="priority-content">
                        <h3>${window.armsPhase} + ${window.dayName}</h3>
                        <div class="priority-details">
                            <p><strong>Duration:</strong> Full day optimization</p>
                            <p><strong>Focus:</strong> ${window.activities.join(', ')}</p>
                        </div>
                    </div>
                    ${isActive ? '<div class="active-indicator">ACTIVE NOW</div>' : ''}
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
        
        // Update priority count
        const priorityCount = document.getElementById('priority-count');
        if (priorityCount) {
            priorityCount.textContent = `${this.priorityWindows.length} Windows`;
        }
    }

    renderScheduleGrid() {
        const grid = document.getElementById('schedule-grid');
        if (!grid) return;
        
        const html = this.scheduleData.map(event => {
            const isActive = this.isEventActive(event);
            const isPriority = event.priority === 'high';
            
            return `
                <div class="schedule-event ${isPriority ? 'priority' : ''} ${isActive ? 'current' : ''}" data-id="${event.id}">
                    <div class="event-time">
                        ${event.startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} - 
                        ${event.endTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div class="event-title">${event.armsPhase}</div>
                    <div class="event-day">${event.dayName}</div>
                    <div class="event-efficiency">${event.efficiency}</div>
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }

    renderIntelligenceContent() {
        const content = document.getElementById('intelligence-content');
        if (!content) return;
        
        const html = this.intelligenceData.map(guide => `
            <div class="intelligence-card" data-id="${guide.id}">
                <div class="intel-header">
                    <h3>${guide.title}</h3>
                    <span class="intel-category">${guide.category}</span>
                </div>
                <div class="intel-content">
                    <p>${guide.content}</p>
                </div>
            </div>
        `).join('');
        
        content.innerHTML = html;
    }

    isWindowActive(window) {
        const now = Date.now();
        return now >= window.startTime.getTime() && now <= window.endTime.getTime();
    }

    isEventActive(event) {
        const now = Date.now();
        return now >= event.startTime.getTime() && now <= event.endTime.getTime();
    }

    getTimeUntilWindow(window) {
        const now = Date.now();
        const timeUntil = window.startTime.getTime() - now;
        
        if (timeUntil <= 0) {
            if (this.isWindowActive(window)) {
                return 'ACTIVE NOW';
            } else {
                return 'Completed';
            }
        }
        
        const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    applyFilter(filter) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Filter priority windows
        const filteredWindows = this.filterPriorityWindows(filter);
        this.renderFilteredPriorityGrid(filteredWindows);
    }

    filterPriorityWindows(filter) {
        switch (filter) {
            case 'active':
                return this.priorityWindows.filter(window => this.isWindowActive(window));
            case 'upcoming':
                return this.priorityWindows.filter(window => window.startTime.getTime() > Date.now());
            default:
                return this.priorityWindows;
        }
    }

    renderFilteredPriorityGrid(windows) {
        const grid = document.getElementById('priority-grid');
        if (!grid) return;
        
        if (windows.length === 0) {
            grid.innerHTML = '<div class="no-priority-message">No windows match the current filter.</div>';
            return;
        }
        
        const html = windows.map(window => {
            const isActive = this.isWindowActive(window);
            const timeUntil = this.getTimeUntilWindow(window);
            
            return `
                <div class="priority-card ${isActive ? 'active' : ''}" data-id="${window.id}">
                    <div class="priority-header">
                        <div class="priority-badge ${window.efficiency.toLowerCase()}">${window.efficiency}</div>
                        <div class="priority-time">${timeUntil}</div>
                    </div>
                    <div class="priority-content">
                        <h3>${window.armsPhase} + ${window.dayName}</h3>
                        <div class="priority-details">
                            <p><strong>Duration:</strong> Full day optimization</p>
                            <p><strong>Focus:</strong> ${window.activities.join(', ')}</p>
                        </div>
                    </div>
                    ${isActive ? '<div class="active-indicator">ACTIVE NOW</div>' : ''}
                </div>
            `;
        }).join('');
        
        grid.innerHTML = html;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    startUpdateLoop() {
        // Update every second
        setInterval(() => {
            this.updateDisplay();
        }, 1000);
        
        // Save settings every 5 minutes
        setInterval(() => {
            this.saveSettings();
        }, 5 * 60 * 1000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vsOptimizer = new VSPointsOptimizer();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.vsOptimizer) {
        // Recalculate when page becomes visible again
        window.vsOptimizer.calculatePhaseTransition();
        window.vsOptimizer.updateDisplay();
    }
});
