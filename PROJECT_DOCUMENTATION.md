# Technical Documentation: Crafted Portfolio (Sanyam Mujavadia)

> **Document Version:** 1.0.0  
> **Target Project:** Sanyam Mujavadia — React Native & Web Developer Portfolio  
> **Repository Name:** `crafted-portfolio`  
> **Deployment Target:** Netlify (`https://sanyammujavadia.netlify.app`)  
> **Date of Generation:** November 2026  
> **Author/Maintainer:** Sanyam Mujavadia  

---

## 1. Project Overview

### 1.1 Project Identity & Purpose
`crafted-portfolio` is a high-performance, single-page application (SPA) portfolio website built with **React 18**, **Vite 5**, **Tailwind CSS v3**, and **Framer Motion v10**. The application serves as the primary professional digital portfolio and showcase for **Sanyam Mujavadia**, a React Native and frontend engineer based in Ahmedabad, Gujarat, India.

The primary purposes of the project are:
1. **Showcase Mobile & Web Engineering Capabilities:** Present production-ready mobile and web applications shipped to the Apple App Store, Google Play Store, and web.
2. **Interactive Technical Demonstration:** Demonstrate high-craft frontend capabilities including physics-based 2D HTML5 canvas particle animations, spring-physics micro-interactions, responsive glassmorphic interfaces, dynamic dark/light theming, and an interactive skill carousel.
3. **Professional Credentials Presentation:** Detail work history (Silversky Technology), academic background (Silver Oak University), verified skill stack, and curriculum vitae with an embedded PDF preview and download capabilities.
4. **Lead Generation & Client Acquisition:** Offer direct contact channels for prospective employers, freelance contracts, and consultancy via an integrated Formspree submission form, direct email, WhatsApp, and LinkedIn.

### 1.2 Target Audience
- **Technical Recruiters & Engineering Hiring Managers:** Seeking experienced React Native / React.js engineers for full-time mobile or frontend roles.
- **Founders & Early-Stage Startups:** Looking for a product engineer to architect, build, or deploy cross-platform iOS and Android applications.
- **Clients Seeking Freelance Development:** Businesses requiring specialized expertise in mobile payments (Stripe, RevenueCat, PayPal), realtime architecture (Firebase, WebSockets), offline-first databases (SQLite, Supabase), and cross-platform UI.

### 1.3 High-Level Architecture & Core Characteristics
- **Client-Side Rendering (CSR):** Fast SPA powered by Vite with instant navigation handled by React Router DOM.
- **Data-Driven Decoupled Architecture:** Content is entirely decoupled from the presentation components. Core data structures (projects, experience, education, skills, contact links) reside in dedicated JavaScript files within the `/data/` directory, allowing zero-risk content updates without altering React JSX logic.
- **Fluid & Motion-First UI:** Seamless integration between Framer Motion declarative animations, native HTML5 2D Canvas rendering for dynamic background particles, and RAF-driven physics loops for the skills track and custom cursor.
- **Glassmorphic & Themed Aesthetic:** Adaptive design system supporting both Light and Dark modes with persistent browser storage (`localStorage`), CSS backdrop filters, and subtle ambient gradients.

---

## 2. Technologies and Programming Languages

The following table lists every technology, library, and development tool verified directly from `package.json`, `package-lock.json`, and source code references.

### 2.1 Dependencies & Installed Versions

| Technology / Package | Package.json Spec | Exact Installed Version (Lockfile) | Category | Where Used & Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **JavaScript (ES6+)** | N/A | Language Standard | Programming Language | Core language for the entire codebase (`.js`, `.jsx`). |
| **HTML5 / CSS3** | N/A | Web Standard | Markup & Styling | Canvas API, semantic layout, glassmorphic filters, responsive styles. |
| **React** | `^18.2.0` | `18.3.1` | Frontend Library | Component lifecycle, JSX templating, hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useContext`). |
| **React DOM** | `^18.2.0` | `18.3.1` | DOM Renderer | Root rendering via `createRoot` in `src/main.jsx`. |
| **React Router DOM** | `^6.17.0` | `6.30.3` | Client-Side Routing | SPA routing (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `useLocation`, `useParams`, `Link`). Used in `src/main.jsx`, `src/App.jsx`, `src/pages/ProjectDetail.jsx`. |
| **Framer Motion** | `^10.12.6` | `10.18.0` | Animation Engine | Declarative layout animations, page transitions, cycling headline spring animations, scroll-triggered reveals, modals, and hover micro-interactions. |
| **Lucide React** | `^1.8.0` | `1.8.0` | Icon Library | UI icons (`Sun`, `Moon`, `Mail`, `Download`, `ExternalLink`, `FolderX`, `ArrowLeft`, `Users`, `Zap`, `Calendar`). Used across `Navbar.jsx`, `Footer.jsx`, `ResumeSection.jsx`, `ProjectDetail.jsx`. |
| **React Icons** | `^5.6.0` | `5.6.0` | Icon Library | Brand and external icons: FontAwesome (`FaWhatsapp`, `FaLinkedinIn`, `FaGithub`) in `Footer.jsx` and `ContactModal.jsx`; Feather (`FiGithub`) in `ProjectDetail.jsx`. |
| **Tailwind CSS** | `^3.4.7` | `3.4.19` | CSS Framework | Utility-first styling engine configured with custom brand palettes, dark mode class strategy, and custom utility classes. |
| **PostCSS** | `^8.4.27` | `8.5.9` | CSS Processor | CSS transformation pipeline for Tailwind and Autoprefixer (`postcss.config.cjs`). |
| **Autoprefixer** | `^10.4.14` | `10.4.27` | CSS Post-Processor | Adds vendor prefixes automatically to ensure cross-browser CSS compatibility. |
| **Vite** | `^5.0.0` | `5.4.21` | Build Tool & Dev Server | Fast ESM-based local development server and Rollup-based production bundler (`vite.config.js`). |

### 2.2 Backend, APIs & External Services
- **Formspree:** Third-party form endpoint (`https://formspree.io/f/mrbkozgw`) used by both `Footer.jsx` and `ContactModal.jsx` for sending email inquiries without an owned backend server.
- **Google Fonts CDN:** Inter typeface preconnected and loaded from `https://fonts.googleapis.com` in `index.html`.
- **External Deep Links:** Direct communication integrations with WhatsApp Web/App (`https://wa.me/917861961399`), LinkedIn, GitHub, Apple App Store, and Google Play Store.

### 2.3 State Management & Architecture
- **React Context API:**
  - `ThemeContext.jsx`: Manages global dark/light state, syncs with document class list and `localStorage`.
  - `IntroContext.jsx`: Manages the initial opening brand intro phase (`'typing'` | `'shifting'` | `'done'`).
- **Local React State & Refs:** Component-level control for UI states (modal open/close, active navigation tab, dragging physics, form errors, scroll indicators).

---

## 3. Complete Folder Structure

```
Portfolio/
├── .git/                                 # Git version control metadata
├── .gitignore                            # Files and patterns excluded from git tracking
├── index.html                            # HTML entry point, SEO meta tags, JSON-LD Schema
├── netlify.toml                          # Netlify build and redirect configuration
├── package.json                          # Project dependencies, scripts, and metadata
├── package-lock.json                     # Exact dependency lockfile
├── postcss.config.cjs                    # PostCSS plugin pipeline (Tailwind & Autoprefixer)
├── README.md                             # Brief developer instructions
├── tailwind.config.cjs                   # Tailwind theme extensions, colors, dark mode strategy
├── vite.config.js                        # Vite bundler configuration
│
├── data/                                 # Centralized content store (decoupled data layer)
│   ├── contact.js                        # Contact info, social URLs, Formspree endpoint
│   ├── education.js                      # Degrees, institutions, study periods, descriptions
│   ├── experience.js                     # Roles, companies, tenure, impact statements
│   ├── home.js                           # Hero cycling headline sentences
│   ├── projects.js                       # Detailed project catalog (active and archived)
│   └── skills.js                         # Technical skills catalog with icon references
│
├── public/                               # Static assets served untouched at root
│   ├── _redirects                        # Netlify SPA fallback redirect rule (/* /index.html 200)
│   ├── apple-touch-icon.png              # iOS home screen web clip icon (180x180)
│   ├── favicon-16x16.png                 # Browser favicon (16x16)
│   ├── favicon-32x32.png                 # Browser favicon (32x32)
│   ├── favicon-192x192.png               # Android web app icon (192x192)
│   ├── favicon.ico                       # Fallback browser favicon
│   ├── favicon.svg                       # Scalable vector favicon
│   ├── og-image.png                      # Open Graph social sharing banner (1200x630)
│   ├── robots.txt                        # Search crawler instructions pointing to sitemap
│   ├── sitemap.xml                       # XML Sitemap for search indexing
│   └── resume/                           # Resume downloadable assets
│       ├── resume_preview.png            # High-resolution raster preview of resume (369 KB)
│       └── Sanyam_Mujavadia_Resume.pdf   # Downloadable curriculum vitae (137 KB)
│
└── src/                                  # Application source code
    ├── App.jsx                           # Route controller, intro coordinator, background canvas
    ├── index.css                         # Global CSS, Tailwind layers, glassmorphism, keyframes
    ├── main.jsx                          # React application root entry point & Context providers
    │
    ├── assets/                           # Media asset repository
    │   ├── index.js                      # Central export module aggregating icons and images
    │   ├── projects_image/               # Active project screenshots
    │   │   ├── img_cyberboss.jpg         # Cover image for Kyora IQ (306 KB)
    │   │   ├── img_cyberboss1.jpg        # App screenshot 1 (1.39 MB)
    │   │   ├── img_cyberboss2.jpg        # App screenshot 2 (2.11 MB)
    │   │   ├── img_cyberboss3.jpg        # App screenshot 3 (2.29 MB)
    │   │   ├── img_cyberboss4.jpg        # App screenshot 4 (2.77 MB)
    │   │   └── img_cyberboss5.jpg        # App screenshot 5 (2.02 MB)
    │   ├── skills_icon/                  # Active technical skill icon PNGs
    │   │   ├── ic_android_studio.png
    │   │   ├── ic_axios.png
    │   │   ├── ic_firebase.png
    │   │   ├── ic_git.png
    │   │   ├── ic_js.png
    │   │   ├── ic_paypal.png
    │   │   ├── ic_react.png
    │   │   ├── ic_reanimated.png
    │   │   ├── ic_redux.png
    │   │   ├── ic_rest_api.png
    │   │   ├── ic_revenuecat.png
    │   │   ├── ic_stripe.png
    │   │   ├── ic_supabase.png
    │   │   ├── ic_tailwind.png
    │   │   ├── ic_tanstack_query.png
    │   │   ├── ic_ts.png
    │   │   └── ic_xcode.png
    │   └── unused/                       # Archived media for commented-out projects
    │       ├── ic_*.png                  # Unused technology icons (express, mongodb, node, etc.)
    │       ├── img_catchndealz*.jpg      # Screenshots for Catchndealz project
    │       ├── img_gs*.webp              # Screenshots for GridSun Monitor project
    │       ├── img_soulsync*.png         # Screenshots for SoulSync project
    │       └── img_veliyx*.png           # Screenshots for Veliyx project
    │
    ├── components/                       # Reusable UI component library
    │   ├── BubbleBackground.jsx          # Interactive HTML5 2D canvas particle simulation
    │   ├── Contact.jsx                   # [Orphan/Dead code] Unused static contact section
    │   ├── ContactModal.jsx              # Slide-up accessible contact modal dialog with Formspree
    │   ├── Cursor.jsx                    # Desktop smooth magnetic custom cursor with trail
    │   ├── Education.jsx                 # Academic history timeline with Framer Motion cards
    │   ├── Experience.jsx                # Professional employment timeline with slide-in animations
    │   ├── Footer.jsx                    # Site footer, social contact links, inline Formspree form
    │   ├── FreelanceBanner.jsx           # Availability CTA card with mailto trigger
    │   ├── Hero.jsx                      # Hero section with cycling animated headlines & CTA
    │   ├── IntroAnimation.jsx            # Fullscreen typewriter intro that docks into navbar
    │   ├── Navbar.jsx                    # Floating glassmorphic navbar with active pill & mobile menu
    │   ├── ProjectCard.jsx               # Interactive project card with 3D parallax tilt & hover
    │   ├── ProjectsSection.jsx           # Grid wrapper mapping projects from data layer
    │   ├── ResumeSection.jsx             # Dual-column resume section with PDF preview & download
    │   ├── ScrollIndicator.jsx           # Vertical scroll progress bar with scroll-to-top trigger
    │   └── SkillSection.jsx              # Draggable infinite marquee skills carousel with momentum
    │
    ├── context/                          # React Context state containers
    │   ├── IntroContext.jsx              # Intro animation stage provider (`typing`, `shifting`, `done`)
    │   └── ThemeContext.jsx              # Dark/light mode provider and localStorage manager
    │
    └── pages/                            # Top-level page views
        ├── Home.jsx                      # Main landing page assembling all homepage sections
        └── ProjectDetail.jsx             # Dynamic case-study detail view (`/projects/:id`)
```

---

## 4. Website Pages and Navigation

### 4.1 Route Architecture (`src/App.jsx`)
Routing is powered by `react-router-dom` v6. All routes are wrapped inside `<BrowserRouter>` in `src/main.jsx`.

| Route Path | Element Component | Description |
| :--- | :--- | :--- |
| `/` | `<Home />` | Primary single-page portfolio view containing all content sections. |
| `/projects/:id` | `<ProjectDetail />` | Dynamic project case-study view driven by the URL parameter `:id`. |
| `*` | `<Navigate to="/" replace />` | Catch-all wildcard redirecting invalid or non-existent URLs back to `/`. |

#### Scroll Restoration
`App.jsx` executes a `useEffect` hooked into `location.pathname`:
```javascript
useEffect(() => {
  window.scrollTo(0, 0)
}, [location.pathname])
```
This guarantees that whenever the user navigates between the homepage and any project detail page, the window immediately resets to the very top.

---

### 4.2 The Homepage (`src/pages/Home.jsx`)
The homepage is a vertically structured single-page layout. Each section is tagged with a unique DOM `id` that matches the anchor navigation in `Navbar.jsx`:

1. **Floating Navigation (`Navbar.jsx`):**
   - Positioned fixed at `top-6` with glassmorphic styling.
   - Anchor links: `#hero`, `#skills`, `#projects`, `#experience`, `#education`, `#resume`.
   - Brand name acts as a link to `/` and active tab reset.
   - Houses theme switcher toggle button and "Let's talk" modal trigger.

2. **Hero Section (`Hero.jsx` - `#hero`):**
   - Cycling headline animation rotating every 5,000ms across 4 sentences defined in `data/home.js`:
     1. *"I build delightful mobile experiences."*
     2. *"React Native & performance obsessed."*
     3. *"Crafting polished interactions that users love."*
     4. *"Available for selective remote freelance work."*
   - Interactive slide pill indicators allowing manual headline selection.
   - Introductory bio paragraph emphasizing mobile app engineering.
   - Primary "Let's Work Together" button opening `ContactModal.jsx`.
   - Floating SVG organic blob animation with infinite pulse in the background.

3. **Technical Skills Carousel (`SkillSection.jsx` - `#skills`):**
   - Continuous, auto-scrolling infinite track containing 19 skill cards (duplicated 3x for seamless wraparound).
   - Pointer-driven dragging with velocity tracking and momentum glide.
   - Hover detection that pauses auto-scrolling when inspecting a skill.

4. **Projects Grid (`ProjectsSection.jsx` - `#projects`):**
   - Header with animated underline indicator.
   - 2-column responsive grid rendering `ProjectCard.jsx` instances.
   - Displays active projects (currently `Kyora IQ`).

5. **Professional Experience (`Experience.jsx` - `#experience`):**
   - Staggered timeline listing professional tenures.
   - Current role: *React Native Developer* at **Silversky Technology** (Jul. 2025 — Present).
   - Card displays company name, role, dates, and production impact details.

6. **Freelance Banner (`FreelanceBanner.jsx`):**
   - High-contrast callout container highlighting availability for selective remote contracts.
   - Direct `mailto:` action button linking to `sanyammj786@gmail.com`.

7. **Education Timeline (`Education.jsx` - `#education`):**
   - Academic history cards:
     - **Silver Oak University:** *B.Tech Computer Science Engineering* (2023 — 2027).
     - **Sankalp International School:** *Higher Secondary & Secondary Education* (2021 — 2023).

8. **Resume Showcase (`ResumeSection.jsx` - `#resume`):**
   - Left column: Headline summary, role meta details, and high-visibility "Download PDF" button (`public/resume/Sanyam_Mujavadia_Resume.pdf`).
   - Right column: Browser-mockup preview window with window controls (red/yellow/green dots), displaying `public/resume/resume_preview.png` with a direct "Open" button in a new tab.

9. **Footer & Contact Form (`Footer.jsx` - `#contact`):**
   - Comprehensive contact section featuring creator details, direct email, GitHub, LinkedIn, and WhatsApp buttons.
   - Built-in Formspree submission form with instant client-side input validation (Name, Email, Message) and animated success messaging.

---

### 4.3 Project Case Study Page (`src/pages/ProjectDetail.jsx`)
Navigated via `/projects/:id`. The page extracts the `:id` parameter using `useParams()` and matches it against `data/projects.js`:

- **Dynamic SEO Head Sync:**
  `useEffect` runs on component mount/update:
  - Updates `document.title` to `${project.title} — Sanyam Mujavadia`.
  - Updates `<meta name="description">` to the project's summary text.
  - Cleans up and resets back to portfolio defaults on unmount.

- **404 / Missing Project State:**
  If an invalid project slug is visited (e.g. `/projects/unknown`), a dedicated 404 card is rendered with an animated `FolderX` icon, explanatory text, and a "Back to Portfolio" button.

- **Found Project Case Study Structure:**
  1. **Top Floating Glass Bar:** Includes "Back to Portfolio" link with animated spring arrow, dark/light mode toggle, and "Let's talk" CTA button.
  2. **Hero Header:** Displays role pill, live pulse badge (if project is available), project title, and detailed overview narrative.
  3. **Cover Image:** Full-width hero preview with subtle border styling.
  4. **3-Column Metric Overview:**
     - *Role Card:* Engineering responsibilities.
     - *Tech Stack Card:* Badges for every technology used.
     - *Status Card:* Live indicator or completion status.
  5. **Interactive Phone Mockup Gallery:**
     - Horizontally scrollable showcase displaying actual mobile screenshots inside realistic smartphone frames (complete with top notch, speaker, screen ratio, and home indicator bar).
  6. **Key Highlights & Core Features:** Bulleted and containerized breakdown of engineering deliverables.
  7. **Challenges & Solutions Matrix:** 2-column comparative layout displaying specific technical hurdles (e.g., real-time WebSocket sync, offline background GPS tracking, Firebase state management) alongside their technical resolutions.
  8. **Action Links & Store Badges:**
     - *Live Web Demo:* External link with icon.
     - *App Store:* Official Apple badge with SVG logo.
     - *Google Play Store:* Official Google Play badge with SVG logo.
     - *Source Code:* GitHub repository link.
  9. **Impact Metrics:** Stat boxes highlighting quantitative outcomes (e.g., "2 Roles", "Realtime Chat", "End-to-End Booking").
  10. **Related Projects CTA:** "Like what you see?" prompt directing users back to the portfolio grid.
  11. **Embedded Contact Modal:** Modal dialog triggered directly from the page navigation.

---

## 5. Component Documentation

### 5.1 Root & Structural Components

#### `App.jsx`
- **File Location:** `src/App.jsx`
- **Purpose:** Top-level route controller and visual orchestrator. Coordinates the intro animation display, canvas bubble background, scroll indicator, and page routes.
- **Props:** None.
- **Dependencies:** `react`, `react-router-dom`, `framer-motion`, `BubbleBackground`, `ScrollIndicator`, `IntroAnimation`, `Home`, `ProjectDetail`, `ThemeContext`.
- **Used In:** `src/main.jsx`.

#### `Cursor.jsx`
- **File Location:** `src/components/Cursor.jsx`
- **Purpose:** Desktop-only custom magnetic cursor. Features a small inner dot that tracks the mouse immediately and an outer trailing ring that glides smoothly toward the cursor position using linear interpolation (LERP: `ringX += (mouseX - ringX) * 0.12`). Automatically scales and highlights on hovering links, buttons, and `[data-cursor]` elements.
- **Props:** None.
- **Dependencies:** `react` (`useEffect`, `useRef`).
- **Touch Device Safety:** Automatically disables itself if `window.matchMedia('(pointer: coarse)').matches` is true.
- **Used In:** `src/main.jsx`.

#### `BubbleBackground.jsx`
- **File Location:** `src/components/BubbleBackground.jsx`
- **Purpose:** Canvas-based dynamic background simulation rendering floating ambient particles with 2D physics. Bubbles bounce softly off screen boundaries, wobble via harmonic sine oscillations, and react magnetically to cursor movement (subtly attracting on slow speeds and repelling on high velocities/shockwaves).
- **Props:**
  - `maxBubbles` (*Number*, default: `28`): Maximum number of bubbles generated based on screen viewport density.
  - `isDark` (*Boolean*, default: `false`): Live flag that dynamically swaps particle color palettes without destroying bubble positions.
- **Dependencies:** Pure HTML5 2D Canvas context, `requestAnimationFrame`.
- **Used In:** `src/App.jsx`.

#### `IntroAnimation.jsx`
- **File Location:** `src/components/IntroAnimation.jsx`
- **Purpose:** First-load brand introduction. Centers the developer's name on a full-screen backdrop, executes an automated typewriter effect (50ms/character), pauses, and smoothly animates its scale and coordinates to dock precisely over the navbar brand logo before disappearing. Locks page scroll during execution.
- **Props:**
  - `onComplete` (*Function*, optional): Callback invoked when the intro completes to unmount the overlay.
- **Dependencies:** `framer-motion`, `IntroContext`, `contact.js`.
- **Used In:** `src/App.jsx`.

#### `ScrollIndicator.jsx`
- **File Location:** `src/components/ScrollIndicator.jsx`
- **Purpose:** Floating vertical progress bar positioned at bottom-right. Fades in once the user scrolls >120px down. Displays proportional scroll depth and triggers a smooth scroll-to-top when clicked.
- **Props:** None.
- **Dependencies:** `framer-motion`.
- **Used In:** `src/App.jsx`.

---

### 5.2 Navigation & Layout Components

#### `Navbar.jsx`
- **File Location:** `src/components/Navbar.jsx`
- **Purpose:** Fixed glassmorphic navigation header. Handles smooth anchor scrolling to page sections, dynamic active-tab highlight with spring layout transition (`layoutId="active-pill"`), dark/light mode toggle, and mobile collapsible drawer.
- **Props:**
  - `onContactOpen` (*Function*, required): Callback that opens the global contact modal.
- **Dependencies:** `react-router-dom`, `framer-motion`, `lucide-react` (`Sun`, `Moon`), `ThemeContext`, `IntroContext`, `contact.js`.
- **Used In:** `src/pages/Home.jsx`.

#### `Footer.jsx`
- **File Location:** `src/components/Footer.jsx`
- **Purpose:** Portfolio footer containing social networking links and an interactive Formspree contact form with client-side regex email validation, error feedback, and submission state transitions.
- **Props:** None.
- **Dependencies:** `framer-motion`, `lucide-react` (`Mail`), `react-icons/fa` (`FaWhatsapp`, `FaLinkedinIn`, `FaGithub`), `contact.js`.
- **Used In:** `src/pages/Home.jsx`.

#### `ContactModal.jsx`
- **File Location:** `src/components/ContactModal.jsx`
- **Purpose:** Accessible overlay modal dialog for direct message submission. Supports Escape key closing, background scroll lock, input autofocus, quick social pill links, and Formspree submission handling.
- **Props:**
  - `isOpen` (*Boolean*, required): Controls modal visibility.
  - `onClose` (*Function*, required): Callback invoked when dismissing the modal.
- **Dependencies:** `framer-motion` (`AnimatePresence`), `lucide-react`, `react-icons/fa`, `contact.js`.
- **Used In:** `src/pages/Home.jsx`, `src/pages/ProjectDetail.jsx`.

---

### 5.3 Content & Presentation Components

#### `Hero.jsx`
- **File Location:** `src/components/Hero.jsx`
- **Purpose:** Homepage landing hero. Rotates through 4 headlines with vertical spring animations every 5 seconds, renders pagination dots, bio narrative, floating background SVG blob, and primary contact CTA.
- **Props:**
  - `onContactOpen` (*Function*, required): Triggers opening of `ContactModal.jsx`.
- **Dependencies:** `framer-motion`, `data/home.js`.
- **Used In:** `src/pages/Home.jsx`.

#### `SkillSection.jsx`
- **File Location:** `src/components/SkillSection.jsx`
- **Purpose:** Infinite horizontal technical skill marquee. Allows pointer-drag interaction with momentum decay, auto-scrolling via `requestAnimationFrame`, and hover pause.
- **Props:** None.
- **Dependencies:** `framer-motion`, `data/skills.js`.
- **Used In:** `src/pages/Home.jsx`.

#### `ProjectsSection.jsx`
- **File Location:** `src/components/ProjectsSection.jsx`
- **Purpose:** Responsive grid container mapping active projects from `data/projects.js` to individual cards.
- **Props:** None.
- **Dependencies:** `framer-motion`, `ProjectCard.jsx`, `data/projects.js`.
- **Used In:** `src/pages/Home.jsx`.

#### `ProjectCard.jsx`
- **File Location:** `src/components/ProjectCard.jsx`
- **Purpose:** Showcase card for individual projects. Features a 3D perspective tilt effect calculating pointer offset from the card's center (`perspective(900px) rotateX(...) rotateY(...)`), tech stack tags, and slide-up hover overlay.
- **Props:**
  - `project` (*Object*, required): Project data object containing `id`, `title`, `role`, `description`, `coverImage`, `tags`, `highlights`.
- **Dependencies:** `react-router-dom`, `framer-motion`.
- **Used In:** `src/components/ProjectsSection.jsx`.

#### `Experience.jsx`
- **File Location:** `src/components/Experience.jsx`
- **Purpose:** Renders the developer's work experience timeline with alternating slide-in entrance animations.
- **Props:** None.
- **Dependencies:** `framer-motion`, `data/experience.js`.
- **Used In:** `src/pages/Home.jsx`.

#### `FreelanceBanner.jsx`
- **File Location:** `src/components/FreelanceBanner.jsx`
- **Purpose:** Highlighted banner advertising availability for remote freelance opportunities with direct email CTA.
- **Props:** None.
- **Dependencies:** `framer-motion`, `data/contact.js`.
- **Used In:** `src/pages/Home.jsx`.

#### `Education.jsx`
- **File Location:** `src/components/Education.jsx`
- **Purpose:** Renders academic qualifications in a vertical timeline card format.
- **Props:** None.
- **Dependencies:** `framer-motion`, `data/education.js`.
- **Used In:** `src/pages/Home.jsx`.

#### `ResumeSection.jsx`
- **File Location:** `src/components/ResumeSection.jsx`
- **Purpose:** Dual-column section presenting a summary statement, role and degree metadata, direct PDF download button, and a window-framed resume graphic preview with an external tab open link.
- **Props:** None.
- **Dependencies:** `framer-motion`, `lucide-react` (`Download`, `ExternalLink`).
- **Used In:** `src/pages/Home.jsx`.

#### `Contact.jsx` *(Unused Component)*
- **File Location:** `src/components/Contact.jsx`
- **Purpose:** An early, minimalist contact section. It is **not imported or rendered anywhere** in the active codebase.
- **Status:** **Dead / Orphan Code**.

---

## 6. Code and Functionality Explanation

### 6.1 Application Entry Point & Provider Hierarchy
The application boots in `src/main.jsx`. The root element is selected and mounted using React 18's `createRoot`:

```jsx
// src/main.jsx
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <IntroProvider>
        <BrowserRouter>
          <App />
          <Cursor />
        </BrowserRouter>
      </IntroProvider>
    </ThemeProvider>
  </React.StrictMode>
)
```

**Provider Hierarchy Breakdown:**
1. `<React.StrictMode>`: Activates development runtime checks and warnings.
2. `<ThemeProvider>`: Manages document-level dark/light mode class binding and `localStorage` synchronization.
3. `<IntroProvider>`: Manages global intro stage awareness so `Navbar.jsx` can coordinate its entrance with `IntroAnimation.jsx`.
4. `<BrowserRouter>`: Injects client-side HTML5 history routing.
5. `<App />`: Top-level route switch and screen orchestrator.
6. `<Cursor />`: Sits adjacent to `App` at the root level to overlay all screen elements independently.

---

### 6.2 The Intro Flying Logo Animation (`IntroAnimation.jsx` + `Navbar.jsx`)
One of the most complex custom animations in the project is the synchronized transition between `IntroAnimation` and `Navbar`:

1. **Typing Phase:** `IntroAnimation` uses a character-by-character `setInterval` (50ms interval) to reveal the developer's name: `Sanyam Mujavadia`.
2. **Measurement & Target Calculation:** A `getBoundingClientRect()` calculation compares the center of the typed name against the `#navbar-brand-text` element in the floating navigation bar:
   ```javascript
   const deltaX = (logoRect.left + logoRect.width / 2) - (centerRect.left + centerRect.width / 2)
   const deltaY = (logoRect.top + logoRect.height / 2) - (centerRect.top + centerRect.height / 2)
   const scale = Math.min(Math.max(logoRect.height / centerRect.height, 0.3), 0.48)
   setDockOffset({ x: deltaX, y: deltaY, scale })
   ```
3. **Flight / Shifting Phase:** Framer Motion smoothly transforms the name element from the screen center directly into the navbar pill using the calculated coordinates:
   ```javascript
   animate={{
     scale: phase === 'shifting' ? dockOffset.scale : 1,
     opacity: phase === 'shifting' ? 0 : 1,
     x: phase === 'shifting' ? dockOffset.x : 0,
     y: phase === 'shifting' ? dockOffset.y : 0,
   }}
   ```
4. **Navbar Entrance:** As `introPhase` changes from `'typing'` to `'shifting'`, the navbar pill scales outward horizontally (`scaleX: 0.15 -> 1`) and reveals the brand text seamlessly.

---

### 6.3 Canvas Particle Physics Simulation (`BubbleBackground.jsx`)
`BubbleBackground.jsx` runs an independent `requestAnimationFrame` loop that directly paints to an HTML5 `<canvas>` element:
- **Device Pixel Ratio (DPR) Scaling:** `ctx.setTransform(DPR, 0, 0, DPR, 0, 0)` ensures crisp rendering on high-DPI screens.
- **Physics Equations:**
  - **Oscillation:** `b.x += b.vx * b.speedFactor + Math.cos(b.phase) * 0.06`
  - **Friction/Damping:** `b.vx *= 0.995; b.vy *= 0.995;`
  - **Wall Boundaries:** Soft bounce dampening (`Math.abs(b.vx) * 0.8`).
- **Pointer Interaction:** Tracks cursor position and velocity (`p.vx`, `p.vy`). Bubbles calculate distance (`dist`); if within `200 + b.r` pixels, bubbles are attracted or repelled based on whether pointer speed exceeds threshold `1.2`.
- **Shockwaves:** Every 120ms, an interval checks for sudden cursor accelerations (`vel - lastVelocity > 3`), applying a strong impulse wave (`k = (1 - dist / 300) * 6`) to disperse nearby bubbles.
- **Resource Management:** Automatically cancels animation frames when the browser tab is hidden (`document.addEventListener('visibilitychange', ...)`).

---

### 6.4 Infinite Draggable Skills Carousel (`SkillSection.jsx`)
Rather than relying on basic CSS marquee animations, `SkillSection.jsx` implements an interactive, physics-based carousel:
- **Infinite Triplication:** Triplicates the skill data (`[...skills, ...skills, ...skills]`).
- **Loop Width:** Dynamically computes `trackRef.current.scrollWidth / 3`. When position exceeds `loopWidth` or falls below `0`, it wraps seamlessly:
  ```javascript
  if (posRef.current >= loopWidth) posRef.current -= loopWidth
  else if (posRef.current < 0) posRef.current += loopWidth
  ```
- **Pointer Capture & Dragging:** Employs `setPointerCapture` and `releasePointerCapture` to maintain reliable drag tracking even when the pointer exits the viewport.
- **Momentum Glide:** On pointer release, calculates exit velocity (`(deltaX / dt) * 16.667`) and decays it over time (`velocityRef.current *= Math.pow(0.94, dt)`), providing an iOS-like deceleration feel.
- **High Refresh Rate Normalization:** Computes delta time (`dt`) relative to 60fps baseline (`16.667ms`) to maintain uniform scroll speed on 120Hz/144Hz displays.

---

### 6.5 Formspree Contact Form Submission & Validation
Both `Footer.jsx` and `ContactModal.jsx` submit data directly to Formspree without full-page reloads:

1. **Validation:**
   ```javascript
   function validate() {
     const errs = {}
     if (!state.name.trim()) errs.name = 'Name required'
     if (!state.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errs.email = 'Valid email required'
     if (!state.message.trim()) errs.message = 'Message required'
     setErrors(errs)
     return Object.keys(errs).length === 0
   }
   ```
2. **Fetch Request:**
   ```javascript
   const res = await fetch(contact.formspree, {
     method: 'POST',
     body: new FormData(formRef.current),
     headers: { Accept: 'application/json' },
   })
   ```
3. **State Management:** Toggles status between `'idle'`, `'sending'`, and `'success'`. In `ContactModal.jsx`, successful submissions automatically clear fields and dismiss the modal after a 2,500ms delay.

---

## 7. Styling and Design System

### 7.1 Configuration & Token Architecture (`tailwind.config.cjs`)
Tailwind CSS is configured in CommonJS syntax:

```javascript
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f6f8fb",
          100: "#e9eef7",
          200: "#cfe0f0",
          300: "#b4d1e8",
          400: "#7fb7df",
          500: "#4a9cd6",
          600: "#2f7fb0",
          700: "#235f83",
          800: "#1a4861",
          900: "#102f3d",
        },
        accent: {
          DEFAULT: "#ff7aa2",
          500: "#ff7aa2",
          600: "#ff4f8a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        "soft-lg": "0 10px 30px rgba(16,24,40,0.08)",
      },
    },
  },
  plugins: [],
};
```

### 7.2 Color System & Theming Strategy
The application utilizes Tailwind's `class` dark mode strategy. When `isDark` is true in `ThemeContext.jsx`, the class `.dark` is added directly to `document.documentElement`:

- **Light Mode Palette:**
  - Base Background: `#ffffff` (`bg-white`)
  - Canvas Subtle Tint: `radial-gradient(1200px 600px at 10% 10%, rgba(100,116,139,0.04), transparent 10%)`
  - Primary Text: `#0f172a` (`text-slate-900`)
  - Secondary Text: `#475569` (`text-slate-600`) / `#64748b` (`text-slate-500`)
  - Glass Surface: `linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.35))` with `backdrop-blur: 6px` and `border: 1px solid rgba(0,0,0,0.05)`
  - Accent Color: `#ff7aa2` (used for CTA highlights and dots)

- **Dark Mode Palette:**
  - Base Background: `#020617` (`bg-slate-950`)
  - Card/Section Surfaces: `#0f172a` (`bg-slate-900`) / `#1e293b` (`bg-slate-800`)
  - Primary Text: `#f8fafc` (`text-slate-100`)
  - Secondary Text: `#94a3b8` (`text-slate-400`)
  - Glass Surface (`.dark .glass`): `linear-gradient(180deg, rgba(30, 41, 59, 0.75), rgba(15, 23, 42, 0.65))` with `backdrop-blur: 10px` and `border: 1px solid rgba(255, 255, 255, 0.06)`
  - Elevated Shadows: Deep black ambient drop shadows (`rgba(0, 0, 0, 0.4)` to `rgba(0, 0, 0, 0.5)`)

### 7.3 Typography
- **Font Family:** `Inter`, falling back to `ui-sans-serif`, `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`.
- **Loaded Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold).
- **Heading Styles:** `.section-title` applies `font-weight: 700`, `letter-spacing: 0.6px`, `font-size: 1.875rem` (30px), with `.heading-gradient` applying an animated clip gradient from slate-600 to slate-400.

### 7.4 Custom CSS Utility Classes (`src/index.css`)
- `.glass`: Light-mode translucent blurred backdrop.
- `.darkGlass`: High-contrast dark gradient glass card.
- `.gradient-text`: Text fill clipped with an infinite 6s keyframe gradient shift (`gradientShift`).
- `.timeline` & `.timeline-card`: Vertical timeline structure with connecting lines and card offset.
- `.project-card` & `.project-overlay`: Card container with hover translate up, lift shadow, and slide-up overlay description.
- `.card-glow`: Positioned radial glow element behind project cards that fades in on hover.
- `.no-scrollbar`: Multi-vendor utility hiding default scrollbars across WebKit, Firefox, and Edge.

### 7.5 Responsive Breakpoints & Adaptations
Standard Tailwind responsive prefixes are used throughout:
- `sm:` (640px): Navbar switches from compact mobile burger button to expanded horizontal link row; timeline padding widens; modal grid expands to two columns.
- `md:` (768px): Footer layout switches from single column to 2-column grid (contact details left, form right); highlight lists split into two columns.
- `lg:` (1024px): Resume section converts into a 12-column grid (5 cols for metadata & CTA, 7 cols for the windowed PDF preview).
- **Mobile Touch Handling:** Custom cursor elements (`.cursor-dot`, `.cursor-ring`) and 3D card tilt listeners are automatically deactivated on devices with coarse touch inputs (`pointer: coarse`).

---

## 8. Assets and External Resources

### 8.1 Asset Catalog & Reference Method

| Asset Identifier / Path | Type | Storage Location | Size | Referencing Method & Role |
| :--- | :--- | :--- | :--- | :--- |
| `public/favicon.ico` | ICO | `public/` | 2.69 KB | Root-relative link in `index.html`. |
| `public/favicon.svg` | SVG | `public/` | 697 B | Root-relative link in `index.html`. |
| `public/favicon-16x16.png` | PNG | `public/` | 778 B | Root-relative link in `index.html`. |
| `public/favicon-32x32.png` | PNG | `public/` | 1.88 KB | Root-relative link in `index.html`. |
| `public/favicon-192x192.png` | PNG | `public/` | 19.10 KB | Root-relative link in `index.html`. |
| `public/apple-touch-icon.png` | PNG | `public/` | 17.40 KB | Root-relative link in `index.html`. |
| `public/og-image.png` | PNG | `public/` | 73.79 KB | Open Graph social sharing image (`index.html`). |
| `public/resume/Sanyam_Mujavadia_Resume.pdf` | PDF | `public/resume/` | 136.88 KB | Downloaded via direct link in `ResumeSection.jsx`. |
| `public/resume/resume_preview.png` | PNG | `public/resume/` | 369.38 KB | Rendered as preview image in `ResumeSection.jsx`. |
| `img_cyberboss.jpg` | JPG | `src/assets/projects_image/` | 305.67 KB | Imported via `src/assets/index.js`, cover image for Kyora IQ. |
| `img_cyberboss1.jpg` | JPG | `src/assets/projects_image/` | 1.39 MB | Imported via `src/assets/index.js`, screenshot 1 for Kyora IQ. |
| `img_cyberboss2.jpg` | JPG | `src/assets/projects_image/` | 2.11 MB | Imported via `src/assets/index.js`, screenshot 2 for Kyora IQ. |
| `img_cyberboss3.jpg` | JPG | `src/assets/projects_image/` | 2.29 MB | Imported via `src/assets/index.js`, screenshot 3 for Kyora IQ. |
| `img_cyberboss4.jpg` | JPG | `src/assets/projects_image/` | 2.77 MB | Imported via `src/assets/index.js`, screenshot 4 for Kyora IQ. |
| `img_cyberboss5.jpg` | JPG | `src/assets/projects_image/` | 2.02 MB | Imported via `src/assets/index.js`, screenshot 5 for Kyora IQ. |
| Active Skill Icons (17 files) | PNG | `src/assets/skills_icon/` | 1.8 KB – 47.7 KB | Imported in `src/assets/index.js`, referenced in `data/skills.js`. |
| Unused Project Images (36 files) | JPG/PNG/WebP | `src/assets/unused/` | ~20 MB total | Archived in `unused/`, imported in `src/assets/index.js`. |
| Unused Icons (7 files) | PNG | `src/assets/unused/` | ~90 KB total | Archived in `unused/`, imported in `src/assets/index.js`. |

---

## 9. SEO and Existing Metadata

### 9.1 Static HTML Metadata (`index.html`)

```html
<!-- Primary Meta Tags -->
<title>Sanyam Mujavadia — React Native & Web Developer Portfolio</title>
<meta name="title" content="Sanyam Mujavadia — React Native & Web Developer Portfolio" />
<meta name="description" content="React Native & Frontend Developer specializing in high-performance iOS, Android, and web applications. Delivered 10+ production projects across mobile and web." />
<meta name="author" content="Sanyam Mujavadia" />
<meta name="keywords" content="Sanyam Mujavadia, React Native Developer, Mobile App Developer, React.js, iOS Developer, Android Developer, TypeScript, Frontend Engineer, Web Developer, Supabase, Ahmedabad, India, Portfolio, Hire React Native Developer" />
<link rel="canonical" href="https://sanyammujavadia.netlify.app" />

<!-- Open Graph / Facebook / LinkedIn / WhatsApp -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://sanyammujavadia.netlify.app" />
<meta property="og:title" content="Sanyam Mujavadia — React Native & Web Developer" />
<meta property="og:description" content="Crafting high-performance mobile apps & scalable web applications. 10+ production projects on App Store & Google Play Store." />
<meta property="og:image" content="https://sanyammujavadia.netlify.app/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Sanyam Mujavadia — React Native & Web Developer Portfolio" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://sanyammujavadia.netlify.app" />
<meta name="twitter:title" content="Sanyam Mujavadia — React Native & Web Developer" />
<meta name="twitter:description" content="Crafting high-performance mobile apps & scalable web applications. 10+ production projects on App Store & Google Play Store." />
<meta name="twitter:image" content="https://sanyammujavadia.netlify.app/og-image.png" />
```

### 9.2 Structured Data (JSON-LD)
`index.html` includes a fully configured `Person` schema for rich search snippets:
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sanyam Mujavadia",
  "url": "https://sanyammujavadia.netlify.app",
  "image": "https://sanyammujavadia.netlify.app/og-image.png",
  "jobTitle": "React Native & Web Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Silversky Technology"
  },
  "alumnusOf": {
    "@type": "EducationalOrganization",
    "name": "Silver Oak University"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ahmedabad",
    "addressRegion": "Gujarat",
    "addressCountry": "India"
  },
  "sameAs": [
    "https://github.com/Sanyam0786",
    "https://www.linkedin.com/in/sanyam-mujavadia-88819328a/"
  ],
  "knowsAbout": [
    "React Native", "React.js", "TypeScript", "JavaScript",
    "Mobile App Development", "iOS Development", "Android Development",
    "Supabase", "Firebase", "TailwindCSS", "Redux Toolkit", "REST APIs"
  ]
}
```

### 9.3 Robots and Sitemap Configuration
- **`public/robots.txt`:**
  ```
  User-agent: *
  Allow: /

  Sitemap: https://sanyammujavadia.netlify.app/sitemap.xml
  ```
- **`public/sitemap.xml`:**
  Lists 3 URLs:
  1. `https://sanyammujavadia.netlify.app/` (`priority: 1.0`, `weekly`)
  2. `https://sanyammujavadia.netlify.app/projects/kyora-iq` (`priority: 0.8`, `monthly`)
  3. `https://sanyammujavadia.netlify.app/resume/Sanyam_Mujavadia_Resume.pdf` (`priority: 0.7`, `monthly`)

### 9.4 Missing & Incomplete SEO Elements
1. **Static Open Graph on Client-Side Routes:** Social bots crawling `/projects/kyora-iq` will read the root `index.html` meta tags rather than project-specific Open Graph images or titles because there is no server-side rendering or pre-rendering.
2. **Fixed Canonical Tag:** The canonical URL is hardcoded to `https://sanyammujavadia.netlify.app` in `index.html` and is not dynamically updated when navigating to project detail pages.
3. **Outdated Sitemap Timestamps:** `lastmod` dates in `sitemap.xml` are hardcoded to `2026-10-12`.
4. **Missing AI Agent Discoverability Files:** No `llms.txt` or `llms-full.txt` files exist in `public/` to aid generative AI crawlers.

---

## 10. Performance and Accessibility

### 10.1 Verified Performance Metrics (Build Output)
Executing `npm run build` produces the following bundle distribution:

```
dist/assets/index-[hash].css      49.11 kB │ gzip:   8.83 kB
dist/assets/index-[hash].js      358.69 kB │ gzip: 114.92 kB
Total Transformed Modules:        2,122
Build Duration:                   ~6.2 seconds
```

#### Performance Strengths
- **Low CSS Footprint:** Tailwind extracts only used utility classes, resulting in an 8.83 kB gzipped stylesheet.
- **Font Optimization:** `fonts.googleapis.com` and `fonts.gstatic.com` use `<link rel="preconnect">` and `display=swap` to avoid blocking render.
- **Resource Cleanup in Canvas:** The bubble particle canvas unhooks animation frames when the tab loses visibility.
- **Passive Listeners:** Scroll and touch listeners in `BubbleBackground.jsx` and `ScrollIndicator.jsx` use `{ passive: true }` to avoid locking the main UI thread.

#### Verified Performance Bottlenecks
- **Uncompressed High-Resolution Screenshots:**
  - `img_cyberboss4.jpg`: **2.77 MB**
  - `img_cyberboss3.jpg`: **2.29 MB**
  - `img_cyberboss2.jpg`: **2.11 MB**
  - `img_cyberboss5.jpg`: **2.02 MB**
  - `img_cyberboss1.jpg`: **1.39 MB**
  These images are loaded without WebP/AVIF modern compression or responsive `srcset` scaling, leading to substantial initial data transfers when loading project case studies.
- **Bundling of Unused Assets:**
  Because `src/assets/index.js` statically imports 36 archived images from `src/assets/unused/`, Vite includes **over 25 MB** of unused media into the `dist/assets/` output directory during every build.
- **No Route-Level Code Splitting:**
  Neither `Home.jsx` nor `ProjectDetail.jsx` are dynamically loaded via `React.lazy()`. The complete application code, including router logic and third-party icons, is compiled into a single 358 kB JavaScript file.

---

### 10.2 Accessibility (a11y) Implementation
- **Semantic Structure:** The DOM makes appropriate use of semantic container tags: `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`.
- **Keyboard Navigation:**
  - Modals can be dismissed using the `Escape` key.
  - Buttons and interactive links have clear focus outlines.
- **Screen Reader Accommodations:**
  - Form inputs in `Footer.jsx` and `ContactModal.jsx` utilize `<label className="sr-only">`.
  - Non-text decorative graphics (`BubbleBackground`, decorative SVGs, `Cursor`) include `aria-hidden="true"`.
- **Motion Safety:**
  - Custom cursor and 3D card tilt are explicitly turned off on touch/coarse devices (`pointer: coarse`).
- **Accessibility Shortcomings:**
  - `ContactModal.jsx` does not include ARIA dialog attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`).
  - Focus is not trapped inside `ContactModal.jsx` during open states (keyboard users can tab outside into the background page).
  - Multiple competing `<h1>` tags exist simultaneously (one in `IntroAnimation.jsx` and one in `Hero.jsx`).

---

## 11. Build and Deployment

### 11.1 Build Scripts (`package.json`)
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

- **`npm run dev`:** Boots the Vite local development server with Hot Module Replacement (HMR). Default port is `http://localhost:5173`.
- **`npm run build`:** Compiles JSX, transpiles modern JavaScript, processes Tailwind CSS via PostCSS, bundles static assets into `dist/`.
- **`npm run preview`:** Runs a local static HTTP server serving the production `dist/` directory to verify release builds.

### 11.2 Environment Variables
The repository currently has **zero** `.env` dependencies. All configuration values, including the Formspree endpoint and contact details, are declared directly in `data/contact.js`.

### 11.3 Deployment Configuration (`netlify.toml` & `public/_redirects`)
The site is configured for static hosting on Netlify.

- **`netlify.toml`:**
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
- **`public/_redirects`:**
  ```
  /*    /index.html   200
  ```
Both files instruct Netlify's CDN edge servers to route all requests that do not match a static file back to `/index.html` with an HTTP 200 status code. This allows React Router DOM's client-side browser history routing to function properly on page reloads.

---

## 12. Existing Problems and Improvement Opportunities

> [!NOTE]
> The findings in this section are objective technical observations and recommendations. In accordance with task guidelines, no source code or packages have been altered.

### 12.1 Dead Code and Unused Imports
1. **Orphan Component `src/components/Contact.jsx`:**
   A rudimentary contact section exists at `src/components/Contact.jsx` but is never imported or used anywhere.
2. **Unused Component Import in `Navbar.jsx`:**
   Line 4 of `src/components/Navbar.jsx` imports `ContactModal`, but the modal is rendered at the page level in `Home.jsx` and `ProjectDetail.jsx`, leaving the import unused.
3. **Unused Component Import in `Home.jsx`:**
   Line 10 of `src/pages/Home.jsx` imports `ScrollIndicator`, but `<ScrollIndicator />` is already mounted globally in `src/App.jsx`.
4. **Duplicate Style Import in `App.jsx`:**
   `import './index.css'` is present in both `src/main.jsx` and `src/App.jsx`.

### 12.2 Asset Pipeline & Performance
1. **Unused Asset Bundling in `src/assets/index.js`:**
   `src/assets/index.js` statically imports 36 image files from `src/assets/unused/` (associated with the commented-out projects: Veliyx, SoulSync, Catchndealz, GridSun). Because they are exported in an object, Vite's Rollup bundler copies all ~25 MB of images into the production output `dist/assets/`.
   - *Recommendation:* Remove unused imports from `src/assets/index.js` and import assets dynamically or on-demand only for active projects.
2. **Missing Image Compression:**
   Active project screenshots in `src/assets/projects_image/` are raw JPEG files between 1.39 MB and 2.77 MB each.
   - *Recommendation:* Convert images to modern `.webp` or `.avif` formats and resize them to match mobile container dimensions (e.g., max width 800px), reducing total screenshot payload from ~11 MB down to under 1.2 MB.
3. **Monolithic Bundle (Lack of Code Splitting):**
   The entire application is bundled into a single JavaScript file (`358 kB`).
   - *Recommendation:* Implement lazy loading in `src/App.jsx` using `React.lazy()` for `ProjectDetail`:
     ```jsx
     const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'))
     ```

### 12.3 Search Engine & AI Optimization (SEO / GEO)
1. **SPA Social Previews:**
   Because the site is a client-side SPA, crawlers from LinkedIn, Twitter/X, and WhatsApp that do not execute JavaScript will only ever see the default homepage Open Graph metadata from `index.html`, even when sharing `/projects/kyora-iq`.
   - *Recommendation:* Implement pre-rendering (e.g. via `vite-plugin-prerender` or an SSG framework like Astro/Next.js) so each route has a distinct static HTML file with matching OG tags.
2. **Missing AI Crawling Directive:**
   - *Recommendation:* Create `public/llms.txt` and `public/llms-full.txt` providing structured, markdown-first summaries of skills, experience, and contact details for generative AI models.

### 12.4 Accessibility & UX
1. **Modal Dialog ARIA Attributes & Focus Trap:**
   `ContactModal.jsx` lacks `role="dialog"`, `aria-modal="true"`, and does not restrict keyboard `Tab` navigation to within the modal.
2. **Repeated Intro Animation:**
   The full-screen typewriter animation plays every time the user refreshes or re-enters the homepage.
   - *Recommendation:* Store a flag in `sessionStorage` (e.g. `sessionStorage.getItem('intro_seen')`) so the animation only runs once per browser session.

---

## 13. Important Project Files

The following table highlights the most important files in the repository, their exact paths, and why they matter to developers and AI coding assistants:

| File Path | Importance & Role in Project |
| :--- | :--- |
| `src/main.jsx` | Application bootstrap file. Configures React 18 root, StrictMode, ThemeProvider, IntroProvider, and Router. |
| `src/App.jsx` | Main route registry and visual layer manager. Connects the background canvas, scroll tracker, and routes. |
| `src/index.css` | Global styling master stylesheet. Contains Tailwind directives, glassmorphic filters, and animation keyframes. |
| `tailwind.config.cjs` | Design system configuration. Defines theme colors, dark mode class strategy, and custom shadows. |
| `vite.config.js` | Core build configuration powering development HMR and production Rollup compilation. |
| `netlify.toml` | Production deployment configuration specifying build commands, output paths, and SPA routing rewrites. |
| `index.html` | Entry HTML file containing essential meta tags, favicon links, Google Fonts preconnects, and JSON-LD structured data. |
| `data/projects.js` | Source of truth for all portfolio project case studies, highlights, features, and store links. |
| `data/skills.js` | Registry of all technical skills displayed in the infinite carousel. |
| `data/contact.js` | Centralized contact configuration containing email, phone, Formspree endpoint, and social profile links. |
| `src/components/BubbleBackground.jsx` | 2D canvas physics simulation that creates the unique ambient floating bubble aesthetic. |
| `src/components/IntroAnimation.jsx` | Brand introduction animation that types out the developer name and docks into the navbar logo. |
| `src/components/Navbar.jsx` | Primary navigation component with smooth scrolling, theme switching, and mobile menu. |
| `src/pages/ProjectDetail.jsx` | Case study page template displaying full case study details, mockups, and store links. |

---

## 14. Final Technical Summary

### 14.1 Technology Stack Matrix
- **Runtime & Framework:** React `18.3.1` (Vite `5.4.21`)
- **Styling Solution:** Tailwind CSS `3.4.19`, PostCSS `8.5.9`, Autoprefixer `10.4.27`
- **Animation Frameworks:** Framer Motion `10.18.0`, HTML5 Canvas 2D API
- **Routing Engine:** React Router DOM `6.30.3`
- **Iconography:** Lucide React `1.8.0`, React Icons `5.6.0`, custom PNG assets
- **Form Service:** Formspree (`https://formspree.io/f/mrbkozgw`)
- **Hosting / CDN:** Netlify Static Cloud

### 14.2 Architecture Assessment
The application demonstrates clean separation of concerns:
- **Presentation Layer (`src/components/`, `src/pages/`):** Focuses solely on rendering, animations, and user interactions.
- **Data Layer (`data/`):** Encapsulates all content into plain JavaScript objects, making updates safe and straightforward.
- **State Layer (`src/context/`):** Uses lightweight React Context for theme and intro state rather than heavyweight third-party stores.

### 14.3 Priority Recommendations Roadmap
If future development or enhancements are planned, the following items represent the highest-return technical improvements:

1. **Asset Optimization (Immediate):**
   - Clean up `src/assets/index.js` to stop exporting unused images from `src/assets/unused/` (will immediately decrease build output size by ~25 MB).
   - Convert active project screenshots in `src/assets/projects_image/` to `.webp` format to eliminate multi-megabyte image downloads.
2. **Route Splitting:**
   - Introduce `React.lazy()` for `ProjectDetail.jsx` to reduce initial bundle parse times.
3. **Session-Aware Intro:**
   - Persist intro completion in `sessionStorage` to avoid replaying the 2-second intro on every page reload.
4. **Prerendering / SEO:**
   - Add pre-rendering for `/projects/kyora-iq` to provide dedicated Open Graph preview cards when shared on social media.
