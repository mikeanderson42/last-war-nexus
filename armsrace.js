// Arms Race Manager - Fixed Version
(function() {
    'use strict';

    // Constants
    const ARMS_RACE_PHASES = [
        "City Building",
        "Unit Progression", 
        "Tech Research",
        "Drone Boost",
        "Hero Advancement",
        "Purchases/Duel"
    ];

    const PHASE_DESCRIPTIONS = {
        "City Building": "Focus on base construction. Buildings complete faster.",
        "Unit Progression": "Train troops and vehicles. Military production boosted.",
        "Tech Research": "Research technologies. Science output increased.",
        "Drone Boost": "Enhanced drone operations. Increased capacity.",
        "Hero Advancement": "Level up heroes. Hero XP gains boosted.",
        "Purchases/Duel": "Shopping and PvP. Store discounts active."
    };

    // Core calculation functions
    function calculateServerBirthday(serverNumber) {
        const baseDate = new Date("2024-01-20T08:00:00Z");
        const serverDiff = serverNumber - 93;
        const daysToAdd = Math.floor(serverDiff / 3);
        
        const serverBirth = new Date(baseDate);
        serverBirth.setDate(baseDate.getDate() + daysToAdd);
        serverBirth.setHours(8 + (serverNumber % 3), 0, 0, 0);
        
        return serverBirth;
    }

    function getCurrentPhase(serverNumber) {
        const now = new Date();
        const currentHour = now.getUTCHours();
        const phaseIndex = Math.floor(currentHour / 4);
        const nextPhaseIndex = (phaseIndex + 1) % 6;
        
        // Calculate time to next phase
        const nextPhaseHour = ((phaseIndex + 1) * 4) % 24;
        let hoursToNext = nextPhaseHour - currentHour;
        if (hoursToNext <= 0) hoursToNext += 24;
        
        const minutesToNext = 59 - now.getUTCMinutes();
        const secondsToNext = 59 - now.getUTCSeconds();
        
        return {
            current_phase: ARMS_RACE_PHASES[phaseIndex],
            next_phase: ARMS_RACE_PHASES[nextPhaseIndex],
            phase_progress: ((now.getUTCMinutes() * 60 + now.getUTCSeconds()) / 14400) * 100,
            time_to_next: {
                hours: Math.max(0, hoursToNext - 1),
                minutes: minutesToNext,
                seconds: secondsToNext
            }
        };
    }

    // Arms Race Manager Class
    class ArmsRaceManager {
        constructor() {
            this.selectedServer = null;
            this.currentPhaseData = null;
            this.updateInterval = null;
            this.initialized = false;
        }

        init() {
            try {
                this.setupServerSelector();
                this.setupPhaseDisplay();
                this.setupEventListeners();
                this.loadSavedServer();
                this.initialized = true;
                console.log('Arms Race Manager initialized successfully');
            } catch (error) {
                console.error('Arms Race initialization error:', error);
            }
        }

        setupServerSelector() {
            const serverSelect = document.getElementById('server-select');
            if (!serverSelect) return;

            // Clear and populate server options
            serverSelect.innerHTML = '<option value="">Select Server</option>';

            // Add server ranges
            for (let i = 100; i <= 900; i += 50) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Server ${i}`;
                serverSelect.appendChild(option);
            }

            // Add custom server option
            const customOption = document.createElement('option');
            customOption.value = 'custom';
            customOption.textContent = 'Enter Custom Server...';
            serverSelect.appendChild(customOption);
        }

        setupPhaseDisplay() {
            const phaseGrid = document.getElementById('phase-grid');
            if (!phaseGrid) return;

            phaseGrid.innerHTML = '';
            
            ARMS_RACE_PHASES.forEach((phase, index) => {
                const startHour = index * 4;
                const endHour = (startHour + 4) % 24;
                const timeRange = `${startHour.toString().padStart(2, '0')}:00-${endHour.toString().padStart(2, '0')}:00`;
                
                const phaseCard = document.createElement('div');
                phaseCard.className = 'phase-card';
                phaseCard.innerHTML = `
                    <div class="phase-time">${timeRange}</div>
                    <div class="phase-name">${phase}</div>
                    <div class="phase-indicator"></div>
                `;
                phaseGrid.appendChild(phaseCard);
            });
        }

        setupEventListeners() {
            const serverSelect = document.getElementById('server-select');
            if (serverSelect) {
                serverSelect.addEventListener('change', (e) => this.handleServerChange(e.target.value));
            }
        }

        handleServerChange(serverNumber) {
            if (serverNumber === 'custom') {
                this.promptCustomServer();
                return;
            }

            if (!serverNumber) {
                this.clearDisplay();
                return;
            }

            this.selectedServer = parseInt(serverNumber);
            this.startTracking();
            this.saveSelectedServer();
        }

        promptCustomServer() {
            const customServer = prompt('Enter your server number (e.g., 555):');
            if (customServer && !isNaN(customServer) && customServer > 0) {
                const serverSelect = document.getElementById('server-select');
                
                // Add to dropdown if not exists
                let optionExists = false;
                Array.from(serverSelect.options).forEach(option => {
                    if (option.value === customServer) {
                        optionExists = true;
                    }
                });
                
                if (!optionExists) {
                    const option = document.createElement('option');
                    option.value = customServer;
                    option.textContent = `Server ${customServer}`;
                    serverSelect.insertBefore(option, serverSelect.lastElementChild);
                }
                
                serverSelect.value = customServer;
                this.selectedServer = parseInt(customServer);
                this.startTracking();
                this.saveSelectedServer();
            } else {
                document.getElementById('server-select').value = '';
            }
        }

        startTracking() {
            if (!this.selectedServer) return;

            // Clear existing interval
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }

            // Update immediately
            this.updateDisplay();
            
            // Update every second
            this.updateInterval = setInterval(() => {
                this.updateDisplay();
            }, 1000);

            this.updateServerStatus('active', `Server ${this.selectedServer} - Active`);
        }

        updateDisplay() {
            if (!this.selectedServer) return;

            try {
                const phaseData = getCurrentPhase(this.selectedServer);
                
                // Check for phase change
                if (this.currentPhaseData && 
                    this.currentPhaseData.current_phase !== phaseData.current_phase) {
                    this.onPhaseChange(phaseData);
                }
                
                this.currentPhaseData = phaseData;
                this.renderPhaseData(phaseData);
                
            } catch (error) {
                console.error('Arms Race update error:', error);
                this.updateServerStatus('error', 'Calculation Error');
            }
        }

        renderPhaseData(phaseData) {
            // Update current phase
            const currentPhaseEl = document.getElementById('current-phase');
            if (currentPhaseEl) {
                currentPhaseEl.textContent = phaseData.current_phase;
            }

            // Update descriptions
            const currentTitle = document.getElementById('current-phase-title');
            const currentDesc = document.getElementById('current-phase-description');
            const nextTitle = document.getElementById('next-phase-title');
            const nextDesc = document.getElementById('next-phase-description');

            if (currentTitle) currentTitle.textContent = phaseData.current_phase;
            if (currentDesc) currentDesc.textContent = PHASE_DESCRIPTIONS[phaseData.current_phase];
            if (nextTitle) nextTitle.textContent = `Next: ${phaseData.next_phase}`;
            if (nextDesc) nextDesc.textContent = PHASE_DESCRIPTIONS[phaseData.next_phase];

            // Update progress
            const progressFill = document.getElementById('progress-fill');
            const progressText = document.getElementById('progress-text');
            if (progressFill && progressText) {
                const progress = Math.round(phaseData.phase_progress);
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
            }

            // Update countdown
            const { hours, minutes, seconds } = phaseData.time_to_next;
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            const phaseTimer = document.getElementById('phase-timer');
            const countdownTimer = document.getElementById('countdown-timer');
            
            if (phaseTimer) phaseTimer.textContent = timeString;
            if (countdownTimer) countdownTimer.textContent = timeString;

            // Highlight current phase
            this.highlightCurrentPhase(phaseData.current_phase);
        }

        highlightCurrentPhase(currentPhase) {
            const phaseCards = document.querySelectorAll('.phase-card');
            phaseCards.forEach((card, index) => {
                card.classList.remove('active');
                
                if (ARMS_RACE_PHASES[index] === currentPhase) {
                    card.classList.add('active');
                }
            });
        }

        onPhaseChange(newPhaseData) {
            console.log('Phase changed to:', newPhaseData.current_phase);
            
            // Show notification if available
            if (window.showNotification) {
                window.showNotification(
                    `Arms Race: ${newPhaseData.current_phase} phase started!`,
                    'info'
                );
            }
        }

        updateServerStatus(status, message) {
            const serverStatus = document.getElementById('server-status');
            if (!serverStatus) return;

            const indicator = serverStatus.querySelector('.status-indicator');
            const text = serverStatus.querySelector('.status-text');

            if (indicator) {
                indicator.className = `status-indicator ${status}`;
            }
            if (text) {
                text.textContent = message;
            }
        }

        clearDisplay() {
            this.selectedServer = null;
            this.currentPhaseData = null;
            
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }

            // Reset UI elements
            const elements = {
                'current-phase': 'Select Server',
                'current-phase-description': 'Select a server to view Arms Race information',
                'next-phase-description': '--',
                'progress-text': '0%'
            };

            Object.entries(elements).forEach(([id, text]) => {
                const element = document.getElementById(id);
                if (element) element.textContent = text;
            });

            const progressFill = document.getElementById('progress-fill');
            if (progressFill) progressFill.style.width = '0%';

            const timers = ['phase-timer', 'countdown-timer'];
            timers.forEach(id => {
                const timer = document.getElementById(id);
                if (timer) timer.textContent = '--:--:--';
            });

            this.updateServerStatus('inactive', 'No server selected');

            // Clear phase highlighting
            document.querySelectorAll('.phase-card').forEach(card => {
                card.classList.remove('active');
            });
        }

        saveSelectedServer() {
            try {
                localStorage.setItem('lastwar_selected_server', this.selectedServer.toString());
            } catch (error) {
                console.error('Failed to save server:', error);
            }
        }

        loadSavedServer() {
            try {
                const savedServer = localStorage.getItem('lastwar_selected_server');
                if (savedServer) {
                    const serverSelect = document.getElementById('server-select');
                    if (serverSelect) {
                        serverSelect.value = savedServer;
                        this.selectedServer = parseInt(savedServer);
                        setTimeout(() => this.startTracking(), 100);
                    }
                }
            } catch (error) {
                console.error('Failed to load server:', error);
            }
        }

        // Public API
        getCurrentPhaseData() {
            return this.currentPhaseData;
        }

        getSelectedServer() {
            return this.selectedServer;
        }
    }

    // Initialize when DOM is ready
    let armsRaceManager = null;

    function initializeArmsRace() {
        try {
            armsRaceManager = new ArmsRaceManager();
            armsRaceManager.init();
            window.armsRaceManager = armsRaceManager;
            console.log('Arms Race initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Arms Race:', error);
        }
    }

    // DOM ready check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeArmsRace);
    } else {
        initializeArmsRace();
    }

})();
