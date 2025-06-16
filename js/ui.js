/*!
 * Last War Nexus - UI Module
 * User interface logic and DOM manipulation
 */

import { VSPointsCore } from './core.js';
import { GAME_CONFIG, APP_CONFIG, STRATEGY_GUIDES, ConfigUtils } from './config.js';

export class VSPointsUI extends VSPointsCore {
  constructor() {
    super();
    
    // UI State
    this.isModalOpen = false;
    this.isDashboardVisible = true;
    this.currentModal = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    
    // Debounced functions
    this.debouncedResize = ConfigUtils.debounce(() => this.handleResize(), APP_CONFIG.PERFORMANCE.DEBOUNCE_MS);
    this.debouncedUpdate = ConfigUtils.debounce(() => this.updateAllDisplays(), 100);
  }

  /**
   * Initialize the UI
   */
  async initialize() {
    try {
      // Initialize core functionality first
      const coreInitialized = await super.initialize();
      if (!coreInitialized) {
        throw new Error('Core initialization failed');
      }
      
      // Setup UI-specific event listeners
      this.setupUIEventListeners();
      this.setupMobileGestures();
      this.setupKeyboardNavigation();
      
      // Initialize UI components
      this.initializeTabNavigation();
      this.initializeTimeToggle();
      this.initializeBanner();
      this.initializeModals();
      
      // Initial UI update
      await this.updateAllDisplays();
      
      console.log('Last War Nexus UI initialized successfully');
      return true;
    } catch (error) {
      this.showErrorState('Failed to initialize Last War Nexus. Please refresh the page and try again.');
      return false;
    }
  }

  /**
   * Setup UI-specific event listeners
   */
  setupUIEventListeners() {
    // Window events
    window.addEventListener('resize', this.debouncedResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 500); // Delay for orientation change
    });
    
    // Tab navigation
    document.addEventListener('click', (e) => {
      if (e.target.closest('.tab-btn')) {
        e.preventDefault();
        const tabBtn = e.target.closest('.tab-btn');
        const tabName = tabBtn.dataset.tab;
        this.switchTab(tabName);
      }
    });
    
    // Settings dropdown
    document.addEventListener('click', (e) => {
      if (e.target.closest('.settings-btn')) {
        e.preventDefault();
        this.toggleSettingsDropdown();
      } else if (!e.target.closest('.settings-dropdown')) {
        this.closeSettingsDropdown();
      }
    });
    
    // Time toggle
    document.addEventListener('click', (e) => {
      if (e.target.closest('.time-toggle-btn') || e.target.closest('#card-time-toggle')) {
        e.preventDefault();
        this.toggleTimeDisplay();
      }
    });
    
    // Banner events
    document.addEventListener('click', (e) => {
      if (e.target.closest('.banner-header')) {
        e.preventDefault();
        this.toggleBanner();
      }
    });
    
    // Modal events
    document.addEventListener('click', (e) => {
      if (e.target.closest('.setup-modal-backdrop')) {
        this.closeSetupModal();
      }
      if (e.target.closest('[data-action="close-modal"]')) {
        this.closeSetupModal();
      }
      if (e.target.closest('[data-action="complete-setup"]')) {
        this.completeSetup();
      }
    });
    
    // Guide navigation
    document.addEventListener('click', (e) => {
      if (e.target.closest('.guide-nav-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.guide-nav-btn');
        const guideType = btn.dataset.guideType;
        this.switchGuideType(guideType);
      }
    });
    
    // Form events
    document.addEventListener('change', (e) => {
      if (e.target.id === 'setup-time-offset') {
        this.timeOffset = parseInt(e.target.value);
        this.saveSettings();
      }
      if (e.target.id === 'setup-current-phase') {
        this.currentPhaseOverride = e.target.value || null;
        this.saveSettings();
      }
      if (e.target.id === 'setup-next-phase') {
        this.nextPhaseOverride = e.target.value || null;
        this.saveSettings();
      }
    });
  }

  /**
   * Setup mobile gesture support
   */
  setupMobileGestures() {
    const tabContainer = document.querySelector('.tab-container');
    if (!tabContainer) return;
    
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    tabContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isScrolling = false;
    }, { passive: true });
    
    tabContainer.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      
      if (deltaY > deltaX) {
        isScrolling = true;
      }
    }, { passive: true });
    
    tabContainer.addEventListener('touchend', (e) => {
      if (isScrolling || !startX) return;
      
      const endX = e.changedTouches[0].clientX;
      const deltaX = startX - endX;
      
      if (Math.abs(deltaX) > 50) { // Minimum swipe distance
        if (deltaX > 0) {
          this.switchToNextTab();
        } else {
          this.switchToPrevTab();
        }
      }
      
      startX = 0;
      startY = 0;
    }, { passive: true });
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Tab navigation with arrow keys
      if (e.target.closest('.tab-btn')) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.switchToNextTab();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.switchToPrevTab();
        }
      }
      
      // Close modals with Escape
      if (e.key === 'Escape') {
        if (this.isModalOpen) {
          this.closeSetupModal();
        }
        this.closeSettingsDropdown();
      }
      
      // Quick shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            this.switchTab('priority');
            break;
          case '2':
            e.preventDefault();
            this.switchTab('schedule');
            break;
          case '3':
            e.preventDefault();
            this.switchTab('guides');
            break;
        }
      }
    });
  }

  /**
   * Initialize tab navigation
   */
  initializeTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', btn.classList.contains('active'));
    });
  }

  /**
   * Initialize time toggle
   */
  initializeTimeToggle() {
    const toggles = document.querySelectorAll('.toggle-switch');
    toggles.forEach(toggle => {
      if (!this.showLocalTime) {
        toggle.classList.add('active');
      }
    });
    
    this.updateTimeToggleLabels();
  }

  /**
   * Initialize banner
   */
  initializeBanner() {
    const banner = document.querySelector('.priority-events-banner');
    if (banner) {
      if (this.bannerExpanded) {
        banner.classList.remove('collapsed');
      } else {
        banner.classList.add('collapsed');
      }
    }
  }

  /**
   * Initialize modals
   */
  initializeModals() {
    // Setup modal will be shown if needed by parent class
  }

  /**
   * Update all UI displays
   */
  async updateAllDisplays() {
    try {
      await super.updateAllDisplays(); // Call parent method
      
      // Update specific UI components
      this.updateDashboard();
      this.updateTabContent();
      this.updatePriorityBanner();
      this.updateProgressBar();
      this.updateTimeDisplays();
      
    } catch (error) {
      this.handleError('UI update error', error);
    }
  }

  /**
   * Update dashboard components
   */
  updateDashboard() {
    try {
      const currentPhase = this.getCurrentArmsPhase();
      const nextPhase = this.getNextArmsPhase();
      const timeUntilNext = this.getTimeUntilNextPhase();
      const currentVSDay = this.getCurrentVSDay();
      const priorityStatus = this.getCurrentPriorityStatus();
      const nextPriorityWindow = this.findNextPriorityWindow();
      
      // Update countdown timer
      const countdownTimer = document.getElementById('countdown-timer');
      if (countdownTimer) {
        countdownTimer.textContent = ConfigUtils.formatTime(timeUntilNext);
      }
      
      // Update current phase
      const currentPhaseElement = document.getElementById('current-phase');
      if (currentPhaseElement) {
        currentPhaseElement.textContent = `${currentPhase.icon} ${currentPhase.name}`;
      }
      
      // Update next phase preview
      const nextPhasePreview = document.getElementById('next-phase-preview');
      if (nextPhasePreview) {
        nextPhasePreview.textContent = `${nextPhase.icon} ${nextPhase.name}`;
      }
      
      // Update VS day
      const currentVSDayElement = document.getElementById('current-vs-day');
      if (currentVSDayElement) {
        currentVSDayElement.textContent = `${currentVSDay.name} - ${currentVSDay.title}`;
      }
      
      // Update arms phase
      const armsPhaseElement = document.getElementById('arms-phase');
      if (armsPhaseElement) {
        armsPhaseElement.textContent = `${currentPhase.icon} ${currentPhase.name}`;
      }
      
      // Update priority level
      const priorityLevelElement = document.getElementById('priority-level');
      if (priorityLevelElement) {
        priorityLevelElement.textContent = priorityStatus.level;
      }
      
      // Update priority status indicator
      const priorityStatusIndicator = document.getElementById('priority-status-indicator');
      if (priorityStatusIndicator) {
        priorityStatusIndicator.textContent = priorityStatus.isPriority ? 'HIGH PRIORITY' : 'NORMAL';
        priorityStatusIndicator.className = 'priority-status';
        if (priorityStatus.isPriority) {
          priorityStatusIndicator.style.background = 'var(--accent-warning)';
          priorityStatusIndicator.style.color = 'white';
        } else {
          priorityStatusIndicator.style.background = 'var(--bg-elevated)';
          priorityStatusIndicator.style.color = 'var(--text-secondary)';
        }
      }
      
      // Update next priority window info
      const nextPriorityInfo = document.getElementById('next-priority-info');
      if (nextPriorityInfo && nextPriorityWindow) {
        const timeRemaining = ConfigUtils.formatTime(nextPriorityWindow.timeRemaining);
        nextPriorityInfo.textContent = `${nextPriorityWindow.phase.icon} ${nextPriorityWindow.phase.name} + ${nextPriorityWindow.vsDay.title} in ${timeRemaining}`;
      } else if (nextPriorityInfo) {
        nextPriorityInfo.textContent = 'No upcoming priority windows';
      }
      
    } catch (error) {
      console.error('Dashboard update error:', error);
    }
  }

  /**
   * Update time displays
   */
  updateTimeDisplays() {
    try {
      const now = new Date();
      const serverTime = this.getServerTime();
      
      // Update current display time
      const currentDisplayTime = document.getElementById('current-display-time');
      if (currentDisplayTime) {
        const displayTime = this.showLocalTime ? now : serverTime;
        const timeString = displayTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: false 
        });
        currentDisplayTime.textContent = timeString;
      }
      
      // Update server display time
      const serverDisplayTime = document.getElementById('server-display-time');
      if (serverDisplayTime) {
        const timeString = serverTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        });
        serverDisplayTime.textContent = timeString;
      }
      
      // Update phase end time
      const phaseEndTime = document.getElementById('phase-end-time');
      if (phaseEndTime) {
        const timeUntilNext = this.getTimeUntilNextPhase();
        const endTime = new Date(Date.now() + timeUntilNext);
        const displayEndTime = this.showLocalTime ? endTime : new Date(this.getServerTime().getTime() + timeUntilNext);
        const timeString = displayEndTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        phaseEndTime.textContent = timeString;
      }
      
      // Update setup modal time if visible
      const setupServerTime = document.getElementById('setup-server-time');
      if (setupServerTime) {
        const timeString = serverTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'UTC'
        });
        setupServerTime.textContent = timeString;
      }
      
      const setupTimezoneOffset = document.getElementById('setup-timezone-offset');
      if (setupTimezoneOffset) {
        const sign = this.timeOffset >= 0 ? '+' : '';
        setupTimezoneOffset.textContent = `${sign}${this.timeOffset}`;
      }
      
    } catch (error) {
      console.error('Time display update error:', error);
    }
  }

  /**
   * Update progress bar
   */
  updateProgressBar() {
    try {
      const progress = this.getCurrentPhaseProgress();
      
      const progressFill = document.getElementById('countdown-progress-fill');
      if (progressFill) {
        progressFill.style.width = `${progress.percentage}%`;
      }
      
      const progressGlow = document.getElementById('countdown-progress-glow');
      if (progressGlow && progress.percentage > 0) {
        progressGlow.style.display = 'block';
      } else if (progressGlow) {
        progressGlow.style.display = 'none';
      }
      
    } catch (error) {
      console.error('Progress bar update error:', error);
    }
  }

  /**
   * Update tab content based on active tab
   */
  updateTabContent() {
    try {
      switch (this.activeTab) {
        case 'priority':
          this.populatePriorityWindows();
          break;
        case 'schedule':
          this.populateSchedule();
          break;
        case 'guides':
          this.populateGuides();
          break;
      }
    } catch (error) {
      console.error('Tab content update error:', error);
    }
  }

  /**
   * Populate priority windows
   */
  populatePriorityWindows() {
    try {
      const grid = document.getElementById('priority-grid');
      if (!grid) return;
      
      const now = this.getServerTime();
      const windows = [];
      
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
          
          // Find when this phase occurs on the check date
          let phaseOccurrences = [];
          
          // Check regular phase times (0-19 hours)
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
          
          // Add each occurrence as a priority window
          for (const startTime of phaseOccurrences) {
            const endTime = new Date(startTime);
            if (startTime.getUTCHours() === 20) {
              // City Building evening session ends at midnight
              endTime.setUTCDate(endTime.getUTCDate() + 1);
              endTime.setUTCHours(0, 0, 0, 0);
            } else {
              endTime.setUTCHours(startTime.getUTCHours() + 4);
            }
            
            const timeDiff = startTime.getTime() - now.getTime();
            const isActive = now >= startTime && now < endTime;
            const isPeak = alignment.benefit.includes('Perfect') || alignment.benefit.includes('Maximum');
            
            windows.push({
              startTime,
              endTime,
              timeDiff,
              isActive,
              isPeak,
              phase,
              vsDay,
              alignment,
              timeDisplay: timeDiff > 0 ? ConfigUtils.formatTime(timeDiff) : 'Active Now'
            });
          }
        }
      }
      
      // Sort by time difference (soonest first)
      windows.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.timeDiff - b.timeDiff;
      });
      
      // Take first 12 windows
      const limitedWindows = windows.slice(0, APP_CONFIG.PERFORMANCE.MAX_PRIORITY_WINDOWS);
      
      const html = limitedWindows.map(window => {
        // Determine if this is a distant event (>69 hours)
        const isDistant = window.timeDiff > (69 * 60 * 60 * 1000);
        
        let primaryTime, secondaryTime = '';
        
        if (this.showLocalTime) {
          primaryTime = window.startTime.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) + ' Local';
          // Show server time as secondary for distant events
          if (isDistant) {
            const serverStartTime = new Date(window.startTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
            secondaryTime = serverStartTime.toLocaleDateString('en-US', { 
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'UTC'
            }) + ' Server';
          }
        } else {
          const serverStartTime = new Date(window.startTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
          primaryTime = serverStartTime.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
          }) + ' Server';
          // Show local time as secondary for distant events
          if (isDistant) {
            secondaryTime = window.startTime.toLocaleDateString('en-US', { 
              hour: '2-digit',
              minute: '2-digit'
            }) + ' Local';
          }
        }

        return `
        <div class="priority-window-card ${window.isActive ? 'active' : ''} ${window.isPeak ? 'peak' : ''}">
          <div class="priority-window-header">
            <div class="time-display-section">
              <div class="primary-time">${primaryTime}</div>
              ${secondaryTime ? `<div class="secondary-time">${secondaryTime}</div>` : ''}
              <div class="countdown-time">${window.timeDisplay}</div>
            </div>
            <div class="status-badge ${window.isActive ? 'active' : 'upcoming'}">
              ${window.isActive ? 'ACTIVE NOW' : 'UPCOMING'}
            </div>
          </div>
          <div style="padding: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
              <span style="font-size: 1.2rem;">${window.phase.icon}</span>
              <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">${window.phase.name} + ${window.vsDay.title}</span>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="font-size: 1rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${window.alignment.benefit}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">${window.alignment.reason}</div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${window.phase.activities.slice(0, 3).map(activity => `<span style="background: var(--bg-elevated); color: var(--text-secondary); padding: 3px 6px; border-radius: 3px; font-size: 0.7rem; font-weight: 500;">${activity}</span>`).join('')}
            </div>
          </div>
        </div>
        `;
      }).join('');
      
      grid.innerHTML = html;
      
      // Update tab count
      const priorityCount = document.getElementById('priority-count');
      if (priorityCount) {
        priorityCount.textContent = `${limitedWindows.length} Windows`;
      }
      
    } catch (error) {
      console.error('Priority windows population error:', error);
      const grid = document.getElementById('priority-grid');
      if (grid) {
        grid.innerHTML = '<div class="loading-message">Error loading priority windows</div>';
      }
    }
  }

  /**
   * Populate schedule view
   */
  populateSchedule() {
    try {
      const grid = document.getElementById('schedule-content');
      if (!grid) return;
      
      const schedule = [];
      const now = this.getServerTime();
      
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const checkDate = new Date(now);
        checkDate.setUTCDate(now.getUTCDate() + dayOffset);
        const dayOfWeek = checkDate.getUTCDay();
        const isToday = dayOffset === 0;
        
        const vsDay = ConfigUtils.getVSDayByNumber(dayOfWeek) || 
                     { name: "Sunday", title: "Preparation Day", focus: "Prepare for the week" };
        
        const phases = [];
        // Handle the 5-phase system with 20-hour cycle
        for (let phaseIndex = 0; phaseIndex < 5; phaseIndex++) {
          const phase = GAME_CONFIG.armsRacePhases[phaseIndex];
          
          const isPriority = GAME_CONFIG.priorityAlignments.some(a => 
            a.vsDay === dayOfWeek && a.armsPhase === phase.name
          );
          
          const startHour = phaseIndex * 4;
          const endHour = (phaseIndex * 4 + 4);
          const isActive = isToday && 
            now.getUTCHours() >= startHour && 
            now.getUTCHours() < endHour;
          
          phases.push({
            ...phase,
            position: phaseIndex,
            isPriority,
            isActive,
            timeRange: `${String(startHour).padStart(2, '0')}:00-${String(endHour).padStart(2, '0')}:00`
          });
        }
        
        // Add the City Building phase that runs from 20:00-00:00
        const cityBuildingRepeat = {
          ...GAME_CONFIG.armsRacePhases[0],
          position: 5,
          isPriority: GAME_CONFIG.priorityAlignments.some(a => 
            a.vsDay === dayOfWeek && a.armsPhase === "City Building"
          ),
          isActive: isToday && now.getUTCHours() >= 20,
          timeRange: "20:00-00:00"
        };
        phases.push(cityBuildingRepeat);
        
        schedule.push({
          vsDay,
          phases,
          isToday,
          date: checkDate.toLocaleDateString()
        });
      }
      
      const html = schedule.map(day => `
        <div class="priority-window-card ${day.isToday ? 'active' : ''}">
          <div style="background: var(--bg-tertiary); padding: 12px; border-bottom: 1px solid var(--border-primary); text-align: center;">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${day.vsDay.name}</h3>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${day.vsDay.title}</div>
            <div style="font-size: 0.7rem; color: var(--text-tertiary); margin-top: 4px;">${day.date}</div>
          </div>
          <div style="padding: 8px;">
            ${day.phases.map(phase => `
              <div style="background: var(--bg-elevated); border: 1px solid ${phase.isPriority ? 'var(--accent-warning)' : 'var(--border-primary)'}; border-radius: var(--border-radius); padding: 8px; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; position: relative; ${phase.isPriority ? 'background: rgba(255, 107, 53, 0.1);' : ''} ${phase.isActive ? 'border-color: var(--accent-success); background: rgba(16, 185, 129, 0.1);' : ''}">
                <div style="font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600; color: var(--text-secondary);">${phase.timeRange}</div>
                <div style="flex: 1; text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--text-primary);">${phase.name}</div>
                <div style="font-size: 0.9rem;">${phase.icon}</div>
                ${phase.isPriority ? '<div style="position: absolute; top: -3px; right: 4px; background: var(--accent-warning); color: white; padding: 1px 3px; border-radius: 2px; font-size: 0.5rem; font-weight: 700;">HIGH</div>' : ''}
                ${phase.isActive ? '<div style="position: absolute; top: -3px; left: 4px; background: var(--accent-success); color: white; padding: 1px 3px; border-radius: 2px; font-size: 0.5rem; font-weight: 700;">NOW</div>' : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
      
      grid.innerHTML = html;
    } catch (error) {
      console.error('Schedule population error:', error);
    }
  }

  /**
   * Populate guides
   */
  populateGuides() {
    try {
      const grid = document.getElementById('guides-content');
      if (!grid) return;
      
      const guides = STRATEGY_GUIDES[this.activeGuideType] || [];
      
      const html = guides.map(guide => `
        <div class="priority-window-card">
          <div style="background: var(--bg-tertiary); padding: 12px; border-bottom: 1px solid var(--border-primary); display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 1.3rem; flex-shrink: 0;">${guide.icon}</div>
            <div style="flex: 1;">
              <h3 style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary); margin-bottom: 3px;">${guide.title}</h3>
              <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">${guide.category}</div>
            </div>
          </div>
          <div style="padding: 12px;">
            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">${guide.description}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${guide.tips.map(tip => `<span style="background: var(--bg-elevated); color: var(--text-secondary); padding: 3px 6px; border-radius: 3px; font-size: 0.65rem; font-weight: 500;">${tip}</span>`).join('')}
            </div>
          </div>
        </div>
      `).join('');
      
      grid.innerHTML = html;
    } catch (error) {
      console.error('Guides population error:', error);
    }
  }

  /**
   * Update priority events banner
   */
  updatePriorityBanner() {
    try {
      const bannerGrid = document.querySelector('.banner-grid');
      if (!bannerGrid) return;
      
      const upcomingEvents = this.getUpcomingPriorityEvents();
      
      if (upcomingEvents.length === 0) {
        bannerGrid.innerHTML = '<div class="banner-loading">No upcoming priority events</div>';
        return;
      }

      const eventCards = upcomingEvents.map(event => {
        const startTime = new Date(event.startTime);
        
        let timeString;
        if (this.showLocalTime) {
          timeString = startTime.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else {
          // Show server time
          const serverTime = new Date(startTime.getTime() - (this.timeOffset * 60 * 60 * 1000));
          timeString = serverTime.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
          }) + ' (Server)';
        }

        return `
          <div class="banner-event-card">
            <div class="banner-event-header">
              <span class="banner-event-icon">${event.phase.icon}</span>
              <span class="banner-event-title">${event.phase.name} + ${event.vsDay.title}</span>
            </div>
            <div class="banner-event-time">${timeString}</div>
            <div class="banner-event-countdown">${ConfigUtils.formatTime(event.timeRemaining)}</div>
          </div>
        `;
      }).join('');

      bannerGrid.innerHTML = eventCards;

      // Update banner count
      const bannerCount = document.querySelector('.banner-count');
      if (bannerCount) {
        bannerCount.textContent = upcomingEvents.length;
      }

    } catch (error) {
      console.error('Priority events banner update error:', error);
    }
  }

  /**
   * Switch tabs
   */
  switchTab(tabName) {
    try {
      if (this.activeTab === tabName) return;
      
      this.activeTab = tabName;
      
      // Update tab buttons
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      
      const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
      if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
      }
      
      // Update tab panels
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      
      const activePanel = document.getElementById(`${tabName}-tab`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
      
      // Update content
      this.updateTabContent();
      
    } catch (error) {
      console.error('Tab switch error:', error);
    }
  }

  /**
   * Switch to next tab
   */
  switchToNextTab() {
    const tabs = ['priority', 'schedule', 'guides'];
    const currentIndex = tabs.indexOf(this.activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    this.switchTab(tabs[nextIndex]);
  }

  /**
   * Switch to previous tab
   */
  switchToPrevTab() {
    const tabs = ['priority', 'schedule', 'guides'];
    const currentIndex = tabs.indexOf(this.activeTab);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    this.switchTab(tabs[prevIndex]);
  }

  /**
   * Switch guide type
   */
  switchGuideType(guideType) {
    try {
      this.activeGuideType = guideType;
      this.saveSettings();
      
      // Update guide navigation buttons
      document.querySelectorAll('.guide-nav-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      const activeBtn = document.querySelector(`[data-guide-type="${guideType}"]`);
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
      
      // Update guides content
      this.populateGuides();
      
    } catch (error) {
      console.error('Guide type switch error:', error);
    }
  }

  /**
   * Toggle time display mode
   */
  toggleTimeDisplay() {
    try {
      this.showLocalTime = !this.showLocalTime;
      this.saveSettings();
      
      // Update toggle switches
      const toggles = document.querySelectorAll('.toggle-switch');
      toggles.forEach(toggle => {
        if (this.showLocalTime) {
          toggle.classList.remove('active');
        } else {
          toggle.classList.add('active');
        }
      });
      
      this.updateTimeToggleLabels();
      this.debouncedUpdate();
      
    } catch (error) {
      console.error('Time toggle error:', error);
    }
  }

  /**
   * Update time toggle labels
   */
  updateTimeToggleLabels() {
    const timeToggleBtn = document.querySelector('.time-toggle-btn .time-toggle-label');
    if (timeToggleBtn) {
      timeToggleBtn.textContent = this.showLocalTime ? 'Local Time' : 'Server Time';
    }
  }

  /**
   * Toggle banner
   */
  toggleBanner() {
    try {
      this.bannerExpanded = !this.bannerExpanded;
      this.saveSettings();
      
      const banner = document.querySelector('.priority-events-banner');
      const toggle = document.querySelector('.banner-toggle');
      
      if (banner) {
        if (this.bannerExpanded) {
          banner.classList.remove('collapsed');
        } else {
          banner.classList.add('collapsed');
        }
      }
      
      if (toggle) {
        if (this.bannerExpanded) {
          toggle.classList.add('expanded');
        } else {
          toggle.classList.remove('expanded');
        }
      }
      
    } catch (error) {
      console.error('Banner toggle error:', error);
    }
  }

  /**
   * Show setup modal
   */
  showSetupModal() {
    try {
      const modal = document.getElementById('setup-modal');
      if (modal) {
        modal.style.display = 'flex';
        this.isModalOpen = true;
        this.currentModal = 'setup';
        
        // Populate timezone options
        this.populateTimezoneOptions();
        this.populatePhaseOverrides();
        
        // Start setup time update
        if (this.setupTimeInterval) {
          clearInterval(this.setupTimeInterval);
        }
        this.setupTimeInterval = setInterval(() => {
          this.updateTimeDisplays();
        }, APP_CONFIG.SETUP_TIME_INTERVAL_MS);
        
        // Focus first input
        const firstInput = modal.querySelector('select');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 100);
        }
      }
    } catch (error) {
      console.error('Setup modal error:', error);
    }
  }

  /**
   * Close setup modal
   */
  closeSetupModal() {
    try {
      const modal = document.getElementById('setup-modal');
      if (modal) {
        modal.style.display = 'none';
        this.isModalOpen = false;
        this.currentModal = null;
        
        if (this.setupTimeInterval) {
          clearInterval(this.setupTimeInterval);
          this.setupTimeInterval = null;
        }
      }
    } catch (error) {
      console.error('Close setup modal error:', error);
    }
  }

  /**
   * Complete setup
   */
  completeSetup() {
    try {
      this.isSetupComplete = true;
      this.saveSettings();
      this.closeSetupModal();
      
      // Show notification permission request
      if ('Notification' in window && Notification.permission === 'default') {
        this.requestNotificationPermission();
      }
      
    } catch (error) {
      console.error('Complete setup error:', error);
    }
  }

  /**
   * Populate timezone options
   */
  populateTimezoneOptions() {
    const select = document.getElementById('setup-time-offset');
    if (select && select.children.length <= 1) { // Only populate if empty
      APP_CONFIG.TIMEZONE_OPTIONS.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.value === this.timeOffset) {
          optionElement.selected = true;
        }
        select.appendChild(optionElement);
      });
    }
  }

  /**
   * Populate phase override options
   */
  populatePhaseOverrides() {
    const currentSelect = document.getElementById('setup-current-phase');
    const nextSelect = document.getElementById('setup-next-phase');
    
    if (currentSelect && currentSelect.children.length <= 1) {
      APP_CONFIG.PHASE_OVERRIDE_OPTIONS.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.value === this.currentPhaseOverride) {
          optionElement.selected = true;
        }
        currentSelect.appendChild(optionElement);
      });
    }
    
    if (nextSelect && nextSelect.children.length <= 1) {
      APP_CONFIG.PHASE_OVERRIDE_OPTIONS.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        if (option.value === this.nextPhaseOverride) {
          optionElement.selected = true;
        }
        nextSelect.appendChild(optionElement);
      });
    }
  }

  /**
   * Toggle settings dropdown
   */
  toggleSettingsDropdown() {
    const dropdown = document.querySelector('.settings-dropdown');
    const btn = document.querySelector('.settings-btn');
    
    if (dropdown) {
      const isVisible = dropdown.classList.contains('show') || dropdown.classList.contains('active');
      if (isVisible) {
        this.closeSettingsDropdown();
      } else {
        // Use both classes for compatibility
        dropdown.classList.add('show', 'active');
        if (btn) {
          btn.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      }
    }
  }

  /**
   * Close settings dropdown
   */
  closeSettingsDropdown() {
    const dropdown = document.querySelector('.settings-dropdown');
    const btn = document.querySelector('.settings-btn');
    
    if (dropdown) {
      dropdown.classList.remove('show', 'active');
    }
    if (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    try {
      const isMobileNow = ConfigUtils.isMobile();
      
      // Adjust banner for mobile
      if (isMobileNow && this.bannerExpanded) {
        this.bannerExpanded = false;
        this.saveSettings();
        
        const banner = document.querySelector('.priority-events-banner');
        if (banner) {
          banner.classList.add('collapsed');
        }
      }
      
      // Update layout-dependent content
      this.debouncedUpdate();
      
    } catch (error) {
      console.error('Resize handler error:', error);
    }
  }

  /**
   * Show error state
   */
  showErrorState(message) {
    try {
      const errorHtml = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: var(--bg-elevated);
          border: 1px solid var(--accent-error);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          z-index: 9999;
          max-width: 400px;
          font-family: var(--font-family);
        ">
          <h2 style="color: var(--accent-error); margin-bottom: 16px;">Error</h2>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">${message}</p>
          <button onclick="window.location.reload()" style="
            background: var(--accent-primary);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
          ">Refresh Page</button>
        </div>
      `;
      
      document.body.insertAdjacentHTML('beforeend', errorHtml);
    } catch (error) {
      console.error('Error state display failed:', error);
    }
  }

  /**
   * Destroy the UI
   */
  destroy() {
    try {
      // Remove event listeners
      window.removeEventListener('resize', this.debouncedResize);
      
      // Call parent destroy
      super.destroy();
      
    } catch (error) {
      console.error('UI cleanup error:', error);
    }
  }
}