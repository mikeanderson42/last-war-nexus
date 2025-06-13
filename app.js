/**
 * Last War Nexus - VS Points & Arms Race Optimizer
 * Production-ready application with accurate game mechanics
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

        // Corrected 6-position Arms Race system (PDF verified)
        // 5 unique phases cycling through 6 positions (0-5) every 4 hours
        this.data = {
            // Arms Race: 6 positions, 5 unique phases that cycle
            armsRacePhases: [
                { 
                    id: 'city_building', 
                    name: "City Building", 
                    icon: "🏗️", 
                    activities: ["Building upgrades", "Construction speedups", "Base expansion"] 
                },
                { 
                    id: 'unit_progression', 
                    name: "Unit Progression", 
                    icon: "⚔️", 
                    activities: ["Troop training", "Training speedups", "Unit upgrades"] 
                },
                { 
                    id: 'tech_research', 
                    name: "Tech Research", 
                    icon: "🔬", 
                    activities: ["Research completion", "Research speedups", "Tech advancement"] 
                },
                { 
                    id: 'drone_boost', 
                    name: "Drone Boost", 
                    icon: "🚁", 
                    activities: ["Stamina usage", "Drone missions", "Radar activities"] 
                },
                { 
                    id: 'hero_advancement', 
                    name: "Hero Advancement", 
                    icon: "🦸", 
                    activities: ["Hero recruitment", "Hero EXP", "Skill medals"] 
                }
            ],
            
            // Alliance VS: Monday-Saturday with specific focus areas (PDF verified)
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
            
            // High-priority alignment windows (optimized combinations)
            priorityAlignments: [
                // Monday - Radar Training
                { 
                    vsDay: 1, 
                    armsPhase: "Drone Boost", 
                    reason: "Stamina & radar activities align perfectly", 
                    benefit: "Maximum Efficiency",
                    synergy: ["stamina_usage", "radar_missions", "drone_data"]
                },
                { 
                    vsDay: 1, 
                    armsPhase: "Hero Advancement", 
                    reason: "Hero EXP complements radar training", 
                    benefit: "High Synergy",
                    synergy: ["hero_exp", "skill_development"]
                },
                
                // Tuesday - Base Expansion
                { 
                    vsDay: 2, 
                    armsPhase: "City Building", 
                    reason: "Construction activities align perfectly", 
                    benefit: "Perfect Match",
                    synergy: ["construction_speedups", "building_upgrades", "base_expansion"]
                },
                
                // Wednesday - Age of Science
                { 
                    vsDay: 3, 
                    armsPhase: "Tech Research", 
                    reason: "Research activities align perfectly", 
                    benefit: "Perfect Alignment",
                    synergy: ["research_speedups", "tech_advancement", "valor_badges"]
                },
                
                // Thursday - Train Heroes
                { 
                    vsDay: 4, 
                    armsPhase: "Hero Advancement", 
                    reason: "Hero activities align perfectly", 
                    benefit: "Perfect Match",
                    synergy: ["hero_recruitment", "hero_exp", "skill_medals"]
                },
                
                // Friday - Total Mobilization (multiple alignments)
                { 
                    vsDay: 5, 
                    armsPhase: "City Building", 
                    reason: "Construction component of total mobilization", 
                    benefit: "Peak Efficiency",
                    synergy: ["construction_speedups", "comprehensive_activities"]
                },
                { 
                    vsDay: 5, 
                    armsPhase: "Unit Progression", 
                    reason: "Training component of mobilization", 
                    benefit: "High Impact",
                    synergy: ["training_speedups", "comprehensive_activities"]
                },
                { 
                    vsDay: 5, 
                    armsPhase: "Tech Research", 
                    reason: "Research component of mobilization", 
                    benefit: "Maximum Impact",
                    synergy: ["research_speedups", "comprehensive_activities"]
                },
                { 
                    vsDay: 5, 
                    armsPhase: "Hero Advancement", 
                    reason: "Hero component of mobilization", 
                    benefit: "High Impact",
                    synergy: ["hero_activities", "comprehensive_activities"]
                },
                
                // Saturday - Enemy Buster
                { 
                    vsDay: 6, 
                    armsPhase: "Unit Progression", 
                    reason: "Troop training supports combat preparation", 
                    benefit: "Strong Synergy",
                    synergy: ["troop_training", "combat_preparation"]
                }
            ]
        };

        this.init();
    }

    init() {
        try {
            this.setupEventListeners();
            this.loadSettings();
            
            // Check if setup is needed
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
            // Server settings dropdown
            const serverToggle = document.getElementById('server-toggle');
            if (serverToggle) {
                serverToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown('server');
                });
            }

            // Display settings dropdown
            const settingsToggle = document.getElementById('settings-toggle');
            if (settingsToggle) {
                settingsToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown('settings');
                });
            }

            // Time offset change
            const timeOffsetSelect = document.getElementById('time-offset');
            if (timeOffsetSelect) {
                timeOffsetSelect.addEventListener('change', (e) => {
                    this.timeOffset = parseInt(e.target.value, 10);
                    this.saveSettings();
                    this.updateAllDisplays();
                });
            }

            // Notifications toggle
            const notificationsToggle = document.getElementById('notifications-toggle');
            if (notificationsToggle) {
                notificationsToggle.addEventListener('change', (e) => {
                    const enabled = e.target.value === 'enabled';
                    this.setNotifications(enabled);
                });
            }

            // Current phase override
            const currentPhaseSelect = document.getElementById('current-phase-select');
            if (currentPhaseSelect) {
                currentPhaseSelect.addEventListener('change', (e) => {
                    this.currentPhaseOverride = e.target.value;
                    this.saveSettings();
                    this.updateAllDisplays();
                });
            }

            // Next phase override
            const nextPhaseSelect = document.getElementById('next-phase-select');
            if (nextPhaseSelect) {
                nextPhaseSelect.addEventListener('change', (e) => {
                    this.nextPhaseOverride = e.target.value;
                    this.saveSettings();
                    this.updateAllDisplays();
                });
            }

            // Setup button
            const setupButton = document.getElementById('setup-button');
            if (setupButton) {
                setupButton.addEventListener('click', () => {
                    this.showSetupModal();
                });
            }

            // Setup modal events
            this.setupSetupModalEvents();

            // Tab navigation
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tab = e.currentTarget.getAttribute('data-tab');
                    if (tab) {
                        this.switchTab(tab);
                    }
                });
            });

            // Banner close
            const bannerClose = document.getElementById('banner-close');
            if (bannerClose) {
                bannerClose.addEventListener('click', () => {
                    this.hideBanner();
                });
            }

            // Close dropdowns on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.server-dropdown-container') && 
                    !e.target.closest('.settings-dropdown-container')) {
                    this.closeAllDropdowns();
                }
            });

            // Visibility change handling
            document.addEventListener('visibilitychange', () => {
                this.isVisible = !document.hidden;
                if (this.isVisible) {
                    this.updateAllDisplays();
                }
            });

            // Window resize handling
            window.addEventListener('resize', this.debounce(() => {
                this.closeAllDropdowns();
                this.updateAllDisplays();
            }, 250));

            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.altKey) {
                    switch (e.key) {
                        case '1':
                            e.preventDefault();
                            this.switchTab('priority');
                            break;
                        case '2':
                            e.preventDefault();
                            this.switchTab('schedule');
                            break;
                        case '3':
                            e.preventDefault();
                            this.switchTab('guides');
                            break;
                    }
                }
                
                // Close dropdowns on Escape
                if (e.key === 'Escape') {
                    this.closeAllDropdowns();
                }
            });

        } catch (error) {
            console.error('Event listener setup error:', error);
        }
    }

    // Utility function for debouncing resize events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Setup Modal Methods
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

    setupSetupModalEvents() {
        try {
            // Setup time offset change
            const setupTimeOffset = document.getElementById('setup-time-offset');
            if (setupTimeOffset) {
                setupTimeOffset.addEventListener('change', (e) => {
                    this.timeOffset = parseInt(e.target.value, 10);
                    this.updateSetupTimezone();
                });
            }

            // Setup complete button
            const setupComplete = document.getElementById('setup-complete');
            if (setupComplete) {
                setupComplete.addEventListener('click', () => {
                    this.completeSetup();
                });
            }

            // Setup skip button
            const setupSkip = document.getElementById('setup-skip');
            if (setupSkip) {
                setupSkip.addEventListener('click', () => {
                    this.skipSetup();
                });
            }

            // Next phase auto-update based on current phase
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            if (setupCurrentPhase) {
                setupCurrentPhase.addEventListener('change', (e) => {
                    this.updateNextPhaseOptions(e.target.value);
                });
            }

            // Modal backdrop click to close
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

    populateSetupDefaults() {
        try {
            // Set current time offset
            const setupTimeOffset = document.getElementById('setup-time-offset');
            if (setupTimeOffset) {
                setupTimeOffset.value = this.timeOffset.toString();
            }

            // Auto-detect current phase based on time (as fallback)
            const autoPhase = this.getCurrentArmsPhase();
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            if (setupCurrentPhase && !this.currentPhaseOverride) {
                setupCurrentPhase.value = autoPhase.id;
            }

            // Set next phase based on current
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
            // Get setup values
            const setupTimeOffset = document.getElementById('setup-time-offset');
            const setupCurrentPhase = document.getElementById('setup-current-phase');
            const setupNextPhase = document.getElementById('setup-next-phase');
            const notificationRadios = document.querySelectorAll('input[name="notifications"]');

            // Apply settings
            this.timeOffset = parseInt(setupTimeOffset?.value || '0', 10);
            this.currentPhaseOverride = setupCurrentPhase?.value || null;
            this.nextPhaseOverride = setupNextPhase?.value || null;

            // Handle notifications
            const notificationChoice = Array.from(notificationRadios).find(r => r.checked)?.value;
            const wantsNotifications = notificationChoice === 'enabled';

            if (wantsNotifications) {
                await this.requestNotificationPermission();
            } else {
                this.notificationsEnabled = false;
            }

            // Mark setup as complete
            this.isSetupComplete = true;

            // Save all settings
            this.saveSettings();

            // Update UI
            this.syncSettingsToUI();

            // Hide modal and start app
            this.hideSetupModal();
            this.updateAllDisplays();
            this.startUpdateLoop();

            this.announceToScreenReader('Setup completed successfully');

        } catch (error) {
            console.error('Setup completion error:', error);
            this.handleError('Failed to complete setup');
        }
    }

    skipSetup() {
        try {
            // Use default settings
            this.timeOffset = 0;
            this.currentPhaseOverride = null;
            this.nextPhaseOverride = null;
            this.notificationsEnabled = false;
            this.isSetupComplete = true;

            // Save settings
            this.saveSettings();

            // Update UI
            this.syncSettingsToUI();

            // Hide modal and start app
            this.hideSetupModal();
            this.updateAllDisplays();
            this.startUpdateLoop();

            this.announceToScreenReader('Setup skipped, using default settings');

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

    syncSettingsToUI() {
        try {
            // Update dropdowns
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

    toggleDropdown(type) {
        const dropdown = document.getElementById(`${type}-dropdown`);
        const toggle = document.getElementById(`${type}-toggle`);
        
        if (dropdown && toggle) {
            const isOpen = dropdown.classList.contains('show');
            this.closeAllDropdowns();
            
            if (!isOpen) {
                dropdown.classList.add('show');
                toggle.classList.add('active');
                
                // Ensure dropdown stays within viewport
                this.positionDropdown(dropdown, toggle);
            }
        }
    }

    positionDropdown(dropdown, toggle) {
        try {
            // Wait for next frame to ensure styles are applied
            requestAnimationFrame(() => {
                const dropdownRect = dropdown.getBoundingClientRect();
                const toggleRect = toggle.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Adjust horizontal position if dropdown goes off-screen
                if (dropdownRect.right > viewportWidth) {
                    const overflow = dropdownRect.right - viewportWidth;
                    dropdown.style.right = `${overflow + 8}px`;
                }
                
                // Adjust vertical position if dropdown goes off-screen
                if (dropdownRect.bottom > viewportHeight) {
                    dropdown.style.top = 'auto';
                    dropdown.style.bottom = '100%';
                    dropdown.style.transform = 'translateY(10px)';
                }
            });
        } catch (error) {
            console.error('Dropdown positioning error:', error);
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.server-dropdown, .settings-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
            // Reset positioning styles
            dropdown.style.right = '';
            dropdown.style.top = '';
            dropdown.style.bottom = '';
            dropdown.style.transform = '';
        });
        document.querySelectorAll('.server-btn, .settings-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    switchTab(tabName) {
        try {
            this.activeTab = tabName;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Activate selected tab
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
            
            // Announce to screen readers
            this.announceToScreenReader(`Switched to ${tabName} tab`);
            
        } catch (error) {
            console.error('Tab switch error:', error);
        }
    }

    getServerTime() {
        try {
            const now = new Date();
            return new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
        } catch (error) {
            console.error('Server time calculation error:', error);
            return new Date(); // Fallback to local time
        }
    }

    // Calculate current Arms Race phase (6-position system with user override)
    getCurrentArmsPhase() {
        try {
            // Use override if available
            if (this.currentPhaseOverride) {
                const overridePhase = this.data.armsRacePhases.find(p => p.id === this.currentPhaseOverride);
                if (overridePhase) {
                    const serverTime = this.getServerTime();
                    const hour = serverTime.getUTCHours();
                    
                    return {
                        ...overridePhase,
                        position: Math.floor(hour / 4) % 6,
                        startHour: Math.floor(hour / 4) * 4,
                        endHour: (Math.floor(hour / 4) * 4 + 4) % 24,
                        hoursRemaining: 4 - (hour % 4),
                        minutesRemaining: 60 - serverTime.getUTCMinutes(),
                        isOverride: true
                    };
                }
            }

            // Default automatic calculation
            const serverTime = this.getServerTime();
            const hour = serverTime.getUTCHours();
            
            // Calculate position (0-5) in 6-position cycle
            const position = Math.floor(hour / 4) % 6;
            
            // Map position to phase (5 unique phases cycling)
            const phaseIndex = position % this.data.armsRacePhases.length;
            const phase = this.data.armsRacePhases[phaseIndex];
            
            return {
                ...phase,
                position: position,
                startHour: Math.floor(hour / 4) * 4,
                endHour: (Math.floor(hour / 4) * 4 + 4) % 24,
                hoursRemaining: 4 - (hour % 4),
                minutesRemaining: 60 - serverTime.getUTCMinutes(),
                isOverride: false
            };
        } catch (error) {
            console.error('Arms phase calculation error:', error);
            return this.data.armsRacePhases[0];
        }
    }

    getNextArmsPhase() {
        try {
            // Use override if available
            if (this.nextPhaseOverride) {
                const overridePhase = this.data.armsRacePhases.find(p => p.id === this.nextPhaseOverride);
                if (overridePhase) {
                    return {
                        ...overridePhase,
                        isOverride: true
                    };
                }
            }

            // Calculate next phase automatically
            const currentPhase = this.getCurrentArmsPhase();
            const currentIndex = this.data.armsRacePhases.findIndex(p => p.id === currentPhase.id);
            const nextIndex = (currentIndex + 1) % this.data.armsRacePhases.length;
            
            return {
                ...this.data.armsRacePhases[nextIndex],
                isOverride: false
            };
        } catch (error) {
            console.error('Next phase calculation error:', error);
            return this.data.armsRacePhases[0];
        }
    }

    getCurrentVSDay() {
        try {
            const serverTime = this.getServerTime();
            const dayOfWeek = serverTime.getUTCDay();
            
            // VS events run Monday (1) to Saturday (6)
            const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek);
            
            if (vsDay) {
                return vsDay;
            } else {
                // Sunday - preparation day
                return { 
                    day: 0, 
                    name: "Sunday", 
                    title: "Preparation Day", 
                    focus: "Prepare resources and plan for the week ahead",
                    activities: ["resource_preparation", "strategy_planning"]
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
                // Currently in a priority window
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
            
            // Check next 7 days
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
                    
                    // Check all 6 positions for this phase
                    for (let position = 0; position < 6; position++) {
                        if (this.data.armsRacePhases[position % this.data.armsRacePhases.length].name === phase.name) {
                            const windowTime = new Date(checkDate);
                            windowTime.setUTCHours(position * 4, 0, 0, 0);
                            
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
            const timeString = serverTime.toUTCString().slice(17, 25);
            
            const timeElement = document.getElementById('server-time');
            if (timeElement) {
                timeElement.textContent = timeString;
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
            
            // Update VS day
            const vsDayElement = document.getElementById('current-vs-day');
            if (vsDayElement) {
                vsDayElement.textContent = currentVSDay.title;
            }
            
            // Update Arms phase
            const armsPhaseElement = document.getElementById('arms-phase');
            if (armsPhaseElement) {
                armsPhaseElement.textContent = currentArmsPhase.name;
            }
            
            // Update priority level
            const priorityElement = document.getElementById('priority-level');
            if (priorityElement) {
                priorityElement.textContent = isHighPriority ? 'HIGH' : 'Normal';
                priorityElement.style.color = isHighPriority ? '#10b981' : '#b8b8c8';
            }
            
            // Update phase countdown
            const countdownElement = document.getElementById('countdown-timer');
            if (countdownElement) {
                const timeRemaining = (currentArmsPhase.hoursRemaining * 60 * 60 * 1000) +
                                   (currentArmsPhase.minutesRemaining * 60 * 1000);
                countdownElement.textContent = this.formatTime(timeRemaining);
            }
            
            // Update current phase label
            const currentPhaseElement = document.getElementById('current-phase');
            if (currentPhaseElement) {
                currentPhaseElement.textContent = `${currentArmsPhase.name} Active`;
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
                // Currently active priority window
                if (activeNowElement) activeNowElement.style.display = 'flex';
                if (badgeLabelElement) badgeLabelElement.textContent = 'PEAK EFFICIENCY ACTIVE';
                if (priorityTimeElement) priorityTimeElement.textContent = this.formatTime(nextWindow.timeRemaining);
                if (priorityEventElement) priorityEventElement.textContent = `${nextWindow.phase.name} + ${nextWindow.vsDay.title}`;
                if (currentActionElement) currentActionElement.textContent = `⚡ ${nextWindow.alignment.reason}`;
                if (eventIconElement) eventIconElement.textContent = nextWindow.phase.icon;
                if (countdownLabelElement) countdownLabelElement.textContent = 'PHASE ENDS IN';
                if (efficiencyElement) efficiencyElement.textContent = nextWindow.alignment.benefit;
            } else {
                // Next upcoming priority window
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

    updateBanner() {
        try {
            const banner = document.getElementById('priority-banner');
            if (!banner) return;
            
            const nextWindow = this.findNextPriorityWindow();
            
            if (nextWindow && nextWindow.isActive) {
                // Show active priority banner
                const titleElement = document.getElementById('banner-title');
                const timeElement = document.getElementById('banner-time');
                
                if (titleElement) titleElement.textContent = 'Peak Efficiency Active!';
                if (timeElement) timeElement.textContent = this.formatTime(nextWindow.timeRemaining);
                
                banner.classList.add('peak-priority', 'show');
                
                // Show notification if this is a new window
                if (this.notificationsEnabled && this.lastNotifiedWindow !== nextWindow.alignment.reason) {
                    this.showNotification('High Priority Active!', `${nextWindow.phase.name} + ${nextWindow.vsDay.title}`);
                    this.lastNotifiedWindow = nextWindow.alignment.reason;
                }
            } else if (nextWindow && nextWindow.timeRemaining < 2 * 60 * 60 * 1000) {
                // Show upcoming priority banner (within 2 hours)
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

    hideBanner() {
        const banner = document.getElementById('priority-banner');
        if (banner) {
            banner.classList.remove('show', 'peak-priority');
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

    populatePriorityWindows() {
        try {
            const grid = document.getElementById('priority-grid');
            if (!grid) return;
            
            const now = this.getServerTime();
            const windows = [];
            
            // Generate priority windows for the next 7 days
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
                    
                    // Find all occurrences of this phase in the 6-position cycle
                    for (let position = 0; position < 6; position++) {
                        if (this.data.armsRacePhases[position % this.data.armsRacePhases.length].name === phase.name) {
                            const startTime = new Date(checkDate);
                            startTime.setUTCHours(position * 4, 0, 0, 0);
                            
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
                                timeDisplay: isActive ? 'Active Now' : timeDiff > 0 ? `in ${this.formatTime(timeDiff)}` : 'Completed'
                            });
                        }
                    }
                }
            }
            
            // Sort by time difference and remove duplicates
            windows.sort((a, b) => a.timeDiff - b.timeDiff);
            const uniqueWindows = windows.filter((window, index, arr) => 
                index === 0 || 
                arr[index - 1].startTime.getTime() !== window.startTime.getTime() ||
                arr[index - 1].alignment.reason !== window.alignment.reason
            );
            
            // Update count
            const countElement = document.getElementById('priority-count');
            if (countElement) {
                const activeCount = uniqueWindows.filter(w => w.isActive).length;
                const upcomingCount = uniqueWindows.filter(w => !w.isActive && w.timeDiff > 0).length;
                countElement.textContent = `${activeCount + upcomingCount} Windows`;
            }
            
            // Generate HTML
            const html = uniqueWindows.slice(0, 12).map(window => `
                <div class="priority-window-card ${window.isActive ? 'active' : ''} ${window.isPeak ? 'peak' : ''}">
                    <div style="background: var(--bg-tertiary); padding: 12px; border-bottom: 1px solid var(--border-primary); display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">${window.timeDisplay}</div>
                        <div style="padding: 3px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; background: ${window.isActive ? 'var(--accent-success)' : 'var(--accent-warning)'}; color: white;">
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

    populateSchedule() {
        try {
            const grid = document.getElementById('schedule-content');
            if (!grid) return;
            
            const schedule = [];
            const now = this.getServerTime();
            
            // Generate 7-day schedule
            for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                const checkDate = new Date(now);
                checkDate.setUTCDate(now.getUTCDate() + dayOffset);
                const dayOfWeek = checkDate.getUTCDay();
                const isToday = dayOffset === 0;
                
                const vsDay = this.data.vsDays.find(day => day.day === dayOfWeek) || 
                             { name: "Sunday", title: "Preparation Day", focus: "Prepare for the week" };
                
                // Generate 6 Arms Race positions for this day
                const phases = [];
                for (let position = 0; position < 6; position++) {
                    const phaseIndex = position % this.data.armsRacePhases.length;
                    const phase = this.data.armsRacePhases[phaseIndex];
                    
                    const isPriority = this.data.priorityAlignments.some(a => 
                        a.vsDay === dayOfWeek && a.armsPhase === phase.name
                    );
                    
                    const startHour = position * 4;
                    const endHour = (position * 4 + 4) % 24;
                    const isActive = isToday && 
                        now.getUTCHours() >= startHour && 
                        now.getUTCHours() < (startHour + 4);
                    
                    phases.push({
                        ...phase,
                        position,
                        isPriority,
                        isActive,
                        timeRange: `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`
                    });
                }
                
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

    populateGuides() {
        try {
            const grid = document.getElementById('guides-content');
            if (!grid) return;
            
            const guides = [
                {
                    title: "6-Position Arms Race System",
                    category: "Core Mechanics",
                    icon: "🔄",
                    description: "Arms Race runs 6 positions (0-5) with 5 unique phases cycling every 4 hours. Understanding this rotation is key to optimization.",
                    tips: ["Track position changes every 4 hours", "5 phases cycle through 6 positions", "Plan activities around phase rotation"]
                },
                {
                    title: "Perfect Alignment Windows",
                    category: "Peak Efficiency",
                    icon: "🎯",
                    description: "Time activities when Arms Race phases perfectly match Alliance VS focus days for maximum dual rewards.",
                    tips: ["Tech Research + Age of Science = Perfect", "City Building + Base Expansion = Maximum", "Hero Advancement + Train Heroes = Ideal"]
                },
                {
                    title: "Friday Total Mobilization",
                    category: "Weekly Peak",
                    icon: "🚀",
                    description: "Friday offers multiple high-priority windows since Total Mobilization accepts all activity types.",
                    tips: ["Save speedups for Friday", "Multiple Arms Race alignments possible", "Highest daily point potential"]
                },
                {
                    title: "Server Time Management",
                    category: "Timing Strategy",
                    icon: "🕐",
                    description: "Master your server's 4-hour Arms Race rotation and avoid the 5-minute post-reset gap.",
                    tips: ["Know exact server reset time", "Account for 5-minute point gap", "Pre-plan phase transitions"]
                },
                {
                    title: "Dual Event Synergy",
                    category: "Advanced Strategy",
                    icon: "⚡",
                    description: "Maximize efficiency by focusing on activities that benefit both Arms Race and Alliance VS simultaneously.",
                    tips: ["Hero EXP works for both events", "Construction speedups double-count", "Research activities align perfectly"]
                },
                {
                    title: "Resource Conservation",
                    category: "Planning",
                    icon: "💎",
                    description: "Save premium resources for high-priority alignment windows rather than using them during low-synergy periods.",
                    tips: ["Hoard speedups for perfect alignments", "Use basic resources during normal time", "Track upcoming priority windows"]
                },
                {
                    title: "Phase-Specific Activities",
                    category: "Tactical Guide",
                    icon: "📋",
                    description: "Each Arms Race phase rewards different activities. Optimize your actions for the current phase.",
                    tips: ["City Building: Construction focus", "Tech Research: Lab activities", "Hero Advancement: Recruitment & EXP"]
                },
                {
                    title: "Mobile Optimization",
                    category: "Practical Tips",
                    icon: "📱",
                    description: "Set up notifications and quick-access strategies for managing events while mobile gaming.",
                    tips: ["Use browser notifications", "Bookmark priority times", "Set phone alarms for peak windows"]
                }
            ];
            
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

    announceToScreenReader(message) {
        try {
            const announcer = document.getElementById('status-announcements');
            if (announcer) {
                announcer.textContent = message;
                setTimeout(() => {
                    announcer.textContent = '';
                }, 1000);
            }
        } catch (error) {
            console.error('Screen reader announcement error:', error);
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
                
                // Sync to UI
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
        this.announceToScreenReader(`Error: ${message}`);
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

// Initialize the application with proper error handling
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("Last War Nexus initializing with corrected 6-position Arms Race system...");
        const app = new VSPointsOptimizer();
        await app.init();
        
        // Make app globally available for debugging
        window.lastWarNexus = app;
        
    } catch (error) {
        console.error('Application initialization failed:', error);
        
        // Show fallback error message
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

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Only log, don't disrupt user experience
    if (window.lastWarNexus && typeof window.lastWarNexus.handleError === 'function') {
        window.lastWarNexus.handleError('An unexpected error occurred');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Only log, don't disrupt user experience
    if (window.lastWarNexus && typeof window.lastWarNexus.handleError === 'function') {
        window.lastWarNexus.handleError('A network or processing error occurred');
    }
});