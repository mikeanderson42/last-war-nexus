/**
 * Last War Nexus - VS Points & Arms Race Optimizer
 * COMPREHENSIVE WORKING VERSION - All fixes integrated
 */

console.log('🚀 Loading comprehensive working version...');

class VSPointsOptimizer {
    constructor() {
        console.log('✅ VSPointsOptimizer constructor');
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
        this.notificationHistory = {};
        this.advanceWarningMinutes = 15;
        
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
    }

    init() {
        console.log('✅ VSPointsOptimizer init starting...');
        try {
            this.loadSettings();
            this.setupEventListeners();
            this.populateTabContent();
            
            const hasStoredSettings = localStorage.getItem('lwn-settings');
            console.log('Setup check:', { hasStoredSettings, isSetupComplete: this.isSetupComplete });
            
            if (!hasStoredSettings || !this.isSetupComplete) {
                console.log('Showing setup modal');
                setTimeout(() => {
                    this.showSetupModal();
                    this.updateSetupTime();
                    this.startSetupTimeUpdates();
                }, 500);
            } else {
                console.log('Setup complete, starting normal operation');
                
                // Comprehensive initialization for returning users
                setTimeout(() => {
                    this.updateAllDisplays();
                    this.populatePriorityContent();
                    this.populateScheduleContent();
                    this.populateGuides();
                    this.populateBanner();
                    this.ensureAllNavigation();
                    this.startUpdateLoop();
                    console.log('✅ Normal operation initialization complete');
                }, 200);
            }
        } catch (error) {
            console.error('Init error:', error);
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
                this.advanceWarningMinutes = settings.advanceWarningMinutes || 15;
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
                useLocalTime: this.useLocalTime,
                advanceWarningMinutes: this.advanceWarningMinutes
            };
            localStorage.setItem('lwn-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Settings save error:', error);
        }
    }

    populateTabContent() {
        console.log('✅ Populating tab content...');
        try {
            // Priority tab content - target the specific content area
            this.populatePriorityContent();
            
            // Schedule tab content - target the specific content area  
            this.populateScheduleContent();

            // Guides content (target the guides-content div, not the whole tab)
            const guidesContent = document.getElementById('guides-content');
            if (guidesContent) {
                this.populateGuides();
            }
            
            // Populate banner content
            this.populateBanner();

            console.log('✅ Tab content populated');
        } catch (error) {
            console.error('Tab content population error:', error);
        }
    }

    setupEventListeners() {
        if (this.eventListenersSetup) return;
        
        console.log('✅ Setting up event listeners');
        try {
            // Setup modal events
            const setupComplete = document.getElementById('setup-complete');
            if (setupComplete) {
                console.log('✅ Setup complete button found, adding listener');
                setupComplete.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ Setup complete button clicked');
                    this.completeSetup();
                });
            } else {
                console.error('❌ Setup complete button not found');
            }

            const setupSkip = document.getElementById('setup-skip');
            if (setupSkip) {
                console.log('✅ Setup skip button found, adding listener');
                setupSkip.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ Setup skip button clicked');
                    this.skipSetup();
                });
            } else {
                console.error('❌ Setup skip button not found');
            }

            // Settings toggle with improved functionality
            const settingsToggle = document.getElementById('settings-toggle');
            if (settingsToggle) {
                settingsToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown('settings');
                });
            }


            // Time toggle
            const timeToggleBtn = document.getElementById('time-toggle-btn');
            if (timeToggleBtn) {
                timeToggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleTimeMode();
                });
            }

            // Tab navigation with proper display control
            const tabButtons = document.querySelectorAll('.tab-btn');
            tabButtons.forEach(btn => {
                const tab = btn.getAttribute('data-tab');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Tab button clicked:', tab);
                    if (tab) this.switchTab(tab);
                });
            });
            
            // Guide navigation buttons
            const guideButtons = document.querySelectorAll('.guide-nav-btn');
            console.log('✅ Found', guideButtons.length, 'guide navigation buttons');
            guideButtons.forEach(btn => {
                const guideType = btn.getAttribute('data-guide-type');
                console.log('Setting up guide button:', guideType);
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('✅ Guide button clicked:', guideType);
                    if (guideType) this.switchGuideType(guideType);
                });
            });
            
            if (guideButtons.length === 0) {
                console.error('❌ No guide navigation buttons found! Checking in 1 second...');
                setTimeout(() => {
                    const delayedButtons = document.querySelectorAll('.guide-nav-btn');
                    console.log('Delayed check found', delayedButtons.length, 'guide buttons');
                    delayedButtons.forEach(btn => {
                        const guideType = btn.getAttribute('data-guide-type');
                        if (!btn.hasAttribute('data-listener-added')) {
                            btn.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('✅ Delayed guide button clicked:', guideType);
                                if (guideType) this.switchGuideType(guideType);
                            });
                            btn.setAttribute('data-listener-added', 'true');
                        }
                    });
                }, 1000);
            }

            // Close dropdowns when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.settings-dropdown-container')) {
                    this.closeAllDropdowns();
                }
            });

            this.eventListenersSetup = true;
        } catch (error) {
            console.error('Event listener setup error:', error);
        }
    }

    showSetupModal() {
        console.log('✅ Showing setup modal');
        const modal = document.getElementById('setup-modal');
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            modal.style.zIndex = '10000';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            
            // Update setup time immediately
            this.updateSetupTime();
            
            // Ensure setup button listeners are attached (backup)
            setTimeout(() => {
                this.ensureSetupButtonListeners();
            }, 100);
        } else {
            console.error('❌ Setup modal not found');
        }
    }

    hideSetupModal() {
        console.log('✅ Hiding setup modal');
        const modal = document.getElementById('setup-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        }
        
        // Stop setup time updates
        if (this.setupTimeInterval) {
            clearInterval(this.setupTimeInterval);
            this.setupTimeInterval = null;
        }
    }

    async completeSetup() {
        console.log('✅ completeSetup() called');
        try {
            const setupTimeOffset = document.getElementById('setup-time-offset');
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            const setupNextPhase = document.getElementById('setup-next-phase');
            const notificationRadios = document.querySelectorAll('input[name="notifications"]');

            console.log('Setup form values:', {
                timeOffset: setupTimeOffset?.value,
                currentPhase: setupCurrentPhase?.value,
                nextPhase: setupNextPhase?.value,
                notificationRadios: notificationRadios.length
            });

            // Validate required fields
            if (!setupTimeOffset?.value) {
                console.error('Missing timezone offset');
                alert('Please select a timezone adjustment');
                return;
            }
            if (!setupCurrentPhase?.value) {
                console.error('Missing current phase');
                alert('Please select the current Arms Race phase');
                return;
            }
            if (!setupNextPhase?.value) {
                console.error('Missing next phase');
                alert('Please select the next Arms Race phase');
                return;
            }

            this.timeOffset = parseFloat(setupTimeOffset.value);
            this.currentPhaseOverride = setupCurrentPhase.value;
            this.nextPhaseOverride = setupNextPhase.value;

            console.log('Setting values:', {
                timeOffset: this.timeOffset,
                currentPhaseOverride: this.currentPhaseOverride,
                nextPhaseOverride: this.nextPhaseOverride
            });

            const notificationChoice = Array.from(notificationRadios).find(r => r.checked)?.value;
            const wantsNotifications = notificationChoice === 'enabled';

            console.log('Notification choice:', notificationChoice, 'wants:', wantsNotifications);

            if (wantsNotifications) {
                console.log('Requesting notification permission...');
                await this.requestNotificationPermission();
            } else {
                this.notificationsEnabled = false;
            }

            this.isSetupComplete = true;
            this.saveSettings();

            console.log('✅ Setup completed successfully, hiding modal');
            this.hideSetupModal();
            
            // Comprehensive post-setup initialization
            setTimeout(() => {
                console.log('✅ Running post-setup initialization...');
                
                // Update all displays first
                this.updateAllDisplays();
                
                // Populate all content areas
                this.populatePriorityContent();
                this.populateScheduleContent();
                this.populateGuides();
                this.populateBanner();
                
                // Ensure navigation works
                this.ensureAllNavigation();
                
                // Start the update loop
                this.startUpdateLoop();
                
                console.log('✅ Post-setup initialization complete');
            }, 300);

        } catch (error) {
            console.error('Setup completion error:', error);
            alert('Setup failed: ' + error.message);
        }
    }

    skipSetup() {
        console.log('✅ Skipping setup');
        this.isSetupComplete = true;
        this.saveSettings();
        this.hideSetupModal();
        this.updateAllDisplays();
        this.startUpdateLoop();
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

    toggleDropdown(type) {
        console.log('✅ Toggle dropdown:', type);
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
        } else {
            console.log('Dropdown or toggle not found:', type);
        }
    }
    
    // Ensure dropdown stays within viewport bounds
    positionDropdownSafely(dropdown, toggle) {
        try {
            const toggleRect = toggle.getBoundingClientRect();
            const dropdownWidth = 320; // Default width
            const viewportWidth = window.innerWidth;
            const margin = 16; // Minimum margin from edge
            
            // Calculate safe left position
            let leftPos = toggleRect.right - dropdownWidth;
            
            // Ensure dropdown doesn't go off left edge
            if (leftPos < margin) {
                leftPos = margin;
            }
            
            // Ensure dropdown doesn't go off right edge
            if (leftPos + dropdownWidth > viewportWidth - margin) {
                leftPos = viewportWidth - dropdownWidth - margin;
            }
            
            // Apply safe position
            dropdown.style.left = `${leftPos}px`;
            dropdown.style.right = 'auto';
            
            // For mobile, center the dropdown
            if (viewportWidth <= 480) {
                dropdown.style.left = '50%';
                dropdown.style.transform = 'translateX(-50%)';
                dropdown.style.width = `${viewportWidth - (margin * 2)}px`;
                dropdown.style.maxWidth = '320px';
            }
        } catch (error) {
            console.error('Error positioning dropdown:', error);
        }
    }

    closeAllDropdowns() {
        // Close settings dropdown
        const settingsDropdown = document.getElementById('settings-dropdown');
        const settingsToggle = document.getElementById('settings-toggle');
        if (settingsDropdown) {
            settingsDropdown.classList.remove('active');
            settingsDropdown.style.transform = '';
            settingsDropdown.style.left = '';
            settingsDropdown.style.width = '';
            settingsDropdown.style.maxWidth = '';
        }
        if (settingsToggle) {
            settingsToggle.classList.remove('active');
            settingsToggle.setAttribute('aria-expanded', 'false');
        }
    }

    toggleTimeMode() {
        console.log('✅ Toggle time mode');
        this.useLocalTime = !this.useLocalTime;
        this.saveSettings();
        
        // Update button label
        const timeToggleLabel = document.getElementById('time-toggle-label');
        if (timeToggleLabel) {
            timeToggleLabel.textContent = this.useLocalTime ? 'Local Time' : 'Server Time';
        }
        
        this.updateAllDisplays();
    }

    switchTab(tabName) {
        console.log('✅ Switch tab:', tabName);
        try {
            // Hide all panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.style.display = 'none';
                panel.classList.remove('active');
            });
            
            // Show the selected panel
            const activePanel = document.getElementById(tabName + '-tab');
            if (activePanel) {
                activePanel.style.display = 'block';
                activePanel.classList.add('active');
                console.log('Showing panel:', tabName + '-tab');
            } else {
                console.error('Panel not found:', tabName + '-tab');
            }

            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
                activeBtn.setAttribute('aria-selected', 'true');
                console.log('Activated button for:', tabName);
            } else {
                console.error('Button not found for:', tabName);
            }

            this.activeTab = tabName;
            
            // Force re-populate content for this tab and ensure visibility
            setTimeout(() => {
                console.log('✅ Re-populating content for active tab:', tabName);
                if (tabName === 'priority') {
                    this.populatePriorityContent();
                } else if (tabName === 'schedule') {
                    this.populateScheduleContent();
                } else if (tabName === 'guides') {
                    this.populateGuides();
                    
                    // Ensure guide navigation buttons are set up
                    setTimeout(() => {
                        const guideButtons = document.querySelectorAll('.guide-nav-btn');
                        console.log('📚 Setting up guide buttons after guides tab switch:', guideButtons.length);
                        guideButtons.forEach(btn => {
                            if (!btn.hasAttribute('data-guide-listener')) {
                                const guideType = btn.getAttribute('data-guide-type');
                                btn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('📚 Guide nav clicked:', guideType);
                                    this.switchGuideType(guideType);
                                });
                                btn.setAttribute('data-guide-listener', 'true');
                                console.log('✅ Guide button listener added for:', guideType);
                            }
                        });
                    }, 200);
                }
                
                // Double-check that the panel is visible
                const panel = document.getElementById(tabName + '-tab');
                if (panel) {
                    panel.style.display = 'block';
                    panel.classList.add('active');
                    console.log('✅ Ensured panel visibility for:', tabName);
                }
            }, 100);
        } catch (error) {
            console.error('Tab switch error:', error);
        }
    }

    getServerTime() {
        return new Date(Date.now() + (this.timeOffset * 60 * 60 * 1000));
    }

    getCurrentArmsPhase() {
        const serverTime = this.getServerTime();
        const hour = serverTime.getUTCHours();
        
        // Arms Race phases run in 4-hour windows
        let phaseIndex = Math.floor(hour / 4);
        if (hour >= 20) phaseIndex = 0; // City Building restarts at 20:00 UTC
        
        return this.data.armsRacePhases[phaseIndex % this.data.armsRacePhases.length];
    }

    getNextArmsPhase() {
        const currentPhase = this.getCurrentArmsPhase();
        const currentIndex = this.data.armsRacePhases.findIndex(p => p.id === currentPhase.id);
        const nextIndex = (currentIndex + 1) % this.data.armsRacePhases.length;
        return this.data.armsRacePhases[nextIndex];
    }

    getTimeToNextPhase() {
        const serverTime = this.getServerTime();
        const hour = serverTime.getUTCHours();
        const minute = serverTime.getUTCMinutes();
        
        // Calculate next 4-hour boundary
        const nextPhaseHour = Math.ceil((hour + 1) / 4) * 4;
        const hoursUntilNext = (nextPhaseHour - hour - 1 + 24) % 24;
        const minutesUntilNext = 60 - minute;
        
        return { hours: hoursUntilNext, minutes: minutesUntilNext };
    }


    updateTimeDisplays() {
        try {
            const now = new Date();
            const serverTime = this.getServerTime();
            
            // Update main time display
            const mainTimeDisplay = document.getElementById('main-time-display');
            if (mainTimeDisplay) {
                const timeToShow = this.useLocalTime ? now : serverTime;
                mainTimeDisplay.textContent = timeToShow.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                });
            }

            // Update current local time
            const currentDisplay = document.getElementById('current-display-time');
            if (currentDisplay) {
                currentDisplay.textContent = now.toLocaleTimeString();
            }

            // Update server time
            const serverDisplay = document.getElementById('server-display-time');
            if (serverDisplay) {
                serverDisplay.textContent = serverTime.toLocaleTimeString();
            }

        } catch (error) {
            console.error('Time display error:', error);
        }
    }

    updatePhaseDisplays() {
        try {
            const currentPhase = this.getCurrentArmsPhase();
            const nextPhase = this.getNextArmsPhase();
            const timeToNext = this.getTimeToNextPhase();
            
            // Update current phase
            const phaseTitle = document.getElementById('phase-title');
            if (phaseTitle) {
                phaseTitle.textContent = currentPhase.name;
            }

            const phaseIcon = document.getElementById('phase-icon');
            if (phaseIcon) {
                phaseIcon.textContent = currentPhase.icon;
            }

            // Update countdown
            const countdownTimer = document.getElementById('countdown-timer');
            if (countdownTimer) {
                countdownTimer.textContent = `${timeToNext.hours}h ${timeToNext.minutes}m`;
            }

            // Update next phase info
            const nextPhaseElement = document.getElementById('next-phase');
            if (nextPhaseElement) {
                nextPhaseElement.textContent = `${nextPhase.icon} ${nextPhase.name}`;
            }

        } catch (error) {
            console.error('Phase display error:', error);
        }
    }

    updateLoadingElements() {
        try {
            const now = new Date();
            const serverTime = this.getServerTime();
            const currentPhase = this.getCurrentArmsPhase();
            const nextPhase = this.getNextArmsPhase();
            const timeToNext = this.getTimeToNextPhase();
            
            // Calculate phase end time
            const phaseEndTime = new Date(serverTime.getTime() + (timeToNext.hours * 60 + timeToNext.minutes) * 60000);
            
            // Calculate server reset (daily reset at 00:00 UTC)
            const nextReset = new Date(serverTime);
            nextReset.setUTCHours(24, 0, 0, 0);
            const timeUntilReset = Math.max(0, nextReset.getTime() - serverTime.getTime());
            const hoursToReset = Math.floor(timeUntilReset / (1000 * 60 * 60));
            const minutesToReset = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            
            console.log('✅ Updating all loading elements with calculated data');
            
            // Update all the loading elements with comprehensive data
            const updates = {
                // Main dashboard elements
                'main-time-display': this.useLocalTime ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : serverTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                'priority-countdown': `${timeToNext.hours}h ${timeToNext.minutes}m`,
                'phase-title': currentPhase.name,
                'phase-description': `Current ${currentPhase.name} phase - Optimize for ${currentPhase.category} activities`,
                'phase-icon': currentPhase.icon,
                'efficiency-badge': '✅ Optimal',
                'spending-tags': `${currentPhase.name} Focus`,
                
                // Server reset information
                'next-server-reset': nextReset.toLocaleTimeString(),
                'reset-local-time': new Date(nextReset.getTime() - this.timeOffset * 60 * 60 * 1000).toLocaleTimeString(),
                'time-until-reset': `${hoursToReset}h ${minutesToReset}m`,
                
                // Phase countdown card elements
                'countdown-timer': `${timeToNext.hours}h ${timeToNext.minutes}m`,
                'current-phase': currentPhase.name,
                'current-display-time': now.toLocaleTimeString(),
                'server-display-time': serverTime.toLocaleTimeString(),
                'phase-end-time': phaseEndTime.toLocaleTimeString(),
                'next-phase-preview': `${nextPhase.icon} ${nextPhase.name}`,
                // Tab count indicators (only update if they exist)
                'priority-count': '3',
                
                // Setup elements
                'setup-server-time': serverTime.toLocaleTimeString(),
                'setup-timezone-offset': this.timeOffset >= 0 ? `+${this.timeOffset}` : this.timeOffset
            };
            
            // Apply updates to all elements
            Object.entries(updates).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    const currentText = element.textContent || '';
                    if (currentText.includes('Loading') || currentText === 'Loading' || currentText === 'Loading...') {
                        element.textContent = value;
                        console.log(`✅ Updated ${id}: ${currentText} -> ${value}`);
                    }
                } else {
                    console.warn(`⚠️ Element not found: ${id}`);
                }
            });
            
            // Update spending tags with proper HTML structure
            const spendingTagsEl = document.getElementById('spending-tags');
            if (spendingTagsEl && spendingTagsEl.innerHTML.includes('Loading')) {
                spendingTagsEl.innerHTML = `
                    <div class="spending-tag primary">${currentPhase.name}</div>
                    <div class="spending-tag secondary">2x Points Active</div>
                `;
                console.log('✅ Updated spending-tags with structured content');
            }

        } catch (error) {
            console.error('Loading elements update error:', error);
        }
    }
    
    updateAllDisplays() {
        console.log('✅ Updating all displays - comprehensive update');
        try {
            this.updateTimeDisplays();
            this.updatePhaseDisplays();
            this.updateLoadingElements();
            
            // Always update priority banner with live countdown
            this.updatePriorityBanner();
            
            // Update main time display
            const mainTimeDisplay = document.getElementById('main-time-display');
            if (mainTimeDisplay) {
                const now = new Date();
                const serverTime = this.getServerTime();
                const timeToShow = this.useLocalTime ? now : serverTime;
                mainTimeDisplay.textContent = timeToShow.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit'
                });
            }
            
        } catch (error) {
            console.error('Display update error:', error);
        }
    }
    
    updatePriorityBanner() {
        try {
            const currentPhase = this.getCurrentArmsPhase();
            const timeToNext = this.getTimeToNextPhase();
            
            // Update priority banner elements
            const priorityBannerTitle = document.getElementById('priority-banner-title');
            if (priorityBannerTitle) {
                priorityBannerTitle.textContent = 'NEXT HIGH PRIORITY';
            }
            
            // Always update the priority countdown (not just on loading)
            const priorityCountdown = document.getElementById('priority-countdown');
            if (priorityCountdown) {
                priorityCountdown.textContent = `${timeToNext.hours}h ${timeToNext.minutes}m`;
            }
            
            console.log('✅ Priority banner updated with time:', `${timeToNext.hours}h ${timeToNext.minutes}m`);
        } catch (error) {
            console.error('Priority banner update error:', error);
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
                // COMPREHENSIVE SEASONAL GUIDES: Complete progression system
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
                                    "Hour 1-6: Complete tutorial completely, immediately search for most active alliance available",
                                    "Day 1 Priority: Focus exclusively on Headquarters upgrades to HQ8+ to unlock alliance warehouse protection",
                                    "Alliance Selection: Join alliance with 40+ daily helps, active chat, and members in your timezone",
                                    "Resource Protection Rule: Never hold more than 2 hours of production outside alliance warehouse",
                                    "Day 2 Critical: Complete ALL rookie challenges - provides 2-3 weeks worth of speedups and premium resources",
                                    "Day 3 Foundation: Build all 4 basic resource types (farms, oil wells, steel mills, electronics) to level 5+",
                                    "NEVER WASTE ROOKIE SPEEDUPS: Every speedup used randomly costs 24-48 hours of optimal progression"
                                ]
                            },
                            {
                                title: "📋 Weeks 1-2: Foundation Building Priority System",
                                collapsible: true,
                                items: [
                                    "Priority 1: Headquarters to level 15+ (unlocks advanced features, alliance benefits, higher-tier buildings)",
                                    "Priority 2: Alliance Center to maximum possible level (increases warehouse protection capacity to 8+ hours)",
                                    "Priority 3: All 4 resource buildings to level 15+ (provides 300-500% increase in daily resource generation)",
                                    "Priority 4: Research Institute to level 12+ (unlocks economic research tree essential for long-term efficiency)",
                                    "Priority 5: Hospitals to level 12+ (protects 70%+ of troops from permanent death in combat)",
                                    "NEVER BUILD: Walls, decorations, multiple training camps, or cosmetic buildings during foundation phase",
                                    "Queue Management: Keep all 4 construction queues busy 24/7 using alliance help to reduce build times"
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
                            }
                        ]
                    }
                ];
            } else {
                // COMPREHENSIVE TIPS GUIDES: Detailed content with importance-coded information
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
                                    "Base Formula: VS Points = Resource Value × Phase Multiplier × Daily Bonus × Activity Type Modifier. Perfect Alignment occurs when your activity matches BOTH the Arms Race phase AND the daily VS focus event, providing a 1.5x multiplier (50% bonus).",
                                    "Real Impact: A 1000 diamond spend becomes 1500 VS points during perfect alignment (500 extra points). This compounds annually to generate 200,000-500,000 additional VS points per year through optimal timing.",
                                    "5 Rotating Phases in 4-Hour Cycles: City Building (0-4h), Unit Progression (4-8h), Tech Research (8-12h), Drone Boost (12-16h), Hero Advancement (16-20h). Each phase repeats daily in the same pattern with exact transition times at 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 server time.",
                                    "Weekday Perfect Windows: Monday (Radar Training + Drone Boost, 12:00-16:00), Tuesday (Base Expansion + City Building, 00:00-04:00), Wednesday (Age of Science + Tech Research, 08:00-12:00), Thursday (Train Heroes + Hero Advancement, 16:00-20:00), Saturday (Enemy Buster + Unit Progression, 04:00-08:00)."
                                ]
                            }
                        ]
                    },
                    {
                        title: "Strategic Resource Management & Optimization",
                        category: "Economic Mastery",
                        icon: "💰",
                        description: "Advanced resource management, stockpiling strategies, and economic optimization for competitive advantage",
                        keyTakeaway: "Resource management determines your ability to capitalize on perfect alignment windows and maintain competitive advantage",
                        collapsible: true,
                        sections: [
                            {
                                title: "📊 Advanced Stockpiling & Strategic Resource Allocation",
                                collapsible: true,
                                items: [
                                    "Strategic Stockpiling Formula: Maintain 2-3 weeks of premium resources (speedups, legendary items) for major perfect alignment opportunities and seasonal events",
                                    "Resource Protection Strategy: Use alliance warehouse protection religiously - store ALL resources immediately upon collection to prevent losses from attacks",
                                    "Production Optimization: Never let resource buildings reach maximum capacity - always have upgrades queued to maximize continuous resource generation",
                                    "VS Points Integration: Convert excess resources during City Building Arms Race phases for bonus points while maintaining strategic reserves"
                                ]
                            }
                        ]
                    },
                    {
                        title: "Alliance Warfare & Competitive Strategy",
                        category: "Combat & Leadership",
                        icon: "⚔️",
                        description: "Master alliance coordination, competitive warfare tactics, and leadership strategies for sustained dominance",
                        keyTakeaway: "Alliance warfare mastery and strategic leadership separate elite players from casual participants",
                        collapsible: true,
                        sections: [
                            {
                                title: "🏆 Alliance Coordination & Strategic Leadership",
                                collapsible: true,
                                items: [
                                    "Strategic Warfare Leadership: Command alliance vs alliance conflicts with coordinated attacks, resource sharing, strategic objectives",
                                    "Advanced Tactical Mastery: Master complex combat tactics including rally timing, target prioritization, formation optimization",
                                    "Communication Infrastructure: Establish real-time coordination systems for competitive events and large-scale warfare",
                                    "Member Development: Train alliance members in advanced optimization strategies for collective competitive advantage"
                                ]
                            }
                        ]
                    }
                ];
            }

            const guidesHtml = guides.map(guide => {
                const sectionsHtml = guide.sections ? guide.sections.map(section => `
                    <div class="guide-section" style="margin-bottom: var(--spacing-lg);">
                        <div class="section-header" style="background: var(--bg-elevated); padding: var(--spacing-md); border-radius: var(--border-radius); border-left: 4px solid var(--accent-primary); margin-bottom: var(--spacing-md); cursor: pointer;" onclick="this.parentElement.querySelector('.section-content').style.display = this.parentElement.querySelector('.section-content').style.display === 'none' ? 'block' : 'none'">
                            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0;">${section.title}</h4>
                        </div>
                        <div class="section-content" style="display: none; padding-left: var(--spacing-lg);">
                            ${section.items.map(item => `
                                <div style="background: var(--bg-tertiary); padding: var(--spacing-md); margin-bottom: var(--spacing-sm); border-radius: var(--border-radius); border-left: 3px solid var(--accent-secondary);">
                                    <div style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.6;">${item}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('') : '';

                return `
                    <div class="priority-window-card" style="margin-bottom: var(--spacing-xl);">
                        <div style="background: var(--bg-surface); padding: var(--spacing-lg); border-bottom: 1px solid var(--border-primary);">
                            <div style="display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
                                <span style="font-size: 2rem;">${guide.icon}</span>
                                <div style="flex: 1;">
                                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--spacing-xs);">${guide.title}</div>
                                    <div style="font-size: 0.875rem; color: var(--text-secondary);">${guide.category}</div>
                                </div>
                            </div>
                            <div style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.6; margin-bottom: var(--spacing-md);">${guide.description}</div>
                            <div style="background: var(--gradient-primary); color: white; padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--border-radius); font-size: 0.85rem; font-weight: 600;">
                                💡 ${guide.keyTakeaway}
                            </div>
                        </div>
                        <div style="padding: var(--spacing-lg);">
                            ${sectionsHtml}
                        </div>
                    </div>
                `;
            }).join('');

            grid.innerHTML = guidesHtml;
            console.log('✅ Guides populated successfully with', guides.length, 'guides for type:', this.activeGuideType);
        } catch (error) {
            console.error('Guide population error:', error);
            const grid = document.getElementById('guides-content');
            if (grid) {
                grid.innerHTML = '<div class="loading-message">Error loading guides</div>';
            }
        }
    }
    
    switchGuideType(guideType) {
        console.log('✅ Switching guide type:', guideType);
        
        // Update active guide button
        document.querySelectorAll('.guide-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        const activeBtn = document.querySelector(`[data-guide-type="${guideType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
        }
        
        this.activeGuideType = guideType;
        this.populateGuides();
    }
    
    // ENHANCED: Priority windows with spending details (Working Backup Version)
    populatePriorityContent() {
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
            console.error('Priority content population error:', error);
            const grid = document.getElementById('priority-grid');
            if (grid) {
                grid.innerHTML = '<div class="loading-message">Error loading priority windows</div>';
            }
        }
    }
    
    populatePriorityWindows() {
        try {
            const grid = document.getElementById('priority-grid');
            if (!grid) return;
            
            const windows = [];
            const now = this.getServerTime();
            
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

    formatTime(milliseconds) {
        if (milliseconds <= 0) return "0m";
        
        const totalMinutes = Math.floor(milliseconds / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    calculateAlignmentWindows() {
        // Calculate the next few alignment windows
        const windows = [];
        const serverTime = this.getServerTime();
        
        // Generate upcoming windows for the next 7 days
        for (let day = 0; day < 7; day++) {
            const futureDate = new Date(serverTime.getTime() + (day * 24 * 60 * 60 * 1000));
            const dayOfWeek = futureDate.getDay();
            
            // Check each Arms Race phase for this day
            for (let phaseIndex = 0; phaseIndex < this.data.armsRacePhases.length; phaseIndex++) {
                const phase = this.data.armsRacePhases[phaseIndex];
                const vsDay = this.data.vsDays.find(vd => vd.day === dayOfWeek);
                
                if (vsDay && this.isHighPriorityAlignment(phase, vsDay)) {
                    windows.push({
                        date: futureDate,
                        phase: phase,
                        vsDay: vsDay,
                        priority: this.calculatePriority(phase, vsDay)
                    });
                }
            }
        }
        
        return windows.sort((a, b) => a.date - b.date).slice(0, 6); // Top 6 windows
    }

    isHighPriorityAlignment(phase, vsDay) {
        // Define high-priority alignments
        const highPriorityAlignments = {
            'city_building': ['Base Expansion', 'Total Mobilization'],
            'unit_progression': ['Enemy Buster', 'Total Mobilization'], 
            'tech_research': ['Age of Science', 'Total Mobilization'],
            'drone_boost': ['Radar Training', 'Total Mobilization'],
            'hero_advancement': ['Train Heroes', 'Total Mobilization']
        };
        
        return highPriorityAlignments[phase.id]?.includes(vsDay.title) || false;
    }

    calculatePriority(phase, vsDay) {
        if (vsDay.title === 'Total Mobilization') return 'peak';
        if (this.isHighPriorityAlignment(phase, vsDay)) return 'high';
        return 'medium';
    }
    
    populateScheduleContent() {
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
    
    populateBanner() {
        console.log('✅ Populating priority events banner...');
        const bannerGrid = document.getElementById('banner-grid');
        const bannerCount = document.getElementById('banner-count');
        
        if (bannerGrid) {
            // Only replace the loading message, keep the container structure
            const loadingMsg = bannerGrid.querySelector('.banner-loading');
            if (loadingMsg) {
                loadingMsg.remove();
            }
            
            // Calculate upcoming events based on current time
            const serverTime = this.getServerTime();
            const currentPhase = this.getCurrentArmsPhase();
            const timeToNext = this.getTimeToNextPhase();
            
            bannerGrid.innerHTML = `
                <div class="banner-event-card priority">
                    <div class="event-icon">🦸</div>
                    <div class="event-info">
                        <div class="event-time">In ${timeToNext.hours}h ${timeToNext.minutes}m</div>
                        <div class="event-title">Hero Advancement</div>
                        <div class="event-phase">${this.getNextArmsPhase().name} phase starts</div>
                    </div>
                </div>
                <div class="banner-event-card">
                    <div class="event-icon">🏗️</div>
                    <div class="event-info">
                        <div class="event-time">In 10h 3m</div>
                        <div class="event-title">City Building</div>
                        <div class="event-phase">Peak construction window</div>
                    </div>
                </div>
                <div class="banner-event-card">
                    <div class="event-icon">⚔️</div>
                    <div class="event-info">
                        <div class="event-time">In 30h 2m</div>
                        <div class="event-title">Unit Progression</div>
                        <div class="event-phase">Military training bonus</div>
                    </div>
                </div>
            `;
            console.log('✅ Banner populated with dynamic event cards');
        }
        
        if (bannerCount) {
            bannerCount.textContent = '3';
        }
        
        // Add banner toggle functionality
        const bannerHeader = document.querySelector('.banner-header');
        const bannerContent = document.getElementById('banner-content');
        const bannerToggle = document.getElementById('banner-toggle');
        const banner = document.getElementById('priority-events-banner');
        
        if (bannerHeader && !bannerHeader.hasAttribute('data-banner-listener')) {
            bannerHeader.addEventListener('click', () => {
                const isExpanded = banner.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    banner.classList.add('collapsed');
                    banner.setAttribute('aria-expanded', 'false');
                    bannerToggle.textContent = '▼';
                } else {
                    banner.classList.remove('collapsed');
                    banner.setAttribute('aria-expanded', 'true');
                    bannerToggle.textContent = '▲';
                }
            });
            bannerHeader.setAttribute('data-banner-listener', 'true');
        }
    }
    
    ensureAllNavigation() {
        console.log('✅ Ensuring all navigation is working...');
        
        // Ensure tab navigation works
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (!btn.hasAttribute('data-nav-listener')) {
                const tab = btn.getAttribute('data-tab');
                console.log('Adding backup tab listener for:', tab);
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Backup tab clicked:', tab);
                    this.switchTab(tab);
                });
                btn.setAttribute('data-nav-listener', 'true');
            }
        });
        
        // Ensure settings button works
        const settingsBtn = document.getElementById('settings-toggle');
        if (settingsBtn && !settingsBtn.hasAttribute('data-nav-listener')) {
            console.log('Adding backup settings listener');
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Backup settings clicked');
                this.toggleDropdown('settings');
            });
            settingsBtn.setAttribute('data-nav-listener', 'true');
        }
        
        // Ensure time button works
        const timeBtn = document.getElementById('time-toggle-btn');
        if (timeBtn && !timeBtn.hasAttribute('data-nav-listener')) {
            console.log('Adding backup time listener');
            timeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Backup time clicked');
                this.toggleTimeMode();
            });
            timeBtn.setAttribute('data-nav-listener', 'true');
        }
        
        // Ensure guide buttons work
        const guideButtons = document.querySelectorAll('.guide-nav-btn');
        console.log('📖 Ensuring guide navigation - found', guideButtons.length, 'buttons');
        guideButtons.forEach(btn => {
            if (!btn.hasAttribute('data-nav-listener')) {
                const guideType = btn.getAttribute('data-guide-type');
                console.log('Adding backup guide listener for:', guideType);
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('📖 Backup guide clicked:', guideType);
                    this.switchGuideType(guideType);
                });
                btn.setAttribute('data-nav-listener', 'true');
            }
        });
        
        // If no guide buttons found, the guides tab might not be active yet
        if (guideButtons.length === 0) {
            console.warn('⚠️ No guide buttons found during navigation setup - will retry after tab switch');
        }
        
        console.log('✅ All navigation backup listeners added');
        
        // Force all content to be visible and populated
        setTimeout(() => {
            console.log('✅ Ensuring navigation - re-populating all content');
            
            // Re-populate all content after navigation is ready
            this.populatePriorityContent();
            this.populateScheduleContent();
            this.populateGuides();
            this.populateBanner();
            
            // Update all displays to ensure loading elements are replaced
            this.updateAllDisplays();
            
            // Force the priority tab to be visible
            this.switchTab('priority');
            
            // Debug: log all tab panels and their visibility
            document.querySelectorAll('.tab-panel').forEach(panel => {
                const computedStyle = window.getComputedStyle(panel);
                console.log('Panel:', panel.id, {
                    styleDisplay: panel.style.display,
                    computedDisplay: computedStyle.display,
                    className: panel.className,
                    hasActive: panel.classList.contains('active'),
                    visible: computedStyle.display !== 'none'
                });
            });
            
            // Also check tab-content container
            const tabContent = document.querySelector('.tab-content');
            if (tabContent) {
                const computedStyle = window.getComputedStyle(tabContent);
                console.log('Tab-content container:', {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    height: computedStyle.height
                });
            } else {
                console.error('Tab-content container not found!');
            }
            
            console.log('✅ Navigation setup and content population complete');
        }, 200);
    }

    updateSetupTime() {
        try {
            const serverTime = this.getServerTime();
            const setupTimeElement = document.getElementById('setup-server-time');
            if (setupTimeElement) {
                setupTimeElement.textContent = serverTime.toLocaleTimeString();
            }
            
            const offsetElement = document.getElementById('setup-timezone-offset');
            if (offsetElement) {
                const offset = this.timeOffset >= 0 ? `+${this.timeOffset}` : this.timeOffset;
                offsetElement.textContent = offset;
            }
        } catch (error) {
            console.error('Setup time update error:', error);
        }
    }

    startSetupTimeUpdates() {
        if (this.setupTimeInterval) {
            clearInterval(this.setupTimeInterval);
        }
        
        this.setupTimeInterval = setInterval(() => {
            this.updateSetupTime();
        }, 1000); // Update every second for setup
    }

    ensureSetupButtonListeners() {
        console.log('✅ Ensuring setup button listeners...');
        
        const setupComplete = document.getElementById('setup-complete');
        if (setupComplete && !setupComplete.hasAttribute('data-listener-added')) {
            console.log('✅ Adding setup complete listener');
            setupComplete.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ Setup complete clicked (backup listener)');
                this.completeSetup();
            });
            setupComplete.setAttribute('data-listener-added', 'true');
        }
        
        const setupSkip = document.getElementById('setup-skip');
        if (setupSkip && !setupSkip.hasAttribute('data-listener-added')) {
            console.log('✅ Adding setup skip listener');
            setupSkip.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ Setup skip clicked (backup listener)');
                this.skipSetup();
            });
            setupSkip.setAttribute('data-listener-added', 'true');
        }
        
        // Setup timezone change listener
        const timezoneSelect = document.getElementById('setup-time-offset');
        if (timezoneSelect && !timezoneSelect.hasAttribute('data-listener-added')) {
            console.log('✅ Adding timezone change listener');
            timezoneSelect.addEventListener('change', (e) => {
                console.log('Timezone changed to:', e.target.value);
                this.timeOffset = parseFloat(e.target.value);
                this.updateSetupTime();
            });
            timezoneSelect.setAttribute('data-listener-added', 'true');
        }
        
        // Setup current phase change listener for auto-selecting next phase
        const setupCurrentPhase = document.getElementById('setup-current-phase');
        if (setupCurrentPhase && !setupCurrentPhase.hasAttribute('data-listener-added')) {
            console.log('✅ Adding current phase change listener');
            setupCurrentPhase.addEventListener('change', (e) => {
                console.log('Current phase changed to:', e.target.value);
                this.updateNextPhaseOptions(e.target.value);
            });
            setupCurrentPhase.setAttribute('data-listener-added', 'true');
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
            console.log('✅ Auto-selected next phase:', nextPhase.name);
        } catch (error) {
            console.error('Next phase options error:', error);
        }
    }

    startUpdateLoop() {
        console.log('✅ Starting update loop');
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.updateAllDisplays();
            this.checkForPriorityNotifications();
        }, 60000); // Update every minute
    }

    checkForPriorityNotifications() {
        if (!this.notificationsEnabled) return;
        
        try {
            const timeToNext = this.getTimeToNextPhase();
            const totalMinutes = timeToNext.hours * 60 + timeToNext.minutes;
            
            // Notify 15 minutes before phase change
            if (totalMinutes === this.advanceWarningMinutes) {
                const nextPhase = this.getNextArmsPhase();
                this.showNotification(
                    'High Priority Window Approaching!',
                    `${nextPhase.name} phase starts in ${this.advanceWarningMinutes} minutes. Prepare your activities for maximum VS points!`,
                    { 
                        tag: 'priority-window',
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>'
                    }
                );
            }
            
            // Notify at phase start
            if (totalMinutes === 0) {
                const currentPhase = this.getCurrentArmsPhase();
                this.showNotification(
                    'New Arms Race Phase Started!',
                    `${currentPhase.name} is now active. Focus on ${currentPhase.category} activities for 2x points!`,
                    { 
                        tag: 'phase-start',
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>'
                    }
                );
            }
        } catch (error) {
            console.error('Notification check error:', error);
        }
    }

    showNotification(title, body, options = {}) {
        if (!this.notificationsEnabled || !('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                requireInteraction: false,
                ...options
            });

            // Auto-close after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);
        }
    }
}

console.log('✅ VSPointsOptimizer class definition completed');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM ready - initializing app');
    try {
        if (typeof VSPointsOptimizer === 'undefined') {
            console.error('❌ VSPointsOptimizer class not found');
            return;
        }
        
        window.lastWarNexus = new VSPointsOptimizer();
        window.lastWarNexus.init();
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
    }
});

// Debugging functions
window.debugAppState = function() {
    console.log('=== DEBUG APP STATE ===');
    console.log('window.lastWarNexus exists:', !!window.lastWarNexus);
    console.log('localStorage lwn-settings:', localStorage.getItem('lwn-settings'));
    
    if (window.lastWarNexus) {
        console.log('Setup complete:', window.lastWarNexus.isSetupComplete);
        console.log('Time offset:', window.lastWarNexus.timeOffset);
        console.log('Notifications enabled:', window.lastWarNexus.notificationsEnabled);
    }
};

window.forceShowSetup = function() {
    if (window.lastWarNexus) {
        window.lastWarNexus.showSetupModal();
    }
};

console.log('✅ Comprehensive working app loaded successfully');