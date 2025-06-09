// ==============================================
// ARMS RACE SCHEDULE - STANDALONE MODULE
// Fixed integration for Last War Nexus
// ==============================================

const ARMS_RACE_PHASES = [
    "City Building",       // 00:00-04:00  
    "Unit Progression",    // 04:00-08:00
    "Tech Research",       // 08:00-12:00
    "Drone Boost",         // 12:00-16:00
    "Hero Advancement",    // 16:00-20:00
    "Purchases/Duel"       // 20:00-00:00
];

const PHASE_DESCRIPTIONS = {
    "City Building": "Focus on base construction. Buildings complete faster.",
    "Unit Progression": "Train troops and vehicles. Military production boosted.",
    "Tech Research": "Research technologies. Science output increased.",
    "Drone Boost": "Enhanced drone operations. Increased capacity.",
    "Hero Advancement": "Level up heroes. Hero XP gains boosted.",
    "Purchases/Duel": "Shopping and PvP. Store discounts active."
};

// ==============================================
// CORE CALCULATION ENGINE
// ==============================================

function calculateServerBirthday(serverNumber) {
    // Simplified calculation for demo - replace with your actual logic
    const baseDate = new Date("2024-01-20T08:00:00Z");
    const serverDiff = serverNumber - 93;
    const daysToAdd = Math.floor(serverDiff / 3); // Approximate
    
    const serverBirth = new Date(baseDate);
    serverBirth.setDate(baseDate.getDate() + daysToAdd);
    serverBirth.setHours(8 + (serverNumber % 3), 0, 0, 0);
    
    return serverBirth;
}

function getCurrentPhase(serverNumber) {
    const now = new Date();
    const serverBirth = calculateServerBirthday(serverNumber);
    
    // Calculate current phase based on UTC hours
    const currentHour = now.getUTCHours();
    const phaseIndex = Math.floor(currentHour / 4);
    
    const nextPhaseIndex = (phaseIndex + 1) % 6;
    const nextPhaseHour = (phaseIndex + 1) * 4;
    
    // Calculate time to next phase
    const minutesToNext = 60 - now.getUTCMinutes();
    const secondsToNext = 60 - now.getUTCSeconds();
    const hoursToNext = (nextPhaseHour - currentHour + 24) % 24;
    
    return {
        current_phase: ARMS_RACE_PHASES[phaseIndex],
        next_phase: ARMS_RACE_PHASES[nextPhaseIndex],
        phase_progress: ((now.getUTCMinutes() * 60 + now.getUTCSeconds()) / 14400) * 100,
        time_to_next: {
            hours: hoursToNext === 0 ? 0 : hoursToNext - 1,
            minutes: minutesToNext === 60 ? 0 : minutesToNext - 1,
            seconds: secondsToNext === 60 ? 0 : secondsToNext
        }
    };
}

// ==============================================
// ARMS RACE MANAGER (Fixed)
// ==============================================

class ArmsRaceManager {
    constructor() {
        this.selectedServer = null;
        this.currentPhaseData = null;
        this.updateInterval = null;
        this.initialized = false;
        
        // Wait for DOM before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            this.setupServerSelector();
            this.setupPhaseDisplay();
            this.setupEventListeners();
            this.loadSavedServer();
            this.initialized = true;
            console.log('Arms Race Manager initialized');
        } catch (error) {
            console.error('Arms Race initialization error:', error);
        }
    }

    setupServerSelector() {
        const serverSelect = document.getElementById('server-select');
        if (!serverSelect) return;

        // Clear existing options except first
        serverSelect.innerHTML = '<option value="">Select Server</option>';

        // Add server options
        for (let i = 100; i <= 900; i += 50) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Server ${i}`;
            serverSelect.appendChild(option);
        }

        // Add custom option
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
        const customServer = prompt('Enter your server number:');
        if (customServer && !isNaN(customServer) && customServer > 0) {
            const serverSelect = document.getElementById('server-select');
            
            // Add to dropdown if not exists
            let optionExists = false;
            for (let option of serverSelect.options) {
                if (option.value === customServer) {
                    optionExists = true;
                    break;
                }
            }
            
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

        // Update server status
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
        const currentPhase = document.querySelector('.current-phase');
        if (currentPhase) {
            currentPhase.textContent = phaseData.current_phase;
        }

        // Update descriptions
        const currentDesc = document.getElementById('current-phase-description');
        const nextDesc = document.getElementById('next-phase-description');
        const currentTitle = document.getElementById('current-phase-title');
        const nextTitle = document.getElementById('next-phase-title');

        if (currentDesc) currentDesc.textContent = PHASE_DESCRIPTIONS[phaseData.current_phase];
        if (nextDesc) nextDesc.textContent = PHASE_DESCRIPTIONS[phaseData.next_phase];
        if (currentTitle) currentTitle.textContent = phaseData.current_phase;
        if (nextTitle) nextTitle.textContent = `Next: ${phaseData.next_phase}`;

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
            card.classList.remove('active', 'completed');
            
            if (ARMS_RACE_PHASES[index] === currentPhase) {
                card.classList.add('active');
            }
        });
    }

    onPhaseChange(newPhaseData) {
        console.log('Phase changed to:', newPhaseData.current_phase);
        
        // Trigger notification if tracker is available
        if (window.tracker && window.tracker.showNotification) {
            window.tracker.showNotification(
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

        if (indicator) indicator.className = `status-indicator ${status}`;
        if (text) text.textContent = message;
    }

    clearDisplay() {
        this.selectedServer = null;
        this.currentPhaseData = null;
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        // Reset UI
        const currentPhase = document.querySelector('.current-phase');
        if (currentPhase) currentPhase.textContent = 'Select Server';

        const currentDesc = document.getElementById('current-phase-description');
        if (currentDesc) currentDesc.textContent = 'Select a server to view Arms Race information';

        const nextDesc = document.getElementById('next-phase-description');
        if (nextDesc) nextDesc.textContent = '--';

        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        if (progressFill) progressFill.style.width = '0%';
        if (progressText) progressText.textContent = '0%';

        const timers = document.querySelectorAll('#phase-timer, #countdown-timer');
        timers.forEach(timer => timer.textContent = '--:--:--');

        this.updateServerStatus('inactive', 'No server selected');

        // Clear phase highlighting
        document.querySelectorAll('.phase-card').forEach(card => {
            card.classList.remove('active', 'completed');
        });
    }

    // Data persistence
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
                    this.startTracking();
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

// Initialize (Fixed)
let armsRaceManager;
try {
    armsRaceManager = new ArmsRaceManager();
    window.armsRaceManager = armsRaceManager;
} catch (error) {
    console.error('Failed to create Arms Race Manager:', error);
}
