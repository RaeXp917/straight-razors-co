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

The **reviews section** shows real Google reviews pulled from the **official
Google Business Profile Reviews API** — no scraping, no widgets, no fake data.

**How it works (fits GitHub Pages — a static host with no server):**

1. A scheduled **GitHub Action** (`.github/workflows/reviews.yml`) runs every
   6 hours (and on demand).
2. It runs `scripts/fetch-google-reviews.mjs` **server-side**, using repo
   secrets, to call the API and write `assets/data/reviews.json`.
3. It commits that JSON, so GitHub Pages serves it. The browser only ever reads
   that static file — **it never calls Google and never sees any secret.**
4. The site shows the **six newest 4★/5★ reviews**, plus the real overall
   rating + total review count (unfiltered, straight from the API). On any
   failure it keeps the last cached results and links out to Google — never
   invented testimonials.

**Setup — one time.** Add these as repository secrets
(*Settings → Secrets and variables → Actions*). Names are documented in
[`.env.example`](.env.example):

| Secret | Where to get it |
| --- | --- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → **APIs & Services → Credentials** → OAuth client. |
| `GOOGLE_REFRESH_TOKEN` | Run the OAuth consent flow once with scope `https://www.googleapis.com/auth/business.manage` and store the refresh token. |
| `GOOGLE_BUSINESS_ACCOUNT_ID` | Business Profile API `accounts.list` → the number in `accounts/{id}`. |
| `GOOGLE_BUSINESS_LOCATION_ID` | `accounts/{id}/locations.list` → the id in `locations/{id}`. |
| `GOOGLE_REVIEWS_PAGE_URL` | Public "see all reviews on Google" link for the button. |

You must also, in Google Cloud: create a project, **enable the Google Business
Profile API**, and **request API access** (Google gates the Business Profile
APIs — approval is required before calls succeed). Until the secrets exist, the
Action skips quietly and the section shows a tasteful "no reviews yet" state
with a link to Google (no placeholder/fake reviews).

Trigger the first refresh manually from the **Actions** tab → *Refresh Google
reviews* → **Run workflow**.

## Local preview

```bash
python -m http.server 8000
# then open http://localhost:8000
```
