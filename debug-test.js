// Emergency debug test
console.log('🐛 DEBUG: Script loading started');

try {
    console.log('🐛 DEBUG: Defining VSPointsOptimizer class...');
    
    class VSPointsOptimizer {
        constructor() {
            console.log('🐛 DEBUG: VSPointsOptimizer constructor called');
            this.timeOffset = 0;
        }
        
        init() {
            console.log('🐛 DEBUG: VSPointsOptimizer init called');
        }
    }
    
    console.log('🐛 DEBUG: Class defined successfully');
    console.log('🐛 DEBUG: typeof VSPointsOptimizer =', typeof VSPointsOptimizer);
    
    // Test instantiation
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🐛 DEBUG: DOM ready, testing instantiation...');
        try {
            window.testApp = new VSPointsOptimizer();
            window.testApp.init();
            console.log('🐛 DEBUG: Test successful!');
        } catch (error) {
            console.error('🐛 DEBUG: Test failed:', error);
        }
    });
    
} catch (error) {
    console.error('🐛 DEBUG: Class definition failed:', error);
}

console.log('🐛 DEBUG: Script loading completed');