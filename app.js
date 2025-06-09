// Last War Nexus - Main Application
(function() {
    'use strict';

    // Game data
    const heroData = {
        missile: ['Adam', 'Fiona', 'Swift'],
        tank: ['Mason', 'Tesla', 'Stman'],
        air: ['Kimmy', 'Marshall', 'Reaper', 'Diva', 'Shiler']
    };

    const codeStrategies = {
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

    // Application state
    let gameState = {
        heroes: [],
        lastUpdate: new Date()
    };

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
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
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease;
        `;
        
        // Set background color
        const colors = {
            success: '#28a745',
            error: '#dc3545', 
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.background = colors[type] || colors.info;
        if (type === 'warning') notification.style.color = '#212529';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Make notification available globally
    window.showNotification = showNotification;

    // Hero management
    function addHero() {
        const nameInput = document.getElementById('hero-name');
        const typeSelect = document.getElementById('hero-type');
        const levelInput = document.getElementById('hero-level');

        if (!nameInput || !typeSelect || !levelInput) {
            showNotification('Form elements not found', 'error');
            return;
        }

        const name = nameInput.value.trim();
        const type = typeSelect.value;
        const level = parseInt(levelInput.value) || 1;

        if (!name || !type) {
            showNotification('Please fill in all hero details', 'error');
            return;
        }

        // Check for duplicates
        if (gameState.heroes.some(h => h.name.toLowerCase() === name.toLowerCase())) {
            showNotification('Hero already exists', 'warning');
            return;
        }

        const hero = {
            id: Date.now(),
            name: name,
            type: type,
            level: level,
            maxStars: false,
            maxSkills: false,
            weapon: false,
            dateAdded: new Date().toISOString()
        };

        gameState.heroes.push(hero);
        renderHeroes();
        clearHeroForm();
        saveData();
        showNotification(`${name} added successfully`, 'success');
    }

    function removeHero(heroId) {
        const hero = gameState.heroes.find(h => h.id === heroId);
        if (hero && confirm(`Remove ${hero.name}?`)) {
            gameState.heroes = gameState.heroes.filter(h => h.id !== heroId);
            renderHeroes();
            saveData();
            showNotification(`${hero.name} removed`, 'info');
        }
    }

    function updateHeroUpgrade(heroId, upgrade, value) {
        const hero = gameState.heroes.find(h => h.id === heroId);
        if (hero) {
            hero[upgrade] = value;
            saveData();
            showNotification(`${hero.name} ${upgrade} updated`, 'info');
        }
    }

    function renderHeroes() {
        const container = document.getElementById('heroes-list');
        if (!container) return;

        container.innerHTML = '';
        
        if (gameState.heroes.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No heroes added yet. Add your first hero above!</p>';
            return;
        }

        gameState.heroes.forEach(hero => {
            const heroCard = document.createElement('div');
            heroCard.className = 'card';
            heroCard.innerHTML = `
                <div class="card-header">
                    <h3>${hero.name}</h3>
                    <span class="hero-type ${hero.type}">${hero.type.toUpperCase()}</span>
                </div>
                <div class="card-body">
                    <p>Level: <strong>${hero.level}</strong></p>
                    <div class="hero-upgrades">
                        <label>
                            <input type="checkbox" ${hero.maxStars ? 'checked' : ''} 
                                   onchange="updateHeroUpgrade(${hero.id}, 'maxStars', this.checked)">
                            Max Stars
                        </label>
                        <label>
                            <input type="checkbox" ${hero.maxSkills ? 'checked' : ''} 
                                   onchange="updateHeroUpgrade(${hero.id}, 'maxSkills', this.checked)">
                            Max Skills
                        </label>
                        <label>
                            <input type="checkbox" ${hero.weapon ? 'checked' : ''} 
                                   onchange="updateHeroUpgrade(${hero.id}, 'weapon', this.checked)">
                            Weapon
                        </label>
                    </div>
                    <button onclick="removeHero(${hero.id})" class="btn btn-danger btn-sm">Remove</button>
                </div>
            `;
            container.appendChild(heroCard);
        });
    }

    function clearHeroForm() {
        const nameInput = document.getElementById('hero-name');
        const typeSelect = document.getElementById('hero-type');
        const levelInput = document.getElementById('hero-level');

        if (nameInput) nameInput.value = '';
        if (typeSelect) typeSelect.value = '';
        if (levelInput) levelInput.value = '1';
    }

    // Code strategy display
    function displayCodeStrategy(codeNumber) {
        const container = document.getElementById('code-strategy');
        if (!container) return;

        if (!codeNumber) {
            container.innerHTML = '';
            return;
        }

        const strategy = codeStrategies[codeNumber];
        if (!strategy) return;

        container.innerHTML = `
            <div class="strategy-card">
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

    // Data management
    function saveData() {
        try {
            gameState.lastUpdate = new Date();
            localStorage.setItem('lastwar_nexus_data', JSON.stringify(gameState));
        } catch (error) {
            console.error('Failed to save data:', error);
            showNotification('Failed to save data', 'error');
        }
    }

    function loadData() {
        try {
            const savedData = localStorage.getItem('lastwar_nexus_data');
            if (savedData) {
                gameState = { ...gameState, ...JSON.parse(savedData) };
                renderHeroes();
                showNotification('Data loaded successfully', 'success');
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            showNotification('Failed to load data', 'error');
        }
    }

    function exportData() {
        try {
            const dataStr = JSON.stringify(gameState, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `last-war-nexus-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            URL.revokeObjectURL(url);
            showNotification('Data exported successfully', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            showNotification('Export failed', 'error');
        }
    }

    function importData() {
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
                        if (confirm('This will replace all current data. Continue?')) {
                            gameState = { ...gameState, ...importedData };
                            renderHeroes();
                            saveData();
                            showNotification('Data imported successfully', 'success');
                        }
                    } catch (error) {
                        showNotification('Invalid file format', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Modal management
    function openSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    function closeSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Event listeners
    function setupEventListeners() {
        // Hero management
        const addHeroBtn = document.getElementById('add-hero-btn');
        if (addHeroBtn) {
            addHeroBtn.addEventListener('click', addHero);
        }

        // Code strategy
        const codeSelect = document.getElementById('code-select');
        if (codeSelect) {
            codeSelect.addEventListener('change', (e) => displayCodeStrategy(e.target.value));
        }

        // Data management
        const exportBtn = document.getElementById('export-data-btn');
        const importBtn = document.getElementById('import-data-btn');
        
        if (exportBtn) exportBtn.addEventListener('click', exportData);
        if (importBtn) importBtn.addEventListener('click', importData);

        // Settings modal
        const settingsBtn = document.getElementById('settings-btn');
        const closeSettingsBtn = document.getElementById('close-settings');
        const settingsModal = document.getElementById('settings-modal');

        if (settingsBtn) settingsBtn.addEventListener('click', openSettings);
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);

        // Close modal when clicking outside
        if (settingsModal) {
            window.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    closeSettings();
                }
            });
        }

        // Auto-save every 30 seconds
        setInterval(saveData, 30000);
    }

    // Make functions globally available
    window.removeHero = removeHero;
    window.updateHeroUpgrade = updateHeroUpgrade;

    // Initialize application
    function initializeApp() {
        try {
            setupEventListeners();
            loadData();
            console.log('Last War Nexus initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            document.body.innerHTML = '<div style="padding: 20px; text-align: center; color: red; font-family: Arial, sans-serif;"><h2>Application Error</h2><p>Failed to initialize Last War Nexus. Please refresh the page.</p></div>';
        }
    }

    // DOM ready initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();
