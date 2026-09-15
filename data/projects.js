import { images } from "../src/assets";

export const projects = [
  {
    id: "veliyx",
    title: "Veliyx & Veliyx Driver",
    role: "Product UI Engineer",
    description:
      "Ride booking, parcel delivery, and food ordering apps with live GPS tracking, real-time driver updates, and seamless booking flows for both users and drivers.",
    tags: ["React Native", "TypeScript", "Maps", "Socket.io", "Redux Toolkit"],
    demo: { store: "", web: "", available: true },
    coverColor: "bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-700",
    highlights: [
      "Designed and built the complete UI for two production apps from scratch",
      "Integrated Google Maps with real-time socket-based driver location updates",
      "Implemented ride, parcel, and food booking flows with address auto-fill and map tap selection",
      "Added background GPS tracking for Android using foreground services",
    ],
    features: [
      "Live GPS tracking with animated marker movement and color-coded route polylines",
      "Fresh booking and active-trip resume flows with real-time screen updates",
      "Stripe payments, TanStack Query, and Redux Toolkit integration",
      "Real-time ride room communication with socket-based updates",
    ],
    challenges: [
      {
        problem:
          "Keeping driver and rider experiences synchronized during live trips with continuous location updates",
        solution:
          "Built real-time socket-driven state updates and animated map transitions to keep both sides in sync",
      },
      {
        problem:
          "Maintaining accurate GPS tracking while the driver app runs in the background on Android",
        solution:
          "Implemented foreground services to ensure location emissions continue reliably in the background",
      },
    ],
    impact: [
      { value: "2 Apps", label: "User & Driver Experience" },
      { value: "Live", label: "GPS Tracking" },
      { value: "Real-time", label: "Ride Updates" },
    ],

    coverImage: images.img_veliyx,

    screenshots: [
      images.img_veliyx1,
      images.img_veliyx2,
      images.img_veliyx3,
      images.img_veliyx4,
      images.img_veliyx5,
      images.img_veliyx6,
      images.img_veliyx7,
      images.img_veliyx8,
      images.img_veliyx9,
      images.img_veliyx10,
      images.img_veliyx11,
      images.img_veliyx12,
      images.img_veliyx13,
      images.img_veliyx14,
    ],
  },

  {
    id: "soulsync",
    title: "SoulSync (React Native)",
    role: "React Native Developer",
    description:
      "An offline-first personal analytics engine that transforms daily journaling into meaningful behavioral insights using on-device data processing and pattern detection.",

    tags: [
      "React Native",
      "TypeScript",
      "SQLite",
      "Offline-First",
      "Analytics",
    ],

    demo: { store: "", web: "", available: false },

    coverColor: "bg-gradient-to-br from-indigo-500 to-blue-600",

    coverImage: images.img_soulsync, // add asset

    screenshots: [
      images.img_soulsync1,
      images.img_soulsync2,
      images.img_soulsync3,
      images.img_soulsync4,
      images.img_soulsync5,
      images.img_soulsync6,
    ],

    highlights: [
      "Offline-first journaling with complete on-device data privacy",
      "Mood tracking with time-based analytics and trend visualization",
      "Insight engine generating behavioral patterns from user entries",
      "Correlation analysis between mood, tags, and activity patterns",
    ],

    features: [
      "Daily journaling with mood tagging and custom categories",
      "Local database storage using optimized schema design",
      "Analytics dashboard with mood trends and activity insights",
      "Streak tracking and consistency monitoring",
      "Tag-based analysis to identify positive and negative triggers",
      "Time-based pattern detection (daily/weekly behavior)",
      "Fully offline functionality with zero backend dependency",
    ],

    challenges: [
      {
        problem:
          "Generating meaningful insights without relying on external APIs or AI services",
        solution:
          "Designed a rule-based analytics engine using statistical patterns and correlation logic computed entirely on-device",
      },
      {
        problem:
          "Efficiently querying and processing large amounts of local journal data",
        solution:
          "Implemented optimized SQLite queries with indexed fields and precomputed analytics for smooth performance",
      },
      {
        problem:
          "Transforming raw user data into understandable and actionable insights",
        solution:
          "Built an interpretation layer that converts analytics into human-readable summaries and behavioral observations",
      },
    ],
    demo: {
      store: {
        ios: "https://apps.apple.com/us/app/soulsync-private-journal/id6780445597",
        android:
          "https://play.google.com/store/apps/details?id=com.soulsyncapp",
      },
    },

    impact: [
      { value: "100%", label: "Offline & Private" },
      { value: "Real Insights", label: "Behavior Analysis" },
      { value: "Zero API", label: "Fully Local Processing" },
      { value: "Smart", label: "Data Interpretation" },
    ],
  },

  {
    id: "catchndealz",
    title: "Catchndealz (React Native)",
    role: "React Native Developer",
    description:
      "A social-first e-commerce platform combining shopping with gamified experiences like live auctions, raffles, and real-time deal interactions.",
    tags: ["React Native", "TypeScript", "Realtime", "Firebase"],
    demo: { store: "", web: "", available: true },
    coverColor: "bg-gradient-to-br from-orange-500 to-red-500",

    // The existing single image becomes the cover
    coverImage: images.img_catchndealz,

    // Add individual mobile screenshots here
    screenshots: [
      images.img_catchndealz1,
      images.img_catchndealz2,
      images.img_catchndealz3,
      images.img_catchndealz4,
      images.img_catchndealz5,
    ],
    demo: {
      store: {
        ios: "https://apps.apple.com/us/app/catchndealz-market/id6471849927",
        android:
          "https://play.google.com/store/apps/details?id=com.catchndealz",
      },
    },

    highlights: [
      "Live auctions with real-time chat and bidding system",
      "Make-an-offer feature with instant accept/reject updates",
      "Raffle-based (Waffle) system with winner tracking",
      "Flash sales with countdown timers to boost engagement",
    ],
    features: [
      "Real-time deals, auctions, and raffles",
      "Category-based browsing with filters",
      "Add-to-cart and instant buy flow",
      "Gift card and promotional checkout support",
      "Pickup and doorstep delivery tracking",
      "Guest browsing with login-on-action",
      "Unified dashboard for orders, auctions, and raffles",
    ],
    challenges: [
      {
        problem:
          "Managing real-time interactions across auctions, chat, and bidding without lag",
        solution:
          "Optimized state handling and integrated real-time updates using efficient event-driven architecture",
      },
      {
        problem:
          "Handling multiple purchase flows (auction win, raffle win, direct buy)",
        solution:
          "Designed a unified checkout system adaptable to different transaction types",
      },
    ],
    impact: [
      { value: "Real-time", label: "User Engagement Boost" },
      { value: "Multi-flow", label: "Commerce System" },
      { value: "High", label: "User Interaction" },
    ],
  },

  {
    id: "gridsun-monitor",
    title: "GridSun Monitor (React Native)",
    role: "React Native Developer",
    description:
      "A solar installation and maintenance management app enabling real-time lead tracking, installation workflows, and AMC lifecycle management for both employees and customers.",
    tags: ["React Native", "TypeScript", "Barcode Scanner"],
    demo: { store: "", web: "", available: true },
    coverColor: "bg-gradient-to-br from-yellow-400 to-green-600",

    coverImage: images.img_gs, // add asset
    screenshots: [
      images.img_gs1,
      images.img_gs2,
      images.img_gs3,
      images.img_gs4,
      images.img_gs5,
    ],
    demo: {
      store: {
        ios: "https://apps.apple.com/in/app/gridsun-monitor/id6760114324",
        android:
          "https://play.google.com/store/apps/details?id=com.gridsun.monitor",
      },
    },

    highlights: [
      "Pin-code based lead discovery for field employees",
      "Step-based installation workflow with photo uploads",
      "Barcode scanning for solar panels and inverters",
      "AMC tracking with automated reminders & notifications",
    ],

    features: [
      "Lead import and centralized admin management",
      "Real-time photo sync to admin dashboard",
      "Role-based access (User & Employee)",
      "Installation tracking with stage validation",
      "AMC lifecycle tracking with renewal alerts",
      "Support ticket system with notifications",
      "User onboarding via installation ID linking",
    ],

    challenges: [
      {
        problem:
          "Ensuring real-time sync of images and installation data from field locations with poor connectivity",
        solution:
          "Implemented optimized upload queues with retry mechanisms and background syncing",
      },
      {
        problem:
          "Managing multiple roles (employee & user) with different flows and permissions",
        solution:
          "Designed a role-based navigation and access control system for clear separation of workflows",
      },
      {
        problem:
          "Tracking physical assets (solar panels, inverters) accurately",
        solution:
          "Integrated barcode scanning and mapped scanned items to installation records",
      },
    ],

    impact: [
      { value: "2 Roles", label: "User & Employee System" },
      { value: "Real-time", label: "Field Data Sync" },
      { value: "End-to-End", label: "Installation Lifecycle" },
      { value: "Automated", label: "AMC Reminders" },
    ],
  },

  {
    id: "kyora-iq",
    title: "Kyora IQ (React Native)",
    role: "React Native Developer",
    description:
      "A service marketplace app connecting users with cybersecurity and cloud experts, featuring real-time chat, booking workflows, and role-based experiences.",
    tags: ["React Native", "TypeScript", "Firebase", "Realtime", "Dark Mode"],
    demo: { store: "", web: "", available: true },
    coverColor: "bg-gradient-to-br from-purple-500 to-indigo-600",

    coverImage: images.img_cyberboss,
    screenshots: [
      images.img_cyberboss1,
      images.img_cyberboss2,
      images.img_cyberboss3,
      images.img_cyberboss4,
      images.img_cyberboss5,
    ],
    demo: {
      store: {
        ios: "https://apps.apple.com/us/app/kyora-iq/id6749854798",
        android: "https://play.google.com/store/apps/details?id=com.cyberboss",
      },
    },

    highlights: [
      "Dual-role system (User & Consultant) with separate workflows",
      "Real-time chat using Firebase between users and experts",
      "Service booking flow for cybersecurity and cloud consulting",
      "Full dark mode & light mode theming across the app",
    ],

    features: [
      "Expert discovery and service listing",
      "Booking and scheduling with consultants",
      "Real-time messaging with push updates",
      "Role-based navigation and dashboards",
      "Dark mode / Light mode toggle with persistent theme",
      "User profile and consultant service management",
    ],

    challenges: [
      {
        problem:
          "Maintaining seamless real-time chat experience with consistent message sync",
        solution:
          "Integrated Firebase real-time database with optimized listeners and state handling",
      },
      {
        problem:
          "Designing a flexible UI that supports both dark and light themes across all screens",
        solution:
          "Implemented centralized theming system with dynamic styles and global state",
      },
      {
        problem:
          "Handling two distinct user roles with different journeys in a single app",
        solution:
          "Built role-based navigation stacks and conditional rendering for clean separation",
      },
    ],

    impact: [
      { value: "2 Roles", label: "User & Consultant" },
      { value: "Realtime", label: "Chat System" },
      { value: "End-to-End", label: "Booking Flow" },
      { value: "Dynamic", label: "Theming System" },
    ],
  },
];
