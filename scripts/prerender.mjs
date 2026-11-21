import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')

async function prerender() {
  console.log('[prerender] Starting static HTML generation...')

  const indexPath = path.join(distDir, 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.error('[prerender] Error: dist/index.html not found. Run vite build first.')
    process.exit(1)
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf-8')

  // Semantic crawlable fallback for homepage
  const homeStaticContent = `
  <div id="root">
    <header class="sr-only">
      <nav aria-label="Main Navigation">
        <a href="/">Sanyam Mujavadia</a>
        <ul>
          <li><a href="/#hero">Home</a></li>
          <li><a href="/#skills">Skills</a></li>
          <li><a href="/#projects">Projects</a></li>
          <li><a href="/#experience">Experience</a></li>
          <li><a href="/#education">Education</a></li>
          <li><a href="/#resume">Resume</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <section id="hero">
        <p>Sanyam Mujavadia — React Native &amp; Web Developer</p>
        <h1>Hi, I'm Sanyam Mujavadia — I build delightful mobile experiences.</h1>
        <p>React Native &amp; Frontend Developer based in Ahmedabad, Gujarat, India. Specializing in high-performance iOS, Android, and web applications with polished interactions.</p>
        <a href="/#contact">Let's Work Together</a>
      </section>
      <section id="skills">
        <h2>Technical Skills</h2>
        <p>React Native, React.js, TypeScript, JavaScript, Tailwind CSS, Redux Toolkit, TanStack Query, Reanimated, Firebase, Supabase, Stripe, PayPal, RevenueCat, Git, Xcode, Android Studio, REST APIs, Axios.</p>
      </section>
      <section id="projects">
        <h2>Featured Projects</h2>
        <article>
          <h3>Kyora IQ</h3>
          <p>A service marketplace app connecting users with cybersecurity and cloud experts, featuring real-time chat, booking workflows, and role-based experiences built with React Native.</p>
          <a href="/projects/kyora-iq">View Kyora IQ Case Study</a>
        </article>
      </section>
      <section id="experience">
        <h2>Professional Experience</h2>
        <article>
          <h3>React Native Developer — Silversky Technology</h3>
          <p>July 2025 — Present | Ahmedabad, Gujarat, India</p>
          <p>Delivered production-ready applications on App Store and Play Store, with strong focus on problem-solving and scalable architecture.</p>
        </article>
      </section>
      <section id="education">
        <h2>Education</h2>
        <article>
          <h3>B.Tech Computer Science Engineering — Silver Oak University</h3>
          <p>2023 — 2027 | Ahmedabad, Gujarat, India</p>
        </article>
      </section>
      <section id="resume">
        <h2>Resume</h2>
        <p>Mobile &amp; Web Developer — B.Tech Computer Science, Silver Oak University</p>
        <a href="/resume/Sanyam_Mujavadia_Resume.pdf" download>Download Sanyam Mujavadia Resume (PDF)</a>
      </section>
    </main>
    <footer>
      <h2>Contact Sanyam Mujavadia</h2>
      <p>Email: <a href="mailto:sanyammj786@gmail.com">sanyammj786@gmail.com</a></p>
      <p>LinkedIn: <a href="https://www.linkedin.com/in/sanyam-mujavadia-88819328a/" target="_blank" rel="noreferrer">LinkedIn Profile</a></p>
      <p>GitHub: <a href="https://github.com/Sanyam0786" target="_blank" rel="noreferrer">GitHub Profile</a></p>
      <p>WhatsApp: <a href="https://wa.me/917861961399" target="_blank" rel="noreferrer">WhatsApp Chat</a></p>
    </footer>
  </div>`

  // Update dist/index.html with crawlable static body
  const updatedHomeHtml = baseHtml.replace('<div id="root"></div>', homeStaticContent)
  fs.writeFileSync(indexPath, updatedHomeHtml, 'utf-8')
  console.log('[prerender] Updated: dist/index.html with crawlable semantic markup')

  // 1. Prerender active projects
  const activeProjects = [
    {
      id: 'kyora-iq',
      title: 'Kyora IQ',
      role: 'React Native Developer',
      description: 'A service marketplace app connecting users with cybersecurity and cloud experts, featuring real-time chat, booking workflows, and role-based experiences built with React Native.',
      tags: ['React Native', 'TypeScript', 'Firebase', 'Realtime', 'Dark Mode'],
      appStoreUrl: 'https://apps.apple.com/us/app/kyora-iq/id6749854798',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.cyberboss'
    }
  ]

  for (const project of activeProjects) {
    const projectDir = path.join(distDir, 'projects', project.id)
    fs.mkdirSync(projectDir, { recursive: true })

    const projectCanonical = `https://sanyammujavadia.netlify.app/projects/${project.id}`
    const projectTitle = `${project.title} — React Native Case Study | Sanyam Mujavadia`
    const projectDesc = project.description

    const projectSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': `${projectCanonical}#software`,
          'name': project.title,
          'operatingSystem': 'iOS, Android',
          'applicationCategory': 'BusinessApplication',
          'description': project.description,
          'url': projectCanonical,
          'author': {
            '@type': 'Person',
            '@id': 'https://sanyammujavadia.netlify.app/#person',
            'name': 'Sanyam Mujavadia',
            'url': 'https://sanyammujavadia.netlify.app/'
          },
          'creator': {
            '@type': 'Person',
            'name': 'Sanyam Mujavadia'
          },
          'downloadUrl': [project.appStoreUrl, project.playStoreUrl].filter(Boolean)
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${projectCanonical}#breadcrumb`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sanyammujavadia.netlify.app/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Projects',
              'item': 'https://sanyammujavadia.netlify.app/#projects'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': project.title,
              'item': projectCanonical
            }
          ]
        }
      ]
    }

    const projectStaticContent = `
  <div id="root">
    <nav><a href="/">← Back to Portfolio</a></nav>
    <main>
      <article>
        <header>
          <p>${project.role} Case Study</p>
          <h1>${project.title} — React Native Case Study | Sanyam Mujavadia</h1>
          <p>${project.description}</p>
        </header>
        <section>
          <h2>Role &amp; Responsibilities</h2>
          <p>${project.role} building cross-platform iOS and Android applications.</p>
        </section>
        <section>
          <h2>Technologies Used</h2>
          <ul>
            ${project.tags.map(t => `<li>${t}</li>`).join('\n            ')}
          </ul>
        </section>
        <section>
          <h2>Store Downloads</h2>
          <p><a href="${project.appStoreUrl}" target="_blank" rel="noopener noreferrer">Download on Apple App Store</a></p>
          <p><a href="${project.playStoreUrl}" target="_blank" rel="noopener noreferrer">Get it on Google Play Store</a></p>
        </section>
      </article>
    </main>
  </div>`

    let projectHtml = baseHtml
      // Replace Root with crawlable static content
      .replace('<div id="root"></div>', projectStaticContent)
      // Replace Title
      .replace(
        /<title>.*?<\/title>/i,
        `<title>${projectTitle}</title>`
      )
      .replace(
        /<meta name="title" content=".*?" \/>/i,
        `<meta name="title" content="${projectTitle}" />`
      )
      // Replace Description
      .replace(
        /<meta name="description"[\s\S]*?content=".*?" \/>/i,
        `<meta name="description" content="${projectDesc}" />`
      )
      // Replace Canonical
      .replace(
        /<link rel="canonical" href=".*?" \/>/i,
        `<link rel="canonical" href="${projectCanonical}" />`
      )
      // Replace Open Graph
      .replace(
        /<meta property="og:title" content=".*?" \/>/i,
        `<meta property="og:title" content="${projectTitle}" />`
      )
      .replace(
        /<meta property="og:description"[\s\S]*?content=".*?" \/>/i,
        `<meta property="og:description" content="${projectDesc}" />`
      )
      .replace(
        /<meta property="og:url" content=".*?" \/>/i,
        `<meta property="og:url" content="${projectCanonical}" />`
      )
      // Replace Twitter
      .replace(
        /<meta name="twitter:title" content=".*?" \/>/i,
        `<meta name="twitter:title" content="${projectTitle}" />`
      )
      .replace(
        /<meta name="twitter:description"[\s\S]*?content=".*?" \/>/i,
        `<meta name="twitter:description" content="${projectDesc}" />`
      )
      .replace(
        /<meta name="twitter:url" content=".*?" \/>/i,
        `<meta name="twitter:url" content="${projectCanonical}" />`
      )
      // Replace Structured Data Schema with project-specific software schema
      .replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
        `<script type="application/ld+json">\n  ${JSON.stringify(projectSchema, null, 2)}\n  </script>`
      )

    fs.writeFileSync(path.join(projectDir, 'index.html'), projectHtml, 'utf-8')
    console.log(`[prerender] Generated: dist/projects/${project.id}/index.html`)
  }

  // 2. Generate on-brand 404.html
  const notFoundStaticContent = `
  <div id="root">
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: Inter, sans-serif; text-align: center; padding: 24px; background: #0b0f19; color: #f8fafc;">
      <div style="max-width: 420px; padding: 40px; border-radius: 24px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
        <p style="font-size: 14px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">404 • Not Found</p>
        <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 12px; color: #ffffff;">Page Not Found</h1>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">The page or project you're looking for doesn't exist or has moved.</p>
        <a href="/" style="display: inline-block; padding: 12px 24px; border-radius: 12px; background: #ffffff; color: #0f172a; font-size: 14px; font-weight: 600; text-decoration: none;">← Back to Portfolio</a>
      </div>
    </div>
  </div>`

  const notFoundHtml = baseHtml
    .replace('<div id="root"></div>', notFoundStaticContent)
    .replace(
      /<title>.*?<\/title>/i,
      '<title>404: Page Not Found — Sanyam Mujavadia</title>'
    )
    .replace(
      /<meta name="title" content=".*?" \/>/i,
      '<meta name="title" content="404: Page Not Found — Sanyam Mujavadia" />'
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/i,
      '<meta name="robots" content="noindex, nofollow" />'
    )

  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8')
  console.log('[prerender] Generated: dist/404.html')

  console.log('[prerender] Static HTML prerendering completed successfully.')
}

prerender().catch((err) => {
  console.error('[prerender] Fatal error:', err)
  process.exit(1)
})
