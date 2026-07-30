/* ============================================================================
   ⚙️  CONFIG  —  ΤΟ ΜΟΝΟ ΑΡΧΕΙΟ ΠΟΥ ΑΛΛΑΖΕΙΣ ΓΙΑ ΚΑΘΕ ΠΕΛΑΤΗ
   THE ONLY FILE YOU EDIT PER CLIENT.
   ----------------------------------------------------------------------------
   CLIENT: Straight Razors Co — Barber shop, Kozani
   ============================================================================ */

const SITE_CONFIG = {

  /* --- 1. BUSINESS TYPE PRESET --------------------------------------------- */
  businessType: "barber",

  /* --- 2. LANGUAGE --------------------------------------------------------- */
  defaultLang: "el",
  showSwitcher: true,

  /* --- 3. BRAND ------------------------------------------------------------ */
  brand: {
    name: "Straight Razors Co",
    tagline: {
      el: "Κουρείο για άντρες & παιδιά στην Κοζάνη",
      en: "Barber shop for men & kids in Kozani"
    },
    // logo can be an ICON NAME (see assets/js/icons.js), an image path, or emoji
    assetsDir: "assets/brands/straight-razors", // swap this folder for the next client
    logo: "logo.png",                  // resolved inside assetsDir
    showName: false,                   // crest already contains the business name
    favicon: "logo.png"
  },

  /* --- 4. THEME (colors + font) -------------------------------------------- */
  theme: {
    primary:   "#F3EEE4",   // warm marble-white text on dark
    accent:    "#C9A227",   // gold vein — richer/more saturated than flat brass
    accent2:   "#8C6E1F",   // deeper gold for hovers
    emerald:   "#1F3A2E",   // pulled from the mirror wall — secondary CTA/hover
    bg:        "#0B0B0C",   // true black leather/marble base
    surface:   "#161613",
    wood:      "#B08D5B",   // cabinetry tone — dividers / about badge
    font:      "'Fraunces', 'Poppins', serif",  // serif DISPLAY face (headings)
    radius:    "4px",       // sharp corners — boutique, not generic pill
    dark:      true
  },

  /* --- 5. CONTACT ---------------------------------------------------------- */
  contact: {
    phone:    "+30 2461 022648",
    whatsapp: "",                                  // no WhatsApp listed
    email:    "",                                  // none listed
    address:  "11ης Οκτωβρίου 41Α, Άγιος Χριστόφορος, Κοζάνη 501 00",
    mapQuery: "40.2991079,21.796646"               // exact coordinates → correct pin
  },

  /* --- 6. OPENING HOURS ---------------------------------------------------- */
  hours: {
    enabled: true,
    days: [
      { el: "Δευτέρα",    en: "Monday",    open: "Κλειστά / Closed" },
      { el: "Τρίτη",      en: "Tuesday",   open: "10:00 - 21:00" },
      { el: "Τετάρτη",    en: "Wednesday", open: "10:00 - 21:00" },
      { el: "Πέμπτη",     en: "Thursday",  open: "10:00 - 21:00" },
      { el: "Παρασκευή",  en: "Friday",    open: "10:00 - 21:00" },
      { el: "Σάββατο",    en: "Saturday",  open: "09:00 - 17:00" },
      { el: "Κυριακή",    en: "Sunday",    open: "Κλειστά / Closed" }
    ]
  },

  /* --- 7. HERO ------------------------------------------------------------- */
  hero: {
    image: "hero.jpg",                  // resolved inside brand.assetsDir
    title: {
      el: "Straight Razors Co",
      en: "Straight Razors Co"
    },
    subtitle: {
      el: "★ 5.0 με 117 κριτικές στο Google — το κούρεμα που ταξιδεύουν από τη Θεσσαλονίκη για να κάνουν.",
      en: "★ 5.0 with 117 Google reviews — the cut people drive in from Thessaloniki for."
    },
    ctaText: { el: "Κάλεσέ μας", en: "Call us" }
  },

  /* --- 8. ABOUT ------------------------------------------------------------ */
  about: {
    enabled: true,
    title: { el: "Σχετικά με εμάς", en: "About us" },
    text: {
      el: "Στο Straight Razors Co προσφέρουμε επαγγελματικό κούρεμα, ξύρισμα και περιποίηση για άντρες και παιδιά, σε έναν καθαρό χώρο με σεβασμό στην υγιεινή. Ευγενικό & έμπειρο προσωπικό, βαθμολογία 5.0★ από τους πελάτες μας. Δεχόμαστε μετρητά και κάρτες (Visa, Mastercard).",
      en: "At Straight Razors Co we offer professional haircuts, shaves and grooming for men and kids, in a clean space with strict hygiene. Polite, experienced staff and a 5.0★ customer rating. We accept cash and cards (Visa, Mastercard)."
    }
  },

  /* --- 9. SERVICES / MENU -------------------------------------------------- */
  services: {
    enabled: true,
    title: { el: "Υπηρεσίες", en: "Services" },
    // icon = a name from assets/js/icons.js (or an emoji / image path)
    items: [
      { icon: "scissors", name: { el: "Κούρεμα",       en: "Haircut" },       desc: { el: "Άντρες & παιδιά",     en: "Men & kids" },          price: "" },
      { icon: "razor",    name: { el: "Ξύρισμα",        en: "Shave" },         desc: { el: "Παραδοσιακό ξυράφι",  en: "Traditional razor" },   price: "" },
      { icon: "comb",     name: { el: "Περιποίηση",     en: "Grooming" },      desc: { el: "Γένια & styling",     en: "Beard & styling" },     price: "" },
      { icon: "droplet",  name: { el: "Λούσιμο μαλλιών", en: "Hair washing" },  desc: { el: "Πλήρης φροντίδα",     en: "Full care" },           price: "" },
      { icon: "bottle",   name: { el: "Beard oil",      en: "Beard oil" },     desc: { el: "Προϊόντα περιποίησης", en: "Grooming products" },   price: "" },
      { icon: "spray",    name: { el: "Hair gel",       en: "Hair gel" },      desc: { el: "Styling προϊόντα",    en: "Styling products" },    price: "" }
    ]
  },

  /* --- 9b. PRODUCTS WE USE -------------------------------------------------
     Shown below Services. Rename these and drop product-1.jpg … in the brand
     folder to show real photos (missing images → a clean box placeholder).   */
  products: {
    enabled: false,   // HIDDEN until real product names + photos are provided
                      // (was showing "Product 1/2/3" placeholders publicly).
    title: { el: "Προϊόντα που χρησιμοποιούμε", en: "Products we use" },
    items: [
      { name: { el: "Product 1", en: "Product 1" }, image: "product-1.jpg" },
      { name: { el: "Product 2", en: "Product 2" }, image: "product-2.jpg" },
      { name: { el: "Product 3", en: "Product 3" }, image: "product-3.jpg" }
    ]
  },

  /* --- 10. TEAM / EMPLOYEES ------------------------------------------------
     Staff photos resolve from brand.assetsDir using staff-1.jpg, etc.        */
  team: {
    enabled: false,   // HIDDEN until real staff names + photos are provided
                      // (was showing "Όνομα Επίθετο" + silhouette placeholders).
    title: { el: "Το προσωπικό μας", en: "Our staff" },
    // 👇 Replace names only; matching staff-1.jpg files are loaded automatically.
    members: [
      { name: { first: "Όνομα", last: "Επίθετο" }, role: { el: "Barber", en: "Barber" }, photo: "staff-1.jpg" },
      { name: { first: "Όνομα", last: "Επίθετο" }, role: { el: "Barber", en: "Barber" }, photo: "staff-2.jpg" },
      { name: { first: "Όνομα", last: "Επίθετο" }, role: { el: "Barber", en: "Barber" }, photo: "staff-3.jpg" }
    ]
  },

  /* --- 11. GALLERY ---------------------------------------------------------
     Images resolve from brand.assetsDir using gallery-1.jpg, etc.            */
  gallery: {
    enabled: true,
    title: { el: "Ο χώρος μας", en: "Our space" },
    images: [
      "gallery-1.jpg",
      "gallery-2.jpg",
      "gallery-3.jpg"
    ]
  },

  /* --- 12. REVIEWS / TESTIMONIALS -----------------------------------------
     Shown as a "reviews" section for business types whose blueprint includes
     it (barber, gym, restaurant…). `summary` is the headline rating badge.   */
  testimonials: {
    summary: { rating: "5.0", count: 117 },
    items: [
      {
        quote: { el: "Το καλύτερο κούρεμα που έχω κάνει. Αξίζει το ταξίδι από Θεσσαλονίκη.",
                 en: "The best haircut I've ever had. Worth the trip from Thessaloniki." },
        author: "Google review", rating: 5
      },
      {
        quote: { el: "Καθαρός χώρος, έμπειροι επαγγελματίες και άψογη εξυπηρέτηση.",
                 en: "Clean space, experienced professionals and flawless service." },
        author: "Google review", rating: 5
      },
      {
        quote: { el: "Πάντα ευγενικοί και προσεκτικοί. Τους συνιστώ ανεπιφύλακτα.",
                 en: "Always polite and attentive. I recommend them without reservation." },
        author: "Google review", rating: 5
      }
    ]
  },

  /* --- 13. SOCIAL LINKS ---------------------------------------------------- */
  social: {
    facebook:  "https://www.facebook.com/p/Straight-Razors-Co-100063091996934/?locale=el_GR",
    instagram: "https://www.instagram.com/straight_razors_co_2019/",
    tiktok:    "",
    website:   ""
  },

  /* --- 14. INSTAGRAM FEED (shows real posts IN the page) -------------------
     The section can display his posts three ways (checked in this order):

     (A) POSTS you list  → `posts: [...]`  ◀ INSTANT, NO SIGNUP, RECOMMENDED
         Paste a few post/reel links (open the post on Instagram → Share →
         Copy link). Each renders as a real, scrollable Instagram card right on
         the page. Downside: it shows the posts you list (doesn't auto-update).

     (B) AUTO-UPDATING GRID → `embedHtml: \`...\``  (free, ~2 min signup)
         Sign up at a widget provider, connect @straight_razors_co_2019, and
         paste the whole embed snippet between the backticks:
             • SnapWidget → https://snapwidget.com  (easiest — a plain <iframe>)
             • Behold → https://behold.so   • LightWidget → https://lightwidget.com
         Shows the latest posts automatically as he posts. Takes priority over (A).

     (C) Neither set → a "Follow on Instagram" button (still fully works).

     STORIES: Instagram does NOT allow stories to be embedded on any website
     (app/API-only, and they vanish in 24h). The Follow button opens his
     profile, where visitors see his stories natively at the top.              */
  instagram: {
    enabled:  true,
    handle:   "straight_razors_co_2019",
    url:      "https://www.instagram.com/straight_razors_co_2019/",

    /* ▶ AUTOMATED FEED (chosen route) — the barber never touches anything.
       The site fetches this JSON feed on every load, so it always shows his
       latest posts automatically. Set it up ONCE:
         1. Go to https://rss.app  → sign up (free).
         2. New Feed → paste his profile URL (the `url` above) → Generate.
         3. Open the feed → copy its **JSON Feed** URL
            (looks like  https://rss.app/feeds/v1.1/XXXXXXXX.json ).
         4. Paste that URL as `feedUrl` below.
       The feed must be CORS-enabled (rss.app is) so the browser can read it.
       If the feed is ever empty/down, the section auto-falls back to the
       Follow button. NOTE: this scrapes the public profile — it can break if
       the provider changes; and STORIES are NOT available through it (no
       website can embed stories). */
    feedUrl: "",
    limit:   12,   // how many posts to show

    // Fallbacks if feedUrl is empty:
    posts: [],      // paste specific post/reel links to show those instead
    embedHtml: ``   // or an official widget embed snippet (takes priority)
  }
};
