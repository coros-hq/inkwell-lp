# Content Quality Audit — inkwell-lp.vercel.app

Site type: SaaS/software product marketing site (free/open-source local-first markdown editor, desktop app for macOS/Windows/Linux). 2 pages total: `/` (homepage) and `/docs` (documentation, 9 sections).

Assessed against Google's September 2025 Quality Rater Guidelines (E-E-A-T, content depth, AI citation readiness).

---

## Content Quality Score: 54/100

The site is well-designed and the docs page has genuinely useful, specific, first-hand-feeling content (exact keyboard shortcuts, file paths, JSON config examples). But it fails on trust/transparency fundamentals (no About/Contact/Privacy/Terms/License pages), has a live version-number contradiction between its two pages, and has a meta-description/on-page-content mismatch that misrepresents the product in search and AI-citation contexts. These are the kind of consistency and transparency signals the Sept 2025 QRG explicitly weights under Trustworthiness.

---

## Finding 1: Version number mismatch between homepage and docs (v0.6.0 vs v0.4.8)

**Severity: High**

**Evidence:**
- Homepage (`/`) nav download button, hero download buttons, and both version-note strings all reference `v0.6.0`:
  - `<a href="https://github.com/coros-hq/inkwell/releases/download/v0.6.0/inkwell_0.6.0_universal.dmg" ... id="nav-dl-btn">`
  - `<p class="version-note">v0.6.0 · Free · Open Source</p>` (hero)
  - `<p class="cta-sub">v0.6.0 · Free · Open Source</p>` (final CTA section)
- Docs page (`/docs`) sidebar displays a hard-coded version badge that does not match:
  - `<p class="sidebar-version">v0.4.8</p>`
- Both were fetched live and confirmed on 2026-07-16 (raw HTML, no caching artifacts — `Last-Modified` headers on both responses were from the same day).

**Why it matters:** A visible, unresolved version mismatch between two pages of a two-page site is a strong "stale/unmaintained docs" signal to both human readers and AI crawlers. Per Sept 2025 QRG, Trustworthiness is the highest-weighted E-E-A-T factor (30%); internal inconsistency of this kind directly undermines it, and is also exactly the sort of copy-paste/no-review artifact the guidelines flag as a marker of low-effort content maintenance. It also risks propagating the wrong version number into AI answer-engine citations (e.g., "inkwell is currently at v0.4.8" pulled from `/docs` while the actual shipping release is v0.6.0).

**Recommendation:** Either (a) drive the docs sidebar version badge from the same source of truth as the homepage download links (ideally pulled dynamically from the GitHub Releases API at build time, since this is an Astro site with static generation), or (b) at minimum manually sync it on every release. Add a CI check or release-checklist step that fails the build if the two values diverge.

---

## Finding 2: Homepage meta description contradicts on-page hero content ("macOS" vs "every platform")

**Severity: High**

**Evidence:**
- Homepage `<head>`:
  - `<meta name="description" content="A local-first markdown editor for macOS. Your notes stay as plain .md files — private, portable, and completely under your control.">`
  - `<meta property="og:description" content="A local-first markdown editor for macOS. Your notes stay as plain .md files — private, portable, and completely under your control.">`
- Homepage visible hero content, same page:
  - Badge: `macOS · Windows · Linux · Free · Open Source`
  - `<h1>Write without distraction.</h1>` / `<p class="hero-sub">A local-first markdown editor for every platform. Your notes stay as plain .md files — private, portable, entirely yours.</p>`
  - Three separate, platform-specific download buttons in the hero and final CTA: macOS (`.dmg`), Windows (`.exe`), Linux (`.deb`)

**Why it matters:** Search engines and AI answer engines (Google AI Overviews, ChatGPT browsing, Perplexity, etc.) frequently use meta description / og:description as the canonical summary of a page rather than re-deriving it from body copy. Right now that canonical summary says "for macOS" — actively wrong and narrower than the actual product, which ships for three platforms. This risks:
  - Search snippets that undersell the product to Windows/Linux searchers (who may not click through, believing it's Mac-only)
  - AI citations that state "inkwell is a macOS markdown editor," which is now factually inaccurate and could deter Windows/Linux users who asked an AI assistant for cross-platform tools
  - This is also a classic sign of the copy not being updated when the product added multi-platform support — the meta tags look like leftover text from an earlier, macOS-only version of the app (see Finding 3 for the parallel issue on `/docs`).

**Recommendation:** Update `<meta name="description">` and `<meta property="og:description">` on the homepage to match current scope, e.g.: "A local-first markdown editor for macOS, Windows, and Linux. Your notes stay as plain .md files — private, portable, and completely under your control." Keep it under ~155–160 characters for search snippet display.

---

## Finding 3: Docs page still describes inkwell as macOS-only (product-scope drift, not just a metadata issue)

**Severity: Medium**

**Evidence:**
- `/docs` "Getting Started" lead paragraph: *"inkwell is a local-first markdown editor for macOS. Your notes are stored as plain .md files in a folder you choose — no sign-up, no cloud, no lock-in."*
- The entire "Install" subsection is Mac-specific and platform-exclusive in its instructions: download `.dmg`, drag to `/Applications`, macOS Gatekeeper security-prompt workaround via "System Settings → Privacy & Security." There is no equivalent install path documented for Windows (`.exe`) or Linux (`.deb`), even though the homepage actively sells and links both.

**Why it matters:** This isn't just a meta-tag problem — the actual documentation content has not been updated to reflect the product's current (v0.6.0) multi-platform scope. A Windows or Linux user who downloads the app from the homepage and then opens `/docs` for setup help will find instructions that don't apply to them and will reasonably conclude the docs (and possibly the product) aren't ready for their platform. This compounds Finding 1 (stale version badge) as evidence that `/docs` has fallen behind the homepage's release cadence — a thin-content / staleness signal under Trustworthiness and Expertise (technical accuracy).

**Recommendation:** Add Windows and Linux install steps to the Getting Started section (or tabbed/collapsible platform-specific instructions), and rewrite the lead sentence to "inkwell is a local-first markdown editor for macOS, Windows, and Linux" to match the homepage.

---

## Finding 4: No About, Contact, Privacy Policy, Terms, License, or Changelog pages anywhere on the site

**Severity: Medium**

**Evidence:**
- Full-site check of both pages' HTML for these signals: the only match for "Privacy" on either page is the in-app instruction phrase "System Settings → Privacy & Security" (macOS Gatekeeper UI path) in the docs Install section — not a Privacy Policy page or link.
- No "About," "Contact," "Terms," "License," or "Changelog" text or links exist on `/` or `/docs`.
- Footer on both pages is identical and minimal: `Built with Tauri, React, and Rust. Free and open source.` plus a GitHub icon link and (`/` only) a Docs link.
- The only external authority/identity signal on the entire site is the GitHub repository link: `https://github.com/coros-hq/inkwell` (org: `coros-hq`). There is no named author, maintainer bio, company page, or contact email/form anywhere on-domain.
- The GitHub repo itself (checked via API) has no `license` field set (`license: None`), 48 stars, 2 open issues — a small, low-visibility repo with no declared open-source license, which is notable since the site explicitly markets the app as "Free and open source" but the repo doesn't carry a machine-readable license.

**Why it matters:** Trustworthiness is weighted 30% in the Sept 2025 QRG E-E-A-T model — the single largest factor — and "contact info, transparency, security" are explicitly named as what raters look for. A two-page product site with zero identity, contact, or policy pages, whose only trust anchor is an unlicensed, low-star GitHub repo, presents a real transparency gap. This matters concretely: the app requests real user data locations (vault folders, GitHub Personal Access Tokens stored in "system keychain" per the docs) and there is no privacy policy explaining data handling despite the "no telemetry, no cloud" claims in the footer/details section — those claims are asserted, not backed by any policy document a user (or an AI system evaluating trust) could point to.

**Recommendation:**
- Add a lightweight footer row with links to: GitHub repo (already present), a `LICENSE` file/badge on the repo (pick and declare one — MIT/Apache-2.0 are typical for this category), and a short Privacy statement (even a single markdown section reiterating "no telemetry, no accounts, no data leaves your device" as a linkable, quotable policy page would materially help both human trust and AI-citation accuracy).
- Consider a minimal "About"/"Who built this" note — even a single sentence with a maintainer name or GitHub handle would give raters and AI systems an actual entity to attribute the product to, rather than an anonymous org slug.

---

## Finding 5: Homepage is thin relative to informational/marketing norms (~300 words) — acceptable for this page type, but coverage is shallow given product complexity

**Severity: Low**

**Evidence:**
- Extracted body text (trafilatura, boilerplate-stripped) word count: **homepage ≈ 300 words**.
- Per the QRG content-minimums table used in this audit, a homepage floor is ~500 words; this page is well under that.
- However, the homepage is highly feature-dense (7 feature cards, a canvas/drawing sub-product, a quick-capture feature, a weekly planner feature, 8 themes, GitHub sync, Claude MCP integration) communicated almost entirely through UI mockups, icons, and short captions rather than prose. Word count is not a ranking factor per Google's own guidance, but the visual-only presentation means large parts of the page (theme names, mockup labels, template pill names) are not substantive extractable text for search/AI systems — a lot of the page's real information density lives in non-text SVG/CSS mockups that text extractors and AI crawlers cannot parse.

**Why it matters:** This isn't a "just add more words" issue — it's a coverage-depth issue. Several homepage features (Quick Capture, Weekly Planner, Canvas templates) are richly interactive in the mockups but get only one or two sentences of actual indexable prose each, meaning an AI answer engine asked "does inkwell have a Kanban board?" or "does inkwell support weekly planning?" has thin textual grounding to draw from on the page that's supposed to be the canonical marketing description.

**Recommendation:** No need to hit an arbitrary word count, but consider adding 1–2 additional sentences of plain-text detail under each major feature section (Canvas, Quick Capture, Weekly Planner) so the substantive capability claims are backed by extractable prose, not just mockup illustrations. This also improves AI citation readiness (Finding 6).

---

## Finding 6: Docs page has strong topical depth and is the site's best AI-citation-ready content

**Severity: Informational (positive finding)**

**Evidence:**
- Extracted body text word count: **docs ≈ 1,474 words** across 9 clearly labeled sections (Getting Started, Editor, Canvas, Organisation, Themes, Export, GitHub Sync, Claude MCP, Shortcuts), each with a numbered `section-label` (01–09), consistent `<h2>`/`<h3>` hierarchy, and an anchor-linked sidebar TOC.
- Content includes concrete, quotable, and structurally extractable elements that AI answer engines favor:
  - Definitive, verifiable statements ("inkwell uses CodeMirror 6," "Notes are saved automatically — there is no Save button," "The `inkwell-mcp` binary is bundled inside the app... communicates over stdio using JSON-RPC 2.0")
  - Structured shortcut tables (Global / Canvas / Editor) as clean key-value rows — ideal for extraction into answer boxes
  - A literal JSON config example for Claude Desktop MCP setup, and a YAML frontmatter example — both copy-pasteable, which is a strong first-hand/experience signal (E-E-A-T "Experience" factor)
  - Enumerated tool lists (6 MCP tools: `list_notes`, `read_note`, `create_note`, `update_note`, `search_notes`, `get_vault_info`) each with a one-line definitive description — this is close to ideal structure for LLM extraction/citation.
- This page exceeds the 1,500-word blog-post floor almost exactly and comfortably clears the 800-word service-page floor, with genuine topical breadth (not padding).

**Why it matters:** This page is doing the heavy lifting for the site's overall E-E-A-T and AI-citation readiness. It demonstrates real product-specific expertise (exact file paths like `.inkwell/canvas.json`, `~/.inkwell/active-vault`, precise keychain/token-scope instructions) that reads as authentic first-hand documentation rather than generic AI-generated filler — a positive signal under the Sept 2025 QRG's guidance that AI content is acceptable when it demonstrates genuine expertise and specificity.

**Recommendation:** No content changes needed here beyond fixing Findings 1 and 3 (version badge and macOS-only install instructions). Consider adding a "Last updated" date or changelog entry to this page to reinforce freshness signals, since `publication_date` was detected as 2025-01-15 by htmldate but there's no on-page confirmation of when docs sections were last reviewed — especially important given the version-drift issue found above.

---

## Finding 7: Duplicate content risk — minimal, but the "for macOS" phrase and feature descriptions are copy-pasted verbatim between homepage and docs

**Severity: Low**

**Evidence:**
- Several phrases appear near-identically on both pages, e.g.:
  - Homepage: *"A full drawing canvas lives inside inkwell — flowcharts, mind maps, sequence diagrams, and freehand sketches, right next to your notes."*
  - Docs: *"A full drawing canvas lives alongside your notes. Sketch diagrams, flowcharts, and mind maps using a custom HTML5 drawing engine — no third-party libraries, no export needed."*
  - Homepage: *"Push any note to a GitHub repository as a .md file, or pull the latest version back in. Keep your project docs and READMEs in sync..."*
  - Docs: *"Push any note to a GitHub repository as a .md file, and pull the latest version back in with one click."*
- These are near-duplicates (reworded, not verbatim), so this is not a technical duplicate-content penalty risk with only 2 pages on the site — but it does mean the docs page adds less unique incremental value over the homepage for these specific features than it could.

**Why it matters:** Low risk given the site only has 2 pages and search engines won't meaningfully penalize a 2-page site for this. Flagged for completeness per the audit brief's request to assess duplicate content risk.

**Recommendation:** No urgent action. If expanding the docs in the future, differentiate the docs copy further from the homepage marketing copy (more technical/how-to framing, less benefit-statement framing) to maximize unique value per page.

---

## E-E-A-T Breakdown

| Factor | Weight | Score (/100) | Notes |
|---|---|---|---|
| Experience | 20% | 55 | Docs show genuine hands-on specificity (exact file paths, JSON configs, keyboard shortcuts) — reads as real product knowledge. But no case studies, testimonials, screenshots of real usage, or user-generated proof (reviews, community links). |
| Expertise | 25% | 50 | Technical docs are accurate and detailed (CodeMirror 6, JSON-RPC 2.0, Tauri/React/Rust stack named in footer). Undermined by the version-badge/install-instructions drift (Findings 1 & 3), which reads as unmaintained/inexpert upkeep. |
| Authoritativeness | 25% | 35 | Single external signal: an unlicensed, 48-star GitHub repo under an anonymous org (`coros-hq`). No press mentions, no backlink signals assessed, no named maintainer, no third-party validation of any kind visible on-site. |
| Trustworthiness | 30% | 40 | No Privacy Policy, Terms, About, Contact, or License page. "No telemetry" and "fully local" claims are asserted in marketing copy with no linkable policy to back them. Compounded by the live version mismatch and inaccurate meta description — both are factual-accuracy/consistency failures on a 2-page site. |

**Weighted E-E-A-T score: ≈ 43/100**

---

## AI Citation Readiness Score: 62/100

**Strengths:**
- Docs page has excellent structural hierarchy (H1 > H2 > H3, numbered sections, anchor IDs) and many short, definitive, quotable statements ideal for LLM extraction.
- Structured tables (shortcuts, themes) and enumerated lists (MCP tools, canvas templates, export formats) are clean key-value/list formats that answer engines can lift directly.
- Concrete technical facts (protocol names, file paths, exact commands) give AI systems high-confidence, low-ambiguity facts to cite.

**Weaknesses:**
- The meta description (likely to be used verbatim by some AI summarizers as the page's canonical description) is factually wrong about platform support (Finding 2) — this is the single biggest AI-citation-readiness risk on the site, since it could cause an AI assistant to confidently tell a user "inkwell is Mac-only" when it isn't.
- The version-number contradiction (Finding 1) means an AI system citing "current version" could give either 0.4.8 or 0.6.0 depending on which page it crawled — a direct citation-accuracy failure.
- Homepage's heaviest feature content (Quick Capture, Weekly Planner) is under-described in extractable text relative to its visual prominence (Finding 5), limiting what AI systems can say about those features from the homepage alone.
- No structured data / JSON-LD (Organization, SoftwareApplication, or FAQPage schema) detected in either page's `<head>` — adding `SoftwareApplication` schema with `softwareVersion`, `operatingSystem`, and `license` fields would give AI systems and search engines an unambiguous, structured source of truth that also happens to force the version-mismatch bug to surface at build time.

---

## Top Recommendations (priority order)

1. **Fix the version mismatch** (v0.6.0 vs v0.4.8) — single source of truth, ideally automated from the GitHub Releases API at build time. (Finding 1)
2. **Fix the meta description** to say "macOS, Windows, and Linux," matching on-page hero content. (Finding 2)
3. **Update `/docs` Getting Started/Install section** for Windows and Linux, not just macOS. (Finding 3)
4. **Add minimal trust pages**: a Privacy statement, a declared open-source license (both on-site and in the GitHub repo), and ideally a named maintainer/About blurb. (Finding 4)
5. **Add `SoftwareApplication` JSON-LD structured data** to the homepage with accurate `softwareVersion`, `operatingSystem`, and `license` fields — this both improves AI/search citation accuracy and creates a build-time forcing function that would have caught Finding 1 automatically.
