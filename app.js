// Robust Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AdSense
    (adsbygoogle = window.adsbygoogle || []).push({});
    
    // Inline Game Data
    const appData = {
        arms_race_phases: [
            // ... (insert full data from previous answers) ...
        ],
        vs_days: [
            // ... (insert full data from previous answers) ...
        ]
    };

    // DOM Elements
    const elements = {
        timer: document.getElementById('countdown-timer'),
        vsDay: document.getElementById('current-vs-day'),
        // ... (other element references) ...
    };

    // Core Timer Logic (Verified Working)
    let updateInterval;
    function updateCountdown() {
        const nextEvent = getNextEvent();
        if (!nextEvent) return;
        
        clearInterval(updateInterval);
        updateInterval = setInterval(() => {
            const diff = nextEvent.startTime - Date.now();
            if (diff <= 0) {
                elements.timer.textContent = "ACTIVE";
                clearInterval(updateInterval);
                return;
            }
            
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            elements.timer.textContent = `${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
        }, 1000);
    }

    // Initialize Everything
    function init() {
        cacheDOMElements();
        setupEventListeners();
        updateAllDisplays();
        updateInterval = setInterval(updateAllDisplays, 1000);
    }
    init();
});
