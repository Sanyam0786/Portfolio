# Crafted Portfolio

A handcrafted, interactive portfolio built with Vite + React, Tailwind CSS, and Framer Motion. Designed for a React Native developer who wants a minimal, highly interactive site.

## Quick start

Install deps:

```bash
cd myportfolio
npm install
```

Run dev:

```bash
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Structure

- `src/` — React source
- `data/` — centralized content for projects, experience, education, contact

Update content in `/data` rather than changing UI code.

## Notes

- Tailwind is configured; adjust `tailwind.config.cjs` for theme tokens
- Add real images to `src/assets` and reference them in `/data/projects.js`
- Consider replacing simple gradients with short MP4 previews for mobile app showcases
