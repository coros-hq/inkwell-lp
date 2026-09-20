# Structured Data (Schema.org) Audit — inkwell-lp.vercel.app

**Date:** 2026-09-20
**Pages audited:** `/` (home), `/docs`
**Method:** Live HTML source fetched via `curl` (server-rendered, Astro static site — no client-side injection to worry about), JSON-LD parsed and validated.
**Score: 58/100**

Prior audit (2026-07-16) found zero structured data. Since then, JSON-LD has been added to both pages (likely part of the "seo optimization" commit `807dd05`). This is real progress, but the implementation has correctness issues that should be fixed before it can be considered solid.

---

## 1. Detection Results

| Page | Format | @type | Present |
|---|---|---|---|
| `/` | JSON-LD | `SoftwareApplication` | ✅ |
| `/docs` | JSON-LD | `SoftwareApplication` | ✅ |

No Microdata or RDFa found on either page. No `Organization`, `WebSite`, or `BreadcrumbList` schema anywhere on the site.

### `/` — JSON-LD (verbatim)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "inkwell",
  "description": "A local-first markdown editor for macOS, Windows, and Linux. Your notes stay as plain .md files — private, portable, and completely under your control.",
  "url": "https://inkwell-lp.vercel.app/",
  "operatingSystem": ["macOS", "Windows", "Linux"],
  "applicationCategory": "DeveloperApplication",
  "softwareVersion": "0.7.8",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "downloadUrl": "https://github.com/coros-hq/inkwell/releases/latest"
}
```

### `/docs` — JSON-LD (verbatim)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "inkwell",
  "description": "Everything you need to know about inkwell: editor, canvas, themes, GitHub sync, Claude MCP, and keyboard shortcuts.",
  "url": "https://inkwell-lp.vercel.app/",
  "operatingSystem": ["macOS", "Windows", "Linux"],
  "applicationCategory": "DeveloperApplication",
  "softwareVersion": "0.7.8",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "downloadUrl": "https://github.com/coros-hq/inkwell/releases/latest"
}
```

---

## 2. Validation Results

| Check | `/` | `/docs` |
|---|---|---|
| `@context` = `https://schema.org` (https, correct casing) | ✅ Pass | ✅ Pass |
| `@type` valid, not deprecated | ✅ Pass | ✅ Pass (see note below — wrong type for the page's content) |
| Required properties present (`name`) | ✅ Pass | ✅ Pass |
| Property value types correct | ✅ Pass | ✅ Pass |
| No placeholder text | ✅ Pass | ✅ Pass |
| URLs absolute | ✅ Pass | ⚠️ **Fail** — `url` field is absolute but points to the wrong page |
| Dates ISO 8601 | N/A (no date fields) | N/A |
| JSON syntactically valid | ✅ Pass | ✅ Pass |

### Errors / Issues Found

**Critical — `/docs` `url` field is wrong (Critical priority, fix now)**
The `/docs` page's JSON-LD has `"url": "https://inkwell-lp.vercel.app/"` — it points to the homepage, not to `https://inkwell-lp.vercel.app/docs/` (the page's own canonical URL, confirmed via `<link rel="canonical">` in the `<head>`). This is copy-paste residue from the homepage block. It tells Google/AI crawlers this entity's URL is the homepage while serving it from a different page — a mismatch that undermines entity resolution.

**Major — `/docs` reuses `SoftwareApplication` instead of a page-appropriate type (High priority)**
The documentation page block is a verbatim duplicate of the homepage's `SoftwareApplication` markup with only the `description` swapped. Two pages both self-declaring as the *same* `SoftwareApplication` entity (same `name`, same `softwareVersion`, same `offers`) is redundant and can confuse deduplication/entity-linking. `/docs` is a documentation/reference page, not a second product listing — it should carry `WebPage` (or `TechArticle`/`CollectionPage`) markup that references the software via `about` or `mainEntity`, not a cloned `SoftwareApplication` block.

**Moderate — No `Organization` entity anywhere on the site (Medium priority)**
There is no `Organization` (or `Person`) schema identifying the publisher (GitHub org `coros-hq`). This is a common, low-effort win for brand entity recognition in Knowledge Panels/AI answers.

**Moderate — No `WebSite` schema on the homepage (Medium priority)**
No `WebSite` block to establish the site-level entity (useful for sitelinks search box eligibility and general site identity, even without a search feature).

**Minor — No `BreadcrumbList` on `/docs` (Low priority)**
The docs page has 8 in-page sections (Editor, Canvas, Organisation, Themes, Export, GitHub Sync, Claude MCP, Keyboard Shortcuts) but they're anchor-scrolled on a single page, not separate URLs, so `BreadcrumbList` isn't strictly applicable here — flagged only if these sections become dedicated sub-pages later.

**Info — No `FAQPage`**
None present, none needed. Per current guidance, FAQPage carries no Google SERP rich-result benefit (retired site-wide 2026-05-07); not recommending it unless AI/GEO visibility for genuine Q&A content becomes a goal, in which case use `QAPage` for actual user-submitted Q&A, not `FAQPage` for editorial content.

**Note — `applicationCategory: "DeveloperApplication"`**
Plausible given GitHub sync and Claude MCP integration, but `ProductivityApplication` may better reflect inkwell's core positioning as a markdown notes editor. Not an error — a product-positioning judgment call, not changing it without confirmation from the team.

**Not flagged (no fabrication):** No `aggregateRating`/`review` present. This means the `SoftwareApplication` won't qualify for Google's software rich-result carousel (which requires a rating), but I am **not** recommending fabricated ratings — add this only once real user reviews exist.

---

## 3. Missing Opportunities

1. `Organization` — publisher identity (homepage, `<head>`).
2. `WebSite` — site-level entity (homepage, `<head>`).
3. Fix `/docs` to use `WebPage` referencing the software, with correct canonical `url`.
4. (Future) `AggregateRating`/`Review` once genuine reviews exist — do not fabricate now.

---

## 4. Recommended JSON-LD (ready to paste)

All values below are taken directly from the live page HTML (title, meta description, canonical URL, GitHub org) — nothing fabricated.

### Homepage `/` — keep existing `SoftwareApplication`, add `Organization` + `WebSite`
Add these two blocks alongside the existing `SoftwareApplication` script (as separate `<script type="application/ld+json">` tags, or combine into a `@graph`):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "inkwell",
  "url": "https://inkwell-lp.vercel.app/",
  "logo": "https://inkwell-lp.vercel.app/inkwell-icon.svg",
  "sameAs": [
    "https://github.com/coros-hq/inkwell"
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "inkwell",
  "url": "https://inkwell-lp.vercel.app/"
}
</script>
```

### `/docs` — replace the duplicated `SoftwareApplication` block with `WebPage`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "inkwell — Documentation",
  "description": "Everything you need to know about inkwell: editor, canvas, themes, GitHub sync, Claude MCP, and keyboard shortcuts.",
  "url": "https://inkwell-lp.vercel.app/docs/",
  "isPartOf": {
    "@type": "WebSite",
    "name": "inkwell",
    "url": "https://inkwell-lp.vercel.app/"
  },
  "about": {
    "@type": "SoftwareApplication",
    "name": "inkwell",
    "url": "https://inkwell-lp.vercel.app/",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": ["macOS", "Windows", "Linux"]
  }
}
</script>
```

Note: verify the trailing-slash canonical (`/docs/` vs `/docs`) matches what `<link rel="canonical">` emits on the live page before pasting — the live source showed `https://inkwell-lp.vercel.app/docs/` as canonical even though the URL fetched was `/docs`.

---

## 5. Summary

- Zero structured data → now has `SoftwareApplication` JSON-LD on both audited pages (real progress since 2026-07-16).
- Syntax is valid JSON-LD on both pages, correct `@context`/`@type`, no deprecated types, no placeholder text.
- **Critical bug**: `/docs` JSON-LD `url` field incorrectly points to the homepage instead of its own canonical URL.
- **Structural issue**: `/docs` duplicates the homepage's `SoftwareApplication` entity instead of using a page-appropriate `WebPage` type — creates entity ambiguity.
- Missing `Organization` and `WebSite` schema sitewide.
- No fabricated ratings/reviews added or recommended.
