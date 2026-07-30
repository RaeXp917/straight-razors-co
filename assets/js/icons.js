/* ============================================================================
   ICONS  —  engine file. Clean line icons (stroke-based, inherit color).
   Reference any of these by NAME in config.js (e.g. icon: "scissors").
   You can still use an emoji or an image path instead — the engine falls back.
   ============================================================================ */

/* Each value is the INNER SVG markup; the engine wraps it in a sized <svg>. */
const ICONS = {
  /* --- contact / UI --- */
  phone:      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:       '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  pin:        '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock:      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  globe:      '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  image:      '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  store:      '<path d="m2 7 4.4-4.4A2 2 0 0 1 7.8 2h8.4a2 2 0 0 1 1.4.6L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20v3a2 2 0 0 1-3.5 1.3 2 2 0 0 1-3 0 2 2 0 0 1-3 0 2 2 0 0 1-3 0A2 2 0 0 1 2 10z"/>',
  scissors_ui:'<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',

  /* --- barber / salon services --- */
  scissors:   '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
  razor:      '<path d="M4 20 9 15"/><path d="M9 15 16 8a2.83 2.83 0 0 0-4-4l-7 7Z"/>',
  comb:       '<path d="M4 7h16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"/><path d="M7.5 12v5"/><path d="M12 12v5"/><path d="M16.5 12v5"/>',
  droplet:    '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 4 12 2c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7z"/>',
  bottle:     '<path d="M10 2h4v2.5l1.2 2.4A2 2 0 0 1 15.4 8H8.6a2 2 0 0 1 .2-1.1L10 4.5V2z"/><path d="M8.5 8v11a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8"/><path d="M8.5 13h7"/>',
  spray:      '<rect x="7" y="8" width="9" height="13" rx="2"/><path d="M10 8V5h3v3"/><path d="M16 5h2"/><path d="M16 3h2"/><path d="M11.5 12v3"/>',

  /* --- other business presets --- */
  utensils:   '<path d="M3 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  coffee:     '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
  dumbbell:   '<path d="M14.4 14.4 9.6 9.6"/><path d="M4.5 10 3 8.5 4.5 7 6 8.5"/><path d="m18 6 1.5 1.5L21 6l-1.5-1.5"/><path d="M6.5 6 3 9.5 5.5 12"/><path d="M17.5 18 21 14.5 18.5 12"/><path d="m6 18 1.5 1.5L9 18l-1.5-1.5"/><path d="m18 6-1.5-1.5L15 6l1.5 1.5"/>',
  sparkles:   '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',

  /* --- extra service / section glyphs --- */
  chevronLeft:  '<polyline points="15 18 9 12 15 6"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  box:        '<path d="M21 8V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>',
  user:       '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  check:      '<polyline points="20 6 9 17 4 12"/>',
  star:       '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  quote:      '<path d="M3 21c3 0 7-1 7-8V5H3v7h4c0 4-1 5-4 5v4zm11 0c3 0 7-1 7-8V5h-7v7h4c0 4-1 5-4 5v4z"/>',
  calendar:   '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  heart:      '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  bolt:       '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  cake:       '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s1.5-2 4-2 4 2 4 2 1.5-2 4-2 4 2 4 2"/><path d="M2 21h20"/><path d="M12 4v3"/><path d="M12 2h.01"/>',
  paw:        '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><circle cx="4" cy="11" r="2"/><path d="M12 10a4.5 4.5 0 0 0-4.3 3.2C7 15 5 16 5 18.5A2.5 2.5 0 0 0 7.5 21c1.4 0 2-.5 3.5-.5s2.1.5 3.5.5a2.5 2.5 0 0 0 2.5-2.5c0-2.5-2-3.5-2.7-5.3A4.5 4.5 0 0 0 12 10z"/>',
  bone:       '<path d="M17 10c1.7 0 3-1.3 3-3s-1.3-3-3-3c-1 0-1.8.5-2.3 1.2H9.3C8.8 4.5 8 4 7 4 5.3 4 4 5.3 4 7s1.3 3 3 3M7 14c-1.7 0-3 1.3-3 3s1.3 3 3 3c1 0 1.8-.5 2.3-1.2h5.4c.5.7 1.3 1.2 2.3 1.2 1.7 0 3-1.3 3-3s-1.3-3-3-3"/><path d="m8 8 8 8"/>',
  brush:      '<path d="M9.06 11.9 3.6 17.36a2.05 2.05 0 0 0 2.9 2.9l5.45-5.46"/><path d="M15 5 19 9"/><path d="M14 4c1-1 3-1 4 0s1 3 0 4l-6 6-4-4z"/>',
  palette:    '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20 2.5 2.5 0 0 0 2.5-2.5c0-.7-.3-1.3-.7-1.8-.4-.4-.6-1-.6-1.5A2.2 2.2 0 0 1 15.5 14H18a4 4 0 0 0 4-4 8 8 0 0 0-10-8z"/>',
  truck:      '<path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.3a1 1 0 0 0-.3-.7l-2.7-2.7a1 1 0 0 0-.7-.3H14v7h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',

  /* --- social (recognizable brand glyphs, drawn as strokes) --- */
  facebook:   '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram:  '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  tiktok:     '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>',
  whatsapp:   '<path d="M3 21l1.9-5.5a8.5 8.5 0 1 1 3.6 3.6L3 21z"/><path d="M9.5 9.5c0 3 2 5 5 5"/>',
  google:     '<path d="M21.35 11.1H12v3.2h5.35c-.25 1.6-1.9 4.7-5.35 4.7A5.9 5.9 0 0 1 6.1 12 5.9 5.9 0 0 1 12 6.1c1.7 0 2.8.7 3.45 1.3l2.35-2.3C16.4 3.7 14.4 2.9 12 2.9A9.1 9.1 0 0 0 2.9 12 9.1 9.1 0 0 0 12 21.1c5.25 0 8.7-3.7 8.7-8.9 0-.6-.06-1.05-.15-2.1z"/>'
};
