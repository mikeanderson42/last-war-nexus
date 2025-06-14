/*!
 * Last War Nexus - Main Application
 * Entry point and initialization
 */

import { VSPointsUI } from './ui.js';

/**
 * Global application instance
 */
let app = null;

/**
 * Application initialization
 */
async function initializeApp() {
  try {
    console.log('🎯 Initializing Last War Nexus...');
    
    // Create application instance
    app = new VSPointsUI();
    
    // Make app globally accessible for debugging
    window.lastWarNexus = app;
    
    // Initialize the application
    const success = await app.initialize();
    
    if (success) {
      console.log('✅ Last War Nexus initialized successfully');
      
      // Show ready notification if notifications are enabled
      if (app.notificationsEnabled) {
        app.showNotification(
          'Last War Nexus Ready',
          'VS Points optimizer is now tracking your priority windows'
        );
      }
      
    } else {
      throw new Error('Application initialization failed');
    }
    
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    showInitializationError(error.message);
  }
}

/**
 * Show initialization error
 */
function showInitializationError(message) {
  const errorHtml = `
    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #1e293b;
      border: 2px solid #ef4444;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      z-index: 9999;
      max-width: 500px;
      font-family: 'Inter', system-ui, sans-serif;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    ">
      <div style="font-size: 3rem; margin-bottom: 16px;">⚠️</div>
      <h2 style="color: #ef4444; margin-bottom: 16px; font-size: 1.5rem;">Initialization Error</h2>
      <p style="color: #cbd5e1; margin-bottom: 24px; line-height: 1.6;">
        ${message || 'Failed to start Last War Nexus. Please refresh the page and try again.'}
      </p>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button onclick="window.location.reload()" style="
          background: #0ea5e9;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        " onmouseover="this.style.background='#0284c7'" onmouseout="this.style.background='#0ea5e9'">
          Refresh Page
        </button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #475569;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        " onmouseover="this.style.background='#64748b'" onmouseout="this.style.background='#475569'">
          Dismiss
        </button>
      </div>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #475569;">
        <p style="color: #94a3b8; font-size: 0.875rem;">
          If this error persists, please check your browser console for more details.
        </p>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', errorHtml);
}

/**
 * Handle global errors
 */
function setupGlobalErrorHandling() {
  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global JavaScript error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
    
    if (app && typeof app.handleError === 'function') {
      app.handleError('Global JavaScript error', event.error);
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (app && typeof app.handleError === 'function') {
      app.handleError('Unhandled promise rejection', event.reason);
    }
    
    // Prevent the default browser error handling
    event.preventDefault();
  });

  // Handle resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      console.error('Resource loading error:', {
        type: event.target.tagName,
        source: event.target.src || event.target.href,
        message: 'Failed to load resource'
      });
    }
  }, true);
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
  // Monitor page load performance
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        console.log('⏱️ Page Load Performance:', {
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
          totalTime: Math.round(navigation.loadEventEnd - navigation.navigationStart)
        });
      }
    }
  });

  // Monitor memory usage (if available)
  if ('memory' in performance) {
    setInterval(() => {
      const memory = performance.memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
        console.warn('⚠️ High memory usage detected:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        });
      }
    }, 30000); // Check every 30 seconds
  }
}

/**
 * Setup development helpers
 */
function setupDevelopmentHelpers() {
  if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    // Add development shortcuts
    window.lwn = {
      app: () => app,
      restart: () => {
        if (app) {
          app.destroy();
        }
        initializeApp();
      },
      settings: () => app ? app.saveSettings() : null,
      phase: (phaseName) => {
        if (app) {
          app.currentPhaseOverride = phaseName;
          app.debouncedUpdate();
        }
      },
      time: (offsetHours) => {
        if (app) {
          app.timeOffset = offsetHours;
          app.debouncedUpdate();
        }
      },
      debug: (enabled = true) => {
        if (app) {
          app.debugMode = enabled;
          console.log(`Debug mode ${enabled ? 'enabled' : 'disabled'}`);
        }
      }
    };
    
    console.log('🛠️ Development helpers available as window.lwn');
    console.log('Available commands:', Object.keys(window.lwn));
  }
}

/**
 * Setup service worker (if available)
 */
async function setupServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      // Register service worker for offline support
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('📱 Service Worker registered successfully:', registration.scope);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('🔄 New version available');
              if (app && app.showNotification) {
                app.showNotification(
                  'Update Available',
                  'A new version of Last War Nexus is available. Refresh to update.'
                );
              }
            }
          });
        }
      });
      
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
    }
  }
}

/**
 * Wait for DOM to be ready
 */
function domReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Main initialization sequence
 */
domReady(() => {
  console.log('🚀 Starting Last War Nexus initialization sequence...');
  
  // Setup error handling first
  setupGlobalErrorHandling();
  
  // Setup performance monitoring
  setupPerformanceMonitoring();
  
  // Setup development helpers
  setupDevelopmentHelpers();
  
  // Setup service worker
  setupServiceWorker();
  
  // Initialize the main application
  initializeApp();
});

// Export for testing or external access
export { app, initializeApp };