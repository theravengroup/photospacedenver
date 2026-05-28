# PhotoSpace Denver — Old WordPress Site Content Inventory

> Source: https://photospacedenver.com (server-rendered WordPress)
> Audit date: 2026-05-28
> Purpose: Extract all useful content, copy, SEO equity, pricing, gear specs, policies, and business facts before rebuilding into a modern Next.js site (sister site photospace.studio being merged in).
> Method: WebFetch (read-only). No application code modified.

---

## Key business facts (summary block)

**NAP**
- **Name:** PHOTOSPACE (brand). Trades as "PhotoSpace Denver" / photospacedenver.com.
- **Address:** 209 Kalamath St, Unit One, Denver, CO 80223. (Studio Guide variant: "209 Kalamath St Unit 1". Entrance note: "entrance is around the corner on 2nd Avenue.")
- **Phone:** (303) 284-6057 / 303.284.6057
- **Email (CONFLICT — two appear):**
  - `inquiries@photospacedenver.com` (on /location/)
  - `contact@photospacedenver.com` (on /gear/, /grip/)
  - Most pages obfuscate the address. NEEDS CONFIRMATION which is canonical.
- **Hours:** Open by appointment, Mon–Fri 8:30am–5:30pm for pickup & dropoff. 24/7 by special arrangement (additional fee). Studio bookable 24/7 online. Event venue rental 7:00am–midnight.
- **Founded:** 2008 ("Denver's go-to for photo and video studio and equipment rental since 2008"). Note: location scouting copy claims "20+ years of experience in the Colorado creative community" — slight tension with 2008 founding (likely refers to owner's personal experience). NEEDS CONFIRMATION.
- **Owner:** Dan Jahn (confirmed via blog + internship + workshop pages).

**Pricing found (verbatim, see per-page detail)**
- Studio: $100/hr (2hr min) · Half day $485 (5 hrs) · Full day $925 (10 hrs) · Weekly = 4x day rate (home/studio) BUT policies + gear pages say weekly/Mon–Fri = **3x** daily rate — CONFLICT, see Unknowns.
- Studio overtime: $65/hr (waived for multi-day).
- Cyc wall painting: $150 labor + paint/supplies at cost.
- Event venue: $1,125/day (7am–midnight). (Home/studio page also implies event rental; policies states $1,125/day.)
- Memberships: 5 hrs $425/mo · 10 hrs $895/mo · 20 hrs $1,495/mo · extra hrs $65/hr.
- Booking-page lighting kits: Strobe $110–$300 (5 levels) · Video $135–$375.
- Camera cleaning: $95 (1-day) / $85 (2-day) / $75 (3-day) per kit; +$20/extra lens; +$25 large sensors; firmware update $29.
- Drone: Fly&Shoot $150/hr · Fly,You-Shoot $250/hr · Edited video $350/min · Retouched stills $125/image (+ mileage).
- ShootPod van: $175/day · first 100 mi free then $0.55/mi · refuel pump price +$10 · WiFi data $20/500MB → $125/10GB.
- Card fee: policies say "3% service charge"; estimate form says "3.5% fee" — CONFLICT. ACH 1% fee.
- Deposits: 50% if rental > $3,000 (per how-to-rent / request-estimate); policies says deposit 50% standard, 100% for third-party-leased gear. Minimum rental $100.

**Membership tiers found**
| Tier | Price/mo | Studio hrs/mo | Notes |
|---|---|---|---|
| 5 Hours | $425 | 5 | Full benefits package |
| 10 Hours | $895 | 10 | Full benefits package |
| 20 Hours | $1,495 | 20 | Full benefits package |
- Extra hours $65/hr. Billed every 30 days, **90-day minimum commitment**, auto-renewing until cancelled **in writing 30 days prior**. Hours do NOT roll over. Includes 24/7 private access, full grip package, tether station, Profoto packs/heads/reflectors, multiple LED kits, umbrellas, backdrops (incl. chroma blue+green), fog & haze, discounted lifestyle-space rate.
- Membership is NOT required to rent. "Most complete studio memberships in the country."

---

## Redirect recommendations (old URL → new route)

| Old URL | New route | Action / notes |
|---|---|---|
| `/` | `/` | Homepage hub. |
| `/studio/` | `/studio` | Primary studio page; rich specs + pricing. |
| `/location/` | `/contact` | Address/directions; merge into contact. |
| `/contact/` | `/contact` | **404 today** — net-new page on rebuild. |
| `/studio-guide/` | `/studio-facts` (+ gated guest guide) | Specs → /studio-facts; operational door-code/checkout content → post-booking guest page. |
| `/lifespace/` | `/studio` (or new lifestyle page) | "Coming soon" placeholder; fold into studio or hold for lifestyle-space launch. |
| `/shootpod/` | `/gear-rental` | Grip van; feature under gear/productions. |
| `/gear/` | `/gear-rental` | Gear hub. |
| `/gear/cameras-lenses/` | `/gear-rental` | Catalog section. |
| `/gear/flash-lighting/` | `/gear-rental` | Catalog section. |
| `/gear/continuous-lighting/` | `/gear-rental` | Catalog section. |
| `/gear/lighting-modifiers/` | `/gear-rental` | Catalog section. |
| `/gear/grip/` | `/gear-rental` | Catalog section. |
| `/gear/production-supplies/` | `/gear-rental` | Catalog section. |
| `/gear/photo-and-video-accessories/` | `/gear-rental` | Catalog section. |
| `/services/` | `/services` | Services hub. |
| `/location-scouting/` | `/services` | Service detail. |
| `/production-management/` | `/productions` (or `/services`) | Production svc; maps to /productions. |
| `/camera-cleaning/` | `/services` | Has pricing + booking form. |
| `/drone-services/` | `/services` | Has pricing. |
| `/retouching/` | `/services` | Service detail (not in current nav). |
| `/memberships/` | `/memberships` | Membership page. |
| `/membership-payment/` | `/memberships` | Thin/empty → fold in. |
| `/join/` | `/about` or careers | **Crew/staff recruitment** (NOT membership). |
| `/how-to-rent/` | `/book` (+ `/faq`) | Rental process steps. |
| `/book-online/` | `/book` | Studio quick-book + lighting kits. |
| `/estimate/` | `/request-estimate` | Near-duplicate of request-estimate. |
| `/request-estimate/` | `/request-estimate` | Primary estimate form. |
| `/register/` | `/book` or account flow | Rental account registration. |
| `/policies/` | `/policies` | Full legal/policy text. |
| `/insurance/` | `/policies` (+ COI upload) | COI requirements. |
| `/no-insurance/` | `/policies` | CC-hold alternative. |
| `/liability-waiver/` | `/policies` | E-sign waiver. |
| `/resources/` | `/productions` or `/about` | Crew/vendor directory. |
| `/workshops/` | `/services` or 410 | Overview, no dates; low value. |
| `/workshop/` | 410 → `/` | Stale "check back soon" placeholder. |
| `/workshop-casting/` | 410 → `/` | Casting form; niche. |
| `/internship/` | `/about` or 410 | Internship form; minor SEO. |
| `/privacy-statement-us/` | `/policies` | Boilerplate. |
| `/disclaimer/` | `/policies` | Boilerplate. |
| `/imprint/` | `/policies` or 410 | EU boilerplate; redundant. |
| `/blog/` | `/` or `/blog` | 2013–2018 PR; mostly 410. See blog note. |
| `/mj-test/` | 410 → `/` | Test/junk page. |
| `/thank-you/` | keep as form confirmation | Utility; map form successes here or new route. |
| `/update-information/` | account flow | Login-gated customer-info form. |
| `/membership-conversation` | `/memberships` | APPLY NOW destination (not in task list). |
| `/registration-conversation` | `/book`/account | Register form destination (not in task list). |
| `/booking/` | `/request-estimate` | Alt estimate link referenced on gear/how-to-rent. |
| `/sitemap/`, `/opt-out-preferences/`, `/registered/` | utility/410 | Not fetched; treat as junk/utility per brief. |

---

## https://photospacedenver.com/

1. **Title / H1** — Title: "PHOTOSPACE – rental studio & equipment for professional photography and video" · H1: "photospace: photo & video gear + studio rental"
2. **Core business info** — Denver's go-to for photo and video studio + equipment rental since 2008. Studio space, pro gear, on-location services. NAP as above; "Open by appointment M-F 8:30am-5:30pm for pickup & dropoff (24/7 by special arrangement)."
3. **Useful copy (verbatim)** — "Offering high-end studio space, pro gear, and more for all your creative needs." · "Capture perfection with us in-studio or on-location." · "The best resource for professional rental photography and videography in Denver." · "Private use of the full space" · "Equipment can be picked up or delivered" · "Memberships Not Required."
4. **SEO keywords** — studio rental Denver, photo/video equipment rental, gear rental, medium format capture systems, strobe lighting rental, grip rental, on-location rental, professional photography equipment.
5. **Pricing** — None on home page directly.
6. **Gear info** — Brand mentions: Profoto, Phase One, Chimera, PocketWizard, Nikon, Fuji, Westcott, SunBounce, Zacuto, Foba, Manfrotto, Gitzo, Apple, Eizo, GoPro, Hoodman, Litepanel, Matthews, Lowel, DJI, Avenger, Cinevate, Kino Flo, Zoom, Rode, Sennheiser, Blackmagic.
7. **Studio specs** — Cyc wall, grip equipment, capture station; kitchen, bathroom/changing room, client lounge.
8. **Booking** — BOOK ONLINE (studio) → /book-online/; REQUEST ESTIMATE (gear on location) → /request-estimate/; REGISTER → /register/.
9. **Membership** — "Memberships Not Required" → /memberships/.
10. **Policies** — None on this page.
11. **Forms/CTAs** — BOOK ONLINE, REQUEST ESTIMATE, REGISTER, MORE INFO (Studio → /studio/), MORE INFO (Gear → /gear/). Google reviews embedded.
12. **Images** — Logo `https://photospacedenver.com/wp-content/uploads/2016/01/photospace.png`. Review avatars (not worth preserving).
13. **Outdated/duplicate** — Footer "© 2026 PHOTOSPACE" (site-wide; appears auto-generated current year, not stale).
14. **Recommended destination** — `/` (homepage hub).
15. **Nav map** — GEAR (→ cameras-lenses, flash-lighting, continuous-lighting, lighting-modifiers, grip, photo-and-video-accessories, production-supplies) · STUDIO · SERVICES (location-scouting, production-management, drone-services, camera-cleaning) · RESOURCES · MEMBERSHIPS.

---

## https://photospacedenver.com/studio/

1. **Title / H1** — Title: "RENTAL PHOTO + VIDEO STUDIO SPACE – PHOTOSPACE" · H1: "rental photo + video studio space in Denver, CO"
2. **Core business info** — Premium photo/video studio rental in downtown Denver with premium gear available.
3. **Useful copy (verbatim)** — "Denver's premier photography and videography studio rental with premium gear available" · "Canon, Nikon, BlackMagic and PhaseOne cameras, lenses, Profoto Strobe Lights & Chimera Modifiers" · "2500 sq ft photography rental studio (1900 shooting) in downtown Denver" · "huge cyc wall (20w x 17d x 15'h)" · "Save thousands compared to other studios" · "A membership is NOT required to rent studio space or gear; anyone can rent!"
4. **SEO keywords** — studio rental Denver, photo studio rental, video studio rental, cyc wall, camera rental, lighting rental, grip equipment, production rental space.
5. **Pricing (verbatim)** — Hourly **$100** (min 2 hrs, avail 24/7) · Half day **$485** (5 hrs: 8a–1p or 2p–7p) · Full day **$925** (10 hrs: 8a–6p) · Weekly **4x day rate** · Overtime (full day) **$65/hr** (waived for multi-day). [NOTE weekly conflict vs 3x elsewhere.]
6. **Gear info** — Canon, Nikon, BlackMagic, PhaseOne cameras + lenses; Profoto strobes; Chimera modifiers; continuous + flash lighting. Software: Capture One, Phocus, Photoshop, Lightroom.
7. **Studio specs** — **2500 sq ft total / 1900 sq ft shooting** · Cyc wall **20'w x 17'd x 15'h** · backdrops: chroma-key green & blue muslin, seamless paper, white & black v-flats · **8 dedicated circuits** · full kitchen, bathroom/changing room, makeup stand, client lounge, back deck · tether capture station (Capture One, Phocus, PS, LR), wired & wifi · indoor & outdoor parking · loading ramp & deck · blackout & natural lighting.
8. **Booking** — BOOK ONLINE (24/7); REQUEST ESTIMATE for on-location gear.
9. **Membership** — Not required; plans available for pros (separate page).
10. **Policies (verbatim)** — Cyc wall "provided on an 'as is' basis" w/ potential cleaning/repair fees; possible power charge for large film/video or training; event rental 7am–midnight w/ potential added fees.
11. **Forms/CTAs** — BOOK ONLINE, REGISTER, REQUEST ESTIMATE, "Download floor plan PDF."
12. **Images** — Studio tour: shooting area, client lounge, kitchen, entryway/bookstore. Floor plan PDF (URL not captured — find in WP media). Worth preserving studio photos.
13. **Outdated/duplicate** — "© 2026"; reviews dated 2016–2025 indicate active operation.
14. **Destination** — `/studio` (canonical). Specs also feed `/studio-facts`, `/photo-studio-rental-denver`, `/video-studio-rental-denver`, `/cyclorama-wall-denver`, `/pricing`.

---

## https://photospacedenver.com/gear/

1. **Title / H1** — Title: (gear) · H1: "photography & video equipment rentals in Denver, CO"
2. **Core** — Best resource for professional rental photo/video in Denver; high-end studio, medium format, strobe + continuous lighting, grip, video/audio, on-location with insurance + delivery.
3. **Useful copy (verbatim)** — "The best resource for professional rental photography and videography in Denver, Colorado." · "Providing high-end studio space, medium format capture systems, strobe and continuous lighting, grip equipment, video and audio gear" · "Quick steps to get your gear."
4. **SEO keywords** — equipment rental Denver, photography gear rental, video equipment rental, lighting rental, grip rental, medium format, strobe/continuous lighting, on-location rental.
5. **Pricing model** — "weekly rates are 3x daily rate"; "weekends billed as 1x days"; off-hours pickup/return + delivery for additional fee. (No per-item prices on hub.)
6. **Gear info (categories + brands)** — Profoto (packs/heads/monolights/modifiers), Phase One, Fujifilm (medium format), Canon + Blackmagic (video), Kino/Lowel/Arri/LitePanel/Nanlux/Fiilex (continuous), Matthews/Gitzo/Manfrotto/Avenger (grip), modifiers (softboxes/octas/parabolas/umbrellas/sun bounce/scrim jims), video/audio (mics, rigs, jibs, dollies, sliders), production supplies (tables, chairs, tarps, umbrellas, tents), custom-built vans (shelving, power, WiFi).
7. **Studio specs** — "high-end studio space" only.
8. **Booking (verbatim steps)** — 1) Register for rental account. 2) Submit COI or authorize CC for replacement value. 3) Request estimate (gear + dates). 4) Online estimate → approval → invoice for payment. 5) Pickup/return Mon–Fri 8:30am–5:30pm by appointment (off-hours for fee).
9. **Membership** — Not required.
10. **Policies (verbatim)** — "pickup/return Mon-Fri 8:30am-5:30pm by appointment" · "gear can be shipped" · "weekends billed as 1x days" · "off hours pickup/return available 24/7 for additional fee" · "delivery/pickup is available for additional fee" · COI OR "separate credit card authorization for the full *replacement* value."
11. **Forms/CTAs** — REGISTER → /register/; BOOK ONLINE → /book-online/; REQUEST ESTIMATE → /booking/ (alt of request-estimate); INSURANCE → /insurance/. Phone (303) 284-6057; email contact@photospacedenver.com.
12. **Images** — Logo PNG.
13. **Outdated/duplicate** — "© 2026". Standard boilerplate intro shared across gear subpages.
14. **Destination** — `/gear-rental` (hub).

---

## https://photospacedenver.com/gear/cameras-lenses/

1. **Title / H1** — Title: "CAMERAS + LENSES – PHOTOSPACE" · H1: "camera and lens rentals in Denver, CO"
2. **Core** — Camera bodies + lenses by manufacturer; kits and body-only options.
3. **Useful copy** — Shared boilerplate intro.
4. **SEO keywords** — camera rental Denver, lens rental, medium format rental, cinema lenses, drone rental, professional photography equipment.
5. **Pricing (daily, verbatim)** — Canon EOS R5 Kit $195 / R5 body $145 · Nikon Z8 Kit $195 / Z8 body $145 · Phase One IQ4 150MP Kit $825 · GFX 100s Kit $295 / body $225 · GoPro 11 Standard $45 / PLUS $60 · MEVO 1 Kit $95 · MEVO 3 Kit $175. Lenses $8–$85/day; accessories $5–$50.
6. **Gear info (exhaustive)** —
   - **Canon:** EOS R5; RF 50mm f/1.2, 85mm DS f/1.2, 100mm f/2.8 Macro, 15-35mm f/2.8, 28-70mm f/2, 24-105mm f/4, 70-200mm f/2.8, 100-500mm f/4.5-7.1; EF-RF Control Ring Adapter; LP-E6NH battery; USB-C tether (9.5m).
   - **Nikon:** Z8; Z 24-70mm f/2.8, 70-200mm f/2.8, 180-600mm f/5.6-6.3; vertical grip; EN-EL15c; USB-C tether (9.5m).
   - **Phase One:** XF, XT bodies; IQ4 150MP back; Schneider Kreuznach LS 35/45/55/80mm f/3.5, 110mm f/2.8, 120mm f/4.5 Macro, 150mm f/3.5, 240mm f/3.5; IQ & P+ battery; dual charger; Ethernet tether system; V-grip; waist-level VF; USB-C tether (4.6m).
   - **Fuji:** GFX 100s; GF 20-35mm f/4 R WR, 35-70mm f/4.5-5.6 WR, 45-100mm f/4 R LM OIS WR; battery; USB-C tether (9.5m).
   - **Blackmagic:** URSA Mini 4.6K G2 (EF); Xeen cine 14 T3.1, 24/35/50/85 T1.5, 135 T2.2, full 6-lens kit; Sigma 18-35 T2; NP-F570 battery + dual charger; BMPCC EVF.
   - **GoPro:** Hero 11, Max; Max Wide Lens Mod; Media/Display/Light Mods; Volta battery grip.
   - **DJI:** Osmo Gen1.
   - **Mevo:** Mevo camera; table stand, light stand, carrying case.
7-10. **Specs/booking/membership/policies** — Body-only rentals include 1x battery + 1x charger; all lenses include UV filter. Memberships not required.
11. **Forms/CTAs** — BOOK ONLINE, REGISTER, REQUEST ESTIMATE.
12. **Images** — Logo PNG (product thumbnails likely in WP media — preserve catalog images).
13. **Outdated** — "© 2026". GoPro Hero 11 / current bodies → catalog is recent.
14. **Destination** — `/gear-rental` (cameras section).

---

## https://photospacedenver.com/gear/flash-lighting/

1. **Title / H1** — Title/H1: "Profoto flash lighting rentals in Denver, CO" / "Flash Lighting Kits (Profoto)"
2. **Core** — Profoto strobe/flash kits + individual items.
3. **Useful copy (verbatim)** — "All kits come in a carrying case. For Air Remote, you can choose a Canon-TTL, Nikon-TTL, Sony-TTL, Fuji-TTL, or Universal."
4. **SEO keywords** — flash/strobe rental, Profoto rental, monolight rental, studio flash, on-camera flash, Denver.
5. **Pricing (verbatim)** — A1 (Nikon) $65 · A10 (Canon) $75 · B2 (250ws) $115 · B1/B1X (500ws) $150 · B10XPlus (500ws) $175 · D2 (1000ws) $175 · D4 2-head $125 · Pro7a $145 · Pro8a $185 · Pro11 $275 · B4 $185. Individual: A1 $25, A10 $30, Pro-11 $145; batteries $10–$20; chargers $8–$20; heads $25–$60.
6. **Gear info (exhaustive)** — Speedlights: A1 (Nikon), A10 (Canon). Monolights: B2 250ws, B1/B1X 500ws, B10XPlus 500ws, D2 1000ws. Studio packs: D4 2400ws, Pro-7a 2400ws, Pro-8a 2400ws, Pro-11 2400ws, B4 1000ws. Heads: RingFlash2, ProTwin (Bi-Tube), Pro Head, Pro-B Head, Acute2-D4 Head. Triggers: PocketWizard Transceiver, Connect Pro Remote, Air Remote (Canon/Nikon/Sony/Fuji/Universal). Batteries/chargers for A1/A10/B1/B2/B4/B10 series.
7-10. Shared. 11. BOOK ONLINE/REGISTER/REQUEST ESTIMATE. 12. Logo PNG. 13. "© 2026".
14. **Destination** — `/gear-rental` (flash section).

---

## https://photospacedenver.com/gear/continuous-lighting/

1. **Title / H1** — Title: "CONTINUOUS LIGHTING – PHOTOSPACE" · H1: "continuous lighting rentals in Denver, CO"
2. **Core** — LED/continuous kits + individual fixtures by brand.
4. **SEO keywords** — continuous lighting rental, LED lighting kits, production lighting, Denver.
5. **Pricing** — Kits $100–$550 · individual $15–$500 · battery kits $55–$125.
6. **Gear info (exhaustive)** — Kits: LitePanel Astra 1×1 Bi-Color $175; Fiilex P360EX 3-lamp $150; Astera Titan 4' 8x $550, Helios 2' 8x $450; Quasar Q-Lion 3×2 $120; Aputure MC 12-light RGBWW $100; Nanlux Dyno 650c $400, TK-280B $250. Individual LED: Nanlux Evoke 1200B $250, Dyno 1200C $500, Dyno 650c $200, TK-280B $125; Arri SkyPanel S30 $175, S60 $250, L7 $75; Creamsource Sky 1.2k $450, Micro $160; LiteMat series $90–$300; Colt LED tubes 2ft/4ft $15–$20; Quasar 4ft Crossfade $20; Kino Flo Celeb 200 / Freestyle 4 / Select 20/30 $150–$175; Gemini 1×1' & 2×1' $175–$240; Astra 1×1 Bi-Color $95. (No wattage/CCT specs on page.)
   - **New brands beyond home list:** Astera, Aputure, Quasar, Creamsource, Gemini, Colt.
7-10. Shared. 11. CTAs standard. 13. "© 2026".
14. **Destination** — `/gear-rental` (continuous section).

---

## https://photospacedenver.com/gear/lighting-modifiers/

1. **Title / H1** — H1: "light modifiers flash, continuous, and natural in Denver, CO"
4. **SEO keywords** — lighting modifiers, softbox/beauty dish/octabox rental, reflectors, umbrellas, Denver.
5. **Pricing** — $3 (Profoto speedring/dome) to $225 (Bron Para 177). Softboxes $20–$30; octas $25–$45; umbrellas $5–$20; SunBounce kits $42.
6. **Gear info (exhaustive)** —
   - **Chimera (Profoto-compat):** SuperProPlus/Pro II softboxes L/M/S (white/silver) $20–$30; strip boxes $20–$30; grids $10–$15; OctaBank 3'/5'/7' ext $30/$45/$25; collapsible beauty dish/octa 24"/30" $25/$30; octa grids $15/$20.
   - **Profoto modifiers:** honeycomb grid set 5/10/20° $15; zoom reflector $8; barn doors $8; grid/filter holder 7" $10; magnum $10; magnum 10° grid $8; snoot $10; beauty dish white/silver $25; diffusion sock $3; BD grid $10; speedring quad/octa $3; double-head speedring $6; octa speedring w/bracket $5; Fresnel spot $65; softlight reflector for ringflash $15; telezoom reflector $30; hardbox $25; modifiers bag $20.
   - **Profoto OCF** (B1/B1X/B2/D1/D2/B10/B10+ only): disc/zoom reflector $5; barn door $5; magnum $8; grid holder + 10/20/30° set $10; grid+gel set $10; snoot $8; OCF speedring $3; collapsible beauty dish white/silver $20; softbox 16×16" $20, 2×3' $20, strip 1×3' $20; strip grid $10; gels Qtr CTB/CTO $4; 10° grid $4; grid+gel holder $6.
   - **Profoto CLIC** (A1/A10 only): dome $3; creative color gels (Rose Pink/Peacock Blue/Yellow) $8; bounce card $3; soft bounce card $5.
   - **Umbrellas:** Westcott 7' white/silver/translucent $20; Westcott 45" $5; Profoto Deep 41" $8, 51" $10.
   - **SunBounce:** Kit (4×6' frame + silk) $42; SunSwatter kit $42; frames 3×4' $20, 4×6' $25, SunSwatter Pro 4×6' $30; cloths $15–$20.
   - **Photek:** Soft Lighter 36"/45"/60" $8/$10/$12; SunBuster 84" $30.
   - **Scrim Jim:** frames 8×8' $30, 6×6' $25; cloths (diffusion/grid/cine black/silver-white/single net) $20 each.
   - **Reflectors/v-flats:** Tri-Flector II $15; 5/6-in-1s $6; 72×40" silver/black $5; Omega $8; Eyelighter $15; V-Flat B+W 40×80" $20.
   - **Elinchrom (w/Profoto adapter):** Rotalux Deep Octa 39" $30; Indirect Octa 75" $75.
   - **Bron (w/Profoto adapter):** Para 177 $225.
   - **Nanlux:** 45° reflector for Evoke 1200 $15; Fresnel for Evoke 1200 $95; barndoors for 650c $20.
7-10. Shared. 11. CTAs standard. 13. "© 2026".
14. **Destination** — `/gear-rental` (modifiers section).

---

## https://photospacedenver.com/gear/grip/

1. **Title / H1** — Title: "GRIP EQUIPMENT RENTAL – PHOTOSPACE" · H1: "grip equipment rental in Denver, CO"
4. **SEO keywords** — grip equipment rental, C-stands, flags, sandbags, booms, clamps, electrical, Denver.
5. **Pricing (verbatim)** — Cases $15 · Magliner Senior w/Shelf $45 · FoldIt/Beach Cart $25 · Apple Box Kit $10 (individual $3) · Flags $5 (kits $16) · 4×4' Floppy Cutters $25 · clamps/heads/arms $4 · Shotbags 5lb $2 · Sandbags 15/25/35lb $3/$5/$8 · Counterweights 15lb $4 · Mini Boom $10 · Super Boom w/Weight $20 · MegaBoom $75 · C-Stand 40" $10, 20" $8 · Light Stand $8 · Baby Plate $8 · HD Stands $15–$20 · Stinger 25/50/100' $3 · Power Strip $3 · UPS $10 · Frames $10–$35 · large fabrics 6×6'/12×12' $15–$30 · ShootPod (Grip Van) $175.
6. **Gear info (exhaustive)** — Transport: Magliner Senior, FoldIt, Beach Cart, ShootPod. Cases: Pelican, Lightwave. Support: C-Stand 40"/20" w/head+arm, light stand, High Junior 3-riser roller, Mombo Combo, wheeled wind-up, baby roller, 6" baby plate on pancake. Clamps: Super/Mafer (stud/J-hook), 2½" grip head, A-clamps (micro/S/M/L), double grip head, gobo grip head, Cardellini 2", Big Ben, Quacker, Duckbill, C-clamp w/pin, drop-ceiling scissor, pivoting boom-arm clamp. Arms: flex arm, magic arm, stand adapter 1⅛→⅝. Booms: mini, super w/weight, MegaBoom, super-boom roller. Specialty: AutoPole, Speedrail 5'/coupler/ear. Flags/cutters: single/double scrims (black), artificial silk (white), solids (18×24/24×36/30×36), 4×4' floppy cutters (top/bottom hinge). Apple boxes: full/half/quarter/eighth + minis. Weights: 5lb shotbags, 15/25/35lb sandbags, 15lb pumpkin counterweights. Support: 9'/12' backdrop kits. Frames: gel 48×48", 6×6' & 12×12' butterfly, 12×12' collapsible. Fabrics: 6×6' & 12×12' single/double scrim, ¼/full silk, china silk, B/W griff, solid, UltraBounce. Electrical: stingers, power strip, UPS. Accessories: cold-shoe flash/umbrella holder, reflector holder.
7-10. Shared. 11. CTAs standard. 12. Logo PNG. 13. "© 2026".
14. **Destination** — `/gear-rental` (grip section); ShootPod cross-links to /productions.

---

## https://photospacedenver.com/gear/production-supplies/

1. **Title / H1** — H1: "production supply rentals in Denver, CO"
4. **SEO keywords** — production supplies rental, photo/video gear, on-location rentals, Denver.
5. **Pricing** — $0.25 (hangers) to $75 (10×10' pop-up tent). Samples: Folding Table 6' $10; Honda 2000w $100; Smoke Machine $25; Walkie $15; Space Heater $5.
6. **Gear info (exhaustive)** — Tables/chairs: folding table 6', linens, padded folding chair, director chair (short/tall), tall camp chair, posing stool/table. Generators: Honda 2000w. Comms: walkie + surveillance headset, extra battery. SFX: smoke/fog/haze machines, leaf blower w/battery+charger. Electrical: stingers (gauges/lengths), power strip, cube tap, UPS. Wardrobe: handheld + floor steamer, wardrobe rack, hangers, iron, ironing board, robe, slippers, booties, towel, garment bags. Misc: gas can 5gal, furniture pads, tarp 10×10', ratchet strap, traffic cone, ladders 6'/10'/12', flashlight, fire extinguisher, megaphone, rain/golf umbrellas, corded/battery vacuums, Bluetooth speaker, collapsible trash can, LED worklight, space heater. Tents: pop-up 10×10', pop-up changing tent, HD changing tent. Catering: Keurig K-Cup, cooler. Transport: FoldIt, Beach Cart, Magliner. Tools: snow/square/round shovel, push broom, broom & pan, leaf rake, air compressor.
7-10. Shared. 11. CTAs standard. 13. "© 2026".
14. **Destination** — `/gear-rental` (production supplies section).

---

## https://photospacedenver.com/gear/photo-and-video-accessories/

1. **Title / H1** — Title: "PHOTO & VIDEO ACCESSORIES – PHOTOSPACE" · H1: "photo & video accessories rental in Denver, CO"
4. **SEO keywords** — tripod/gimbal/mic/audio recorder/memory card/projector rental, camera support, Denver.
5. **Pricing** — $2–$95/day (see per-item below).
6. **Gear info (exhaustive)** — Photo tripods/heads: Manfrotto 334B monopod $8; Peak Design CF $15; MeFoto RoadTrip Classic $15; Manfrotto 190XPro4 $15; Benro TMA47AXL $25; Manfrotto 488RC2 ball $8; FOBA SuperBall $15; Benro B4 $15; Manfrotto 405 geared $20; Benro GD3WH $15; Edelkrone flex/tilt $8. Video tripods/heads: Manfrotto 504HD+546B $45; MVH502A+MVT502AM $40; Benro S8 (17.6lb) $25; Mevo floor stand $5, table stand $3. Add-ons: Manfrotto 131D side arm $8; Edelkrone ONE QR $3. Specialty: suction cup camera support $15. Gimbals: DJI OM 5 (w/fill) $6; Ronin RS2 Pro Combo $65; R vertical mount $5; R counterweight set $2; R twist grip dual handle $8; RS 3D focus $8. Projection: Epson 2600lm (1280×800) $20; 114" screen w/stand $45; AppleTV $20. Sliders/jibs: Edelkrone Slider+ Pro Long $95, SliderONE+Motion $50; Kessler Pocket Jib Traveler $25. Video acc: Wooden Camera matte box + donut $95; SmallHD AC-7 OLED $45; Foldio 10" turntable $10, 360 dome $15, 25" light box $10. Mics: wireless lav kit $45; Rode VideoMic Pro $10; Azden SMX-30 $20; Comica BoomX-D iPhone lav $10. Audio acc: Sennheiser HD 650 $25; boom pole w/XLR $20; fishing-pole holder $3; XLR cables $2. Recorders: Zoom H6 $35, F3 $40, F6 $75. Memory: CFExpress-B 165GB $8 / 325GB $10; SD UHS-II 128/256/512GB $5/$6/$8; micro UHS-II 256GB $6; CFast 256/640GB/1TB $8/$10/$12. Readers: CFExpress+SD $12; CFast+SD $12. Storage: 2TB SSD USB-C $10.
7-10. Shared. 11. CTAs standard → /book-online/, /register/, /request-estimate/. 12. Logo PNG. 13. "© 2026".
14. **Destination** — `/gear-rental` (accessories section).

---

## https://photospacedenver.com/services/

1. **Title / H1** — Title: "SERVICES – PHOTOSPACE" · H1: "services photospace provides a wide variety of services to image creators"
2. **Core** — Service hub: location scouting, production management, camera cleaning, drone services. (Retouching exists but is NOT linked in this hub's nav — see Unknowns.)
3. **Useful copy (verbatim)** — "Pre- and post-production along with management and pristine tools and beautiful final images are the keys to a successful shoot." · Location scouting: "With 20+ years of experience in Colorado, photospace can ensure the perfect location for your shoot." · Production mgmt: "booking travel, picking up at airport, organizing crew and talent, getting gear rented and transported, feeding on location."
4. **SEO keywords** — location scouting, production management, camera cleaning, drone services, Denver Colorado production.
5. **Pricing** — None on hub.
11. **Forms/CTAs** — BOOK ONLINE, REGISTER, REQUEST ESTIMATE.
14. **Destination** — `/services` (hub). Production management → also `/productions`.
15. **Nav** — Location Scouting /location-scouting/ · Production Management /production-management/ · Drone Services /drone-services/ · Camera Cleaning /camera-cleaning/.

---

## https://photospacedenver.com/location-scouting/

1. **Title / H1** — Title: "Location Scouting – Photospace" · H1: "location scouting — let photospace find and acquire the perfect location for your shoot"
3. **Useful copy (verbatim)** — "With over 20 years of experience in the Colorado creative community, we can find the perfect location for your shoot, whether its a contemporary city loft or a secluded forest grove or a clifftop overlooking the plains." · Components: "finding the perfect spot / pulling permits / license & usage fee negotiation / location pre-prep."
4. **SEO keywords** — location scouting Denver, Colorado photography/video locations, permits, location scouts.
5. **Pricing** — Not listed.
6. **Booking** — Phone/email; REQUEST ESTIMATE.
13. **Outdated** — "© 2026".
14. **Destination** — `/services`.

---

## https://photospacedenver.com/production-management/

1. **Title / H1** — Title: "Production Management – Photospace" · H1: "photospace can make shoots of any size run smoothly"
3. **Useful copy (verbatim)** — "We all know a shoot isn't just time spent taking photos. Pre- and post-production is the key to a successful shoot." · Services: car transportation, production insurance, grip & lighting assistants, digital technicians, wardrobe, props, hair & makeup, stylists, catering, onsite workflow management.
4. **SEO keywords** — production management Denver, grip & lighting assistants, digital techs, HMU, styling, catering, production insurance.
5. **Pricing** — Not listed.
11. **Forms/CTAs** — REQUEST ESTIMATE → /request-estimate/; BOOK ONLINE → /book-online/.
14. **Destination** — `/productions` (or `/services`).

---

## https://photospacedenver.com/camera-cleaning/

1. **Title / H1** — Title: "CAMERA CLEANING – PHOTOSPACE" · H1: "camera cleaning in Denver, CO"
2. **Core** — Sensor + body cleaning, 3 turnaround tiers; includes sensor, exterior, compartments/contacts, VF/LCD polish, plus one lens.
3. **Useful copy (verbatim)** — "Nothing like a bunch of dust spots to ruin your photos!" · "we will have your camera sparkling and ready for you to get shooting again." · Notes: VF dust not included (cosmetic only); lenses not disassembled (warranty).
4. **SEO keywords** — camera cleaning Denver, sensor cleaning, camera maintenance, lens cleaning.
5. **Pricing (verbatim)** — 1 Day $95/kit · 2 Day $85/kit · 3 Day $75/kit · additional lenses $20 ea · large sensors (Hasselblad, Phase, RED) +$25 · firmware update check free, application $29.
6. **Booking/Forms** — "Book a camera cleaning" form: date/time selection, camera/lens details, optional firmware check. Plus REQUEST ESTIMATE.
12. **Images** — Logo PNG.
13. **Outdated** — "© 2026".
14. **Destination** — `/services`.

---

## https://photospacedenver.com/drone-services/

1. **Title / H1** — Title: "DRONE SERVICES – PHOTOSPACE" · H1: "drone services photospace provides complete aerial creative photo + video creating"
3. **Useful copy (verbatim)** — "Are you needing LEGAL, LICENSED, PERMITTED and INSURED aerial video or photos for your next production?" · "We will work with you to plan a shoot; plotting points of interest and shot lists, then fly and shoot, getting you the images or footage you need." · "We put you at the controls of the camera while our FAA licensed and fully insured pilot flies for you."
4. **SEO keywords** — drone services Denver, aerial video, aerial photography, UAV filming, FAA licensed drone pilot.
5. **Pricing (verbatim)** — We Fly & Shoot (raw) $150/hr + mileage (raw via delivery <24h) · We Fly, You Shoot (raw) $250/hr + mileage (raw on-site) · Edited Video $350/minute + mileage · Retouched Stills $125/image + mileage.
6. **Gear** — No drone models named. FAA licensed + insured pilot (Part 107 implied, not stated).
11. **Forms/CTAs** — BOOK ONLINE, REGISTER, REQUEST ESTIMATE.
13. **Outdated** — "© 2026".
14. **Destination** — `/services`.

---

## https://photospacedenver.com/retouching/

1. **Title / H1** — Title: "RETOUCHING – PHOTOSPACE" · H1: "photograph retouching photospace professional retouching services offer a new clarify of vision to your images" (note typo "clarify" → likely "clarity").
3. **Useful copy (verbatim)** — "With multiple retouchers specializing in virtually any genre of photography, photospace can take your images to the next level." · Specialties: fashion, beauty, food, product, architecture, portrait, wedding.
4. **SEO keywords** — professional retouching Denver, fashion/beauty/food/product retouching, image enhancement.
5. **Pricing** — Not listed.
6. **Booking** — Phone (303) 284-6057, email; REQUEST ESTIMATE.
13. **Outdated** — "© 2026"; typo in H1.
14. **Destination** — `/services`. NOTE: page exists but is orphaned from Services nav — add it back or 301.

---

## https://photospacedenver.com/memberships/

1. **Title / H1** — Title: "MEMBERSHIPS – PHOTOSPACE" · H1: "memberships monthly photo + video studio memberships"
2. **Core** — Optional monthly memberships for pros w/ big discounts on studio time + included equipment.
3. **Useful copy (verbatim)** — "A membership is NOT required to rent studio space or gear – anyone can rent!" · "These are the most complete studio memberships in the country, with extensive grip, computer and lighting equipment included!"
4. **SEO keywords** — studio membership Denver, photo/video studio access, monthly studio rental, equipment included membership.
5. **Pricing (verbatim)** — 5 hours $425/mo · 10 hours $895/mo · 20 hours $1,495/mo · additional hours $65/hr.
6. **Membership info (verbatim)** — All tiers include: "Online booking, Private 24/7 studio access, Full grip equipment package, Tethered shooting station, Profoto Studio Packs, Profoto Heads, Head Extension Cables, Profoto Reflectors, Multiple LED lighting kits, Umbrellas (white, translucent, silver), Backdrops including chroma blue + green, FX: fog & haze machines, Discounted rate on lifestyle shooting spaces."
7. **Policies (verbatim)** — "Memberships are billed every 30 days, with a minimum commitment of 90 days." · "Memberships are autorenewing until cancelled in writing 30 days prior to the next billing date." · "Hours do not rollover." · "Additional rental hours over and above the membership hours are available at $65/hr."
8. **Booking/joining** — APPLY NOW → /membership-conversation; Schedule Appointment → Acuity (app.acuityscheduling.com/schedule.php?owner=20797727&appointmentType=69095453); post-purchase welcome email.
9. **Forms/CTAs** — APPLY NOW, Schedule Appointment (Acuity), BOOK ONLINE, REGISTER.
10. **Images** — SVG placeholders only (studio photos not in extracted markup).
13. **Outdated** — "© 2026". "Lifestyle shooting spaces" referenced but LifeSpace page is "Coming soon" (mismatch — see Unknowns).
14. **Destination** — `/memberships` (+ `/pricing`).

---

## https://photospacedenver.com/membership-payment/

1. **Title / H1** — Title: "MEMBERSHIP PAYMENT – PHOTOSPACE" · H1: "membership payment monthly memberships for professional photographers and videographers"
2/3/5/9. **Core/copy/pricing/forms** — Thin/near-empty: no pricing, no tiers, no visible payment form, no Stripe/PayPal/Woo detected in markup. Likely a gated or JS-driven payment step (possibly Stripe behind APPLY NOW flow). NEEDS CONFIRMATION whether functional.
13. **Outdated** — "© 2026".
14. **Destination** — `/memberships` (fold in / drop).

---

## https://photospacedenver.com/join/

1. **Title / H1** — Title: "JOIN – PHOTOSPACE" · H1: "join"
2. **Core** — NOT membership. This is a **crew/staff recruitment** form to join the Photospace resources team (assistant, stylist, technician, etc.).
3. **Useful copy** — Shared boilerplate intro.
6. **Forms/CTAs** — Fields: Name (First Last); "Joining team as" (dropdown); Skills (textarea); Age verification (YES/NO); Address (street/city/state/zip/country); "Check payment location" (text); Phone; Email; Headshot (JPG/PNG/GIF 512×512px); Mini Bio (2-3 sentences).
13. **Outdated** — "© 2026".
14. **Destination** — `/about` or a careers/crew page. Do NOT map to /memberships (common mistake — URL implies membership but content is recruitment).

---

## https://photospacedenver.com/how-to-rent/

1. **Title / H1** — H1: "How To Rent"
2. **Core** — 4-step rental process for gear/studio/location.
3. **Step-by-step (verbatim)** — STEP 1: "Register for a rental account. You will need to submit a credit card authorization and a scan of your drivers license." · STEP 2(a equipment): "Certificate of Insurance or submit a separate credit card authorization for the full replacement value." · STEP 2(b studio/lifestyle): "insurance certificate or...separate credit card authorization for a damage hold and sign the liability waiver." · STEP 3: Submit "booking request" form (gear, studio, personnel, dates). · STEP 4: Estimate for approval; 50% deposit invoiced if >$3000, full amount if <$3000.
5. **Pricing (verbatim)** — "weekly rates are 3x daily rate" · "weekends billed as 1x days" · deposits 50% if >$3000 else full · off-hours/delivery fees.
6/7. **Booking/Policies (verbatim)** — "pickup/return Mon-Fri 8:30am-5:30pm by appointment" · "off hours pickup/return available 24/7 for additional fee" · "gear can be shipped" · "delivery/pickup is available for additional fee."
8. **Forms/CTAs** — REGISTER → /register/ · REQUEST GEAR → /booking/ · BOOK ONLINE → /book-online/ · INSURANCE → /insurance/ · LIABILITY WAIVER → /liability-waiver/.
14. **Destination** — `/book` (process) + `/faq`.

---

## https://photospacedenver.com/book-online/

1. **Title / H1** — Title: "BOOK ONLINE – PHOTOSPACE" · H1: "studio quick book"
2. **Core** — Online booking for studio + preconfigured lighting kits.
3. **Useful copy (verbatim instructions)** — "1 – Choose your session length. 2 – Choose any Add-Ons. 3 – Choose from available dates/times. 4 – Add contact & payment info." Plus "SHOW ALL ADD-ONS" (lighting, modifiers, cameras, assistants, services, Cyc Paint).
4. **Pricing (verbatim lighting kits)** — Strobe: Level One $110 · Level Two $180 · Level Three $200 · Level Four $270 · Pro $300. Video: Level One $135 · Level Two $225 · Levels Three & Pro $375 each.
5. **Booking system** — Embedded widget (type not confirmed in markup — likely Booqable/Checkfront/custom; the studio quick-book + add-ons pattern + Stripe payment elsewhere suggests a rental-booking SaaS). NEEDS CONFIRMATION of platform. Date/time picker, session-length selector, add-on checkboxes, contact + payment fields.
11. **Forms/CTAs** — SHOW ALL ADD-ONS, ADD TO APPOINTMENT; links to /request-estimate/, /register/.
13. **Outdated** — "© 2026".
14. **Destination** — `/book`.

---

## https://photospacedenver.com/estimate/

1. **Title / H1** — H1: "Request an Estimate"
2. **Core** — Near-DUPLICATE of /request-estimate/ (same form + copy). Quote request for studio/gear/both.
3. **Useful copy (verbatim)** — "No rentals are reserved and no gear is guaranteed available and locked in prior to payment." · "Estimates expire after five days. Minimum rental is $100" · "If you are renting just the studio for one day, or the studio plus one of our preconfigured studio lighting kits, you can actually book it directly online."
4. **Forms (required fields)** — member status (NO/YES); rental account established (NO/YES); insurance vs CC-hold (radio); payment method (CC 3.5% / ACH 1% / Pre-Paid Account); rental type (Studio only / Studio+Gear / Equipment only); pickup vs delivery; start/end dates; pickup/return + delivery/collection dates & times; delivery + pickup addresses ("same as previous"); gear list (textarea); Name/Phone/Email.
5. **Pricing** — Min rental $100; CC 3.5% fee; ACH 1% fee.
6. **Policies (verbatim)** — "For all rentals we must have either an insurance certificate or a separate credit card authorization for the replacement value of your rental." · "Estimates expire after five days."
13. **Outdated/duplicate** — Duplicate of /request-estimate/. Pick ONE canonical.
14. **Destination** — `/request-estimate` (301 from /estimate/).

---

## https://photospacedenver.com/request-estimate/

1. **Title / H1** — Title: "REQUEST ESTIMATE – PHOTOSPACE" · H1: "request an estimate"
2. **Core** — Primary estimate/quote form (gear + studio).
3. **Useful copy (verbatim)** — "No rentals are reserved and no gear is guaranteed available prior to you completing: 1. account registration 2. estimate approval 3. invoice/deposit payment" · "We must have either an insurance certificate on file, or do a separate credit card authorization for the replacement value of your rental prior to gear pickup" · "NOTE: This NOT the same as having a rental account. Membership is a separate application" · "If you are renting just the studio for one day...you can actually book it directly online — no need to go through this form."
4. **Forms** — Same field set as /estimate/ (member status, rental account, insurance/CC-hold, payment method CC 3.5%/ACH 1%/Pre-Paid, rental type, pickup/delivery, dates/times, addresses, gear list, Name/Phone/Email).
6. **Policies** — COI on file OR CC auth for replacement value before pickup.
14. **Destination** — `/request-estimate` (canonical).

---

## https://photospacedenver.com/register/

1. **Title / H1** — Title: "REGISTER – PHOTOSPACE" · H1: "register for new account"
2. **Core** — Rental account registration (required to take gear on location).
3. **Requirements (verbatim)** — "Please note, we will also need you to submit a Certificate of Insurance to rent equipment, or, do a Credit Card hold for the replacement value of your rental." · "You will need to upload a scan of your Driver's license in jpg/pdf format." · "You will need to provide two trade references we can call and verify."
6. **Forms/CTAs** — DL upload (jpg/pdf); two trade references; COI or CC-hold info. Form posts to **/registration-conversation**. Buttons: REGISTER, REQUEST ESTIMATE.
13. **Outdated** — "© 2026".
14. **Destination** — `/book` or dedicated account-registration flow.

---

## https://photospacedenver.com/location/

1. **Title / H1** — Title: "LOCATION – PHOTOSPACE" · H1: "located in downtown Denver Colorado"
2/3. **Core/NAP** — Address "209 Kalamath St Unit One Denver, CO 80223"; Phone 303.284.6057; **Email inquiries@photospacedenver.com**; hours not listed.
4. **Useful copy (verbatim)** — "entrance is around the corner on 2nd Avenue" (only directional note).
5. **Specs** — No parking/load-in detail here (see Studio Guide for those).
7. **Forms/CTAs** — BOOK ONLINE, REGISTER, REQUEST ESTIMATE; no embedded form; no Google Maps embed captured.
12. **Images** — Logo PNG.
14. **Destination** — `/contact`.

---

## https://photospacedenver.com/studio-guide/

1. **Title / H1** — Title: "Studio Guide – PhotoSpace" · "Last updated 22 DEC 2025."
2. **Core** — Operational guest guide: access codes, equipment use, facilities, checkout.
3. **Useful copy (verbatim)** — "Your code will go active 15 min prior to the start of your rental and deactivate 15 min after your rental time concludes." · "The Access Reader/Doorbell is mounted left of the door outside. Tap 'Unlock PIN' in the lower right corner. Enter your code." · "After your shoot wraps, please put the grip wall back to the way it was when you came in." · "If we have to provide emergency support because the tether station isn't configured to its standard after your rental, there will unfortunately be a surcharge."
4. **Studio specs (verbatim/derived)** — 209 Kalamath St Unit 1; cyc wall w/ double-glass-door blackout blinds; **8× 20-amp circuits** via aluminum wall plates either side of cyc; **free street parking** (unlimited on side streets, 2-hr limit on Kalamath St); load-in via right turn on W 2nd Ave; WiFi via NFC/QR puck (password not distributed); espresso machine + Keurig; surround sound; tether station w/ Capture One / Lightroom / Resolve / Photoshop; overhead dimmable lights (1 dot bright white / 2 warm / 3 blue / 4 off); 5-zone mini-split HVAC (iPad via Sensibo app); motor-controlled backdrop system.
5. **House rules (verbatim)** — "Please remove or cover your shoes while you are in the studio to protect dust from camera/lighting gear and the cyc wall from dirt and scuffs." · (tennis balls for C-stand feet) · "If you put the double glass door big black shade down, triple check that nothing is blocking it when you put it back down as it will jump the track and then it's game over and a very expensive repair job." · "We work on an honor system for the rest of the gear you will see in studio...If you decide to use any please let us know so that we can add to your final invoice." · Wrap-up: return to original condition, Clorox wipes on surfaces, return gear to cyc/grip walls, restore tether config, lock back doors. · "Please do not go into the top office area or through the door marked 'employees only'." · HVAC heat↔cool switch requires calling 303.284.6057.
6. **Access** — Confirmation email from **ui.com** (UniFi Access system — check spam). Door code active ±15 min. Exit via silver "PUSH TO EXIT" button. "STUDIO CLOSE" button shuts lights + shades.
9/12. **Images/downloads** — No floor-plan PDF here; coffee-machine YouTube video linked; instructional photos in WP media.
13. **Outdated** — "Last updated 22 DEC 2025" — current. Reveals access system = UniFi/ui.com.
14. **Destination** — `/studio-facts` for specs; operational/door-code content → gated post-booking guest guide (not public).

---

## https://photospacedenver.com/shootpod/

1. **Title / H1** — Title: "SHOOTPOD – PHOTOSPACE" · H1: "shootpod—fully equipped grip van and mobile studio"
2. **Core** — Custom high-top grip van / mobile studio, pre-packed pro gear.
3. **Useful copy (verbatim)** — "Ever need to shoot on location and wish you had everything nicely packed, ready to go?" · "ShootPod: Standard has custom shelving for equipment storage, 2400 watts of available power distributed into multiple electrical plugs as well as USB ports" · "With a built-in, custom designed charging station, you can keep multiple Canon, Nikon, RED, Fuji, Phase One, GoPro, Hasselblad batteries charging."
4. **Pricing (verbatim)** — $175/day · first 100 miles free, $0.55/mile after · refuel = pump price + $10 (n/a if returned same level) · WiFi data $20/500MB · $30/1GB · $40/2GB · $75/5GB · $125/10GB.
5. **Specs** — Custom shelving; 2400W distributed power + USB; multi-brand battery charging station; Verizon mobile WiFi; touch-screen CarPlay stereo + XM Radio. Add-ons: medium format cameras, Profoto strobes, Arri/KinoFlo/LitePanel continuous, modifiers. Van make/model + cargo capacity NOT specified.
7. **Policies** — None on page (driver/insurance per /policies/ vehicle terms).
8. **SEO keywords** — grip van rental, mobile studio, location shoot gear, Denver.
14. **Destination** — `/gear-rental` (feature) and/or `/productions`.

---

## https://photospacedenver.com/lifespace/

1. **Title / H1** — H1: "lifestyle space–photospace: gourmet kitchens, living rooms, bedrooms, backyard oasis"
2. **Core** — Lifestyle / residential-set shooting locations (kitchen, living room, bedroom, backyard). **STATUS: "Coming soon!"** — placeholder.
4. **Pricing** — None ("Coming soon").
5. **Specs** — None beyond room types listed.
6/7. **Booking/Policies** — Generic 4-step + shared policy boilerplate (3x weekly, by-appointment pickup, etc.).
10. **Images** — Logo only.
13. **Outdated** — Placeholder; not launched. Membership page already promises "discounted lifestyle shooting spaces," so this is a planned product.
14. **Destination** — `/studio` (or hold for a dedicated lifestyle-space/content-creator page). Possible fit for `/content-creator-studio-denver`.

---

## Lower-priority pages (brief)

### https://photospacedenver.com/workshops/
Title "WORKSHOPS – PHOTOSPACE"; H1 "workshops join photospace in a series of creative photography workshops." Overview of photography workshops (camera fundamentals, "Strobe Lighting 101," "Beauty Lighting," portrait/fashion/beauty/product/food). No dates, no pricing. Moderate keyword value but no event detail. → `/services` or 410. SEO: low-moderate.

### https://photospacedenver.com/workshop/
H1 "WORKSHOP." Stale placeholder: "Check back soon for info on our summer workshops!" No content. → 410 / 301 to `/`. SEO: none.

### https://photospacedenver.com/workshop-casting/
Title "WORKSHOP CASTING – PHOTOSPACE"; H1 "Are you interested in modeling or contributing hair/makeup styling to one of our workshops?" Casting form: Name/Email/Phone (req), participation type (Model/Hair/Makeup), photo upload (≤2 files, 20MB, JPG/PNG/HEIC/TIF/PDF). Niche. → 410 / `/`. SEO: low.

### https://photospacedenver.com/internship/
Title "INTERNSHIP – PHOTOSPACE"; H1 "photospace | studio internship program." 8-week, 16+ hrs/week internship for intermediate photographers, mentored by owner Dan Jahn. Form: Name/Phone/Email (req), Website, school-credit toggle, "why would you like this internship?" Minor local-SEO value ("photography internship Denver"). → `/about` or 410. Confirms owner = Dan Jahn.

### https://photospacedenver.com/privacy-statement-us/
Title "Privacy Statement (US) – PHOTOSPACE." Boilerplate (likely Complianz/Termly generator); extraction returned only nav/footer. → `/policies`. SEO: none.

### https://photospacedenver.com/disclaimer/
Title "Disclaimer – PHOTOSPACE." Boilerplate; nav/footer only in extraction. → `/policies` / 410. SEO: none.

### https://photospacedenver.com/imprint/
Title "Imprint – PHOTOSPACE." EU-style boilerplate (Complianz). Confirms NAP (209 Kalamath St Unit One; (303) 284-6057). Redundant for a US business. → `/policies` or 410. SEO: none.

### https://photospacedenver.com/blog/
Title "BLOG – PHOTOSPACE." 12 posts, **2013–2018**, mostly dated PR/event news. Full list:
1. New Lifestyle Kitchen Location near DIA (2018-06-08)
2. Professional Photography Experience @ Photospace (2018-03-27) — Hasselblad/Broncolor
3. Owner Dan Jahn @ AirWorks Conference (2017-11-05)
4. Hasselblad H6D-100 Makes Art Project Possible (2017-08-27)
5. Lifestyle Photography Workshop – 24 Sept 2017 (2017-07-03)
6. Hasselblad/Broncolor Demo Day (2016-05-27)
7. Phase One XF 100MP Rollout + Capture One Training (2016-01-14)
8. BlackMagic Pocket Cinema Camera: Review (2014-02-08)
9. New Booking System (2013-12-22)
10. Assistant Kit (2013-09-08)
**Lasting SEO value:** essentially none. The only mildly evergreen post is **"Assistant Kit"** (a photo-assistant gear checklist) — could be refreshed as an evergreen resource if desired. Everything else is stale event PR. Recommendation: 410 the index and posts (or 301 to `/`), optionally salvage "Assistant Kit" content into a new resource. Note: blog confirms brands once carried (Hasselblad H6D-100, Broncolor) and owner Dan Jahn.

---

## Junk / utility pages

| URL | Status | Recommendation |
|---|---|---|
| `/mj-test/` | Test page ("MJ Test" / "Untitled") | 410 / delete. Do not index. |
| `/thank-you/` | Form-submission confirmation ("THANK YOU! Thank you for your submission!") | Keep as generic form success page (or new route). |
| `/contact/` | **HTTP 404** today | Build net-new `/contact` on rebuild. |
| `/update-information/` | Login-gated customer-info update form ("Please log in to your account to access this form") | Account flow only; not public. |
| `/sitemap/` | Not fetched | Utility — regenerate via Next.js sitemap; 301/410 old. |
| `/opt-out-preferences/` | Not fetched | Consent/cookie utility (Complianz) — replace w/ new consent tool; 410. |
| `/registered/` | Not fetched | Likely post-registration confirmation — utility; map to thank-you/account. |

---

## Unknowns / needs confirmation

1. **Weekly/multi-day rate: 3x vs 4x.** /studio/ and home say studio "Weekly = 4x day rate"; /gear/, /how-to-rent/, /lifespace/, and /policies/ all say weekly / Mon–Fri "3x daily rate." Likely studio = 4x, equipment = 3x — but CONFIRM the intended rule per product.
2. **Card processing fee: 3% vs 3.5%.** /policies/ states "3% service charge"; /estimate/ + /request-estimate/ forms state "Credit Card 3.5% fee." Confirm correct number.
3. **Canonical email.** `inquiries@photospacedenver.com` (/location/) vs `contact@photospacedenver.com` (/gear/, /grip/). Confirm which to publish; most pages obfuscate it.
4. **"Since 2008" vs "20+ years experience."** Founding year 2008 vs location-scouting "20+ years in the Colorado creative community." Confirm official founding year for About page / schema.
5. **Booking platform identity.** /book-online/ uses an embedded studio-quick-book widget (add-ons, date/time, payment) and /no-insurance/ confirms **Stripe**; membership uses **Acuity Scheduling**; studio access uses **UniFi Access (ui.com)**. Confirm the actual booking/rental SaaS (Booqable? Checkfront? custom WP plugin?) so data/integration can be migrated.
6. **/membership-payment/ functionality.** Extracted as thin/empty (no visible form, no detected processor). Confirm if it's a live Stripe checkout behind JS or dead.
7. **APPLY NOW destination /membership-conversation and /registration-conversation** are real pages not in the original audit list — confirm their content (likely conversational intake forms) for migration.
8. **Floor plan PDF.** /studio/ references "Download floor plan PDF" but the exact media URL wasn't captured — locate in WP media library (likely under /wp-content/uploads/) and preserve.
9. **Studio/gear images.** Most pages returned only the logo PNG via WebFetch (galleries are JS/lazy-loaded). Studio tour photos, gear product shots, and ShootPod/LifeSpace images should be pulled directly from the WP media library before decommissioning — high value, not captured here.
10. **LifeSpace launch status.** "Coming soon"; membership already markets "discounted lifestyle shooting spaces." Confirm whether to build it now (e.g., as `/content-creator-studio-denver`) or omit.
11. **Sister site merge (photospace.studio).** Not in scope of this WP audit, but flagged: content/SEO from photospace.studio must be reconciled with the above before finalizing routes/redirects.
12. **/join/ mismatch.** URL implies "join membership" but page is crew recruitment — ensure redirect logic does NOT send membership intent to the crew form.
