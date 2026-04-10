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

export const PERMITS: Permit[] = [
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

  // === HISTORICAL PERMITS (2024-Q2 through 2025-Q4) ===
  // 2024-Q2
  { id: "h-1", zip: "33139", addr: "520 Collins Ave", lat: 25.7780, lng: -80.1315, units: 72, type: "Class A MFR", category: "new-construction", status: "Permitted", dev: "Related Group", est: "Q2 2026", filed: "2024-04-12" },
  { id: "h-2", zip: "33140", addr: "4200 Indian Creek Dr", lat: 25.8195, lng: -80.1290, units: 36, type: "Boutique Luxury Resi", category: "new-construction", status: "Permitted", dev: "Setai Dev", est: "Q4 2025", filed: "2024-04-22" },
  { id: "h-3", zip: "33141", addr: "7200 Collins Ave", lat: 25.8470, lng: -80.1218, units: 48, type: "Mid-Rise Resi", category: "new-construction", status: "Permitted", dev: "Coastal Builders", est: "Q1 2026", filed: "2024-05-05" },
  { id: "h-4", zip: "33161", addr: "1400 NE 123rd St", lat: 25.8875, lng: -80.1710, units: 80, type: "Garden-Style MFR", category: "new-construction", status: "Permitted", dev: "Keystone Partners", est: "Q3 2025", filed: "2024-05-18" },
  { id: "h-5", zip: "33139", addr: "900 Lincoln Rd", lat: 25.7905, lng: -80.1370, units: 30, type: "Retail-to-Resi", category: "conversion", status: "Permitted", dev: "Crescent Heights", est: "Q2 2025", filed: "2024-04-30" },
  { id: "h-6", zip: "33160", addr: "17200 Collins Ave", lat: 25.9345, lng: -80.1225, units: 60, type: "Hotel-to-Condo", category: "conversion", status: "Permitted", dev: "Dezer Development", est: "Q4 2025", filed: "2024-06-10" },
  { id: "h-7", zip: "33162", addr: "15100 NE 18th Ave", lat: 25.9165, lng: -80.1580, units: 88, type: "Full Rehab — Repositioning", category: "renovation", status: "Permitted", dev: "Morgan Properties", est: "Q1 2026", filed: "2024-06-22" },
  { id: "h-8", zip: "33167", addr: "1300 NW 131st St", lat: 25.8960, lng: -80.2045, units: 56, type: "Full Rehab — Workforce", category: "renovation", status: "Permitted", dev: "Housing Trust Group", est: "Q3 2025", filed: "2024-05-14" },
  { id: "h-9", zip: "33109", addr: "5 Fisher Island Dr", lat: 25.7630, lng: -80.1435, units: 22, type: "Ultra-Luxury Condo", category: "new-construction", status: "Permitted", dev: "Fisher Island Dev", est: "Q1 2026", filed: "2024-06-01" },

  // 2024-Q3
  { id: "h-10", zip: "33139", addr: "1550 Meridian Ave", lat: 25.7870, lng: -80.1365, units: 44, type: "Class A MFR", category: "new-construction", status: "Permitted", dev: "Terra Group", est: "Q4 2025", filed: "2024-07-08" },
  { id: "h-11", zip: "33154", addr: "9200 Collins Ave", lat: 25.8700, lng: -80.1225, units: 32, type: "Boutique Luxury Resi", category: "new-construction", status: "Permitted", dev: "Surf Club Dev", est: "Q2 2026", filed: "2024-07-22" },
  { id: "h-12", zip: "33160", addr: "18200 Collins Ave", lat: 25.9400, lng: -80.1235, units: 96, type: "Luxury Rental Tower", category: "new-construction", status: "Permitted", dev: "Atlantic Crest", est: "Q1 2026", filed: "2024-08-05" },
  { id: "h-13", zip: "33168", addr: "13400 NE 5th Ave", lat: 25.8955, lng: -80.1795, units: 52, type: "Mixed-Use Resi", category: "new-construction", status: "Permitted", dev: "NoMi Development", est: "Q4 2025", filed: "2024-08-18" },
  { id: "h-14", zip: "33181", addr: "1700 NE 137th St", lat: 25.9005, lng: -80.1640, units: 28, type: "Townhome Cluster", category: "new-construction", status: "Permitted", dev: "BayPark Homes", est: "Q3 2025", filed: "2024-07-15" },
  { id: "h-15", zip: "33140", addr: "4600 Sheridan Ave", lat: 25.8225, lng: -80.1310, units: 24, type: "Office-to-Resi", category: "conversion", status: "Permitted", dev: "Mast Capital", est: "Q1 2026", filed: "2024-08-25" },
  { id: "h-16", zip: "33141", addr: "6500 Indian Creek Dr", lat: 25.8430, lng: -80.1240, units: 34, type: "Hotel-to-Resi", category: "conversion", status: "Permitted", dev: "North Beach Partners", est: "Q3 2025", filed: "2024-09-02" },
  { id: "h-17", zip: "33139", addr: "1700 Alton Rd", lat: 25.7895, lng: -80.1410, units: 64, type: "Full Rehab — Class B to A", category: "renovation", status: "Permitted", dev: "Aimco", est: "Q2 2025", filed: "2024-07-30" },
  { id: "h-18", zip: "33161", addr: "12300 NE 10th Ave", lat: 25.8860, lng: -80.1665, units: 48, type: "Interior Rehab — Value-Add", category: "renovation", status: "Permitted", dev: "Blackstone RE", est: "Q4 2025", filed: "2024-09-12" },

  // 2024-Q4
  { id: "h-19", zip: "33139", addr: "1900 Purdy Ave", lat: 25.7910, lng: -80.1425, units: 38, type: "Mixed-Use Resi", category: "new-construction", status: "Permitted", dev: "Rockpoint Group", est: "Q2 2026", filed: "2024-10-05" },
  { id: "h-20", zip: "33162", addr: "2100 NE 162nd St", lat: 25.9270, lng: -80.1615, units: 104, type: "Workforce MFR", category: "new-construction", status: "Permitted", dev: "Sunline Housing", est: "Q1 2027", filed: "2024-10-20" },
  { id: "h-21", zip: "33167", addr: "800 NW 125th St", lat: 25.8855, lng: -80.2020, units: 60, type: "Workforce MFR", category: "new-construction", status: "Permitted", dev: "Community Housing Group", est: "Q3 2026", filed: "2024-11-08" },
  { id: "h-22", zip: "33168", addr: "13800 NE 8th Ave", lat: 25.8975, lng: -80.1780, units: 40, type: "Class B+ MFR", category: "new-construction", status: "Permitted", dev: "Pinnacle Urban", est: "Q4 2026", filed: "2024-11-22" },
  { id: "h-23", zip: "33160", addr: "17800 N Bay Rd", lat: 25.9375, lng: -80.1305, units: 42, type: "Hotel-to-Condo", category: "conversion", status: "Permitted", dev: "Harborline Partners", est: "Q2 2026", filed: "2024-10-15" },
  { id: "h-24", zip: "33154", addr: "9700 Harding Ave", lat: 25.8740, lng: -80.1250, units: 20, type: "Retail-to-Resi", category: "conversion", status: "Permitted", dev: "Bal Harbour Group", est: "Q1 2026", filed: "2024-12-02" },
  { id: "h-25", zip: "33161", addr: "12700 NE 7th Ave", lat: 25.8900, lng: -80.1690, units: 36, type: "Warehouse-to-Resi", category: "conversion", status: "Permitted", dev: "Urban Core Dev", est: "Q3 2026", filed: "2024-11-18" },
  { id: "h-26", zip: "33140", addr: "4000 Royal Palm Ave", lat: 25.8185, lng: -80.1335, units: 28, type: "Interior Rehab — Value-Add", category: "renovation", status: "Permitted", dev: "Starwood Capital", est: "Q2 2025", filed: "2024-10-28" },
  { id: "h-27", zip: "33141", addr: "7400 Byron Ave", lat: 25.8495, lng: -80.1265, units: 52, type: "Full Rehab — Repositioning", category: "renovation", status: "Permitted", dev: "Greystar", est: "Q4 2025", filed: "2024-12-15" },

  // 2025-Q1
  { id: "h-28", zip: "33139", addr: "1100 West Ave", lat: 25.7845, lng: -80.1405, units: 56, type: "Class A MFR", category: "new-construction", status: "Permitted", dev: "Terra Group", est: "Q3 2026", filed: "2025-01-10" },
  { id: "h-29", zip: "33140", addr: "4300 Alton Rd", lat: 25.8210, lng: -80.1350, units: 34, type: "Boutique Luxury Resi", category: "new-construction", status: "Permitted", dev: "Beach Capital", est: "Q1 2027", filed: "2025-01-28" },
  { id: "h-30", zip: "33160", addr: "19200 Collins Ave", lat: 25.9445, lng: -80.1230, units: 76, type: "Mid-Rise MFR", category: "new-construction", status: "Permitted", dev: "Atlantic Crest", est: "Q4 2026", filed: "2025-02-12" },
  { id: "h-31", zip: "33161", addr: "1100 NE 126th St", lat: 25.8910, lng: -80.1755, units: 64, type: "Mixed-Use Resi", category: "new-construction", status: "Permitted", dev: "NMB Capital", est: "Q2 2027", filed: "2025-02-25" },
  { id: "h-32", zip: "33181", addr: "1600 NE 142nd St", lat: 25.9048, lng: -80.1650, units: 30, type: "Boutique Resi", category: "new-construction", status: "Permitted", dev: "SilverLine Dev", est: "Q1 2027", filed: "2025-03-08" },
  { id: "h-33", zip: "33139", addr: "750 5th St", lat: 25.7720, lng: -80.1325, units: 26, type: "Hotel-to-Resi", category: "conversion", status: "Permitted", dev: "Shvo Group", est: "Q4 2026", filed: "2025-01-20" },
  { id: "h-34", zip: "33140", addr: "4500 Prairie Ave", lat: 25.8215, lng: -80.1340, units: 22, type: "Office-to-Resi", category: "conversion", status: "Permitted", dev: "Fontainebleau Development", est: "Q3 2026", filed: "2025-03-15" },
  { id: "h-35", zip: "33162", addr: "14700 NE 16th Ave", lat: 25.9140, lng: -80.1570, units: 42, type: "Systems Upgrade + Reno", category: "renovation", status: "Permitted", dev: "Morgan Properties", est: "Q2 2026", filed: "2025-02-05" },
  { id: "h-36", zip: "33167", addr: "1050 NW 130th St", lat: 25.8950, lng: -80.2035, units: 68, type: "Full Rehab — Workforce", category: "renovation", status: "Permitted", dev: "Housing Trust Group", est: "Q4 2026", filed: "2025-03-20" },

  // 2025-Q2
  { id: "h-37", zip: "33139", addr: "1300 Ocean Dr", lat: 25.7835, lng: -80.1298, units: 50, type: "Luxury Rental", category: "new-construction", status: "Permitted", dev: "Rockpoint Group", est: "Q4 2026", filed: "2025-04-08" },
  { id: "h-38", zip: "33141", addr: "6800 Harding Ave", lat: 25.8445, lng: -80.1270, units: 38, type: "Mid-Rise Resi", category: "new-construction", status: "Permitted", dev: "Ocean Ventures", est: "Q2 2027", filed: "2025-04-22" },
  { id: "h-39", zip: "33154", addr: "9300 Abbott Ave", lat: 25.8695, lng: -80.1260, units: 24, type: "Boutique Luxury Resi", category: "new-construction", status: "Permitted", dev: "Harbour Capital", est: "Q3 2027", filed: "2025-05-10" },
  { id: "h-40", zip: "33162", addr: "2000 NE 160th St", lat: 25.9255, lng: -80.1610, units: 90, type: "Mixed-Income Resi", category: "new-construction", status: "Permitted", dev: "Gateway Urban", est: "Q1 2027", filed: "2025-05-28" },
  { id: "h-41", zip: "33168", addr: "13000 NE 3rd Ave", lat: 25.8930, lng: -80.1810, units: 44, type: "Mixed-Use Resi", category: "new-construction", status: "Permitted", dev: "NoMi Development", est: "Q4 2026", filed: "2025-06-15" },
  { id: "h-42", zip: "33160", addr: "16900 Collins Ave", lat: 25.9330, lng: -80.1222, units: 28, type: "Hotel-to-Condo", category: "conversion", status: "Permitted", dev: "Dezer Development", est: "Q1 2027", filed: "2025-04-15" },
  { id: "h-43", zip: "33161", addr: "1050 NE 124th St", lat: 25.8885, lng: -80.1745, units: 32, type: "Warehouse-to-Resi", category: "conversion", status: "Permitted", dev: "Urban Core Dev", est: "Q3 2026", filed: "2025-06-05" },
  { id: "h-44", zip: "33139", addr: "1450 Drexel Ave", lat: 25.7868, lng: -80.1340, units: 40, type: "Full Rehab — Class B to A", category: "renovation", status: "Permitted", dev: "Related Group", est: "Q2 2026", filed: "2025-05-02" },
  { id: "h-45", zip: "33181", addr: "1400 NE 138th St", lat: 25.9000, lng: -80.1638, units: 26, type: "Interior Rehab — Value-Add", category: "renovation", status: "Permitted", dev: "Alliance Residential", est: "Q1 2027", filed: "2025-06-22" },

  // 2025-Q3
  { id: "h-46", zip: "33140", addr: "4800 Collins Ave", lat: 25.8235, lng: -80.1270, units: 58, type: "Class A MFR", category: "new-construction", status: "Permitted", dev: "Setai Dev", est: "Q1 2027", filed: "2025-07-10" },
  { id: "h-47", zip: "33161", addr: "12600 NE 12th Ave", lat: 25.8895, lng: -80.1660, units: 84, type: "Garden-Style MFR", category: "new-construction", status: "Permitted", dev: "Keystone Partners", est: "Q3 2027", filed: "2025-07-28" },
  { id: "h-48", zip: "33109", addr: "3 Fisher Island Dr", lat: 25.7633, lng: -80.1438, units: 16, type: "Ultra-Luxury Condo", category: "new-construction", status: "Permitted", dev: "Fisher Island Dev", est: "Q2 2027", filed: "2025-08-12" },
  { id: "h-49", zip: "33167", addr: "900 NW 128th St", lat: 25.8925, lng: -80.2025, units: 48, type: "Workforce MFR", category: "new-construction", status: "Permitted", dev: "Community Housing Group", est: "Q2 2027", filed: "2025-08-25" },
  { id: "h-50", zip: "33162", addr: "15500 NE 22nd Ave", lat: 25.9185, lng: -80.1565, units: 72, type: "Workforce MFR", category: "new-construction", status: "Permitted", dev: "Sunline Housing", est: "Q4 2027", filed: "2025-09-08" },
  { id: "h-51", zip: "33141", addr: "6100 Collins Ave", lat: 25.8390, lng: -80.1228, units: 20, type: "Retail-to-Resi", category: "conversion", status: "Permitted", dev: "North Beach Partners", est: "Q1 2027", filed: "2025-07-18" },
  { id: "h-52", zip: "33154", addr: "9500 Harding Ave", lat: 25.8730, lng: -80.1248, units: 18, type: "Hotel-to-Resi", category: "conversion", status: "Permitted", dev: "Surf Club Dev", est: "Q3 2026", filed: "2025-09-20" },
  { id: "h-53", zip: "33160", addr: "17600 N Bay Rd", lat: 25.9370, lng: -80.1308, units: 54, type: "Systems Upgrade + Reno", category: "renovation", status: "Permitted", dev: "Turnberry Associates", est: "Q2 2026", filed: "2025-08-02" },
  { id: "h-54", zip: "33168", addr: "13500 NE 7th Ave", lat: 25.8960, lng: -80.1790, units: 36, type: "Envelope + Amenity Add", category: "renovation", status: "Permitted", dev: "Zenith Capital", est: "Q4 2026", filed: "2025-09-15" },

  // 2025-Q4
  { id: "h-55", zip: "33139", addr: "1650 Bay Rd", lat: 25.7900, lng: -80.1398, units: 66, type: "Class A MFR", category: "new-construction", status: "Permitted", dev: "Terra Group", est: "Q2 2027", filed: "2025-10-05" },
  { id: "h-56", zip: "33140", addr: "3800 Meridian Ave", lat: 25.8170, lng: -80.1320, units: 40, type: "Boutique Luxury Resi", category: "new-construction", status: "Permitted", dev: "Beach Capital", est: "Q4 2027", filed: "2025-10-22" },
  { id: "h-57", zip: "33160", addr: "18500 Collins Ave", lat: 25.9415, lng: -80.1240, units: 110, type: "Luxury Rental Tower", category: "new-construction", status: "Permitted", dev: "Atlantic Crest", est: "Q2 2027", filed: "2025-11-10" },
  { id: "h-58", zip: "33161", addr: "1500 NE 127th St", lat: 25.8920, lng: -80.1735, units: 52, type: "Mixed-Use Resi", category: "new-construction", status: "Permitted", dev: "NMB Capital", est: "Q3 2027", filed: "2025-11-28" },
  { id: "h-59", zip: "33162", addr: "14300 NE 19th Ave", lat: 25.9120, lng: -80.1560, units: 68, type: "Mixed-Income Resi", category: "new-construction", status: "Permitted", dev: "Gateway Urban", est: "Q1 2028", filed: "2025-12-08" },
  { id: "h-60", zip: "33181", addr: "1900 NE 144th St", lat: 25.9065, lng: -80.1655, units: 32, type: "Townhome Cluster", category: "new-construction", status: "Permitted", dev: "BayPark Homes", est: "Q4 2027", filed: "2025-12-20" },
  { id: "h-61", zip: "33139", addr: "800 Washington Ave", lat: 25.7785, lng: -80.1340, units: 36, type: "Hotel-to-Resi", category: "conversion", status: "Permitted", dev: "Brickman RE", est: "Q3 2026", filed: "2025-10-15" },
  { id: "h-62", zip: "33140", addr: "4100 Sheridan Ave", lat: 25.8190, lng: -80.1315, units: 22, type: "Office-to-Resi", category: "conversion", status: "Permitted", dev: "Mast Capital", est: "Q2 2027", filed: "2025-11-20" },
  { id: "h-63", zip: "33167", addr: "1150 NW 133rd St", lat: 25.8965, lng: -80.2048, units: 46, type: "Full Rehab — Workforce", category: "renovation", status: "Permitted", dev: "Housing Trust Group", est: "Q1 2027", filed: "2025-10-30" },
  { id: "h-64", zip: "33141", addr: "7000 Harding Ave", lat: 25.8460, lng: -80.1275, units: 40, type: "Full Rehab — Repositioning", category: "renovation", status: "Permitted", dev: "Greystar", est: "Q3 2026", filed: "2025-11-05" },
  { id: "h-65", zip: "33109", addr: "10 Fisher Island Dr", lat: 25.7635, lng: -80.1442, units: 14, type: "Luxury Rehab", category: "renovation", status: "Permitted", dev: "Fisher Island Holdings", est: "Q2 2026", filed: "2025-12-12" },
  { id: "h-66", zip: "33154", addr: "9100 Collins Ave", lat: 25.8690, lng: -80.1222, units: 30, type: "Interior Rehab", category: "renovation", status: "Permitted", dev: "One Sotheby's Dev", est: "Q4 2026", filed: "2025-12-28" },

  // 2026-Q1 (early, before the existing current permits)
  { id: "h-67", zip: "33168", addr: "13100 NE 2nd Ave", lat: 25.8935, lng: -80.1815, units: 38, type: "Class B+ MFR", category: "new-construction", status: "Permitted", dev: "Pinnacle Urban", est: "Q3 2027", filed: "2026-01-05" },
  { id: "h-68", zip: "33162", addr: "15800 NE 21st Ave", lat: 25.9195, lng: -80.1572, units: 82, type: "Workforce MFR", category: "new-construction", status: "Permitted", dev: "Sunline Housing", est: "Q1 2028", filed: "2026-01-18" },
  { id: "h-69", zip: "33160", addr: "17300 Collins Ave", lat: 25.9350, lng: -80.1226, units: 46, type: "Hotel-to-Condo", category: "conversion", status: "Permitted", dev: "Dezer Development", est: "Q4 2027", filed: "2026-01-25" },
  { id: "h-70", zip: "33139", addr: "1400 Euclid Ave", lat: 25.7858, lng: -80.1335, units: 58, type: "Full Rehab — Class B to A", category: "renovation", status: "Permitted", dev: "Lincoln Property", est: "Q3 2026", filed: "2026-01-12" },
  { id: "h-71", zip: "33161", addr: "12900 NE 9th Ave", lat: 25.8910, lng: -80.1675, units: 44, type: "Interior Rehab — Value-Add", category: "renovation", status: "Permitted", dev: "Cortland", est: "Q2 2027", filed: "2026-02-01" },
]
