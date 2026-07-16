# Structured Data / Schema.org Audit — inkwell-lp.vercel.app

**Pages audited:** `/` (homepage), `/docs` (documentation)
**Method:** Live HTML fetch (`curl`, confirmed HTTP 200 on both) + source inspection of `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/docs.astro`. Site is a static Astro build (no client-side rendering/SPA shell), so raw HTML = final HTML — no risk of schema being hidden behind JS hydration.

---

## 1. Detection Results

| Page | JSON-LD | Microdata | RDFa | Open Graph | Twitter Card | Canonical |
|---|---|---|---|---|---|---|
| `/` | None | None | None | Partial (`og:title`, `og:description`, `og:type` only) | None | None |
| `/docs` | None | None | None | Partial (same 3 tags, page-specific title/description via props) | None | None |

**Confirmed: zero `<script type="application/ld+json">` blocks exist anywhere on the site.** This matches the user's own source inspection. The shared `Layout.astro` (used by both pages) contains only basic meta tags — no structured data of any kind, on any page, in either the source or the rendered/live output.

Also noted in passing (not schema, but adjacent and worth flagging since they affect how rich results and schema-adjacent metadata render):
- No `og:image` — social shares and some rich result surfaces will have no preview image.
- No `og:url` / `<link rel="canonical">` on either page.
- No Twitter Card meta (`twitter:card`, `twitter:title`, etc.).

---

## 2. Severity Assessment

**Finding: Complete absence of structured data — Severity: Medium-High (not Critical, but a clear high-value opportunity).**

Rationale for calibrating severity here rather than marking it "Critical":
- This is a 2-page marketing site for a free desktop app, not an e-commerce or content-heavy site — the ceiling on schema-driven traffic gains is real but modest.
- However, `SoftwareApplication` is one of the few remaining schema types with an active, well-supported Google rich result (pricing/OS/rating snippet in search), and this product is a textbook fit: free, cross-platform, downloadable, versioned. Leaving this schema off the homepage is a missed, low-effort, high-relevance opportunity.
- Zero risk of penalty for adding it — this is pure upside, no deprecated-type traps here.

Priority ranking:
1. **`SoftwareApplication` on `/`** — Priority: High. Directly matches a live Google rich-result type for exactly this product category.
2. **`WebSite` on `/`** — Priority: Medium. Low effort, supports Sitelinks Searchbox eligibility (if search is ever added) and general entity clarity for AI/LLM crawlers.
3. **`Organization`/publisher block** — Priority: Medium. Strengthens entity association between the site and the `coros-hq/inkwell` GitHub org for knowledge graph and AI citation purposes.
4. **`/docs` schema** — Priority: Low/Judgment call. See Section 4 — recommend **no forced schema**, or at most a light `TechArticle`/`WebPage` treatment. Do not use FAQPage (wrong content shape) or HowTo (deprecated).

No existing FAQPage markup was found on this site, so the FAQPage deprecation/retirement rules do not apply here as a "flag existing markup" issue — they're relevant only as a reason to *avoid* reaching for FAQPage on `/docs` despite it having Q&A-adjacent, reference-style content.

---

## 3. Validation Checklist

Not applicable in the traditional pass/fail sense — there is no existing schema to validate. All checklist items below are forward-looking, applied to the recommendations generated in Section 5.

| Check | Status for recommendations below |
|---|---|
| `@context` is `https://schema.org` | Pass (all snippets) |
| `@type` valid, not deprecated | Pass — `SoftwareApplication`, `WebSite`, `Organization`, `WebPage` are all current, fully-supported types |
| Required properties present | Pass |
| Property values match expected types | Pass |
| No placeholder text | Pass — all values are drawn from real source content (version, GitHub org, download URLs) |
| URLs absolute | Pass |
| Dates ISO 8601 | N/A — no dateModified/datePublished source data available (see caveats) |

---

## 4. Missing Opportunities & Judgment Calls

### 4.1 SoftwareApplication (Homepage) — Recommend: Add
Strong fit. Google actively supports rich results for `SoftwareApplication` showing price, OS, and rating in search snippets. All required fields are available from the source with no fabrication needed **except** `aggregateRating`/`review`.

**IMPORTANT CAVEAT — do not add fake ratings:** No verifiable review/rating data exists in the provided source (no GitHub stars count surfaced on the page, no review count, no testimonials). Google explicitly disallows self-authored/fabricated ratings and can issue a manual action for fake review markup. **Recommendation: omit `aggregateRating` and `review` entirely until real data exists.** If the team wants this in the future, options are:
- Pull live GitHub star count via the GitHub API at build time and represent it accurately (not as a 5-star "review" — stars ≠ ratings; would need `InteractionCounter` or similar, not `aggregateRating`).
- Collect real user reviews (e.g., via a testimonials feature) before adding `aggregateRating`.

**Version discrepancy found:** the homepage hardcodes `VERSION = "0.6.0"` (`src/pages/index.astro:5`) but `/docs` hardcodes `VERSION = "0.4.8"` (`src/pages/docs.astro:6`). Recommend fixing this inconsistency in the source (single source of truth, e.g. a shared constant or `astro.config` value) regardless of schema — it will otherwise create a confusing signal if `softwareVersion` in JSON-LD (0.6.0, matching the homepage's own displayed version) doesn't match what a user sees quoted elsewhere on the site.

### 4.2 WebSite (Homepage) — Recommend: Add
Straightforward, low-risk, no caveats. No internal site search exists, so `potentialAction`/`SearchAction` is omitted (would be a false claim otherwise).

### 4.3 Organization / Publisher — Recommend: Add (as a lightweight `publisher` node, not a standalone heavy Organization page)
The real entity is the GitHub org `coros-hq` (repo: `coros-hq/inkwell`). There is no separate company/legal entity, no logo beyond the app icon, and no dedicated "About" page — so a full `Organization` type with `founder`, `address`, etc. would require fabrication. Recommend a **minimal, honest `Organization` node** embedded as the `publisher`/`author` of the SoftwareApplication and WebSite, using only verifiable facts: name, URL (GitHub org or site), and logo (the existing `inkwell-icon.svg`).

### 4.4 `/docs` page — Recommend: No forced schema, OR minimal `WebPage` (isPartOf WebSite) only
Evaluated both candidates the user asked about:
- **FAQPage**: Wrong content shape — the 9 sections (Getting Started, Editor, Canvas, Organisation, Themes, Export, GitHub Sync, Claude MCP, Shortcuts) are reference/how-to documentation, not a question-and-answer format. Even setting aside that FAQPage rich results are retired industry-wide (per your own May 2026 Google policy note), forcing FAQPage here would misrepresent the content type to search engines and LLM crawlers alike. **Do not use.**
- **QAPage**: Also not a fit — this isn't a single-question community Q&A thread.
- **HowTo**: Deprecated (rich results removed Sept 2023) and also not the right shape — this is multi-topic reference documentation, not a single sequential procedure. **Do not use**, both because it's deprecated and because it's a content-type mismatch.
- **TechArticle**: Marginal fit. `TechArticle` is designed for a single technical article/tutorial with a clear author and publish date — this page is more of a persistent, versioned reference manual (like an API doc index) that gets updated in place, not an "article" with a publication date. There is no `datePublished` or `author` (person) data available on the page, and fabricating one would violate the no-placeholder rule.
- **Conclusion: use a minimal `WebPage` node** (type `WebPage`, not `TechArticle`) that just declares the page as part of the WebSite, with `name`/`description` pulled directly from the existing `<Layout title=... description=...>` props already on `docs.astro`. This is honest, requires no fabricated fields, and still gives AI crawlers/LLMs a clean entity anchor for citation — which aligns with the "keep lightweight schema for AI/GEO benefit even without a SERP feature" principle applied elsewhere in this audit (e.g., FAQPage guidance).

---

## 5. Generated JSON-LD

### 5.1 Homepage (`/`) — combined `@graph`: SoftwareApplication + WebSite + Organization

Insert into `src/layouts/Layout.astro` (or directly in `index.astro` `<head>` via a slot) as a single `<script type="application/ld+json">` block:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://inkwell-lp.vercel.app/#software",
      "name": "inkwell",
      "description": "A local-first markdown editor for macOS, Windows, and Linux. Notes are stored as plain .md files in a vault folder you choose — private, portable, and entirely yours. Includes a built-in drawing canvas, Kanban boards, GitHub sync, and a native Claude MCP server.",
      "applicationCategory": "ProductivityApplication",
      "operatingSystem": "macOS, Windows, Linux",
      "softwareVersion": "0.6.0",
      "url": "https://inkwell-lp.vercel.app/",
      "downloadUrl": "https://github.com/coros-hq/inkwell/releases/latest",
      "installUrl": "https://github.com/coros-hq/inkwell/releases/latest",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": { "@id": "https://inkwell-lp.vercel.app/#organization" },
      "author": { "@id": "https://inkwell-lp.vercel.app/#organization" },
      "image": "https://inkwell-lp.vercel.app/inkwell-icon.svg",
      "sameAs": [
        "https://github.com/coros-hq/inkwell"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://inkwell-lp.vercel.app/#website",
      "url": "https://inkwell-lp.vercel.app/",
      "name": "inkwell",
      "description": "A local-first markdown editor for every platform. Your notes stay as plain .md files — private, portable, entirely yours.",
      "publisher": { "@id": "https://inkwell-lp.vercel.app/#organization" },
      "inLanguage": "en"
    },
    {
      "@type": "Organization",
      "@id": "https://inkwell-lp.vercel.app/#organization",
      "name": "coros-hq",
      "url": "https://github.com/coros-hq/inkwell",
      "logo": "https://inkwell-lp.vercel.app/inkwell-icon.svg",
      "sameAs": [
        "https://github.com/coros-hq/inkwell"
      ]
    }
  ]
}
</script>
```

**Notes on choices made:**
- `applicationCategory: "ProductivityApplication"` chosen over `DeveloperApplication` — the product is positioned (per hero copy, features grid, Kanban/planner/canvas sections) as a general note-taking/writing/productivity tool, not a developer-only tool. The GitHub-sync and Claude MCP features are secondary capabilities, not the core identity. If the team's primary audience is actually developers, `DeveloperApplication` is a valid swap — Google supports both.
- `operatingSystem` uses the single comma-separated string form (`"macOS, Windows, Linux"`), which is Google's documented accepted format for multi-OS apps (an array is not part of the documented rich-result spec for this property).
- `downloadUrl`/`installUrl` point to `/releases/latest` rather than the version-pinned `.dmg` URL used in the nav button — this avoids the schema going stale every time a new version ships (the pinned URLs in `index.astro` already hardcode `v0.6.0` in the path and will 404 after the next release unless the team updates them; `/releases/latest` is self-updating and is the safer canonical link for schema).
- `offers.price: "0"` with `priceCurrency: "USD"` is Google's documented way to signal "free" — do not use `"Free"` as a string value for `price`.
- No `aggregateRating` / `review` — intentionally omitted per Section 4.1.
- `@graph` + shared `@id` values used so `SoftwareApplication.publisher` and `WebSite.publisher` both reference one canonical `Organization` node rather than duplicating it — this is the recommended pattern when multiple entities share a publisher on the same page.

### 5.2 Docs page (`/docs`) — minimal `WebPage`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://inkwell-lp.vercel.app/docs#webpage",
  "url": "https://inkwell-lp.vercel.app/docs",
  "name": "inkwell — Documentation",
  "description": "Everything you need to know about inkwell: editor, canvas, themes, GitHub sync, Claude MCP, and keyboard shortcuts.",
  "isPartOf": { "@id": "https://inkwell-lp.vercel.app/#website" },
  "about": { "@id": "https://inkwell-lp.vercel.app/#software" },
  "inLanguage": "en"
}
</script>
```

This deliberately does **not** attempt `TechArticle`, `FAQPage`, `HowTo`, or `QAPage` — see Section 4.4 for the reasoning. `name`/`description` are copied verbatim from the `title`/`description` props already passed into `<Layout>` in `docs.astro`, so no new copy needs to be written and nothing is fabricated. `about` and `isPartOf` link this page back to the homepage's SoftwareApplication/WebSite nodes via their `@id`s, giving crawlers a connected graph across both pages of the site.

---

## 6. Implementation Notes

- **Where to add:** Cleanest approach is to extend `Layout.astro` to accept an optional `jsonLd` prop (a JSON-serializable object/array) rendered into a `<script type="application/ld+json" set:html={JSON.stringify(jsonLd)}>` tag in `<head>`. Pass the homepage graph from `index.astro` and the docs `WebPage` object from `docs.astro`. This keeps schema colocated with the page-specific data that already exists (`GITHUB_URL`, `VERSION`, etc. are already defined as consts in each `.astro` file — reuse them directly in the JSON-LD objects instead of hardcoding strings twice).
- **Fix before/alongside shipping:** resolve the `VERSION` mismatch between `index.astro` (0.6.0) and `docs.astro` (0.4.8) so the `softwareVersion` claim in schema is consistent with what's displayed elsewhere on the site.
- **Adjacent quick wins (not schema, flagged for completeness):** add `og:image` (e.g. a screenshot of the app or the icon), `og:url`, and a `<link rel="canonical">` to `Layout.astro` — all currently absent and cheap to add alongside this work.
- **Validate after implementation** with Google's Rich Results Test and the Schema Markup Validator (validator.schema.org) on both the homepage and `/docs` before considering this closed.

---

## Summary

| Item | Status |
|---|---|
| Existing schema found | None (0 blocks, both pages, confirmed live + in source) |
| Overall structured-data score | **28 / 100** |
| Top fix | Add `SoftwareApplication` + `WebSite` + `Organization` JSON-LD to homepage |
| Secondary fix | Add minimal `WebPage` JSON-LD to `/docs` (no TechArticle/FAQPage/HowTo) |
| Do NOT do | Fabricate `aggregateRating`/reviews; use `FAQPage` or `HowTo` on `/docs` |
| Non-schema flags | Missing `og:image`, `og:url`, canonical link; version const mismatch (0.6.0 vs 0.4.8) between homepage and docs source files |
