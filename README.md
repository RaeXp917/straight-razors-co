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

## Local preview

```bash
python -m http.server 8000
# then open http://localhost:8000
```
