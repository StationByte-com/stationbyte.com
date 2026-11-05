#!/usr/bin/env bash
# Encodes the loop scenes (.render/loops/<scene>/f0001.png …) into small, seamless clips in public/video/loops:
# VP9 WebM, H.264 MP4 and a WebP poster (frame 1, so the still and the loop start match).
set -euo pipefail
cd "$(dirname "$0")/../.."
OUT="public/video/loops"
mkdir -p "$OUT"
for dir in .render/loops/*/; do
  name=$(basename "$dir")
  [ "$name" = "test" ] && continue
  [ -f "$dir/f0036.png" ] || { echo "skip $name (incomplete)"; continue; }
  # Rendered at 12 fps. Append frames 1-2 so the interpolation also blends the loop seam, interpolate to 24 fps,
  # then drop the duplicate closing frame: 72 frames that loop seamlessly.
  tmp=$(mktemp -d)
  cp "$dir"/f00*.png "$tmp/"
  cp "$dir/f0001.png" "$tmp/f0037.png"
  cp "$dir/f0002.png" "$tmp/f0038.png" # minterpolate drops its last output frame; one more keeps all 72
  ffmpeg -y -loglevel error -framerate 12 -i "$tmp/f%04d.png" -vf "minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -frames:v 72 -c:v ffv1 "$tmp/i.mkv"
  ffmpeg -y -loglevel error -i "$tmp/i.mkv" -vf "format=yuv420p" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -an "$OUT/$name.webm"
  ffmpeg -y -loglevel error -i "$tmp/i.mkv" -vf "format=yuv420p" -c:v libx264 -preset slow -crf 27 -profile:v high -movflags +faststart -an "$OUT/$name.mp4"
  rm -r "$tmp"
  ffmpeg -y -loglevel error -i "$dir/f0001.png" -c:v libwebp -quality 80 "$OUT/$name.webp" 2>/dev/null \
    || node -e "require('sharp')('$dir/f0001.png').webp({quality:80}).toFile('$OUT/$name.webp')"
  echo "$name: $(du -h "$OUT/$name.webm" | cut -f1) webm, $(du -h "$OUT/$name.mp4" | cut -f1) mp4"
done
