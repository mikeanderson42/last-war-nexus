// Minimal working version
console.log('🚀 Minimal app loading...');

class VSPointsOptimizer {
    constructor() {
        console.log('✅ VSPointsOptimizer constructor');
        this.timeOffset = 0;
        this.isSetupComplete = false;
        this.notificationsEnabled = false;
    }
    
    init() {
        console.log('✅ VSPointsOptimizer init');
        // Show setup modal if not complete
        if (!this.isSetupComplete) {
            this.showSetupModal();
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
}

console.log('✅ Class defined');

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM ready');
    try {
        window.lastWarNexus = new VSPointsOptimizer();
        window.lastWarNexus.init();
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
    }
});

console.log('✅ Script loaded');