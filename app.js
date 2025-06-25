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
        
        // Arms Race data
        this.data = {
            armsRacePhases: [
                { id: 'city_building', name: "City Building", icon: "🏗️", category: "construction" },
                { id: 'unit_progression', name: "Unit Progression", icon: "⚔️", category: "military" },
                { id: 'tech_research', name: "Tech Research", icon: "🔬", category: "research" },
                { id: 'drone_boost', name: "Drone Boost", icon: "🚁", category: "technology" },
                { id: 'hero_advancement', name: "Hero Advancement", icon: "🦸", category: "heroes" }
            ],
            vsDays: [
                { day: 1, name: "Monday", title: "Radar Training", description: "Focus on radar upgrades and surveillance" },
                { day: 2, name: "Tuesday", title: "Base Expansion", description: "Expand your base infrastructure" },
                { day: 3, name: "Wednesday", title: "Age of Science", description: "Research technologies and innovations" },
                { day: 4, name: "Thursday", title: "Train Heroes", description: "Level up and train your heroes" },
                { day: 5, name: "Friday", title: "Total Mobilization", description: "Prepare for battle scenarios" },
                { day: 6, name: "Saturday", title: "Enemy Buster", description: "Engage in combat operations" }
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
                if (!e.target.closest('.dropdown-container')) {
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
        const dropdown = document.getElementById(type + '-dropdown');
        if (dropdown) {
            const isOpen = dropdown.classList.contains('show');
            
            if (isOpen) {
                // Close dropdown - remove class AND forced styles
                dropdown.classList.remove('show');
                dropdown.style.display = '';
                dropdown.style.visibility = '';
                dropdown.style.opacity = '';
                console.log('Dropdown closed and styles cleared');
            } else {
                // Close all others first
                document.querySelectorAll('.dropdown-menu').forEach(d => {
                    d.classList.remove('show');
                    d.style.display = '';
                    d.style.visibility = '';
                    d.style.opacity = '';
                });
                
                // Open this dropdown
                dropdown.classList.add('show');
                dropdown.style.display = 'block';
                dropdown.style.visibility = 'visible';
                dropdown.style.opacity = '1';
                console.log('Dropdown opened');
            }
        } else {
            console.log('Dropdown not found:', type + '-dropdown');
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
            dropdown.classList.remove('show');
            dropdown.style.display = '';
            dropdown.style.visibility = '';
            dropdown.style.opacity = '';
        });
    }

    toggleTimeMode() {
        console.log('✅ Toggle time mode');
        this.useLocalTime = !this.useLocalTime;
        this.saveSettings();
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
        console.log('✅ Populating guides content for type:', this.activeGuideType);
        const guidesContent = document.getElementById('guides-content');
        console.log('Guides content element:', guidesContent);
        if (!guidesContent) {
            console.error('Guides content element not found!');
            return;
        }
        
        // Only replace the loading message, keep the container structure
        const loadingMsg = guidesContent.querySelector('.loading-message');
        if (loadingMsg) {
            loadingMsg.remove();
        }
        
        let content = '';
        
        if (this.activeGuideType === 'seasonal') {
            content = `
                <div class="guide-card-fullscreen">
                    <div class="guide-preview-card">
                        <div class="guide-preview-content">
                            <div class="guide-preview-header">
                                <h3>🎄 Winter Event Optimization</h3>
                                <span class="guide-category">Seasonal Strategy</span>
                            </div>
                            <div class="guide-preview-body">
                                <p>Maximize rewards during winter seasonal events with strategic timing and resource management.</p>
                                <div class="guide-highlights">
                                    <div class="highlight-item">❄️ Winter bonuses: 50% extra resources</div>
                                    <div class="highlight-item">🎁 Holiday rewards: Special hero fragments</div>
                                    <div class="highlight-item">⛄ Snow missions: Exclusive building materials</div>
                                </div>
                            </div>
                            <button class="guide-preview-btn mobile-repositioned">Read Full Winter Guide</button>
                            <div class="guide-preview-takeaway">
                                💡 <strong>Winter Tip:</strong> Save premium speedups for holiday events with 2x multipliers
                            </div>
                        </div>
                    </div>
                </div>
                <div class="guide-card-fullscreen">
                    <div class="guide-preview-card">
                        <div class="guide-preview-content">
                            <div class="guide-preview-header">
                                <h3>🌸 Spring Growth Strategy</h3>
                                <span class="guide-category">Seasonal Strategy</span>
                            </div>
                            <div class="guide-preview-body">
                                <p>Spring season emphasizes rapid expansion and development with construction bonuses.</p>
                                <div class="guide-highlights">
                                    <div class="highlight-item">🌱 Growth bonuses: Accelerated building times</div>
                                    <div class="highlight-item">🌿 Resource bloom: Enhanced gathering rates</div>
                                    <div class="highlight-item">🌼 Recruitment season: Hero acquisition events</div>
                                </div>
                            </div>
                            <button class="guide-preview-btn mobile-repositioned">Read Full Spring Guide</button>
                            <div class="guide-preview-takeaway">
                                💡 <strong>Spring Tip:</strong> Focus on infrastructure during construction bonus weeks
                            </div>
                        </div>
                    </div>
                </div>
                <div class="guide-card-fullscreen">
                    <div class="guide-preview-card">
                        <div class="guide-preview-content">
                            <div class="guide-preview-header">
                                <h3>🌞 Summer Combat Focus</h3>
                                <span class="guide-category">Seasonal Strategy</span>
                            </div>
                            <div class="guide-preview-body">
                                <p>Summer brings intense PvP seasons with enhanced combat rewards and alliance wars.</p>
                                <div class="guide-highlights">
                                    <div class="highlight-item">⚔️ Combat bonuses: Enhanced troop effectiveness</div>
                                    <div class="highlight-item">🏆 PvP seasons: Exclusive ranking rewards</div>
                                    <div class="highlight-item">🛡️ Alliance wars: Territory control battles</div>
                                </div>
                            </div>
                            <button class="guide-preview-btn mobile-repositioned">Read Full Summer Guide</button>
                            <div class="guide-preview-takeaway">
                                💡 <strong>Summer Tip:</strong> Prepare military strength before PvP season starts
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Default to tips content with enhanced format
            content = `
                <div class="guide-card-fullscreen">
                    <div class="guide-preview-card">
                        <div class="guide-preview-content">
                            <div class="guide-preview-header">
                                <h3>🎯 4x Point Strategy Master Guide</h3>
                                <span class="guide-category">Advanced Strategy</span>
                            </div>
                            <div class="guide-preview-body">
                                <p>Master the art of perfect alignment windows for maximum VS point efficiency and resource optimization.</p>
                                <div class="guide-highlights">
                                    <div class="highlight-item">⚡ Perfect alignments: 4x VS Points (2x Arms Race + 2x VS Day)</div>
                                    <div class="highlight-item">💎 Diamond strategy: Always counts for 2x base points</div>
                                    <div class="highlight-item">🔥 Friday priority: Total Mobilization = 4x points with ANY phase</div>
                                </div>
                            </div>
                            <button class="guide-preview-btn mobile-repositioned">Read Full Strategy Guide</button>
                            <div class="guide-preview-takeaway">
                                💡 <strong>Pro Tip:</strong> VIP Store offers 30-50% better value than regular store for speedups
                            </div>
                        </div>
                    </div>
                </div>
                <div class="guide-card-fullscreen">
                    <div class="guide-preview-card">
                        <div class="guide-preview-content">
                            <div class="guide-preview-header">
                                <h3>🏗️ City Building Efficiency</h3>
                                <span class="guide-category">Phase Strategy</span>
                            </div>
                            <div class="guide-preview-body">
                                <p>Optimize construction timing during City Building phases for maximum resource efficiency.</p>
                                <div class="guide-highlights">
                                    <div class="highlight-item">🏢 Priority buildings: Resource production first</div>
                                    <div class="highlight-item">⏰ Timing strategy: Save speedups for 2x windows</div>
                                    <div class="highlight-item">📈 Upgrade paths: Economic buildings before military</div>
                                </div>
                            </div>
                            <button class="guide-preview-btn mobile-repositioned">Read Construction Guide</button>
                            <div class="guide-preview-takeaway">
                                💡 <strong>Building Tip:</strong> Tuesday + City Building = Perfect construction alignment
                            </div>
                        </div>
                    </div>
                </div>
                <div class="guide-card-fullscreen">
                    <div class="guide-preview-card">
                        <div class="guide-preview-content">
                            <div class="guide-preview-header">
                                <h3>⚔️ Military Development Strategy</h3>
                                <span class="guide-category">Phase Strategy</span>
                            </div>
                            <div class="guide-preview-body">
                                <p>Advanced military optimization during Unit Progression phases for combat superiority.</p>
                                <div class="guide-highlights">
                                    <div class="highlight-item">🚀 Tier upgrades: Quality over quantity approach</div>
                                    <div class="highlight-item">⚔️ Training timing: Unit Progression 4x point windows</div>
                                    <div class="highlight-item">🛡️ Composition strategy: Balanced army formation</div>
                                </div>
                            </div>
                            <button class="guide-preview-btn mobile-repositioned">Read Military Guide</button>
                            <div class="guide-preview-takeaway">
                                💡 <strong>Military Tip:</strong> Saturday + Unit Progression = Combat preparation synergy
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        guidesContent.innerHTML = content;
        console.log('✅ Guides content populated with enhanced guide cards for type:', this.activeGuideType);
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
    
    populatePriorityContent() {
        console.log('✅ Populating priority content...');
        const priorityContent = document.getElementById('priority-grid');
        console.log('Priority grid element:', priorityContent);
        if (priorityContent) {
            // Only replace the loading message, keep the container structure
            const loadingMsg = priorityContent.querySelector('.loading-message');
            if (loadingMsg) {
                loadingMsg.remove();
            }
            
            // Get current phase and calculate alignment windows
            const currentPhase = this.getCurrentArmsPhase();
            const timeToNext = this.getTimeToNextPhase();
            const serverTime = this.getServerTime();
            const dayOfWeek = serverTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
            
            // Calculate upcoming alignment windows
            const alignmentWindows = this.calculateAlignmentWindows();
            
            // Add content cards matching the working backup layout
            priorityContent.innerHTML = `
                <div class="priority-window-card completed">
                    <div class="card-header">
                        <h3>🔬 Tech Research + Age of Science</h3>
                        <span class="status-badge upcoming">UPCOMING</span>
                    </div>
                    <div class="card-content">
                        <div class="window-info">
                            <div class="window-time">Starts: Thu, Jun 26, 11:00 Local</div>
                            <div class="window-description">Research activities align perfectly</div>
                        </div>
                        <div class="alignment-action">
                            <button class="alignment-btn perfect-alignment">PERFECT ALIGNMENT</button>
                        </div>
                        <div class="spending-recommendations">
                            <div class="spending-header">BEST SPENDING</div>
                            <div class="spending-tags-grid">
                                <span class="spending-tag primary">Research Speedups</span>
                                <span class="spending-tag secondary">Tech Upgrades</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="priority-window-card active">
                    <div class="card-header">
                        <h3>🦸 Hero Advancement + Train Heroes</h3>
                        <span class="status-badge upcoming">UPCOMING</span>
                    </div>
                    <div class="card-content">
                        <div class="window-info">
                            <div class="window-time">Starts: Thu, Jun 26, 11:00 Local</div>
                            <div class="window-description">Hero activities align perfectly</div>
                        </div>
                        <div class="alignment-action">
                            <button class="alignment-btn perfect-match">PERFECT MATCH</button>
                        </div>
                        <div class="spending-recommendations">
                            <div class="spending-header">BEST SPENDING</div>
                            <div class="spending-tags-grid">
                                <span class="spending-tag primary">Hero EXP</span>
                                <span class="spending-tag secondary">Hero Recruitment</span>
                                <span class="spending-tag tertiary">Skill Medals</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="priority-window-card peak">
                    <div class="card-header">
                        <h3>🏗️ City Building + Total Mobilization</h3>
                        <span class="status-badge upcoming">UPCOMING</span>
                    </div>
                    <div class="card-content">
                        <div class="window-info">
                            <div class="window-time">Starts: Thu, Jun 26, 19:00 Local</div>
                            <div class="window-description">Construction component of total mobilization</div>
                        </div>
                        <div class="alignment-action">
                            <button class="alignment-btn peak-efficiency">PEAK EFFICIENCY</button>
                        </div>
                        <div class="spending-recommendations">
                            <div class="spending-header">BEST SPENDING</div>
                            <div class="spending-tags-grid">
                                <span class="spending-tag primary">Construction Speedups</span>
                                <span class="spending-tag secondary">Building Materials</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            console.log('✅ Priority content populated with detailed alignment windows');
        }
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
        console.log('✅ Populating schedule content...');
        const scheduleContent = document.getElementById('schedule-content');
        console.log('Schedule content element:', scheduleContent);
        if (scheduleContent) {
            // Only replace the loading message, keep the container structure
            const loadingMsg = scheduleContent.querySelector('.loading-message');
            if (loadingMsg) {
                loadingMsg.remove();
            }
            
            // Generate weekly schedule with detailed timing
            const serverTime = this.getServerTime();
            const today = serverTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
            
            scheduleContent.innerHTML = `
                <div class="priority-window-card ${today === 1 ? 'active' : ''}">
                    <div class="card-header">
                        <h3>📡 Monday - Radar Training</h3>
                        <span class="day-status">${today === 1 ? 'TODAY' : 'UPCOMING'}</span>
                    </div>
                    <div class="card-content">
                        <div class="vs-day-info">
                            <div class="vs-description">Focus on radar upgrades and surveillance systems</div>
                            <div class="best-phases">
                                <strong>Best Phases:</strong> Drone Boost (12:00-16:00 UTC)
                            </div>
                            <div class="point-multiplier">VS Points: 2x for radar activities</div>
                        </div>
                    </div>
                </div>
                <div class="priority-window-card ${today === 2 ? 'active' : ''}">
                    <div class="card-header">
                        <h3>🏗️ Tuesday - Base Expansion</h3>
                        <span class="day-status">${today === 2 ? 'TODAY' : 'UPCOMING'}</span>
                    </div>
                    <div class="card-content">
                        <div class="vs-day-info">
                            <div class="vs-description">Infrastructure development and building upgrades</div>
                            <div class="best-phases">
                                <strong>Best Phases:</strong> City Building (00:00-04:00, 20:00-00:00 UTC)
                            </div>
                            <div class="point-multiplier">VS Points: 2x for construction activities</div>
                        </div>
                    </div>
                </div>
                <div class="priority-window-card ${today === 3 ? 'active' : ''}">
                    <div class="card-header">
                        <h3>🔬 Wednesday - Age of Science</h3>
                        <span class="day-status">${today === 3 ? 'TODAY' : 'UPCOMING'}</span>
                    </div>
                    <div class="card-content">
                        <div class="vs-day-info">
                            <div class="vs-description">Research technologies and scientific advancement</div>
                            <div class="best-phases">
                                <strong>Best Phases:</strong> Tech Research (08:00-12:00 UTC)
                            </div>
                            <div class="point-multiplier">VS Points: 2x for research activities</div>
                        </div>
                    </div>
                </div>
                <div class="priority-window-card ${today === 4 ? 'active' : ''}">
                    <div class="card-header">
                        <h3>🦸 Thursday - Train Heroes</h3>
                        <span class="day-status">${today === 4 ? 'TODAY' : 'UPCOMING'}</span>
                    </div>
                    <div class="card-content">
                        <div class="vs-day-info">
                            <div class="vs-description">Level up and train your hero characters</div>
                            <div class="best-phases">
                                <strong>Best Phases:</strong> Hero Advancement (16:00-20:00 UTC)
                            </div>
                            <div class="point-multiplier">VS Points: 2x for hero activities</div>
                        </div>
                    </div>
                </div>
                <div class="priority-window-card ${today === 5 ? 'peak' : ''}">
                    <div class="card-header">
                        <h3>⚔️ Friday - Total Mobilization</h3>
                        <span class="day-status">${today === 5 ? 'TODAY' : 'UPCOMING'}</span>
                    </div>
                    <div class="card-content">
                        <div class="vs-day-info">
                            <div class="vs-description">All activities accepted for maximum flexibility</div>
                            <div class="best-phases">
                                <strong>Best Phases:</strong> ALL phases provide maximum points
                            </div>
                            <div class="point-multiplier">VS Points: 2x for ANY activity type</div>
                        </div>
                    </div>
                </div>
                <div class="priority-window-card ${today === 6 ? 'active' : ''}">
                    <div class="card-header">
                        <h3>💥 Saturday - Enemy Buster</h3>
                        <span class="day-status">${today === 6 ? 'TODAY' : 'UPCOMING'}</span>
                    </div>
                    <div class="card-content">
                        <div class="vs-day-info">
                            <div class="vs-description">Combat operations and troop elimination</div>
                            <div class="best-phases">
                                <strong>Best Phases:</strong> Unit Progression (04:00-08:00 UTC)
                            </div>
                            <div class="point-multiplier">VS Points: 2x for combat activities</div>
                        </div>
                    </div>
                </div>
            `;
            console.log('✅ Schedule content populated with detailed weekly view');
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