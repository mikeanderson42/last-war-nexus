// ==============================================
// ARMS RACE SCHEDULE CORE CALCULATION ENGINE
// Integrated with Last War Nexus using provided logic
// ==============================================

const ARMS_RACE_PHASES = [
    "City Building",       // 00:00-04:00
    "Unit Progression",    // 04:00-08:00
    "Tech Research",       // 08:00-12:00
    "Drone Boost",         // 12:00-16:00
    "Hero Advancement",    // 16:00-20:00
    "Purchases/Duel"       // 20:00-00:00
];

// Official server launch data from game files[1]
const SERVER_LAUNCH_TIMELINE = {
    base_server: 93,       
    base_date: new Date("2024-01-20T08:00:00Z"), 
    launch_pattern: {
        '2024-01': { servers_per_day: 2.4 },  
        '2024-03': { servers_per_day: 3.8 },  
        '2025-01': { servers_per_day: 5.2 }   
    }
};

// Phase descriptions for UI display
const PHASE_DESCRIPTIONS = {
    "City Building": "Focus on base construction and infrastructure development. Buildings complete faster.",
    "Unit Progression": "Train troops and vehicles. Military unit production receives bonuses.",
    "Tech Research": "Research new technologies. Science output and research speed increased.",
    "Drone Boost": "Enhanced drone operations. Increased drone capacity and effectiveness.",
    "Hero Advancement": "Level up heroes and unlock abilities. Hero XP gains boosted.",
    "Purchases/Duel": "Shopping and PvP activities. Store discounts and duel rewards enhanced."
};

// ==============================================
// SERVER TIME CALCULATION
// ==============================================

function calculateServerBirthday(serverNumber) {
    const { base_server, base_date, launch_pattern } = SERVER_LAUNCH_TIMELINE;
    const serverDiff = serverNumber - base_server;
    
    const getLaunchRate = (date) => {
        const period = date.toISOString().slice(0,7);
        return launch_pattern[period]?.servers_per_day || 3.2;
    };

    let currentDate = new Date(base_date);
    let remainingServers = serverDiff;
    
    while(remainingServers > 0) {
        const rate = getLaunchRate(currentDate);
        const serversThisDay = Math.min(remainingServers, rate);
        currentDate.setDate(currentDate.getDate() + 1);
        remainingServers -= serversThisDay;
    }

    const launchHour = 8 + Math.round((serverNumber % 3) -1); 
    currentDate.setHours(launchHour, 0, 0, 0);
    
    return currentDate;
}

// ==============================================
// PHASE CALCULATION ENGINE
// ==============================================

function getCurrentPhase(serverNumber, currentTime = new Date()) {
    const serverBirth = calculateServerBirthday(serverNumber);
    const serverAge = currentTime - serverBirth;
    
    const daysSinceBirth = Math.floor(serverAge / 86400000);
    const weekDay = (daysSinceBirth + 4) % 7;
    
    const phaseBlock = Math.floor(
        (currentTime.getUTCHours() - serverBirth.getUTCHours() + 24) % 24 / 4
    );
    
    const phaseIndex = (phaseBlock + weekDay * 6) % 6;
    
    return {
        current_phase: ARMS_RACE_PHASES[phaseIndex],
        next_phase: ARMS_RACE_PHASES[(phaseIndex + 1) % 6],
        phase_progress: ((currentTime.getUTCMinutes() * 60 + currentTime.getUTCSeconds()) / 14400) * 100,
        server_time: currentTime.toISOString(),
        weekly_cycle_day: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][weekDay],
        server_birthday: serverBirth.toISOString(),
        next_phase_in_seconds: this.getSecondsToNextPhase(currentTime)
    };
}

// ==============================================
// ARMS RACE MANAGER CLASS
// ==============================================

class ArmsRaceManager {
    constructor() {
        this.selectedServer = null;
        this.currentPhaseData = null;
        this.updateInterval = null;
        this.phaseChangeCallbacks = [];
        this.phaseAlertsEnabled = true;
        
        this.init();
    }

    init() {
        try {
            this.setupServerSelector();
            this.setupPhaseDisplay();
            this.setupEventListeners();
            this.loadSavedServer();
            console.log('Arms Race Manager initialized successfully');
        } catch (error) {
            console.error('Arms Race Manager initialization failed:', error);
        }
    }

    setupServerSelector() {
        const serverSelect = document.getElementById('server-select');
        if (!serverSelect) return;

        // Populate with server ranges
        for (let i = 100; i <= 999; i += 25) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Server ${i}`;
            serverSelect.appendChild(option);
        }

        // Add custom server input option
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Enter Custom Server...';
        serverSelect.appendChild(customOption);
    }

    setupPhaseDisplay() {
        const phaseGrid = document.querySelector('.phase-grid');
        if (!phaseGrid) return;

        ARMS_RACE_PHASES.forEach((phase, index) => {
            const phaseCard = document.createElement('div');
            phaseCard.className = 'phase-card';
            phaseCard.innerHTML = `
                <div class="phase-time">${this.getPhaseTimeRange(index)}</div>
                <div class="phase-name">${phase}</div>
                <div class="phase-indicator"></div>
            `;
            phaseGrid.appendChild(phaseCard);
        });
    }

    getPhaseTimeRange(index) {
        const startHour = index * 4;
        const endHour = (startHour + 4) % 24;
        return `${startHour.toString().padStart(2, '0')}:00-${endHour.toString().padStart(2, '0')}:00`;
    }

    setupEventListeners() {
        const serverSelect = document.getElementById('server-select');
        serverSelect?.addEventListener('change', (e) => this.handleServerChange(e.target.value));
    }

    handleServerChange(serverNumber) {
        if (serverNumber === 'custom') {
            this.promptCustomServer();
            return;
        }

        if (serverNumber === '') {
            this.clearArmsRaceDisplay();
            return;
        }

        this.selectedServer = parseInt(serverNumber);
        this.startArmsRaceTracking();
        this.saveSelectedServer();
    }

    promptCustomServer() {
        const customServer = prompt('Enter your server number (e.g., 555):');
        if (customServer && !isNaN(customServer)) {
            const serverSelect = document.getElementById('server-select');
            
            const existingOption = Array.from(serverSelect.options)
                .find(option => option.value === customServer);
            
            if (!existingOption) {
                const option = document.createElement('option');
                option.value = customServer;
                option.textContent = `Server ${customServer}`;
                serverSelect.insertBefore(option, serverSelect.lastElementChild);
            }
            
            serverSelect.value = customServer;
            this.selectedServer = parseInt(customServer);
            this.startArmsRaceTracking();
            this.saveSelectedServer();
        } else {
            document.getElementById('server-select').value = '';
        }
    }

    startArmsRaceTracking() {
        if (!this.selectedServer) return;

        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateArmsRaceDisplay();
        
        this.updateInterval = setInterval(() => {
            this.updateArmsRaceDisplay();
        }, 1000);

        this.updateServerStatus('active', `Server ${this.selectedServer} - Active`);
    }

    updateArmsRaceDisplay() {
        if (!this.selectedServer) return;

        try {
            const phaseData = getCurrentPhase(this.selectedServer);
            
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
        // Update current phase display
        const phaseStatus = document.getElementById('phase-status');
        if (phaseStatus) {
            phaseStatus.querySelector('.current-phase').textContent = phaseData.current_phase;
        }

        // Update phase details
        const currentPhaseTitle = document.getElementById('current-phase-title');
        const currentPhaseDesc = document.getElementById('current-phase-description');
        const nextPhaseTitle = document.getElementById('next-phase-title');
        const nextPhaseDesc = document.getElementById('next-phase-description');

        if (currentPhaseTitle) currentPhaseTitle.textContent = phaseData.current_phase;
        if (currentPhaseDesc) currentPhaseDesc.textContent = PHASE_DESCRIPTIONS[phaseData.current_phase];
        if (nextPhaseTitle) nextPhaseTitle.textContent = `Next: ${phaseData.next_phase}`;
        if (nextPhaseDesc) nextPhaseDesc.textContent = PHASE_DESCRIPTIONS[phaseData.next_phase];

        // Update progress bar
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        if (progressFill && progressText) {
            const progress = Math.round(phaseData.phase_progress);
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
        }

        // Update countdown timer
        this.updateCountdownDisplay(phaseData);
        
        // Highlight current phase in grid
        this.highlightCurrentPhase(phaseData.current_phase);
    }

    updateCountdownDisplay(phaseData) {
        const timeRemaining = this.getTimeToNextPhase();
        const timerElements = document.querySelectorAll('#phase-timer, #countdown-timer');
        
        timerElements.forEach(timer => {
            timer.textContent = this.formatTime(timeRemaining);
        });
    }

    getTimeToNextPhase() {
        const now = new Date();
        const currentHour = now.getUTCHours();
        const currentMinute = now.getUTCMinutes();
        const currentSecond = now.getUTCSeconds();
        
        // Calculate next 4-hour boundary
        const currentPhaseHour = Math.floor(currentHour / 4) * 4;
        const nextPhaseHour = (currentPhaseHour + 4) % 24;
        
        let hoursToNext = nextPhaseHour - currentHour;
        if (hoursToNext <= 0) hoursToNext += 24;
        
        const minutesToNext = 60 - currentMinute;
        const secondsToNext = 60 - currentSecond;
        
        // Adjust for exact calculations
        if (secondsToNext === 60) {
            return {
                hours: hoursToNext - 1,
                minutes: minutesToNext - 1,
                seconds: 0
            };
        }
        
        if (minutesToNext === 60) {
            return {
                hours: hoursToNext - 1,
                minutes: 0,
                seconds: secondsToNext
            };
        }
        
        return {
            hours: hoursToNext - 1,
            minutes: minutesToNext - 1,
            seconds: secondsToNext
        };
    }

    formatTime(timeObj) {
        const { hours, minutes, seconds } = timeObj;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    highlightCurrentPhase(currentPhase) {
        const phaseCards = document.querySelectorAll('.phase-card');
        phaseCards.forEach((card, index) => {
            card.classList.remove('active', 'completed');
            
            if (ARMS_RACE_PHASES[index] === currentPhase) {
                card.classList.add('active');
            } else {
                const currentIndex = ARMS_RACE_PHASES.indexOf(currentPhase);
                if (index < currentIndex) {
                    card.classList.add('completed');
                }
            }
        });
    }

    onPhaseChange(newPhaseData) {
        this.phaseChangeCallbacks.forEach(callback => {
            try {
                callback(newPhaseData);
            } catch (error) {
                console.error('Phase change callback error:', error);
            }
        });

        if (this.phaseAlertsEnabled && window.tracker?.showNotification) {
            window.tracker.showNotification(
                `Arms Race phase changed to: ${newPhaseData.current_phase}`,
                'info'
            );
        }
    }

    // Data persistence
    saveSelectedServer() {
        try {
            localStorage.setItem('selectedServer', this.selectedServer.toString());
        } catch (error) {
            console.error('Failed to save selected server:', error);
        }
    }

    loadSavedServer() {
        try {
            const savedServer = localStorage.getItem('selectedServer');
            if (savedServer) {
                const serverSelect = document.getElementById('server-select');
                if (serverSelect) {
                    serverSelect.value = savedServer;
                    this.selectedServer = parseInt(savedServer);
                    this.startArmsRaceTracking();
                }
            }
        } catch (error) {
            console.error('Failed to load saved server:', error);
        }
    }

    updateServerStatus(status, message) {
        const serverStatus = document.getElementById('server-status');
        if (!serverStatus) return;

        const indicator = serverStatus.querySelector('.status-indicator');
        const text = serverStatus.querySelector('.status-text');

        if (indicator && text) {
            indicator.className = `status-indicator ${status}`;
            text.textContent = message;
        }
    }

    clearArmsRaceDisplay() {
        this.selectedServer = null;
        this.currentPhaseData = null;
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }

        // Reset displays
        const phaseStatusElement = document.getElementById('phase-status');
        if (phaseStatusElement) {
            const currentPhaseElement = phaseStatusElement.querySelector('.current-phase');
            if (currentPhaseElement) {
                currentPhaseElement.textContent = 'Select Server';
            }
        }

        const currentPhaseDesc = document.getElementById('current-phase-description');
        if (currentPhaseDesc) {
            currentPhaseDesc.textContent = 'Select a server to view Arms Race information';
        }

        const nextPhaseDesc = document.getElementById('next-phase-description');
        if (nextPhaseDesc) {
            nextPhaseDesc.textContent = '--';
        }
        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        if (progressFill && progressText) {
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
        }

        const timerElements = document.querySelectorAll('#phase-timer, #countdown-timer');
        timerElements.forEach(timer => timer.textContent = '--:--:--');

        this.updateServerStatus('inactive', 'No server selected');
        
        document.querySelectorAll('.phase-card').forEach(card => {
            card.classList.remove('active', 'completed');
        });
    }

    // Public API
    addPhaseChangeCallback(callback) {
        this.phaseChangeCallbacks.push(callback);
    }

    getCurrentPhaseData() {
        return this.currentPhaseData;
    }

    getSelectedServer() {
        return this.selectedServer;
    }

    setPhaseAlertsEnabled(enabled) {
        this.phaseAlertsEnabled = enabled;
    }
}

// Initialize Arms Race Manager
let armsRaceManager;
document.addEventListener('DOMContentLoaded', () => {
    armsRaceManager = new ArmsRaceManager();
    window.armsRaceManager = armsRaceManager;
});
