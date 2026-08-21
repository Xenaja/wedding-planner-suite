# Image credits

Demo photography for the guest site. All of it is placeholder content — a real
wedding replaces every one of these with the couple's own photographer.

## Cover

`assets/cover-villa.jpg` — an Italian lakeside villa terrace at golden hour.
Supplied by the agency; generated imagery, not a photograph of a real venue.
No attribution required, but it should not be presented to a couple as a picture
of the actual property.

## Story tiles

All three are **CC0 1.0 (public domain dedication)** — free for commercial use,
no attribution required. Credited here for traceability, not obligation.
Each has had a light warm grade applied so the set reads with the cover.

| File | Source | Licence |
|---|---|---|
| `assets/story-1.jpg` | [Wedding Reception, Bangkok Thailand](https://wordpress.org/photos/photo/256693d10a/) by pingjarupat, WordPress Photo Directory | CC0 1.0 |
| `assets/story-2.jpg` | [Flower arrangement](https://www.rawpixel.com/image/5924490/photo-image-flower-public-domain-wedding), rawpixel | CC0 1.0 |
| `assets/story-3.jpg` | [Chair setting, wedding destination](https://www.rawpixel.com/image/5912409/image-flower-public-domain-celebration), rawpixel | CC0 1.0 |

Candidates were found through the [Openverse](https://openverse.org) API, filtered
to CC0/public-domain so the bundle carries no attribution obligations downstream.

## Map

The "Getting there" card embeds OpenStreetMap's own `export/embed.html` widget
centred on Bellagio — no API key, no account, no tracking script. Map data is
© OpenStreetMap contributors under the [ODbL](https://www.openstreetmap.org/copyright);
the required credit is rendered by the widget itself, so the page needs no extra line.

A CSS `filter` mutes the tiles into the page's palette. Two things follow from that:
the map is a live third-party frame (it needs network, and it is the one element on
the page that can be slow), and the venue is fictional — the pin marks Bellagio, not
a real Villa Regina. In production, swap in the couple's actual venue coordinates.
