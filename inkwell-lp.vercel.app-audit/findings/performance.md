# Performance & Core Web Vitals Audit — inkwell-lp.vercel.app

**Date:** 2026-07-16
**Method:** Real Lighthouse 13.4.0 lab audit (headless Chrome 148, local macOS Chrome binary), mobile form factor, simulated throttling (RTT 150ms, 1.6Mbps throughput, 4x CPU slowdown — Lighthouse default "Slow 4G"/mid-tier mobile profile). Cross-validated with `curl` resource timing (TTFB, transfer sizes, response headers) against the live production Vercel deployment.

No Google PageSpeed Insights / CrUX API credentials were available in this environment, so **no real-user field data (28-day CrUX) was used**. All numbers below are **lab data** — single-run Lighthouse simulations, not field-observed percentiles. They should be validated against CrUX/PSI field data once available, per standard guidance that lab data is a diagnostic proxy, not a substitute for real-user data.

---

## Summary Scores

| Page | Lighthouse Performance Score (lab, mobile) |
|---|---|
| Homepage `/` | **89 / 100** |
| Docs `/docs` | **84 / 100** |

---

## Core Web Vitals — Homepage (`/`)

**Source: real Lighthouse 13.4.0 run, mobile/throttled.**

| Metric | Value | Status vs. threshold |
|---|---|---|
| LCP | **2.83s** | Needs Improvement (2.5s–4.0s band; just over the 2.5s "Good" line) |
| FCP | **2.83s** (same as LCP — LCP element is the first text painted) | — |
| TBT (lab proxy for INP) | **0ms** | Good (no long tasks found) |
| Max Potential FID (legacy lab proxy) | **20ms** | Good |
| CLS | **0.000** | Good |
| Speed Index | 4.3s | — |
| TTFB (document) | **~40ms** reported by Lighthouse root-document audit; **246ms** per LCP-breakdown subpart timing (includes simulated network RTT); **131ms real TTFB** measured via `curl` against live edge (`x-vercel-cache: HIT`) | Good either way (well under 800ms) |

**LCP element:** `section.hero > div.hero-inner > div.hero-text > p.hero-sub` — the hero subhead text, not an image. This confirms the "heavy inline SVG hero illustrations" in the page are not the LCP bottleneck; text paint is.

**LCP breakdown (Lighthouse LCP subparts, real data):**
- Time to First Byte: **246ms**
- Element render delay: **2,076ms** ← dominant cost, ~73% of total LCP time

**INP:** Not directly measurable in lab mode (INP requires real user interaction sampling / field data). TBT of 0ms and Max Potential FID of 20ms both indicate the main thread is free of long tasks, so INP is very likely to be in the "Good" range (<200ms) in the field, but this is an **inference from lab proxies, not a measured INP value**. No CrUX data available to confirm.

---

## Core Web Vitals — Docs (`/docs`)

**Source: real Lighthouse 13.4.0 run, mobile/throttled.**

| Metric | Value | Status vs. threshold |
|---|---|---|
| LCP | **3.1s** | Needs Improvement |
| FCP | **3.1s** | — |
| TBT | **0ms** | Good |
| Max Potential FID | **20ms** | Good |
| CLS | **0.000** | Good |
| Speed Index | 6.0s | — |
| TTFB (document, curl, live) | **207ms** (`x-vercel-cache: HIT`) | Good |

**LCP element:** `div.docs-layout > main.docs-content > section#getting-started > p.lead` — again a text node, not an image.

**LCP breakdown (real data):**
- Time to First Byte: **355ms**
- Element render delay: **3,094ms** ← dominant cost, ~90% of total LCP time

The docs page is worse than the homepage on LCP/Speed Index despite smaller HTML (38KB vs 64KB) and fewer DOM nodes (469 vs 580), because it carries the same render-blocking font dependency chain and has more scroll-spy/content sections deeper in the render path.

---

## Root Cause Analysis (from real Lighthouse "Insights" audits + curl waterfall)

### 1. Render-blocking Google Fonts request chain (primary LCP bottleneck — both pages)

Lighthouse's `render-blocking-insight` flags a **3-hop critical request chain** on both pages:

```
HTML document
  → https://fonts.googleapis.com/css2?family=Inter:...&display=swap   (1,372 B)
      → https://fonts.gstatic.com/s/inter/v20/....woff2               (48,983 B)
  → /_astro/index.[hash].css (or docs.[hash].css)                     (4.9KB / 2.3KB)
```

- Homepage: estimated savings **1,920ms** (FCP: 1,900ms, LCP: 1,900ms) if unblocked.
- Docs: estimated savings **2,170ms** (FCP: 2,150ms, LCP: 2,150ms) if unblocked.
- The Google Fonts stylesheet alone costs **885ms (home) / 950ms (docs)** of blocking time, confirmed via curl (`ttfb: 506ms` to `fonts.googleapis.com`, plus a further round trip to `fonts.gstatic.com` for the woff2 file, `ttfb: 228ms`, `size: 27–49KB` per weight actually used).
- This is a classic **two-hop external font chain**: browser must fetch the CSS from `fonts.googleapis.com` before it even knows which `fonts.gstatic.com` font URLs to request. Despite `&display=swap` being present (so it's not blocking text paint via FOIT), Lighthouse's `render-blocking-insight` still counts the *stylesheet* fetch itself as blocking first paint/LCP because it's a synchronously-loaded `<link rel="stylesheet">` in `<head>` with no `media`/async trick — the browser holds render until it resolves the CSSOM, which includes this external sheet.
- Note: `font-display-insight` scored 1 (no issue) — so FOIT/CLS-from-fonts isn't the problem; the problem is the **stylesheet fetch itself sitting in the critical rendering path**, which the LCP-breakdown data confirms by attributing ~2.0–3.1 **seconds** of "element render delay" (time between first byte and the LCP text actually painting) even though TTFB is fast (131–355ms) and CLS is 0.

Two preconnects (`fonts.googleapis.com`, `fonts.gstatic.com`) are already in place and help, but preconnect alone doesn't eliminate the sequential CSS→font round trips.

### 2. Element render delay dominates LCP on both pages

This is the single biggest number in this audit: **2,076ms (home) / 3,094ms (docs)** between TTFB and the LCP text element actually rendering. Given CLS is 0 and TBT is 0ms (no long JS tasks), this delay is almost entirely attributable to the browser blocking on CSSOM construction (the Google Fonts stylesheet + the local Astro CSS bundle) before it will paint any text, including the hero/lead paragraph that happens to be the LCP element. Fixing item #1 directly fixes this.

### 3. DOM size — not currently a problem, but worth watching

- Homepage: 580 elements (well under the 1,500-element "excessive" threshold), max DOM depth via `a#hero-dl-mac > span.dl-icon > svg > path` (the inline SVG icon markup).
- Docs: 469 elements.
- Given the homepage's heavy inline SVG mockups (38 `<svg>`, 32 `<path>` elements), DOM size is not excessive today, but if more inline illustrations are added this should be monitored — inline SVG avoids extra image requests (good for LCP) at the cost of DOM node count (relevant to INP if interaction handlers ever attach near these subtrees).

### 4. No image-related LCP/CLS risk

No `<img>` content images drive LCP on either page (only 3 `<img>` tags total on the homepage, likely icons/logos not in the LCP path). `lcp-discovery-insight` returned `notApplicable` — confirming the LCP element is text, not an image, so image compression/preload/lazy-load guidance doesn't apply here.

### 5. Third-party script (Vercel Analytics) is not a bottleneck

The Vercel Analytics custom-element script (`/301fd3f38fd8d646/script.js`, ~1.5KB) loads asynchronously and does not appear in the render-blocking or long-task audits. TBT of 0ms on both pages confirms no main-thread contention from this or any other script.

---

## Prioritized Recommendations

1. **[High impact, low effort] Eliminate the Google Fonts external round-trip.** Self-host the Inter font files (download the specific weights/styles actually used: 300/400/500/600 regular + 300/400 italic) from `/public/fonts/` or `/_astro/`, and inline an `@font-face` block directly in the critical CSS bundle instead of loading via `fonts.googleapis.com`. This collapses the 3-hop chain (HTML → googleapis CSS → gstatic woff2) into a single same-origin CSS file already being fetched, directly attacking the ~1,900–2,150ms of estimated savings Lighthouse identified as the top opportunity on both pages. This is the single highest-leverage fix available and should move LCP from "Needs Improvement" (2.8–3.1s) into "Good" (<2.5s) territory on both pages.
   - If self-hosting isn't desired short-term, at minimum add `rel="preload" as="style"` for the Google Fonts CSS, or inline the small `@font-face` CSS block directly in `<head>` (Google Fonts CSS payload is only 1.4KB — cheap to inline) so the browser doesn't block CSSOM on a cross-origin fetch before it can resolve font declarations.

2. **[Medium impact] Consider `font-display: optional` or a system-font fallback stack for the hero/lead text specifically** if a small amount of layout stability during font swap is acceptable — this would let the LCP text paint immediately in a fallback font rather than waiting on any font resource at all. Current CLS is already 0, so this is an LCP-speed vs. font-consistency tradeoff, not a CLS fix.

3. **[Low priority] Re-verify with field data (CrUX/PSI) once traffic accumulates.** Lab data here is a single simulated mobile run; confirm the 75th-percentile field LCP once Google API credentials or sufficient CrUX traffic history are available, since lab throttling (4x CPU slowdown, 150ms RTT) is deliberately pessimistic compared to a typical real-user mobile connection.

4. **[Monitoring only] No action needed for CLS or INP/TBT today** — both pages score essentially perfectly on these axes (CLS 0.000, TBT 0ms). Re-check after implementing recommendation #1 to ensure font-swap changes don't introduce new layout shift.

---

## Data Provenance

| Data point | Source | Real or Estimated |
|---|---|---|
| Homepage LCP 2.83s, FCP 2.83s, CLS 0, TBT 0ms, Speed Index 4.3s | Lighthouse 13.4.0 real run | **Real (lab)** |
| Docs LCP 3.1s, FCP 3.1s, CLS 0, TBT 0ms, Speed Index 6.0s | Lighthouse 13.4.0 real run | **Real (lab)** |
| LCP subpart breakdown (TTFB / element render delay) both pages | Lighthouse `lcp-breakdown-insight` | **Real (lab)** |
| Render-blocking savings estimates (1,920ms / 2,170ms) | Lighthouse `render-blocking-insight` | **Real (lab)**, estimate field within the tool itself |
| Network dependency chain (HTML→googleapis→gstatic) | Lighthouse `network-dependency-tree-insight` | **Real (lab)** |
| DOM size (580 / 469 elements) | Lighthouse `dom-size-insight` | **Real (lab)** |
| Document TTFB 131ms (home) / 207ms (docs), transfer sizes, `x-vercel-cache: HIT` | `curl -w` against live production URLs | **Real (production, single request)** |
| Google Fonts CSS fetch 506ms, woff2 fetch 228ms/27KB | `curl` against `fonts.googleapis.com` / `fonts.gstatic.com` | **Real (single request, this environment's network conditions — not throttled)** |
| INP (field) | Not measured — no CrUX/PSI credentials available | **Not measured; inferred "likely Good" from TBT=0ms/Max-Potential-FID=20ms lab proxies only** |
| CrUX 75th-percentile field values (any metric) | N/A | **Not available in this environment** |

No metrics in this report are hand-estimated from resource size alone — a real Lighthouse trace was successfully obtained for both URLs using a local Chrome binary. The only gap is real-user field data (CrUX), which requires Google API credentials not present in this environment.
