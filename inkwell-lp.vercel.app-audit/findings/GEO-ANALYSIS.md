# GEO / AI Search Optimization Analysis — inkwell-lp.vercel.app

**Audit date:** 2026-09-20
**Framework:** Google's official position (per this skill's primary source) is that GEO/AEO is SEO fundamentals applied to AI-search surfaces, not a separate discipline. Findings below are framed that way — `llms.txt` is reported for completeness but not weighted as a citation lever (per the SE Ranking/Mueller/Illyes evidence this skill defers to).

## GEO Readiness Score: 58/100

| Dimension | Weight | Score |
|---|---|---|
| Citability | 25% | 60 |
| Structural Readability | 20% | 40 |
| Multi-Modal Content | 15% | 55 |
| Authority & Brand Signals | 20% | 40 |
| Technical Accessibility | 20% | 95 |

---

## Platform Breakdown

| Platform | Assessment |
|---|---|
| **Google AI Overviews** | Ranking-correlated — depends on classic organic ranking, which this audit doesn't measure directly. Server-rendered content and clean structure give it a fair shot once/if it ranks. |
| **Google AI Mode (Gemini 3.5 Flash)** | Draws from a broader pool where freshness + entity authority matter more than position — this is the weakest fit today: no dated content, no freshness signals, weak entity authority. |
| **ChatGPT** | Citation sources are dominated by Wikipedia (47.9%) and Reddit (11.3%) for this platform. inkwell has **zero presence on either** — and the one Wikipedia hit for "Inkwell" is an unrelated Apple feature (see Brand Mentions below), which is a negative signal, not neutral. |
| **Perplexity** | Dominated by Reddit (46.7%) and Wikipedia. Same gap as ChatGPT — no community discussion footprint found. |
| **Bing Copilot** | Bing-index-dependent; `robots.txt` doesn't block Bingbot, sitemap exists — no structural blocker, but no IndexNow submission either (see `findings/technical.md`). |

---

## AI Crawler Access Status

`robots.txt` is a blanket `User-agent: * / Allow: /` — **all AI crawlers are currently allowed**, including training crawlers:

| Crawler | Status |
|---|---|
| GPTBot | Allowed |
| OAI-SearchBot | Allowed |
| ChatGPT-User | Allowed |
| ClaudeBot | Allowed |
| PerplexityBot | Allowed |
| CCBot | Allowed |
| anthropic-ai | Allowed |
| Bytespider | Allowed |
| cohere-ai | Allowed |

No action needed — this is the right default for a project trying to build AI-citation visibility. No crawler-specific rules exist to differentiate training vs. citation use; flagging as an option only, not a gap (see `findings/technical.md`).

---

## llms.txt Status: Present, well-formed, low citation-ranking weight

`/llms.txt` (200) exists with a clear summary, feature list, and links to all 3 pages plus GitHub. Per this skill's primary-source guidance, treat this as good hygiene / a discovery aid, not a ranking lever for major AI search systems — don't over-invest further here.

---

## Brand Mention Analysis — the most important new finding this pass

**Two separate naming-collision problems, not one:**

1. **A live, direct competitor with the identical product name and category.** "Inkwell Markdown Editor" by developer "4worlds-dev" is an already-established, separately-branded markdown editor (Mac/Windows/Linux, $19 one-time license, live listing on AlternativeTo.net with its own reviews page). This is a **far more material collision than the Apple Wikipedia page** flagged in the July audit — it's the *same product category, same name, same platform claims*, actively indexed and discoverable. An AI system asked "what is inkwell markdown editor" has a genuine, live alternative candidate to cite instead of (or confused with) this product.
2. **Wikipedia's "Inkwell (Macintosh)"** (note: correct title, not "Inkwell (software)" as the July report had it) documents Apple's discontinued handwriting-recognition feature — still an unrelated, high-authority collision in the same macOS context.

**Brand presence elsewhere:** No Reddit mentions found, no YouTube presence found, no LinkedIn presence found, no Product Hunt listing found. GitHub (67 stars, 6 forks, created 2026-06-14, actively pushed as of 2026-09-19) is the only real footprint, and it has **no declared license** (confirmed via GitHub API: `license: null`) despite "open source" being a marketing claim on the site — a credibility problem for AI systems evaluating source trustworthiness, not just a legal one.

**Recommendation (raised in priority given the AlternativeTo collision):**
- Consistently render the brand as a more disambiguated string in titles and first-sentence copy — e.g. "inkwell by coros-hq" or a more distinctive product name — in both on-page copy and JSON-LD `name`.
- Add `sameAs` entries in `Organization` schema pointing to the GitHub repo once that schema is added (see `findings/technical.md`/`findings/schema.md`).
- Declare a real open-source license — closes both the E-E-A-T gap (`findings/content.md`) and strengthens the "genuinely open source, unlike the paid AlternativeTo listing" differentiation.
- Consider one low-cost brand-building move: a Reddit post in r/ObsidianMD or r/macapps, or a Product Hunt launch — both directly targeted by ChatGPT/Perplexity citation patterns and currently at zero.

---

## Passage-Level Citability

**Homepage:** first ~60 words are: *"Write without distraction. A local-first markdown editor for every platform. Your notes stay as plain .md files — private, portable, entirely yours."* — this is a strong, self-contained, quotable definition sentence, correctly front-loaded (satisfies the "first 30% of page" citation-source pattern). Good, no change needed.

**`/docs`:** 2,398 words across 9 sections / 47 headings, all **noun-phrase headings** ("Getting Started", "Editor", "Canvas Notes"), none in question form. No section is scoped to a self-contained 134–167 word block — content flows continuously under each heading rather than being chunked into extractable answer units. This is the main Structural Readability gap.

**No FAQ section anywhere** — a natural fit given the docs already answer implicit "how do I..." questions; currently formatted as prose/procedure, not Q&A.

---

## Structural Readability Detail

- Clean H1→H2→H3 hierarchy confirmed on both pages (carried over, still true).
- Only 1 of 47 headings on `/docs` carries a real `id` attribute (`#abbreviations-anchor`) — blocks deep-linkable citation for the other 46 (also flagged in `findings/technical.md`/`findings/geo.md` from the earlier pass this session).
- No tables for comparative data (e.g. no macOS/Windows/Linux install-step comparison table, despite 3 parallel install sections that would suit one).
- Short paragraphs and code blocks are used well in the docs — genuinely good extractable structure at the paragraph level, just not chunked at the section level.

---

## Multi-Modal Content

- Homepage: 3 images/mockups (per earlier session's SXO pass), all inline SVG/CSS, no photography, no video.
- No embedded video, no infographics, no interactive tools/calculators.
- Screenshots exist in `screenshots/` from the visual audit but aren't part of the live page's own multi-modal signal.

**Recommendation:** A short (60–90s) product demo video embedded on the homepage or linked from `/docs` would be the single highest-leverage multi-modal addition — video content sees the largest documented selection-rate lift (156%) and YouTube mentions have the strongest documented correlation with AI citation (0.737) of any signal in this skill's evidence base.

---

## Authority & Brand Signals Detail

**Weak across the board:**
- No author byline anywhere (GitHub org `coros-hq` is anonymous — no named maintainer).
- No publication or last-updated dates on `/docs` (despite a live commit as recently as 2026-09-19 per GitHub).
- No citations to external sources/data in the copy.
- No `Person`/`Organization` schema.
- Recency signal is currently invisible to an AI system even though the underlying project *is* actively maintained — this is a presentation gap, not a reality gap, and cheap to fix.

**Recommendation:** Add a visible "Last updated" date to `/docs` (driven from the real GitHub commit/push date, not hardcoded), and add `Organization` schema with a `sameAs` link to GitHub. Both are near-zero-effort and directly address the weakest-scoring dimension.

---

## Technical Accessibility — 95/100 (strongest dimension, unchanged)

- Confirmed server-side rendered / static (Astro SSG) — full content in raw HTML, zero JS execution required for either page.
- All AI crawlers unblocked (see above).
- `/llms.txt` present.
- No RSL 1.0 licensing file found (`/license.xml`, `/rsl.xml` both 404) — low priority given RSL's Dec-2025 backer list doesn't yet include evidence of AI-search-ranking impact, but cheap to add alongside the license-declaration fix above.

---

## Top 5 Highest-Impact Changes

1. **Resolve the AlternativeTo naming collision** — this is a more material, more discoverable competing entity than the Apple Wikipedia page, and wasn't caught in the July or the earlier-this-session GEO passes. Disambiguate the brand string consistently sitewide.
2. **Add a "Last updated" date + `Organization`/`Person` schema** — cheapest fix for the weakest-scoring dimension (Authority, 40/100), and the underlying freshness is real, just not surfaced.
3. **Add heading `id`s to all 47 `/docs` headings** — carried over, still the main blocker to deep-linkable citation.
4. **Chunk 2-3 of the most likely-to-be-queried `/docs` sections (Getting Started, Claude MCP, GitHub Sync) into explicit 134–167 word self-contained answer blocks**, ideally under question-form subheadings ("How do I install inkwell on Windows?").
5. **Declare a real open-source license** — fixes both the E-E-A-T gap and the credibility signal an AI system would use to evaluate this source against the paid AlternativeTo competitor.

---

## Schema Recommendations

Consistent with `findings/schema.md` from the earlier technical/schema passes this session:
- Add `Organization` + `WebSite` JSON-LD to the homepage with `sameAs: ["https://github.com/coros-hq/inkwell"]`.
- Fix the `SoftwareApplication` `url` field bug on `/docs/` and `/privacy/` (currently both point at the homepage URL — see `findings/technical.md`).
- Do not add `FAQPage` schema unless real Q&A-formatted content is built first (per this skill's guidance: structured FAQ content for commercial sites, not schema-only).

## Content Reformatting Suggestions

- `/docs` → "Getting Started": rewrite the lead as a direct question-answer pair — *"How do I install inkwell? Download the .dmg (macOS), .exe (Windows), or .deb (Linux) from the Releases page..."* — then keep the existing per-OS detail below.
- `/docs` → "Claude MCP" section: this is the most likely to be cited/quoted section for AI-tooling-adjacent queries; ensure it opens with a single self-contained 134–167 word block explaining exactly what the MCP server does and how to enable it, before diving into config JSON.
- Homepage hero: already well-optimized, no change needed.
