# Content Quality Audit — inkwell-lp.vercel.app (Updated 2026-09-20)

Site type: SaaS/software product marketing site (free/open-source local-first markdown editor for macOS/Windows/Linux). Pages assessed: `/` (homepage), `/docs`, `/privacy`.

Prior audit: 2026-07-16, score 54/100. Re-verified live against current HTML (git history shows "seo optimization" 2026-07-17, accessibility fixes 2026-07-17, "update docs and website" 2026-09-10).

---

## Content Quality Score: 78/100 (up from 54)

Most high/medium-severity findings from the July audit are resolved. Version numbers are now consistent (v0.7.8 everywhere — homepage nav/hero/CTA and docs sidebar all match). Meta description and og:description now correctly say "macOS, Windows, and Linux" instead of "macOS" only. A `/privacy` page now exists, is linked in both footers, and gives concrete, verifiable claims (no telemetry, no accounts, what Vercel Analytics collects, GitHub Sync/Claude MCP are opt-in). Docs Getting Started now has separate install instructions for macOS, Windows, and Linux. Remaining gaps are lower-severity trust/authority items.

---

## Resolved since July 2026

- **Version mismatch (was Finding 1, High):** Fixed. Homepage and docs both show v0.7.8; JSON-LD `softwareVersion` on all three pages matches too.
- **Meta description platform mismatch (was Finding 2, High):** Fixed. `<meta name="description">` and `og:description` now read "A local-first markdown editor for macOS, Windows, and Linux."
- **Docs macOS-only install instructions (was Finding 3, Medium):** Fixed. `/docs` Getting Started has three parallel install subsections (macOS `.dmg`, Windows `.exe` + SmartScreen note, Linux `.deb` + apt command).
- **No Privacy page (part of Finding 4):** Fixed. `/privacy` (200 OK) is substantive, specific, and linked from both homepage and docs footers.
- **JSON-LD structured data absent (AI-readiness weakness):** Fixed. All three pages carry `SoftwareApplication` JSON-LD with `operatingSystem`, `softwareVersion`, `offers`, `downloadUrl`.

## Still open / new findings

**Finding A — No About, Contact, Terms, License, or Changelog pages (Severity: Medium).** `/about`, `/contact`, `/terms`, `/license`, `/changelog` all 404. The homepage's "What's new" section functions as an inline changelog but isn't a standalone, linkable/citable page. GitHub API confirms the repo (`coros-hq/inkwell`, 67 stars) still has **no declared license** (`license: null`), while the site markets it as "open source" — a factual-transparency gap. No named maintainer/author anywhere on-site; only anonymous org handle "coros-hq."

**Finding B — `SoftwareApplication` schema reused verbatim on the Privacy page (Severity: Low).** `/privacy`'s JSON-LD is identical `SoftwareApplication` markup (with the privacy page's own description swapped in), which is a semantically odd/generic schema choice for a policy page. Not harmful, but a missed opportunity for `WebPage`/`Organization` schema and a minor duplicate-boilerplate pattern.

**Finding C — Stale example dates in docs (Severity: Low).** The Abbreviations section's built-in example table shows `:today → 2026-07-17`, `:tomorrow → 2026-07-18`, etc. — static text not refreshed despite the Sept 10 "update docs and website" commit, and now two months stale relative to today (2026-09-20). Low impact (clearly an illustrative example) but a minor freshness/attention-to-detail signal an AI system or careful reader could flag as outdated.

**Finding D — Authoritativeness remains weak (Severity: Medium, unchanged).** Still the only external signal is the GitHub repo (67 stars, 2 pages of site). No press mentions, testimonials, user reviews, or third-party validation. This is a structural limitation of a young 2-page product site, not something content fixes alone solve — but it keeps Authoritativeness the lowest-scoring E-E-A-T factor.

**Finding E — Homepage/docs content depth (Severity: Informational, resolved from thin-content concern).** Homepage now runs ~1,000+ words of extractable prose (feature cards, changelog grid, canvas/quick-capture sections) — comfortably above the 500-word homepage floor. Docs page is ~2,500 words across 9 well-structured sections (Getting Started, Editor, Canvas, Organisation, Themes, Export, GitHub Sync, Claude MCP, Shortcuts) — well above the 1,500-word floor, with genuine topical depth, structured shortcut tables, JSON/YAML config examples, and enumerated MCP tool lists. No thin-content or duplicate-content risk found between the two pages beyond expected topic overlap (canvas, GitHub sync descriptions are reworded, not copy-pasted).

---

## E-E-A-T Breakdown

| Factor | Weight | Score (/100) | Notes |
|---|---|---|---|
| Experience | 20% | 65 | Docs show genuine hands-on specificity (exact file paths, JSON configs, keyboard shortcuts, keychain/token instructions). Still no testimonials, case studies, or user-generated proof. |
| Expertise | 25% | 70 | Technical accuracy is now consistent across pages (version, platform claims all aligned). Detailed, correct references (CodeMirror 6, JSON-RPC 2.0, Tauri/React/Rust). Minor deduction for the stale doc example dates (Finding C). |
| Authoritativeness | 25% | 38 | Still only an anonymous, unlicensed GitHub org as an external signal (67 stars). No press, no named maintainer, no third-party citations. Unchanged from July. |
| Trustworthiness | 30% | 68 | Big improvement: dedicated, specific Privacy page now backs the "no telemetry / local-first" claims with verifiable detail. Still missing Terms, License declaration (on-site and in the repo), About/Contact identity. |

**Weighted E-E-A-T score: ≈ 61/100** (up from ≈43/100 in July)

---

## AI Citation Readiness Score: 80/100 (up from 62)

**Strengths:** Version and platform claims are now consistent across every page and the JSON-LD, removing the two biggest citation-accuracy risks from July. `SoftwareApplication` schema is present sitewide with accurate `softwareVersion`/`operatingSystem`. Docs retain excellent structural hierarchy, quotable definitive statements, structured tables, and copy-pasteable config examples ideal for LLM extraction.

**Weaknesses:** No license field on the schema or repo (an AI system asked "what license is inkwell under?" has no source to cite). Privacy page's reused SoftwareApplication schema is a minor structural mismatch. Lack of any About/maintainer identity means AI systems can't attribute the product to a named entity beyond a GitHub org slug.

---

## Top Recommendations (priority order)

1. **Declare and publish an actual open-source license** (e.g., MIT) both in the GitHub repo's `LICENSE` file and reflected in the site's JSON-LD/footer — closes the single biggest remaining "asserted but unverifiable" trust claim.
2. **Add a minimal About/maintainer blurb** — even one sentence naming a person or handle behind `coros-hq` gives raters and AI systems an entity to attribute the product to.
3. **Refresh the static example dates** in the docs Abbreviations section so they don't visibly lag the "last updated" commit date.
4. **Give the Privacy page its own schema type** (`WebPage` or drop schema on policy pages) rather than reusing `SoftwareApplication` verbatim.
5. **Consider a standalone `/changelog` page** (in addition to the homepage's inline "What's new") so release history is independently linkable/citable and doesn't require re-deploying the homepage to preserve history.
