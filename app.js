class LastWarNexus {
    constructor() {
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 5;
        
        this.currentArmsPhase = "auto";
        this.timeOffset = 0;
        this.isVisible = true;
        this.updateFrequency = 1000;
        this.notificationsEnabled = false;
        this.lastSelectedTab = localStorage.getItem('lwn-last-tab') || 'priority';
        this.lastNotifiedWindow = null;
        
        this.visibilityHandler = this.handleVisibilityChange.bind(this);
        this.keyboardHandler = this.handleKeyboard.bind(this);
        
        // CORRECTED: Based on PDF - 5 phases only (no Mixed Phase)
        this.data = {
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
            
            // FIXED: No fake point values - use benefit descriptions
            highpriorityalignments: [
                { vsday: 1, armsphase: "Drone Boost", reason: "Stamina activities align with radar training day.", benefit: "High Efficiency" },
                { vsday: 1, armsphase: "Hero Advancement", reason: "Hero EXP activities complement radar training.", benefit: "Good Synergy" },
                { vsday: 2, armsphase: "City Building", reason: "Building upgrades align perfectly with base expansion.", benefit: "Maximum Efficiency" },
                { vsday: 3, armsphase: "Tech Research", reason: "Research activities align perfectly with science day.", benefit: "Perfect Alignment" },
                { vsday: 3, armsphase: "Drone Boost", reason: "Drone components support research focus.", benefit: "High Efficiency" },
                { vsday: 4, armsphase: "Hero Advancement", reason: "Hero activities align perfectly with training day.", benefit: "Perfect Match" },
                { vsday: 4, armsphase: "City Building", reason: "Building upgrades during hero training day.", benefit: "Good Timing" },
                { vsday: 5, armsphase: "City Building", reason: "Building component of total mobilization.", benefit: "Peak Efficiency" },
                { vsday: 5, armsphase: "Unit Progression", reason: "Training component of mobilization day.", benefit: "High Impact" },
                { vsday: 5, armsphase: "Tech Research", reason: "Research component of mobilization day.", benefit: "Maximum Impact" },
                { vsday: 6, armsphase: "Unit Progression", reason: "Troop training supports combat activities.", benefit: "Strong Synergy" },
                { vsday: 6, armsphase: "City Building", reason: "Defense preparations for enemy buster day.", benefit: "Good Support" }
            ]
        };
        
        this.settings = { timeFormat: "utc", detailLevel: "essential", viewScope: "week" };
        this.activeTab = this.lastSelectedTab;
        this.activeFilter = "all";
        this.updateInterval = null;
        this.elements = {};
        
        if (typeof window !== 'undefined') {
            window.lastWarNexusInstance = this;
        }
        
        this.initializeWhenReady();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
    }
    
    initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            setTimeout(() => this.init(), 50);
        }
    }
    
    // Smart Updates - Only update visible elements
    handleVisibilityChange() {
        this.isVisible = !document.hidden;
        
        if (this.isVisible) {
            this.updateFrequency = 1000;
            this.updateAllDisplays();
        } else {
            this.updateFrequency = 10000;
        }
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.startUpdateLoop();
        }
    }
    
    // Performance Optimizations
    setupPerformanceOptimizations() {
        document.addEventListener('visibilitychange', this.visibilityHandler);
        this.setupCardAnimations();
        this.preloadAnimations();
    }
    
    setupCardAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.animationDelay = `${index * 50}ms`;
                            entry.target.classList.add('animate-in');
                        }, index * 50);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            this.cardObserver = observer;
        }
    }
    
    preloadAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .preload-animations * {
                transition: none !important;
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.head.removeChild(style);
        }, 100);
    }
    
    // Enhanced Accessibility
    setupAccessibility() {
        document.addEventListener('keydown', this.keyboardHandler);
        this.setupScreenReaderAnnouncements();
        this.setupARIALabels();
    }
    
    handleKeyboard(event) {
        if (event.target.classList.contains('tab-btn')) {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault();
                this.navigateTabs(event.key === 'ArrowRight' ? 1 : -1);
            } else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.target.click();
            }
        }
        
        if (event.target.classList.contains('filter-btn')) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.target.click();
            }
        }
        
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case '1':
                    event.preventDefault();
                    this.switchTab('priority');
                    break;
                case '2':
                    event.preventDefault();
                    this.switchTab('schedule');
                    break;
                case '3':
                    event.preventDefault();
                    this.switchTab('guides');
                    break;
            }
        }
    }
    
    navigateTabs(direction) {
        const tabs = document.querySelectorAll('.tab-btn');
        const currentIndex = Array.from(tabs).findIndex(tab => tab.classList.contains('active'));
        const newIndex = Math.max(0, Math.min(tabs.length - 1, currentIndex + direction));
        
        if (newIndex !== currentIndex) {
            tabs[newIndex].focus();
            tabs[newIndex].click();
        }
    }
    
    setupScreenReaderAnnouncements() {
        this.announcements = document.getElementById('status-announcements');
    }
    
    announceToScreenReader(message) {
        if (this.announcements) {
            this.announcements.textContent = message;
            setTimeout(() => {
                this.announcements.textContent = '';
            }, 1000);
        }
    }
    
    setupARIALabels() {
        setTimeout(() => {
            this.updateARIALabels();
        }, 1000);
    }
    
    updateARIALabels() {
        const currentPhase = this.getCurrentArmsPhaseInfo();
        const currentVSDay = this.getCurrentVSDayInfo();
        
        if (this.elements['arms-phase']) {
            this.elements['arms-phase'].setAttribute('aria-label', 
                `Current Arms Race phase: ${currentPhase.name}, ends in ${this.calculateTimeUntilPhaseEnd()}`);
        }
        
        if (this.elements['current-vs-day']) {
            this.elements['current-vs-day'].setAttribute('aria-label', 
                `Current Alliance Duel day: ${currentVSDay.title}`);
        }
    }
    
    async init() {
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
            this.setupBanner();
            this.handleOfflineState();
            
            const savedNotificationPref = localStorage.getItem('lwn-notifications');
            if (savedNotificationPref === 'true') {
                this.notificationsEnabled = true;
            } else if (savedNotificationPref === null) {
                setTimeout(() => this.requestNotificationPermission(), 3000);
            }
            
            this.switchTab(this.activeTab);
            this.populateAllSections();
            this.updateAllDisplays();
            this.startUpdateLoop();
            this.isInitialized = true;
            
            console.log("Last War Nexus initialized successfully with all A+ features");
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
            'priority-grid', 'schedule-grid', 'guides-content', 'priority-count', 'guides-count',
            'priority-banner', 'banner-title', 'banner-subtitle', 'banner-time', 'banner-close',
            'local-time', 'sync-time', 'next-reset-countdown', 'current-phase-name', 'next-phase-name',
            'phase-progress-fill', 'action-text'
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
        return foundCount >= 15;
    }

    setupEventListeners() {
        try {
            if (this.elements['server-toggle']) {
                this.elements['server-toggle'].addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown('server');
                });
            }

            if (this.elements['settings-toggle']) {
                this.elements['settings-toggle'].addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
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

            if (this.elements['sync-time']) {
                this.elements['sync-time'].addEventListener('click', (e) => {
                    e.preventDefault();
                    this.syncWithServer();
                });
            }

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.settings-dropdown-container') && 
                    !e.target.closest('.server-dropdown-container')) {
                    this.closeAllDropdowns();
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

            tabButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetTab = e.currentTarget.getAttribute('data-tab');
                    this.switchTab(targetTab);
                });
            });

            filterButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const filter = e.currentTarget.getAttribute('data-filter');
                    this.setFilter(filter);
                });
            });
        } catch (error) {
            console.error("Error setting up tab navigation:", error);
        }
    }

    setupBanner() {
        try {
            const closeButton = document.getElementById('banner-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    this.hideBanner();
                    localStorage.setItem('banner-hidden-until', Date.now() + (60 * 60 * 1000));
                });
            }
        } catch (error) {
            console.error("Error setting up banner:", error);
        }
    }

    switchTab(tabName) {
        try {
            this.activeTab = tabName;
            localStorage.setItem('lwn-last-tab', tabName);
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                const isActive = btn.getAttribute('data-tab') === tabName;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive);
                btn.setAttribute('tabindex', isActive ? '0' : '-1');
            });
            
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            const targetPanel = document.getElementById(`${tabName}-tab`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                this.triggerStaggeredAnimations(targetPanel);
                this.announceToScreenReader(`Switched to ${tabName} section`);
            }
        } catch (error) {
            console.error("Error switching tab:", error);
        }
    }
    
    triggerStaggeredAnimations(container) {
        const cards = container.querySelectorAll('.priority-window-card, .guide-card, .schedule-day');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                
                if (this.cardObserver) {
                    this.cardObserver.observe(card);
                }
            }, index * 50);
        });
    }

    setFilter(filter) {
        try {
            this.activeFilter = filter;
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                const isActive = btn.getAttribute('data-filter') === filter;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);
            });
            
            this.populatePriorityGrid();
        } catch (error) {
            console.error("Error setting filter:", error);
        }
    }

    toggleDropdown(type) {
        try {
            if (type === 'server') {
                const dropdown = this.elements['server-dropdown'];
                const toggle = this.elements['server-toggle'];
                
                if (dropdown && toggle) {
                    const isOpen = dropdown.classList.contains('show');
                    
                    if (this.elements['settings-dropdown']) {
                        this.elements['settings-dropdown'].classList.remove('show');
                    }
                    if (this.elements['settings-toggle']) {
                        this.elements['settings-toggle'].classList.remove('active');
                        this.elements['settings-toggle'].setAttribute('aria-expanded', 'false');
                    }
                    
                    dropdown.classList.toggle('show', !isOpen);
                    toggle.classList.toggle('active', !isOpen);
                    toggle.setAttribute('aria-expanded', !isOpen);
                }
            } else if (type === 'settings') {
                const dropdown = this.elements['settings-dropdown'];
                const toggle = this.elements['settings-toggle'];
                
                if (dropdown && toggle) {
                    const isOpen = dropdown.classList.contains('show');
                    
                    if (this.elements['server-dropdown']) {
                        this.elements['server-dropdown'].classList.remove('show');
                    }
                    if (this.elements['server-toggle']) {
                        this.elements['server-toggle'].classList.remove('active');
                        this.elements['server-toggle'].setAttribute('aria-expanded', 'false');
                    }
                    
                    dropdown.classList.toggle('show', !isOpen);
                    toggle.classList.toggle('active', !isOpen);
                    toggle.setAttribute('aria-expanded', !isOpen);
                }
            }
        } catch (error) {
            console.error("Error toggling dropdown:", error);
        }
    }

    closeAllDropdowns() {
        try {
            ['server-dropdown', 'settings-dropdown'].forEach(id => {
                if (this.elements[id]) {
                    this.elements[id].classList.remove('show');
                }
            });
            
            ['server-toggle', 'settings-toggle'].forEach(id => {
                if (this.elements[id]) {
                    this.elements[id].classList.remove('active');
                    this.elements[id].setAttribute('aria-expanded', 'false');
                }
            });
        } catch (error) {
            console.error("Error closing dropdowns:", error);
        }
    }

    getServerTime() {
        try {
            const now = new Date();
            const offset = Number(this.timeOffset) || 0;
            return new Date(now.getTime() + (offset * 60 * 60 * 1000));
        } catch (error) {
            return new Date();
        }
    }

    // CORRECTED: 5-phase Arms Race as per PDF
    getCurrentArmsPhaseInfo() {
        try {
            const now = this.getServerTime();
            const hour = now.getUTCHours();
            const phaseIndex = Math.floor(hour / 4) % 5; // 5 phases, not 6
            const phases = ["City Building", "Unit Progression", "Tech Research", "Drone Boost", "Hero Advancement"];
            
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
                nextStartHour: nextPhaseStartHour === 0 ? 20 : nextPhaseStartHour // Last phase ends at 20:00
            };
        } catch (error) {
            return { name: "City Building", index: 0, startHour: 0, nextStartHour: 4 };
        }
    }

    getCurrentVSDayInfo() {
        try {
            const now = this.getServerTime();
            const dayOfWeek = now.getUTCDay();
            return this.data.vsdays.find(day => day.day === dayOfWeek) || 
                   { day: 0, name: "Sunday", title: "Preparation Day" };
        } catch (error) {
            return { day: 0, name: "Sunday", title: "Preparation Day" };
        }
    }

    isCurrentlyHighPriority() {
        try {
            const vsDayInfo = this.getCurrentVSDayInfo();
            const armsPhaseInfo = this.getCurrentArmsPhaseInfo();
            
            return this.data.highpriorityalignments.find(a => 
                a.vsday === vsDayInfo.day && 
                a.armsphase === armsPhaseInfo.name
            ) || null;
        } catch (error) {
            return null;
        }
    }

    findNextPriorityWindow() {
        try {
            const now = this.getServerTime();
            let nearestWindow = null;
            let minTimeDiff = Infinity;
            
            const phaseSchedule = {
                "City Building": [0],
                "Unit Progression": [4],
                "Tech Research": [8],
                "Drone Boost": [12],
                "Hero Advancement": [16]
            };
            
            for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
                const checkDate = new Date(now);
                checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                checkDate.setUTCHours(0, 0, 0, 0);
                
                const checkDay = checkDate.getUTCDay();
                const vsDayData = this.data.vsdays.find(day => day.day === checkDay);
                
                if (!vsDayData) continue;
                
                const dayAlignments = this.data.highpriorityalignments.filter(a => a.vsday === checkDay);
                
                for (const alignment of dayAlignments) {
                    const phaseHours = phaseSchedule[alignment.armsphase] || [];
                    
                    for (const hour of phaseHours) {
                        const windowTime = new Date(checkDate);
                        windowTime.setUTCHours(hour, 0, 0, 0);
                        
                        const timeDiff = windowTime.getTime() - now.getTime();
                        
                        if (timeDiff > 0 && isFinite(timeDiff) && timeDiff < minTimeDiff) {
                            minTimeDiff = timeDiff;
                            nearestWindow = {
                                startTime: windowTime,
                                vsDay: checkDay,
                                vsTitle: vsDayData.title,
                                armsPhase: alignment.armsphase,
                                reason: alignment.reason,
                                benefit: alignment.benefit,
                                timeToWindow: this.safeFormatTimeDifference(timeDiff),
                                timeDiffMs: timeDiff
                            };
                        }
                    }
                }
            }
            
            return nearestWindow;
        } catch (error) {
            return null;
        }
    }

    populateAllSections() {
        try {
            this.populatePriorityGrid();
            this.populateScheduleGrid();
            this.populateGuidesHub();
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
    // If no active windows, show the next upcoming window
    if (priorityWindows.length === 0) {
        const nextWindow = this.generatePriorityWindows().find(w => w.timeToStart > 0);
        if (nextWindow) {
            priorityWindows = [nextWindow];
        }
    }
} else if (this.activeFilter === 'upcoming') {
    priorityWindows = priorityWindows.filter(w => !w.isActive && w.timeToStart > 0);
}


            if (this.elements['priority-count']) {
                this.elements['priority-count'].textContent = `${priorityWindows.length} Windows`;
            }

            if (priorityWindows.length === 0) {
                grid.innerHTML = '<div class="loading-message">No priority windows found for current filter</div>';
                return;
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
                            <div class="points-potential">${window.benefit}</div>
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
        }
    }

    populateGuidesHub() {
        try {
            const hub = this.elements['guides-content'];
            if (!hub) return;

            const guides = this.generateStrategyGuides();
            
            if (this.elements['guides-count']) {
                this.elements['guides-count'].textContent = `${guides.length} Guides`;
            }
            
            hub.innerHTML = `
                <div class="guides-grid">
                    ${guides.map(guide => `
                        <div class="guide-card ${guide.featured ? 'featured' : ''}">
                            <div class="guide-header">
                                <div class="guide-icon">${guide.icon}</div>
                                <div class="guide-meta">
                                    <h3 class="guide-title">${guide.title}</h3>
                                    <div class="guide-category">${guide.category}</div>
                                </div>
                                <div class="guide-rating">${guide.importance}</div>
                            </div>
                            <div class="guide-content">
                                <p class="guide-description">${guide.description}</p>
                                <div class="guide-stats">
                                    <span class="stat">📈 ${guide.benefit}</span>
                                    <span class="stat">⏰ ${guide.timing}</span>
                                    <span class="stat">🎯 ${guide.focus}</span>
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
            console.error("Error populating guides hub:", error);
        }
    }

    generateStrategyGuides() {
        return [
            {
                title: "Dual Event Optimization",
                category: "Core Strategy",
                icon: "🎯",
                importance: "Essential",
                featured: true,
                description: "Time your activities when Arms Race phases align with Alliance Duel focus days. Complete building upgrades during City Building phase on Base Expansion Tuesday for maximum VS points.",
                benefit: "Double Rewards",
                timing: "4-hour windows",
                focus: "Event Alignment",
                tags: ["Core", "VS Points", "Arms Race"]
            },
            {
                title: "Speedup Conservation",
                category: "Resource Management",
                icon: "⏱️",
                importance: "Critical",
                featured: false,
                description: "Save construction speedups for Tuesday Base Expansion + City Building phase alignment. Save research speedups for Wednesday Age of Science + Tech Research phase.",
                benefit: "Resource Efficiency",
                timing: "Weekly Planning",
                focus: "Speedup Management",
                tags: ["Resources", "Planning", "Efficiency"]
            },
            {
                title: "Server Time Mastery",
                category: "Timing",
                icon: "🕐",
                importance: "Important",
                featured: false,
                description: "Understand your server's reset time and Arms Race rotation. Plan activities around the 5-minute post-reset window when Alliance Duel points are unavailable.",
                benefit: "Perfect Timing",
                timing: "Server Reset",
                focus: "Time Management",
                tags: ["Server", "Reset", "Timing"]
            },
            {
                title: "Friday Total Mobilization",
                category: "Peak Efficiency",
                icon: "🚀",
                importance: "High Priority",
                featured: true,
                description: "Use all saved speedups on Friday Total Mobilization day. Coordinate with Arms Race phases - City Building, Unit Progression, or Tech Research for triple benefits.",
                benefit: "Maximum Output",
                timing: "Friday Peak",
                focus: "All Activities",
                tags: ["Friday", "Speedups", "Maximum"]
            },
            {
                title: "Alliance Coordination",
                category: "Team Strategy",
                icon: "🤝",
                importance: "Valuable",
                featured: false,
                description: "Share high-priority window timings with alliance members. Coordinate Total Mobilization Friday activities and Alliance Duel participation for collective benefits.",
                benefit: "Team Synergy",
                timing: "Alliance Events",
                focus: "Coordination",
                tags: ["Alliance", "Team", "Communication"]
            },
            {
                title: "Hero Day Optimization",
                category: "Thursday Focus",
                icon: "🦸",
                importance: "Focused",
                featured: false,
                description: "Save recruitment tickets and hero EXP items for Thursday Train Heroes day. Time usage during Hero Advancement Arms Race phase for dual rewards.",
                benefit: "Hero Efficiency",
                timing: "Thursday",
                focus: "Hero Development",
                tags: ["Heroes", "Thursday", "Recruitment"]
            },
            {
                title: "Research Valor Strategy",
                category: "Wednesday Focus",
                icon: "🔬",
                importance: "Specialized",
                featured: false,
                description: "Use valor badges and research speedups on Wednesday Age of Science day during Tech Research Arms Race phase. Complete high-value research projects for maximum points.",
                benefit: "Research Focus",
                timing: "Wednesday",
                focus: "Technology",
                tags: ["Research", "Valor", "Wednesday"]
            },
            {
                title: "Preparation Day Planning",
                category: "Sunday Setup",
                icon: "📋",
                importance: "Foundation",
                featured: false,
                description: "Use Sunday to prepare for the week. Save radar missions for Monday, prepare building gifts for Tuesday, and organize resources for optimal weekly performance.",
                benefit: "Week Preparation",
                timing: "Sunday",
                focus: "Weekly Planning",
                tags: ["Sunday", "Preparation", "Planning"]
            }
        ];
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
                        const isActive = timeDiff <= 0 && timeDiff > -(4 * 60 * 60 * 1000);
                        
                        windows.push({
                            time: windowTime,
                            timeToStart: timeDiff,
                            timeDisplay: this.formatTimeToWindow(timeDiff),
                            armsPhase: alignment.armsphase,
                            vsTitle: vsDay.title,
                            benefit: alignment.benefit,
                            reason: alignment.reason,
                            isActive: isActive,
                            isPeak: alignment.benefit.includes('Maximum') || alignment.benefit.includes('Peak') || alignment.benefit.includes('Perfect'),
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
                const phaseHours = [0, 4, 8, 12, 16]; // 5 phases
                const phaseNames = ["City Building", "Unit Progression", "Tech Research", "Drone Boost", "Hero Advancement"];
                
                for (let i = 0; i < phaseHours.length; i++) {
                    const hour = phaseHours[i];
                    const nextHour = phaseHours[i + 1] || 20; // Last phase ends at 20:00
                    const phaseName = phaseNames[i];
                    const phase = this.data.armsracephases.find(p => p.name === phaseName);
                    
                    const isPriority = this.data.highpriorityalignments.some(a => 
                        a.vsday === dayOfWeek && a.armsphase === phaseName
                    );
                    
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
            return [];
        }
    }

    getPhaseHours(phaseName) {
        const phaseMap = {
            "City Building": [0],
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

    safeFormatTimeDifference(timeDiffMs) {
        try {
            if (!isFinite(timeDiffMs) || timeDiffMs < 0) return "Starting Soon";
            const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
            return hours > 0 ? `${hours}h ${minutes}m` : `${Math.max(1, minutes)}m`;
        } catch (error) {
            return "Error";
        }
    }

    calculateTimeUntilPhaseEnd() {
        try {
            const now = this.getServerTime();
            const currentHour = now.getUTCHours();
            const phaseStarts = [0, 4, 8, 12, 16]; // 5 phases
            let nextPhaseHour = 20; // Last phase ends at 20:00
            
            for (const startHour of phaseStarts) {
                if (currentHour < startHour) {
                    nextPhaseHour = startHour;
                    break;
                }
            }
            
            let hoursToNext = nextPhaseHour - currentHour;
            let minutesToNext = -now.getUTCMinutes();
            
            if (minutesToNext < 0) {
                minutesToNext += 60;
                hoursToNext--;
            }
            
            if (hoursToNext <= 0) {
                hoursToNext += 24;
            }
            
            return hoursToNext > 0 ? `${hoursToNext}h ${minutesToNext}m` : `${Math.max(0, minutesToNext)}m`;
        } catch (error) {
            return "Error";
        }
    }

    // Smart Notifications
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const modal = document.getElementById('notification-modal');
            if (modal) {
                modal.style.display = 'flex';
                
                return new Promise((resolve) => {
                    document.getElementById('enable-notifications').onclick = async () => {
                        modal.style.display = 'none';
                        const permission = await Notification.requestPermission();
                        this.notificationsEnabled = permission === 'granted';
                        localStorage.setItem('lwn-notifications', this.notificationsEnabled);
                        resolve(this.notificationsEnabled);
                    };
                    
                    document.getElementById('decline-notifications').onclick = () => {
                        modal.style.display = 'none';
                        localStorage.setItem('lwn-notifications', false);
                        resolve(false);
                    };
                });
            }
        }
        
        return this.notificationsEnabled;
    }
    
    showNotification(title, body, icon = '🎯') {
        if (this.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${icon}</text></svg>`,
                tag: 'lastwar-priority',
                requireInteraction: false
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            
            setTimeout(() => notification.close(), 5000);
        }
    }

    updateBanner() {
        try {
            const banner = document.getElementById('priority-banner');
            if (!banner) return;
            
            const activeAlignment = this.isCurrentlyHighPriority();
            const nextWindow = this.findNextPriorityWindow();
            
            const hiddenUntil = localStorage.getItem('banner-hidden-until');
            if (hiddenUntil && Date.now() < parseInt(hiddenUntil)) {
                this.hideBanner();
                return;
            }
            
            if (activeAlignment) {
                const currentArmsPhase = this.getCurrentArmsPhaseInfo();
                const currentVSDay = this.getCurrentVSDayInfo();
                const timeRemaining = this.calculateTimeUntilPhaseEnd();
                
                this.safeUpdateElement('banner-title', 'textContent', 'Peak Efficiency Active!');
                this.safeUpdateElement('banner-subtitle', 'textContent', 
                    `${currentArmsPhase.name} + ${currentVSDay.title} - Use speedups now!`);
                this.safeUpdateElement('banner-time', 'textContent', timeRemaining);
                
                banner.className = 'priority-banner peak-priority show';
                banner.setAttribute('aria-label', `High priority window active: ${activeAlignment.benefit}`);
                
                if (!this.lastNotifiedWindow || this.lastNotifiedWindow !== activeAlignment.reason) {
                    this.showNotification(
                        'High Priority Window Active!', 
                        `${currentArmsPhase.name} + ${currentVSDay.title}`,
                        '⚡'
                    );
                    this.lastNotifiedWindow = activeAlignment.reason;
                }
                
            } else if (nextWindow && nextWindow.timeDiffMs && nextWindow.timeDiffMs < (2 * 60 * 60 * 1000)) {
                this.safeUpdateElement('banner-title', 'textContent', 'High Priority Soon');
                this.safeUpdateElement('banner-subtitle', 'textContent', 
                    `${nextWindow.armsPhase} + ${nextWindow.vsTitle} starting soon`);
                this.safeUpdateElement('banner-time', 'textContent', nextWindow.timeToWindow);
                
                banner.className = 'priority-banner high-priority show';
                banner.setAttribute('aria-label', `High priority window starting in ${nextWindow.timeToWindow}`);
            } else {
                this.hideBanner();
            }
        } catch (error) {
            console.error("Error updating banner:", error);
        }
    }

    showBanner() {
        const banner = document.getElementById('priority-banner');
        if (banner) {
            banner.classList.remove('hidden');
            banner.classList.add('show');
        }
    }

    hideBanner() {
        const banner = document.getElementById('priority-banner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hidden');
        }
    }

    updatePhaseProgress() {
        try {
            const now = this.getServerTime();
            const currentHour = now.getUTCHours();
            const phaseStart = Math.floor(currentHour / 4) * 4;
            const phaseEnd = phaseStart + 4;
            
            const elapsed = currentHour - phaseStart + (now.getUTCMinutes() / 60);
            const progress = (elapsed / 4) * 100;
            
            const progressFill = document.getElementById('phase-progress-fill');
            if (progressFill) {
                progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            }
            
            const currentPhase = this.getCurrentArmsPhaseInfo();
            const nextPhaseIndex = (currentPhase.index + 1) % 5;
            const phaseNames = ["City Building", "Unit Progression", "Tech Research", "Drone Boost", "Hero Advancement"];
            const nextPhaseName = phaseNames[nextPhaseIndex];
            
            this.safeUpdateElement('current-phase-name', 'textContent', `${currentPhase.name} Active`);
            this.safeUpdateElement('next-phase-name', 'textContent', `${nextPhaseName} Next`);
        } catch (error) {
            console.error("Error updating phase progress:", error);
        }
    }

    updateTimeDisplays() {
        try {
            const serverTime = this.getServerTime();
            const localTime = new Date();
            
            if (serverTime) {
                const serverTimeString = serverTime.toUTCString().slice(17, 25);
                this.safeUpdateElement('server-time', 'textContent', serverTimeString);
                
                const localTimeString = localTime.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                this.safeUpdateElement('local-time', 'textContent', localTimeString);
                
                const nextReset = new Date(serverTime);
                nextReset.setUTCHours(24, 0, 0, 0);
                const timeToReset = nextReset.getTime() - serverTime.getTime();
                const resetCountdown = this.safeFormatTimeDifference(timeToReset);
                this.safeUpdateElement('next-reset-countdown', 'textContent', resetCountdown);
            }
        } catch (error) {
            console.error("Error updating time displays:", error);
        }
    }

    handleOfflineState() {
        const showOfflineIndicator = () => {
            if (!document.getElementById('offline-indicator')) {
                const indicator = document.createElement('div');
                indicator.id = 'offline-indicator';
                indicator.className = 'offline-indicator';
                indicator.textContent = '⚠️ Offline - Times may be inaccurate';
                indicator.setAttribute('role', 'alert');
                document.body.appendChild(indicator);
            }
        };
        
        const hideOfflineIndicator = () => {
            const indicator = document.getElementById('offline-indicator');
            if (indicator) {
                indicator.remove();
            }
        };
        
        window.addEventListener('online', () => {
            hideOfflineIndicator();
            this.announceToScreenReader('Connection restored');
            this.updateAllDisplays();
        });
        
        window.addEventListener('offline', () => {
            showOfflineIndicator();
            this.announceToScreenReader('Connection lost - times may be inaccurate');
        });
    }

    syncWithServer() {
        this.announceToScreenReader('Syncing time with server');
        this.updateAllDisplays();
    }

    updateCurrentStatus() {
        try {
            const currentVSDay = this.getCurrentVSDayInfo();
            const currentArmsPhase = this.getCurrentArmsPhaseInfo();
            const activeAlignment = this.isCurrentlyHighPriority();
            
            if (activeAlignment) {
                this.displayActiveAlignment(activeAlignment, currentArmsPhase, currentVSDay);
            } else {
                this.displayNextWindow();
            }
            this.updateBasicInfo(currentVSDay, currentArmsPhase);
        } catch (error) {
            console.error("Error in updateCurrentStatus:", error);
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
        }
    }

    displayNextWindow() {
        try {
            this.safeUpdateElement('active-now', 'style', { display: 'none' });
            
            const nextWindow = this.findNextPriorityWindow();
            
            if (nextWindow && nextWindow.timeToWindow) {
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
        }
    }

    safeUpdateElement(elementId, property, value) {
        try {
            const element = this.elements[elementId] || document.getElementById(elementId);
            if (element && property === 'textContent') {
                element.textContent = value || 'Loading...';
            } else if (element && property === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            }
        } catch (error) {
            console.warn(`Error updating ${elementId}:`, error);
        }
    }

    updateBasicInfo(vsDay, armsPhase) {
        this.safeUpdateElement('current-vs-day', 'textContent', vsDay.title);
        this.safeUpdateElement('arms-phase', 'textContent', armsPhase.name);
        const nextChangeTime = this.calculateTimeUntilPhaseEnd();
        this.safeUpdateElement('next-alignment-countdown', 'textContent', nextChangeTime);
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
            this.closeAllDropdowns();
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

    startUpdateLoop() {
        try {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            
            this.updateInterval = setInterval(() => {
                if (this.isInitialized && this.isVisible) {
                    this.updateAllDisplays();
                }
            }, this.updateFrequency);
        } catch (error) {
            console.error("Error starting update loop:", error);
        }
    }

    updateAllDisplays() {
        try {
            this.updateTimeDisplays();
            this.updateCurrentStatus();
            this.updateCountdown();
            this.updateBanner();
            this.updatePhaseProgress();
            this.updateARIALabels();
        } catch (error) {
            console.error("Error updating displays:", error);
        }
    }

    updateCountdown() {
        try {
            const now = this.getServerTime();
            const currentHour = now.getUTCHours();
            const phaseStarts = [0, 4, 8, 12, 16]; // 5 phases
            let nextPhaseStart = 20; // Last phase ends at 20:00
            
            for (const start of phaseStarts) {
                if (currentHour < start) {
                    nextPhaseStart = start;
                    break;
                }
            }
            
            const nextPhaseTime = new Date(now);
            if (nextPhaseStart === 20) {
                nextPhaseTime.setUTCDate(now.getUTCDate() + 1);
                nextPhaseTime.setUTCHours(0, 0, 0, 0);
            } else {
                nextPhaseTime.setUTCHours(nextPhaseStart, 0, 0, 0);
            }
            
            const timeDiff = nextPhaseTime.getTime() - now.getTime();
            if (timeDiff > 0) {
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                
                const countdownText = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
                this.safeUpdateElement('countdown-timer', 'textContent', countdownText);
                
                const nextPhaseIndex = Math.floor(nextPhaseStart / 4) % this.data.armsracephases.length;
                const nextPhase = this.data.armsracephases[nextPhaseIndex];
                this.safeUpdateElement('event-name', 'textContent', `${nextPhase.name} Phase`);
            }
        } catch (error) {
            console.error("Error updating countdown:", error);
        }
    }

    destroy() {
        document.removeEventListener('visibilitychange', this.visibilityHandler);
        document.removeEventListener('keydown', this.keyboardHandler);
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.cardObserver) {
            this.cardObserver.disconnect();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing Last War Nexus with all A+ features...");
    new LastWarNexus();
});
