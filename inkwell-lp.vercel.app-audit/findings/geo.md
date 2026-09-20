# GEO / AI Search Readiness — inkwell-lp.vercel.app

**Audit date:** 2026-09-20
**Pages audited:** `/` (home) and `/docs`
**Method:** Live fetch via `render_page.py` (raw HTTP, no JS rendering needed — `is_spa: false` on both pages), manual robots.txt/llms.txt/sitemap checks, JSON-LD extraction, heading/id analysis, Wikipedia/GitHub cross-check.

## GEO Health Score: 61/100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 60/100 | Short, direct instructional passages (good); but section headings are noun phrases, not questions, and long sections aren't chunked into self-contained 134–167 word blocks |
| Structural Readability | 20% | 40/100 | 47 H1–H4 headings on `/docs`, only **1** carries an `id` attribute (and that one, `abbreviations-anchor`, isn't a real content section — it's a component artifact). No deep-linkable anchors for citation. **Unresolved from prior audit.** |
| Multi-Modal Content | 15% | 55/100 | OG image present (1200x630), code blocks in docs, no video/screenshot alt-text audit performed this pass |
| Authority & Brand Signals | 20% | 45/100 | SoftwareApplication JSON-LD present (good), but no Organization/Person schema, no visible author/date bylines, no `article:published_time`. Naming collision with Wikipedia's "Inkwell (software)" (Apple's discontinued handwriting feature) remains **unresolved** — no disambiguation content on-site. GitHub repo is small (67 stars); no confirmed Wikipedia/Reddit/YouTube presence for this specific product. |
| Technical Accessibility | 20% | 95/100 | robots.txt = `Allow: /` for all UAs (AI crawlers unblocked). Content fully present in raw (pre-JS) HTML — GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot can read it without executing JS. Fast, clean CSP, HSTS. |

## AI Crawler Access

robots.txt (`https://inkwell-lp.vercel.app/robots.txt`):
```
User-agent: *
Allow: /
Sitemap: https://inkwell-lp.vercel.app/sitemap-index.xml
```
All crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot, anthropic-ai, cohere-ai) are allowed — no UA-specific blocks. **Confirmed unchanged from prior audit, still good.**

## llms.txt — FIXED since prior audit (2026-07-16)

`/llms.txt` now returns **200** with a well-formed file: H1 title, blockquote summary, feature list, a "## Pages" section linking Homepage/Documentation/Privacy with one-line descriptions, and a "## Source" section linking the GitHub repo and latest release. This is a genuine fix and directly addresses the prior finding.

- `/llms-full.txt`: 404 (not present — optional but would help for full-content ingestion)
- RSL 1.0 licensing (`/license.xml`, `/rsl.xml`): both 404 — no RSL licensing signal present

## Structural Readability — heading ids still missing (unresolved)

`/docs` has a clean, logical heading hierarchy (Getting Started → Editor → Canvas → Organisation → Themes → Export → GitHub Sync → Claude MCP, each with H3 subsections), but of 47 heading tags only 1 has an `id` attribute, and it's a library-injected anchor, not a content heading. This means AI systems and users cannot deep-link to (or reliably extract/attribute) a specific docs section — a citation surfaced from `/docs` can only point at the whole page, not "Install on macOS" or "Claude MCP setup" specifically. **This is the single highest-priority open item from the prior audit and remains unfixed.**

## Structured Data

Both `/` and `/docs` carry one `SoftwareApplication` JSON-LD block:
```json
{
  "@type": "SoftwareApplication",
  "name": "inkwell",
  "operatingSystem": ["macOS", "Windows", "Linux"],
  "applicationCategory": "DeveloperApplication",
  "softwareVersion": "0.7.8",
  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
  "downloadUrl": "https://github.com/coros-hq/inkwell/releases/latest"
}
```
Solid baseline for AI Overviews / assistant answer cards. Missing: `Organization`/`Person` (author/publisher), `FAQPage` (docs would benefit — several sections read like Q&A already), `aggregateRating`/`author` review signals.

## Brand Mention / Naming Collision Risk — unresolved

`en.wikipedia.org/wiki/Inkwell_(software)` is confirmed (re-checked live) to describe **Apple's discontinued macOS handwriting-recognition feature**, unrelated to this product, and carries high authority weight as an entity-grounding source for LLMs. The GitHub repo (`coros-hq/inkwell`, 67 stars) has clear README differentiation, but there is no on-site disambiguation (e.g., "not to be confused with Apple's Inkwell handwriting feature") and no evidence found of Wikipedia, Reddit, or YouTube presence specific to this product — all high-correlation brand signals (YouTube ~0.737, Reddit high, Wikipedia high) are currently absent or working against the brand.

## Citability

Passages are short and directive (e.g., "Download the latest .dmg from the Releases page. Open the disk image and drag inkwell.app to /Applications...") — good for extraction, but most sections fall short of the 134–167 word optimal citation length, and none of the H2/H3 headings are phrased as questions (e.g., "Editor," "Canvas," "GitHub Sync" vs. "How do I sync notes with GitHub?"). Reframing top docs headings as questions would materially improve match against natural-language AI queries.

## Top 5 Highest-Impact Changes

1. **Add heading `id` attributes to all `/docs` H2/H3s** (Astro's MDX/remark heading-id plugin, or manual slugs) — enables citation deep-linking. Effort: Low (1–2 hrs, config-level fix).
2. **Add on-site disambiguation for the Wikipedia naming collision** — one sentence near the top of `/` or `/docs` ("inkwell is a markdown editor, unrelated to Apple's discontinued handwriting feature of the same name") reduces LLM entity-confusion risk. Effort: Low.
3. **Reframe key docs H2/H3s as natural-language questions** ("How do I sync notes with GitHub?" vs "GitHub Sync") to match AI query patterns. Effort: Medium (content rewrite, ~40 headings).
4. **Add `FAQPage` JSON-LD for docs Q&A-style sections** (install steps, GitHub sync, Claude MCP setup) to increase AI Overview / assistant snippet eligibility. Effort: Medium.
5. **Pursue brand-presence signals**: a short YouTube demo video and a Reddit post/AMA in relevant subreddits (r/macapps, r/opensource, r/ObsidianMD-adjacent communities) — these are the strongest brand-mention correlations with AI citation and are currently unaddressed. Effort: Medium-High (ongoing).

## Platform-Specific Estimate

| Platform | Est. Score | Rationale |
|---|---|---|
| Google AI Overviews | 55/100 | Good schema + crawler access, but weak entity/brand signals and naming collision hurt grounding |
| ChatGPT / GPTBot | 68/100 | llms.txt + open robots.txt + SSR content is a strong combination for ChatGPT retrieval |
| Perplexity | 62/100 | Clean crawlable content and llms.txt help; lack of deep-link anchors limits precise citation |
| Bing Copilot | 55/100 | Same technical strengths, but weaker overall brand authority signals (DR, mentions) drag this down |

## Changes Since Prior Audit (2026-07-16)

- **Fixed:** `/llms.txt` now present and well-formed (was missing).
- **Unresolved:** No heading `id` attributes on `/docs` (still blocks deep-linkable citation).
- **Unresolved:** Naming collision with `en.wikipedia.org/wiki/Inkwell_(software)` (Apple) — no disambiguation added.
- **Unchanged/confirmed good:** robots.txt still allows all AI crawlers; SoftwareApplication schema still present; SSR content still fully accessible without JS execution.
