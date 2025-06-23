/**
 * Last War Nexus - VS Points & Arms Race Optimizer
 * EMERGENCY WORKING VERSION
 */

console.log('🚀 Loading emergency working version...');

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
        
        // Basic data structure
        this.data = {
            armsRacePhases: [
                { id: 'city_building', name: "City Building", icon: "🏗️" },
                { id: 'unit_progression', name: "Unit Progression", icon: "⚔️" },
                { id: 'tech_research', name: "Tech Research", icon: "🔬" },
                { id: 'drone_boost', name: "Drone Boost", icon: "🚁" },
                { id: 'hero_advancement', name: "Hero Advancement", icon: "🦸" }
            ],
            vsDays: [
                { day: 1, name: "Monday", title: "Radar Training" },
                { day: 2, name: "Tuesday", title: "Base Expansion" },
                { day: 3, name: "Wednesday", title: "Age of Science" },
                { day: 4, name: "Thursday", title: "Train Heroes" },
                { day: 5, name: "Friday", title: "Total Mobilization" },
                { day: 6, name: "Saturday", title: "Enemy Buster" }
            ]
        };
    }

    init() {
        console.log('✅ VSPointsOptimizer init');
        try {
            this.loadSettings();
            this.setupEventListeners();
            
            // Show setup modal if not complete
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

    setupEventListeners() {
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
            dropdown.classList.toggle('show', !isOpen);
        }
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

    updateAllDisplays() {
        console.log('✅ Updating displays');
        try {
            this.updateTimeDisplays();
            this.updatePhaseDisplays();
        } catch (error) {
            console.error('Display update error:', error);
        }
    }

    updateTimeDisplays() {
        try {
            const now = new Date();
            const serverTime = new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
            
            // Update main time display
            const mainTimeDisplay = document.getElementById('main-time-display');
            if (mainTimeDisplay) {
                mainTimeDisplay.textContent = this.useLocalTime ? 
                    now.toLocaleTimeString() : 
                    serverTime.toLocaleTimeString();
            }

            // Update other time displays
            const currentDisplay = document.getElementById('current-display-time');
            if (currentDisplay) {
                currentDisplay.textContent = now.toLocaleTimeString();
            }

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
            const serverTime = new Date(Date.now() + (this.timeOffset * 60 * 60 * 1000));
            const hour = serverTime.getUTCHours();
            
            // Simple phase calculation
            let phaseIndex = Math.floor(hour / 4);
            if (hour >= 20) phaseIndex = 0; // City Building restarts at 20:00
            
            const phase = this.data.armsRacePhases[phaseIndex] || this.data.armsRacePhases[0];
            
            // Update phase display
            const phaseTitle = document.getElementById('phase-title');
            if (phaseTitle) {
                phaseTitle.textContent = phase.name;
            }

            const phaseIcon = document.getElementById('phase-icon');
            if (phaseIcon) {
                phaseIcon.textContent = phase.icon;
            }

            // Update countdown
            const hoursRemaining = 4 - (hour % 4);
            const minutesRemaining = 60 - serverTime.getUTCMinutes();
            const countdownTimer = document.getElementById('countdown-timer');
            if (countdownTimer) {
                countdownTimer.textContent = `${hoursRemaining - 1}h ${minutesRemaining}m`;
            }

        } catch (error) {
            console.error('Phase display error:', error);
        }
    }

    startUpdateLoop() {
        console.log('✅ Starting update loop');
        // Update every minute
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.updateAllDisplays();
        }, 60000);
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

// Add debugging functions
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

window.testClearLocalStorage = function() {
    console.log('Clearing localStorage');
    localStorage.removeItem('lwn-settings');
    if (window.lastWarNexus) {
        window.lastWarNexus.isSetupComplete = false;
        window.lastWarNexus.showSetupModal();
    }
    console.log('localStorage cleared - reload to test setup');
};

console.log('✅ Emergency app loaded successfully');