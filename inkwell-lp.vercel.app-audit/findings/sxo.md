# SXO Findings — inkwell-lp.vercel.app
Date: 2026-09-20 (re-verification of 2026-07-16 audit)

## Status of this run
This run re-fetched the live homepage and /docs page (via render_page.py, mode=auto) and re-parsed on-page SEO elements. Full SERP-backwards analysis (WebSearch of top-10 organic results, page-type consensus, persona re-scoring) from the prior audit was **not able to be re-executed this session** due to a turn-limit cutoff. Findings below are therefore a **structural verification**, not a fresh SERP pull — treat the persona/mismatch scores as carried over from the 2026-07-16 audit, confirmed still applicable based on current page structure.

## Confirmed current page structure (2026-09-20 fetch)

**Homepage (`/`)**
- Title: "inkwell — Write without distraction."
- Meta description: "A local-first markdown editor for macOS, Windows, and Linux. Your notes stay as plain .md files — private, portable, and completely under your control."
- H1: 1, H2: 7
- Word count: 991
- Images: 3, Internal links: 4, External links: 11
- Schema blocks: 1

**Docs page (`/docs`)**
- Meta description: "Everything you need to know about inkwell..."
- No structural indication of a comparison/alternatives page or dedicated persona landing pages was found in either fetched page's title/meta/heading set.

## Carried-over findings (2026-07-16 audit, unchanged pending full SERP re-run)

- **Primary mismatch (unverified this session, previously CRITICAL/HIGH):** No comparison page or persona-specific content exists despite "obsidian alternative" and "best markdown editor" being comparison-dominated SERP intents. Homepage and /docs remain the only two indexable page types found this run — no `/alternatives`, `/vs`, `/compare`, or persona-specific pages detected in the current site structure.
- **Prior persona scores (2026-07-16):** Writer 66/100, Developer/MCP 52/100, Obsidian power user 48/100, Windows/Linux user 48/100, Privacy researcher 48/100.
- **Prior SXO Gap Score: 54/100.**

## Limitations
- SERP fetch (WebSearch top-10 organic results for target keywords) was not performed in this session — mismatch severity and persona scores could not be independently re-validated against current SERP consensus.
- No wireframe (IST/SOLL) was generated this run.
- Recommend re-running the full `/seo sxo` skill end-to-end (SERP pull + persona re-scoring) in a fresh session to confirm whether the CRITICAL mismatch and 54/100 score still hold, and to check whether any comparison/persona pages have shipped since July.

## SXO Gap Score: 54/100 (carried over, unverified this session — full re-run recommended)
