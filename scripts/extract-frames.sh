#!/usr/bin/env bash
# Extract ~120 vertical WebP frames from film.mp4 (project root).
# Usage: ./scripts/extract-frames.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/film.mp4"
OUT="$ROOT/public/frames"
COUNT=120
W=720
H=1280

if [[ ! -f "$SRC" ]]; then
  echo "No film.mp4 at $SRC — keeping SVG fallback manifest."
  exit 0
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install ffmpeg to extract frames."
  exit 1
fi

mkdir -p "$OUT"
rm -f "$OUT"/frame-*.webp

# Probe duration
DUR="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$SRC")"
FPS="$(python3 - <<PY
dur=float("$DUR") or 1.0
print(max($COUNT/dur, 0.1))
PY
)"

ffmpeg -y -i "$SRC" -vf "fps=${FPS},scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}" -frames:v "$COUNT" "$OUT/frame-%03d.webp"

# Rename to 0-indexed frame-000.webp …
i=0
for f in "$OUT"/frame-*.webp; do
  printf -v name "frame-%03d.webp" "$i"
  mv "$f" "$OUT/$name"
  i=$((i+1))
done

ACTUAL=$(ls "$OUT"/frame-*.webp 2>/dev/null | wc -l | tr -d ' ')
SIZE=$(du -sk "$OUT" | awk '{print $1}')

cat > "$OUT/manifest.json" <<JSON
{
  "mode": "webp-frames",
  "frameCount": ${ACTUAL},
  "virtualFrames": ${ACTUAL},
  "width": ${W},
  "height": ${H},
  "poster": "/frames/frame-000.webp",
  "pattern": "/frames/frame-{index}.webp",
  "totalSizeKb": ${SIZE}
}
JSON

echo "Extracted ${ACTUAL} frames (~${SIZE} KB) into $OUT"
