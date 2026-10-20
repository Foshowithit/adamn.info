# Personal site — Adam [LASTNAME]

An editorial personal site for Adam [LASTNAME]: introduction, portrait, nine freeform work photos, and a 14-part record of field and technical experience. Static HTML and CSS; no JavaScript, package dependencies, external font requests, or build step. Archivo is bundled locally under the SIL Open Font License. Nothing has been deployed.

## Run locally

```sh
cd ~/projects/personal-site
python3 -m http.server 8891
# open http://127.0.0.1:8891/
```

Reuse the existing preview server if it is already running. Port 8787 belongs to an unrelated process.

## Placeholders

Keep `[LASTNAME]` and `[EMAIL]` until Adam supplies replacements. Replace all occurrences in `index.html`, including metadata and both `mailto:` links. The placeholders are plain text, not styled badges. Email remains a placeholder link until filled in; no telephone link is present.

## Layout

- The opening section pairs a large editorial headline and direct, trade-specific introduction with an offset portrait.
- Nine work photographs remain a freeform composition: varied sizes, slight rotations, uneven spacing, and overlaps. They are not grouped, captioned, or ordered into a gallery.
- A separate `What I actually do.` section groups all 14 areas of work under five plain-language headings in two flowing note columns; it is a list of what the work involves, not a résumé timeline, and it does not organize or relabel the photographs.
- On narrow screens the collage remains staggered and irregular rather than becoming a uniform gallery grid. Every photo links to its untouched original; the displayed image crop does not alter the source.
- Warm paper background, restrained teal accent, heavy grotesque headline, and locally bundled Archivo for interface text.
- No sticky navigation, menus, reveal animation, or JavaScript. Images load without JavaScript.
- Keyboard focus styles and a skip link are included.
- The stylesheet URL carries a version suffix to avoid stale browser caches. Change that suffix when publishing future CSS changes.

## Files

```text
index.html                introduction, freeform photographs, 14 experience areas, email links, social metadata
css/style.css             responsive layout, focus and print styles
assets/archivo-normal.woff2  local Archivo variable font (weight 100-900), 34 KB
assets/archivo-OFL.txt       font copyright and SIL Open Font License
assets/favicon.svg        existing tower mark, unchanged
assets/og.jpg             existing social preview, unchanged
assets/og-card.html       existing social-card source, unchanged
assets/photos/*.jpg       ten original JPGs, unchanged, still the full-size link targets
assets/photos/*-480.webp  small WebP for narrow viewports and non-retina screens
assets/photos/*-720/768/792/800.webp  native-width WebP for wide or 2× displays
```

Anchors: `#about`, `#photos`, `#story`, `#experience`, `#contact`.

## Photos

| File | Shot |
|---|---|
| `pfp.jpg` | Adam on a tower, hardhat and harness |
| `crane.jpg` | crane lifting a basket to a lattice tower |
| `alignment.jpg` | antenna alignment monitor on a tower member |
| `fiber.jpg` | fiber patch panel |
| `dc-plant.jpg` | -48V DC power plant inside a shelter |
| `reaching-in.jpg` | reaching into a radome panel up on the tower |
| `pole-service.jpg` | pole-mounted meter/breaker and conduit |
| `radio-box.jpg` | looking down at an open radio box |
| `cabinet-night.jpg` | open cabinet after dark |
| `roof.jpg` | work above a shelter roof |

To replace a work photograph, update its `.shot a` URL, `img` URL, and alt text. Preserve the originals unless Adam explicitly authorizes changes.

## Content and publishing boundaries

- Verified biography: high school in 2016 → residential construction → lineman school → tower work → foreman running a four-person crew; Class A CDL history.
- The experience section uses Adam's 14 supplied areas and details; preserve those claims as written. In particular, do not upgrade training or experience into unprovided certifications.
- Location is New England. No invented employers, towns, certifications, dates, or statistics.
- `assets/og.jpg` and `assets/og-card.html` are intentionally preserved; the social card still uses the earlier design. Do not regenerate them as part of this redesign.
- Before publishing, replace the relative `og:image` and `twitter:image` paths with the final absolute domain URL. Hosting, domain, deployment, and replacement of placeholders remain Adam’s decisions.

## Redesign verification

Inspected the local page in a real browser at five viewports after the final edits. Before each capture, lazy loading was turned off, every image decoded, and the page scrolled to the bottom once, so the numbers below describe a fully painted page rather than a mid-stitch full-page screenshot.

| Viewport | Document height | Work areas | Work columns | Collage height | Broken images | Horizontal overflow |
|---|---|---|---|---|---|---|
| 1440×1000 | 3190 | 14 | 2 | 1420 | 0 of 10 | none |
| 1100×900 | 2730 | 14 | 2 | 1085 | 0 of 10 | none |
| 820×900 | 2635 | 14 | 2 | 829 | 0 of 10 | none |
| 390×844 | 4661 | 14 | 1 | 2437 | 0 of 10 | none |
| 320×844 | 4556 | 14 | 1 | 2129 | 0 of 10 | none |

The collage is sized with `aspect-ratio: 1264 / 1420` on `.workscape` instead of a fixed pixel height, so the scattered shots scale with the content column; the lowest shot sat at 95–98% of the container at every viewport, so no viewport leaves a dead band under the photos. The nine work photos keep their individual rotations, absolute scatter positions on desktop, and staggered negative-margin stack on mobile; every one measured a non-zero painted box and links to its full-size file.

Note for future verification: a Playwright **full-page** screenshot can drop off-screen images mid-stitch and render them as blank paper-coloured boxes. That is a capture artifact, not a layout bug. Either scroll the page once and force decoding before capture, or confirm with a viewport screenshot scrolled to the collage plus `getBoundingClientRect()` on each `.shot a` and `.shot img`.

### Image and font weight

Each photo is served through `<picture>`: a `<source type="image/webp">` with a `480w` and a native-width candidate plus a `sizes` value matching its CSS width, and the untouched JPG as the `<img src>` fallback and the `a` link target. Measured on disk: the ten JPGs total 5.5 MB, the `-480` WebP set totals 468 KB, and the large variants total 976 KB.

A cache-cold load at 1440×1000 requested **no JPGs at all** — ten WebP files, 450 KB combined, with `currentSrc` resolving to `-480.webp` at 1× and the server access log showing zero `.jpg` hits. The display and interface face is a single 34 KB Archivo variable WOFF2 (`font-weight: 100 900`), declared once with no TTF fallback file.

The browser picks a candidate from `sizes`, not from the painted box, so keep those percentages in sync with the `.shot--*` widths if the collage is re-proportioned.
