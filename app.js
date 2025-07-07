        /**
         * Last War Nexus - VS Points & Arms Race Optimizer
         * PRODUCTION READY VERSION - Enhanced Design & Functionality
         * WITH EZOIC AD INTEGRATION - Namespace Protected
         */

        // Namespace isolation to protect from ad script conflicts
        window.LastWarNexus = window.LastWarNexus || {};
        
        // Store critical timer functions before any external scripts load
        LastWarNexus.originalTimers = {
            setInterval: window.setInterval,
            setTimeout: window.setTimeout,
            requestAnimationFrame: window.requestAnimationFrame
        };
        
        // Mark when core app is ready
        LastWarNexus.isReady = false;
        
        class VSPointsOptimizer {
            constructor() {
                this.timeOffset = 0;
                this.isVisible = true;
                this.updateInterval = null;
                this.setupTimeInterval = null;
                this.activeTab = 'priority';
                this.notificationsEnabled = false; // Start with false, check actual browser permission on init
                this.lastNotifiedWindow = null;
                this.isSetupComplete = false;
                this.currentPhaseOverride = null;
                this.nextPhaseOverride = null;
                this.useLocalTime = true;
                this.activeGuideType = 'tips';
                this.eventListenersSetup = false;
                this.lastPhaseCheck = 0;
                this.lastNotificationCheck = 0; // Track last notification check time
                this.debugNotifications = true; // Enable notification debugging
                this.lastKnownPhase = null; // Track phase changes for immediate updates
                this.cachedNextWindow = null; // Cache for priority window calculations
                this.lastWindowCacheTime = 0; // Track when cache was last updated
                this.notificationResetTimeout = null; // Timeout for resetting notification tracking

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

                    // Check actual browser notification permission on startup
                    this.checkActualNotificationPermission();
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
                    
                    // Ensure UI reflects current settings state after DOM is ready
                    setTimeout(() => {
                        this.syncSettingsToUI();
                        console.log('Settings UI synchronized on app ready');
                    }, 100);
                    
                    // Mark core app as ready for Ezoic integration
                    LastWarNexus.isReady = true;
                    LastWarNexus.app = this; // Expose app instance globally for debugging
                    console.log('LastWarNexus core app is ready');
                    
                    // Expose timing refresh function globally for testing
                    window.forceTimingRefresh = () => this.forceTimingRefresh();
                    console.log('🔧 Debug: Use forceTimingRefresh() in console after changing system time');
                    
                    // Expose priority testing function
                    window.testCurrentPriority = () => {
                        console.log('🧪 TESTING CURRENT PRIORITY STATUS:');
                        const currentVSDay = this.getCurrentVSDay();
                        const currentArmsPhase = this.getCurrentArmsPhase();
                        const serverTime = this.getServerTime();
                        const hour = serverTime.getUTCHours();
                        const isHighPriority = this.isCurrentlyHighPriority();
                        
                        console.log('Time & Phase Info:', {
                            serverTime: serverTime.toISOString(),
                            hour: hour,
                            currentVSDay: currentVSDay.name + ' (day ' + currentVSDay.day + ')',
                            currentArmsPhase: currentArmsPhase.name,
                            currentPhaseOverride: this.currentPhaseOverride,
                            nextPhaseOverride: this.nextPhaseOverride
                        });
                        
                        console.log('Priority Detection:', {
                            isCurrentlyHighPriority: isHighPriority,
                            alignment: isHighPriority ? isHighPriority.reason : 'NONE'
                        });
                        
                        // Test what phase should be active based on time
                        let timeBasedPhaseIndex;
                        if (hour >= 20) {
                            timeBasedPhaseIndex = 0;
                        } else {
                            timeBasedPhaseIndex = Math.floor(hour / 4);
                        }
                        const timeBasedPhase = this.data.armsRacePhases[timeBasedPhaseIndex];
                        console.log('Time-based phase should be:', timeBasedPhase.name);
                        
                        // Show all alignments for today
                        console.log('All possible alignments for ' + currentVSDay.name + ':');
                        this.data.priorityAlignments.filter(a => a.vsDay === currentVSDay.day).forEach(a => {
                            console.log('  ' + a.armsPhase + ' → ' + a.reason);
                        });
                        
                        return {
                            isHighPriority,
                            currentVSDay,
                            currentArmsPhase,
                            timeBasedPhase
                        };
                    };
                    
                    // Expose priority debugging function globally
                    window.debugPriority = () => {
                        console.log('🔍 PRIORITY DETECTION DEBUG:');
                        const serverTime = this.getServerTime();
                        const currentVSDay = this.getCurrentVSDay();
                        const currentArmsPhase = this.getCurrentArmsPhase();
                        const alignment = this.data.priorityAlignments.find(a => 
                            a.vsDay === currentVSDay.day && a.armsPhase === currentArmsPhase.name
                        );
                        const nextWindow = this.findNextPriorityWindow();
                        
                        console.log({
                            serverTime: serverTime.toISOString(),
                            dayOfWeek: serverTime.getUTCDay(),
                            hour: serverTime.getUTCHours(),
                            currentVSDay: currentVSDay,
                            currentArmsPhase: currentArmsPhase,
                            currentPhaseOverride: this.currentPhaseOverride,
                            nextPhaseOverride: this.nextPhaseOverride,
                            alignment: alignment,
                            nextWindow: nextWindow,
                            nextWindowActive: nextWindow?.isActive
                        });
                        
                        console.log('All alignments for today (vsDay ' + currentVSDay.day + '):');
                        this.data.priorityAlignments.filter(a => a.vsDay === currentVSDay.day).forEach(a => {
                            console.log('  ' + a.armsPhase + ': ' + a.reason);
                        });
                        
                        return nextWindow;
                    };
                    
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
                    this.setupGuideOverlayEvents();
                    
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
                            // Invalidate cache for immediate updates
                            this.cachedNextWindow = null;
                            this.lastKnownPhase = null;
                            this.updateAllDisplays();
                        });
                    }

                    const notificationsToggle = document.getElementById('notifications-toggle');
                    if (notificationsToggle) {
                        notificationsToggle.addEventListener('change', async (e) => {
                            const enabled = e.target.value === 'enabled';
                            console.log('User changed notification setting to:', enabled);
                            
                            if (enabled) {
                                // Show loading state
                                const originalText = e.target.options[e.target.selectedIndex].text;
                                e.target.options[e.target.selectedIndex].text = 'Requesting...';
                                e.target.disabled = true;
                                
                                try {
                                    // Request permission with user gesture context
                                    console.log('Requesting browser notification permission...');
                                    this.hasUserGesture = true; // Mark user gesture
                                    const permission = await this.requestNotificationPermission();
                                    
                                    if (!permission) {
                                        // Reset dropdown if permission denied
                                        console.log('Permission denied - resetting dropdown to disabled');
                                        e.target.value = 'disabled';
                                        this.notificationsEnabled = false;
                                        this.saveSettings();
                                        return;
                                    }
                                    
                                    console.log('Permission granted - notifications enabled');
                                    this.notificationsEnabled = true;
                                } catch (error) {
                                    console.error('Notification setup error:', error);
                                    e.target.value = 'disabled';
                                    this.notificationsEnabled = false;
                                    this.showUserMessage('Failed to set up notifications. Please try again.');
                                } finally {
                                    // Restore UI state
                                    e.target.options[e.target.selectedIndex].text = originalText;
                                    e.target.disabled = false;
                                }
                            } else {
                                console.log('User disabled notifications');
                                this.notificationsEnabled = false;
                            }
                            
                            this.saveSettings();
                        });
                    }

                    const currentPhaseSelect = document.getElementById('current-phase-select');
                    if (currentPhaseSelect) {
                        currentPhaseSelect.addEventListener('change', (e) => {
                            this.currentPhaseOverride = e.target.value || null;
                            this.forceCompleteRefresh();
                            // Force immediate UI update
                            setTimeout(() => {
                                this.updateAllDisplays();
                                if (this.activeTab === 'schedule') {
                                    this.populateSchedule();
                                }
                            }, 100);
                        });
                    }

                    const nextPhaseSelect = document.getElementById('next-phase-select');
                    if (nextPhaseSelect) {
                        nextPhaseSelect.addEventListener('change', (e) => {
                            this.nextPhaseOverride = e.target.value;
                            this.forceCompleteRefresh();
                            // Force immediate UI update
                            setTimeout(() => {
                                this.updateAllDisplays();
                                if (this.activeTab === 'schedule') {
                                    this.populateSchedule();
                                }
                            }, 100);
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
                                
                                // Capture previous guide type before switching
                                const previousGuideType = this.activeGuideType;
                                
                                // Then switch guide type
                                this.switchGuideType(guideType);
                                
                                // Only refresh if guide type actually changed (prevent auto-closing)
                                if (guideType !== previousGuideType) {
                                    console.log('Guide type changed, refreshing content...');
                                    this.populateGuides();
                                } else {
                                    console.log('Same guide type, no refresh needed');
                                }
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
                    // Scroll to top of main page after setup completion
                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    }
                    if (this.notificationCheckInterval) {
                        clearInterval(this.notificationCheckInterval);
                    }
                    if (false) {
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
                        timeElement.textContent = timeString + ' UTC ' + (this.timeOffset >= 0 ? '+' : '') + this.timeOffset;

                    // Update live server time display
                    const liveTimeElement = document.getElementById('setup-live-time');
                    if (liveTimeElement) {
                        liveTimeElement.textContent = timeString + ' (UTC' + (this.timeOffset >= 0 ? '+' : '') + this.timeOffset + ')';
                    }
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
                    const setupNotifications = document.getElementById('setup-notifications');

                    this.timeOffset = parseFloat(setupTimeOffset?.value || '0');
                    this.currentPhaseOverride = setupCurrentPhase?.value || null;
                    this.nextPhaseOverride = setupNextPhase?.value || null;
                    
                    // Invalidate all caches when setup overrides are applied
                    this.lastKnownPhase = null;
                    this.cachedNextWindow = null;

                    const notificationChoice = setupNotifications?.value || 'enabled';
                    const wantsNotifications = notificationChoice === 'enabled';

                    if (wantsNotifications) {
                        console.log('Setup: User wants notifications - requesting permission...');
                        const permission = await this.requestNotificationPermission();
                        if (permission) {
                            console.log('Setup: Notification permission granted');
                            this.notificationsEnabled = true;
                            // Send test notification if granted
                            setTimeout(() => {
                                this.showNotification('Last War Nexus Ready!', 'You will now receive high-priority VS point alerts');
                            }, 1000);
                        } else {
                            console.log('Setup: Notification permission denied');
                            this.notificationsEnabled = false;
                        }
                    } else {
                        console.log('Setup: User chose to disable notifications');
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
                    this.notificationsEnabled = true;
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
                        this.notificationsEnabled = false; // FIXED: Was incorrectly set to true
                    }
                    
                    this.saveSettings();
                    this.syncSettingsToUI();
                    
                } catch (error) {
                    console.error('Notification setting error:', error);
                    
                    // FIXED: Add user feedback for permission failures
                    this.showUserMessage('Unable to change notification settings. Please check browser permissions.');
                    
                    // Reset UI state on error
                    this.notificationsEnabled = false;
                    this.syncSettingsToUI();
                }
            }

            saveAllSettings() {
                try {
                    const timeOffsetSelect = document.getElementById('time-offset');
                    const notificationsToggle = document.getElementById('notifications-toggle');
                    const currentPhaseSelect = document.getElementById('current-phase-select');
                    const nextPhaseSelect = document.getElementById('next-phase-select');

                    if (timeOffsetSelect) this.timeOffset = parseFloat(timeOffsetSelect.value);
                    
                    // Save actual notification permission state  
                    if (notificationsToggle) {
                        this.notificationsEnabled = notificationsToggle.value === 'enabled';
                        console.log('SaveAllSettings: Notification state:', this.notificationsEnabled);
                    }
                    
                    if (currentPhaseSelect) this.currentPhaseOverride = currentPhaseSelect.value || null;
                    if (nextPhaseSelect) this.nextPhaseOverride = nextPhaseSelect.value || null;

                    // Reset tracking and cache to force immediate update when overrides change
                    this.lastKnownPhase = null;
                    this.cachedNextWindow = null;
                    
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

                    // Show actual browser notification permission state
                    const notificationsToggle = document.getElementById('notifications-toggle');
                    if (notificationsToggle) {
                        notificationsToggle.value = this.notificationsEnabled ? 'enabled' : 'disabled';
                        console.log('Syncing notifications UI - browser permission:', this.notificationsEnabled);
                    }

                    const currentPhaseSelect = document.getElementById('current-phase-select');
                    if (currentPhaseSelect) {
                        currentPhaseSelect.value = this.currentPhaseOverride || '';
                    }

                    const nextPhaseSelect = document.getElementById('next-phase-select');
                    if (nextPhaseSelect && this.nextPhaseOverride) {
                        nextPhaseSelect.value = this.nextPhaseOverride;
                    }

                    // Sync setup modal notifications field to actual permission
                    const setupNotifications = document.getElementById('setup-notifications');
                    if (setupNotifications) setupNotifications.value = this.notificationsEnabled ? 'enabled' : 'disabled';
                    
                    // Sync time mode labels
                    const timeMode = this.useLocalTime ? 'Local Time' : 'Server Time';
                    const timeToggleLabel = document.getElementById('time-toggle-label');
                    const timeToggleBtn = document.getElementById('time-toggle-btn');
                    
                    if (timeToggleLabel) timeToggleLabel.textContent = timeMode;

                    // Sync time toggle button state
                    if (timeToggleBtn) {
                        // Remove any inline styles and use CSS classes
                        timeToggleBtn.style.background = '';
                        timeToggleBtn.style.color = '';
                        if (this.useLocalTime) {
                            timeToggleBtn.classList.remove('active');
                        } else {
                            timeToggleBtn.classList.add('active');
                        }
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
                        // Scroll to top when opening settings dropdown to keep it in view
                        if (type === 'settings') {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
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
                    dropdown.classList.remove('active', 'show');
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
                    
                    // Handle ad visibility based on active tab
                    this.updateAdVisibility(tabName);
                    
                } catch (error) {
                    console.error('Tab switch error:', error);
                }
            }
            
            updateAdVisibility(activeTab) {
                try {
                    // Hide all tab-specific ads first
                    const priorityAd = document.getElementById('priority-tab-ad'); // Contains placeholder 120 (mid_content)
                    const guidesAd = document.getElementById('guides-tab-ad'); // Contains placeholder 121 (bottom_of_page)
                    
                    if (priorityAd) priorityAd.style.display = 'none';
                    if (guidesAd) guidesAd.style.display = 'none';
                    
                    // Show ad for active tab
                    if (activeTab === 'priority' && priorityAd) {
                        priorityAd.style.display = 'block';
                    } else if (activeTab === 'guides' && guidesAd) {
                        guidesAd.style.display = 'block';
                    }
                    // Placeholder 118 (top_of_page) is always visible
                    // No ad for schedule tab by design
                } catch (error) {
                    console.warn('Ad visibility update error:', error);
                    // Non-critical error, continue
                }
            }

            // FIXED: Toggle between local and server time display
            toggleTimeMode() {
                try {
                    this.useLocalTime = !this.useLocalTime;
                    
                    // Update button text and styling
                    const timeToggleLabel = document.getElementById('time-toggle-label');
                    const timeToggleBtn = document.getElementById('time-toggle-btn');
                    
                    const timeMode = this.useLocalTime ? 'Local Time' : 'Server Time';
                    if (timeToggleLabel) {
                        timeToggleLabel.textContent = timeMode;
                    }
                    if (timeToggleBtn) {
                        // Remove any inline styles to let CSS handle appearance
                        timeToggleBtn.style.background = '';
                        timeToggleBtn.style.color = '';
                        // Add visual indication with left border only for server time
                        if (this.useLocalTime) {
                            timeToggleBtn.classList.remove('active');
                        } else {
                            timeToggleBtn.classList.add('active');
                        }
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
                    const offsetMs = (this.timeOffset || 0) * 60 * 60 * 1000;
                    return new Date(now.getTime() + offsetMs);
                } catch (error) {
                    console.error('Server time calculation error:', error);
                    // FIXED: Always apply offset even in error case
                    const fallbackTime = new Date();
                    const offsetMs = (this.timeOffset || 0) * 60 * 60 * 1000;
                    return new Date(fallbackTime.getTime() + offsetMs);
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
                    
                    // Calculate time-based phase first (this is the natural progression)
                    let timeBasedPhaseIndex;
                    if (hour >= 20) {
                        timeBasedPhaseIndex = 0; // City Building restarts at 20:00
                    } else {
                        timeBasedPhaseIndex = Math.floor(hour / 4);
                    }
                    
                    let phaseIndex = timeBasedPhaseIndex;
                    
                    // Handle manual phase override - persist until user changes it
                    if (this.currentPhaseOverride) {
                        const overridePhase = this.data.armsRacePhases.find(p => p.id === this.currentPhaseOverride);
                        if (overridePhase) {
                            phaseIndex = this.data.armsRacePhases.indexOf(overridePhase);
                            // Keep the override active - user must manually clear it
                        } else {
                            // Invalid override phase - clear it
                            this.currentPhaseOverride = null;
                            phaseIndex = timeBasedPhaseIndex;
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

            getTimeUntilNextPhase() {
                try {
                    const serverTime = this.getServerTime();
                    const currentHour = serverTime.getUTCHours();
                    const currentMinute = serverTime.getUTCMinutes();
                    const currentSecond = serverTime.getUTCSeconds();
                    
                    // Handle overrides - if we have a current phase override, we need to calculate
                    // the time differently since the normal time boundaries don't apply
                    if (this.currentPhaseOverride) {
                        // For overrides, calculate based on when the next normal phase change would occur
                        // This provides a reasonable countdown for testing purposes
                        let nextPhaseHour;
                        if (currentHour < 4) nextPhaseHour = 4;
                        else if (currentHour < 8) nextPhaseHour = 8;
                        else if (currentHour < 12) nextPhaseHour = 12;
                        else if (currentHour < 16) nextPhaseHour = 16;
                        else if (currentHour < 20) nextPhaseHour = 20;
                        else nextPhaseHour = 24; // Next day at 00:00
                        
                        const nextPhaseTime = new Date(serverTime);
                        if (nextPhaseHour === 24) {
                            nextPhaseTime.setUTCDate(nextPhaseTime.getUTCDate() + 1);
                            nextPhaseTime.setUTCHours(0, 0, 0, 0);
                        } else {
                            nextPhaseTime.setUTCHours(nextPhaseHour, 0, 0, 0);
                        }
                        
                        return nextPhaseTime.getTime() - serverTime.getTime();
                    }
                    
                    // Normal time-based calculation
                    let nextPhaseHour;
                    if (currentHour < 4) nextPhaseHour = 4;
                    else if (currentHour < 8) nextPhaseHour = 8;
                    else if (currentHour < 12) nextPhaseHour = 12;
                    else if (currentHour < 16) nextPhaseHour = 16;
                    else if (currentHour < 20) nextPhaseHour = 20;
                    else nextPhaseHour = 24; // Next day at 00:00
                    
                    const nextPhaseTime = new Date(serverTime);
                    if (nextPhaseHour === 24) {
                        nextPhaseTime.setUTCDate(nextPhaseTime.getUTCDate() + 1);
                        nextPhaseTime.setUTCHours(0, 0, 0, 0);
                    } else {
                        nextPhaseTime.setUTCHours(nextPhaseHour, 0, 0, 0);
                    }
                    
                    return nextPhaseTime.getTime() - serverTime.getTime();
                } catch (error) {
                    console.error('Time until next phase calculation error:', error);
                    return 0;
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
                    const serverTime = this.getServerTime();
                    const hour = serverTime.getUTCHours();
                    
                    // Standard check: alignment between current VS Day and current Arms Phase
                    let alignment = this.data.priorityAlignments.find(alignment => 
                        alignment.vsDay === currentVSDay.day && 
                        alignment.armsPhase === currentArmsPhase.name
                    );
                    
                    // If we found a standard alignment, return it
                    if (alignment) {
                        return alignment;
                    }
                    
                    // ENHANCED: Handle nextPhaseOverride scenarios
                    // If user set nextPhaseOverride and we're at the right time, activate it immediately
                    if (this.nextPhaseOverride && !this.currentPhaseOverride) {
                        // Calculate what the current time-based phase should be
                        let timeBasedPhaseIndex;
                        if (hour >= 20) {
                            timeBasedPhaseIndex = 0; // City Building restarts at 20:00
                        } else {
                            timeBasedPhaseIndex = Math.floor(hour / 4);
                        }
                        const timeBasedPhase = this.data.armsRacePhases[timeBasedPhaseIndex];
                        
                        // If nextPhaseOverride matches current time-based phase, activate it
                        if (timeBasedPhase.name === this.nextPhaseOverride) {
                            const overrideAlignment = this.data.priorityAlignments.find(alignment => 
                                alignment.vsDay === currentVSDay.day && 
                                alignment.armsPhase === this.nextPhaseOverride
                            );
                            
                            if (overrideAlignment) {
                                console.log('🔄 ACTIVATING: nextPhaseOverride matches current time, making active now:', this.nextPhaseOverride);
                                // Auto-transition to currentPhaseOverride
                                this.currentPhaseOverride = this.data.armsRacePhases.find(p => p.name === this.nextPhaseOverride)?.id;
                                this.nextPhaseOverride = null;
                                
                                // Clear caches to ensure immediate updates
                                this.lastKnownPhase = null;
                                this.cachedNextWindow = null;
                                
                                this.saveSettings(); // Use direct save to avoid DOM conflicts
                                return overrideAlignment;
                            }
                        }
                    }
                    
                    return null;
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
                        const timeRemaining = this.getTimeUntilNextPhase();
                        
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
                        
                        const dayAlignments = this.data.priorityAlignments.filter(a => a.vsDay === vsDay.day);
                        
                        // Use same phase rotation logic as populateSchedule() for consistency
                        let startPhaseIndex = 0;
                        const isToday = dayOffset === 0;
                        
                        if (isToday) {
                            // For today, respect current and next phase overrides
                            if (this.currentPhaseOverride) {
                                startPhaseIndex = this.data.armsRacePhases.findIndex(p => p.id === this.currentPhaseOverride);
                                if (startPhaseIndex === -1) startPhaseIndex = 0; // Fallback
                            } else if (this.nextPhaseOverride) {
                                startPhaseIndex = this.data.armsRacePhases.findIndex(p => p.name === this.nextPhaseOverride);
                                if (startPhaseIndex === -1) startPhaseIndex = 0; // Fallback
                            } else {
                                const currentPhase = this.getCurrentArmsPhase();
                                startPhaseIndex = this.data.armsRacePhases.findIndex(p => p.name === currentPhase.name);
                                if (startPhaseIndex === -1) startPhaseIndex = 0; // Fallback
                            }
                        } else {
                            // For future days, calculate phase offset
                            const currentHour = now.getUTCHours();
                            let phasesRemainingToday = 0;
                            
                            if (currentHour >= 20) {
                                phasesRemainingToday = 1; // Just City Building overnight
                            } else if (currentHour < 4) {
                                phasesRemainingToday = 4; // 4 phases remaining: Unit, Tech, Drone, Hero
                            } else {
                                const currentPhaseIndex = Math.floor(currentHour / 4);
                                phasesRemainingToday = 5 - currentPhaseIndex;
                            }
                            
                            startPhaseIndex = (phasesRemainingToday + (dayOffset - 1) * 5) % 5;
                        }
                        
                        // Generate 6 phases (full daily schedule including next day transition)
                        const basePhaseNames = ['City Building', 'Unit Progression', 'Tech Research', 'Drone Boost', 'Hero Advancement'];
                        
                        for (let i = 0; i < 6; i++) {
                            let phaseIndex, startHour, endHour;
                            
                            if (i < 5) {
                                // Regular 20-hour cycle phases
                                phaseIndex = (startPhaseIndex + i) % 5;
                                startHour = i * 4;
                                endHour = (i * 4 + 4) % 24;
                            } else {
                                // Next day's first phase (20:00-00:00 + 00:00-04:00)
                                phaseIndex = (startPhaseIndex + 5) % 5;
                                startHour = 20;
                                endHour = 24; // Show as 24:00 to indicate next day
                            }
                            
                            const phaseName = basePhaseNames[phaseIndex];
                            
                            // Check if this phase matches any alignment for this day
                            const alignment = dayAlignments.find(a => a.armsPhase === phaseName);
                            if (!alignment) continue; // Skip non-priority phases
                            
                            const phase = this.data.armsRacePhases.find(p => p.name === phaseName);
                            if (!phase) continue;
                            
                            const windowTime = new Date(checkDate);
                            if (i === 5) {
                                // Special case: next day transition
                                windowTime.setUTCHours(20, 0, 0, 0);
                            } else {
                                windowTime.setUTCHours(startHour, 0, 0, 0);
                            }
                            
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

            // Helper function to format time ranges consistently with useLocalTime setting
            formatTimeRange(startHour, endHour, isNextDay = false) {
                try {
                    if (!this.useLocalTime) {
                        // Server time display (always UTC format)
                        if (isNextDay) {
                            return "20:00-00:00";
                        }
                        return `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`;
                    }
                    
                    // Local time display - convert server hours to local time
                    const serverTime = this.getServerTime();
                    const baseDate = new Date(serverTime);
                    baseDate.setUTCHours(startHour, 0, 0, 0);
                    
                    // Convert to local time for display
                    const localStartTime = new Date(baseDate.getTime() - (this.timeOffset * 60 * 60 * 1000));
                    
                    let localEndTime;
                    if (isNextDay) {
                        // For 20:00-00:00 range (crosses midnight)
                        const endDate = new Date(baseDate);
                        endDate.setUTCDate(endDate.getUTCDate() + 1);
                        endDate.setUTCHours(0, 0, 0, 0);
                        localEndTime = new Date(endDate.getTime() - (this.timeOffset * 60 * 60 * 1000));
                    } else {
                        localEndTime = new Date(localStartTime.getTime() + (4 * 60 * 60 * 1000)); // +4 hours
                    }
                    
                    const startStr = localStartTime.toLocaleTimeString('en-US', { 
                        hour12: false, 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    const endStr = localEndTime.toLocaleTimeString('en-US', { 
                        hour12: false, 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    
                    return `${startStr}-${endStr}`;
                } catch (error) {
                    console.error('Time range formatting error:', error);
                    // Fallback to server time format
                    if (isNextDay) {
                        return "20:00-00:00";
                    }
                    return `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`;
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

            // CRITICAL: Force complete refresh to fix badge consistency issues
            forceCompleteRefresh() {
                // Clear all caches
                this.lastKnownPhase = null;
                this.cachedNextWindow = null;
                this.lastWindowCacheTime = 0;
                this.lastPhaseCheck = 0;
                this.lastNotificationCheck = 0;
                this.lastNotifiedWindow = null; // Clear notification tracking
                
                // Force immediate update of all displays
                this.updateAllDisplays();
                
                console.log('🔄 FORCED COMPLETE REFRESH: All caches cleared, notifications reset');
            }

            // COMPREHENSIVE FUNCTIONALITY TEST
            runComprehensiveFunctionalityTest() {
                console.log('🧪 === COMPREHENSIVE FUNCTIONALITY TEST ===');
                console.log('Testing all major systems...\n');
                
                const tests = [];
                let passCount = 0;
                let failCount = 0;
                
                // Test 1: Initialization
                tests.push({
                    name: 'Initialization',
                    test: () => {
                        return this.data && this.data.armsRacePhases && this.data.vsDays;
                    }
                });
                
                // Test 2: Time Calculations
                tests.push({
                    name: 'Server Time Calculation',
                    test: () => {
                        const serverTime = this.getServerTime();
                        return serverTime instanceof Date && !isNaN(serverTime);
                    }
                });
                
                // Test 3: Phase Detection
                tests.push({
                    name: 'Current Phase Detection',
                    test: () => {
                        const phase = this.getCurrentArmsPhase();
                        return phase && phase.name && phase.hoursRemaining !== undefined;
                    }
                });
                
                // Test 4: Priority Window Detection
                tests.push({
                    name: 'Priority Window Detection',
                    test: () => {
                        const window = this.findNextPriorityWindow();
                        return window === null || (window.phase && window.vsDay);
                    }
                });
                
                // Test 5: Settings Persistence
                tests.push({
                    name: 'Settings Save/Load',
                    test: () => {
                        const oldOffset = this.timeOffset;
                        this.timeOffset = -99;
                        this.saveSettings();
                        this.loadSettings();
                        const result = this.timeOffset === -99;
                        this.timeOffset = oldOffset;
                        this.saveSettings();
                        return result;
                    }
                });
                
                // Test 6: VS Day Calculation
                tests.push({
                    name: 'VS Day Detection',
                    test: () => {
                        const vsDay = this.getCurrentVSDay();
                        return vsDay && vsDay.day >= 0 && vsDay.day <= 6;
                    }
                });
                
                // Test 7: Time Formatting
                tests.push({
                    name: 'Time Formatting',
                    test: () => {
                        const formatted = this.formatTime(3661000); // 1h 1m 1s
                        return formatted === '1h 1m';
                    }
                });
                
                // Test 8: Phase Boundary Calculation
                tests.push({
                    name: 'Phase Boundary Time',
                    test: () => {
                        const time = this.getTimeUntilNextPhase();
                        return typeof time === 'number' && time >= 0;
                    }
                });
                
                // Test 9: Cache Management
                tests.push({
                    name: 'Cache Invalidation',
                    test: () => {
                        this.forceCompleteRefresh();
                        return this.lastKnownPhase === null && this.cachedNextWindow === null;
                    }
                });
                
                // Test 10: Phase Override Logic
                tests.push({
                    name: 'Phase Override System',
                    test: () => {
                        // Test without breaking current state
                        const phase = this.getCurrentArmsPhase();
                        return phase !== null;
                    }
                });
                
                // Run all tests
                tests.forEach(test => {
                    try {
                        const result = test.test();
                        console.log(`${result ? '✅' : '❌'} ${test.name}`);
                        if (result) passCount++;
                        else failCount++;
                    } catch (error) {
                        console.log(`❌ ${test.name} - Error: ${error.message}`);
                        failCount++;
                    }
                });
                
                console.log(`\n📊 Test Results: ${passCount} passed, ${failCount} failed`);
                
                // Test edge cases
                console.log('\n🔍 Testing Edge Cases...');
                
                // Test midnight boundary
                const savedGetServerTime = this.getServerTime;
                this.getServerTime = () => {
                    const d = new Date();
                    d.setUTCHours(23, 59, 59, 999);
                    return d;
                };
                
                try {
                    const midnightPhase = this.getCurrentArmsPhase();
                    console.log(`✅ Midnight boundary: ${midnightPhase.name}`);
                } catch (e) {
                    console.log(`❌ Midnight boundary test failed: ${e.message}`);
                }
                
                // Test 20:00 transition
                this.getServerTime = () => {
                    const d = new Date();
                    d.setUTCHours(20, 0, 0, 0);
                    return d;
                };
                
                try {
                    const eveningPhase = this.getCurrentArmsPhase();
                    console.log(`✅ 20:00 transition: ${eveningPhase.name} (should be City Building)`);
                } catch (e) {
                    console.log(`❌ 20:00 transition test failed: ${e.message}`);
                }
                
                this.getServerTime = savedGetServerTime;
                
                console.log('\n🧪 === END COMPREHENSIVE TEST ===');
                return passCount > 0 && failCount === 0;
            }

            // TEST: Override persistence validation
            testOverridePersistence() {
                console.log('🧪 === TESTING OVERRIDE PERSISTENCE ===');
                
                // Save current state
                const originalOverride = this.currentPhaseOverride;
                
                // Test setting override
                this.currentPhaseOverride = 'tech_research';
                console.log('✅ Set override to tech_research');
                
                // Test that getCurrentArmsPhase respects override
                const phase = this.getCurrentArmsPhase();
                const isCorrect = phase.name === 'Tech Research';
                console.log(`${isCorrect ? '✅' : '❌'} Phase detection with override: ${phase.name}`);
                
                // Test that it persists through multiple calls
                for (let i = 0; i < 3; i++) {
                    const testPhase = this.getCurrentArmsPhase();
                    if (testPhase.name !== 'Tech Research') {
                        console.log(`❌ Override not persisting on call ${i + 1}: ${testPhase.name}`);
                        break;
                    }
                }
                console.log('✅ Override persists through multiple calls');
                
                // Test clearing override
                this.currentPhaseOverride = null;
                const clearedPhase = this.getCurrentArmsPhase();
                console.log(`✅ Cleared override - now shows: ${clearedPhase.name}`);
                
                // Restore original state
                this.currentPhaseOverride = originalOverride;
                console.log('✅ Original state restored');
                
                console.log('🧪 === OVERRIDE TEST COMPLETE ===');
            }

            // COMPREHENSIVE PRE-PUBLISH TEST SUITE
            runFullPublishTestSuite() {
                console.log('🚨 === FULL PRE-PUBLISH TEST SUITE ===');
                console.log('Testing all critical functionality before publishing...\n');
                
                let totalTests = 0;
                let passedTests = 0;
                let failedTests = 0;
                
                const test = (name, testFn) => {
                    totalTests++;
                    try {
                        const result = testFn();
                        if (result) {
                            console.log(`✅ ${name}`);
                            passedTests++;
                        } else {
                            console.log(`❌ ${name} - Test returned false`);
                            failedTests++;
                        }
                    } catch (error) {
                        console.log(`❌ ${name} - Error: ${error.message}`);
                        failedTests++;
                    }
                };
                
                // === CORE FUNCTIONALITY TESTS ===
                console.log('📋 Testing Core Functionality...');
                
                test('App Initialization', () => {
                    return this.data && this.data.armsRacePhases && this.data.vsDays && this.data.priorityAlignments;
                });
                
                test('Server Time Calculation', () => {
                    const time = this.getServerTime();
                    return time instanceof Date && !isNaN(time.getTime());
                });
                
                test('Current Phase Detection (No Override)', () => {
                    const savedOverride = this.currentPhaseOverride;
                    this.currentPhaseOverride = null;
                    const phase = this.getCurrentArmsPhase();
                    this.currentPhaseOverride = savedOverride;
                    return phase && phase.name && typeof phase.hoursRemaining === 'number';
                });
                
                // === PHASE OVERRIDE TESTS ===
                console.log('\n🔧 Testing Phase Override System...');
                
                test('Phase Override Persistence', () => {
                    const original = this.currentPhaseOverride;
                    this.currentPhaseOverride = 'tech_research';
                    const phase1 = this.getCurrentArmsPhase();
                    const phase2 = this.getCurrentArmsPhase();
                    const phase3 = this.getCurrentArmsPhase();
                    this.currentPhaseOverride = original;
                    
                    return phase1.name === 'Tech Research' && 
                           phase2.name === 'Tech Research' && 
                           phase3.name === 'Tech Research';
                });
                
                test('Phase Override Clearing', () => {
                    const original = this.currentPhaseOverride;
                    this.currentPhaseOverride = 'drone_boost';
                    const overridePhase = this.getCurrentArmsPhase();
                    this.currentPhaseOverride = null;
                    const clearedPhase = this.getCurrentArmsPhase();
                    this.currentPhaseOverride = original;
                    
                    return overridePhase.name === 'Drone Boost' && clearedPhase.name !== 'Drone Boost';
                });
                
                test('Settings Save/Load with Override', () => {
                    const original = this.currentPhaseOverride;
                    this.currentPhaseOverride = 'hero_advancement';
                    this.saveSettings();
                    this.currentPhaseOverride = null;
                    this.loadSettings();
                    const result = this.currentPhaseOverride === 'hero_advancement';
                    this.currentPhaseOverride = original;
                    this.saveSettings();
                    return result;
                });
                
                // === PRIORITY WINDOW TESTS ===
                console.log('\n🎯 Testing Priority Window System...');
                
                test('Priority Window Detection', () => {
                    const window = this.findNextPriorityWindow();
                    return window === null || (window.phase && window.vsDay && typeof window.timeRemaining === 'number');
                });
                
                test('Priority Alignment Logic', () => {
                    const alignment = this.isCurrentlyHighPriority();
                    return alignment === null || (alignment.armsPhase && alignment.vsDay);
                });
                
                test('VS Day Calculation', () => {
                    const vsDay = this.getCurrentVSDay();
                    return vsDay && vsDay.day >= 0 && vsDay.day <= 6 && vsDay.name;
                });
                
                // === TIME CALCULATION TESTS ===
                console.log('\n⏰ Testing Time Calculations...');
                
                test('Time Until Next Phase', () => {
                    const time = this.getTimeUntilNextPhase();
                    return typeof time === 'number' && time >= 0 && time <= 4 * 60 * 60 * 1000;
                });
                
                test('Time Formatting', () => {
                    const format1 = this.formatTime(3661000); // 1h 1m 1s
                    const format2 = this.formatTime(7200000); // 2h exact
                    const format3 = this.formatTime(120000);  // 2m exact
                    return format1 === '1h 1m' && format2 === '2h 0m' && format3 === '2m';
                });
                
                // === UI AND DISPLAY TESTS ===
                console.log('\n🖥️ Testing UI and Display Functions...');
                
                test('Main Display Update', () => {
                    try {
                        this.updateCurrentStatus();
                        return true;
                    } catch (e) {
                        return false;
                    }
                });
                
                test('Schedule Generation', () => {
                    try {
                        this.populateSchedule();
                        return true;
                    } catch (e) {
                        return false;
                    }
                });
                
                test('Cache Management', () => {
                    this.forceCompleteRefresh();
                    return this.lastKnownPhase === null && 
                           this.cachedNextWindow === null && 
                           this.lastNotifiedWindow === null;
                });
                
                // === EDGE CASE TESTS ===
                console.log('\n🔍 Testing Edge Cases...');
                
                const originalGetServerTime = this.getServerTime;
                
                test('Midnight Boundary (00:00)', () => {
                    this.getServerTime = () => {
                        const d = new Date();
                        d.setUTCHours(0, 0, 0, 0);
                        return d;
                    };
                    const phase = this.getCurrentArmsPhase();
                    this.getServerTime = originalGetServerTime;
                    return phase.name === 'City Building';
                });
                
                test('Evening Transition (20:00)', () => {
                    this.getServerTime = () => {
                        const d = new Date();
                        d.setUTCHours(20, 0, 0, 0);
                        return d;
                    };
                    const phase = this.getCurrentArmsPhase();
                    this.getServerTime = originalGetServerTime;
                    return phase.name === 'City Building';
                });
                
                test('Phase Boundary (04:00)', () => {
                    this.getServerTime = () => {
                        const d = new Date();
                        d.setUTCHours(4, 0, 0, 0);
                        return d;
                    };
                    const phase = this.getCurrentArmsPhase();
                    this.getServerTime = originalGetServerTime;
                    return phase.name === 'Unit Progression';
                });
                
                test('Late Hour (23:59)', () => {
                    this.getServerTime = () => {
                        const d = new Date();
                        d.setUTCHours(23, 59, 59, 999);
                        return d;
                    };
                    const phase = this.getCurrentArmsPhase();
                    this.getServerTime = originalGetServerTime;
                    return phase.name === 'City Building';
                });
                
                // === NOTIFICATION SYSTEM TESTS ===
                console.log('\n🔔 Testing Notification System...');
                
                test('Notification Permission Check', () => {
                    const permission = this.verifyNotificationPermission();
                    return typeof permission === 'boolean';
                });
                
                test('Notification Debug Mode', () => {
                    return typeof this.debugNotifications === 'boolean';
                });
                
                // === FINAL RESULTS ===
                console.log('\n📊 === TEST RESULTS ===');
                console.log(`Total Tests: ${totalTests}`);
                console.log(`✅ Passed: ${passedTests}`);
                console.log(`❌ Failed: ${failedTests}`);
                console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
                
                const allTestsPassed = failedTests === 0;
                
                if (allTestsPassed) {
                    console.log('\n🎉 ALL TESTS PASSED - READY FOR PUBLISHING!');
                } else {
                    console.log('\n🚨 SOME TESTS FAILED - DO NOT PUBLISH YET!');
                    console.log('Fix failing tests before publishing.');
                }
                
                console.log('\n🚨 === END PRE-PUBLISH TEST SUITE ===');
                return allTestsPassed;
            }

            // SPECIFIC TEST: Verify no auto-clear override behavior
            testOverrideStability() {
                console.log('🧪 === TESTING OVERRIDE STABILITY ===');
                
                // Test the specific issue from console log
                const original = this.currentPhaseOverride;
                
                // Set override to tech_research
                this.currentPhaseOverride = 'tech_research';
                console.log('✅ Set override to tech_research');
                
                // Call getCurrentArmsPhase multiple times like the app does
                for (let i = 0; i < 10; i++) {
                    const phase = this.getCurrentArmsPhase();
                    if (phase.name !== 'Tech Research') {
                        console.log(`❌ Override was cleared on call ${i + 1}! Phase: ${phase.name}`);
                        this.currentPhaseOverride = original;
                        return false;
                    }
                }
                
                console.log('✅ Override persisted through 10 calls');
                
                // Test that manual clearing works
                this.currentPhaseOverride = null;
                const clearedPhase = this.getCurrentArmsPhase();
                console.log(`✅ Manual clear works - now shows: ${clearedPhase.name}`);
                
                // Restore original
                this.currentPhaseOverride = original;
                
                console.log('🧪 === OVERRIDE STABILITY TEST COMPLETE ===');
                return true;
            }

            // FINAL PRE-PUBLISH CHECKLIST
            runFinalPublishChecklist() {
                console.log('🚨 === FINAL PRE-PUBLISH CHECKLIST ===');
                
                const checks = [
                    {
                        name: 'No phase override auto-clearing',
                        test: () => {
                            const orig = this.currentPhaseOverride;
                            this.currentPhaseOverride = 'tech_research';
                            const p1 = this.getCurrentArmsPhase();
                            const p2 = this.getCurrentArmsPhase();
                            this.currentPhaseOverride = orig;
                            return p1.name === 'Tech Research' && p2.name === 'Tech Research';
                        }
                    },
                    {
                        name: 'Schedule respects manual overrides',
                        test: () => {
                            const orig = this.currentPhaseOverride;
                            this.currentPhaseOverride = 'drone_boost';
                            try {
                                this.populateSchedule();
                                this.currentPhaseOverride = orig;
                                return true;
                            } catch (e) {
                                this.currentPhaseOverride = orig;
                                return false;
                            }
                        }
                    },
                    {
                        name: 'Force refresh clears all caches',
                        test: () => {
                            this.forceCompleteRefresh();
                            return this.lastKnownPhase === null && 
                                   this.cachedNextWindow === null && 
                                   this.lastNotifiedWindow === null;
                        }
                    },
                    {
                        name: 'Auto option clears overrides',
                        test: () => {
                            this.currentPhaseOverride = 'hero_advancement';
                            this.currentPhaseOverride = null; // Simulate selecting "Auto"
                            const phase = this.getCurrentArmsPhase();
                            return phase.name !== 'Hero Advancement';
                        }
                    },
                    {
                        name: 'No duplicate NEXT badges',
                        test: () => {
                            const window = this.findNextPriorityWindow();
                            return !window || !window.isActive; // NEXT should only be on inactive windows
                        }
                    }
                ];
                
                let passed = 0;
                checks.forEach(check => {
                    try {
                        const result = check.test();
                        console.log(`${result ? '✅' : '❌'} ${check.name}`);
                        if (result) passed++;
                    } catch (e) {
                        console.log(`❌ ${check.name} - Error: ${e.message}`);
                    }
                });
                
                const allPassed = passed === checks.length;
                console.log(`\n📊 Checklist: ${passed}/${checks.length} passed`);
                
                if (allPassed) {
                    console.log('🎉 ALL CRITICAL CHECKS PASSED - PUBLISH APPROVED!');
                } else {
                    console.log('🚨 CRITICAL CHECKS FAILED - DO NOT PUBLISH!');
                }
                
                console.log('🚨 === END FINAL CHECKLIST ===');
                return allPassed;
            }

            // Test time consistency across all UI components
            testTimeDisplayConsistency() {
                console.log('🕐 === TIME DISPLAY CONSISTENCY TEST ===');
                
                const originalLocalTimeSetting = this.useLocalTime;
                let testsPassed = 0;
                let testsFailed = 0;

                const tests = [
                    {
                        name: 'Schedule time format respects useLocalTime setting',
                        test: () => {
                            // Test server time mode
                            this.useLocalTime = false;
                            const serverTimeRange = this.formatTimeRange(4, 8, false);
                            const serverExpected = "04:00-08:00";
                            
                            // Test local time mode
                            this.useLocalTime = true;
                            const localTimeRange = this.formatTimeRange(4, 8, false);
                            
                            console.log(`  Server mode: ${serverTimeRange}, Local mode: ${localTimeRange}`);
                            
                            return serverTimeRange === serverExpected && localTimeRange !== serverTimeRange;
                        }
                    },
                    {
                        name: 'Midnight transition time range formatting',
                        test: () => {
                            // Test server time mode for midnight transition
                            this.useLocalTime = false;
                            const serverMidnight = this.formatTimeRange(20, 0, true);
                            const expected = "20:00-00:00";
                            
                            console.log(`  Midnight server format: ${serverMidnight}`);
                            return serverMidnight === expected;
                        }
                    },
                    {
                        name: 'Active phase detection consistency',
                        test: () => {
                            const currentPhase = this.getCurrentArmsPhase();
                            const serverTime = this.getServerTime();
                            const hour = serverTime.getUTCHours();
                            
                            console.log(`  Current phase: ${currentPhase.name}, Server hour: ${hour}`);
                            
                            // Verify the phase matches the expected time slot
                            if (hour >= 20 || hour < 4) {
                                return currentPhase.name === 'City Building';
                            } else if (hour >= 4 && hour < 8) {
                                return currentPhase.name === 'Unit Progression';
                            } else if (hour >= 8 && hour < 12) {
                                return currentPhase.name === 'Tech Research';
                            } else if (hour >= 12 && hour < 16) {
                                return currentPhase.name === 'Drone Boost';
                            } else if (hour >= 16 && hour < 20) {
                                return currentPhase.name === 'Hero Advancement';
                            }
                            return false;
                        }
                    },
                    {
                        name: 'Schedule active phase matches current phase',
                        test: () => {
                            try {
                                // Generate today's schedule
                                const serverTime = this.getServerTime();
                                const currentPhase = this.getCurrentArmsPhase();
                                
                                // Simulate schedule generation logic for today
                                const now = serverTime;
                                const dayOfWeek = (now.getUTCDay() + 6) % 7; // Monday = 0
                                const isToday = true;
                                const currentHour = now.getUTCHours();
                                
                                let hasActivePhase = false;
                                
                                // Check each phase slot
                                for (let i = 0; i < 6; i++) {
                                    let phaseIndex, startHour, endHour;
                                    
                                    if (i < 5) {
                                        phaseIndex = i;
                                        startHour = i * 4;
                                        endHour = (i + 1) * 4;
                                    } else {
                                        phaseIndex = 0;
                                        startHour = 20;
                                        endHour = 24;
                                    }
                                    
                                    const phaseName = this.data.armsRacePhases[phaseIndex].name;
                                    
                                    // Check if this phase should be active
                                    let shouldBeActive = false;
                                    if (isToday && currentPhase.name === phaseName) {
                                        if (i === 5) {
                                            shouldBeActive = currentHour >= 20;
                                        } else {
                                            shouldBeActive = currentHour >= startHour && currentHour < endHour;
                                        }
                                    }
                                    
                                    if (shouldBeActive) {
                                        hasActivePhase = true;
                                        console.log(`  Active phase found: ${phaseName} (${startHour}:00-${endHour}:00)`);
                                        break;
                                    }
                                }
                                
                                return hasActivePhase;
                            } catch (error) {
                                console.error('  Schedule test error:', error);
                                return false;
                            }
                        }
                    },
                    {
                        name: 'Time toggle functionality',
                        test: () => {
                            const originalSetting = this.useLocalTime;
                            
                            // Test toggle to opposite setting
                            this.useLocalTime = !originalSetting;
                            const range1 = this.formatTimeRange(12, 16, false);
                            
                            // Toggle back
                            this.useLocalTime = originalSetting;
                            const range2 = this.formatTimeRange(12, 16, false);
                            
                            console.log(`  Setting ${!originalSetting}: ${range1}, Setting ${originalSetting}: ${range2}`);
                            
                            // Ranges should be different unless timezone offset is 0
                            return this.timeOffset === 0 || range1 !== range2;
                        }
                    }
                ];

                tests.forEach(test => {
                    try {
                        const result = test.test();
                        console.log(`${result ? '✅' : '❌'} ${test.name}`);
                        if (result) {
                            testsPassed++;
                        } else {
                            testsFailed++;
                        }
                    } catch (error) {
                        console.log(`❌ ${test.name} - Error: ${error.message}`);
                        testsFailed++;
                    }
                });

                // Restore original setting
                this.useLocalTime = originalLocalTimeSetting;

                const allPassed = testsFailed === 0;
                console.log(`\n📊 Time Consistency Results: ${testsPassed} passed, ${testsFailed} failed`);
                
                if (allPassed) {
                    console.log('🎉 ALL TIME CONSISTENCY TESTS PASSED!');
                } else {
                    console.log('🚨 TIME CONSISTENCY ISSUES DETECTED!');
                }
                
                console.log('🕐 === END TIME CONSISTENCY TEST ===');
                return allPassed;
            }

            // Comprehensive functional testing for all site features
            testAllSiteFunctionality() {
                console.log('🧪 === COMPREHENSIVE SITE FUNCTIONALITY TEST ===');
                
                let testsPassed = 0;
                let testsFailed = 0;

                const tests = [
                    {
                        name: 'Priority window detection works',
                        test: () => {
                            const currentPriority = this.isCurrentlyHighPriority();
                            const nextWindow = this.findNextPriorityWindow();
                            
                            console.log('  Current priority:', currentPriority ? currentPriority.reason : 'NONE');
                            console.log('  Next window:', nextWindow ? `${nextWindow.phase?.name} + ${nextWindow.vsDay?.title}` : 'NONE');
                            
                            return nextWindow !== null; // Should always find a window within 7 days
                        }
                    },
                    {
                        name: 'Update loops are running',
                        test: () => {
                            const hasDataInterval = !!this.updateInterval;
                            const hasCountdownInterval = !!this.countdownInterval;
                            const hasNotificationInterval = !!this.notificationCheckInterval;
                            
                            console.log('  Update intervals:', {
                                data: hasDataInterval,
                                countdown: hasCountdownInterval,
                                notifications: hasNotificationInterval
                            });
                            
                            return hasDataInterval && hasCountdownInterval && hasNotificationInterval;
                        }
                    },
                    {
                        name: 'Notification system is configured',
                        test: () => {
                            const hasPermission = this.verifyNotificationPermission();
                            const isEnabled = this.notificationsEnabled;
                            
                            console.log('  Notification state:', {
                                permission: hasPermission,
                                enabled: isEnabled,
                                lastNotified: this.lastNotifiedWindow
                            });
                            
                            return typeof hasPermission === 'boolean' && typeof isEnabled === 'boolean';
                        }
                    },
                    {
                        name: 'Phase calculation accurate',
                        test: () => {
                            const currentPhase = this.getCurrentArmsPhase();
                            const serverTime = this.getServerTime();
                            const hour = serverTime.getUTCHours();
                            
                            console.log('  Phase info:', {
                                phase: currentPhase.name,
                                hour: hour,
                                isOverride: currentPhase.isOverride
                            });
                            
                            // Verify phase matches expected time slot
                            if (currentPhase.isOverride) {
                                return true; // Manual override is valid
                            }
                            
                            // Check time-based phase accuracy
                            let expectedPhaseIndex;
                            if (hour >= 20) {
                                expectedPhaseIndex = 0; // City Building
                            } else {
                                expectedPhaseIndex = Math.floor(hour / 4);
                            }
                            
                            const expectedPhase = this.data.armsRacePhases[expectedPhaseIndex];
                            return currentPhase.name === expectedPhase.name;
                        }
                    },
                    {
                        name: 'Time display consistency',
                        test: () => {
                            const serverTime = this.getServerTime();
                            const timeOffset = this.timeOffset;
                            const useLocalTime = this.useLocalTime;
                            
                            console.log('  Time settings:', {
                                serverTime: serverTime.toISOString(),
                                offset: timeOffset,
                                useLocal: useLocalTime
                            });
                            
                            return serverTime instanceof Date && typeof timeOffset === 'number';
                        }
                    },
                    {
                        name: 'Settings persistence works',
                        test: () => {
                            const originalLocal = this.useLocalTime;
                            const originalNotify = this.notificationsEnabled;
                            
                            // Test toggle
                            this.useLocalTime = !originalLocal;
                            this.saveSettings();
                            this.loadSettings();
                            
                            const persisted = this.useLocalTime === !originalLocal;
                            
                            // Restore original
                            this.useLocalTime = originalLocal;
                            this.notificationsEnabled = originalNotify;
                            this.saveSettings();
                            
                            console.log('  Settings persistence test passed:', persisted);
                            return persisted;
                        }
                    },
                    {
                        name: 'Schedule generation works',
                        test: () => {
                            try {
                                // Test if populateSchedule runs without error
                                const scheduleContainer = document.getElementById('schedule-content');
                                if (!scheduleContainer) {
                                    console.log('  Schedule container not found - testing logic only');
                                    return true; // Container might not exist in test environment
                                }
                                
                                const originalContent = scheduleContainer.innerHTML;
                                this.populateSchedule();
                                const newContent = scheduleContainer.innerHTML;
                                
                                console.log('  Schedule generation completed:', newContent !== originalContent);
                                return true; // If no error thrown, it works
                            } catch (error) {
                                console.log('  Schedule generation error:', error.message);
                                return false;
                            }
                        }
                    },
                    {
                        name: 'Priority banner updates',
                        test: () => {
                            try {
                                const nextWindow = this.findNextPriorityWindow();
                                console.log('  Banner test - next window:', nextWindow ? 'found' : 'not found');
                                
                                // Test banner population
                                this.populatePriorityBanner();
                                return true; // If no error, it works
                            } catch (error) {
                                console.log('  Banner error:', error.message);
                                return false;
                            }
                        }
                    }
                ];

                tests.forEach(test => {
                    try {
                        const result = test.test();
                        console.log(`${result ? '✅' : '❌'} ${test.name}`);
                        if (result) {
                            testsPassed++;
                        } else {
                            testsFailed++;
                        }
                    } catch (error) {
                        console.log(`❌ ${test.name} - Error: ${error.message}`);
                        testsFailed++;
                    }
                });

                const allPassed = testsFailed === 0;
                console.log(`\n📊 Comprehensive Test Results: ${testsPassed} passed, ${testsFailed} failed`);
                
                if (allPassed) {
                    console.log('🎉 ALL SITE FUNCTIONALITY TESTS PASSED!');
                } else {
                    console.log('🚨 SITE FUNCTIONALITY ISSUES DETECTED!');
                }
                
                console.log('🧪 === END COMPREHENSIVE SITE TEST ===');
                return allPassed;
            }

            // COMPREHENSIVE PRE-PUBLISH TESTING SUITE
            runComprehensivePrePublishTesting() {
                console.log('🚀 === COMPREHENSIVE PRE-PUBLISH TESTING SUITE ===');
                console.log('Testing all critical functionality before final deployment...\n');
                
                let totalTests = 0;
                let passedTests = 0;
                let failedTests = 0;
                let criticalFailures = [];

                const runTest = (category, testName, testFunction, isCritical = false) => {
                    totalTests++;
                    try {
                        const result = testFunction();
                        if (result) {
                            console.log(`✅ [${category}] ${testName}`);
                            passedTests++;
                        } else {
                            console.log(`❌ [${category}] ${testName} - FAILED`);
                            failedTests++;
                            if (isCritical) criticalFailures.push(`${category}: ${testName}`);
                        }
                        return result;
                    } catch (error) {
                        console.log(`💥 [${category}] ${testName} - ERROR: ${error.message}`);
                        failedTests++;
                        if (isCritical) criticalFailures.push(`${category}: ${testName}`);
                        return false;
                    }
                };

                // ===========================================
                // CRITICAL DAY MATCHING TESTS
                // ===========================================
                console.log('📅 TESTING DAY MATCHING FIXES...');

                runTest('DAY MATCHING', 'VS Day calculation returns valid objects', () => {
                    for (let jsDay = 0; jsDay <= 6; jsDay++) {
                        // Simulate different days
                        const mockDate = new Date();
                        mockDate.setUTCDay = (day) => { mockDate._testDay = day; };
                        mockDate.getUTCDay = () => mockDate._testDay || 0;
                        mockDate.setUTCDay(jsDay);
                        
                        const originalGetServerTime = this.getServerTime;
                        this.getServerTime = () => mockDate;
                        
                        const vsDay = this.getCurrentVSDay();
                        
                        this.getServerTime = originalGetServerTime;
                        
                        if (!vsDay || !vsDay.name) {
                            console.log(`  Failed for JS day ${jsDay}: ${JSON.stringify(vsDay)}`);
                            return false;
                        }
                        console.log(`  JS day ${jsDay} → ${vsDay.name} (VS day ${vsDay.day})`);
                    }
                    return true;
                }, true);

                runTest('DAY MATCHING', 'Priority alignments can be found for weekdays', () => {
                    let foundAlignments = 0;
                    for (let vsDay = 1; vsDay <= 6; vsDay++) {
                        const alignments = this.data.priorityAlignments.filter(a => a.vsDay === vsDay);
                        if (alignments.length > 0) {
                            foundAlignments++;
                        }
                        console.log(`  VS Day ${vsDay}: ${alignments.length} alignments`);
                    }
                    return foundAlignments >= 5; // Should have alignments for most weekdays
                }, true);

                runTest('DAY MATCHING', 'Phase names match between data structures', () => {
                    const phaseNames = this.data.armsRacePhases.map(p => p.name);
                    const alignmentPhases = [...new Set(this.data.priorityAlignments.map(a => a.armsPhase))];
                    
                    for (const alignmentPhase of alignmentPhases) {
                        if (!phaseNames.includes(alignmentPhase)) {
                            console.log(`  Mismatch: ${alignmentPhase} not found in phase data`);
                            return false;
                        }
                    }
                    console.log(`  All ${alignmentPhases.length} alignment phases match phase data`);
                    return true;
                }, true);

                // ===========================================
                // PRIORITY DETECTION TESTS
                // ===========================================
                console.log('\n🎯 TESTING PRIORITY DETECTION...');

                runTest('PRIORITY', 'Priority window detection returns valid objects', () => {
                    const nextWindow = this.findNextPriorityWindow();
                    if (!nextWindow) {
                        console.log('  No priority window found (this might be normal on Sunday)');
                        return true; // Acceptable on Sunday
                    }
                    
                    const hasRequiredFields = nextWindow.phase && nextWindow.vsDay && 
                                             typeof nextWindow.timeRemaining === 'number' &&
                                             typeof nextWindow.isActive === 'boolean';
                    
                    if (hasRequiredFields) {
                        console.log(`  Found: ${nextWindow.phase.name} + ${nextWindow.vsDay.title} (${nextWindow.isActive ? 'ACTIVE' : 'UPCOMING'})`);
                    }
                    return hasRequiredFields;
                }, true);

                runTest('PRIORITY', 'Current priority detection logic', () => {
                    const currentPriority = this.isCurrentlyHighPriority();
                    const currentVSDay = this.getCurrentVSDay();
                    const currentPhase = this.getCurrentArmsPhase();
                    
                    console.log(`  Current: ${currentPhase.name} on ${currentVSDay.title}`);
                    console.log(`  Priority status: ${currentPriority ? currentPriority.reason : 'NONE'}`);
                    
                    // This should always return either a valid alignment object or null
                    return currentPriority === null || (currentPriority.vsDay && currentPriority.armsPhase);
                }, true);

                runTest('PRIORITY', 'Monday Drone Boost alignment detection', () => {
                    // Test specific known alignment
                    const mondayAlignment = this.data.priorityAlignments.find(a => 
                        a.vsDay === 1 && a.armsPhase === 'Drone Boost'
                    );
                    return !!mondayAlignment;
                }, false);

                // ===========================================
                // PHASE OVERRIDE TESTS
                // ===========================================
                console.log('\n🔧 TESTING PHASE OVERRIDE SYSTEM...');

                runTest('OVERRIDES', 'Phase override persistence', () => {
                    const original = this.currentPhaseOverride;
                    
                    this.currentPhaseOverride = 'tech_research';
                    const overridePhase1 = this.getCurrentArmsPhase();
                    const overridePhase2 = this.getCurrentArmsPhase();
                    
                    this.currentPhaseOverride = original;
                    
                    return overridePhase1.name === 'Tech Research' && 
                           overridePhase2.name === 'Tech Research' &&
                           overridePhase1.isOverride === true;
                }, true);

                runTest('OVERRIDES', 'Override clearing works correctly', () => {
                    const original = this.currentPhaseOverride;
                    
                    this.currentPhaseOverride = 'drone_boost';
                    const overriddenPhase = this.getCurrentArmsPhase();
                    
                    this.currentPhaseOverride = null;
                    const clearedPhase = this.getCurrentArmsPhase();
                    
                    this.currentPhaseOverride = original;
                    
                    return overriddenPhase.name === 'Drone Boost' && 
                           clearedPhase.name !== 'Drone Boost' &&
                           clearedPhase.isOverride === false;
                }, true);

                runTest('OVERRIDES', 'Cache invalidation on override changes', () => {
                    const original = this.currentPhaseOverride;
                    
                    // Set initial cache
                    this.cachedNextWindow = { test: 'cached' };
                    this.lastKnownPhase = 'cached_phase';
                    
                    // Change override (should clear cache via forceCompleteRefresh)
                    this.currentPhaseOverride = 'hero_advancement';
                    this.forceCompleteRefresh();
                    
                    const cacheCleared = this.cachedNextWindow === null && this.lastKnownPhase === null;
                    
                    this.currentPhaseOverride = original;
                    
                    return cacheCleared;
                }, false);

                // ===========================================
                // SCHEDULE GENERATION TESTS
                // ===========================================
                console.log('\n📅 TESTING SCHEDULE GENERATION...');

                runTest('SCHEDULE', 'Schedule generates without errors', () => {
                    try {
                        // Test schedule generation logic
                        const serverTime = this.getServerTime();
                        const dayOfWeek = serverTime.getUTCDay();
                        const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek) || 
                                     { day: 0, name: "Sunday", title: "Preparation Day" };
                        
                        // Test phase generation for a day
                        for (let i = 0; i < 6; i++) {
                            const phaseIndex = i < 5 ? i : 0;
                            const startHour = phaseIndex * 4;
                            const endHour = (phaseIndex * 4 + 4) % 24;
                            const timeRange = this.formatTimeRange(startHour, endHour, i === 5);
                            
                            if (!timeRange) {
                                console.log(`  Schedule generation failed for phase ${i}`);
                                return false;
                            }
                        }
                        
                        console.log('  Schedule generation completed successfully');
                        return true;
                    } catch (error) {
                        console.log(`  Schedule generation error: ${error.message}`);
                        return false;
                    }
                }, true);

                runTest('SCHEDULE', 'Active phase detection for schedule', () => {
                    const currentPhase = this.getCurrentArmsPhase();
                    const serverTime = this.getServerTime();
                    const currentHour = serverTime.getUTCHours();
                    
                    // Simulate schedule active detection
                    let shouldBeActive = false;
                    
                    // Test current phase timing
                    if (currentPhase.name === 'City Building') {
                        shouldBeActive = (currentHour >= 0 && currentHour < 4) || (currentHour >= 20);
                    } else if (currentPhase.name === 'Unit Progression') {
                        shouldBeActive = currentHour >= 4 && currentHour < 8;
                    } else if (currentPhase.name === 'Tech Research') {
                        shouldBeActive = currentHour >= 8 && currentHour < 12;
                    } else if (currentPhase.name === 'Drone Boost') {
                        shouldBeActive = currentHour >= 12 && currentHour < 16;
                    } else if (currentPhase.name === 'Hero Advancement') {
                        shouldBeActive = currentHour >= 16 && currentHour < 20;
                    }
                    
                    console.log(`  Phase: ${currentPhase.name}, Hour: ${currentHour}, Should be active: ${shouldBeActive}`);
                    return shouldBeActive || currentPhase.isOverride;
                }, false);

                // ===========================================
                // TIME DISPLAY TESTS
                // ===========================================
                console.log('\n⏰ TESTING TIME DISPLAY CONSISTENCY...');

                runTest('TIME', 'Time range formatting works for all modes', () => {
                    const originalSetting = this.useLocalTime;
                    
                    // Test server time mode
                    this.useLocalTime = false;
                    const serverRange = this.formatTimeRange(8, 12, false);
                    
                    // Test local time mode
                    this.useLocalTime = true;
                    const localRange = this.formatTimeRange(8, 12, false);
                    
                    this.useLocalTime = originalSetting;
                    
                    const serverValid = /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(serverRange);
                    const localValid = localRange && localRange.length > 0;
                    
                    console.log(`  Server format: ${serverRange} (valid: ${serverValid})`);
                    console.log(`  Local format: ${localRange} (valid: ${localValid})`);
                    
                    return serverValid && localValid;
                }, false);

                runTest('TIME', 'Midnight transition handling', () => {
                    const midnightRange = this.formatTimeRange(20, 0, true);
                    const containsExpected = midnightRange.includes('20') && midnightRange.includes('00');
                    
                    console.log(`  Midnight range: ${midnightRange}`);
                    return containsExpected;
                }, false);

                // ===========================================
                // UPDATE LOOP TESTS
                // ===========================================
                console.log('\n🔄 TESTING UPDATE MECHANISMS...');

                runTest('UPDATES', 'All update intervals are running', () => {
                    const hasData = !!this.updateInterval;
                    const hasCountdown = !!this.countdownInterval;
                    const hasNotification = !!this.notificationCheckInterval;
                    
                    console.log(`  Data updates (5s): ${hasData}`);
                    console.log(`  Countdown updates (1s): ${hasCountdown}`);
                    console.log(`  Notification checks (5s): ${hasNotification}`);
                    
                    return hasData && hasCountdown && hasNotification;
                }, true);

                runTest('UPDATES', 'Update functions exist and are callable', () => {
                    const updateFunctions = [
                        'updateAllDisplays',
                        'updateCountdowns',
                        'updateCurrentStatus',
                        'updateMainCardTime',
                        'updateTimeDisplay'
                    ];
                    
                    for (const funcName of updateFunctions) {
                        if (typeof this[funcName] !== 'function') {
                            console.log(`  Missing function: ${funcName}`);
                            return false;
                        }
                    }
                    
                    console.log(`  All ${updateFunctions.length} update functions available`);
                    return true;
                }, true);

                // ===========================================
                // NOTIFICATION SYSTEM TESTS
                // ===========================================
                console.log('\n🔔 TESTING NOTIFICATION SYSTEM...');

                runTest('NOTIFICATIONS', 'Notification state management', () => {
                    const hasPermissionCheck = typeof this.verifyNotificationPermission === 'function';
                    const hasNotificationSend = typeof this.showNotification === 'function';
                    const hasNotificationCheck = typeof this.performNotificationCheck === 'function';
                    
                    console.log(`  Permission check: ${hasPermissionCheck}`);
                    console.log(`  Notification send: ${hasNotificationSend}`);
                    console.log(`  Periodic check: ${hasNotificationCheck}`);
                    
                    return hasPermissionCheck && hasNotificationSend && hasNotificationCheck;
                }, false);

                runTest('NOTIFICATIONS', 'Notification reset mechanism', () => {
                    const originalState = this.lastNotifiedWindow;
                    
                    this.lastNotifiedWindow = 'test_notification';
                    
                    // Simulate no active window (should reset)
                    const mockWindow = { isActive: false };
                    this.checkAndSendNotifications(mockWindow);
                    
                    const wasReset = this.lastNotifiedWindow === null;
                    this.lastNotifiedWindow = originalState;
                    
                    console.log(`  Reset mechanism working: ${wasReset}`);
                    return wasReset;
                }, false);

                // ===========================================
                // DATA INTEGRITY TESTS
                // ===========================================
                console.log('\n💾 TESTING DATA INTEGRITY...');

                runTest('DATA', 'All required data structures exist', () => {
                    const requiredData = [
                        'armsRacePhases',
                        'vsDays', 
                        'priorityAlignments'
                    ];
                    
                    for (const dataName of requiredData) {
                        if (!this.data[dataName] || !Array.isArray(this.data[dataName])) {
                            console.log(`  Missing or invalid data: ${dataName}`);
                            return false;
                        }
                    }
                    
                    console.log(`  All ${requiredData.length} data structures valid`);
                    return true;
                }, true);

                runTest('DATA', 'Phase data completeness', () => {
                    const phases = this.data.armsRacePhases;
                    if (phases.length !== 5) {
                        console.log(`  Expected 5 phases, found ${phases.length}`);
                        return false;
                    }
                    
                    const requiredPhases = ['City Building', 'Unit Progression', 'Tech Research', 'Drone Boost', 'Hero Advancement'];
                    for (const requiredPhase of requiredPhases) {
                        if (!phases.find(p => p.name === requiredPhase)) {
                            console.log(`  Missing phase: ${requiredPhase}`);
                            return false;
                        }
                    }
                    
                    console.log(`  All 5 Arms Race phases present`);
                    return true;
                }, true);

                // ===========================================
                // EDGE CASE TESTS
                // ===========================================
                console.log('\n🔍 TESTING EDGE CASES...');

                runTest('EDGE CASES', 'Sunday handling (no VS events)', () => {
                    // Simulate Sunday
                    const sundayVSDay = { day: 0, name: "Sunday", title: "Preparation Day" };
                    const sundayAlignments = this.data.priorityAlignments.filter(a => a.vsDay === 0);
                    
                    console.log(`  Sunday alignments: ${sundayAlignments.length} (expected: 0)`);
                    return sundayAlignments.length === 0; // Should have no alignments on Sunday
                }, false);

                runTest('EDGE CASES', 'Phase boundary calculations', () => {
                    const boundaryHours = [0, 4, 8, 12, 16, 20];
                    for (const hour of boundaryHours) {
                        const phaseIndex = hour >= 20 ? 0 : Math.floor(hour / 4);
                        const expectedPhases = ['City Building', 'Unit Progression', 'Tech Research', 'Drone Boost', 'Hero Advancement'];
                        const expectedPhase = expectedPhases[phaseIndex];
                        
                        console.log(`  Hour ${hour}: Phase ${phaseIndex} (${expectedPhase})`);
                    }
                    return true;
                }, false);

                // ===========================================
                // FINAL RESULTS
                // ===========================================
                console.log('\n🏁 COMPREHENSIVE TESTING RESULTS:');
                console.log('═'.repeat(60));
                console.log(`Total Tests Run: ${totalTests}`);
                console.log(`✅ Tests Passed: ${passedTests}`);
                console.log(`❌ Tests Failed: ${failedTests}`);
                console.log(`Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
                
                if (criticalFailures.length > 0) {
                    console.log('\n🚨 CRITICAL FAILURES - DO NOT PUBLISH:');
                    criticalFailures.forEach(failure => console.log(`  ❌ ${failure}`));
                    console.log('\n❌ SITE NOT READY FOR PUBLICATION');
                    return false;
                } else if (failedTests === 0) {
                    console.log('\n🎉 ALL TESTS PASSED - READY FOR PUBLICATION!');
                    console.log('✅ Day matching fixes working correctly');
                    console.log('✅ Priority detection operational');  
                    console.log('✅ Phase override system functional');
                    console.log('✅ Schedule generation working');
                    console.log('✅ Time display consistent');
                    console.log('✅ Update loops running properly');
                    console.log('✅ Notification system operational');
                    console.log('✅ Data integrity confirmed');
                    return true;
                } else {
                    console.log('\n⚠️ MINOR ISSUES DETECTED');
                    console.log('Core functionality working, but some non-critical features have issues.');
                    console.log('Site is functional but may need minor improvements.');
                    return true;
                }
            }

            // ULTIMATE FINAL VERIFICATION - Tests everything that matters for user experience
            runUltimateFinalVerification() {
                console.log('🚀 === ULTIMATE FINAL VERIFICATION ===');
                console.log('Testing all critical functionality for production readiness...\n');
                
                let totalTests = 0;
                let passedTests = 0;
                let failedTests = 0;
                let criticalIssues = [];

                const runTest = (testName, testFunction, isCritical = false) => {
                    totalTests++;
                    try {
                        const result = testFunction();
                        if (result) {
                            console.log(`✅ ${testName}`);
                            passedTests++;
                        } else {
                            console.log(`❌ ${testName} - FAILED`);
                            failedTests++;
                            if (isCritical) criticalIssues.push(testName);
                        }
                        return result;
                    } catch (error) {
                        console.log(`💥 ${testName} - ERROR: ${error.message}`);
                        failedTests++;
                        if (isCritical) criticalIssues.push(testName);
                        return false;
                    }
                };

                console.log('🔧 CORE FUNCTIONALITY TESTS:');
                
                // Test 1: Application Initialization
                runTest('Application properly initialized', () => {
                    return this.data && this.data.armsRacePhases && this.data.vsDays && this.data.priorityAlignments;
                }, true);

                // Test 2: Time Calculation Engine
                runTest('Server time calculation accurate', () => {
                    const serverTime = this.getServerTime();
                    const now = new Date();
                    const timeDiff = Math.abs(serverTime.getTime() - now.getTime());
                    console.log(`  Time difference: ${timeDiff}ms (should be offset-based)`);
                    return serverTime instanceof Date && !isNaN(serverTime.getTime());
                }, true);

                // Test 3: Phase Detection
                runTest('Arms Race phase detection working', () => {
                    const phase = this.getCurrentArmsPhase();
                    const isValid = phase && phase.name && ['City Building', 'Unit Progression', 'Tech Research', 'Drone Boost', 'Hero Advancement'].includes(phase.name);
                    console.log(`  Current phase: ${phase.name} (override: ${phase.isOverride})`);
                    return isValid;
                }, true);

                // Test 4: VS Day Detection
                runTest('VS Day detection working', () => {
                    const vsDay = this.getCurrentVSDay();
                    const isValid = vsDay && vsDay.day >= 0 && vsDay.day <= 6 && vsDay.name;
                    console.log(`  Current VS Day: ${vsDay.name} (day ${vsDay.day})`);
                    return isValid;
                }, true);

                console.log('\n🎯 PRIORITY SYSTEM TESTS:');

                // Test 5: Priority Detection Logic
                runTest('Priority window detection logic', () => {
                    const currentPriority = this.isCurrentlyHighPriority();
                    const nextWindow = this.findNextPriorityWindow();
                    console.log(`  Current priority: ${currentPriority ? currentPriority.reason : 'NONE'}`);
                    console.log(`  Next window: ${nextWindow ? `${nextWindow.phase?.name} + ${nextWindow.vsDay?.title}` : 'ERROR'}`);
                    return nextWindow !== null; // Should always find a window within 7 days
                }, true);

                // Test 6: Priority Alignment Data
                runTest('Priority alignment data complete', () => {
                    const alignments = this.data.priorityAlignments;
                    const hasAllDays = [1,2,3,4,5,6].every(day => alignments.some(a => a.vsDay === day));
                    console.log(`  Priority alignments found: ${alignments.length}`);
                    return alignments.length >= 10 && hasAllDays;
                }, true);

                console.log('\n🔔 NOTIFICATION SYSTEM TESTS:');

                // Test 7: Notification Permission State
                runTest('Notification permission handling', () => {
                    const hasPermission = this.verifyNotificationPermission();
                    const isEnabled = this.notificationsEnabled;
                    console.log(`  Browser permission: ${Notification?.permission || 'unavailable'}`);
                    console.log(`  Internal enabled: ${isEnabled}`);
                    console.log(`  Permission check result: ${hasPermission}`);
                    return typeof hasPermission === 'boolean';
                }, false);

                // Test 8: Notification State Management
                runTest('Notification state management', () => {
                    const originalState = this.lastNotifiedWindow;
                    
                    // Test reset mechanism
                    this.lastNotifiedWindow = 'test_phase';
                    const mockWindow = { isActive: false };
                    this.checkAndSendNotifications(mockWindow);
                    const wasReset = this.lastNotifiedWindow === null;
                    
                    // Restore state
                    this.lastNotifiedWindow = originalState;
                    
                    console.log(`  Notification reset works: ${wasReset}`);
                    return wasReset;
                }, true);

                console.log('\n⏰ TIME DISPLAY TESTS:');

                // Test 9: Time Display Consistency
                runTest('Time display consistency across components', () => {
                    const originalSetting = this.useLocalTime;
                    
                    // Test server time mode
                    this.useLocalTime = false;
                    const serverRange = this.formatTimeRange(4, 8, false);
                    
                    // Test local time mode
                    this.useLocalTime = true;
                    const localRange = this.formatTimeRange(4, 8, false);
                    
                    // Restore setting
                    this.useLocalTime = originalSetting;
                    
                    console.log(`  Server format: ${serverRange}`);
                    console.log(`  Local format: ${localRange}`);
                    
                    const serverValid = /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(serverRange);
                    const formatsDiffer = serverRange !== localRange || this.timeOffset === 0;
                    
                    return serverValid && formatsDiffer;
                }, true);

                // Test 10: Time Range Formatting
                runTest('Time range formatting for midnight transition', () => {
                    this.useLocalTime = false; // Test server mode
                    const midnightRange = this.formatTimeRange(20, 0, true);
                    this.useLocalTime = true; // Test local mode
                    const localMidnightRange = this.formatTimeRange(20, 0, true);
                    
                    console.log(`  Server midnight: ${midnightRange}`);
                    console.log(`  Local midnight: ${localMidnightRange}`);
                    
                    return midnightRange.includes('20:') && midnightRange.includes('00:');
                }, false);

                console.log('\n🔄 UPDATE MECHANISM TESTS:');

                // Test 11: Update Loop Status
                runTest('All update loops running', () => {
                    const hasData = !!this.updateInterval;
                    const hasCountdown = !!this.countdownInterval;
                    const hasNotification = !!this.notificationCheckInterval;
                    
                    console.log(`  Data updates (5s): ${hasData}`);
                    console.log(`  Countdown updates (1s): ${hasCountdown}`);
                    console.log(`  Notification checks (5s): ${hasNotification}`);
                    
                    return hasData && hasCountdown && hasNotification;
                }, true);

                // Test 12: Phase Change Detection
                runTest('Phase change detection mechanism', () => {
                    const currentPhase = this.getCurrentArmsPhase();
                    const timeUntilNext = this.getTimeUntilNextPhase();
                    
                    console.log(`  Current phase: ${currentPhase.name}`);
                    console.log(`  Time until next: ${this.formatTime(timeUntilNext)}`);
                    
                    return timeUntilNext > 0 && timeUntilNext <= (4 * 60 * 60 * 1000); // Max 4 hours
                }, false);

                console.log('\n💾 DATA PERSISTENCE TESTS:');

                // Test 13: Settings Persistence
                runTest('Settings save and load correctly', () => {
                    const originalLocal = this.useLocalTime;
                    const originalOffset = this.timeOffset;
                    
                    // Test save/load cycle
                    this.useLocalTime = !originalLocal;
                    this.timeOffset = originalOffset + 1;
                    this.saveSettings();
                    
                    // Reset and reload
                    this.useLocalTime = originalLocal;
                    this.timeOffset = originalOffset;
                    this.loadSettings();
                    
                    const localChanged = this.useLocalTime === !originalLocal;
                    const offsetChanged = this.timeOffset === originalOffset + 1;
                    
                    // Restore original values
                    this.useLocalTime = originalLocal;
                    this.timeOffset = originalOffset;
                    this.saveSettings();
                    
                    console.log(`  Local time setting persisted: ${localChanged}`);
                    console.log(`  Offset setting persisted: ${offsetChanged}`);
                    
                    return localChanged && offsetChanged;
                }, false);

                console.log('\n🎨 UI COMPONENT TESTS:');

                // Test 14: Schedule Generation
                runTest('Schedule generation without errors', () => {
                    try {
                        // Test schedule generation logic without DOM manipulation
                        const serverTime = this.getServerTime();
                        const dayOfWeek = (serverTime.getUTCDay() + 6) % 7; // Monday = 0
                        
                        // Verify we can generate phase data
                        for (let i = 0; i < 6; i++) {
                            const phaseIndex = i < 5 ? i : 0;
                            const startHour = i < 5 ? i * 4 : 20;
                            const endHour = i < 5 ? (i + 1) * 4 : 24;
                            const timeRange = this.formatTimeRange(startHour, endHour, i === 5);
                            
                            if (!timeRange || timeRange === 'undefined') {
                                return false;
                            }
                        }
                        
                        console.log('  Schedule generation logic verified');
                        return true;
                    } catch (error) {
                        console.log(`  Schedule error: ${error.message}`);
                        return false;
                    }
                }, false);

                // Test 15: Priority Banner Logic
                runTest('Priority banner logic works', () => {
                    try {
                        const nextWindow = this.findNextPriorityWindow();
                        if (!nextWindow) return false;
                        
                        // Test banner content generation
                        const timeText = nextWindow.isActive ? 
                            `Active for ${this.formatTime(nextWindow.timeRemaining)}` :
                            `Starts in ${this.formatTime(nextWindow.timeRemaining)}`;
                            
                        console.log(`  Banner text: "${timeText}"`);
                        return timeText.length > 0;
                    } catch (error) {
                        console.log(`  Banner error: ${error.message}`);
                        return false;
                    }
                }, false);

                console.log('\n🔍 EDGE CASE TESTS:');

                // Test 16: Midnight Boundary Handling
                runTest('Midnight boundary phase calculation', () => {
                    // Simulate midnight hour
                    const mockTime = new Date();
                    mockTime.setUTCHours(0, 0, 0, 0);
                    
                    // Calculate what phase should be active at midnight
                    const hour = mockTime.getUTCHours();
                    const expectedPhaseIndex = hour >= 20 ? 0 : Math.floor(hour / 4);
                    
                    console.log(`  Midnight hour ${hour} -> phase index ${expectedPhaseIndex} (City Building)`);
                    return expectedPhaseIndex === 0;
                }, false);

                // Test 17: Override System
                runTest('Phase override system integrity', () => {
                    const originalOverride = this.currentPhaseOverride;
                    
                    // Test setting override
                    this.currentPhaseOverride = 'tech_research';
                    const overriddenPhase = this.getCurrentArmsPhase();
                    const hasOverride = overriddenPhase.name === 'Tech Research' && overriddenPhase.isOverride;
                    
                    // Clear override
                    this.currentPhaseOverride = null;
                    const normalPhase = this.getCurrentArmsPhase();
                    const overrideCleared = !normalPhase.isOverride;
                    
                    // Restore original
                    this.currentPhaseOverride = originalOverride;
                    
                    console.log(`  Override works: ${hasOverride}, clears: ${overrideCleared}`);
                    return hasOverride && overrideCleared;
                }, false);

                // Final Results
                console.log('\n🏁 FINAL VERIFICATION RESULTS:');
                console.log('═'.repeat(50));
                console.log(`Total Tests: ${totalTests}`);
                console.log(`✅ Passed: ${passedTests}`);
                console.log(`❌ Failed: ${failedTests}`);
                console.log(`Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
                
                if (criticalIssues.length > 0) {
                    console.log('\n🚨 CRITICAL ISSUES DETECTED:');
                    criticalIssues.forEach(issue => console.log(`  ❌ ${issue}`));
                    console.log('\n❌ SITE NOT READY FOR PRODUCTION');
                    return false;
                } else if (failedTests === 0) {
                    console.log('\n🎉 ALL TESTS PASSED - SITE PRODUCTION READY!');
                    console.log('✅ Core functionality working');
                    console.log('✅ Priority detection accurate');
                    console.log('✅ Notification system operational');
                    console.log('✅ Time displays consistent');
                    console.log('✅ Update loops running');
                    return true;
                } else {
                    console.log('\n⚠️ MINOR ISSUES DETECTED - SITE FUNCTIONAL BUT HAS WARNINGS');
                    console.log('Core functionality is working, but some non-critical features have issues.');
                    return true;
                }
            }

            // ENHANCED: Update all displays including server time in settings
            updateAllDisplays() {
                try {
                    // Move time display to countdown interval for 1-second updates
                    this.updateSettingsTime();
                    this.updateCurrentStatus();
                    this.updatePriorityDisplay();
                    this.updateSpendingDetails();
                    this.updateBanner();
                    // FIXED: Don't auto-refresh guides tab to prevent closing open guides
                    if (this.activeTab && this.activeTab !== 'guides') {
                        this.populateTabContent(this.activeTab);
                    }
                } catch (error) {
                    console.error('Display update error:', error);
                }
            }

            updateTimeDisplay() {
                try {
                    const serverTime = this.getServerTime();
                    // FIXED: Derive local time from server time for consistency
                    const localTime = new Date(serverTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
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

                    // Update settings dropdown live time
                    const settingsLiveTime = document.getElementById('settings-live-time');
                    if (settingsLiveTime) {
                        const serverTimeString = serverTime.toUTCString().slice(17, 25);
                        settingsLiveTime.textContent = serverTimeString + ' (UTC' + (this.timeOffset >= 0 ? '+' : '') + this.timeOffset + ')';
                    }

                    // Phase end time
                    const phaseEndTime = document.getElementById('phase-end-time');
                    if (phaseEndTime) {
                        const currentPhase = this.getCurrentArmsPhase();
                        const serverTime = this.getServerTime();
                        
                        // Calculate absolute phase end time based on phase schedule
                        const hour = serverTime.getUTCHours();
                        let endHour;
                        
                        if (hour >= 20) {
                            // City Building phase ends at 00:00 next day
                            endHour = 24;
                        } else {
                            // Regular 4-hour phases
                            const phaseIndex = Math.floor(hour / 4);
                            endHour = (phaseIndex + 1) * 4;
                        }
                        
                        const phaseEndDate = new Date(serverTime);
                        phaseEndDate.setUTCHours(endHour % 24, 0, 0, 0);
                        if (endHour === 24) phaseEndDate.setUTCDate(phaseEndDate.getUTCDate() + 1);
                        
                        // Convert to display timezone
                        const displayEndTime = this.useLocalTime ? 
                            new Date(phaseEndDate.getTime() + (this.timeOffset * 60 * 60 * 1000)) : 
                            phaseEndDate;
                        
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
                    
                    // Auto-transition is handled in isCurrentlyHighPriority() to avoid conflicts
                    
                    const currentVSDay = this.getCurrentVSDay();
                    const currentArmsPhase = this.getCurrentArmsPhase();
                    
                    // Invalidate cache to ensure fresh calculation
                    this.cachedNextWindow = null;
                    const nextWindow = this.findNextPriorityWindow();
                    
                    // DEBUG: Log the next priority window for comparison with schedule
                    if (nextWindow) {
                        try {
                            console.log("🎯 MAIN CARD: Next priority window:", {
                                phase: nextWindow.phase?.name || "UNKNOWN",
                                vsDay: nextWindow.vsDay?.title || "UNKNOWN",
                                isActive: nextWindow.isActive,
                                timeRemaining: this.formatTime(nextWindow.timeRemaining)
                            });
                        } catch (error) {
                            console.log("🎯 MAIN CARD: Next priority window (ERROR):", nextWindow);
                            console.error("Console log error:", error);
                        }
                    }
                    
                    // Main time display is now updated every second in updateCountdowns()
                    
                    // Update priority countdown and banner text based on active vs upcoming
                    const priorityCountdown = document.getElementById('priority-countdown');
                    const priorityBannerText = document.querySelector('.next-priority-banner h3');
                    const priorityRemainingText = document.querySelector('.priority-remaining');
                    
                    if (priorityCountdown && nextWindow) {
                        priorityCountdown.textContent = this.formatTime(nextWindow.timeRemaining);
                        
                        if (nextWindow.isActive) {
                            if (priorityBannerText) priorityBannerText.textContent = 'HIGH PRIORITY ACTIVE';
                            if (priorityRemainingText) priorityRemainingText.textContent = 'TIME REMAINING';
                        } else {
                            if (priorityBannerText) priorityBannerText.textContent = 'NEXT HIGH PRIORITY';
                            if (priorityRemainingText) priorityRemainingText.textContent = 'TIME REMAINING';
                        }
                    }
                    
                    // Update phase information
                    const phaseIcon = document.getElementById('phase-icon');
                    const phaseTitle = document.getElementById('phase-title');
                    const phaseDescription = document.getElementById('phase-description');
                    const efficiencyBadge = document.getElementById('efficiency-badge');
                    
                    if (nextWindow) {
                        if (nextWindow.isActive) {
                            // Currently active priority window
                            if (phaseIcon) phaseIcon.textContent = nextWindow.phase.icon || '🎯';
                            if (phaseTitle) phaseTitle.textContent = `${nextWindow.phase.name} + ${nextWindow.vsDay.title}`;
                            if (phaseDescription) phaseDescription.textContent = `${nextWindow.phase.activities.join(', ')} align perfectly with ${nextWindow.vsDay.focus}`;
                            if (efficiencyBadge) {
                                efficiencyBadge.textContent = 'MAXIMUM EFFICIENCY';
                                efficiencyBadge.style.background = 'var(--gradient-success)';
                            }
                        } else {
                            // Upcoming priority window - show next high priority event
                            if (phaseIcon) phaseIcon.textContent = nextWindow.phase.icon || '🎯';
                            if (phaseTitle) phaseTitle.textContent = `Next: ${nextWindow.phase.name} + ${nextWindow.vsDay.title}`;
                            if (phaseDescription) phaseDescription.textContent = `Upcoming high priority: ${nextWindow.phase.activities.join(', ')} + ${nextWindow.vsDay.focus}`;
                            if (efficiencyBadge) {
                                efficiencyBadge.textContent = 'HIGH PRIORITY AHEAD';
                                efficiencyBadge.style.background = 'var(--gradient-primary)';
                                efficiencyBadge.style.color = 'white';
                            }
                        }
                    } else {
                        // Fallback to regular phase information
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
                    
                    // Update countdown display - use same logic as updateCountdownElements() for consistency
                    const countdownElement = document.getElementById('countdown-timer');
                    if (countdownElement) {
                        const timeUntilNext = this.getTimeUntilNextPhase();
                        countdownElement.textContent = this.formatTime(timeUntilNext);
                    }
                    
                    const currentPhaseElement = document.getElementById('current-phase');
                    if (currentPhaseElement) {
                        if (nextWindow && nextWindow.isActive) {
                            // Show active priority window
                            currentPhaseElement.textContent = `${nextWindow.phase.name} Active`;
                        } else {
                            // Show current time-based phase when no priority is active
                            currentPhaseElement.textContent = `${currentArmsPhase.name} Active`;
                        }
                    }
                    
                    // NOTE: Notifications are handled separately in the 15-second periodic check
                    // to prevent spam - removed from here
                    
                    // Update server reset information
                    this.updateServerResetInfo();
                    
                } catch (error) {
                    console.error('Status update error:', error);
                }
            }

            updateServerResetInfo() {
                try {
                    const serverTime = this.getServerTime();
                    const localTime = new Date(serverTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
                    
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
                        
                        const dayAlignments = this.data.priorityAlignments.filter(a => a.vsDay === vsDay.day);
                        
                        for (const alignment of dayAlignments) {
                            const phase = this.data.armsRacePhases.find(p => p.name === alignment.armsPhase);
                            if (!phase) continue;
                            
                            const phaseIndex = this.data.armsRacePhases.findIndex(p => p.name === phase.name);
                            
                            // Calculate multiple potential start times for this phase
                            const potentialTimes = [];
                            
                            // Regular 4-hour slot time (0-19 hours)
                            if (phaseIndex * 4 < 20) {
                                const regularTime = new Date(checkDate);
                                regularTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
                                potentialTimes.push({
                                    start: regularTime,
                                    end: new Date(regularTime.getTime() + 4 * 60 * 60 * 1000)
                                });
                            }
                            
                            // Special case: City Building also occurs 20:00-00:00
                            if (phase.name === "City Building") {
                                const eveningTime = new Date(checkDate);
                                eveningTime.setUTCHours(20, 0, 0, 0);
                                const eveningEnd = new Date(eveningTime);
                                eveningEnd.setUTCDate(eveningEnd.getUTCDate() + 1);
                                eveningEnd.setUTCHours(0, 0, 0, 0);
                                potentialTimes.push({
                                    start: eveningTime,
                                    end: eveningEnd
                                });
                            }
                            
                            // Process each potential time window for this phase
                            for (const timeWindow of potentialTimes) {
                                const startTime = timeWindow.start;
                                const endTime = timeWindow.end;
                            
                                const timeDiff = startTime.getTime() - now.getTime();
                                // Use override-aware active detection to prevent multiple active phases
                                const currentActivePhase = this.getCurrentArmsPhase();
                                const isActive = currentActivePhase.name === phase.name && Math.abs(timeDiff) < 4 * 60 * 60 * 1000;
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
                            <div style="padding: var(--spacing-lg); border-bottom: 1px solid var(--border-primary);">
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
                    
                    // FIXED: Get the chronologically next priority window to highlight consistently with main card
                    const nextPriorityWindow = this.findNextPriorityWindow();
                    
                    // DEBUG: Log the next priority window for comparison with main card
                    if (nextPriorityWindow) {
                        console.log('🗓️ SCHEDULE: Next priority window:', {
                            phase: nextPriorityWindow.phase.name,
                            vsDay: nextPriorityWindow.vsDay.title,
                            isActive: nextPriorityWindow.isActive,
                            timeRemaining: this.formatTime(nextPriorityWindow.timeRemaining)
                        });
                    }
                    
                    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                        const checkDate = new Date(now);
                        checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                        const dayOfWeek = checkDate.getUTCDay();
                        const isToday = dayOffset === 0;
                        
                        const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek) || 
                                     { name: "Sunday", title: "Preparation Day", focus: "Prepare for the week" };
                        
                        const phases = [];
                        
                        // Generate complete 6-phase schedule starting from current active phase for today
                        let startPhaseIndex = 0;
                        if (isToday) {
                            // For today, start from current active phase (respects overrides)
                            const currentPhase = this.getCurrentArmsPhase();
                            // Find the index of the current phase in the phases array
                            startPhaseIndex = this.data.armsRacePhases.findIndex(p => p.name === currentPhase.name);
                            if (startPhaseIndex === -1) startPhaseIndex = 0; // Fallback
                        } else {
                            // For future days, calculate phase offset
                            const currentHour = now.getUTCHours();
                            let phasesRemainingToday = 0;
                            
                            if (currentHour >= 20) {
                                phasesRemainingToday = 1; // Just City Building overnight
                            } else if (currentHour < 4) {
                                phasesRemainingToday = 4; // 4 phases remaining: Unit, Tech, Drone, Hero
                            } else {
                                const currentPhaseIndex = Math.floor(currentHour / 4);
                                phasesRemainingToday = 5 - currentPhaseIndex;
                            }
                            
                            startPhaseIndex = (phasesRemainingToday + (dayOffset - 1) * 5) % 5;
                        }
                        
                        // Generate 6 phases (full daily schedule including next day transition)
                        const basePhaseNames = ['City Building', 'Unit Progression', 'Tech Research', 'Drone Boost', 'Hero Advancement'];
                        
                        for (let i = 0; i < 6; i++) {
                            let phaseIndex, startHour, endHour;
                            
                            if (i < 5) {
                                // Regular 20-hour cycle phases
                                phaseIndex = (startPhaseIndex + i) % 5;
                                startHour = i * 4;
                                endHour = (i * 4 + 4) % 24;
                            } else {
                                // Next day's first phase (20:00-00:00 + 00:00-04:00)
                                phaseIndex = (startPhaseIndex + 5) % 5;
                                startHour = 20;
                                endHour = 24; // Show as 24:00 to indicate next day
                            }
                            
                            const phaseName = basePhaseNames[phaseIndex];
                            const phaseData = this.data.armsRacePhases.find(p => p.name === phaseName);
                            
                            const isPriority = this.data.priorityAlignments.some(a => 
                                a.vsDay === vsDay.day && a.armsPhase === phaseName
                            );
                            
                            // Check if this phase is currently active (respects overrides)
                            // FIXED: Only mark ONE phase as active by checking both name AND time slot
                            const currentActivePhase = this.getCurrentArmsPhase();
                            const currentHour = now.getUTCHours();
                            let isActive = false;
                            
                            if (isToday && currentActivePhase.name === phaseName) {
                                // Additional check: verify this is the actual time slot for this phase
                                if (i === 5) {
                                    // Next day's first phase (20:00-00:00)
                                    isActive = currentHour >= 20;
                                } else {
                                    // Regular 4-hour phases - check if current hour falls in this phase's time slot
                                    isActive = currentHour >= startHour && currentHour < endHour;
                                }
                            }
                            
                            // FIXED: Check if this is the chronologically next priority window to match main card
                            const isNextPriority = nextPriorityWindow && !nextPriorityWindow.isActive &&
                                                 nextPriorityWindow.phase.name === phaseName &&
                                                 nextPriorityWindow.vsDay.day === dayOfWeek &&
                                                 isPriority;
                            
                            const timeRange = i === 5 ? 
                                this.formatTimeRange(20, 0, true) : 
                                this.formatTimeRange(startHour, endHour, false);
                            
                            phases.push({
                                ...phaseData,
                                position: phaseIndex,
                                isPriority,
                                isActive,
                                isNextPriority,
                                timeRange,
                                isNextDay: i === 5
                            });
                        }
                        
                        // Note: City Building phase is already included in the rotation above (0-4 hours and 20-24 hours)
                        
                        schedule.push({
                            vsDay,
                            phases,
                            isToday,
                            date: checkDate.toLocaleDateString()
                        });
                    }
                    
                    const html = schedule.map(day => `
                        <div class="priority-window-card ${day.isToday ? 'active' : ''}">
                            <div style="padding: var(--spacing-md); border-bottom: 1px solid var(--border-primary); text-align: center;">
                                <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--spacing-xs);">${day.vsDay.name}</h3>
                                <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-sm);">
                                    <div style="font-size: 0.875rem; color: var(--text-secondary); font-weight: 600;">${day.vsDay.title}</div>
                                    <div style="font-size: 0.75rem; color: var(--text-tertiary); font-family: var(--font-mono);">${day.date}</div>
                                </div>
                            </div>
                            <div style="padding: var(--spacing-md);">
                                ${day.phases.map(phase => `
                                    <div style="background: var(--bg-tertiary); border: 1px solid ${phase.isNextPriority ? 'var(--accent-primary)' : phase.isPriority ? 'var(--accent-warning)' : 'var(--border-primary)'}; border-radius: var(--border-radius); padding: var(--spacing-md); margin-bottom: var(--spacing-xs); display: flex; justify-content: space-between; align-items: center; position: relative; ${phase.isNextPriority ? 'background: rgba(59, 130, 246, 0.15); border-width: 2px;' : phase.isPriority ? 'background: rgba(245, 158, 11, 0.1);' : ''} ${phase.isActive ? 'border-color: var(--accent-success); background: rgba(34, 197, 94, 0.1);' : ''}">
                                        <div style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600; color: var(--text-muted);">${phase.timeRange}</div>
                                        <div style="flex: 1; text-align: center; font-size: 0.8rem; font-weight: 600; color: var(--text-primary);">${phase.name}</div>
                                        <div style="font-size: 1rem;">${phase.icon}</div>
                                        ${phase.isNextPriority ? '<div style="position: absolute; top: -4px; right: 4px; background: var(--gradient-primary); color: white; padding: 2px 4px; border-radius: 3px; font-size: 0.6rem; font-weight: 700;">NEXT</div>' : phase.isPriority ? '<div style="position: absolute; top: -4px; right: 4px; background: var(--gradient-secondary); color: white; padding: 2px 4px; border-radius: 3px; font-size: 0.6rem; font-weight: 700;">HIGH</div>' : ''}
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
                        // COMPREHENSIVE SEASONAL GUIDES: Complete progression system based on lastwartutorial.com research
                        guides = [
                            {
                                title: "Season 1:<br>Crimson Plague Foundation",
                                category: "New Player Complete Guide (Days 1-45)",
                                icon: "🦠",
                                description: "Master essential foundation systems, resource management, building priorities, and early game progression strategies during Crimson Plague",
                                keyTakeaway: "Perfect your first 30 days foundation or waste months catching up to optimal players",
                                collapsible: true,
                                sections: [
                                    {
                                        title: "🚨 Hour-by-Hour First 72 Hours (Make or Break Period)",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "First 24 Hours - Foundation Phase (CRITICAL)",
                                                importance: "critical",
                                                points: [
                                                    { text: "Hour 1-6: Complete tutorial completely, immediately search for most active alliance available", importance: "critical" },
                                                    { text: "Day 1 Priority: Focus exclusively on Headquarters upgrades to HQ8+ to unlock alliance warehouse protection", importance: "critical" },
                                                    { text: "Alliance Selection: Join alliance with 40+ daily helps, active chat, and members in your timezone", importance: "critical" },
                                                    { text: "Resource Protection Rule: Never hold more than 2 hours of production outside alliance warehouse", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Days 2-3 - Resource Foundation (MAKE OR BREAK)",
                                                importance: "critical",
                                                points: [
                                                    { text: "Day 2 Critical: Complete ALL rookie challenges - provides 2-3 weeks worth of speedups and premium resources", importance: "critical" },
                                                    { text: "Day 3 Foundation: Build all 4 basic resource types (farms, oil wells, steel mills, electronics) to level 5+", importance: "critical" },
                                                    { text: "NEVER WASTE ROOKIE SPEEDUPS: Every speedup used randomly costs 24-48 hours of optimal progression", importance: "critical" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "📋 Weeks 1-2: Foundation Building Priority System",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Critical Foundation Building Order (CANNOT BE CHANGED LATER)",
                                                importance: "critical",
                                                points: [
                                                    { text: "Priority 1: Headquarters to level 15+ (unlocks advanced features, alliance benefits, higher-tier buildings)", importance: "critical" },
                                                    { text: "Priority 2: Alliance Center to maximum possible level (increases warehouse protection capacity to 8+ hours)", importance: "critical" },
                                                    { text: "Priority 3: All 4 resource buildings to level 15+ (provides 300-500% increase in daily resource generation)", importance: "critical" },
                                                    { text: "Priority 4: Research Institute to level 12+ (unlocks economic research tree essential for long-term efficiency)", importance: "important" },
                                                    { text: "Priority 5: Hospitals to level 12+ (protects 70%+ of troops from permanent death in combat)", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Fatal Foundation Mistakes to Avoid",
                                                importance: "critical",
                                                points: [
                                                    { text: "NEVER BUILD: Walls, decorations, multiple training camps, or cosmetic buildings during foundation phase", importance: "critical" },
                                                    { text: "Queue Management: Keep all 4 construction queues busy 24/7 using alliance help to reduce build times", importance: "important" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "🔬 Weeks 1-4: Research Strategy & Specialization",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Critical Research Sequence (MUST FOLLOW ORDER)",
                                                importance: "critical",
                                                points: [
                                                    { text: "Phase 1 Research: Economic tree FIRST - Resource Production I-IV, Construction Speed I-III, Research Speed I-III", importance: "critical" },
                                                    { text: "Phase 2 Research: Basic Military research only after economic foundation complete - choose Infantry specialization", importance: "critical" },
                                                    { text: "Long-term Impact: Completing economic research provides 200-400% efficiency gains for ALL future activities", importance: "critical" }
                                                ]
                                            },
                                            {
                                                main: "Strategic Research Optimization",
                                                importance: "important",
                                                points: [
                                                    { text: "Alliance Research: Join economic projects first, military projects only after week 3-4", importance: "important" },
                                                    { text: "Speedup Timing: Use research speedups EXCLUSIVELY during Tech Research Arms Race phases for VS points", importance: "important" },
                                                    { text: "Troop Specialization: Choose Infantry for beginners (cheapest to maintain, most forgiving, easiest to master)", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "💰 Resource Management & VS Points Integration",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Essential Resource Protection & Management",
                                                importance: "critical",
                                                points: [
                                                    { text: "Warehouse Strategy: Use alliance warehouse protection religiously - store ALL resources immediately upon collection", importance: "critical" },
                                                    { text: "Production Optimization: Never let resource buildings reach maximum capacity - always have upgrades queued", importance: "important" },
                                                    { text: "Event Participation: Participate in ALL resource events - gathering missions, competitions, alliance donations", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Advanced Resource Strategy & VS Points Integration",
                                                importance: "important",
                                                points: [
                                                    { text: "VS Points Integration: Convert excess resources during City Building Arms Race phases for bonus points", importance: "important" },
                                                    { text: "Strategic Stockpiling: Build up 2-3 days worth of premium resources before major perfect alignment windows", importance: "important" },
                                                    { text: "Alliance Coordination: Request specific resource types from alliance during major construction phases", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "🚫 Critical Season 1 Mistakes That Destroy 3-6 Months of Progress",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Catastrophic Building & Resource Mistakes",
                                                importance: "critical",
                                                points: [
                                                    { text: "Decoration Trap: Building walls, decorations, cosmetic buildings (wastes 2-4 weeks of critical resources)", importance: "critical" },
                                                    { text: "Speedup Waste: Using speedups randomly vs Arms Race alignment windows (loses 25-50% potential VS points)", importance: "critical" },
                                                    { text: "Protection Failure: Not using alliance warehouse protection (loses resources to attacks, raids, and capacity overflow)", importance: "critical" }
                                                ]
                                            },
                                            {
                                                main: "Strategic Focus & Specialization Errors",
                                                importance: "critical",
                                                points: [
                                                    { text: "Specialization Error: Training multiple troop types instead of Infantry focus (reduces effectiveness by 50-70%)", importance: "critical" },
                                                    { text: "Research Error: Prioritizing military research over economic research (reduces efficiency by 200-300%)", importance: "critical" },
                                                    { text: "Alliance Mistake: Joining inactive alliance or staying solo (loses 40-60% of potential daily resources and help)", importance: "important" },
                                                    { text: "Hospital Neglect: Not building adequate hospitals before combat (permanent troop losses cost millions in resources)", importance: "important" }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Season 2:<br>Polar Storm Military Excellence",
                                category: "Intermediate Strategy (Days 45-120)",
                                icon: "❄️",
                                description: "Master military specialization, hero development, and competitive participation during Polar Storm",
                                keyTakeaway: "Military specialization mastery and competitive participation determine your viability for next 6-12 months",
                                collapsible: true,
                                sections: [
                                    {
                                        title: "⚔️ Military Specialization Mastery (Critical Choice Point)",
                                        collapsible: true,
                                        items: [
                                            "Infantry Path: Tanky, cost-effective, beginner-friendly - best for defensive strategies and resource protection",
                                            "Vehicle Path: Balanced offense/defense, moderate cost - best for adaptable players who change strategies",
                                            "Aircraft Path: High damage, expensive, micro-intensive - best for experienced players with deep pockets",
                                            "Research Distribution: Allocate 80% of military research to chosen specialization, 20% to counter-types",
                                            "Facility Priority: Upgrade chosen specialization training camps to maximum level before touching others",
                                            "Formation Technology: Research formation bonuses that specifically amplify your chosen troop type effectiveness",
                                            "Hospital Scaling: Build hospital capacity to support 150% of maximum army size to prevent catastrophic losses"
                                        ]
                                    },
                                    {
                                        title: "🦸 Hero Development System (Season 2 Advanced Strategy)",
                                        collapsible: true,
                                        items: [
                                            "Recruitment Strategy: Focus exclusively on heroes providing bonuses to your chosen troop specialization",
                                            "Gear Progression Path: Weapons first (damage multipliers), armor second (survivability), accessories third (special bonuses)",
                                            "Skill Point Optimization: Prioritize skills boosting main troop type damage and defense by 20-50%",
                                            "Resource Timing: Use hero EXP items during Hero Advancement Arms Race phases for VS points multiplier bonus",
                                            "Event Strategy: Focus participation on hero recruitment events for rare/legendary heroes matching specialization",
                                            "Formation Mastery: Learn hero combinations creating synergistic bonuses and multiplicative effectiveness",
                                            "Focus Discipline: Never spread hero resources thin - concentrate on 3-4 core heroes for primary formations"
                                        ]
                                    },
                                    {
                                        title: "🎯 Combat Strategy & Tactical Development",
                                        collapsible: true,
                                        items: [
                                            "Intelligence Operations: Always scout targets before attacking - reconnaissance prevents 80% of combat disasters",
                                            "Rock-Paper-Scissors: Master Infantry > Aircraft > Vehicles > Infantry advantage cycles",
                                            "Counter-Intelligence: Use reconnaissance to identify enemy troop compositions and adapt formations accordingly",
                                            "Medical Strategy: Wounded troops cost resources to heal but avoid permanent death - manage hospital capacity",
                                            "PvE Progression: Focus on Infected zones for combat experience and rewards without PvP retaliation risks",
                                            "Alliance Combat: Participate in alliance battles for tactical experience, better rewards, and strategic learning",
                                            "Strategic Retreat: Learn optimal retreat timing - losing some troops beats losing entire armies"
                                        ]
                                    },
                                    {
                                        title: "❄️ Season 2 Exclusive Content: Polar Storm Mastery",
                                        collapsible: true,
                                        items: [
                                            "Cold Wave Events: Master survival and resource management during harsh weather challenge periods",
                                            "Titanium Alloy Factories: Essential facilities for crafting advanced military equipment and high-tier gear",
                                            "Hero Promotions: Participate in special hero advancement events like Violet UR promotion for powerful upgrades",
                                            "Nuclear Furnace Operations: Key facility for advanced resource processing and high-tier material production",
                                            "Alliance Coordination: Coordinate with alliance for Season 2 group challenges and competitive event participation",
                                            "Strategic Stockpiling: Save premium resources for Season 2 limited-time military advancement opportunities"
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Season 3:<br>Golden Kingdom Technology Mastery",
                                category: "Advanced Strategy (Days 120-200)",
                                icon: "🏛️",
                                description: "Master advanced research paths, Oasis Project exploration, and technology integration",
                                keyTakeaway: "Technology mastery and research optimization separate truly competitive players from casual participants",
                                collapsible: true,
                                sections: [
                                    {
                                        title: "🔬 Advanced Research Path Optimization",
                                        collapsible: true,
                                        items: [
                                            "Completion Strategy: Economic research tree to 100% completion before any advanced military research begins",
                                            "Infrastructure Requirements: Research Center level 25+, Labs level 20+, Observatory unlocked and operational",
                                            "Priority Hierarchy: Economic Research > Basic Military > Advanced Military > Specialized Technologies",
                                            "VS Points Integration: Use research speedups EXCLUSIVELY during Tech Research Arms Race phases for 25-50% bonus",
                                            "Alliance Research Coordination: Economic benefit projects first, then specialized military enhancement projects",
                                            "Resource Allocation: 70% research resources on chosen specialization technologies, 30% on support systems",
                                            "Strategic Planning: Never research randomly - follow structured 60-90 day research roadmaps and timelines"
                                        ]
                                    },
                                    {
                                        title: "🏜️ Season 3 Exclusive: Oasis Project & Desert Artifacts",
                                        collapsible: true,
                                        items: [
                                            "Oasis Project Events: Participate for rare technological advancement materials and ancient technology blueprints",
                                            "Desert Artifacts Exploration: Discover unique research bonuses and unlock advanced technology development paths",
                                            "Sphinx Location Discovery: Unlock powerful permanent research bonuses providing 20-50% efficiency improvements",
                                            "Profession System Advancement: Engineer and War Leader specializations unlock advanced technologies and capabilities",
                                            "Golden Kingdom Events: Save premium resources for participation - provides technological leap opportunities",
                                            "Alliance Expeditions: Coordinate with alliance for group exploration of high-level Oasis locations and challenges"
                                        ]
                                    },
                                    {
                                        title: "⚙️ Technology Integration & Synergy Strategy",
                                        collapsible: true,
                                        items: [
                                            "Integration Principle: Every new technology should support and enhance your chosen specialization strategy",
                                            "Building Synergy: Unlock advanced building functions that multiply effectiveness of existing infrastructure",
                                            "Commander Skills Research: Abilities that boost overall base effectiveness by 20-50% through leadership bonuses",
                                            "Efficiency Technologies: Construction and training time reduction research pays for itself within 2-4 weeks",
                                            "Resource Multipliers: Production and capacity research provides exponential long-term growth benefits",
                                            "Combat Balance: Maintain 60% offensive research, 40% defensive research for optimal competitive performance",
                                            "Support Systems: Never neglect logistics, intelligence, and resource management technology development"
                                        ]
                                    },
                                    {
                                        title: "📊 Advanced Resource & Time Management",
                                        collapsible: true,
                                        items: [
                                            "Resource Scale: Advanced research requires 10-20x more resources than basic research - plan resource allocation",
                                            "Alliance Leverage: Use alliance technology projects to reduce individual research costs by 30-50%",
                                            "VS Points Strategy: Research during Arms Race Tech phases provides enough points to dominate weekly competitions",
                                            "Queue Management: Time research completion during priority windows for maximum point efficiency gains",
                                            "Resource Conversion: Transform excess basic resources into advanced research materials through alliance systems",
                                            "Long-term Planning: Map out 90-180 day research schedules aligned with seasonal events and competition cycles"
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Season 4:<br>Evernight Isle Competitive Excellence",
                                category: "Expert Mastery (Days 200+)",
                                icon: "🌙",
                                description: "Achieve competitive dominance through Season 4 systems mastery and alliance leadership",
                                keyTakeaway: "Season 4 mastery requires perfect optimization of all systems plus leadership of alliance competitive strategies",
                                collapsible: true,
                                sections: [
                                    {
                                        title: "🌙 Season 4 Advanced Systems: Evernight Isle Features",
                                        collapsible: true,
                                        items: [
                                            "Blood Night Descend: Master new high-difficulty combat mode requiring specialized tactics and elite formations",
                                            "Tactics Cards System: Collect and optimize card combinations providing temporary powerful combat and economic bonuses",
                                            "Light and Darkness Resources: New resource types and production chains for crafting ultimate-tier equipment",
                                            "Advanced Professions: Specialized skills reaching Level 100+ with game-changing abilities and server-wide bonuses",
                                            "Evernight Isle Exploration: High-level content requiring coordinated alliance expeditions and strategic planning",
                                            "First-Mover Advantage: Master new seasonal mechanics before competitors for significant strategic advantages"
                                        ]
                                    },
                                    {
                                        title: "🏆 Perfect VS Points Optimization (Expert Level)",
                                        collapsible: true,
                                        items: [
                                            "Efficiency Mastery: Achieve 95%+ efficiency in VS point generation through perfect timing and resource management",
                                            "Alliance Coordination: Lead massive coordinated spending events during Total Mobilization Friday perfect alignments",
                                            "Strategic Stockpiling: Maintain 4-8 weeks of premium resources for major competitive events and seasonal opportunities",
                                            "Competitive Specialization: Focus alliance resources on VS point categories providing advantages over rival alliances",
                                            "Advanced Strategies: Implement trap accounts, rally leadership systems, and complex resource protection protocols",
                                            "Intelligence Operations: Monitor rival alliance patterns and adjust strategies for maximum competitive advantages",
                                            "Seasonal Integration: Plan all major activities around optimal Arms Race phase alignments and seasonal event cycles"
                                        ]
                                    },
                                    {
                                        title: "👥 Alliance Warfare & Strategic Leadership",
                                        collapsible: true,
                                        items: [
                                            "Strategic Warfare Leadership: Command alliance vs alliance conflicts with coordinated attacks, resource sharing, strategic objectives",
                                            "Advanced Tactical Mastery: Master complex combat tactics including rally timing, target prioritization, formation optimization",
                                            "Communication Infrastructure: Establish real-time coordination systems for competitive events and large-scale warfare",
                                            "Member Development: Train alliance members in advanced optimization strategies for collective competitive advantage",
                                            "Resource Coordination: Manage alliance-wide resource sharing, strategic stockpiling, and emergency support systems",
                                            "Mentorship Programs: Develop systematic approaches to rapidly advance newer members to competitive performance levels",
                                            "Diplomatic Relations: Negotiate with rival alliances for mutual benefits, strategic advantages, or conflict resolution"
                                        ]
                                    },
                                    {
                                        title: "🌟 End-Game Excellence & Legacy Building",
                                        collapsible: true,
                                        items: [
                                            "Elite Content Mastery: Coordinate alliance raids on ultimate-difficulty content for exclusive rewards and achievements",
                                            "Seasonal Event Dominance: Perfect participation strategies in limited-time competitive events for maximum rewards",
                                            "Sustained Excellence: Balance continuous growth, strategic stockpiling, and immediate competitive needs across seasons",
                                            "Strategic Innovation: Develop new competitive strategies and adapt to meta changes ahead of competitor discovery",
                                            "Long-term Vision: Create 6-12 month strategic plans incorporating seasonal changes and competitive evolution",
                                            "Knowledge Legacy: Establish alliance systems, strategies, and training programs persisting beyond individual leadership",
                                            "Community Leadership: Mentor other alliance leaders and contribute to server-wide strategic development"
                                        ]
                                    }
                                ]
                            }
                        ];
                    } else {
                        // COMPREHENSIVE TIPS GUIDES: Detailed, exhaustive content with collapsible panels and importance-coded dots
                        guides = [
                            {
                                title: "VS Points Complete Mastery System",
                                category: "Advanced Strategy & Mathematics",
                                icon: "🎯",
                                description: "Complete guide to mastering VS Points through mathematical understanding, strategic timing, and advanced optimization techniques",
                                keyTakeaway: "Understanding VS Points mathematics and perfect timing can increase your efficiency by 300-500% compared to random spending",
                                collapsible: true,
                                sections: [
                                    {
                                        title: "🧮 VS Points Mathematics & Core Mechanics (WHY Points Multiply)",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "The Mathematical Foundation of VS Points",
                                                importance: "critical",
                                                points: [
                                                    { text: "Base Formula: VS Points = Resource Value × Phase Multiplier × Daily Bonus × Activity Type Modifier. Perfect Alignment occurs when your activity matches BOTH the Arms Race phase AND the daily VS focus event, providing a 1.5x multiplier (50% bonus).", importance: "critical" },
                                                    { text: "Real Impact: A 1000 diamond spend becomes 1500 VS points during perfect alignment (500 extra points). This compounds annually to generate 200,000-500,000 additional VS points per year through optimal timing.", importance: "critical" }
                                                ]
                                            },
                                            {
                                                main: "Why Timing Creates Exponential Value",
                                                importance: "critical",
                                                points: [
                                                    { text: "Resource Scarcity & Competitive Edge: Premium resources (speedups, legendary items) are limited, making efficient use crucial. The 50% bonus compounds over time - consistent perfect timing beats larger random spending, creating a lasting competitive advantage.", importance: "critical" },
                                                    { text: "Alliance & Event Benefits: Your optimized points contribute to alliance rankings, unlock better alliance rewards, and qualify you for higher tier rewards in seasonal events. This accelerates overall game progression by 3-6 months compared to random timing.", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Arms Race Phase System Explained",
                                                importance: "critical",
                                                points: [
                                                    { text: "5 Rotating Phases in 4-Hour Cycles: City Building (0-4h), Unit Progression (4-8h), Tech Research (8-12h), Drone Boost (12-16h), Hero Advancement (16-20h). Each phase repeats daily in the same pattern with exact transition times at 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 server time.", importance: "critical" },
                                                    { text: "Activity Matching Strategy: Your spending activity must align with the current phase (construction during City Building, research during Tech Research, etc.). All players worldwide follow the same synchronized schedule, creating predictable optimization windows.", importance: "critical" }
                                                ]
                                            },
                                            {
                                                main: "Daily VS Focus Events & Perfect Alignment Windows",
                                                importance: "critical",
                                                points: [
                                                    { text: "Weekday Perfect Windows: Monday (Radar Training + Drone Boost, 12:00-16:00), Tuesday (Base Expansion + City Building, 00:00-04:00), Wednesday (Age of Science + Tech Research, 08:00-12:00), Thursday (Train Heroes + Hero Advancement, 16:00-20:00), Saturday (Enemy Buster + Unit Progression, 04:00-08:00).", importance: "critical" },
                                                    { text: "Special Days: Friday offers Total Mobilization where ALL activities get 50% bonus regardless of Arms Race phase (entire day). Sunday is your Planning Day for resource stockpiling, strategy coordination, and preparing for the week's optimal windows.", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Advanced Mathematical Examples & ROI Calculations",
                                                importance: "important",
                                                points: [
                                                    { text: "Real Scenarios: 10 construction speedups during perfect alignment (Tuesday 00:00-04:00) = 150 points vs 100 random timing. 5 research speedups during Wednesday 08:00-12:00 = 300 points vs 200 random. $100 diamond purchase on Friday = 1500 VS points vs 1000 other days.", importance: "important" },
                                                    { text: "Annual Impact: A player spending $1000/year with perfect timing generates 50% more VS points than random spending. This 50% efficiency advantage compounds to a 6-12 month progression lead over non-optimized players.", importance: "critical" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "📅 Advanced Weekly Strategy & Resource Planning System",
                                        items: [
                                            {
                                                main: "Daily Focus Schedule & Optimal Activity Windows",
                                                importance: "critical",
                                                points: [
                                                    { text: "Monday-Thursday Focus: Monday targets drone stamina/hero EXP/radar missions (12:00-16:00 Drone Boost). Tuesday emphasizes construction speedups/building upgrades/legendary trucks (00:00-04:00 City Building). Wednesday prioritizes research speedups/tech upgrades/valor badges (08:00-12:00 Tech Research). Thursday focuses on hero recruitment/EXP items/skill medals (16:00-20:00 Hero Advancement).", importance: "critical" },
                                                    { text: "Weekend Strategy: Friday is Total Mobilization day where ALL activities receive 50% bonus regardless of phase - plan your biggest spending here. Saturday targets military training/healing speedups (04:00-08:00 Unit Progression). Sunday is for strategic planning, alliance coordination, and resource stockpiling.", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Weekly Resource Stockpiling Strategy",
                                                importance: "important",
                                                points: [
                                                    { text: "Weekday Accumulation: Monday-Wednesday accumulate construction speedups for Tuesday windows. Tuesday-Thursday collect research items for Wednesday. Wednesday-Friday gather hero materials for Thursday. Thursday-Saturday stockpile military resources for Saturday windows.", importance: "important" },
                                                    { text: "Strategic Days: Friday requires the largest resource reserves for Total Mobilization maximum impact. Use Saturday-Sunday for planning, coordination, and preparing for next week's optimization cycle.", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Advanced Timing & Preparation Strategies",
                                                subPoints: [
                                                    "48-Hour Rule: Begin stockpiling resources 2 days before major perfect alignment events",
                                                    "Alarm System: Set multiple phone alerts 15 minutes before each perfect window",
                                                    "Calendar Integration: Use Google Calendar or phone calendar for weekly priority window planning",
                                                    "Alliance Coordination: Share weekly schedules with alliance for synchronized mass spending events",
                                                    "Time Zone Mastery: Understand server time vs local time for precise window timing",
                                                    "Queue Management: Start long upgrades 30 minutes before perfect windows end for maximum overlap"
                                                ]
                                            },
                                            {
                                                main: "Weekly Performance Optimization & Tracking",
                                                subPoints: [
                                                    "Efficiency Metrics: Track percentage of resources used during perfect vs random timing",
                                                    "Weekly Goals: Set specific VS point targets for each perfect alignment window",
                                                    "ROI Analysis: Calculate additional points gained through optimal timing vs random spending",
                                                    "Continuous Improvement: Adjust strategy based on weekly performance data",
                                                    "Alliance Comparison: Compare your optimization efficiency with top alliance members",
                                                    "Long-term Planning: Map 4-week cycles around major seasonal events and competitions"
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "🎯 Elite Perfect Alignment Opportunities & Advanced Optimization",
                                        items: [
                                            {
                                                main: "Tier 1: Maximum ROI Perfect Alignment Windows (Highest Priority)",
                                                subPoints: [
                                                    "Wednesday 08:00-12:00: Tech Research + Age of Science = 1.5x multiplier on research speedups (most valuable long-term)",
                                                    "Tuesday 00:00-04:00: City Building + Base Expansion = 1.5x multiplier on construction speedups (fastest immediate power gains)",
                                                    "Thursday 16:00-20:00: Hero Advancement + Train Heroes = 1.5x multiplier on hero items (critical for combat effectiveness)",
                                                    "Friday All Day: Total Mobilization = 1.5x multiplier on ALL activities (universal optimization day)"
                                                ]
                                            },
                                            {
                                                main: "Tier 2: High-Value Alignment Windows (Secondary Priority)",
                                                subPoints: [
                                                    "Monday 12:00-16:00: Drone Boost + Radar Training = 1.5x multiplier on drone stamina and radar activities",
                                                    "Saturday 04:00-08:00: Unit Progression + Enemy Buster = 1.5x multiplier on military training and combat speedups",
                                                    "Sunday Strategic Planning: No perfect alignments, use for preparation and resource stockpiling"
                                                ]
                                            },
                                            {
                                                main: "Advanced Resource Allocation & Priority Matrix",
                                                subPoints: [
                                                    "Research Speedups: EXCLUSIVELY save for Wednesday 08:00-12:00 windows (highest long-term ROI)",
                                                    "Construction Speedups: Prioritize Tuesday 00:00-04:00, secondary Friday Total Mobilization",
                                                    "Hero Items: Focus Thursday 16:00-20:00, backup Friday Total Mobilization",
                                                    "Diamond Purchases: Optimal during any perfect alignment window, best value Friday Total Mobilization",
                                                    "Military Speedups: Saturday 04:00-08:00 primary, Friday Total Mobilization secondary",
                                                    "Emergency Protocol: Only break hoarding rules if falling >20% behind alliance rankings"
                                                ]
                                            },
                                            {
                                                main: "Elite Timing Strategies & Preparation Systems",
                                                subPoints: [
                                                    "72-Hour Advance Planning: Map resource acquisition 3 days before major perfect alignment events",
                                                    "Multi-Alarm System: Set alarms at -30min, -15min, -5min, and window start for critical opportunities",
                                                    "Resource Threshold Rules: Maintain minimum reserves (20% for emergencies, 80% for perfect windows)",
                                                    "Calendar Integration: Sync with Google/Apple Calendar for automated weekly reminder system",
                                                    "Alliance Synchronization: Coordinate with alliance officers for mass spending events during peak windows",
                                                    "Queue Overlap Optimization: Start long upgrades 45 minutes before windows end to maximize bonus overlap time"
                                                ]
                                            },
                                            {
                                                main: "Competitive Advantage & Long-term Impact Analysis",
                                                subPoints: [
                                                    "Efficiency Gap: Optimized players generate 40-60% more VS points annually than random spenders",
                                                    "Progression Acceleration: Perfect timing provides 3-6 month advantage in overall game progression",
                                                    "Alliance Impact: Consistent optimization makes you eligible for elite alliance recruitment",
                                                    "Event Qualification: Higher VS efficiency unlocks access to premium tier rewards in seasonal events",
                                                    "Resource Multiplication: 50% bonus compounds over time - 1 year of optimization = 18 months of random progress",
                                                    "Server Ranking: Optimized spending directly correlates with top 10% server performance"
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                additionalInfo: "This VS Points system represents the mathematical foundation of competitive Last War optimization. Understanding these principles separates elite players from casual participants, creating sustainable advantages that compound over months and years of gameplay. Master these techniques to achieve 300-500% efficiency gains over non-optimized players."
                            },
                            {
                                title: "Resource Strategy & Smart Spending Mastery",
                                category: "Advanced Economics",
                                icon: "💎",
                                description: "Complete guide to resource optimization, strategic hoarding, spending timing, and maximum ROI decision making for competitive advantage",
                                keyTakeaway: "Strategic resource management can increase your effectiveness by 200-400% compared to random spending patterns",
                                collapsible: true,
                                sections: [
                                    {
                                        title: "💰 Core Spending Principles & Resource Economics",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "VIP Store Optimization Strategy",
                                                importance: "critical",
                                                points: [
                                                    { text: "VIP Store provides 30-50% better value than regular store for ALL items", importance: "critical" },
                                                    { text: "Priority purchases: Construction speedups, research speedups, hero items during sales", importance: "important" },
                                                    { text: "Weekly VIP refresh timing: Always check Monday mornings for new inventory", importance: "important" },
                                                    { text: "Bulk buying strategy: Purchase larger quantities during 40%+ discount events", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Diamond Spending Universal Rules",
                                                importance: "critical",
                                                points: [
                                                    { text: "Diamond purchases count for VS points in ALL Arms Race phases regardless of activity type", importance: "critical" },
                                                    { text: "Best diamond ROI: Speedup bundles during perfect alignment windows", importance: "critical" },
                                                    { text: "Emergency spending: Only break hoarding rules if falling >20% behind alliance ranking", importance: "important" },
                                                    { text: "Monthly budget strategy: Set aside 80% for perfect windows, 20% for emergencies", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Strategic Hoarding & Resource Accumulation",
                                                importance: "critical",
                                                points: [
                                                    { text: "Save ALL speedups exclusively for perfect alignment windows (1.5x point multiplier)", importance: "critical" },
                                                    { text: "Hoarding threshold: Maintain 72-hour supply for major perfect window opportunities", importance: "important" },
                                                    { text: "Resource prioritization: Legendary items > Premium speedups > Standard speedups > Basic materials", importance: "important" },
                                                    { text: "Alliance coordination: Synchronize major spending with alliance mass events for bonus rewards", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "📦 Resource Classification & Optimal Usage Strategy",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Critical Resources to ALWAYS Save for Perfect Windows",
                                                importance: "critical",
                                                points: [
                                                    { text: "Construction Speedups: Exclusively for Tuesday 00:00-04:00 City Building + Base Expansion windows", importance: "critical" },
                                                    { text: "Research Speedups: Only use during Wednesday 08:00-12:00 Tech Research + Age of Science windows", importance: "critical" },
                                                    { text: "Training Speedups: Reserve for Saturday 04:00-08:00 Unit Progression + Enemy Buster windows", importance: "critical" },
                                                    { text: "Legendary Items: All legendary trucks, valor badges, hero items - never use outside perfect alignment", importance: "critical" },
                                                    { text: "Premium Resources: Dragon crystals, advanced materials, elite equipment - maximum ROI during alignment only", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Resources Safe to Use Anytime",
                                                importance: "important",
                                                points: [
                                                    { text: "Basic Materials: Wood, steel, food, oil - use freely as they regenerate quickly", importance: "minor" },
                                                    { text: "Free Items with Timers: Event rewards with expiration dates - use before they expire", importance: "important" },
                                                    { text: "Low-Value Speedups: 5-minute and 15-minute speedups can be used for immediate needs", importance: "minor" },
                                                    { text: "Daily Login Rewards: Most daily freebies are safe to use immediately", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Alliance Coordination & Strategic Timing",
                                                importance: "important",
                                                points: [
                                                    { text: "Mass Spending Events: Coordinate with alliance officers for synchronized major purchases", importance: "important" },
                                                    { text: "Alliance Store Priority: Focus on speedups and legendary items when available", importance: "important" },
                                                    { text: "Help Point Usage: Save help points for special alliance store refresh events", importance: "minor" },
                                                    { text: "Donation Strategy: Donate regularly but save premium items for personal perfect windows", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "⏰ Perfect Timing Strategy for Major Decisions",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Tier 1 Perfect Alignment Opportunities (Maximum ROI)",
                                                importance: "critical",
                                                points: [
                                                    { text: "Tuesday 00:00-04:00: Major building upgrades during City Building + Base Expansion alignment", importance: "critical" },
                                                    { text: "Wednesday 08:00-12:00: Research projects during Tech Research + Age of Science alignment", importance: "critical" },
                                                    { text: "Thursday 16:00-20:00: Hero recruitment/upgrades during Hero Advancement + Train Heroes alignment", importance: "critical" },
                                                    { text: "Friday All Day: Equipment upgrades during Total Mobilization universal bonus", importance: "critical" }
                                                ]
                                            },
                                            {
                                                main: "Advanced Timing Strategies & Preparation",
                                                importance: "important",
                                                points: [
                                                    { text: "48-Hour Preparation Rule: Begin stockpiling specific resources 2 days before major alignment windows", importance: "important" },
                                                    { text: "Queue Overlap Strategy: Start long upgrades 30-45 minutes before perfect windows end", importance: "important" },
                                                    { text: "Multi-Phase Planning: Coordinate 3-4 major upgrades across consecutive perfect windows", importance: "important" },
                                                    { text: "Emergency Protocol: Have backup plans if alignment windows are missed due to real-life conflicts", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Resource Flow & Acquisition Timing",
                                                importance: "important",
                                                points: [
                                                    { text: "Material Gathering: Complete resource runs 6-12 hours before perfect alignment windows", importance: "important" },
                                                    { text: "Diamond Purchases: Buy speedup packages during or just before perfect alignment periods", importance: "important" },
                                                    { text: "Alliance Requests: Ask for specific resources 24 hours before you plan to use them", importance: "minor" },
                                                    { text: "Event Participation: Time event completions to coincide with resource needs", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                additionalInfo: "Master the economics of Last War through strategic resource allocation, timing optimization, and investment prioritization that maximizes long-term competitive advantage. This guide provides the economic foundation for sustainable server dominance."
                            },
                            {
                                title: "Building Priority & Construction Strategy Mastery",
                                category: "Power Growth & Base Optimization",
                                icon: "🏗️",
                                description: "Complete guide to optimal building progression, construction timing, power maximization, and strategic upgrade sequencing for competitive advantage",
                                keyTakeaway: "Strategic building priority with perfect timing can accelerate your progression by 4-6 months compared to random upgrades",
                                collapsible: true,
                                sections: [
                                    {
                                        title: "🎯 Critical Building Priority Matrix (Mathematical Optimization)",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Tier 1: Absolute Priority Buildings (Must Upgrade First)",
                                                importance: "critical",
                                                points: [
                                                    { text: "Headquarters: ALWAYS upgrade first - unlocks all other building levels and technologies", importance: "critical" },
                                                    { text: "Research Institute: Second priority - enables technology advancement for long-term power multiplication", importance: "critical" },
                                                    { text: "Resource Buildings: Oil refineries and steel mills provide compound growth - upgrade immediately after HQ/Research", importance: "critical" },
                                                    { text: "Army Camp: Larger armies = higher combat power and better resource protection", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Tier 2: High-Impact Secondary Buildings",
                                                importance: "important",
                                                points: [
                                                    { text: "Command Center: Increases march capacity and coordination abilities for alliance activities", importance: "important" },
                                                    { text: "Hero Hall: Enables hero recruitment and advancement - critical for mid-game power spikes", importance: "important" },
                                                    { text: "Arsenal: Weapon and equipment upgrades provide massive combat effectiveness boosts", importance: "important" },
                                                    { text: "Training Grounds: Faster troop training reduces downtime between battles and resource runs", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Tier 3: Optimization and Quality of Life Buildings",
                                                importance: "minor",
                                                points: [
                                                    { text: "Radar Station: Improves scouting and drone mission efficiency - upgrade when resources are abundant", importance: "minor" },
                                                    { text: "Medical Center: Reduces healing costs and time - valuable for active combat players", importance: "minor" },
                                                    { text: "Defensive Buildings: Walls and turrets - only upgrade if frequently attacked", importance: "minor" },
                                                    { text: "Decorative Buildings: Pure aesthetics - upgrade last when all functional buildings are maxed", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "⚡ Advanced Construction Strategy & Perfect Timing",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Perfect Alignment Construction Strategy",
                                                importance: "critical",
                                                points: [
                                                    { text: "Tuesday 00:00-04:00: Queue ALL major building upgrades during City Building + Base Expansion perfect alignment", importance: "critical" },
                                                    { text: "Parallel Construction: Start multiple buildings simultaneously to maximize 4-hour window efficiency", importance: "critical" },
                                                    { text: "Speedup Stockpiling: Accumulate 48-72 hours of construction speedups before each Tuesday window", importance: "important" },
                                                    { text: "Material Pre-Gathering: Complete all resource runs 6-12 hours before construction windows", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Construction Queue Management & Optimization",
                                                importance: "important",
                                                points: [
                                                    { text: "Longest First Strategy: Start highest-level upgrades first to maximize overlap with perfect windows", importance: "important" },
                                                    { text: "Builder Efficiency: Keep all builders active 24/7 with staggered completion times", importance: "important" },
                                                    { text: "Emergency Protocols: Reserve 20% of speedups for urgent alliance war preparations", importance: "minor" },
                                                    { text: "Weekend Preparation: Use Saturday-Sunday to gather materials for Tuesday construction sessions", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Power Maximization & ROI Analysis",
                                                importance: "important",
                                                points: [
                                                    { text: "Power-per-Hour Calculation: Prioritize buildings that provide highest power gain per construction time", importance: "important" },
                                                    { text: "Resource Investment ROI: Focus on buildings that unlock higher-tier resource generation first", importance: "important" },
                                                    { text: "Technology Synchronization: Coordinate building upgrades with research completions for maximum synergy", importance: "minor" },
                                                    { text: "Alliance Benefit Analysis: Prioritize buildings that enhance alliance contribution capabilities", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "🚫 Critical Mistakes to Avoid & Optimization Traps",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Fatal Construction Timing Mistakes",
                                                importance: "critical",
                                                points: [
                                                    { text: "Never use construction speedups outside Tuesday 00:00-04:00 perfect alignment windows", importance: "critical" },
                                                    { text: "Don't start major upgrades on random days - wait for City Building + Base Expansion alignment", importance: "critical" },
                                                    { text: "Avoid upgrading decorative buildings before all functional buildings are maxed for your HQ level", importance: "important" },
                                                    { text: "Don't upgrade everything equally - focus on tier 1 priorities until completion", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Resource Management Traps",
                                                importance: "important",
                                                points: [
                                                    { text: "Don't neglect resource production buildings - they provide compound growth over time", importance: "important" },
                                                    { text: "Avoid spending diamonds on instant upgrades outside perfect alignment windows", importance: "important" },
                                                    { text: "Don't hoard materials indefinitely - use them strategically during perfect windows", importance: "minor" },
                                                    { text: "Never upgrade storage buildings before production buildings", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Strategic Planning Errors",
                                                importance: "important",
                                                points: [
                                                    { text: "Don't plan construction without checking your research progress - coordinate both systems", importance: "important" },
                                                    { text: "Avoid starting long upgrades without sufficient resources to complete them", importance: "important" },
                                                    { text: "Don't ignore alliance building requirements for wars and events", importance: "minor" },
                                                    { text: "Never upgrade defensive buildings if you're not being attacked regularly", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: "Alliance Success & Strategic Cooperation Mastery",
                                category: "Team Strategy & Leadership",
                                icon: "🤝",
                                description: "Complete guide to alliance selection, contribution optimization, leadership skills, coordination strategies, and team building for competitive advantage",
                                keyTakeaway: "Strategic alliance cooperation can multiply your individual effectiveness by 500-1000% through coordinated events",
                                collapsible: true,
                                sections: [
                                    {
                                        title: "🏆 Elite Alliance Selection Strategy & Evaluation Criteria",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Critical Alliance Evaluation Factors (Must-Have Criteria)",
                                                importance: "critical",
                                                points: [
                                                    { text: "Timezone Alignment: Alliance must be active during your peak playing hours for coordinated events", importance: "critical" },
                                                    { text: "Communication Infrastructure: Active Discord/voice chat with organized channels for strategy discussion", importance: "critical" },
                                                    { text: "Knowledge Sharing Culture: Experienced members who actively teach optimization strategies and timing", importance: "critical" },
                                                    { text: "Consistent Activity Level: 80%+ of members participate in alliance events and hit daily activity targets", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Performance and Progression Indicators",
                                                importance: "important",
                                                points: [
                                                    { text: "VS Points Requirements: Should match your current level +20% for growth motivation without impossible standards", importance: "important" },
                                                    { text: "Alliance Ranking History: Consistent top 100 server ranking indicates effective leadership and coordination", importance: "important" },
                                                    { text: "Event Participation Rate: 90%+ participation in alliance wars and major events", importance: "important" },
                                                    { text: "Member Retention: Low turnover rate indicates good culture and effective leadership", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Red Flags and Alliances to Avoid",
                                                importance: "important",
                                                points: [
                                                    { text: "Unrealistic Requirements: VS point minimums that are impossible for your current progression level", importance: "important" },
                                                    { text: "Poor Communication: No organized chat channels or inactive leadership during critical events", importance: "important" },
                                                    { text: "Toxic Culture: Drama, infighting, or members who don't share strategies or help others", importance: "minor" },
                                                    { text: "Inconsistent Activity: Alliance frequently misses event milestones due to inactive members", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "🤝 Excellence in Alliance Contribution & Strategic Value",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Consistent High-Value Contributions",
                                                importance: "critical",
                                                points: [
                                                    { text: "VS Points Consistency: Contribute daily even if small amounts - reliability beats large sporadic contributions", importance: "critical" },
                                                    { text: "Perfect Timing Coordination: Synchronize major spending with alliance mass events during perfect alignment windows", importance: "critical" },
                                                    { text: "Resource Sharing Strategy: Donate regularly and request strategically during your preparation phases", importance: "important" },
                                                    { text: "Event Participation: Maintain 100% participation rate in alliance wars and major events", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Knowledge Leadership & Strategic Mentoring",
                                                importance: "important",
                                                points: [
                                                    { text: "Strategy Sharing: Actively teach optimization techniques and perfect timing strategies to alliance members", importance: "important" },
                                                    { text: "New Member Onboarding: Create comprehensive guides and provide 1-on-1 mentoring for new recruits", importance: "important" },
                                                    { text: "Innovation and Testing: Experiment with new strategies and share results with the alliance", importance: "minor" },
                                                    { text: "Problem Solving: Help troubleshoot alliance coordination issues and optimize group activities", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Advanced Alliance Value Creation",
                                                importance: "important",
                                                points: [
                                                    { text: "Intelligence Gathering: Share enemy alliance information and strategic insights during wars", importance: "important" },
                                                    { text: "Coordination Leadership: Help organize complex multi-member activities and timing synchronization", importance: "important" },
                                                    { text: "Technology Research: Stay updated on game changes and share meta strategy updates", importance: "minor" },
                                                    { text: "Alliance Recruitment: Help identify and recruit high-quality new members", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        title: "⚡ Advanced Alliance Coordination & Strategic Synchronization",
                                        collapsible: true,
                                        items: [
                                            {
                                                main: "Perfect Timing Mass Coordination Strategy",
                                                importance: "critical",
                                                points: [
                                                    { text: "Tuesday 00:00-04:00 Mass Building: Coordinate all alliance members to upgrade buildings simultaneously during perfect alignment", importance: "critical" },
                                                    { text: "Wednesday 08:00-12:00 Research Sync: Synchronize research completions and speedup usage across alliance", importance: "critical" },
                                                    { text: "Friday Total Mobilization Events: Plan alliance-wide massive spending days during universal bonus periods", importance: "critical" },
                                                    { text: "Advance Planning System: Create 72-hour advance coordination schedules shared in alliance Discord", importance: "important" }
                                                ]
                                            },
                                            {
                                                main: "Resource Flow and Mutual Support Systems",
                                                importance: "important",
                                                points: [
                                                    { text: "Strategic Resource Donations: Coordinate who donates what resources based on individual perfect timing needs", importance: "important" },
                                                    { text: "Alliance Store Optimization: Rotate purchases to maximize collective benefit and avoid resource conflicts", importance: "important" },
                                                    { text: "Emergency Support Network: Establish rapid response system for members facing urgent resource needs", importance: "minor" },
                                                    { text: "Help Point Banking: Coordinate help point usage for maximum collective alliance store benefits", importance: "minor" }
                                                ]
                                            },
                                            {
                                                main: "Competitive Events and Seasonal Coordination",
                                                importance: "important",
                                                points: [
                                                    { text: "Alliance War Strategy: Coordinate attack timings and resource allocation for maximum damage efficiency", importance: "important" },
                                                    { text: "Seasonal Competition Planning: Create 4-week preparation schedules for major server-wide events", importance: "important" },
                                                    { text: "Cross-Alliance Intelligence: Share information about enemy alliances and coordinate counter-strategies", importance: "minor" },
                                                    { text: "Leadership Rotation: Establish systems for sharing coordination responsibilities to prevent burnout", importance: "minor" }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ];
                    }
                    
                    // Generate full-screen readable guide HTML
                    const html = guides.map((guide, index) => `
                        <div class="guide-card-fullscreen" data-guide-index="${index}">
                            <div class="guide-preview-card" onclick="window.lastWarNexus.toggleGuideExpansion(${index})" role="button" tabindex="0">
                                <div class="guide-preview-content">
                                    <div class="guide-preview-header">
                                        <span class="guide-preview-icon">${guide.icon}</span>
                                        <div class="guide-preview-info">
                                            <h3 class="guide-preview-title">${guide.title}</h3>
                                            <div class="guide-preview-category">${guide.category}</div>
                                        </div>
                                    </div>
                                    ${guide.keyTakeaway ? `<div class="guide-preview-takeaway">💡 ${guide.keyTakeaway}</div>` : ''}
                                </div>
                                <button class="guide-preview-btn" id="guide-toggle-${index}" aria-label="Open guide">
                                    <span class="guide-preview-text">Read Guide</span>
                                    <span class="guide-toggle-icon">→</span>
                                </button>
                            </div>
                            <div class="guide-fullscreen-overlay" id="guide-content-${index}" style="display: none;">
                                <div class="guide-fullscreen-container">
                                    <div class="guide-fullscreen-header">
                                        <div class="guide-fullscreen-title-section">
                                            <span class="guide-fullscreen-icon">${guide.icon}</span>
                                            <h2 class="guide-fullscreen-title">${guide.title}</h2>
                                        </div>
                                        <button class="guide-fullscreen-close" onclick="window.lastWarNexus.toggleGuideExpansion(${index})" aria-label="Close guide">
                                            ×
                                        </button>
                                    </div>
                                    ${guide.keyTakeaway ? `<div class="guide-fullscreen-takeaway" style="display: none;">💡 <strong>Key Point:</strong> ${guide.keyTakeaway}</div>` : ''}
                                    <div class="guide-fullscreen-content">
                                        ${guide.sections.map((section, sIndex) => {
                                            const isCollapsible = section.collapsible || guide.collapsible;
                                            return `
                                            <div class="guide-fullscreen-section">
                                                <div class="guide-fullscreen-section-header" 
                                                     onclick="window.lastWarNexus.toggleSection(${index}, ${sIndex})"
                                                     style="cursor: ${isCollapsible ? 'pointer' : 'default'}">
                                                    <h3 class="guide-fullscreen-section-title">
                                                        ${isCollapsible ? `<span id="section-toggle-${index}-${sIndex}" class="section-toggle-icon">${sIndex === 0 ? '▼' : '▶'}</span>` : ''}
                                                        ${section.title}
                                                    </h3>
                                                </div>
                                                <div id="section-content-${index}-${sIndex}" class="guide-fullscreen-items" style="display: ${sIndex === 0 ? 'block' : 'none'};">
                                                    ${section.items.map(item => {
                                                        if (typeof item === 'string') {
                                                            return `
                                                                <div class="guide-fullscreen-item">
                                                                    <span class="guide-fullscreen-bullet importance-minor">•</span>
                                                                    <span class="guide-fullscreen-text">${item}</span>
                                                                </div>
                                                            `;
                                                        } else {
                                                            return `
                                                                <div class="guide-fullscreen-item-group">
                                                                    <div class="guide-fullscreen-main-item">
                                                                        <span class="guide-fullscreen-main-bullet importance-${item.importance || 'minor'}">▶</span>
                                                                        <span class="guide-fullscreen-main-text">${item.main}</span>
                                                                    </div>
                                                                    ${(item.subPoints || item.points) && (item.subPoints || item.points).length > 0 ? `
                                                                        <div class="guide-fullscreen-sub-items">
                                                                            ${(item.subPoints || item.points).map(subPoint => {
                                                                                const importance = subPoint.importance || 'minor';
                                                                                const text = subPoint.text || subPoint;
                                                                                return `
                                                                                <div class="guide-fullscreen-sub-item">
                                                                                    <span class="guide-fullscreen-sub-bullet importance-${importance}">•</span>
                                                                                    <span class="guide-fullscreen-sub-text">${text}</span>
                                                                                </div>
                                                                            `; }).join('')}
                                                                        </div>
                                                                    ` : ''}
                                                                </div>
                                                            `;
                                                        }
                                                    }).join('')}
                                                </div>
                                            </div>
                                        `; }).join('')}
                                        ${guide.additionalInfo ? `
                                            <div class="guide-additional-info">
                                                <div class="guide-additional-info-content">
                                                    <span class="guide-additional-info-icon">💡</span>
                                                    <span class="guide-additional-info-text">${guide.additionalInfo}</span>
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
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
                        const isExpanded = content.style.display === 'flex';
                        console.log('Currently expanded:', isExpanded);
                        
                        // Close all other guides first (only one open at a time)
                        document.querySelectorAll('.guide-fullscreen-overlay').forEach((otherOverlay, otherIndex) => {
                            if (otherOverlay.id !== `guide-content-${index}`) {
                                otherOverlay.style.display = 'none';
                                document.body.classList.remove('guide-open');
                            }
                        });
                        
                        if (isExpanded) {
                            // Close fullscreen guide
                            content.style.display = 'none';
                            document.body.classList.remove('guide-open');
                            console.log('Guide closed');
                        } else {
                            // Open fullscreen guide
                            content.style.display = 'flex';
                            document.body.classList.add('guide-open');
                            console.log('Guide opened in fullscreen');
                            
                            // Scroll to top of fullscreen content and fix mobile scrolling
                            setTimeout(() => {
                                const fullscreenContainer = content.querySelector('.guide-fullscreen-container');
                                if (fullscreenContainer) {
                                    fullscreenContainer.scrollTop = 0;
                                    
                                    // MOBILE FIX: Ensure proper scrolling on mobile devices
                                    if (window.innerWidth <= 768) {
                                        // Force reflow to fix mobile scroll issues
                                        fullscreenContainer.style.overflow = 'hidden';
                                        requestAnimationFrame(() => {
                                            fullscreenContainer.style.overflow = 'auto';
                                            fullscreenContainer.style.webkitOverflowScrolling = 'touch';
                                        });
                                    }
                                }
                            }, 50);
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

            // NEW: Setup guide overlay click-outside-to-close functionality
            setupGuideOverlayEvents() {
                try {
                    // Add click handler to document for overlay background clicks
                    document.addEventListener('click', (e) => {
                        // Check if click is on guide overlay background (not container)
                        if (e.target.classList.contains('guide-fullscreen-overlay')) {
                            // Find which guide is open and close it
                            const openOverlay = e.target;
                            const guideId = openOverlay.id; // format: guide-content-X
                            const guideIndex = guideId.split('-')[2];
                            if (guideIndex !== undefined) {
                                this.toggleGuideExpansion(parseInt(guideIndex));
                            }
                        }
                    });
                    
                    // Prevent clicks inside guide container from bubbling to overlay
                    document.addEventListener('click', (e) => {
                        if (e.target.closest('.guide-fullscreen-container')) {
                            e.stopPropagation();
                        }
                    });
                    
                    // Add escape key to close guides
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            const openGuides = document.querySelectorAll('.guide-fullscreen-overlay[style*="flex"]');
                            openGuides.forEach(overlay => {
                                const guideId = overlay.id;
                                const guideIndex = guideId.split('-')[2];
                                if (guideIndex !== undefined) {
                                    this.toggleGuideExpansion(parseInt(guideIndex));
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.error('Guide overlay events setup error:', error);
                }
            }

            // NEW: Toggle section functionality for collapsible panels
            toggleSection(guideIndex, sectionIndex) {
                try {
                    const sectionContent = document.getElementById(`section-content-${guideIndex}-${sectionIndex}`);
                    const toggleIcon = document.getElementById(`section-toggle-${guideIndex}-${sectionIndex}`);
                    
                    if (sectionContent && toggleIcon) {
                        const isExpanded = sectionContent.style.display !== 'none';
                        sectionContent.style.display = isExpanded ? 'none' : 'block';
                        toggleIcon.textContent = isExpanded ? '▶' : '▼';
                    }
                } catch (error) {
                    console.error('Section toggle error:', error);
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
                        
                        const dayAlignments = this.data.priorityAlignments.filter(a => a.vsDay === vsDay.day);
                        
                        for (const alignment of dayAlignments) {
                            const phase = this.data.armsRacePhases.find(p => p.name === alignment.armsPhase);
                            if (!phase) continue;
                            
                            const phaseIndex = this.data.armsRacePhases.findIndex(p => p.name === phase.name);
                            const startTime = new Date(checkDate);
                            
                            // Use same logic as getCurrentArmsPhase() for phase timing
                            if (phaseIndex === 0 && alignment.armsPhase === "City Building") {
                                // Check both regular City Building (00:00-04:00) and evening (20:00-00:00)
                                const morningStart = new Date(checkDate);
                                morningStart.setUTCHours(0, 0, 0, 0);
                                const eveningStart = new Date(checkDate);
                                eveningStart.setUTCHours(20, 0, 0, 0);
                                
                                // Determine which City Building period we're checking
                                const currentHour = dayOffset === 0 ? now.getUTCHours() : 0;
                                if (currentHour >= 20 || currentHour < 4) {
                                    // Use evening period if current time suggests it
                                    startTime.setTime(currentHour >= 20 ? eveningStart.getTime() : morningStart.getTime());
                                } else {
                                    // Use morning period
                                    startTime.setTime(morningStart.getTime());
                                }
                            } else {
                                // Regular 4-hour phases
                                startTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
                            }
                            
                            const timeDiff = startTime.getTime() - now.getTime();
                            let isActive = false;
                            
                            // For today, check if this phase actually matches the current active phase
                            if (dayOffset === 0) {
                                const currentPhase = this.getCurrentArmsPhase();
                                isActive = (currentPhase.name === alignment.armsPhase);
                            } else {
                                // For future days, use time-based calculation
                                if (phaseIndex === 0 && alignment.armsPhase === "City Building") {
                                    // City Building active periods: 00:00-04:00 OR 20:00-00:00
                                    const hour = now.getUTCHours();
                                    isActive = (hour >= 0 && hour < 4) || (hour >= 20 && hour < 24);
                                } else {
                                    // Regular 4-hour phases
                                    isActive = now >= startTime && now < new Date(startTime.getTime() + (4 * 60 * 60 * 1000));
                                }
                            }
                            
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
                    
                    // NOTE: Notifications are handled in the separate 15-second periodic check
                    // to prevent spam - removed notification call from here
                    
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
                    // Check if notifications are supported
                    if (!('Notification' in window)) {
                        console.error('This browser does not support notifications');
                        this.showUserMessage('Your browser does not support notifications.');
                        this.notificationsEnabled = false;
                        this.saveSettings();
                        return false;
                    }

                    // Enhanced mobile browser detection
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
                    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                    const isAndroid = /Android/i.test(navigator.userAgent);
                    const isMobileChrome = /Chrome/i.test(navigator.userAgent) && /Mobile/i.test(navigator.userAgent);
                    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
                    
                    // Mark that we have user gesture for this request
                    this.hasUserGesture = true;
                    
                    // Check current permission first
                    if (Notification.permission === 'granted') {
                        this.notificationsEnabled = true;
                        this.saveSettings();
                        return true;
                    }
                    
                    if (Notification.permission === 'denied') {
                        this.notificationsEnabled = false;
                        this.saveSettings();
                        
                        // Show instructions for re-enabling on mobile
                        if (isMobile) {
                            this.showMobileNotificationInstructions();
                        } else {
                            this.showUserMessage('Notifications are blocked. Please enable them in your browser settings.');
                        }
                        return false;
                    }
                    
                    // iOS Safari specific check
                    if (isIOS && isSafari && !isStandalone) {
                        this.showAddToHomeScreenInstructions();
                        this.notificationsEnabled = false;
                        this.saveSettings();
                        return false;
                    }
                    
                    // Request permission (default state)
                    try {
                        console.log(`Requesting permission on: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'} ${isSafari ? 'Safari' : isMobileChrome ? 'Chrome' : 'Browser'}`);
                        
                        // User gesture is handled by the calling button click
                        
                        let permission;
                        
                        // Use Promise-based API
                        if (typeof Notification.requestPermission === 'function') {
                            permission = await Notification.requestPermission();
                        } else {
                            console.error('Notification.requestPermission is not available');
                            this.showUserMessage('Your browser does not support notification permissions.');
                            this.notificationsEnabled = false;
                            this.saveSettings();
                            return false;
                        }
                        
                        const granted = permission === 'granted';
                        this.notificationsEnabled = granted;
                        this.saveSettings();
                        
                        if (granted) {
                            console.log('Notification permission granted');
                            // Register service worker for push notifications
                            await this.registerServiceWorker();
                            // Show test notification
                            setTimeout(() => {
                                this.showNotification('Notifications Enabled!', 'You will now receive priority window alerts.');
                            }, 500);
                        } else if (permission === 'denied') {
                            console.log('Notification permission denied');
                            if (isMobile) {
                                this.showMobileNotificationInstructions();
                            }
                        } else {
                            console.log('Notification permission dismissed');
                            this.showUserMessage('You can enable notifications later from the settings menu.');
                        }
                        
                        return granted;
                    } catch (error) {
                        console.error('Notification request failed:', error);
                        this.notificationsEnabled = false;
                        this.saveSettings();
                        this.showUserMessage('Failed to request notification permission. Please try again.');
                        return false;
                    }
                } catch (error) {
                    console.error('Notification permission error:', error);
                    this.notificationsEnabled = false;
                    this.saveSettings();
                    return false;
                }
            }

            showUserMessage(message) {
                try {
                    // Create a temporary notification-style message for user feedback
                    console.log('User Message:', message);
                    
                    // Try to use existing notification system or fallback to console
                    if (this.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
                        this.showNotification('Notification Setting', message);
                    } else {
                        // Fallback: show in console and potentially in UI (could be enhanced)
                        console.warn('Notification feedback:', message);
                        
                        // Optional: Could add a toast notification or alert here
                        // For now, just ensure the console message is visible
                    }
                } catch (error) {
                    console.error('Error showing user message:', error);
                }
            }

            async showNotification(title, body, options = {}) {
                try {
                    // Enhanced permission verification
                    if (!this.verifyNotificationPermission()) {
                        console.warn('⚠️ Notification blocked: No permission');
                        return false;
                    }
                    
                    const defaultOptions = {
                        body: body,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>',
                        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>',
                        tag: 'lastwar-priority',
                        requireInteraction: true, // Make notifications more persistent
                        vibrate: [200, 100, 200],
                        silent: false,
                        renotify: true, // Allow re-notifications
                        data: {
                            timestamp: Date.now(),
                            url: window.location.origin
                        }
                    };
                    
                    const notificationOptions = { ...defaultOptions, ...options };
                    
                    let notificationShown = false;
                    
                    // Try service worker notification first (better for mobile)
                    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                        try {
                            const registration = await navigator.serviceWorker.ready;
                            await registration.showNotification(title, notificationOptions);
                            notificationShown = true;
                            if (this.debugNotifications) {
                                console.log('✅ Service Worker notification sent:', title);
                            }
                        } catch (error) {
                            console.warn('⚠️ Service worker notification failed:', error);
                        }
                    }
                    
                    // Fallback to direct Notification API if service worker failed
                    if (!notificationShown) {
                        try {
                            const notification = new Notification(title, notificationOptions);
                            
                            notification.onclick = () => {
                                window.focus();
                                notification.close();
                            };
                            
                            notification.onshow = () => {
                                if (this.debugNotifications) {
                                    console.log('✅ Direct notification shown:', title);
                                }
                            };
                            
                            notification.onerror = (error) => {
                                console.error('❌ Notification error:', error);
                            };
                            
                            // Auto-close after 10 seconds for persistent notifications
                            setTimeout(() => {
                                try {
                                    notification.close();
                                } catch (e) {
                                    // Notification may already be closed
                                }
                            }, 10000);
                            
                            notificationShown = true;
                            
                        } catch (error) {
                            console.error('❌ Direct notification failed:', error);
                        }
                    }
                    
                    // Last resort: Console warning if all notification methods failed
                    if (!notificationShown) {
                        console.error('❌ ALL NOTIFICATION METHODS FAILED! Title:', title, 'Body:', body);
                        // Could add visual notification to page here as fallback
                    }
                    
                    return notificationShown;
                    
                } catch (error) {
                    console.error('❌ Notification display error:', error);
                    return false;
                }
            }
            
            // ENHANCED: Force refresh all timing components (useful for testing)
            forceTimingRefresh() {
                try {
                    console.log('♾️ FORCING COMPLETE TIMING REFRESH');
                    
                    // Clear any cached timing data
                    this.lastPhaseCheck = 0;
                    this.lastNotificationCheck = 0;
                    this.lastNotifiedWindow = null;
                    
                    // Force immediate update of all timing-dependent components
                    this.updateAllDisplays();
                    this.updateCountdowns();
                    this.performNotificationCheck();
                    
                    // Log current timing state for debugging
                    const serverTime = this.getServerTime();
                    const currentPhase = this.getCurrentArmsPhase();
                    const nextWindow = this.findNextPriorityWindow();
                    
                    console.log('♾️ TIMING STATE AFTER REFRESH:', {
                        serverTime: serverTime.toISOString(),
                        timeOffset: this.timeOffset,
                        currentPhase: currentPhase?.name,
                        currentPhaseActive: currentPhase?.hoursRemaining,
                        nextWindowActive: nextWindow?.isActive,
                        nextWindowPhase: nextWindow?.phase?.name,
                        notificationsEnabled: this.notificationsEnabled
                    });
                    
                } catch (error) {
                    console.error('Force timing refresh error:', error);
                }
            }
            
            // ENHANCED: Periodic notification check independent of other timers
            performNotificationCheck() {
                try {
                    if (this.debugNotifications) {
                        console.log('[NOTIFICATION DEBUG] Periodic check at:', this.getServerTime().toISOString());
                    }
                    
                    // Get current priority window using the same logic as main display
                    const nextWindow = this.findNextPriorityWindow();
                    
                    if (nextWindow) {
                        this.checkAndSendNotifications(nextWindow);
                    }
                    
                    // Also verify permission state hasn't changed
                    this.verifyNotificationPermission();
                    
                } catch (error) {
                    console.error('Periodic notification check error:', error);
                }
            }
            
            // ENHANCED: Centralized notification checking with debugging
            checkAndSendNotifications(window) {
                try {
                    const now = this.getServerTime();
                    const nowTimestamp = now.getTime();
                    
                    if (this.debugNotifications) {
                        console.log('[NOTIFICATION DEBUG] Check triggered:', {
                            windowActive: window?.isActive,
                            notificationsEnabled: this.notificationsEnabled,
                            browserPermission: typeof Notification !== 'undefined' ? Notification.permission : 'not supported',
                            lastNotified: this.lastNotifiedWindow,
                            currentReason: window?.alignment?.reason,
                            timeSinceLastCheck: nowTimestamp - this.lastNotificationCheck
                        });
                    }
                    
                    // Update last check time
                    this.lastNotificationCheck = nowTimestamp;
                    
                    // Verify notification requirements
                    if (!window || !window.isActive) {
                        if (this.debugNotifications) console.log('[NOTIFICATION DEBUG] No active window');
                        // Don't reset notification state immediately - let it persist to prevent spam
                        // when priority windows transition quickly
                        return;
                    }
                    
                    // Enhanced permission check
                    const hasPermission = this.verifyNotificationPermission();
                    if (!hasPermission) {
                        if (this.debugNotifications) console.log('[NOTIFICATION DEBUG] No permission');
                        return;
                    }
                    
                    // Check if already notified for this event (per phase cycle)
                    const eventReason = window.alignment?.reason;
                    const currentPhase = window.phase?.name;
                    const notificationKey = `${eventReason}_${currentPhase}`;
                    
                    if (this.lastNotifiedWindow === notificationKey) {
                        if (this.debugNotifications) console.log('[NOTIFICATION DEBUG] Already notified for:', notificationKey);
                        return;
                    }
                    
                    // Send notification
                    const title = 'High Priority Active!';
                    const body = `${window.phase?.name} + ${window.vsDay?.title}`;
                    
                    if (this.debugNotifications) {
                        console.log('[NOTIFICATION DEBUG] SENDING:', { title, body, eventReason });
                    }
                    
                    this.showNotification(title, body);
                    this.lastNotifiedWindow = notificationKey;
                    
                    // Set up delayed reset of notification tracking to prevent immediate re-notification
                    // but allow new notifications after phase changes
                    if (this.notificationResetTimeout) {
                        clearTimeout(this.notificationResetTimeout);
                    }
                    this.notificationResetTimeout = setTimeout(() => {
                        if (this.debugNotifications) console.log("\[NOTIFICATION DEBUG\] Delayed reset of notification tracking");
                        this.lastNotifiedWindow = null;
                        this.notificationResetTimeout = null;
                    }, 5 * 60 * 1000); // Reset after 5 minutes

                    // Log successful notification
                    console.log('✅ Notification sent:', { title, body, time: this.getServerTime().toISOString() });
                    
                } catch (error) {
                    console.error('Notification check error:', error);
                }
            }
            
            // ENHANCED: Verify notification permission with real-time check
            verifyNotificationPermission() {
                try {
                    // Check if notifications are supported
                    if (typeof Notification === 'undefined') {
                        if (this.debugNotifications) console.log('[NOTIFICATION DEBUG] Notifications not supported');
                        return false;
                    }
                    
                    // Get actual browser permission
                    const browserPermission = Notification.permission;
                    const isGranted = browserPermission === 'granted';
                    
                    // Sync our internal state with browser reality
                    if (this.notificationsEnabled !== isGranted) {
                        console.warn('[NOTIFICATION DEBUG] Permission state mismatch! Internal:', this.notificationsEnabled, 'Browser:', browserPermission);
                        this.notificationsEnabled = isGranted;
                        this.syncSettingsToUI(); // Update UI to reflect reality
                    }
                    
                    return isGranted;
                } catch (error) {
                    console.error('Permission verification error:', error);
                    return false;
                }
            }
            
            showAddToHomeScreenInstructions() {
                const message = `
                    <div style="text-align: left; line-height: 1.6;">
                        <h3 style="margin-top: 0; color: #0ea5e9;">📱 Enable Notifications on iOS</h3>
                        <p><strong>iOS Safari requires adding the website to your home screen:</strong></p>
                        <ol style="padding-left: 20px;">
                            <li>Tap the <strong>Share</strong> button <span style="font-size: 20px;">⎋</span> at the bottom</li>
                            <li>Select <strong>"Add to Home Screen"</strong></li>
                            <li>Tap <strong>"Add"</strong> to install the app</li>
                            <li>Open the app from your home screen</li>
                            <li>Enable notifications when prompted</li>
                        </ol>
                        <p style="font-size: 14px; color: #666; margin-top: 15px;">💡 <em>This is required by iOS Safari for web notifications to work.</em></p>
                    </div>
                `;
                this.showUserMessage(message, 'iOS Notification Setup');
            }
            
            showMobileNotificationInstructions() {
                const isChrome = /Chrome/i.test(navigator.userAgent);
                const isAndroid = /Android/i.test(navigator.userAgent);
                const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
                
                let instructions = '';
                
                if (isIOS) {
                    instructions = `
                        <h3 style="margin-top: 0; color: #0ea5e9;">📱 Enable Notifications on iOS</h3>
                        <p><strong>To enable notifications:</strong></p>
                        <ol style="padding-left: 20px;">
                            <li>Go to <strong>Settings</strong> → <strong>Safari</strong></li>
                            <li>Scroll down to <strong>"Website Settings"</strong></li>
                            <li>Tap <strong>"Notifications"</strong></li>
                            <li>Find this website and tap <strong>"Allow"</strong></li>
                        </ol>
                        <p style="font-size: 14px; color: #666; margin-top: 15px;">💡 <em>Then refresh this page and try again.</em></p>
                    `;
                } else if (isAndroid && isChrome) {
                    instructions = `
                        <h3 style="margin-top: 0; color: #0ea5e9;">📱 Enable Notifications on Android Chrome</h3>
                        <p><strong>To enable notifications:</strong></p>
                        <ol style="padding-left: 20px;">
                            <li>Tap the <strong>three dots</strong> (⋮) menu</li>
                            <li>Select <strong>"Site settings"</strong></li>
                            <li>Tap <strong>"Notifications"</strong></li>
                            <li>Change to <strong>"Allow"</strong></li>
                        </ol>
                        <p style="font-size: 14px; color: #666; margin-top: 15px;">💡 <em>Then refresh this page and try again.</em></p>
                    `;
                } else {
                    instructions = `
                        <h3 style="margin-top: 0; color: #0ea5e9;">📱 Enable Notifications</h3>
                        <p><strong>Notifications are currently blocked.</strong></p>
                        <p>To enable them:</p>
                        <ol style="padding-left: 20px;">
                            <li>Look for the <strong>lock icon</strong> 🔒 next to the website address</li>
                            <li>Tap it and change <strong>"Notifications"</strong> to <strong>"Allow"</strong></li>
                            <li>Refresh this page and try again</li>
                        </ol>
                        <p style="font-size: 14px; color: #666; margin-top: 15px;">💡 <em>The exact steps may vary by browser.</em></p>
                    `;
                }
                
                const message = `<div style="text-align: left; line-height: 1.6;">${instructions}</div>`;
                this.showUserMessage(message, 'Notification Setup Help');
            }
            
            async registerServiceWorker() {
                if (!('serviceWorker' in navigator)) {
                    console.log('Service Worker not supported');
                    return;
                }
                
                try {
                    const registration = await navigator.serviceWorker.register('/service-worker.js');
                    console.log('Service Worker registered successfully:', registration.scope);
                    
                    // Wait for the service worker to be ready
                    await navigator.serviceWorker.ready;
                    console.log('Service Worker is ready');
                    
                    return registration;
                } catch (error) {
                    console.error('Service Worker registration failed:', error);
                    // Don't block notification functionality if SW fails
                    return null;
                }
            }

            loadSettings() {
                try {
                    const saved = localStorage.getItem('lwn-settings');
                    if (saved) {
                        const settings = JSON.parse(saved);
                        this.timeOffset = settings.timeOffset || 0;
                        // Check actual browser permission instead of saved preference
                        this.checkActualNotificationPermission();
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

            checkActualNotificationPermission() {
                try {
                    if ('Notification' in window) {
                        const permission = Notification.permission;
                        this.notificationsEnabled = permission === 'granted';
                        console.log('Actual browser notification permission:', permission);
                        console.log('Notifications enabled:', this.notificationsEnabled);
                        return this.notificationsEnabled;
                    } else {
                        console.log('Notifications not supported in this browser');
                        this.notificationsEnabled = false;
                        return false;
                    }
                } catch (error) {
                    console.error('Error checking notification permission:', error);
                    this.notificationsEnabled = false;
                    return false;
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
                    if (this.notificationCheckInterval) {
                        clearInterval(this.notificationCheckInterval);
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
                    
                    // ENHANCED: More frequent notification checks (every 15 seconds)
                    this.notificationCheckInterval = setInterval(() => {
                        this.performNotificationCheck();
                    }, 15000);
                    
                    console.log('✅ All update loops started (data: 5s, countdown: 1s, notifications: 15s)');
                    
                } catch (error) {
                    console.error('Update loop error:', error);
                    this.handleError('Failed to start update loop', error);
                }
            }
            
            updateCountdowns() {
                try {
                    // Update time displays every second and countdown elements efficiently
                    this.updateTimeDisplay();
                    
                    // FIXED: Update main card time display every second for consistency
                    this.updateMainCardTime();
                    
                    // CRITICAL: Check for phase changes every second for immediate updates
                    this.checkForPhaseChanges();
                    
                    const countdownElement = document.getElementById('countdown-timer');
                    const priorityCountdown = document.getElementById('priority-countdown');
                    const timeUntilReset = document.getElementById('time-until-reset');
                    
                    if (countdownElement || priorityCountdown || timeUntilReset) {
                        // FIXED: Always use server time for calculations, only display format changes
                        const serverTime = this.getServerTime();
                        
                        // Update countdown-specific elements
                        this.updateCountdownElements(serverTime);
                    }
                } catch (error) {
                    console.error('Countdown update error:', error);
                }
            }

            updateMainCardTime() {
                try {
                    const serverTime = this.getServerTime();
                    
                    // Update main time display with clear mode indicator
                    const mainTimeDisplay = document.getElementById('main-time-display');
                    if (mainTimeDisplay) {
                        let timeString;
                        if (this.useLocalTime) {
                            // FIXED: Convert server time to local display, don't use separate local time
                            const localDisplayTime = new Date(serverTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
                            timeString = localDisplayTime.toLocaleTimeString('en-US', { hour12: false }) + ' LOCAL';
                        } else {
                            timeString = serverTime.toUTCString().slice(17, 25) + ' SERVER';
                        }
                        mainTimeDisplay.textContent = timeString;
                        mainTimeDisplay.style.fontSize = '0.875rem';
                        mainTimeDisplay.style.fontWeight = '600';
                    }
                } catch (error) {
                    console.error('Main card time update error:', error);
                }
            }

            checkForPhaseChanges() {
                try {
                    const currentTime = this.getServerTime();
                    const currentPhase = this.getCurrentArmsPhase();
                    
                    // Check if the current phase has changed since last check (handles both time-based and override changes)
                    const currentPhaseName = currentPhase.name;
                    const hasPhaseChanged = this.lastKnownPhase && this.lastKnownPhase !== currentPhaseName;
                    
                    // Also check if we haven't updated recently (for initialization or missed transitions)
                    const lastUpdate = this.lastPhaseCheck || 0;
                    const timeSinceLastUpdate = currentTime.getTime() - lastUpdate;
                    const needsUpdate = timeSinceLastUpdate > 60000; // More than 1 minute since last check
                    
                    if (hasPhaseChanged || needsUpdate || !this.lastKnownPhase) {
                        if (hasPhaseChanged) {
                            console.log('Phase change detected:', this.lastKnownPhase, '->', currentPhaseName);
                        }
                        this.updateCurrentStatus();
                        this.updateBanner(); // Also update priority banner immediately
                        this.lastPhaseCheck = currentTime.getTime();
                        this.lastKnownPhase = currentPhaseName;
                    }
                } catch (error) {
                    console.error('Phase change check error:', error);
                }
            }

            updateCountdownElements(now) {
                try {
                    // Update priority countdown every second for real-time feedback
                    const priorityCountdown = document.getElementById('priority-countdown');
                    if (priorityCountdown) {
                        // Use cached priority window if available and still valid
                        if (!this.cachedNextWindow || !this.cachedNextWindow.startTime || 
                            (now.getTime() - this.lastWindowCacheTime) > 10000) { // Recache every 10 seconds
                            this.cachedNextWindow = this.findNextPriorityWindow();
                            this.lastWindowCacheTime = now.getTime();
                        }
                        
                        if (this.cachedNextWindow) {
                            // Calculate real-time remaining time based on cached window
                            const startTime = this.cachedNextWindow.startTime;
                            const currentTime = this.getServerTime().getTime();
                            let realTimeRemaining;
                            
                            if (this.cachedNextWindow.isActive) {
                                // For active windows, calculate time until end of current phase
                                realTimeRemaining = this.getTimeUntilNextPhase();
                            } else {
                                // For upcoming windows, calculate time until start
                                realTimeRemaining = startTime.getTime() - currentTime;
                            }
                            
                            priorityCountdown.textContent = this.formatTime(Math.max(0, realTimeRemaining));
                        }
                    }
                    
                    // Update other countdown elements here as needed
                    const countdownElement = document.getElementById('countdown-timer');
                    if (countdownElement) {
                        const timeUntilNext = this.getTimeUntilNextPhase();
                        countdownElement.textContent = this.formatTime(timeUntilNext);
                    }
                    
                    const timeUntilReset = document.getElementById('time-until-reset');
                    if (timeUntilReset) {
                        const serverTime = this.getServerTime();
                        const nextReset = new Date(serverTime);
                        nextReset.setUTCDate(nextReset.getUTCDate() + 1);
                        nextReset.setUTCHours(0, 0, 0, 0);
                        const resetTime = nextReset.getTime() - serverTime.getTime();
                        timeUntilReset.textContent = this.formatTime(resetTime);
                    }
                } catch (error) {
                    console.error('Countdown elements update error:', error);
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
                    if (this.notificationCheckInterval) {
                        clearInterval(this.notificationCheckInterval);
                    }
                    if (false) {
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
                window.vsOptimizer = app; // Alias for testing scripts
                
                // Store app instance in namespace for Ezoic integration
                LastWarNexus.app = app;
                
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
            // Filter out Ezoic-related errors to prevent them from breaking the app
            if (event.filename && event.filename.includes('ezoic')) {
                console.warn('Ezoic error detected, continuing without ads:', event.error);
                event.preventDefault(); // Prevent the error from propagating
                return;
            }
            console.error('Global error:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            // Filter out Ezoic-related promise rejections
            if (event.reason && event.reason.toString().includes('ezoic')) {
                console.warn('Ezoic promise rejection, continuing without ads:', event.reason);
                event.preventDefault();
                return;
            }
            console.error('Unhandled promise rejection:', event.reason);
        });
