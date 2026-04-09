export type BedroomMix = Record<"Studio" | "1 BR" | "2 BR" | "3 BR", number>

export type ZipProject = {
  addr: string
  units: number
  type: string
  status: "Permitted" | "Pending" | "Under Review"
  dev: string
  est: string
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
  permits: number
  pipeline: number
  cap: number
  rbt: BedroomMix
  projects: ZipProject[]
  insight: string
}

export type SignalType = "opportunity" | "risk"

export type SignalRecord = {
  id: number
  type: SignalType
  zip: string
  name: string
  tag: string
  tagColor: string
  date: string
  headline: string
  detail: string
  action: string
}

export const ZIP_WHITELIST = [
  "33109",
  "33139",
  "33140",
  "33141",
  "33160",
  "33161",
  "33162",
] as const

export const ZIPS: ZipRecord[] = [
  {
    zip: "33109",
    name: "Fisher Island",
    hood: "City of Miami Beach — Fisher Island",
    score: 95,
    rent: 8400,
    rg: 4.5,
    qg: 1.8,
    vac: 1.2,
    permits: 2,
    pipeline: 18,
    cap: 3.2,
    rbt: { Studio: 5000, "1 BR": 7000, "2 BR": 9500, "3 BR": 15000 },
    projects: [
      {
        addr: "One Fisher Island Dr",
        units: 18,
        type: "Ultra-Luxury Condo",
        status: "Permitted",
        dev: "Fisher Island Dev",
        est: "Q2 2026",
      },
    ],
    insight:
      "Fisher Island is a private, ferry-only community commanding the highest per-unit values in Miami-Dade. Vacancy below 2%, near-zero pipeline, demand driven by global UHNWIs. Extremely limited entry — focus on off-market individual unit acquisitions.",
  },
  {
    zip: "33139",
    name: "South Beach",
    hood: "City of Miami Beach — South",
    score: 87,
    rent: 4180,
    rg: 3.2,
    qg: 1.1,
    vac: 3.8,
    permits: 14,
    pipeline: 210,
    cap: 4.1,
    rbt: { Studio: 2600, "1 BR": 3400, "2 BR": 4500, "3 BR": 5800 },
    projects: [
      {
        addr: "1428 Ocean Dr",
        units: 62,
        type: "Luxury Conversion",
        status: "Permitted",
        dev: "Terra Group",
        est: "Q3 2026",
      },
      {
        addr: "855 Collins Ave",
        units: 44,
        type: "Hotel-to-Resi",
        status: "Pending",
        dev: "Brickman RE",
        est: "Q1 2027",
      },
      {
        addr: "430 W 41st St",
        units: 104,
        type: "Class A MFR",
        status: "Under Review",
        dev: "Rockpoint Group",
        est: "Q2 2027",
      },
    ],
    insight:
      "Commands highest non-Fisher rents in metro. Historic district rules and FEMA flood regs constrain new supply. Condo conversion moratorium extended Q2 2027 — focus on purpose-built rental holds and value-add repositioning.",
  },
  {
    zip: "33140",
    name: "Mid-Beach",
    hood: "City of Miami Beach — Mid",
    score: 82,
    rent: 3960,
    rg: 2.9,
    qg: 1,
    vac: 3.5,
    permits: 7,
    pipeline: 84,
    cap: 4.2,
    rbt: { Studio: 2400, "1 BR": 3200, "2 BR": 4200, "3 BR": 5500 },
    projects: [
      {
        addr: "4525 Collins Ave",
        units: 42,
        type: "Boutique Luxury Resi",
        status: "Permitted",
        dev: "Setai Dev",
        est: "Q4 2026",
      },
      {
        addr: "3900 Indian Creek Dr",
        units: 42,
        type: "Condo Conversion",
        status: "Pending",
        dev: "Beach Capital",
        est: "Q2 2027",
      },
    ],
    insight:
      "Benefits from South Beach demand spillover. Boutique product outperforming large Class A on per-unit rent. Institutional buyers active $4M–$8M range.",
  },
  {
    zip: "33141",
    name: "North Beach",
    hood: "City of Miami Beach — North",
    score: 68,
    rent: 3120,
    rg: 2.1,
    qg: 0.8,
    vac: 4.8,
    permits: 5,
    pipeline: 96,
    cap: 4.5,
    rbt: { Studio: 1900, "1 BR": 2600, "2 BR": 3400, "3 BR": 4500 },
    projects: [
      {
        addr: "6900 Collins Ave",
        units: 56,
        type: "Class A MFR",
        status: "Pending",
        dev: "Ocean Ventures",
        est: "Q3 2027",
      },
      {
        addr: "7550 Byron Ave",
        units: 40,
        type: "Mid-Rise Resi",
        status: "Pending",
        dev: "Coastal Builders",
        est: "Q4 2027",
      },
    ],
    insight:
      "Trades at meaningful discount to South/Mid Beach — a value-add opportunity. MBRO climate overlay complicates mixed-use underwriting in flood zones. Best for residential-only or elevated podium designs.",
  },
  {
    zip: "33160",
    name: "Sunny Isles",
    hood: "City of Sunny Isles Beach",
    score: 73,
    rent: 3520,
    rg: 2.4,
    qg: 0.9,
    vac: 4.1,
    permits: 9,
    pipeline: 142,
    cap: 4.7,
    rbt: { Studio: 2200, "1 BR": 2850, "2 BR": 3750, "3 BR": 4900 },
    projects: [
      {
        addr: "17501 Collins Ave",
        units: 88,
        type: "Luxury Rental Tower",
        status: "Permitted",
        dev: "Atlantic Crest",
        est: "Q4 2027",
      },
      {
        addr: "19000 N Bay Rd",
        units: 54,
        type: "Mid-Rise MFR",
        status: "Pending",
        dev: "Harborline Partners",
        est: "Q2 2028",
      },
    ],
    insight:
      "High barrier coastal product with strong international demand. Pipeline is notable, but primarily upper-tier units. Opportunities favor stabilized rentals near Collins with moderate renovation requirements.",
  },
  {
    zip: "33161",
    name: "North Miami",
    hood: "City of North Miami",
    score: 76,
    rent: 2710,
    rg: 1.9,
    qg: 0.8,
    vac: 5.1,
    permits: 6,
    pipeline: 118,
    cap: 5.4,
    rbt: { Studio: 1500, "1 BR": 2100, "2 BR": 2800, "3 BR": 3600 },
    projects: [
      {
        addr: "12800 NE 8th Ave",
        units: 96,
        type: "Garden-Style MFR",
        status: "Pending",
        dev: "Keystone Partners",
        est: "Q2 2027",
      },
      {
        addr: "1600 NE 125th St",
        units: 54,
        type: "Mixed-Use Resi",
        status: "Permitted",
        dev: "NMB Capital",
        est: "Q1 2027",
      },
    ],
    insight:
      "Strongest value-add basis in focus area. R4 upzone on NE 125th St (approved Feb 2026) unlocks 8-story density. Land at $35–45/sf — well below coastal comps. Manageable pipeline through 2027.",
  },
  {
    zip: "33162",
    name: "N. Miami NE",
    hood: "North Miami / Ojus Corridor",
    score: 64,
    rent: 2380,
    rg: 1.6,
    qg: 0.7,
    vac: 5.8,
    permits: 11,
    pipeline: 176,
    cap: 5.8,
    rbt: { Studio: 1400, "1 BR": 1900, "2 BR": 2500, "3 BR": 3200 },
    projects: [
      {
        addr: "14900 NE 20th Ave",
        units: 112,
        type: "Workforce MFR",
        status: "Under Review",
        dev: "Sunline Housing",
        est: "Q3 2028",
      },
      {
        addr: "2210 NE 163rd St",
        units: 64,
        type: "Mixed-Income Resi",
        status: "Pending",
        dev: "Gateway Urban",
        est: "Q1 2028",
      },
    ],
    insight:
      "Yield profile is attractive but underwriting must account for elevated vacancy and a heavier 2027-2028 delivery calendar. Focus on basis discipline and phased value-add execution.",
  },
]

export const SIGNALS: SignalRecord[] = [
  {
    id: 1,
    type: "opportunity",
    zip: "33161",
    name: "North Miami",
    tag: "Zoning Change",
    tagColor: "#7c3aed",
    date: "Apr 7, 2026",
    headline:
      "R4 upzone approved on NE 125th St — unlocks 8-story density across 6 blocks",
    detail:
      "City council approved 8-story zoning along NE 125th between Biscayne and NE 8th Ave. Prior limit was 4 stories.",
    action:
      "Immediate assemblage window. Density supports 80–100+ units/acre at $35–45/sf basis — first-mover advantage before the market reprices.",
  },
  {
    id: 2,
    type: "opportunity",
    zip: "33139",
    name: "South Beach",
    tag: "New Permit",
    tagColor: "#2563eb",
    date: "Apr 5, 2026",
    headline:
      "62-unit luxury conversion permitted at 1428 Ocean Dr by Terra Group",
    detail:
      "Terra Group's filing signals continued institutional confidence. Their projects historically lift adjacent land values 15–25% within 6 months.",
    action:
      "Identify off-market parcels within a 3-block radius of Ocean Dr 14th–17th St before the filing becomes widely known.",
  },
  {
    id: 3,
    type: "risk",
    zip: "33139",
    name: "South Beach",
    tag: "Regulatory Risk",
    tagColor: "#d97706",
    date: "Apr 2, 2026",
    headline:
      "Condo conversion moratorium extended through Q2 2027 by 5-2 commission vote",
    detail:
      "Three pending hotel-to-condo projects now blocked. Second extension since 2024.",
    action:
      "Avoid hotel-to-condo conversion plays in 33139 until moratorium lifts. Redirect to purpose-built rental or land bank for post-moratorium plays.",
  },
  {
    id: 4,
    type: "opportunity",
    zip: "33140",
    name: "Mid-Beach",
    tag: "Vacancy Drop",
    tagColor: "#16a34a",
    date: "Apr 1, 2026",
    headline:
      "Mid-Beach vacancy at 3.5% — absorption outpacing pipeline for second consecutive quarter",
    detail:
      "Only 84 units in pipeline through 2027 while quarterly absorption remains strong.",
    action:
      "Value-add repositioning is strongest play. Light reno ($8–12k/unit) supports 12–18% rent uplift. Target B-class assets with deferred capex.",
  },
  {
    id: 5,
    type: "risk",
    zip: "33141",
    name: "North Beach",
    tag: "Climate Overlay",
    tagColor: "#d97706",
    date: "Mar 28, 2026",
    headline:
      "MBRO climate overlay restricts ground-floor commercial use across 8 North Beach blocks",
    detail:
      "Miami Beach Resiliency Office expanded the flood/climate overlay zone, complicating mixed-use underwriting.",
    action:
      "Avoid retail-podium underwriting in flagged blocks. Focus on residential-only or elevated designs FEMA AE zone compliant.",
  },
]
