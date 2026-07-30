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
  showNav: false,   // hide the top nav menu (links + ☰) — short one-scroll ad site

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
    ctaText: { el: "Καλέστε μας", en: "Call us" }
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
    // Mirrors the ΤΙΜΟΚΑΤΑΛΟΓΟΣ (price list) below, with prices shown on each
    // card. Keep the two in sync when prices change. (0.00€ = placeholders.)
    items: [
      { icon: "scissors", name: { el: "Κούρεμα Ανδρικό", en: "Men's Haircut" },  price: "0.00€" },
      { icon: "scissors", name: { el: "Κούρεμα Παιδικό", en: "Kids' Haircut" },  price: "0.00€" },
      { icon: "razor",    name: { el: "Τριμάρισμα Γενιού με Ξυράφι", en: "Beard Trim with Razor" }, price: "0.00€" },
      { icon: "spray",    name: { el: "Αποτρίχωση Αυτιά - Μύτη με Κερί", en: "Ear & Nose Waxing" }, price: "0.00€" },
      { icon: "razor",    name: { el: "Ξύρισμα Αγγλικού Τύπου", en: "English Shave" }, desc: { el: "Παραδοσιακό με Φαλτσέτα", en: "Traditional straight razor" }, price: "15.00€" },
      { icon: "sparkles", name: { el: "Μάσκα Νεκράς Θάλασσας", en: "Dead Sea Mask" }, desc: { el: "Ενυδάτωση & θρέψη επιδερμίδας", en: "Hydrates & nourishes skin" }, price: "5.00€" },
      { icon: "droplet",  name: { el: "Το Δεύτερο Λούσιμο", en: "The Second Wash" }, price: "2.00€" },
      { icon: "star",     name: { el: "Γαμπριάτικο Πακέτο", en: "Groom's Package" }, desc: { el: "Όλο το πακέτο σε 2 ραντεβού", en: "Full package over 2 appointments" }, price: "50.00€" }
    ]
  },

  /* --- 9b. PRODUCTS WE USE -------------------------------------------------
     Shown below Services. Rename these and drop product-1.jpg … in the brand
     folder to show real photos (missing images → a clean box placeholder).   */
  products: {
    enabled: true,
    title: { el: "Προϊόντα που χρησιμοποιούμε", en: "Products we use" },
    // Brands the shop uses. Each shows the brand NAME as a simple wordmark
    // (not their logo artwork — that keeps it legal/commercial-safe) and links
    // to the brand's official website. Add a `price`/`image` if you ever want a
    // specific product card instead.
    items: [
      { name: { el: "Joker Barber", en: "Joker Barber" },
        desc: { el: "Ιταλικά προϊόντα styling & ξυρίσματος", en: "Italian styling & shaving products" },
        url: "https://jokerbarber.com" },
      { name: { el: "TRINITY Haircare", en: "TRINITY Haircare" },
        desc: { el: "Επαγγελματική περιποίηση μαλλιών", en: "Professional hair care" },
        url: "https://trinityhaircare.gr" },
      { name: { el: "Tailor's Grooming", en: "Tailor's Grooming" },
        desc: { el: "Ανδρική περιποίηση & styling", en: "Men's grooming & styling" },
        url: "https://tailorsgrooming.eu" },
      { name: { el: "Arren Men's Grooming", en: "Arren Men's Grooming" },
        desc: { el: "Grooming για τον σύγχρονο άντρα", en: "Grooming for the modern man" },
        url: "https://www.arrenmensgrooming.gr" }
    ]
  },

  /* --- 10. TEAM / EMPLOYEES ------------------------------------------------
     Real staff. Photos use explicit paths in assets/img/ (full paths are used
     as-is). Tasos' photo is a temporary stand-in until his own PNG arrives —
     just replace assets/img/tasos.png with the real one, same filename.       */
  team: {
    enabled: true,
    title: { el: "Το προσωπικό μας", en: "Our staff" },
    members: [
      { name: { first: "Sakis", last: "Pliaxas" },
        role: { el: "Ιδιοκτήτης – Κουρέας", en: "Owner Barber" },
        photo: "assets/img/sakis.png",
        instagram: "https://www.instagram.com/straight_razors_co_2019/" },
      { name: { first: "Tasos", last: "Mpourakou" },
        role: { el: "Κουρέας", en: "Employee Barber" },
        photo: "assets/img/tasos.png",
        // Points to the shop profile until Tasos' own Instagram handle is known.
        instagram: "https://www.instagram.com/straight_razors_co_2019/" }
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
    url:      "https://www.instagram.com/straight_razors_co_2019/?hl=el",
    title:    { el: "Οι δουλειές μας στο Instagram", en: "Our work on Instagram" },
    subtitle: { el: "Δείτε μερικές από τις τελευταίες δουλειές μας",
                en: "See some of our latest work" },
    ctaText:  { el: "Δείτε ολόκληρο το προφίλ στο Instagram",
                en: "See the full profile on Instagram" },

    /* Six real posts rendered ON the page as a gallery, via Instagram's OFFICIAL
       embed (embed.js). No API, no scraping, no rehosting — just the permalinks.
       Open a post → Share → Copy link to add/replace any of these. */
    posts: [
      "https://www.instagram.com/reel/DRO0BxoCLad/",
      "https://www.instagram.com/reel/DCpc2yesPtS/",
      "https://www.instagram.com/p/DQRqzggiC4P/",
      "https://www.instagram.com/p/ClpAKyjsWm6/",
      "https://www.instagram.com/p/CgtgxLjsOqc/",
      "https://www.instagram.com/reel/DNaeJ0kMQ1W/"
    ]
  },

  /* --- 15. PRICE LIST (ΤΙΜΟΚΑΤΑΛΟΓΟΣ) — shown after the store hours ---------
     Brand logo on the left, the priced list on the right. Prices are free text
     ("15.00€", "από 10€", …). An item with a nested `items:[]` becomes a group
     heading with indented sub-rows (e.g. the SPA package). The 0.00€ values are
     placeholders from your example — replace with the real prices anytime.    */
  priceList: {
    enabled: true,
    title: { el: "ΤΙΜΟΚΑΤΑΛΟΓΟΣ", en: "PRICE LIST" },
    logo: "logo.png",   // resolved from brand.assetsDir (the crest already in use)
    items: [
      { name: { el: "Κούρεμα Ανδρικό", en: "Men's Haircut" },              price: "0.00€" },
      { name: { el: "Κούρεμα Παιδικό", en: "Kids' Haircut" },              price: "0.00€" },
      { name: { el: "Τριμάρισμα Γενιού με Ξυράφι", en: "Beard Trim with Razor" }, price: "0.00€" },
      { name: { el: "Αποτρίχωση Αυτιά - Μύτη με Κερί", en: "Ear & Nose Waxing" }, price: "0.00€" },
      { name: { el: "Ξύρισμα Αγγλικού Τύπου (Παραδοσιακό με Φαλτσέτα)", en: "English Shave (traditional straight razor)" }, price: "15.00€" },
      { name: { el: "Περιποίηση SPA", en: "SPA Treatment" }, items: [
        { name: { el: "Μάσκα Νεκράς Θάλασσας (Ενυδατώνει & Θρέφει την Επιδερμίδα)", en: "Dead Sea Mask (hydrates & nourishes the skin)" }, price: "5.00€" },
        { name: { el: "Το Δεύτερο Λούσιμο", en: "The Second Wash" },        price: "2.00€" }
      ] },
      // Package: the 50€ covers everything below (sub-items shown without a
      // per-item price on purpose — they're included, not free).
      { name: { el: "Γαμπριάτικο Πακέτο", en: "Groom's Package" }, price: "50.00€",
        note: { el: "Όλο το πακέτο σε 2 ραντεβού", en: "The whole package over 2 appointments" },
        items: [
          { name: { el: "Κούρεμα", en: "Haircut" } },
          { name: { el: "Ξύρισμα", en: "Shave" } },
          { name: { el: "Περιποίηση Γενειάδας", en: "Beard grooming" } },
          { name: { el: "Αποτρίχωση με Κερί", en: "Waxing" } },
          { name: { el: "Μάσκα Προσώπου Ενυδάτωσης", en: "Moisturizing face mask" } },
          { name: { el: "Καθαρισμός Αυχένα", en: "Nape cleanup" } }
        ] }
    ]
  }
};
