# SEO Audit — inkwell-lp.vercel.app

**Audit date:** 2026-07-16
**Business type:** SaaS / open-source desktop software — free local-first markdown editor for macOS, Windows, and Linux
**Site scope:** 2 pages (`/` homepage, `/docs` documentation), Astro v6 static site, hosted on Vercel

## SEO Health Score: 55 / 100

| Category | Weight | Score |
|---|---|---|
| Technical SEO | 22% | 52 |
| Content Quality | 23% | 54 |
| On-Page SEO | 20% | 58 |
| Schema / Structured Data | 10% | 28 |
| Performance (CWV) | 10% | 87 |
| AI Search Readiness (GEO) | 10% | 42 |
| Images | 5% | 82 |

Supplementary (not in weighted score): Search Experience (SXO) 54/100 · Authority & Backlinks — insufficient data for a numeric score, structural finding flagged below.

---

## Executive Summary

inkwell is a well-designed, genuinely differentiated product (local-first markdown editor with a built-in drawing canvas, Kanban boards, GitHub sync, and a native Claude MCP server) let down by a set of foundational SEO/technical gaps typical of a fast-shipped 2-page launch site: no structured data, no canonical/sitemap/robots.txt, and — most importantly — a handful of live accuracy bugs that actively undercut the product's own story. The docs content itself is strong and AI-citation-ready; the surrounding technical and metadata layer is not yet doing it justice.

### Top 5 Critical Issues

1. **Zero structured data + no canonical tags + no robots.txt/sitemap.xml.** This is a textbook `SoftwareApplication` schema candidate with none in place, and a currently-live duplicate-content bug: `/docs` and `/docs/` both return HTTP 200 with byte-identical HTML and no redirect.
2. **Version mismatch, live right now.** The homepage shows `v0.6.0`; the `/docs` sidebar shows `v0.4.8`. Confirmed independently by 4 of the 9 specialist audits — a direct trust/E-E-A-T failure and an AI-citation-accuracy risk.
3. **Title tag and meta description say "for macOS" only**, despite the homepage actively selling Windows (`.exe`) and Linux (`.deb`) downloads. This self-suppresses discovery for roughly two-thirds of the product's own platform support.
4. **`/docs` breaks on mobile.** The two-column sidebar+content layout does not collapse at 375px — page renders at 592px width, clipping install instructions and shortcut text on every section.
5. **No custom domain.** Running on the shared `vercel.app` subdomain is a structural SEO liability (no durable backlink equity, brand-trust cost, platform lock-in) independent of current traffic.

### Top 5 Quick Wins

1. Fix the `VERSION` constant mismatch — single source of truth (15 min).
2. Rewrite title tag + meta description to mention all three platforms (15 min).
3. Add `robots.txt` (5 min) and canonical tags to `Layout.astro` (15 min — also resolves the `/docs` duplicate).
4. Paste in the ready-made `SoftwareApplication` + `WebSite` + `Organization` JSON-LD from `findings/schema.md` (~1 hr, no fabricated data required).
5. Self-host the Inter font to remove the render-blocking Google Fonts chain — the single highest-leverage performance fix.

---

## Technical SEO — 52/100

**What works:** Genuinely static/SSR site (confirmed not a SPA — full content in raw HTML with zero JS execution needed), clean single-H1 hierarchy, correct mobile viewport meta, proper HTTP→HTTPS redirect and HSTS, clean URL structure.

**Critical:**
- `robots.txt` and `sitemap.xml` both 404. No `site` property set in `astro.config.mjs`, blocking the standard `@astrojs/sitemap` fix.
- No canonical tags anywhere — and `/docs` vs `/docs/` is a live, currently-indexable duplicate-content pair with byte-identical HTML.

**High:**
- Missing security headers: only `strict-transport-security` present; `X-Content-Type-Options`, `X-Frame-Options`/CSP, `Referrer-Policy`, `Permissions-Policy` all absent. No `vercel.json` exists.
- No JSON-LD structured data (see Schema section).
- No `og:image`/Twitter Card meta tags — every social share currently renders as a bare text card.

**Medium:** Version mismatch (see Content section); render-blocking Google Fonts chain (see Performance section).

**Low:** No custom 404 page — Vercel's raw platform default (`text/plain`, 79 bytes) is served instead.

Full detail: [`findings/technical.md`](findings/technical.md)

---

## Content Quality — 54/100

**What works:** `/docs` (~1,474 words, 9 clearly labeled sections) is genuinely strong, fact-dense, AI-citation-ready content — exact file paths, JSON config examples, protocol names, structured shortcut tables.

**High:**
- Version mismatch is a live trust/E-E-A-T failure (v0.6.0 vs v0.4.8).
- Homepage meta/OG description contradicts the on-page hero content ("for macOS" vs "for every platform").

**Medium:**
- `/docs` content itself (not just metadata) is still macOS-only — no Windows/Linux install steps despite the homepage selling both.
- No About, Contact, Privacy Policy, Terms, License, or Changelog pages anywhere. Only external trust anchor is an unlicensed, 48-star GitHub repo under an anonymous org handle.

**Low:** Homepage is thin (~300 words) relative to its feature density — several features (Quick Capture, Weekly Planner, Canvas templates) are communicated almost entirely through visual mockups rather than extractable prose.

E-E-A-T weighted score: ≈43/100 (Trustworthiness is the weakest factor at 40/100, the highest-weighted QRG dimension at 30%).

Full detail: [`findings/content.md`](findings/content.md)

---

## On-Page SEO — 58/100

**What works:** Reasonable title lengths, clean heading hierarchy, low-friction internal navigation.

**High:** Title/meta undersell platform support (see Content section — same root cause).

**Medium:**
- Claude MCP — inkwell's most differentiated, lowest-competition feature — is buried as one of six equal-weight tiles on the homepage instead of getting its own section like Canvas and Quick Capture.
- Homepage mobile nav hides Features/Canvas/Themes/GitHub/Docs links with no hamburger/drawer replacement.

Full detail: cross-referenced across [`findings/content.md`](findings/content.md), [`findings/sxo.md`](findings/sxo.md), and [`findings/visual.md`](findings/visual.md)

---

## Schema & Structured Data — 28/100

**Finding:** Complete absence of structured data on both pages — no JSON-LD, microdata, or RDFa anywhere.

This is a textbook `SoftwareApplication` candidate: free, cross-platform, downloadable, versioned, with an active Google rich-result type. Ready-to-paste JSON-LD for `SoftwareApplication` + `WebSite` + `Organization` (homepage) and a minimal `WebPage` (`/docs`) has been generated using only real values already in the codebase — no fabricated fields.

**Do not:** fabricate `aggregateRating`/review data (no real review data exists — risks a Google manual action), or force `FAQPage`/`HowTo` schema onto `/docs` (wrong content shape; `HowTo` is also deprecated for rich results).

Full detail + generated code: [`findings/schema.md`](findings/schema.md)

---

## Performance — 87/100

**Real Lighthouse 13.4.0 lab data** (no CrUX/PSI field data available — no Google API credentials in this environment).

| Page | Score | LCP | CLS | TBT |
|---|---|---|---|---|
| Homepage | 89/100 | 2.83s (Needs Improvement) | 0.000 (Good) | 0ms (Good) |
| Docs | 84/100 | 3.1s (Needs Improvement) | 0.000 (Good) | 0ms (Good) |

**Root cause:** A 3-hop render-blocking chain (HTML → `fonts.googleapis.com` CSS → `fonts.gstatic.com` woff2) accounts for an estimated 1,920ms (home) / 2,170ms (docs) of available savings per Lighthouse's own render-blocking insight. CLS and TBT are both essentially perfect — this is purely a font-loading-chain problem, not a layout-shift or JS-blocking problem.

**Fix:** Self-host the Inter font and inline `@font-face` in the existing CSS bundle. Should move LCP into "Good" (<2.5s) territory on both pages.

Full detail: [`findings/performance.md`](findings/performance.md)

---

## AI Search Readiness (GEO) — 42/100

**What works:** Fully SSR'd/static — every fact an AI crawler needs is in the raw first-response HTML. Docs content is fact-dense and quotable. No `noindex`/`noai` directives suppressing eligibility.

**Medium:**
- No `llms.txt`, despite the docs page being a near-perfect structural fit for one (9 sections map directly to an llms.txt outline).
- No heading `id` attributes anywhere on `/docs` — blocks deep-linkable citation and is a prerequisite for a working llms.txt.
- **Confirmed naming collision:** `en.wikipedia.org/wiki/Inkwell_(software)` documents Apple's discontinued macOS handwriting-recognition feature — a materially bad collision sharing both the name and the macOS/Apple context, against which this 1-month-old project has no counterbalancing authority yet.

**Low:** Missing `robots.txt` removes explicit AI-crawler signaling (though nothing is currently blocked by its absence).

Full detail: [`findings/geo.md`](findings/geo.md)

---

## Images — 82/100

**What works:** All `<img>` tags have correct alt text and explicit width/height (proper CLS-prevention practice). No heavy image assets — the site is almost entirely inline SVG/CSS mockups, so there's no image-weight concern.

**High:** No `og:image` for social sharing (cross-referenced from Technical/Schema).

---

## Supplementary: Search Experience (SXO) — 54/100

Not part of the weighted Health Score, but a significant strategic finding: **the site has no Comparison Page or persona/use-case content**, while several of its realistic target queries ("obsidian alternative," "best markdown editor") are Comparison-Page-dominated intents in Google's SERPs. A single-product landing page with zero competitor mentions structurally cannot satisfy that intent regardless of copy quality — this is the single highest-ROI content gap identified in the audit.

Persona scoring (0-100): Writer wanting distraction-free editor 66 (Good) · Developer wanting MCP tool 52 · Obsidian power user 48 · Windows/Linux user 48 · Privacy researcher 48.

Full detail: [`findings/sxo.md`](findings/sxo.md)

---

## Supplementary: Authority & Backlinks

No numeric score reported — insufficient data at Tier 0 (no Moz/Bing API keys; domain not yet in Common Crawl, expected for a 1-month-old project, not a quality signal).

**Structural finding (High):** No custom domain. `vercel.app` as a whole ranks #374 by PageRank across 106,085 unrelated hosts in Common Crawl — none of that authority is inherited by this specific project. Beyond the measurement noise, this is a durable liability: no backlink equity portability, brand-trust cost, and platform lock-in risk.

**Positive signal:** 48 GitHub stars / 3 forks in ~1 month is reasonable early traction; reciprocal, fully-followable links confirmed between the landing page and its GitHub repo.

Full detail: [`findings/backlinks.md`](findings/backlinks.md)

---

## Visual / Mobile Findings

**High:** `/docs` two-column layout does not collapse on mobile (375px) — 592px page width vs 375px viewport, clipping documentation text on every section. Root cause: `.docs-sidebar` retains a ~572px computed width at the mobile breakpoint instead of switching to `width:100%`/stacking.

**Medium:** Homepage mobile nav has no menu for hidden links (Features/Canvas/Themes/GitHub/Docs).

**What works:** Homepage above-the-fold is solid on both viewports; H1 and primary download CTA both visible without scrolling on mobile. Desktop docs sticky sidebar confirmed working correctly through the full ~10,400px scroll depth.

Full detail + screenshots: [`findings/visual.md`](findings/visual.md), screenshots in [`screenshots/`](screenshots/)

---

## Sitemap

No sitemap currently exists. Not strictly necessary for discoverability at 2 pages (both are directly linked and Googlebot will find them via normal crawling), but recommended as a near-zero-cost best practice, especially since `@astrojs/sitemap` auto-regenerates on every build as pages are added.

Full detail: [`findings/sitemap.md`](findings/sitemap.md)

---

See [`ACTION-PLAN.md`](ACTION-PLAN.md) for the prioritized, phased implementation plan.
