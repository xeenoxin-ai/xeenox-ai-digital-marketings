#!/usr/bin/env bash
# Rebuild the self-contained Trioz preview.
#   ./build.sh  ->  dist/trioz-preview.html
# Bundles three.js (tree-shaken) and inlines the woff2 faces as data URIs, so the
# output has zero external requests and survives a strict CSP.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
KIT="$HERE/../../starter-kits/3d-web"
mkdir -p "$HERE/dist"
( cd "$KIT" && cp "$HERE/scene.js" ./_scene_src.js \
  && npx esbuild ./_scene_src.js --bundle --minify --format=iife \
       --global-name=TriozScene --outfile="$HERE/dist/scene.bundle.js" \
  && rm -f ./_scene_src.js )
python3 "$HERE/inline.py"
echo "built -> $HERE/dist/trioz-preview.html"
