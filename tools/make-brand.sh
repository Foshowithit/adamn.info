#!/usr/bin/env bash
# Render the brand assets used when adamn.info is shared or bookmarked.
#   ./tools/make-brand.sh
#
#   og.jpg                1200x630  social share card, from tools/og-card.html
#   apple-touch-icon.png   180x180  home-screen icon, from favicon.svg
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

shoot tools/og-card.html /tmp/og-raw.png 1200 630
# JPEG, not PNG: the card carries a fine grain layer that makes PNG ~484 KB.
# q90 is visually identical at ~56 KB, and this file gets fetched by every chat
# app and social crawler that touches the link.
magick /tmp/og-raw.png -resize 1200x630^ -gravity center -extent 1200x630 -quality 90 -strip og.jpg
rm -f /tmp/og-raw.png og.png

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

for f in og.jpg apple-touch-icon.png; do
  [[ -s "$f" ]] || { echo "!! $f failed"; exit 1; }
  echo "wrote $f  $(magick identify -format '%wx%h' "$f")  $(du -h "$f" | cut -f1)"
done
