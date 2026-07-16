# Sitemap Audit — inkwell-lp.vercel.app

Date: 2026-07-16
Site type: Astro v6 static site, SaaS/software product landing page
Pages: 2 (`/`, `/docs`)

## Summary

No sitemap and no robots.txt currently exist. For a 2-page static site this is low-severity in isolation (Google can crawl 2 linked pages fine without either file), but both are trivial to add correctly with the `@astrojs/sitemap` integration, and a `robots.txt` gives an explicit, low-cost signal to crawlers. Recommendation: **add both**, take ~10 minutes, no downside, and it future-proofs the site as pages are added (e.g. changelog, pricing, blog).

## Validation Report

| Check | Result | Notes |
|---|---|---|
| `/sitemap.xml` reachable | FAIL (404) | Confirmed via live `curl`: `sitemap.xml: 404` |
| `/sitemap-index.xml` reachable | FAIL (404) | Also checked in case of split-index naming; not present |
| `/robots.txt` reachable | FAIL (404) | Confirmed via live `curl`: `robots.txt: 404` |
| XML validity | N/A | No sitemap file exists to validate |
| ≤50,000 URL limit | PASS (trivially) | Site has 2 pages total; nowhere near the limit, no index-splitting needed |
| Non-200 URLs in scope | PASS | `curl` confirms both `/` and `/docs` return HTTP 200 |
| Noindexed pages | PASS (none found) | No `noindex` meta tags encountered in the two page sources reviewed |
| Redirected URLs | PASS (none) | No redirects observed on the 2 known routes |
| lastmod accuracy | N/A | No sitemap exists yet; see recommendation below on lastmod strategy |
| priority / changefreq | N/A | Not applicable — recommend omitting these deprecated/ignored tags in the generated sitemap |
| `astro.config.mjs` — `site` property | FAIL (missing) | Required by `@astrojs/sitemap` to emit absolute `<loc>` URLs. Currently: `defineConfig({})` with no `site` key |
| `@astrojs/sitemap` integration installed | FAIL (not in package.json) | `package.json` dependencies are only `@vercel/analytics` and `astro` |
| Build output check (`dist/`) | Confirmed | `dist/` contains `index.html` and `docs/index.html` only — no `sitemap.xml` or `robots.txt` emitted, consistent with the missing integration |

## Crawl vs. Sitemap Coverage

- **Pages found in source/crawl:** `/` (homepage), `/docs` (documentation) — both verified live at HTTP 200.
- **Pages in sitemap:** none (sitemap does not exist).
- **Missing from sitemap:** `/`, `/docs` (100% of site, since there is no sitemap).
- **Extra/orphaned entries in sitemap:** none (nothing to prune).

## Quality Gate Assessment (Location Pages)

Not applicable. This is a 2-page marketing/docs site with zero programmatically generated location or "best X for Y" pages. Both the 30+ page WARNING threshold and the 50+ page HARD STOP are irrelevant here — total page count (2) is far below any doorway-page risk threshold. No user justification is required. This gate should simply be re-checked if the site later adds programmatic pages (e.g., per-integration or per-city pages).

## Is a Sitemap Actually Warranted Here?

Short answer: **not strictly necessary for discoverability, but recommended as a best practice with near-zero cost.**

Reasoning:
- With only 2 pages, both directly linked from the homepage nav, Googlebot will discover and index both pages via normal crawling even with no sitemap and no robots.txt. A sitemap's main value (helping crawlers find pages that are hard to discover through links, or signalling freshness at scale) doesn't move the needle at n=2.
- However: (a) the integration takes one config change and one dependency install, (b) it auto-regenerates on every build so it never goes stale as pages are added, (c) it removes any ambiguity for crawlers/tools that check for it, and (d) `robots.txt` costs nothing and is a standard expectation — its absence is sometimes flagged by SEO tooling/auditors even when harmless in practice.
- There are no location pages, no programmatic content, and no doorway-page risk on this site, so none of the quality-gate concerns apply — this is purely a "nice to have, low effort" fix, not a risk-mitigation.

**Recommendation: Add `@astrojs/sitemap` + a static `robots.txt`.** Low effort, no downside, improves baseline SEO hygiene, and scales automatically if the site grows.

## Implementation Steps

### 1. Install the integration

```bash
npx astro add sitemap
```

or manually:

```bash
npm install @astrojs/sitemap
```

### 2. Update `astro.config.mjs`

Current file (`/Users/ayphone/Documents/side_projects/inkwell-lp/astro.config.mjs`):

```js
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
```

Required change — add the `site` property (mandatory for absolute `<loc>` URLs) and register the integration:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://inkwell-lp.vercel.app',
  integrations: [sitemap()],
});
```

Notes:
- Without `site`, `@astrojs/sitemap` will emit relative or malformed URLs (or fail to build the sitemap correctly) — this is the most common misconfiguration for this integration.
- No `filter` or `customPages` options are needed here since both existing routes (`/`, `/docs`) are static pages that Astro will pick up automatically at build time.
- Do not add `priority` or `changefreq` — Google ignores both; the integration does not emit them by default, so no extra config needed to keep the sitemap clean.
- On build, this will generate `dist/sitemap-index.xml` (index) and `dist/sitemap-0.xml` (actual URL list) — normal behavior for the integration even with only 2 URLs, well under the 50,000 per-file limit. If a single flat `sitemap.xml` is strongly preferred, that would require a custom sitemap page instead of the integration's default output; not recommended for this case — the small index+chunk output is standard Astro behavior and Google handles it natively.

### 3. Add `public/robots.txt`

Create `/Users/ayphone/Documents/side_projects/inkwell-lp/public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://inkwell-lp.vercel.app/sitemap-index.xml
```

Rationale:
- Public marketing/docs site, no admin panel, no private/authenticated routes, no staging paths — `Allow: /` for all user agents is correct with nothing to disallow.
- Reference the sitemap **index** URL (`sitemap-index.xml`), which is what `@astrojs/sitemap` actually generates at the site root, not a bare `sitemap.xml` (which won't exist under this integration's default output).

### 4. Rebuild and verify

```bash
npm run build
ls dist/sitemap-index.xml dist/sitemap-0.xml dist/robots.txt
```

After deploying to Vercel, re-check:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://inkwell-lp.vercel.app/sitemap-index.xml
curl -s -o /dev/null -w "%{http_code}\n" https://inkwell-lp.vercel.app/robots.txt
```

Both should return `200` post-deploy.

## Structured Findings (for audit-data.json)

```json
{
  "category": "Sitemap",
  "site": "https://inkwell-lp.vercel.app/",
  "page_count": 2,
  "checks": [
    {"check": "sitemap.xml reachable", "severity": "High", "status": "fail", "detail": "404 — no sitemap exists"},
    {"check": "robots.txt reachable", "severity": "Medium", "status": "fail", "detail": "404 — no robots.txt exists"},
    {"check": "astro.config.mjs site property set", "severity": "High", "status": "fail", "detail": "Missing — required for @astrojs/sitemap absolute URLs"},
    {"check": "@astrojs/sitemap installed", "severity": "Medium", "status": "fail", "detail": "Not present in package.json dependencies"},
    {"check": "URL count under 50k limit", "severity": "Critical", "status": "pass", "detail": "2 URLs total"},
    {"check": "All known URLs return 200", "severity": "High", "status": "pass", "detail": "/ and /docs both verified HTTP 200"},
    {"check": "Noindexed URLs present", "severity": "High", "status": "pass", "detail": "None found"},
    {"check": "Redirected URLs present", "severity": "Medium", "status": "pass", "detail": "None found"},
    {"check": "priority/changefreq present", "severity": "Info", "status": "n/a", "detail": "No sitemap exists; recommend omitting on generation (Google ignores both)"},
    {"check": "Location page quality gate", "severity": "Info", "status": "n/a", "detail": "0 location pages; far below 30+ warning and 50+ hard-stop thresholds"}
  ],
  "missing_pages_in_sitemap": ["https://inkwell-lp.vercel.app/", "https://inkwell-lp.vercel.app/docs"],
  "extra_pages_in_sitemap": [],
  "recommendation": "Add @astrojs/sitemap integration with site property set in astro.config.mjs, and add public/robots.txt referencing the generated sitemap-index.xml. Low effort, no downside, not urgent given site size but improves baseline SEO hygiene and scales automatically as pages are added.",
  "quality_gate_triggered": false
}
```
