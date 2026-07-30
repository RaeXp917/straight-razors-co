#!/usr/bin/env node
/* ============================================================================
   fetch-google-reviews.mjs  —  SERVER-SIDE ONLY (runs in GitHub Actions).

   Pulls the latest reviews from the OFFICIAL Google Business Profile Reviews
   API and writes a small public cache to assets/data/reviews.json, which the
   static site reads in the browser. The browser NEVER calls Google and never
   sees any secret — all credentials stay here, server-side, in CI secrets.

   • Auth:  OAuth 2.0 refresh-token → access-token exchange (business.manage).
   • Read:  GET .../v4/accounts/{acct}/locations/{loc}/reviews
            ?orderBy=updateTime desc&pageSize=50   (paginated).
   • Keep:  the six newest reviews rated 4★ or 5★ (rating-only allowed).
   • Overall averageRating + totalReviewCount come straight from the API and are
     NOT filtered (they represent ALL reviews).

   Design note: this project has no npm/package manager (it's a plain static
   site), so instead of adding the googleapis SDK we use Node's built-in fetch
   for both the token exchange and the REST calls — zero dependencies, nothing
   to install, secrets never leave the process. Requires Node 18+ (global fetch).

   On ANY failure it exits non-zero WITHOUT touching the existing cache, so the
   site keeps serving the last good reviews. It never writes invented data.
   ============================================================================ */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "data", "reviews.json");
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_BASE = "https://mybusiness.googleapis.com/v4";
const WANT = 6;                 // how many qualifying reviews to display
const MIN_STARS = 4;            // only 4★ and 5★ are shown
const TIMEOUT_MS = 15000;

const STAR = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

/* Never print secret values — only names/lengths/status codes. */
function log(msg) { console.log(`[reviews] ${msg}`); }
function fail(msg) { console.error(`[reviews] ERROR: ${msg}`); }

function requireEnv() {
  const names = [
    "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN",
    "GOOGLE_BUSINESS_ACCOUNT_ID", "GOOGLE_BUSINESS_LOCATION_ID"
  ];
  const missing = names.filter((n) => !process.env[n] || !String(process.env[n]).trim());
  return { missing, env: Object.fromEntries(names.map((n) => [n, (process.env[n] || "").trim()])) };
}

async function withTimeout(url, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function getAccessToken(env) {
  const body = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
    grant_type: "refresh_token"
  });
  const res = await withTimeout(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) throw new Error(`token exchange failed (HTTP ${res.status})`);
  const json = await res.json();
  if (!json.access_token) throw new Error("token exchange returned no access_token");
  return json.access_token;
}

async function fetchReviews(token, env) {
  const base = `${API_BASE}/accounts/${encodeURIComponent(env.GOOGLE_BUSINESS_ACCOUNT_ID)}` +
               `/locations/${encodeURIComponent(env.GOOGLE_BUSINESS_LOCATION_ID)}/reviews`;
  const qualifying = [];
  let pageToken = "";
  let averageRating = null;
  let totalReviewCount = null;
  let pages = 0;

  do {
    const params = new URLSearchParams({ pageSize: "50", orderBy: "updateTime desc" });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await withTimeout(`${base}?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`reviews request failed (HTTP ${res.status})`);
    const data = await res.json();

    // Overall numbers represent ALL reviews — captured once, never filtered.
    if (averageRating == null && data.averageRating != null) averageRating = data.averageRating;
    if (totalReviewCount == null && data.totalReviewCount != null) totalReviewCount = data.totalReviewCount;

    for (const r of (data.reviews || [])) {
      const rating = STAR[r.starRating] || 0;
      if (rating < MIN_STARS) continue;
      qualifying.push({
        author: (r.reviewer && r.reviewer.displayName) || "Google user",
        profilePhotoUrl: (r.reviewer && r.reviewer.profilePhotoUrl) || "",
        rating,
        comment: r.comment || "",            // kept verbatim — never rewritten/translated
        createTime: r.createTime || "",
        updateTime: r.updateTime || r.createTime || ""
      });
      if (qualifying.length >= WANT) break;
    }
    pageToken = qualifying.length >= WANT ? "" : (data.nextPageToken || "");
    pages += 1;
  } while (pageToken && pages < 40);   // hard stop so we never loop forever

  return { reviews: qualifying.slice(0, WANT), averageRating, totalReviewCount, pages };
}

async function main() {
  const { missing, env } = requireEnv();
  if (missing.length) {
    // Not configured yet → leave the existing cache untouched and succeed
    // quietly so the scheduled job isn't a permanent red X before setup.
    log(`skipping refresh — missing env: ${missing.join(", ")}`);
    log("add these as GitHub Actions secrets to enable live reviews (see README).");
    return;
  }

  log("exchanging refresh token for an access token…");
  const token = await getAccessToken(env);
  log("fetching reviews (orderBy=updateTime desc, pageSize=50)…");
  const { reviews, averageRating, totalReviewCount, pages } = await fetchReviews(token, env);

  const payload = {
    status: "ok",
    updatedAt: new Date().toISOString(),
    averageRating: averageRating != null ? Number(averageRating) : null,
    totalReviewCount: totalReviewCount != null ? Number(totalReviewCount) : null,
    reviewsPageUrl: (process.env.GOOGLE_REVIEWS_PAGE_URL || "").trim(),
    reviews
  };

  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  log(`wrote ${reviews.length} review(s) from ${pages} page(s) · overall ${averageRating ?? "?"}★ / ${totalReviewCount ?? "?"} total.`);
}

main().catch((err) => {
  // Log the message only — never the stack/response that might echo a token.
  fail(err && err.message ? err.message : String(err));
  fail("cache left unchanged; the site keeps serving the last good reviews.");
  process.exit(1);
});
