export type BedroomMix = Record<"Studio" | "1 BR" | "2 BR" | "3 BR", number>

export type PermitCategory = "new-construction" | "conversion" | "renovation"

export type Permit = {
  id: string
  zip: string
  addr: string
  lat: number
  lng: number
  units: number
  type: string
  category: PermitCategory
  status: "Permitted" | "Pending" | "Under Review"
  dev: string
  est: string
  filed: string
}

export type ZipRecord = {
  zip: string
  name: string
  hood: string
  score: number
  rent: number
  rg: number
  qg: number
  vac: number
  cap: number
  rbt: BedroomMix
  insight: string
}

export const ZIP_WHITELIST = [
  "33109", "33139", "33140", "33141", "33154",
  "33160", "33161", "33162", "33167", "33168", "33181",
] as const

export const ZIPS: ZipRecord[] = [
  { zip: "33109", name: "Fisher Island", hood: "City of Miami Beach — Fisher Island", score: 95, rent: 8400, rg: 4.5, qg: 1.8, vac: 1.2, cap: 3.2, rbt: { Studio: 5000, "1 BR": 7000, "2 BR": 9500, "3 BR": 15000 }, insight: "Fisher Island is a private, ferry-only community commanding the highest per-unit values in Miami-Dade. Vacancy below 2%, near-zero pipeline, demand driven by global UHNWIs." },
  { zip: "33139", name: "South Beach", hood: "City of Miami Beach — South", score: 87, rent: 4180, rg: 3.2, qg: 1.1, vac: 3.8, cap: 4.1, rbt: { Studio: 2600, "1 BR": 3400, "2 BR": 4500, "3 BR": 5800 }, insight: "Commands highest non-Fisher rents in metro. Historic district rules and FEMA flood regs constrain new supply." },
  { zip: "33140", name: "Mid-Beach", hood: "City of Miami Beach — Mid", score: 82, rent: 3960, rg: 2.9, qg: 1, vac: 3.5, cap: 4.2, rbt: { Studio: 2400, "1 BR": 3200, "2 BR": 4200, "3 BR": 5500 }, insight: "Benefits from South Beach demand spillover. Boutique product outperforming large Class A on per-unit rent." },
  { zip: "33141", name: "North Beach", hood: "City of Miami Beach — North", score: 68, rent: 3120, rg: 2.1, qg: 0.8, vac: 4.8, cap: 4.5, rbt: { Studio: 1900, "1 BR": 2600, "2 BR": 3400, "3 BR": 4500 }, insight: "Trades at meaningful discount to South/Mid Beach — a value-add opportunity." },
  { zip: "33154", name: "Surfside / Bal Harbour", hood: "City of Miami Beach — Surfside / Bal Harbour", score: 79, rent: 3740, rg: 2.7, qg: 1.0, vac: 3.2, cap: 4.0, rbt: { Studio: 2300, "1 BR": 3100, "2 BR": 4100, "3 BR": 5200 }, insight: "Affluent enclave between North Beach and Sunny Isles. Low pipeline and tight vacancy signal undersupply." },
  { zip: "33160", name: "Sunny Isles", hood: "City of Sunny Isles Beach", score: 73, rent: 3520, rg: 2.4, qg: 0.9, vac: 4.1, cap: 4.7, rbt: { Studio: 2200, "1 BR": 2850, "2 BR": 3750, "3 BR": 4900 }, insight: "High barrier coastal product with strong international demand. Pipeline primarily upper-tier units." },
  { zip: "33161", name: "North Miami", hood: "City of North Miami", score: 76, rent: 2710, rg: 1.9, qg: 0.8, vac: 5.1, cap: 5.4, rbt: { Studio: 1500, "1 BR": 2100, "2 BR": 2800, "3 BR": 3600 }, insight: "Strongest value-add basis in focus area. R4 upzone on NE 125th St unlocks 8-story density." },
  { zip: "33162", name: "N. Miami NE", hood: "North Miami / Ojus Corridor", score: 64, rent: 2380, rg: 1.6, qg: 0.7, vac: 5.8, cap: 5.8, rbt: { Studio: 1400, "1 BR": 1900, "2 BR": 2500, "3 BR": 3200 }, insight: "Yield profile attractive but must account for elevated vacancy and heavier delivery calendar." },
  { zip: "33167", name: "North Miami NW", hood: "City of North Miami — NW Corridor", score: 62, rent: 2240, rg: 1.5, qg: 0.6, vac: 6.2, cap: 6.1, rbt: { Studio: 1250, "1 BR": 1750, "2 BR": 2350, "3 BR": 3000 }, insight: "Workforce housing corridor with LIHTC activity. Best suited for mission-driven or tax-credit strategies." },
  { zip: "33168", name: "North Miami Central", hood: "City of North Miami — Central", score: 70, rent: 2520, rg: 1.7, qg: 0.7, vac: 5.4, cap: 5.6, rbt: { Studio: 1400, "1 BR": 2000, "2 BR": 2650, "3 BR": 3350 }, insight: "Benefits from adjacency to FIU Biscayne Bay Campus and the MOCA Arts District." },
  { zip: "33181", name: "North Miami South", hood: "City of North Miami — South / Biscayne Park", score: 72, rent: 2620, rg: 1.8, qg: 0.8, vac: 4.9, cap: 5.2, rbt: { Studio: 1450, "1 BR": 2050, "2 BR": 2750, "3 BR": 3500 }, insight: "Quieter residential pocket bordering Biscayne Park. Sleeper for small-scale multifamily and townhome infill." },
]

const CURRENT_PERMITS: Permit[] = [
  // === NEW CONSTRUCTION / FOUNDATION ===
  { id: "nc-1", zip: "33139", addr: "430 W 41st St", lat: 25.8125, lng: -80.1405, units: 104, type: "Class A MFR", category: "new-construction", status: "Under Review", dev: "Rockpoint Group", est: "Q2 2027", filed: "2026-04-02" },
  { id: "nc-2", zip: "33139", addr: "1428 Ocean Dr", lat: 25.7855, lng: -80.1301, units: 62, type: "Luxury Rental", category: "new-construction", status: "Permitted", dev: "Terra Group", est: "Q3 2026", filed: "2026-03-15" },
  { id: "nc-3", zip: "33140", addr: "4525 Collins Ave", lat: 25.8218, lng: -80.1266, units: 42, type: "Boutique Luxury Resi", category: "new-construction", status: "Permitted", dev: "Setai Dev", est: "Q4 2026", filed: "2026-03-10" },
  { id: "nc-4", zip: "33141", addr: "6900 Collins Ave", lat: 25.8452, lng: -80.1213, units: 56, type: "Class A MFR", category: "new-construction", status: "Pending", dev: "Ocean Ventures", est: "Q3 2027", filed: "2026-03-22" },
  { id: "nc-5", zip: "33141", addr: "7550 Byron Ave", lat: 25.8508, lng: -80.1258, units: 40, type: "Mid-Rise Resi", category: "new-construction", status: "Pending", dev: "Coastal Builders", est: "Q4 2027", filed: "2026-02-28" },
  { id: "nc-6", zip: "33154", addr: "9500 Collins Ave", lat: 25.8725, lng: -80.1218, units: 28, type: "Boutique Luxury Resi", category: "new-construction", status: "Permitted", dev: "Surf Club Dev", est: "Q1 2027", filed: "2026-03-05" },
  { id: "nc-7", zip: "33160", addr: "17501 Collins Ave", lat: 25.9365, lng: -80.1228, units: 88, type: "Luxury Rental Tower", category: "new-construction", status: "Permitted", dev: "Atlantic Crest", est: "Q4 2027", filed: "2026-03-28" },
  { id: "nc-8", zip: "33160", addr: "19000 N Bay Rd", lat: 25.9432, lng: -80.1310, units: 54, type: "Mid-Rise MFR", category: "new-construction", status: "Pending", dev: "Harborline Partners", est: "Q2 2028", filed: "2026-02-18" },
  { id: "nc-9", zip: "33161", addr: "1600 NE 125th St", lat: 25.8893, lng: -80.1742, units: 54, type: "Mixed-Use Resi", category: "new-construction", status: "Permitted", dev: "NMB Capital", est: "Q1 2027", filed: "2026-03-30" },
  { id: "nc-10", zip: "33161", addr: "12800 NE 8th Ave", lat: 25.8905, lng: -80.1685, units: 96, type: "Garden-Style MFR", category: "new-construction", status: "Pending", dev: "Keystone Partners", est: "Q2 2027", filed: "2026-03-12" },
  { id: "nc-11", zip: "33162", addr: "14900 NE 20th Ave", lat: 25.9152, lng: -80.1575, units: 112, type: "Workforce MFR", category: "new-construction", status: "Under Review", dev: "Sunline Housing", est: "Q3 2028", filed: "2026-02-05" },
  { id: "nc-12", zip: "33162", addr: "2210 NE 163rd St", lat: 25.9280, lng: -80.1618, units: 64, type: "Mixed-Income Resi", category: "new-construction", status: "Pending", dev: "Gateway Urban", est: "Q1 2028", filed: "2026-03-01" },
  { id: "nc-13", zip: "33167", addr: "1200 NW 135th St", lat: 25.8985, lng: -80.2052, units: 72, type: "Workforce MFR", category: "new-construction", status: "Pending", dev: "Community Housing Group", est: "Q4 2027", filed: "2026-03-22" },
  { id: "nc-14", zip: "33167", addr: "700 NW 119th St", lat: 25.8835, lng: -80.2015, units: 40, type: "Garden-Style MFR", category: "new-construction", status: "Under Review", dev: "Greenway Partners", est: "Q2 2028", filed: "2026-02-10" },
  { id: "nc-15", zip: "33168", addr: "13600 NE 6th Ave", lat: 25.8965, lng: -80.1788, units: 64, type: "Mixed-Use Resi", category: "new-construction", status: "Permitted", dev: "NoMi Development", est: "Q3 2027", filed: "2026-03-18" },
  { id: "nc-16", zip: "33168", addr: "890 NE 125th Ter", lat: 25.8900, lng: -80.1815, units: 48, type: "Class B+ MFR", category: "new-construction", status: "Pending", dev: "Pinnacle Urban", est: "Q1 2028", filed: "2026-02-22" },
  { id: "nc-17", zip: "33181", addr: "1850 NE 135th St", lat: 25.8992, lng: -80.1635, units: 36, type: "Townhome Cluster", category: "new-construction", status: "Permitted", dev: "BayPark Homes", est: "Q2 2027", filed: "2026-03-12" },
  { id: "nc-18", zip: "33181", addr: "500 NE 151st St", lat: 25.9118, lng: -80.1658, units: 26, type: "Boutique Resi", category: "new-construction", status: "Under Review", dev: "SilverLine Dev", est: "Q4 2027", filed: "2026-02-15" },
  { id: "nc-19", zip: "33109", addr: "One Fisher Island Dr", lat: 25.7632, lng: -80.1437, units: 18, type: "Ultra-Luxury Condo", category: "new-construction", status: "Permitted", dev: "Fisher Island Dev", est: "Q2 2026", filed: "2026-01-08" },
  { id: "nc-20", zip: "33154", addr: "301 96th St", lat: 25.8690, lng: -80.1255, units: 24, type: "Mid-Rise Resi", category: "new-construction", status: "Pending", dev: "Harbour Capital", est: "Q3 2027", filed: "2026-03-25" },
  { id: "nc-21", zip: "33140", addr: "3900 Indian Creek Dr", lat: 25.8175, lng: -80.1295, units: 42, type: "Luxury MFR", category: "new-construction", status: "Pending", dev: "Beach Capital", est: "Q2 2027", filed: "2026-04-05" },

  // === CONVERSION (change-of-use) ===
  { id: "cv-1", zip: "33139", addr: "855 Collins Ave", lat: 25.7792, lng: -80.1319, units: 44, type: "Hotel-to-Resi", category: "conversion", status: "Pending", dev: "Brickman RE", est: "Q1 2027", filed: "2026-04-01" },
  { id: "cv-2", zip: "33139", addr: "1200 Washington Ave", lat: 25.7830, lng: -80.1345, units: 32, type: "Retail-to-Resi", category: "conversion", status: "Permitted", dev: "Crescent Heights", est: "Q4 2026", filed: "2026-03-20" },
  { id: "cv-3", zip: "33139", addr: "760 Ocean Dr", lat: 25.7745, lng: -80.1292, units: 28, type: "Hotel-to-Condo", category: "conversion", status: "Under Review", dev: "Shvo Group", est: "Q3 2027", filed: "2026-04-07" },
  { id: "cv-4", zip: "33140", addr: "4401 Collins Ave", lat: 25.8200, lng: -80.1272, units: 38, type: "Hotel-to-Resi", category: "conversion", status: "Permitted", dev: "Fontainebleau Development", est: "Q1 2027", filed: "2026-03-08" },
  { id: "cv-5", zip: "33141", addr: "6345 Collins Ave", lat: 25.8415, lng: -80.1225, units: 22, type: "Retail-to-Resi", category: "conversion", status: "Pending", dev: "North Beach Partners", est: "Q2 2027", filed: "2026-03-28" },
  { id: "cv-6", zip: "33140", addr: "5001 Indian Creek Dr", lat: 25.8245, lng: -80.1285, units: 18, type: "Office-to-Resi", category: "conversion", status: "Under Review", dev: "Mast Capital", est: "Q4 2027", filed: "2026-02-14" },
  { id: "cv-7", zip: "33160", addr: "18001 Collins Ave", lat: 25.9395, lng: -80.1232, units: 46, type: "Hotel-to-Condo", category: "conversion", status: "Pending", dev: "Dezer Development", est: "Q1 2028", filed: "2026-03-15" },
  { id: "cv-8", zip: "33154", addr: "9601 Collins Ave", lat: 25.8735, lng: -80.1215, units: 16, type: "Retail-to-Resi", category: "conversion", status: "Permitted", dev: "Bal Harbour Group", est: "Q3 2026", filed: "2026-03-02" },
  { id: "cv-9", zip: "33161", addr: "990 NE 125th St", lat: 25.8890, lng: -80.1760, units: 20, type: "Warehouse-to-Resi", category: "conversion", status: "Under Review", dev: "Urban Core Dev", est: "Q2 2027", filed: "2026-04-03" },

  // === RENOVATION ===
  { id: "rv-1", zip: "33139", addr: "1601 Collins Ave", lat: 25.7875, lng: -80.1310, units: 84, type: "Full Rehab — Class B to A", category: "renovation", status: "Permitted", dev: "Related Group", est: "Q2 2026", filed: "2026-03-25" },
  { id: "rv-2", zip: "33139", addr: "1330 West Ave", lat: 25.7862, lng: -80.1418, units: 56, type: "Systems Upgrade + Amenity", category: "renovation", status: "Permitted", dev: "Aimco", est: "Q3 2026", filed: "2026-04-01" },
  { id: "rv-3", zip: "33140", addr: "4100 Pine Tree Dr", lat: 25.8190, lng: -80.1325, units: 32, type: "Interior Rehab — Value-Add", category: "renovation", status: "Permitted", dev: "Starwood Capital", est: "Q4 2026", filed: "2026-03-18" },
  { id: "rv-4", zip: "33141", addr: "7300 Harding Ave", lat: 25.8485, lng: -80.1272, units: 48, type: "Full Rehab — Repositioning", category: "renovation", status: "Permitted", dev: "Greystar", est: "Q1 2027", filed: "2026-03-12" },
  { id: "rv-5", zip: "33141", addr: "7100 Byron Ave", lat: 25.8470, lng: -80.1260, units: 28, type: "Envelope + MEP Upgrade", category: "renovation", status: "Pending", dev: "Bridge Investment", est: "Q2 2027", filed: "2026-03-30" },
  { id: "rv-6", zip: "33161", addr: "12500 NE 6th Ave", lat: 25.8880, lng: -80.1695, units: 72, type: "Full Rehab — Value-Add", category: "renovation", status: "Permitted", dev: "Blackstone RE", est: "Q3 2026", filed: "2026-04-05" },
  { id: "rv-7", zip: "33161", addr: "1200 NE 123rd St", lat: 25.8870, lng: -80.1720, units: 40, type: "Interior Rehab", category: "renovation", status: "Pending", dev: "Cortland", est: "Q4 2026", filed: "2026-03-08" },
  { id: "rv-8", zip: "33162", addr: "16200 NE 18th Ave", lat: 25.9210, lng: -80.1590, units: 96, type: "Full Rehab — Repositioning", category: "renovation", status: "Permitted", dev: "Morgan Properties", est: "Q2 2027", filed: "2026-02-25" },
  { id: "rv-9", zip: "33168", addr: "13200 NE 4th Ave", lat: 25.8945, lng: -80.1798, units: 36, type: "Envelope + Amenity Add", category: "renovation", status: "Permitted", dev: "Zenith Capital", est: "Q1 2027", filed: "2026-03-14" },
  { id: "rv-10", zip: "33181", addr: "1500 NE 140th St", lat: 25.9035, lng: -80.1645, units: 24, type: "Interior Rehab — Value-Add", category: "renovation", status: "Pending", dev: "Alliance Residential", est: "Q3 2027", filed: "2026-04-08" },
  { id: "rv-11", zip: "33160", addr: "17900 Collins Ave", lat: 25.9385, lng: -80.1230, units: 52, type: "Systems Upgrade + Reno", category: "renovation", status: "Permitted", dev: "Turnberry Associates", est: "Q4 2026", filed: "2026-03-05" },
  { id: "rv-12", zip: "33154", addr: "9400 Collins Ave", lat: 25.8715, lng: -80.1220, units: 20, type: "Interior Rehab", category: "renovation", status: "Permitted", dev: "One Sotheby's Dev", est: "Q2 2026", filed: "2026-02-20" },
  { id: "rv-13", zip: "33167", addr: "1100 NW 132nd St", lat: 25.8970, lng: -80.2040, units: 44, type: "Full Rehab — Workforce", category: "renovation", status: "Pending", dev: "Housing Trust Group", est: "Q1 2028", filed: "2026-03-20" },
  { id: "rv-14", zip: "33109", addr: "7 Fisher Island Dr", lat: 25.7628, lng: -80.1440, units: 12, type: "Luxury Rehab", category: "renovation", status: "Permitted", dev: "Fisher Island Holdings", est: "Q3 2026", filed: "2026-01-15" },
  { id: "rv-15", zip: "33139", addr: "1500 Bay Rd", lat: 25.7890, lng: -80.1395, units: 68, type: "Full Rehab — Class B to A", category: "renovation", status: "Pending", dev: "Lincoln Property", est: "Q1 2027", filed: "2026-04-09" },
  { id: "rv-16", zip: "33162", addr: "1900 NE 164th St", lat: 25.9290, lng: -80.1620, units: 34, type: "Interior + Amenity Rehab", category: "renovation", status: "Pending", dev: "Priderock Capital", est: "Q2 2027", filed: "2026-03-28" },
]

type ZipProfile = {
  zip: string
  minPerMonth: number
  maxPerMonth: number
  trend: "rising" | "declining" | "steady" | "sharp-rise"
  ncWeight: number
  cvWeight: number
  rvWeight: number
  latCenter: number
  lngCenter: number
  latSpread: number
  lngSpread: number
  streets: string[]
  developers: string[]
  ncTypes: string[]
  cvTypes: string[]
  rvTypes: string[]
}

const ZIP_PROFILES: ZipProfile[] = [
  {
    zip: "33139", minPerMonth: 15, maxPerMonth: 25, trend: "rising",
    ncWeight: 0.40, cvWeight: 0.30, rvWeight: 0.30,
    latCenter: 25.7850, lngCenter: -80.1350, latSpread: 0.015, lngSpread: 0.008,
    streets: ["Collins Ave", "Ocean Dr", "Washington Ave", "Alton Rd", "West Ave", "Meridian Ave", "Bay Rd", "Euclid Ave", "Drexel Ave", "Purdy Ave", "Lincoln Rd", "Espanola Way", "5th St", "14th St", "21st St"],
    developers: ["Terra Group", "Rockpoint Group", "Related Group", "Crescent Heights", "Shvo Group", "Brickman RE", "Lincoln Property", "Aimco"],
    ncTypes: ["Class A MFR", "Luxury Rental", "Mixed-Use Resi", "Boutique Luxury Resi"],
    cvTypes: ["Hotel-to-Resi", "Retail-to-Resi", "Hotel-to-Condo"],
    rvTypes: ["Full Rehab — Class B to A", "Systems Upgrade + Amenity", "Interior Rehab — Value-Add"],
  },
  {
    zip: "33140", minPerMonth: 10, maxPerMonth: 18, trend: "steady",
    ncWeight: 0.35, cvWeight: 0.30, rvWeight: 0.35,
    latCenter: 25.8200, lngCenter: -80.1300, latSpread: 0.008, lngSpread: 0.006,
    streets: ["Collins Ave", "Indian Creek Dr", "Pine Tree Dr", "Alton Rd", "Sheridan Ave", "Prairie Ave", "Royal Palm Ave", "Meridian Ave"],
    developers: ["Setai Dev", "Beach Capital", "Fontainebleau Development", "Mast Capital", "Starwood Capital"],
    ncTypes: ["Boutique Luxury Resi", "Class A MFR", "Luxury MFR", "Mid-Rise Resi"],
    cvTypes: ["Hotel-to-Resi", "Office-to-Resi", "Retail-to-Resi"],
    rvTypes: ["Interior Rehab — Value-Add", "Full Rehab — Repositioning", "Envelope + MEP Upgrade"],
  },
  {
    zip: "33141", minPerMonth: 8, maxPerMonth: 15, trend: "rising",
    ncWeight: 0.40, cvWeight: 0.25, rvWeight: 0.35,
    latCenter: 25.8450, lngCenter: -80.1245, latSpread: 0.010, lngSpread: 0.005,
    streets: ["Collins Ave", "Harding Ave", "Byron Ave", "Indian Creek Dr", "Abbott Ave", "Carlyle Ave"],
    developers: ["Ocean Ventures", "Coastal Builders", "North Beach Partners", "Greystar", "Bridge Investment"],
    ncTypes: ["Class A MFR", "Mid-Rise Resi", "Garden-Style MFR"],
    cvTypes: ["Retail-to-Resi", "Hotel-to-Resi"],
    rvTypes: ["Full Rehab — Repositioning", "Envelope + MEP Upgrade", "Interior Rehab"],
  },
  {
    zip: "33154", minPerMonth: 5, maxPerMonth: 10, trend: "steady",
    ncWeight: 0.30, cvWeight: 0.25, rvWeight: 0.45,
    latCenter: 25.8715, lngCenter: -80.1240, latSpread: 0.005, lngSpread: 0.004,
    streets: ["Collins Ave", "Harding Ave", "Abbott Ave", "96th St", "Bal Bay Dr"],
    developers: ["Surf Club Dev", "Harbour Capital", "Bal Harbour Group", "One Sotheby's Dev"],
    ncTypes: ["Boutique Luxury Resi", "Mid-Rise Resi"],
    cvTypes: ["Retail-to-Resi", "Hotel-to-Resi"],
    rvTypes: ["Interior Rehab", "Full Rehab — Repositioning", "Envelope + Amenity Add"],
  },
  {
    zip: "33160", minPerMonth: 12, maxPerMonth: 22, trend: "declining",
    ncWeight: 0.40, cvWeight: 0.25, rvWeight: 0.35,
    latCenter: 25.9380, lngCenter: -80.1260, latSpread: 0.010, lngSpread: 0.008,
    streets: ["Collins Ave", "N Bay Rd", "Sunny Isles Blvd", "Ocean Blvd", "Atlantic Blvd", "Golden Beach Dr"],
    developers: ["Atlantic Crest", "Harborline Partners", "Dezer Development", "Turnberry Associates"],
    ncTypes: ["Luxury Rental Tower", "Mid-Rise MFR", "Class A MFR"],
    cvTypes: ["Hotel-to-Condo", "Hotel-to-Resi"],
    rvTypes: ["Systems Upgrade + Reno", "Full Rehab — Repositioning", "Interior Rehab — Value-Add"],
  },
  {
    zip: "33161", minPerMonth: 10, maxPerMonth: 18, trend: "sharp-rise",
    ncWeight: 0.45, cvWeight: 0.20, rvWeight: 0.35,
    latCenter: 25.8895, lngCenter: -80.1720, latSpread: 0.008, lngSpread: 0.008,
    streets: ["NE 125th St", "NE 6th Ave", "NE 8th Ave", "NE 10th Ave", "NE 123rd St", "NE 126th St", "NE 127th St", "NE 12th Ave", "NE 7th Ave", "NE 9th Ave"],
    developers: ["NMB Capital", "Keystone Partners", "Urban Core Dev", "Blackstone RE", "Cortland"],
    ncTypes: ["Mixed-Use Resi", "Garden-Style MFR", "Class A MFR"],
    cvTypes: ["Warehouse-to-Resi", "Retail-to-Resi"],
    rvTypes: ["Full Rehab — Value-Add", "Interior Rehab — Value-Add", "Interior Rehab"],
  },
  {
    zip: "33162", minPerMonth: 8, maxPerMonth: 14, trend: "steady",
    ncWeight: 0.40, cvWeight: 0.15, rvWeight: 0.45,
    latCenter: 25.9200, lngCenter: -80.1590, latSpread: 0.010, lngSpread: 0.006,
    streets: ["NE 20th Ave", "NE 163rd St", "NE 18th Ave", "NE 22nd Ave", "NE 162nd St", "NE 160th St", "NE 164th St", "NE 16th Ave", "NE 19th Ave", "NE 21st Ave"],
    developers: ["Sunline Housing", "Gateway Urban", "Morgan Properties", "Priderock Capital"],
    ncTypes: ["Workforce MFR", "Mixed-Income Resi", "Garden-Style MFR"],
    cvTypes: ["Retail-to-Resi", "Office-to-Resi"],
    rvTypes: ["Full Rehab — Repositioning", "Systems Upgrade + Reno", "Interior + Amenity Rehab"],
  },
  {
    zip: "33167", minPerMonth: 4, maxPerMonth: 8, trend: "rising",
    ncWeight: 0.45, cvWeight: 0.05, rvWeight: 0.50,
    latCenter: 25.8940, lngCenter: -80.2035, latSpread: 0.008, lngSpread: 0.005,
    streets: ["NW 135th St", "NW 119th St", "NW 131st St", "NW 125th St", "NW 130th St", "NW 128th St", "NW 133rd St", "NW 132nd St"],
    developers: ["Community Housing Group", "Greenway Partners", "Housing Trust Group"],
    ncTypes: ["Workforce MFR", "Garden-Style MFR"],
    cvTypes: ["Warehouse-to-Resi"],
    rvTypes: ["Full Rehab — Workforce", "Interior Rehab", "Systems Upgrade + Reno"],
  },
  {
    zip: "33168", minPerMonth: 6, maxPerMonth: 12, trend: "rising",
    ncWeight: 0.40, cvWeight: 0.15, rvWeight: 0.45,
    latCenter: 25.8950, lngCenter: -80.1800, latSpread: 0.006, lngSpread: 0.004,
    streets: ["NE 6th Ave", "NE 5th Ave", "NE 4th Ave", "NE 8th Ave", "NE 125th Ter", "NE 2nd Ave", "NE 3rd Ave", "NE 7th Ave"],
    developers: ["NoMi Development", "Pinnacle Urban", "Zenith Capital"],
    ncTypes: ["Mixed-Use Resi", "Class B+ MFR", "Mid-Rise Resi"],
    cvTypes: ["Retail-to-Resi", "Office-to-Resi"],
    rvTypes: ["Envelope + Amenity Add", "Interior Rehab", "Full Rehab — Repositioning"],
  },
  {
    zip: "33181", minPerMonth: 5, maxPerMonth: 10, trend: "steady",
    ncWeight: 0.40, cvWeight: 0.10, rvWeight: 0.50,
    latCenter: 25.9040, lngCenter: -80.1648, latSpread: 0.008, lngSpread: 0.004,
    streets: ["NE 135th St", "NE 137th St", "NE 140th St", "NE 142nd St", "NE 144th St", "NE 138th St", "NE 151st St"],
    developers: ["BayPark Homes", "SilverLine Dev", "Alliance Residential"],
    ncTypes: ["Townhome Cluster", "Boutique Resi", "Garden-Style MFR"],
    cvTypes: ["Retail-to-Resi"],
    rvTypes: ["Interior Rehab — Value-Add", "Full Rehab — Repositioning", "Envelope + MEP Upgrade"],
  },
  {
    zip: "33109", minPerMonth: 1, maxPerMonth: 3, trend: "steady",
    ncWeight: 0.40, cvWeight: 0.05, rvWeight: 0.55,
    latCenter: 25.7632, lngCenter: -80.1439, latSpread: 0.002, lngSpread: 0.002,
    streets: ["Fisher Island Dr", "Marina Dr", "Bay Ln", "Island Way"],
    developers: ["Fisher Island Dev", "Fisher Island Holdings"],
    ncTypes: ["Ultra-Luxury Condo"],
    cvTypes: ["Hotel-to-Resi"],
    rvTypes: ["Luxury Rehab", "Interior Rehab — Value-Add"],
  },
]

function seedRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function generateHistoricalPermits(): Permit[] {
  const permits: Permit[] = []
  const rng = seedRandom(42_7139)

  const startYear = 2024
  const startMonth = 3 // April (0-indexed)
  const endYear = 2026
  const endMonth = 3 // April 2026

  const threeMonthsAgo = new Date(2026, 0, 10) // Jan 10 2026 as cutoff for recent

  let idCounter = 0

  for (const profile of ZIP_PROFILES) {
    const cursor = new Date(startYear, startMonth, 1)
    const end = new Date(endYear, endMonth, 1)
    let quarterIdx = 0

    while (cursor < end) {
      const year = cursor.getFullYear()
      const month = cursor.getMonth()
      const totalQuarters = 9 // Q2 2024 to Q2 2026
      const trendProgress = quarterIdx / totalQuarters

      let base: number
      switch (profile.trend) {
        case "rising":
          base = profile.minPerMonth + (profile.maxPerMonth - profile.minPerMonth) * trendProgress * 0.8
          break
        case "sharp-rise":
          base = profile.minPerMonth + (profile.maxPerMonth - profile.minPerMonth) * Math.pow(trendProgress, 0.6)
          break
        case "declining":
          base = profile.maxPerMonth - (profile.maxPerMonth - profile.minPerMonth) * trendProgress * 0.6
          break
        default:
          base = (profile.minPerMonth + profile.maxPerMonth) / 2
      }

      const noise = (rng() - 0.5) * 4
      const count = Math.max(1, Math.round(base + noise))
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      for (let i = 0; i < count; i++) {
        idCounter++
        const day = Math.min(daysInMonth, Math.max(1, Math.floor(rng() * daysInMonth) + 1))
        const filedDate = new Date(year, month, day)
        const filedStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

        const catRoll = rng()
        let category: PermitCategory
        let typePool: string[]
        if (catRoll < profile.ncWeight) {
          category = "new-construction"
          typePool = profile.ncTypes
        } else if (catRoll < profile.ncWeight + profile.cvWeight) {
          category = "conversion"
          typePool = profile.cvTypes
        } else {
          category = "renovation"
          typePool = profile.rvTypes
        }

        const pType = typePool[Math.floor(rng() * typePool.length)]
        const dev = profile.developers[Math.floor(rng() * profile.developers.length)]
        const street = profile.streets[Math.floor(rng() * profile.streets.length)]
        const streetNum = Math.floor(rng() * 19000) + 100

        const lat = profile.latCenter + (rng() - 0.5) * 2 * profile.latSpread
        const lng = profile.lngCenter + (rng() - 0.5) * 2 * profile.lngSpread

        const unitBase = category === "new-construction" ? 40 : category === "conversion" ? 25 : 35
        const unitVariance = Math.floor(rng() * 80) - 20
        const units = Math.max(8, unitBase + unitVariance)

        let status: "Permitted" | "Pending" | "Under Review"
        if (filedDate >= threeMonthsAgo) {
          const sRoll = rng()
          status = sRoll < 0.4 ? "Pending" : sRoll < 0.7 ? "Under Review" : "Permitted"
        } else {
          status = "Permitted"
        }

        const estQOffset = Math.floor(rng() * 4) + 3
        const estDate = new Date(year, month + estQOffset * 3, 1)
        const estQ = Math.floor(estDate.getMonth() / 3) + 1
        const est = `Q${estQ} ${estDate.getFullYear()}`

        permits.push({
          id: `gen-${idCounter}`,
          zip: profile.zip,
          addr: `${streetNum} ${street}`,
          lat: Math.round(lat * 10000) / 10000,
          lng: Math.round(lng * 10000) / 10000,
          units,
          type: pType,
          category,
          status,
          dev,
          est,
          filed: filedStr,
        })
      }

      cursor.setMonth(cursor.getMonth() + 1)
      if (month % 3 === 2) quarterIdx++
    }
  }

  return permits
}

export const PERMITS: Permit[] = [...CURRENT_PERMITS, ...generateHistoricalPermits()]

export const AI_SUMMARIES: Record<string, string> = {
  all: "Market-wide permit activity across Miami Beach and North Miami is trending upward with 2026 Q1 showing the highest quarterly volume in 2 years. South Beach and North Miami are driving growth — South Beach through luxury conversions and new construction, North Miami through the R4 upzone unlocking 8-story density on NE 125th St. Sunny Isles is cooling after a 2025 peak. Renovation permits are accelerating across all ZIPs, suggesting institutional capital is repositioning existing stock ahead of new supply deliveries.",
  "33109": "Fisher Island remains an ultra-exclusive micro-market with minimal permit activity (1-3/month). The few filings are luxury rehabs and single ultra-premium new construction projects. No change-of-use activity. The island's ferry-only access and $15K+ avg rents create a natural supply constraint that makes permit tracking less relevant here — focus is on off-market individual unit acquisitions.",
  "33139": "South Beach is the most active permit market in the coverage area. New construction filings accelerated sharply in Q1 2026, driven by Terra Group and Rockpoint Group entering the submarket. Hotel-to-resi and hotel-to-condo conversions are a dominant play — 3 major conversion permits filed since March 2026. The condo conversion moratorium is being tested by several developers. Renovation volume is also elevated, with Related Group and Aimco repositioning Class B assets to Class A.",
  "33140": "Mid-Beach permit activity is steady with a slight upward trend. The Fontainebleau Development hotel-to-resi conversion at 4401 Collins is the most significant recent filing — signals institutional confidence in the submarket. Boutique luxury product continues to outperform large Class A on per-unit rent. Starwood Capital's interior rehab at 4100 Pine Tree Dr is a bellwether for the value-add thesis here.",
  "33141": "North Beach is showing early signs of a breakout. Permit volume has been rising for 3 consecutive quarters as developers discover the discount to South/Mid Beach. Ocean Ventures and Coastal Builders have filed new MFR projects on Collins Ave. Greystar's full rehab at 7300 Harding Ave signals institutional renovation capital arriving. The MBRO climate overlay is complicating mixed-use plays — permits trending toward residential-only designs.",
  "33154": "Surfside/Bal Harbour activity is renovation-heavy in the wake of the Champlain Towers collapse. New construction is constrained by Bal Harbour's strict zoning. Surf Club Dev's boutique luxury project at 9500 Collins is the only major new-build. The retail-to-resi conversion at 9601 Collins by Bal Harbour Group is notable — suggests commercial vacancy is pushing landlords toward residential use. Vacancy at 3.2% is the tightest in the coverage area.",
  "33160": "Sunny Isles peaked in mid-2025 and is now cooling. The luxury tower pipeline (Atlantic Crest at 17501 Collins) is still active but new filings have slowed. International buyer demand remains but is price-sensitive at current levels. Dezer Development's hotel-to-condo conversion at 18001 Collins is a pivot from their typical ground-up strategy — may signal a top. Turnberry Associates' renovation at 17900 Collins suggests a shift toward value-add over new supply.",
  "33161": "North Miami is the breakout story. Permit volume has surged since the R4 upzone was approved on NE 125th St in February 2026, unlocking 8-story density. NMB Capital was first to file under the new zoning. Blackstone RE's full rehab at 12500 NE 6th Ave (72 units) is the largest institutional renovation play in the submarket. Land at $35-45/sf is well below coastal comps — expect continued acceleration through 2026.",
  "33162": "N. Miami NE / Ojus Corridor has steady, workforce-oriented permit activity. Sunline Housing's 112-unit workforce MFR is the largest filing. The corridor's higher vacancy (5.8%) and heavier delivery calendar require conservative underwriting. Gateway Urban's mixed-income project at 2210 NE 163rd suggests developers are hedging with income-restricted units. Morgan Properties' repositioning at 16200 NE 18th Ave is the institutional benchmark here.",
  "33167": "North Miami NW is a quiet corridor dominated by LIHTC and workforce housing filings. Community Housing Group's 72-unit project at 1200 NW 135th has LIHTC credits — signals county commitment to affordable pipeline. Greenway Partners' garden-style MFR at 700 NW 119th is under review. Housing Trust Group's workforce rehab at 1100 NW 132nd rounds out a purely mission-driven permit profile. Not a conventional investment play.",
  "33168": "North Miami Central is heating up around the MOCA Arts District and FIU Biscayne Bay Campus. NoMi Development's mixed-use filing at 13600 NE 6th Ave is ground-floor retail with 7 stories of residential — first mixed-use permit near MOCA in 18 months. Pinnacle Urban and Zenith Capital are both active. Student and young-professional demand provides a rent floor. Value-add at $10-15k/unit door is the strongest play.",
  "33181": "North Miami South is a sleeper market. Low pipeline (62 new-construction units) and moderate vacancy (4.9%) make it attractive for small-scale infill. BayPark Homes' townhome cluster at 1850 NE 135th is the type of product that works here — low-density, move-up renters priced out of Aventura. Alliance Residential's value-add rehab at 1500 NE 140th is testing institutional appetite. Proximity to Aventura and Sunny Isles drives tenant demand.",
}

export const ALERTS_SUMMARY = {
  current: "The Miami Beach and North Miami permit market is in an expansion phase. Q1 2026 saw the highest quarterly filing volume in 2 years, driven by South Beach conversions and North Miami new construction following the R4 upzone. 28 permits were filed in the last 30 days across all categories.",
  thisWeek: "This week's notable filings: Lincoln Property filed a 68-unit Class B-to-A rehab at 1500 Bay Rd in South Beach — the largest renovation permit this quarter. Alliance Residential entered North Miami South with a 24-unit value-add play. Shvo Group's hotel-to-condo conversion at 760 Ocean Dr is testing the condo moratorium boundaries.",
  thisMonth: "April 2026 highlights: Rockpoint Group's 104-unit Class A MFR at 430 W 41st St is the largest new construction filing. Three conversion permits filed in South Beach alone — hotel-to-resi, retail-to-resi, and hotel-to-condo. Blackstone RE's entry into North Miami with a 72-unit full rehab signals institutional renovation capital is flowing north of the beach.",
}
