#!/usr/bin/env bash
# Capture card thumbnails for every GitHub Pages project on the account.
#
#   ./tools/shoot-thumbs.sh            # only captures projects with no thumbnail yet
#   ./tools/shoot-thumbs.sh --force    # re-captures everything
#
# Asks the GitHub API which repos have Pages enabled, so a newly shipped page is
# picked up automatically. Writes thumbs/<repo>.webp (640x400).
#
# These are real WebGL pages. Use ANGLE/Metal so headless Chrome gets the actual
# Apple GPU — with the software rasteriser (--use-angle=swiftshader) some scenes
# never draw at all and you get a black card. Metal is also far faster.
# Chrome's own --screenshot is used rather than CDP because we only need one
# frame per site.
#
# Known exception: sacred-heart renders almost black under Metal (mean 0.04) but
# correctly under swiftshader (mean 0.17), so its thumbnail was taken with
# `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`. Since the
# script only fills in MISSING thumbnails, that file survives normal re-runs; a
# `--force` re-run will reject it and fall back to GitHub's card.
set -uo pipefail

cd "$(dirname "$0")/.."

GH_USER="Foshowithit"
OUT="thumbs"
W=960; H=600           # render size (downscaled to 640x400 after)
SETTLE=15000           # ms Chrome waits before shooting; raise for heavy scenes
# Chrome writes the screenshot at SETTLE but then often never exits, so wrap it
# in a wall-clock kill just past the shot. Without this every page burns the
# full wrapper timeout and a 14-page run takes ~28 min instead of ~6.
KILL_AFTER=$(( SETTLE / 1000 + 12 ))
MIN_SD=0.03            # reject near-flat frames (see "blank gate" below)
MIN_MEAN=0.02          # reject frames that are essentially all black
GL="--use-angle=metal --enable-gpu --ignore-gpu-blocklist"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

FORCE=0
[[ "${1:-}" == "--force" ]] && FORCE=1

mkdir -p "$OUT"

echo "→ asking GitHub which repos have Pages enabled..."
SLUGS=$(curl -s --noproxy '*' "https://api.github.com/users/$GH_USER/repos?per_page=100" \
  | /Users/adam26/.workbuddy-ai/binaries/python/versions/3.13.12/bin/python3 -c '
import json,sys
for r in json.load(sys.stdin):
    if r.get("has_pages") and not r.get("archived") and not r.get("fork") and r["name"] != "adamn.info":
        print(r["name"])')

if [[ -z "$SLUGS" ]]; then echo "!! GitHub API returned nothing (rate limit?)"; exit 1; fi

total=0; shot=0; skipped=0; failed=0; blanked=0
for slug in $SLUGS; do
  total=$((total+1))
  dest="$OUT/$slug.webp"
  if [[ -f "$dest" && $FORCE -eq 0 ]]; then skipped=$((skipped+1)); continue; fi

  # macOS ships bash 3.2 — no ${VAR,,}, so lowercase the long way
  host=$(printf '%s' "$GH_USER" | tr 'A-Z' 'a-z')
  url="https://$host.github.io/$slug/"
  profile="/tmp/thumbshot-$slug"
  raw="/tmp/thumbshot-$slug.png"
  rm -rf "$profile" "$raw"

  printf "  %-32s " "$slug"
  timeout "$KILL_AFTER" "$CHROME" --headless=new --no-sandbox \
    --user-data-dir="$profile" $GL \
    --autoplay-policy=no-user-gesture-required \
    --hide-scrollbars --window-size=$W,$H --timeout=$SETTLE \
    --screenshot="$raw" "$url" >/dev/null 2>&1

  # Blank gate. A page that needs a click to start (video players, "tap to
  # begin" overlays) screenshots as a flat frame, and a scene the renderer
  # can't draw comes out pure black — both are worse than no thumbnail, because
  # the site would show a black card. Reject and let the page fall back to
  # GitHub's auto-generated repo card.
  # Calibration on this account's pages: blank frames sd ~0.018; a page whose
  # canvas never drew had mean 0.009 while the next-darkest real scene sat at
  # 0.054. Hence the two thresholds.
  if [[ -s "$raw" ]]; then
    # reset first: if magick prints nothing, `read` would otherwise leave the
    # previous page's numbers in place and silently reject this one
    sd=1; mean=1
    read -r sd mean < <(magick "$raw" -colorspace gray -format "%[fx:standard_deviation] %[fx:mean]" info: 2>/dev/null || echo "1 1")
    reason=""
    awk -v a="$sd"   -v b="$MIN_SD"   'BEGIN{exit !(a < b)}' && reason="flat (sd $sd)"
    awk -v a="$mean" -v b="$MIN_MEAN" 'BEGIN{exit !(a < b)}' && reason="black (mean $mean)"
    if [[ -n "$reason" ]]; then
      printf "REJECT %s - will use GitHub's card\n" "$reason"
      blanked=$((blanked+1))
      rm -rf "$profile" "$raw"
      continue
    fi
  fi

  if [[ -s "$raw" ]] && cwebp -quiet -q 80 -resize 640 400 "$raw" -o "$dest" 2>/dev/null; then
    printf "ok  %s\n" "$(du -h "$dest" | cut -f1)"
    shot=$((shot+1))
  else
    printf "FAILED\n"
    failed=$((failed+1))
  fi
  rm -rf "$profile" "$raw"
done

echo
echo "captured $shot · already had $skipped · blank $blanked · failed $failed · $total total"
[[ $blanked -gt 0 ]] && echo "blank ones will show GitHub's repo card instead - capture those by hand if you want a real shot"
[[ $failed -gt 0 ]] && echo "re-run to retry just the failures"
exit 0
