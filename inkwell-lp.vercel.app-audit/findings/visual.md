# Visual / Mobile Rendering Audit — inkwell-lp.vercel.app

Captured with Playwright (Chromium headless). Viewports: desktop 1280x800, mobile 375x812 (device-scale-factor 2, `is_mobile`/`has_touch` emulated). Both above-the-fold (viewport-clipped) and full-page screenshots were taken for each page.

Screenshots directory: `/Users/ayphone/Documents/side_projects/inkwell-lp/inkwell-lp.vercel.app-audit/screenshots/`

| Page | Viewport | Above-the-fold | Full page |
|---|---|---|---|
| Home | Desktop | `home_desktop.png` | `home_desktop_full.png` |
| Home | Mobile | `home_mobile.png` | `home_mobile_full.png` |
| Docs | Desktop | `docs_desktop.png` | `docs_desktop_full.png` |
| Docs | Mobile | `docs_mobile.png` | `docs_mobile_full.png` |

Raw DOM metrics (scroll widths, overflow-element scan, H1/CTA bounding boxes, touch-target sizes) captured to `/Users/ayphone/Documents/side_projects/inkwell-lp/inkwell-lp.vercel.app-audit/findings/_metrics.json`.

---

## Homepage (`/`)

### Desktop (1280x800) — `home_desktop.png`
Above the fold: nav (logo, Features/Canvas/Themes/GitHub/Docs links, amber "Download" button, 61px tall) + hero with badge ("MACOS · WINDOWS · LINUX · FREE · OPEN SOURCE"), H1 "Write without distraction.", subtext, three download cards (macOS/Windows/Linux) side by side, GitHub link, version note, and the app-window mockup (sidebar + editor illustration showing "The Daily Note" with markdown source) sitting to the right of the copy. Layout is clean, no overlap, no overflow (`scrollWidth == clientWidth == 1280`). This is a strong, well-composed above-the-fold.

### Mobile (375x812) — `home_mobile.png` (fold) / `home_mobile_full.png` (full page)
Above the fold on mobile: nav (logo + Download button only — see nav findings below), badge, H1, subtext, and the top of the three download cards. The H1 is fully visible (`top:187, bottom:267` within the 812px viewport) and the primary download CTA (macOS card) is visible without scrolling. This matches best practice for above-the-fold CTA visibility.

**Key finding — hero app-window mockup does NOT appear stacked/cropped on mobile.** Contrary to the initial concern, the desktop hero mockup (sidebar+editor illustration) is not force-fit into the mobile hero at all — on mobile the hero is copy-only (badge/H1/subtext/download cards/GitHub/version), and the illustrated mockups instead reappear later in the page as smaller, appropriately-scaled inline graphics tied to specific feature sections (e.g., a compact editor/canvas mockup under "Draw without switching apps," and a small calendar/agenda widget under "Your week, at a glance," both visible in `home_mobile_full.png`). These scale correctly to 375px width with no cropping or horizontal scroll. This is a well-implemented responsive pattern — no action needed here.

**Horizontal overflow: none functionally, but two oversized decorative divs found.** `document.documentElement.scrollWidth` equals `clientWidth` (375) — i.e. no scrollbar/overflow — but the DOM scan flagged two absolutely-positioned glow/blur decorative elements wider than the viewport:
- `.hero-glow` — width 700px, left -162px
- `.cta-glow` — width 600px, left -112px

These are almost certainly `overflow: hidden` ambient background glows (radial gradients) intentionally oversized and symmetrically offset so they don't cause a scrollbar. Confirmed no visible horizontal scroll occurred. Flagging only as a note in case any container ever loses `overflow-x: hidden` — currently not a user-facing bug.

**Nav bar on mobile — links are hidden with no mobile menu replacement.** On mobile, only the logo ("inkwell") and the "Download" button remain visible in the nav; the primary links (Features, Canvas, Themes, GitHub, Docs) are present in the DOM but hidden via CSS (`display:none` or zero-width), and there is **no hamburger icon / mobile nav-menu toggle** anywhere in the DOM (`hamburgers` selector search returned zero matches). This means on mobile, users have no way to reach the Features/Canvas/Themes sections or the Docs page from the nav — they'd have to scroll the full page or use the footer, which only repeats "Docs" and "GitHub" (not Features/Canvas/Themes). This is a real mobile navigation gap, though arguably low severity for a single-page-scroll marketing site since all that nav content is reachable by scrolling on the same page anyway (except Docs, which is a separate route).

**Touch targets:** Most interactive elements meet or are close to the ~44px recommended touch target (Download button 111x37, GitHub link 66x22, footer "Docs"/"GitHub" links ~66x21). Several are modestly under 44px height (GitHub link 22px tall, footer links ~21px tall, logo link 26px tall) — minor, common pattern, low risk given generous horizontal hit area and spacing from neighboring elements, but worth a tap-target pass if pursuing strict WCAG 2.5.5/2.5.8 (AAA) compliance.

**No overlapping elements or cut-off text observed** anywhere in `home_mobile_full.png`. Section order (Everything you need / Every theme / Draw without switching apps / week-at-a-glance / theme gallery / feature list / "Start writing" CTA / footer) reflows cleanly to a single column with consistent padding.

---

## Docs page (`/docs`)

### Desktop (1280x800) — `docs_desktop.png` (fold) / `docs_desktop_full.png` (full page)
Classic two-column docs layout: `.docs-sidebar` (220px wide, `position: sticky`) on the left with version tag, section nav (Getting Started/Editor/Canvas/Organisation/Themes/Export/GitHub Sync/Claude MCP/Shortcuts) and a "Download inkwell" CTA button pinned at the bottom of the sidebar; `main.docs-content` fills the remaining width on the right.

**Sticky sidebar confirmed working correctly on desktop.** Verified via the full-page screenshot (`docs_desktop_full.png`) that as the page scrolls through all documentation sections (Editor, Canvas, Organisation, Themes, Export, GitHub Sync, Claude MCP, Keyboard Shortcuts), the sidebar nav remains pinned/visible alongside the content rather than scrolling away — `position: sticky` is functioning as intended, with "Getting Started" correctly highlighted as the active section at initial scroll position. No layout breakage, overlapping, or z-index issues at any scroll depth on desktop.

H1 "Getting Started" and the sidebar are both visible above the fold at 1280x800; a second "Download inkwell" CTA is also visible in the fold area (top:515–553).

### Mobile (375x812) — `docs_mobile.png` (fold) / `docs_mobile_full.png` (full page)
**This is the most significant issue found in the audit: the two-column docs layout does not collapse on mobile, causing page-wide horizontal overflow and cut-off content.**

Evidence:
- `document.documentElement.scrollWidth` = **592px** against a 375px viewport (`clientWidth` = 375) → confirmed horizontal overflow (`hasHorizontalOverflow: true`).
- The DOM overflow scan shows `.docs-sidebar` (and everything inside it: `.sidebar-inner`, `.sidebar-version`, `.sidebar-nav`, `.sidebar-download`) rendered at **572px wide**, i.e. essentially the same fixed/desktop-ish width it would have alongside a sibling content column — it is not being resized to fill 100% of the (much narrower) mobile viewport, nor is it being hidden/converted into a collapsible mobile menu.
- Because the sidebar occupies 572px, `main.docs-content` and every element inside it (`.doc-section`, headings, paragraphs, ordered lists, list items) also inherit/overflow to ~550–572px width, pushing the whole page 217px wider than the viewport.
- `sidebar.position` computed style on mobile is `static` (vs. `sticky` on desktop) — confirming a breakpoint *is* being applied that changes sidebar behavior, but the width rule is not being applied/overridden correctly at this breakpoint, or the container it sits in isn't constrained to `100%`/`max-width: 100vw`.
- Visually (`docs_mobile.png`), this manifests as text being cut off at the right edge of the screen: doc-nav category links "GitHub Sync," "Claude MCP," and "Shortcuts" are visible but pushed toward/past the right edge; body copy is truncated mid-sentence, e.g. "Download the latest .dmg from the Releases page" is clipped to "...Releases page" runs off-screen, "System Settings → Privacy & Security" is clipped to "System Settings" with the rest cut off, and "drag inkwell.app to /Applications" is clipped to "/App..." The user must manually scroll horizontally to read complete sentences — this is a functional readability bug, not just cosmetic.
- The full-page mobile screenshot (`docs_mobile_full.png`) confirms this same right-edge clipping persists through every documented section (Editor, Canvas, Organisation, Themes, Export, GitHub Sync, Claude MCP, Keyboard Shortcuts) — it is not isolated to the "Getting Started" section, it affects the entire docs page.
- The sidebar's doc-category nav links do stack into what looks like a horizontally-scrolling pill/tab row at the top of the page (Getting Started/Editor/Canvas/.../Shortcuts) rather than a vertical list or hamburger/drawer — but because the container is oversized, this row also gets clipped rather than wrapping or scrolling within its own bounds.
- The sidebar's "Download inkwell" CTA button is present above the fold on mobile (`top:222, bottom:261`) but is rendered at the same oversized 572px width, extending past the viewport edge.

**Severity: High for the docs page specifically.** This breaks reading of core product documentation (install steps, keyboard shortcuts, etc.) on any mobile device and should be prioritized. The homepage does not have this problem — it is isolated to the `/docs` route's sidebar/content grid not collapsing to a single column at the mobile breakpoint.

**No small-touch-target problems that are unique to docs** beyond what's already flagged for the shared nav (logo, Download button). The in-sidebar doc nav links themselves are comfortably sized (~34px tall / 57–117px wide) once viewed, though clipped.

---

## Summary of Issues by Severity

1. **[High] Docs page (`/docs`) — sidebar/content two-column grid does not collapse on mobile (375px).** Causes 592px page width vs 375px viewport, forcing horizontal scroll and clipping/truncating documentation text and nav labels on every section of the page. Root cause appears to be the `.docs-sidebar` (and its children) retaining a ~572px computed width at the mobile breakpoint instead of switching to `width: 100%`/stacking above `main.docs-content`, even though `position` does correctly switch from `sticky` to `static`. Recommend a CSS fix: constrain `.docs-sidebar` to `width: 100%` (or `max-width: 100vw`) and `.docs-layout`/grid container to `grid-template-columns: 1fr` (or `flex-direction: column`) below the relevant breakpoint, and ensure `overflow-x: hidden` isn't masking the underlying width bug on the outer wrapper.

2. **[Medium] Homepage — mobile nav has no menu for hidden links.** Features/Canvas/Themes/GitHub/Docs nav links are hidden on mobile with no hamburger/drawer replacement (confirmed zero hamburger-pattern elements in the DOM). Footer only repeats Docs/GitHub. Since it's a single-scroll landing page this is lower severity than the docs bug, but Docs (a separate route) becomes hard to discover on mobile outside of scrolling to the footer.

3. **[Low/Informational] Homepage — oversized decorative glow elements (`.hero-glow` 700px, `.cta-glow` 600px).** Currently clipped correctly (no visible overflow, `scrollWidth == clientWidth`), but flagged for awareness since they rely on a parent `overflow: hidden` to stay invisible.

4. **[Low] Minor touch targets under 44px height** on both pages (GitHub link ~21-22px tall, footer links ~21px tall, logo ~26px tall). Not blocking, but worth a pass for stricter accessibility compliance.

## What's working well (no action needed)
- Homepage above-the-fold on both desktop and mobile: H1 and primary download CTA both visible without scrolling; no layout shift concerns observed given `networkidle` + settle wait.
- Homepage hero app-window mockup does not appear on mobile at all (by design) — feature-specific mockups later in the page are separately sized and scale cleanly to mobile width with no cropping.
- Docs page desktop layout: sticky sidebar confirmed to remain pinned and functional through the entire page scroll depth (~10,400px of content), no overlap or breakage at any point.
- No overlapping elements, broken images, or obviously broken CSS found anywhere outside the docs-mobile overflow issue.
