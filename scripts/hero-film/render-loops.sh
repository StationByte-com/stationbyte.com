#!/usr/bin/env bash
# Renders every loop scene (36 frames at 12 fps each) then encodes them. Usage: scripts/hero-film/render-loops.sh [scene …]
set -euo pipefail
cd "$(dirname "$0")/../.."
BLENDER=${BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender}
scenes=${*:-ai saas apps design contact studio process}
for s in $scenes; do
  samples=12; case $s in contact|studio|process) samples=10 ;; esac
  mkdir -p ".render/loops/$s"
  echo "render $s"
  "$BLENDER" -b -P scripts/hero-film/scenes.py -- --scene "$s" --out ".render/loops/$s/f" --samples "$samples" 2>&1 | grep -E "Error|Traceback" || true
done
scripts/hero-film/encode-loops.sh
