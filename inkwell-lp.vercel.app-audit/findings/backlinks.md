# Backlink / Authority Profile — inkwell-lp.vercel.app

Date: 2026-07-16
Data sources available: **Tier 0 — Common Crawl + Verification Crawler only** (no Moz or Bing Webmaster API keys configured; confirmed via `backlinks_auth.py --check`)
Site type: Astro static landing page for an open-source desktop app ("inkwell"), hosted on Vercel's **shared `vercel.app` subdomain** (no custom domain)

## Summary

`inkwell-lp.vercel.app` has **no measurable classic-web backlink footprint** — it is not present in the Common Crawl web graph at all (no in-degree, no PageRank, no referring domains). This is expected for a site whose GitHub repo was created 2026-06-14 (~1 month old at audit time) and is consistent with "too new / not yet crawled," not "low authority." The one concrete, verified authority signal found is a live, reciprocal link relationship with its own GitHub repository (`github.com/coros-hq/inkwell`), which has meaningful organic traction (48 stars, 3 forks) for a project this young. Because there are fewer than 4 scoring factors with any data, **no numeric Backlink Health Score is reported** — this would be misleading per the Tier 0 workflow rules.

The most important structural finding is not a metric — it's that **the site does not own a custom domain.** Being permanently on `*.vercel.app` is itself a durable SEO liability, independent of current backlink counts, and is flagged as a standalone Critical/High finding below.

---

## Structural Concern: No Custom Domain (Shared `vercel.app` Subdomain)

**Severity: High — Structural**
**Source: Common Crawl (confidence: 0.50), direct observation**

`inkwell-lp.vercel.app` is a subdomain of the shared platform domain `vercel.app`, not an independently owned domain (e.g. `inkwell.dev`, `getinkwell.com`). This was cross-checked directly:

| Domain queried | In Common Crawl? | PageRank rank | Harmonic centrality rank | Hosts on domain |
|---|---|---|---|---|
| `inkwell-lp.vercel.app` (the actual site) | **No** — not found | n/a | n/a | n/a |
| `vercel.app` (the shared parent domain) | **Yes** | **#374** of all domains in the CC graph | **#928** | **106,085** distinct hosts |

This table is the core of the issue: `vercel.app` as a whole is a top-500 domain by PageRank in the Common Crawl graph, but that authority is aggregated across **106,085 unrelated hosts/subdomains** (every free Vercel deployment). None of that aggregate authority is inherited by `inkwell-lp.vercel.app` in any meaningful way for ranking purposes — any tool or human that reports "vercel.app has high authority" and implies that applies to this project would be producing a misleading reading. This is exactly the trap the domain-level Tier 0 metrics create, which is why domain-level numbers are being reported at confidence 0.50 and are called out explicitly rather than used to score the site.

Beyond the measurement-noise problem, not owning a custom domain is a **structural SEO limitation in its own right**, independent of any backlink count:

1. **No durable backlink equity.** Every inbound link earned today (blog mentions, forum posts, "awesome-lists," Show HN, Product Hunt, etc.) points at a URL prefix (`inkwell-lp.vercel.app`) that the project doesn't control at the root. If the project ever migrates to a custom domain, all that accumulated link equity is stranded unless every source is manually updated — external links to a subdomain the project doesn't own cannot be 301-redirected from the root the way a custom domain's DNS can be repointed.
2. **Brand confusion / trust risk.** A `*.vercel.app` URL signals "hobby project on a free tier" to users and to other site owners deciding whether to link out — this can measurably suppress link acquisition compared to a branded domain, and increases the odds users mistype or don't recall the URL (no memorable, ownable brand string in the address bar).
3. **Platform lock-in / policy risk.** The project has zero control over `vercel.app` subdomain policy. Vercel could change rate limits, add interstitials, deprecate free subdomains, or reassign subdomain namespaces at its discretion — none of which the project could mitigate, unlike a custom domain where DNS is fully owned.

**Recommendation:** Register a custom domain (e.g. `inkwell.dev` given the developer-tool positioning, or similar) and 301-redirect `inkwell-lp.vercel.app` to it via Vercel's domain settings. Do this **before** the project accumulates significant organic backlinks/mentions, since migrating early avoids stranding link equity. This is independent of and should be prioritized alongside any on-page SEO work — it is a foundational fix, not a nice-to-have.

---

## Common Crawl Domain-Level Metrics

**Source: Common Crawl web graph, release `cc-main-2026-jan-feb-mar` (confidence: 0.50, domain-level, quarterly updates)**

| Metric | `inkwell-lp.vercel.app` | Rating |
|---|---|---|
| In Common Crawl index | No | FAIL — not yet crawled |
| In CC domain rankings | No | FAIL — not yet crawled |
| PageRank | null (no data) | INSUFFICIENT DATA |
| Harmonic centrality | null (no data) | INSUFFICIENT DATA |
| Top referring domains | none returned | INSUFFICIENT DATA |

**Important interpretation note (per validator check, confirmed correct):** absence from Common Crawl does **not** mean "low authority" — it means the domain hasn't been crawled/indexed by CC yet. Given the GitHub repo's `created_at` timestamp of 2026-06-14 (~1 month before this audit), this is fully consistent with the site simply being too new for CC's crawl cycle (CC updates quarterly) rather than any quality signal. Do not treat this as a negative ranking signal in isolation.

---

## Verified Backlink: GitHub Repository

**Source: Verification crawler, live HTTP check (confidence: 0.95)**

The project's real authority signal is its GitHub repo, `github.com/coros-hq/inkwell`, not classic web backlinks. This was checked in both directions:

### Inbound: GitHub repo → landing page

| Field | Result |
|---|---|
| Source | `https://github.com/coros-hq/inkwell` |
| Target found | Yes — confirmed via live crawl, HTTP 200 |
| Anchor text | `inkwell-lp.vercel.app/` |
| `rel` attributes | `noopener noreferrer nofollow` |
| Match type | exact URL |

This link comes from the repo's "Website" field in the GitHub sidebar (confirmed via GitHub API: `homepage` field = `https://inkwell-lp.vercel.app/`). **GitHub applies `rel="nofollow"` to all repository homepage links automatically** — this is platform-standard behavior, not a site-specific issue, and should not be treated as a missed optimization. It still carries referral-traffic and discovery value even without passing link equity.

### Outbound: landing page → GitHub repo

Confirmed directly in the built HTML (`dist/index.html`): the homepage links to `github.com/coros-hq/inkwell` in **3 places** (top nav, hero/CTA button, footer), all with `rel="noopener"` only — **no nofollow**, fully followable outbound links.

### Reciprocal link pattern

The automated validator (`validate_backlink_report.py`) confirmed a **reciprocal link relationship**: the landing page links out to `github.com`, and `github.com` (via the repo) links back to the landing page. This is a normal, expected pattern for an open-source project's own landing page and repo — not a link scheme — but is noted here per standard backlink-quality practice of flagging all reciprocal patterns.

### GitHub repo signal (supplementary context, not a backlink metric)

**Source: GitHub public API (confidence: 0.90, direct API read)**

| Metric | Value |
|---|---|
| Stars | 48 |
| Forks | 3 |
| Open issues | 2 |
| Created | 2026-06-14 (~1 month old at audit time) |
| Last push | 2026-07-14 |
| License | None detected |

48 stars in ~1 month is a reasonable early-traction signal for a new open-source desktop app, and is the more meaningful authority proxy for this project than any classic backlink metric right now — this matches the audit brief's premise. This is a GitHub engagement metric, not a backlink/SEO metric, and is included only as supplementary context; it should not be folded into a "Backlink Health Score."

---

## Backlink Health Score

**Not reported — INSUFFICIENT DATA.**

Per the Tier 0 workflow rule and confirmed by the automated validator (`validate_backlink_report.py`, status: PASS, 0 errors), only 1 of 7 scoring factors has any real data (the single verified GitHub link). Referring domain count, domain quality distribution, anchor text naturalness (at scale), toxic link ratio, link velocity, follow/nofollow ratio (at scale), and geographic relevance all lack sufficient data sources at Tier 0 for a domain not yet in the Common Crawl index. Producing a numeric 0-100 score here would be misleading.

---

## Findings Table

| Finding | Severity | Status | Source (confidence) |
|---|---|---|---|
| No custom domain — site lives on shared `vercel.app` subdomain | High (Structural) | Flagged | Common Crawl + direct observation (0.50) |
| Domain not present in Common Crawl index | Info | Expected for new site | Common Crawl (0.50) |
| `vercel.app` root domain has high aggregate authority (rank #374) but this is non-transferable/non-comparable to this project | Medium | Flagged — avoid misinterpretation | Common Crawl (0.50) |
| GitHub repo → landing page link verified live | Info | Pass (nofollow, platform-standard) | Verify crawler (0.95) |
| Landing page → GitHub repo links (x3) verified followable | Info | Pass | Direct HTML inspection (0.95) |
| Reciprocal link pattern (site ↔ GitHub) | Info | Normal for OSS project, not a scheme | Automated validator (0.90) |
| GitHub stars/forks as authority proxy | Info | Positive early signal (48 stars, 3 forks, ~1 month old) | GitHub API (0.90) |
| Backlink Health Score | N/A | Not scored — insufficient data (1/7 factors) | Validator-confirmed |

## Priority Recommendations

1. **[High / Structural] Migrate to a custom domain** and 301-redirect from `inkwell-lp.vercel.app`, before backlink/mention volume grows further, to avoid stranding link equity and reduce platform lock-in risk. See detailed rationale above.
2. **[Medium] Re-run Common Crawl check next quarter** (CC updates quarterly) once the domain has had more time to be crawled — current "not found" status is a data-freshness artifact, not a negative signal, but should be re-verified as the site matures.
3. **[Low] Consider adding Moz API key (free tier, 2,500 rows/month)** to unlock Tier 1 metrics (DA/PA, spam score, referring-domain counts) for an actual numeric backlink baseline going forward — Tier 0 alone cannot produce a trustworthy score for a domain this new.
4. **[Info] No action needed on GitHub nofollow.** The nofollow on the GitHub→site link is GitHub-platform-standard, not a site configuration issue — do not attempt to "fix" it.

## Related Audits

- For E-E-A-T / content authority signals, see `/seo content <url>`.
- For crawlability/indexability fundamentals (this domain's near-term ability to even get crawled), see `/seo technical <url>` and the sitemap findings at `inkwell-lp.vercel.app-audit/findings/sitemap.md` (notes missing `robots.txt`/sitemap, which compounds the "not yet in Common Crawl" issue by giving crawlers less signal to work with).

## Data Freshness Notes

- Common Crawl: quarterly updates (release `cc-main-2026-jan-feb-mar` used here)
- Verification crawler: real-time, live HTTP fetch at time of audit (2026-07-16)
- GitHub API: real-time, live at time of audit (2026-07-16)
- Moz / Bing: not available this run (Tier 0 — no API keys configured)
