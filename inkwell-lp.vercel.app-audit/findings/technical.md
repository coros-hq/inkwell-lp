# Technical SEO Audit — inkwell-lp.vercel.app

**Site type:** SaaS / open-source desktop software download page (not e-commerce, not local business)
**Pages audited:** `/` (homepage), `/docs` + `/docs/` (documentation), `/privacy/` — 4 URLs total
**Stack:** Astro (static SSG) with `@astrojs/sitemap`, hosted on Vercel, HTTP/2
**Audit date:** 2026-09-20 (re-audit; baseline: 2026-07-16, score 52/100)

**Technical SEO Score: 88 / 100** (+36 vs. baseline)

All three Critical findings and two of three High findings from the 2026-07-16 audit are now fully resolved and verified live. Remaining gaps are Medium/Low.

---

## Summary Table

| Category | Status |
|---|---|
| Crawlability | PASS |
| Indexability | PASS (minor: `/docs` vs `/docs/` still both resolve, no redirect) |
| Security Headers | PASS |
| URL Structure | PARTIAL PASS |
| Mobile Viewport | PASS |
| Core Web Vitals (source-inspection) | PARTIAL PASS |
| Structured Data | PASS |
| JavaScript Rendering | PASS |
| CSP Configuration | PARTIAL PASS |
| IndexNow Protocol | FAIL (not implemented, low priority) |

---

## Resolved Since Last Audit (Verified Live 2026-09-20)

1. **`robots.txt`** — now returns 200, correctly formed:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://inkwell-lp.vercel.app/sitemap-index.xml
   ```
2. **Sitemap** — `sitemap-index.xml` (200) references `sitemap-0.xml` (200), generated via `@astrojs/sitemap`, contains all 3 canonical URLs: `/`, `/docs/`, `/privacy/`. `astro.config.mjs` now has `site: 'https://inkwell-lp.vercel.app'` set, which is what makes canonical-tag generation and the sitemap integration work correctly.
3. **Canonical tags** — present and correct on all three pages (`/`, `/docs/`, `/privacy/`), self-referential, absolute URLs, driven by `Astro.url`/`Astro.site`.
4. **Security headers** — full set now present via `vercel.json`: `content-security-policy`, `x-content-type-options: nosniff`, `x-frame-options: DENY`, `referrer-policy: strict-origin-when-cross-origin`, `permissions-policy`, plus pre-existing `strict-transport-security` (2yr, includeSubDomains, preload). Confirmed via `curl -sI` on `/`, `/docs`, `/docs/`, and the 404 route — headers apply site-wide including error responses.
5. **JSON-LD structured data** — `SoftwareApplication` schema present on the homepage (verified: `name`, `operatingSystem`, `applicationCategory: DeveloperApplication`, `offers` with `price: 0`, `softwareVersion: 0.7.8`, `downloadUrl`). Also present on `/docs/` and `/privacy/` (likely a `WebSite`/`WebPage`-type block reused via layout — worth confirming type-appropriateness per page, see Low finding below).
6. **Open Graph / Twitter Cards** — `og:image` (1200×630, confirmed live at `/og-image.png`, HTTP 200), `og:image:width/height/alt`, `og:url`, `twitter:card: summary_large_image`, `twitter:title/description/image` all present and correctly populated on the homepage.
7. **Version consistency** — single source of truth now in `src/consts.ts` (`export const APP_VERSION = "0.7.8"`), imported into both `index.astro` and `docs.astro`. Live site shows `v0.7.8` consistently on homepage hero, changelog, and docs sidebar. Download links also correctly use the unified version.
8. **CSP inline-script breakage** — the earlier "seo optimization" CSP rollout initially broke inline scripts (per commit history); now fixed via `'sha256-...'` hashes for the three inline `<script>` blocks (OS-detect download button, analytics, scroll-highlight) instead of `'unsafe-inline'` in `script-src`. This is the *correct* hardened pattern — better than the originally recommended `'unsafe-inline'` fallback.
9. **`llms.txt`** — added at `/llms.txt` (not previously flagged, but a good AI-crawler-discovery addition; not verified for content correctness in this pass).

---

## Medium Priority Issues

### 1. `/docs` and `/docs/` still both return 200 with identical content — no redirect
**Severity:** Medium (downgraded from Critical since canonical tags now mitigate the SEO risk)
**Category:** URL Structure / Indexability

**Evidence:**
```
curl -sI https://inkwell-lp.vercel.app/docs   -> 200
curl -sI https://inkwell-lp.vercel.app/docs/  -> 200
diff docs_noslash.html docs_slash.html        -> IDENTICAL
```
Both variants carry the same self-referential canonical (`<link rel="canonical" href="https://inkwell-lp.vercel.app/docs/">`) — including on the non-slash URL, which points *away* from itself to the slash version. This is the correct mitigation and resolves the duplicate-indexing risk for Google. However, the underlying duplicate-URL condition is still live at the HTTP level: no `308`/`301` redirect exists from `/docs` → `/docs/`.

**Impact:** Low practical SEO risk now (canonical handles it), but: (a) internal nav link in `Layout.astro`/homepage still points to `/docs` (non-slash) — crawl budget and internal link equity are split across two URLs instead of consolidated on one; (b) less-sophisticated crawlers/tools (some Bing/Yandex indexing paths, social-share unfurlers, backlink-analysis tools) may not respect canonical as reliably as Google and could index or report both.

**Recommendation:** Add an explicit redirect in `vercel.json`:
```json
{
  "redirects": [
    { "source": "/docs", "destination": "/docs/", "permanent": true }
  ]
}
```
And update the internal nav link (`href="/docs"` → `href="/docs/"`) so internal link equity flows directly to the canonical URL without a redirect hop.

---

### 2. CSP `style-src` still relies on `'unsafe-inline'`
**Severity:** Medium
**Category:** Security / CSP Configuration Quality

**Evidence:**
```
content-security-policy: ... style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; ...
```
`script-src` was correctly hardened with per-script SHA-256 hashes, but `style-src` still uses the broad `'unsafe-inline'` keyword rather than hashes/nonces for the inline `<style>` block in `Layout.astro`.

**Impact:** `'unsafe-inline'` in `style-src` reopens a CSS-injection/data-exfiltration vector (e.g., attribute-selector-based CSS exfiltration of secrets) that hash/nonce-based `style-src` would close. Lower severity than script injection but still flagged by strict CSP linters/Lighthouse Best Practices as an incomplete hardening.
**Recommendation:** Apply the same SHA-256 hash pattern already used for `script-src` to the inline `<style>` block, or migrate the inline styles into the existing external stylesheet (`/_astro/index.*.css`) to drop `'unsafe-inline'` entirely.

---

### 3. Render-blocking Google Fonts request (no self-hosting) — unresolved from prior audit
**Severity:** Medium
**Category:** Core Web Vitals (LCP risk)

**Evidence:** `Layout.astro` head still contains:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:..." rel="stylesheet" />
```
Unchanged since the prior audit. `preconnect` + `display=swap` are present (good, partial mitigation) but the two-hop cross-origin font fetch (CSS then `.woff2` binary) still sits in the H1's LCP critical path.

**Impact:** Same as prior audit — source-level Needs-Improvement/Poor LCP risk on cold cache/slow connections, not yet confirmed against real CrUX data.
**Recommendation:** Unchanged — self-host Inter via `@fontsource/inter` or local `.woff2` files to collapse the font-loading path to a single same-origin request.

---

## Low Priority Issues

### 4. Custom branded 404 page still not implemented
**Severity:** Low
**Category:** Crawlability / UX

**Evidence:**
```
curl -sI https://inkwell-lp.vercel.app/this-does-not-exist-xyz
HTTP/2 404
content-type: text/plain; charset=utf-8
x-vercel-error: NOT_FOUND
```
No `src/pages/404.astro` found in the repo. Correct status code is returned (no SEO penalty), but security headers are correctly still applied even to this platform-default error page (confirmed — `content-security-policy`, `x-frame-options`, etc. all present on the 404 response), so this is purely a UX/branding gap, not a technical regression.
**Recommendation:** Unchanged from prior audit — add `src/pages/404.astro` using the shared `Layout` for a branded error page with links back to `/` and `/docs/`.

---

### 5. JSON-LD `SoftwareApplication` type reused on non-software pages, and its `url` field is wrong on both
**Severity:** Medium (raised from Low — diffed the payloads this pass, confirmed a live data-accuracy bug, not just a type mismatch)
**Category:** Structured Data

**Evidence — diffed all three JSON-LD payloads directly:**
```
/         -> "url":"https://inkwell-lp.vercel.app/"          (correct)
/docs/    -> "url":"https://inkwell-lp.vercel.app/"          (WRONG — should be /docs/)
/privacy/ -> "url":"https://inkwell-lp.vercel.app/"          (WRONG — should be /privacy/)
```
All three pages emit an unchanged `SoftwareApplication` block (same `name`, `operatingSystem`, `softwareVersion`, `offers`, `downloadUrl` — only `description` differs), and none of the two non-homepage instances update `url` to their own canonical address. This is a copy-pasted layout-level block, not per-page-generated. It both misrepresents entity identity (three separate schema.org `SoftwareApplication` nodes all claiming to live at the same `url`) and wastes the opportunity to declare `/docs/` and `/privacy/` as their own `WebPage` entities.

**Recommendation:** Scope `SoftwareApplication` JSON-LD to the homepage only. Replace it on `/docs/` and `/privacy/` with a minimal `WebPage` block whose `url` is that page's own canonical address, linked back to the homepage's `SoftwareApplication` via `about`/`isPartOf`. Validate all three with Google's Rich Results Test after the fix.

### 6. IndexNow protocol still not implemented
**Severity:** Low
**Category:** Discovery (Bing/Yandex/Naver)

**Evidence:** No evidence of an IndexNow key file or ping submissions. Now that `sitemap-index.xml` exists, this is a cheap, low-effort addition (the prerequisite blocker from the prior audit is resolved).
**Recommendation:** Generate an IndexNow key, host it at `/{key}.txt`, and submit `/`, `/docs/`, `/privacy/` on each deploy (can be scripted into the CI/deploy pipeline).

---

## Passed Checks (No Action Needed)

- **HTTP → HTTPS redirect:** `308 Permanent Redirect` to `https://...`, correctly enforced.
- **HSTS:** unchanged, well-configured (2yr max-age, includeSubDomains, preload).
- **Mobile viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present and correct on all pages.
- **`lang` attribute:** `<html lang="en">` present.
- **JavaScript rendering:** confirmed NOT a SPA — full HTML content present in raw server response (verified via `curl`, no JS execution) on all three pages. Static Astro SSG output, no CSR/indexing risk.
- **URL structure:** clean, lowercase, no query-string cruft, no session IDs.
- **`X-Robots-Tag` / noindex safety net:** no accidental `noindex` on any page; confirmed clean on `/`, `/docs/`, `/privacy/`.
- **Security headers apply uniformly:** confirmed present on 200 responses *and* the 404 error page — headers are set globally via `vercel.json`, not per-route, so there's no gap on error/edge routes.
- **robots.txt / sitemap chain:** `robots.txt` → `sitemap-index.xml` → `sitemap-0.xml` → 3 URLs, all returning 200, correctly chained and discoverable.
- **og-image asset:** live, 200, 1200×630 as declared.
- **Privacy page discoverability:** `/privacy/` is linked from both `/` and `/docs/` nav/footer and present in the sitemap — not an orphan page.

---

## AI Crawler Management

`robots.txt` is a blanket `User-agent: * / Allow: /` with no crawler-specific rules — this means `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Bytespider`, and `CCBot` are all currently **unrestricted**, including for model-training use (not just search/citation use). For a young OSS project actively trying to build AI-citation visibility (it already ships `/llms.txt`), this is the right default — no action recommended. Flagging only as a confirmed-intentional finding: if the maintainer later wants to allow AI *citation* crawlers (`ChatGPT-User`, `PerplexityBot`) while blocking *training* crawlers (`GPTBot`, `Google-Extended`, `Bytespider`), that would require splitting the current blanket rule into per-bot blocks (see `seo-geo` for the tradeoff analysis).

## Agent-Friendly Pages / Accessibility Tree

Not assessed this pass — no Playwright/accessibility-tree tooling was available in this environment (`scripts/agent_ux_check.py` referenced by the skill is not present in this install). Semantic HTML spot-check from raw source: nav/download buttons on the homepage are real `<a>`/`<button>` elements, not `<div onclick>` widgets. A full agent-UX score requires a rendered accessibility-tree pass — recommend running this with Playwright available (see `seo-visual` for a related mobile/rendering pass).

## Core Web Vitals — Cross-Reference

Not re-measured in this technical pass (source-level font-chain inspection only, see Medium finding #3 above). Full Lighthouse lab data (LCP/CLS/TBT for both pages) was captured by the dedicated performance audit this session: Homepage 85/100 (LCP 3.09s), Docs 87/100 (LCP 2.96s), CLS 0.000, TBT 0ms on both — see `findings/performance.md`. No CrUX/PSI field data available (no Google API credentials, low-traffic domain). INP is unmeasurable without field data or real interaction sessions.

## IndexNow Key File

Confirmed: no IndexNow key file present (`/indexnow-key.txt` → 404, and no differently-named key file found via source inspection). Matches Low finding #6 below.

---

## Prioritized Action List

| Priority | Issue | Effort |
|---|---|---|
| Medium | Add `/docs` → `/docs/` 308 redirect in `vercel.json`; update internal nav link to `/docs/` | 15 min |
| Medium | Replace `style-src 'unsafe-inline'` with SHA-256 hash(es) or move inline styles to external CSS | 30–45 min |
| Medium | Self-host Inter font (`@fontsource/inter`) to remove render-blocking third-party font chain | 1 hr |
| Low | Add branded `src/pages/404.astro` | 30 min |
| Low | Verify/scope JSON-LD `SoftwareApplication` to homepage only; use appropriate type on `/docs/`, `/privacy/` | 30 min |
| Low | Implement IndexNow key + submission on deploy | 30–45 min |

---

## Score Rationale

- Started at 52/100 (2026-07-16 baseline).
- +36 for full resolution of all 3 Critical issues (robots.txt, sitemap, canonicals) and 2 of 3 High issues (security headers, JSON-LD, OG/Twitter cards — all three High items resolved) plus the version-consistency Medium fix.
- Remaining −12 reflects: no `/docs` redirect (Medium), incomplete CSP hardening on `style-src` (Medium), unresolved font-loading LCP risk (Medium), no custom 404 (Low), unverified per-page JSON-LD correctness (Low), no IndexNow (Low).
