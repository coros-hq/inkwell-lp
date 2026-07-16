# Action Plan — inkwell-lp.vercel.app

Prioritized by severity and effort. See `FULL-AUDIT-REPORT.md` and `findings/*.md` for full evidence and reasoning behind each item.

---

## Phase 1: Critical Fixes (Week 1)

| # | Item | Severity | Effort | Files touched |
|---|---|---|---|---|
| 1 | Fix `VERSION` constant mismatch (0.6.0 vs 0.4.8) — hoist to a single shared source of truth | Critical | 15 min | `src/pages/index.astro`, `src/pages/docs.astro` |
| 2 | Rewrite title tag + meta description to mention macOS, Windows, and Linux | Critical | 15 min | `src/layouts/Layout.astro`, page props |
| 3 | Add `public/robots.txt` | Critical | 5 min | `public/robots.txt` (new) |
| 4 | Set `site` in `astro.config.mjs`, add `@astrojs/sitemap`, add canonical tags to `Layout.astro` (also resolves `/docs` vs `/docs/` duplicate) | Critical | 1 hr | `astro.config.mjs`, `src/layouts/Layout.astro` |
| 5 | Fix `/docs` mobile layout: constrain `.docs-sidebar` to `width:100%` and collapse the grid to a single column below the mobile breakpoint | Critical | 1-2 hrs | `src/pages/docs.astro` (or its CSS) |

---

## Phase 2: High-Impact Improvements (Weeks 2-3)

| # | Item | Severity | Effort |
|---|---|---|---|
| 6 | Add generated `SoftwareApplication` + `WebSite` + `Organization` JSON-LD to homepage; minimal `WebPage` JSON-LD to `/docs` (ready-to-paste code in `findings/schema.md`) | High | 1-2 hrs |
| 7 | Add `og:image`, `og:url`, `twitter:card` meta tags — design a 1200×630 social preview image | High | 2-3 hrs |
| 8 | Add `vercel.json` security headers (`X-Content-Type-Options`, `X-Frame-Options`, CSP, `Referrer-Policy`, `Permissions-Policy`) — test CSP against Vercel Analytics and inline scripts before shipping | High | 1-2 hrs |
| 9 | Self-host the Inter font to remove the render-blocking Google Fonts chain | Medium | 1 hr |
| 10 | Update `/docs` "Getting Started" section with Windows and Linux install steps | Medium | 1-2 hrs |

---

## Phase 3: Content & Authority (Month 2)

| # | Item | Severity | Effort |
|---|---|---|---|
| 11 | Add a minimal Privacy statement and declare an open-source license (site + GitHub repo) | Medium | 1-2 hrs |
| 12 | Add heading `id` attributes to every H2/H3 on `/docs`, then build `/llms.txt` using the 9 sections as the outline (draft in `findings/geo.md`) | Medium | 1-2 hrs |
| 13 | Build a dedicated comparison page/section ("inkwell vs Obsidian") with a feature matrix — highest-ROI content gap identified in the audit | High (strategic) | 1-2 days |
| 14 | Promote Claude MCP integration to its own homepage section with a CTA to `/docs#claude-mcp` | Medium | 2-3 hrs |
| 15 | Surface GitHub star count on the homepage as a trust signal | Low | 30 min |
| 16 | Register a custom domain and 301-redirect from the `vercel.app` subdomain before backlink volume grows | High (structural) | Half day + DNS propagation |

---

## Phase 4: Monitoring & Iteration (Ongoing)

| # | Item | Severity | Effort |
|---|---|---|---|
| 17 | Add a branded `src/pages/404.astro` | Low | 30 min |
| 18 | Add a mobile nav menu (hamburger/drawer) for the homepage so Features/Canvas/Themes/Docs remain reachable on mobile | Medium | 2-3 hrs |
| 19 | Re-verify Core Web Vitals against real CrUX/PSI field data once Google API credentials or sufficient traffic history are available | Info | — |
| 20 | Re-check Common Crawl domain presence next quarter as the site accumulates backlinks | Info | — |
| 21 | Consider adding a free Moz API key for a real Tier 1 backlink baseline | Low | 15 min |

---

## Effort vs. Impact Summary

**Do first (< 30 min each, outsized impact):** Items 1, 2, 3, 15 — pure copy/config fixes with no design or infra work.

**Highest strategic ceiling, highest effort:** Item 13 (comparison content) — the audit's SXO analysis identifies this as the single biggest gap between the site's current page-type coverage and its realistic search-demand intent (e.g. "obsidian alternative" queries are dominated by comparison listicles, which the site currently cannot compete for at all).

**Most likely to move a Lighthouse/CWV number today:** Item 9 (self-host fonts) — real Lighthouse data shows ~1,920-2,170ms of available LCP savings from this single change.
