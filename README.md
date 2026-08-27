# Straight Razors Co — website

Static website for **Straight Razors Co** (barber shop, Kozani). Plain HTML/CSS/JS,
no backend — hosted free on **GitHub Pages**. Works on mobile and desktop.

## Live site

Once GitHub Pages is enabled (Settings → Pages → Deploy from branch → `main` / root):

```
https://raexp917.github.io/straight-razors-co
```

## Editing

Everything the client sees is driven by **`config.js`** — brand, colors, phone,
address, hours, services, team, gallery, social links, and the Instagram section.
The engine files (`index.html`, `assets/js/*`, `assets/css/styles.css`) don't need
per-client edits.

### Instagram feed

`config.js` → `instagram` block. To show a live, scrollable grid of the latest
posts, sign up (free) at a widget provider — [SnapWidget](https://snapwidget.com)
(easiest), [Behold](https://behold.so), or [LightWidget](https://lightwidget.com) —
connect **@straight_razors_co**, copy the embed snippet, and paste it into
`instagram.embedHtml`. Until then the section shows a working "Follow" button.

> Instagram **stories** can't be embedded on a website (Instagram doesn't allow
> it). The Follow button opens the profile, where stories show natively at the top.

## Google reviews (live, automatic)

The **reviews section**, the **hero badge** and the **about copy** all show the
real Google rating + review count pulled from the **official Google Places API
(New)** — no scraping, no widgets, no fake data, and no hard-coded numbers in
`config.js`.

**How it works (fits GitHub Pages — a static host with no server):**

1. A scheduled **GitHub Action** (`.github/workflows/reviews.yml`) runs every
   **4 hours** (and on demand) — that is the cache/revalidation interval.
2. It runs `scripts/fetch-google-reviews.mjs` **server-side**, using a
   **Google Cloud API key** (a repo secret), and calls
   `GET https://places.googleapis.com/v1/places/{PLACE_ID}` with
   `X-Goog-FieldMask: rating,userRatingCount`. The Place ID comes from
   `business.googlePlaceId` in `config.js` — the same ID the Maps links and the
   "see all reviews" button use.
3. It commits the result to `assets/data/reviews.json`, so GitHub Pages serves
   it. The browser only ever reads that static file — **it never calls Google
   and never sees the API key.**
4. The reviews section renders the live `rating` + `userRatingCount` under the
   Google button. On any failure it keeps the last cached values (stale-on-error)
   and links out to Google — never invented data.

**Setup — one time.** Add these as repository secrets
(*Settings → Secrets and variables → Actions*). Names are documented in
[`.env.example`](.env.example):

| Secret | Where to get it |
| --- | --- |
| `GOOGLE_API_KEY` | Google Cloud Console → **APIs & Services → Credentials** → create an API key. Enable the **Places API (New)** for the project and restrict the key to it. |
| `GOOGLE_PLACE_ID` | *Optional* — leave unset; the script reads the canonical Place ID from `business.googlePlaceId` in `config.js`. |
| `GOOGLE_REVIEWS_PAGE_URL` | *Optional* — public "see all reviews on Google" link. If unset, the site uses `business.reviewsPageUrl` in `config.js`. |

Until `GOOGLE_API_KEY` exists, the Action skips quietly and the rating/count
are simply not shown (no fake numbers), with a link to Google in the reviews
section.

Trigger the first refresh manually from the **Actions** tab → *Refresh Google
reviews* → **Run workflow**. From then on, whenever Google's count changes
(117 → 118 → …), the site updates automatically on the next 4-hour run —
**no code edit or redeploy is ever needed to update the review count.**

## Google Maps links

The "Open in Maps" button, the embedded map and the reviews button are all
derived from the canonical **`business` block in `config.js`** — one source of
truth. `googlePlaceId` is what makes Maps open the exact **Straight Razors Co**
business profile (it is *not* a coordinate pin); latitude/longitude are only a
fallback and must match the same profile.

## Local preview

```bash
python -m http.server 8000
# then open http://localhost:8000
```
