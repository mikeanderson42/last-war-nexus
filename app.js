/**
 * Last War Nexus - VS Points & Arms Race Optimizer
 * WORKING VERSION - Fixed setup modal interactions and time offset handling
 */

class VSPointsOptimizer {
    constructor() {
        this.timeOffset = 0;
        this.isVisible = true;
        this.updateInterval = null;
        this.setupTimeInterval = null;
        this.activeTab = 'priority';
        this.notificationsEnabled = false;
        this.lastNotifiedWindow = null;
        this.isSetupComplete = false;
        this.currentPhaseOverride = null;
        this.nextPhaseOverride = null;

        // CORRECTED: 6 distinct Arms Race phases
        this.data = {
            armsRacePhases: [
                { 
                    id: 'city_building', 
                    name: "City Building", 
                    icon: "🏗️", 
                    activities: ["Building upgrades", "Construction speedups", "Base expansion", "Power increases"] 
                },
                { 
                    id: 'unit_progression', 
                    name: "Unit Progression", 
                    icon: "⚔️", 
                    activities: ["Troop training", "Training speedups", "Unit upgrades", "Military expansion"] 
                },
                { 
                    id: 'tech_research', 
                    name: "Tech Research", 
                    icon: "🔬", 
                    activities: ["Research completion", "Research speedups", "Tech advancement", "Innovation points"] 
                },
                { 
                    id: 'drone_boost', 
                    name: "Drone Boost", 
                    icon: "🚁", 
                    activities: ["Stamina usage", "Drone missions", "Radar activities", "Drone Combat Data"] 
                },
                { 
                    id: 'hero_advancement', 
                    name: "Hero Advancement", 
                    icon: "🦸", 
                    activities: ["Hero recruitment", "Hero EXP", "Skill medals", "Legendary tickets"] 
                },
                { 
                    id: 'equipment_enhancement', 
                    name: "Equipment Enhancement", 
                    icon: "⚒️", 
                    activities: ["Gear crafting", "Equipment upgrades", "Chip enhancement", "Material processing"] 
                }
            ],
            
            vsDays: [
                { day: 1, name: "Monday", title: "Radar Training", focus: "Radar missions, stamina use, hero EXP, drone data" },
                { day: 2, name: "Tuesday", title: "Base Expansion", focus: "Construction speedups, building power, legendary trucks" },
                { day: 3, name: "Wednesday", title: "Age of Science", focus: "Research speedups, tech power, valor badges" },
                { day: 4, name: "Thursday", title: "Train Heroes", focus: "Hero recruitment, EXP, shards, skill medals" },
                { day: 5, name: "Friday", title: "Total Mobilization", focus: "All speedups, radar missions, comprehensive activities" },
                { day: 6, name: "Saturday", title: "Enemy Buster", focus: "Combat focus, troop elimination, healing speedups" }
            ],
            
            priorityAlignments: [
                { vsDay: 1, armsPhase: "Drone Boost", reason: "Stamina & radar activities align perfectly", benefit: "Maximum Efficiency" },
                { vsDay: 2, armsPhase: "City Building", reason: "Construction activities align perfectly", benefit: "Perfect Match" },
                { vsDay: 3, armsPhase: "Tech Research", reason: "Research activities align perfectly", benefit: "Perfect Alignment" },
                { vsDay: 4, armsPhase: "Hero Advancement", reason: "Hero activities align perfectly", benefit: "Perfect Match" },
                { vsDay: 5, armsPhase: "City Building", reason: "Construction component of total mobilization", benefit: "Peak Efficiency" },
                { vsDay: 6, armsPhase: "Unit Progression", reason: "Troop training supports combat preparation", benefit: "Strong Synergy" }
            ]
        };

        this.init();
    }

    init() {
        try {
            this.loadSettings();
            this.setupEventListeners();
            
            if (!this.isSetupComplete) {
                this.showSetupModal();
            } else {
                this.updateAllDisplays();
                this.startUpdateLoop();
            }
        } catch (error) {
            console.error('Initialization error:', error);
            this.handleError('Failed to initialize application');
        }
    }

    setupEventListeners() {
        try {
            // Setup modal event listeners - FIXED
            this.setupSetupModalEvents();
            
            // Main navigation
            const serverToggle = document.getElementById('server-toggle');
            if (serverToggle) {
                serverToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown('server');
                });
            }

            const settingsToggle = document.getElementById('settings-toggle');
            if (settingsToggle) {
                settingsToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown('settings');
                });
            }

            // Tab navigation
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tab = e.currentTarget.getAttribute('data-tab');
                    if (tab) {
                        this.switchTab(tab);
                    }
                });
            });

            // Settings dropdowns
            const timeOffsetSelect = document.getElementById('time-offset');
            if (timeOffsetSelect) {
                timeOffsetSelect.addEventListener('change', (e) => {
                    this.timeOffset = parseInt(e.target.value, 10);
                    this.saveSettings();
                    this.updateAllDisplays();
                });
            }

            const notificationsToggle = document.getElementById('notifications-toggle');
            if (notificationsToggle) {
                notificationsToggle.addEventListener('change', (e) => {
                    const enabled = e.target.value === 'enabled';
                    this.setNotifications(enabled);
                });
            }

            // Setup button
            const setupButton = document.getElementById('setup-button');
            if (setupButton) {
                setupButton.addEventListener('click', () => {
                    this.showSetupModal();
                });
            }

            // Close dropdowns on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.server-dropdown-container') && 
                    !e.target.closest('.settings-dropdown-container')) {
                    this.closeAllDropdowns();
                }
            });

            // Banner close
            const bannerClose = document.getElementById('banner-close');
            if (bannerClose) {
                bannerClose.addEventListener('click', () => {
                    this.hideBanner();
                });
            }

            // Visibility change handling
            document.addEventListener('visibilitychange', () => {
                this.isVisible = !document.hidden;
                if (this.isVisible) {
                    this.updateAllDisplays();
                }
            });

        } catch (error) {
            console.error('Event listener setup error:', error);
        }
    }

    // FIXED: Setup modal event listeners
    setupSetupModalEvents() {
        try {
            // Setup time offset change - FIXED
            const setupTimeOffset = document.getElementById('setup-time-offset');
            if (setupTimeOffset) {
                setupTimeOffset.addEventListener('change', (e) => {
                    this.timeOffset = parseInt(e.target.value, 10);
                    this.updateSetupTimezone();
                    this.updateSetupTime(); // Update time immediately
                });
            }

            // Setup complete button - FIXED
            const setupComplete = document.getElementById('setup-complete');
            if (setupComplete) {
                setupComplete.addEventListener('click', () => {
                    this.completeSetup();
                });
            }

            // Setup skip button - FIXED
            const setupSkip = document.getElementById('setup-skip');
            if (setupSkip) {
                setupSkip.addEventListener('click', () => {
                    this.skipSetup();
                });
            }

            // Next phase auto-update based on current phase
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            if (setupCurrentPhase) {
                setupCurrentPhase.addEventListener('change', (e) => {
                    this.updateNextPhaseOptions(e.target.value);
                });
            }

            // Modal backdrop click to close
            const backdrop = document.querySelector('.setup-modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    this.skipSetup();
                });
            }

        } catch (error) {
            console.error('Setup modal events error:', error);
        }
    }

    showSetupModal() {
        const modal = document.getElementById('setup-modal');
        if (modal) {
            modal.classList.add('show');
            this.startSetupTimeUpdate();
            this.populateSetupDefaults();
        }
    }

    hideSetupModal() {
        const modal = document.getElementById('setup-modal');
        if (modal) {
            modal.classList.remove('show');
            this.stopSetupTimeUpdate();
        }
    }

    populateSetupDefaults() {
        try {
            // Set current time offset
            const setupTimeOffset = document.getElementById('setup-time-offset');
            if (setupTimeOffset) {
                setupTimeOffset.value = this.timeOffset.toString();
            }

            // Auto-detect current phase based on time
            const autoPhase = this.getCurrentArmsPhase();
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            if (setupCurrentPhase && !this.currentPhaseOverride) {
                setupCurrentPhase.value = autoPhase.id;
            }

            // Set next phase based on current
            this.updateNextPhaseOptions(setupCurrentPhase?.value || autoPhase.id);

            this.updateSetupTimezone();
        } catch (error) {
            console.error('Setup defaults error:', error);
        }
    }

    updateNextPhaseOptions(currentPhaseId) {
        try {
            const setupNextPhase = document.getElementById('setup-next-phase');
            if (!setupNextPhase) return;

            const currentIndex = this.data.armsRacePhases.findIndex(p => p.id === currentPhaseId);
            const nextIndex = (currentIndex + 1) % this.data.armsRacePhases.length;
            const nextPhase = this.data.armsRacePhases[nextIndex];

            setupNextPhase.value = nextPhase.id;
        } catch (error) {
            console.error('Next phase options error:', error);
        }
    }

    updateSetupTimezone() {
        const offsetElement = document.getElementById('setup-timezone-offset');
        if (offsetElement) {
            const sign = this.timeOffset >= 0 ? '+' : '';
            offsetElement.textContent = `${sign}${this.timeOffset}`;
        }
    }

    startSetupTimeUpdate() {
        this.stopSetupTimeUpdate();
        this.updateSetupTime();
        this.setupTimeInterval = setInterval(() => {
            this.updateSetupTime();
        }, 1000);
    }

    stopSetupTimeUpdate() {
        if (this.setupTimeInterval) {
            clearInterval(this.setupTimeInterval);
            this.setupTimeInterval = null;
        }
    }

    updateSetupTime() {
        try {
            const serverTime = this.getServerTime();
            const timeString = serverTime.toUTCString().slice(17, 25);
            
            const timeElement = document.getElementById('setup-server-time');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        } catch (error) {
            console.error('Setup time update error:', error);
        }
    }

    // FIXED: Complete setup functionality
    async completeSetup() {
        try {
            // Get setup values
            const setupTimeOffset = document.getElementById('setup-time-offset');
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            const setupNextPhase = document.getElementById('setup-next-phase');
            const notificationRadios = document.querySelectorAll('input[name="notifications"]');

            // Apply settings
            this.timeOffset = parseInt(setupTimeOffset?.value || '0', 10);
            this.currentPhaseOverride = setupCurrentPhase?.value || null;
            this.nextPhaseOverride = setupNextPhase?.value || null;

            // Handle notifications
            const notificationChoice = Array.from(notificationRadios).find(r => r.checked)?.value;
            const wantsNotifications = notificationChoice === 'enabled';

            if (wantsNotifications) {
                await this.requestNotificationPermission();
            } else {
                this.notificationsEnabled = false;
            }

            // Mark setup as complete
            this.isSetupComplete = true;

            // Save all settings
            this.saveSettings();

            // Update UI
            this.syncSettingsToUI();

            // Hide modal and start app
            this.hideSetupModal();
            this.updateAllDisplays();
            this.startUpdateLoop();

        } catch (error) {
            console.error('Setup completion error:', error);
            this.handleError('Failed to complete setup');
        }
    }

    // FIXED: Skip setup functionality
    skipSetup() {
        try {
            // Use default settings
            this.timeOffset = 0;
            this.currentPhaseOverride = null;
            this.nextPhaseOverride = null;
            this.notificationsEnabled = false;
            this.isSetupComplete = true;

            // Save settings
            this.saveSettings();

            // Update UI
            this.syncSettingsToUI();

            // Hide modal and start app
            this.hideSetupModal();
            this.updateAllDisplays();
            this.startUpdateLoop();

        } catch (error) {
            console.error('Setup skip error:', error);
        }
    }

    async setNotifications(enabled) {
        try {
            if (enabled) {
                const permission = await this.requestNotificationPermission();
                this.notificationsEnabled = permission;
            } else {
                this.notificationsEnabled = false;
            }
            
            this.saveSettings();
            this.syncSettingsToUI();
            
        } catch (error) {
            console.error('Notification setting error:', error);
        }
    }

    syncSettingsToUI() {
        try {
            const timeOffsetSelect = document.getElementById('time-offset');
            if (timeOffsetSelect) timeOffsetSelect.value = this.timeOffset.toString();

            const notificationsToggle = document.getElementById('notifications-toggle');
            if (notificationsToggle) notificationsToggle.value = this.notificationsEnabled ? 'enabled' : 'disabled';

            const currentPhaseSelect = document.getElementById('current-phase-select');
            if (currentPhaseSelect && this.currentPhaseOverride) {
                currentPhaseSelect.value = this.currentPhaseOverride;
            }

            const nextPhaseSelect = document.getElementById('next-phase-select');
            if (nextPhaseSelect && this.nextPhaseOverride) {
                nextPhaseSelect.value = this.nextPhaseOverride;
            }

        } catch (error) {
            console.error('UI sync error:', error);
        }
    }

    toggleDropdown(type) {
        const dropdown = document.getElementById(`${type}-dropdown`);
        const toggle = document.getElementById(`${type}-toggle`);
        
        if (dropdown && toggle) {
            const isOpen = dropdown.classList.contains('show');
            this.closeAllDropdowns();
            
            if (!isOpen) {
                dropdown.classList.add('show');
                toggle.classList.add('active');
            }
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.server-dropdown, .settings-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        document.querySelectorAll('.server-btn, .settings-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    switchTab(tabName) {
        try {
            this.activeTab = tabName;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Activate selected tab
            const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
            const activePanel = document.getElementById(`${tabName}-tab`);
            
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.setAttribute('aria-selected', 'true');
            }
            if (activePanel) {
                activePanel.classList.add('active');
            }
            
            // Populate content
            this.populateTabContent(tabName);
            
        } catch (error) {
            console.error('Tab switch error:', error);
        }
    }

    getServerTime() {
        try {
            const now = new Date();
            return new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
        } catch (error) {
            console.error('Server time calculation error:', error);
            return new Date();
        }
    }

    // Calculate current Arms Race phase (6 distinct phases)
    getCurrentArmsPhase() {
        try {
            if (this.currentPhaseOverride) {
                const overridePhase = this.data.armsRacePhases.find(p => p.id === this.currentPhaseOverride);
                if (overridePhase) {
                    const serverTime = this.getServerTime();
                    const hour = serverTime.getUTCHours();
                    
                    return {
                        ...overridePhase,
                        position: Math.floor(hour / 4),
                        startHour: Math.floor(hour / 4) * 4,
                        endHour: (Math.floor(hour / 4) * 4 + 4) % 24,
                        hoursRemaining: 4 - (hour % 4),
                        minutesRemaining: 60 - serverTime.getUTCMinutes(),
                        isOverride: true
                    };
                }
            }

            const serverTime = this.getServerTime();
            const hour = serverTime.getUTCHours();
            
            // Calculate which of the 6 phases (0-5) we're in
            const phaseIndex = Math.floor(hour / 4);
            const phase = this.data.armsRacePhases[phaseIndex];
            
            return {
                ...phase,
                position: phaseIndex,
                startHour: phaseIndex * 4,
                endHour: (phaseIndex * 4 + 4) % 24,
                hoursRemaining: 4 - (hour % 4),
                minutesRemaining: 60 - serverTime.getUTCMinutes(),
                isOverride: false
            };
        } catch (error) {
            console.error('Arms phase calculation error:', error);
            return this.data.armsRacePhases[0];
        }
    }

    getNextArmsPhase() {
        try {
            if (this.nextPhaseOverride) {
                const overridePhase = this.data.armsRacePhases.find(p => p.id === this.nextPhaseOverride);
                if (overridePhase) {
                    return { ...overridePhase, isOverride: true };
                }
            }

            const currentPhase = this.getCurrentArmsPhase();
            const currentIndex = this.data.armsRacePhases.findIndex(p => p.id === currentPhase.id);
            const nextIndex = (currentIndex + 1) % this.data.armsRacePhases.length;
            
            return { ...this.data.armsRacePhases[nextIndex], isOverride: false };
        } catch (error) {
            console.error('Next phase calculation error:', error);
            return this.data.armsRacePhases[0];
        }
    }

    getCurrentVSDay() {
        try {
            const serverTime = this.getServerTime();
            const dayOfWeek = serverTime.getUTCDay();
            
            const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek);
            
            if (vsDay) {
                return vsDay;
            } else {
                return { 
                    day: 0, 
                    name: "Sunday", 
                    title: "Preparation Day", 
                    focus: "Prepare resources and plan for the week ahead"
                };
            }
        } catch (error) {
            console.error('VS day calculation error:', error);
            return this.data.vsDays[0];
        }
    }

    isCurrentlyHighPriority() {
        try {
            const currentVSDay = this.getCurrentVSDay();
            const currentArmsPhase = this.getCurrentArmsPhase();
            
            return this.data.priorityAlignments.find(alignment => 
                alignment.vsDay === currentVSDay.day && 
                alignment.armsPhase === currentArmsPhase.name
            );
        } catch (error) {
            console.error('Priority check error:', error);
            return null;
        }
    }

    formatTime(milliseconds) {
        if (milliseconds <= 0) return "0m";
        
        const totalMinutes = Math.floor(milliseconds / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${Math.max(1, minutes)}m`;
        }
    }

    updateAllDisplays() {
        try {
            this.updateTimeDisplay();
            this.updateCurrentStatus();
            this.updatePriorityDisplay();
            if (this.activeTab) {
                this.populateTabContent(this.activeTab);
            }
        } catch (error) {
            console.error('Display update error:', error);
        }
    }

    updateTimeDisplay() {
        try {
            const serverTime = this.getServerTime();
            const timeString = serverTime.toUTCString().slice(17, 25);
            
            const timeElement = document.getElementById('server-time');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        } catch (error) {
            console.error('Time display error:', error);
        }
    }

    updateCurrentStatus() {
        try {
            const currentVSDay = this.getCurrentVSDay();
            const currentArmsPhase = this.getCurrentArmsPhase();
            const isHighPriority = this.isCurrentlyHighPriority();
            
            // Update VS day
            const vsDayElement = document.getElementById('current-vs-day');
            if (vsDayElement) {
                vsDayElement.textContent = currentVSDay.title;
            }
            
            // Update Arms phase
            const armsPhaseElement = document.getElementById('arms-phase');
            if (armsPhaseElement) {
                armsPhaseElement.textContent = currentArmsPhase.name;
            }
            
            // Update priority level
            const priorityElement = document.getElementById('priority-level');
            if (priorityElement) {
                priorityElement.textContent = isHighPriority ? 'HIGH' : 'Normal';
                priorityElement.style.color = isHighPriority ? '#10b981' : '#b8b8c8';
            }
            
            // Update phase countdown
            const countdownElement = document.getElementById('countdown-timer');
            if (countdownElement) {
                const timeRemaining = (currentArmsPhase.hoursRemaining * 60 * 60 * 1000) +
                                   (currentArmsPhase.minutesRemaining * 60 * 1000);
                countdownElement.textContent = this.formatTime(timeRemaining);
            }
            
            // Update current phase label
            const currentPhaseElement = document.getElementById('current-phase');
            if (currentPhaseElement) {
                currentPhaseElement.textContent = `${currentArmsPhase.name} Active`;
            }
            
        } catch (error) {
            console.error('Status update error:', error);
        }
    }

    updatePriorityDisplay() {
        try {
            const currentArmsPhase = this.getCurrentArmsPhase();
            const currentVSDay = this.getCurrentVSDay();
            const isHighPriority = this.isCurrentlyHighPriority();
            
            const priorityTimeElement = document.getElementById('next-priority-time');
            const priorityEventElement = document.getElementById('next-priority-event');
            const currentActionElement = document.getElementById('current-action');
            const eventIconElement = document.getElementById('event-icon');
            const efficiencyElement = document.getElementById('efficiency-level');
            const badgeLabelElement = document.getElementById('badge-label');
            const activeNowElement = document.getElementById('active-now');
            
            if (isHighPriority) {
                // Currently active priority window
                const timeRemaining = (currentArmsPhase.hoursRemaining * 60 * 60 * 1000) + 
                                    (currentArmsPhase.minutesRemaining * 60 * 1000);
                
                if (activeNowElement) activeNowElement.style.display = 'flex';
                if (badgeLabelElement) badgeLabelElement.textContent = 'PEAK EFFICIENCY ACTIVE';
                if (priorityTimeElement) priorityTimeElement.textContent = this.formatTime(timeRemaining);
                if (priorityEventElement) priorityEventElement.textContent = `${currentArmsPhase.name} + ${currentVSDay.title}`;
                if (currentActionElement) currentActionElement.textContent = `⚡ ${isHighPriority.reason}`;
                if (eventIconElement) eventIconElement.textContent = currentArmsPhase.icon;
                if (efficiencyElement) efficiencyElement.textContent = isHighPriority.benefit;
            } else {
                // No priority window active
                if (activeNowElement) activeNowElement.style.display = 'none';
                if (badgeLabelElement) badgeLabelElement.textContent = 'NEXT HIGH PRIORITY';
                if (priorityTimeElement) priorityTimeElement.textContent = 'Calculating...';
                if (priorityEventElement) priorityEventElement.textContent = 'Searching for optimal windows...';
                if (currentActionElement) currentActionElement.textContent = 'Continue normal activities until next priority window';
                if (eventIconElement) eventIconElement.textContent = currentArmsPhase.icon;
                if (efficiencyElement) efficiencyElement.textContent = 'Normal';
            }
        } catch (error) {
            console.error('Priority display error:', error);
        }
    }

    populateTabContent(tabName) {
        try {
            switch (tabName) {
                case 'priority':
                    this.populatePriorityWindows();
                    break;
                case 'schedule':
                    this.populateSchedule();
                    break;
                case 'guides':
                    this.populateGuides();
                    break;
            }
        } catch (error) {
            console.error(`Tab content population error for ${tabName}:`, error);
        }
    }

    populatePriorityWindows() {
        try {
            const grid = document.getElementById('priority-grid');
            if (!grid) return;
            
            const currentVSDay = this.getCurrentVSDay();
            const currentArmsPhase = this.getCurrentArmsPhase();
            
            // Simple priority windows display
            const html = `
                <div class="priority-window-card active">
                    <div style="background: var(--bg-tertiary); padding: 12px; border-bottom: 1px solid var(--border-primary); display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Current Window</div>
                        <div style="padding: 3px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; background: var(--accent-success); color: white;">
                            ACTIVE NOW
                        </div>
                    </div>
                    <div style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 1.2rem;">${currentArmsPhase.icon}</span>
                            <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">${currentArmsPhase.name} + ${currentVSDay.title}</span>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Current Phase</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">Focus on ${currentArmsPhase.name.toLowerCase()} activities during this ${currentVSDay.title} event</div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                            ${currentArmsPhase.activities.slice(0, 3).map(activity => `<span style="background: var(--bg-elevated); color: var(--text-secondary); padding: 3px 6px; border-radius: 3px; font-size: 0.7rem; font-weight: 500;">${activity}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            grid.innerHTML = html;
        } catch (error) {
            console.error('Priority windows population error:', error);
        }
    }

    populateSchedule() {
        try {
            const grid = document.getElementById('schedule-content');
            if (!grid) return;
            
            grid.innerHTML = '<div class="loading-message">Schedule feature coming soon...</div>';
        } catch (error) {
            console.error('Schedule population error:', error);
        }
    }

    populateGuides() {
        try {
            const grid = document.getElementById('guides-content');
            if (!grid) return;
            
            grid.innerHTML = '<div class="loading-message">Strategy guides coming soon...</div>';
        } catch (error) {
            console.error('Guides population error:', error);
        }
    }

    hideBanner() {
        const banner = document.getElementById('priority-banner');
        if (banner) {
            banner.classList.remove('show', 'peak-priority');
        }
    }

    async requestNotificationPermission() {
        try {
            if ('Notification' in window) {
                const permission = await Notification.requestPermission();
                const granted = permission === 'granted';
                this.notificationsEnabled = granted;
                this.saveSettings();
                return granted;
            }
            return false;
        } catch (error) {
            console.error('Notification permission error:', error);
            return false;
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('lwn-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.timeOffset = settings.timeOffset || 0;
                this.notificationsEnabled = settings.notificationsEnabled || false;
                this.isSetupComplete = settings.isSetupComplete || false;
                this.currentPhaseOverride = settings.currentPhaseOverride || null;
                this.nextPhaseOverride = settings.nextPhaseOverride || null;
                
                this.syncSettingsToUI();
            }
        } catch (error) {
            console.error('Settings load error:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                timeOffset: this.timeOffset,
                notificationsEnabled: this.notificationsEnabled,
                isSetupComplete: this.isSetupComplete,
                currentPhaseOverride: this.currentPhaseOverride,
                nextPhaseOverride: this.nextPhaseOverride
            };
            localStorage.setItem('lwn-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Settings save error:', error);
        }
    }

    startUpdateLoop() {
        try {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            
            this.updateInterval = setInterval(() => {
                if (this.isVisible) {
                    this.updateAllDisplays();
                }
            }, 1000);
        } catch (error) {
            console.error('Update loop error:', error);
        }
    }

    handleError(message) {
        console.error('Application error:', message);
    }

    destroy() {
        try {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            if (this.setupTimeInterval) {
                clearInterval(this.setupTimeInterval);
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const app = new VSPointsOptimizer();
        window.lastWarNexus = app;
        
    } catch (error) {
        console.error('Application initialization failed:', error);
        
        const errorHtml = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--bg-elevated);
                border: 1px solid var(--accent-error);
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                z-index: 9999;
                max-width: 400px;
            ">
                <h2 style="color: var(--accent-error); margin-bottom: 16px;">Initialization Error</h2>
                <p style="color: var(--text-secondary); margin-bottom: 16px;">
                    Failed to start Last War Nexus. Please refresh the page and try again.
                </p>
                <button onclick="window.location.reload()" style="
                    background: var(--accent-primary);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                ">Refresh Page</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHtml);
    }
});

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});