# Action Plan — inkwell-lp.vercel.app

**Updated:** 2026-09-20. Phase 1 items from the July audit are all done (see strikethrough note below). This plan covers what's left. See `FULL-AUDIT-REPORT.md` and `findings/*.md` for full evidence.

---

## Done since July (no action needed)

~~Fix VERSION mismatch~~ · ~~Rewrite title/meta for all 3 platforms~~ · ~~Add robots.txt~~ · ~~Set `site` + canonical tags~~ · ~~Add JSON-LD~~ · ~~Add og:image/Twitter Cards~~ · ~~Add security headers~~ · ~~Windows/Linux install steps in docs~~ · ~~Add Privacy page~~ · ~~Add llms.txt~~

---

## Phase 1: Quick Fixes (this week)

| # | Item | Severity | Effort |
|---|---|---|---|
| 1 | Self-host Inter font + `@font-face`, drop redundant Google Fonts preconnect — **recommended twice now, still not done, highest-leverage remaining fix** | High | ~1 hr |
| 2 | Fix `/docs` JSON-LD `url` field (currently points at homepage instead of `/docs/`) | High | 30 min |
| 3 | Replace `/docs` and `/privacy` duplicated `SoftwareApplication` schema with the page-appropriate `WebPage` block (ready-to-paste code in `findings/schema.md`) | High | 1 hr |
| 4 | Add 308 redirect `/docs` → `/docs/` in `vercel.json`, fix internal nav link that still points to non-slash path | Medium | 30 min |
| 5 | Harden CSP `style-src` (currently `unsafe-inline`; `script-src` was already hashed correctly) | Medium | 30-60 min |
| 6 | Declare an actual open-source license — GitHub repo + site footer | High (trust) | 30 min |

---

## Phase 2: Structural Improvements (next 2-3 weeks)

| # | Item | Severity | Effort |
|---|---|---|---|
| 7 | Add `Organization` + `WebSite` JSON-LD sitewide (ready-to-paste code in `findings/schema.md`) | Medium | 1 hr |
| 8 | Add heading `id` attributes to all H2/H3 on `/docs` (only 1 of 47 headings currently has one) — also unlocks better llms.txt cross-referencing | Medium | 1-2 hrs |
| 9 | Add a branded `src/pages/404.astro` | Low | 30 min |
| 10 | Implement IndexNow (now unblocked since sitemap exists) | Low | 1 hr |
| 11 | Re-verify on-page state: is Claude MCP still buried as an equal-weight tile? Does mobile nav still hide Features/Canvas/Themes/Docs? (unconfirmed either way this cycle) | Medium | verification only |

---

## Phase 3: Content & Authority (month 2)

| # | Item | Severity | Effort |
|---|---|---|---|
| 12 | Build a dedicated comparison page ("inkwell vs Obsidian") with a feature matrix — reconfirmed live as the single highest-ROI content gap; still absent | High (strategic) | 1-2 days |
| 13 | Add a named maintainer / lightweight About identity — Authoritativeness is still the weakest E-E-A-T factor (38/100) | Medium | 1-2 hrs |
| 14 | Refresh the stale static example date in the docs "Abbreviations" section | Low | 15 min |
| 15 | On-site naming disambiguation vs. Wikipedia's unrelated "Inkwell (software)" (Apple feature) — still unresolved | Medium | 1 hr |
| 16 | Reframe key `/docs` headings as question-form + trim to 134-167 word self-contained citation blocks where natural | Low | 2-3 hrs |
| 17 | Register a custom domain, 301-redirect from `vercel.app` — still unresolved structural liability | High (structural) | Half day + DNS propagation |

---

## Phase 4: Monitoring & Next-Cycle Re-Verification

| # | Item | Notes |
|---|---|---|
| 18 | Run a full, uninterrupted SXO re-pass (this cycle's hit its turn limit before completing SERP repull/persona re-scoring) | Score carried over unverified at 54/100 |
| 19 | Run a dedicated On-Page + Visual/mobile re-audit (not independently re-run this cycle) | Current 72/100 is a cross-referenced estimate, not a fresh score |
| 20 | Re-check Common Crawl / backlink baseline next quarter | — |
| 21 | Re-verify CWV against real CrUX/PSI field data once traffic history exists | — |

---

## Effort vs. Impact Summary

**Do first:** Items 1-6 — the font fix (#1) has now been recommended in two consecutive audits with zero movement; it's the single biggest lever still on the table. Items 2-3 are correctness bugs in work that already shipped, not new scope.

**Highest strategic ceiling, still open:** Item 12 (comparison content) — unchanged from July, reconfirmed live absent this cycle.

**Fastest trust win:** Item 6 (license) — zero design work, closes the single biggest E-E-A-T gap identified this cycle.
