# Design Document

## Overview

A dark, cinematic personal portfolio for Arpit Chhabra. Single Next.js 14 (App Router, JavaScript) deploy on Vercel. Content is static JSON/MDX in `content/`; backend is a handful of Route Handlers for live stats and blog aggregation, all ISR-cached. Contact uses EmailJS in the browser. No DB, no auth, no CMS.

The visual language is **dark + bold + glassy + editorial**, inspired by Prisma and Reticia: pure black base, glass tiles in bento grids, brutalist sans paired with italicized serif accents, scroll-linked parallax, 3D-tilting cards, and dashboard-style live data widgets.

## Architecture

### App Router layout

```
app/
  layout.js                  # root: fonts, theme bootstrap, GA4, JSON-LD Person, Nav, Footer, ProgressBar, BackToTop
  page.js                    # home: composes all section components in order
  not-found.js
  projects/
    page.js                  # /projects index — every project, not just pinned
    [slug]/page.js           # per-project detail + JSON-LD CreativeWork
  api/
    blogs/route.js
    stats/leetcode/route.js
    stats/codeforces/route.js
    stats/github/route.js
  sitemap.js                 # generates sitemap.xml
  robots.js                  # generates robots.txt

components/
  ui/                        # shadcn primitives (Button, Tabs, Tooltip, Dialog…)
  shared/
    Section.jsx              # <section id> wrapper with consistent rhythm
    SectionHeading.jsx       # h2 with sans+italic-serif mix + RevealText
    GlassCard.jsx            # base glass surface (bg-white/5, blur, border, inner highlight)
    BentoGrid.jsx            # asymmetric grid layout primitive
    KPI.jsx                  # glowing number + ring + label, dashboard style
    Pill.jsx                 # glass pill for nav, CTAs, chips
    NoiseOverlay.jsx         # film-grain SVG noise (low opacity)
    animations/
      FadeIn.jsx
      SlideIn.jsx
      Stagger.jsx
      Reveal.jsx             # generic viewport-entry reveal
      RevealText.jsx         # word/char clip-mask reveal
      Parallax.jsx           # useScroll + useTransform Y-translate
      Tilt3D.jsx             # mouse-tracked rotateX/rotateY tilt
      MotionGuard.jsx        # reduced-motion gating wrapper

  sections/
    hero/{Hero, RoleSwitcher, GradientBackdrop, ScrollCue, TerminalIntro}.jsx
    about/{About, AvailableForHirePill}.jsx
    skills/{Skills, SkillTile, SkillRing, CategoryTabs, SkillFilter}.jsx
    projects/{Projects, ProjectCard, FeaturedProjectCard, ProjectFilters, ProjectMedia}.jsx
    experience/{Experience, TimelineSpine, ExperienceCard}.jsx
    education/{Education, EducationCard}.jsx
    achievements/{Achievements, CounterTile, GitHubHeatmap, LeetCodeCalendar, TrophyShelf, StatsKPI}.jsx
    certifications/{Certifications, CertificationFlipCard}.jsx
    blogs/{Blogs, BlogCard, LoadMore}.jsx
    resume/{Resume, PdfFrame, ResumeMirror}.jsx
    contact/{Contact, ContactForm, SocialsGrid}.jsx
    extras/{ThemeToggle, KonamiOverlay, CustomCursor, ReadingProgressBar, BackToTop}.jsx

lib/
  content.js                 # readMdx, readJson helpers
  stats/{leetcode, codeforces, github}.js  # upstream fetchers + normalizers
  blogs/{devto, hashnode, medium}.js       # per-source fetchers
  emailjs.js                 # client-side init + send
  motion.js                  # easings, durations, reduced-motion helper
  seo.js                     # JSON-LD builders

content/
  about.mdx
  skills.json
  experience.json
  education.json
  achievements.json
  certifications.json
  projects/*.mdx
```

### RSC vs client boundaries

- **RSC by default.** Pages, sections, and data-loading happens server-side.
- **`"use client"` only for**: animated background (Framer Motion), RoleSwitcher, scroll/parallax wrappers, Tilt3D cards, project hover-preview, flip cards, theme toggle, custom cursor, Konami overlay, contact form (EmailJS SDK), tabs/filters with local state, the heatmap/calendar widgets.
- Heavy client components are dynamically imported with `ssr: false` to keep initial JS small (animated background, custom cursor, Konami overlay, GitHub heatmap, LeetCode calendar).

### Caching strategy

- Static content (`content/*`) is bundled at build time. No runtime fetch.
- Route Handlers use `export const revalidate = 3600` (ISR, 1 hour) for `/api/blogs` and all three `/api/stats/*` endpoints.
- Section components that consume API data fetch with `{ next: { revalidate: 3600 } }`.

### Env var map

| Var | Used in | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | layout.js, sitemap.js, JSON-LD | Absolute URLs for SEO |
| `NEXT_PUBLIC_GA_ID` | layout.js (`@next/third-parties`) | GA4 — only loads when set |
| `NEXT_PUBLIC_EMAILJS_*` (3) | contact/ContactForm.jsx | Browser SDK creds |
| `LEETCODE_USERNAME` | api/stats/leetcode | Upstream handle |
| `CODEFORCES_HANDLE` | api/stats/codeforces | Upstream handle |
| `GITHUB_USERNAME` (+ `GITHUB_TOKEN`*) | api/stats/github | Upstream handle (PAT for contribution calendar GraphQL) |

\* `GITHUB_TOKEN` is added because GitHub's contribution calendar is only available via authenticated GraphQL — see Risks.

## Components and Interfaces

### Section Components

Each section is a self-contained component under `components/sections/{name}/`:

| Component | Props | Responsibilities |
|---|---|---|
| `Hero` | — | Renders h1, tagline, RoleSwitcher, CTA, socials, scroll cue, animated background |
| `About` | — | Renders photo, intro copy, values, fun facts, "currently learning", openToWork badge |
| `Skills` | — | Renders category tabs, filter input, skill tiles with proficiency rings and tooltips |
| `Projects` | — | Renders featured card, pinned grid, tech/domain filters, "View all" link |
| `Experience` | — | Renders vertical timeline with alternating cards |
| `Education` | — | Renders education cards with coursework chips |
| `Achievements` | — | Renders counter tiles, heatmaps, calendars, KPI widgets, trophy shelf |
| `Certifications` | — | Renders flip cards with front/back content and JSON-LD |
| `Blogs` | — | Renders blog cards, source badges, "Load more" pagination |
| `Resume` | — | Renders PDF iframe, download button, ATS HTML mirror |
| `Contact` | — | Renders form (EmailJS), socials grid, availability badge |

### Shared Primitives

| Component | Interface | Purpose |
|---|---|---|
| `Section` | `{ id, children, className? }` | Wrapper providing consistent padding, `<section id>` semantics |
| `SectionHeading` | `{ children }` | `<h2>` with reveal animation + serif accent styling |
| `GlassCard` | `{ children, className?, hover? }` | Glass surface with noise overlay and optional hover glow |
| `BentoGrid` | `{ children, cols? }` | Asymmetric CSS grid layout |
| `KPI` | `{ value, label, ring? }` | Dashboard-style numeric display with optional ring |
| `Pill` | `{ children, variant? }` | Glass pill for nav items, CTAs, chips, badges |

### Animation Primitives

| Component | Interface | Purpose |
|---|---|---|
| `FadeIn` | `{ children, delay?, duration? }` | Viewport-triggered opacity fade |
| `SlideIn` | `{ children, direction?, delay? }` | Viewport-triggered translate + fade |
| `Stagger` | `{ children, stagger? }` | Sequential reveal of children |
| `Reveal` | `{ children }` | Generic viewport-entry reveal wrapper |
| `RevealText` | `{ children, by? }` | Word/char clip-mask text reveal |
| `Parallax` | `{ children, speed }` | Scroll-linked Y-translate |
| `Tilt3D` | `{ children, max? }` | Mouse-tracked 3D rotation with highlight |
| `MotionGuard` | `{ children }` | Reduced-motion gating — renders children at final state |

### API Route Handlers

| Endpoint | Method | Response Shape |
|---|---|---|
| `/api/blogs` | GET | `{ ok, stale, partial?, posts: BlogPost[] }` |
| `/api/stats/leetcode` | GET | `{ ok, stale, totalSolved, easy, medium, hard, ranking, submissionCalendar }` |
| `/api/stats/codeforces` | GET | `{ ok, stale, rating, maxRating, rank }` |
| `/api/stats/github` | GET | `{ ok, stale, publicRepos, followers, totalStars, contributionCalendar }` |

### Library Modules

| Module | Exports | Purpose |
|---|---|---|
| `lib/content.js` | `readMdx(path)`, `readJson(path)`, `getProjects()`, `getProjectBySlug(slug)` | Static content loading |
| `lib/stats/leetcode.js` | `fetchLeetCodeStats(username)` | Upstream fetch + normalize |
| `lib/stats/codeforces.js` | `fetchCodeforcesStats(handle)` | Upstream fetch + normalize |
| `lib/stats/github.js` | `fetchGitHubStats(username, token)` | Upstream fetch + normalize |
| `lib/blogs/devto.js` | `fetchDevToPosts(username)` | Dev.to REST fetch |
| `lib/blogs/hashnode.js` | `fetchHashnodePosts(slug)` | Hashnode GraphQL fetch |
| `lib/blogs/medium.js` | `fetchMediumPosts(username)` | Medium RSS parse |
| `lib/emailjs.js` | `sendEmail(payload)` | Client-side EmailJS wrapper |
| `lib/motion.js` | `ease`, `dur`, `stagger`, `isReducedMotion()` | Shared motion config |
| `lib/seo.js` | `buildPersonLD()`, `buildCreativeWorkLD(project)`, `buildCredentialLD(cert)` | JSON-LD builders |

## Data Models

### `content/about.mdx` (frontmatter)

```yaml
---
openToWork: true
location: "Una, India"
timezone: "Asia/Kolkata"
photo: "/images/arpit.jpg"
photoAlt: "Arpit Chhabra"
values: ["Ship fast", "Read the source", "Own the bug"]
funFacts: ["500+ DSA problems", "Self-taught Vim", "..."]
currentlyLearning: ["RAG architectures", "WebRTC scaling"]
---
{Body MDX — intro paragraph rendered as <p>, supports inline italic-serif spans.}
```

### `content/skills.json`

```json
{
  "categories": ["Frontend", "Backend", "DevOps", "Database", "Languages", "Tools"],
  "skills": [
    { "name": "React", "category": "Frontend", "icon": "react", "proficiency": "Advanced", "yearsOfExperience": 3 },
    { "name": "Node.js", "category": "Backend", "icon": "node", "proficiency": "Advanced", "yearsOfExperience": 3 }
  ]
}
```

Proficiency → ring fill: `Familiar=33`, `Proficient=66`, `Advanced=92`.

### `content/projects/<slug>.mdx`

```yaml
---
title: "MindClash"
slug: "mindclash"
summary: "Real-time AI-moderated debate platform."
problem: "..."
solution: "..."
impact: "..."
techStack: ["MongoDB", "Express", "React", "Node", "Socket.io", "Redis", "Gemini"]
domains: ["Real-time", "AI"]
liveUrl: "https://..."
repoUrl: "https://github.com/..."
mediaUrl: "/projects/mindclash.mp4"
mediaType: "video"          # image | gif | video
featured: true
pinned: true
order: 1
---
{Body MDX — extended write-up rendered on /projects/[slug].}
```

### `content/experience.json` / `education.json` / `achievements.json` / `certifications.json`

```json
// experience.json (array)
[{ "role": "Full Stack Intern", "org": "ModelSuite AI", "location": "Remote",
   "startDate": "2026-04-01", "endDate": null,
   "bullets": ["..."], "tags": ["MERN", "CI/CD"] }]

// education.json (array)
[{ "degree": "B.Tech IT", "institution": "IIIT Una", "location": "Una, India",
   "startDate": "2023-08-01", "endDate": null, "expected": 2027,
   "cgpa": 7.97, "coursework": ["DSA", "DBMS", "OS", "CN"] }]

// achievements.json (array, grouped at render time)
[{ "title": "National Road Safety Hackathon", "category": "Hackathon",
   "metric": 50, "metricLabel": "Top 50 of 5000+", "year": 2024 }]

// certifications.json (array)
[{ "name": "...", "issuer": "...", "issuerLogo": "/logos/x.svg",
   "issueDate": "2024-06-01", "expirationDate": null,
   "credentialId": "ABC-123", "verifyUrl": "https://..." }]
```

## API layer

All Route Handlers return a uniform envelope:

```json
{ "ok": true, "stale": false, /* …data fields… */ }
```

On upstream failure: `ok=false, stale=true`, last-good payload if cached, else zeroed fields. Always HTTP 200 so the client renders a graceful fallback.

### `GET /api/blogs`

- **Sources**: Dev.to REST (`https://dev.to/api/articles?username=…`), Hashnode GraphQL (`https://gql.hashnode.com`), Medium RSS (`https://medium.com/feed/@…`).
- **Per-source cap**: 10 most recent. **Total cap**: 30. **Excerpt**: ≤ 280 chars. **Tags**: ≤ 5.
- **Timeout**: 5 s per source via `AbortController`. Failed source → omit + `partial: true`.
- Sort merged set by `publishedAt` desc.
- ISR: `revalidate = 3600`.

### `GET /api/stats/leetcode`

- **Upstream**: `https://leetcode.com/graphql` with `userPublicProfile` + `userProblemsSolved` + `userProfileCalendar` queries.
- **Returns**: `totalSolved, easy, medium, hard, ranking, submissionCalendar` (object: ISO-date → count for trailing 12 months).

### `GET /api/stats/codeforces`

- **Upstream**: `https://codeforces.com/api/user.info?handles={CODEFORCES_HANDLE}`.
- **Returns**: `rating, maxRating, rank`.

### `GET /api/stats/github`

- **Upstream**: REST `/users/{user}` + `/users/{user}/repos?per_page=100&type=owner` (sum non-fork stars), GraphQL `contributionsCollection.contributionCalendar` (requires `GITHUB_TOKEN`).
- **Returns**: `publicRepos, followers, totalStars, contributionCalendar` (weeks → days[] with `date` + `count`).

### Failure semantics

```js
if (!envVarSet) return zeroed({ ok: false, stale: true });
try {
  const data = await fetchUpstream({ signal: timeout(5000) });
  return ok({ ok: true, stale: false, ...normalize(data) });
} catch {
  const cached = readIsrCache();
  return ok({ ok: false, stale: true, ...(cached ?? zeroed) });
}
```

Env var values are never echoed in response bodies, headers, or logs.

## External integrations

- **EmailJS**: SDK initialized once on the contact page (client). On submit: validate per R12.2, call `emailjs.send(serviceId, templateId, payload, { publicKey })`, render success/error per R12.7–8.
- **GA4**: `<GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />` from `@next/third-parties/google` in root layout, conditionally rendered only when the env var is set.
- **Stats**: thin per-source modules under `lib/stats/*` keep upstream specifics out of Route Handlers.

## Visual design system

### Color tokens (`tailwind.config.js` extension)

```js
colors: {
  ink: { 950: "#08080A", 900: "#0B0B0F", 800: "#111114" },
  glass: { surface: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.10)" },
  accent: {
    silver: "#C9CDD3",
    ember:  "#E8743C",   // cinematic orange
    violet: "#7C5CFF"
  },
  text: { primary: "#F5F5F7", muted: "#A1A1AA", dim: "#71717A" }
}
```

### Typography

- `next/font/google` loads **Geist Sans** (display + body), **Newsreader** italic (serif accent), **JetBrains Mono** (KPI numerals).
- Scale: `display` (clamp 56–112px, hero h1), `h2` (clamp 36–64px), `h3` (24–32px), body (16–18px).
- Heading recipe: `<h2 className="font-sans">Pro features. <em className="font-serif italic">Zero complexity.</em></h2>`

### Glass card recipe

```jsx
<div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10
                shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]
                hover:shadow-[0_0_60px_-20px_rgba(232,116,60,0.35)]
                transition-shadow">
  <NoiseOverlay />
  {children}
</div>
```

### Motion tokens (`lib/motion.js`)

```js
export const ease = [0.22, 1, 0.36, 1];      // cinematic out-cubic
export const dur = { quick: 0.3, base: 0.6, slow: 1.2 };
export const stagger = { fast: 0.05, base: 0.08, slow: 0.12 };
```

## Motion strategy

- **Parallax**: a `<Parallax speed={…}>` wrapper uses `useScroll({ target })` + `useTransform` to translate Y. Hero blob `speed=0.3`, foreground text `speed=0.8`.
- **Reveal text**: split heading by word, wrap each in `<span className="overflow-hidden inline-block"><motion.span initial={{y:'120%'}} whileInView={{y:0}} viewport={{once:true}} transition={…} /></span>`.
- **Tilt3D**: tracks pointer in card-local coordinates; clamps `rotateX`, `rotateY` to ±12°; springs back on leave; adds a CSS conic-gradient highlight that follows the pointer.
- **Reduced motion**: `MotionGuard` reads `useReducedMotion()` from Framer Motion; when true, children render without transform/opacity transitions, with elements at their final state.
- **Reading progress bar**: a `<motion.div style={{ scaleX }} />` where `scaleX = useScroll().scrollYProgress`.

## Section-by-section notes

- **Site shell (R1)**: Floating glass-pill nav, top center, ~720px wide. Reading-progress thin gradient bar pinned at top edge. Footer: glass divider + 3-column layout. Back-to-top glass icon button bottom-right after 600px scroll.
- **Hero (R2)**: Slow fluid mesh-gradient blob (canvas/CSS, `Parallax speed=0.3`). H1 huge brutalist sans; tagline italic serif accent. Optional terminal-intro types 2–3 fake commands then reveals. RoleSwitcher under tagline; static role list `sr-only`. Glass-pill CTA "Download CV" with ember glow on hover. Social row.
- **About (R3)**: Two-column on desktop. Photo with subtle glass frame + gradient ring. Copy mixes sans + italic serif inline. Available-for-hire pill = sticky bottom-right with pulsing green dot, anchored to Contact.
- **Skills (R4)**: Bento grid of glass tiles per active category. Each tile = icon top-left, animated radial ring (proficiency %), name + level text. Tooltip on hover/focus shows `{years} years`. Free-text filter pill in the header row.
- **Projects (R5)**: Featured project = full-width cinematic poster with media; bento grid of 2–4 below. All cards `Tilt3D`-wrapped. Hover: GIF/video plays, paused/reset on leave. Tech + domain filter pills.
- **Experience (R6)**: Vertical timeline with an SVG spine; `pathLength` draws in on viewport entry. Each entry = glass article card alternating sides on desktop. ISO `<time>` elements, "Present" for null end.
- **Education (R7)**: Two minimal glass cards. Coursework as chip pills.
- **Achievements (R8)**: Bento grid: counter tiles (animated 0 → metric over 1500ms), GitHub heatmap (full-width tile), LeetCode calendar tile, three KPI tiles (LeetCode totals, Codeforces rating, GitHub stars). Trophy shelf row for hackathon ranks. Each widget shows skeleton during fetch and a `role="status"` "data unavailable" panel on failure.
- **Certifications (R9)**: 3D-tilt flip cards. CSS-driven flip via `transform-style: preserve-3d` + `backface-visibility: hidden` on visual layer; both faces' DOM nodes remain present (no `display:none`/`visibility:hidden`/`aria-hidden`) so ATS reads both. `aria-pressed` toggles on activate.
- **Blogs (R10)**: Glass post cards in a 3-column grid. Source badge top-right. "Load more" reveals next 9.
- **Resume (R11)**: PDF in glass-framed `<iframe>`, min-height 600/400. Glass-pill Download. ATS HTML mirror (`<section aria-label="Resume content">` with `<h3>` + `<ul>`).
- **Contact (R12)**: Glass form panel center. Floating-label inputs. In-flight: disabled submit + ring spinner. Success: green status. Error: red alert preserving values. Socials grid + availability badge + location/timezone beside the form.
- **Extras (R13)**: Theme toggle = sun/moon glass icon button in nav, `data-theme` set via inline head script to prevent FOUC. Custom cursor = glowing dot + delayed ring (skip on touch + reduced-motion). Konami easter egg = full-screen subtle particle overlay with toggle.

## SEO & structured data (R14)

- **Person JSON-LD** in root `app/layout.js` via `<Script id="ld-person" type="application/ld+json">`.
- **CreativeWork JSON-LD** in `app/projects/[slug]/page.js`.
- **EducationalOccupationalCredential JSON-LD** rendered inside the Certifications section once per cert.
- **`app/sitemap.js`** emits absolute URLs for `/`, `/projects`, every `/projects/[slug]`.
- **`app/robots.js`** emits `User-agent: *`, `Allow: /`, `Sitemap: …`.
- **Metadata**: `generateMetadata()` per route sets title (≤60), description (≤160), OG, Twitter card. Static OG image at `/public/og.png` (1200×630).
- Build fails when `NEXT_PUBLIC_SITE_URL` is missing.

## Performance & accessibility

- All non-decorative images via `next/image` with explicit `width`/`height`/`alt`. Hero photo and project posters use `priority`.
- Fonts via `next/font` with `display: swap`, subsetted to Latin.
- Dynamic imports (`ssr: false`) for: `GradientBackdrop`, `CustomCursor`, `KonamiOverlay`, `GitHubHeatmap`, `LeetCodeCalendar`.
- Single `<h1>`, sequential heading levels, focus rings preserved (`focus-visible:ring-2 ring-accent-ember`), keyboard reachability for nav, flip cards, tabs, filters, mobile menu.
- Lighthouse mobile budget: Performance ≥ 95 (LCP < 2.5s on hero text — gradient blob is CSS, not an image), Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Contrast: text-primary `#F5F5F7` on `#08080A` ≈ 19:1; muted `#A1A1AA` on `#08080A` ≈ 9:1 — both pass AA Large + Normal.
- All motion gated by `prefers-reduced-motion`.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Note: Property-based testing is not applicable to this feature. Per locked decision D-12, PBT is explicitly out of scope. This is a statically-rendered portfolio website involving UI rendering, static content display, external API aggregation, and client-side form submission — none of which involve pure functions with large input spaces or universal properties that benefit from randomized testing. The single property below validates the one area with meaningful input variation: API error handling.

### Property 1: Stats API graceful degradation

*For any* upstream stats endpoint failure (timeout, non-2xx, missing env var), the Route Handler SHALL always return HTTP 200 with `{ ok: false, stale: true }` and never expose internal error details or env var values in the response body.

**Validates: Requirements 15.5, 15.6**

## Error Handling

### API Route Handlers

All Route Handlers follow a uniform error handling pattern:

1. **Missing env vars**: Return `{ ok: false, stale: true }` with zeroed data fields. Never throw, never expose which var is missing.
2. **Upstream timeout** (5s via `AbortController`): Catch `AbortError`, return stale cached data if available, otherwise zeroed response.
3. **Upstream non-2xx**: Catch, log server-side only, return stale/zeroed response.
4. **Partial failure** (`/api/blogs`): If one source fails, omit it and return remaining posts with `partial: true`. If all sources fail, return `{ ok: true, posts: [], partial: true }`.
5. **All responses are HTTP 200** — the `ok` and `stale` fields in the JSON body communicate upstream health to the client.

### Client-Side Error States

| Component | Error Condition | Behavior |
|---|---|---|
| Stats widgets (LeetCode, Codeforces, GitHub) | `ok: false` or fetch failure | Render skeleton → "Data unavailable" panel with `role="status"` |
| GitHub Heatmap / LeetCode Calendar | Fetch failure or empty data | Render "Data unavailable" fallback panel |
| Blog cards | Empty `posts[]` | Render empty state: "No posts available" |
| Contact form | EmailJS error or network failure | Render error alert with `role="alert"`, preserve form values for retry |
| PDF viewer | Browser blocks iframe embed | Render fallback `<a>` download link |

### Content Loading

- Static content (`content/*`) is resolved at build time. If a file is malformed or missing, the Next.js build fails — this is intentional and caught in CI.
- No runtime content fetching for static data; errors surface as build failures, not runtime errors.

### Theme Controller

- If `localStorage` is unavailable (private browsing, storage quota), fall back to `prefers-color-scheme` without throwing.
- The inline `<script>` in `<head>` is wrapped in a try/catch to prevent theme bootstrap from blocking page render.

## Testing Strategy

### Unit Tests (Vitest)

- **Content loaders** (`lib/content.js`): Test that `readJson`, `readMdx`, `getProjects`, `getProjectBySlug` return expected shapes from fixture files.
- **Stats normalizers** (`lib/stats/*`): Test that each normalizer transforms raw upstream JSON into the documented response shape, including edge cases (empty arrays, missing fields).
- **Blog normalizers** (`lib/blogs/*`): Test that each source normalizer (Dev.to, Hashnode, Medium) produces the `{ source, title, url, excerpt, publishedAt, tags, coverImageUrl }` shape.
- **SEO builders** (`lib/seo.js`): Test that JSON-LD output conforms to schema.org expectations for Person, CreativeWork, EducationalOccupationalCredential.
- **Utility functions** (`lib/motion.js`): Test `isReducedMotion()` returns correct boolean.

### Integration Tests (Vitest + MSW)

- **Route Handlers**: Mock upstream APIs (LeetCode, Codeforces, GitHub, Dev.to, Hashnode, Medium) with MSW. Verify:
  - Successful responses return `{ ok: true, stale: false, ...data }`.
  - Timeout/error responses return `{ ok: false, stale: true }` with zeroed or cached data.
  - `/api/blogs` partial failure returns remaining posts with `partial: true`.
  - Env var absence returns graceful zeroed response.

### Component Tests (Vitest + React Testing Library)

- **Contact form**: Verify validation, success/error state rendering, form reset on success, value preservation on error.
- **Skills filter**: Verify category tab filtering and text filter narrow results correctly.
- **Theme toggle**: Verify `data-theme` attribute updates and `localStorage` persistence.
- **Flip cards**: Verify `aria-pressed` toggles on click/keyboard activation.
- **Navigation**: Verify `aria-current="location"` updates on scroll and mobile menu toggle.

### Accessibility Audits

- Manual Lighthouse runs targeting ≥ 95 on Performance, Accessibility, Best Practices, SEO (per D-09).
- Manual screen reader testing for nav, flip cards, form, heatmap `aria-label` cells.
- Contrast verification already documented (19:1 primary, 9:1 muted — both pass WCAG AA).

### Build-Time Validation

- Next.js build fails on malformed content files — serves as a content schema gate.
- Missing `NEXT_PUBLIC_SITE_URL` causes build failure (enforced in `next.config.js`).

## Risks & open questions

1. **LeetCode public GraphQL is unofficial.** Endpoint and query shape can break. Mitigation: wrap fetcher in try/catch + cached fallback; consider `leetcode-query` as a maintained client if direct calls become flaky.
2. **GitHub contribution calendar requires authenticated GraphQL.** Adds `GITHUB_TOKEN` (a fine-grained PAT, read-only public scope) to the env var list. Update D-13 to include it.
3. **Medium RSS** has no real "tags" field and inconsistent content encoding; tag list will be empty for Medium posts and excerpts may include HTML — strip on the server.
4. **iOS Safari blocks `<iframe>` PDF embeds** by default. Fallback `<a>` link is mandatory (already in R11.3).
5. **Custom cursor on touch devices** must be suppressed (`@media (hover: hover) and (pointer: fine)`).
6. **Hashnode GraphQL** requires the user's host; note `https://gql.hashnode.com` + `Publication.posts` query needs a publication slug if the user has a custom domain.

## Out of scope

Per requirements D-12: multi-user, comments, payments, i18n, admin CMS, database, server-side validation layer, rate-limiting infrastructure, slug uniqueness enforcement, property-based testing, axe-core CI gates, CSP/CORS/DOMPurify enterprise security layer.
