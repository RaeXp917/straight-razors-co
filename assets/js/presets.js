/* ============================================================================
   PRESETS + BLUEPRINTS + DEMO CONTENT + UI TRANSLATIONS  —  engine file.
   ----------------------------------------------------------------------------
   This is what makes the template TRULY dynamic. `businessType` in config.js is
   the ONE ALIAS you change. It selects a BLUEPRINT here, and a blueprint decides:
     • which sections exist and IN WHAT ORDER      (the `layout` array)
     • the default section titles / labels          (the `labels` map)
     • the default theme, hero CTA and logo icon
     • the DEMO CONTENT shown until a client fills in their own (`demo`)
   Change businessType → the whole website (structure + theme + content) changes.
   config.js only needs to OVERRIDE what a specific client wants different.
   ============================================================================ */

/* Static UI strings (buttons, nav, labels) in Greek & English. */
const UI_TEXT = {
  el: {
    nav_about:    "Σχετικά",
    nav_services: "Υπηρεσίες",
    nav_products: "Προϊόντα",
    nav_menu:     "Μενού",
    nav_plans:    "Πακέτα",
    nav_portfolio:"Δείγματα",
    nav_team:     "Ομάδα",
    nav_gallery:  "Χώρος",
    nav_reviews:  "Κριτικές",
    nav_contact:  "Επικοινωνία",
    nav_instagram:"Instagram",
    call:         "Καλέστε μας",
    whatsapp:     "WhatsApp",
    directions:   "Οδηγίες",
    hours:        "Ώρες λειτουργίας",
    findus:       "Μπορείτε να μας βρείτε ή να μας καλέσετε",
    phone:        "Τηλέφωνο",
    email:        "Email",
    address:      "Διεύθυνση",
    from:         "από",
    made_with:    "Φτιάχτηκε με",
    and_coffee:   "και καφέ",
    credit_by:    "από τον",
    rights:       "Με επιφύλαξη παντός δικαιώματος.",
    before:       "Πριν",
    after:        "Μετά",
    reviews_word: "κριτικές",
    reviews_attribution: "Αξιολόγηση Google",
    reviews_no_comment:  "Αξιολόγηση χωρίς γραπτό σχόλιο",
    reviews_more:        "Περισσότερα",
    reviews_less:        "Λιγότερα",
    reviews_filter_note: "Εμφανίζονται οι πιο πρόσφατες αξιολογήσεις με βαθμολογία 4★ ή 5★.",
    reviews_see_all:     "Δείτε όλες τις αξιολογήσεις στο Google",
    reviews_empty:       "Δεν υπάρχουν διαθέσιμες αξιολογήσεις αυτή τη στιγμή.",
    ig_follow:    "Ακολουθήστε μας στο Instagram",
    ig_subtitle:  "Δείτε τις τελευταίες δουλειές & τα stories μας"
  },
  en: {
    nav_about:    "About",
    nav_services: "Services",
    nav_products: "Products",
    nav_menu:     "Menu",
    nav_plans:    "Packages",
    nav_portfolio:"Work",
    nav_team:     "Team",
    nav_gallery:  "Space",
    nav_reviews:  "Reviews",
    nav_contact:  "Contact",
    nav_instagram:"Instagram",
    call:         "Call us",
    whatsapp:     "WhatsApp",
    directions:   "Directions",
    hours:        "Opening hours",
    findus:       "You can find us or call us",
    phone:        "Phone",
    email:        "Email",
    address:      "Address",
    from:         "from",
    made_with:    "Made with",
    and_coffee:   "and coffee",
    credit_by:    "by",
    rights:       "All rights reserved.",
    before:       "Before",
    after:        "After",
    reviews_word: "reviews",
    reviews_attribution: "Google review",
    reviews_no_comment:  "Rating without a written comment",
    reviews_more:        "More",
    reviews_less:        "Less",
    reviews_filter_note: "Showing the most recent reviews rated 4★ or 5★.",
    reviews_see_all:     "See all reviews on Google",
    reviews_empty:       "No reviews are available right now.",
    ig_follow:    "Follow us on Instagram",
    ig_subtitle:  "See our latest work & stories"
  }
};

/* Fallback section titles, used when neither the config nor the blueprint
   supplies one. Keyed by SECTION TYPE (see SECTION_RENDERERS in app.js).   */
const DEFAULT_LABELS = {
  about:        { el: "Σχετικά με εμάς",   en: "About us" },
  services:     { el: "Υπηρεσίες",          en: "Services" },
  products:     { el: "Τα προϊόντα μας",    en: "Our products" },
  menu:         { el: "Μενού",              en: "Menu" },
  plans:        { el: "Πακέτα",             en: "Packages" },
  portfolio:    { el: "Η δουλειά μας",      en: "Our work" },
  team:         { el: "Η ομάδα μας",        en: "Our team" },
  gallery:      { el: "Ο χώρος μας",        en: "Gallery" },
  testimonials: { el: "Τι λένε οι πελάτες", en: "What clients say" },
  booking:      { el: "Κλείσε το ραντεβού σου", en: "Book your appointment" },
  instagram:    { el: "Ακολουθήστε μας",     en: "Follow us" },
  priceList:    { el: "ΤΙΜΟΚΑΤΑΛΟΓΟΣ",       en: "Price list" },
  contact:      { el: "Επικοινωνία",        en: "Contact" }
};

/* Which section types show up in the top navigation, and their nav label key.
   (Sections not listed here — hero, booking — are reachable by scrolling.)   */
const NAV_SECTIONS = {
  about:        "nav_about",
  services:     "nav_services",
  products:     "nav_products",
  menu:         "nav_menu",
  plans:        "nav_plans",
  portfolio:    "nav_portfolio",
  team:         "nav_team",
  gallery:      "nav_gallery",
  testimonials: "nav_reviews",
  instagram:    "nav_instagram",
  contact:      "nav_contact"
};

/* ---- shared demo fragments (reused across several business types) ---- */
const demoTeam = (rEl, rEn) => ({
  members: [1, 2, 3].map((n) => ({
    name: { first: "Όνομα", last: "Επίθετο" }, role: { el: rEl, en: rEn }, photo: `staff-${n}.jpg`
  }))
});
const demoReviews = {
  summary: { rating: "5.0", count: 120 },
  items: [
    { quote: { el: "Εξαιρετική εξυπηρέτηση, θα ξαναπάω σίγουρα!", en: "Excellent service, I'll definitely be back!" }, author: "Google review", rating: 5 },
    { quote: { el: "Επαγγελματίες και ευγενικοί — τους συνιστώ ανεπιφύλακτα.", en: "Professional and friendly — highly recommend." }, author: "Google review", rating: 5 },
    { quote: { el: "Άψογη ποιότητα και περιβάλλον. Πολύ ευχαριστημένος!", en: "Flawless quality and atmosphere. Very happy!" }, author: "Google review", rating: 5 }
  ]
};

/* ============================================================================
   BLUEPRINTS  —  one per business type. `layout` = section order (the template
   structure). `demo` = the content shown out-of-the-box for that type, so
   setting ONLY businessType gives a complete site. config.js overrides `demo`.
   ============================================================================ */
const BUSINESS_PRESETS = {

  barber: {
    icon: "scissors",
    ctaText: { el: "Κλείσε ραντεβού", en: "Book an appointment" },
    // "Where you can find us" (contact) and the price list sit right below the
    // About section, per the client's request; the rest follows after.
    layout: ["hero", "about", "contact", "priceList", "services", "products", "team", "gallery", "instagram", "testimonials"],
    labels: {
      about:    { el: "Σχετικά με εμάς",  en: "About us" },
      products: { el: "Προϊόντα που χρησιμοποιούμε", en: "Products we use" },
      team:     { el: "Το προσωπικό μας", en: "Our barbers" },
      gallery:  { el: "Ο χώρος μας",      en: "Our shop" }
    },
    theme: { primary: "#f3eee4", accent: "#c9a227", accent2: "#8c6e1f", bg: "#0b0b0c", surface: "#161613", wood: "#b08d5b", dark: true },
    demo: {
      tagline: { el: "Κουρείο για άντρες & παιδιά", en: "Barber shop for men & kids" },
      about: { text: { el: "Επαγγελματικό κούρεμα, ξύρισμα και περιποίηση σε έναν καθαρό, φιλόξενο χώρο.", en: "Professional haircuts, shaves and grooming in a clean, welcoming space." } },
      services: { items: [
        { icon: "scissors", name: { el: "Κούρεμα", en: "Haircut" }, desc: { el: "Άντρες & παιδιά", en: "Men & kids" }, price: "€10" },
        { icon: "razor", name: { el: "Ξύρισμα", en: "Shave" }, desc: { el: "Παραδοσιακό ξυράφι", en: "Traditional razor" }, price: "€8" },
        { icon: "comb", name: { el: "Περιποίηση γενιών", en: "Beard grooming" }, desc: { el: "Styling & φινίρισμα", en: "Styling & finish" }, price: "€7" }
      ] },
      products: { items: [
        { name: { el: "Product 1", en: "Product 1" }, image: "product-1.jpg" },
        { name: { el: "Product 2", en: "Product 2" }, image: "product-2.jpg" },
        { name: { el: "Product 3", en: "Product 3" }, image: "product-3.jpg" }
      ] },
      team: demoTeam("Barber", "Barber"),
      testimonials: demoReviews
    }
  },

  hairsalon: {
    icon: "scissors",
    ctaText: { el: "Κλείσε ραντεβού", en: "Book an appointment" },
    layout: ["hero", "about", "services", "team", "booking", "gallery", "testimonials", "contact"],
    labels: {
      about:   { el: "Σχετικά με το κομμωτήριο", en: "About the salon" },
      team:    { el: "Οι stylists μας",          en: "Our stylists" },
      gallery: { el: "Ο χώρος μας",              en: "Our salon" }
    },
    theme: { primary: "#33252c", accent: "#c46f91", accent2: "#9b4d6d", bg: "#fff9fb", surface: "#f8edf2", wood: "#d9a6b8", dark: false },
    demo: {
      tagline: { el: "Σύγχρονο κομμωτήριο για κάθε στιλ", en: "Modern hair salon for every style" },
      about: { text: { el: "Κούρεμα, χρώμα και styling από έμπειρους stylists, με προϊόντα υψηλής ποιότητας.", en: "Cuts, color and styling by experienced stylists with premium products." } },
      services: { items: [
        { icon: "scissors", name: { el: "Κούρεμα & styling", en: "Cut & styling" }, desc: { el: "Γυναικείο & αντρικό", en: "Women & men" }, price: "€15" },
        { icon: "sparkles", name: { el: "Βαφή μαλλιών", en: "Hair color" }, desc: { el: "Μόνιμη & ανταύγειες", en: "Full & highlights" }, price: "€30" },
        { icon: "droplet", name: { el: "Θεραπείες μαλλιών", en: "Hair treatments" }, desc: { el: "Ενυδάτωση & αναδόμηση", en: "Repair & hydration" }, price: "€20" }
      ] },
      team: demoTeam("Stylist", "Stylist"),
      testimonials: demoReviews
    }
  },

  beauty: {
    icon: "sparkles",
    ctaText: { el: "Κλείσε ραντεβού", en: "Book now" },
    layout: ["hero", "about", "services", "portfolio", "testimonials", "booking", "contact"],
    labels: {
      about:     { el: "Η φιλοσοφία μας", en: "Our philosophy" },
      services:  { el: "Υπηρεσίες",        en: "Treatments" },
      portfolio: { el: "Η δουλειά μας",    en: "Our work" }
    },
    theme: { primary: "#322533", accent: "#a87cc1", accent2: "#805499", bg: "#fffaff", surface: "#f5edf8", wood: "#d7bee0", dark: false },
    demo: {
      tagline: { el: "Ομορφιά, φροντίδα και αυτοπεποίθηση", en: "Beauty, care and confidence" },
      about: { text: { el: "Ολοκληρωμένες υπηρεσίες αισθητικής με εξατομικευμένη φροντίδα για κάθε πελάτη.", en: "Complete beauty services with personalised care for every client." } },
      services: { items: [
        { icon: "sparkles", name: { el: "Περιποίηση προσώπου", en: "Facial treatment" }, desc: { el: "Καθαρισμός & λάμψη", en: "Cleanse & glow" }, price: "€35" },
        { icon: "droplet", name: { el: "Μανικιούρ / Πεντικιούρ", en: "Mani / Pedicure" }, desc: { el: "Ημιμόνιμο βερνίκι", en: "Gel polish" }, price: "€20" },
        { icon: "spray", name: { el: "Αποτρίχωση", en: "Waxing" }, desc: { el: "Πρόσωπο & σώμα", en: "Face & body" }, price: "€15" }
      ] },
      testimonials: demoReviews
    }
  },

  fastfood: {
    icon: "utensils",
    ctaText: { el: "Παράγγειλε τώρα", en: "Order now" },
    layout: ["hero", "menu", "about", "gallery", "contact"],
    labels: {
      about:   { el: "Η ιστορία μας", en: "Our story" },
      menu:    { el: "Το μενού μας",  en: "Our menu" },
      gallery: { el: "Ρίξε μια ματιά", en: "Take a look" }
    },
    theme: { primary: "#301610", accent: "#ed6a2e", accent2: "#b8401c", bg: "#fff8f2", surface: "#fff0e4", wood: "#e5b27d", dark: false },
    demo: {
      tagline: { el: "Φρέσκο, γρήγορο και νόστιμο", en: "Fresh, fast and tasty" },
      about: { text: { el: "Φτιάχνουμε καθημερινά με φρέσκα υλικά και αγάπη — γρήγορο σερβίρισμα, μεγάλη γεύση.", en: "Made daily with fresh ingredients and love — fast service, big flavour." } },
      menu: { categories: [
        { name: { el: "Burgers", en: "Burgers" }, items: [
          { name: { el: "Classic Burger", en: "Classic Burger" }, desc: { el: "Μοσχάρι, cheddar, σπιτική σος", en: "Beef, cheddar, house sauce" }, price: "€6.50" },
          { name: { el: "Chicken Burger", en: "Chicken Burger" }, desc: { el: "Τραγανό φιλέτο κοτόπουλο", en: "Crispy chicken fillet" }, price: "€6.00" }
        ] },
        { name: { el: "Σνακ & Ποτά", en: "Sides & Drinks" }, items: [
          { name: { el: "Τηγανητές πατάτες", en: "French fries" }, price: "€3.00" },
          { name: { el: "Αναψυκτικό", en: "Soft drink" }, price: "€2.00" }
        ] }
      ] }
    }
  },

  restaurant: {
    icon: "utensils",
    ctaText: { el: "Κάνε κράτηση", en: "Book a table" },
    layout: ["hero", "about", "menu", "gallery", "testimonials", "contact"],
    labels: {
      about: { el: "Η κουζίνα μας", en: "Our kitchen" },
      menu:  { el: "Ο κατάλογος",   en: "The menu" }
    },
    theme: { primary: "#f8eee0", accent: "#c58c4b", accent2: "#92652e", bg: "#201713", surface: "#2d211c", wood: "#a9784b", dark: true },
    demo: {
      tagline: { el: "Γεύσεις που αξίζει να θυμάσαι", en: "Flavours worth remembering" },
      about: { text: { el: "Παραδοσιακές συνταγές με φρέσκα, τοπικά υλικά, σε ζεστό περιβάλλον.", en: "Traditional recipes with fresh local ingredients in a warm setting." } },
      menu: { categories: [
        { name: { el: "Ορεκτικά", en: "Starters" }, items: [
          { name: { el: "Τυροκαυτερή", en: "Spicy cheese dip" }, price: "€4.50" },
          { name: { el: "Σαγανάκι", en: "Fried cheese" }, price: "€5.50" }
        ] },
        { name: { el: "Κυρίως πιάτα", en: "Main dishes" }, items: [
          { name: { el: "Μοσχάρι κοκκινιστό", en: "Beef in red sauce" }, desc: { el: "Με χειροποίητο πουρέ", en: "With handmade purée" }, price: "€12.50" },
          { name: { el: "Ψητό κοτόπουλο", en: "Grilled chicken" }, desc: { el: "Με λαχανικά εποχής", en: "With seasonal vegetables" }, price: "€10.50" }
        ] }
      ] },
      testimonials: demoReviews
    }
  },

  cafe: {
    icon: "coffee",
    ctaText: { el: "Δες τον κατάλογο", en: "View the menu" },
    layout: ["hero", "menu", "about", "gallery", "contact"],
    labels: {
      about: { el: "Το café μας", en: "Our cafe" },
      menu:  { el: "Κατάλογος",   en: "Menu" }
    },
    theme: { primary: "#35251c", accent: "#a56d42", accent2: "#754627", bg: "#fffaf3", surface: "#f5ede2", wood: "#d5b18d", dark: false },
    demo: {
      tagline: { el: "Καφές, γεύση και καλή παρέα", en: "Coffee, taste and good company" },
      about: { text: { el: "Εκλεκτός καφές, φρέσκα γλυκά και χαλαρή ατμόσφαιρα από το πρωί.", en: "Specialty coffee, fresh pastries and a relaxed vibe all day." } },
      menu: { categories: [
        { name: { el: "Καφές", en: "Coffee" }, items: [
          { name: { el: "Espresso", en: "Espresso" }, price: "€1.80" },
          { name: { el: "Cappuccino", en: "Cappuccino" }, price: "€2.80" },
          { name: { el: "Freddo", en: "Freddo" }, price: "€3.00" }
        ] },
        { name: { el: "Γλυκά", en: "Sweets" }, items: [
          { name: { el: "Cheesecake", en: "Cheesecake" }, price: "€4.50" },
          { name: { el: "Κρουασάν", en: "Croissant" }, price: "€2.50" }
        ] }
      ] }
    }
  },

  gym: {
    icon: "dumbbell",
    ctaText: { el: "Ξεκίνα σήμερα", en: "Start today" },
    layout: ["hero", "about", "plans", "services", "team", "testimonials", "contact"],
    labels: {
      about:    { el: "Ο τρόπος μας",       en: "Our approach" },
      plans:    { el: "Συνδρομές",          en: "Memberships" },
      services: { el: "Προγράμματα",        en: "Programs" },
      team:     { el: "Οι προπονητές μας",  en: "Our coaches" }
    },
    theme: { primary: "#eef5f1", accent: "#5bb77e", accent2: "#318b55", bg: "#101512", surface: "#19211c", wood: "#78a68a", dark: true },
    demo: {
      tagline: { el: "Δύναμη, ενέργεια και αποτελέσματα", en: "Strength, energy and results" },
      about: { text: { el: "Σύγχρονος εξοπλισμός και έμπειροι προπονητές που σε καθοδηγούν σε κάθε βήμα.", en: "Modern equipment and expert coaches guiding you every step of the way." } },
      plans: { items: [
        { name: { el: "Βασικό", en: "Basic" }, price: "€25", period: { el: "μήνα", en: "month" }, features: [{ el: "Πλήρης πρόσβαση", en: "Full gym access" }, { el: "Ντουλάπι", en: "Locker" }] },
        { name: { el: "Premium", en: "Premium" }, price: "€40", period: { el: "μήνα", en: "month" }, featured: true, features: [{ el: "Πρόσβαση 24/7", en: "24/7 access" }, { el: "Ομαδικά μαθήματα", en: "Group classes" }, { el: "1 personal training", en: "1 PT session" }] },
        { name: { el: "Ετήσιο", en: "Annual" }, price: "€300", period: { el: "έτος", en: "year" }, features: [{ el: "Όλα του Premium", en: "Everything in Premium" }, { el: "2 μήνες δώρο", en: "2 months free" }] }
      ] },
      services: { items: [
        { icon: "dumbbell", name: { el: "Personal training", en: "Personal training" }, desc: { el: "Εξατομικευμένο πρόγραμμα", en: "Tailored program" }, price: "" },
        { icon: "heart", name: { el: "Ομαδικά μαθήματα", en: "Group classes" }, desc: { el: "HIIT, yoga, spinning", en: "HIIT, yoga, spinning" }, price: "" },
        { icon: "bolt", name: { el: "Functional", en: "Functional" }, desc: { el: "Λειτουργική προπόνηση", en: "Functional training" }, price: "" }
      ] },
      team: demoTeam("Coach", "Coach"),
      testimonials: demoReviews
    }
  },

  generic: {
    icon: "store",
    ctaText: { el: "Επικοινώνησε μαζί μας", en: "Contact us" },
    layout: ["hero", "about", "services", "gallery", "contact"],
    labels: {},
    theme: { primary: "#202838", accent: "#4e7cf0", accent2: "#3157b8", bg: "#f7f9fc", surface: "#edf2fa", wood: "#a9badb", dark: false },
    demo: {
      tagline: { el: "Ποιότητα και εξυπηρέτηση που ξεχωρίζει", en: "Quality and service that stands out" },
      about: { text: { el: "Είμαστε δίπλα σας με αξιόπιστες υπηρεσίες και προσωπική φροντίδα.", en: "We're here for you with reliable services and personal care." } },
      services: { items: [
        { icon: "store", name: { el: "Υπηρεσία 1", en: "Service 1" }, desc: { el: "Περιγραφή υπηρεσίας", en: "Service description" }, price: "" },
        { icon: "star", name: { el: "Υπηρεσία 2", en: "Service 2" }, desc: { el: "Περιγραφή υπηρεσίας", en: "Service description" }, price: "" },
        { icon: "phone", name: { el: "Υπηρεσία 3", en: "Service 3" }, desc: { el: "Περιγραφή υπηρεσίας", en: "Service description" }, price: "" }
      ] }
    }
  }
};
