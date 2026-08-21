#!/bin/sh
# Regenerate the pages GitHub Pages serves, from the design sources.
# The .dc.html files are canonical; these copies exist only because Pages
# needs an index.html and because clean URLs beat %20-escaped ones.
set -e
cd "$(dirname "$0")"
cp "Wedding Suite v2.dc.html" index.html
cp "Wedding Suite.dc.html"    v1.html
echo "built: index.html (v2), v1.html (v1)"
