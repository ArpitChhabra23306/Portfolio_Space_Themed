# Implementation Plan: Portfolio Website

## Overview

Build a dark, cinematic personal portfolio for Arpit Chhabra using Next.js 14 (App Router, JavaScript), Tailwind CSS, Framer Motion, and shadcn/ui. The site is a single-page-feel application with static JSON/MDX content, Route Handlers for external stats/blog aggregation (ISR-cached), and EmailJS for contact. Deployed to Vercel with no database, no auth, no CMS.

## Tasks

- [x] 1. Project setup, configuration, and shared primitives
  - [x] 1.1 Initialize Next.js 14 project with App Router, Tailwind CSS, Framer Motion, and shadcn/ui
    - Create Next.js 14 app with JavaScript (no TypeScript)
    - Install dependencies: tailwindcss, framer-motion, @radix-ui primitives, shadcn/ui, @next/third-parties, next-mdx-remote, rss-parser
    - Configure `tailwind.config.js` with custom color tokens (ink, glass, accent, text), typography scale, and font families
    - Configure `next.config.js` with `NEXT_PUBLIC_SITE_URL` build-time validation
    - Set up `next/font/google` for Geist Sans, Newsreader italic, JetBrains Mono
    - Create `.env.example` with all env vars from D-13
    - _Requirements: D-01, D-11, D-13_

  - [x] 1.2 Create content directory structure and static data files
    - Create `content/` directory with `about.mdx`, `skills.json`, `experience.json`, `education.json`, `achievements.json`, `certifications.json`
    - Create `content/projects/` directory with sample MDX project files (3-5 pinned projects)
    - Add resume PDF to `public/resume/Arpit-Chhabra-Resume.pdf`
    - Add static OG image to `public/og.png` (1200×630)
    - _Requirements: D-02, D-05, 14.7_

  - [x] 1.3 Create content loading library (`lib/content.js`)
    - Implement `readJson(path)` helper for JSON content files
    - Implement `readMdx(path)` helper using next-mdx-remote for MDX files
    - Implement `getProjects()` that reads all `content/projects/*.mdx` and returns sorted array
    - Implement `getProjectBySlug(slug)` that reads a single project MDX file
    - _Requirements: D-02, 5.2_

  - [x] 1.4 Create shared animation primitives
    - Create `components/shared/animations/FadeIn.jsx` — viewport-triggered opacity fade
    - Create `components/shared/animations/SlideIn.jsx` — viewport-triggered translate + fade
    - Create `components/shared/animations/Stagger.jsx` — sequential reveal of children
    - Create `components/shared/animations/Reveal.jsx` — generic viewport-entry reveal wrapper
    - Create `components/shared/animations/RevealText.jsx` — word/char clip-mask text reveal
    - Create `components/shared/animations/Parallax.jsx` — scroll-linked Y-translate
    - Create `components/shared/animations/Tilt3D.jsx` — mouse-tracked 3D rotation
    - Create `components/shared/animations/MotionGuard.jsx` — reduced-motion gating wrapper
    - Create `lib/motion.js` with shared easings, durations, stagger values, and `isReducedMotion()` helper
    - All animations must respect `prefers-reduced-motion: reduce`
    - _Requirements: 16.5, 16.6, D-15_

  - [x] 1.5 Create shared UI primitives
    - Create `components/shared/Section.jsx` — `<section id>` wrapper with consistent padding
    - Create `components/shared/SectionHeading.jsx` — `<h2>` with reveal animation + serif accent
    - Create `components/shared/GlassCard.jsx` — glass surface with noise overlay and hover glow
    - Create `components/shared/BentoGrid.jsx` — asymmetric CSS grid layout
    - Create `components/shared/KPI.jsx` — dashboard-style numeric display with ring
    - Create `components/shared/Pill.jsx` — glass pill for nav, CTAs, chips
    - Create `components/shared/NoiseOverlay.jsx` — film-grain SVG noise overlay
    - _Requirements: D-11_

- [x] 2. Site shell, navigation, and layout
  - [x] 2.1 Create root layout (`app/layout.js`)
    - Set up fonts (Geist Sans, Newsreader, JetBrains Mono) via `next/font/google`
    - Add JSON-LD Person structured data via `lib/seo.js`
    - Conditionally render GA4 via `@next/third-parties` when `NEXT_PUBLIC_GA_ID` is set
    - Include Nav, Footer, ReadingProgressBar, BackToTop components
    - Add `<html>` with `data-theme` attribute, inline `<script>` for theme bootstrap (try/catch wrapped)
    - _Requirements: 1.1, 14.1, 16.8, 16.9, 13.2_

  - [x] 2.2 Create navigation component with mobile menu
    - Build floating glass-pill `<nav aria-label="Primary">` with anchor links for all sections
    - Implement `aria-current="location"` based on Intersection Observer scroll tracking
    - Build responsive collapsible mobile menu (below 768px) with `aria-label="Open navigation menu"` button
    - Include theme toggle button slot
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

  - [x] 2.3 Create footer, reading progress bar, and back-to-top button
    - Build footer with Owner's name, copyright year, GitHub/LinkedIn/email links, "Built with Next.js" attribution
    - Build `ReadingProgressBar` as a `<motion.div>` scaled by `scrollYProgress`, fixed top edge
    - Build `BackToTop` floating button visible after 600px scroll, smooth scroll (instant if reduced-motion)
    - _Requirements: 1.6, 1.7, 1.8_

  - [ ]* 2.4 Write unit tests for navigation scroll tracking and theme bootstrap
    - Test `aria-current` updates on scroll position changes
    - Test mobile menu toggle behavior
    - Test reading progress bar scales correctly
    - _Requirements: 1.4, 1.5, 1.8_

- [x] 3. Hero and About sections
  - [x] 3.1 Implement Hero section
    - Create `components/sections/hero/Hero.jsx` as the main section component
    - Render Owner's full name as the only `<h1>` on the page
    - Render static tagline as `<p>` below h1
    - Create `RoleSwitcher.jsx` — typed role cycling animation (client component)
    - Render full role list in a visually hidden `<span>` for ATS
    - Create "Download CV" CTA button linking to `/resume/Arpit-Chhabra-Resume.pdf`
    - Render social links with `rel="me noopener"` and accessible labels
    - Create `ScrollCue.jsx` — scroll indicator at bottom
    - Create `GradientBackdrop.jsx` — animated background (dynamic import, `ssr: false`)
    - Respect `prefers-reduced-motion`: static background, no role animation
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

  - [x] 3.2 Implement About section
    - Create `components/sections/about/About.jsx` loading content from `content/about.mdx`
    - Render `<h2>` heading "About"
    - Render Owner photo via `next/image` with explicit width/height/alt
    - Render intro paragraph, values, fun-facts, "Currently learning" as semantic HTML
    - Create `AvailableForHirePill.jsx` — sticky corner pill with pulsing green dot when `openToWork: true`
    - Render "Open to work" badge with `role="status"` when flag is true
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 3.3 Implement terminal intro animation
    - Create `TerminalIntro.jsx` — types fake shell commands, then reveals hero content
    - Skip animation entirely when `prefers-reduced-motion: reduce`, render hero immediately
    - _Requirements: 16.7_

- [x] 4. Skills and Projects sections
  - [x] 4.1 Implement Skills section
    - Create `components/sections/skills/Skills.jsx` loading from `content/skills.json`
    - Render `<h2>` heading "Skills & Tech Stack"
    - Create `CategoryTabs.jsx` — tab buttons for each category
    - Create `SkillTile.jsx` — glass tile with icon, name, proficiency text, and animated ring/bar
    - Create `SkillRing.jsx` — radial progress indicator (Familiar=33%, Proficient=66%, Advanced=92%)
    - Animate ring from 0 to fill on viewport entry
    - Create `SkillFilter.jsx` — free-text filter input, case-insensitive substring match
    - Render tooltip on hover/focus showing name, proficiency, years of experience
    - Ensure all skill names and proficiency levels are plain text in server-rendered HTML
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [x] 4.2 Implement Projects section
    - Create `components/sections/projects/Projects.jsx` loading from `content/projects/*.mdx`
    - Render `<h2>` heading "Projects"
    - Create `FeaturedProjectCard.jsx` — full-width cinematic card for featured project
    - Create `ProjectCard.jsx` — standard card with Tilt3D, title, summary, tech badges, links, media
    - Implement pinned project logic: 3-5 pinned, sorted by order, featured on top
    - Implement hover/focus media preview: play GIF/video on hover, pause/reset on leave
    - Render Problem/Solution/Impact as semantic HTML (`<dt>`/`<dd>` pairs)
    - Create `ProjectFilters.jsx` — tech-stack and domain filter pills
    - Render "View all projects" link to `/projects`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

  - [x] 4.3 Create project detail pages (`app/projects/page.js` and `app/projects/[slug]/page.js`)
    - Build `/projects` index page listing all projects (not just pinned)
    - Build `/projects/[slug]` detail page with full MDX body and JSON-LD `CreativeWork`
    - Implement `generateMetadata()` for per-route title, description, OG tags
    - _Requirements: 5.10, 14.2, 14.6_

  - [ ]* 4.4 Write unit tests for content loading and project filtering
    - Test `getProjects()` returns correctly sorted pinned projects
    - Test `getProjectBySlug()` returns expected shape
    - Test skill filter narrows results by substring
    - Test category tab filtering
    - _Requirements: 4.6, 4.7, 5.3_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Experience, Education, and Achievements sections
  - [x] 6.1 Implement Experience section
    - Create `components/sections/experience/Experience.jsx` loading from `content/experience.json`
    - Render `<h2>` heading "Experience"
    - Create `TimelineSpine.jsx` — SVG vertical line with `pathLength` draw-in animation
    - Create `ExperienceCard.jsx` — `<article>` with role, org, location, bullets, tags
    - Sort entries by endDate descending, null (current) first
    - Render dates in `<time datetime="...">` with human-readable label
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 6.2 Implement Education section
    - Create `components/sections/education/Education.jsx` loading from `content/education.json`
    - Render `<h2>` heading "Education"
    - Create `EducationCard.jsx` — glass card with degree, institution, location, dates, CGPA, coursework
    - Render coursework as `<ul><li>` list
    - Handle "Expected {year}" for null endDate
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 6.3 Implement Achievements section
    - Create `components/sections/achievements/Achievements.jsx` loading from `content/achievements.json`
    - Render `<h2>` heading "Achievements"
    - Create `CounterTile.jsx` — animated 0→metric counter (1500ms) on viewport entry
    - Render final metric value as plain text in server-rendered HTML
    - Group achievements by category
    - Create `StatsKPI.jsx` — KPI widgets for LeetCode, Codeforces, GitHub stats
    - Create `TrophyShelf.jsx` — row for hackathon ranks
    - Render skeleton during fetch, fallback "data unavailable" panel with `role="status"` on failure
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.8_

  - [x] 6.4 Implement GitHub heatmap and LeetCode calendar widgets
    - Create `GitHubHeatmap.jsx` — contribution heatmap (dynamic import, `ssr: false`)
    - Create `LeetCodeCalendar.jsx` — submission activity calendar (dynamic import, `ssr: false`)
    - Each day cell has `aria-label` with contribution/submission count
    - Render fallback panel on fetch failure
    - _Requirements: 8.6, 8.7, 8.8_

- [x] 7. Stats and Blogs API Route Handlers
  - [x] 7.1 Implement stats API route handlers
    - Create `app/api/stats/leetcode/route.js` — fetch LeetCode GraphQL, return normalized stats
    - Create `app/api/stats/codeforces/route.js` — fetch Codeforces REST API, return normalized stats
    - Create `app/api/stats/github/route.js` — fetch GitHub REST + GraphQL, return normalized stats
    - Create `lib/stats/leetcode.js`, `lib/stats/codeforces.js`, `lib/stats/github.js` normalizers
    - All handlers: ISR `revalidate: 3600`, 5s timeout via AbortController
    - Graceful degradation: missing env → zeroed response, upstream failure → `{ ok: false, stale: true }`
    - Never expose env var values in responses
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [x] 7.2 Implement blogs API route handler
    - Create `app/api/blogs/route.js` — aggregate posts from Dev.to, Hashnode, Medium
    - Create `lib/blogs/devto.js` — Dev.to REST fetch + normalize
    - Create `lib/blogs/hashnode.js` — Hashnode GraphQL fetch + normalize
    - Create `lib/blogs/medium.js` — Medium RSS parse + normalize (strip HTML from excerpts)
    - Per-source cap: 10 most recent, total cap: 30, excerpt ≤ 280 chars, tags ≤ 5
    - 5s timeout per source via AbortController, failed source → omit + `partial: true`
    - Sort merged set by `publishedAt` desc, ISR `revalidate: 3600`
    - _Requirements: 10.2, 10.3, 10.4, 10.5_

  - [ ]* 7.3 Write unit tests for stats and blog normalizers
    - Test each stats normalizer transforms raw JSON into documented response shape
    - Test blog normalizers produce correct `{ source, title, url, excerpt, publishedAt, tags, coverImageUrl }` shape
    - Test edge cases: empty arrays, missing fields, HTML stripping
    - _Requirements: 15.1, 15.2, 15.3, 10.2_

  - [ ]* 7.4 Write integration tests for API route handlers (Vitest + MSW)
    - Mock upstream APIs with MSW
    - Test successful responses return `{ ok: true, stale: false, ...data }`
    - Test timeout/error responses return `{ ok: false, stale: true }` with zeroed data
    - Test `/api/blogs` partial failure returns remaining posts with `partial: true`
    - Test env var absence returns graceful zeroed response
    - _Requirements: 15.5, 10.4, 10.5_

- [x] 8. Certifications, Blogs, Resume, and Contact sections
  - [x] 8.1 Implement Certifications section
    - Create `components/sections/certifications/Certifications.jsx` loading from `content/certifications.json`
    - Render `<h2>` heading "Certifications"
    - Create `CertificationFlipCard.jsx` — CSS 3D flip card with front (name, logo) and back (details, verify link)
    - Both faces rendered in DOM (no `display: none`), CSS `backface-visibility: hidden` for visual flip only
    - Toggle flip on click/keyboard (Enter/Space), update `aria-pressed`
    - Render JSON-LD `EducationalOccupationalCredential` per cert via `lib/seo.js`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 8.2 Implement Blogs section
    - Create `components/sections/blogs/Blogs.jsx` fetching from `/api/blogs`
    - Render `<h2>` heading "Writing"
    - Create `BlogCard.jsx` — glass card with title (link, `rel="noopener"`), source badge, excerpt, date in `<time>`, tags
    - Create `LoadMore.jsx` — client-side pagination showing 9 initially, load more from fetched set
    - Render empty state "No posts available" when posts array is empty
    - _Requirements: 10.1, 10.6, 10.7_

  - [x] 8.3 Implement Resume section
    - Create `components/sections/resume/Resume.jsx`
    - Render `<h2>` heading "Resume"
    - Create `PdfFrame.jsx` — `<iframe>` PDF viewer with `aria-label="Resume PDF"`, fallback `<a>` link
    - Render "Download" button with `download` attribute
    - Create `ResumeMirror.jsx` — ATS HTML mirror in `<section aria-label="Resume content">` with semantic headings and lists
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [x] 8.4 Implement Contact section
    - Create `components/sections/contact/Contact.jsx`
    - Render `<h2>` heading "Contact"
    - Create `ContactForm.jsx` — form with name, email, subject, message (all required)
    - Each field: associated `<label>`, `aria-describedby` error container, `aria-invalid` state
    - Create `lib/emailjs.js` — client-side EmailJS init + send wrapper
    - On submit: validate, send via EmailJS SDK, show success (`role="status"`) + reset, or error (`role="alert"`) + preserve values
    - In-flight state: disabled submit + spinner
    - Create `SocialsGrid.jsx` — social links, availability badge, location/timezone
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

  - [ ]* 8.5 Write component tests for Contact form and Certifications flip cards
    - Test form validation, success/error state rendering, form reset, value preservation
    - Test flip card `aria-pressed` toggles on click/keyboard
    - _Requirements: 12.3, 12.5, 12.6, 9.5_

- [x] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Extras, SEO, and performance optimization
  - [x] 10.1 Implement theme toggle and extras
    - Create `components/sections/extras/ThemeToggle.jsx` — sun/moon button with `aria-label="Toggle color theme"`
    - Implement inline `<head>` script for theme bootstrap (try/catch, localStorage → prefers-color-scheme fallback)
    - On toggle: update `localStorage.theme` + `data-theme` on `<html>`, no page reload
    - Create `CustomCursor.jsx` — glowing dot + ring (dynamic import, `ssr: false`), skip on touch/reduced-motion
    - Create `KonamiOverlay.jsx` — Konami code listener + overlay toggle (dynamic import, `ssr: false`)
    - Preserve native cursor on interactive elements (`<a>`, `<button>`, form controls)
    - Disable custom cursor and Konami animation when `prefers-reduced-motion: reduce`
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

  - [x] 10.2 Implement SEO utilities and metadata
    - Create `lib/seo.js` with `buildPersonLD()`, `buildCreativeWorkLD(project)`, `buildCredentialLD(cert)` builders
    - Create `app/sitemap.js` — generates sitemap.xml with `/`, `/projects`, all `/projects/[slug]`
    - Create `app/robots.js` — generates robots.txt allowing all agents, referencing sitemap
    - Create `app/not-found.js` — custom 404 page
    - Implement `generateMetadata()` in home route and project routes (title ≤60, description ≤160, OG, Twitter card)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

  - [ ]* 10.3 Write unit tests for SEO builders
    - Test `buildPersonLD()` output conforms to schema.org Person expectations
    - Test `buildCreativeWorkLD(project)` output contains required fields
    - Test `buildCredentialLD(cert)` output matches EducationalOccupationalCredential shape
    - _Requirements: 14.1, 14.2, 14.3_

- [ ] 11. Final wiring and integration
  - [x] 11.1 Compose home page (`app/page.js`)
    - Import and render all section components in order: Hero, About, Skills, Projects, Experience, Education, Achievements, Certifications, Blogs, Resume, Contact
    - Ensure single `<h1>`, sequential heading levels, no skipped levels
    - Apply staggered entrance animations via shared primitives
    - _Requirements: 1.1, 16.3, 16.6_

  - [-] 11.2 Performance optimization pass
    - Verify all non-decorative images use `next/image` with explicit width/height/alt
    - Set `priority` on hero photo and project posters
    - Verify dynamic imports with `ssr: false` for: GradientBackdrop, CustomCursor, KonamiOverlay, GitHubHeatmap, LeetCodeCalendar
    - Verify fonts use `display: swap` and are subsetted to Latin
    - Verify keyboard reachability for nav, flip cards, tabs, filters, mobile menu
    - Verify visible focus indicators (`focus-visible:ring-2 ring-accent-ember`)
    - _Requirements: 16.1, 16.2, 16.4, 16.5_

  - [-] 11.3 Accessibility and final integration review
    - Verify `aria-current="location"` updates correctly on scroll
    - Verify all form controls have labels, `aria-describedby`, `aria-invalid`
    - Verify heatmap/calendar cells have `aria-label` with counts
    - Verify smooth scroll behavior (instant when reduced-motion)
    - Verify color contrast meets WCAG AA (19:1 primary, 9:1 muted)
    - _Requirements: 16.1, 16.4, 1.3, 1.7, D-10_

- [ ] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Unit tests validate specific examples and edge cases
- Integration tests validate API route handler behavior with mocked upstream services
- Property-based testing is explicitly out of scope per D-12
- All animations must respect `prefers-reduced-motion: reduce` (D-15)
- Content is static JSON/MDX — no runtime content fetching, errors surface as build failures

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "3.1", "3.2", "3.3"] },
    { "id": 3, "tasks": ["2.4", "4.1", "4.2", "4.3", "6.1", "6.2"] },
    { "id": 4, "tasks": ["4.4", "6.3", "6.4", "7.1", "7.2"] },
    { "id": 5, "tasks": ["7.3", "7.4", "8.1", "8.2", "8.3", "8.4"] },
    { "id": 6, "tasks": ["8.5", "10.1", "10.2"] },
    { "id": 7, "tasks": ["10.3", "11.1"] },
    { "id": 8, "tasks": ["11.2", "11.3"] }
  ]
}
```
