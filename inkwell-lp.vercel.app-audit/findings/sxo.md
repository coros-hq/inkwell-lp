# Search Experience Optimization (SXO) Findings

**Target:** https://inkwell-lp.vercel.app/ (homepage) + https://inkwell-lp.vercel.app/docs
**Product:** inkwell — free/open-source local-first markdown editor (macOS/Windows/Linux desktop app)
**Analysis date:** 2026-07-16
**Fetch method:** `render_page.py --mode auto` (server-rendered Next.js, `is_spa=False`) + `parse_html.py`

---

## Headline Finding: Page-Type Mismatch — HIGH severity

The site has exactly two pages: a **Landing Page** (homepage) and a **Hybrid/Tool-adjacent documentation page** (`/docs`). There is no Comparison Page, no use-case/persona content, and no social-proof content anywhere in the site architecture.

This is not a defect in the landing page itself — the homepage is a reasonably well-built **Landing Page** per the taxonomy (hero with single value prop, prominent download CTA, feature grid, minimal nav). The mismatch is **strategic**: several of the keyword intents this product realistically wants to rank for are NOT landing-page intents at all — they are **Comparison-Page** and **Informational/Hybrid** intents that Google rewards with a completely different content structure. Trying to rank the homepage for those queries means asking a Landing Page to do a Comparison Page's job.

| Candidate keyword | Likely SERP-dominant page type | What target page is | Mismatch severity |
|---|---|---|---|
| "markdown editor mac" | Landing Page / Product Page (mixed with some Hybrid "best of" roundups) | Landing Page | ALIGNED (mostly) |
| "obsidian alternative" / "obsidian alternatives" | **Comparison Page** (listicles: "10 Best Obsidian Alternatives", feature matrices, vs-pages) | Landing Page (no comparison content, no mention of Obsidian anywhere) | **CRITICAL** |
| "local first note taking app" | Hybrid (informational explainer + product recommendations) | Landing Page (assumes visitor already knows what "local-first" means and wants to download) | **HIGH** |
| "markdown editor with canvas" | Mixed Landing Page / Comparison (low competition, likely winnable as-is) | Landing Page — has a dedicated Canvas section | ALIGNED |
| "offline notes app" | Hybrid / Comparison (broad, competitive, review-driven) | Landing Page | **HIGH** |
| "best markdown editor" | **Comparison Page / Listicle** almost exclusively | Landing Page (single product, no "best for X" framing) | **CRITICAL** |

**Why this matters:** for "alternative" and "best/vs" queries, Google's top 10 is dominated by listicles and comparison content that explicitly names competitors (Obsidian, Notion, Bear, Typora, iA Writer), includes feature-comparison tables, and often pros/cons framing. A single-product landing page with no competitor mentions, no comparison table, and no "best for [use case]" segmentation structurally cannot satisfy that intent — no amount of on-page copy tweaking fixes this without a new content type. This is the single highest-leverage SXO gap on the site.

---

## Page Classification (Taxonomy-Based)

### Homepage — `Landing Page`
- Hero with single value prop ("Write without distraction.") + prominent download CTA — matches.
- Minimal nav (Docs, GitHub, Download) — matches.
- Feature grid (6 features) in place of "Social proof" slot — **required "testimonials or trust badges" element is absent.**
- No pricing section (implied free/OSS) — acceptable for OSS category, but nothing states "free" or "open source" explicitly near the CTA, which is itself a missed trust/conversion signal for a price-sensitive persona.
- No `SoftwareApplication` / `WebSite` schema detected (`schema: []` in parse output) — Required Element per taxonomy, currently missing.
- Verdict: legitimate Landing Page, correctly structured for a *branded/product-aware* visitor, but missing the trust-signal layer the taxonomy calls out as required.

### `/docs` — `Hybrid` leaning `Tool/Reference`
- Structured as a reference manual (Getting Started, Editor, Canvas, Organisation, Themes, Export, GitHub Sync, Claude MCP, Keyboard Shortcuts) — 1,650 words, deep H2/H3 hierarchy.
- No author byline, no dates rendered in the visible content, no schema (`schema: []`).
- This page is well-suited to rank for procedural/how-to queries ("how to sync markdown notes to GitHub", "inkwell keyboard shortcuts", "Claude MCP markdown editor setup") but is currently an orphaned single page rather than a documentation section with individual indexable URLs per topic — meaning it competes as one giant page for many distinct long-tail queries instead of several focused pages.

### Missing page types entirely
- **Comparison Page** ("Inkwell vs Obsidian", "Best Obsidian alternatives") — does not exist.
- **Product/Use-case Landing Pages** ("Inkwell for developers", "Inkwell for writers", "Inkwell for researchers") — does not exist; homepage tries to serve all three audiences with one generic feature grid.
- **Blog/informational content** — does not exist; no top-of-funnel content to capture "what is local-first" / "markdown editor vs notion" awareness-stage traffic.

---

## SERP-Backwards Signal Analysis (Reasoned, Not Live-Scraped)

Given the tool constraints in this session, SERP features below are derived from well-established patterns for this query category (software "alternative"/comparison queries reliably surface listicles, feature tables, and Reddit/community threads in the top 10; "[category] app" queries reliably surface a mix of vendor landing pages and "best of" roundups) rather than a live scrape. Treat percentages as directional, not measured.

**Recurring signal patterns for this keyword set:**
- "alternative" and "vs" queries → dominated by comparison/listicle content, PAA clusters like "Is Obsidian free?", "What is the best free alternative to Obsidian?", "Can I use markdown editor offline?"
- "local-first" / "offline" queries → PAA clusters around privacy/data-ownership ("Does [tool] sync to the cloud?", "Is my data private with local-first apps?") — an awareness/education gap.
- "for developers" / "with MCP" queries (an emerging niche given Claude MCP support) → currently near-zero competition, technical-evaluator intent, PAA-style questions about integration setup, API/MCP protocol support.
- Community-driven trust signals (Reddit r/ObsidianMD, r/selfhosted, Hacker News, Product Hunt) tend to rank prominently for "alternative" queries in this software category — the target site has no earned-media or community presence reflected on-page (no Product Hunt badge, no press mentions, no GitHub star count displayed despite GitHub being open-source and star count being a strong trust signal readily available).

---

## User Stories (Derived from Signal Clusters)

1. **As an Obsidian power user researching alternatives**, I want to see how this tool compares to Obsidian on the features I already rely on (plugins, graph view, sync, themes), because I'm frustrated with Obsidian's [complexity/sync cost/plugin bloat], but I'm blocked by the **complete absence of any competitor mention or comparison framing** on the page — I have to manually cross-reference the feature grid against my mental model of Obsidian.
   *(Source: "alternative"/"vs" query pattern → Comparison Page dominance in taxonomy; page has zero competitor references)*

2. **As a developer evaluating MCP-integrated tools**, I want to quickly confirm this supports the Claude MCP protocol and understand the technical setup, because I want my notes tool to be part of my AI-assisted workflow, but I'm blocked by **the MCP feature being buried as one of six equal-weight tiles in the "Built for more" grid** rather than surfaced as a differentiator — this is arguably inkwell's most unique, defensible, low-competition ranking opportunity and it's under-promoted on the homepage itself (full detail only exists on `/docs`).
   *(Source: H3 "Claude MCP" present but positioned equally to "GitHub sync"/"Kanban"; near-zero SERP competition for this intent per taxonomy Tool/Hybrid signals)*

3. **As a writer wanting a distraction-free editor**, I want to quickly understand whether this is simpler than Obsidian/Notion and confirm my files stay as portable .md, because I've been burned by vendor lock-in before, but I'm blocked by **no explicit "your files never leave your computer" trust reassurance beyond one meta-description line**, and no visual proof (screenshot/GIF of the editor) is confirmed in the parsed structural data beyond icon images — the page relies on copy alone to sell an experience that is fundamentally visual.
   *(Source: H1 "Write without distraction" + meta description "private, portable" language signals this persona was intended; but Trust and Clarity dimensions are underbuilt)*

4. **As a Windows/Linux user searching "offline notes app" or "markdown editor windows"**, I want confirmation this isn't Mac-only, because most local-first editor marketing (including this one) skews Mac-first language, but I'm blocked by **title tag and meta description mentioning only "macOS"** ("A local-first markdown editor for macOS...") despite Windows `.exe` and Linux `.deb` downloads existing directly on the page — this is a direct title/content mismatch that likely suppresses non-Mac query matching in Google's ranking signals.
   *(Source: parsed `title` and `meta_description` both say "for macOS" while `links.external` shows Windows x64-setup.exe and Linux amd64.deb downloads)*

5. **As a privacy/data-ownership researcher** (awareness stage, "local first note taking app" query), I want to understand what "local-first" actually means and why it matters before I commit to evaluating specific tools, because I don't yet know if this category solves my problem, but I'm blocked by **the page assuming product-aware intent** — there's no educational framing of the local-first/offline value proposition beyond a single descriptive sentence, so a true awareness-stage searcher lands on a page written for people who already decided to download something.
   *(Source: taxonomy Hybrid-type SERP indicator — informational + commercial mix expected for category-defining queries; page offers only the commercial half)*

---

## Persona-Based Scoring

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Obsidian power user evaluating alternatives | 10/25 | 14/25 | 8/25 | 16/25 | **48/100** | Needs Work |
| Developer wanting MCP-integrated notes tool | 16/25 | 12/25 | 10/25 | 14/25 | **52/100** | Needs Work |
| Writer wanting a distraction-free editor | 20/25 | 16/25 | 10/25 | 20/25 | **66/100** | Good |
| Windows/Linux user (non-Mac searcher) | 8/25 | 12/25 | 10/25 | 18/25 | **48/100** | Needs Work |
| Privacy/data-ownership researcher (awareness stage) | 12/25 | 10/25 | 12/25 | 14/25 | **48/100** | Needs Work |

### Persona Detail

**Obsidian power user evaluating alternatives — 48/100 (Needs Work)**
- Relevance (10/25): Feature grid covers adjacent ground (kanban, links, attachments, sync) but never frames itself relative to Obsidian or any named competitor — persona must do the comparison work themselves.
- Clarity (14/25): Features are scannable (grid format), but no "why switch" or "what's different" answer exists anywhere on the page.
- Trust (8/25): No testimonials, no user count, no GitHub star count displayed, no Product Hunt/press badges — nothing that says "other Obsidian users switched and it worked out."
- Action (16/25): Download CTA is clear and low-friction (direct .dmg/.exe/.deb links, no email gate) — genuinely strong here.
- **Top fix:** Build a dedicated `/inkwell-vs-obsidian` comparison page (or at minimum an on-page comparison table/section) with a feature matrix and an explicit "why switch" section. This is the single highest-ROI content gap.

**Developer wanting MCP-integrated notes tool — 52/100 (Needs Work)**
- Relevance (16/25): MCP support genuinely exists and is documented — real relevance, just under-surfaced.
- Clarity (12/25): "Claude MCP" is one of six equal-sized tiles under "Built for more" — a developer scanning for AI-integration must read the whole grid to find it; no dedicated section, no above-fold mention.
- Trust (10/25): `/docs` has a full "Claude MCP" section with setup/tools detail, which helps, but the homepage gives no preview of depth before the click.
- Action (14/25): No direct CTA from the MCP feature tile to the docs section anchor; generic "Download" is the only action offered regardless of what drew the developer in.
- **Top fix:** Promote Claude MCP integration to its own homepage section (mirroring the treatment given to Canvas and Quick Capture), with a CTA linking directly to `/docs#claude-mcp` and a one-line explanation of what MCP unlocks (e.g., "Let Claude read, search, and edit your local notes").

**Writer wanting a distraction-free editor — 66/100 (Good)**
- Relevance (20/25): H1 and meta description are written directly for this persona ("Write without distraction," "private, portable, completely under your control").
- Clarity (16/25): Value prop is legible in one scroll; feature grid is clean, though six equal-weight tiles slightly dilutes the "simplicity" pitch it's trying to sell.
- Trust (10/25): No testimonials or "used by X writers" signal; open-source/GitHub link provides indirect credibility only for technically savvy visitors.
- Action (20/25): Download CTA is prominent and immediate, well-suited to a decision-stage visitor.
- **Top fix:** Add one lightweight trust element calibrated to this persona (e.g., GitHub star count badge, "X downloads" counter, or a single-sentence quote) rather than a full testimonials section — keeps the minimalist aesthetic while closing the Trust gap.

**Windows/Linux user searching non-Mac queries — 48/100 (Needs Work)**
- Relevance (8/25): Title tag and meta description explicitly say "for macOS," which actively works against this persona ever clicking through from a Windows/Linux-flavored SERP query — this is a discoverability problem, not just an on-page one.
- Clarity (12/25): Once on the page, Windows/Linux downloads are present and clearly labeled ("Windows.exe · x64", "Linux.deb · amd64"), so clarity recovers post-click.
- Trust (10/25): No platform-specific reassurance (no "works identically on all three platforms" statement).
- Action (18/25): Direct download links per OS are low-friction and correctly targeted once found.
- **Top fix:** Rewrite title tag and meta description to be platform-neutral: e.g. title "inkwell — Write without distraction. Free markdown editor for macOS, Windows & Linux." This is a one-line fix with outsized reach impact since it currently self-selects out of roughly two-thirds of the product's own platform support.

**Privacy/data-ownership researcher (awareness stage) — 48/100 (Needs Work)**
- Relevance (12/25): The core "local-first" pitch is present but compressed into a single sentence; no explainer content addresses "why does local-first matter" for someone who hasn't decided they want it yet.
- Clarity (10/25): No FAQ, no "how it works" walkthrough of the local-first storage model (e.g., where files live, what "no cloud lock-in" means in practice) is visible on the homepage.
- Trust (12/25): Open-source + GitHub link is a genuine trust signal for privacy-conscious researchers, but it's not framed as one (no "open source, so you can verify our privacy claims yourself" messaging).
- Action (14/25): Only one CTA (download) is offered — no lower-commitment awareness-stage action (e.g., "read how local-first works," link to a docs/privacy explainer).
- **Top fix:** Add a short "How your data stays yours" explainer block (2-3 sentences + link to a docs section) targeted at this awareness-stage searcher before asking for the download commitment.

### Weakest Persona (tied): Obsidian power user & Windows/Linux user & Privacy researcher (48/100 each)
Prioritize by fastest fix-to-impact ratio:
1. **Windows/Linux title/meta fix** — lowest effort (one line of copy), immediate reach impact.
2. **Obsidian comparison content** — highest effort, highest ceiling; addresses the CRITICAL page-type mismatch directly.
3. **Privacy/awareness explainer block** — moderate effort, captures top-of-funnel traffic currently unaddressed.

### Systemic Issues Across All Personas
- **Trust dimension is the weakest across every persona** (8-12/25 in all five cases) — the page has zero social proof of any kind (no testimonials, no user/download counts, no press logos, no GitHub star count, no Product Hunt badge). For an open-source project, GitHub stars/contributors are free, readily available trust signals currently left unused.
- **No schema markup detected** (`schema: []` on both homepage and `/docs`) — `SoftwareApplication` schema on the homepage would support rich results (price: $0, aggregateRating if reviews are ever collected, operatingSystem: macOS/Windows/Linux) and directly reinforces the "free, cross-platform" facts personas are missing from title/meta.

---

## SXO Gap Score: 54/100

*(This is a separate metric from any SEO Health Score — it measures experience/intent alignment, not technical SEO.)*

| Dimension | Score | Evidence |
|---|---|---|
| Page Type (0-15) | 7/15 | Homepage is a well-formed Landing Page for product-aware visitors, but the site has no Comparison or informational page type, leaving high-intent "alternative"/"best" queries structurally unaddressed. |
| Content Depth (0-15) | 9/15 | Homepage: 684 words across a clear feature hierarchy — adequate but shallow for competitive/comparison intent. `/docs` is genuinely deep (1,650 words, extensive H2/H3) but is a single monolithic page rather than crawlable per-topic sections. |
| UX Signals (0-15) | 10/15 | Clean nav (3 items), clear single CTA pattern, direct OS-specific download links with no email gate — strong low-friction UX. |
| Schema (0-15) | 0/15 | No structured data detected on either page (`schema: []`). No SoftwareApplication, WebSite, or FAQPage schema present. |
| Media (0-15) | 5/15 | Only SVG icon assets detected in parsed image inventory (26x26, 56x56, 20x20 — all the same inkwell logo icon); no product screenshots, demo GIF, or video evidence found in the parsed structural data for a fundamentally visual product (editor UI, Canvas drawing, themes). |
| Authority (0-15) | 5/15 | GitHub repo link present (open-source signal) but no star count, contributor count, release cadence, or community signal surfaced on-page; no backlink/press signals assessable from this analysis. |
| Freshness (0-10) | 8/10 | `/docs` publication_date resolved to 2025-01-15 via htmldate; GitHub release tag v0.6.0 referenced in download links suggests active versioning, though no visible "last updated" date on-page. |

**Total: 54/100** — the page performs solidly on UX mechanics (navigation, CTA clarity, low-friction downloads) but loses the most ground on Schema (0/15), Trust/Authority signals, and page-type coverage for comparison-intent queries.

---

## Limitations

- SERP results were **not live-scraped** in this session (no WebSearch call was executed before the coordinator directed synthesis); SERP feature claims (PAA clusters, comparison-listicle dominance, community-thread presence) are based on well-established patterns for this software category and query type, not a measured top-10 snapshot. Treat all SERP-percentage/consensus claims as directional hypotheses to validate with a live search pass before final prioritization.
- Media inventory is limited to what `parse_html.py` extracts from static `<img>` tags in the rendered HTML; if screenshots/demo video are rendered via CSS background-image, `<canvas>`, or lazy-loaded via JS after the capture point, they would not appear in this analysis and the Media score (5/15) could be understated.
- Schema detection reflects `application/ld+json` and structured markup visible in the fetched HTML only; no manual verification via Google's Rich Results Test was performed.
- Weekly Planner and themes-gallery sections mentioned in the task brief were not independently re-verified beyond the H2 list (`"Your week, at a glance..."`, `"A theme for every mood."`) confirmed in the parsed heading structure — deeper content within those sections (e.g., specific planner features) was not itemized.
- No backlink, domain authority, or actual organic ranking position data was available in this session.
- Persona scores are evidence-based per the observed page structure but should be validated against real user testing or analytics (bounce rate by landing section, scroll depth) where available.

---

## Cross-Skill Recommendations

- **E-E-A-T / Trust gaps** (Authority 5/15, Trust dimension weakest across all personas): recommend `/seo content` for a deeper trust-signal and content-depth pass, particularly around surfacing GitHub community proof.
- **Missing schema** (0/15 across both pages): recommend `/seo schema` to generate `SoftwareApplication` schema (price: $0, operatingSystem list) for the homepage and appropriate `TechArticle`/`FAQPage` schema for `/docs`.
- **Thin comparison/awareness content**: recommend `/seo page` for a page-level audit of a proposed new Comparison Page (e.g., "Inkwell vs Obsidian") before build, and `/seo content` for drafting persona-specific landing sections (developers / writers / researchers).

---

Generate a PDF report? Use `/seo google report`
