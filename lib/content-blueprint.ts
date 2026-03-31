export const investmentStatusOptions = [
  { value: "COMING_SOON", label: "Coming Soon" },
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" },
] as const;

export const investmentAssetTypeOptions = [
  { value: "MULTIFAMILY", label: "Multifamily" },
  { value: "RESIDENTIAL", label: "Residential" },
  { value: "MIXED_USE", label: "Mixed-Use" },
  { value: "OTHER", label: "Other" },
] as const;

export const investmentStrategyOptions = [
  { value: "VALUE_ADD", label: "Value-Add" },
  { value: "BUY_HOLD", label: "Buy & Hold" },
  { value: "DEVELOPMENT", label: "Development" },
  { value: "OTHER", label: "Other" },
] as const;

export const propertyStatusOptions = [
  { value: "AVAILABLE", label: "Available" },
  { value: "COMING_SOON", label: "Coming Soon" },
  { value: "UNDER_CONTRACT", label: "Under Contract" },
  { value: "SOLD", label: "Sold" },
  { value: "ILLUSTRATIVE", label: "Illustrative" },
] as const;

export const propertyTypeOptions = [
  { value: "SFR", label: "Single-Family" },
  { value: "MULTIFAMILY", label: "Multifamily" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "LAND", label: "Land" },
  { value: "OTHER", label: "Other" },
] as const;

export const propertyStrategyOptions = [
  { value: "FIX_FLIP", label: "Fix & Flip" },
  { value: "BUY_HOLD", label: "Buy & Hold" },
  { value: "VALUE_ADD", label: "Value-Add" },
  { value: "BRRRR", label: "BRRRR" },
  { value: "OTHER", label: "Other" },
] as const;

export const caseStudyCategoryOptions = [
  { value: "VALUE_ADD_MULTIFAMILY", label: "Value-Add Multifamily" },
  { value: "TURNAROUND", label: "Turnaround Strategy" },
  { value: "FIX_FLIP", label: "Fix & Flip" },
  { value: "OTHER", label: "Other" },
] as const;

export const calculatorTypeOptions = [
  { value: "ROI", label: "ROI" },
  { value: "BRRRR", label: "BRRRR" },
  { value: "MORTGAGE", label: "Mortgage" },
  { value: "VALUE_ADD", label: "Value-Add" },
] as const;

export const lifecycleOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

export const formDestinationOptions = [
  { value: "EMAIL", label: "Email" },
  { value: "CRM", label: "CRM (Placeholder)" },
  { value: "BOTH", label: "Both" },
] as const;

export const formFieldTypeOptions = [
  { value: "TEXT", label: "Text" },
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone" },
  { value: "SELECT", label: "Select" },
  { value: "TEXTAREA", label: "Textarea" },
] as const;

export const singletonPageLabels: Record<string, string> = {
  INVESTMENTS_INDEX: "Investments Index",
  CASH_OFFER: "Cash Offer",
  PROPERTIES_INDEX: "Properties Index",
  CASE_STUDIES_INDEX: "Case Studies Index",
  CALCULATORS_INDEX: "Calculators Index",
  CAPITAL_RATES: "Capital & Rates",
  INVESTMENT_DETAIL: "Investment Detail Template",
  PROPERTY_DETAIL: "Property Detail Template",
  CASE_STUDY_DETAIL: "Case Study Detail Template",
};

export const singletonPageGroups: Record<
  string,
  { key: string; label: string; placeholder: string }[]
> = {
  CASH_OFFER: [
    {
      key: "how_it_works",
      label: "How It Works",
      placeholder: "Submit property details",
    },
    {
      key: "seller_benefits",
      label: "Seller Benefits",
      placeholder: "No listings or showings",
    },
  ],
  CASE_STUDIES_INDEX: [
    {
      key: "categories",
      label: "Categories",
      placeholder: "Value-Add Multifamily",
    },
  ],
  CALCULATORS_INDEX: [
    {
      key: "calculator_list",
      label: "Calculator List",
      placeholder: "ROI Calculator",
    },
  ],
  CAPITAL_RATES: [
    {
      key: "supported_uses",
      label: "Supported Uses",
      placeholder: "Acquisitions",
    },
  ],
};

export const homePageSeed = {
  id: "home",
  heroHeadline: "Vertically-Integrated Real Estate & PropTech Investments",
  heroSubheadline:
    "Build wealth through institutional-grade real estate opportunities guided by data, technology, and disciplined execution.",
  heroPrimaryCtaLabel: "View Opportunities",
  heroPrimaryCtaHref: "/investments",
  heroSecondaryCtaLabel: "Get a Cash Offer",
  heroSecondaryCtaHref: "/cash-offer",
  metricsDisclaimer:
    "Logos shown for illustrative purposes. Metrics and historical references are presented for informational use only.",
  portfolioValueDisplay: "$920,000 (Illustrative)",
  portfolioCaption: "Historical Performance Overview",
  metrics: [
    { metricValue: "$250M+", metricLabel: "Total Transaction Volume" },
    { metricValue: "75+", metricLabel: "Properties Acquired" },
    { metricValue: "$1.6M", metricLabel: "Avg Annualized Return" },
    { metricValue: "15+", metricLabel: "Years of Experience" },
  ],
  segments: [
    {
      title: "Passive Investors",
      body: "Earn passive income through structured real estate investments backed by data and operational discipline.",
      ctaLabel: "View Opportunities",
      ctaHref: "/investments",
    },
    {
      title: "Active Investors",
      body: "Scale your portfolio with access to capital, analytics, and execution support.",
      ctaLabel: "Capital & Rates",
      ctaHref: "/capital-rates",
    },
    {
      title: "Sellers",
      body: "Sell your property with a streamlined, data-driven process - no listings, no showings, no uncertainty.",
      ctaLabel: "Get a Cash Offer",
      ctaHref: "/cash-offer",
    },
    {
      title: "Buyers",
      body: "Access off-market opportunities and value-add properties sourced through our network.",
      ctaLabel: "Browse Properties",
      ctaHref: "/properties",
    },
  ],
  platformCards: [
    {
      title: "Investments",
      body: "Curated passive and active investment opportunities.",
      ctaLabel: "Explore Investments",
      ctaHref: "/investments",
    },
    {
      title: "Properties",
      body: "Turnkey and value-add properties across select markets.",
      ctaLabel: "Browse Properties",
      ctaHref: "/properties",
    },
    {
      title: "ROI Calculators",
      body: "Analyze deals using professional-grade financial models.",
      ctaLabel: "View Calculators",
      ctaHref: "/calculators",
    },
  ],
  caseHighlights: [
    {
      title: "Value-Add Multifamily",
      body: "Renovation-focused strategy targeting operational improvements and long-term cash flow stabilization.",
      ctaLabel: "See Case Studies",
      ctaHref: "/case-studies",
    },
    {
      title: "Turnaround Strategy",
      body: "Repositioning underperforming assets through disciplined execution and market-specific insights.",
      ctaLabel: "See Case Studies",
      ctaHref: "/case-studies",
    },
    {
      title: "Fix & Flip",
      body: "Short-duration strategies focused on acquisition discipline, renovation efficiency, and controlled exits.",
      ctaLabel: "See Case Studies",
      ctaHref: "/case-studies",
    },
  ],
  testimonials: [
    {
      name: "Christopher M",
      city: "Chicago",
      quote:
        "Pryceless Ventures, LLC made my first home purchase seamless. Their team guided me at every step and made the process stress-free from the first conversation through closing.",
      avatarUrl: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
      name: "Danielle R",
      city: "Austin",
      quote:
        "The team helped us evaluate options clearly and move fast with confidence. We always knew what came next, and that made a huge difference during the process.",
      avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    {
      name: "Marcus T",
      city: "Miami",
      quote:
        "What stood out most was the communication. Every update was clear, practical, and timely, and the experience felt much more disciplined than a typical transaction.",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Sophia L",
      city: "Denver",
      quote:
        "Pryceless Ventures made the experience feel organized from day one. Their insight helped us make a better decision without feeling rushed or overwhelmed.",
      avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Anthony P",
      city: "Phoenix",
      quote:
        "We appreciated how transparent the team was throughout the deal. The process was efficient, thoughtful, and much easier to navigate than we expected.",
      avatarUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      name: "Jasmine K",
      city: "Seattle",
      quote:
        "From property review to final execution, everything was handled with professionalism. It felt like working with a team that truly understands both service and strategy.",
      avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      name: "Michael B",
      city: "Atlanta",
      quote:
        "Their guidance gave us clarity at every step. We felt supported, informed, and confident throughout the entire process, which is exactly what we needed.",
      avatarUrl: "https://randomuser.me/api/portraits/men/71.jpg",
    },
  ],
};

export const singletonPageSeed = [
  {
    key: "INVESTMENTS_INDEX",
    routePath: "/investments",
    pageTitle: "Investment Opportunities",
    intro:
      "Explore curated real estate investment opportunities designed for passive and active investors seeking data-driven decision making and disciplined execution.",
    disclaimer:
      "Investment opportunities shown are for informational purposes only. No offer to sell or solicitation of an offer to buy securities is made.",
    ctaLabel: "Request Deal Packet",
    ctaHref: "#deal-packet",
    items: [],
  },
  {
    key: "INVESTMENT_DETAIL",
    routePath: "/investments/[slug]",
    pageTitle: "Investment Overview",
    intro:
      "This opportunity represents a structured real estate investment aligned with Pryceless Ventures' disciplined acquisition and execution framework.",
    disclaimer:
      "Projected performance metrics are illustrative only and based on modeled assumptions. Actual results may vary.",
    ctaLabel: "Request Full Deal Packet",
    ctaHref: "#deal-packet",
    items: [],
  },
  {
    key: "CASH_OFFER",
    routePath: "/cash-offer",
    pageTitle: "Get a Cash Offer",
    intro:
      "Sell your property without the uncertainty of traditional listings. Our team evaluates properties quickly and presents clear, data-backed offers.",
    disclaimer: null,
    ctaLabel: null,
    ctaHref: null,
    items: [
      { groupKey: "how_it_works", title: "Submit property details" },
      { groupKey: "how_it_works", title: "We review and analyze the asset" },
      { groupKey: "how_it_works", title: "Receive a no-obligation cash offer" },
      { groupKey: "seller_benefits", title: "No listings or showings" },
      { groupKey: "seller_benefits", title: "Flexible timelines" },
      { groupKey: "seller_benefits", title: "Straightforward process" },
    ],
  },
  {
    key: "PROPERTIES_INDEX",
    routePath: "/properties",
    pageTitle: "Available Properties",
    intro:
      "Explore a selection of properties sourced through our acquisition channels and partner network.",
    disclaimer: "Listings shown may be illustrative or representative of prior activity.",
    ctaLabel: "Request Details",
    ctaHref: "#property-inquiry",
    items: [],
  },
  {
    key: "PROPERTY_DETAIL",
    routePath: "/properties/[slug]",
    pageTitle: "Property Overview",
    intro: null,
    disclaimer: null,
    ctaLabel: "Request Property Details",
    ctaHref: "#property-inquiry",
    items: [],
  },
  {
    key: "CASE_STUDIES_INDEX",
    routePath: "/case-studies",
    pageTitle: "Case Studies",
    intro:
      "Examples of investment strategies, execution frameworks, and lessons learned across real estate asset types.",
    disclaimer: null,
    ctaLabel: null,
    ctaHref: null,
    items: [
      { groupKey: "categories", title: "Value-Add Multifamily" },
      { groupKey: "categories", title: "Turnaround Strategy" },
      { groupKey: "categories", title: "Fix & Flip" },
    ],
  },
  {
    key: "CASE_STUDY_DETAIL",
    routePath: "/case-studies/[slug]",
    pageTitle: "Case Study",
    intro: null,
    disclaimer: null,
    ctaLabel: null,
    ctaHref: null,
    items: [],
  },
  {
    key: "CALCULATORS_INDEX",
    routePath: "/calculators",
    pageTitle: "Real Estate ROI Calculators",
    intro: "Evaluate real estate investments using professional-grade financial models.",
    disclaimer:
      "Calculator outputs are estimates based on user inputs and assumptions and are for educational purposes only.",
    ctaLabel: null,
    ctaHref: null,
    items: [
      { groupKey: "calculator_list", title: "ROI Calculator" },
      { groupKey: "calculator_list", title: "BRRRR Calculator" },
      { groupKey: "calculator_list", title: "Mortgage Calculator" },
      { groupKey: "calculator_list", title: "Value-Add Analysis" },
    ],
  },
  {
    key: "CAPITAL_RATES",
    routePath: "/capital-rates",
    pageTitle: "Capital & Funding Overview",
    intro:
      "We work with active real estate investors to structure capital solutions aligned with deal risk, duration, and execution strategy.",
    disclaimer:
      "Funding terms vary based on asset profile, market conditions, and investment structure. All opportunities are evaluated individually.",
    ctaLabel: "Request Funding Information",
    ctaHref: "#funding-info",
    items: [
      { groupKey: "supported_uses", title: "Acquisitions" },
      { groupKey: "supported_uses", title: "Renovations" },
      { groupKey: "supported_uses", title: "Bridge capital" },
      { groupKey: "supported_uses", title: "Portfolio scaling" },
    ],
  },
] as const;

export const formDefinitionsSeed = [
  {
    slug: "cash-offer",
    formName: "Cash Offer",
    destination: "EMAIL",
    successMessage:
      "Thank you. Our team will review your information and follow up within 24-48 hours.",
    fields: [
      { fieldKey: "property_address", label: "Property Address", type: "TEXT", required: true },
      { fieldKey: "property_type", label: "Property Type", type: "TEXT", required: true },
      { fieldKey: "condition", label: "Condition", type: "TEXTAREA", required: true },
      { fieldKey: "timeline", label: "Timeline", type: "TEXT", required: true },
      { fieldKey: "name", label: "Name", type: "TEXT", required: true },
      { fieldKey: "email", label: "Email", type: "EMAIL", required: true },
      { fieldKey: "phone", label: "Phone", type: "PHONE", required: true },
    ],
  },
  {
    slug: "deal-packet-request",
    formName: "Deal Packet Request",
    destination: "EMAIL",
    successMessage:
      "Thank you. Our team will review your request and share next steps shortly.",
    fields: [
      { fieldKey: "name", label: "Name", type: "TEXT", required: true },
      { fieldKey: "email", label: "Email", type: "EMAIL", required: true },
    ],
  },
  {
    slug: "funding-info-request",
    formName: "Funding Info Request",
    destination: "EMAIL",
    successMessage:
      "Thank you. We will review your request for funding information and follow up soon.",
    fields: [
      { fieldKey: "name", label: "Name", type: "TEXT", required: true },
      { fieldKey: "email", label: "Email", type: "EMAIL", required: true },
      { fieldKey: "deal_description", label: "Deal Description", type: "TEXTAREA", required: true },
    ],
  },
] as const;
