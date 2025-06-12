class VSPointsOptimizer {
    constructor() {
        this.elements = {};
        this.settings = {
            timeFormat: 'utc',
            timeOffset: 0,
            detailLevel: 'essential',
            currentArmsPhase: 'Tech Research',
            nextArmsPhase: 'Drone Boost',
            notificationAlerts: '15min',
            phaseAlerts: '10min',
            firstVisit: true,
            eventOrder: [],
            lastPhaseCheck: null
        };
        this.currentDay = '';
        this.armsRacePhases = [
            'Tech Research',
            'Drone Boost', 
            'Hero Advancement',
            'City Building',
            'Unit Progression'
        ];
        this.isInitialized = false;
        this.bottomBarCollapsed = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.loadSettings();
        this.setupEventListeners();
        this.startTimeUpdates();
        
        setTimeout(() => {
            this.checkRequiredSetup();
        }, 500);
        
        this.isInitialized = true;
        console.log('VS Points Optimizer initialized successfully');
    }

    cacheElements() {
        const elementIds = [
            'server-time', 'current-vs-day', 'arms-phase', 'next-alignment-countdown',
            'next-priority-time', 'next-priority-event', 'countdown-timer', 'event-name',
            'event-time', 'current-action', 'action-text', 'strategy-rating',
            'optimization-focus', 'priority-level', 'time-remaining', 'efficiency-level',
            'event-day-gaming', 'priority-progress-fill', 'progress-fill', 'progress-text',
            'server-toggle', 'server-dropdown', 'current-arms-phase', 'next-arms-phase',
            'time-offset', 'current-phase-display', 'next-phase-display', 'server-time-display',
            'offset-display', 'apply-server', 'settings-toggle', 'settings-dropdown',
            'time-format-dropdown', 'detail-level-dropdown', 'notification-alerts', 'phase-alerts',
            'priority-grid', 'schedule-grid', 'intelligence-content', 'priority-count',
            'active-now', 'active-action', 'badge-label', 'countdown-label',
            
            'initial-setup-modal', 'arms-race-modal', 'enable-notifications', 'skip-notifications',
            'setup-time-offset', 'setup-current-phase', 'setup-next-phase', 'setup-server-time',
            'complete-setup', 'skip-setup', 'update-current-phase', 'update-next-phase',
            'update-arms-race', 'cancel-arms-update',
            
            'bottom-events-bar', 'events-bar-toggle', 'events-bar-content', 'bottom-events-grid',
            'events-count', 'bar-toggle-text', 'bar-toggle-icon'
        ];

        elementIds.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });

        this.elements.tabButtons = document.querySelectorAll('.tab-btn');
        this.elements.tabPanels = document.querySelectorAll('.tab-panel');
        this.elements.filterButtons = document.querySelectorAll('.filter-btn');
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('vsPointsSettings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('vsPointsSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    setupEventListeners() {
        this.setupDropdownToggle('server-toggle', 'server-dropdown');
        this.setupDropdownToggle('settings-toggle', 'settings-dropdown');

        if (this.elements['current-arms-phase']) {
            this.elements['current-arms-phase'].addEventListener('change', (e) => {
                this.settings.currentArmsPhase = e.target.value;
                this.updatePhaseDisplays();
            });
        }

        if (this.elements['next-arms-phase']) {
            this.elements['next-arms-phase'].addEventListener('change', (e) => {
                this.settings.nextArmsPhase = e.target.value;
                this.updatePhaseDisplays();
            });
        }

        if (this.elements['time-offset']) {
            this.elements['time-offset'].addEventListener('change', (e) => {
                this.settings.timeOffset = parseInt(e.target.value);
                this.updateServerTime();
                this.updateOffsetDisplay();
            });
        }

        if (this.elements['apply-server']) {
            this.elements['apply-server'].addEventListener('click', () => {
                this.saveSettings();
                this.updateAllDisplays();
                this.closeDropdown('server-dropdown');
                this.showNotification('Server settings updated successfully');
            });
        }

        if (this.elements['time-format-dropdown']) {
            this.elements['time-format-dropdown'].addEventListener('change', (e) => {
                this.settings.timeFormat = e.target.value;
                this.saveSettings();
                this.updateAllDisplays();
            });
        }

        if (this.elements['detail-level-dropdown']) {
            this.elements['detail-level-dropdown'].addEventListener('change', (e) => {
                this.settings.detailLevel = e.target.value;
                this.saveSettings();
                this.updateAllDisplays();
                this.populateAllSections();
            });
        }

        if (this.elements['notification-alerts']) {
            this.elements['notification-alerts'].addEventListener('change', (e) => {
                this.settings.notificationAlerts = e.target.value;
                this.saveSettings();
            });
        }

        if (this.elements['phase-alerts']) {
            this.elements['phase-alerts'].addEventListener('change', (e) => {
                this.settings.phaseAlerts = e.target.value;
                this.saveSettings();
            });
        }

        this.elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchTab(tabName);
            });
        });

        this.elements.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                this.applyFilter(filter);
            });
        });

        this.setupInitialModal();
        this.setupArmsRaceModal();
        this.setupBottomEventsBar();

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.server-dropdown-container')) {
                this.closeDropdown('server-dropdown');
            }
            if (!e.target.closest('.settings-dropdown-container')) {
                this.closeDropdown('settings-dropdown');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.closeAllModals();
            }
        });
    }

    setupInitialModal() {
        const enableNotifications = this.elements['enable-notifications'];
        const skipNotifications = this.elements['skip-notifications'];
        const timeOffset = this.elements['setup-time-offset'];
        const completeSetup = this.elements['complete-setup'];
        const skipSetup = this.elements['skip-setup'];

        if (enableNotifications) {
            enableNotifications.addEventListener('click', () => {
                this.requestNotificationPermission();
            });
        }

        if (timeOffset) {
            timeOffset.addEventListener('change', () => {
                this.updateSetupServerTime();
            });
        }

        if (completeSetup) {
            completeSetup.addEventListener('click', () => {
                this.completeInitialSetup();
            });
        }

        if (skipSetup) {
            skipSetup.addEventListener('click', () => {
                this.skipInitialSetup();
            });
        }

        this.updateSetupServerTime();
    }

    setupArmsRaceModal() {
        const updateButton = this.elements['update-arms-race'];
        const cancelButton = this.elements['cancel-arms-update'];

        if (updateButton) {
            updateButton.addEventListener('click', () => {
                this.updateArmsRacePhases();
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.closeModal('arms-race-modal');
            });
        }
    }

    setupBottomEventsBar() {
        const toggle = this.elements['events-bar-toggle'];
        const bar = this.elements['bottom-events-bar'];

        if (toggle && bar) {
            toggle.addEventListener('click', () => {
                this.toggleBottomEventsBar();
            });
        }

        if (bar) {
            if (this.bottomBarCollapsed) {
                bar.classList.add('collapsed');
            }
            this.updateBottomBarText();
        }
    }

    checkRequiredSetup() {
        const setupType = this.determineRequiredSetup();
        
        switch (setupType) {
            case 'full_initial_setup':
                this.showInitialSetupModal();
                break;
            case 'arms_race_only':
                this.showArmsRaceModal();
                break;
            case 'none_needed':
                this.populateAllSections();
                break;
        }
    }

    determineRequiredSetup() {
        const hasAnySettings = Object.keys(localStorage).some(key => 
            key.startsWith('vsPoints') || key === 'vsPointsSettings'
        );
        
        if (!hasAnySettings || this.settings.firstVisit) {
            return 'full_initial_setup';
        }
        
        const armsRaceStatus = this.checkArmsRaceDataValidity();
        if (armsRaceStatus !== 'valid') {
            return 'arms_race_only';
        }
        
        return 'none_needed';
    }

    checkArmsRaceDataValidity() {
        if (!this.settings.currentArmsPhase || !this.settings.nextArmsPhase) {
            return 'missing_phases';
        }
        
        if (this.settings.currentArmsPhase === this.settings.nextArmsPhase) {
            return 'invalid_phases';
        }
        
        try {
            const prediction = this.getCurrentArmsPhaseInfo();
            if (!prediction || !prediction.name) {
                return 'calculation_error';
            }
        } catch (error) {
            return 'calculation_error';
        }
        
        return 'valid';
    }

    showInitialSetupModal() {
        const modal = this.elements['initial-setup-modal'];
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            
            if (this.elements['setup-time-offset']) {
                this.elements['setup-time-offset'].value = this.settings.timeOffset;
            }
            if (this.elements['setup-current-phase']) {
                this.elements['setup-current-phase'].value = this.settings.currentArmsPhase;
            }
            if (this.elements['setup-next-phase']) {
                this.elements['setup-next-phase'].value = this.settings.nextArmsPhase;
            }
            
            this.updateSetupServerTime();
        }
    }

    showArmsRaceModal() {
        const modal = this.elements['arms-race-modal'];
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            
            if (this.elements['update-current-phase']) {
                this.elements['update-current-phase'].value = this.settings.currentArmsPhase;
            }
            if (this.elements['update-next-phase']) {
                this.elements['update-next-phase'].value = this.settings.nextArmsPhase;
            }
        }
    }

    closeModal(modalId) {
        const modal = this.elements[modalId];
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }

    closeAllModals() {
        ['initial-setup-modal', 'arms-race-modal'].forEach(modalId => {
            this.closeModal(modalId);
        });
    }

    completeInitialSetup() {
        if (this.elements['setup-time-offset']) {
            this.settings.timeOffset = parseInt(this.elements['setup-time-offset'].value);
        }
        if (this.elements['setup-current-phase']) {
            this.settings.currentArmsPhase = this.elements['setup-current-phase'].value;
        }
        if (this.elements['setup-next-phase']) {
            this.settings.nextArmsPhase = this.elements['setup-next-phase'].value;
        }
        
        this.settings.firstVisit = false;
        this.saveSettings();
        
        this.closeModal('initial-setup-modal');
        this.updateAllDisplays();
        this.populateAllSections();
        
        this.showNotification('Setup completed successfully!');
    }

    skipInitialSetup() {
        this.settings.firstVisit = false;
        this.saveSettings();
        
        this.closeModal('initial-setup-modal');
        this.populateAllSections();
    }

    updateArmsRacePhases() {
        if (this.elements['update-current-phase']) {
            this.settings.currentArmsPhase = this.elements['update-current-phase'].value;
        }
        if (this.elements['update-next-phase']) {
            this.settings.nextArmsPhase = this.elements['update-next-phase'].value;
        }
        
        this.saveSettings();
        this.closeModal('arms-race-modal');
        this.updateAllDisplays();
        this.populateAllSections();
        
        this.showNotification('Arms Race phases updated successfully!');
    }

    requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification('Notifications enabled successfully!');
                } else {
                    this.showNotification('Notifications permission denied', 'warning');
                }
            });
        }
    }

    updateSetupServerTime() {
        const offset = this.elements['setup-time-offset'] ? 
            parseInt(this.elements['setup-time-offset'].value) : 0;
        const serverTime = this.getServerTime(offset);
        
        if (this.elements['setup-server-time']) {
            this.elements['setup-server-time'].textContent = 
                serverTime.toLocaleTimeString('en-US', { hour12: false });
        }
    }

    toggleBottomEventsBar() {
        const bar = this.elements['bottom-events-bar'];
        if (bar) {
            this.bottomBarCollapsed = !this.bottomBarCollapsed;
            
            if (this.bottomBarCollapsed) {
                bar.classList.add('collapsed');
            } else {
                bar.classList.remove('collapsed');
            }
            
            this.updateBottomBarText();
        }
    }

    updateBottomBarText() {
        const textElement = this.elements['bar-toggle-text'];
        if (textElement) {
            textElement.textContent = this.bottomBarCollapsed ? 'Expand' : 'Collapse';
        }
    }

    setupDropdownToggle(buttonId, dropdownId) {
        const button = this.elements[buttonId];
        const dropdown = this.elements[dropdownId];
        
        if (button && dropdown) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const isActive = dropdown.classList.contains('active');
                
                this.closeAllDropdowns();
                
                if (!isActive) {
                    dropdown.classList.add('active');
                    button.classList.add('active');
                }
            });
        }
    }

    closeDropdown(dropdownId) {
        const dropdown = this.elements[dropdownId];
        if (dropdown) {
            dropdown.classList.remove('active');
            
            const buttonId = dropdownId.replace('-dropdown', '-toggle');
            const button = this.elements[buttonId];
            if (button) {
                button.classList.remove('active');
            }
        }
    }

    closeAllDropdowns() {
        ['server-dropdown', 'settings-dropdown'].forEach(id => {
            this.closeDropdown(id);
        });
    }

    startTimeUpdates() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const serverTime = this.getServerTime();
        const timeString = this.formatTime(serverTime);
        
        this.safeUpdateElement('server-time', 'textContent', timeString);
        this.safeUpdateElement('server-time-display', 'textContent', timeString);
        
        this.updateCurrentDay();
        this.updateCountdowns();
        this.updateArmsRaceInfo();
        this.checkPhaseTransition();
    }

    getServerTime(customOffset = null) {
        const now = new Date();
        const offset = customOffset !== null ? customOffset : this.settings.timeOffset;
        return new Date(now.getTime() + (offset * 60 * 60 * 1000));
    }

    formatTime(date) {
        if (this.settings.timeFormat === 'local') {
            return date.toLocaleTimeString();
        }
        return date.toLocaleTimeString('en-US', { 
            hour12: false,
            timeZone: 'UTC'
        });
    }

    updateCurrentDay() {
        const serverTime = this.getServerTime();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDay = days[serverTime.getUTCDay()];
        
        if (this.currentDay !== currentDay) {
            this.currentDay = currentDay;
            this.safeUpdateElement('current-vs-day', 'textContent', currentDay);
            this.populateAllSections();
        }
    }

    updateCountdowns() {
        const serverTime = this.getServerTime();
        const nextPhaseTime = this.getNextPhaseTime(serverTime);
        const timeUntilPhase = nextPhaseTime.getTime() - serverTime.getTime();
        
        if (timeUntilPhase > 0) {
            const countdown = this.formatCountdown(timeUntilPhase);
            this.safeUpdateElement('countdown-timer', 'textContent', countdown);
            this.safeUpdateElement('next-alignment-countdown', 'textContent', countdown);
            
            const totalPhaseTime = 4 * 60 * 60 * 1000;
            const currentPhaseStart = this.getCurrentPhaseStartTime(serverTime);
            const elapsed = serverTime.getTime() - currentPhaseStart.getTime();
            const progress = Math.max(0, Math.min(100, (elapsed / totalPhaseTime) * 100));
            
            this.safeUpdateElement('progress-fill', 'style', `width: ${progress}%`);
        }
        
        this.updatePriorityCountdowns();
    }

    getNextPhaseTime(currentTime) {
        const hour = currentTime.getUTCHours();
        const minute = currentTime.getUTCMinutes();
        const second = currentTime.getUTCSeconds();
        
        const hoursUntilNext = 4 - (hour % 4);
        const nextPhaseTime = new Date(currentTime);
        
        if (hoursUntilNext === 4 && minute === 0 && second === 0) {
            nextPhaseTime.setUTCHours(hour + 4, 0, 0, 0);
        } else if (hoursUntilNext === 4) {
            nextPhaseTime.setUTCHours(hour + (4 - (hour % 4)), 0, 0, 0);
        } else {
            nextPhaseTime.setUTCHours(hour + hoursUntilNext, 0, 0, 0);
        }
        
        if (nextPhaseTime.getUTCHours() >= 24) {
            nextPhaseTime.setUTCDate(nextPhaseTime.getUTCDate() + 1);
            nextPhaseTime.setUTCHours(nextPhaseTime.getUTCHours() - 24, 0, 0, 0);
        }
        
        return nextPhaseTime;
    }

    getCurrentPhaseStartTime(currentTime) {
        const hour = currentTime.getUTCHours();
        const phaseStartHour = Math.floor(hour / 4) * 4;
        const phaseStartTime = new Date(currentTime);
        phaseStartTime.setUTCHours(phaseStartHour, 0, 0, 0);
        return phaseStartTime;
    }

    updatePriorityCountdowns() {
        const serverTime = this.getServerTime();
        const nextPriorityWindow = this.getNextPriorityWindow(serverTime);
        
        if (nextPriorityWindow) {
            const timeUntil = nextPriorityWindow.startTime.getTime() - serverTime.getTime();
            
            if (timeUntil > 0) {
                const countdown = this.formatCountdown(timeUntil);
                this.safeUpdateElement('next-priority-time', 'textContent', countdown);
                this.safeUpdateElement('next-priority-event', 'textContent', nextPriorityWindow.name);
                this.safeUpdateElement('event-day-gaming', 'textContent', 
                    nextPriorityWindow.startTime.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC'
                    }) + ' UTC');
                this.safeUpdateElement('current-action', 'textContent', nextPriorityWindow.action);
                this.safeUpdateElement('efficiency-level', 'textContent', nextPriorityWindow.efficiency);
                
                const activeNow = this.elements['active-now'];
                if (timeUntil <= 0 && timeUntil > -nextPriorityWindow.duration) {
                    if (activeNow) {
                        activeNow.style.display = 'flex';
                        this.safeUpdateElement('active-action', 'textContent', nextPriorityWindow.action);
                    }
                } else {
                    if (activeNow) {
                        activeNow.style.display = 'none';
                    }
                }
                
                const totalTime = 24 * 60 * 60 * 1000;
                const timeSinceLastPriority = totalTime - timeUntil;
                const priorityProgress = Math.max(0, Math.min(100, (timeSinceLastPriority / totalTime) * 100));
                this.safeUpdateElement('priority-progress-fill', 'style', `width: ${priorityProgress}%`);
            }
        }
    }

    getCurrentArmsPhaseInfo() {
        const serverTime = this.getServerTime();
        const currentPhase = this.settings.currentArmsPhase;
        const nextPhase = this.settings.nextArmsPhase;
        
        const nextPhaseTime = this.getNextPhaseTime(serverTime);
        
        return {
            name: currentPhase,
            nextPhase: nextPhase,
            nextPhaseTime: nextPhaseTime,
            isValid: true
        };
    }

    checkPhaseTransition() {
        const serverTime = this.getServerTime();
        const hour = serverTime.getUTCHours();
        const minute = serverTime.getUTCMinutes();
        const second = serverTime.getUTCSeconds();
        
        if (minute === 0 && second === 0 && hour % 4 === 0) {
            this.autoRotatePhases();
        }
    }

    autoRotatePhases() {
        const nextIndex = this.armsRacePhases.indexOf(this.settings.nextArmsPhase);
        
        this.settings.currentArmsPhase = this.settings.nextArmsPhase;
        
        const futureNextIndex = (nextIndex + 1) % this.armsRacePhases.length;
        this.settings.nextArmsPhase = this.armsRacePhases[futureNextIndex];
        
        this.saveSettings();
        this.updateAllDisplays();
        
        if (this.settings.phaseAlerts !== 'off') {
            this.sendPhaseChangeNotification();
        }
    }

    updateArmsRaceInfo() {
        const phaseInfo = this.getCurrentArmsPhaseInfo();
        
        this.safeUpdateElement('arms-phase', 'textContent', phaseInfo.name);
        this.safeUpdateElement('current-phase-display', 'textContent', phaseInfo.name);
        this.safeUpdateElement('next-phase-display', 'textContent', phaseInfo.nextPhase);
        this.safeUpdateElement('event-name', 'textContent', `${phaseInfo.nextPhase} Phase`);
        
        if (phaseInfo.nextPhaseTime) {
            const timeString = this.formatTime(phaseInfo.nextPhaseTime);
            this.safeUpdateElement('event-time', 'textContent', `${timeString} Server Time`);
        }
    }

    updatePhaseDisplays() {
        this.safeUpdateElement('current-phase-display', 'textContent', this.settings.currentArmsPhase);
        this.safeUpdateElement('next-phase-display', 'textContent', this.settings.nextArmsPhase);
        
        if (this.elements['current-arms-phase']) {
            this.elements['current-arms-phase'].value = this.settings.currentArmsPhase;
        }
        if (this.elements['next-arms-phase']) {
            this.elements['next-arms-phase'].value = this.settings.nextArmsPhase;
        }
    }

    updateServerTime() {
        const serverTime = this.getServerTime();
        const timeString = this.formatTime(serverTime);
        this.safeUpdateElement('server-time-display', 'textContent', timeString);
    }

    updateOffsetDisplay() {
        const offsetText = this.settings.timeOffset >= 0 ? 
            `UTC +${this.settings.timeOffset}` : 
            `UTC ${this.settings.timeOffset}`;
        this.safeUpdateElement('offset-display', 'textContent', offsetText);
    }

    formatCountdown(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        } else {
            return `${seconds}s`;
        }
    }

    getNextPriorityWindow(currentTime) {
        const priorityWindows = this.generatePriorityWindows(currentTime);
        
        return priorityWindows.find(window => 
            window.startTime > currentTime
        ) || priorityWindows[0];
    }

    generatePriorityWindows(baseTime) {
        const windows = [];
        const serverTime = this.getServerTime();
        
        for (let i = 0; i < 4; i++) {
            const windowStart = new Date(serverTime.getTime() + (i + 1) * 6 * 60 * 60 * 1000);
            
            const phaseAtTime = this.getPhaseAtTime(windowStart);
            const vsActivityAtTime = this.getVSActivityForDay(windowStart.getUTCDay());
            
            if (phaseAtTime && vsActivityAtTime && this.activitiesOverlap(vsActivityAtTime, phaseAtTime)) {
                windows.push({
                    name: `${vsActivityAtTime.name} + ${phaseAtTime.name}`,
                    startTime: windowStart,
                    duration: 2 * 60 * 60 * 1000,
                    efficiency: 'High',
                    action: `Use ${vsActivityAtTime.speedups} for maximum points`,
                    priority: 'high'
                });
            } else {
                windows.push({
                    name: `${this.getDayName(windowStart.getUTCDay())} Window`,
                    startTime: windowStart,
                    duration: 1 * 60 * 60 * 1000,
                    efficiency: 'Medium',
                    action: 'Standard activities earn regular points',
                    priority: 'medium'
                });
            }
        }
        
        return windows.sort((a, b) => a.startTime - b.startTime);
    }

    getPhaseAtTime(time) {
        const hour = time.getUTCHours();
        const phaseIndex = Math.floor(hour / 4) % this.armsRacePhases.length;
        return {
            name: this.armsRacePhases[phaseIndex],
            type: this.getPhaseType(this.armsRacePhases[phaseIndex])
        };
    }

    getPhaseType(phaseName) {
        const phaseTypes = {
            'Tech Research': 'research',
            'Drone Boost': 'drones',
            'Hero Advancement': 'heroes',
            'City Building': 'building',
            'Unit Progression': 'training'
        };
        return phaseTypes[phaseName] || 'unknown';
    }

    getVSActivityForDay(dayIndex) {
        const activities = {
            0: { name: 'Sunday Research', speedups: 'research speedups', type: 'research' },
            1: { name: 'Monday Building', speedups: 'building speedups', type: 'building' },
            2: { name: 'Tuesday Training', speedups: 'training speedups', type: 'training' },
            3: { name: 'Wednesday Research', speedups: 'research speedups', type: 'research' },
            4: { name: 'Thursday Building', speedups: 'building speedups', type: 'building' },
            5: { name: 'Friday Training', speedups: 'training speedups', type: 'training' },
            6: { name: 'Saturday Research', speedups: 'research speedups', type: 'research' }
        };
        return activities[dayIndex];
    }

    getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }

    getVSActivities() {
        const serverTime = this.getServerTime();
        const day = serverTime.getUTCDay();
        return [this.getVSActivityForDay(day)].filter(Boolean);
    }

    getArmsRaceActivities(phase) {
        return [{
            name: phase,
            type: this.getPhaseType(phase)
        }];
    }

    activitiesOverlap(vsActivity, armsActivity) {
        return vsActivity.type === armsActivity.type;
    }

    populateAllSections() {
        this.populatePriorityGrid();
        this.populateScheduleGrid();
        this.populateIntelligenceHub();
        this.populateBottomEventsBar();
    }

    populatePriorityGrid() {
        const grid = this.elements['priority-grid'];
        if (!grid) return;
        
        const windows = this.generatePriorityWindows(this.getServerTime());
        const filteredWindows = this.settings.detailLevel === 'comprehensive' ? 
            windows : windows.slice(0, 6);
        
        grid.innerHTML = filteredWindows.map(window => `
            <div class="priority-window-card ${window.priority}">
                <div class="window-header">
                    <h3>${window.name}</h3>
                    <span class="efficiency-badge">${window.efficiency}</span>
                </div>
                <div class="window-content">
                    <p class="window-time">${window.startTime.toLocaleString()}</p>
                    <p class="window-action">${window.action}</p>
                </div>
            </div>
        `).join('');
        
        this.safeUpdateElement('priority-count', 'textContent', `${filteredWindows.length} Windows`);
    }

    populateScheduleGrid() {
        const grid = this.elements['schedule-grid'];
        if (!grid) return;
        
        const schedule = this.generateWeeklySchedule();
        
        grid.innerHTML = schedule.map(event => `
            <div class="schedule-event ${event.type}">
                <div class="event-time">${event.time}</div>
                <div class="event-name">${event.name}</div>
                <div class="event-phase">${event.phase}</div>
            </div>
        `).join('');
    }

    populateIntelligenceHub() {
        const hub = this.elements['intelligence-content'];
        if (!hub) return;
        
        const guides = this.getIntelligenceGuides();
        
        hub.innerHTML = guides.map(guide => `
            <div class="intelligence-card">
                <div class="guide-header">
                    <h3>${guide.title}</h3>
                    <span class="guide-category">${guide.category}</span>
                </div>
                <div class="guide-content">
                    <p>${guide.summary}</p>
                    <div class="guide-meta">
                        <span class="difficulty">${guide.difficulty}</span>
                        <span class="impact">${guide.impact}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    populateBottomEventsBar() {
        const grid = this.elements['bottom-events-grid'];
        if (!grid) return;
        
        const upcomingEvents = this.getUpcomingPriorityEvents();
        
        grid.innerHTML = upcomingEvents.map(event => `
            <div class="bottom-event-card">
                <div class="event-icon-compact">${event.icon}</div>
                <div class="event-details-compact">
                    <div class="event-name-compact">${event.name}</div>
                    <div class="event-countdown-compact">${this.formatCountdown(event.timeUntil)}</div>
                </div>
                <div class="event-priority-indicator ${event.priority}"></div>
            </div>
        `).join('');
        
        this.safeUpdateElement('events-count', 'textContent', `${upcomingEvents.length} upcoming`);
    }

    generateWeeklySchedule() {
        return Array.from({ length: 42 }, (_, i) => ({
            time: `${Math.floor(i / 7) * 4}:00`,
            name: `Phase ${i % 5 + 1}`,
            phase: this.armsRacePhases[i % 5],
            type: i % 3 === 0 ? 'priority' : 'normal'
        }));
    }

    getIntelligenceGuides() {
        return [
            {
                title: 'Arms Race Optimization',
                category: 'Strategy',
                summary: 'Maximize points during dual-event windows',
                difficulty: 'Intermediate',
                impact: 'High'
            },
            {
                title: 'VS Points Timing',
                category: 'Tactics',
                summary: 'Perfect timing for maximum efficiency',
                difficulty: 'Advanced',
                impact: 'Very High'
            },
            {
                title: 'Resource Management',
                category: 'Economics',
                summary: 'Optimize speedup usage for maximum return',
                difficulty: 'Beginner',
                impact: 'Medium'
            },
            {
                title: 'Alliance Coordination',
                category: 'Team Strategy',
                summary: 'Coordinate with alliance for peak efficiency',
                difficulty: 'Advanced',
                impact: 'Very High'
            }
        ];
    }

    getUpcomingPriorityEvents() {
        const events = [];
        const baseTime = this.getServerTime();
        
        const nextPhase = this.getNextPhaseTime(baseTime);
        events.push({
            name: `${this.settings.nextArmsPhase} Phase`,
            icon: '⚔️',
            timeUntil: nextPhase.getTime() - baseTime.getTime(),
            priority: 'high'
        });
        
        const priorityWindows = this.generatePriorityWindows(baseTime).slice(0, 3);
        priorityWindows.forEach((window, index) => {
            events.push({
                name: window.name,
                icon: window.priority === 'high' ? '⚡' : '📅',
                timeUntil: window.startTime.getTime() - baseTime.getTime(),
                priority: window.priority
            });
        });
        
        return events.slice(0, 4);
    }

    switchTab(tabName) {
        this.elements.tabButtons.forEach(btn => btn.classList.remove('active'));
        this.elements.tabPanels.forEach(panel => panel.classList.remove('active'));
        
        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        const activePanel = document.getElementById(`${tabName}-tab`);
        
        if (activeButton) activeButton.classList.add('active');
        if (activePanel) activePanel.classList.add('active');
    }

    applyFilter(filter) {
        this.elements.filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        const cards = document.querySelectorAll('.priority-window-card');
        cards.forEach(card => {
            card.style.display = filter === 'all' ? 'block' : 
                card.classList.contains(filter) ? 'block' : 'none';
        });
    }

    updateAllDisplays() {
        this.updateTime();
        this.updatePhaseDisplays();
        this.updateServerTime();
        this.updateOffsetDisplay();
        
        if (this.elements['time-format-dropdown']) {
            this.elements['time-format-dropdown'].value = this.settings.timeFormat;
        }
        if (this.elements['detail-level-dropdown']) {
            this.elements['detail-level-dropdown'].value = this.settings.detailLevel;
        }
        if (this.elements['notification-alerts']) {
            this.elements['notification-alerts'].value = this.settings.notificationAlerts;
        }
        if (this.elements['phase-alerts']) {
            this.elements['phase-alerts'].value = this.settings.phaseAlerts;
        }
    }

    showNotification(message, type = 'success') {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('VS Points Optimizer', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚔️</text></svg>'
            });
        }
        
        console.log(`${type.toUpperCase()}: ${message}`);
    }

    sendPhaseChangeNotification() {
        const message = `Arms Race phase changed to ${this.settings.currentArmsPhase}. Next: ${this.settings.nextArmsPhase}`;
        this.showNotification(message, 'info');
    }

    safeUpdateElement(elementId, property, value) {
        try {
            const element = this.elements[elementId] || document.getElementById(elementId);
            if (element) {
                if (property === 'textContent') {
                    element.textContent = value;
                } else if (property === 'innerHTML') {
                    element.innerHTML = value;
                } else if (property === 'style') {
                    element.style.cssText += '; ' + value;
                } else {
                    element[property] = value;
                }
            }
        } catch (error) {
            console.warn(`Failed to update element ${elementId}:`, error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VSPointsOptimizer();
});
