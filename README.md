# Personal site — Adam [LASTNAME]

Telecom construction / tower foreman personal page. Static HTML/CSS/JS, no build step, no framework.

## Run locally

```sh
cd ~/projects/personal-site
python3 -m http.server 8891
# open http://127.0.0.1:8891
# (8787 is already taken by an unrelated server on this Mac)
```

## Fill in the placeholders

Search the repo for `[` tokens — everything amber-dashed on the page is a placeholder:

| Token | Where | What |
|---|---|---|
| `[LASTNAME]` | index.html (title, nav brand, footer) | last name |
| `[EMAIL]` | contact section + mailto link | email address |
| `[PHONE]` | contact card + tel link | phone number |
| `[YEAR]` ×4 | story timeline items 2–5 | lineman school, first tower, CDL, foreman years |

```sh
grep -rn '\[\(LASTNAME\|EMAIL\|PHONE\|YEAR\)\]' index.html
```

## Add photos

1. Drop photos into `assets/photos/` (jpg/png/webp).
2. In `index.html`, replace each placeholder block:

```html
<div class="frame"><span class="frame-label">PHOTO</span></div>
```

with:

```html
<img src="assets/photos/tower-top.jpg" alt="Top of the tower — radios mounted">
```

Keep the `<figcaption>` under each. Portrait slot (story section) uses `.portrait-slot`.

## Deploy (when ready)

Any static host works: Cloudflare Pages / Netlify / GitHub Pages — drag-and-drop the folder or connect the repo. No server code. Domain is a user decision.

## Structure

```
index.html          single page: hero, stats, story, capabilities, site build, photos, contact
css/style.css       all styles incl. print stylesheet ("Save page as PDF" button)
js/main.js          nav, reveal-on-scroll, stagger, active-link
assets/favicon.svg  tower mark
assets/photos/      photo drop folder
```

## Notes

- Content is grounded in what Adam stated: HS 2016 → residential construction → lineman school → tower climber → Class A CDL → foreman → telecom site builds (shelters, cabinets, RF, fiber, steel, conduit, 4-man crews). No invented employers, dates, or certifications.
- `[YEAR]` tokens must be filled from real dates only.
- Print stylesheet inverts to light theme for PDF export.
- Social preview: `assets/og.jpg` (1200×630). Recapture after filling placeholders — resize with `sips -z 630 1200 assets/og.jpg` if the screenshot isn't exact. On deploy, change `og:image`/`twitter:image` from the relative path to the absolute URL (`https://<domain>/assets/og.jpg`) — some scrapers (LinkedIn, Slack) require absolute URLs.
