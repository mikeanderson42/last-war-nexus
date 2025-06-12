class VSPointsOptimizer {
    constructor() {
        this.currentData = {
            serverTimeOffset: 0,
            currentArmsPhase: 'auto',
            timeFormat: 'utc',
            notificationsEnabled: false,
            lastArmsRaceCheck: null,
            setupCompleted: false
        };

        this.isInitialized = false;
        this.updateInterval = null;
        this.notificationTimeouts = new Set();
        
        this.priorityWindows = [];
        this.scheduleEvents = [];
        this.intelligenceGuides = [];

        this.init();
    }

    async init() {
        console.log('🚀 Initializing VS Points Optimizer...');
        
        try {
            await this.loadSettings();
            this.setupEventListeners();
            this.generatePriorityWindows();
            this.generateScheduleEvents();
            this.generateIntelligenceGuides();
            
            if (!this.currentData.setupCompleted) {
                this.showSetupModal();
            } else {
                await this.checkArmsRacePhase();
            }
            
            this.startUpdateCycle();
            this.updateAllDisplays();
            this.isInitialized = true;
            
            console.log('✅ VS Points Optimizer initialized successfully');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.handleError('Failed to initialize VS Points Optimizer', error);
        }
    }

    async loadSettings() {
        try {
            const settings = localStorage.getItem('vsPointsSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.currentData = { ...this.currentData, ...parsed };
            }
        } catch (error) {
            console.warn('⚠️ Failed to load settings from localStorage:', error);
        }
    }

    async saveSettings() {
        try {
            localStorage.setItem('vsPointsSettings', JSON.stringify(this.currentData));
        } catch (error) {
            console.warn('⚠️ Failed to save settings to localStorage:', error);
        }
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterPriorityWindows(e.target.dataset.filter));
        });

        // Server settings dropdown
        const serverToggle = document.getElementById('server-toggle');
        const serverDropdown = document.getElementById('server-dropdown');
        if (serverToggle && serverDropdown) {
            serverToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('server');
            });
        }

        // Display settings dropdown
        const settingsToggle = document.getElementById('settings-toggle');
        const settingsDropdown = document.getElementById('settings-dropdown');
        if (settingsToggle && settingsDropdown) {
            settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('settings');
            });
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Prevent dropdown content clicks from closing dropdown
        document.querySelectorAll('.server-dropdown, .settings-dropdown').forEach(dropdown => {
            dropdown.addEventListener('click', (e) => e.stopPropagation());
        });

        // Apply server settings
        const applyServerBtn = document.getElementById('apply-server');
        if (applyServerBtn) {
            applyServerBtn.addEventListener('click', () => this.applyServerSettings());
        }

        // Time format change
        const timeFormatSelect = document.getElementById('time-format-dropdown');
        if (timeFormatSelect) {
            timeFormatSelect.addEventListener('change', (e) => {
                this.currentData.timeFormat = e.target.value;
                this.saveSettings();
                this.updateAllDisplays();
            });
        }

        // Setup modal handlers
        this.setupModalHandlers();

        // Events bar toggle
        const eventsToggle = document.getElementById('events-toggle');
        if (eventsToggle) {
            eventsToggle.addEventListener('click', () => this.toggleEventsBar());
        }
    }

    setupModalHandlers() {
        // Setup modal
        const setupCompleteBtn = document.getElementById('setup-complete');
        if (setupCompleteBtn) {
            setupCompleteBtn.addEventListener('click', () => this.completeSetup());
        }

        const enableNotificationsBtn = document.getElementById('enable-notifications');
        if (enableNotificationsBtn) {
            enableNotificationsBtn.addEventListener('click', () => this.requestNotificationPermission());
        }

        const setupTimeOffset = document.getElementById('setup-time-offset');
        if (setupTimeOffset) {
            setupTimeOffset.addEventListener('change', (e) => {
                this.currentData.serverTimeOffset = parseInt(e.target.value);
                this.updateSetupServerTime();
            });
        }

        // Arms Race modal
        const armsRaceUpdateBtn = document.getElementById('arms-race-update');
        const armsRaceCancelBtn = document.getElementById('arms-race-cancel');

        if (armsRaceUpdateBtn) {
            armsRaceUpdateBtn.addEventListener('click', () => this.updateArmsRacePhase());
        }

        if (armsRaceCancelBtn) {
            armsRaceCancelBtn.addEventListener('click', () => this.closeArmsRaceModal());
        }
    }

    showSetupModal() {
        const modal = document.getElementById('setup-modal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Set current offset in setup
            const setupTimeOffset = document.getElementById('setup-time-offset');
            if (setupTimeOffset) {
                setupTimeOffset.value = this.currentData.serverTimeOffset.toString();
            }
            
            this.updateSetupServerTime();
        }
    }

    updateSetupServerTime() {
        const serverTimeDisplay = document.getElementById('setup-server-time');
        if (serverTimeDisplay) {
            const serverTime = this.getServerTime();
            serverTimeDisplay.textContent = `Server Time: ${this.formatTime(serverTime, 'utc')}`;
        }
    }

    async requestNotificationPermission() {
        const statusDiv = document.getElementById('notification-status');
        const btn = document.getElementById('enable-notifications');
        
        if (!('Notification' in window)) {
            if (statusDiv) statusDiv.textContent = 'Notifications not supported in this browser';
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                this.currentData.notificationsEnabled = true;
                if (statusDiv) statusDiv.textContent = '✅ Notifications enabled';
                if (btn) btn.textContent = '✅ Notifications Enabled';
            } else {
                if (statusDiv) statusDiv.textContent = '❌ Notifications blocked';
            }
        } catch (error) {
            console.error('Notification permission error:', error);
            if (statusDiv) statusDiv.textContent = '❌ Failed to enable notifications';
        }
    }

    completeSetup() {
        this.currentData.setupCompleted = true;
        this.saveSettings();
        
        const modal = document.getElementById('setup-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        this.checkArmsRacePhase();
    }

    async checkArmsRacePhase() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        // Only check if it's been more than an hour since last check
        if (this.currentData.lastArmsRaceCheck && (now - this.currentData.lastArmsRaceCheck) < oneHour) {
            return;
        }

        if (this.currentData.currentArmsPhase === 'auto') {
            const autoPhase = this.calculateCurrentArmsPhase();
            this.currentData.currentArmsPhase = autoPhase;
        }

        // Show arms race modal for verification occasionally
        const shouldShowModal = !this.currentData.lastArmsRaceCheck || 
                               (now - this.currentData.lastArmsRaceCheck) > (4 * oneHour);
        
        if (shouldShowModal) {
            this.showArmsRaceModal();
        }
        
        this.currentData.lastArmsRaceCheck = now;
        this.saveSettings();
    }

    showArmsRaceModal() {
        const modal = document.getElementById('arms-race-modal');
        const currentPhaseDisplay = document.getElementById('modal-current-phase');
        const modalArmsPhase = document.getElementById('modal-arms-phase');
        
        if (modal && currentPhaseDisplay && modalArmsPhase) {
            currentPhaseDisplay.textContent = this.currentData.currentArmsPhase;
            modalArmsPhase.value = this.currentData.currentArmsPhase;
            modal.style.display = 'flex';
        }
    }

    updateArmsRacePhase() {
        const modalArmsPhase = document.getElementById('modal-arms-phase');
        if (modalArmsPhase) {
            this.currentData.currentArmsPhase = modalArmsPhase.value;
            this.saveSettings();
            this.updateAllDisplays();
        }
        this.closeArmsRaceModal();
    }

    closeArmsRaceModal() {
        const modal = document.getElementById('arms-race-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    calculateCurrentArmsPhase() {
        const serverTime = this.getServerTime();
        const phases = ['Tech Research', 'Drone Boost', 'Hero Advancement', 'City Building', 'Unit Progression'];
        
        // Calculate 4-hour blocks since midnight UTC
        const utcHour = serverTime.getUTCHours();
        const phaseIndex = Math.floor(utcHour / 4) % phases.length;
        
        return phases[phaseIndex];
    }

    toggleDropdown(type) {
        const serverDropdown = document.getElementById('server-dropdown');
        const settingsDropdown = document.getElementById('settings-dropdown');
        
        if (type === 'server') {
            if (settingsDropdown) settingsDropdown.classList.remove('active');
            if (serverDropdown) serverDropdown.classList.toggle('active');
        } else if (type === 'settings') {
            if (serverDropdown) serverDropdown.classList.remove('active');
            if (settingsDropdown) settingsDropdown.classList.toggle('active');
        }
    }

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.server-dropdown, .settings-dropdown');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }

    applyServerSettings() {
        const timeOffsetSelect = document.getElementById('time-offset');
        const armsPhaseSelect = document.getElementById('current-arms-phase');
        
        if (timeOffsetSelect) {
            this.currentData.serverTimeOffset = parseInt(timeOffsetSelect.value);
        }
        
        if (armsPhaseSelect) {
            this.currentData.currentArmsPhase = armsPhaseSelect.value;
        }
        
        this.saveSettings();
        this.updateServerInfo();
        this.updateAllDisplays();
        this.closeAllDropdowns();
        
        // Show feedback
        const applyBtn = document.getElementById('apply-server');
        if (applyBtn) {
            const originalText = applyBtn.textContent;
            applyBtn.textContent = '✅ Applied';
            setTimeout(() => {
                applyBtn.textContent = originalText;
            }, 2000);
        }
    }

    updateServerInfo() {
        const currentPhaseDisplay = document.getElementById('current-phase-display');
        const offsetDisplay = document.getElementById('offset-display');
        
        if (currentPhaseDisplay) {
            currentPhaseDisplay.textContent = this.currentData.currentArmsPhase;
        }
        
        if (offsetDisplay) {
            const offset = this.currentData.serverTimeOffset;
            const sign = offset >= 0 ? '+' : '';
            offsetDisplay.textContent = `UTC ${sign}${offset}`;
        }
    }

    getServerTime() {
        const now = new Date();
        const offsetMs = this.currentData.serverTimeOffset * 60 * 60 * 1000;
        return new Date(now.getTime() + offsetMs);
    }

    formatTime(date, format = null) {
        const useFormat = format || this.currentData.timeFormat;
        
        if (useFormat === 'local') {
            return date.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } else {
            // UTC format
            return date.toISOString().substr(11, 8);
        }
    }

    formatDate(date, format = null) {
        const useFormat = format || this.currentData.timeFormat;
        
        if (useFormat === 'local') {
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            });
        } else {
            // UTC format
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short', 
                day: 'numeric',
                timeZone: 'UTC'
            });
        }
    }

    generatePriorityWindows() {
        this.priorityWindows = [];
        const serverTime = this.getServerTime();
        const currentDay = serverTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Define VS event schedule (Wed-Sat)
        const vsEvents = [
            { day: 3, name: 'Tech Research Wednesday', startHour: 12, endHour: 16, icon: '🔬', vsPoints: 2400, armsPoints: 1800, multiplier: 1.5 },
            { day: 4, name: 'Drone Boost Thursday', startHour: 8, endHour: 12, icon: '🚁', vsPoints: 2800, armsPoints: 2100, multiplier: 1.7 },
            { day: 4, name: 'Hero Advancement Thursday', startHour: 16, endHour: 20, icon: '⚔️', vsPoints: 3200, armsPoints: 2400, multiplier: 2.0 },
            { day: 5, name: 'City Building Friday', startHour: 4, endHour: 8, icon: '🏗️', vsPoints: 2600, armsPoints: 1950, multiplier: 1.6 },
            { day: 5, name: 'Unit Progression Friday', startHour: 12, endHour: 16, icon: '⚡', vsPoints: 3000, armsPoints: 2250, multiplier: 1.8 },
            { day: 6, name: 'Final Push Saturday', startHour: 0, endHour: 4, icon: '🎯', vsPoints: 3600, armsPoints: 2700, multiplier: 2.2 },
            { day: 6, name: 'Victory Sprint Saturday', startHour: 20, endHour: 24, icon: '🏆', vsPoints: 4000, armsPoints: 3000, multiplier: 2.5 }
        ];

        // Generate windows for current week and next week
        for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
            vsEvents.forEach(event => {
                const eventDate = new Date(serverTime);
                const daysUntilEvent = (event.day - currentDay + 7 * weekOffset) % 7;
                if (weekOffset === 0 && daysUntilEvent < 0) return; // Skip past events this week
                
                eventDate.setDate(eventDate.getDate() + daysUntilEvent);
                eventDate.setUTCHours(event.startHour, 0, 0, 0);
                
                const endDate = new Date(eventDate);
                endDate.setUTCHours(event.endHour, 0, 0, 0);
                
                const isActive = serverTime >= eventDate && serverTime <= endDate;
                const timeUntil = eventDate.getTime() - serverTime.getTime();
                const timeRemaining = endDate.getTime() - serverTime.getTime();
                
                // Determine if this aligns with current Arms Race phase
                const eventPhase = this.getArmsPhaseForTime(eventDate);
                const isHighPriority = this.isHighPriorityAlignment(event.name, eventPhase);
                
                this.priorityWindows.push({
                    id: `${event.name.toLowerCase().replace(/\s+/g, '-')}-${weekOffset}`,
                    name: event.name,
                    icon: event.icon,
                    startTime: eventDate,
                    endTime: endDate,
                    isActive,
                    timeUntil,
                    timeRemaining,
                    isHighPriority,
                    armsPhase: eventPhase,
                    vsPoints: event.vsPoints,
                    armsPoints: event.armsPoints,
                    multiplier: event.multiplier,
                    efficiency: this.calculateEfficiency(isHighPriority, event.multiplier),
                    action: this.getActionForEvent(event.name, isHighPriority),
                    benefits: this.getBenefitsForEvent(event.name, isHighPriority, event.vsPoints, event.armsPoints)
                });
            });
        }

        // Sort by time until event (active first, then by time)
        this.priorityWindows.sort((a, b) => {
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;
            return a.timeUntil - b.timeUntil;
        });
    }

    getArmsPhaseForTime(eventTime) {
        const phases = ['Tech Research', 'Drone Boost', 'Hero Advancement', 'City Building', 'Unit Progression'];
        const utcHour = eventTime.getUTCHours();
        const phaseIndex = Math.floor(utcHour / 4) % phases.length;
        return phases[phaseIndex];
    }

    isHighPriorityAlignment(eventName, armsPhase) {
        const alignments = {
            'Tech Research Wednesday': ['Tech Research'],
            'Drone Boost Thursday': ['Drone Boost'],
            'Hero Advancement Thursday': ['Hero Advancement'],
            'City Building Friday': ['City Building'],
            'Unit Progression Friday': ['Unit Progression'],
            'Final Push Saturday': ['Tech Research', 'Hero Advancement'],
            'Victory Sprint Saturday': ['City Building', 'Unit Progression']
        };
        
        return alignments[eventName]?.includes(armsPhase) || false;
    }

    calculateEfficiency(isHighPriority, baseMultiplier) {
        if (isHighPriority) {
            return Math.min(baseMultiplier * 1.5, 3.0); // Cap at 3x
        }
        return baseMultiplier;
    }

    getActionForEvent(eventName, isHighPriority) {
        const actions = {
            'Tech Research Wednesday': isHighPriority ? 
                'Use ALL research speedups and focus on tech upgrades' : 
                'Complete research projects for VS points',
            'Drone Boost Thursday': isHighPriority ? 
                'Maximize drone deployment with speedups' : 
                'Deploy drones for steady point accumulation',
            'Hero Advancement Thursday': isHighPriority ? 
                'Use hero XP items and combat speedups' : 
                'Focus on hero battles and upgrades',
            'City Building Friday': isHighPriority ? 
                'Use all building speedups for maximum points' : 
                'Complete building upgrades and constructions',
            'Unit Progression Friday': isHighPriority ? 
                'Train units with speedups and focus on upgrades' : 
                'Train troops and upgrade unit technologies',
            'Final Push Saturday': isHighPriority ? 
                'All-out resource usage for maximum points' : 
                'Intensive activity push for VS points',
            'Victory Sprint Saturday': isHighPriority ? 
                'Final surge - use remaining speedups' : 
                'Final opportunity for VS point accumulation'
        };
        
        return actions[eventName] || 'Participate in VS event activities';
    }

    getBenefitsForEvent(eventName, isHighPriority, vsPoints, armsPoints) {
        const base = [`${vsPoints.toLocaleString()} VS Points`, `${armsPoints.toLocaleString()} Arms Race Points`];
        
        if (isHighPriority) {
            base.push('Double Point Efficiency', 'Resource Optimization Window');
        } else {
            base.push('Standard Point Rates');
        }
        
        return base;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');
        
        // Update content based on tab
        if (tabName === 'priority') {
            this.updatePriorityGrid();
        } else if (tabName === 'schedule') {
            this.updateScheduleGrid();
        } else if (tabName === 'intelligence') {
            this.updateIntelligenceContent();
        }
    }

    filterPriorityWindows(filter) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
        
        // Filter and update grid
        this.updatePriorityGrid(filter);
    }

    updatePriorityGrid(filter = 'all') {
        const grid = document.getElementById('priority-grid');
        if (!grid) return;

        let filteredWindows = [...this.priorityWindows];
        
        if (filter === 'active') {
            filteredWindows = filteredWindows.filter(window => window.isActive);
        } else if (filter === 'upcoming') {
            filteredWindows = filteredWindows.filter(window => !window.isActive && window.timeUntil > 0);
        }

        // Take first 8 windows for display
        filteredWindows = filteredWindows.slice(0, 8);

        grid.innerHTML = filteredWindows.map(window => this.createPriorityCard(window)).join('');
        
        // Update priority count
        const countElement = document.getElementById('priority-count');
        if (countElement) {
            countElement.textContent = `${filteredWindows.length} Windows`;
        }
    }

    createPriorityCard(window) {
        const timeText = window.isActive ? 
            `${this.formatDuration(window.timeRemaining)} remaining` :
            `in ${this.formatDuration(window.timeUntil)}`;
            
        const statusClass = window.isActive ? 'active' : 
                           window.isHighPriority ? 'priority' : 'normal';
        
        const efficiencyText = window.isHighPriority ? `${window.efficiency}x Efficiency` : 'Standard Rate';
        
        return `
            <div class="priority-card ${statusClass}">
                <div class="priority-header">
                    <div class="priority-icon">${window.icon}</div>
                    <div class="priority-info">
                        <div class="priority-name">${window.name}</div>
                        <div class="priority-timing">${this.formatDate(window.startTime)} ${this.formatTime(window.startTime)}</div>
                    </div>
                    <div class="priority-badge ${window.isHighPriority ? 'high' : 'standard'}">
                        ${window.isHighPriority ? 'HIGH' : 'STD'}
                    </div>
                </div>
                
                <div class="priority-content">
                    <div class="priority-status">
                        <span class="status-indicator ${statusClass}"></span>
                        <span class="status-text">${window.isActive ? 'ACTIVE NOW' : timeText}</span>
                    </div>
                    
                    <div class="priority-details">
                        <div class="detail-row">
                            <span class="detail-label">Arms Phase:</span>
                            <span class="detail-value">${window.armsPhase}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Efficiency:</span>
                            <span class="detail-value efficiency">${efficiencyText}</span>
                        </div>
                    </div>
                    
                    <div class="priority-action">
                        <div class="action-text">${window.action}</div>
                    </div>
                    
                    <div class="priority-benefits">
                        ${window.benefits.map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    formatDuration(ms) {
        if (ms <= 0) return '0m';
        
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    generateScheduleEvents() {
        this.scheduleEvents = [];
        const serverTime = this.getServerTime();
        
        // Generate 7 days of Arms Race schedule
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour += 4) {
                const eventDate = new Date(serverTime);
                eventDate.setDate(eventDate.getDate() + day);
                eventDate.setUTCHours(hour, 0, 0, 0);
                
                const phase = this.getArmsPhaseForTime(eventDate);
                const isActive = this.isTimeActive(eventDate, 4);
                
                this.scheduleEvents.push({
                    time: eventDate,
                    phase,
                    isActive,
                    duration: 4
                });
            }
        }
    }

    isTimeActive(eventTime, durationHours) {
        const serverTime = this.getServerTime();
        const endTime = new Date(eventTime.getTime() + (durationHours * 60 * 60 * 1000));
        return serverTime >= eventTime && serverTime <= endTime;
    }

    updateScheduleGrid() {
        const grid = document.getElementById('schedule-grid');
        if (!grid) return;

        const scheduleHTML = this.scheduleEvents.map(event => {
            const statusClass = event.isActive ? 'current' : 'normal';
            const timeStr = this.formatTime(event.time);
            const dateStr = this.formatDate(event.time);
            
            return `
                <div class="schedule-item ${statusClass}">
                    <div class="schedule-time">
                        <div class="schedule-date">${dateStr}</div>
                        <div class="schedule-hour">${timeStr}</div>
                    </div>
                    <div class="schedule-phase">
                        <div class="phase-name">${event.phase}</div>
                        <div class="phase-duration">${event.duration}h block</div>
                    </div>
                    ${event.isActive ? '<div class="active-indicator">ACTIVE</div>' : ''}
                </div>
            `;
        }).join('');

        grid.innerHTML = scheduleHTML;
    }

    generateIntelligenceGuides() {
        this.intelligenceGuides = [
            {
                category: 'VS Points Strategy',
                title: 'Maximum VS Points Guide',
                content: 'Focus on dual-alignment windows when VS events overlap with matching Arms Race phases.',
                priority: 'High'
            },
            {
                category: 'Arms Race Optimization',
                title: 'Phase Transition Timing',
                content: 'Plan major activities 10-15 minutes before phase transitions for maximum overlap.',
                priority: 'Medium'
            },
            {
                category: 'Resource Management',
                title: 'Speedup Conservation',
                content: 'Save speedups for high-priority windows. Use during dual-alignment for 2-4x efficiency.',
                priority: 'High'
            },
            {
                category: 'Event Coordination',
                title: 'Alliance Coordination',
                content: 'Coordinate with alliance for simultaneous high-priority window participation.',
                priority: 'Medium'
            }
        ];
    }

    updateIntelligenceContent() {
        const content = document.getElementById('intelligence-content');
        if (!content) return;

        const intelligenceHTML = this.intelligenceGuides.map(guide => {
            return `
                <div class="intelligence-card">
                    <div class="intelligence-header">
                        <div class="intelligence-category">${guide.category}</div>
                        <div class="intelligence-priority ${guide.priority.toLowerCase()}">${guide.priority}</div>
                    </div>
                    <div class="intelligence-title">${guide.title}</div>
                    <div class="intelligence-content-text">${guide.content}</div>
                </div>
            `;
        }).join('');

        content.innerHTML = intelligenceHTML;
    }

    startUpdateCycle() {
        // Clear any existing interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Update every second for real-time countdown
        this.updateInterval = setInterval(() => {
            this.updateAllDisplays();
        }, 1000);
    }

    updateAllDisplays() {
        this.updateServerTime();
        this.updatePriorityHero();
        this.updateCountdown();
        this.updateCurrentStrategy();
        this.updatePriorityGrid();
        this.updateEventsBar();
        this.updateServerInfo();
    }

    updateServerTime() {
        const serverTime = this.getServerTime();
        const timeElement = document.getElementById('server-time');
        if (timeElement) {
            timeElement.textContent = this.formatTime(serverTime);
        }
    }

    updatePriorityHero() {
        const nextWindow = this.priorityWindows.find(w => !w.isActive && w.timeUntil > 0) || this.priorityWindows[0];
        const activeWindow = this.priorityWindows.find(w => w.isActive);
        
        if (activeWindow) {
            this.updateActiveWindow(activeWindow);
        } else if (nextWindow) {
            this.updateNextWindow(nextWindow);
        }
        
        this.updateStatusFooter();
    }

    updateActiveWindow(window) {
        const activeStrip = document.getElementById('active-now');
        const activeAction = document.getElementById('active-action');
        const badgeLabel = document.getElementById('badge-label');
        const countdownMain = document.getElementById('next-priority-time');
        const countdownLabel = document.getElementById('countdown-label');
        
        if (activeStrip) activeStrip.style.display = 'flex';
        if (activeAction) activeAction.textContent = window.action;
        if (badgeLabel) badgeLabel.textContent = 'ACTIVE HIGH PRIORITY';
        if (countdownMain) countdownMain.textContent = this.formatDuration(window.timeRemaining);
        if (countdownLabel) countdownLabel.textContent = 'TIME REMAINING';
        
        this.updateWindowDetails(window, true);
    }

    updateNextWindow(window) {
        const activeStrip = document.getElementById('active-now');
        const badgeLabel = document.getElementById('badge-label');
        const countdownMain = document.getElementById('next-priority-time');
        const countdownLabel = document.getElementById('countdown-label');
        
        if (activeStrip) activeStrip.style.display = 'none';
        if (badgeLabel) badgeLabel.textContent = 'NEXT HIGH PRIORITY';
        if (countdownMain) countdownMain.textContent = this.formatDuration(window.timeUntil);
        if (countdownLabel) countdownLabel.textContent = 'TIME REMAINING';
        
        this.updateWindowDetails(window, false);
    }

    updateWindowDetails(window, isActive) {
        const eventName = document.getElementById('next-priority-event');
        const efficiencyLevel = document.getElementById('efficiency-level');
        const eventDay = document.getElementById('event-day-gaming');
        const currentAction = document.getElementById('current-action');
        
        if (eventName) eventName.textContent = window.name;
        if (efficiencyLevel) {
            efficiencyLevel.textContent = window.isHighPriority ? 'High' : 'Standard';
            efficiencyLevel.className = `efficiency-badge ${window.isHighPriority ? 'high' : 'standard'}`;
        }
        if (eventDay) eventDay.textContent = `${this.formatDate(window.startTime)} ${this.formatTime(window.startTime)}`;
        if (currentAction) currentAction.textContent = window.action;
    }

    updateStatusFooter() {
        const currentVsDay = document.getElementById('current-vs-day');
        const armsPhase = document.getElementById('arms-phase');
        const nextAlignment = document.getElementById('next-alignment-countdown');
        
        const serverTime = this.getServerTime();
        const dayName = serverTime.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
        
        if (currentVsDay) currentVsDay.textContent = dayName;
        if (armsPhase) armsPhase.textContent = this.currentData.currentArmsPhase;
        
        // Calculate time to next phase change (every 4 hours)
        const currentHour = serverTime.getUTCHours();
        const nextPhaseHour = Math.ceil((currentHour + 1) / 4) * 4;
        const nextPhaseTime = new Date(serverTime);
        nextPhaseTime.setUTCHours(nextPhaseHour, 0, 0, 0);
        
        if (nextPhaseHour >= 24) {
            nextPhaseTime.setDate(nextPhaseTime.getDate() + 1);
            nextPhaseTime.setUTCHours(0, 0, 0, 0);
        }
        
        const timeToPhase = nextPhaseTime.getTime() - serverTime.getTime();
        if (nextAlignment) nextAlignment.textContent = this.formatDuration(timeToPhase);
    }

    updateCountdown() {
        const serverTime = this.getServerTime();
        const phases = ['Tech Research', 'Drone Boost', 'Hero Advancement', 'City Building', 'Unit Progression'];
        
        // Calculate next phase transition
        const currentHour = serverTime.getUTCHours();
        const currentPhaseIndex = Math.floor(currentHour / 4) % phases.length;
        const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        const nextPhase = phases[nextPhaseIndex];
        
        const nextPhaseHour = Math.ceil((currentHour + 1) / 4) * 4;
        const nextPhaseTime = new Date(serverTime);
        
        if (nextPhaseHour >= 24) {
            nextPhaseTime.setDate(nextPhaseTime.getDate() + 1);
            nextPhaseTime.setUTCHours(0, 0, 0, 0);
        } else {
            nextPhaseTime.setUTCHours(nextPhaseHour, 0, 0, 0);
        }
        
        const timeUntilPhase = nextPhaseTime.getTime() - serverTime.getTime();
        
        // Update countdown elements
        const countdownTimer = document.getElementById('countdown-timer');
        const eventName = document.getElementById('event-name');
        const eventTime = document.getElementById('event-time');
        const progressFill = document.getElementById('progress-fill');
        
        if (countdownTimer) countdownTimer.textContent = this.formatDuration(timeUntilPhase);
        if (eventName) eventName.textContent = `${nextPhase} Phase`;
        if (eventTime) eventTime.textContent = this.formatTime(nextPhaseTime);
        
        // Update progress bar (4 hours = 100%)
        if (progressFill) {
            const fourHours = 4 * 60 * 60 * 1000;
            const elapsed = fourHours - timeUntilPhase;
            const progress = Math.max(0, Math.min(100, (elapsed / fourHours) * 100));
            progressFill.style.width = `${progress}%`;
        }
    }

    updateCurrentStrategy() {
        const activeWindow = this.priorityWindows.find(w => w.isActive);
        const nextWindow = this.priorityWindows.find(w => !w.isActive && w.timeUntil > 0);
        
        const strategyRating = document.getElementById('strategy-rating');
        const actionText = document.getElementById('action-text');
        const optimizationFocus = document.getElementById('optimization-focus');
        const priorityLevel = document.getElementById('priority-level');
        const timeRemaining = document.getElementById('time-remaining');
        
        if (activeWindow) {
            if (strategyRating) strategyRating.textContent = activeWindow.isHighPriority ? 'S' : 'A';
            if (actionText) actionText.textContent = activeWindow.action;
            if (optimizationFocus) optimizationFocus.textContent = 'Active High Priority';
            if (priorityLevel) {
                priorityLevel.textContent = 'ACTIVE';
                priorityLevel.className = 'priority-tag active';
            }
            if (timeRemaining) timeRemaining.textContent = this.formatDuration(activeWindow.timeRemaining);
        } else if (nextWindow) {
            if (strategyRating) strategyRating.textContent = nextWindow.isHighPriority ? 'A' : 'B';
            if (actionText) actionText.textContent = 'Activities earn standard points. Save speedups for high priority windows.';
            if (optimizationFocus) optimizationFocus.textContent = 'Dual Event Alignment';
            if (priorityLevel) {
                priorityLevel.textContent = nextWindow.isHighPriority ? 'High' : 'Medium';
                priorityLevel.className = `priority-tag ${nextWindow.isHighPriority ? 'high' : 'medium'}`;
            }
            if (timeRemaining) timeRemaining.textContent = this.formatDuration(nextWindow.timeUntil);
        }
    }

    toggleEventsBar() {
        const eventsBar = document.getElementById('events-bar');
        const toggleArrow = document.querySelector('.toggle-arrow');
        
        if (eventsBar && toggleArrow) {
            eventsBar.classList.toggle('collapsed');
            toggleArrow.textContent = eventsBar.classList.contains('collapsed') ? '▲' : '▼';
        }
    }

    updateEventsBar() {
        const eventsContent = document.getElementById('events-content');
        if (!eventsContent) return;

        const upcomingEvents = this.priorityWindows
            .filter(w => !w.isActive && w.timeUntil > 0)
            .slice(0, 3);

        const eventsHTML = upcomingEvents.map(event => {
            return `
                <div class="event-item ${event.isHighPriority ? 'priority' : 'normal'}">
                    <div class="event-icon">${event.icon}</div>
                    <div class="event-details">
                        <div class="event-name">${event.name}</div>
                        <div class="event-time">in ${this.formatDuration(event.timeUntil)}</div>
                    </div>
                    <div class="event-badge ${event.isHighPriority ? 'high' : 'standard'}">
                        ${event.isHighPriority ? 'HIGH' : 'STD'}
                    </div>
                </div>
            `;
        }).join('');

        eventsContent.innerHTML = eventsHTML || '<div class="no-events">No upcoming events</div>';
    }

    scheduleNotification(window) {
        if (!this.currentData.notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }

        const notifyTime = window.startTime.getTime() - (5 * 60 * 1000); // 5 minutes before
        const now = Date.now();

        if (notifyTime > now) {
            const timeout = setTimeout(() => {
                new Notification('VS Points Optimizer', {
                    body: `${window.name} starts in 5 minutes! ${window.isHighPriority ? 'HIGH PRIORITY' : 'Standard'} window`,
                    icon: '⚔️',
                    tag: window.id
                });
            }, notifyTime - now);

            this.notificationTimeouts.add(timeout);
        }
    }

    handleError(message, error) {
        console.error(message, error);
        
        // Show user-friendly error message
        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'error-message';
        errorDisplay.textContent = message;
        errorDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
        `;
        
        document.body.appendChild(errorDisplay);
        
        setTimeout(() => {
            errorDisplay.remove();
        }, 5000);
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.notificationTimeouts.clear();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vsOptimizer = new VSPointsOptimizer();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.vsOptimizer) {
        window.vsOptimizer.destroy();
    }
});
