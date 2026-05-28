# photospace.studio — Content Inventory (for consolidation into photospacedenver.com)

> **Purpose:** Faithful inventory of everything valuable on **photospace.studio** (the studio-space-rental sister site of PhotoSpace Denver) so it can be merged into the photospacedenver.com rebuild.
> **Audited:** 2026-05-28 (via WebFetch + raw HTML parse + Playwright render of the booking scheduler).
> **Same physical location/owner as PhotoSpace Denver:** 209 Kalamath St, Unit One, Denver CO 80223 · (303) 284-6057 · founded 2008 · owner Dan Jahn.
> **Tech:** Next.js site (App Router; `/_next/` assets, `generator: Next.js`). Two real routes only: `/` (one-page homepage) and `/apply` (native multi-step membership application). Booking is an embedded **Acuity Scheduling** iframe.

---

## KEY FACTS (quick reference)

**NAP**
- **Name:** photospace (alternate: "PhotoSpace Studio")
- **Address:** 209 Kalamath St, Unit 1, Denver, CO 80223 (Sun Valley neighborhood; just off I-25, minutes from downtown)
- **Phone:** 303.284.6057 (`tel:+13032846057`)
- **Email:** hello@photospace.studio
- **Hours:** 24/7 access (schema: open 00:00–23:59, all 7 days)
- **Founded:** 2008
- **Geo (schema):** lat 39.7339, lng -105.0096
- **Instagram:** https://instagram.com/photospacestudio

**Space:** 2,400 ft² total purpose-built; 1,900 ft² shooting floor; real cyclorama; custom-built from the ground up (not a converted warehouse).

**Pricing — as marketed on homepage (simplified):**
| Tier | Block | Price | Notes |
|---|---|---|---|
| Hourly | per hour | **$100/hr** | 2-hour minimum · same rate 24/7 (no evening/weekend surcharge) |
| Half Day | 5 hours | **$485** | "Most booked" — editorial, lookbook, product |
| Full Day | 10 hours | **$925** | Full takeover for campaigns / multi-look productions |

**Pricing — actual Acuity booking ladder (live, more granular — see full table below):** $100/hr scaling, with full-day capped at $925 for 10–12 hours. Studio Tour is free (20 min).

**Membership tiers (monthly):**
| Tier | Hours/mo | Price/mo | Effective $/hr* | Positioning |
|---|---|---|---|---|
| **Spark** | 5 | **$425** | $85/hr | "Perfect for starting out" |
| **Creator** | 10 | **$895** | $89.50/hr | "Best balance" / "Most popular" |
| **Visionary** | 20 | **$1,495** | $74.75/hr | "Maximum access" |
> *Effective $/hr is computed (not stated on site). All tiers: 24/7 private access + everything in standard rental + more Profoto strobes, more LED kits, modifiers, discounted cameras/lenses & premium add-ons. **No explicit minimum-commitment or contract length is stated on the site** (framed only as "three commitment levels"). See Unknowns.

**Where Book / Apply actually go:**
- **Book Now / Book a session / Book hourly/half/full day / Book a tour** → scroll/anchor to an **embedded Acuity Scheduling iframe** on the homepage. Iframe src: `https://app.acuityscheduling.com/schedule.php?owner=20797727&ref=embedded_csp` (canonical scheduler resolves to `https://app.acuityscheduling.com/schedule/3ce2128a`). **Platform: Acuity Scheduling (Squarespace), owner ID 20797727.**
- **Apply / Apply for membership / Apply Now** → `/apply` (native 4-step in-app application: Information → Agreement → Signature → Payment). **NOT** an external form.
- The old URL `…/membership-application-photospace/` (404) is dead; the real application is `/apply`.

---

## PAGE METADATA

- **`<title>`:** `photospace — Denver's Premier Photo & Video Studio Rental`
- **Meta description:** "Denver's fully equipped photo and video studio rental — 2,400 ft² with real cyclorama, pro lighting and grip, tether station, 24/7 access, and on-call assistance. Custom-built for photographers, videographers, content creators, and commercial productions since 2008."
- **theme-color:** `#F6F4EF` (warm off-white/paper)
- **application-name / author:** photospace
- **keywords:** photo studio rental Denver, video studio rental Denver, Denver photography studio, Denver video production studio, commercial photo studio Denver, content studio Denver, cyclorama studio Denver, Denver studio with lighting, fully equipped photo studio Denver, photography studio membership Denver, photospace, photospace studio
- **robots:** index, follow · **googlebot:** index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1
- **category:** photography

**Open Graph:**
- og:title: `photospace — Denver's Premier Photo & Video Studio Rental`
- og:description: "Custom-built 2,400 ft² photo and video studio rental in Denver. Real cyclorama, pro gear included, 24/7 access. Trusted by national brands since 2008."
- og:url: `https://www.photospace.studio`
- og:site_name: photospace · og:locale: en_US · og:type: website
- og:image: `https://www.photospace.studio/opengraph-image?a52543bf080a6205` (1200×630, image/png; dynamically generated)
- og:image:alt: "photospace — Where Creativity Finds Its Space"

**Twitter:**
- twitter:card: summary_large_image
- twitter:title: `photospace — Denver's Premier Photo & Video Studio Rental`
- twitter:description: "Custom-built 2,400 ft² photo and video studio in Denver. Cyclorama, pro lighting and grip, 24/7 access."
- twitter:image: same as og:image

---

## STRUCTURED DATA / JSON-LD (9 blocks present — strong SEO asset to preserve)

1. **Organization** (`#organization`): name photospace, alternateName "PhotoSpace Studio", logo `/images/cropped-android-chrome-512x512-1.png`, email, telephone, foundingDate 2008, sameAs Instagram, full PostalAddress.
2. **WebSite** (`#website`): publisher → Organization, inLanguage en-US.
3. **LocalBusiness + ProfessionalService** (`#business`): full description, image array, priceRange `$$`, currenciesAccepted USD, paymentAccepted "Credit Card, Debit Card", PostalAddress, GeoCoordinates, openingHoursSpecification (24/7), foundingDate, areaServed Denver + Colorado (with Wikidata sameAs), parentOrganization → Organization.
   - **amenityFeature** (12): 1,900 ft² shooting floor · Real cyclorama · Strobe + continuous LED lighting · Modifiers and grip · Tether station (Capture One, Lightroom, Phocus) · Lounge with second monitor for art directors · Working kitchen · Make-up station and changing room · Outdoor deck · Free parking · Load-in ramp · 24/7 access.
   - **makesOffer** (6): Hourly $100, Half Day $485, Full Day $925, Spark $425/MONTH, Creator $895/MONTH, Visionary $1495/MONTH (memberships link to `/apply`).
   - **hasOfferCatalog:** "Studio rentals and memberships" listing the 6 offers.
4. **FAQPage** (`#faq`): 12 Q&A pairs (full answers below).
5. **Service:** Photo studio rental in Denver.
6. **Service:** Video studio rental in Denver.
7. **Service:** Commercial photography studio rental.
8. **Service:** Content creation studio rental.
9. **Service:** Studio memberships.

> All Services reference provider `#business` and areaServed Denver.

---

## NAVIGATION & FOOTER LINKS (all hrefs found)

**Top nav:** Studio → `#story` · Pricing → `#pricing` · Memberships → `#memberships` · Visit → `#location` · **Book Now** (button, scrolls to Acuity booking section). Logo → `/`.

**All hrefs on homepage:**
- `/` (logo)
- `#story`, `#pricing`, `#memberships`, `#location` (in-page anchors)
- `/apply` (membership application — multiple CTAs)
- `tel:+13032846057`
- `mailto:hello@photospace.studio`
- `https://www.google.com/maps/dir/?api=1&destination=209%20Kalamath%20St%2C%20Denver%2C%20CO%2080223` (Get directions)
- Embedded iframe: `https://app.acuityscheduling.com/schedule.php?owner=20797727&ref=embedded_csp`
- (preconnect/dns-prefetch: `app.acuityscheduling.com`, `embed.acuityscheduling.com`, `maps.googleapis.com`, `www.google.com`)

**Footer:** Company line "Denver's purpose-built photo and video studio since 2008. Pro gear, 24/7 access, and a team that knows the work." · Visit: 209 Kalamath St, Unit 1, Denver, CO 80223 · Connect: 303.284.6057, hello@photospace.studio · "Apply for membership" → `/apply` · "© 2026 photospace. All rights reserved." · "Where Creativity Finds Its Space — Denver, Colorado."

---

## FULL COPY (verbatim, in page order) — captures brand voice

### Hero
- Rotating ticker: **"Where Creativity Finds Its Space ◆ Denver · since 2008 ◆ Pro gear included ◆ 24/7 access"**
- Top context line: "Denver, Colorado · 209 Kalamath St · Est. 2008 · 24/7 Access · Pro gear included"
- Lead: **"photospace — Denver's fully equipped photo and video studio rental, in Sun Valley since 2008."**
- Headline: **"photospace. Where Creativity Finds Its Space"**
- Three feature blurbs:
  - **Stage** — "1,900 ft² of light, with cyc, individual controllable blinds on giant windows, and a dedicated tether station."
  - **Gear** — "Studio rental includes a selection of strobe, continuous LED, modifiers, and grip — all included. Phase One, Profoto, premium kits available on-site as add-ons."
  - **Out back** — "Outdoor deck, load-in ramp, and free parking."
- CTA: "Book a session"

### The Space — "A Denver original"
- **"This is not a converted warehouse."**
- "photospace was custom-built from the ground up by professional photographers and videographers — designed to capture your best work with unmatched comfort and creative flexibility."
- "Est. 2008 · 2,400 ft² purpose-built" · label "Custom-designed"
- Amenity ticker: 1,900 ft² Shooting Floor ◆ Lounge w/ Monitor to Tether Station ◆ Outdoor Deck ◆ Make-up Station ◆ Changing Room ◆ Massive Grip & Gear Collection ◆ Tether Station (CaptureOne, Lightroom, Phocus) ◆ Strobe + Continuous Lighting ◆ Free Parking & Load-in Ramp

### "Inside the studio" — Four Frames
- Intro: "Four frames of what you get when you walk in. Scroll to read the whole story."
- **Frame I · The Stage — "1,900 ft² of light."** "A real cyclorama. Individual controllable blinds on giant windows. A floor that's been swept, mopped, and re-painted between every campaign. No mystery cables, no broken outlets, no excuses."
- **Frame II · The Entry — "A bookshop before a shoot."** "Hand-scraped teak treads, steel railings, leather chairs, and a curated library of editorial references — design monographs, photo books, magazines your art director will recognize. The first room every visitor walks through, and where the day starts to feel like a campaign."
- **Frame III · The Lounge — "Where the conversation happens."** "A sofa that clients want to sit on. A second monitor at the tether station for art directors. Espresso that's better than fine. The studio that turns a six-hour shoot from a marathon into a conversation."
- **Frame IV · The Building — "Yours, midnight or sunrise."** "209 Kalamath St, Unit 1. Free parking, a load-in ramp, an outdoor deck, and a real kitchen. Easy in, easy out, midnight or sunrise — the studio is yours when the work is."

### "Built for the work" — Your vision, unlimited
- "From a 30-minute headshot to a three-day campaign — if you can imagine it, the studio scales to fit. A few of the formats that walk in most:"
- **01 — Editorial & Brand · "Campaigns, lookbooks, agency days."** "The studio scales from a single-subject portrait to a full agency takeover. Cyc wall, modifier wall, full grip cart, tether station calibrated to your bay."
- **02 — Motion & Film · "YouTube, brand films, BTS."** "Aputure continuous, monitor lounge for clients, real sound dampening, and a kitchen for craft service. Sets that hold up under a 12-hour day."
- **03 — Product & Food · "Tabletop, flat-lay, lifestyle stills."** "Real water, real prep, real coffee. The kitchen isn't a kitchen-themed set piece — it's a working kitchen used by food stylists every week."

### "From the archive" — Shot here
- "A small sample of the campaigns, editorials, and shoots booked, lit, and shot on this floor." / "And every one of them was shot at photospace." (7-frame gallery)

### "An invitation" — Room to dream. Gear to create.
- "Pick the time. Walk in ready. Leave with the work done." · CTAs: Book Now / See pricing · "209 Kalamath St · Denver"
- "Trusted by top creators in Denver & beyond." (intro to logo wall)

### Pricing section — "Tariff: Simple pricing. Nothing hidden."
- "No setup fees. No equipment surcharges. The number you see is the number you pay."
- (cards: Hourly $100 "2 hour minimum · same rate 24/7" → "Book hourly →"; Half Day $485 5 hours "Most booked" / "Most popular for editorial, lookbook, and product" → "Book half day →"; Full Day $925 10 hours "Full takeover for campaigns and multi-look productions" → "Book full day →")
- Footnote: **"Need something different? Half-day after-hours, multi-day campaigns, and member rates — just ask."**

### Memberships — "Studio memberships: Create more. Pay less."
- "Three commitment levels, designed around how you actually shoot."
- **Spark — 5 Hours per month — $425/mo** — "Perfect for starting out. Spark gives you flexible hours to ignite projects and feed your creative soul." → Apply Now
- **Creator — 10 Hours per month — $895/mo** — badge "Best balance" — "Double your creative time and boost your output. Ideal for consistent creators and growing influencers." → Apply Now
- **Visionary — 20 Hours per month — $1,495/mo** — "Maximum access. Designed for ambitious professionals who need ample time and total creative freedom." → Apply Now
- **"Everything in a standard rental, plus":** 24/7 private access · More strobe lights (Profoto) · More LED kits · Tons of lighting modifiers · Discounted cameras & lenses
- **Cameras + Lenses (Add-on):** "Canon · Nikon · Phase One · Blackmagic · Sony · Sigma · Fuji · and more" — "Premium camera and lens kits are available on-site as add-ons. Members get them at a discounted rate." · Phase One XF IQ4 150MP · Profoto B1X/B10XPlus/D2/Pro8a kits · Premium Canon, Nikon, Sony, Fuji bodies + lens kits · Continuous lighting upgrades · On-call assistants and digital techs
- "Tether-ready · CaptureOne · Lightroom · Phocus"

### "How it works" — Three steps from click to created
- "Designed so you can be set up, lit, and shooting within fifteen minutes of walking in."
- **Step 1 · Book or Apply** — "Reserve a single session or apply for a membership in under a minute."
- **Step 2 · Shoot Your Vision** — "Walk in, plug in, and create. Grip, lighting, and tether station are ready for you."
- **Step 3 · Elevate and Repeat** — "Save your favorites, refine your kit, and build a creative habit that pays off." ("Then do it again")

### Visit — "Come visit: Let's Create."
- "Want to see the studio before you book? Stop by, take a tour, and meet the team."
- Studio: 209 Kalamath St, Unit 1, Denver, CO 80223 · Call 303.284.6057 · CTAs: "Book a tour" / "Get directions"
- Closing CTA band — "The studio is open: Pick a day. Make the work." — "The lights are on. The cyc is clean. The espresso is hot. Reserve your time and walk in ready." · CTAs: "Book a session →" / "Apply for membership"
- "209 Kalamath St · Unit 1 · Denver · 24/7 access · pro gear included · Available tonight"

### Booking band — "Book Appointment: Reserve the studio in under a minute."
- "Pick a date, pick a time, lock it in. No back-and-forth." · label "Live availability" → embedded Acuity iframe.

---

## STUDIO SPECS & AMENITIES (consolidated)

- **Total size:** 2,400 ft² purpose-built (est. 2008)
- **Shooting floor:** 1,900 ft²
- **Cyclorama:** real/permanent cyc wall (repeatedly emphasized "not ¼″ plywood")
- **Windows/daylight:** giant windows with **individually controllable blinds** (add/remove ambient light)
- **Tether station:** dedicated; runs **Capture One, Lightroom, Phocus**; second monitor in lounge for art directors
- **Lounge:** sofa, monitor to tether station, espresso
- **Entry room:** hand-scraped teak treads, steel railings, leather chairs, curated editorial reference library (design monographs, photo books, magazines)
- **Make-up station + changing room**
- **Kitchen:** real working kitchen (used by food stylists), real prep/water/coffee
- **Sound:** real sound dampening
- **Out back:** outdoor deck, load-in ramp, free parking
- **Other:** upstairs loft (mentioned in a testimonial); floor swept/mopped/re-painted between campaigns
- **Access:** 24/7 private access (members)

---

## GEAR

**Included with every rental (no surcharge):** strobe lighting, continuous LED lighting, modifiers, grip. Tether station (Capture One / Lightroom / Phocus).

**Premium add-ons (on-site, member-friendly / discounted rates):**
- **Phase One XF IQ4 150MP** (medium format)
- **Profoto** kits: **B1X, B10X Plus, D2, Pro8a**
- **Aputure** continuous lighting (called out for motion/film)
- Premium **Canon / Nikon / Sony / Fuji** bodies + lens kits
- **Sigma** lenses
- **Blackmagic** cameras
- Continuous lighting upgrades
- On-call **assistants and digital techs**

---

## ACUITY BOOKING — full appointment menu (rendered via Playwright, live)

Business: photospace · Scheduler: `https://app.acuityscheduling.com/schedule/3ce2128a` (owner 20797727)

| Appointment | Duration | Price |
|---|---|---|
| **Studio Tour (free)** | 20 minutes | Free |
| 2 Hours | 2 hrs | $200.00 |
| 3 Hours | 3 hrs | $295.00 |
| 4 Hours | 4 hrs | $390.00 |
| 5 Hours (halfday) | 5 hrs | $485.00 |
| 6 Hours | 6 hrs | $575.00 |
| 7 Hours | 7 hrs | $665.00 |
| 8 Hours | 8 hrs | $755.00 |
| 9 Hours | 9 hrs | $840.00 |
| 10 Hours (full day) | 10 hrs | $925.00 |
| 11 Hours (full day) | 11 hrs | $925.00 |
| 12 Hours (full day) | 12 hrs | $925.00 |

> Category header in Acuity: "studio rentals". The 2-hour minimum and the full-day cap ($925 covers 10–12 hrs) are enforced here. Effective rate steps roughly $90–$100/hr in the mid-range; hits ~$92.50/hr at 10 hrs and lower at 11–12 hrs.

---

## TESTIMONIALS (11 total, all attributed — reusable)

> One is flagged "Featured · 5.0★ · Verified" (Ellen Stark). Note: **Lincoln Phillips and Paul Trantow have identical quote text** ("Beautiful agency-quality studio. Dan is regularly updating…") — likely a duplication to verify before reuse.

1. **Ellen Stark — Marketing Director, Denver Botanic Gardens** (Featured · 5.0★ · Verified): "Photospace is an amazing facility for professional photography. Not only is the equipment state-of-the-art but the space is beautifully designed and inspiring."
2. **Drew C. — Photographer:** "Love the space — it's truly the only professional photo studio available to creatives in Denver. An insane amount of equipment, a real CYC wall (not made of ¼″ plywood), and fully controllable curtains for adding or removing ambient light. It's also cheaper than most places. Using this space has made me a better photographer."
3. **Lincoln Phillips — Photographer · Educator:** "Beautiful agency-quality studio. Dan is regularly updating not just his cameras, but his computing and grip equipment as well. Excellent shooting area, comfortable client area, great kitchen."
4. **Matt Nager — Advertising & Editorial Photographer:** "I worked with photospace for a two-day photo shoot and everything was great. The gear, atmosphere, and studio space are top notch and will be my go-to location for studio shoots in the future. Highly recommended for your photo and video shoots."
5. **Gretchen Sherlock — Commercial Photographer:** "Great atmosphere, excellent natural light. Areas to work and relax."
6. **Michael Bielecki — Photographer + Videographer:** "Excellent studio atmosphere with all the latest and greatest in top-end professional camera gear, lighting, and grip equipment, all in a huge state-of-the-art environment. Private closed-studio sessions are a fantastic way to wow your clients. Did a video shoot here and it was great to have the full kitchen, upstairs loft, and plenty of space for clients and models to move around."
7. **Peter Horton — Telideo Productions:** "photospace has been our go-to studio for several years now. Dan, and company, are great and I highly recommend the studio. It offers both a great place to shoot and is extremely comfortable — which is a plus for our clients, and us."
8. **Andrew Cope — Andrew Luther Cope Photography:** "This is a fantastic space for creatives in both photography and videography. Meeting Dan and John has been one of the pivotal moments in my photography — being exposed to the equipment, jargon, and environment that the studio provides has allowed me to level up immensely. It is Denver's only REAL photography studio available to the public, where the wall, equipment, and set-up match a true professional environment."
9. **Paul Trantow — Altitude Arts Photographics:** "Beautiful agency-quality studio. Dan is regularly updating not just his cameras, but his computing and grip equipment as well. Excellent shooting area, comfortable client area, great kitchen." *(duplicate of #3 — verify)*
10. **Liz Long — Aspen Productions:** "Excellent resource for photo gear for not only Denver but all of Colorado. Dan is always unbelievably helpful and wonderful to work with. Can't recommend him more."
11. **Peter Yang — Photographer:** "I LOVE this studio!"

> Team names surfaced in testimonials: **Dan** (owner) and **John**.

---

## CLIENT / BRAND LOGOS (19 — logo wall "Trusted by top creators in Denver & beyond")

Under Armour · Swell · Oakley · Nike · Marie Claire · New Balance · Amazon · Allstate · Denver Broncos · Fruit of the Loom · RH · Buckle · EZ PZ · Garty Land · Glo · Integer · Jiberish · Mitch · Staudinger Franke

> Logo asset filenames (all `/images/*-logo-180px.webp` or similar): under-armour, swell, oakley, nike-180px, marie-claire, new-balance, amazon, allstate, denver-broncos, fruit-of-the-loom, rh, buckle, ez-pz, garty-land, glo, integer, jiberish, mitch, staudinger-franke.
> FAQ also explicitly names brand usage: "Nike, Under Armour, Oakley, New Balance, Amazon, Allstate, RH, the Denver Broncos, and Marie Claire."

---

## FAQ (12 Q&A — full answers from JSON-LD; reusable copy)

1. **Can I rent a photo studio in Denver by the hour?** "Yes. Hourly rentals at photospace are $100/hour with a two-hour minimum, the same rate 24/7 — no evening or weekend surcharge. Half-day (5 hours, $485) and full-day (10 hours, $925) blocks are available for longer productions, and recurring shoots can move onto a monthly membership at member rates."
2. **Can I rent a video studio in Denver?** "Yes. The shooting floor is built for video as well as photo — continuous LED lighting, real sound dampening, a working cyclorama, a monitor lounge for clients and art directors, and a full kitchen for craft service. Most productions use a mix of their own camera package with our lighting, grip, and tether station."
3. **What equipment is included with a photospace studio rental?** "Every booking includes the full 2,400 ft² space, 1,900 ft² shooting floor, real cyclorama, strobe and continuous LED lighting, modifiers, grip, tether station (Capture One, Lightroom, Phocus), kitchen, make-up station, changing room, outdoor deck, free parking, and load-in ramp. Premium add-ons (Phase One XF IQ4 150MP, Profoto B1X/B10X Plus/D2/Pro8a kits, premium Canon/Nikon/Sony/Fuji bodies and lenses, on-call assistants and digital techs) are available on-site at member-friendly rates."
4. **Does photospace offer studio memberships?** "Yes. Three monthly memberships — Spark (5 hrs/mo, $425), Creator (10 hrs/mo, $895), and Visionary (20 hrs/mo, $1,495) — give Denver photographers and videographers recurring access at member rates, plus discounted camera, lens, and lighting add-ons. Apply at /apply."
5. **Is photospace good for commercial shoots and brand campaigns?** "It's what the studio is built for. Brands including Nike, Under Armour, Oakley, New Balance, Amazon, Allstate, RH, the Denver Broncos, and Marie Claire have shot campaigns, editorials, and lookbooks on this floor. The space is sized and equipped for multi-look productions, agency teams, art-director-friendly client lounges, and full-day takeovers."
6. **Can I bring my own camera and crew?** "Absolutely. Most clients bring their own camera package and crew and use the studio for the space, lighting, grip, cyclorama, and tether station. There's no per-person fee for your team."
7. **Where is photospace located in Denver?** "209 Kalamath St, Unit 1, Denver, CO 80223 — in Denver's Sun Valley neighborhood, just off I-25 and minutes from downtown. The building has free parking, a load-in ramp, and an outdoor deck."
8. **How do I book photospace?** "Book directly through the live availability scheduler on the homepage (\"Book the studio\") — pick your block, confirm, and the studio is yours. Free 20-minute studio tours are bookable through the same scheduler if you'd like to walk the space first. For multi-day campaigns or custom productions, email hello@photospace.studio for a quote."
9. **Is lighting equipment included with the studio rental?** "Yes. Strobe and continuous LED lighting, modifiers, and grip are all included with every booking — no setup fees, no equipment surcharges. Premium Profoto kits (B1X, B10X Plus, D2, Pro8a) and additional continuous lighting are available as on-site add-ons at member-friendly rates."
10. **Is photospace designed for content creators and brand teams?** "Yes. The studio is built for the full range of professional creative work — photographers, videographers, content creators, influencers, agencies, and in-house brand teams. The Creator membership in particular is built for recurring content output."
11. **What are the cancellation and rescheduling policies?** "Reschedule or cancel up to 72 hours before your booking for a full credit on file. Inside 72 hours, the booking is non-refundable but rebookable for up to 60 days. Members get a more flexible window — full details are in the membership terms."
12. **Can I tour the studio before I book?** "Yes. Free 20-minute studio tours are available 7 days a week and bookable through the same scheduler — pick the \"Studio Tour\" option. Walking the space before a campaign day is the smart move and we recommend it."

---

## POLICIES / TERMS captured

- **Cancellation / reschedule (rentals):** Full credit if cancelled/rescheduled ≥72 hours before booking. Inside 72 hours: non-refundable but rebookable for up to 60 days. Members get a more flexible window (details in membership terms — **not published on the public site**).
- **No setup fees, no equipment surcharges, no per-person crew fee.**
- **Tours:** free, 20 min, 7 days/week, via Acuity.
- **Multi-day / custom productions:** email hello@photospace.studio for a quote.
- **Membership application agreement & signature:** collected in-app at `/apply` (steps 2–3) — exact legal terms not captured (would require completing the flow).

---

## /APPLY — Membership Application (native, in-app)

- **Title:** "Membership Application · photospace"
- **Flow:** 4 steps — "Step 1 of 4": (1) Your information → (2) the agreement → (3) your signature → (4) payment. Copy: "Welcome to the studio." / "Four short steps: your information, the agreement, your signature, then payment. Takes about three minutes."
- **Step 1 fields:** First name*, Last name*, Business name (optional), Street address*, Address line 2 (optional), City*, State (dropdown)*, ZIP*, Email*, Phone*. ("Every field is required. We'll use this to set up your account and contact you when needed.")
- Header/footer links: logo → `/`, `tel:+13032846057`, `mailto:hello@photospace.studio`.
- **Submit/payment processor unknown** (not exposed at step 1).

---

## IMAGES WORTH PRESERVING

**Hero / space photography (high value — full-res `-scaled.webp`):**
- `/images/photospace-stage-scaled.webp` — the shooting floor / cyc wall, lighting, tether station
- `/images/photospace-lounge-scaled.webp` — the lounge (sofa, monitor, espresso)
- `/images/photospace-kitchen-scaled.webp` — the working kitchen
- `/images/photospace-entry-scaled.webp` — the entry/bookshop (teak stairs, leather chair, library)
- `/images/studio-drone-shot.jpg` — aerial/drone of the building & surroundings

**Gallery ("From the archive — Shot here"), 7 images:**
- `/images/gallery/gallery-01.webp` … `/images/gallery/gallery-07.webp` — sample campaign/editorial work shot on the floor

**Brand identity:**
- `/images/photospace-logo.png` (header logo)
- `/images/cropped-android-chrome-512x512-1.png` (schema/favicon logo, 512×512)
- `/images/android-chrome-512x512-1.png`
- Dynamic OG image: `https://www.photospace.studio/opengraph-image` (1200×630)

**Logos:** 19 brand logos at `/images/<brand>-180px.webp` (see logo list).

---

## UNKNOWNS / NEEDS CONFIRMATION

1. **Booking platform = Acuity Scheduling (Squarespace), owner ID 20797727** — confirmed. It's embedded as an iframe on the homepage (`ref=embedded_csp`), canonical at `app.acuityscheduling.com/schedule/3ce2128a`. *Decision needed:* keep Acuity, or migrate booking into the consolidated site? Acuity holds the granular 2–12 hr pricing ladder and the free Studio Tour appointment type.
2. **Apply destination = `/apply` (native 4-step app), NOT an external form** — confirmed. The dead `…/membership-application-photospace/` URL is gone. *Confirm* whether `/apply` should be ported as-is (it includes agreement + e-signature + payment) and what the **payment processor** is (not visible at step 1 — likely Stripe/Square; verify by completing the flow).
3. **Membership minimum commitment / billing terms NOT published.** Site says only "three commitment levels." No contract length, auto-renew, rollover-of-unused-hours, or proration terms are stated publicly. The full "membership terms" referenced in the FAQ are gated inside the `/apply` agreement step. **Needs the actual terms from Dan / the `/apply` agreement.**
4. **Effective per-hour membership rates are computed here, not stated on site** ($85 / $89.50 / $74.75). Confirm whether to surface these in the rebuild.
5. **Pricing discrepancy to reconcile:** marketing site presents 3 tiers ($100/$485/$925); Acuity exposes a full 2–12 hr ladder. Decide which to present in the rebuild.
6. **Duplicate testimonial text:** Lincoln Phillips and Paul Trantow share identical quote copy — verify which attribution is correct before reuse.
7. **Do members get a different/discounted rental rate than the public $100/hr?** Site repeatedly says "member rates" / "member-friendly rates" but never states the actual member hourly number. **Needs confirmation.**
8. **Premium add-on pricing** is never published ("available on-site," "discounted for members") — no dollar figures. Needs a rate sheet if it should be merged.
9. **Sitemap** only lists the homepage; `/apply` is not in it. Only two routes were discoverable. Confirm there are no other hidden routes (e.g., member dashboard/login, confirmation pages) before retiring the domain.
10. **Team:** "Dan" (owner) and "John" referenced in testimonials/copy — confirm John's role for any About/team content.
11. **Geo coordinates in schema (39.7339, -105.0096)** — sanity-check against the actual address before reuse.
