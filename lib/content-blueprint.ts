import { getDefaultLoanProgramImage } from "@/lib/loan-program-images";
export { propertyStatusOptions } from "@/lib/property-portfolio";

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
  { value: "NUMBER", label: "Number" },
  { value: "SELECT", label: "Select" },
  { value: "RADIO", label: "Radio" },
  { value: "TEXTAREA", label: "Textarea" },
  { value: "FILE", label: "File" },
] as const;

export const singletonPageLabels: Record<string, string> = {
  GET_FINANCING_INDEX: "Loan Offers Index",
  GET_FINANCING_DETAIL: "Loan Offers Detail Template",
  BLOGS_INDEX: "Insights Index",
  BLOG_DETAIL: "Insight Detail Template",
  INVESTMENTS_INDEX: "Investments Index",
  CASH_OFFER: "Cash Offer",
  PROPERTIES_INDEX: "Properties Index",
  CASE_STUDIES_INDEX: "Case Studies Index",
  CALCULATORS_INDEX: "Calculators Index",
  INVESTMENT_DETAIL: "Investment Detail Template",
  PROPERTY_DETAIL: "Property Detail Template",
  CASE_STUDY_DETAIL: "Case Study Detail Template",
};

export const getCalculatorCardFallbackDescription = (title: string) => {
  const normalized = title.trim().toLowerCase();

  if (normalized.includes("brrrr")) {
    return "Model the buy, rehab, rent, refinance, and repeat strategy with live acquisition, refinance, and cash-flow outputs.";
  }

  if (normalized.includes("mortgage")) {
    return "Estimate monthly financing impact, principal and interest structure, and debt service assumptions for a deal.";
  }

  if (normalized.includes("value-add") || normalized.includes("value add")) {
    return "Assess renovation scenarios, operational upside, and the path to improved asset performance in a value-add plan.";
  }

  return "Evaluate projected cash flow, return potential, and overall investment performance for a real estate opportunity.";
};

export const singletonPageGroups: Record<
  string,
  {
    key: string;
    label: string;
    placeholder: string;
    supportsBody?: boolean;
  }[]
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
  GET_FINANCING_INDEX: [
    {
      key: "overview_eyebrow",
      label: "Overview Eyebrow",
      placeholder: "Opportunity Overview",
    },
    {
      key: "snapshot_card",
      label: "Snapshot Card",
      placeholder:
        "Opportunity Snapshot | Here's a quick look at the loan offers currently available through our CMS-managed application flow.",
      supportsBody: true,
    },
    {
      key: "snapshot_count_labels",
      label: "Snapshot Count Labels",
      placeholder: "Published loan offer",
    },
    {
      key: "programs_section_eyebrow",
      label: "Programs Section Eyebrow",
      placeholder: "Loan Programs",
    },
    {
      key: "programs_section_content",
      label: "Programs Section Content",
      placeholder:
        "Financing Options Managed From The CMS | Rates, terms, and visibility are controlled from the admin portal so your team can launch new programs quickly and keep underwriting details current.",
      supportsBody: true,
    },
    {
      key: "card_stat_labels",
      label: "Loan Card Stat Labels",
      placeholder: "Rate",
    },
    {
      key: "empty_state_message",
      label: "Empty State Message",
      placeholder:
        "Published loan programs will appear here after the admin team adds and activates them.",
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
      placeholder: "ROI Calculator | Evaluate projected cash flow...",
      supportsBody: true,
    },
  ],
  GET_FINANCING_DETAIL: [
    {
      key: "hero_eyebrow",
      label: "Hero Eyebrow",
      placeholder: "Loan Program",
    },
    {
      key: "hero_heading_tail",
      label: "Hero Heading Tail",
      placeholder: "for Active Investors",
    },
    {
      key: "hero_feature_cards",
      label: "Hero Feature Cards",
      placeholder: "Fast draw requests",
    },
    {
      key: "hero_metric_labels",
      label: "Hero Metric Labels",
      placeholder: "Interest Rate",
    },
    {
      key: "hero_secondary_action",
      label: "Hero Secondary Action",
      placeholder: "Talk to a Specialist | /cash-offer",
      supportsBody: true,
    },
    {
      key: "highlights_section_eyebrow",
      label: "Highlights Section Eyebrow",
      placeholder: "Program Highlights",
    },
    {
      key: "highlights_section_content",
      label: "Highlights Section Content",
      placeholder:
        "Why investors choose {program} | Built for quick purchases, rehab draws, and exit timelines that reward decisive execution.",
      supportsBody: true,
    },
    {
      key: "overview_section_eyebrow",
      label: "Overview Section Eyebrow",
      placeholder: "Overview",
    },
    {
      key: "terms_section_eyebrow",
      label: "Terms Section Eyebrow",
      placeholder: "Rate and Terms",
    },
    {
      key: "terms_section_content",
      label: "Terms Section Content",
      placeholder:
        "Core underwriting snapshot | Key pricing, leverage, and loan size details to review before you apply.",
      supportsBody: true,
    },
    {
      key: "term_detail_labels",
      label: "Term Detail Labels",
      placeholder: "Interest Rate",
    },
    {
      key: "application_section_eyebrow",
      label: "Application Section Eyebrow",
      placeholder: "Application",
    },
    {
      key: "application_fallback_action",
      label: "Application Fallback Action",
      placeholder:
        "Contact Pryceless Ventures | /cash-offer",
      supportsBody: true,
    },
    {
      key: "application_fallback_content",
      label: "Application Fallback Content",
      placeholder:
        "Application form coming soon | The public form for this program has not been linked yet. You can still contact the team directly while the admin portal finalizes the intake flow.",
      supportsBody: true,
    },
  ],
};

export const homePageSeed = {
  id: "home",
  heroHeadline: "Get Financing for Your Real Estate Deals",
  heroSubheadline:
    "Access reliable financing for acquisitions, rehab execution, bridge needs, and refinance strategies with a team built for real estate operators.",
  heroPrimaryCtaLabel: "Get Financing",
  heroPrimaryCtaHref: "/get-financing",
  heroSecondaryCtaLabel: "Get a Cash Offer",
  heroSecondaryCtaHref: "/cash-offer",
  aboutSectionTitle: "Why Pryceless Ventures, LLC",
  aboutSectionParagraphOne:
    "Access reliable financing for acquisitions, rehab execution, bridge needs, and refinance strategies with a team built for real estate operators.",
  aboutSectionParagraphTwo:
    "Access reliable financing solutions for acquisition, bridge, and refinance scenarios with a team that understands real estate operators, timelines, and underwriting pressure.",
  aboutSectionPrimaryCtaLabel: "Get Financing",
  aboutSectionPrimaryCtaHref: "/get-financing",
  aboutSectionSecondaryCtaLabel: "Get a Cash Offer",
  aboutSectionSecondaryCtaHref: "/cash-offer",
  aboutSectionImageUrl: null,
  aboutSectionImageAlt: "Interior bedroom",
  metricsDisclaimer: "Logos shown for illustrative purposes. Links can be activated once confirmed.",
  portfolioValueDisplay: "$920,000 (Illustrative)",
  portfolioCaption: "Historical Performance Overview",
  metrics: [
    { metricValue: "$250M+", metricLabel: "Transaction Volume Influenced" },
    { metricValue: "75+", metricLabel: "Properties Across Transactions" },
    { metricValue: "15+ Years", metricLabel: "Combined Team Experience" },
    { metricValue: "Data-Driven", metricLabel: "Investment & Deal Analysis" },
  ],
  segments: [
    {
      title: "Borrowers",
      body: "Secure fast, flexible capital for acquisitions, rehab projects, bridge needs, and refinances.",
      ctaLabel: "Get Financing",
      ctaHref: "/get-financing",
    },
    {
      title: "Operators",
      body: "Scale your pipeline with loan programs designed around execution speed, clear terms, and lender responsiveness.",
      ctaLabel: "View Financing",
      ctaHref: "/get-financing",
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
      ctaLabel: "Request Details",
      ctaHref: "/properties",
    },
  ],
  platformCards: [
    {
      title: "Get Financing",
      body: "Loan programs for fix-and-flip, bridge, rental, and refinance scenarios.",
      ctaLabel: "Apply Now",
      ctaHref: "/get-financing",
    },
    {
      title: "Properties",
      body: "Turnkey and value-add properties across select markets.",
      ctaLabel: "Request Details",
      ctaHref: "/properties",
    },
    {
      title: "Blogs",
      body: "Read financing guides, borrower insights, and market-focused articles from the Pryceless team.",
      ctaLabel: "Read Blogs",
      ctaHref: "/blogs",
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
      avatarUrl: null,
    },
    {
      name: "Danielle R",
      city: "Austin",
      quote:
        "The team helped us evaluate options clearly and move fast with confidence. We always knew what came next, and that made a huge difference during the process.",
      avatarUrl: null,
    },
    {
      name: "Marcus T",
      city: "Miami",
      quote:
        "What stood out most was the communication. Every update was clear, practical, and timely, and the experience felt much more disciplined than a typical transaction.",
      avatarUrl: null,
    },
    {
      name: "Sophia L",
      city: "Denver",
      quote:
        "Pryceless Ventures made the experience feel organized from day one. Their insight helped us make a better decision without feeling rushed or overwhelmed.",
      avatarUrl: null,
    },
    {
      name: "Anthony P",
      city: "Phoenix",
      quote:
        "We appreciated how transparent the team was throughout the deal. The process was efficient, thoughtful, and much easier to navigate than we expected.",
      avatarUrl: null,
    },
    {
      name: "Jasmine K",
      city: "Seattle",
      quote:
        "From property review to final execution, everything was handled with professionalism. It felt like working with a team that truly understands both service and strategy.",
      avatarUrl: null,
    },
    {
      name: "Michael B",
      city: "Atlanta",
      quote:
        "Their guidance gave us clarity at every step. We felt supported, informed, and confident throughout the entire process, which is exactly what we needed.",
      avatarUrl: null,
    },
  ],
};

export const singletonPageSeed = [
  {
    key: "GET_FINANCING_INDEX",
    routePath: "/get-financing",
    pageTitle: "Loan Offers for Your Real Estate Deals",
    intro:
      "Explore active lending programs, compare rates and leverage, and move directly into the application flow that fits your deal.",
    disclaimer:
      "Rates, leverage, and terms are subject to underwriting, asset profile, borrower strength, and current market conditions.",
    ctaLabel: "View Details",
    ctaHref: "#loan-programs",
    items: [
      { groupKey: "overview_eyebrow", title: "Opportunity Overview" },
      {
        groupKey: "snapshot_card",
        title: "Opportunity Snapshot",
        body: "Here's a quick look at the loan offers currently available through our CMS-managed application flow.",
      },
      { groupKey: "snapshot_count_labels", title: "Published loan offer" },
      { groupKey: "snapshot_count_labels", title: "Published loan offers" },
      { groupKey: "programs_section_eyebrow", title: "Loan Programs" },
      {
        groupKey: "programs_section_content",
        title: "Financing Options Managed From The CMS",
        body: "Rates, terms, and visibility are controlled from the admin portal so your team can launch new programs quickly and keep underwriting details current.",
      },
      { groupKey: "card_stat_labels", title: "Rate" },
      { groupKey: "card_stat_labels", title: "Max LTV / LTC" },
      { groupKey: "card_stat_labels", title: "Loan Size" },
      {
        groupKey: "empty_state_message",
        title: "Published loan programs will appear here after the admin team adds and activates them.",
      },
    ],
  },
  {
    key: "GET_FINANCING_DETAIL",
    routePath: "/get-financing/[slug]",
    pageTitle: "Loan Program Overview",
    intro:
      "Review the program overview, underwriting parameters, and financing terms, then apply directly through the matching intake flow.",
    disclaimer:
      "Illustrative terms shown online do not represent a commitment to lend. Final structure is determined after review and underwriting.",
    ctaLabel: "Apply Now",
    ctaHref: "#apply-now",
    items: [
      { groupKey: "hero_eyebrow", title: "Loan Program" },
      { groupKey: "hero_heading_tail", title: "for Active Investors" },
      { groupKey: "hero_feature_cards", title: "Fast draw requests" },
      { groupKey: "hero_feature_cards", title: "Quick closings" },
      { groupKey: "hero_feature_cards", title: "Rehab-ready leverage" },
      { groupKey: "hero_metric_labels", title: "Interest Rate" },
      { groupKey: "hero_metric_labels", title: "LTV / LTC" },
      { groupKey: "hero_metric_labels", title: "Loan Term" },
      { groupKey: "hero_secondary_action", title: "Talk to a Specialist", body: "/cash-offer" },
      { groupKey: "highlights_section_eyebrow", title: "Program Highlights" },
      {
        groupKey: "highlights_section_content",
        title: "Why investors choose {program}",
        body: "Built for quick purchases, rehab draws, and exit timelines that reward decisive execution.",
      },
      { groupKey: "overview_section_eyebrow", title: "Overview" },
      { groupKey: "terms_section_eyebrow", title: "Rate and Terms" },
      {
        groupKey: "terms_section_content",
        title: "Core underwriting snapshot",
        body: "Key pricing, leverage, and loan size details to review before you apply.",
      },
      { groupKey: "term_detail_labels", title: "Interest Rate" },
      { groupKey: "term_detail_labels", title: "Loan Term" },
      { groupKey: "term_detail_labels", title: "LTV / LTC" },
      { groupKey: "term_detail_labels", title: "Fees" },
      { groupKey: "term_detail_labels", title: "Minimum Amount" },
      { groupKey: "term_detail_labels", title: "Maximum Amount" },
      { groupKey: "application_section_eyebrow", title: "Application" },
      {
        groupKey: "application_fallback_action",
        title: "Contact Pryceless Ventures",
        body: "/cash-offer",
      },
      {
        groupKey: "application_fallback_content",
        title: "Application form coming soon",
        body: "The public form for this program has not been linked yet. You can still contact the team directly while the admin portal finalizes the intake flow.",
      },
    ],
  },
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
    pageTitle: "Properties",
    intro:
      "Select a stage to view Pryceless Ventures properties that are for sale, sold, or currently in progress.",
    disclaimer:
      "Portfolio entries may represent active listings, completed executions, or renovation-stage projects. Availability, pricing, and timelines can change.",
    ctaLabel: "Request Details",
    ctaHref: "#portfolio-sections",
    items: [],
  },
  {
    key: "PROPERTY_DETAIL",
    routePath: "/properties/[slug]",
    pageTitle: "Portfolio Property Overview",
    intro: null,
    disclaimer: null,
    ctaLabel: "Request Property Details",
    ctaHref: "#property-inquiry",
    items: [],
  },
  {
    key: "BLOGS_INDEX",
    routePath: "/blogs",
    pageTitle: "Insights",
    intro:
      "Stay current with practical blog posts on financing strategy, rental growth, bridge structures, and how to move real estate deals from opportunity to execution.",
    disclaimer: null,
    ctaLabel: "Explore Articles",
    ctaHref: "#latest-blogs",
    items: [],
  },
  {
    key: "BLOG_DETAIL",
    routePath: "/blogs/[slug]",
    pageTitle: "Insight Article",
    intro: null,
    disclaimer: null,
    ctaLabel: "Back to Insights",
    ctaHref: "/blogs",
    items: [],
  },
  {
    key: "CASE_STUDIES_INDEX",
    routePath: "/case-studies",
    pageTitle: "Case Studies",
    intro:
      "Examples of investment strategies, execution frameworks, and lessons learned across real estate asset types.",
    disclaimer: null,
    ctaLabel: "Explore More",
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
      {
        groupKey: "calculator_list",
        title: "ROI Calculator",
        body: "Evaluate projected cash flow, return potential, and overall investment performance for a real estate opportunity.",
      },
      {
        groupKey: "calculator_list",
        title: "BRRRR Calculator",
        body: "Model the buy, rehab, rent, refinance, and repeat strategy with live acquisition, refinance, and cash-flow outputs.",
      },
      {
        groupKey: "calculator_list",
        title: "Mortgage Calculator",
        body: "Estimate monthly financing impact, principal and interest structure, and debt service assumptions for a deal.",
      },
      {
        groupKey: "calculator_list",
        title: "Value-Add Analysis",
        body: "Assess renovation scenarios, operational upside, and the path to improved asset performance in a value-add plan.",
      },
    ],
  },
] as const;

export const blogPostSeed = [
  {
    title: "Bridge Loans Explained for Real Estate Investors",
    slug: "bridge-loans-explained-for-real-estate-investors",
    lifecycleStatus: "PUBLISHED",
    category: "Financing Strategy",
    excerpt:
      "Bridge debt helps investors move quickly on time-sensitive acquisitions, lease-up plans, and transitional assets before permanent financing is the right fit.",
    content:
      "Bridge financing is designed for speed, flexibility, and execution. It is often the best fit when an investor needs to close quickly, stabilize an asset, or solve a short-term capital need before moving into a longer-term structure.\n\nIn practice, bridge loans work well for acquisitions that need light repositioning, rent-ready upgrades, lease-up improvements, or a refinance path after operational cleanup. The underwriting focus is usually on the asset, the borrower plan, and the expected exit strategy.\n\nBorrowers should prepare a clear story around timeline, business plan, current condition, and the takeout plan. Lenders want to see how the property moves from today's state to a more stable and financeable outcome.\n\nThe strongest bridge requests usually combine a realistic execution schedule with conservative leverage and a clear payoff event. When those pieces line up, bridge debt can unlock opportunities that conventional financing cannot reach fast enough.",
    authorName: "Pryceless Ventures Team",
    readTime: "5 min read",
    featuredImageUrl:
      "https://images.pexels.com/photos/8293779/pexels-photo-8293779.jpeg?cs=srgb&dl=pexels-rdne-8293779.jpg&fm=jpg",
    featuredImageAlt: "Bridge financing strategy for real estate investors",
    publishedAt: "2026-04-08T00:00:00.000Z",
  },
  {
    title: "How DSCR Loans Help Build a Rental Portfolio",
    slug: "how-dscr-loans-help-build-a-rental-portfolio",
    lifecycleStatus: "PUBLISHED",
    category: "Rental Growth",
    excerpt:
      "Debt-service-coverage financing can make it easier for rental investors to scale when property cash flow is a stronger underwriting signal than personal income alone.",
    content:
      "DSCR lending is built around the property's income profile. For rental investors, that can create a cleaner path to growth when the asset cash flow supports the debt service and the deal is structured around long-term hold economics.\n\nThis type of financing is especially useful for borrowers expanding from one or two rentals into a more intentional portfolio. Instead of relying only on personal income documentation, the lender can focus more heavily on rent, expenses, reserves, and the overall stability of the property.\n\nStrong DSCR applications usually include organized lease information, realistic rental assumptions, and a clear explanation of the borrower's hold strategy. Deals become more compelling when the investor shows operational discipline rather than purely chasing leverage.\n\nFor portfolio builders, DSCR debt can create consistency. It allows borrowers to underwrite from the property outward, compare assets on similar terms, and make acquisition decisions with a more repeatable capital framework.",
    authorName: "Pryceless Ventures Research",
    readTime: "4 min read",
    featuredImageUrl:
      "https://images.pexels.com/photos/7599735/pexels-photo-7599735.jpeg?cs=srgb&dl=pexels-freestockpro-7599735.jpg&fm=jpg",
    featuredImageAlt: "Rental portfolio planning with DSCR financing",
    publishedAt: "2026-04-06T00:00:00.000Z",
  },
  {
    title: "Fix and Flip Financing: What Lenders Look For",
    slug: "fix-and-flip-financing-what-lenders-look-for",
    lifecycleStatus: "PUBLISHED",
    category: "Deal Execution",
    excerpt:
      "The best fix-and-flip loan requests tell a clear story around purchase basis, rehab scope, timeline, contingency planning, and the borrower's track record.",
    content:
      "Fix-and-flip financing is not only about the deal itself. Lenders are also evaluating whether the borrower understands project management, timeline risk, and resale discipline.\n\nA strong request starts with the basics: realistic purchase price, renovation budget, expected after-repair value, and a scope that matches both the neighborhood and the planned exit. Projects become riskier when the budget is vague or the renovation plan depends on optimistic resale assumptions.\n\nExperience matters, but clarity matters just as much. Even newer investors can improve approval odds by presenting a detailed project summary, contractor plan, comparable sales support, and a reasonable contingency buffer.\n\nThe most lender-friendly fix-and-flip files feel executable. They show that the borrower knows what needs to happen, what it should cost, how long it should take, and how the asset will be positioned once the work is complete.",
    authorName: "Pryceless Ventures Team",
    readTime: "6 min read",
    featuredImageUrl:
      "https://images.pexels.com/photos/31424880/pexels-photo-31424880.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-31424880.jpg&fm=jpg",
    featuredImageAlt: "Fix and flip execution and lender review",
    publishedAt: "2026-04-03T00:00:00.000Z",
  },
  {
    title: "When to Refinance an Investment Property",
    slug: "when-to-refinance-an-investment-property",
    lifecycleStatus: "PUBLISHED",
    category: "Refinance Planning",
    excerpt:
      "Refinancing makes the most sense when the property story has improved and the new debt structure supports the next phase of the hold more effectively than the current loan.",
    content:
      "A refinance should solve a real business need. That may mean lowering monthly carry, extending runway, pulling out strategic cash, or moving from a short-term bridge structure into something more stable.\n\nThe timing improves when occupancy is stronger, renovations are complete, operating history is cleaner, or market positioning has become more defensible. In those moments, the asset can often support better terms than it could earlier in the business plan.\n\nBorrowers should look beyond rate alone. A good refinance also considers term flexibility, reserves, prepayment structure, and whether the new debt aligns with the intended hold period.\n\nThe best refinance decisions are strategic, not reactive. They happen because the borrower has reached a better position and wants debt that matches the asset's current reality, not because they waited until the old structure became a problem.",
    authorName: "Pryceless Ventures Research",
    readTime: "5 min read",
    featuredImageUrl:
      "https://images.pexels.com/photos/27641056/pexels-photo-27641056.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-27641056.jpg&fm=jpg",
    featuredImageAlt: "Investment property refinance timing and planning",
    publishedAt: "2026-03-31T00:00:00.000Z",
  },
  {
    title: "How to Prepare a Loan Package That Gets Faster Approvals",
    slug: "how-to-prepare-a-loan-package-that-gets-faster-approvals",
    lifecycleStatus: "PUBLISHED",
    category: "Borrower Guide",
    excerpt:
      "Organized borrower information, a concise deal summary, and clean supporting documents can remove friction from underwriting and speed up the path to a lending decision.",
    content:
      "A faster approval usually starts before the lender even asks the second question. Borrowers who prepare a clean loan package make it easier for underwriting to understand the deal and move forward with confidence.\n\nA strong package includes the borrowing entity details, property address, requested loan amount, purpose, purchase or refinance context, and a short deal narrative. If there is renovation work, include a scope summary and budget. If there is rental income, include lease or rent roll support.\n\nGood packaging is about clarity, not volume. The goal is to answer the obvious questions early: what is the property, why does the borrower need this capital, what supports the numbers, and how does the loan get repaid.\n\nWhen submissions are organized, lenders spend less time chasing missing details and more time evaluating the actual opportunity. That is one of the simplest ways to improve both speed and credibility.",
    authorName: "Pryceless Ventures Team",
    readTime: "4 min read",
    featuredImageUrl:
      "https://images.pexels.com/photos/8292879/pexels-photo-8292879.jpeg?cs=srgb&dl=pexels-rdne-8292879.jpg&fm=jpg",
    featuredImageAlt: "Real estate borrower loan package preparation",
    publishedAt: "2026-03-28T00:00:00.000Z",
  },
  {
    title: "Choosing Between Bridge, Rental, and Refinance Loans",
    slug: "choosing-between-bridge-rental-and-refinance-loans",
    lifecycleStatus: "PUBLISHED",
    category: "Loan Selection",
    excerpt:
      "The right loan type depends on the asset stage, cash-flow profile, business plan timeline, and whether the borrower needs speed, stability, or a repositioning bridge.",
    content:
      "Many borrowers do not need more options. They need the right structure for the stage their deal is actually in. That is why the best loan choice starts with the business plan rather than the rate sheet.\n\nBridge debt is typically the right answer when an asset is transitional or a closing timeline is compressed. Rental or DSCR financing fits better when the property income story is already strong enough to support long-term hold debt. Refinance structures make sense when the borrower is improving an existing debt position or creating liquidity after progress has already been made.\n\nConfusion usually shows up when borrowers try to force a long-term loan onto a short-term plan, or use bridge debt for a property that is already stable enough for something more efficient. Matching the capital structure to the operating reality is the real decision.\n\nWhen that match is right, the loan supports the asset instead of fighting it. The result is cleaner execution, better flexibility, and fewer surprises in the middle of the hold.",
    authorName: "Pryceless Ventures Research",
    readTime: "5 min read",
    featuredImageUrl:
      "https://images.pexels.com/photos/34135038/pexels-photo-34135038.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-34135038.jpg&fm=jpg",
    featuredImageAlt: "Comparing bridge, rental, and refinance loans",
    publishedAt: "2026-03-24T00:00:00.000Z",
  },
] as const;

export const loanProgramSeed = [
  {
    title: "Fix & Flip",
    slug: "fix-flip",
    lifecycleStatus: "PUBLISHED",
    shortDescription:
      "Fast capital for residential acquisition, rehab, and resale.",
    fullDescription:
      "Move quickly on strong renovation opportunities without overcomplicating your capital stack. This program is designed for investors who need acquisition funding, rehab support, and a clean path from closing through exit.\n\nBest fit for operators managing contractor draws, tight hold periods, and resale or refinance timelines. The structure is built to keep execution clear at purchase, disciplined during rehab, and ready for the next step once the work is complete.",
    interestRate: "Starting at 9.75%",
    ltv: "Up to 85% LTC / 70% ARV",
    loanTerm: "12-18 months",
    fees: "Origination from 1.5 points",
    minAmount: "$75,000",
    maxAmount: "$3,000,000",
    keyHighlights:
      "One structure can cover acquisition and rehab under a single execution plan.\nDraw-based disbursements help match capital to renovation progress.\nBuilt for investors targeting a clean sale or refinance exit.",
    crmTag: "fix-flip",
    imageUrl: getDefaultLoanProgramImage("fix-flip"),
    imageAlt: "Fix and flip financing",
    isActive: true,
    sortOrder: 0,
  },
  {
    title: "Refinance",
    slug: "refinance",
    lifecycleStatus: "PUBLISHED",
    shortDescription:
      "Refinance capital for stabilized or improving assets seeking better structure, lower payments, or cash-out flexibility.",
    fullDescription:
      "This refinance program is tailored for owners repositioning their debt structure after stabilization, renovation completion, or improved operating performance.\n\nIt is a strong fit when you need clearer monthly carry, strategic cash-out, or more aligned term flexibility for the next stage of the hold.",
    interestRate: "Starting at 7.95%",
    ltv: "Up to 75% LTV",
    loanTerm: "12-36 months",
    fees: "Origination from 1 point",
    minAmount: "$100,000",
    maxAmount: "$5,000,000",
    keyHighlights:
      "Supports cash-out and rate-term refinance scenarios.\nUseful after rehab completion or improved occupancy.\nStructured for borrowers preparing for a longer-term hold.",
    crmTag: "refinance",
    imageUrl: getDefaultLoanProgramImage("refinance"),
    imageAlt: "Refinance loan program",
    isActive: true,
    sortOrder: 1,
  },
  {
    title: "Rental / DSCR",
    slug: "rental-dscr",
    lifecycleStatus: "PUBLISHED",
    shortDescription:
      "Longer-hold financing for rental assets using deal cash flow and property performance as key underwriting inputs.",
    fullDescription:
      "For investors focused on portfolio growth, this rental program is designed around property income, operating history, and DSCR-driven decision-making.\n\nIt works well for acquisitions or refinances where the plan is to stabilize and hold instead of exit quickly.",
    interestRate: "Starting at 8.25%",
    ltv: "Up to 80% LTV",
    loanTerm: "30-year options available",
    fees: "Origination from 1.25 points",
    minAmount: "$125,000",
    maxAmount: "$4,000,000",
    keyHighlights:
      "Built for cash-flowing rental and small-balance portfolio assets.\nSupports acquisitions and refinances.\nUseful for investors prioritizing long-term hold economics.",
    crmTag: "rental-dscr",
    imageUrl: getDefaultLoanProgramImage("rental-dscr"),
    imageAlt: "Rental DSCR financing",
    isActive: true,
    sortOrder: 2,
  },
  {
    title: "Ground-Up Construction",
    slug: "ground-up-construction",
    lifecycleStatus: "PUBLISHED",
    shortDescription:
      "Construction financing for new residential builds with capital sized around lot basis, vertical budget, and completion timeline.",
    fullDescription:
      "This program is designed for borrowers building from the ground up, whether the plan is a single spec home, a custom build, or a small residential development with a clear construction schedule.\n\nUse it when you need a lender who understands lot position, staged draw requests, contractor execution, budget control, and the timeline required to move from dirt to certificate of occupancy.",
    interestRate: "Starting at 10.25%",
    ltv: "Up to 80% LTC",
    loanTerm: "12-24 months",
    fees: "Origination from 2 points",
    minAmount: "$150,000",
    maxAmount: "$6,000,000",
    keyHighlights:
      "Built for new construction and tear-down rebuild projects.\nFunds can be structured around lot payoff plus vertical construction draws.\nUseful for builders, repeat developers, and borrowers managing staged completion timelines.",
    crmTag: "ground-up-construction",
    imageUrl: getDefaultLoanProgramImage("ground-up-construction"),
    imageAlt: "Ground-up construction financing for new residential development",
    isActive: true,
    sortOrder: 3,
  },
] as const;

export const formDefinitionsSeed = [
  {
    slug: "get-started",
    formName: "Get Started Contact Form",
    destination: "EMAIL",
    successMessage:
      "Thank you for reaching out. Our team will review your message and get back to you shortly.",
    fields: [
      {
        fieldKey: "first_name",
        label: "First Name",
        type: "TEXT",
        required: true,
        placeholder: "john",
      },
      {
        fieldKey: "last_name",
        label: "Last Name",
        type: "TEXT",
        required: true,
        placeholder: "parker",
      },
      {
        fieldKey: "email",
        label: "Email ID",
        type: "EMAIL",
        required: true,
        placeholder: "john@gmail.com",
      },
      {
        fieldKey: "service",
        label: "Select Service",
        type: "SELECT",
        required: true,
        placeholder: "Please Select",
        options: [
          "Loan Offers",
          "Properties",
          "Sell My Property",
          "Case Studies",
          "General Inquiry",
        ],
      },
      {
        fieldKey: "messages",
        label: "Messages",
        type: "TEXTAREA",
        required: true,
        placeholder: "Type here...",
      },
    ],
  },
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
    slug: "fix-flip-application",
    formName: "Fix & Flip Application",
    destination: "BOTH",
    successMessage:
      "Thanks for submitting your fix-and-flip request. Our team will review the deal details and follow up with next steps shortly.",
    linkedLoanProgramSlug: "fix-flip",
    fields: [
      { fieldKey: "name", label: "Full Name", type: "TEXT", required: true, placeholder: "Jane Doe" },
      { fieldKey: "email", label: "Email", type: "EMAIL", required: true, placeholder: "name@example.com" },
      { fieldKey: "phone", label: "Phone", type: "PHONE", required: true, placeholder: "(555) 555-5555" },
      {
        fieldKey: "deal_type",
        label: "Deal Type",
        type: "RADIO",
        required: true,
        options: ["Purchase + Rehab", "Refinance + Rehab", "Bridge to Sale"],
      },
      { fieldKey: "purchase_price", label: "Purchase Price", type: "NUMBER", required: true, placeholder: "350000" },
      { fieldKey: "rehab_budget", label: "Rehab Budget", type: "NUMBER", required: true, placeholder: "85000" },
      {
        fieldKey: "experience_level",
        label: "Experience Level",
        type: "SELECT",
        required: true,
        options: ["First project", "2-5 completed projects", "6+ completed projects"],
      },
      { fieldKey: "deal_summary", label: "Deal Summary", type: "TEXTAREA", required: true, placeholder: "Tell us about the property, timeline, and exit strategy." },
      { fieldKey: "scope_of_work", label: "Scope of Work", type: "FILE", required: false },
    ],
  },
  {
    slug: "refinance-application",
    formName: "Refinance Application",
    destination: "BOTH",
    successMessage:
      "Thanks for submitting your refinance request. We will review the property profile and contact you with the next step.",
    linkedLoanProgramSlug: "refinance",
    fields: [
      { fieldKey: "name", label: "Full Name", type: "TEXT", required: true, placeholder: "Jane Doe" },
      { fieldKey: "email", label: "Email", type: "EMAIL", required: true, placeholder: "name@example.com" },
      { fieldKey: "phone", label: "Phone", type: "PHONE", required: true, placeholder: "(555) 555-5555" },
      { fieldKey: "property_address", label: "Property Address", type: "TEXT", required: true, placeholder: "123 Main Street" },
      {
        fieldKey: "occupancy_status",
        label: "Occupancy Status",
        type: "SELECT",
        required: true,
        options: ["Stabilized", "Partially occupied", "Vacant / transition"],
      },
      { fieldKey: "estimated_value", label: "Estimated Value", type: "NUMBER", required: true, placeholder: "1200000" },
      { fieldKey: "current_loan_balance", label: "Current Loan Balance", type: "NUMBER", required: false, placeholder: "850000" },
      { fieldKey: "cash_out_goal", label: "Cash-Out Goal", type: "NUMBER", required: false, placeholder: "150000" },
      { fieldKey: "deal_summary", label: "Deal Summary", type: "TEXTAREA", required: true, placeholder: "Share the asset story, current debt, and what you want to accomplish." },
    ],
  },
  {
    slug: "rental-dscr-application",
    formName: "Rental / DSCR Application",
    destination: "BOTH",
    successMessage:
      "Thanks for submitting your rental financing request. Our team will review the cash-flow profile and reach out shortly.",
    linkedLoanProgramSlug: "rental-dscr",
    fields: [
      { fieldKey: "name", label: "Full Name", type: "TEXT", required: true, placeholder: "Jane Doe" },
      { fieldKey: "email", label: "Email", type: "EMAIL", required: true, placeholder: "name@example.com" },
      { fieldKey: "phone", label: "Phone", type: "PHONE", required: true, placeholder: "(555) 555-5555" },
      {
        fieldKey: "property_type",
        label: "Property Type",
        type: "SELECT",
        required: true,
        options: ["Single-family rental", "2-4 unit", "Small multifamily", "Mixed-use"],
      },
      { fieldKey: "loan_amount", label: "Requested Loan Amount", type: "NUMBER", required: true, placeholder: "500000" },
      { fieldKey: "monthly_rent", label: "Current / Projected Monthly Rent", type: "NUMBER", required: true, placeholder: "4200" },
      {
        fieldKey: "purpose",
        label: "Loan Purpose",
        type: "RADIO",
        required: true,
        options: ["Purchase", "Refinance"],
      },
      { fieldKey: "rent_roll", label: "Rent Roll or Lease Summary", type: "FILE", required: false },
      { fieldKey: "deal_summary", label: "Deal Summary", type: "TEXTAREA", required: true, placeholder: "Tell us about the property, rents, and hold strategy." },
    ],
  },
  {
    slug: "ground-up-construction-application",
    formName: "Ground-Up Construction Application",
    destination: "BOTH",
    successMessage:
      "Thanks for submitting your construction request. Our team will review the project scope, budget, and timeline and follow up with next steps shortly.",
    linkedLoanProgramSlug: "ground-up-construction",
    fields: [
      { fieldKey: "name", label: "Full Name", type: "TEXT", required: true, placeholder: "Jane Doe" },
      { fieldKey: "email", label: "Email", type: "EMAIL", required: true, placeholder: "name@example.com" },
      { fieldKey: "phone", label: "Phone", type: "PHONE", required: true, placeholder: "(555) 555-5555" },
      { fieldKey: "project_address", label: "Project Address", type: "TEXT", required: true, placeholder: "123 Builder Lane" },
      {
        fieldKey: "project_type",
        label: "Project Type",
        type: "SELECT",
        required: true,
        options: ["Single-family spec build", "Custom home build", "2-4 unit construction", "Small multifamily construction"],
      },
      {
        fieldKey: "land_status",
        label: "Land Status",
        type: "RADIO",
        required: true,
        options: ["Own the lot", "Under contract", "Seeking both land and construction financing"],
      },
      { fieldKey: "requested_loan_amount", label: "Requested Loan Amount", type: "NUMBER", required: true, placeholder: "1250000" },
      { fieldKey: "total_project_budget", label: "Total Project Budget", type: "NUMBER", required: true, placeholder: "1650000" },
      { fieldKey: "as_completed_value", label: "Estimated As-Completed Value", type: "NUMBER", required: true, placeholder: "2100000" },
      {
        fieldKey: "builder_experience",
        label: "Builder Experience",
        type: "SELECT",
        required: true,
        options: ["First ground-up project", "2-5 completed projects", "6+ completed projects"],
      },
      { fieldKey: "estimated_timeline", label: "Estimated Build Timeline", type: "TEXT", required: true, placeholder: "10-12 months" },
      { fieldKey: "business_plan", label: "Project Summary", type: "TEXTAREA", required: true, placeholder: "Share the project scope, borrower entity, builder team, and exit plan." },
      { fieldKey: "plans_and_budget", label: "Plans, Budget, or Scope File", type: "FILE", required: false },
    ],
  },
] as const;
