# GRIDVILLE refresh

Brand verified 6 September 2026 against https://www.techwebster.com/ and its current stylesheet. The company is the full-stack software studio in Bhubaneswar, Odisha. Its linked LinkedIn profile (https://www.linkedin.com/company/tech-webster/) and DEV profile (https://dev.to/techwebster) confirm the domain and identity. Search also returned TechWebsters at techwebsters.org; that is a different business and was not used.

The local logo, favicon and touch icon are unchanged downloads of `/logo-white.svg`, `/favicon.ico` and `/apple-touch-icon.png` from the company website. Inter is the exact Latin WOFF2 served by the current company homepage (`83afe278b6a6bb3c.p.3a6ba036.woff2`). Orange #FF7F00, neutral-950 #0a0a0a and zinc text colors match the site. Product links use the company’s products hub and Code Editor page, plus the supplied CSS Positions reference. Its compact landing and dedicated `/play/` informed the layout. No ratings, traffic claims or unrelated company details were added.

The preview demonstrates actual grid-template-columns, smoothly changing the first track from 1fr to 2fr and back. Displayed CSS and rendered fractions update together; no interpolated CSS transition can put them out of sync. Pause freezes the state. Reduced motion starts paused, and an explicit Play remains available. The heading and example are present without JavaScript.

## Routes and behavior

- `/`: landing page, independently indexable static HTML.
- `/play/`: gameplay, independently reloadable static HTML.
- Legacy `/#play` and root level/demo/selftest query links forward to gameplay.
- `gridville-v1` local storage retains code, stars, failed checks and selected level on the same origin. No migration or reset is needed.
- Reset CSS moved into Settings. The eight level buttons, hints, lessons and keyboard check shortcut remain. Tab now exits the editor instead of trapping keyboard focus.

## Production follow-up

Push is not evidence of deployment. Ensure the hosting service publishes the repository root and serves `play/index.html` at `/play/`, with all local assets and the new social image. After release, verify both canonical routes, legacy links, robots.txt, sitemap.xml and social cards on the public origin. Submit https://grid.techwebster.com/sitemap.xml in the verified Search Console property, inspect both URLs and request indexing if needed. Monitor Page Indexing and Core Web Vitals after sufficient field data accumulates. No Search Console access was assumed.
