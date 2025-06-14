/**
 * Last War Nexus - VS Points & Arms Race Optimizer
 * FINAL VERSION - All regressions fixed, complete features restored
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
        this.bannerExpanded = !this.isMobile();
        this.showLocalTime = true; // Default to local time
        this.activeGuideType = 'tips'; // Default to general tips

        // VERIFIED: 5 distinct Arms Race phases (each 4 hours, 20-hour cycle)
        this.data = {
            armsRacePhases: [
                { 
                    id: 'city_building', 
                    name: "City Building", 
                    icon: "🏗️", 
                    activities: ["Building upgrades", "Construction speedups", "Base expansion", "Power increases"],
                    bestSpending: [
                        { item: "Construction Speedups", value: "high" },
                        { item: "Building Upgrades", value: "high" },
                        { item: "Legendary Trucks", value: "high" }
                    ]
                },
                { 
                    id: 'unit_progression', 
                    name: "Unit Progression", 
                    icon: "⚔️", 
                    activities: ["Troop training", "Training speedups", "Unit upgrades", "Military expansion"],
                    bestSpending: [
                        { item: "Training Speedups", value: "high" },
                        { item: "Troop Training", value: "high" },
                        { item: "Unit Upgrades", value: "high" }
                    ]
                },
                { 
                    id: 'tech_research', 
                    name: "Tech Research", 
                    icon: "🔬", 
                    activities: ["Research completion", "Research speedups", "Tech advancement", "Innovation points"],
                    bestSpending: [
                        { item: "Research Speedups", value: "high" },
                        { item: "Tech Upgrades", value: "high" },
                        { item: "Valor Badges", value: "high" }
                    ]
                },
                { 
                    id: 'drone_boost', 
                    name: "Drone Boost", 
                    icon: "🚁", 
                    activities: ["Stamina usage", "Drone missions", "Radar activities", "Drone Combat Data"],
                    bestSpending: [
                        { item: "Stamina Items", value: "high" },
                        { item: "Drone Missions", value: "high" },
                        { item: "Radar Activities", value: "high" }
                    ]
                },
                { 
                    id: 'hero_advancement', 
                    name: "Hero Advancement", 
                    icon: "🦸", 
                    activities: ["Hero recruitment", "Hero EXP", "Skill medals", "Legendary tickets"],
                    bestSpending: [
                        { item: "Hero Recruitment", value: "high" },
                        { item: "Skill Medals", value: "high" },
                        { item: "Legendary Tickets", value: "high" }
                    ]
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
                { vsDay: 5, armsPhase: "Unit Progression", reason: "Training component of mobilization", benefit: "High Impact" },
                { vsDay: 5, armsPhase: "Tech Research", reason: "Research component of mobilization", benefit: "Maximum Impact" },
                { vsDay: 5, armsPhase: "Hero Advancement", reason: "Hero component of mobilization", benefit: "High Impact" },
                { vsDay: 5, armsPhase: "Drone Boost", reason: "Stamina and radar component of mobilization", benefit: "High Impact" },
                { vsDay: 6, armsPhase: "Unit Progression", reason: "Troop training supports combat preparation", benefit: "Strong Synergy" }
            ]
        };

        this.init();
    }

    getBestSpendingForPhase(phaseId) {
        const phase = this.data.armsRacePhases.find(p => p.id === phaseId);
        if (!phase || !phase.bestSpending) {
            return [
                { item: "Diamond Store Items", value: "high" },
                { item: "VIP Store Items", value: "high" },
                { item: "Speed-ups", value: "medium" }
            ];
        }
        return phase.bestSpending;
    }

    isMobile() {
        return window.innerWidth <= 768;
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
            // Setup modal event listeners
            this.setupSetupModalEvents();
            
            // Setup banner event listeners
            this.setupBannerEvents();
            
            // Setup time toggle event listener
            this.setupTimeToggle();
            
            // Main navigation - CONSOLIDATED SETTINGS
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

            // Guide navigation
            document.querySelectorAll('.guide-nav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const guideType = e.currentTarget.getAttribute('data-guide-type');
                    if (guideType) {
                        this.switchGuideType(guideType);
                    }
                });
            });

            // Settings dropdown changes
            const timeOffsetSelect = document.getElementById('time-offset');
            if (timeOffsetSelect) {
                timeOffsetSelect.addEventListener('change', (e) => {
                    this.timeOffset = parseFloat(e.target.value);
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

            const currentPhaseSelect = document.getElementById('current-phase-select');
            if (currentPhaseSelect) {
                currentPhaseSelect.addEventListener('change', (e) => {
                    this.currentPhaseOverride = e.target.value;
                    this.updateAllDisplays();
                });
            }

            const nextPhaseSelect = document.getElementById('next-phase-select');
            if (nextPhaseSelect) {
                nextPhaseSelect.addEventListener('change', (e) => {
                    this.nextPhaseOverride = e.target.value;
                    this.updateAllDisplays();
                });
            }

            // SAVE BUTTON
            const saveButton = document.getElementById('save-settings');
            if (saveButton) {
                saveButton.addEventListener('click', () => {
                    this.saveAllSettings();
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
                if (!e.target.closest('.settings-dropdown-container')) {
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

    // Setup modal event listeners
    setupSetupModalEvents() {
        try {
            const setupTimeOffset = document.getElementById('setup-time-offset');
            if (setupTimeOffset) {
                setupTimeOffset.addEventListener('change', (e) => {
                    this.timeOffset = parseFloat(e.target.value);
                    this.updateSetupTimezone();
                    this.updateSetupTime();
                });
            }

            const setupComplete = document.getElementById('setup-complete');
            if (setupComplete) {
                setupComplete.addEventListener('click', () => {
                    this.completeSetup();
                });
            }

            const setupSkip = document.getElementById('setup-skip');
            if (setupSkip) {
                setupSkip.addEventListener('click', () => {
                    this.skipSetup();
                });
            }

            const setupCurrentPhase = document.getElementById('setup-current-phase');
            if (setupCurrentPhase) {
                setupCurrentPhase.addEventListener('change', (e) => {
                    this.updateNextPhaseOptions(e.target.value);
                });
            }

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

    setupBannerEvents() {
        try {
            const bannerToggle = document.getElementById('banner-toggle');
            const bannerToggleBtn = document.getElementById('banner-toggle-btn');
            const banner = document.getElementById('priority-events-banner');

            if (bannerToggle && banner) {
                bannerToggle.addEventListener('click', () => {
                    this.toggleBanner();
                });
            }

            if (bannerToggleBtn && banner) {
                bannerToggleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleBanner();
                });
            }

            // Initialize banner state
            this.initializeBanner();

        } catch (error) {
            console.error('Banner events setup error:', error);
        }
    }

    initializeBanner() {
        const banner = document.getElementById('priority-events-banner');
        if (!banner) return;

        if (this.isMobile()) {
            banner.classList.add('collapsed');
        } else {
            banner.classList.remove('collapsed');
        }
    }

    toggleBanner() {
        const banner = document.getElementById('priority-events-banner');
        if (!banner) return;

        if (this.isMobile()) {
            banner.classList.toggle('expanded');
        } else {
            banner.classList.toggle('collapsed');
        }
        
        this.bannerExpanded = !banner.classList.contains('collapsed');
    }

    setupTimeToggle() {
        try {
            const timeToggleBtn = document.getElementById('time-toggle-btn');
            
            if (timeToggleBtn) {
                timeToggleBtn.addEventListener('click', () => {
                    this.toggleTimeMode();
                });
            }

            // Initialize the toggle label
            this.updateTimeToggleLabel();

        } catch (error) {
            console.error('Time toggle setup error:', error);
        }
    }

    toggleTimeMode() {
        this.showLocalTime = !this.showLocalTime;
        this.updateTimeToggleLabel();
        this.updateAllDisplays(); // Refresh all time displays
    }

    updateTimeToggleLabel() {
        const label = document.getElementById('time-toggle-label');
        if (label) {
            label.textContent = this.showLocalTime ? 'Local Time' : 'Server Time';
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
            const setupTimeOffset = document.getElementById('setup-time-offset');
            if (setupTimeOffset) {
                setupTimeOffset.value = this.timeOffset.toString();
            }

            const autoPhase = this.getCurrentArmsPhase();
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            if (setupCurrentPhase && !this.currentPhaseOverride) {
                setupCurrentPhase.value = autoPhase.id;
            }

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

    async completeSetup() {
        try {
            const setupTimeOffset = document.getElementById('setup-time-offset');
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            const setupNextPhase = document.getElementById('setup-next-phase');
            const notificationRadios = document.querySelectorAll('input[name="notifications"]');

            this.timeOffset = parseFloat(setupTimeOffset?.value || '0');
            this.currentPhaseOverride = setupCurrentPhase?.value || null;
            this.nextPhaseOverride = setupNextPhase?.value || null;

            const notificationChoice = Array.from(notificationRadios).find(r => r.checked)?.value;
            const wantsNotifications = notificationChoice === 'enabled';

            if (wantsNotifications) {
                await this.requestNotificationPermission();
            } else {
                this.notificationsEnabled = false;
            }

            this.isSetupComplete = true;
            this.saveSettings();
            this.syncSettingsToUI();

            this.hideSetupModal();
            this.updateAllDisplays();
            this.startUpdateLoop();

        } catch (error) {
            console.error('Setup completion error:', error);
            this.handleError('Failed to complete setup');
        }
    }

    skipSetup() {
        try {
            this.timeOffset = 0;
            this.currentPhaseOverride = null;
            this.nextPhaseOverride = null;
            this.notificationsEnabled = false;
            this.isSetupComplete = true;

            this.saveSettings();
            this.syncSettingsToUI();

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

    // SAVE ALL SETTINGS - WORKING SAVE BUTTON
    saveAllSettings() {
        try {
            // Get all current values from UI
            const timeOffsetSelect = document.getElementById('time-offset');
            const notificationsToggle = document.getElementById('notifications-toggle');
            const currentPhaseSelect = document.getElementById('current-phase-select');
            const nextPhaseSelect = document.getElementById('next-phase-select');

            if (timeOffsetSelect) this.timeOffset = parseFloat(timeOffsetSelect.value);
            if (notificationsToggle) this.notificationsEnabled = notificationsToggle.value === 'enabled';
            if (currentPhaseSelect) this.currentPhaseOverride = currentPhaseSelect.value;
            if (nextPhaseSelect) this.nextPhaseOverride = nextPhaseSelect.value;

            // Save to localStorage
            this.saveSettings();
            
            // Update all displays
            this.updateAllDisplays();
            
            // Show feedback
            const saveButton = document.getElementById('save-settings');
            if (saveButton) {
                const originalText = saveButton.textContent;
                saveButton.textContent = 'Saved!';
                saveButton.style.background = 'var(--accent-success)';
                
                setTimeout(() => {
                    saveButton.textContent = originalText;
                    saveButton.style.background = '';
                }, 2000);
            }

            // Close dropdown
            this.closeAllDropdowns();

        } catch (error) {
            console.error('Save settings error:', error);
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
        document.querySelectorAll('.settings-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        document.querySelectorAll('.settings-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    switchTab(tabName) {
        try {
            this.activeTab = tabName;
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
            const activePanel = document.getElementById(`${tabName}-tab`);
            
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.setAttribute('aria-selected', 'true');
            }
            if (activePanel) {
                activePanel.classList.add('active');
            }
            
            this.populateTabContent(tabName);
            
        } catch (error) {
            console.error('Tab switch error:', error);
        }
    }

    switchGuideType(guideType) {
        try {
            this.activeGuideType = guideType;
            
            document.querySelectorAll('.guide-nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`[data-guide-type="${guideType}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
            
            // Repopulate guides with the new type
            if (this.activeTab === 'guides') {
                this.populateGuides();
            }
            
        } catch (error) {
            console.error('Guide type switch error:', error);
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

    getCurrentArmsPhase() {
        try {
            const serverTime = this.getServerTime();
            const hour = serverTime.getUTCHours();
            
            // 5-phase system with 20-hour cycle
            // 00:00-03:59 = City Building (phase 0)
            // 04:00-07:59 = Unit Progression (phase 1)
            // 08:00-11:59 = Tech Research (phase 2)
            // 12:00-15:59 = Drone Boost (phase 3)
            // 16:00-19:59 = Hero Advancement (phase 4)
            // 20:00-23:59 = City Building (phase 0, cycle restarts)
            
            let phaseIndex;
            if (hour >= 20) {
                phaseIndex = 0; // City Building restarts at 20:00
            } else {
                phaseIndex = Math.floor(hour / 4);
            }
            
            // Handle override if set
            if (this.currentPhaseOverride) {
                const overridePhase = this.data.armsRacePhases.find(p => p.id === this.currentPhaseOverride);
                if (overridePhase) {
                    phaseIndex = this.data.armsRacePhases.indexOf(overridePhase);
                }
            }
            
            const phase = this.data.armsRacePhases[phaseIndex];
            
            // Calculate time remaining in current phase
            let hoursRemaining, minutesRemaining;
            if (hour >= 20) {
                // Special case: City Building from 20:00-23:59
                hoursRemaining = 24 - hour - 1;
                minutesRemaining = 60 - serverTime.getUTCMinutes();
            } else {
                hoursRemaining = 4 - (hour % 4) - 1;
                minutesRemaining = 60 - serverTime.getUTCMinutes();
            }
            
            // Calculate start and end hours for display
            let startHour, endHour;
            if (phaseIndex === 0 && hour >= 20) {
                startHour = 20;
                endHour = 24;
            } else {
                startHour = phaseIndex * 4;
                endHour = (phaseIndex * 4 + 4);
            }
            
            return {
                ...phase,
                position: phaseIndex,
                startHour: startHour,
                endHour: endHour % 24,
                hoursRemaining: hoursRemaining,
                minutesRemaining: minutesRemaining,
                isOverride: !!this.currentPhaseOverride
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

    findNextPriorityWindow() {
        try {
            const now = this.getServerTime();
            const currentAlignment = this.isCurrentlyHighPriority();
            
            if (currentAlignment) {
                const currentPhase = this.getCurrentArmsPhase();
                const timeRemaining = (currentPhase.hoursRemaining * 60 * 60 * 1000) + 
                                    (currentPhase.minutesRemaining * 60 * 1000);
                
                return {
                    isActive: true,
                    timeRemaining: timeRemaining,
                    alignment: currentAlignment,
                    phase: currentPhase,
                    vsDay: this.getCurrentVSDay()
                };
            }
            
            // Find next priority window
            let nextWindow = null;
            let minTimeDiff = Infinity;
            
            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                const checkDate = new Date(now);
                checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                const dayOfWeek = checkDate.getUTCDay();
                
                const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek);
                if (!vsDay) continue;
                
                const dayAlignments = this.data.priorityAlignments.filter(a => a.vsDay === dayOfWeek);
                
                for (const alignment of dayAlignments) {
                    const phase = this.data.armsRacePhases.find(p => p.name === alignment.armsPhase);
                    if (!phase) continue;
                    
                    const phaseIndex = this.data.armsRacePhases.findIndex(p => p.name === phase.name);
                    
                    // Calculate when this phase occurs on the check date
                    // Due to 20-hour cycle, phases shift by 4 hours each day
                    const daysSinceStart = dayOffset;
                    const totalHoursShift = (daysSinceStart * 4) % 20;
                    
                    // Find when this phase occurs today
                    let phaseStartHours = [];
                    for (let hour = 0; hour < 24; hour += 4) {
                        const cycleHour = hour % 20;
                        const currentPhaseAtHour = Math.floor(cycleHour / 4);
                        
                        // Special case for City Building at 20:00-23:59
                        if (hour >= 20 && phaseIndex === 0) {
                            phaseStartHours.push(20);
                            break;
                        } else if (hour < 20 && currentPhaseAtHour === phaseIndex) {
                            phaseStartHours.push(hour);
                        }
                    }
                    
                    // Check each occurrence of this phase on the check date
                    for (const startHour of phaseStartHours) {
                        const windowTime = new Date(checkDate);
                        windowTime.setUTCHours(startHour, 0, 0, 0);
                        
                        const timeDiff = windowTime.getTime() - now.getTime();
                        
                        if (timeDiff > 0 && timeDiff < minTimeDiff) {
                            minTimeDiff = timeDiff;
                            nextWindow = {
                                isActive: false,
                                timeRemaining: timeDiff,
                                alignment: alignment,
                                phase: phase,
                                vsDay: vsDay,
                                startTime: windowTime
                            };
                        }
                    }
                }
            }
            
            return nextWindow;
        } catch (error) {
            console.error('Next priority window calculation error:', error);
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
            this.updateBanner();
            this.updatePriorityEventsBanner();
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
            const localTime = new Date();
            const serverTimeString = serverTime.toUTCString().slice(17, 25);
            
            // Legacy server time display
            const timeElement = document.getElementById('server-time');
            if (timeElement) {
                timeElement.textContent = serverTimeString;
            }

            // Enhanced time displays for main cards
            const timeModeLabel = document.getElementById('time-mode-label');
            if (timeModeLabel) {
                timeModeLabel.textContent = this.showLocalTime ? 'Local Time' : 'Server Time';
            }

            const currentDisplayTime = document.getElementById('current-display-time');
            if (currentDisplayTime) {
                if (this.showLocalTime) {
                    currentDisplayTime.textContent = localTime.toLocaleTimeString('en-US', { 
                        hour12: false, 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                    });
                } else {
                    currentDisplayTime.textContent = serverTimeString;
                }
            }

            const serverDisplayTime = document.getElementById('server-display-time');
            if (serverDisplayTime) {
                serverDisplayTime.textContent = serverTimeString;
            }

            // Phase end time
            const phaseEndTime = document.getElementById('phase-end-time');
            if (phaseEndTime) {
                const currentPhase = this.getCurrentArmsPhase();
                const phaseEndMs = (currentPhase.hoursRemaining * 60 * 60 * 1000) + 
                                 (currentPhase.minutesRemaining * 60 * 1000);
                const phaseEndDate = new Date(Date.now() + phaseEndMs);
                
                if (this.showLocalTime) {
                    phaseEndTime.textContent = phaseEndDate.toLocaleTimeString('en-US', { 
                        hour12: false, 
                        hour: '2-digit', 
                        minute: '2-digit'
                    });
                } else {
                    const serverPhaseEnd = new Date(serverTime.getTime() + phaseEndMs);
                    phaseEndTime.textContent = serverPhaseEnd.toUTCString().slice(17, 22);
                }
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
            
            const vsDayElement = document.getElementById('current-vs-day');
            if (vsDayElement) {
                vsDayElement.textContent = currentVSDay.title;
            }
            
            const armsPhaseElement = document.getElementById('arms-phase');
            if (armsPhaseElement) {
                armsPhaseElement.textContent = currentArmsPhase.name;
            }
            
            const priorityElement = document.getElementById('priority-level');
            if (priorityElement) {
                priorityElement.textContent = isHighPriority ? 'HIGH' : 'Normal';
                priorityElement.style.color = isHighPriority ? '#10b981' : '#b8b8c8';
            }
            
            const countdownElement = document.getElementById('countdown-timer');
            if (countdownElement) {
                const timeRemaining = (currentArmsPhase.hoursRemaining * 60 * 60 * 1000) +
                                   (currentArmsPhase.minutesRemaining * 60 * 1000);
                countdownElement.textContent = this.formatTime(timeRemaining);
            }
            
            const currentPhaseElement = document.getElementById('current-phase');
            if (currentPhaseElement) {
                currentPhaseElement.textContent = `${currentArmsPhase.name} Active`;
            }
            
            // Update next phase preview
            const nextPhasePreviewElement = document.getElementById('next-phase-preview');
            if (nextPhasePreviewElement) {
                const nextPhase = this.getNextArmsPhase();
                nextPhasePreviewElement.textContent = `${nextPhase.icon} ${nextPhase.name}`;
            }

            // Update priority status indicator
            const priorityStatusIndicator = document.getElementById('priority-status-indicator');
            if (priorityStatusIndicator) {
                if (isHighPriority) {
                    priorityStatusIndicator.textContent = 'HIGH PRIORITY';
                    priorityStatusIndicator.style.background = 'var(--accent-success)';
                    priorityStatusIndicator.style.color = 'white';
                } else {
                    priorityStatusIndicator.textContent = 'NORMAL';
                    priorityStatusIndicator.style.background = 'var(--bg-surface)';
                    priorityStatusIndicator.style.color = 'var(--text-secondary)';
                }
            }

            // Update next priority info
            const nextPriorityInfo = document.getElementById('next-priority-info');
            if (nextPriorityInfo) {
                const nextWindow = this.findNextPriorityWindow();
                if (nextWindow) {
                    if (nextWindow.isActive) {
                        nextPriorityInfo.textContent = `ACTIVE NOW - ${this.formatTime(nextWindow.timeRemaining)} remaining`;
                        nextPriorityInfo.style.color = 'var(--accent-success)';
                    } else {
                        const timeText = this.formatTime(nextWindow.timeRemaining);
                        const phaseText = `${nextWindow.phase.name} + ${nextWindow.vsDay.title}`;
                        nextPriorityInfo.innerHTML = `${timeText}<br><span style="font-size: 0.7rem; opacity: 0.8;">${phaseText}</span>`;
                        nextPriorityInfo.style.color = 'var(--accent-warning)';
                    }
                } else {
                    nextPriorityInfo.textContent = 'No upcoming priority windows';
                    nextPriorityInfo.style.color = 'var(--text-secondary)';
                }
            }
            
        } catch (error) {
            console.error('Status update error:', error);
        }
    }

    updatePriorityDisplay() {
        try {
            const nextWindow = this.findNextPriorityWindow();
            
            if (!nextWindow) return;
            
            const activeNowElement = document.getElementById('active-now');
            const badgeLabelElement = document.getElementById('badge-label');
            const priorityTimeElement = document.getElementById('next-priority-time');
            const priorityEventElement = document.getElementById('next-priority-event');
            const currentActionElement = document.getElementById('current-action');
            const eventIconElement = document.getElementById('event-icon');
            const countdownLabelElement = document.getElementById('countdown-label');
            const efficiencyElement = document.getElementById('efficiency-level');
            
            if (nextWindow.isActive) {
                if (activeNowElement) activeNowElement.style.display = 'flex';
                if (badgeLabelElement) badgeLabelElement.textContent = 'PEAK EFFICIENCY ACTIVE';
                if (priorityTimeElement) priorityTimeElement.textContent = this.formatTime(nextWindow.timeRemaining);
                if (priorityEventElement) priorityEventElement.textContent = `${nextWindow.phase.name} + ${nextWindow.vsDay.title}`;
                if (currentActionElement) currentActionElement.textContent = `⚡ ${nextWindow.alignment.reason}`;
                if (eventIconElement) eventIconElement.textContent = nextWindow.phase.icon;
                if (countdownLabelElement) countdownLabelElement.textContent = 'PHASE ENDS IN';
                if (efficiencyElement) efficiencyElement.textContent = nextWindow.alignment.benefit;
            } else {
                if (activeNowElement) activeNowElement.style.display = 'none';
                if (badgeLabelElement) badgeLabelElement.textContent = 'NEXT HIGH PRIORITY';
                if (priorityTimeElement) priorityTimeElement.textContent = this.formatTime(nextWindow.timeRemaining);
                if (priorityEventElement) priorityEventElement.textContent = `${nextWindow.phase.name} + ${nextWindow.vsDay.title}`;
                if (currentActionElement) currentActionElement.textContent = nextWindow.alignment.reason;
                if (eventIconElement) eventIconElement.textContent = nextWindow.phase.icon;
                if (countdownLabelElement) countdownLabelElement.textContent = 'TIME REMAINING';
                if (efficiencyElement) efficiencyElement.textContent = nextWindow.alignment.benefit;
            }
            
            // Update spending recommendations
            const spendingItemsElement = document.getElementById('spending-items');
            if (spendingItemsElement && nextWindow) {
                const phase = nextWindow.phase;
                const bestSpending = this.getBestSpendingForPhase(phase.id);
                const spendingHTML = bestSpending.slice(0, 3).map(item => 
                    `<span class="spending-item" style="background: var(--bg-surface); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; color: var(--text-secondary);">${item.item}</span>`
                ).join('');
                spendingItemsElement.innerHTML = spendingHTML;
            }
        } catch (error) {
            console.error('Priority display error:', error);
        }
    }

    updateBanner() {
        try {
            const banner = document.getElementById('priority-banner');
            if (!banner) return;
            
            const nextWindow = this.findNextPriorityWindow();
            
            if (nextWindow && nextWindow.isActive) {
                const titleElement = document.getElementById('banner-title');
                const timeElement = document.getElementById('banner-time');
                
                if (titleElement) titleElement.textContent = 'Peak Efficiency Active!';
                if (timeElement) timeElement.textContent = this.formatTime(nextWindow.timeRemaining);
                
                banner.classList.add('peak-priority', 'show');
                
                if (this.notificationsEnabled && this.lastNotifiedWindow !== nextWindow.alignment.reason) {
                    this.showNotification('High Priority Active!', `${nextWindow.phase.name} + ${nextWindow.vsDay.title}`);
                    this.lastNotifiedWindow = nextWindow.alignment.reason;
                }
            } else if (nextWindow && nextWindow.timeRemaining < 2 * 60 * 60 * 1000) {
                const titleElement = document.getElementById('banner-title');
                const timeElement = document.getElementById('banner-time');
                
                if (titleElement) titleElement.textContent = 'High Priority Soon';
                if (timeElement) timeElement.textContent = this.formatTime(nextWindow.timeRemaining);
                
                banner.classList.remove('peak-priority');
                banner.classList.add('show');
            } else {
                this.hideBanner();
            }
        } catch (error) {
            console.error('Banner update error:', error);
        }
    }

    updatePriorityEventsBanner() {
        try {
            const bannerGrid = document.getElementById('banner-events-grid');
            const bannerCount = document.getElementById('banner-count');
            
            if (!bannerGrid || !bannerCount) return;

            // Get the next 6 priority events
            const upcomingEvents = this.getUpcomingPriorityEvents(6);
            
            bannerCount.textContent = `${upcomingEvents.length} upcoming`;

            if (upcomingEvents.length === 0) {
                bannerGrid.innerHTML = '<div class="banner-loading">No upcoming priority events</div>';
                return;
            }

            const eventCards = upcomingEvents.map(event => {
                const startTime = new Date(event.startTime);
                
                let timeString;
                if (this.showLocalTime) {
                    timeString = startTime.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                } else {
                    // Show server time
                    const serverTime = new Date(startTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
                    timeString = serverTime.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC'
                    }) + ' (Server)';
                }

                return `
                    <div class="banner-event-card">
                        <div class="banner-event-header">
                            <span class="banner-event-icon">${event.phase.icon}</span>
                            <span class="banner-event-title">${event.phase.name} + ${event.vsDay.title}</span>
                        </div>
                        <div class="banner-event-time">${timeString}</div>
                        <div class="banner-event-countdown">${this.formatTime(event.timeRemaining)}</div>
                    </div>
                `;
            }).join('');

            bannerGrid.innerHTML = eventCards;

        } catch (error) {
            console.error('Priority events banner update error:', error);
        }
    }

    getUpcomingPriorityEvents(limit = 6) {
        try {
            const now = this.getServerTime();
            const events = [];
            
            // Look ahead for the next 14 days to find priority events
            for (let dayOffset = 0; dayOffset < 14 && events.length < limit; dayOffset++) {
                const checkDate = new Date(now);
                checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                const dayOfWeek = checkDate.getUTCDay();
                
                const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek);
                if (!vsDay) continue;
                
                const dayAlignments = this.data.priorityAlignments.filter(a => a.vsDay === dayOfWeek);
                
                for (const alignment of dayAlignments) {
                    if (events.length >= limit) break;
                    
                    const phase = this.data.armsRacePhases.find(p => p.name === alignment.armsPhase);
                    if (!phase) continue;
                    
                    const phaseIndex = this.data.armsRacePhases.findIndex(p => p.name === phase.name);
                    
                    // Calculate when this phase occurs
                    let phaseOccurrences = [];
                    
                    // Regular phase times (0-19 hours)
                    if (phaseIndex * 4 < 20) {
                        const startTime = new Date(checkDate);
                        startTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
                        phaseOccurrences.push(startTime);
                    }
                    
                    // Special case: City Building also occurs at 20:00-00:00
                    if (phaseIndex === 0) {
                        const eveningStart = new Date(checkDate);
                        eveningStart.setUTCHours(20, 0, 0, 0);
                        phaseOccurrences.push(eveningStart);
                    }
                    
                    for (const startTime of phaseOccurrences) {
                        if (events.length >= limit) break;
                        
                        const timeDiff = startTime.getTime() - now.getTime();
                        
                        if (timeDiff > 0) {
                            events.push({
                                startTime,
                                timeRemaining: timeDiff,
                                phase,
                                vsDay,
                                alignment
                            });
                        }
                    }
                }
            }
            
            // Sort by time remaining
            events.sort((a, b) => a.timeRemaining - b.timeRemaining);
            
            return events.slice(0, limit);
            
        } catch (error) {
            console.error('Get upcoming priority events error:', error);
            return [];
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

    // RESTORED: Complete Priority Windows
    populatePriorityWindows() {
        try {
            const grid = document.getElementById('priority-grid');
            if (!grid) return;
            
            const now = this.getServerTime();
            const windows = [];
            
            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                const checkDate = new Date(now);
                checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                const dayOfWeek = checkDate.getUTCDay();
                
                const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek);
                if (!vsDay) continue;
                
                const dayAlignments = this.data.priorityAlignments.filter(a => a.vsDay === dayOfWeek);
                
                for (const alignment of dayAlignments) {
                    const phase = this.data.armsRacePhases.find(p => p.name === alignment.armsPhase);
                    if (!phase) continue;
                    
                    const phaseIndex = this.data.armsRacePhases.findIndex(p => p.name === phase.name);
                    
                    // Find when this phase occurs on the check date
                    let phaseOccurrences = [];
                    
                    // Check regular phase times (0-19 hours)
                    if (phaseIndex * 4 < 20) {
                        const startTime = new Date(checkDate);
                        startTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
                        phaseOccurrences.push(startTime);
                    }
                    
                    // Special case: City Building also occurs at 20:00-00:00
                    if (phaseIndex === 0) {
                        const eveningStart = new Date(checkDate);
                        eveningStart.setUTCHours(20, 0, 0, 0);
                        phaseOccurrences.push(eveningStart);
                    }
                    
                    // Add each occurrence as a priority window
                    for (const startTime of phaseOccurrences) {
                        const endTime = new Date(startTime);
                        if (startTime.getUTCHours() === 20) {
                            // City Building evening session ends at midnight
                            endTime.setUTCDate(endTime.getUTCDate() + 1);
                            endTime.setUTCHours(0, 0, 0, 0);
                        } else {
                            endTime.setUTCHours(startTime.getUTCHours() + 4);
                        }
                        
                        const timeDiff = startTime.getTime() - now.getTime();
                        const isActive = now >= startTime && now < endTime;
                        const isPeak = alignment.benefit.includes('Perfect') || alignment.benefit.includes('Maximum');
                        
                        windows.push({
                            startTime,
                            endTime,
                            timeDiff,
                            isActive,
                            isPeak,
                            phase,
                            vsDay,
                            alignment,
                            timeDisplay: isActive ? 'Active Now' : timeDiff > 0 ? `in ${this.formatTime(timeDiff)}` : 'Completed'
                        });
                    }
                }
            }
            
            windows.sort((a, b) => a.timeDiff - b.timeDiff);
            const uniqueWindows = windows.filter((window, index, arr) => 
                index === 0 || 
                arr[index - 1].startTime.getTime() !== window.startTime.getTime() ||
                arr[index - 1].alignment.reason !== window.alignment.reason
            );
            
            const countElement = document.getElementById('priority-count');
            if (countElement) {
                const activeCount = uniqueWindows.filter(w => w.isActive).length;
                const upcomingCount = uniqueWindows.filter(w => !w.isActive && w.timeDiff > 0).length;
                countElement.textContent = `${activeCount + upcomingCount} Windows`;
            }
            
            const html = uniqueWindows.slice(0, 12).map(window => {
                // Enhanced time display
                const startTime = new Date(window.startTime);
                const isDistant = window.timeDiff > (69 * 60 * 60 * 1000); // More than 69 hours
                
                let primaryTime, secondaryTime;
                if (this.showLocalTime) {
                    primaryTime = startTime.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    // Show server time as secondary for distant events
                    if (isDistant) {
                        const serverTime = new Date(startTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
                        secondaryTime = serverTime.toLocaleDateString('en-US', { 
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'UTC'
                        }) + ' Server';
                    }
                } else {
                    const serverTime = new Date(startTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
                    primaryTime = serverTime.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC'
                    }) + ' Server';
                    // Show local time as secondary for distant events
                    if (isDistant) {
                        secondaryTime = startTime.toLocaleDateString('en-US', { 
                            hour: '2-digit',
                            minute: '2-digit'
                        }) + ' Local';
                    }
                }

                return `
                <div class="priority-window-card ${window.isActive ? 'active' : ''} ${window.isPeak ? 'peak' : ''}">
                    <div class="priority-window-header">
                        <div class="time-display-section">
                            <div class="primary-time">${primaryTime}</div>
                            ${secondaryTime ? `<div class="secondary-time">${secondaryTime}</div>` : ''}
                            <div class="countdown-time">${window.timeDisplay}</div>
                        </div>
                        <div class="status-badge ${window.isActive ? 'active' : 'upcoming'}">
                            ${window.isActive ? 'ACTIVE NOW' : 'UPCOMING'}
                        </div>
                    </div>
                    <div style="padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                            <span style="font-size: 1.2rem;">${window.phase.icon}</span>
                            <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">${window.phase.name} + ${window.vsDay.title}</span>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 1rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${window.alignment.benefit}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${window.alignment.reason}</div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                            ${window.phase.activities.slice(0, 3).map(activity => `<span style="background: var(--bg-elevated); color: var(--text-secondary); padding: 3px 6px; border-radius: 3px; font-size: 0.7rem; font-weight: 500;">${activity}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
            
            grid.innerHTML = html;
        } catch (error) {
            console.error('Priority windows population error:', error);
            const grid = document.getElementById('priority-grid');
            if (grid) {
                grid.innerHTML = '<div class="loading-message">Error loading priority windows</div>';
            }
        }
    }

    // RESTORED: Complete Schedule
    populateSchedule() {
        try {
            const grid = document.getElementById('schedule-content');
            if (!grid) return;
            
            const schedule = [];
            const now = this.getServerTime();
            
            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                const checkDate = new Date(now);
                checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                const dayOfWeek = checkDate.getUTCDay();
                const isToday = dayOffset === 0;
                
                const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek) || 
                             { name: "Sunday", title: "Preparation Day", focus: "Prepare for the week" };
                
                const phases = [];
                // Handle the 5-phase system with 20-hour cycle
                for (let phaseIndex = 0; phaseIndex < 5; phaseIndex++) {
                    const phase = this.data.armsRacePhases[phaseIndex];
                    
                    const isPriority = this.data.priorityAlignments.some(a => 
                        a.vsDay === dayOfWeek && a.armsPhase === phase.name
                    );
                    
                    const startHour = phaseIndex * 4;
                    const endHour = (phaseIndex * 4 + 4);
                    const isActive = isToday && 
                        now.getUTCHours() >= startHour && 
                        now.getUTCHours() < endHour;
                    
                    phases.push({
                        ...phase,
                        position: phaseIndex,
                        isPriority,
                        isActive,
                        timeRange: `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`
                    });
                }
                
                // Add the City Building phase that runs from 20:00-00:00
                const cityBuildingRepeat = {
                    ...this.data.armsRacePhases[0],
                    position: 5,
                    isPriority: this.data.priorityAlignments.some(a => 
                        a.vsDay === dayOfWeek && a.armsPhase === "City Building"
                    ),
                    isActive: isToday && now.getUTCHours() >= 20,
                    timeRange: "20:00-00:00"
                };
                phases.push(cityBuildingRepeat);
                
                schedule.push({
                    vsDay,
                    phases,
                    isToday,
                    date: checkDate.toLocaleDateString()
                });
            }
            
            const html = schedule.map(day => `
                <div class="priority-window-card ${day.isToday ? 'active' : ''}">
                    <div style="background: var(--bg-tertiary); padding: 12px; border-bottom: 1px solid var(--border-primary); text-align: center;">
                        <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${day.vsDay.name}</h3>
                        <div style="font-size: 0.8rem; color: var(--text-secondary);">${day.vsDay.title}</div>
                        <div style="font-size: 0.7rem; color: var(--text-tertiary); margin-top: 4px;">${day.date}</div>
                    </div>
                    <div style="padding: 8px;">
                        ${day.phases.map(phase => `
                            <div style="background: var(--bg-elevated); border: 1px solid ${phase.isPriority ? 'var(--accent-warning)' : 'var(--border-primary)'}; border-radius: var(--border-radius); padding: 8px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; position: relative; ${phase.isPriority ? 'background: rgba(255, 107, 53, 0.1);' : ''} ${phase.isActive ? 'border-color: var(--accent-success); background: rgba(16, 185, 129, 0.1);' : ''}">
                                <div style="font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600; color: var(--text-secondary);">${phase.timeRange}</div>
                                <div style="flex: 1; text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--text-primary);">${phase.name}</div>
                                <div style="font-size: 0.9rem;">${phase.icon}</div>
                                ${phase.isPriority ? '<div style="position: absolute; top: -3px; right: 4px; background: var(--accent-warning); color: white; padding: 1px 3px; border-radius: 2px; font-size: 0.5rem; font-weight: 700;">HIGH</div>' : ''}
                                ${phase.isActive ? '<div style="position: absolute; top: -3px; left: 4px; background: var(--accent-success); color: white; padding: 1px 3px; border-radius: 2px; font-size: 0.5rem; font-weight: 700;">NOW</div>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
            
            grid.innerHTML = html;
        } catch (error) {
            console.error('Schedule population error:', error);
        }
    }

    // RESTORED: Complete Guides with Seasonal Support
    populateGuides() {
        try {
            const grid = document.getElementById('guides-content');
            if (!grid) return;
            
            let guides = [];
            
            if (this.activeGuideType === 'tips') {
                guides = [
                    {
                        title: "5 Distinct Arms Race Phases",
                        category: "Core Mechanics",
                        icon: "🔄",
                        description: "Arms Race runs 5 distinct phases, each lasting 4 hours in a 20-hour cycle that restarts at 20:00. Master this schedule for optimal planning.",
                        tips: ["Each phase lasts exactly 4 hours", "20-hour cycle (5 phases × 4 hours)", "Cycle restarts at 20:00 server time", "Same phase appears at different times each day"]
                    },
                    {
                        title: "Perfect Alignment Windows",
                        category: "Peak Efficiency",
                        icon: "🎯",
                        description: "Time activities when Arms Race phases perfectly match Alliance VS focus days for maximum dual rewards.",
                        tips: ["Tech Research + Age of Science = Perfect", "City Building + Base Expansion = Maximum", "Hero Advancement + Train Heroes = Ideal", "Friday offers multiple alignments"]
                    },
                    {
                        title: "Friday Total Mobilization",
                        category: "Weekly Peak",
                        icon: "🚀",
                        description: "Friday offers multiple high-priority windows since Total Mobilization accepts all activity types across all phases.",
                        tips: ["Save speedups for Friday", "Multiple Arms Race alignments possible", "Highest daily point potential", "All phases can be high priority"]
                    },
                    {
                        title: "Server Time Mastery",
                        category: "Timing Strategy",
                        icon: "🕐",
                        description: "Master your server's predictable 4-hour Arms Race rotation. The schedule is completely consistent once you know the server time.",
                        tips: ["Know exact server time", "5-phase × 4-hour cycle", "Cycle restarts at 20:00 daily", "Plan with 20-hour rotation in mind"]
                    },
                    {
                        title: "Dual Event Synergy",
                        category: "Advanced Strategy",
                        icon: "⚡",
                        description: "Maximize efficiency by focusing on activities that benefit both Arms Race and Alliance VS simultaneously.",
                        tips: ["Hero EXP works for both events", "Construction speedups double-count", "Research activities align perfectly", "Drone activities overlap on Monday"]
                    },
                    {
                        title: "Resource Conservation",
                        category: "Planning Strategy",
                        icon: "💎",
                        description: "Save premium resources for high-priority alignment windows rather than using them during low-synergy periods.",
                        tips: ["Hoard speedups for perfect alignments", "Use basic resources during normal time", "Track upcoming priority windows", "Plan resource usage in advance"]
                    },
                    {
                        title: "Mobile Optimization",
                        category: "Practical Tips",
                        icon: "📱",
                        description: "Set up notifications and quick-access strategies for managing events while mobile gaming with predictable schedules.",
                        tips: ["Use browser notifications", "Bookmark priority times", "Set phone alarms for peak windows", "Use predictable schedule for planning"]
                    }
                ];
            } else if (this.activeGuideType === 'seasonal') {
                guides = [
                    {
                        title: "Season 1: Foundation",
                        category: "Early Game Focus",
                        icon: "🌱",
                        description: "Focus on base development and understanding core mechanics. Establish strong fundamentals for resource generation and troop training.",
                        tips: ["Prioritize base building upgrades", "Complete daily missions consistently", "Join active alliance early", "Focus on march size increases", "Save diamonds for commanders"]
                    },
                    {
                        title: "Season 2: Expansion",
                        category: "Mid Game Growth",
                        icon: "🏗️",
                        description: "Expand your power through research and advanced base upgrades. Begin participating in larger alliance activities.",
                        tips: ["Rush Research Lab upgrades", "Focus on economic research", "Participate in alliance events", "Start building T3 troops", "Upgrade resource production"]
                    },
                    {
                        title: "Season 3: Competition",
                        category: "PvP Preparation",
                        icon: "⚔️",
                        description: "Prepare for competitive play with optimized builds and strategic resource management. Focus on combat effectiveness.",
                        tips: ["Specialize in combat research", "Build hospital capacity", "Focus on T4 troop training", "Learn rally mechanics", "Optimize gear sets"]
                    },
                    {
                        title: "Season 4: Mastery",
                        category: "Late Game Excellence",
                        icon: "👑",
                        description: "Master advanced strategies, lead alliance operations, and optimize for maximum efficiency in all activities.",
                        tips: ["Master rally timing", "Optimize resource management", "Lead alliance strategies", "Focus on T5 research", "Maximize event participation", "Coordinate cross-server activities"]
                    }
                ];
            }
            
            const html = guides.map(guide => `
                <div class="priority-window-card">
                    <div style="background: var(--bg-tertiary); padding: 12px; border-bottom: 1px solid var(--border-primary); display: flex; align-items: center; gap: 10px;">
                        <div style="font-size: 1.3rem; flex-shrink: 0;">${guide.icon}</div>
                        <div style="flex: 1;">
                            <h3 style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 3px;">${guide.title}</h3>
                            <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">${guide.category}</div>
                        </div>
                    </div>
                    <div style="padding: 12px;">
                        <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">${guide.description}</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                            ${guide.tips.map(tip => `<span style="background: var(--bg-elevated); color: var(--text-secondary); padding: 3px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 500;">${tip}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
            
            grid.innerHTML = html;
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

    showNotification(title, body) {
        try {
            if (this.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification(title, {
                    body: body,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>',
                    tag: 'lastwar-priority'
                });
                
                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };
                
                setTimeout(() => notification.close(), 5000);
            }
        } catch (error) {
            console.error('Notification display error:', error);
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
        
        // Show user-friendly error message
        const statusElement = document.getElementById('status-announcements');
        if (statusElement) {
            statusElement.textContent = `Error: ${message}. Retrying automatically...`;
        }
        
        // Auto-retry after 10 seconds
        setTimeout(() => {
            try {
                this.updateAllDisplays();
                if (statusElement) {
                    statusElement.textContent = '';
                }
            } catch (retryError) {
                console.error('Retry failed:', retryError);
            }
        }, 10000);
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
                font-family: var(--font-family);
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