# Technical SEO Audit — inkwell-lp.vercel.app

**Site type:** SaaS / open-source desktop software download page (not e-commerce, not local business)
**Pages audited:** `/` (homepage), `/docs` (documentation) — 2 pages total
**Stack:** Astro (static SSG), hosted on Vercel, HTTP/2, Brotli compression
**Audit date:** 2026-07-16

**Technical SEO Score: 52 / 100**

---

## Summary Table

| Category | Status |
|---|---|
| Crawlability | FAIL |
| Indexability | FAIL |
| Security Headers | FAIL |
| URL Structure | PARTIAL PASS |
| Mobile Viewport | PASS |
| Core Web Vitals (source-inspection) | PARTIAL PASS |
| Structured Data | FAIL |
| JavaScript Rendering | PASS |
| IndexNow Protocol | FAIL (not applicable-by-default, but easy win) |

---

## Critical Issues

### 1. `robots.txt` returns 404 (missing entirely)
**Severity:** Critical
**Category:** Crawlability

**Evidence:**
```
curl -s -o /dev/null -w "%{http_code}" https://inkwell-lp.vercel.app/robots.txt
-> 404
```
No file exists at `/Users/ayphone/Documents/side_projects/inkwell-lp/public/robots.txt`. The `public/` directory only contains `favicon.ico`, `favicon.svg`, and `inkwell-icon.svg`.

**Impact:** While a missing `robots.txt` does not block crawling by default (crawlers assume full access when they get a 404), it means there is no explicit sitemap pointer for search engines/AI crawlers to discover, no explicit allow/disallow policy, and no place to declare crawler-specific directives (e.g., for AI crawlers like GPTBot, ClaudeBot, PerplexityBot — increasingly important for an open-source dev tool that benefits from AI-assistant citations).

**Recommendation:** Add `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://inkwell-lp.vercel.app/sitemap.xml
```
Since this is an open-source software product likely to be discovered/cited by AI assistants (Claude, ChatGPT, Perplexity), explicitly `Allow` known AI crawler user-agents rather than staying silent — silence is fine but explicit allow is a stronger, unambiguous signal. Reference the AI Crawler Management guidance in the `seo-technical` skill for the current token list (GPTBot, ClaudeBot, Google-Extended, PerplexityBot, etc.).

---

### 2. `sitemap.xml` returns 404 (missing entirely)
**Severity:** Critical
**Category:** Crawlability / Indexability

**Evidence:**
```
curl -s -o /dev/null -w "%{http_code}" https://inkwell-lp.vercel.app/sitemap.xml
-> 404
```

**Impact:** With only 2 pages this has low practical impact on discovery (both pages are reachable via internal links from the nav/footer), but it removes a clean, authoritative channel for search engines to learn `lastmod` dates and confirm canonical URLs. It also blocks IndexNow / Bing / Yandex submission workflows that typically reference a sitemap.

**Recommendation:** Since the site is Astro, add the official `@astrojs/sitemap` integration (simplest fix for a 2-page static site):
```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://inkwell-lp.vercel.app',
  integrations: [sitemap()],
});
```
Note `astro.config.mjs` currently has no `site` property set at all — this is also required for Astro's canonical-URL-generation features and `@astrojs/sitemap` to work correctly (see Indexability finding below).

---

### 3. No canonical tags on either page
**Severity:** Critical
**Category:** Indexability

**Evidence:** `grep -oE '<link[^>]*>' ` on both `/` and `/docs` shows only `icon`, `preconnect`, and `stylesheet` link tags — no `<link rel="canonical">`. Confirmed in source: `src/layouts/Layout.astro` head block (lines 15–27) has no canonical tag, and neither `index.astro` nor `docs.astro` inject one via props.

**Compounding issue found during this audit:** `/docs` and `/docs/` (with trailing slash) both return HTTP 200 with **byte-identical HTML** and no redirect between them:
```
curl -s https://inkwell-lp.vercel.app/docs   -> 200
curl -s https://inkwell-lp.vercel.app/docs/  -> 200
diff docs_noslash.html docs_slash.html       -> identical
```
This is a real, currently-live duplicate-content vector, not just a theoretical risk — two distinct URLs serve identical content with no canonical to disambiguate.

**Impact:** Search engines must self-select a canonical URL among `/docs` and `/docs/` (Google generally handles this well, but Bing/Yandex are less reliable). Any future query-string variants (UTM tracking links, referral params from GitHub/Product Hunt/HN — very likely for a product like this) will also be indexed as separate duplicate URLs without a canonical to consolidate signals.

**Recommendation:** Add a canonical tag to `Layout.astro`, driven by `Astro.url`:
```astro
---
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<link rel="canonical" href={canonicalURL} />
```
This requires setting `site: 'https://inkwell-lp.vercel.app'` in `astro.config.mjs` (currently unset — `export default defineConfig({})`). Once `site` is set, canonical tags, `@astrojs/sitemap`, and any `Astro.url`-based absolute URL generation all work correctly with zero hardcoding per page.

---

## High Priority Issues

### 4. Missing security headers (X-Content-Type-Options, X-Frame-Options/CSP frame-ancestors, Content-Security-Policy, Referrer-Policy, Permissions-Policy)
**Severity:** High
**Category:** Security

**Evidence:**
```
curl -sI https://inkwell-lp.vercel.app/
HTTP/2 200
strict-transport-security: max-age=63072000; includeSubDomains; preload
(no other security headers present)
```
Confirmed present: `strict-transport-security` only. Confirmed absent: `x-content-type-options`, `x-frame-options`, `content-security-policy`, `referrer-policy`, `permissions-policy`. No `vercel.json` exists in the repo to configure custom headers — Vercel is serving only its platform defaults plus Astro's own HSTS default.

**Impact:** While this is not a ranking factor Google explicitly confirms, security headers are an established signal quality-evaluators / trust-heuristics increasingly factor into E-E-A-T-adjacent assessments, and their absence is flagged by Lighthouse's "Best Practices" audit, which does have a loose correlation with how Google's automated quality systems perceive a domain. More concretely: missing `X-Frame-Options`/CSP `frame-ancestors` leaves the page clickjacking-vulnerable, and missing `X-Content-Type-Options: nosniff` allows MIME-sniffing attacks. For a developer-tool landing page whose core pitch is trust ("local-first," "no telemetry," "your data stays yours"), shipping without basic hardening headers undercuts that credibility narrative if a technical visitor checks (many will — this audience inspects headers).

**Recommendation:** Add `vercel.json` at the project root:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:; script-src 'self' 'unsafe-inline' va.vercel-scripts.com" }
      ]
    }
  ]
}
```
CSP directive will need testing/tuning against the actual Vercel Analytics script origin and the inline `<script>` for the download-button OS detection and scroll-spy — confirm exact allowed origins before shipping to avoid breaking Analytics or the inline scripts (loosen `script-src`/`style-src` only as far as strictly necessary).

---

### 5. No JSON-LD structured data
**Severity:** High
**Category:** Structured Data

**Evidence:** No `<script type="application/ld+json">` present anywhere in either page's source (confirmed via full head/body scan on both `/` and `/docs`).

**Impact:** This is a software-download landing page — a prime candidate for `SoftwareApplication` structured data, which can unlock rich results (rating stars if reviews exist, price "Free," OS-availability badges) in search. Missing structured data means Google must infer everything about the product from unstructured text, and the page forfeits eligibility for enhanced SERP treatment that competitor tools (Obsidian, Notion, etc.) likely already use.

**Recommendation:** Add `SoftwareApplication` JSON-LD to the homepage:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "inkwell",
  "operatingSystem": "macOS, Windows, Linux",
  "applicationCategory": "ProductivityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "softwareVersion": "0.6.0",
  "downloadUrl": "https://github.com/coros-hq/inkwell/releases/latest",
  "url": "https://inkwell-lp.vercel.app/"
}
```
Also add `WebSite` (or `Organization`) JSON-LD, and consider `BreadcrumbList` once the docs page has more than a single flat scroll (not urgent given current 2-page/anchor-section structure). Validate with Google's Rich Results Test before shipping.

---

### 6. No Open Graph image or Twitter Card meta tags
**Severity:** High
**Category:** Indexability / Social Discoverability

**Evidence:** Confirmed via full meta-tag scan on both pages:
```
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
```
No `og:image`, `og:url`, `twitter:card`, `twitter:image`, or `twitter:title` present anywhere. `Layout.astro` (lines 19–21) only sets three OG properties.

**Impact:** Not a direct Google-ranking factor, but this is a launch-critical gap for a free/open-source tool whose primary growth channel is social sharing (Hacker News, Product Hunt, Reddit, X/Twitter, LinkedIn). Without `og:image`/`twitter:card`, every shared link renders as a bare text card with no visual — measurably lower click-through in social feeds compared to competitor tools with a proper preview card.

**Recommendation:** Generate a 1200×630 OG image (screenshot of the app window mockup already built in CSS/HTML on the homepage, or a branded card), place it at `public/og-image.png`, and extend `Layout.astro`:
```astro
<meta property="og:image" content={new URL('/og-image.png', Astro.site)} />
<meta property="og:url" content={canonicalURL} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL('/og-image.png', Astro.site)} />
```

---

## Medium Priority Issues

### 7. Version number inconsistency between pages (content-quality / trust signal)
**Severity:** Medium
**Category:** Indexability (content quality)

**Evidence:** `src/pages/index.astro` line 5: `const VERSION = "0.6.0";` — homepage advertises v0.6.0 and links downloads to `v0.6.0` GitHub release assets. `src/pages/docs.astro` line 6: `const VERSION = "0.4.8";` — docs page sidebar displays v0.4.8 and its "Download inkwell" CTA points to `/releases/latest` (not version-pinned).

**Impact:** Not a direct crawlability/indexability blocker, but inconsistent version numbers across a 2-page site is a content-quality signal that can affect user trust and, indirectly, engagement metrics Google does weigh (bounce/pogo-sticking). A visitor who reads "v0.6.0" on the homepage and "v0.4.8" in the docs sidebar seconds later reasonably questions whether the docs are stale/out of date.

**Recommendation:** Hoist `VERSION` into a single shared constant (e.g., `src/consts.ts`) imported by both pages, or drive it from `package.json`, so it can never drift again.

---

### 8. Render-blocking Google Fonts request (no self-hosting)
**Severity:** Medium
**Category:** Core Web Vitals (LCP risk)

**Evidence:** `Layout.astro` lines 24–26:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
```
`preconnect` hints are present (good — this partially mitigates the issue), and `display=swap` is used (good — avoids invisible-text FOIT). However this is still a render-blocking external stylesheet fetch plus a second-hop font-file fetch, both to third-party origins, before text can paint in its final font. Since the H1 ("Write without distraction.") is very likely the LCP element on the homepage and is set in the Inter font, this chain sits directly in the LCP critical path.

**Impact:** Needs Improvement / Poor LCP risk on slow connections or cold cache, specifically due to the two-hop external font fetch (CSS then font binary) rather than a single same-origin request. This is a source-level risk flag, not a measured Lighthouse/CrUX result — recommend confirming against real CrUX/PageSpeed Insights data before treating as a confirmed regression.

**Recommendation:** Self-host the Inter font (e.g., via `@fontsource/inter` or downloaded `.woff2` files in `public/fonts/`) and reference it with a same-origin `@font-face` + `font-display: swap`. This removes both the `fonts.googleapis.com` CSS round-trip and the cross-origin `fonts.gstatic.com` font-binary round-trip, collapsing the font-loading critical path to a single same-origin request.

---

### 9. No `X-Robots-Tag` / noindex safety net, but not currently an issue
**Severity:** Low (informational — confirmed clean, documented for completeness)
**Category:** Indexability

**Evidence:** `curl -sI` shows no `x-robots-tag` header on any response; no `<meta name="robots">` tag found in either page's source. Both pages are fully indexable as expected. This is the correct state for a 2-page marketing/docs site — flagged only to confirm it was explicitly checked and is not silently misconfigured (e.g., no accidental `noindex` left over from a Vercel preview-deployment protection setting leaking to production).

**Recommendation:** No action needed. Optionally add explicit `<meta name="robots" content="index, follow">` for clarity/documentation purposes, though this is redundant with default behavior.

---

### 10. Custom 404 page not implemented — Vercel platform default is served
**Severity:** Low
**Category:** Crawlability / UX

**Evidence:**
```
curl -sI https://inkwell-lp.vercel.app/this-does-not-exist-xyz
HTTP/2 404
content-type: text/plain; charset=utf-8
x-vercel-error: NOT_FOUND
content-length: 79
```
`content-type: text/plain` and the tiny 79-byte body confirm this is Vercel's raw platform-level 404 (not an Astro-rendered `404.astro` page with the site's branding/nav). No `src/pages/404.astro` exists in the project (confirmed: only `index.astro` and `docs.astro` in `src/pages/`).

**Impact:** Correct status code (404) is returned, which is what matters most for crawlers — no SEO penalty here. However, this is a missed UX opportunity: any mistyped/broken link (e.g., a stale GitHub README link, an old blog post pointing to a removed URL) drops the visitor onto an unbranded plaintext error with no path back into the site, increasing bounce rate on recoverable traffic.

**Recommendation:** Add `src/pages/404.astro` using the shared `Layout`, with a branded message and links back to `/` and `/docs`. Low priority but a quick win given the site already has all the components (`Layout.astro`, nav) needed to assemble it in a few minutes.

---

## Passed Checks (No Action Needed)

- **Mobile viewport meta tag:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present identically on both pages. Correct implementation.
- **`lang` attribute:** `<html lang="en">` correctly set.
- **Heading structure:** Exactly one `<h1>` per page (`Write without distraction.` on homepage, `Getting Started` on docs) — clean, single-H1 hierarchy with `<h2>`/`<h3>` used correctly for sub-sections.
- **Image alt text & explicit dimensions:** All `<img>` tags (the `inkwell-icon.svg` logo, used 3x on homepage and 2x on docs) carry `alt="inkwell"` and explicit `width`/`height` attributes — this is correct practice for CLS prevention (reserves layout space before the image loads). No image-based CLS risk identified from source inspection.
- **HTTP → HTTPS redirect:** `http://inkwell-lp.vercel.app/` returns a `308` redirect to `https://...` — properly enforced, permanent-redirect status code used correctly.
- **HSTS:** `strict-transport-security: max-age=63072000; includeSubDomains; preload` present and well-configured (2-year max-age, includeSubDomains, preload-eligible).
- **URL structure:** Clean, lowercase, no query-string cruft, no session IDs, no unnecessary nesting (`/` and `/docs` only). Case-sensitivity is handled correctly — `/DOCS` correctly 404s rather than serving duplicate content at a different case variant.
- **JavaScript rendering — confirmed NOT a SPA:** Full HTML content (~11,300+ characters of text content, all copy, all sections) is present in the raw server response before any JavaScript executes. Verified via raw `curl` (no browser/JS execution) — hero text, all 6 feature cards, all 8 theme names, canvas/planner/quicknote section copy, and full docs content are all present in the initial HTML payload. The two `<script>` tags found are: (1) a `type="module"` bundle handling OS-detection for the download button + Vercel Analytics on the homepage, and (2) an `IntersectionObserver`-based scroll-spy for the docs sidebar (`docs.astro` lines 660–674) plus Vercel Analytics. Neither is required for content to be crawlable — this is a properly server-rendered static Astro site, not a client-side-rendered SPA. No JS-rendering risk for search engine indexing.
- **Trailing-slash handling within a single URL is at least consistent:** both `/docs` and `/docs/` resolve (200, no redirect) rather than one 404ing — avoids a broken-link scenario, even though (as noted in Critical Issue #3) it does create a duplicate-content pair that canonical tags should resolve.
- **IndexNow protocol:** Not currently implemented (no evidence of ping submissions to Bing/Yandex/Naur's IndexNow endpoint), but this is a low-effort/low-priority addition appropriate only after canonical tags and sitemap.xml are fixed first — noted here rather than as a separate high-severity finding since IndexNow is a supplementary discovery accelerator, not a baseline requirement, and Google does not consume it.

---

## Prioritized Action List

| Priority | Issue | Effort |
|---|---|---|
| Critical | Add `robots.txt` | 5 min |
| Critical | Set `site` in astro.config.mjs + add `@astrojs/sitemap` + generate `sitemap.xml` | 30 min |
| Critical | Add canonical `<link>` tag to Layout.astro (fixes `/docs` vs `/docs/` duplicate) | 15 min |
| High | Add `vercel.json` security headers (nosniff, X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy) | 1–2 hrs (CSP tuning/testing) |
| High | Add `SoftwareApplication` + `WebSite` JSON-LD | 1 hr |
| High | Add `og:image` + Twitter Card meta tags (design + implement) | 2–3 hrs (image design) |
| Medium | Fix VERSION inconsistency (0.6.0 vs 0.4.8) — single source of truth | 15 min |
| Medium | Self-host Inter font to remove render-blocking third-party font chain | 1 hr |
| Low | Add branded `src/pages/404.astro` | 30 min |
| Low | Submit sitemap to IndexNow after sitemap.xml exists | 15 min |
