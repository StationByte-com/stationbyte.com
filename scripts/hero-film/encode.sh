#!/usr/bin/env bash
# Encodes rendered frames (.render/film/f0001.png ...) into the hero loops in public/video.
# Wide: 1920x1080. Tall (phones): a 4:5 crop around the grid at 1080x1350. Both get light film grain and a vignette.
set -euo pipefail
cd "$(dirname "$0")/../.."

IN=".render/film/f%04d.png"
OUT="public/video"
FPS=24
FINISH="noise=alls=3:allf=t,vignette=angle=PI/5"
mkdir -p "$OUT"

encode() { # name, filter, size
  ffmpeg -y -loglevel error -framerate $FPS -i "$IN" -vf "$2,$FINISH,format=yuv420p" \
    -c:v libx264 -preset slow -crf 21 -maxrate 3M -bufsize 6M -profile:v high -movflags +faststart -an "$OUT/$1.mp4"
  ffmpeg -y -loglevel error -framerate $FPS -i "$IN" -vf "$2,$FINISH,format=yuv420p" \
    -c:v libvpx-vp9 -b:v 2M -crf 30 -row-mt 1 -an "$OUT/$1.webm"
  # Poster is frame 1, so the first paint and the loop start are the same image.
  ffmpeg -y -loglevel error -i ".render/film/f0001.png" -vf "$2,vignette=angle=PI/5" -q:v 3 "$OUT/$1-poster.jpg"
}

encode hero-wide "scale=1920:1080:flags=lanczos"
# The grid sits in the right half of the frame; crop a 4:5 window around it for phones.
encode hero-tall "crop=ih*4/5:ih:iw*0.435:0,scale=1080:1350:flags=lanczos"
ls -la "$OUT"
