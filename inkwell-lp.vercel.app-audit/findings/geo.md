# GEO / AI Search Readiness Audit — inkwell-lp.vercel.app

**Pages audited:** `/` (homepage), `/docs` (documentation)
**Method:** Live HTTP fetch (`curl`, HTTP 200 on both pages), raw-HTML inspection since the site is static Astro output with no client-side hydration shell (confirmed: no `id="root"`/`id="app"`, no `client:load`/`client:only` islands — raw HTML equals final HTML, so every AI crawler that does a plain GET gets full content with zero JS execution required).

---

## GEO Readiness Score: 42 / 100

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 58/100 | 14.5 |
| Structural Readability | 20% | 45/100 | 9.0 |
| Multi-Modal Content | 15% | 20/100 | 3.0 |
| Authority & Brand Signals | 20% | 15/100 | 3.0 |
| Technical Accessibility | 20% | 62/100 | 12.4 |
| **Total** | | | **~42** |

The site's core content quality (concrete, factual, well-organized docs) is genuinely good — the drag on the score is almost entirely missing infrastructure (llms.txt, structured data, brand distribution) rather than bad content.

---

## 1. AI Crawler Accessibility

**Status: No `robots.txt` exists at all (confirmed 404 at `/robots.txt`).**

This is a distinct condition from an *empty* or *present-but-permissive* robots.txt, and it's worth being precise about the implications:

- **Crawling implication: functionally equivalent to full allow.** Per the Robots Exclusion Protocol, a missing robots.txt (any 4xx response) is treated by every major crawler — including GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot — as "no rules apply, crawl everything." So today, nothing is blocking any AI crawler from fetching `/` or `/docs`. In that narrow sense it is **not worse than an empty-allow file** for crawl access.
- **Where it is worse: zero signaling / zero control surface.** A missing file means:
  - No way to differentiate policy between crawlers (e.g., you cannot currently welcome GPTBot/PerplexityBot for answer-engine visibility while declining CCBot/anthropic-ai for training-only scraping — a distinction the user's own GEO framework recommends).
  - No `Sitemap:` directive pointing crawlers to a sitemap (moot right now since `/sitemap.xml` is also 404 — see below).
  - Some crawlers/tooling treat an absent robots.txt as a weak trust/maturity signal during evaluation (not a hard block, but it reads as "this site was never configured for programmatic consumption," which is a mild negative alongside the missing llms.txt and structured data).
  - If the site is ever expanded (more marketing pages, blog, changelog) there's no existing scaffold to extend — the first person who needs to block something (e.g. a staging path) has to create the file under time pressure rather than iterating on an established policy.

**Verdict: not urgent for pure crawlability, but a 10-minute fix that converts an implicit default into an explicit, intentional policy.** Recommend creating a minimal `robots.txt` that explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot, and adds a `Sitemap:` line once a sitemap exists.

Also confirmed 404: `/sitemap.xml` — with only 2 pages this is low-severity, but Astro's official sitemap integration (`@astrojs/sitemap`) is a one-line config addition and gives every crawler (including AI crawlers that respect `Sitemap:` hints) a canonical discovery path.

---

## 2. llms.txt Status: **Missing — high-value, low-effort opportunity**

Confirmed 404 at `/llms.txt`. Given the site's actual structure, this is one of the better llms.txt candidates possible: a small, high-clarity product with docs that are *already* organized into exactly the kind of outline llms.txt wants.

The 9 docs sections map directly to an llms.txt structure with almost no editorializing needed:

```markdown
# inkwell

> inkwell is a free, open-source, local-first markdown editor for macOS,
> Windows, and Linux. Notes are stored as plain .md files on disk — no
> account, no cloud, no lock-in. Built by coros-hq.

## Docs
- [Getting Started](https://inkwell-lp.vercel.app/docs#getting-started): Install, open a vault, create your first note
- [Editor](https://inkwell-lp.vercel.app/docs#editor): CodeMirror 6, split view, GitHub Flavored Markdown, frontmatter
- [Canvas](https://inkwell-lp.vercel.app/docs#canvas): Built-in drawing canvas — shapes, templates, canvas notes
- [Organisation](https://inkwell-lp.vercel.app/docs#organisation): Folders, pins, search, Kanban board, note links, attachments, trash
- [Themes](https://inkwell-lp.vercel.app/docs#themes): 8 built-in themes, custom theme builder
- [Export](https://inkwell-lp.vercel.app/docs#export): Markdown, HTML, PDF export
- [GitHub Sync](https://inkwell-lp.vercel.app/docs#github-sync): Push/pull notes to a GitHub repo
- [Claude MCP](https://inkwell-lp.vercel.app/docs#claude-mcp): Native Rust MCP server, stdio + JSON-RPC 2.0
- [Keyboard Shortcuts](https://inkwell-lp.vercel.app/docs#shortcuts): Global, canvas, and editor shortcuts

## Optional
- [GitHub Repository](https://github.com/coros-hq/inkwell): Source code, releases, issues
```

**Important blocker to flag before this can be built exactly as above: the docs page currently has no per-section anchor IDs** (see Section 3) — so the `#getting-started`-style fragment links in the outline above are aspirational, not currently functional. Recommend shipping heading IDs (Section 3) in the same pass as llms.txt, or the llms.txt links will only resolve to the top of the page rather than the specific section, which weakens its citation value.

Also flag: RSL 1.0 licensing — no `license.txt`/RSL block found and none is required here (the codebase itself is presumably open-source under its own repo license, but that's a separate axis from content licensing for AI training). Given this is a marketing/docs site for an open-source project, adding an explicit RSL statement is optional and low-priority relative to the llms.txt gap.

---

## 3. Passage-Level Citability of Docs Content

Extracted and word-counted each of the 9 sections from `extracted_text`-equivalent (script-and-style-stripped) HTML on `/docs`:

| # | Section | Word count | vs. 134–167 optimal |
|---|---|---|---|
| 01 | Getting Started | 171 | Just above optimal — good |
| 02 | Editor | 194 | Above optimal — could split |
| 03 | Canvas | 419 | Well above — needs sub-passage chunking |
| 04 | Organisation | 245 | Above optimal — 7 subtopics compressed together |
| 05 | Themes | 105 | Below optimal — thin |
| 06 | Export | 82 | Below optimal — thin, could merge with Themes or expand |
| 07 | GitHub Sync | 133 | **Right in the optimal band** |
| 08 | Claude MCP | 203 | Above optimal |
| 09 | Keyboard Shortcuts | 105 | Below optimal (reference table, expected to be short) |

**What's working well:**
- Content is genuinely fact-dense and quotable exactly as the brief hypothesized. Concrete, self-contained, extractable statements exist verbatim in the raw HTML (verified directly, not just in rendered output):
  - *"Press ⌘N or click the + button in the sidebar"* — a complete, directly answerable instruction.
  - *"inkwell uses CodeMirror 6 for a fast, distraction-free writing experience"* — specific technology attribution, exactly the kind of fact AI answer engines lift for "what editor library does X use" queries.
  - *"The inkwell-mcp binary is bundled inside the app. It communicates with Claude Desktop (or any MCP-compatible client) over stdio using JSON-RPC 2.0."* — highly specific, technically precise, and answers a likely query ("how does inkwell's MCP server communicate") in one self-contained sentence.
  - *"inkwell renders full GitHub Flavored Markdown including tables, task lists, strikethrough, code blocks with syntax highlighting, blockquotes, inline images, and footnotes"* — a clean, list-style answer to "does inkwell support GFM."
- No fluff/filler padding diluting these facts — sentences are declarative and dense, which is exactly what makes short passages extractable without losing meaning.

**What's holding citability back:**
1. **No heading IDs / anchor links anywhere on `/docs`.** Confirmed by inspecting all `<h1>`–`<h4>` tags in the raw HTML: none carry an `id` attribute (only `data-astro-cid-*` scoping hashes, which are not usable as URL fragments). This means AI engines and Perplexity-style citation UIs that prefer deep-linking straight to the relevant passage (e.g. `docs#claude-mcp`) cannot currently do so — every citation of this page can only point at the page root, forcing the reader to scroll/search manually. This is the single highest-leverage structural fix on the page.
2. **Zero question-phrased headings.** All 27 headings (1 H1, 8 H2, 18 H3) are noun-phrase labels ("Editor," "Split view," "Frontmatter") rather than the question form ("How do I open a vault?", "How does inkwell's MCP server communicate with Claude?") that both the brief's framework and observed AI Overview behavior favor for direct Q&A matching. The underlying content already answers implicit questions — only the heading phrasing needs to change, which is a low-effort, content-preserving edit.
3. **Keyboard shortcuts are not marked up as a `<table>`.** Confirmed: `grep` for `<table` in the docs HTML returns zero matches; shortcuts instead use 41 `<kbd>` tags inside what is presumably a CSS grid/flex layout. Semantic `<table>` markup (with `<th>` for the action/shortcut columns) is the structure AI extraction pipelines and Google's rich-result-adjacent parsers most reliably parse as key-value reference data. This is a moderate-effort fix (rewrite the shortcuts section markup) with an outsized payoff, because "what's the shortcut for X" is a very common, very literal query shape AI answer engines are built to serve.
4. **Section-length variance works against the "self-contained passage" ideal.** Canvas (419 words) bundles 7 sub-behaviors into one long block; Export (82 words) and Themes (105 words) are thin enough that they may get pulled in alongside irrelevant neighboring text rather than cited cleanly on their own. Splitting Canvas's H3s into standalone citable units (they already have H3 boundaries — just need IDs, per point 1) and lightly expanding Export/Themes to the 134–167 band would tighten this further.
5. **No FAQ-style content anywhere.** Zero `?` characters found in any H2/H3 across both pages. This isn't necessarily wrong (the docs are legitimately reference/how-to content, not Q&A — and the schema audit correctly recommends against forcing FAQPage schema onto it), but a short, genuinely Q&A-shaped section (e.g., "Is inkwell free?", "Does inkwell work offline?", "Can I use my existing Obsidian vault?" — the vault-compatibility fact is already in the copy, just not framed as a question) would give AI engines an easy, low-risk citation target without misrepresenting the rest of the page's content type.

**Additional accuracy/freshness issue directly affecting citation trustworthiness:** the docs page displays version **v0.4.8** while the homepage displays **v0.6.0** (confirmed via `grep` on both pages' raw HTML; also independently flagged by the schema audit at `src/pages/index.astro:5` vs `src/pages/docs.astro:6`). A stale version number on the page most likely to be cited for "what version of X" queries is a direct correctness risk for AI answer engines, which increasingly cross-check numeric claims. Recommend a single source of truth (shared Astro constant/config value) for the version string.

**Cross-page consistency issue:** the homepage `og:description` and the docs "Getting Started" lead sentence both state inkwell is "a local-first markdown editor for macOS" (singular platform), while the download section of the homepage offers `.dmg` (macOS), `.exe` (Windows), and `.deb` (Linux) builds, and the user's own brief describes this as a macOS/Windows/Linux app. If Windows/Linux support is real and current, the copy undersells it in exactly the passages most likely to be lifted verbatim by an AI engine answering "what platforms does inkwell support" — worth reconciling so the citable claim matches the actual product.

---

## 4. Authority & Brand Signals

This is the weakest dimension, and mostly reflects the project's genuine youth rather than a fixable technical error — but it's worth quantifying precisely because it directly affects whether AI engines trust and correctly attribute the brand.

| Signal | Finding | Correlation weight |
|---|---|---|
| YouTube mentions | None found on-site; no video content, no YouTube link anywhere in either page's HTML | ~0.737 (strongest signal) — currently at zero |
| Reddit presence | Could not be verified directly (Reddit blocks automated access from this environment with a 403 network-policy page); no Reddit link found on-site either | High correlation — unverified, but no on-site signal exists to point to one even if it exists off-site |
| Wikipedia entity | No Wikipedia page for this product (expected, given project age) — **but see naming-collision risk below** | High correlation — currently absent |
| LinkedIn | No LinkedIn link found on either page | Not scored in the framework's table, but zero presence |
| Domain Rating / backlinks | Not directly measurable in this pass; domain is a Vercel subdomain (`inkwell-lp.vercel.app`), which is itself a weak trust signal vs. a custom domain — correlation with citation is weak (~0.266) but a custom domain still marginally helps | Weak correlation — low priority regardless |
| GitHub org signal | `github.com/coros-hq` confirmed live (HTTP 200). Org created **2026-04-18** (per GitHub API `created_at`), only **4 followers**, no org `description` set. `coros-hq/inkwell` repo is linked correctly from both pages. | Present but very thin — a 3-month-old org with 4 followers is a weak entity signal for LLM knowledge-graph association today, though this will naturally strengthen over time if the project grows |
| Authorship/dateline metadata | No `<meta name="author">`, no `datePublished`/`dateModified`, no `<time>` elements, no JSON-LD `Person`/`Organization` (confirmed independently by the schema audit) anywhere on either page | Absent |

### Naming collision risk: confirmed and material

Checked directly: **`en.wikipedia.org/wiki/Inkwell_(software)`** resolves (HTTP 200) and documents **"Inkwell,"** Apple's handwriting-recognition technology built into Mac OS X (introduced in 10.2 "Jaguar," discontinued alongside 32-bit app support in Catalina, 2019). This is a materially bad collision for three compounding reasons:

1. It's an **Apple** product, and this new "inkwell" is **also** a macOS-first app — so the entity confusion isn't just "same name, different category," it's "same name, same platform ecosystem (Apple/macOS)," which is exactly the condition most likely to cause an LLM to blend or misattribute facts between the two ("inkwell" + "macOS" + "handwriting/text input" are all shared context clues).
2. Apple's Inkwell has an existing, well-established Wikipedia article — Wikipedia is one of the highest-authority sources in most LLM training corpora and RAG pipelines, meaning this competing entity is *already* well-represented where the new product has zero footprint.
3. The new product's own brand infrastructure does nothing to disambiguate: no distinctive H1 tagline pairing (e.g., consistently pairing "inkwell" with "coros-hq" or a more distinctive secondary identifier), no Organization/SoftwareApplication schema (which is exactly the mechanism that helps a knowledge graph distinguish "inkwell (markdown editor, coros-hq, 2026)" from "Inkwell (handwriting recognition, Apple, 2002)").

Could not exhaustively verify every other "Inkwell"-named product via search in this environment (general web search tooling here is limited/blocked for some engines), but general knowledge corroborates additional adjacent uses of the name (e.g., a comic-lettering font/tool called Inkwell, and various journaling/writing apps that have used the name informally over the years) — reinforcing that "inkwell" alone is a crowded, non-distinctive term in the writing-software space, independent of the Apple collision specifically.

**Recommendation:** this doesn't mean renaming (that's a business decision far outside this audit's scope), but it does mean disambiguation work is disproportionately important here relative to a project with a more unique name:
- Consistently render the brand as **"inkwell by coros-hq"** or **"inkwell (coros-hq)"** in title tags, meta descriptions, and the first sentence of on-page copy, so AI engines have a strong co-occurring disambiguator every time the bare word "inkwell" appears.
- Add `SoftwareApplication` + `Organization` JSON-LD (already recommended independently by the schema audit) — this is the most direct machine-readable disambiguation signal available and should be treated as doing double duty for both schema *and* GEO brand-clarity purposes.
- Consider a short "Not to be confused with Apple's discontinued Inkwell handwriting feature" aside is unnecessary/overkill, but a distinctive, consistently-used product description string (already present: "local-first markdown editor") should appear in every title tag and every external listing (GitHub description, any directory submissions) rather than the bare name alone.

---

## 5. Technical Accessibility for AI Crawlers

**Verdict: strong foundation.** This is the one dimension where the site is ahead of typical GEO audit findings, and it's worth stating plainly so the other gaps aren't misread as "the whole site is broken for AI."

- **Confirmed fully SSR'd / static.** Both `/` and `/docs` return complete HTML on a plain unauthenticated GET (verified via `curl` with no JS execution) — every fact cited in Section 3 (CodeMirror 6, stdio/JSON-RPC 2.0, keyboard shortcuts, etc.) is present in the raw first-response HTML, not injected client-side. This is the Astro static-output model working exactly as intended for crawler access — no SPA-shell risk, no hydration-gated content, nothing an AI crawler that skips JS execution (which most do, including GPTBot and ClaudeBot in their default configurations) would miss.
- **No `noindex`, no `noai`/`nosnippet`/`max-snippet` directives** found in meta tags on either page — nothing is actively suppressing AI or search snippet eligibility.
- **Fast, cacheable delivery.** Both pages serve from Vercel's edge cache (`x-vercel-cache: HIT`, `age` headers present), `Content-Length` is modest (~64KB home, ~38KB docs) — no performance-based crawl-budget concern for a 2-page site.
- **Gaps that do hurt this dimension:**
  - Missing `/robots.txt` and `/sitemap.xml` (Section 1) — not a hard block, but removes explicit discovery signals.
  - Missing `<link rel="canonical">` on both pages (confirmed by both this audit and the schema audit) — for a 2-page site the duplicate-content risk is minimal, but canonical tags are also a mild trust/clarity signal for crawlers establishing the authoritative URL for a given piece of content, which matters if the Vercel preview domain or any future custom domain ever creates duplicate-URL ambiguity.
  - No `og:image` (confirmed by schema audit) — doesn't block crawling, but weakens how the page appears when surfaced/shared by AI-answer UIs that render link previews.

---

## Platform-Specific Assessment

| Platform | Estimated readiness | Rationale |
|---|---|---|
| **Google AI Overviews** | Low-Medium | Fully crawlable SSR content helps, but zero structured data (no `SoftwareApplication`, confirmed by schema audit) and no canonical/sitemap remove several of AIO's preferred entity-grounding signals. Content itself (concrete, factual) is well-suited if discovered. |
| **ChatGPT / OAI-SearchBot** | Low-Medium | Not blocked by robots.txt (none exists), content is crawlable, but no llms.txt (OpenAI's crawler and ChatGPT browsing both benefit from it when present) and thin backlink/brand-mention footprint limit discovery likelihood in the first place — the content quality won't matter if the crawler never prioritizes visiting a low-authority, 3-month-old, sparsely-linked domain. |
| **Perplexity** | Medium | Perplexity tends to reward exactly the kind of dense, factual, specific-detail passages this docs page has (CodeMirror 6, JSON-RPC 2.0, etc.) once it does crawl/index the page — the content-quality ceiling is the highest of any platform here, but is currently gated by the same discovery/authority weaknesses as ChatGPT. |
| **Bing Copilot** | Low-Medium | Similar profile to Google — benefits from IndexNow/Bing Webmaster Tools submission (not verified/assessed in this pass) and would benefit from the same schema/sitemap fixes recommended above. |

Given the framework's own data point that only ~11% of domains are cited by both ChatGPT and Google AI Overviews, and this domain currently has weak signals across nearly every non-content dimension, the realistic near-term goal should be improving the *foundation* (llms.txt, schema, heading IDs, brand disambiguation) rather than expecting broad multi-platform citation immediately — the content itself will not be the bottleneck once discovered.

---

## Top 5 Highest-Impact Changes

| # | Change | Impact | Effort |
|---|---|---|---|
| 1 | **Add heading `id` attributes to every H2/H3 on `/docs`** (e.g. `#claude-mcp`, `#github-sync`) and use them to build a working llms.txt with deep links per section | High — unlocks precise citation/deep-linking for every AI engine and is a prerequisite for a fully functional llms.txt | Low (Astro heading-slug config or manual IDs; ~1 hour) |
| 2 | **Create `/llms.txt`** using the 9 existing docs sections as the outline (draft provided in Section 2) | High — directly-supported discovery format for LLM-based crawlers/agents; currently 404 despite being a near-perfect structural fit | Low (static file, ~30 min once heading IDs from #1 exist) |
| 3 | **Add `SoftwareApplication` + `Organization`/`WebSite` JSON-LD** (already independently recommended by the schema audit — treat as shared priority across both audits) | High — machine-readable entity grounding is the most direct lever against the "Inkwell" naming-collision risk, and is a proven Google rich-result type for this exact product category | Medium (structured content exists; needs implementation + fixing the 0.4.8/0.6.0 version mismatch as a prerequisite) |
| 4 | **Rewrite the Keyboard Shortcuts section as a semantic `<table>`** and convert several H2/H3 labels to question-phrased headings where natural (e.g. "How does inkwell sync with GitHub?") without altering the underlying answer content | Medium-High — directly targets literal "what's the shortcut for X" / "how do I X" query patterns that AI engines serve most often | Medium (markup rewrite + copy-editing pass, no new content research needed) |
| 5 | **Establish minimal robots.txt + sitemap.xml, and build brand disambiguation into on-page copy** ("inkwell by coros-hq," consistent product-description string paired with the bare name) | Medium — closes the explicit-signal gap identified in Section 1 and starts counteracting the Apple "Inkwell (software)" Wikipedia collision described in Section 4 | Low (robots.txt + `@astrojs/sitemap` config: ~30 min; copy consistency pass: ~1 hour) |

---

## Files referenced during this audit

- Live fetch: `https://inkwell-lp.vercel.app/`, `https://inkwell-lp.vercel.app/docs`, `https://inkwell-lp.vercel.app/robots.txt` (404), `https://inkwell-lp.vercel.app/llms.txt` (404), `https://inkwell-lp.vercel.app/sitemap.xml` (404)
- `https://api.github.com/orgs/coros-hq` (org metadata: created 2026-04-18, 4 followers, no description)
- `https://en.wikipedia.org/wiki/Inkwell_(software)` (confirmed naming-collision entity: Apple's discontinued handwriting-recognition feature)
- Cross-referenced with existing audit output: `/Users/ayphone/Documents/side_projects/inkwell-lp/inkwell-lp.vercel.app-audit/findings/schema.md` (JSON-LD absence, version mismatch independently confirmed) and `/Users/ayphone/Documents/side_projects/inkwell-lp/inkwell-lp.vercel.app-audit/findings/_metrics.json` (page structure/DOM metrics)
