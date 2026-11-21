import fs from 'fs'
import path from 'path'

const distDir = path.resolve('dist')

console.log('=== SEO & PRERENDER VALIDATION AUDIT ===\n')

let allPassed = true

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`)
  } else {
    console.error(`[FAIL] ${message}`)
    allPassed = false
  }
}

// 1. Check critical files exist in dist
const filesToCheck = [
  'index.html',
  'projects/kyora-iq/index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'llms-full.txt',
  '_redirects'
]

for (const f of filesToCheck) {
  assert(fs.existsSync(path.join(distDir, f)), `File exists: dist/${f}`)
}

// 2. Validate dist/index.html
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')
assert(indexHtml.includes('<title>Sanyam Mujavadia — React Native & Web Developer Portfolio</title>'), 'Homepage has correct Title')
assert(indexHtml.includes('<link rel="canonical" href="https://sanyammujavadia.netlify.app/" />'), 'Homepage canonical URL is set with trailing slash')
assert(indexHtml.includes('https://sanyammujavadia.netlify.app/og-image.png'), 'Homepage has OG image')
assert(indexHtml.includes('Hi, I\'m Sanyam Mujavadia'), 'Homepage visible H1 includes developer name')

// Validate JSON-LD in index.html
const indexJsonMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
assert(Boolean(indexJsonMatch), 'Homepage contains JSON-LD structured data block')
if (indexJsonMatch) {
  try {
    const data = JSON.parse(indexJsonMatch[1])
    assert(data['@context'] === 'https://schema.org', 'Homepage JSON-LD has valid context')
    assert(Array.isArray(data['@graph']), 'Homepage JSON-LD has @graph array')
    const types = data['@graph'].map(node => node['@type'])
    assert(types.includes('Person'), 'Homepage JSON-LD includes Person schema')
    assert(types.includes('WebSite'), 'Homepage JSON-LD includes WebSite schema')
    assert(types.includes('ProfilePage'), 'Homepage JSON-LD includes ProfilePage schema')
  } catch (err) {
    assert(false, `Homepage JSON-LD parsing error: ${err.message}`)
  }
}

// 3. Validate dist/projects/kyora-iq/index.html
const kyoraHtml = fs.readFileSync(path.join(distDir, 'projects/kyora-iq/index.html'), 'utf-8')
assert(kyoraHtml.includes('<title>Kyora IQ — React Native Case Study | Sanyam Mujavadia</title>'), 'Kyora IQ page has unique Title')
assert(kyoraHtml.includes('<link rel="canonical" href="https://sanyammujavadia.netlify.app/projects/kyora-iq" />'), 'Kyora IQ page has distinct Canonical URL')
assert(kyoraHtml.includes('<meta property="og:title" content="Kyora IQ — React Native Case Study | Sanyam Mujavadia" />'), 'Kyora IQ page has distinct OG Title')

const kyoraJsonMatch = kyoraHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
assert(Boolean(kyoraJsonMatch), 'Kyora IQ contains JSON-LD structured data')
if (kyoraJsonMatch) {
  try {
    const data = JSON.parse(kyoraJsonMatch[1])
    assert(data['@context'] === 'https://schema.org', 'Kyora IQ JSON-LD has valid context')
    const types = data['@graph'].map(node => node['@type'])
    assert(types.includes('SoftwareApplication'), 'Kyora IQ JSON-LD includes SoftwareApplication schema')
    assert(types.includes('BreadcrumbList'), 'Kyora IQ JSON-LD includes BreadcrumbList schema')
  } catch (err) {
    assert(false, `Kyora IQ JSON-LD parsing error: ${err.message}`)
  }
}

// 4. Validate robots.txt
const robotsTxt = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf-8')
assert(robotsTxt.includes('Sitemap: https://sanyammujavadia.netlify.app/sitemap.xml'), 'robots.txt references valid sitemap')
assert(robotsTxt.includes('User-agent: Googlebot'), 'robots.txt allows Googlebot')
assert(robotsTxt.includes('User-agent: OAI-SearchBot'), 'robots.txt allows OAI-SearchBot')
assert(robotsTxt.includes('User-agent: PerplexityBot'), 'robots.txt allows PerplexityBot')
assert(robotsTxt.includes('User-agent: ClaudeBot'), 'robots.txt allows ClaudeBot')

// 5. Validate sitemap.xml
const sitemapXml = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf-8')
assert(sitemapXml.includes('https://sanyammujavadia.netlify.app/'), 'sitemap.xml includes homepage')
assert(sitemapXml.includes('https://sanyammujavadia.netlify.app/projects/kyora-iq'), 'sitemap.xml includes Kyora IQ case study')
assert(sitemapXml.includes('<lastmod>2026-11-21</lastmod>'), 'sitemap.xml uses current lastmod date')

// 6. Validate 404.html
const notFoundHtml = fs.readFileSync(path.join(distDir, '404.html'), 'utf-8')
assert(notFoundHtml.includes('<title>404: Page Not Found — Sanyam Mujavadia</title>'), '404.html has distinct 404 Title')
assert(notFoundHtml.includes('noindex, nofollow'), '404.html includes noindex, nofollow meta tag')

// 7. Validate llms.txt & llms-full.txt
const llmsTxt = fs.readFileSync(path.join(distDir, 'llms.txt'), 'utf-8')
assert(llmsTxt.includes('Sanyam Mujavadia'), 'llms.txt contains developer name')
assert(llmsTxt.includes('React Native'), 'llms.txt outlines core skills')
assert(llmsTxt.includes('Kyora IQ'), 'llms.txt references key projects')

const llmsFullTxt = fs.readFileSync(path.join(distDir, 'llms-full.txt'), 'utf-8')
assert(llmsFullTxt.includes('Kyora IQ — Cybersecurity & Cloud Consulting Platform'), 'llms-full.txt contains detailed case study')
assert(llmsFullTxt.includes('Silversky Technology'), 'llms-full.txt outlines experience')

console.log(`\n=== SUMMARY: ${allPassed ? 'ALL AUDIT CHECKS PASSED (100%)' : 'SOME CHECKS FAILED'} ===`)
process.exit(allPassed ? 0 : 1)
