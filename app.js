// ==============================================
// LAST WAR NEXUS - COMPLETE APPLICATION
// Enhanced with Arms Race Integration
// ==============================================

class LastWarTracker {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.loadSavedData();
        this.setupArmsRaceIntegration();
    }

    init() {
        // Hero Data from verified game information
        this.heroData = {
            missile: ['Adam', 'Fiona', 'Swift'],
            tank: ['Mason', 'Tesla', 'Stman'],
            air: ['Kimmy', 'Marshall', 'Reaper', 'Diva', 'Shiler']
        };

        // Code configurations from game data
        this.codeSetups = {
            64: {
                name: 'Missile Code',
                frontline: ['Swift', 'Tesla'],
                backline: ['Adam', 'Fiona', 'Marshall'],
                description: 'Missile Heroes do 50% extra damage'
            },
            87: {
                name: 'Tank Code',
                frontline: ['Mason', 'Tesla'],
                middle: ['Marshall', 'Kimmy'],
                backline: ['Stman'],
                description: 'Tank Heroes do 50% extra damage'
            },
            39: {
                name: 'Air Code',
                frontline: ['Kimmy', 'Marshall'],
                backline: ['Reaper', 'Diva', 'Shiler'],
                description: 'Air Heroes do 50% extra damage'
            }
        };

        // Season 2 Polar Storm Data
        this.polarStormData = {
            temperatureThresholds: {
                frozen: -20,
                minimum: -270,
                freezingCountdown: 300000,
                thawingCountdown: 300000
            },
            digSites: {
                maxOwned: 4,
                dailyLimit: 2,
                captureTime: 14400000,
                protectionTime: 129600000
            }
        };

        this.gameState = {
            heroes: [],
            baseTemperature: 0,
            digSites: [],
            currentSeason: 2,
            lastUpdate: new Date(),
            furnaceEnabled: false,
            baseFrozen: false
        };

        this.freezingTimer = null;
        this.phaseAlertsEnabled = true;
        this.armsRaceManager = null;
    }

    setupEventListeners() {
        // Hero Management
        this.addEventListenerSafe('add-hero-btn', 'click', () => this.addHero());
        this.addEventListenerSafe('hero-type', 'change', (e) => this.updateHeroOptions(e.target.value));

        // Code Strategy
        this.addEventListenerSafe('code-select', 'change', (e) => this.displayCodeStrategy(e.target.value));

        // Temperature Monitoring
        this.addEventListenerSafe('temp-input', 'input', (e) => this.updateTemperature(e.target.value));
        this.addEventListenerSafe('furnace-toggle', 'click', () => this.toggleFurnace());

        // Dig Site Management
        this.addEventListenerSafe('add-digsite-btn', 'click', () => this.addDigSite());

        // Data Management
        this.addEventListenerSafe('export-data-btn', 'click', () => this.exportData());
        this.addEventListenerSafe('import-data-btn', 'click', () => this.importData());

        // Settings Modal
        this.addEventListenerSafe('settings-btn', 'click', () => this.openSettings());
        this.addEventListenerSafe('close-settings', 'click', () => this.closeSettings());

        // Settings Form Controls
        this.addEventListenerSafe('auto-save', 'change', (e) => this.updateSetting('autoSave', e.target.checked));
        this.addEventListenerSafe('notifications', 'change', (e) => this.updateSetting('notifications', e.target.checked));
        this.addEventListenerSafe('phase-alerts', 'change', (e) => this.updateSetting('phaseAlerts', e.target.checked));
        this.addEventListenerSafe('server-timezone', 'change', (e) => this.updateSetting('timezone', e.target.value));

        // Modal click outside to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('settings-modal');
            if (e.target === modal) {
                this.closeSettings();
            }
        });

        // Auto-save every 30 seconds
        setInterval(() => this.saveData(), 30000);
    }

    addEventListenerSafe(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`Element with ID '${elementId}' not found`);
        }
    }

    // Settings Modal Functions
    openSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'block';
            this.loadSettingsValues();
        }
    }

    closeSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    loadSettingsValues() {
        try {
            const settings = JSON.parse(localStorage.getItem('trackerSettings') || '{}');
            
            this.setCheckboxValue('auto-save', settings.autoSave !== false);
            this.setCheckboxValue('notifications', settings.notifications !== false);
            this.setCheckboxValue('phase-alerts', settings.phaseAlerts !== false);
            this.setSelectValue('server-timezone', settings.timezone || 'UTC');
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    setCheckboxValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.checked = value;
    }

    setSelectValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) element.value = value;
    }

    updateSetting(setting, value) {
        try {
            const settings = JSON.parse(localStorage.getItem('trackerSettings') || '{}');
            settings[setting] = value;
            localStorage.setItem('trackerSettings', JSON.stringify(settings));
            
            // Apply setting immediately
            if (setting === 'phaseAlerts') {
                this.phaseAlertsEnabled = value;
                if (this.armsRaceManager) {
                    this.armsRaceManager.setPhaseAlertsEnabled(value);
                }
            }
            
            this.showNotification(`Setting updated: ${setting}`, 'success');
        } catch (error) {
            console.error('Failed to save setting:', error);
        }
    }

    // Hero Management Functions
    addHero() {
        const heroName = document.getElementById('hero-name')?.value?.trim();
        const heroType = document.getElementById('hero-type')?.value;
        const heroLevel = parseInt(document.getElementById('hero-level')?.value) || 1;

        if (!heroName || !heroType) {
            this.showNotification('Please fill in all hero details', 'error');
            return;
        }

        if (this.gameState.heroes.some(h => h.name.toLowerCase() === heroName.toLowerCase())) {
            this.showNotification('Hero already exists', 'warning');
            return;
        }

        if (heroLevel < 1 || heroLevel > 100) {
            this.showNotification('Hero level must be between 1 and 100', 'error');
            return;
        }

        const hero = {
            id: Date.now(),
            name: heroName,
            type: heroType,
            level: heroLevel,
            maxStars: false,
            maxSkills: false,
            weapon: false,
            dateAdded: new Date().toISOString()
        };

        this.gameState.heroes.push(hero);
        this.renderHeroes();
        this.clearHeroForm();
        this.showNotification(`${heroName} added successfully`, 'success');
        this.saveData();
    }

    updateHeroOptions(type) {
        const heroSuggestions = document.getElementById('hero-suggestions');
        if (!heroSuggestions) return;

        heroSuggestions.innerHTML = '';
        if (this.heroData[type]) {
            this.heroData[type].forEach(hero => {
                const option = document.createElement('option');
                option.value = hero;
                heroSuggestions.appendChild(option);
            });
        }
    }

    renderHeroes() {
        const container = document.getElementById('heroes-list');
        if (!container) return;

        container.innerHTML = '';
        
        if (this.gameState.heroes.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No heroes added yet. Add your first hero above!</p>';
            return;
        }

        this.gameState.heroes.forEach(hero => {
            const heroElement = this.createHeroElement(hero);
            container.appendChild(heroElement);
        });
    }

    createHeroElement(hero) {
        const div = document.createElement('div');
        div.className = 'hero-card fade-in';
        div.innerHTML = `
            <div class="hero-header">
                <h3>${hero.name}</h3>
                <span class="hero-type ${hero.type}">${hero.type.toUpperCase()}</span>
            </div>
            <div class="hero-stats">
                <p>Level: <span class="level">${hero.level}</span></p>
                <div class="hero-upgrades">
                    <label><input type="checkbox" ${hero.maxStars ? 'checked' : ''} 
                        onchange="tracker.updateHeroUpgrade(${hero.id}, 'maxStars', this.checked)"> Max Stars</label>
                    <label><input type="checkbox" ${hero.maxSkills ? 'checked' : ''} 
                        onchange="tracker.updateHeroUpgrade(${hero.id}, 'maxSkills', this.checked)"> Max Skills</label>
                    <label><input type="checkbox" ${hero.weapon ? 'checked' : ''} 
                        onchange="tracker.updateHeroUpgrade(${hero.id}, 'weapon', this.checked)"> Weapon</label>
                </div>
            </div>
            <button onclick="tracker.removeHero(${hero.id})" class="remove-btn">Remove</button>
        `;
        return div;
    }

    updateHeroUpgrade(heroId, upgrade, value) {
        const hero = this.gameState.heroes.find(h => h.id === heroId);
        if (hero) {
            hero[upgrade] = value;
            this.saveData();
            this.showNotification(`${hero.name} ${upgrade} updated`, 'info');
        }
    }

    removeHero(heroId) {
        const hero = this.gameState.heroes.find(h => h.id === heroId);
        if (hero && confirm(`Remove ${hero.name}?`)) {
            this.gameState.heroes = this.gameState.heroes.filter(h => h.id !== heroId);
            this.renderHeroes();
            this.saveData();
            this.showNotification(`${hero.name} removed`, 'info');
        }
    }

    clearHeroForm() {
        const heroName = document.getElementById('hero-name');
        const heroLevel = document.getElementById('hero-level');
        const heroType = document.getElementById('hero-type');
        
        if (heroName) heroName.value = '';
        if (heroLevel) heroLevel.value = '1';
        if (heroType) heroType.value = '';
    }

    // Code Strategy Functions
    displayCodeStrategy(codeNumber) {
        const strategy = this.codeSetups[codeNumber];
        const container = document.getElementById('code-strategy');
        
        if (!strategy || !container) return;

        container.innerHTML = `
            <div class="strategy-card fade-in">
                <h3>${strategy.name} (Code ${codeNumber})</h3>
                <p class="strategy-description">${strategy.description}</p>
                <div class="formation">
                    ${strategy.frontline ? `<div class="formation-line">
                        <strong>Frontline:</strong> ${strategy.frontline.join(', ')}
                    </div>` : ''}
                    ${strategy.middle ? `<div class="formation-line">
                        <strong>Middle:</strong> ${strategy.middle.join(', ')}
                    </div>` : ''}
                    ${strategy.backline ? `<div class="formation-line">
                        <strong>Backline:</strong> ${strategy.backline.join(', ')}
                    </div>` : ''}
                </div>
                <div class="pro-tips">
                    <h4>Pro Tips:</h4>
                    <ul>
                        <li>Enable War Fever before attacking</li>
                        <li>Use Mushroom Base skin if available</li>
                        <li>Select squad with best Tech output</li>
                        <li>Check skill chips for maximum effectiveness</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Temperature Management
    updateTemperature(temp) {
        this.gameState.baseTemperature = parseFloat(temp) || 0;
        this.checkTemperatureStatus();
        this.saveData();
    }

    checkTemperatureStatus() {
        const temp = this.gameState.baseTemperature;
        const statusElement = document.getElementById('temp-status');
        
        if (!statusElement) return;

        let status = '';
        let className = '';

        if (temp <= this.polarStormData.temperatureThresholds.frozen) {
            status = 'DANGER: Base will freeze in 5 minutes!';
            className = 'danger';
            this.startFreezingCountdown();
        } else if (temp < -10) {
            status = 'WARNING: Temperature getting low';
            className = 'warning';
        } else {
            status = 'Temperature normal';
            className = 'normal';
        }

        statusElement.textContent = status;
        statusElement.className = `temp-status ${className}`;
        
        this.renderBaseStatus();
    }

    startFreezingCountdown() {
        if (this.freezingTimer) clearInterval(this.freezingTimer);
        
        let timeLeft = this.polarStormData.temperatureThresholds.freezingCountdown;
        const countdownDisplay = document.getElementById('temp-countdown-display');
        const countdownTimer = document.getElementById('temp-countdown-timer');
        
        if (countdownDisplay) countdownDisplay.style.display = 'block';
        
        this.freezingTimer = setInterval(() => {
            timeLeft -= 1000;
            
            if (countdownTimer) {
                const minutes = Math.floor(timeLeft / 60000);
                const seconds = Math.floor((timeLeft % 60000) / 1000);
                countdownTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (timeLeft <= 0) {
                this.freezeBase();
                clearInterval(this.freezingTimer);
            }
        }, 1000);
    }

    freezeBase() {
        this.gameState.baseFrozen = true;
        this.showNotification('Base is frozen! Rallies and relocation disabled.', 'error');
        this.renderBaseStatus();
        
        const countdownDisplay = document.getElementById('temp-countdown-display');
        if (countdownDisplay) countdownDisplay.style.display = 'none';
    }

    toggleFurnace() {
        this.gameState.furnaceEnabled = !this.gameState.furnaceEnabled;
        const furnaceBtn = document.getElementById('furnace-toggle');
        
        if (furnaceBtn) {
            furnaceBtn.textContent = this.gameState.furnaceEnabled ? 'Disable Furnace' : 'Enable Furnace';
            furnaceBtn.className = this.gameState.furnaceEnabled ? 'furnace-on' : 'furnace-off';
        }

        // Adjust temperature based on furnace status
        if (this.gameState.furnaceEnabled) {
            this.gameState.baseTemperature += 15;
        } else {
            this.gameState.baseTemperature -= 15;
        }

        // Update temperature input
        const tempInput = document.getElementById('temp-input');
        if (tempInput) {
            tempInput.value = this.gameState.baseTemperature;
        }

        this.checkTemperatureStatus();
        this.saveData();
        this.showNotification(`Furnace ${this.gameState.furnaceEnabled ? 'enabled' : 'disabled'}`, 'info');
    }

    renderBaseStatus() {
        const statusContainer = document.getElementById('base-status');
        if (!statusContainer) return;

        statusContainer.innerHTML = `
            <div class="base-info">
                <p><strong>Season:</strong> ${this.gameState.currentSeason}</p>
                <p><strong>Base Temperature:</strong> ${this.gameState.baseTemperature}°C</p>
                <p><strong>Furnace:</strong> ${this.gameState.furnaceEnabled ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Base Status:</strong> ${this.gameState.baseFrozen ? 'FROZEN' : 'Normal'}</p>
                <p><strong>Heroes Count:</strong> ${this.gameState.heroes.length}</p>
                <p><strong>Dig Sites:</strong> ${this.gameState.digSites.length}/4</p>
            </div>
        `;
    }

    // Dig Site Management
    addDigSite() {
        const name = document.getElementById('digsite-name')?.value?.trim();
        const status = document.getElementById('digsite-status')?.value;

        if (!name) {
            this.showNotification('Please enter dig site name', 'error');
            return;
        }

        if (this.gameState.digSites.length >= this.polarStormData.digSites.maxOwned) {
            this.showNotification('Maximum dig sites reached (4)', 'error');
            return;
        }

        if (this.gameState.digSites.some(site => site.name.toLowerCase() === name.toLowerCase())) {
            this.showNotification('Dig site already exists', 'warning');
            return;
        }

        const digSite = {
            id: Date.now(),
            name: name,
            status: status || 'neutral',
            captureProgress: 0,
            protectionEnds: null,
            reinforcements: 0,
            dateAdded: new Date().toISOString()
        };

        this.gameState.digSites.push(digSite);
        this.renderDigSites();
        this.clearDigSiteForm();
        this.showNotification(`Dig site "${name}" added`, 'success');
        this.saveData();
    }

    renderDigSites() {
        const container = document.getElementById('digsites-list');
        if (!container) return;

        container.innerHTML = '';
        
        if (this.gameState.digSites.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No dig sites added yet. Add your first dig site above!</p>';
            return;
        }

        this.gameState.digSites.forEach(site => {
            const siteElement = this.createDigSiteElement(site);
            container.appendChild(siteElement);
        });
    }

    createDigSiteElement(site) {
        const div = document.createElement('div');
        div.className = 'digsite-card fade-in';
        div.innerHTML = `
            <div class="digsite-header">
                <h3>${site.name}</h3>
                <span class="digsite-status ${site.status}">${site.status.toUpperCase()}</span>
            </div>
            <div class="digsite-details">
                <p><strong>Capture Progress:</strong> ${site.captureProgress}%</p>
                <p><strong>Reinforcements:</strong> ${site.reinforcements}/10</p>
                ${site.protectionEnds ? `<p><strong>Protection until:</strong> ${new Date(site.protectionEnds).toLocaleString()}</p>` : ''}
                <p><strong>Added:</strong> ${new Date(site.dateAdded).toLocaleDateString()}</p>
            </div>
            <button onclick="tracker.removeDigSite(${site.id})" class="remove-btn">Remove</button>
        `;
        return div;
    }

    removeDigSite(siteId) {
        const site = this.gameState.digSites.find(s => s.id === siteId);
        if (site && confirm(`Remove dig site "${site.name}"?`)) {
            this.gameState.digSites = this.gameState.digSites.filter(s => s.id !== siteId);
            this.renderDigSites();
            this.saveData();
            this.showNotification(`Dig site "${site.name}" removed`, 'info');
        }
    }

    clearDigSiteForm() {
        const digsiteName = document.getElementById('digsite-name');
        const digsiteStatus = document.getElementById('digsite-status');
        
        if (digsiteName) digsiteName.value = '';
        if (digsiteStatus) digsiteStatus.value = 'neutral';
    }

    // Data Management
    saveData() {
        try {
            const gameData = {
                ...this.gameState,
                lastSaved: new Date().toISOString(),
                armsRaceSettings: {
                    selectedServer: this.armsRaceManager?.getSelectedServer(),
                    lastPhaseUpdate: new Date().toISOString()
                }
            };
            localStorage.setItem('lastWarTrackerData', JSON.stringify(gameData));
            console.log('Data saved successfully with Arms Race integration');
        } catch (error) {
            console.error('Failed to save data:', error);
            this.showNotification('Failed to save data', 'error');
        }
    }

    loadSavedData() {
        try {
            const savedData = localStorage.getItem('lastWarTrackerData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.gameState = { ...this.gameState, ...parsedData };
                
                // Restore temperature input
                const tempInput = document.getElementById('temp-input');
                if (tempInput && this.gameState.baseTemperature) {
                    tempInput.value = this.gameState.baseTemperature;
                }
                
                // Restore Arms Race settings
                if (parsedData.armsRaceSettings?.selectedServer) {
                    setTimeout(() => {
                        const serverSelect = document.getElementById('server-select');
                        if (serverSelect) {
                            serverSelect.value = parsedData.armsRaceSettings.selectedServer;
                            serverSelect.dispatchEvent(new Event('change'));
                        }
                    }, 500);
                }
                
                this.renderAll();
                this.showNotification('Data loaded successfully', 'success');
            }
        } catch (error) {
            console.error('Failed to load saved data:', error);
            this.showNotification('Failed to load saved data', 'error');
        }
    }

    exportData() {
        try {
            const exportData = {
                ...this.gameState,
                exportDate: new Date().toISOString(),
                version: '2.1'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `last-war-nexus-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            this.showNotification('Data exported successfully', 'success');
        } catch (error) {
            console.error('Failed to export data:', error);
            this.showNotification('Failed to export data', 'error');
        }
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        // Validate imported data
                        if (!importedData.heroes || !Array.isArray(importedData.heroes)) {
                            throw new Error('Invalid data format');
                        }
                        
                        if (confirm('This will replace all current data. Continue?')) {
                            this.gameState = { ...this.gameState, ...importedData };
                            this.renderAll();
                            this.saveData();
                            this.showNotification('Data imported successfully', 'success');
                        }
                    } catch (error) {
                        console.error('Import error:', error);
                        this.showNotification('Failed to import data: Invalid file format', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Arms Race Integration
    setupArmsRaceIntegration() {
        const checkArmsRace = () => {
            if (window.armsRaceManager) {
                this.armsRaceManager = window.armsRaceManager;
                this.setupArmsRaceCallbacks();
            } else {
                setTimeout(checkArmsRace, 100);
            }
        };
        checkArmsRace();
    }

    setupArmsRaceCallbacks() {
        this.armsRaceManager.addPhaseChangeCallback((phaseData) => {
            this.onArmsRacePhaseChange(phaseData);
        });
    }

    onArmsRacePhaseChange(phaseData) {
        const currentPhase = phaseData.current_phase;
        
        let message = '';
        let type = 'info';
        
        switch(currentPhase) {
            case 'Hero Advancement':
                message = 'Hero Advancement phase active! Perfect time to level up heroes.';
                type = 'success';
                break;
            case 'Tech Research':
                message = 'Tech Research phase active! Boost your research projects.';
                break;
            case 'Drone Boost':
                message = 'Drone Boost phase active! Enhanced drone operations available.';
                break;
            case 'City Building':
                message = 'City Building phase active! Construction bonuses in effect.';
                break;
            case 'Unit Progression':
                message = 'Unit Progression phase active! Train troops with bonuses.';
                break;
            case 'Purchases/Duel':
                message = 'Purchases/Duel phase active! Store discounts and PvP bonuses.';
                break;
        }
        
        if (this.phaseAlertsEnabled) {
            this.showNotification(message, type);
        }
        
        this.saveData();
    }

    // Utility Functions
    renderAll() {
        this.renderHeroes();
        this.renderDigSites();
        this.checkTemperatureStatus();
        this.renderBaseStatus();
    }

    showNotification(message, type = 'info') {
        // Check if notifications are enabled
        const settings = JSON.parse(localStorage.getItem('trackerSettings') || '{}');
        if (settings.notifications === false) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize the application
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    try {
        tracker = new LastWarTracker();
        window.tracker = tracker;
        console.log('Last War Nexus initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Last War Nexus:', error);
        document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: red; font-family: Arial, sans-serif;"><h2>Initialization Error</h2><p>Failed to initialize Last War Nexus. Please refresh the page.</p></div>';
    }
});

// Arms Race Integration (Add to existing app.js)
document.addEventListener('DOMContentLoaded', function() {
    // Settings modal functionality
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', function() {
            settingsModal.style.display = 'block';
        });
    }

    if (closeSettings && settingsModal) {
        closeSettings.addEventListener('click', function() {
            settingsModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Arms Race integration with existing notification system
    if (window.armsRaceManager) {
        console.log('Arms Race Manager integrated successfully');
    }
});

// Enhanced notification function (if not exists)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 3000;
            max-width: 300px;
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success': notification.style.background = '#28a745'; break;
            case 'error': notification.style.background = '#dc3545'; break;
            case 'warning': notification.style.background = '#ffc107'; notification.style.color = '#212529'; break;
            default: notification.style.background = '#17a2b8';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Make it available globally
    window.showNotification = showNotification;
}
