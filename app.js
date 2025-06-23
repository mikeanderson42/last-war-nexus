/**
 * Last War Nexus - VS Points & Arms Race Optimizer
 * WORKING VERSION - Fixed white page issue
 */

console.log('🚀 Loading fixed working version...');

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
            
            const hasStoredSettings = localStorage.getItem('lwn-settings');
            console.log('Setup check:', { hasStoredSettings, isSetupComplete: this.isSetupComplete });
            
            if (!hasStoredSettings || !this.isSetupComplete) {
                console.log('Showing setup modal');
                this.showSetupModal();
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

    setupEventListeners() {
        if (this.eventListenersSetup) return;
        
        console.log('✅ Setting up event listeners');
        try {
            // Setup modal events
            const setupComplete = document.getElementById('setup-complete');
            if (setupComplete) {
                setupComplete.addEventListener('click', () => this.completeSetup());
            }

            const setupSkip = document.getElementById('setup-skip');
            if (setupSkip) {
                setupSkip.addEventListener('click', () => this.skipSetup());
            }

            // Settings toggle
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

            // Tab navigation
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
    }

    async completeSetup() {
        console.log('✅ Completing setup');
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

            this.hideSetupModal();
            this.updateAllDisplays();
            this.startUpdateLoop();

        } catch (error) {
            console.error('Setup completion error:', error);
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
        if (dropdown) {
            const isOpen = dropdown.classList.contains('show');
            this.closeAllDropdowns();
            if (!isOpen) {
                dropdown.classList.add('show');
            }
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
            dropdown.classList.remove('show');
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

            // Update tab panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });

            const activePanel = document.getElementById(`${tabName}-tab`);
            if (activePanel) {
                activePanel.classList.add('active');
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
            this.updatePriorityTab();
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

    updatePriorityTab() {
        try {
            const currentPhase = this.getCurrentArmsPhase();
            const serverTime = this.getServerTime();
            
            // Update priority content based on current phase and time
            const priorityContent = document.getElementById('priority-content');
            if (priorityContent) {
                // This would contain logic to show priority windows
                // For now, just ensure it shows current phase info
            }
        } catch (error) {
            console.error('Priority tab update error:', error);
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

console.log('✅ Fixed working app loaded successfully');