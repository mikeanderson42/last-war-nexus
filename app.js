        /**
         * Last War Nexus - VS Points & Arms Race Optimizer
         * PRODUCTION READY VERSION - Enhanced Design & Functionality
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
                this.useLocalTime = true;
                this.activeGuideType = 'tips';

                // ENHANCED: Detailed spending information for each phase
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
                                { item: "Legendary Trucks", value: "high" },
                                { item: "Base Expansion", value: "medium" },
                                { item: "Research Speedups", value: "low" }
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
                                { item: "Unit Upgrades", value: "high" },
                                { item: "Healing Speedups", value: "medium" },
                                { item: "Construction Speedups", value: "low" }
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
                                { item: "Valor Badges", value: "high" },
                                { item: "Innovation Points", value: "medium" },
                                { item: "Training Speedups", value: "low" }
                            ]
                        },
                        { 
                            id: 'drone_boost', 
                            name: "Drone Boost", 
                            icon: "🚁", 
                            activities: ["Stamina usage", "Drone missions", "Radar activities", "Drone Combat Data"],
                            bestSpending: [
                                { item: "Stamina Usage", value: "high" },
                                { item: "Drone Missions", value: "high" },
                                { item: "Radar Activities", value: "high" },
                                { item: "Hero EXP", value: "medium" },
                                { item: "Combat Data", value: "medium" }
                            ]
                        },
                        { 
                            id: 'hero_advancement', 
                            name: "Hero Advancement", 
                            icon: "🦸", 
                            activities: ["Hero recruitment", "Hero EXP", "Skill medals", "Legendary tickets"],
                            bestSpending: [
                                { item: "Hero EXP", value: "high" },
                                { item: "Hero Recruitment", value: "high" },
                                { item: "Skill Medals", value: "high" },
                                { item: "Legendary Tickets", value: "medium" },
                                { item: "Hero Shards", value: "medium" }
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

            init() {
                try {
                    console.log('Last War Nexus: Starting initialization...');
                    this.loadSettings();
                    this.setupEventListeners();
                    
                    // FIXED: Always update displays on initialization
                    console.log('Last War Nexus: Updating displays...');
                    this.updateAllDisplays();
                    
                    // Always show setup modal on first visit (when no settings saved)
                    const hasStoredSettings = localStorage.getItem('lwn-settings');
                    if (!hasStoredSettings || !this.isSetupComplete) {
                        console.log('Last War Nexus: Showing setup modal...');
                        this.showSetupModal();
                    } else {
                        console.log('Last War Nexus: Starting update loop...');
                        this.startUpdateLoop();
                    }
                    
                    console.log('Last War Nexus: Initialization complete!');
                } catch (error) {
                    console.error('Initialization error:', error);
                    this.handleError('Failed to initialize application');
                }
            }

            setupEventListeners() {
                try {
                    this.setupSetupModalEvents();
                    
                    // Settings dropdown
                    const settingsToggle = document.getElementById('settings-toggle');
                    if (settingsToggle) {
                        settingsToggle.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.toggleDropdown('settings');
                        });
                    }

                    // FIXED: Tab navigation with proper event handling
                    document.querySelectorAll('.tab-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const tab = e.currentTarget.getAttribute('data-tab');
                            if (tab) {
                                this.switchTab(tab);
                            }
                        });
                    });

                    // Settings changes
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

                    // Save button
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

                    // FIXED: Time toggle button
                    const timeToggleBtn = document.getElementById('time-toggle-btn');
                    if (timeToggleBtn) {
                        timeToggleBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.toggleTimeMode();
                        });
                    }

                    // FIXED: Guide navigation buttons
                    document.querySelectorAll('.guide-nav-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const guideType = btn.getAttribute('data-guide-type');
                            if (guideType) {
                                this.switchGuideType(guideType);
                            }
                        });
                    });

                    // FIXED: Banner toggle functionality
                    const bannerHeader = document.querySelector('.banner-header');
                    if (bannerHeader) {
                        bannerHeader.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.toggleBanner();
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

            showSetupModal() {
                const modal = document.getElementById('setup-modal');
                if (modal) {
                    modal.classList.add('active');
                    modal.setAttribute('aria-hidden', 'false');
                    this.startSetupTimeUpdate();
                    this.populateSetupDefaults();
                }
            }

            hideSetupModal() {
                const modal = document.getElementById('setup-modal');
                if (modal) {
                    modal.classList.remove('active');
                    modal.setAttribute('aria-hidden', 'true');
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

            saveAllSettings() {
                try {
                    const timeOffsetSelect = document.getElementById('time-offset');
                    const notificationsToggle = document.getElementById('notifications-toggle');
                    const currentPhaseSelect = document.getElementById('current-phase-select');
                    const nextPhaseSelect = document.getElementById('next-phase-select');

                    if (timeOffsetSelect) this.timeOffset = parseFloat(timeOffsetSelect.value);
                    if (notificationsToggle) this.notificationsEnabled = notificationsToggle.value === 'enabled';
                    if (currentPhaseSelect) this.currentPhaseOverride = currentPhaseSelect.value;
                    if (nextPhaseSelect) this.nextPhaseOverride = nextPhaseSelect.value;

                    this.saveSettings();
                    this.updateAllDisplays();
                    
                    const saveButton = document.getElementById('save-settings');
                    if (saveButton) {
                        const originalText = saveButton.textContent;
                        saveButton.textContent = 'Saved!';
                        saveButton.style.background = 'var(--gradient-success)';
                        
                        setTimeout(() => {
                            saveButton.textContent = originalText;
                            saveButton.style.background = '';
                        }, 2000);
                    }

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
                    const isOpen = dropdown.classList.contains('active');
                    this.closeAllDropdowns();
                    
                    if (!isOpen) {
                        dropdown.classList.add('active');
                        toggle.classList.add('active');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                }
            }

            closeAllDropdowns() {
                document.querySelectorAll('.settings-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
                document.querySelectorAll('.settings-btn').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-expanded', 'false');
                });
            }

            // FIXED: Enhanced tab switching with proper styling
            switchTab(tabName) {
                try {
                    this.activeTab = tabName;
                    
                    // Update all tab buttons
                    document.querySelectorAll('.tab-btn').forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-selected', 'false');
                    });
                    
                    // Update all tab panels
                    document.querySelectorAll('.tab-panel').forEach(panel => {
                        panel.classList.remove('active');
                    });
                    
                    // Activate current tab and panel
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

            // FIXED: Toggle between local and server time display
            toggleTimeMode() {
                try {
                    this.useLocalTime = !this.useLocalTime;
                    
                    // Update button text and styling
                    const timeToggleLabel = document.getElementById('time-toggle-label');
                    const timeToggleBtn = document.getElementById('time-toggle-btn');
                    if (timeToggleLabel) {
                        timeToggleLabel.textContent = this.useLocalTime ? 'Local Time' : 'Server Time';
                    }
                    if (timeToggleBtn) {
                        // Add visual indication of current mode
                        timeToggleBtn.style.background = this.useLocalTime ? 'var(--bg-surface)' : 'var(--accent-primary)';
                        timeToggleBtn.style.color = this.useLocalTime ? 'var(--text-secondary)' : 'white';
                    }
                    
                    // Update all time displays and refresh content
                    this.updateTimeDisplay();
                    this.updateAllDisplays();
                    this.saveSettings();
                    
                } catch (error) {
                    console.error('Time mode toggle error:', error);
                }
            }

            // FIXED: Switch between guide types (tips/seasonal)
            switchGuideType(guideType) {
                try {
                    this.activeGuideType = guideType;
                    
                    // Update guide navigation buttons
                    document.querySelectorAll('.guide-nav-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    const activeBtn = document.querySelector(`[data-guide-type="${guideType}"]`);
                    if (activeBtn) {
                        activeBtn.classList.add('active');
                    }
                    
                    // Update guides content if on guides tab
                    if (this.activeTab === 'guides') {
                        this.populateGuides();
                    }
                    
                    this.saveSettings();
                    
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
                    console.log('Last War Nexus: Finding next priority window...');
                    const now = this.getServerTime();
                    const currentAlignment = this.isCurrentlyHighPriority();
                    console.log('Current alignment:', currentAlignment);
                    
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
                            const windowTime = new Date(checkDate);
                            windowTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
                            
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

            toggleBanner() {
                try {
                    const banner = document.getElementById('priority-events-banner');
                    const toggle = document.getElementById('banner-toggle');
                    
                    if (banner && toggle) {
                        const isCollapsed = banner.classList.contains('collapsed');
                        banner.classList.toggle('collapsed');
                        toggle.textContent = isCollapsed ? '▲' : '▼';
                        
                        // Update aria attribute
                        const header = document.querySelector('.banner-header');
                        if (header) {
                            header.setAttribute('aria-expanded', !isCollapsed);
                        }
                    }
                } catch (error) {
                    console.error('Banner toggle error:', error);
                }
            }

            // ENHANCED: Update all displays including server time in settings
            updateAllDisplays() {
                try {
                    this.updateTimeDisplay();
                    this.updateSettingsTime();
                    this.updateCurrentStatus();
                    this.updatePriorityDisplay();
                    this.updateSpendingDetails();
                    this.updateBanner();
                    if (this.activeTab) {
                        this.populateTabContent(this.activeTab);
                    }
                } catch (error) {
                    console.error('Display update error:', error);
                }
            }

            updateTimeDisplay() {
                try {
                    console.log('Last War Nexus: Updating time display...');
                    const serverTime = this.getServerTime();
                    const localTime = new Date();
                    const serverTimeString = serverTime.toUTCString().slice(17, 25);
                    
                    // Legacy server time display
                    const timeElement = document.getElementById('server-time');
                    if (timeElement) {
                        timeElement.textContent = serverTimeString;
                    }

                    // Enhanced time displays for main cards
                    const currentDisplayTime = document.getElementById('current-display-time');
                    if (currentDisplayTime) {
                        currentDisplayTime.textContent = localTime.toLocaleTimeString('en-US', { 
                            hour12: false, 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                        });
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
                        
                        phaseEndTime.textContent = phaseEndDate.toLocaleTimeString('en-US', { 
                            hour12: false, 
                            hour: '2-digit', 
                            minute: '2-digit'
                        });
                    }

                    // Next phase preview
                    const nextPhasePreview = document.getElementById('next-phase-preview');
                    if (nextPhasePreview) {
                        const nextPhase = this.getNextArmsPhase();
                        nextPhasePreview.textContent = `${nextPhase.icon} ${nextPhase.name}`;
                    }

                } catch (error) {
                    console.error('Time display error:', error);
                }
            }

            // ADDED: Update server time in settings dropdown
            updateSettingsTime() {
                try {
                    const serverTime = this.getServerTime();
                    const timeString = serverTime.toUTCString().slice(17, 25);
                    
                    const settingsTimeElement = document.getElementById('settings-server-time');
                    if (settingsTimeElement) {
                        settingsTimeElement.textContent = timeString;
                    }
                } catch (error) {
                    console.error('Settings time display error:', error);
                }
            }

            updateCurrentStatus() {
                try {
                    const serverTime = this.getServerTime();
                    const currentVSDay = this.getCurrentVSDay();
                    const currentArmsPhase = this.getCurrentArmsPhase();
                    const nextWindow = this.findNextPriorityWindow();
                    
                    // Update main time display with clear mode indicator
                    const mainTimeDisplay = document.getElementById('main-time-display');
                    if (mainTimeDisplay) {
                        const timeString = this.useLocalTime ? 
                            new Date().toLocaleTimeString('en-US', { hour12: false }) + ' LOCAL' :
                            serverTime.toUTCString().slice(17, 25) + ' SERVER';
                        mainTimeDisplay.textContent = timeString;
                        mainTimeDisplay.style.fontSize = '0.875rem';
                        mainTimeDisplay.style.fontWeight = '600';
                    }
                    
                    // Update priority countdown
                    const priorityCountdown = document.getElementById('priority-countdown');
                    if (priorityCountdown && nextWindow) {
                        priorityCountdown.textContent = this.formatTime(nextWindow.timeRemaining);
                    }
                    
                    // Update phase information
                    const phaseIcon = document.getElementById('phase-icon');
                    const phaseTitle = document.getElementById('phase-title');
                    const phaseDescription = document.getElementById('phase-description');
                    const efficiencyBadge = document.getElementById('efficiency-badge');
                    
                    if (nextWindow && nextWindow.isActive) {
                        // Currently active priority window
                        if (phaseIcon) phaseIcon.textContent = nextWindow.phase.icon || '🎯';
                        if (phaseTitle) phaseTitle.textContent = `${nextWindow.phase.name} + ${nextWindow.vsDay.title}`;
                        if (phaseDescription) phaseDescription.textContent = `${nextWindow.phase.activities.join(', ')} align perfectly with ${nextWindow.vsDay.focus}`;
                        if (efficiencyBadge) {
                            efficiencyBadge.textContent = 'MAXIMUM EFFICIENCY';
                            efficiencyBadge.style.background = 'var(--gradient-success)';
                        }
                    } else {
                        // Regular phase information
                        const phaseData = this.data.armsRacePhases.find(p => p.id === currentArmsPhase.id) || this.data.armsRacePhases[0];
                        if (phaseIcon) phaseIcon.textContent = phaseData.icon;
                        if (phaseTitle) phaseTitle.textContent = `${phaseData.name} + ${currentVSDay.title}`;
                        if (phaseDescription) phaseDescription.textContent = `${phaseData.activities.join(' & ')} activities align with ${currentVSDay.focus}`;
                        if (efficiencyBadge) {
                            const alignment = this.data.priorityAlignments.find(a => 
                                a.vsDay === currentVSDay.day && a.armsPhase === phaseData.name
                            );
                            if (alignment) {
                                efficiencyBadge.textContent = alignment.benefit.toUpperCase();
                                efficiencyBadge.style.background = 'var(--gradient-primary)';
                            } else {
                                efficiencyBadge.textContent = 'NORMAL';
                                efficiencyBadge.style.background = 'var(--bg-elevated)';
                                efficiencyBadge.style.color = 'var(--text-secondary)';
                            }
                        }
                    }
                    
                    // Update spending tags
                    const spendingTags = document.getElementById('spending-tags');
                    if (spendingTags) {
                        const currentPhaseData = this.data.armsRacePhases.find(p => p.id === currentArmsPhase.id);
                        if (currentPhaseData && currentPhaseData.bestSpending) {
                            const tagsHTML = currentPhaseData.bestSpending.map(item => 
                                `<div class="spending-tag ${item.value}">${item.item}</div>`
                            ).join('');
                            spendingTags.innerHTML = tagsHTML;
                        }
                    }
                    
                    // Update countdown display (legacy support)
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
                    
                    // Update server reset information
                    this.updateServerResetInfo();
                    
                } catch (error) {
                    console.error('Status update error:', error);
                }
            }

            updateServerResetInfo() {
                try {
                    const now = new Date();
                    const serverTime = this.getServerTime();
                    
                    // Calculate next server reset (daily at 00:00 server time)
                    const nextReset = new Date(serverTime);
                    nextReset.setUTCHours(24, 0, 0, 0); // Next midnight UTC
                    
                    // Adjust for server time offset
                    const resetInServerTime = new Date(nextReset.getTime() - (this.timeOffset * 60 * 60 * 1000));
                    
                    // Convert to local time for display
                    const localResetTime = new Date(nextReset.getTime() - (this.timeOffset * 60 * 60 * 1000));
                    
                    const nextServerReset = document.getElementById('next-server-reset');
                    const resetLocalTime = document.getElementById('reset-local-time');
                    const timeUntilReset = document.getElementById('time-until-reset');
                    
                    if (nextServerReset) {
                        // Always show 00:00 in server time zone
                        const serverHours = this.timeOffset >= 0 ? `UTC+${this.timeOffset}` : `UTC${this.timeOffset}`;
                        nextServerReset.textContent = `00:00 ${serverHours}`;
                    }
                    
                    if (resetLocalTime) {
                        resetLocalTime.textContent = localResetTime.toLocaleTimeString('en-US', { hour12: false }) + ' Local';
                    }
                    
                    if (timeUntilReset) {
                        const timeUntil = nextReset.getTime() - serverTime.getTime();
                        timeUntilReset.textContent = this.formatTime(timeUntil);
                    }
                    
                } catch (error) {
                    console.error('Server reset update error:', error);
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
                } catch (error) {
                    console.error('Priority display error:', error);
                }
            }

            // ENHANCED: Update spending details
            updateSpendingDetails() {
                try {
                    const nextWindow = this.findNextPriorityWindow();
                    const spendingItemsElement = document.getElementById('spending-items');
                    
                    if (!nextWindow || !spendingItemsElement) return;
                    
                    const phase = nextWindow.phase;
                    const bestSpending = phase.bestSpending || [];
                    
                    const html = bestSpending.map(item => `
                        <span class="spending-item ${item.value === 'high' ? 'high-value' : ''}">${item.item}</span>
                    `).join('');
                    
                    spendingItemsElement.innerHTML = html;
                } catch (error) {
                    console.error('Spending details update error:', error);
                }
            }

            updateBanner() {
                try {
                    // Populate the priority events banner
                    this.populatePriorityBanner();
                } catch (error) {
                    console.error('Banner update error:', error);
                }
            }

            updateBannerOld() {
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

            // ENHANCED: Priority windows with spending details
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
                            const startTime = new Date(checkDate);
                            startTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
                            
                            const endTime = new Date(startTime);
                            endTime.setUTCHours(startTime.getUTCHours() + 4);
                            
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
                                timeDisplay: isActive ? 'Active Now' : timeDiff > 0 ? `in ${this.formatTime(timeDiff)}` : 'Completed',
                                startTimeLocal: new Date(startTime.getTime() - (this.timeOffset * 60 * 60 * 1000)),
                                startTimeServer: startTime
                            });
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
                        const startTimeDisplay = this.useLocalTime ? 
                            window.startTimeLocal.toLocaleString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                            }) + ' Local' :
                            window.startTimeServer.toUTCString().slice(0, 22) + ' Server';
                        
                        return `
                        <div class="priority-window-card ${window.isActive ? 'active' : ''} ${window.isPeak ? 'peak' : ''}">
                            <div style="background: var(--bg-surface); padding: var(--spacing-lg); border-bottom: 1px solid var(--border-primary);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
                                    <div style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700; color: var(--text-primary);">${window.timeDisplay}</div>
                                    <div style="padding: 4px var(--spacing-sm); border-radius: var(--border-radius-sm); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; background: ${window.isActive ? 'var(--gradient-success)' : 'var(--gradient-secondary)'}; color: white;">
                                        ${window.isActive ? 'ACTIVE NOW' : 'UPCOMING'}
                                    </div>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-tertiary); font-family: var(--font-mono);">
                                    Starts: ${startTimeDisplay}
                                </div>
                            </div>
                            <div style="padding: var(--spacing-lg);">
                                <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
                                    <span style="font-size: 1.5rem;">${window.phase.icon}</span>
                                    <div style="flex: 1;">
                                        <div style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 2px;">${window.phase.name} + ${window.vsDay.title}</div>
                                        <div style="font-size: 0.8rem; color: var(--text-tertiary);">${window.alignment.reason}</div>
                                    </div>
                                </div>
                                <div style="background: var(--gradient-primary); color: white; padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--border-radius); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; text-align: center; margin-bottom: var(--spacing-md);">
                                    ${window.alignment.benefit}
                                </div>
                                <div style="background: var(--bg-tertiary); border-radius: var(--border-radius); padding: var(--spacing-md);">
                                    <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); margin-bottom: var(--spacing-sm); text-transform: uppercase;">Best Spending</div>
                                    <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-xs);">
                                        ${window.phase.bestSpending?.slice(0, 3).map(item => `<span style="background: ${item.value === 'high' ? 'var(--gradient-secondary)' : 'var(--bg-elevated)'}; color: ${item.value === 'high' ? 'white' : 'var(--text-secondary)'}; padding: 3px var(--spacing-sm); border-radius: var(--border-radius-sm); font-size: 0.7rem; font-weight: 500;">${item.item}</span>`).join('') || ''}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    }).join('');
                    
                    grid.innerHTML = html;
                } catch (error) {
                    console.error('Priority windows population error:', error);
                    const grid = document.getElementById('priority-grid');
                    if (grid) {
                        grid.innerHTML = '<div class="loading-message">Error loading priority windows</div>';
                    }
                }
            }

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
                            const endHour = (phaseIndex * 4 + 4) % 24;
                            const isActive = isToday && 
                                now.getUTCHours() >= startHour && 
                                now.getUTCHours() < (startHour + 4);
                            
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
                            <div style="background: var(--bg-surface); padding: var(--spacing-lg); border-bottom: 1px solid var(--border-primary); text-align: center;">
                                <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--spacing-xs);">${day.vsDay.name}</h3>
                                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: var(--spacing-xs);">${day.vsDay.title}</div>
                                <div style="font-size: 0.75rem; color: var(--text-tertiary);">${day.date}</div>
                            </div>
                            <div style="padding: var(--spacing-md);">
                                ${day.phases.map(phase => `
                                    <div style="background: var(--bg-tertiary); border: 1px solid ${phase.isPriority ? 'var(--accent-warning)' : 'var(--border-primary)'}; border-radius: var(--border-radius); padding: var(--spacing-md); margin-bottom: var(--spacing-xs); display: flex; justify-content: space-between; align-items: center; position: relative; ${phase.isPriority ? 'background: rgba(245, 158, 11, 0.1);' : ''} ${phase.isActive ? 'border-color: var(--accent-success); background: rgba(34, 197, 94, 0.1);' : ''}">
                                        <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; color: var(--text-muted);">${phase.timeRange}</div>
                                        <div style="flex: 1; text-align: center; font-size: 0.8rem; font-weight: 600; color: var(--text-primary);">${phase.name}</div>
                                        <div style="font-size: 1rem;">${phase.icon}</div>
                                        ${phase.isPriority ? '<div style="position: absolute; top: -4px; right: 4px; background: var(--gradient-secondary); color: white; padding: 2px 4px; border-radius: 3px; font-size: 0.6rem; font-weight: 700;">HIGH</div>' : ''}
                                        ${phase.isActive ? '<div style="position: absolute; top: -4px; left: 4px; background: var(--gradient-success); color: white; padding: 2px 4px; border-radius: 3px; font-size: 0.6rem; font-weight: 700;">NOW</div>' : ''}
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

            populateGuides() {
                try {
                    const grid = document.getElementById('guides-content');
                    if (!grid) return;
                    
                    // FIXED: Use different guide sets based on activeGuideType
                    let guides = [];
                    
                    if (this.activeGuideType === 'seasonal') {
                        guides = [
                            {
                                title: "Season 1: Foundation Building",
                                category: "New Player Season Strategy",
                                icon: "🏗️",
                                description: "Your first season focuses on learning game mechanics, establishing base infrastructure, and understanding the Arms Race / VS Points system.",
                                content: `
                                    <div class="guide-section">
                                        <h5>🎯 Season 1 Core Objectives</h5>
                                        <p><strong>Goal:</strong> Learn fundamentals, reach HQ 15+, join active alliance, understand VS Points system</p>
                                        
                                        <h5>📚 Learning Phase (Days 1-15)</h5>
                                        <ul>
                                            <li><strong>Tutorial Completion:</strong> Follow all in-game tutorials completely</li>
                                            <li><strong>Basic Buildings:</strong> HQ 10+ with balanced resource/military buildings</li>
                                            <li><strong>Alliance Research:</strong> Find active alliance in your timezone</li>
                                            <li><strong>Arms Race Understanding:</strong> Use this tool to track perfect alignment windows</li>
                                            <li><strong>Hero Focus:</strong> Choose 1-2 main heroes and focus resources</li>
                                        </ul>
                                        
                                        <h5>⚡ First VS Points Strategy (Days 15-45)</h5>
                                        <ul>
                                            <li><strong>Perfect Alignments:</strong> Save speedups for 4x point windows</li>
                                            <li><strong>Daily Activities:</strong> Complete all daily missions and events</li>
                                            <li><strong>Resource Management:</strong> Don't waste premium items on non-aligned activities</li>
                                            <li><strong>Power Building:</strong> Target 500k+ power by end of season</li>
                                        </ul>
                                        
                                        <h5>🏆 Season End Goals (Days 45-60)</h5>
                                        <ul>
                                            <li><strong>Alliance Contribution:</strong> Consistent VS Points for alliance ranking</li>
                                            <li><strong>Personal Ranking:</strong> Individual VS Points ranking in server</li>
                                            <li><strong>Knowledge Base:</strong> Understand all game mechanics for Season 2</li>
                                        </ul>
                                    </div>
                                `
                            },
                            {
                                title: "Season 2: Power Acceleration",
                                category: "Growth & Optimization",
                                icon: "⚡",
                                description: "Second season focuses on rapid power growth, mastering perfect alignments, and establishing yourself as a competitive player.",
                                content: `
                                    <div class="guide-section">
                                        <h5>🎯 Season 2 Core Objectives</h5>
                                        <p><strong>Goal:</strong> HQ 20+, 2M+ power, top alliance rankings, mastery of perfect alignments</p>
                                        
                                        <h5>💪 Power Growth Phase (Days 1-20)</h5>
                                        <ul>
                                            <li><strong>Perfect Alignment Mastery:</strong> Use 100% of speedups during 4x point windows</li>
                                            <li><strong>Hero Specialization:</strong> Develop 3-4 heroes for different combat roles</li>
                                            <li><strong>Research Focus:</strong> Complete military tech trees for power multiplication</li>
                                            <li><strong>Equipment Crafting:</strong> Begin serious equipment enhancement</li>
                                        </ul>
                                        
                                        <h5>🏆 Competition Phase (Days 20-50)</h5>
                                        <ul>
                                            <li><strong>Ranking Strategy:</strong> Target top 100 in personal VS Points</li>
                                            <li><strong>Alliance Leadership:</strong> Take active role in alliance coordination</li>
                                            <li><strong>Resource Efficiency:</strong> 90%+ of activities during perfect alignments</li>
                                            <li><strong>Event Dominance:</strong> Top rewards in seasonal events</li>
                                        </ul>
                                        
                                        <h5>🎖️ Season End Mastery (Days 50-60)</h5>
                                        <ul>
                                            <li><strong>Strategic Stockpiling:</strong> Save premium items for Season 3 start</li>
                                            <li><strong>Knowledge Transfer:</strong> Share strategies with alliance members</li>
                                            <li><strong>Next Season Planning:</strong> Analyze what worked and what didn't</li>
                                        </ul>
                                    </div>
                                `
                            },
                            {
                                title: "Season 3: Elite Competition",
                                category: "Advanced Strategy & Leadership",
                                icon: "🎖️",
                                description: "Third season focuses on server dominance, advanced alliance tactics, and establishing yourself as a top-tier player.",
                                content: `
                                    <div class="guide-section">
                                        <h5>🎯 Season 3 Core Objectives</h5>
                                        <p><strong>Goal:</strong> HQ 25+, 5M+ power, server top 50, alliance leadership role</p>
                                        
                                        <h5>👑 Dominance Phase (Days 1-25)</h5>
                                        <ul>
                                            <li><strong>Server Leadership:</strong> Lead or co-lead server-wide strategies</li>
                                            <li><strong>Advanced Alignments:</strong> Perfect timing with premium diamond strategies</li>
                                            <li><strong>Cross-Alliance Coordination:</strong> Organize multi-alliance campaigns</li>
                                            <li><strong>Resource Optimization:</strong> Maximum efficiency in all activities</li>
                                        </ul>
                                        
                                        <h5>🚀 Advanced Tactics (Days 25-50)</h5>
                                        <ul>
                                            <li><strong>Meta Strategies:</strong> Develop and share optimal builds</li>
                                            <li><strong>Event Mastery:</strong> Secure #1 rankings in major events</li>
                                            <li><strong>Alliance Mentorship:</strong> Train new players in VS Points optimization</li>
                                            <li><strong>PvP Excellence:</strong> Dominate world map and conflicts</li>
                                        </ul>
                                        
                                        <h5>🏆 Legacy Building (Days 50-60)</h5>
                                        <ul>
                                            <li><strong>Server Records:</strong> Set records that last multiple seasons</li>
                                            <li><strong>Knowledge Archive:</strong> Document advanced strategies</li>
                                            <li><strong>Succession Planning:</strong> Prepare next generation of leaders</li>
                                        </ul>
                                        
                                    </div>
                                `
                            },
                            {
                                title: "Season 4+: Veteran Mastery",
                                category: "Expert Level Optimization",
                                icon: "👑",
                                description: "Fourth season and beyond - maintaining dominance, innovation, and server-wide influence while perfecting the ultimate VS Points strategies.",
                                content: `
                                    <div class="guide-section">
                                        <h5>🎯 Veteran Objectives</h5>
                                        <p><strong>Goal:</strong> HQ 30+, 10M+ power, server legend status, innovative strategy development</p>
                                        
                                        <h5>🧠 Innovation Phase (Ongoing)</h5>
                                        <ul>
                                            <li><strong>Strategy Innovation:</strong> Develop new meta strategies</li>
                                            <li><strong>Tool Development:</strong> Create and share optimization tools</li>
                                            <li><strong>Community Leadership:</strong> Guide entire server communities</li>
                                            <li><strong>Cross-Server Influence:</strong> Share strategies across servers</li>
                                        </ul>
                                        
                                        <h5>📊 Data Mastery (Advanced)</h5>
                                        <ul>
                                            <li><strong>Efficiency Analytics:</strong> Track and optimize every activity</li>
                                            <li><strong>Predictive Planning:</strong> Anticipate event schedules and prepare</li>
                                            <li><strong>ROI Optimization:</strong> Perfect resource investment strategies</li>
                                            <li><strong>Mentorship Programs:</strong> Systematic training of new players</li>
                                        </ul>
                                        
                                        <h5>🌟 Legacy Creation (Long-term)</h5>
                                        <ul>
                                            <li><strong>Legendary Status:</strong> Become a server legend</li>
                                            <li><strong>Strategy Documentation:</strong> Create comprehensive guides</li>
                                            <li><strong>Community Building:</strong> Foster positive server culture</li>
                                            <li><strong>Game Evolution:</strong> Influence game development through feedback</li>
                                        </ul>
                                        
                                        <div class="reference-link">
                                            <p><strong>🎯 Ultimate Resource:</strong> This VS Points Optimizer becomes your permanent companion for perfect alignment tracking and maximum efficiency across all seasons.</p>
                                        </div>
                                    </div>
                                `
                            }
                        ];
                    } else {
                        // Default to 'tips' guides - Comprehensive General Guides
                        guides = [
                            {
                                title: "Squad Building & Composition",
                                category: "Combat Strategy",
                                icon: "⚔️",
                                content: `
                                    <div class="guide-content">
                                        <h3>🏗️ Building Powerful Combat Squads</h3>
                                        <p>Creating effective squads requires understanding unit synergies, roles, and optimal formations for different combat scenarios.</p>
                                        
                                        <h4>🎯 Core Squad Roles</h4>
                                        <ul>
                                            <li><strong>Tank Units:</strong> High defense and health to absorb damage</li>
                                            <li><strong>DPS Units:</strong> High attack power for eliminating threats</li>
                                            <li><strong>Support Units:</strong> Healing, buffs, and utility abilities</li>
                                            <li><strong>Specialist Units:</strong> Counter specific enemy types or tactics</li>
                                        </ul>
                                        
                                        <h4>⚡ Squad Synergy Principles</h4>
                                        <ul>
                                            <li><strong>Unit Type Balance:</strong> Mix infantry, vehicles, and aircraft for versatility</li>
                                            <li><strong>Hero Compatibility:</strong> Choose heroes that enhance your unit composition</li>
                                            <li><strong>Formation Strategy:</strong> Position units to maximize strengths and minimize weaknesses</li>
                                            <li><strong>Power Level Distribution:</strong> Balance investment across all squad members</li>
                                        </ul>
                                        
                                        <h4>🎖️ Advanced Squad Tactics</h4>
                                        <ul>
                                            <li><strong>Counter Builds:</strong> Adapt squads to counter enemy formations</li>
                                            <li><strong>Terrain Advantage:</strong> Use map positioning for tactical benefits</li>
                                            <li><strong>Resource Efficiency:</strong> Optimize upgrade paths for maximum power gains</li>
                                            <li><strong>Meta Adaptation:</strong> Adjust strategies based on current game balance</li>
                                        </ul>
                                        
                                        <div class="reference-link">
                                            <p><strong>📖 Squad Building Guide:</strong> <a href="https://lastwartutorial.com/squad-building" target="_blank" rel="noopener">LastWarTutorial.com</a> provides detailed unit tier lists, formation guides, and combat mechanics explanations.</p>
                                        </div>
                                    </div>
                                `
                            },
                            {
                                title: "Equipment Upgrade Paths",
                                category: "Power Optimization",
                                icon: "🛡️",
                                content: `
                                    <div class="guide-content">
                                        <h3>⚙️ Optimal Equipment Development</h3>
                                        <p>Strategic equipment upgrades provide the most efficient power gains and combat effectiveness improvements.</p>
                                        
                                        <h4>🏆 Priority Equipment Types</h4>
                                        <ul>
                                            <li><strong>Weapons (First Priority):</strong> Direct damage increase - highest ROI</li>
                                            <li><strong>Armor (Second Priority):</strong> Survivability improvements</li>
                                            <li><strong>Accessories (Third Priority):</strong> Utility and special abilities</li>
                                            <li><strong>Consumables:</strong> Temporary but powerful battlefield advantages</li>
                                        </ul>
                                        
                                        <h4>📈 Upgrade Path Strategy</h4>
                                        <ol>
                                            <li><strong>Level Main Weapons:</strong> Focus on primary squad weapons first</li>
                                            <li><strong>Enhance Star Ratings:</strong> Star upgrades provide significant stat boosts</li>
                                            <li><strong>Optimize Sets:</strong> Complete equipment sets for bonus effects</li>
                                            <li><strong>Refine Quality:</strong> Higher quality equipment scales better</li>
                                        </ol>
                                        
                                        <h4>💎 Resource Allocation</h4>
                                        <ul>
                                            <li><strong>Materials Focus:</strong> Prioritize rare materials for highest-tier equipment</li>
                                            <li><strong>Enhancement Order:</strong> Upgrade main squad equipment before secondary squads</li>
                                            <li><strong>Event Timing:</strong> Save materials for equipment enhancement events</li>
                                            <li><strong>Cost Efficiency:</strong> Calculate power-per-resource ratios</li>
                                        </ul>
                                        
                                        <h4>🔧 Advanced Optimization</h4>
                                        <ul>
                                            <li><strong>Set Bonuses:</strong> Plan equipment combinations for synergy effects</li>
                                            <li><strong>Situational Gear:</strong> Maintain multiple equipment sets for different scenarios</li>
                                            <li><strong>Research Integration:</strong> Coordinate equipment upgrades with research progress</li>
                                            <li><strong>Hero Synergy:</strong> Match equipment effects with hero abilities</li>
                                        </ul>
                                        
                                        <div class="reference-link">
                                            <p><strong>📖 Equipment Mastery:</strong> <a href="https://lastwartutorial.com/equipment-guide" target="_blank" rel="noopener">LastWarTutorial.com</a> offers detailed equipment calculators, tier lists, and optimization spreadsheets.</p>
                                        </div>
                                    </div>
                                `
                            },
                            {
                                title: "Building Development Strategy",
                                category: "Base Optimization",
                                icon: "🏗️",
                                content: `
                                    <div class="guide-content">
                                        <h3>🏛️ Strategic Building Upgrade Order</h3>
                                        <p>Efficient building development creates the foundation for long-term growth and competitive advantage.</p>
                                        
                                        <h4>🎯 Priority Building Order</h4>
                                        <ol>
                                            <li><strong>Headquarters (Top Priority):</strong> Unlocks all other building levels</li>
                                            <li><strong>Resource Buildings:</strong> Oil Wells, Farms, Steel Mills for steady income</li>
                                            <li><strong>Army Camp:</strong> Increases troop capacity for larger battles</li>
                                            <li><strong>Research Institute:</strong> Enables crucial technology advancement</li>
                                            <li><strong>Hero Hall:</strong> Unlocks hero slots and abilities</li>
                                            <li><strong>Defense Buildings:</strong> Walls, turrets for base protection</li>
                                        </ol>
                                        
                                        <h4>⚡ Early Game Focus (HQ 1-15)</h4>
                                        <ul>
                                            <li><strong>Resource Production:</strong> Establish steady resource income</li>
                                            <li><strong>Storage Capacity:</strong> Prevent resource waste from overflow</li>
                                            <li><strong>Basic Military:</strong> Training camps and initial army development</li>
                                            <li><strong>Essential Research:</strong> Economy and military basics</li>
                                        </ul>
                                        
                                        <h4>🚀 Mid Game Strategy (HQ 16-25)</h4>
                                        <ul>
                                            <li><strong>Advanced Military:</strong> Specialized unit production buildings</li>
                                            <li><strong>Hero Development:</strong> Hero halls and recruitment buildings</li>
                                            <li><strong>Defense Systems:</strong> Comprehensive base protection</li>
                                            <li><strong>Alliance Support:</strong> Embassy and alliance-related structures</li>
                                        </ul>
                                        
                                        <h4>🏆 Late Game Optimization (HQ 26+)</h4>
                                        <ul>
                                            <li><strong>Specialization:</strong> Focus on specific military or economic paths</li>
                                            <li><strong>Maximum Efficiency:</strong> Optimize all building effects and bonuses</li>
                                            <li><strong>Event Preparation:</strong> Buildings that enhance event performance</li>
                                            <li><strong>Competitive Edge:</strong> Structures that provide PvP advantages</li>
                                        </ul>
                                        
                                        <h4>💡 Resource Management Tips</h4>
                                        <ul>
                                            <li><strong>Construction Queue:</strong> Plan multiple upgrades during Arms Race events</li>
                                            <li><strong>Speedup Efficiency:</strong> Use construction speedups during building-focused phases</li>
                                            <li><strong>Material Stockpiling:</strong> Gather building materials before major upgrades</li>
                                            <li><strong>Event Timing:</strong> Align major upgrades with base expansion VS days</li>
                                        </ul>
                                        
                                        <div class="reference-link">
                                            <p><strong>📖 Building Optimization:</strong> <a href="https://lastwartutorial.com/base-development" target="_blank" rel="noopener">LastWarTutorial.com</a> features building calculators, upgrade planners, and efficiency guides.</p>
                                        </div>
                                    </div>
                                `
                            },
                            {
                                title: "VS Points & Arms Race Mastery",
                                category: "Event Strategy",
                                icon: "🎯",
                                content: `
                                    <div class="guide-content">
                                        <h3>⚡ Maximizing VS Points Efficiency</h3>
                                        <p>Understanding the Arms Race and Alliance VS mechanics enables strategic planning for maximum point generation.</p>
                                        
                                        <h4>🔄 Arms Race Cycle Understanding</h4>
                                        <ul>
                                            <li><strong>5-Phase System:</strong> City Building → Unit Progression → Tech Research → Drone Boost → Hero Advancement</li>
                                            <li><strong>4-Hour Phases:</strong> Each phase lasts exactly 4 hours</li>
                                            <li><strong>20-Hour Cycle:</strong> Complete cycle takes 20 hours, restarting at 20:00 server time</li>
                                            <li><strong>Predictable Schedule:</strong> Same phases occur at different times each day</li>
                                        </ul>
                                        
                                        <h4>📅 Alliance VS Day Focus</h4>
                                        <ul>
                                            <li><strong>Monday - Radar Training:</strong> Stamina usage, hero EXP, drone activities (2x multiplier)</li>
                                            <li><strong>Tuesday - Base Expansion:</strong> Construction speedups, building power (2x multiplier)</li>
                                            <li><strong>Wednesday - Age of Science:</strong> Research speedups, tech advancement (2x multiplier)</li>
                                            <li><strong>Thursday - Train Heroes:</strong> Hero recruitment, EXP, skill development (2x multiplier)</li>
                                            <li><strong>Friday - Total Mobilization:</strong> ALL activities count - SAVE RESOURCES FOR THIS (2x multiplier)</li>
                                            <li><strong>Saturday - Enemy Buster:</strong> Military training, combat preparation (2x multiplier)</li>
                                        </ul>
                                        
                                        <h4>🎯 Perfect Alignment Strategy</h4>
                                        <ul>
                                            <li><strong>Tech Research + Age of Science:</strong> 4x point multiplication (2x Arms Race + 2x VS Day)</li>
                                            <li><strong>City Building + Base Expansion:</strong> 4x point multiplication for construction</li>
                                            <li><strong>Hero Advancement + Train Heroes:</strong> 4x point multiplication for heroes</li>
                                            <li><strong>Drone Boost + Radar Training:</strong> 4x point multiplication for stamina</li>
                                            <li><strong>Unit Progression + Enemy Buster:</strong> 4x point multiplication for military</li>
                                            <li><strong>Friday Total Mobilization:</strong> 4x points possible with ANY Arms Race phase</li>
                                        </ul>
                                        
                                        <h4>💎 Resource Planning</h4>
                                        <ul>
                                            <li><strong>Speedup Conservation:</strong> Save premium speedups for perfect alignments</li>
                                            <li><strong>Activity Timing:</strong> Plan major activities for high-priority windows</li>
                                            <li><strong>Diamond Strategy:</strong> Diamond purchases provide points in ALL phases (always 2x base points)</li>
                                            <li><strong>VIP Store Priority:</strong> 30-50% better value than regular store purchases</li>
                                            <li><strong>Perfect Timing Strategy:</strong> Save premium items for 4x point windows</li>
                                            <li><strong>Weekly Planning:</strong> Plan major activities around perfect alignments</li>
                                        </ul>
                                        
                                        <h4>📱 Planning Tools</h4>
                                        <ul>
                                            <li><strong>Schedule Tracking:</strong> Use this tool to identify upcoming priority windows</li>
                                            <li><strong>Time Zone Mastery:</strong> Know your server time for accurate planning</li>
                                            <li><strong>Notification Setup:</strong> Set alerts for high-priority periods</li>
                                            <li><strong>Alliance Coordination:</strong> Plan group activities during optimal windows</li>
                                        </ul>
                                        
                                        <div class="reference-link">
                                            <p><strong>📖 VS Points Mastery:</strong> <a href="https://lastwartutorial.com/vs-points-guide" target="_blank" rel="noopener">LastWarTutorial.com</a> provides detailed point calculators, timing strategies, and optimization techniques.</p>
                                        </div>
                                    </div>
                                `
                            }
                        ];
                    }
                    
                    const html = guides.map((guide, index) => `
                        <div class="guide-card" data-guide-index="${index}">
                            <div class="guide-header" data-guide-toggle="${index}">
                                <div class="guide-icon">${guide.icon}</div>
                                <div class="guide-info">
                                    <h3 class="guide-title">${guide.title}</h3>
                                    <div class="guide-category">${guide.category}</div>
                                </div>
                                <div class="guide-expand-icon" id="guide-expand-${index}">▼</div>
                            </div>
                            <div class="guide-content-wrapper" id="guide-content-${index}">
                                <div class="guide-content">
                                    ${guide.content || `
                                        <p class="guide-description">${guide.description}</p>
                                        <div class="guide-tips">
                                            ${guide.tips.map(tip => `<span class="guide-tip">${tip}</span>`).join('')}
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                    `).join('');
                    
                    grid.innerHTML = html;
                    
                    // Add event listeners for guide toggles after DOM update
                    setTimeout(() => {
                        document.querySelectorAll('[data-guide-toggle]').forEach(header => {
                            header.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const index = header.getAttribute('data-guide-toggle');
                                this.toggleGuideExpansion(index);
                            });
                        });
                    }, 50);
                    
                } catch (error) {
                    console.error('Guides population error:', error);
                }
            }

            // ENHANCED: Guide expansion functionality
            toggleGuideExpansion(index) {
                try {
                    const content = document.getElementById(`guide-content-${index}`);
                    const icon = document.getElementById(`guide-expand-${index}`);
                    const card = document.querySelector(`[data-guide-index="${index}"]`);
                    
                    if (content && icon && card) {
                        const isExpanded = card.classList.contains('expanded');
                        
                        if (isExpanded) {
                            // Collapse
                            card.classList.remove('expanded');
                            content.style.maxHeight = '0';
                            content.style.opacity = '0';
                            icon.style.transform = 'rotate(0deg)';
                        } else {
                            // Expand
                            card.classList.add('expanded');
                            content.style.maxHeight = content.scrollHeight + 'px';
                            content.style.opacity = '1';
                            icon.style.transform = 'rotate(180deg)';
                        }
                    }
                } catch (error) {
                    console.error('Guide expansion error:', error);
                }
            }

            hideBanner() {
                const banner = document.getElementById('priority-banner');
                if (banner) {
                    banner.classList.remove('show', 'peak-priority');
                }
            }

            // ADDED: Populate Priority Events Banner
            populatePriorityBanner() {
                try {
                    const bannerGrid = document.getElementById('banner-grid');
                    const bannerCount = document.getElementById('banner-count');
                    if (!bannerGrid) return;
                    
                    const now = this.getServerTime();
                    const priorityWindows = [];
                    
                    // Get next 3 priority windows
                    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
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
                            const startTime = new Date(checkDate);
                            startTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
                            
                            const timeDiff = startTime.getTime() - now.getTime();
                            const isActive = now >= startTime && now < new Date(startTime.getTime() + (4 * 60 * 60 * 1000));
                            
                            if (timeDiff > -240 * 60 * 1000) { // Show if within 4 hours or upcoming
                                priorityWindows.push({
                                    startTime,
                                    timeDiff,
                                    isActive,
                                    phase,
                                    vsDay,
                                    alignment,
                                    timeDisplay: isActive ? 'Active Now' : timeDiff > 0 ? `in ${this.formatTime(timeDiff)}` : 'Recently ended'
                                });
                            }
                        }
                    }
                    
                    priorityWindows.sort((a, b) => Math.abs(a.timeDiff) - Math.abs(b.timeDiff));
                    const displayWindows = priorityWindows.slice(0, 3);
                    
                    if (bannerCount) {
                        bannerCount.textContent = displayWindows.length;
                    }
                    
                    if (displayWindows.length === 0) {
                        bannerGrid.innerHTML = `
                            <div class="banner-event-card">
                                <div class="banner-event-icon">⏰</div>
                                <div class="banner-event-info">
                                    <div class="banner-event-title">No Priority Events</div>
                                    <div class="banner-event-time">Next 3 days clear</div>
                                </div>
                            </div>
                            /* Removed ad space area */
                        `;
                        return;
                    }
                    
                    // Take only first 3 events
                    const events = displayWindows.slice(0, 3);
                    const html = events.map(window => `
                        <div class="banner-event-card ${window.isActive ? 'active' : ''}">
                            <div class="banner-event-icon">${window.phase.icon}</div>
                            <div class="banner-event-info">
                                <div class="banner-event-title">${window.phase.name}</div>
                                <div class="banner-event-time">${window.timeDisplay}</div>
                            </div>
                        </div>
                    `).join('');
                    
                    bannerGrid.innerHTML = html;
                    
                } catch (error) {
                    console.error('Priority banner population error:', error);
                    const bannerGrid = document.getElementById('banner-grid');
                    if (bannerGrid) {
                        bannerGrid.innerHTML = '<div style="padding: var(--spacing-lg); text-align: center; color: var(--text-secondary);">Unable to load priority events</div>';
                    }
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
                
                // Add guide expansion function to window
                window.lastWarNexus.toggleGuideExpansion = function(index) {
                    try {
                        const content = document.getElementById(`guide-content-${index}`);
                        const icon = document.getElementById(`guide-expand-${index}`);
                        
                        if (content && icon) {
                            const isExpanded = content.style.display !== 'none';
                            content.style.display = isExpanded ? 'none' : 'block';
                            icon.textContent = isExpanded ? '▼' : '▲';
                            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
                        }
                    } catch (error) {
                        console.error('Guide expansion error:', error);
                    }
                };

                // Add banner toggle function
                window.lastWarNexus.toggleBanner = this.toggleBanner.bind(this);
                
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
                        border-radius: 16px;
                        padding: 32px;
                        text-align: center;
                        z-index: 9999;
                        max-width: 400px;
                        font-family: var(--font-family);
                        box-shadow: var(--shadow-xl);
                    ">
                        <h2 style="color: var(--accent-error); margin-bottom: 16px; font-size: 1.25rem;">Initialization Error</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;">
                            Failed to start Last War Nexus. Please refresh the page and try again.
                        </p>
                        <button onclick="window.location.reload()" style="
                            background: var(--gradient-primary);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
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
