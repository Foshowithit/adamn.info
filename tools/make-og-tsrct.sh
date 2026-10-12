#!/usr/bin/env bash
# Render og.jpg — the adamn.info social share card — from the Tesseract document.
#   ./tools/make-og-tsrct.sh
#
# og.jpg is the 1200x630 image every chat app and social crawler fetches when the
# link is shared, and it is the one surface of this site that cannot be checked
# by reading the page. So it is built from a document that can be re-rendered and
# re-measured, not from an HTML mock:
#
#   tools/og-card.tsrct.json            the composed document — 1200x630, the two
#                                       type stacks, the orange sweep, the
#                                       vignette grade, and the three light
#                                       casters that make the glow field
#   tools/fonts/archivo-900-106.ttf     display face: Archivo, instanced from
#                                       fonts/archivo.woff2 at wght 900 / wdth 106.
#                                       Its name table still reads "Archivo
#                                       SemiBold" — that is the upstream family
#                                       name, not the instance.
#   tools/fonts/jetbrains-mono-bold.ttf kicker + sub line
#
# Both fonts are OFL-1.1 and are embedded into the .tsrct by import-font.
#
# To change the card, edit tools/og-card.tsrct.json and re-run this. There is
# deliberately no separate layout spec: a hand-copied spec describing the same
# geometry is a second literal that drifts away from the render.
#
# The contract is PROPERTIES, not bytes. The engine takes different SIMD paths
# on different machines, so a re-render can differ from the committed og.jpg by
# up to ~4/255 per channel (measured: 0.4/255 mean) while being the same card.
# The three checks below are what must hold: 1200x630, the accent sweep and type
# present, and the glow field lit.
#
# Requires tsrct (0.3.1+) and ImageMagick on PATH. Set TSRCT=/path/to/tsrct if
# the engine lives somewhere else.
set -euo pipefail
cd "$(dirname "$0")/.."

TSRCT="${TSRCT:-tsrct}"
command -v "$TSRCT" >/dev/null 2>&1 || {
  echo "!! tsrct not found on PATH — set TSRCT=/path/to/tsrct"; exit 1; }
command -v magick >/dev/null 2>&1 || { echo "!! ImageMagick (magick) not found"; exit 1; }

DOC=tools/og-card.tsrct.json
DISPLAY=tools/fonts/archivo-900-106.ttf
MONO=tools/fonts/jetbrains-mono-bold.ttf
for f in "$DOC" "$DISPLAY" "$MONO"; do
  [[ -s "$f" ]] || { echo "!! missing $f — cannot render the card"; exit 1; }
done

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# The project is a container; the document is committed into it. Fonts are
# resolved by family name, so both must be imported before the commit or the text
# silently falls back to a default face and the render still "succeeds".
"$TSRCT" project create -p "$TMP/project.tsrct" >/dev/null
"$TSRCT" project import-font -p "$TMP/project.tsrct" --file "$DISPLAY" >/dev/null
"$TSRCT" project import-font -p "$TMP/project.tsrct" --file "$MONO" >/dev/null
"$TSRCT" project commit -p "$TMP/project.tsrct" --file "$DOC" -o "$TMP/card.tsrct" >/dev/null
"$TSRCT" preview -p "$TMP/card.tsrct" -t 1.5 -o "$TMP/card.png" >/dev/null

# 4:4:4 rather than 4:2:0: the card is near-black with fine orange type and a
# hairline sweep, and 4:2:0 punched a visible chroma block into the field
# (measured at 200,500: blue +7). Full chroma keeps ~125 more accent pixels and
# costs nothing at unfurl size. q85 is where the type stops visibly changing.
magick "$TMP/card.png" -strip -interlace none -quality 85 -sampling-factor 4:4:4 og.jpg

# Guard the output. A render that "succeeds" with a missing font, a vanished glow
# field, or the wrong canvas is the failure this script exists to catch.
dim="$(magick identify -format '%wx%h' og.jpg)"
[[ "$dim" == "1200x630" ]] || { echo "!! og.jpg is $dim, expected 1200x630"; exit 1; }

# Accent ink, at the same threshold used to verify the shipped card (~28.7k px).
ink="$(magick og.jpg -fx '(r>0.5098 && g<0.549 && b<0.4314 && (r-g)>0.2353) ? 1 : 0' \
       -format '%[fx:mean*w*h]' info:)"
[[ "${ink%.*}" -ge 20000 ]] || {
  echo "!! accent ink ${ink%.*} px, expected ~28000 — a font or the sweep did not render"
  exit 1; }

# The glow field: the ground is (11,10,8) and the olive caster lifts 300,150 to
# (19,20,12). A floor of 16 catches a field that vanished outright without
# tripping on the engine's +/-4/255 render residual between machines.
g="$(magick og.jpg -format '%[fx:round(255*p{300,150}.g)]' info:)"
[[ "$g" -ge 16 ]] || {
  echo "!! glow field missing at 300,150 (green $g, expected ~20)"; exit 1; }

echo "wrote og.jpg  $dim  $(du -h og.jpg | cut -f1)  accent ink ${ink%.*} px  field g=$g"
