export type FallbackPropertyImage = {
  altText: string;
  caption?: string | null;
  src: string;
};

export type FallbackPropertyRecord = {
  buyerFit: string;
  highlights: string[];
  id: string;
  images: FallbackPropertyImage[];
  inquiryFormSlug?: string;
  lifecycleStatus: "PUBLISHED";
  locationCity: string;
  locationState: string;
  propertyType: "SFR" | "MULTIFAMILY" | "COMMERCIAL" | "LAND" | "OTHER";
  slug: string;
  sortOrder: number;
  status: "FOR_SALE" | "SOLD" | "IN_PROGRESS";
  strategy: "FIX_FLIP" | "BUY_HOLD" | "VALUE_ADD" | "BRRRR" | "OTHER";
  summary: string;
  title: string;
};

const remotePropertyImages = {
  blueprints:
    "https://images.pexels.com/photos/8293779/pexels-photo-8293779.jpeg?cs=srgb&dl=pexels-rdne-8293779.jpg&fm=jpg",
  calculator:
    "https://images.pexels.com/photos/8293750/pexels-photo-8293750.jpeg?cs=srgb&dl=pexels-rdne-8293750.jpg&fm=jpg",
  construction:
    "https://images.pexels.com/photos/8292888/pexels-photo-8292888.jpeg?cs=srgb&dl=pexels-rdne-8292888.jpg&fm=jpg",
  desk:
    "https://images.pexels.com/photos/8293743/pexels-photo-8293743.jpeg?cs=srgb&dl=pexels-rdne-8293743.jpg&fm=jpg",
  execution:
    "https://images.pexels.com/photos/31424880/pexels-photo-31424880.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-31424880.jpg&fm=jpg",
  lenderReview:
    "https://images.pexels.com/photos/34135038/pexels-photo-34135038.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-34135038.jpg&fm=jpg",
  refinance:
    "https://images.pexels.com/photos/27641056/pexels-photo-27641056.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-27641056.jpg&fm=jpg",
  rental:
    "https://images.pexels.com/photos/7599735/pexels-photo-7599735.jpeg?cs=srgb&dl=pexels-freestockpro-7599735.jpg&fm=jpg",
  underwrite:
    "https://images.pexels.com/photos/8292879/pexels-photo-8292879.jpeg?cs=srgb&dl=pexels-rdne-8292879.jpg&fm=jpg",
} as const;

export const propertyFallbackSeed: FallbackPropertyRecord[] = [
  {
    buyerFit:
      "Built for buyers who want an active Houston-area listing with a clean business plan, quick review cycle, and room to finish the final cosmetic scope.\n\nThe layout and pricing profile work well for operators targeting a fast resale or a short stabilization period before refinance.",
    highlights: [
      "Asking Price | $428,000",
      "Projected ARV | $575,000",
      "Corner lot with updated framing, roof work, and demo already complete.",
      "Best fit for operators who want a short closing timeline and a clean finish scope.",
    ],
    id: "seed-property-houston-heights-for-sale",
    images: [
      {
        altText: "Houston Heights for-sale property planning desk",
        caption: "Front-end diligence package and scope notes prepared for a quick buyer review.",
        src: remotePropertyImages.blueprints,
      },
      {
        altText: "Houston Heights underwriting calculator and property notes",
        caption: "Acquisition, renovation, and resale assumptions lined up for a quick execution path.",
        src: remotePropertyImages.calculator,
      },
    ],
    inquiryFormSlug: "get-started",
    lifecycleStatus: "PUBLISHED",
    locationCity: "Houston",
    locationState: "TX",
    propertyType: "SFR",
    slug: "houston-heights-finish-ready-home",
    sortOrder: 0,
    status: "FOR_SALE",
    strategy: "FIX_FLIP",
    summary:
      "Finish-ready single-family opportunity in Houston Heights with strong resale positioning and a shortened execution timeline.",
    title: "Houston Heights Finish-Ready Home",
  },
  {
    buyerFit:
      "A strong fit for buyers looking for a small multifamily basis with an income-upside plan already defined.\n\nThe deal works especially well for operators who prefer light upgrades, tenant repositioning, and steady hold economics over a fast resale.",
    highlights: [
      "Asking Price | $612,000",
      "In-Place Rent Upside | 18%",
      "Four-unit layout with classic value-add levers and limited deferred maintenance.",
      "Positioned for buyers seeking a cleaner bridge-to-hold execution path.",
    ],
    id: "seed-property-dallas-multifamily-for-sale",
    images: [
      {
        altText: "Dallas multifamily for-sale underwriting package",
        caption: "Rent growth plan and unit-turn scope organized for quick lender and buyer review.",
        src: remotePropertyImages.underwrite,
      },
      {
        altText: "Dallas multifamily property analysis materials",
        caption: "Business-plan materials structured around lease-up and moderate capital work.",
        src: remotePropertyImages.rental,
      },
    ],
    inquiryFormSlug: "get-started",
    lifecycleStatus: "PUBLISHED",
    locationCity: "Dallas",
    locationState: "TX",
    propertyType: "MULTIFAMILY",
    slug: "dallas-value-add-fourplex",
    sortOrder: 1,
    status: "FOR_SALE",
    strategy: "BUY_HOLD",
    summary:
      "Small multifamily asset with rent growth potential, manageable unit turns, and a buyer-friendly hold strategy.",
    title: "Dallas Value-Add Fourplex",
  },
  {
    buyerFit:
      "Ideal for a buyer targeting a high-visibility commercial corner with a stable neighborhood demand profile.\n\nThe current pricing works best for operators who can move quickly on leasing and refresh the frontage without taking on a heavy reposition.",
    highlights: [
      "Asking Price | $785,000",
      "Stabilized Occupancy Goal | 92%",
      "Street-facing commercial footprint with parking and cosmetic frontage upside.",
      "Well suited for buyers who want a lighter execution plan and leasing lift.",
    ],
    id: "seed-property-atlanta-commercial-for-sale",
    images: [
      {
        altText: "Atlanta commercial property diligence materials",
        caption: "Leasing plan and frontage refresh scope assembled for acquisition review.",
        src: remotePropertyImages.desk,
      },
      {
        altText: "Atlanta commercial opportunity analysis",
        caption: "Underwriting package highlights leasing assumptions and execution runway.",
        src: remotePropertyImages.execution,
      },
    ],
    inquiryFormSlug: "get-started",
    lifecycleStatus: "PUBLISHED",
    locationCity: "Atlanta",
    locationState: "GA",
    propertyType: "COMMERCIAL",
    slug: "atlanta-neighborhood-retail-corner",
    sortOrder: 2,
    status: "FOR_SALE",
    strategy: "VALUE_ADD",
    summary:
      "Neighborhood retail corner with strong visibility, clean frontage upside, and a straightforward leasing plan.",
    title: "Atlanta Neighborhood Retail Corner",
  },
  {
    buyerFit:
      "Designed for buyers looking for a furnished-rental angle with immediate cosmetic upside and a short completion runway.\n\nThe profile works well for operators balancing strong occupancy demand with a modest finish package.",
    highlights: [
      "Asking Price | $498,000",
      "Target Gross Yield | 10.9%",
      "Near-term cosmetic upgrades can reposition the asset for furnished rental demand.",
      "A good fit for operators seeking a lighter rehab plus income strategy.",
    ],
    id: "seed-property-tampa-rental-for-sale",
    images: [
      {
        altText: "Tampa rental property business plan and market review",
        caption: "Revenue assumptions and cosmetic improvement scope outlined for buyer review.",
        src: remotePropertyImages.refinance,
      },
      {
        altText: "Tampa rental property execution worksheet",
        caption: "Deal package prepared around a short renovation timeline and furnished-rental strategy.",
        src: remotePropertyImages.calculator,
      },
    ],
    inquiryFormSlug: "get-started",
    lifecycleStatus: "PUBLISHED",
    locationCity: "Tampa",
    locationState: "FL",
    propertyType: "SFR",
    slug: "tampa-furnished-rental-reset",
    sortOrder: 3,
    status: "FOR_SALE",
    strategy: "BRRRR",
    summary:
      "Furnished-rental candidate with a short cosmetic punch list and strong positioning for an income-focused buyer.",
    title: "Tampa Furnished Rental Reset",
  },
  {
    buyerFit:
      "This completed deal is useful as a proof point for buyers, capital partners, and lenders who want to see how Pryceless underwrites a clean resale spread.\n\nIt demonstrates disciplined purchase basis, moderate renovation scope, and a controlled disposition timeline.",
    highlights: [
      "Purchase Price | $248,000",
      "Selling Price | $389,000",
      "Rehab Budget | $71,000",
      "Closed in under five months with a focused cosmetic-plus-systems scope.",
    ],
    id: "seed-property-oak-forest-sold",
    images: [
      {
        altText: "Oak Forest sold property execution file",
        caption: "Final underwriting package showing basis, budget, and completed sale assumptions.",
        src: remotePropertyImages.execution,
      },
      {
        altText: "Oak Forest sold property closing materials",
        caption: "Disposition review and investor reporting prepared at exit.",
        src: remotePropertyImages.lenderReview,
      },
    ],
    lifecycleStatus: "PUBLISHED",
    locationCity: "Houston",
    locationState: "TX",
    propertyType: "SFR",
    slug: "oak-forest-closed-flip",
    sortOrder: 4,
    status: "SOLD",
    strategy: "FIX_FLIP",
    summary:
      "Closed Houston flip used to showcase purchase basis, renovation control, and a disciplined resale outcome.",
    title: "Oak Forest Closed Flip",
  },
  {
    buyerFit:
      "A solid example of how Pryceless handles a small-balance multifamily reposition with a refinance-or-sale decision built in.\n\nThe project highlights timing discipline and a margin profile driven by operational cleanup rather than speculative scope.",
    highlights: [
      "Purchase Price | $524,000",
      "Selling Price | $712,000",
      "Net Operating Lift | 21%",
      "Delivered after targeted unit turns, common-area work, and tighter rent management.",
    ],
    id: "seed-property-charlotte-sold",
    images: [
      {
        altText: "Charlotte sold multifamily underwriting summary",
        caption: "Deal summary focused on basis, rent lift, and disposition timing.",
        src: remotePropertyImages.underwrite,
      },
      {
        altText: "Charlotte sold multifamily operating review",
        caption: "Execution notes tied to occupancy cleanup and unit-turn performance.",
        src: remotePropertyImages.rental,
      },
    ],
    lifecycleStatus: "PUBLISHED",
    locationCity: "Charlotte",
    locationState: "NC",
    propertyType: "MULTIFAMILY",
    slug: "charlotte-lease-up-exit",
    sortOrder: 5,
    status: "SOLD",
    strategy: "VALUE_ADD",
    summary:
      "Completed multifamily reposition that demonstrates lease-up execution, tighter operations, and a profitable exit.",
    title: "Charlotte Lease-Up Exit",
  },
  {
    buyerFit:
      "This sold deal is positioned as a case-style example of how Pryceless executes compact renovation plans without overcapitalizing the scope.\n\nThe result is a good reference point for operators who want to understand where margin came from and how quickly the asset moved through resale.",
    highlights: [
      "Purchase Price | $296,000",
      "Selling Price | $441,000",
      "Days to Exit | 137",
      "Scope focused on kitchen, bath, flooring, and exterior refresh with tight cost control.",
    ],
    id: "seed-property-phoenix-sold",
    images: [
      {
        altText: "Phoenix sold townhome execution file",
        caption: "Rehab scope and resale assumptions organized for post-close reporting.",
        src: remotePropertyImages.calculator,
      },
      {
        altText: "Phoenix sold townhome financial review",
        caption: "Margin, timing, and buyer response summarized after disposition.",
        src: remotePropertyImages.execution,
      },
    ],
    lifecycleStatus: "PUBLISHED",
    locationCity: "Phoenix",
    locationState: "AZ",
    propertyType: "SFR",
    slug: "phoenix-townhome-turnaround",
    sortOrder: 6,
    status: "SOLD",
    strategy: "FIX_FLIP",
    summary:
      "Townhome turnaround that highlights compact-scope renovation planning and a clean resale finish.",
    title: "Phoenix Townhome Turnaround",
  },
  {
    buyerFit:
      "Useful as a sold-deal reference for investors who want to see a longer hold converted into a profitable disposition.\n\nIt shows how Pryceless can underwrite a basis conservatively, improve presentation, and exit once the market window is favorable.",
    highlights: [
      "Purchase Price | $338,000",
      "Selling Price | $486,000",
      "Hold Period | 11 months",
      "Execution blended deferred-maintenance cleanup with a measured resale timing decision.",
    ],
    id: "seed-property-san-antonio-sold",
    images: [
      {
        altText: "San Antonio sold property review materials",
        caption: "Disposition planning centered on timing, scope completion, and buyer demand.",
        src: remotePropertyImages.refinance,
      },
      {
        altText: "San Antonio sold property closing recap",
        caption: "Exit recap prepared around final pricing, market response, and project timing.",
        src: remotePropertyImages.lenderReview,
      },
    ],
    lifecycleStatus: "PUBLISHED",
    locationCity: "San Antonio",
    locationState: "TX",
    propertyType: "SFR",
    slug: "san-antonio-mid-century-resale",
    sortOrder: 7,
    status: "SOLD",
    strategy: "VALUE_ADD",
    summary:
      "Mid-century resale example showing conservative basis, polished presentation, and a profitable final exit.",
    title: "San Antonio Mid-Century Resale",
  },
  {
    buyerFit:
      "This in-progress project is ideal for showing lenders and partners how Pryceless tracks a heavier rehab while the work is still active.\n\nThe profile stays focused on milestone visibility, current phase updates, and what remains before stabilization.",
    highlights: [
      "Current Phase | Rough-In + Electrical",
      "Target Finish | August 2026",
      "Full-gut remodel with scope updates captured as the project advances.",
      "Photos and notes will continue updating as systems and finishes are completed.",
    ],
    id: "seed-property-missouri-city-progress",
    images: [
      {
        altText: "Missouri City in-progress rehab planning materials",
        caption: "Permitting, rough-in coordination, and scope tracking underway.",
        src: remotePropertyImages.construction,
      },
      {
        altText: "Missouri City in-progress rehab budget review",
        caption: "Current job-cost review tied to systems work and next-stage inspections.",
        src: remotePropertyImages.underwrite,
      },
    ],
    lifecycleStatus: "PUBLISHED",
    locationCity: "Missouri City",
    locationState: "TX",
    propertyType: "SFR",
    slug: "missouri-city-full-gut-rehab",
    sortOrder: 8,
    status: "IN_PROGRESS",
    strategy: "FIX_FLIP",
    summary:
      "Full-gut rehab currently moving through rough-in and systems coordination with milestone updates still in progress.",
    title: "Missouri City Full-Gut Rehab",
  },
  {
    buyerFit:
      "A good live example of a lighter rental reposition where the story is about pace, finish quality, and operational cleanup.\n\nThis project helps illustrate how Pryceless keeps active rehab assets updated while they move toward refinance or lease-up.",
    highlights: [
      "Current Phase | Interior Finishes",
      "Target Finish | July 2026",
      "Scope includes flooring, paint, kitchens, lighting, and curb-appeal improvements.",
      "Designed to transition quickly into lease-up once punch work is complete.",
    ],
    id: "seed-property-spring-branch-progress",
    images: [
      {
        altText: "Spring Branch in-progress rental upgrade materials",
        caption: "Finish package tracking for kitchens, baths, and common turnover work.",
        src: remotePropertyImages.rental,
      },
      {
        altText: "Spring Branch rehab progress worksheet",
        caption: "Updated scope and lease-up timeline prepared for the next stage of execution.",
        src: remotePropertyImages.execution,
      },
    ],
    lifecycleStatus: "PUBLISHED",
    locationCity: "Houston",
    locationState: "TX",
    propertyType: "SFR",
    slug: "spring-branch-rental-upgrade",
    sortOrder: 9,
    status: "IN_PROGRESS",
    strategy: "BRRRR",
    summary:
      "Rental reposition in the finish stage, with lease-up planning and final quality-control work underway.",
    title: "Spring Branch Rental Upgrade",
  },
  {
    buyerFit:
      "This duplex reposition is a useful live portfolio entry for showing active scope, timeline, and progress notes during construction.\n\nIt is especially relevant for partners who want to see operational updates before the asset reaches final stabilization.",
    highlights: [
      "Current Phase | Exterior + Unit Turns",
      "Target Finish | September 2026",
      "Project combines frontage work with unit-by-unit interior turnover and rent reset planning.",
      "Progress profile will keep updating as each duplex side reaches the next milestone.",
    ],
    id: "seed-property-fort-worth-progress",
    images: [
      {
        altText: "Fort Worth duplex reposition progress materials",
        caption: "Exterior package and unit-turn schedule aligned to staged completion.",
        src: remotePropertyImages.blueprints,
      },
      {
        altText: "Fort Worth duplex rehab budgeting documents",
        caption: "Current progress review tied to staggered turnover and leasing milestones.",
        src: remotePropertyImages.construction,
      },
    ],
    lifecycleStatus: "PUBLISHED",
    locationCity: "Fort Worth",
    locationState: "TX",
    propertyType: "MULTIFAMILY",
    slug: "fort-worth-duplex-reposition",
    sortOrder: 10,
    status: "IN_PROGRESS",
    strategy: "VALUE_ADD",
    summary:
      "Active duplex reposition with exterior work, staged unit turns, and lease-up milestones being tracked in real time.",
    title: "Fort Worth Duplex Reposition",
  },
  {
    buyerFit:
      "A useful in-progress showcase for partners who want to see active construction updates without waiting for the finished case study.\n\nThe project is tracked around milestone completion, current work fronts, and the expected path to a stabilized exit.",
    highlights: [
      "Current Phase | Cabinets + Flooring",
      "Target Finish | June 2026",
      "Moderate rehab scope focused on finish quality, curb appeal, and quicker move-in readiness.",
      "Profile will continue updating with final photos, costs, and completion notes.",
    ],
    id: "seed-property-katy-progress",
    images: [
      {
        altText: "Katy in-progress home refresh materials",
        caption: "Cabinet, flooring, and finish selections currently being installed.",
        src: remotePropertyImages.desk,
      },
      {
        altText: "Katy rehab progress review",
        caption: "Current milestone tracking prepared around finish work and final delivery.",
        src: remotePropertyImages.calculator,
      },
    ],
    lifecycleStatus: "PUBLISHED",
    locationCity: "Katy",
    locationState: "TX",
    propertyType: "SFR",
    slug: "katy-finish-phase-refresh",
    sortOrder: 11,
    status: "IN_PROGRESS",
    strategy: "FIX_FLIP",
    summary:
      "Finish-phase refresh with cabinets, flooring, and curb-appeal work now moving toward final completion.",
    title: "Katy Finish-Phase Refresh",
  },
] as const;
