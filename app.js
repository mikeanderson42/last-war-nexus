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
                this.eventListenersSetup = false;

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
                    console.log('=== VSPointsOptimizer INIT START ===');
                    this.loadSettings();
                    console.log('Settings loaded successfully');
                    this.setupEventListeners();
                    console.log('Event listeners setup successfully');
                    
                    // FIXED: Always update displays on initialization
                    this.updateAllDisplays();
                    
                    // FIXED: Initialize all content including guides
                    try {
                        this.initializeAllContent();
                    } catch (error) {
                        console.error('Content initialization failed:', error);
                    }
                    console.log('All content initialized successfully');
                    
                    // FIXED: Force populate guides after DOM is ready
                    setTimeout(() => {
                        console.log('=== FORCED GUIDE POPULATION ON STARTUP ===');
                        console.log('activeGuideType:', this.activeGuideType);
                        this.populateGuides();
                    }, 1000);
                    
                    // Always show setup modal on first visit (when no settings saved)
                    const hasStoredSettings = localStorage.getItem('lwn-settings');
                    if (!hasStoredSettings || !this.isSetupComplete) {
                        this.showSetupModal();
                    } else {
                        this.startUpdateLoop();
                    }
                } catch (error) {
                    console.error('Initialization error:', error);
                    this.handleError('Failed to initialize application');
                }
            }

            setupEventListeners() {
                try {
                    // Prevent setting up listeners multiple times
                    if (this.eventListenersSetup) {
                        return;
                    }
                    this.eventListenersSetup = true;
                    
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

                    // FIXED: Guide navigation buttons with robust mobile support
                    const handleGuideNavigation = (e) => {
                        const btn = e.target.closest('.guide-nav-btn');
                        if (btn) {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            
                            // Prevent multiple rapid clicks
                            if (btn.hasAttribute('data-processing')) {
                                return;
                            }
                            btn.setAttribute('data-processing', 'true');
                            
                            const guideType = btn.getAttribute('data-guide-type');
                            if (guideType) {
                                console.log('=== GUIDE NAV CLICK ===');
                                console.log('Guide type:', guideType);
                                console.log('Current activeGuideType:', this.activeGuideType);
                                console.log('Current activeTab:', this.activeTab);
                                
                                // Ensure we're on the guides tab
                                if (this.activeTab !== 'guides') {
                                    console.log('Switching to guides tab first');
                                    this.switchTab('guides');
                                }
                                
                                // Then switch guide type
                                this.switchGuideType(guideType);
                                
                                // Force content update
                                setTimeout(() => {
                                    console.log('Forcing content refresh...');
                                    this.populateGuides();
                                }, 100);
                            }
                            
                            // Remove processing flag after delay
                            setTimeout(() => {
                                btn.removeAttribute('data-processing');
                            }, 500);
                        }
                    };
                    
                    // Handle both click and touch events for mobile
                    document.addEventListener('click', handleGuideNavigation.bind(this));
                    document.addEventListener('touchend', handleGuideNavigation.bind(this));

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
                        // Position dropdown safely within viewport
                        this.positionDropdownSafely(dropdown, toggle);
                        dropdown.classList.add('active');
                        toggle.classList.add('active');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                }
            }
            
            // Ensure dropdown stays within viewport bounds
            positionDropdownSafely(dropdown, toggle) {
                try {
                    const toggleRect = toggle.getBoundingClientRect();
                    const dropdownWidth = 320; // Default width
                    const viewportWidth = window.innerWidth;
                    const margin = 16; // Minimum margin from edge
                    
                    // Reset any custom positioning
                    dropdown.style.left = '';
                    dropdown.style.right = '0';
                    
                    // Check if dropdown would go off-screen to the right
                    if (toggleRect.right - dropdownWidth < margin) {
                        // Position from left edge instead
                        dropdown.style.right = '';
                        dropdown.style.left = `${Math.max(margin, toggleRect.left)}px`;
                        dropdown.style.position = 'fixed';
                        dropdown.style.top = `${toggleRect.bottom + 8}px`;
                    } else if (toggleRect.left + dropdownWidth > viewportWidth - margin) {
                        // Position from right edge but constrained
                        dropdown.style.right = `${Math.max(margin, viewportWidth - toggleRect.right)}px`;
                    }
                } catch (error) {
                    console.error('Dropdown positioning error:', error);
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
                    console.log('=== GUIDE TYPE SWITCH START ===');
                    console.log('Switching to guide type:', guideType);
                    console.log('Current activeGuideType:', this.activeGuideType);
                    this.activeGuideType = guideType;
                    
                    // Update guide navigation buttons with improved error handling
                    const allBtns = document.querySelectorAll('.guide-nav-btn');
                    console.log('Found guide nav buttons:', allBtns.length);
                    if (allBtns.length === 0) {
                        console.warn('No guide navigation buttons found in DOM');
                        return;
                    }
                    
                    allBtns.forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-selected', 'false');
                    });
                    
                    const activeBtn = document.querySelector(`[data-guide-type="${guideType}"]`);
                    if (activeBtn) {
                        activeBtn.classList.add('active');
                        activeBtn.setAttribute('aria-selected', 'true');
                        console.log('Updated active button for:', guideType);
                    } else {
                        console.warn('Could not find button for guide type:', guideType);
                        console.log('Available buttons:', allBtns);
                    }
                    
                    // Always update guides content regardless of active tab
                    this.populateGuides();
                    
                    this.saveSettings();
                    
                } catch (error) {
                    console.error('Guide type switch error:', error);
                    this.handleError('Failed to switch guide type', error);
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
                    const serverTime = this.getServerTime();
                    const localTime = new Date();
                    const displayTime = this.useLocalTime ? localTime : serverTime;
                    const displayTimeString = this.useLocalTime ? 
                        localTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) :
                        serverTime.toUTCString().slice(17, 25);
                    
                    // Legacy server time display
                    const timeElement = document.getElementById('server-time');
                    if (timeElement) {
                        timeElement.textContent = displayTimeString;
                    }

                    // Enhanced time displays for main cards
                    const currentDisplayTime = document.getElementById('current-display-time');
                    if (currentDisplayTime) {
                        const label = this.useLocalTime ? 'Local Time' : 'Your Time';
                        currentDisplayTime.textContent = `${displayTimeString} (${label})`;
                    }

                    const serverDisplayTime = document.getElementById('server-display-time');
                    if (serverDisplayTime) {
                        const serverLabel = this.useLocalTime ? 'Server Time' : 'Server Time';
                        const serverDisplay = this.useLocalTime ? 
                            serverTime.toUTCString().slice(17, 25) : displayTimeString;
                        serverDisplayTime.textContent = `${serverDisplay} (${serverLabel})`;
                    }

                    // Phase end time
                    const phaseEndTime = document.getElementById('phase-end-time');
                    if (phaseEndTime) {
                        const currentPhase = this.getCurrentArmsPhase();
                        const phaseEndMs = (currentPhase.hoursRemaining * 60 * 60 * 1000) + 
                                         (currentPhase.minutesRemaining * 60 * 1000);
                        const phaseEndDate = new Date(Date.now() + phaseEndMs);
                        
                        // Convert to appropriate timezone for display
                        const displayEndTime = this.useLocalTime ? phaseEndDate : 
                            new Date(phaseEndDate.getTime() + (this.timeOffset * 60 * 60 * 1000));
                        
                        phaseEndTime.textContent = displayEndTime.toLocaleTimeString('en-US', { 
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
                    nextReset.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
                    
                    // If we're already past midnight, move to next day
                    if (nextReset <= serverTime) {
                        nextReset.setUTCDate(nextReset.getUTCDate() + 1);
                    }
                    
                    // Convert to local time for display (no need for double offset adjustment)
                    const localResetTime = new Date(nextReset.getTime());
                    
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
            
            // FIXED: Initialize guides content on startup regardless of active tab
            initializeAllContent() {
                try {
                    // Always populate guides content so navigation works
                    this.populateGuides();
                    // Populate the current active tab
                    if (this.activeTab) {
                        this.populateTabContent(this.activeTab);
                    }
                } catch (error) {
                    console.error('Content initialization error:', error);
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
                    console.log('=== POPULATE GUIDES START ===');
                    console.log('Active guide type:', this.activeGuideType);
                    
                    const grid = document.getElementById('guides-content');
                    if (!grid) {
                        console.error('Guides content element not found');
                        return;
                    }
                    
                    // WORKING GUIDES SYSTEM: Complete seasonal and tips guides
                    let guides = [];
                    
                    if (this.activeGuideType === 'seasonal') {
                        // REDESIGNED SEASONAL GUIDES: Clear, actionable, user-focused
                        guides = [
                            {
                                title: "Season 1: Foundation",
                                category: "New Player (0-45 days)",
                                icon: "🌱",
                                description: "Essential first steps to build strong foundations and avoid common mistakes",
                                keyTakeaway: "Focus on learning basics, join active alliance, save resources for perfect alignments",
                                sections: [
                                    {
                                        title: "📋 Your First Week Checklist",
                                        items: [
                                            "Complete tutorial completely (don't skip anything)",
                                            "Join alliance with voice chat in your timezone",
                                            "Bookmark this VS Points tool and check daily",
                                            "Build only essential buildings (HQ, resource, army camp)"
                                        ]
                                    },
                                    {
                                        title: "⚡ VS Points Basics (Week 2-4)",
                                        items: [
                                            "NEVER use speedups outside perfect alignment windows",
                                            "Perfect alignment = 4x points (save everything for these)",
                                            "Friday Total Mobilization = easiest 4x points day",
                                            "Aim for 10,000+ VS Points weekly to help alliance"
                                        ]
                                    },
                                    {
                                        title: "🎯 Month 1 Goals",
                                        items: [
                                            "Reach HQ Level 15+ and 500k total power",
                                            "Understand all 5 Arms Race phases and timing",
                                            "Build steady resource income (farms, oil, steel)",
                                            "Choose 2-3 main heroes and focus all upgrades there"
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Season 2: Growth",
                                category: "Intermediate Player (45-120 days)",
                                icon: "📈",
                                description: "Accelerate power growth and master perfect alignment timing",
                                keyTakeaway: "Master timing, reach top 100 rankings, become alliance contributor",
                                sections: [
                                    {
                                        title: "🚀 Power Growth Strategy",
                                        items: [
                                            "Target HQ 20+ and 2M+ power by season end",
                                            "Use 100% of speedups only during 4x windows",
                                            "Focus research on military + economic trees",
                                            "Upgrade equipment systematically (not randomly)"
                                        ]
                                    },
                                    {
                                        title: "⏰ Perfect Timing Mastery",
                                        items: [
                                            "Achieve 95%+ efficiency (track with this tool)",
                                            "Plan major upgrades around alignment schedules",
                                            "Set phone alarms for high-priority windows",
                                            "Coordinate with alliance for maximum impact"
                                        ]
                                    },
                                    {
                                        title: "🏆 Competition Ready",
                                        items: [
                                            "Maintain top 100 VS Points ranking consistently",
                                            "Take leadership role in alliance activities",
                                            "Help newer players with optimization basics",
                                            "Dominate seasonal events for better rewards"
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Season 3: Competition",
                                category: "Advanced Player (120+ days)",
                                icon: "⚔️",
                                description: "Server dominance through advanced tactics and alliance leadership",
                                keyTakeaway: "Lead server strategies, top 50 rankings, advanced resource management",
                                sections: [
                                    {
                                        title: "👑 Server Dominance",
                                        items: [
                                            "Achieve HQ 25+ and 5M+ power minimum",
                                            "Secure top 50 server ranking consistently",
                                            "Lead or co-lead top 5 alliance on server",
                                            "Influence server-wide strategic decisions"
                                        ]
                                    },
                                    {
                                        title: "💎 Advanced Resource Strategy",
                                        items: [
                                            "Master diamond spending for maximum ROI",
                                            "Coordinate multi-alliance campaigns",
                                            "Perfect alignment efficiency (98%+ activities)",
                                            "Develop predictive event planning"
                                        ]
                                    },
                                    {
                                        title: "🎖️ Elite Performance",
                                        items: [
                                            "Target #1 rankings in major seasonal events",
                                            "Mentor alliance members in advanced tactics",
                                            "Dominate world map conflicts and PvP",
                                            "Create innovative meta strategies"
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Season 4: Mastery",
                                category: "Expert Player (200+ days)",
                                icon: "👑",
                                description: "Veteran-level optimization and community leadership",
                                keyTakeaway: "Server legend status, innovation leadership, community building",
                                sections: [
                                    {
                                        title: "🏛️ Legend Status",
                                        items: [
                                            "Achieve HQ 30+ and 10M+ power milestone",
                                            "Maintain top 10 ranking across all metrics",
                                            "Attain server-wide recognition and respect",
                                            "Influence game development through feedback"
                                        ]
                                    },
                                    {
                                        title: "🧠 Innovation Leadership",
                                        items: [
                                            "Develop new meta strategies for community",
                                            "Create and share optimization tools",
                                            "Guide multiple server communities",
                                            "Establish mentorship programs"
                                        ]
                                    },
                                    {
                                        title: "📊 Data-Driven Excellence",
                                        items: [
                                            "Track and optimize every activity with data",
                                            "Perfect resource investment ROI strategies",
                                            "Predict and prepare for upcoming events",
                                            "Foster positive server culture and growth"
                                        ]
                                    }
                                ]
                            }
                        ];
                    } else {
                        // REDESIGNED GENERAL TIPS: Clear, actionable, what users need most
                        guides = [
                            {
                                title: "VS Points Quick Start",
                                category: "Essential Knowledge",
                                icon: "🚀",
                                description: "The most important things every player needs to know",
                                keyTakeaway: "Save speedups for 4x point windows, use this tool daily, Friday is best",
                                sections: [
                                    {
                                        title: "⚡ 4x Points Formula (MEMORIZE THIS)",
                                        items: [
                                            "Perfect Alignment = Arms Race phase + VS Day = 4x points",
                                            "Friday Total Mobilization = 4x points with ANY phase",
                                            "NEVER use speedups outside these windows",
                                            "Check this tool daily for upcoming 4x windows"
                                        ]
                                    },
                                    {
                                        title: "📅 Weekly Schedule (Know Your Days)",
                                        items: [
                                            "Monday: Radar Training (drone activities)",
                                            "Tuesday: Base Expansion (construction)",
                                            "Wednesday: Age of Science (research)",
                                            "Thursday: Train Heroes (hero activities)",
                                            "Friday: Total Mobilization (ALL activities)",
                                            "Saturday: Enemy Buster (military training)"
                                        ]
                                    },
                                    {
                                        title: "🎯 Best Perfect Alignments",
                                        items: [
                                            "Wednesday 8am-12pm: Tech Research + Age of Science",
                                            "Tuesday 12am-4am: City Building + Base Expansion", 
                                            "Thursday 4pm-8pm: Hero Advancement + Train Heroes",
                                            "Friday ANY TIME: Total Mobilization works with everything"
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Resource Strategy",
                                category: "Smart Spending",
                                icon: "💎",
                                description: "How to spend resources efficiently for maximum returns",
                                keyTakeaway: "Hoard for perfect windows, use VIP store, diamonds work everywhere",
                                sections: [
                                    {
                                        title: "💰 Smart Spending Rules",
                                        items: [
                                            "VIP Store = 30-50% better value than regular store",
                                            "Diamond purchases count for points in ALL phases",
                                            "Save ALL speedups for 4x point windows only",
                                            "Emergency rule: Only spend if you're falling behind alliance"
                                        ]
                                    },
                                    {
                                        title: "📦 What to Save vs Use",
                                        items: [
                                            "SAVE: All speedups, legendary items, premium resources",
                                            "USE ANYTIME: Basic materials, free items with timers",
                                            "COORDINATE: Big purchases with alliance events",
                                            "PLAN: Major upgrades around alignment schedules"
                                        ]
                                    },
                                    {
                                        title: "⏰ Timing Your Big Moves",
                                        items: [
                                            "Major building upgrades: City Building + Base Expansion",
                                            "Research projects: Tech Research + Age of Science",
                                            "Hero recruitment: Hero Advancement + Train Heroes",
                                            "Equipment upgrades: Friday Total Mobilization"
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Building Priority",
                                category: "Power Growth",
                                icon: "🏗️",
                                description: "Which buildings to upgrade first for fastest progression",
                                keyTakeaway: "HQ first always, then resource buildings, then military",
                                sections: [
                                    {
                                        title: "🎯 Must-Upgrade First (Priority Order)",
                                        items: [
                                            "1. Headquarters (unlocks everything else)",
                                            "2. Resource buildings (steady income)",
                                            "3. Army Camp (bigger armies)",
                                            "4. Research Institute (technology tree)"
                                        ]
                                    },
                                    {
                                        title: "⚡ Construction Strategy",
                                        items: [
                                            "Queue multiple upgrades during City Building phase",
                                            "Gather materials before perfect alignment windows",
                                            "Use construction speedups ONLY during 4x periods",
                                            "Focus on power-generating buildings first"
                                        ]
                                    },
                                    {
                                        title: "🚫 Common Building Mistakes",
                                        items: [
                                            "Don't build decorative buildings early",
                                            "Don't upgrade everything equally (focus priorities)",
                                            "Don't use speedups outside alignment windows",
                                            "Don't neglect resource production buildings"
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Alliance Success",
                                category: "Team Play",
                                icon: "🤝",
                                description: "How to find great alliances and be a valuable member",
                                keyTakeaway: "Active timezone alliance, contribute consistently, coordinate timing",
                                sections: [
                                    {
                                        title: "🏆 Finding the Right Alliance",
                                        items: [
                                            "Same timezone (can coordinate during events)",
                                            "Active voice chat or Discord server",
                                            "Reasonable VS Points requirements (not too high/low)",
                                            "Helpful, experienced members willing to teach"
                                        ]
                                    },
                                    {
                                        title: "🤝 Being a Great Alliance Member",
                                        items: [
                                            "Contribute VS Points consistently (even small amounts help)",
                                            "Coordinate major activities with alliance timing",
                                            "Share optimization tips and strategies",
                                            "Help newer members learn the basics"
                                        ]
                                    },
                                    {
                                        title: "⚡ Alliance Coordination",
                                        items: [
                                            "Plan big upgrades during same alignment windows",
                                            "Share resource donations during events",
                                            "Coordinate research and building timings",
                                            "Work together on seasonal competitions"
                                        ]
                                    }
                                ]
                            }
                        ];
                    }
                    
                    // Generate functional HTML with proper scrolling
                    const html = guides.map((guide, index) => `
                        <div class="priority-window-card guide-card" data-guide-index="${index}">
                            <div class="guide-header" onclick="window.lastWarNexus.toggleGuideExpansion(${index})" role="button" tabindex="0">
                                <div class="guide-main-info">
                                    <div class="guide-icon">${guide.icon}</div>
                                    <div class="guide-details">
                                        <h3 class="guide-title">${guide.title}</h3>
                                        <div class="guide-category">${guide.category}</div>
                                        <p class="guide-description">${guide.description}</p>
                                        ${guide.keyTakeaway ? `<div class="guide-takeaway">💡 <strong>Key Point:</strong> ${guide.keyTakeaway}</div>` : ''}
                                    </div>
                                </div>
                                <button class="guide-toggle-btn" id="guide-toggle-${index}" aria-label="Toggle guide sections">
                                    <span class="guide-toggle-icon">▼</span>
                                </button>
                            </div>
                            <div class="guide-content" id="guide-content-${index}" style="display: none;">
                                ${guide.sections.map((section, sIndex) => `
                                    <div class="guide-section">
                                        <h4 class="guide-section-title">${section.title}</h4>
                                        <ul class="guide-section-list">
                                            ${section.items.map(item => `
                                                <li class="guide-section-item">${item}</li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('');
                    
                    // Clear loading message and set content
                    grid.innerHTML = html;
                    console.log('=== GUIDES POPULATED SUCCESSFULLY ===');
                    console.log('Total guides rendered:', guides.length);
                    
                } catch (error) {
                    console.error('Guides population error:', error);
                    const grid = document.getElementById('guides-content');
                    if (grid) {
                        grid.innerHTML = '<div class="error-message">Failed to load guides. Please refresh the page.</div>';
                    }
                }
            }

            // WORKING: Guide expansion functionality
            toggleGuideExpansion(index) {
                try {
                    console.log('=== TOGGLE GUIDE ===');
                    console.log('Index:', index);
                    
                    const content = document.getElementById(`guide-content-${index}`);
                    const toggleBtn = document.getElementById(`guide-toggle-${index}`);
                    const toggleIcon = toggleBtn ? toggleBtn.querySelector('.guide-toggle-icon') : null;
                    const card = document.querySelector(`[data-guide-index="${index}"]`);
                    
                    if (content && toggleIcon && card) {
                        const isExpanded = content.style.display === 'block';
                        console.log('Currently expanded:', isExpanded);
                        
                        // Close all other guides first (accordion behavior)
                        document.querySelectorAll('.guide-card').forEach((otherCard, otherIndex) => {
                            if (otherIndex !== parseInt(index)) {
                                const otherContent = document.getElementById(`guide-content-${otherIndex}`);
                                const otherIcon = document.getElementById(`guide-toggle-${otherIndex}`)?.querySelector('.guide-toggle-icon');
                                if (otherContent) {
                                    otherContent.style.display = 'none';
                                    otherCard.classList.remove('expanded');
                                }
                                if (otherIcon) {
                                    otherIcon.textContent = '▼';
                                }
                            }
                        });
                        
                        if (isExpanded) {
                            // Collapse this guide
                            content.style.display = 'none';
                            card.classList.remove('expanded');
                            toggleIcon.textContent = '▼';
                            console.log('Guide collapsed');
                        } else {
                            // Expand this guide
                            content.style.display = 'block';
                            card.classList.add('expanded');
                            toggleIcon.textContent = '▲';
                            console.log('Guide expanded');
                            
                            // Scroll to guide with proper spacing
                            setTimeout(() => {
                                const headerHeight = 80; // Account for fixed header
                                const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
                                const scrollTarget = cardTop - headerHeight;
                                
                                window.scrollTo({
                                    top: scrollTarget,
                                    behavior: 'smooth'
                                });
                            }, 100);
                        }
                    } else {
                        console.error('Missing guide elements for index:', index);
                        console.error('Available content elements:', document.querySelectorAll('[id^="guide-content-"]').length);
                        console.error('Available toggle buttons:', document.querySelectorAll('[id^="guide-toggle-"]').length);
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
                        this.useLocalTime = settings.useLocalTime !== undefined ? settings.useLocalTime : true;
                        
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
                        nextPhaseOverride: this.nextPhaseOverride,
                        useLocalTime: this.useLocalTime
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
                    if (this.countdownInterval) {
                        clearInterval(this.countdownInterval);
                    }
                    
                    // Update immediately
                    this.updateAllDisplays();
                    
                    // Set up regular updates every 5 seconds (more efficient)
                    this.updateInterval = setInterval(() => {
                        if (this.isVisible) {
                            this.updateAllDisplays();
                        }
                    }, 5000);
                    
                    // Set up countdown updates every second for time-sensitive elements
                    this.countdownInterval = setInterval(() => {
                        if (this.isVisible) {
                            this.updateCountdowns();
                        }
                    }, 1000);
                } catch (error) {
                    console.error('Update loop error:', error);
                    this.handleError('Failed to start update loop', error);
                }
            }
            
            updateCountdowns() {
                try {
                    // Update only time-sensitive countdown elements efficiently
                    const countdownElement = document.getElementById('countdown-timer');
                    const priorityCountdown = document.getElementById('priority-countdown');
                    const timeUntilReset = document.getElementById('time-until-reset');
                    
                    if (countdownElement || priorityCountdown || timeUntilReset) {
                        const now = this.useLocalTime ? new Date() : this.getServerTime();
                        
                        // Update only countdown displays without full refresh
                        this.updateTimeDisplays(now);
                    }
                } catch (error) {
                    console.error('Countdown update error:', error);
                }
            }

            handleError(message, error = null) {
                console.error('Application error:', message, error);
                
                // Show user-friendly error message
                this.showErrorMessage(message);
            }
            
            showErrorMessage(message) {
                try {
                    // Create or update error notification
                    let errorContainer = document.getElementById('error-notification');
                    if (!errorContainer) {
                        errorContainer = document.createElement('div');
                        errorContainer.id = 'error-notification';
                        errorContainer.className = 'error-notification';
                        document.body.appendChild(errorContainer);
                    }
                    
                    errorContainer.innerHTML = `
                        <div class="error-content">
                            <span class="error-icon" aria-hidden="true">⚠️</span>
                            <span class="error-message">${message}</span>
                            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
                        </div>
                    `;
                    
                    errorContainer.style.display = 'block';
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        if (errorContainer && errorContainer.parentNode) {
                            errorContainer.remove();
                        }
                    }, 5000);
                } catch (error) {
                    console.error('Failed to show error message:', error);
                }
            }
            
            showLoadingState(element, message = 'Loading...') {
                if (element) {
                    element.innerHTML = `
                        <div class="loading-state">
                            <span class="loading-spinner" aria-hidden="true"></span>
                            <span class="loading-text">${message}</span>
                        </div>
                    `;
                }
            }

            destroy() {
                try {
                    if (this.updateInterval) {
                        clearInterval(this.updateInterval);
                    }
                    if (this.countdownInterval) {
                        clearInterval(this.countdownInterval);
                    }
                    if (this.setupTimeInterval) {
                        clearInterval(this.setupTimeInterval);
                    }
                    
                    // Clean up error notifications
                    const errorNotifications = document.querySelectorAll('.error-notification');
                    errorNotifications.forEach(notification => notification.remove());
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
                // Remove duplicate toggleGuideExpansion definition

                // Add banner toggle function
                window.lastWarNexus.toggleBanner = app.toggleBanner.bind(app);
                
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
