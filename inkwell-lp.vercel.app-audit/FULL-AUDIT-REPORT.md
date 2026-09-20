# SEO Audit — inkwell-lp.vercel.app

**Audit date:** 2026-09-20 (re-audit; prior baseline 2026-07-16)
**Business type:** SaaS / open-source desktop software — free local-first markdown editor for macOS, Windows, and Linux
**Site scope:** 3 pages (`/` homepage, `/docs`, `/privacy` — new since July), Astro v6 static site, hosted on Vercel

## SEO Health Score: 77 / 100 (up from 55 / 100)

| Category | Weight | Score (Jul → Sep) |
|---|---|---|
| Technical SEO | 22% | 52 → **88** |
| Content Quality | 23% | 54 → **78** |
| On-Page SEO | 20% | 58 → **72**\* |
| Schema / Structured Data | 10% | 28 → **58** |
| Performance (CWV) | 10% | 87 → **86** |
| AI Search Readiness (GEO) | 10% | 42 → **61** |
| Images | 5% | 82 → **92** |

\*On-Page and Images were not re-run as standalone specialist passes this cycle; scores are adjusted from cross-referenced evidence in the Technical/Content/Schema findings (title/meta fix, og:image confirmed live) rather than an independent re-audit. Treat as directional, not final.

Supplementary: Search Experience (SXO) — 54/100, **carried over from July, not independently re-verified this cycle** (the SXO pass hit a turn limit before completing a fresh SERP pull; the one thing it did re-confirm live is that no comparison/alternatives page exists yet). Authority & Backlinks — still no numeric score; the core structural finding (no custom domain) is unchanged.

---

## Executive Summary

This is a genuinely strong turnaround. Every Critical finding from the July audit is fixed, and 2 of 3 prior High findings are resolved. The site went from a fast-shipped launch page with foundational gaps to a technically solid, well-secured, mostly-consistent site in about two months. The remaining gaps are now second-tier: a font-loading performance fix that was recommended twice and still isn't done, two schema correctness bugs, an unaddressed license/authority trust gap, and a still-unbuilt comparison page that stays the single highest-strategic-ROI content gap.

### What got fixed (verified live)
1. **robots.txt + sitemap-index.xml** both live and correct (3 URLs: `/`, `/docs/`, `/privacy/`).
2. **Canonical tags** present on all 3 pages, driven by `site` now being set in `astro.config.mjs`.
3. **Full security header suite** live: CSP (script-src hardened with SHA-256 hashes, not `unsafe-inline`), HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy — even on the 404 response.
4. **JSON-LD `SoftwareApplication`** schema added sitewide (was zero before).
5. **og:image** (1200×630) + full Twitter Card meta now live — social shares are no longer bare text cards.
6. **Version mismatch eliminated** — single source of truth in `src/consts.ts` (`APP_VERSION="0.7.8"`), consistent everywhere.
7. **Meta description fixed** — now names macOS, Windows, and Linux (was "for macOS" only).
8. **`/docs` install steps** now cover all three platforms, not just macOS.
9. **New `/privacy` page**, linked in both footers, with specific verifiable claims.
10. **`/llms.txt`** now live and well-formed.

### Top 5 Remaining Issues

1. **Font-loading LCP fix still not implemented** — recommended in July, re-confirmed unresolved by two independent passes. Both pages still load Inter via `fonts.googleapis.com` → `fonts.gstatic.com`; LCP is flat at ~2.96–3.09s (Needs Improvement) despite `preconnect` hints being added as a side effect of the CSP work. This remains the single highest-leverage performance fix available.
2. **`/docs` JSON-LD `url` field points at the homepage**, not its own canonical `/docs/` — a copy-paste bug in the new schema work. Compounding it, `/docs` duplicates the exact homepage `SoftwareApplication` block instead of using a page-appropriate type, creating entity ambiguity.
3. **No open-source license declared**, on-site or in the GitHub repo, despite "open source" being part of the product's marketing claim — now the single biggest remaining trust/E-E-A-T gap (Authoritativeness scores 38/100, the weakest sub-factor).
4. **`/docs` vs `/docs/` still both return 200** with identical content and no redirect — canonical tags mitigate but don't eliminate this; internal nav still links to the non-slash path.
5. **No comparison/alternatives content** ("inkwell vs Obsidian") — re-confirmed live absent. High-intent queries like "obsidian alternative" remain structurally unaddressable by a single-product landing page.

### Top 5 Quick Wins

1. Self-host the Inter font + `@font-face`, drop the now-redundant Google Fonts preconnect tags (~1 hr, should push LCP into "Good" on both pages — do this now, it's been sitting since July).
2. Fix the `/docs` JSON-LD `url` field to `https://inkwell-lp.vercel.app/docs/` and differentiate its schema type from the homepage block (~30 min).
3. Add a 308 redirect from `/docs` → `/docs/` in `vercel.json`, and fix the internal nav link (~30 min).
4. Declare an actual open-source license on the repo and site footer (~30 min, no design work).
5. Harden `style-src` in the CSP (currently still `unsafe-inline`, unlike the properly hashed `script-src`) (~30–60 min).

---

## Technical SEO — 88/100

**What works:** robots.txt + sitemap live and correct; canonical tags on all 3 pages; full security header suite including hardened CSP script-src; JSON-LD present; og:image + Twitter Cards live; version consistency fixed via `src/consts.ts`.

**Medium:**
- `/docs` and `/docs/` still both return 200 with identical content, no redirect.
- CSP `style-src` still uses `unsafe-inline` (script-src was hardened, style-src was not) — CSS-injection/exfiltration vector remains open.
- Google Fonts still render-blocking/cross-origin (see Performance).

**Low:**
- No branded `404.astro` — Vercel's plaintext default still serves (correct status code though).
- JSON-LD detected on `/docs/` and `/privacy/` too but not diffed per page — worth confirming `SoftwareApplication` isn't wrongly reused on non-software pages (it is, on `/docs` — see Schema).
- IndexNow protocol not implemented (now unblocked since sitemap exists, low effort).

Full detail: [`findings/technical.md`](findings/technical.md)

---

## Content Quality — 78/100

**What works:** Version consistency, meta description fixed, `/docs` now has separate install steps for all three platforms, new `/privacy` page gives specific verifiable claims, homepage (~1,000+ words) and `/docs` (~2,500 words, 9 sections) both comfortably clear content-depth floors with genuine topical coverage.

**High:**
- Still no About, Contact, Terms, License, or Changelog pages (all 404). GitHub repo has no declared license despite the "open source" marketing claim — the biggest remaining trust gap.

**Medium:**
- Authoritativeness stays weak (38/100): only signal is an anonymous, unlicensed GitHub org (67 stars), no press/testimonials/named maintainer.

**Low:**
- `/privacy` reuses the `SoftwareApplication` schema verbatim (semantically odd — see Schema).
- Docs "Abbreviations" section has a static example date now stale relative to today.

E-E-A-T weighted score: ≈61/100 (up from ≈43/100 in July). AI citation readiness: 80/100 (up from 62).

Full detail: [`findings/content.md`](findings/content.md)

---

## On-Page SEO — ~72/100 (not independently re-audited this cycle)

**What's confirmed fixed:** Title/meta description now name all three platforms (was the July High finding driving most of the score).

**Not re-verified this cycle** (carried from July, unconfirmed either way):
- Whether Claude MCP is still buried as one of six equal-weight homepage tiles.
- Whether the homepage mobile nav still hides Features/Canvas/Themes/GitHub/Docs with no menu replacement.

Recommend a dedicated on-page + visual/mobile re-pass next cycle to confirm these.

---

## Schema & Structured Data — 58/100 (up from 28/100)

**What works:** `SoftwareApplication` JSON-LD now live on both pages (was zero in July) — syntactically valid, correct `https://schema.org` context, no deprecated types, no fabricated `aggregateRating`.

**Critical:**
- `/docs` JSON-LD `url` field is `https://inkwell-lp.vercel.app/` (homepage) instead of its own canonical `https://inkwell-lp.vercel.app/docs/` — a copy-paste error.

**High:**
- `/docs` duplicates the exact homepage `SoftwareApplication` block (same name/version/offers, only description differs) instead of a page-appropriate type — creates entity ambiguity for crawlers/AI. Same issue confirmed on `/privacy`.
- Missing sitewide `Organization` + `WebSite` schema — no publisher/site-level entity anywhere.

**Info:** No `aggregateRating`/reviews — correctly not fabricated (no Google rich-result carousel eligibility as a result, which is the right tradeoff). `FAQPage` correctly not forced onto `/docs`.

Ready-to-paste corrected JSON-LD (verified real values only) is in [`findings/schema.md`](findings/schema.md): `Organization` + `WebSite` for the homepage, and a corrected `WebPage` block for `/docs` with the right canonical URL and `about`/`isPartOf` references instead of a duplicated product entity.

---

## Performance — 86/100 (flat vs. 87/100 in July)

**Lighthouse 13.5.0 (mobile, headless)** — no CrUX/PSI field data available (rate-limited / no field record for this low-traffic domain).

| Page | Score | LCP | CLS | TBT |
|---|---|---|---|---|
| Homepage | 85/100 | 3.09s (Needs Improvement) | 0.000 (Good) | 0ms (Good) |
| Docs | 87/100 | 2.96s (Needs Improvement) | 0.000 (Good) | 0ms (Good) |

**Root cause, unchanged since July:** the render-blocking Google Fonts chain (HTML → `fonts.googleapis.com` CSS → `fonts.gstatic.com` woff2) was never fixed. `preconnect` hints were added (likely a side effect of the CSP work), but the actual cross-origin stylesheet request remains — Lighthouse still flags ~1,950ms (home) / ~2,080ms (docs) of available render-blocking savings. LCP is essentially flat vs. July (within measurement noise). CLS and TBT remain solidly "Good" — no regressions from the CSP/accessibility work.

**Fix, unchanged recommendation:** self-host the Inter woff2 files with `@font-face` + `<link rel="preload" as="font">`, drop the Google Fonts preconnect tags. Should move LCP into "Good" (≤2.5s) on both pages.

Full detail: [`findings/performance.md`](findings/performance.md)

---

## AI Search Readiness (GEO) — 61/100 (up from 42/100)

**What works:** `/llms.txt` now live (200) and well-formed (summary, feature list, page links, GitHub source). robots.txt still `Allow: /` for all UAs, unblocking GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot. Both pages remain fully server-rendered. `SoftwareApplication` JSON-LD present on both pages.

Sub-scores: Citability 60, Structural Readability 40, Multi-Modal 55, Authority/Brand 45, Technical Access 95.

**Still unresolved:**
- `/docs` has 47 heading tags but only 1 carries a real `id` attribute — no deep-linkable citation targets for AI systems, and blocks a truly useful `llms.txt` cross-reference.
- The Wikipedia "Inkwell (software)" naming collision (Apple's discontinued macOS handwriting feature) is unchanged — still no on-site disambiguation.
- No `Organization`/`Person`/`FAQPage` schema, no author/date bylines. No RSL licensing file, no `/llms-full.txt`.
- Headings are noun phrases, not question-form; no section hits the 134–167 word optimal-citation length as a self-contained block.

Full detail: [`findings/geo.md`](findings/geo.md)

---

## Images — ~92/100 (not independently re-audited; adjusted from confirmed og:image fix)

**What's confirmed fixed:** og:image (1200×630) is now live — the July High finding (no social preview image) is resolved.

Underlying image practices (correct alt text, explicit width/height, no heavy assets) were not re-verified this cycle but are unlikely to have regressed given no visual/image-specific commits landed.

---

## Supplementary: Search Experience (SXO) — 54/100 (carried over, not independently re-verified this cycle)

The SXO re-audit pass confirmed live that **no comparison/alternatives/persona landing pages exist** (`/alternatives`, `/vs`, `/compare` all absent) — the core July finding still holds. It could not complete a fresh SERP pull or persona re-scoring before hitting its turn limit. Recommend a dedicated, uninterrupted SXO re-run next cycle to confirm whether the score has moved.

Full detail: [`findings/sxo.md`](findings/sxo.md)

---

## Supplementary: Authority & Backlinks

Not re-run this cycle. The core July structural finding — no custom domain, running on the shared `vercel.app` subdomain — was independently reconfirmed as unchanged by the Technical audit (canonical URLs still resolve under `inkwell-lp.vercel.app`).

Full detail (July baseline): [`findings/backlinks.md`](findings/backlinks.md)

---

See [`ACTION-PLAN.md`](ACTION-PLAN.md) for the updated, prioritized implementation plan.
