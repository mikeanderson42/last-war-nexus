/**
 * Last War Nexus - VS Points & Arms Race Optimizer
 * DEBUG VERSION - Added extensive logging to identify initialization issues
 */

console.log("🔍 DEBUG: Script loading started...");

class VSPointsOptimizer {
    constructor() {
        console.log("🔍 DEBUG: Constructor called");
        
        // Initialize properties
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

        console.log("🔍 DEBUG: Properties initialized");

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
                { 
                    day: 1, 
                    name: "Monday", 
                    title: "Radar Training", 
                    focus: "Radar missions, stamina use, hero EXP, drone data",
                    activities: ["radar_missions", "stamina_use", "hero_exp", "drone_data"]
                },
                { 
                    day: 2, 
                    name: "Tuesday", 
                    title: "Base Expansion", 
                    focus: "Construction speedups, building power, legendary trucks",
                    activities: ["construction_speedups", "building_power", "legendary_trucks", "survivor_recruitment"]
                },
                { 
                    day: 3, 
                    name: "Wednesday", 
                    title: "Age of Science", 
                    focus: "Research speedups, tech power, valor badges",
                    activities: ["research_speedups", "tech_power", "valor_badges", "drone_components"]
                },
                { 
                    day: 4, 
                    name: "Thursday", 
                    title: "Train Heroes", 
                    focus: "Hero recruitment, EXP, shards, skill medals",
                    activities: ["hero_recruitment", "hero_exp", "hero_shards", "skill_medals"]
                },
                { 
                    day: 5, 
                    name: "Friday", 
                    title: "Total Mobilization", 
                    focus: "All speedups, radar missions, comprehensive activities",
                    activities: ["all_speedups", "radar_missions", "comprehensive_activities"]
                },
                { 
                    day: 6, 
                    name: "Saturday", 
                    title: "Enemy Buster", 
                    focus: "Combat focus, troop elimination, healing speedups",
                    activities: ["combat_focus", "troop_elimination", "healing_speedups"]
                }
            ],
            
            priorityAlignments: [
                { 
                    vsDay: 1, 
                    armsPhase: "Drone Boost", 
                    reason: "Stamina & radar activities align perfectly", 
                    benefit: "Maximum Efficiency",
                    synergy: ["stamina_usage", "radar_missions", "drone_data"]
                },
                { 
                    vsDay: 2, 
                    armsPhase: "City Building", 
                    reason: "Construction activities align perfectly", 
                    benefit: "Perfect Match",
                    synergy: ["construction_speedups", "building_upgrades", "base_expansion"]
                },
                { 
                    vsDay: 3, 
                    armsPhase: "Tech Research", 
                    reason: "Research activities align perfectly", 
                    benefit: "Perfect Alignment",
                    synergy: ["research_speedups", "tech_advancement", "valor_badges"]
                },
                { 
                    vsDay: 4, 
                    armsPhase: "Hero Advancement", 
                    reason: "Hero activities align perfectly", 
                    benefit: "Perfect Match",
                    synergy: ["hero_recruitment", "hero_exp", "skill_medals"]
                },
                { 
                    vsDay: 5, 
                    armsPhase: "City Building", 
                    reason: "Construction component of total mobilization", 
                    benefit: "Peak Efficiency",
                    synergy: ["construction_speedups", "comprehensive_activities"]
                }
            ]
        };

        console.log("🔍 DEBUG: Data structure initialized");
        console.log("🔍 DEBUG: Calling init()...");
        
        // Call init but wrap in try-catch
        try {
            this.init();
        } catch (error) {
            console.error("🚨 DEBUG: Init failed:", error);
        }
    }

    init() {
        console.log("🔍 DEBUG: Init method started");
        
        try {
            console.log("🔍 DEBUG: Loading settings...");
            this.loadSettings();
            
            console.log("🔍 DEBUG: Setting up event listeners...");
            this.setupEventListeners();
            
            console.log("🔍 DEBUG: Checking setup completion...");
            console.log("🔍 DEBUG: isSetupComplete =", this.isSetupComplete);
            
            // Check if setup is needed
            if (!this.isSetupComplete) {
                console.log("🔍 DEBUG: Setup needed, showing modal...");
                this.showSetupModal();
            } else {
                console.log("🔍 DEBUG: Setup complete, updating displays...");
                this.updateAllDisplays();
                this.startUpdateLoop();
            }
            
            console.log("🔍 DEBUG: Init completed successfully");
        } catch (error) {
            console.error('🚨 DEBUG: Initialization error:', error);
            this.handleError('Failed to initialize application');
        }
    }

    setupEventListeners() {
        console.log("🔍 DEBUG: Setting up event listeners...");
        
        try {
            // Basic event listeners for testing
            const serverToggle = document.getElementById('server-toggle');
            if (serverToggle) {
                console.log("🔍 DEBUG: Found server toggle button");
                serverToggle.addEventListener('click', (e) => {
                    console.log("🔍 DEBUG: Server toggle clicked");
                    e.stopPropagation();
                    this.toggleDropdown('server');
                });
            } else {
                console.warn("🔍 DEBUG: Server toggle button not found");
            }

            // Tab navigation
            const tabButtons = document.querySelectorAll('.tab-btn');
            console.log("🔍 DEBUG: Found", tabButtons.length, "tab buttons");
            
            tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tab = e.currentTarget.getAttribute('data-tab');
                    console.log("🔍 DEBUG: Tab clicked:", tab);
                    if (tab) {
                        this.switchTab(tab);
                    }
                });
            });

            console.log("🔍 DEBUG: Event listeners set up successfully");
        } catch (error) {
            console.error('🚨 DEBUG: Event listener setup error:', error);
        }
    }

    showSetupModal() {
        console.log("🔍 DEBUG: showSetupModal called");
        
        const modal = document.getElementById('setup-modal');
        if (modal) {
            console.log("🔍 DEBUG: Setup modal found, showing...");
            modal.classList.add('show');
            this.startSetupTimeUpdate();
        } else {
            console.error("🚨 DEBUG: Setup modal not found in DOM!");
        }
    }

    startSetupTimeUpdate() {
        console.log("🔍 DEBUG: Starting setup time update...");
        
        try {
            this.updateSetupTime();
            this.setupTimeInterval = setInterval(() => {
                this.updateSetupTime();
            }, 1000);
            console.log("🔍 DEBUG: Setup time update started");
        } catch (error) {
            console.error("🚨 DEBUG: Setup time update error:", error);
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
            
            // Also update main server time
            const mainTimeElement = document.getElementById('server-time');
            if (mainTimeElement) {
                mainTimeElement.textContent = timeString;
            }
        } catch (error) {
            console.error('🚨 DEBUG: Setup time update error:', error);
        }
    }

    getServerTime() {
        try {
            const now = new Date();
            return new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
        } catch (error) {
            console.error('🚨 DEBUG: Server time calculation error:', error);
            return new Date();
        }
    }

    toggleDropdown(type) {
        console.log("🔍 DEBUG: toggleDropdown called for:", type);
        
        const dropdown = document.getElementById(`${type}-dropdown`);
        const toggle = document.getElementById(`${type}-toggle`);
        
        if (dropdown && toggle) {
            const isOpen = dropdown.classList.contains('show');
            console.log("🔍 DEBUG: Dropdown currently open:", isOpen);
            
            // Close all dropdowns first
            this.closeAllDropdowns();
            
            if (!isOpen) {
                console.log("🔍 DEBUG: Opening dropdown");
                dropdown.classList.add('show');
                toggle.classList.add('active');
            }
        } else {
            console.error("🚨 DEBUG: Dropdown elements not found:", dropdown, toggle);
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
        console.log("🔍 DEBUG: switchTab called for:", tabName);
        
        try {
            this.activeTab = tabName;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Activate selected tab
            const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
            const activePanel = document.getElementById(`${tabName}-tab`);
            
            if (activeBtn) {
                activeBtn.classList.add('active');
                console.log("🔍 DEBUG: Tab button activated");
            }
            if (activePanel) {
                activePanel.classList.add('active');
                console.log("🔍 DEBUG: Tab panel activated");
            }
            
            // Simple content for testing
            this.populateTabContent(tabName);
            
        } catch (error) {
            console.error('🚨 DEBUG: Tab switch error:', error);
        }
    }

    populateTabContent(tabName) {
        console.log("🔍 DEBUG: populateTabContent called for:", tabName);
        
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
            console.error(`🚨 DEBUG: Tab content population error for ${tabName}:`, error);
        }
    }

    populatePriorityWindows() {
        console.log("🔍 DEBUG: populatePriorityWindows called");
        
        const grid = document.getElementById('priority-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="loading-message">
                    🔍 DEBUG: Priority windows function called successfully!<br>
                    Arms Race phases: ${this.data.armsRacePhases.length}<br>
                    VS Days: ${this.data.vsDays.length}<br>
                    Priority alignments: ${this.data.priorityAlignments.length}
                </div>
            `;
            console.log("🔍 DEBUG: Priority grid updated");
        } else {
            console.error("🚨 DEBUG: Priority grid not found");
        }
    }

    populateSchedule() {
        console.log("🔍 DEBUG: populateSchedule called");
        
        const grid = document.getElementById('schedule-content');
        if (grid) {
            grid.innerHTML = '<div class="loading-message">🔍 DEBUG: Schedule function working!</div>';
            console.log("🔍 DEBUG: Schedule grid updated");
        } else {
            console.error("🚨 DEBUG: Schedule grid not found");
        }
    }

    populateGuides() {
        console.log("🔍 DEBUG: populateGuides called");
        
        const grid = document.getElementById('guides-content');
        if (grid) {
            grid.innerHTML = '<div class="loading-message">🔍 DEBUG: Guides function working!</div>';
            console.log("🔍 DEBUG: Guides grid updated");
        } else {
            console.error("🚨 DEBUG: Guides grid not found");
        }
    }

    updateAllDisplays() {
        console.log("🔍 DEBUG: updateAllDisplays called");
        
        try {
            // Update server time
            const serverTime = this.getServerTime();
            const timeString = serverTime.toUTCString().slice(17, 25);
            
            const timeElement = document.getElementById('server-time');
            if (timeElement) {
                timeElement.textContent = timeString;
                console.log("🔍 DEBUG: Server time updated:", timeString);
            }

            // Update basic status
            const vsDayElement = document.getElementById('current-vs-day');
            if (vsDayElement) {
                vsDayElement.textContent = "Tuesday - Base Expansion";
                console.log("🔍 DEBUG: VS Day updated");
            }

            const armsPhaseElement = document.getElementById('arms-phase');
            if (armsPhaseElement) {
                armsPhaseElement.textContent = "City Building";
                console.log("🔍 DEBUG: Arms phase updated");
            }

            const priorityElement = document.getElementById('priority-level');
            if (priorityElement) {
                priorityElement.textContent = "HIGH";
                priorityElement.style.color = '#10b981';
                console.log("🔍 DEBUG: Priority level updated");
            }

            // Update priority display
            const priorityTimeElement = document.getElementById('next-priority-time');
            if (priorityTimeElement) {
                priorityTimeElement.textContent = "2h 15m";
                console.log("🔍 DEBUG: Priority time updated");
            }

            const priorityEventElement = document.getElementById('next-priority-event');
            if (priorityEventElement) {
                priorityEventElement.textContent = "City Building + Base Expansion";
                console.log("🔍 DEBUG: Priority event updated");
            }

            const currentActionElement = document.getElementById('current-action');
            if (currentActionElement) {
                currentActionElement.textContent = "Perfect alignment active - use construction speedups!";
                console.log("🔍 DEBUG: Current action updated");
            }

            const countdownElement = document.getElementById('countdown-timer');
            if (countdownElement) {
                countdownElement.textContent = "1h 45m";
                console.log("🔍 DEBUG: Countdown timer updated");
            }

            const currentPhaseElement = document.getElementById('current-phase');
            if (currentPhaseElement) {
                currentPhaseElement.textContent = "City Building Active";
                console.log("🔍 DEBUG: Current phase updated");
            }

            console.log("🔍 DEBUG: All displays updated successfully");
        } catch (error) {
            console.error('🚨 DEBUG: Display update error:', error);
        }
    }

    startUpdateLoop() {
        console.log("🔍 DEBUG: Starting update loop...");
        
        try {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            
            this.updateInterval = setInterval(() => {
                if (this.isVisible) {
                    this.updateAllDisplays();
                }
            }, 5000); // Every 5 seconds for testing
            
            console.log("🔍 DEBUG: Update loop started");
        } catch (error) {
            console.error('🚨 DEBUG: Update loop error:', error);
        }
    }

    loadSettings() {
        console.log("🔍 DEBUG: loadSettings called");
        
        try {
            const saved = localStorage.getItem('lwn-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.timeOffset = settings.timeOffset || 0;
                this.notificationsEnabled = settings.notificationsEnabled || false;
                this.isSetupComplete = settings.isSetupComplete || false;
                console.log("🔍 DEBUG: Settings loaded:", settings);
            } else {
                console.log("🔍 DEBUG: No saved settings found");
            }
        } catch (error) {
            console.error('🚨 DEBUG: Settings load error:', error);
        }
    }

    saveSettings() {
        console.log("🔍 DEBUG: saveSettings called");
        
        try {
            const settings = {
                timeOffset: this.timeOffset,
                notificationsEnabled: this.notificationsEnabled,
                isSetupComplete: this.isSetupComplete
            };
            localStorage.setItem('lwn-settings', JSON.stringify(settings));
            console.log("🔍 DEBUG: Settings saved:", settings);
        } catch (error) {
            console.error('🚨 DEBUG: Settings save error:', error);
        }
    }

    handleError(message) {
        console.error('🚨 DEBUG: Application error:', message);
    }
}

// Initialize with extensive debugging
console.log("🔍 DEBUG: Setting up DOMContentLoaded listener...");

document.addEventListener('DOMContentLoaded', async () => {
    console.log("🔍 DEBUG: DOMContentLoaded fired!");
    
    try {
        console.log("🔍 DEBUG: Creating VSPointsOptimizer instance...");
        const app = new VSPointsOptimizer();
        
        // Make app globally available
        window.lastWarNexus = app;
        window.debugApp = app; // Extra debug reference
        
        console.log("✅ DEBUG: Application initialized successfully!");
        console.log("🔍 DEBUG: App instance:", app);
        
        // Force update displays after 1 second
        setTimeout(() => {
            console.log("🔍 DEBUG: Forcing display update...");
            app.updateAllDisplays();
        }, 1000);
        
    } catch (error) {
        console.error('🚨 DEBUG: Application initialization failed:', error);
        console.error('🚨 DEBUG: Error stack:', error.stack);
        
        // Show debug error message
        document.body.innerHTML += `
            <div style="
                position: fixed;
                top: 10px;
                left: 10px;
                background: red;
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 9999;
                max-width: 500px;
                font-family: monospace;
            ">
                <h3>🚨 DEBUG ERROR</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p><strong>Stack:</strong> ${error.stack}</p>
                <button onclick="this.parentElement.remove()">Close</button>
            </div>
        `;
    }
});

console.log("🔍 DEBUG: Script fully loaded");

// Global error catching
window.addEventListener('error', (event) => {
    console.error('🚨 DEBUG: Global error caught:', event.error);
    console.error('🚨 DEBUG: Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 DEBUG: Unhandled promise rejection:', event.reason);
});

console.log("🔍 DEBUG: All event listeners set up");