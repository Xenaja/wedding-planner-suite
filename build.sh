#!/bin/sh
# Regenerate the pages GitHub Pages serves, from the design sources.
# The .dc.html files are canonical; these copies exist only because Pages
# needs an index.html and because clean URLs beat %20-escaped ones.
# Russian is the main build, so it gets the root; English lives at /en.html.
set -e
cd "$(dirname "$0")"
cp "Wedding Suite v2 RU.dc.html" index.html
cp "Wedding Suite v2.dc.html"    en.html
cp "Wedding Suite.dc.html"       v1.html
echo "built: index.html (v2 RU), en.html (v2 EN), v1.html (v1)"
