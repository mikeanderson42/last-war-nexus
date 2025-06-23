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
                this.updateAllDisplays();
                this.startUpdateLoop();
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
            // Priority tab content
            const priorityTab = document.getElementById('priority-tab');
            if (priorityTab) {
                priorityTab.innerHTML = `
                    <div style="padding: 1rem;">
                        <h3 style="color: #60a5fa; margin-bottom: 1rem;">🎯 Priority Windows</h3>
                        <div style="background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 3px solid #3b82f6;">
                            <h4 style="color: #60a5fa; margin: 0 0 0.5rem 0;">Next High-Value Window</h4>
                            <p style="margin: 0.25rem 0;">⏰ In 2h 30m: Arms Race + Alliance Duel Alignment</p>
                            <p style="margin: 0.25rem 0;">📈 Expected VS Points: +150% efficiency</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 3px solid #3b82f6;">
                            <h4 style="color: #60a5fa; margin: 0 0 0.5rem 0;">Today's Remaining Windows</h4>
                            <p style="margin: 0.25rem 0;">🏗️ City Building Peak: 6h 15m</p>
                            <p style="margin: 0.25rem 0;">⚔️ Unit Training Boost: 8h 45m</p>
                        </div>
                    </div>
                `;
            }

            // Schedule tab content
            const scheduleTab = document.getElementById('schedule-tab');
            if (scheduleTab) {
                scheduleTab.innerHTML = `
                    <div style="padding: 1rem;">
                        <h3 style="color: #60a5fa; margin-bottom: 1rem;">📅 Weekly Event Schedule</h3>
                        <div style="background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px;">
                            <p style="margin: 0.5rem 0;"><strong style="color: #60a5fa;">Monday:</strong> 🎯 Radar Training - Focus on surveillance upgrades</p>
                            <p style="margin: 0.5rem 0;"><strong style="color: #60a5fa;">Tuesday:</strong> 🏗️ Base Expansion - Infrastructure development</p>
                            <p style="margin: 0.5rem 0;"><strong style="color: #60a5fa;">Wednesday:</strong> 🔬 Age of Science - Research and technology</p>
                            <p style="margin: 0.5rem 0;"><strong style="color: #60a5fa;">Thursday:</strong> 🦸 Train Heroes - Hero development focus</p>
                            <p style="margin: 0.5rem 0;"><strong style="color: #60a5fa;">Friday:</strong> ⚔️ Total Mobilization - Military preparation</p>
                            <p style="margin: 0.5rem 0;"><strong style="color: #60a5fa;">Saturday:</strong> 💥 Enemy Buster - Combat operations</p>
                        </div>
                    </div>
                `;
            }

            // Guides tab content
            const guidesTab = document.getElementById('guides-tab');
            if (guidesTab) {
                guidesTab.innerHTML = `
                    <div style="padding: 1rem;">
                        <h3 style="color: #60a5fa; margin-bottom: 1rem;">📖 Strategy Guides</h3>
                        <div style="background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 3px solid #3b82f6;">
                            <h4 style="color: #60a5fa; margin: 0 0 0.5rem 0;">🏗️ City Building Optimization</h4>
                            <p style="margin: 0; color: #e5e7eb;">Maximize construction efficiency during City Building phases</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 3px solid #3b82f6;">
                            <h4 style="color: #60a5fa; margin: 0 0 0.5rem 0;">⚔️ Unit Progression Strategy</h4>
                            <p style="margin: 0; color: #e5e7eb;">Optimize military development and troop advancement</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 3px solid #3b82f6;">
                            <h4 style="color: #60a5fa; margin: 0 0 0.5rem 0;">🔬 Research Efficiency</h4>
                            <p style="margin: 0; color: #e5e7eb;">Technology advancement tips and research priorities</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 3px solid #3b82f6;">
                            <h4 style="color: #60a5fa; margin: 0 0 0.5rem 0;">🚁 Drone Boost Maximization</h4>
                            <p style="margin: 0; color: #e5e7eb;">Get the most out of drone boost periods</p>
                        </div>
                    </div>
                `;
            }

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

            // Setup timezone change listener
            const timezoneSelect = document.getElementById('setup-time-offset');
            if (timezoneSelect) {
                timezoneSelect.addEventListener('change', (e) => {
                    this.timeOffset = parseFloat(e.target.value);
                    this.updateSetupTime();
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
                    if (tab) this.switchTab(tab);
                });
            });

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
            this.updateAllDisplays();
            this.startUpdateLoop();

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
            }

            this.activeTab = tabName;
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

    updateAllDisplays() {
        console.log('✅ Updating all displays');
        try {
            this.updateTimeDisplays();
            this.updatePhaseDisplays();
            this.updateLoadingElements();
        } catch (error) {
            console.error('Display update error:', error);
        }
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
            const timeToNext = this.getTimeToNextPhase();
            
            // Calculate phase end time
            const phaseEndTime = new Date(serverTime.getTime() + (timeToNext.hours * 60 + timeToNext.minutes) * 60000);
            
            // Calculate server reset (daily reset at 00:00 UTC)
            const nextReset = new Date(serverTime);
            nextReset.setUTCHours(24, 0, 0, 0);
            const timeUntilReset = Math.max(0, nextReset.getTime() - serverTime.getTime());
            const hoursToReset = Math.floor(timeUntilReset / (1000 * 60 * 60));
            const minutesToReset = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            
            // Update all the loading elements
            const updates = {
                'priority-countdown': `${timeToNext.hours}h ${timeToNext.minutes}m`,
                'efficiency-badge': '✅ Optimal',
                'spending-tags': 'City Building Focus',
                'next-server-reset': nextReset.toLocaleTimeString(),
                'reset-local-time': new Date(nextReset.getTime() - this.timeOffset * 60 * 60 * 1000).toLocaleTimeString(),
                'time-until-reset': `${hoursToReset}h ${minutesToReset}m`,
                'current-phase': currentPhase.name,
                'phase-end-time': phaseEndTime.toLocaleTimeString(),
                'next-phase-preview': `${currentPhase.icon} ${currentPhase.name}`,
                'setup-server-time': serverTime.toLocaleTimeString()
            };
            
            // Apply updates
            Object.entries(updates).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element && element.textContent.includes('Loading')) {
                    element.textContent = value;
                }
            });

        } catch (error) {
            console.error('Loading elements update error:', error);
        }
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
    }

    startUpdateLoop() {
        console.log('✅ Starting update loop');
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.updateAllDisplays();
        }, 60000); // Update every minute
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