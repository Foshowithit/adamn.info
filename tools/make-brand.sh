#!/usr/bin/env bash
# Render the brand assets used when adamn.info is shared or bookmarked.
#   ./tools/make-brand.sh
#
#   apple-touch-icon.png   180x180  home-screen icon, from favicon.svg
#
# og.jpg (1200x630, the social share card) is NOT built here. It comes from the
# Tesseract document and has its own renderer:
#   ./tools/make-og-tsrct.sh
# This script used to render og.jpg from tools/og-card.html; that card has been
# superseded, and re-rendering it here would silently revert the shipped card.
# og.jpg is only checked for presence and shape, below.
#
# Chrome writes the PNG but often does not exit on its own, so a non-zero exit
# from `timeout` is expected — never let set -e act on it.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shoot() { # shoot <html> <out.png> <w> <h>
  rm -rf /tmp/brandshot
  timeout 60 "$CHROME" --headless=new --no-sandbox \
    --user-data-dir=/tmp/brandshot --allow-file-access-from-files \
    --hide-scrollbars --window-size="$3,$4" --force-device-scale-factor=1 \
    --timeout=6000 --screenshot="$2" "file://$PWD/$1" >/dev/null 2>&1 || true
  rm -rf /tmp/brandshot
}

# apple-touch-icon: the favicon at 180x180 on its own tile, no transparency
cat > /tmp/touch.html <<'HTML'
<!doctype html><meta charset=utf-8>
<body style="margin:0;width:180px;height:180px;overflow:hidden">
<img src="favicon.svg" width="180" height="180" alt="">
</body>
HTML
cp favicon.svg /tmp/favicon.svg
shoot /tmp/touch.html apple-touch-icon.png 180 180
magick apple-touch-icon.png -background '#0b0a08' -flatten -strip apple-touch-icon.png

[[ -s apple-touch-icon.png ]] || { echo "!! apple-touch-icon.png failed"; exit 1; }
echo "wrote apple-touch-icon.png  $(magick identify -format '%wx%h' apple-touch-icon.png)  $(du -h apple-touch-icon.png | cut -f1)"

# og.jpg is committed, and is rendered by tools/make-og-tsrct.sh — not here. It
# is checked so a missing or wrong-shaped card cannot go unnoticed.
[[ -s og.jpg ]] || { echo "!! og.jpg is missing — run tools/make-og-tsrct.sh"; exit 1; }
dim=$(magick identify -format '%wx%h' og.jpg)
[[ "$dim" == "1200x630" ]] || { echo "!! og.jpg is $dim, expected 1200x630"; exit 1; }
echo "kept og.jpg  $dim  $(du -h og.jpg | cut -f1)  (built by tools/make-og-tsrct.sh)"
