/*!
 * Last War Nexus - Game Configuration
 * Centralized game data and constants
 */

// Game Data Configuration
export const GAME_CONFIG = {
  // VERIFIED: 5 distinct Arms Race phases (each 4 hours, 20-hour cycle)
  armsRacePhases: [
    { 
      id: 'city_building', 
      name: "City Building", 
      icon: "🏗️", 
      activities: ["Building upgrades", "Construction speedups", "Base expansion", "Power increases"],
      bestSpending: [
        { item: "Construction Speedups", value: "high" },
        { item: "Building Upgrades", value: "high" },
        { item: "Legendary Trucks", value: "high" }
      ]
    },
    { 
      id: 'unit_progression', 
      name: "Unit Progression", 
      icon: "⚔️", 
      activities: ["Troop training", "Training speedups", "Unit upgrades", "Military expansion"],
      bestSpending: [
        { item: "Training Speedups", value: "high" },
        { item: "Troop Training", value: "high" },
        { item: "Unit Upgrades", value: "high" }
      ]
    },
    { 
      id: 'tech_research', 
      name: "Tech Research", 
      icon: "🔬", 
      activities: ["Research completion", "Research speedups", "Tech advancement", "Innovation points"],
      bestSpending: [
        { item: "Research Speedups", value: "high" },
        { item: "Tech Upgrades", value: "high" },
        { item: "Valor Badges", value: "high" }
      ]
    },
    { 
      id: 'drone_boost', 
      name: "Drone Boost", 
      icon: "🚁", 
      activities: ["Stamina usage", "Drone missions", "Radar activities", "Drone Combat Data"],
      bestSpending: [
        { item: "Stamina Items", value: "high" },
        { item: "Drone Missions", value: "high" },
        { item: "Radar Activities", value: "high" }
      ]
    },
    { 
      id: 'hero_advancement', 
      name: "Hero Advancement", 
      icon: "🦸", 
      activities: ["Hero recruitment", "Hero EXP", "Skill medals", "Legendary tickets"],
      bestSpending: [
        { item: "Hero Recruitment", value: "high" },
        { item: "Skill Medals", value: "high" },
        { item: "Legendary Tickets", value: "high" }
      ]
    }
  ],
  
  vsDays: [
    { day: 1, name: "Monday", title: "Radar Training", focus: "Radar missions, stamina use, hero EXP, drone data" },
    { day: 2, name: "Tuesday", title: "Base Expansion", focus: "Construction speedups, building power, legendary trucks" },
    { day: 3, name: "Wednesday", title: "Age of Science", focus: "Research speedups, tech power, valor badges" },
    { day: 4, name: "Thursday", title: "Train Heroes", focus: "Hero recruitment, EXP, shards, skill medals" },
    { day: 5, name: "Friday", title: "Total Mobilization", focus: "All speedups, radar missions, comprehensive activities" },
    { day: 6, name: "Saturday", title: "Enemy Buster", focus: "Combat focus, troop elimination, healing speedups" }
  ],
  
  priorityAlignments: [
    { vsDay: 1, armsPhase: "Drone Boost", reason: "Stamina & radar activities align perfectly", benefit: "Maximum Efficiency" },
    { vsDay: 2, armsPhase: "City Building", reason: "Construction activities align perfectly", benefit: "Perfect Match" },
    { vsDay: 3, armsPhase: "Tech Research", reason: "Research activities align perfectly", benefit: "Perfect Alignment" },
    { vsDay: 4, armsPhase: "Hero Advancement", reason: "Hero activities align perfectly", benefit: "Perfect Match" },
    { vsDay: 5, armsPhase: "City Building", reason: "Construction component of total mobilization", benefit: "Peak Efficiency" },
    { vsDay: 5, armsPhase: "Unit Progression", reason: "Training component of mobilization", benefit: "High Impact" },
    { vsDay: 5, armsPhase: "Tech Research", reason: "Research component of mobilization", benefit: "Maximum Impact" },
    { vsDay: 5, armsPhase: "Hero Advancement", reason: "Hero component of mobilization", benefit: "High Impact" },
    { vsDay: 5, armsPhase: "Drone Boost", reason: "Stamina and radar component of mobilization", benefit: "High Impact" },
    { vsDay: 6, armsPhase: "Unit Progression", reason: "Combat training aligns with enemy elimination", benefit: "Strategic Value" }
  ]
};

// Application Constants
export const APP_CONFIG = {
  // Timing Constants
  PHASE_DURATION_HOURS: 4,
  CYCLE_DURATION_HOURS: 20,
  PHASES_PER_CYCLE: 5,
  CYCLE_START_HOUR: 0, // 00:00 server time
  
  // Update Intervals
  UPDATE_INTERVAL_MS: 1000,
  SETUP_TIME_INTERVAL_MS: 1000,
  
  // Notification Settings
  NOTIFICATION_TITLE: 'Last War Nexus',
  NOTIFICATION_ICON: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>',
  NOTIFICATION_TAG: 'lastwar-priority',
  NOTIFICATION_DURATION_MS: 5000,
  
  // Local Storage Keys
  STORAGE_KEYS: {
    SETTINGS: 'lwn-settings',
    THEME: 'lwn-theme',
    USER_PREFERENCES: 'lwn-preferences'
  },
  
  // Timezone Offsets (hours from UTC)
  TIMEZONE_OPTIONS: [
    { value: -12, label: 'UTC -12 hours' },
    { value: -11, label: 'UTC -11 hours' },
    { value: -10, label: 'UTC -10 hours' },
    { value: -9, label: 'UTC -9 hours' },
    { value: -8, label: 'UTC -8 hours' },
    { value: -7, label: 'UTC -7 hours' },
    { value: -6, label: 'UTC -6 hours' },
    { value: -5, label: 'UTC -5 hours' },
    { value: -4, label: 'UTC -4 hours' },
    { value: -3, label: 'UTC -3 hours' },
    { value: -2, label: 'UTC -2 hours' },
    { value: -1, label: 'UTC -1 hour' },
    { value: 0, label: 'UTC +0 hours' },
    { value: 1, label: 'UTC +1 hour' },
    { value: 2, label: 'UTC +2 hours' },
    { value: 3, label: 'UTC +3 hours' },
    { value: 4, label: 'UTC +4 hours' },
    { value: 5, label: 'UTC +5 hours' },
    { value: 6, label: 'UTC +6 hours' },
    { value: 7, label: 'UTC +7 hours' },
    { value: 8, label: 'UTC +8 hours' },
    { value: 9, label: 'UTC +9 hours' },
    { value: 10, label: 'UTC +10 hours' },
    { value: 11, label: 'UTC +11 hours' },
    { value: 12, label: 'UTC +12 hours' }
  ],
  
  // Phase Override Options
  PHASE_OVERRIDE_OPTIONS: [
    { value: '', label: 'Auto-detect (recommended)' },
    { value: 'City Building', label: 'City Building (00:00-04:00)' },
    { value: 'Unit Progression', label: 'Unit Progression (04:00-08:00)' },
    { value: 'Tech Research', label: 'Tech Research (08:00-12:00)' },
    { value: 'Drone Boost', label: 'Drone Boost (12:00-16:00)' },
    { value: 'Hero Advancement', label: 'Hero Advancement (16:00-20:00)' }
  ],
  
  // Performance Settings
  PERFORMANCE: {
    DEBOUNCE_MS: 250,
    ANIMATION_DURATION_MS: 300,
    LAZY_LOAD_THRESHOLD: 100,
    MAX_PRIORITY_WINDOWS: 12,
    MAX_UPCOMING_EVENTS: 6
  },
  
  // Mobile Detection
  MOBILE_BREAKPOINT: 768,
  
  // Error Messages
  ERROR_MESSAGES: {
    INITIALIZATION_FAILED: 'Failed to start Last War Nexus. Please refresh the page and try again.',
    UPDATE_FAILED: 'Failed to update data. Retrying automatically...',
    STORAGE_FAILED: 'Failed to save settings. Please check your browser storage.',
    NOTIFICATION_FAILED: 'Failed to show notification. Please check your browser permissions.'
  }
};

// Strategy Guides Data
export const STRATEGY_GUIDES = {
  tips: [
    {
      title: "5 Distinct Arms Race Phases",
      category: "Core Mechanics",
      icon: "🔄",
      description: "Arms Race runs 5 distinct phases, each lasting 4 hours in a 20-hour cycle that restarts at 20:00. Master this schedule for optimal planning.",
      tips: ["Each phase lasts exactly 4 hours", "20-hour cycle (5 phases × 4 hours)", "Cycle restarts at 20:00 server time", "Same phase appears at different times each day"]
    },
    {
      title: "Perfect Alignment Windows",
      category: "Peak Efficiency",
      icon: "🎯",
      description: "Time activities when Arms Race phases perfectly match Alliance VS focus days for maximum dual rewards.",
      tips: ["Tech Research + Age of Science = Perfect", "City Building + Base Expansion = Maximum", "Hero Advancement + Train Heroes = Ideal", "Friday offers multiple alignments"]
    },
    {
      title: "Friday Total Mobilization",
      category: "Weekly Peak",
      icon: "🚀",
      description: "Friday offers multiple high-priority windows since Total Mobilization accepts all activity types across all phases.",
      tips: ["Save speedups for Friday", "Multiple Arms Race alignments possible", "Highest daily point potential", "All phases can be high priority"]
    },
    {
      title: "Server Time Mastery",
      category: "Timing Strategy",
      icon: "🕐",
      description: "Master your server's predictable 4-hour Arms Race rotation. The schedule is completely consistent once you know the server time.",
      tips: ["Know exact server time", "5-phase × 4-hour cycle", "Cycle restarts at 20:00 daily", "Plan with 20-hour rotation in mind"]
    },
    {
      title: "Dual Event Synergy",
      category: "Advanced Strategy",
      icon: "⚡",
      description: "Maximize efficiency by focusing on activities that benefit both Arms Race and Alliance VS simultaneously.",
      tips: ["Hero EXP works for both events", "Construction speedups double-count", "Research activities align perfectly", "Drone activities overlap on Monday"]
    },
    {
      title: "Resource Conservation",
      category: "Planning Strategy",
      icon: "💎",
      description: "Save premium resources for high-priority alignment windows rather than using them during low-synergy periods.",
      tips: ["Hoard speedups for perfect alignments", "Use basic resources during normal time", "Track upcoming priority windows", "Plan resource usage in advance"]
    },
    {
      title: "Mobile Optimization",
      category: "Practical Tips",
      icon: "📱",
      description: "Set up notifications and quick-access strategies for managing events while mobile gaming with predictable schedules.",
      tips: ["Use browser notifications", "Bookmark priority times", "Set phone alarms for peak windows", "Use predictable schedule for planning"]
    }
  ],
  
  seasonal: [
    {
      title: "Season 1: Foundation",
      category: "Early Game Focus",
      icon: "🌱",
      description: "Focus on base development and understanding core mechanics. Establish strong fundamentals for resource generation and troop training.",
      tips: ["Prioritize base building upgrades", "Complete daily missions consistently", "Join active alliance early", "Focus on march size increases", "Save diamonds for commanders"]
    },
    {
      title: "Season 2: Expansion",
      category: "Mid Game Growth",
      icon: "🏗️",
      description: "Expand your power through research and advanced base upgrades. Begin participating in larger alliance activities.",
      tips: ["Rush Research Lab upgrades", "Focus on economic research", "Participate in alliance events", "Start building T3 troops", "Upgrade resource production"]
    },
    {
      title: "Season 3: Competition",
      category: "PvP Preparation",
      icon: "⚔️",
      description: "Prepare for competitive play with optimized builds and strategic resource management. Focus on combat effectiveness.",
      tips: ["Specialize in combat research", "Build hospital capacity", "Focus on T4 troop training", "Learn rally mechanics", "Optimize gear sets"]
    },
    {
      title: "Season 4: Mastery",
      category: "Late Game Excellence",
      icon: "👑",
      description: "Master advanced strategies, lead alliance operations, and optimize for maximum efficiency in all activities.",
      tips: ["Master rally timing", "Optimize resource management", "Lead alliance strategies", "Focus on T5 research", "Maximize event participation", "Coordinate cross-server activities"]
    }
  ]
};

// Utility Functions for Configuration
export const ConfigUtils = {
  /**
   * Get Arms Race phase by name
   */
  getPhaseByName(name) {
    return GAME_CONFIG.armsRacePhases.find(phase => phase.name === name);
  },
  
  /**
   * Get VS Day by day number
   */
  getVSDayByNumber(dayNumber) {
    return GAME_CONFIG.vsDays.find(day => day.day === dayNumber);
  },
  
  /**
   * Get priority alignments for a specific VS day
   */
  getPriorityAlignments(vsDayNumber) {
    return GAME_CONFIG.priorityAlignments.filter(alignment => alignment.vsDay === vsDayNumber);
  },
  
  /**
   * Check if device is mobile
   */
  isMobile() {
    return window.innerWidth <= APP_CONFIG.MOBILE_BREAKPOINT;
  },
  
  /**
   * Format time for display
   */
  formatTime(milliseconds) {
    if (milliseconds <= 0) return '0m';
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },
  
  /**
   * Debounce function calls
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};