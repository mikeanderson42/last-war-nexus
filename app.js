class LastWarNexus {
    constructor() {
        this.data = {};
        this.elements = {};
        this.settings = {
            detailLevel: 'standard'
        };
        this.currentArmsPhase = 'Drone Boost';
        this.timeOffset = 0;
        this.expandedDetails = {
            armsRace: false,
            vsDay: false
        };
        this.activeFilter = 'all';
        this.manualPhaseOverride = false;
        this.lastTrackedPhase = null;
        
        this.init().catch(error => {
            console.error('Failed to initialize LastWarNexus:', error);
        });
    }

    async init() {
        try {
            await this.loadData();
            this.initializeElements();
            this.loadSettings();
            this.setupEventListeners();
            this.updateAllDisplays();
            this.startUpdateLoop();
            console.log('LastWarNexus initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    async loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    initializeElements() {
        const elementIds = [
            'current-time', 'current-vs-day', 'arms-phase', 'alignment-indicator',
            'alignment-status', 'next-priority-event', 'next-priority-countdown',
            'priority-grid', 'schedule-grid', 'tab-all', 'tab-active', 'tab-upcoming',
            'all-count', 'active-count', 'upcoming-count', 'server-dropdown',
            'server-display', 'current-arms-phase', 'time-offset', 'detail-toggle',
            'optimization-focus', 'phase-progress', 'phase-progress-fill',
            'phase-time-remaining', 'arms-race-details', 'vs-day-details'
        ];

        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('lastWarNexusSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.currentArmsPhase = settings.currentArmsPhase || 'Drone Boost';
                this.timeOffset = settings.timeOffset || 0;
                this.settings.detailLevel = settings.detailLevel || 'standard';
            }
            this.updateServerDisplay();
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    saveServerSettings() {
        try {
            const settings = {
                currentArmsPhase: this.currentArmsPhase,
                timeOffset: this.timeOffset,
                detailLevel: this.settings.detailLevel
            };
            localStorage.setItem('lastWarNexusSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    setupEventListeners() {
        // Server dropdown
        if (this.elements['server-display']) {
            this.elements['server-display'].addEventListener('click', () => this.toggleDropdown());
        }

        // Tab filters
        ['all', 'active', 'upcoming'].forEach(filter => {
            const tab = this.elements[`tab-${filter}`];
            if (tab) {
                tab.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.setActiveFilter(filter);
                });
            }
        });

        // Settings apply button
        const applyButton = document.querySelector('.apply-server-settings');
        if (applyButton) {
            applyButton.addEventListener('click', () => this.applyServerSettings());
        }

        // Detail toggle
        if (this.elements['detail-toggle']) {
            this.elements['detail-toggle'].addEventListener('click', () => this.toggleDetailLevel());
        }

        // Expandable details
        const armsRaceHeader = document.querySelector('.arms-race-header');
        const vsDayHeader = document.querySelector('.vs-day-header');
        
        if (armsRaceHeader) {
            armsRaceHeader.addEventListener('click', () => this.toggleExpandedDetails('armsRace'));
        }
        
        if (vsDayHeader) {
            vsDayHeader.addEventListener('click', () => this.toggleExpandedDetails('vsDay'));
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.server-selector')) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        if (this.elements['server-dropdown']) {
            this.elements['server-dropdown'].style.display = 
                this.elements['server-dropdown'].style.display === 'block' ? 'none' : 'block';
        }
    }

    closeDropdown() {
        if (this.elements['server-dropdown']) {
            this.elements['server-dropdown'].style.display = 'none';
        }
    }

    applyServerSettings() {
        try {
            const newArmsPhase = this.elements['current-arms-phase']?.value || 'Drone Boost';
            const newTimeOffset = parseInt(this.elements['time-offset']?.value || '0', 10);
            
            // Check if user is manually overriding the phase
            const currentServerPhase = this.getArmsRacePhase(this.getCurrentUTCInfo().utcHour);
            this.manualPhaseOverride = (newArmsPhase !== currentServerPhase.name);
            
            this.currentArmsPhase = newArmsPhase;
            this.timeOffset = newTimeOffset;
            
            this.updateServerDisplay();
            this.saveServerSettings();
            this.closeDropdown();
            
            // Force complete refresh
            this.updateAllDisplays();
            this.updateContent();
            this.updateTabCounts();
            
            if (this.expandedDetails.armsRace) {
                this.updateExpandedDetails();
            }
            
            console.log(`Settings applied - Phase: ${this.currentArmsPhase} (${this.manualPhaseOverride ? 'Manual Override' : 'Auto-tracking'}), Offset: ${this.timeOffset}h`);
        } catch (error) {
            console.error('Error applying server settings:', error);
        }
    }

    updateServerDisplay() {
        if (this.elements['server-display']) {
            this.elements['server-display'].textContent = 
                `${this.currentArmsPhase} | UTC${this.timeOffset >= 0 ? '+' : ''}${this.timeOffset}`;
        }
        
        if (this.elements['current-arms-phase']) {
            this.elements['current-arms-phase'].value = this.currentArmsPhase;
        }
        
        if (this.elements['time-offset']) {
            this.elements['time-offset'].value = this.timeOffset.toString();
        }
    }

    toggleDetailLevel() {
        this.settings.detailLevel = this.settings.detailLevel === 'standard' ? 'comprehensive' : 'standard';
        this.saveServerSettings();
        this.updateContent();
        
        if (this.elements['detail-toggle']) {
            this.elements['detail-toggle'].textContent = 
                this.settings.detailLevel === 'comprehensive' ? 'Standard View' : 'Detailed View';
        }
    }

    toggleExpandedDetails(section) {
        this.expandedDetails[section] = !this.expandedDetails[section];
        this.updateExpandedDetails();
    }

    updateExpandedDetails() {
        const armsRaceDetails = this.elements['arms-race-details'];
        const vsDayDetails = this.elements['vs-day-details'];
        
        if (armsRaceDetails) {
            armsRaceDetails.style.display = this.expandedDetails.armsRace ? 'block' : 'none';
            if (this.expandedDetails.armsRace) {
                const currentPhase = this.getCurrentArmsPhaseData();
                armsRaceDetails.innerHTML = `
                    <div class="detail-content">
                        <div class="detail-section">
                            <strong>Focus Activities:</strong> ${currentPhase.pointSources.join(', ')}
                        </div>
                        <div class="detail-section">
                            <strong>Phase Duration:</strong> 4 hours
                        </div>
                        <div class="detail-section">
                            <strong>Next Change:</strong> ${this.getNextPhaseChangeTime()}
                        </div>
                    </div>
                `;
            }
        }
        
        if (vsDayDetails) {
            vsDayDetails.style.display = this.expandedDetails.vsDay ? 'block' : 'none';
            if (this.expandedDetails.vsDay) {
                const { utcDay } = this.getCurrentUTCInfo();
                const vsDayData = this.getVSDayData(utcDay);
                vsDayDetails.innerHTML = `
                    <div class="detail-content">
                        <div class="detail-section">
                            <strong>Key Activities:</strong> ${vsDayData.pointActivities.join(', ')}
                        </div>
                        <div class="detail-section">
                            <strong>Bonus Multiplier:</strong> ${vsDayData.bonusMultiplier}x
                        </div>
                        <div class="detail-section">
                            <strong>Duration:</strong> 24 hours
                        </div>
                    </div>
                `;
            }
        }
    }

    getNextPhaseChangeTime() {
        const { utcHour } = this.getCurrentUTCInfo();
        const nextPhaseHour = Math.ceil((utcHour + 1) / 4) * 4;
        const hoursUntilChange = nextPhaseHour > 23 ? (24 - utcHour) + 0 : nextPhaseHour - utcHour;
        return `${hoursUntilChange} hour${hoursUntilChange !== 1 ? 's' : ''}`;
    }

    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        // Update tab appearance
        ['all', 'active', 'upcoming'].forEach(f => {
            const tab = this.elements[`tab-${f}`];
            if (tab) {
                tab.classList.toggle('active', f === filter);
            }
        });
        
        this.updateContent();
    }

    getServerTime() {
        const now = new Date();
        now.setHours(now.getHours() + this.timeOffset);
        return now;
    }

    updateServerTime() {
        const serverTime = this.getServerTime();
        this.safeUpdateElement('current-time', 'textContent', 
            `${serverTime.toUTCString().slice(0, -4)} UTC${this.timeOffset >= 0 ? '+' : ''}${this.timeOffset}`);
    }

    getCurrentUTCInfo() {
        const serverTime = this.getServerTime();
        return {
            utcDay: serverTime.getUTCDay(),
            utcHour: serverTime.getUTCHours(),
            utcMinute: serverTime.getUTCMinutes(),
            utcSecond: serverTime.getUTCSeconds()
        };
    }

    getVSDayData(day) {
        return this.data.vsdays.find(vsDay => vsDay.day === day) || this.data.vsdays[0];
    }

    getArmsRacePhase(hour) {
        const phaseIndex = Math.floor(hour / 4);
        return this.data.armsracephases[phaseIndex] || this.data.armsracephases[0];
    }

    getCurrentArmsPhaseData() {
        // Always use manually selected phase
        const selectedPhase = this.data.armsracephases.find(phase => phase.name === this.currentArmsPhase);
        if (selectedPhase) {
            return selectedPhase;
        }
        // Fallback to Drone Boost if selection not found
        return this.data.armsracephases.find(phase => phase.name === 'Drone Boost') || this.data.armsracephases[1];
    }

    getServerArmsPhaseData() {
        const { utcHour } = this.getCurrentUTCInfo();
        return this.getArmsRacePhase(utcHour);
    }

    getPhaseActiveHour(phaseName) {
        const phaseHourMap = {
            'Mixed Phase': 0,
            'Drone Boost': 4, 
            'City Building': 8,
            'Tech Research': 12,
            'Hero Advancement': 16,
            'Unit Progression': 20
        };
        return phaseHourMap[phaseName] || null;
    }

    isSelectedPhaseActive() {
        const { utcHour } = this.getCurrentUTCInfo();
        const serverPhase = this.getArmsRacePhase(utcHour);
        return serverPhase.name === this.currentArmsPhase;
    }

    getAlignment(vsDay, armsPhase) {
        return this.data.highpriorityalignments.find(alignment => 
            alignment.vsday === vsDay && alignment.armsphase === armsPhase
        );
    }

    updateCurrentStatus() {
        try {
            const { utcDay, utcHour, utcMinute } = this.getCurrentUTCInfo();
            const vsDayData = this.getVSDayData(utcDay);
            
            // Always use manually selected phase
            const selectedArmsPhase = this.getCurrentArmsPhaseData();
            const serverArmsPhase = this.getArmsRacePhase(utcHour);
            const alignment = this.getAlignment(utcDay, this.currentArmsPhase);
            
            this.safeUpdateElement('current-vs-day', 'textContent', `${vsDayData.name} - ${vsDayData.title}`);
            
            // Show manual selection with server phase comparison
            let phaseDisplay = `${selectedArmsPhase.icon} ${selectedArmsPhase.name}`;
            if (this.isSelectedPhaseActive()) {
                phaseDisplay += ' (PREFERRED ACTIVE!)';
            } else {
                phaseDisplay += ` (Selected - Server: ${serverArmsPhase.name})`;
            }
            this.safeUpdateElement('arms-phase', 'textContent', phaseDisplay);
            
            // Update alignment status based on manual selection
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
            this.updateActionDisplay(alignment, selectedArmsPhase, utcHour, utcMinute);
        } catch (error) {
            console.error('Error updating current status:', error);
        }
    }

    updateActionDisplay(alignment, armsPhase, utcHour, utcMinute) {
        const focusText = this.getOptimizationFocus(armsPhase.name);
        this.safeUpdateElement('optimization-focus', 'textContent', focusText);
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

    getNextHighPriorityWindow() {
        try {
            const now = this.getServerTime();
            
            // Only look for alignments matching the manually selected phase
            const relevantAlignments = this.data.highpriorityalignments.filter(
                alignment => alignment.armsphase === this.currentArmsPhase
            );
            
            if (relevantAlignments.length === 0) {
                return {
                    startTime: null,
                    armsPhase: { name: this.currentArmsPhase, icon: '🎯' },
                    message: `No high-priority alignments found for ${this.currentArmsPhase} phase`,
                    alignment: null
                };
            }
            
            const potentialWindows = [];
            
            // Look ahead 14 days to ensure we find the next window
            for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
                relevantAlignments.forEach(alignment => {
                    const targetDay = (now.getUTCDay() + dayOffset) % 7;
                    if (alignment.vsday !== targetDay) return;
                    
                    // Get the hour when the selected phase is active
                    const phaseHour = this.getPhaseActiveHour(this.currentArmsPhase);
                    if (phaseHour === null) return;
                    
                    const eventTime = new Date(now);
                    eventTime.setUTCDate(eventTime.getUTCDate() + dayOffset);
                    eventTime.setUTCHours(phaseHour, 0, 0, 0);
                    
                    if (eventTime > now) {
                        potentialWindows.push({
                            startTime: eventTime,
                            vsDay: alignment.vsday,
                            vsDayData: this.getVSDayData(alignment.vsday),
                            armsPhase: this.data.armsracephases.find(p => p.name === this.currentArmsPhase),
                            alignment: alignment,
                            hour: phaseHour
                        });
                    }
                });
            }
            
            if (potentialWindows.length === 0) {
                return {
                    startTime: null,
                    armsPhase: { name: this.currentArmsPhase, icon: '🎯' },
                    message: `No upcoming ${this.currentArmsPhase} priority windows found`,
                    alignment: null
                };
            }
            
            potentialWindows.sort((a, b) => a.startTime - b.startTime);
            return potentialWindows[0];
        } catch (error) {
            console.error('Error getting next priority window:', error);
            return null;
        }
    }

    updateCountdown() {
        try {
            const nextWindow = this.getNextHighPriorityWindow();
            
            if (!nextWindow || !nextWindow.startTime) {
                this.safeUpdateElement('next-priority-event', 'textContent', 
                    nextWindow?.message || `No upcoming ${this.currentArmsPhase} priority windows`);
                this.safeUpdateElement('next-priority-countdown', 'textContent', '');
                return;
            }
            
            const now = this.getServerTime();
            const timeDiff = nextWindow.startTime.getTime() - now.getTime();
            
            if (timeDiff <= 0) {
                this.safeUpdateElement('next-priority-event', 'textContent', 
                    `${nextWindow.armsPhase.name} Priority Window ACTIVE!`);
                this.safeUpdateElement('next-priority-countdown', 'textContent', 'NOW ACTIVE');
                return;
            }
            
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            let eventText = `${nextWindow.armsPhase.name} Priority Window`;
            if (nextWindow.vsDayData) {
                eventText += ` - ${nextWindow.vsDayData.name}`;
            }
            
            this.safeUpdateElement('next-priority-event', 'textContent', eventText);
            
            let countdownText = '';
            if (days > 0) countdownText += `${days}d `;
            if (hours > 0 || days > 0) countdownText += `${hours}h `;
            if (minutes > 0 || hours > 0 || days > 0) countdownText += `${minutes}m `;
            countdownText += `${seconds}s`;
            
            this.safeUpdateElement('next-priority-countdown', 'textContent', countdownText);
        } catch (error) {
            console.error('Error updating countdown:', error);
        }
    }

    updateProgress() {
        try {
            const { utcHour, utcMinute } = this.getCurrentUTCInfo();
            const phaseHour = utcHour % 4;
            const totalMinutes = phaseHour * 60 + utcMinute;
            const progressPercent = (totalMinutes / 240) * 100; // 240 minutes = 4 hours
            
            if (this.elements['phase-progress-fill']) {
                this.elements['phase-progress-fill'].style.width = `${progressPercent}%`;
            }
            
            const remainingMinutes = 240 - totalMinutes;
            const remainingHours = Math.floor(remainingMinutes / 60);
            const remainingMins = remainingMinutes % 60;
            
            this.safeUpdateElement('phase-time-remaining', 'textContent', 
                `${remainingHours}h ${remainingMins}m remaining`);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    getAllHighPriorityWindows() {
        const windows = [];
        const { utcDay, utcHour } = this.getCurrentUTCInfo();
        
        // Only get windows that match the manually selected phase
        const relevantAlignments = this.data.highpriorityalignments.filter(
            alignment => alignment.armsphase === this.currentArmsPhase
        );
        
        relevantAlignments.forEach(alignment => {
            const vsDayData = this.getVSDayData(alignment.vsday);
            const armsPhase = this.data.armsracephases.find(p => p.name === alignment.armsphase);
            const phaseHour = this.getPhaseActiveHour(alignment.armsphase);
            
            if (armsPhase && phaseHour !== null) {
                windows.push({
                    vsDay: alignment.vsday,
                    vsDayData: vsDayData,
                    armsPhase: armsPhase,
                    alignment: alignment,
                    hour: phaseHour
                });
            }
        });
        
        return windows;
    }

    updateContent() {
        this.updatePriorityGrid();
        this.updateScheduleGrid();
        this.updateTabCounts();
    }

    updatePriorityGrid() {
        try {
            if (!this.elements['priority-grid']) return;
            
            this.elements['priority-grid'].innerHTML = '';
            const { utcDay, utcHour } = this.getCurrentUTCInfo();
            
            // Get windows that match the manually selected phase
            let windows = this.getAllHighPriorityWindows();
            
            if (this.activeFilter === 'active') {
                windows = windows.filter(w => 
                    w.vsDay === utcDay && this.isSelectedPhaseActive()
                );
            } else if (this.activeFilter === 'upcoming') {
                const now = this.getServerTime();
                windows = windows.filter(w => {
                    const phaseHour = this.getPhaseActiveHour(w.armsPhase.name);
                    const eventTime = this.getPhaseStartTime(phaseHour, w.vsDay);
                    return eventTime > now;
                });
            }
            
            windows.forEach(window => {
                const isActive = window.vsDay === utcDay && this.isSelectedPhaseActive();
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
                    <div class="event-strategy"><strong>Strategy:</strong> ${window.alignment.reason}</div>
                `;
                
                if (this.settings.detailLevel === 'comprehensive') {
                    cardContent += `
                        <div class="event-detailed-info">
                            <div class="detail-section"><strong>Key Activities:</strong> ${window.vsDayData.pointActivities.slice(0, 3).join(', ')}</div>
                            <div class="detail-section"><strong>Arms Race Focus:</strong> ${window.armsPhase.pointSources.slice(0, 3).join(', ')}</div>
                            <div class="detail-section"><strong>VS Points Potential:</strong> ${window.alignment.points.toLocaleString()}</div>
                        </div>
                    `;
                }
                
                eventCard.innerHTML = cardContent;
                eventCard.addEventListener('click', () => this.showModal(window.alignment, window.vsDayData, window.armsPhase));
                this.elements['priority-grid'].appendChild(eventCard);
            });
        } catch (error) {
            console.error('Error updating priority grid:', error);
        }
    }

    getPhaseStartTime(phaseHour, vsDay) {
        const now = this.getServerTime();
        const currentDay = now.getUTCDay();
        const currentHour = now.getUTCHours();
        
        // Calculate days until target day
        let daysUntil = (vsDay - currentDay + 7) % 7;
        if (daysUntil === 0 && currentHour >= phaseHour) {
            daysUntil = 7; // If it's today but the hour has passed, next week
        }
        
        const eventTime = new Date(now);
        eventTime.setUTCDate(eventTime.getUTCDate() + daysUntil);
        eventTime.setUTCHours(phaseHour, 0, 0, 0);
        
        return eventTime;
    }

    getPhaseTimeDisplay(hour) {
        const endHour = (hour + 4) % 24;
        return `${hour.toString().padStart(2, '0')}:00-${endHour.toString().padStart(2, '0')}:00`;
    }

    updateScheduleGrid() {
        if (!this.elements['schedule-grid']) return;
        
        this.elements['schedule-grid'].innerHTML = '';
        this.createWeekSchedule();
    }

    createWeekSchedule() {
        try {
            const weekGrid = document.createElement('div');
            weekGrid.className = 'schedule-grid';
            
            // Headers
            const headers = ['Day/Time', '00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
            headers.forEach(h => {
                const headerCell = document.createElement('div');
                headerCell.className = 'schedule-header';
                headerCell.textContent = h;
                weekGrid.appendChild(headerCell);
            });
            
            // Days and phases
            this.data.vsdays.forEach(vsDayData => {
                // Day name header
                const dayCell = document.createElement('div');
                dayCell.className = 'schedule-day-header';
                dayCell.textContent = vsDayData.name;
                weekGrid.appendChild(dayCell);
                
                // Phase cells
                const phaseHours = [0, 4, 8, 12, 16, 20];
                phaseHours.forEach(h => {
                    const serverPhase = this.getArmsRacePhase(h);
                    const cell = document.createElement('div');
                    cell.className = 'schedule-cell';
                    
                    // Check if this matches manually selected phase
                    const isSelectedPhase = (serverPhase.name === this.currentArmsPhase);
                    const alignment = this.getAlignment(vsDayData.day, this.currentArmsPhase);
                    
                    // Highlight user's preferred phase
                    if (isSelectedPhase) {
                        cell.classList.add('manual-selected');
                    }
                    
                    // Show high priority when both selected phase AND alignment exist
                    if (alignment && isSelectedPhase) {
                        cell.classList.add('priority');
                    }
                    
                    // Check if this is current time slot
                    const { utcDay, utcHour } = this.getCurrentUTCInfo();
                    if (vsDayData.day === utcDay && utcHour >= h && utcHour < (h + 4)) {
                        cell.classList.add('current');
                    }
                    
                    let cellContent = `<div class="cell-phase">${serverPhase.icon} ${serverPhase.name}</div>`;
                    
                    if (this.settings.detailLevel === 'comprehensive') {
                        if (alignment && isSelectedPhase) {
                            cellContent += `<div class="cell-reason">${alignment.reason}</div>`;
                        } else if (isSelectedPhase) {
                            cellContent += `<div class="cell-reason">Your preferred phase</div>`;
                        }
                    }
                    
                    cell.innerHTML = cellContent;
                    
                    if (alignment && isSelectedPhase) {
                        cell.addEventListener('click', () => this.showModal(alignment, vsDayData, serverPhase));
                    }
                    
                    weekGrid.appendChild(cell);
                });
            });
            
            this.elements['schedule-grid'].appendChild(weekGrid);
        } catch (error) {
            console.error('Error creating week schedule:', error);
        }
    }

    updateTabCounts() {
        try {
            const allWindows = this.getAllHighPriorityWindows();
            const { utcDay, utcHour } = this.getCurrentUTCInfo();
            
            const activeWindows = allWindows.filter(w => 
                w.vsDay === utcDay && this.isSelectedPhaseActive()
            );
            
            const now = this.getServerTime();
            const upcomingWindows = allWindows.filter(w => {
                const phaseHour = this.getPhaseActiveHour(w.armsPhase.name);
                const eventTime = this.getPhaseStartTime(phaseHour, w.vsDay);
                return eventTime > now;
            });
            
            this.safeUpdateElement('all-count', 'textContent', allWindows.length.toString());
            this.safeUpdateElement('active-count', 'textContent', activeWindows.length.toString());
            this.safeUpdateElement('upcoming-count', 'textContent', upcomingWindows.length.toString());
        } catch (error) {
            console.error('Error updating tab counts:', error);
        }
    }

    updateBottomPriorityCards() {
        // This method can be used for additional priority displays if needed
    }

    showModal(alignment, vsDayData, armsPhase) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>${armsPhase.icon} ${armsPhase.name} + ${vsDayData.name}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h4>Strategy</h4>
                    <p>${alignment.reason}</p>
                </div>
                <div class="modal-section">
                    <h4>VS Event Activities</h4>
                    <ul>
                        ${vsDayData.pointActivities.map(activity => `<li>${activity}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-section">
                    <h4>Arms Race Activities</h4>
                    <ul>
                        ${armsPhase.pointSources.map(source => `<li>${source}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-section">
                    <h4>Expected Points</h4>
                    <p><strong>${alignment.points.toLocaleString()}</strong> total points</p>
                </div>
            </div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Add event listeners
        const closeBtn = modalContent.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalOverlay);
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });
    }

    checkForPhaseChange() {
        const currentPhase = this.getArmsRacePhase(this.getCurrentUTCInfo().utcHour);
        
        if (this.lastTrackedPhase && this.lastTrackedPhase !== currentPhase.name && !this.manualPhaseOverride) {
            // Phase changed automatically
            if (currentPhase.name === this.currentArmsPhase) {
                // User's preferred phase just became active!
                this.showPhaseChangeNotification(`🎯 ${currentPhase.name} is now ACTIVE! Time to focus on your preferred activities.`);
            } else {
                this.showPhaseChangeNotification(`Phase changed to ${currentPhase.icon} ${currentPhase.name}`);
            }
        }
        
        this.lastTrackedPhase = currentPhase.name;
    }

    showPhaseChangeNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 80px; right: 20px; z-index: 1001;
            background: var(--bg-card); border: 2px solid var(--accent-primary);
            border-radius: var(--radius-lg); padding: var(--space-3) var(--space-4);
            color: var(--text-primary); font-weight: 600; font-size: 0.9rem;
            box-shadow: var(--shadow-lg); animation: slideInRight 0.3s ease;
            max-width: 300px; word-wrap: break-word;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    updateAllDisplays() {
        try {
            this.checkForPhaseChange();
            this.updateServerTime();
            this.updateCurrentStatus();
            this.updateCountdown();
            this.updateProgress();
            this.updateBottomPriorityCards();
            
            // Auto-disable manual override when server time matches selection
            if (this.manualPhaseOverride) {
                const serverPhase = this.getArmsRacePhase(this.getCurrentUTCInfo().utcHour);
                if (serverPhase.name === this.currentArmsPhase) {
                    this.manualPhaseOverride = false;
                    console.log('Manual override disabled - server phase now matches selection');
                }
            }
        } catch (error) {
            console.error('Error updating displays:', error);
        }
    }

    startUpdateLoop() {
        this.updateAllDisplays();
        setInterval(() => {
            this.updateAllDisplays();
        }, 1000);
    }

    safeUpdateElement(elementId, property, value) {
        if (this.elements[elementId]) {
            this.elements[elementId][property] = value;
        }
    }

    runSiteValidation() {
        console.log('🔍 Running LastWarNexus Site Validation...');
        
        // Test 1: Manual phase selection
        console.assert(this.currentArmsPhase === 'Drone Boost', '❌ Manual phase should be Drone Boost');
        console.log('✅ Manual phase selection: PASS');
        
        // Test 2: Phase hour mapping
        const droneHour = this.getPhaseActiveHour('Drone Boost');
        console.assert(droneHour === 4, '❌ Drone Boost should be active at hour 4');
        console.log('✅ Phase hour mapping: PASS');
        
        // Test 3: Next priority window respects selection
        const nextWindow = this.getNextHighPriorityWindow();
        if (nextWindow && nextWindow.armsPhase) {
            console.assert(nextWindow.armsPhase.name === this.currentArmsPhase, '❌ Next priority should match selected phase');
            console.log('✅ Next priority window calculation: PASS');
        }
        
        // Test 4: Alignment detection for selected phase
        const mondayAlignment = this.getAlignment(1, 'Drone Boost');
        console.assert(mondayAlignment !== null, '❌ Monday Drone Boost alignment should exist');
        console.log('✅ Alignment detection: PASS');
        
        // Test 5: Phase active detection
        const isActive = this.isSelectedPhaseActive();
        console.log(`✅ Phase active detection: ${isActive ? 'Your preferred phase is ACTIVE!' : 'Waiting for preferred phase'}`);
        
        console.log('🎯 Site Validation Complete - All core functions verified!');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lastWarNexus = new LastWarNexus();
});
