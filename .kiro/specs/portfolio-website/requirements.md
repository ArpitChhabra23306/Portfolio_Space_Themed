# Requirements Document

## Introduction

This document specifies a personal portfolio website for Arpit Chhabra (B.Tech IT, IIIT Una), targeted at recruiters evaluating fit for full-stack / MERN junior roles. The site is a single-page-feel Next.js 14 App Router application, statically rendered where possible, with a small set of Route Handlers for aggregating external stats (LeetCode, Codeforces, GitHub) and external blog feeds (Dev.to, Hashnode, Medium). Content is authored as JSON / MDX files in the repo; updating content means editing a file and pushing to GitHub. There is no database, no authentication, no admin CMS.

This spec is intentionally scoped to what a junior fresher portfolio actually needs to ship in days, not what an enterprise SaaS would ship in months. Visual design is out of scope here; only structure, behavior, semantics, and quality contracts are specified.

## Locked Decisions

- **D-01 Stack**: Next.js 14 (App Router) + Tailwind CSS + Framer Motion + shadcn/ui, **JavaScript** (not TypeScript), deployed to Vercel. RSC by default; `"use client"` only where interactivity demands it.
- **D-02 Content storage**: Static JSON / MDX files in the repo under `content/` for projects, skills, experience, education, achievements, certifications, about copy. Updating content = edit file + push to GitHub + Vercel auto-redeploys. No database. No CMS.
- **D-03 Backend**: Next.js Route Handlers under `app/api/` only for external stats aggregation and the blogs aggregator. Cached via Next.js ISR `revalidate`. No Redis. No Mongo.
- **D-04 Contact form**: EmailJS client-side only. No backend endpoint, no Turnstile, no honeypot, no rate limiter, no submission persistence.
- **D-05 Resume**: Single PDF stored at `/public/resume/Arpit-Chhabra-Resume.pdf`. Inline PDF viewer + download button. No version history UI, no admin upload, no resume collection.
- **D-06 Auth**: None. No admin routes, no login, no JWT, no bcrypt.
- **D-07 Analytics**: Google Analytics 4 only, via `@next/third-parties`. No first-party event collection.
- **D-08 SEO / ATS**: Server-rendered HTML for all section text. JSON-LD `Person` (root layout), `CreativeWork` (per project page), `EducationalOccupationalCredential` (per certification). Sitemap, robots.txt, OG image, meta tags.
- **D-09 Performance**: Lighthouse mobile ≥ 95 for Performance, Accessibility, Best Practices, SEO on `/`. Targets only — no formal CI gates.
- **D-10 Accessibility**: WCAG 2.1 AA target. No axe-core CI gates required.
- **D-11 Component architecture**: Feature-based folders — `app/`, `components/ui/` (shadcn), `components/shared/` (FadeIn, Section, SectionHeading, animation primitives), `components/sections/{hero,about,skills,projects,experience,education,achievements,certifications,blogs,resume,contact,extras}/`, `lib/` (api client, utils), `content/` (MDX/JSON).
- **D-12 Out of scope**: Multi-user, comments, payments, i18n, admin CMS, database, server-side validation layer, rate-limiting infrastructure, slug uniqueness enforcement, property-based testing, axe-core CI gates, CSP/CORS/DOMPurify enterprise security layer.
- **D-13 Env vars**: `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `LEETCODE_USERNAME`, `CODEFORCES_HANDLE`, `GITHUB_USERNAME`, `NEXT_PUBLIC_SITE_URL`.
- **D-14 Theme**: Dark mode toggle with `prefers-color-scheme` default + `localStorage` override.
- **D-15 Reduced motion**: Honor `prefers-reduced-motion: reduce` for all animations.

## Glossary

- **Portfolio_Site**: The complete deployed Next.js application running on Vercel.
- **Frontend**: The Next.js 14 App Router rendered output (RSC + client components) served to visitors.
- **API**: The Next.js Route Handlers under `app/api/` — strictly limited to stats aggregation and the blogs aggregator per D-03.
- **Owner**: Arpit Chhabra, the sole subject of the portfolio.
- **Visitor**: Any user of the public site (recruiter, peer, bot).
- **Recruiter**: Primary target audience persona.
- **Project**: An MDX file under `content/projects/*.mdx` with frontmatter `title`, `slug`, `summary`, `problem`, `solution`, `impact`, `techStack[]`, `domains[]`, `liveUrl`, `repoUrl`, `mediaUrl`, `mediaType`, `featured`, `pinned`, `order`.
- **Blog_Aggregator**: The Route Handler at `/api/blogs` that fetches and normalizes posts from Dev.to, Hashnode, and Medium.
- **Stats_Aggregator**: The Route Handlers at `/api/stats/leetcode`, `/api/stats/codeforces`, `/api/stats/github`.
- **Theme_Controller**: The client component that resolves `prefers-color-scheme` and a `localStorage` override per D-14.
- **Animation_Primitive**: A reusable Framer Motion wrapper under `components/shared/` (`FadeIn`, `SlideIn`, `Stagger`, `Reveal`).
- **ATS**: Applicant Tracking System; automated resume/profile parsers used by recruiters.
- **Structured_Data**: JSON-LD blocks per schema.org per D-08.
- **CV / Resume**: Used interchangeably; refers to the single PDF at `/public/resume/Arpit-Chhabra-Resume.pdf` per D-05.

## Requirements

### Requirement 1: Site Shell and Navigation

**User Story:** As a Visitor, I want a single-page portfolio with anchored sections and persistent navigation, so that I can jump to the section that interests me.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render the home route (`/`) as a server-rendered document containing the sections from Requirements 2 through 13 in the order: Hero, About, Skills, Projects, Experience, Education, Achievements, Certifications, Blogs, Resume, Contact.
2. THE Frontend SHALL render a `<nav aria-label="Primary">` element containing anchor links for each section listed in 1.1.
3. WHEN a Visitor clicks a navigation anchor link, THE Frontend SHALL scroll the page to the corresponding section using smooth scrolling.
4. WHILE a section is currently the most visible in the viewport, THE Frontend SHALL mark its corresponding navigation anchor link with `aria-current="location"`.
5. WHERE the viewport width is below 768px, THE Frontend SHALL render the navigation as a collapsible menu triggered by a button with `aria-label="Open navigation menu"`.
6. THE Frontend SHALL render a footer containing the Owner's name, copyright year, links to GitHub, LinkedIn, and email, and a "Built with Next.js" attribution.
7. THE Frontend SHALL render a sticky "Back to top" floating button that becomes visible after the Visitor scrolls more than 600 pixels from the top of the document, and WHEN activated SHALL scroll the page back to the top using smooth scrolling (or instant jump if `prefers-reduced-motion: reduce` is set).
8. THE Frontend SHALL render a thin reading-progress indicator fixed to the top edge of the viewport whose width grows from 0% to 100% proportional to the document scroll position.

### Requirement 2: Hero Section

**User Story:** As a Recruiter, I want an immediately scannable hero with the Owner's name, role, and a CV download CTA, so that I can identify the candidate and grab the resume in under 5 seconds.

#### Acceptance Criteria

1. THE Hero_Section SHALL render the Owner's full name as the only `<h1>` element on the home route.
2. THE Hero_Section SHALL render a static primary tagline as a `<p>` element below the `<h1>`, present in the server-rendered HTML.
3. THE Hero_Section SHALL render a typed role switcher that cycles through a configured list of roles (e.g., "Full-Stack Developer", "MERN Engineer", "Open-Source Contributor").
4. THE Hero_Section SHALL render the full configured list of roles inside a visually hidden `<span>` with the same text content, present in the server-rendered HTML for ATS readability.
5. THE Hero_Section SHALL render a primary call-to-action button labeled "Download CV" that downloads the resume PDF at `/resume/Arpit-Chhabra-Resume.pdf`.
6. THE Hero_Section SHALL render social links (GitHub, LinkedIn, email, optional Twitter/X) as `<a>` elements with `rel="me noopener"` and accessible labels.
7. THE Hero_Section SHALL render a scroll cue indicator at the bottom of the section.
8. THE Hero_Section SHALL render a decorative animated background using a client component that is dynamically imported and lazy-loaded.
9. IF the Visitor's browser reports `prefers-reduced-motion: reduce`, THEN THE Hero_Section SHALL render a static background and disable the role switcher animation while preserving all text content.

### Requirement 3: About Section

**User Story:** As a Visitor, I want a concise "About" section with a photo and a personality-rich introduction, so that I can quickly form a sense of who the Owner is beyond the resume.

#### Acceptance Criteria

1. THE About_Section SHALL render an `<h2>` heading with text "About".
2. THE About_Section SHALL render an optimized photo of the Owner using `next/image` with explicit `width`, `height`, and descriptive `alt`.
3. THE About_Section SHALL render the introductory paragraph, values list, fun-facts list, and "Currently learning" subsection sourced from `content/about.mdx`.
4. THE About_Section SHALL render all textual content in 3.3 as semantic HTML (`<p>`, `<ul>`, `<li>`) so that ATS parsers read it.
5. WHERE the `openToWork` flag in `content/about.mdx` frontmatter is true, THE About_Section SHALL render an "Open to work" badge with `role="status"`.
6. WHERE the `openToWork` flag is true, THE Frontend SHALL also render a sticky "Available for hire" floating status pill fixed to a screen corner containing a pulsing green dot and a label linking to the Contact section anchor, visible across all sections of the page.

### Requirement 4: Skills and Tech Stack Section

**User Story:** As a Recruiter, I want a categorized, filterable view of the Owner's technical skills, so that I can verify role-fit keywords (React, Node, MongoDB, etc.) at a glance.

#### Acceptance Criteria

1. THE Skills_Section SHALL render an `<h2>` heading with text "Skills & Tech Stack".
2. THE Skills_Section SHALL load skill data from `content/skills.json` at build time.
3. THE Skills_Section SHALL render skill categories as tabs with the labels: "Frontend", "Backend", "DevOps", "Database", "Languages", "Tools".
4. THE Skills_Section SHALL render each skill as an item containing a name, an icon, a proficiency level (one of: "Familiar", "Proficient", "Advanced"), and an animated progress indicator (linear bar or radial ring) that animates from 0 to its mapped fill percentage when the Skills_Section first enters the viewport.
5. WHEN a Visitor hovers or focuses a skill item, THE Skills_Section SHALL display a tooltip containing the skill name, proficiency level, and years of experience sourced from a `yearsOfExperience` field in `content/skills.json`.
6. THE Skills_Section SHALL render every skill name and proficiency level as plain text in the server-rendered HTML, even when displayed visually as a bar or icon.
6. THE Skills_Section SHALL render a free-text filter input that filters skills by case-insensitive substring match on name across all categories.
7. WHEN a Visitor selects a category tab, THE Skills_Section SHALL filter the displayed skills to those matching the selected category without a network request.

### Requirement 5: Projects Section

**User Story:** As a Recruiter, I want to see 3–5 hero projects with problem/solution/impact framing, live demo and source links, tech badges, and a media preview, so that I can evaluate engineering depth in under 60 seconds.

#### Acceptance Criteria

1. THE Projects_Section SHALL render an `<h2>` heading with text "Projects".
2. THE Projects_Section SHALL load Project data from `content/projects/*.mdx` at build time.
3. THE Projects_Section SHALL render between 3 and 5 Projects whose frontmatter `pinned` is true, sorted by `order` ascending.
4. THE Projects_Section SHALL render exactly one Project marked `featured: true` as a full-width card at the top of the section, with the remaining pinned Projects rendered as a grid below.
5. IF zero pinned Projects have `featured: true`, THEN THE Projects_Section SHALL render the pinned Project with the lowest `order` value as the full-width card.
6. THE Projects_Section SHALL render each Project card with: title, summary, tech badges from `techStack[]`, a "Live Demo" link when `liveUrl` is non-empty, a "Source" link when `repoUrl` is non-empty, and a media preview matching `mediaType` (image, GIF, or muted-looped video).
7. WHEN a Visitor hovers or focuses a Project card on a pointer device, THE Projects_Section SHALL reveal and play the GIF or video preview; WHEN the pointer leaves or focus blurs, THE Projects_Section SHALL pause and reset the preview to its first frame.
7. THE Projects_Section SHALL render the Problem, Solution, and Impact paragraphs of each Project as semantic HTML (three labeled paragraphs or `<dt>`/`<dd>` pairs) so that ATS parsers read the framing.
8. THE Projects_Section SHALL render a tech-stack filter and a domain filter that narrow the visible Projects.
9. THE Projects_Section SHALL render a "View all projects" link to `/projects` that lists every Project, including non-pinned ones.
10. THE Frontend SHALL provide a per-project route at `/projects/[slug]` that server-renders the full Project detail with JSON-LD `CreativeWork` Structured_Data per Requirement 14.

### Requirement 6: Experience Timeline

**User Story:** As a Recruiter, I want a chronological vertical timeline of internships, freelance work, and significant college projects, so that I can trace the Owner's progression.

#### Acceptance Criteria

1. THE Experience_Section SHALL render an `<h2>` heading with text "Experience".
2. THE Experience_Section SHALL load entries from `content/experience.json` at build time.
3. THE Experience_Section SHALL render entries as an animated vertical timeline, sorted by `endDate` descending with `endDate: null` (current) first.
4. THE Experience_Section SHALL render each entry as an `<article>` element containing role title, organization, location, description bullet list, and tag list.
5. THE Experience_Section SHALL render every date in ISO 8601 format inside a `<time datetime="...">` element with a human-readable label as the text content.

### Requirement 7: Education Section

**User Story:** As a Recruiter, I want to see degree, institution, CGPA, and relevant coursework, so that I can verify academic fit.

#### Acceptance Criteria

1. THE Education_Section SHALL render an `<h2>` heading with text "Education".
2. THE Education_Section SHALL load entries from `content/education.json` at build time.
3. THE Education_Section SHALL render each Education entry with: degree, institution, location, start date, end date (or "Expected {year}"), CGPA or percentage, and a list of relevant coursework.
4. THE Education_Section SHALL render coursework as a `<ul><li>` list in the server-rendered HTML.

### Requirement 8: Achievements Section

**User Story:** As a Recruiter, I want to see hackathon ranks, competitive coding ratings, and DSA problem counts at a glance, so that I can quickly gauge competitive performance.

#### Acceptance Criteria

1. THE Achievements_Section SHALL render an `<h2>` heading with text "Achievements".
2. THE Achievements_Section SHALL load entries from `content/achievements.json` at build time and group them by `category` (one of: "Hackathon", "Competitive Programming", "Academic", "Other").
3. THE Achievements_Section SHALL render an animated numeric counter for each Achievement that has a `metric` field, animating from 0 to the metric value when the section enters the viewport.
4. THE Achievements_Section SHALL render the final metric value as plain text in the server-rendered HTML, regardless of animation state.
5. THE Achievements_Section SHALL render a live stats widget per source (LeetCode, Codeforces, GitHub) populated from `/api/stats/leetcode`, `/api/stats/codeforces`, and `/api/stats/github` per Requirement 15.
6. THE Achievements_Section SHALL render a GitHub contribution heatmap for `GITHUB_USERNAME` covering the trailing 12 months, with each day's contribution count accessible as an `aria-label` on its cell for screen reader and ATS access.
7. THE Achievements_Section SHALL render a LeetCode submission activity calendar for `LEETCODE_USERNAME` covering the trailing 12 months, with each day's submission count accessible as an `aria-label` on its cell.
8. IF a stats widget's, heatmap's, or calendar's data fails to load, THEN THE Achievements_Section SHALL render a fallback panel with a "data unavailable" indicator with `role="status"` for that widget and continue rendering the rest of the section.

### Requirement 9: Certifications Section

**User Story:** As a Recruiter, I want to see certifications with verifiable issuer, date, and credential ID, so that I can confirm authenticity in one click.

#### Acceptance Criteria

1. THE Certifications_Section SHALL render an `<h2>` heading with text "Certifications".
2. THE Certifications_Section SHALL load entries from `content/certifications.json` at build time.
3. THE Certifications_Section SHALL render each Certification as a flip-card with a front face (certification name and issuer logo) and a back face (issuer name, issue date, expiration date if any, credential ID, and a "Verify" link).
4. THE Certifications_Section SHALL render the front and back content of every flip-card as plain text in the server-rendered HTML using a CSS-driven flip without `display: none` on the back face, so that ATS parsers read both sides.
5. WHEN a Visitor activates a flip-card via click or keyboard (Enter or Space), THE Certifications_Section SHALL toggle the flipped state and update `aria-pressed` accordingly.
6. THE Certifications_Section SHALL render JSON-LD `EducationalOccupationalCredential` Structured_Data for each Certification per Requirement 14.

### Requirement 10: Blogs Aggregator

**User Story:** As a Visitor, I want to see the Owner's recent posts from Dev.to, Hashnode, and Medium aggregated in one place, so that I can read writing samples without hunting across platforms.

#### Acceptance Criteria

1. THE Blogs_Section SHALL render an `<h2>` heading with text "Writing".
2. THE API SHALL expose `GET /api/blogs` as a Route Handler that fetches posts from Dev.to (REST), Hashnode (GraphQL), and Medium (RSS), normalizes them into the shape `{ source, title, url, excerpt, publishedAt, tags[], coverImageUrl }`, and returns them sorted by `publishedAt` descending.
3. THE API SHALL cache the `/api/blogs` response using Next.js ISR with `revalidate: 3600`.
4. IF one source fails (network error or non-2xx response), THEN THE Blog_Aggregator SHALL omit that source and return posts from the remaining sources with HTTP 200 and a `partial: true` flag in the JSON body.
5. IF all sources fail, THEN THE Blog_Aggregator SHALL return HTTP 200 with an empty `posts: []` array and `partial: true`, so that the section renders an empty state rather than breaking the page.
6. THE Blogs_Section SHALL render each post with title (linking to the original URL with `rel="noopener"`), source badge, excerpt, publish date in `<time datetime>`, and tags.
7. THE Blogs_Section SHALL render no more than 9 posts initially and provide a "Load more" control that paginates locally over the fetched set.

### Requirement 11: Resume Section

**User Story:** As a Recruiter, I want to view the resume inline and download it, and I want the resume content to be readable by ATS parsers that do not parse PDFs, so that I can read it without leaving the page.

#### Acceptance Criteria

1. THE Resume_Section SHALL render an `<h2>` heading with text "Resume".
2. THE Resume_Section SHALL embed an inline PDF viewer pointed at `/resume/Arpit-Chhabra-Resume.pdf`, rendered as an `<iframe>` or `<embed>` with `aria-label="Resume PDF"` and a fallback `<a>` link with text "Download resume" for browsers that block embeds.
3. THE Resume_Section SHALL render a "Download" button that points at `/resume/Arpit-Chhabra-Resume.pdf` with the `download` attribute set to `Arpit-Chhabra-Resume.pdf`.
4. THE Resume_Section SHALL also render the resume's key textual content (summary, experience bullets, skills, education) as semantic HTML inside a `<section aria-label="Resume content">` block, so that ATS scrapers that do not parse PDFs can still read the resume.

### Requirement 12: Contact Section

**User Story:** As a Visitor, I want to send a message to the Owner via a form on the site, so that I can reach out without copying an email address.

#### Acceptance Criteria

1. THE Contact_Section SHALL render an `<h2>` heading with text "Contact".
2. THE Contact_Section SHALL render a form with fields: name (required), email (required), subject (required), and message (required).
3. THE Contact_Section SHALL render every form field with an associated `<label>`, an `aria-describedby` link to its error message container, and `aria-invalid` reflecting the validation state.
4. WHEN a Visitor submits the form with valid data, THE Frontend SHALL send the submission via the EmailJS browser SDK using `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.
5. WHEN EmailJS confirms successful delivery, THE Contact_Section SHALL render a success state with `role="status"` and reset the form fields.
6. IF EmailJS returns an error or the request fails, THEN THE Contact_Section SHALL render an error state with `role="alert"` and preserve the form values so that the Visitor can retry.
7. THE Contact_Section SHALL render a social-links grid duplicating the Hero social links, an availability badge sourced from the same `openToWork` flag as Requirement 3.5, and the Owner's location and timezone as plain text.

### Requirement 13: Extras (Theme, Easter Egg, Cursor)

**User Story:** As a Visitor, I want optional extras like dark mode, a Konami-code easter egg, and a custom cursor, so that the site feels delightful without being noisy.

#### Acceptance Criteria

1. THE Theme_Controller SHALL initialize the active theme on first paint by reading `localStorage.theme`; if absent, THE Theme_Controller SHALL fall back to the result of `prefers-color-scheme`.
2. THE Theme_Controller SHALL set the initial `data-theme` attribute on `<html>` via a synchronous inline `<script>` in `<head>` to prevent a flash of incorrect theme.
3. THE Theme_Controller SHALL render a toggle button with `aria-label="Toggle color theme"` in the navigation bar.
4. WHEN a Visitor clicks the theme toggle, THE Theme_Controller SHALL update `localStorage.theme` to the new value and apply the corresponding `data-theme` attribute on `<html>` without a full page reload.
5. WHERE the Visitor enters the Konami code key sequence (↑ ↑ ↓ ↓ ← → ← → B A), THE Frontend SHALL toggle a non-essential easter-egg overlay.
6. WHERE the Frontend renders a custom cursor, THE Frontend SHALL preserve the native cursor for all interactive elements (`<a>`, `<button>`, form controls) so that pointer affordances remain visible.
7. IF the Visitor's browser reports `prefers-reduced-motion: reduce`, THEN THE Frontend SHALL disable the custom cursor, the Konami easter-egg animation, and any non-essential transitions, while preserving all functional content.

### Requirement 14: SEO and Structured Data

**User Story:** As a Recruiter using a search engine or an ATS-style crawler, I want the site to expose well-structured metadata and JSON-LD, so that profile information surfaces correctly in search and credential-verification tools.

#### Acceptance Criteria

1. THE Frontend SHALL render a JSON-LD `Person` block in the root layout containing the Owner's name, job title, alumniOf (IIIT Una), URL (`NEXT_PUBLIC_SITE_URL`), and `sameAs[]` social profile URLs.
2. THE Frontend SHALL render a JSON-LD `CreativeWork` block on each `/projects/[slug]` route containing the Project title, description (summary), URL, and (when present) `image` (mediaUrl) and `codeRepository` (repoUrl).
3. THE Frontend SHALL render a JSON-LD `EducationalOccupationalCredential` block on the Certifications section for each Certification containing the credential name, issuer, issue date, expiration date (when present), and credential URL.
4. THE Portfolio_Site SHALL serve a `sitemap.xml` listing the home route, `/projects`, and every `/projects/[slug]` route, generated at build time.
5. THE Portfolio_Site SHALL serve a `robots.txt` that allows all user agents and references the sitemap URL.
6. THE Frontend SHALL set page-level `<title>`, `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`), and Twitter card tags on the home route and every `/projects/[slug]` route.
7. THE Portfolio_Site SHALL serve a static OG image at a stable path referenced by the `og:image` tag.

### Requirement 15: Stats Aggregator API

**User Story:** As a Visitor, I want to see live counts of LeetCode problems solved, Codeforces rating, and GitHub repo / commit activity, so that I can verify the Owner's competitive and open-source claims.

#### Acceptance Criteria

1. THE API SHALL expose `GET /api/stats/leetcode` as a Route Handler that fetches the public LeetCode profile for `LEETCODE_USERNAME` and returns normalized fields including total solved, easy / medium / hard counts, ranking, and `submissionCalendar` (an object mapping ISO date strings to daily submission counts for the trailing 12 months).
2. THE API SHALL expose `GET /api/stats/codeforces` as a Route Handler that fetches Codeforces user info and rating for `CODEFORCES_HANDLE` and returns normalized fields including current rating, max rating, and rank.
3. THE API SHALL expose `GET /api/stats/github` as a Route Handler that fetches the GitHub profile, public repos, and contribution calendar for `GITHUB_USERNAME` and returns normalized fields including public repo count, follower count, total stars across public non-fork repos, and `contributionCalendar` (weekly buckets of daily contribution counts for the trailing 12 months).
4. THE API SHALL cache each stats endpoint response using Next.js ISR with `revalidate: 3600`.
5. IF an upstream stats source returns a non-2xx response or fails to fetch within 5 seconds, THEN THE API SHALL respond HTTP 200 with `{ "ok": false, "stale": true }` and (where available) the most recent successful payload, so that the consuming widget can render a fallback per Requirement 8.6.
6. THE API SHALL reference upstream credentials and handles only via the env vars defined in D-13 and SHALL NOT log or echo them in responses.

### Requirement 16: Performance, Accessibility, and Analytics

**User Story:** As the Owner, I want the site to load fast, be accessible to assistive technologies, and report visitor analytics, so that recruiters get a good first impression and I can see what they engage with.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL target Lighthouse mobile scores of at least 95 for Performance, Accessibility, Best Practices, and SEO on the home route per D-09.
2. THE Frontend SHALL render images via `next/image` with explicit `width`, `height`, and `alt` attributes for every non-decorative image, and `alt=""` for purely decorative images.
3. THE Frontend SHALL maintain a single `<h1>` per route, use `<h2>` for section headings, and not skip heading levels within a section.
4. THE Frontend SHALL render all interactive controls as native `<button>`, `<a>`, or form elements, or as Radix-based shadcn primitives that expose equivalent ARIA semantics, and SHALL ensure every interactive control is reachable via keyboard with a visible focus indicator.
5. WHERE the Visitor's browser reports `prefers-reduced-motion: reduce`, THE Frontend SHALL disable Animation_Primitive transitions and any auto-playing motion per D-15.
6. WHEN a Section_Component first enters the viewport, THE Frontend SHALL apply a staggered entrance animation to its top-level child elements using the shared Animation_Primitive set (`FadeIn`, `SlideIn`, `Stagger`) defined under `components/shared/`; WHERE `prefers-reduced-motion: reduce` is set, THE Frontend SHALL skip the animation and render elements in their final visible state immediately.
7. THE Hero_Section SHALL render an optional terminal-style CLI intro animation that types a sequence of fake shell commands before revealing the hero content; IF the Visitor's browser reports `prefers-reduced-motion: reduce`, THEN THE Hero_Section SHALL skip the animation and render the hero content immediately.
8. THE Frontend SHALL load Google Analytics 4 via `@next/third-parties` using `NEXT_PUBLIC_GA_ID` per D-07.
9. THE Frontend SHALL NOT collect first-party analytics events into any database or external endpoint other than Google Analytics 4.
