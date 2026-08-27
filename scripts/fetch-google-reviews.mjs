#!/usr/bin/env node
/* ============================================================================
   fetch-google-reviews.mjs  —  SERVER-SIDE ONLY (runs in GitHub Actions).

   Pulls the LIVE Google rating + total review count for the business via the
   official **Google Places API (New) — Place Details** and writes a small public
   cache to assets/data/reviews.json, which the static site reads in the
   browser. The browser NEVER calls Google and never sees any secret.

   • Endpoint: GET https://places.googleapis.com/v1/places/{PLACE_ID}
   • Headers:  X-Goog-Api-Key   (secret — server-side only)
               X-Goog-FieldMask: rating,userRatingCount
   • Auth:     a Google Cloud API key (no OAuth, no scopes, no approval queue).
   • Place ID: read straight from config.js → business.googlePlaceId — the SAME
               canonical ID the site uses for the Maps links and the "see all
               reviews" button (single source of truth).

   The GitHub Action runs this every 4 hours (the cache/revalidation interval)
   and commits the JSON only when it changed. On ANY failure it exits non-zero
   WITHOUT touching the existing cache, so the site keeps serving the last good
   rating/count (stale-on-error). It never writes invented data.
   ============================================================================ */

import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets", "data", "reviews.json");
const CONFIG_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "config.js");
const API_BASE = "https://places.googleapis.com/v1/places";
const TIMEOUT_MS = 15000;

/* Never print secret values — only names/lengths/status codes. */
function log(msg) { console.log(`[reviews] ${msg}`); }
function fail(msg) { console.error(`[reviews] ERROR: ${msg}`); }

// Load the canonical business identity straight from config.js so the Place ID
// used here is always the same one the site renders everywhere else.
async function loadConfig() {
  const src = await readFile(CONFIG_PATH, "utf8");
  return new Function(src + "\n;return SITE_CONFIG;")();
}

function requireEnv() {
  const names = ["GOOGLE_API_KEY"];
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

async function fetchPlaceSummary(env, placeId) {
  const url = `${API_BASE}/${encodeURIComponent(placeId)}`;
  const res = await withTimeout(url, {
    headers: {
      "X-Goog-Api-Key": env.GOOGLE_API_KEY,
      "X-Goog-FieldMask": "rating,userRatingCount"
    }
  });
  if (!res.ok) throw new Error(`Places API request failed (HTTP ${res.status})`);
  return res.json();
}

async function main() {
  const { missing, env } = requireEnv();
  if (missing.length) {
    // Not configured yet → leave the existing cache untouched and succeed
    // quietly so the scheduled job isn't a permanent red X before setup.
    log(`skipping refresh — missing env: ${missing.join(", ")}`);
    log("add GOOGLE_API_KEY as a GitHub Actions secret to enable live reviews (see README).");
    return;
  }

  const cfg = await loadConfig();
  const placeId = (env.GOOGLE_PLACE_ID || (cfg.business && cfg.business.googlePlaceId) || "").trim();
  if (!placeId) {
    fail("no Google Place ID — set business.googlePlaceId in config.js (or GOOGLE_PLACE_ID).");
    process.exit(1);
  }

  log(`fetching Place Details for ${placeId} (rating, userRatingCount)…`);
  const data = await fetchPlaceSummary(env, placeId);
  const rating = data.rating != null ? Number(data.rating) : null;
  const count = data.userRatingCount != null ? Number(data.userRatingCount) : null;
  if (rating == null && count == null) {
    throw new Error("Places API response had no rating/userRatingCount");
  }

  const payload = {
    status: "ok",
    updatedAt: new Date().toISOString(),
    averageRating: rating,
    totalReviewCount: count,
    reviewsPageUrl: (process.env.GOOGLE_REVIEWS_PAGE_URL || "").trim(),
    reviews: []
  };

  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  log(`wrote ${rating ?? "?"}★ / ${count ?? "?"} total reviews.`);
}

main().catch((err) => {
  // Log the message only — never the stack/response that might echo a token.
  fail(err && err.message ? err.message : String(err));
  fail("cache left unchanged; the site keeps serving the last good rating/count.");
  process.exit(1);
});