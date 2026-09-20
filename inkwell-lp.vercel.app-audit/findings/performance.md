# Performance / Core Web Vitals Audit

**Site:** https://inkwell-lp.vercel.app/ (+ /docs)
**Date:** 2026-09-20
**Method:** Lighthouse 13.5.0 (mobile, headless Chrome CLI, `--only-categories=performance`). PageSpeed Insights API and CrUX field data were attempted but unavailable (`PSI rate limit exceeded` on first call; after retry, CrUX returned no field data — expected for a low-traffic site, per script fallback rules). Findings below are lab data.

Compare against prior audit dated 2026-07-16: Homepage 89/100 (LCP 2.83s), Docs 84/100 (LCP 3.1s), root cause identified as a render-blocking Google Fonts chain, with self-hosting Inter recommended.

## Summary

| Page | Perf Score | LCP | CLS | TBT | Speed Index | FCP |
|---|---|---|---|---|---|---|
| Homepage `/` | 85/100 | 3.09s (Needs Improvement) | 0.000 (Good) | 0ms (Good) | 5.1s | 3.09s |
| Docs `/docs` | 87/100 | 2.96s (Needs Improvement) | 0.000 (Good) | 0ms (Good) | 4.5s | 2.96s |

INP could not be measured (requires field interaction data / real user sessions; not available from a single-run lab test and no CrUX record exists for this domain).

## Core Web Vitals status (lab-estimated)

- **LCP:** FAIL on both pages — both sit in the "Needs Improvement" band (2.5s–4.0s), effectively unchanged from the July audit (home went from 2.83s → 3.09s; docs from 3.1s → 2.96s, within normal run-to-run noise).
- **CLS:** PASS — 0.000 on both pages, no regression.
- **INP/TBT:** PASS (lab proxy) — TBT is 0ms on both pages, indicating no long main-thread tasks; real-world INP is likely good but unverified without field data.

## Root cause: Google Fonts render-blocking chain — NOT fixed

The July recommendation to self-host Inter was **not implemented**. The site still loads Inter through the third-party Google Fonts CDN, and this remains the single largest LCP bottleneck on both pages.

Current `<head>` (confirmed via `curl`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet">
```

What changed: `rel="preconnect"` hints were added for both `fonts.googleapis.com` and `fonts.gstatic.com` (a partial mitigation — likely from the recent accessibility/CSP commits). This shaves some connection-setup time but does **not** eliminate the blocking request chain.

Lighthouse's `network-dependency-tree-insight` still shows the full 3-hop critical chain on both pages:

- Homepage: `/` (177ms) → `fonts.googleapis.com/css2?...` (320ms) → `fonts.gstatic.com/.../UcC73F...woff2` (488ms total chain latency)
- Docs: `/docs` (151ms) → `fonts.googleapis.com/css2?...` (300ms) → two `fonts.gstatic.com` woff2 files, italic + roman (406ms total chain latency)

Lighthouse's `render-blocking-insight` audit still flags the Google Fonts stylesheet as render-blocking with estimated savings of:
- Homepage: **~1,950ms** total render-blocking savings (font stylesheet: 882ms of that)
- Docs: **~2,080ms** total render-blocking savings (font stylesheet: 883ms of that)

This 3-hop chain (HTML → googleapis.com CSS → gstatic.com woff2) is why LCP/FCP sit at ~3.0s on both pages despite a fast server (TTFB 39-50ms) and tiny page weight (74 KiB home / 119 KiB docs).

## Other observations

- `font-display-insight`: passing (stylesheet already requests `display=swap`, so no invisible-text/FOIT issue — but swap still causes a layout-safe but late repaint once fonts arrive).
- `unminified-css`: passing on both pages.
- CSS/JS payload is small; this is a latency problem (RTT + chain depth), not a bandwidth problem — self-hosting will fix it directly.
- No regressions found from the CSP or accessibility commits (`0b409d9`, `74533d3`, `87464f2`) — CLS remains 0.000 and TBT remains 0ms, so those changes did not introduce blocking scripts or layout shifts.

## Recommendations (prioritized by expected impact)

1. **Self-host the Inter font (highest priority, unresolved from July).** Download the required Inter weights/styles (300/400/500/600, italic + roman) as woff2, serve them from `/fonts/` on the same origin, and reference via `@font-face` in the site's own CSS bundle. Add `<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-400.woff2" crossorigin>` for the weight used above the fold. This removes the entire third-party chain (2 fewer origins, 2 fewer round trips) and should recover the full ~1,950ms (home) / ~2,080ms (docs) of render-blocking-insight savings, likely dropping LCP into the "Good" (≤2.5s) band on both pages.
2. **Drop the `fonts.googleapis.com`/`fonts.gstatic.com` `<link rel="preconnect">` tags once self-hosted** — they'll be dead weight after migration.
3. **Preload the LCP-critical font weight** (Homepage/Docs body copy, likely Inter 400) directly, rather than relying on discovery via the CSS stylesheet, to shave the remaining render-delay component of LCP.
4. **Re-run with CrUX/PageSpeed field data once traffic accumulates** to validate INP and confirm the 75th-percentile experience matches these lab numbers (INP currently unverifiable — no field data available for this domain).
5. No CLS or main-thread (INP-proxy) action needed at this time — both are solidly in the "Good" range and unaffected by the accessibility/CSP work merged since July.
