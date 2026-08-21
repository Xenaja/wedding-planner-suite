# Image and map credits

Demo content for the guest site. All of it is placeholder — a real wedding
replaces every frame with the couple's own photographer.

## Photography

| File | Slot |
|---|---|
| `assets/cover-villa.jpg` | Cover — the villa terrace above the lake at golden hour |
| `assets/story-1.jpg` | Ceremony arch on the lawn above the lake |
| `assets/story-2.jpg` | The couple on the terrace |
| `assets/story-3.jpg` | The banquet table at dusk |

All four are **supplied by the agency** and are **generated imagery, not photographs
of a real place**. No attribution is required and no third party holds rights in them,
but they must not be presented to a couple as pictures of an actual venue.

They arrive already sharing one grade, so nothing is colour-corrected in the build —
the frames are only resized and encoded to JPEG. The tiles are 4:3 in the source and
render in a ~1.27 slot, so `object-fit: cover` trims the sides a little; the full
height is always visible, which is what keeps the couple's heads in frame on tile 2.

## Map

The "Getting there" card embeds OpenStreetMap's own `export/embed.html` widget
centred on Bellagio — no API key, no account, no tracking script. Map data is
© OpenStreetMap contributors under the [ODbL](https://www.openstreetmap.org/copyright);
the required credit is rendered by the widget itself, so the page needs no extra line.

A CSS `filter` mutes the tiles into the page's palette. Two things follow from that:
the map is a live third-party frame (it needs network, and it is the one element on
the page that can be slow), and the venue is fictional — the pin marks Bellagio, not
a real Villa Regina. In production, swap in the couple's actual venue coordinates.
