/*!
 * Last War Nexus - Core Functionality
 * Main application logic and data processing
 */

import { GAME_CONFIG, APP_CONFIG, ConfigUtils } from './config.js';

export class VSPointsCore {
  constructor() {
    // Application State
    this.timeOffset = 0;
    this.isVisible = true;
    this.activeTab = 'priority';
    this.notificationsEnabled = false;
    this.lastNotifiedWindow = null;
    this.isSetupComplete = false;
    this.currentPhaseOverride = null;
    this.nextPhaseOverride = null;
    this.bannerExpanded = !ConfigUtils.isMobile();
    this.showLocalTime = true;
    this.activeGuideType = 'tips';
    
    // Intervals
    this.updateInterval = null;
    this.setupTimeInterval = null;
    
    // Error handling
    this.errorCount = 0;
    this.maxErrors = 5;
    
    // Performance monitoring
    this.lastUpdateTime = 0;
    this.updateDuration = 0;
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      this.loadSettings();
      this.setupEventListeners();
      this.startUpdateLoop();
      
      // Show setup modal if not completed
      if (!this.isSetupComplete) {
        this.showSetupModal();
      }
      
      // Initial update
      await this.updateAllDisplays();
      
      console.log('Last War Nexus initialized successfully');
      return true;
    } catch (error) {
      this.handleError('Initialization failed', error);
      return false;
    }
  }

  /**
   * Get current server time adjusted by offset
   */
  getServerTime() {
    try {
      const now = new Date();
      const serverTime = new Date(now.getTime() + (this.timeOffset * 60 * 60 * 1000));
      return serverTime;
    } catch (error) {
      console.error('Server time calculation error:', error);
      return new Date(); // Fallback to local time
    }
  }

  /**
   * Calculate current Arms Race phase based on server time
   */
  getCurrentArmsPhase() {
    try {
      const serverTime = this.getServerTime();
      const currentHour = serverTime.getUTCHours();
      
      // Override for manual testing
      if (this.currentPhaseOverride) {
        const phase = ConfigUtils.getPhaseByName(this.currentPhaseOverride);
        return phase || GAME_CONFIG.armsRacePhases[0];
      }
      
      // Calculate phase based on 20-hour cycle
      if (currentHour >= 0 && currentHour < 4) {
        return GAME_CONFIG.armsRacePhases[0]; // City Building
      } else if (currentHour >= 4 && currentHour < 8) {
        return GAME_CONFIG.armsRacePhases[1]; // Unit Progression
      } else if (currentHour >= 8 && currentHour < 12) {
        return GAME_CONFIG.armsRacePhases[2]; // Tech Research
      } else if (currentHour >= 12 && currentHour < 16) {
        return GAME_CONFIG.armsRacePhases[3]; // Drone Boost
      } else if (currentHour >= 16 && currentHour < 20) {
        return GAME_CONFIG.armsRacePhases[4]; // Hero Advancement
      } else {
        // 20:00-23:59 -> City Building (cycle restart)
        return GAME_CONFIG.armsRacePhases[0]; // City Building
      }
    } catch (error) {
      console.error('Phase calculation error:', error);
      return GAME_CONFIG.armsRacePhases[0]; // Fallback
    }
  }

  /**
   * Get the next Arms Race phase
   */
  getNextArmsPhase() {
    try {
      if (this.nextPhaseOverride) {
        const phase = ConfigUtils.getPhaseByName(this.nextPhaseOverride);
        return phase || GAME_CONFIG.armsRacePhases[1];
      }
      
      const currentPhase = this.getCurrentArmsPhase();
      const currentIndex = GAME_CONFIG.armsRacePhases.findIndex(p => p.name === currentPhase.name);
      const nextIndex = (currentIndex + 1) % GAME_CONFIG.armsRacePhases.length;
      
      return GAME_CONFIG.armsRacePhases[nextIndex];
    } catch (error) {
      console.error('Next phase calculation error:', error);
      return GAME_CONFIG.armsRacePhases[1]; // Fallback
    }
  }

  /**
   * Calculate time until next phase
   */
  getTimeUntilNextPhase() {
    try {
      const serverTime = this.getServerTime();
      const currentHour = serverTime.getUTCHours();
      const currentMinute = serverTime.getUTCMinutes();
      const currentSecond = serverTime.getUTCSeconds();
      
      // Calculate next phase boundary
      let nextPhaseHour;
      if (currentHour < 4) nextPhaseHour = 4;
      else if (currentHour < 8) nextPhaseHour = 8;
      else if (currentHour < 12) nextPhaseHour = 12;
      else if (currentHour < 16) nextPhaseHour = 16;
      else if (currentHour < 20) nextPhaseHour = 20;
      else nextPhaseHour = 24; // Next day at 00:00
      
      const nextPhaseTime = new Date(serverTime);
      if (nextPhaseHour === 24) {
        nextPhaseTime.setUTCDate(nextPhaseTime.getUTCDate() + 1);
        nextPhaseTime.setUTCHours(0, 0, 0, 0);
      } else {
        nextPhaseTime.setUTCHours(nextPhaseHour, 0, 0, 0);
      }
      
      return nextPhaseTime.getTime() - serverTime.getTime();
    } catch (error) {
      console.error('Time calculation error:', error);
      return 0;
    }
  }

  /**
   * Get current VS day information
   */
  getCurrentVSDay() {
    try {
      const serverTime = this.getServerTime();
      const dayOfWeek = serverTime.getUTCDay();
      
      return ConfigUtils.getVSDayByNumber(dayOfWeek) || {
        name: "Sunday",
        title: "Preparation Day", 
        focus: "Prepare for the week"
      };
    } catch (error) {
      console.error('VS day calculation error:', error);
      return GAME_CONFIG.vsDays[0]; // Fallback to Monday
    }
  }

  /**
   * Check if current time is a priority window
   */
  getCurrentPriorityStatus() {
    try {
      const currentPhase = this.getCurrentArmsPhase();
      const currentVSDay = this.getCurrentVSDay();
      
      const alignment = GAME_CONFIG.priorityAlignments.find(a => 
        a.vsDay === currentVSDay.day && a.armsPhase === currentPhase.name
      );
      
      if (alignment) {
        return {
          isPriority: true,
          level: alignment.benefit,
          reason: alignment.reason,
          phase: currentPhase,
          vsDay: currentVSDay
        };
      }
      
      return {
        isPriority: false,
        level: 'Normal',
        reason: 'No alignment between current phase and VS day',
        phase: currentPhase,
        vsDay: currentVSDay
      };
    } catch (error) {
      console.error('Priority status error:', error);
      return {
        isPriority: false,
        level: 'Unknown',
        reason: 'Error calculating priority status'
      };
    }
  }

  /**
   * Find the next priority window
   */
  findNextPriorityWindow() {
    try {
      const now = this.getServerTime();
      const windows = [];
      
      // Look ahead for the next 7 days
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const checkDate = new Date(now);
        checkDate.setUTCDate(now.getUTCDate() + dayOffset);
        const dayOfWeek = checkDate.getUTCDay();
        
        const vsDay = ConfigUtils.getVSDayByNumber(dayOfWeek);
        if (!vsDay) continue;
        
        const dayAlignments = ConfigUtils.getPriorityAlignments(dayOfWeek);
        
        for (const alignment of dayAlignments) {
          const phase = ConfigUtils.getPhaseByName(alignment.armsPhase);
          if (!phase) continue;
          
          const phaseIndex = GAME_CONFIG.armsRacePhases.findIndex(p => p.name === phase.name);
          
          // Calculate when this phase occurs
          let phaseOccurrences = [];
          
          // Regular phase times (0-19 hours)
          if (phaseIndex * 4 < 20) {
            const startTime = new Date(checkDate);
            startTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
            phaseOccurrences.push(startTime);
          }
          
          // Special case: City Building also occurs at 20:00-00:00
          if (phaseIndex === 0) {
            const eveningStart = new Date(checkDate);
            eveningStart.setUTCHours(20, 0, 0, 0);
            phaseOccurrences.push(eveningStart);
          }
          
          for (const startTime of phaseOccurrences) {
            const timeDiff = startTime.getTime() - now.getTime();
            
            if (timeDiff > 0) {
              windows.push({
                startTime,
                timeRemaining: timeDiff,
                phase,
                vsDay,
                alignment
              });
            }
          }
        }
      }
      
      // Sort by time remaining and return the first one
      windows.sort((a, b) => a.timeRemaining - b.timeRemaining);
      return windows[0] || null;
    } catch (error) {
      console.error('Next priority window error:', error);
      return null;
    }
  }

  /**
   * Get upcoming priority events for banner
   */
  getUpcomingPriorityEvents(limit = APP_CONFIG.PERFORMANCE.MAX_UPCOMING_EVENTS) {
    try {
      const now = this.getServerTime();
      const events = [];
      
      // Look ahead for the next 14 days to find priority events
      for (let dayOffset = 0; dayOffset < 14 && events.length < limit; dayOffset++) {
        const checkDate = new Date(now);
        checkDate.setUTCDate(now.getUTCDate() + dayOffset);
        const dayOfWeek = checkDate.getUTCDay();
        
        const vsDay = ConfigUtils.getVSDayByNumber(dayOfWeek);
        if (!vsDay) continue;
        
        const dayAlignments = ConfigUtils.getPriorityAlignments(dayOfWeek);
        
        for (const alignment of dayAlignments) {
          if (events.length >= limit) break;
          
          const phase = ConfigUtils.getPhaseByName(alignment.armsPhase);
          if (!phase) continue;
          
          const phaseIndex = GAME_CONFIG.armsRacePhases.findIndex(p => p.name === phase.name);
          
          // Calculate when this phase occurs
          let phaseOccurrences = [];
          
          // Regular phase times (0-19 hours)
          if (phaseIndex * 4 < 20) {
            const startTime = new Date(checkDate);
            startTime.setUTCHours(phaseIndex * 4, 0, 0, 0);
            phaseOccurrences.push(startTime);
          }
          
          // Special case: City Building also occurs at 20:00-00:00
          if (phaseIndex === 0) {
            const eveningStart = new Date(checkDate);
            eveningStart.setUTCHours(20, 0, 0, 0);
            phaseOccurrences.push(eveningStart);
          }
          
          for (const startTime of phaseOccurrences) {
            if (events.length >= limit) break;
            
            const timeDiff = startTime.getTime() - now.getTime();
            
            if (timeDiff > 0) {
              events.push({
                startTime,
                timeRemaining: timeDiff,
                phase,
                vsDay,
                alignment
              });
            }
          }
        }
      }
      
      // Sort by time remaining
      events.sort((a, b) => a.timeRemaining - b.timeRemaining);
      
      return events.slice(0, limit);
    } catch (error) {
      console.error('Get upcoming priority events error:', error);
      return [];
    }
  }

  /**
   * Calculate progress through current phase
   */
  getCurrentPhaseProgress() {
    try {
      const timeUntilNext = this.getTimeUntilNextPhase();
      const totalPhaseTime = APP_CONFIG.PHASE_DURATION_HOURS * 60 * 60 * 1000; // 4 hours in ms
      const elapsed = totalPhaseTime - timeUntilNext;
      const progress = Math.max(0, Math.min(100, (elapsed / totalPhaseTime) * 100));
      
      return {
        percentage: progress,
        elapsed: elapsed,
        remaining: timeUntilNext,
        total: totalPhaseTime
      };
    } catch (error) {
      console.error('Phase progress calculation error:', error);
      return {
        percentage: 0,
        elapsed: 0,
        remaining: 0,
        total: 0
      };
    }
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.SETTINGS);
      if (saved) {
        const settings = JSON.parse(saved);
        this.timeOffset = settings.timeOffset || 0;
        this.notificationsEnabled = settings.notificationsEnabled || false;
        this.isSetupComplete = settings.isSetupComplete || false;
        this.currentPhaseOverride = settings.currentPhaseOverride || null;
        this.nextPhaseOverride = settings.nextPhaseOverride || null;
        this.showLocalTime = settings.showLocalTime !== undefined ? settings.showLocalTime : true;
        this.activeGuideType = settings.activeGuideType || 'tips';
        this.bannerExpanded = settings.bannerExpanded !== undefined ? settings.bannerExpanded : !ConfigUtils.isMobile();
      }
    } catch (error) {
      console.error('Settings load error:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      const settings = {
        timeOffset: this.timeOffset,
        notificationsEnabled: this.notificationsEnabled,
        isSetupComplete: this.isSetupComplete,
        currentPhaseOverride: this.currentPhaseOverride,
        nextPhaseOverride: this.nextPhaseOverride,
        showLocalTime: this.showLocalTime,
        activeGuideType: this.activeGuideType,
        bannerExpanded: this.bannerExpanded
      };
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Settings save error:', error);
      this.handleError(APP_CONFIG.ERROR_MESSAGES.STORAGE_FAILED);
    }
  }

  /**
   * Request notification permission
   */
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

  /**
   * Show notification
   */
  showNotification(title, body) {
    try {
      if (this.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body: body,
          icon: APP_CONFIG.NOTIFICATION_ICON,
          tag: APP_CONFIG.NOTIFICATION_TAG
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        
        setTimeout(() => notification.close(), APP_CONFIG.NOTIFICATION_DURATION_MS);
      }
    } catch (error) {
      console.error('Notification display error:', error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Visibility change for performance optimization
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) {
        this.updateAllDisplays();
      }
    });

    // Error handling
    window.addEventListener('error', (event) => {
      this.handleError('JavaScript error', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('Unhandled promise rejection', event.reason);
    });
  }

  /**
   * Start the update loop
   */
  startUpdateLoop() {
    try {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
      
      this.updateInterval = setInterval(() => {
        if (this.isVisible) {
          this.updateAllDisplays();
        }
      }, APP_CONFIG.UPDATE_INTERVAL_MS);
    } catch (error) {
      console.error('Update loop error:', error);
    }
  }

  /**
   * Stop the update loop
   */
  stopUpdateLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.setupTimeInterval) {
      clearInterval(this.setupTimeInterval);
      this.setupTimeInterval = null;
    }
  }

  /**
   * Main update function - placeholder for UI module
   */
  async updateAllDisplays() {
    try {
      const startTime = performance.now();
      
      // This will be implemented by the UI module
      // The core just provides the data
      
      this.updateDuration = performance.now() - startTime;
      this.lastUpdateTime = Date.now();
      this.errorCount = 0; // Reset error count on successful update
      
    } catch (error) {
      this.errorCount++;
      this.handleError('Update displays error', error);
      
      if (this.errorCount >= this.maxErrors) {
        this.stopUpdateLoop();
        console.error('Too many errors, stopping update loop');
      }
    }
  }

  /**
   * Handle errors gracefully
   */
  handleError(message, error = null) {
    console.error(`${message}:`, error);
    
    // Could implement error reporting here
    // For now, just log and continue
  }

  /**
   * Show setup modal - placeholder for UI module
   */
  showSetupModal() {
    // This will be implemented by the UI module
  }

  /**
   * Destroy the application
   */
  destroy() {
    try {
      this.stopUpdateLoop();
      
      // Clean up any other resources
      this.isVisible = false;
      
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}