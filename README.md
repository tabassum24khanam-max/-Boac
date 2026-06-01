# BOAC Café — Website

A modern, responsive, single-page marketing site for **BOAC Café** (specialty
coffee, Khurais Road · Al Rawdah · Riyadh — open 24 hours).

Built with **plain HTML + CSS + vanilla JS** — no build step, no frameworks.
Just open `index.html` in any browser.

```
index.html    → markup & content (single-page scroll)
styles.css    → all styling (mobile-first, navy + cream + brass-gold theme)
script.js     → hamburger nav, lightbox, scroll-reveal, menu filter, form
assets/       → drop your own logo / photos here
```

## Run it
Double-click `index.html`, or serve locally:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## ✏️ What to replace to make it the real café's site

| Where | What to change |
|-------|----------------|
| **Phone / WhatsApp** | Search the project for `966500000000` and `+966 50 000 0000` and replace with the real number. (Also `WHATSAPP_NUMBER` in `script.js`.) |
| **Menu items & prices** | In `index.html`, the `.menu-card` blocks. Names/prices are realistic samples in SAR — swap for the live board. |
| **Photos** | Hero & all images use Unsplash URLs. Replace with real BOAC photos (drop into `assets/` and update the `src`/`data-full`/`background-image`). |
| **Logo** | Currently a text logo (`BOAC` + ✈ mark). Replace `.brand` in `index.html` with an `<img>` if you have a logo file. |
| **Map** | The keyless Google Maps embed uses a text query. For an exact pin, paste the café's own embed URL into the `iframe src` in the Visit section. |
| **Social links** | TikTok currently points to the Linktree. Add the direct TikTok URL if preferred. |
| **OG image** | `<meta property="og:image">` in `<head>` — set to a hosted BOAC photo for nice link previews. |

## Theme
Aviation-heritage palette nodding to the original BOAC airline brand:
**midnight navy `#0f1f3d`**, **warm cream `#f6f0e4`**, **brass gold `#c8a05a`**,
with coffee-brown supporting tones. Headings in Playfair Display, labels in
Oswald, body in Inter. All colors are CSS variables at the top of `styles.css`.

## Responsive & quality
- Mobile-first; verified layouts at **375px / 768px / 1280px**, no horizontal overflow.
- Hamburger slide-in nav (locks scroll, closes on tap/Escape/overlay).
- Lightbox gallery: keyboard arrows, Escape, and swipe on touch.
- Reservation form: front-end validation → opens WhatsApp with details pre-filled.
- Accessibility: semantic HTML, alt text, visible focus, skip link, `prefers-reduced-motion` respected.
- SEO: title, meta description, Open Graph tags, lazy-loaded images.
