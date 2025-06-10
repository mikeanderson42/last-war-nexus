class LastWarNexus {
    constructor() {
        this.isInitialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 3;
        
        // Server configuration - corrected based on your real data
        this.currentArmsPhase = "City Building"; // User-selected current phase
        this.timeOffset = 0; // Manual time offset in hours (-12 to +12)
        
        // Data structure with CORRECTED schedule based on your screenshots
        this.data = {
            armsracephases: [
                {
                    name: "Mixed Phase",
                    icon: "🔄",
                    hours: [0, 1, 2, 3],
                    activities: ["Check in-game calendar"],
                    pointSources: ["Check calendar for current focus", "Mixed activities", "Various point sources", "Event-specific tasks", "General progression"]
                },
                {
                    name: "Drone Boost", 
                    icon: "🚁",
                    hours: [4, 5, 6, 7],
                    activities: ["Stamina usage", "Drone activities"],
                    pointSources: ["Use stamina for attacks", "Complete drone missions", "Gather drone data", "Battle elite enemies", "Use stamina items"]
                },
                {
                    name: "City Building",
                    icon: "🏗️", 
                    hours: [8, 9, 10, 11],
                    activities: ["Building upgrades", "Construction speedups"],
                    pointSources: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Upgrade headquarters", "Construct new buildings"]
                },
                {
                    name: "Tech Research",
                    icon: "🔬",
                    hours: [12, 13, 14, 15],
                    activities: ["Research completion", "Research speedups"],
                    pointSources: ["Complete research", "Use research speedups", "Unlock new technologies", "Upgrade existing tech", "Finish research projects"]
                },
                {
                    name: "Hero Advancement",
                    icon: "⚔️",
                    hours: [16, 17, 18, 19],
                    activities: ["Hero recruitment", "Hero EXP"],
                    pointSources: ["Recruit new heroes", "Apply hero EXP", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"]
                },
                {
                    name: "Unit Progression",
                    icon: "🛡️",
                    hours: [20, 21, 22, 23],
                    activities: ["Troop training", "Training speedups"],
                    pointSources: ["Train troops", "Use training speedups", "Complete troop upgrades", "Unlock new units", "Enhance unit capabilities"]
                }
            ],
            
            vsdays: [
                {
                    day: 0,
                    name: "Sunday",
                    title: "Preparation Day",
                    activities: ["Save radar missions", "Prepare building upgrades"],
                    pointActivities: ["Save radar missions for Monday", "Prepare building gifts for Tuesday", "Stack speedups", "Plan resource allocation", "Coordinate with alliance"]
                },
                {
                    day: 1,
                    name: "Monday", 
                    title: "Radar Training",
                    activities: ["Complete radar missions", "Use stamina for attacks"],
                    pointActivities: ["Complete saved radar missions", "Use stamina for elite battles", "Attack bases for training points", "Use stamina items", "Focus on combat activities"]
                },
                {
                    day: 2,
                    name: "Tuesday",
                    title: "Base Expansion", 
                    activities: ["Complete building upgrades", "Use construction speedups"],
                    pointActivities: ["Complete building upgrades", "Use construction speedups", "Finish building projects", "Use building gifts", "Upgrade headquarters"]
                },
                {
                    day: 3,
                    name: "Wednesday",
                    title: "Age of Science",
                    activities: ["Complete research", "Use research speedups"],
                    pointActivities: ["Complete research projects", "Use research speedups", "Unlock new technologies", "Use valor badges", "Focus on tech advancement"]
                },
                {
                    day: 4,
                    name: "Thursday",
                    title: "Train Heroes",
                    activities: ["Use recruitment tickets", "Apply hero EXP"],
                    pointActivities: ["Use recruitment tickets", "Apply hero EXP items", "Upgrade hero skills", "Enhance hero equipment", "Complete hero missions"]
                },
                {
                    day: 5,
                    name: "Friday",
                    title: "Total Mobilization",
                    activities: ["Use all speedup types", "Finish buildings/research"],
                    pointActivities: ["Use all saved speedups", "Complete multiple building projects", "Finish research", "Train troops", "Maximum efficiency focus"]
                },
                {
                    day: 6,
                    name: "Saturday",
                    title: "Enemy Buster",
                    activities: ["Attack enemy bases", "Use healing speedups"],
                    pointActivities: ["Attack enemy bases", "Use healing speedups", "Focus on combat", "Eliminate threats", "Use combat-related items"]
                }
            ],
            
            // CORRECTED alignments based on real schedule
            highpriorityalignments: [
                { vsday: 1, armsphase: "Drone Boost", reason: "Stamina/drone activities align perfectly.", points: 3500 },
                { vsday: 1, armsphase: "Hero Advancement", reason: "Hero EXP activities align.", points: 3200 },
                { vsday: 2, armsphase: "City Building", reason: "Building activities align perfectly.", points: 4000 },
                { vsday: 3, armsphase: "Tech Research", reason: "Research activities align perfectly.", points: 3800 },
                { vsday: 3, armsphase: "Drone Boost", reason: "Drone component activities align.", points: 3300 },
                { vsday: 4, armsphase: "Hero Advancement", reason: "Hero activities align perfectly.", points: 3600 },
                { vsday: 5, armsphase: "City Building", reason: "Building component of mobilization.", points: 4200 },
                { vsday: 5, armsphase: "Unit Progression", reason: "Training component of mobilization.", points: 3900 },
                { vsday: 5, armsphase: "Tech Research", reason: "Research component of mobilization.", points: 4100 },
                { vsday: 6, armsphase: "Unit Progression", reason: "Troop training for combat.", points: 3700 },
                { vsday: 6, armsphase: "City Building", reason: "Construction speedups for defenses.", points: 3400 }
            ],
            
            intelligence: {
                guides: [
                    {
                        title: "Complete Squad Building Guide",
                        content: "Master the art of squad composition with our comprehensive guide covering hero synergies, formation strategies, and power optimization. Learn how to build squads for different game modes including PvP, PvE, and special events.",
                        link: "https://lastwar-tutorial.com/squad-building-guide"
                    },
                    {
                        title: "VS Points Maximization Strategy", 
                        content: "Learn the proven strategies to maximize VS points: Get VS tech to 100% first, save speedups for alignment windows, stack radar missions, and coordinate with Arms Race phases. Focus on unlocking 3 chests daily rather than winning every Arms Race.",
                        link: "https://lastwar-tutorial.com/vs-optimization"
                    },
                    {
                        title: "Power Progression Optimization",
                        content: "Maximize your base power efficiently with our detailed progression guide. Covers building priorities, research paths, hero development, and resource management strategies for rapid power growth.",
                        link: "https://lastwar-tutorial.com/power-optimization"
                    },
                    {
                        title: "Season 4 Evernight Isle Complete Guide",
                        content: "Navigate Season 4's new content including Evernight Isle exploration, Copper War mechanics, lighthouse systems, and faction-based gameplay. Includes exclusive rewards and optimization strategies.",
                        link: "https://lastwar-tutorial.com/season-4-guide"
                    }
                ],
                
                tips: [
                    {
                        title: "VS Event Optimization Strategies",
                        content: "Key strategies from top players: Save all speedups for VS days, get VS tech to 100% first, save radar missions for Days 1,3,5, save building gifts for Days 2,5, and coordinate with Arms Race phases for 2-4x efficiency. Don't use speedups outside VS periods.",
                        link: "https://lastwar-tutorial.com/vs-optimization"
                    },
                    {
                        title: "Resource Saving Timing Guide",
                        content: "Master resource management: Save construction speedups for Day 2 (Base Expansion), research speedups for Day 3 (Age of Science), training speedups for Day 5 (Total Mobilization). Stack activities the day before and execute during high-priority windows.",
                        link: "https://lastwar-tutorial.com/resource-timing"
                    },
                    {
                        title: "Arms Race Coordination Tips",
                        content: "Synchronize with Arms Race phases: Use stamina during Drone Boost, apply hero EXP during Hero Advancement, complete buildings during City Building, finish research during Tech Research. This alignment can quadruple your point efficiency.",
                        link: "https://lastwar-tutorial.com/arms-race-coordination"
                    },
                    {
                        title: "Advanced VS Techniques",
                        content: "Pro tips: Use survivor dispatch trick for higher unit training caps, refresh secret missions for legendary tasks, coordinate alliance for secretary roles on key days, and use valor badges strategically during Age of Science phase.",
                        link: "https://lastwar-tutorial.com/advanced-vs-techniques"
                    }
                ],
                
                season4: [
                    {
                        title: "Season 4 Copper War VS Integration",
                        content: "How Season 4 changes VS strategy: New Copper War mechanics affect alliance coordination, Tesla Coil skills provide combat advantages during Enemy Buster day, and Evernight Isle resources can boost VS performance.",
                        link: "https://lastwar-tutorial.com/season4-vs-integration"
                    },
                    {
                        title: "New Hero & Weapon VS Optimization",
                        content: "Optimize Season 4 heroes for VS: Sarah's Legendary upgrade path maximizes Hero Advancement points, Lucius' Exclusive Weapon enhances combat effectiveness for Day 6, and Butler's Tesla Coil skills provide strategic advantages.",
                        link: "https://lastwar-tutorial.com/season-4-heroes-vs"
                    },
                    {
                        title: "Evernight Isle Resource Management",
                        content: "Use Evernight Isle strategically: Lighthouse mechanics provide additional resources for VS preparation, fog navigation yields exclusive speedups, and coordinated exploration maximizes alliance benefits during VS periods.",
                        link: "https://lastwar-tutorial.com/evernight-isle-vs"
                    },
                    {
                        title: "Legacy Season VS Strategies", 
                        content: "Don't miss proven strategies from Seasons 1-3: Foundation building techniques from Season 1, expansion optimization from Season 2, and advanced combat systems from Season 3 that remain effective for current VS gameplay.",
                        link: "https://lastwar-tutorial.com/legacy-vs-strategies"
                    }
                ]
            }
