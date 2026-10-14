import type { Project, MediaItem } from "./types";

/*
  Placeholder content written in a developer's actual voice so the client can
  see the real shape of every page. Names, prices and localities are stand-ins
  for Jubilee Sales' own inventory.

  Two deliberate blanks:
  — Image slots carry no URL. Each one names the photograph or render that
    belongs there, so the site shows the client exactly what to supply and the
    dashboard fills it in. Nothing here is stock or invented imagery.
  — RERA numbers are empty. Registration numbers must come from the client.
*/

const now = "2026-01-15T09:00:00.000Z";

/** An empty gallery slot. The alt text is the brief for the shot. */
function slot(slug: string, n: number, alt: string, kind: "image" | "video" = "image"): MediaItem {
  return { id: `${slug}-${n}`, url: "", kind, alt };
}

export const SEED_PROJECTS: Project[] = [
  {
    id: "prj_vantage",
    slug: "jubilee-vantage",
    name: "Jubilee Vantage",
    city: "Hyderabad",
    locality: "Kokapet",
    type: "apartments",
    status: "ongoing",
    tagline: "Three towers on the Neopolis ridge, angled so every home faces open sky.",
    description:
      "Vantage is our largest residential project to date: 192 homes across three towers on a 4.2-acre parcel in Kokapet. The towers are set on a diagonal rather than a row, which costs us a little density and buys every apartment a clear view corridor and cross-ventilation on two faces. Structure is complete to the 12th floor; handover of Tower A begins in the fourth quarter of 2026. The clubhouse, podium parking and eastern landscape deck are being built alongside the towers rather than deferred to the end — a commitment we put in writing in the sale agreement.",
    priceFrom: "₹2.15 Cr",
    configurations: ["3 BHK — 1,940 sq ft", "3.5 BHK — 2,310 sq ft", "4 BHK — 3,180 sq ft"],
    specs: [
      { label: "Land parcel", value: "4.2 acres" },
      { label: "Towers", value: "3 (G+16)" },
      { label: "Homes", value: "192" },
      { label: "Open space", value: "71% of the parcel" },
      { label: "Structure", value: "RCC shear wall, seismic Zone II" },
      { label: "Handover", value: "Tower A — Q4 2026" },
    ],
    amenities: [
      "18,000 sq ft clubhouse",
      "Two-level podium parking",
      "Lap pool and toddlers pool",
      "Landscape deck with mature transplanted trees",
      "EV charging at 40% of bays",
      "Rainwater harvesting and STP with reuse",
    ],
    reraId: "",
    heroImage: "",
    gallery: [
      slot("jubilee-vantage", 1, "Tower elevation from the east approach road, late afternoon"),
      slot("jubilee-vantage", 2, "Landscape deck at podium level, looking towards Tower B"),
      slot("jubilee-vantage", 3, "Clubhouse frontage and entrance court"),
      slot("jubilee-vantage", 4, "Living room of the 3.5 BHK show apartment"),
      slot("jubilee-vantage", 5, "Walkthrough of the show apartment", "video"),
    ],
    flagship: true,
    mapQuery: "Kokapet, Hyderabad, Telangana",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prj_grove",
    slug: "jubilee-grove",
    name: "Jubilee Grove",
    city: "Hyderabad",
    locality: "Shankarpally",
    type: "plots",
    status: "ready",
    tagline: "Fully developed plots with clear title, ready to register and build on.",
    description:
      "142 plots across 21 acres off the Shankarpally–Kollur road, sized from 200 to 500 square yards. Roads, storm-water drains, underground electrical and the water line are all laid and commissioned — this is a finished layout, not a promise of one. Every plot is HMDA approved with a clear, single-owner title chain that we hand to your advocate before you pay anything beyond the booking amount. Buyers may build to their own architect's design within the layout setback and height rules.",
    priceFrom: "₹48,000 / sq yd",
    configurations: ["200 sq yd", "300 sq yd", "400 sq yd", "500 sq yd"],
    specs: [
      { label: "Extent", value: "21 acres" },
      { label: "Plots", value: "142" },
      { label: "Approval", value: "HMDA layout" },
      { label: "Roads", value: "40 ft and 33 ft, black-topped" },
      { label: "Utilities", value: "Underground power, water line, storm drains" },
      { label: "Status", value: "Development complete" },
    ],
    amenities: [
      "Avenue plantation on every road",
      "Compound wall with a single controlled entry",
      "Two-acre central park",
      "Overhead tank and sump",
      "Street lighting throughout",
    ],
    reraId: "",
    heroImage: "",
    gallery: [
      slot("jubilee-grove", 1, "Aerial of the layout looking towards the central park"),
      slot("jubilee-grove", 2, "Avenue plantation on the 40 ft road"),
      slot("jubilee-grove", 3, "Entry gate and boundary wall"),
    ],
    flagship: false,
    mapQuery: "Shankarpally, Hyderabad, Telangana",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prj_arbour",
    slug: "jubilee-arbour",
    name: "Jubilee Arbour",
    city: "Bengaluru",
    locality: "Sarjapur Road",
    type: "villas",
    status: "ongoing",
    tagline: "Forty courtyard villas built around the trees that were already there.",
    description:
      "A 6.8-acre site off Sarjapur Road that came with 60-year-old rain trees on it. We surveyed them first and drew the road network around them, which is why the layout bends where it does. Forty villas, each with an internal courtyard that pulls daylight into the middle of the plan and keeps the west face largely closed against the afternoon sun. Twelve villas are structurally complete and open to visit by appointment.",
    priceFrom: "₹3.40 Cr",
    configurations: ["4 BHK — 3,450 sq ft", "4 BHK duplex — 4,120 sq ft"],
    specs: [
      { label: "Land parcel", value: "6.8 acres" },
      { label: "Villas", value: "40" },
      { label: "Plot sizes", value: "2,400 – 3,600 sq ft" },
      { label: "Existing trees retained", value: "31" },
      { label: "Structure", value: "RCC frame, load-bearing infill" },
      { label: "Handover", value: "Phase 1 — Q2 2027" },
    ],
    amenities: [
      "Private courtyard in every villa",
      "Solar water heating as standard",
      "Cycle and pedestrian loop separate from the road",
      "Community kitchen garden",
      "Two-car covered parking per villa",
    ],
    reraId: "",
    heroImage: "",
    gallery: [
      slot("jubilee-arbour", 1, "Villa frontage with the retained rain trees in shot"),
      slot("jubilee-arbour", 2, "Internal courtyard seen from the first-floor landing"),
      slot("jubilee-arbour", 3, "Street view along the curved access road"),
    ],
    flagship: false,
    mapQuery: "Sarjapur Road, Bengaluru, Karnataka",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prj_exchange",
    slug: "jubilee-exchange",
    name: "Jubilee Exchange",
    city: "Hyderabad",
    locality: "Gachibowli",
    type: "commercial",
    status: "upcoming",
    tagline: "Nine floors of leasable office space with retail at the base, opposite the ORR ramp.",
    description:
      "Our first commercial building: 2.4 lakh square feet of Grade A office space over two retail levels, on a plot with a direct sightline to the Outer Ring Road ramp at Gachibowli. Floor plates are 26,000 square feet and column-free across the central 40 feet, which suits both a single large tenant and four-way splits. Designed to LEED Gold criteria. Pre-leasing conversations open in March 2026; construction starts once we cross 30% pre-commitment.",
    priceFrom: "On request",
    configurations: ["Full floor — 26,000 sq ft", "Half floor — 13,000 sq ft", "Retail — 1,200 sq ft up"],
    specs: [
      { label: "Leasable area", value: "2.4 lakh sq ft" },
      { label: "Floors", value: "2 retail + 9 office" },
      { label: "Floor plate", value: "26,000 sq ft" },
      { label: "Parking", value: "1 bay per 800 sq ft" },
      { label: "Certification", value: "Targeting LEED Gold" },
      { label: "Status", value: "Pre-leasing from March 2026" },
    ],
    amenities: [
      "Column-free central span",
      "100% DG power backup",
      "Double-height entrance lobby",
      "Dedicated service core and freight lift",
      "Food court at level two",
    ],
    reraId: "",
    heroImage: "",
    gallery: [
      slot("jubilee-exchange", 1, "Street elevation at the retail base"),
      slot("jubilee-exchange", 2, "Double-height entrance lobby render"),
    ],
    flagship: false,
    mapQuery: "Gachibowli, Hyderabad, Telangana",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prj_riverfront",
    slug: "jubilee-riverfront",
    name: "Jubilee Riverfront",
    city: "Vijayawada",
    locality: "Tadepalli",
    type: "plots",
    status: "ongoing",
    tagline: "Eighty-six plots on high ground above the Krishna, with the flood line surveyed and published.",
    description:
      "Twelve acres at Tadepalli, laid out on ground that sits well above the recorded 2009 flood line — we commissioned the contour survey ourselves and the drawing is part of every buyer document set. Roads and drains are 70% complete; the water and power network follows this summer. Plots from 167 to 400 square yards, with the eastern row facing open agricultural land that is under a no-construction easement.",
    priceFrom: "₹32,500 / sq yd",
    configurations: ["167 sq yd", "240 sq yd", "300 sq yd", "400 sq yd"],
    specs: [
      { label: "Extent", value: "12 acres" },
      { label: "Plots", value: "86" },
      { label: "Approval", value: "APCRDA layout" },
      { label: "Ground level", value: "Above 2009 recorded flood line" },
      { label: "Development", value: "Roads and drains 70% complete" },
      { label: "Completion", value: "Q3 2026" },
    ],
    amenities: [
      "Contour survey shared with every buyer",
      "33 ft internal roads",
      "Landscaped entrance plaza",
      "Boundary plantation",
    ],
    reraId: "",
    heroImage: "",
    gallery: [
      slot("jubilee-riverfront", 1, "Eastern plot row facing the open agricultural land"),
      slot("jubilee-riverfront", 2, "Site levels seen from the approach road"),
    ],
    flagship: false,
    mapQuery: "Tadepalli, Vijayawada, Andhra Pradesh",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prj_anchorage",
    slug: "jubilee-anchorage",
    name: "Jubilee Anchorage",
    city: "Visakhapatnam",
    locality: "Madhurawada",
    type: "apartments",
    status: "ready",
    tagline: "Ninety-six sea-facing homes, completed, occupied and handed over.",
    description:
      "Delivered in August 2025, four months ahead of the committed date. Two towers of 96 apartments at Madhurawada, oriented to catch the sea breeze off the Bay of Bengal without taking the full force of coastal weather on the long face. Cladding and joinery were specified for salt-air exposure and carry a five-year warranty. Eight homes remain unsold and are available for immediate registration and possession.",
    priceFrom: "₹1.28 Cr",
    configurations: ["2 BHK — 1,320 sq ft", "3 BHK — 1,760 sq ft"],
    specs: [
      { label: "Towers", value: "2 (G+12)" },
      { label: "Homes", value: "96" },
      { label: "Completed", value: "August 2025" },
      { label: "Occupancy", value: "Handed over, occupied" },
      { label: "Facade", value: "Salt-air rated, 5-year warranty" },
      { label: "Available", value: "8 homes" },
    ],
    amenities: [
      "Sea-facing terrace deck",
      "Gym and yoga room",
      "Covered parking for every home",
      "Backup power to all common areas and one point per home",
      "On-site facility management",
    ],
    reraId: "",
    heroImage: "",
    gallery: [
      slot("jubilee-anchorage", 1, "Tower elevation facing the bay"),
      slot("jubilee-anchorage", 2, "Terrace deck at sunset"),
      slot("jubilee-anchorage", 3, "Handed-over 3 BHK, living and dining"),
    ],
    flagship: false,
    mapQuery: "Madhurawada, Visakhapatnam, Andhra Pradesh",
    createdAt: now,
    updatedAt: now,
  },
];
